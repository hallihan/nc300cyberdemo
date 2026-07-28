// Integration tests against the real server.js, driven by real socket.io
// clients. Covers the wiring that unit tests can't: that the vote path counts
// unique voters, that 100% skips the countdown, and that the server declares
// the result itself.

import { test, describe, afterEach } from 'node:test';
import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { io } from 'socket.io-client';

const running = [];
afterEach(() => {
	while (running.length) {
		const { proc, sockets } = running.pop();
		sockets.forEach((s) => s.close());
		proc.kill('SIGKILL');
	}
});

/** Boots server.js on a random port and waits for it to listen. */
async function startServer() {
	const port = 20000 + Math.floor(Math.random() * 20000);
	const proc = spawn('node', ['server.js'], {
		cwd: new URL('..', import.meta.url).pathname,
		env: { ...process.env, PORT: String(port) },
		stdio: ['ignore', 'pipe', 'pipe']
	});
	await new Promise((resolve, reject) => {
		const timer = setTimeout(() => reject(new Error('server did not start')), 8000);
		proc.stdout.on('data', (d) => {
			if (d.toString().includes('Listening on port')) {
				clearTimeout(timer);
				resolve();
			}
		});
		proc.on('error', reject);
	});
	const entry = { proc, sockets: [], port };
	running.push(entry);
	return entry;
}

/** Connects a client, identifies it, and records every message it receives. */
async function connect(ctx, { admin = false } = {}) {
	const sock = io(`http://127.0.0.1:${ctx.port}`, {
		transports: ['websocket'],
		forceNew: true
	});
	ctx.sockets.push(sock);
	const received = [];
	sock.on('message', (m) => received.push(m));
	await new Promise((resolve, reject) => {
		sock.on('connect', resolve);
		sock.on('connect_error', reject);
	});
	sock.send(JSON.stringify({ type: 'identify', admin }));
	await settle();
	return {
		sock,
		received,
		send: (m) => sock.send(JSON.stringify(m)),
		last: (type) => [...received].reverse().find((m) => m && m.type === type)
	};
}

const settle = () => new Promise((r) => setTimeout(r, 150));

/**
 * Polls until `fn` returns something truthy. Board updates are only flushed on
 * the server's 1s dirty tick, so they can't be awaited with a fixed settle.
 */
async function waitFor(fn, label = 'condition', ms = 4000) {
	const started = Date.now();
	while (Date.now() - started < ms) {
		const value = fn();
		if (value) return value;
		await new Promise((r) => setTimeout(r, 50));
	}
	throw new Error(`timed out waiting for ${label}`);
}

describe('tracked users', () => {
	test('the admin is excluded from the tracked count', async () => {
		const ctx = await startServer();
		const admin = await connect(ctx, { admin: true });
		await settle();
		assert.equal(admin.last('stats').tracked, 0, 'admin alone means zero tracked users');

		await connect(ctx);
		await settle();
		assert.equal(admin.last('stats').tracked, 1);

		await connect(ctx);
		await settle();
		assert.equal(admin.last('stats').tracked, 2);
	});

	test('the count drops when a player disconnects', async () => {
		const ctx = await startServer();
		const admin = await connect(ctx, { admin: true });
		const player = await connect(ctx);
		await settle();
		assert.equal(admin.last('stats').tracked, 1);

		player.sock.close();
		await settle();
		assert.equal(admin.last('stats').tracked, 0);
	});

	test('reports how many devices have been captured', async () => {
		const ctx = await startServer();
		const admin = await connect(ctx, { admin: true });
		const player = await connect(ctx);
		player.send({ type: 'entry', ip: '203.0.113.1', browser: 'Chrome', battery: '50%' });
		await settle();
		assert.equal(admin.last('stats').entries, 1);
	});
});

