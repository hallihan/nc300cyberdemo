// Runs the REAL built bundle inside jsdom against a REAL Socket.IO server.
// socket.io-client is bundled now, so there is no global `io` to stub — the
// client opens an actual websocket to a throwaway server on a random port,
// which also exercises same-origin URL resolution.
//
//   npm test
//
// External HTTP (ipify/ipapi/ipgeolocation) is stubbed to fail, so
// collectEntry exercises its degraded path rather than hitting the network.

import { test, describe, afterEach } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { createServer } from 'node:http';
import { Server } from 'socket.io';
import { JSDOM } from 'jsdom';

const BUNDLE = new URL('../build/bundle.js', import.meta.url).pathname;
const BUNDLE_SRC = fs.readFileSync(BUNDLE, 'utf8');

const open = [];
afterEach(() => {
	while (open.length) {
		const { httpServer, window } = open.pop();
		try { window.close(); } catch {}
		try { httpServer.close(); } catch {}
	}
});

/**
 * Boots a real socket server + the real bundle in jsdom, and waits for the
 * client to connect.
 * @param {{hash?: string, connect?: boolean}} opts
 */
async function boot({ hash = '', connect = true } = {}) {
	const httpServer = createServer();
	const ioServer = new Server(httpServer, { cors: { origin: '*' } });
	await new Promise((r) => httpServer.listen(0, '127.0.0.1', r));
	const { port } = httpServer.address();

	/** everything the client sent, split by kind */
	const sent = [];
	const entries = [];

	// Attach the message listener inside the connection handler, before
	// resolving: the client sends `identify` the instant it connects, and a
	// listener attached after the await could miss it.
	const connected = new Promise((resolve) =>
		ioServer.on('connection', (sock) => {
			sock.on('message', (raw) => {
				const msg = JSON.parse(raw);
				(msg.type === 'entry' ? entries : sent).push(msg);
			});
			resolve(sock);
		})
	);

	const dom = new JSDOM('<!doctype html><html><head></head><body></body></html>', {
		url: `http://127.0.0.1:${port}/${hash}`,
		runScripts: 'outside-only'
	});
	const { window } = dom;
	open.push({ httpServer, window });

	// collectEntry's lookups: fail fast so the degraded path runs offline.
	window.fetch = () => Promise.reject(new Error('offline in tests'));

	window.eval(BUNDLE_SRC);

	if (!connect) return { window, port, httpServer };

	const serverSocket = await connected;

	const flush = () => new Promise((r) => setTimeout(r, 20));
	const recv = async (msg) => {
		serverSocket.send(msg);
		await flush();
	};
	const text = () => window.document.body.textContent.replace(/\s+/g, ' ').trim();
	const $ = (sel) => window.document.querySelectorAll(sel);
	const button = (label) =>
		Array.from($('button')).find((b) => b.textContent.trim() === label);

	await flush();
	return { window, serverSocket, sent, entries, recv, flush, text, $, button, port };
}

describe('connection lifecycle', () => {
	test('shows Connecting... until the socket connects', async () => {
		// no server listening on this port -> client can never connect
		const dom = new JSDOM('<!doctype html><html><head></head><body></body></html>', {
			url: 'http://127.0.0.1:1/',
			runScripts: 'outside-only'
		});
		dom.window.fetch = () => Promise.reject(new Error('offline'));
		dom.window.eval(BUNDLE_SRC);
		open.push({ httpServer: { close() {} }, window: dom.window });
		assert.match(dom.window.document.body.textContent, /Connecting/);
	});

	test('renders the board once connected', async () => {
		const { $ } = await boot();
		assert.equal($('.board').length, 1, 'board container present');
		assert.equal($('button.tile').length, 9, 'nine tiles');
	});

	test('sends an entry even when every lookup fails', async () => {
		const { entries } = await boot();
		assert.equal(entries.length, 1, 'exactly one entry');
		const e = entries[0];
		assert.equal(e.ip, 'unknown');
		assert.equal(e.isp, 'unknown');
		assert.equal(e.location, 'unknown');
		assert.equal(e.battery, 'blocked', 'jsdom has no Battery API');
		assert.ok(e.darkMode === 'Dark' || e.darkMode === 'Light');
	});
});

