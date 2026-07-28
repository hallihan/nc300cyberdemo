// Integration tests against the real server.js, driven by real socket.io
// clients. Covers the wiring unit tests can't: unique-voter counting, the skip
// floor, stale-player pruning, and the computer opponent taking its own turn.

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
async function startServer({ roundSeconds = 1, computerDelayMs = 60, minPlayers } = {}) {
	const port = 20000 + Math.floor(Math.random() * 20000);
	const proc = spawn('node', ['server.js'], {
		cwd: new URL('..', import.meta.url).pathname,
		env: {
			...process.env,
			PORT: String(port),
			ROUND_SECONDS: String(roundSeconds),
			COMPUTER_DELAY_MS: String(computerDelayMs),
			...(minPlayers ? { MIN_PLAYERS_FOR_SKIP: String(minPlayers) } : {})
		},
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

async function connect(ctx, { admin = false } = {}) {
	const sock = io(`http://127.0.0.1:${ctx.port}`, { transports: ['websocket'], forceNew: true });
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

/** Board updates only flush on the server's 1s dirty tick, so poll. */
async function waitFor(fn, label = 'condition', ms = 6000) {
	const started = Date.now();
	while (Date.now() - started < ms) {
		const value = fn();
		if (value) return value;
		await new Promise((r) => setTimeout(r, 25));
	}
	throw new Error(`timed out waiting for ${label}`);
}

const ended = (admin) => Boolean(admin.last('ending')?.ending);

/** Waits for the crowd's turn to close and the computer to answer. */
async function awaitComputerReply(admin) {
	await waitFor(
		() => admin.last('turn')?.collectiveTurn === false || ended(admin),
		'the crowd turn to resolve'
	);
	if (ended(admin)) return;
	await waitFor(
		() => admin.last('turn')?.collectiveTurn === true || ended(admin),
		'the computer to play'
	);
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

describe('unique voters and the skip floor', () => {
	test('repeated votes from one player count once', async () => {
		// long round: the count must not be reset by the timer mid-test
		const ctx = await startServer({ roundSeconds: 30 });
		const admin = await connect(ctx, { admin: true });
		const a = await connect(ctx);
		await connect(ctx);
		await connect(ctx);
		admin.send({ type: 'start', difficulty: 'hard' });
		await settle();

		a.send({ type: 'vote', tile: 0 });
		await settle();
		assert.equal(admin.last('stats').voted, 1);

		a.send({ type: 'vote', tile: 1 });
		a.send({ type: 'vote', tile: 2 });
		await settle();
		assert.equal(admin.last('stats').voted, 1, 'same player still counts once');
	});

	test('reaching 100% with enough players skips the countdown', async () => {
		const ctx = await startServer({ roundSeconds: 30 });
		const admin = await connect(ctx, { admin: true });
		const players = [await connect(ctx), await connect(ctx), await connect(ctx)];
		admin.send({ type: 'start', difficulty: 'hard' });
		await settle();

		const started = Date.now();
		players.forEach((p) => p.send({ type: 'vote', tile: 4 }));
		await waitFor(() => admin.last('turn')?.collectiveTurn === false, 'the skip');

		// the countdown was 30s, so this can only have come from the skip
		assert.ok(Date.now() - started < 3000, 'resolved on turnout, not the clock');
	});

	test('below the floor, full turnout does NOT skip', async () => {
		// two players both vote: 100% turnout, but under the floor of three
		const ctx = await startServer({ roundSeconds: 30 });
		const admin = await connect(ctx, { admin: true });
		const a = await connect(ctx);
		const b = await connect(ctx);
		admin.send({ type: 'start', difficulty: 'hard' });
		await settle();

		a.send({ type: 'vote', tile: 0 });
		b.send({ type: 'vote', tile: 0 });
		await settle();

		const stats = admin.last('stats');
		assert.equal(stats.voted, 2);
		assert.equal(stats.tracked, 2);
		assert.equal(
			admin.last('turn').collectiveTurn,
			true,
			'2/2 is 100% but below the floor, so the round stays open'
		);
	});

	test('the floor is configurable', async () => {
		const ctx = await startServer({ roundSeconds: 30, minPlayers: 2 });
		const admin = await connect(ctx, { admin: true });
		const a = await connect(ctx);
		const b = await connect(ctx);
		admin.send({ type: 'start', difficulty: 'hard' });
		await settle();

		a.send({ type: 'vote', tile: 0 });
		b.send({ type: 'vote', tile: 0 });
		await waitFor(() => admin.last('turn')?.collectiveTurn === false, 'the skip at a floor of 2');
	});

	test('spamming votes never ends the round early for everyone else', async () => {
		const ctx = await startServer({ roundSeconds: 30 });
		const admin = await connect(ctx, { admin: true });
		const spammer = await connect(ctx);
		await connect(ctx);
		const quiet = await connect(ctx);
		admin.send({ type: 'start', difficulty: 'hard' });
		await settle();

		for (let n = 0; n < 15; n++) spammer.send({ type: 'vote', tile: 0 });
		await settle();

		assert.equal(admin.last('stats').voted, 1, 'one voter however many clicks');
		assert.equal(admin.last('turn').collectiveTurn, true, 'round stays open');

		// `start` broadcasts an empty board immediately, so wait for the later
		// dirty-tick broadcast that actually carries the votes.
		await waitFor(
			() => (admin.last('board')?.board[0].votes ?? 0) > 1,
			'a board carrying the spammed votes'
		);

		quiet.send({ type: 'vote', tile: 4 });
		await settle();
		assert.equal(admin.last('turn').collectiveTurn, true, 'still one player short');
	});

	test('the voted count resets once the computer has replied', async () => {
		const ctx = await startServer();
		const admin = await connect(ctx, { admin: true });
		const players = [await connect(ctx), await connect(ctx), await connect(ctx)];
		admin.send({ type: 'start', difficulty: 'hard' });
		await settle();

		players.forEach((p) => p.send({ type: 'vote', tile: 0 }));
		await awaitComputerReply(admin);
		assert.equal(admin.last('stats').voted, 0, 'fresh round starts at zero');
	});
});

describe('the computer opponent', () => {
	test('announces that it is thinking, then plays an O', async () => {
		const ctx = await startServer({ computerDelayMs: 400 });
		const admin = await connect(ctx, { admin: true });
		const players = [await connect(ctx), await connect(ctx), await connect(ctx)];
		admin.send({ type: 'start', difficulty: 'hard' });
		await settle();

		players.forEach((p) => p.send({ type: 'vote', tile: 0 }));

		await waitFor(() => admin.last('thinking')?.thinking === true, 'the thinking flag');
		assert.equal(
			admin.last('board').board.filter((t) => t.state === 'o').length,
			0,
			'no move played while still thinking'
		);

		await waitFor(() => admin.last('thinking')?.thinking === false, 'thinking to finish');
		const board = await waitFor(
			() => admin.last('board')?.board.some((t) => t.state === 'o') && admin.last('board'),
			'the computer move'
		);
		assert.equal(board.board.filter((t) => t.state === 'o').length, 1, 'exactly one O');
	});

	test('players see the thinking flag too, not just the admin', async () => {
		const ctx = await startServer({ computerDelayMs: 400 });
		const admin = await connect(ctx, { admin: true });
		const players = [await connect(ctx), await connect(ctx), await connect(ctx)];
		admin.send({ type: 'start', difficulty: 'hard' });
		await settle();

		players.forEach((p) => p.send({ type: 'vote', tile: 0 }));
		await waitFor(() => players[0].last('thinking')?.thinking === true, 'player thinking flag');
	});

	test('hard never loses a full game', async () => {
		const ctx = await startServer();
		const admin = await connect(ctx, { admin: true });
		const players = [await connect(ctx), await connect(ctx), await connect(ctx)];
		admin.send({ type: 'start', difficulty: 'hard' });
		await settle();

		for (let round = 0; round < 6 && !ended(admin); round++) {
			const board = (await waitFor(() => admin.last('board'), 'a board')).board;
			const tile = board.findIndex((t) => t.state !== 'x' && t.state !== 'o');
			if (tile < 0) break;
			players.forEach((p) => p.send({ type: 'vote', tile }));
			await awaitComputerReply(admin);
		}

		const result = await waitFor(() => admin.last('ending')?.ending, 'the game to end');
		assert.notEqual(result, 'x', 'the crowd must never beat hard');
		assert.ok(['o', 's'].includes(result), `unexpected ending ${result}`);
	});

	test('the difficulty chosen is reported back in status', async () => {
		const ctx = await startServer();
		const admin = await connect(ctx, { admin: true });
		await connect(ctx);
		admin.send({ type: 'start', difficulty: 'easy' });
		await settle();
		assert.equal(admin.last('status').difficulty, 'easy');

		admin.send({ type: 'start', difficulty: 'medium' });
		await settle();
		assert.equal(admin.last('status').difficulty, 'medium');
	});

	test('an unknown difficulty falls back to hard', async () => {
		const ctx = await startServer();
		const admin = await connect(ctx, { admin: true });
		await connect(ctx);
		admin.send({ type: 'start', difficulty: 'trivial' });
		await settle();
		assert.equal(admin.last('status').difficulty, 'hard');
	});
});

describe('admin-only controls', () => {
	// Not a security boundary — `identify` is self-asserted, so a student can
	// still claim admin. This only keeps the intended game flow correct.
	test('a player cannot start a game or choose the difficulty', async () => {
		const ctx = await startServer();
		const admin = await connect(ctx, { admin: true });
		const player = await connect(ctx);
		await settle();

		player.send({ type: 'start', difficulty: 'easy' });
		await settle();
		assert.equal(admin.last('status').gameActive, false, 'game did not start');
	});

	test('a player cannot end or restart the game', async () => {
		const ctx = await startServer();
		const admin = await connect(ctx, { admin: true });
		const player = await connect(ctx);
		admin.send({ type: 'start', difficulty: 'hard' });
		await settle();

		player.send({ type: 'ending', ending: 'x' });
		await settle();
		assert.equal(admin.last('ending').ending, '', 'ending ignored from a player');

		player.send({ type: 'restart' });
		await settle();
		assert.equal(admin.last('status').gameActive, true, 'restart ignored from a player');
	});
});

describe('stale players', () => {
	test('a player who sits out a round stops counting in the next one', async () => {
		const ctx = await startServer();
		const admin = await connect(ctx, { admin: true });
		const keen = await connect(ctx);
		await connect(ctx); // never votes
		admin.send({ type: 'start', difficulty: 'hard' });
		await settle();
		assert.equal(admin.last('stats').tracked, 2, 'both players start engaged');

		keen.send({ type: 'vote', tile: 0 });
		await awaitComputerReply(admin);

		assert.equal(admin.last('stats').tracked, 1, 'idler no longer holds up the round');
	});

	test('voting again re-engages a dropped player', async () => {
		const ctx = await startServer();
		const admin = await connect(ctx, { admin: true });
		const keen = await connect(ctx);
		const returner = await connect(ctx);
		admin.send({ type: 'start', difficulty: 'hard' });
		await settle();

		keen.send({ type: 'vote', tile: 0 });
		await awaitComputerReply(admin);
		assert.equal(admin.last('stats').tracked, 1, 'returner was dropped');

		returner.send({ type: 'vote', tile: 2 });
		await settle();
		const stats = admin.last('stats');
		assert.equal(stats.tracked, 2, 'voting puts them back in the count');
		assert.equal(stats.voted, 1, 'and counts their vote');
	});

	test('a new game re-engages everyone', async () => {
		const ctx = await startServer();
		const admin = await connect(ctx, { admin: true });
		const keen = await connect(ctx);
		await connect(ctx); // idles
		admin.send({ type: 'start', difficulty: 'hard' });
		await settle();

		keen.send({ type: 'vote', tile: 0 });
		await awaitComputerReply(admin);
		assert.equal(admin.last('stats').tracked, 1, 'idler dropped mid-game');

		admin.send({ type: 'restart' });
		await settle();
		assert.equal(admin.last('stats').tracked, 2, 'restart gives everyone a clean slate');
	});

	test('a player joining mid-game is given a round of grace', async () => {
		const ctx = await startServer();
		const admin = await connect(ctx, { admin: true });
		const keen = await connect(ctx);
		admin.send({ type: 'start', difficulty: 'hard' });
		await settle();
		assert.equal(admin.last('stats').tracked, 1);

		await connect(ctx); // arrives without voting
		await settle();
		assert.equal(admin.last('stats').tracked, 2, 'newcomer counts immediately');

		keen.send({ type: 'vote', tile: 0 });
		await awaitComputerReply(admin);
		assert.equal(admin.last('stats').tracked, 1, 'dropped after idling one full round');
	});
});

describe('result detection', () => {
	// The UI controls are gone, but the protocol message remains — a deliberate
	// escape hatch, and one more thing for a curious student to find.
	test('a forced ending is still accepted over the socket', async () => {
		const ctx = await startServer();
		const admin = await connect(ctx, { admin: true });
		await connect(ctx);
		admin.send({ type: 'start', difficulty: 'hard' });
		await settle();

		admin.send({ type: 'ending', ending: 's' });
		await settle();
		assert.equal(admin.last('ending').ending, 's');
	});

	test('restart clears the board and the ending', async () => {
		const ctx = await startServer();
		const admin = await connect(ctx, { admin: true });
		await connect(ctx);
		admin.send({ type: 'start', difficulty: 'hard' });
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

	test('a restart cancels a pending computer move', async () => {
		const ctx = await startServer({ computerDelayMs: 1500 });
		const admin = await connect(ctx, { admin: true });
		const players = [await connect(ctx), await connect(ctx), await connect(ctx)];
		admin.send({ type: 'start', difficulty: 'hard' });
		await settle();

		players.forEach((p) => p.send({ type: 'vote', tile: 0 }));
		await waitFor(() => admin.last('thinking')?.thinking === true, 'thinking to begin');

		admin.send({ type: 'restart' });
		await settle();
		assert.equal(admin.last('thinking').thinking, false, 'thinking cleared');

		// wait past the original delay: the stale move must not land
		await new Promise((r) => setTimeout(r, 1800));
		assert.ok(
			admin.last('board').board.every((t) => t.state === ''),
			'no O appeared on the restarted board'
		);
	});
});