describe('unique voters per round', () => {
	test('repeated votes from one player count once', async () => {
		const ctx = await startServer();
		const admin = await connect(ctx, { admin: true });
		const a = await connect(ctx);
		await connect(ctx); // a second player, so one voter is not yet 100%
		admin.send({ type: 'start' });
		await settle();

		a.send({ type: 'vote', tile: 0 });
		await settle();
		assert.equal(admin.last('stats').voted, 1);

		a.send({ type: 'vote', tile: 1 });
		a.send({ type: 'vote', tile: 2 });
		await settle();
		assert.equal(admin.last('stats').voted, 1, 'same player still counts once');
	});

	test('reaching 100% resolves the round without waiting for the timer', async () => {
		const ctx = await startServer();
		const admin = await connect(ctx, { admin: true });
		const a = await connect(ctx);
		const b = await connect(ctx);
		admin.send({ type: 'start' });
		await settle();

		a.send({ type: 'vote', tile: 4 });
		await settle();
		assert.equal(admin.last('turn').collectiveTurn, true, 'still the crowd turn at 50%');

		const started = Date.now();
		b.send({ type: 'vote', tile: 4 });
		await settle();

		// The countdown is 10s; resolving here proves the skip fired.
		assert.ok(Date.now() - started < 2000, 'resolved immediately, not on the timer');
		assert.equal(admin.last('turn').collectiveTurn, false, 'handed over to the admin');
		assert.equal(admin.last('board').board[4].state, 'x', 'most-voted tile claimed');
	});

	test('spamming votes never ends the round early for everyone else', async () => {
		const ctx = await startServer();
		const admin = await connect(ctx, { admin: true });
		const spammer = await connect(ctx);
		const quiet = await connect(ctx); // has not voted yet
		admin.send({ type: 'start' });
		await settle();

		for (let n = 0; n < 15; n++) spammer.send({ type: 'vote', tile: 0 });
		await settle();

		assert.equal(admin.last('stats').voted, 1, 'one voter however many clicks');
		assert.equal(
			admin.last('turn').collectiveTurn,
			true,
			'round must stay open while a player has not voted'
		);
		const board = await waitFor(() => admin.last('board'), 'a board broadcast');
		assert.ok(
			board.board[0].votes > 1,
			'the tile total did run up — only the early close is protected'
		);

		// the quiet player finally votes -> now everyone has had a turn
		quiet.send({ type: 'vote', tile: 4 });
		await settle();
		assert.equal(admin.last('turn').collectiveTurn, false, 'now it resolves');
	});

	test('a spammer cannot resolve a round alone by out-voting the board', async () => {
		const ctx = await startServer();
		const admin = await connect(ctx, { admin: true });
		const spammer = await connect(ctx);
		await connect(ctx);
		await connect(ctx); // three tracked players, only one votes
		admin.send({ type: 'start' });
		await settle();

		for (let n = 0; n < 30; n++) spammer.send({ type: 'vote', tile: n % 9 });
		await settle();

		const stats = admin.last('stats');
		assert.equal(stats.voted, 1);
		assert.equal(stats.tracked, 3);
		assert.equal(admin.last('turn').collectiveTurn, true, 'still open at 1/3');
	});

	test('the voted count resets for the next round', async () => {
		const ctx = await startServer();
		const admin = await connect(ctx, { admin: true });
		const a = await connect(ctx);
		admin.send({ type: 'start' });
		await settle();

		a.send({ type: 'vote', tile: 0 }); // 1/1 -> resolves
		await settle();
		assert.equal(admin.last('stats').voted, 0, 'reset after the round resolved');

		admin.send({ type: 'admin_vote', tile: 8 });
		await settle();
		assert.equal(admin.last('stats').voted, 0, 'still zero at the start of the new round');
	});
});

describe('server-side result detection', () => {
	test('declares X the winner on three in a row', async () => {
		const ctx = await startServer();
		const admin = await connect(ctx, { admin: true });
		const player = await connect(ctx);
		admin.send({ type: 'start' });
		await settle();

		// One player => every vote is 100%, so each round resolves at once.
		// Crowd takes 0,1,2 (top row); admin answers in the bottom row.
		player.send({ type: 'vote', tile: 0 });
		await settle();
		admin.send({ type: 'admin_vote', tile: 6 });
		await settle();

		player.send({ type: 'vote', tile: 1 });
		await settle();
		admin.send({ type: 'admin_vote', tile: 7 });
		await settle();

		player.send({ type: 'vote', tile: 2 });
		await settle();

		assert.equal(admin.last('ending').ending, 'x', 'server declared X without being told');
	});

	test('declares O the winner when the admin completes a line', async () => {
		const ctx = await startServer();
		const admin = await connect(ctx, { admin: true });
		const player = await connect(ctx);
		admin.send({ type: 'start' });
		await settle();

		// Crowd takes 0,1 then 3; admin takes the 6,7,8 row.
		player.send({ type: 'vote', tile: 0 });
		await settle();
		admin.send({ type: 'admin_vote', tile: 6 });
		await settle();

		player.send({ type: 'vote', tile: 1 });
		await settle();
		admin.send({ type: 'admin_vote', tile: 7 });
		await settle();

		player.send({ type: 'vote', tile: 3 });
		await settle();
		admin.send({ type: 'admin_vote', tile: 8 });
		await settle();

		assert.equal(admin.last('ending').ending, 'o');
	});

	test('the manual override buttons still work', async () => {
		const ctx = await startServer();
		const admin = await connect(ctx, { admin: true });
		await connect(ctx);
		admin.send({ type: 'start' });
		await settle();

		admin.send({ type: 'ending', ending: 's' });
		await settle();
		assert.equal(admin.last('ending').ending, 's');
	});

	test('restart clears the board and the ending', async () => {
		const ctx = await startServer();
		const admin = await connect(ctx, { admin: true });
		await connect(ctx);
		admin.send({ type: 'start' });
		await settle();
		admin.send({ type: 'ending', ending: 'x' });
		await settle();

		admin.send({ type: 'restart' });
		await settle();
		assert.equal(admin.last('ending').ending, '');
		assert.equal(admin.last('status').gameActive, false);
		assert.ok(
			admin.last('board').board.every((t) => t.state === '' && t.votes === 0),
			'board fully cleared'
		);
	});
});