describe('identify + round stats', () => {
	test('a normal client identifies itself as non-admin', async () => {
		const { sent } = await boot();
		assert.deepEqual(sent[0], { type: 'identify', admin: false });
	});

	test('an #admin client identifies itself as admin', async () => {
		const { sent } = await boot({ hash: '#admin' });
		assert.deepEqual(sent[0], { type: 'identify', admin: true });
	});

	test('admin sees tracked users, round votes and device count', async () => {
		const { recv, text } = await boot({ hash: '#admin' });
		await recv({ type: 'stats', tracked: 12, voted: 7, entries: 9 });
		const t = text();
		assert.match(t, /Tracked users 12/);
		assert.match(t, /Voted this round 7\/12/);
		assert.match(t, /\(58%\)/, '7/12 rounds to 58%');
		assert.match(t, /Current Players 9/);
	});

	test('the percentage is highlighted at 100%', async () => {
		const { recv, $ } = await boot({ hash: '#admin' });
		await recv({ type: 'stats', tracked: 5, voted: 4, entries: 0 });
		assert.equal($('.pct.full').length, 0, 'not highlighted below 100%');
		await recv({ type: 'stats', tracked: 5, voted: 5, entries: 0 });
		assert.equal($('.pct.full').length, 1, 'highlighted at 100%');
	});

	test('avoids dividing by zero when nobody is tracked', async () => {
		const { recv, text, $ } = await boot({ hash: '#admin' });
		await recv({ type: 'stats', tracked: 0, voted: 0, entries: 0 });
		assert.match(text(), /\(0%\)/);
		assert.equal($('.pct.full').length, 0, '0/0 must not read as complete');
	});

	test('non-admin never sees the stats bar', async () => {
		const { recv, text, $ } = await boot();
		await recv({ type: 'stats', tracked: 12, voted: 7, entries: 9 });
		assert.equal($('.stats').length, 0);
		assert.doesNotMatch(text(), /Tracked users/);
	});
});

describe('non-admin view', () => {
	test('waits for game start, then hides the overlay when active', async () => {
		const { recv, text } = await boot();
		await recv({ type: 'status', gameActive: false });
		assert.match(text(), /Waiting for game start/);
		await recv({ type: 'status', gameActive: true });
		assert.doesNotMatch(text(), /Waiting for game start/);
	});

	test('clicking a tile sends a vote and bumps the count optimistically', async () => {
		const { recv, sent, $, flush } = await boot();
		await recv({ type: 'status', gameActive: true });
		$('button.tile')[4].click();
		await flush();
		assert.deepEqual(sent.at(-1), { type: 'vote', tile: 4 });
		assert.match($('button.tile')[4].textContent, /1/, 'optimistic increment rendered');
	});

	test('shows the opponent overlay when it is not the collective turn', async () => {
		const { recv, text } = await boot();
		await recv({ type: 'status', gameActive: true });
		await recv({ type: 'turn', collectiveTurn: false });
		assert.match(text(), /Waiting for opponent's turn/);
	});

	test('renders the countdown only while time > 0', async () => {
		const { recv, text } = await boot();
		await recv({ type: 'status', gameActive: true });
		await recv({ type: 'time', time: 7 });
		assert.match(text(), /7/);
		await recv({ type: 'time', time: 0 });
		assert.doesNotMatch(text(), /\b7\b/);
	});

	test('board messages render x and o icons', async () => {
		const { recv, $ } = await boot();
		await recv({ type: 'status', gameActive: true });
		const board = Array.from({ length: 9 }, () => ({ votes: 0, state: '' }));
		board[0].state = 'x';
		board[1].state = 'o';
		await recv({ type: 'board', board });
		assert.equal($('.icon.x').length, 1, 'one X');
		assert.equal($('.icon.o').length, 1, 'one O');
	});

	test('result overlay maps ending codes to text', async () => {
		for (const [code, expected] of [['x', "X's win!"], ['o', "O's win!"], ['s', 'Stalemate!']]) {
			const { recv, text } = await boot();
			await recv({ type: 'ending', ending: code });
			assert.ok(text().includes(expected), `${code} -> ${expected}`);
		}
	});

	test('ignores entries broadcasts when not admin', async () => {
		const { recv, text } = await boot();
		await recv({ type: 'ending', ending: 'x' });
		await recv({ type: 'entries', entries: { '1.1.1.1': { ip: '1.1.1.1', browser: 'Chrome' } } });
		assert.doesNotMatch(text(), /Show Info/, 'non-admin never sees the info controls');
	});
});

describe('admin view (#admin)', () => {
	test('offers Start Game and sends start', async () => {
		const { text, sent, button, flush } = await boot({ hash: '#admin' });
		assert.match(text(), /Start Game/);
		button('Start Game').click();
		await flush();
		assert.deepEqual(sent.at(-1), { type: 'start' });
	});

	test('shows the three ending buttons while the game is active', async () => {
		const { recv, text } = await boot({ hash: '#admin' });
		await recv({ type: 'status', gameActive: true });
		const t = text();
		assert.match(t, /X Wins/);
		assert.match(t, /O Wins/);
		assert.match(t, /Stalemate/);
	});

	test('ending buttons send the right codes', async () => {
		const { recv, sent, button, flush } = await boot({ hash: '#admin' });
		await recv({ type: 'status', gameActive: true });
		for (const [label, code] of [['X Wins', 'x'], ['O Wins', 'o'], ['Stalemate', 's']]) {
			button(label).click();
			await flush();
			assert.deepEqual(sent.at(-1), { type: 'ending', ending: code });
		}
	});

	test('admin_vote only fires when it is not the collective turn', async () => {
		const { recv, sent, $, flush } = await boot({ hash: '#admin' });
		await recv({ type: 'status', gameActive: true });

		const before = sent.length;
		$('button.tile')[2].click();
		await flush();
		assert.equal(sent.length, before, 'no message during the collective turn');

		await recv({ type: 'turn', collectiveTurn: false });
		// a different tile: tile 2 is still inside its 1s cooldown from above
		$('button.tile')[3].click();
		await flush();
		assert.deepEqual(sent.at(-1), { type: 'admin_vote', tile: 3 });
	});

	test('a clicked tile is disabled for its 1s cooldown', async () => {
		const { recv, $, flush } = await boot({ hash: '#admin' });
		await recv({ type: 'status', gameActive: true });
		await recv({ type: 'turn', collectiveTurn: false });
		const tile = $('button.tile')[5];
		assert.equal(tile.disabled, false, 'enabled before the click');
		tile.click();
		await flush();
		assert.equal(tile.disabled, true, 'disabled immediately after');
	});

	test('a tile claimed while cooling down stays disabled', async () => {
		// Regression guard for the bug the Svelte 5 rewrite fixed: the expiring
		// 1s timer used to re-enable an already-played tile.
		const { recv, $, flush } = await boot({ hash: '#admin' });
		await recv({ type: 'status', gameActive: true });
		await recv({ type: 'turn', collectiveTurn: false });
		$('button.tile')[6].click();
		await flush();

		const board = Array.from({ length: 9 }, () => ({ votes: 0, state: '' }));
		board[6].state = 'o';
		await recv({ type: 'board', board });
		await new Promise((r) => setTimeout(r, 1100)); // outlast the cooldown
		assert.equal($('button.tile')[6].disabled, true, 'played tile must remain disabled');
	});

	test('Restart sends restart and clears the panel', async () => {
		const { recv, sent, button, flush, text } = await boot({ hash: '#admin' });
		await recv({ type: 'ending', ending: 'x' });
		button('Restart').click();
		await flush();
		assert.deepEqual(sent.at(-1), { type: 'restart' });
		assert.match(text(), /Show Info/, 'panel collapsed back to Show Info');
	});
});

describe('info panel', () => {
	const entriesOf = (list) => Object.fromEntries(list.map((e) => [e.ip, e]));

	async function openPanel(rows) {
		const h = await boot({ hash: '#admin' });
		await h.recv({ type: 'ending', ending: 'x' });
		await h.recv({ type: 'entries', entries: entriesOf(rows) });
		h.button('Show Info').click();
		await h.flush();
		return h;
	}

	test('sorts battery ascending with blocked/missing last by browser', async () => {
		const { $ } = await openPanel([
			{ ip: 'a', browser: 'Safari 17', battery: 'blocked', os: 'iOS 17' },
			{ ip: 'b', browser: 'Chrome 131', battery: '80%', os: 'Android 14' },
			{ ip: 'c', browser: 'Firefox 133', battery: 'blocked', os: 'Windows 10' },
			{ ip: 'd', browser: 'Chrome 130', battery: '12%', os: 'Android 13' }
		]);
		const rows = Array.from($('.info-table tbody tr'));
		assert.deepEqual(
			rows.map((tr) => tr.children[1].textContent.trim()),
			['12%', '80%', 'blocked', 'blocked']
		);
		assert.deepEqual(
			rows.slice(2).map((tr) => tr.children[4].textContent.trim()),
			['Firefox 133', 'Safari 17'],
			'unknowns ordered by browser'
		);
	});

	test('renders all eight columns', async () => {
		const { $ } = await openPanel([{ ip: 'a', browser: 'Chrome', battery: '5%' }]);
		assert.deepEqual(
			Array.from($('.info-table thead th')).map((th) => th.textContent.trim()),
			['Device', 'Battery', 'Dark Mode', 'OS', 'Browser', 'IP', 'ISP', 'Location']
		);
	});

	test('does not cap the list (the old table stopped at 8)', async () => {
		const rows = Array.from({ length: 25 }, (_, n) => ({
			ip: `ip${n}`, browser: 'Chrome', battery: `${n}%`
		}));
		const { $ } = await openPanel(rows);
		assert.equal($('.info-table tbody tr').length, 25);
	});

	test('device column falls back to the OS when no model is reported', async () => {
		const { $ } = await openPanel([
			{ ip: 'a', browser: 'Chrome', battery: '5%', os: 'Windows 10' },
			{ ip: 'b', browser: 'Chrome', battery: '6%', os: 'Android 14', device: 'Pixel 8' }
		]);
		assert.deepEqual(
			Array.from($('.info-table tbody tr')).map((tr) => tr.children[0].textContent.trim()),
			['Windows PC', 'Pixel 8']
		);
	});

	test('device count label pluralises', async () => {
		const one = await openPanel([{ ip: 'a', browser: 'Chrome', battery: '5%' }]);
		assert.match(one.text(), /\b1 device\b/);
		const many = await openPanel([
			{ ip: 'a', browser: 'Chrome', battery: '5%' },
			{ ip: 'b', browser: 'Chrome', battery: '6%' }
		]);
		assert.match(many.text(), /\b2 devices\b/);
	});

	test('Clear Info sends reset_entries and collapses the panel', async () => {
		const h = await openPanel([{ ip: 'a', browser: 'Chrome', battery: '5%' }]);
		h.button('Clear Info').click();
		await h.flush();
		assert.deepEqual(h.sent.at(-1), { type: 'reset_entries' });
		assert.match(h.text(), /Show Info/);
	});

	test('escapes client-supplied values rather than rendering markup', async () => {
		const { $, window } = await openPanel([
			{ ip: '<img src=x onerror=alert(1)>', browser: 'Chrome', battery: '5%' }
		]);
		assert.equal($('.info-table img').length, 0, 'no element created from the payload');
		assert.match(window.document.querySelector('.info-table tbody tr').textContent, /<img/);
	});
});
