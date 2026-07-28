// Runs the REAL built bundle inside jsdom with stubbed externals, then drives
// it through the socket protocol and asserts on the resulting DOM. This tests
// the shipped artifact, not a reimplementation.
//
//   node --test test/
//
// Requires `npm run build` first (or `npm test`, which builds).

import { test, describe, before } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { JSDOM } from 'jsdom';

const BUNDLE = new URL('../build/bundle.js', import.meta.url).pathname;

/**
 * Boots the bundle in a fresh jsdom, returns handles for driving it.
 * @param {{hash?: string}} opts
 */
function boot({ hash = '' } = {}) {
	const dom = new JSDOM(`<!doctype html><html><head></head><body></body></html>`, {
		url: `https://example.test/${hash}`,
		runScripts: 'outside-only'
	});
	const { window } = dom;

	// --- stub the externals index.html normally supplies ---
	const sent = [];
	let messageHandler = null;
	const fakeSocket = {
		connected: false,
		send: (raw) => sent.push(JSON.parse(raw)),
		on(event, cb) {
			if (event === 'message') messageHandler = cb;
			if (event === 'connect') this._connect = cb;
		},
		connect() {
			return this;
		}
	};
	window.io = () => fakeSocket;
	// collectEntry's network chain: never invoke the callbacks, so no entry is
	// sent. The entry payload is covered separately in collectEntry coverage.
	window.jQuery = { getJSON: () => {} };
	window.UAParser = function () {
		return { getResult: () => ({ os: {}, browser: {}, device: {} }) };
	};

	window.eval(fs.readFileSync(BUNDLE, 'utf8'));

	// SocketClient injects the socket.io CDN <script> and inits on its load
	// event. jsdom won't fetch it, so fire the event by hand.
	const tag = window.document.querySelector('head script');
	fakeSocket.connected = true;
	tag.dispatchEvent(new window.Event('load'));

	const flush = async () => {
		await new Promise((r) => setTimeout(r, 0));
	};
	const recv = async (msg) => {
		messageHandler(msg);
		await flush();
	};
	const text = () => window.document.body.textContent.replace(/\s+/g, ' ').trim();
	const $ = (sel) => window.document.querySelectorAll(sel);

	return { window, sent, recv, flush, text, $, fakeSocket };
}

describe('connection lifecycle', () => {
	test('shows Connecting... before the socket connects', () => {
		const dom = new JSDOM('<!doctype html><html><head></head><body></body></html>', {
			url: 'https://example.test/',
			runScripts: 'outside-only'
		});
		dom.window.io = () => ({ connected: false, on() {}, connect() { return this; }, send() {} });
		dom.window.jQuery = { getJSON: () => {} };
		dom.window.UAParser = function () { return { getResult: () => ({ os: {}, browser: {}, device: {} }) }; };
		dom.window.eval(fs.readFileSync(BUNDLE, 'utf8'));
		assert.match(dom.window.document.body.textContent, /Connecting/);
	});

	test('renders the board once connected', async () => {
		const { $, flush } = boot();
		await flush();
		assert.equal($('.board').length, 1, 'board container present');
		assert.equal($('button.tile').length, 9, 'nine tiles');
	});
});

describe('non-admin view', () => {
	test('waits for game start, then hides the overlay when active', async () => {
		const { recv, text } = boot();
		await recv({ type: 'status', gameActive: false });
		assert.match(text(), /Waiting for game start/);
		await recv({ type: 'status', gameActive: true });
		assert.doesNotMatch(text(), /Waiting for game start/);
	});

	test('clicking a tile sends a vote and bumps the count optimistically', async () => {
		const { recv, sent, $, flush } = boot();
		await recv({ type: 'status', gameActive: true });
		$('button.tile')[4].click();
		await flush();
		assert.deepEqual(sent.at(-1), { type: 'vote', tile: 4 });
		assert.match($('button.tile')[4].textContent, /1/, 'optimistic increment rendered');
	});

	test('shows the opponent overlay when it is not the collective turn', async () => {
		const { recv, text } = boot();
		await recv({ type: 'status', gameActive: true });
		await recv({ type: 'turn', collectiveTurn: false });
		assert.match(text(), /Waiting for opponent's turn/);
	});

	test('renders the countdown only while time > 0', async () => {
		const { recv, text } = boot();
		await recv({ type: 'status', gameActive: true });
		await recv({ type: 'time', time: 7 });
		assert.match(text(), /7/);
		await recv({ type: 'time', time: 0 });
		assert.doesNotMatch(text(), /\b7\b/);
	});

	test('board messages render x and o icons', async () => {
		const { recv, $ } = boot();
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
			const { recv, text } = boot();
			await recv({ type: 'ending', ending: code });
			assert.match(text(), new RegExp(expected.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));
		}
	});

	test('ignores entries broadcasts when not admin', async () => {
		const { recv, text } = boot();
		await recv({ type: 'ending', ending: 'x' });
		await recv({ type: 'entries', entries: { '1.1.1.1': { ip: '1.1.1.1', browser: 'Chrome' } } });
		assert.doesNotMatch(text(), /Show Info/, 'non-admin never sees the info controls');
	});
});

describe('admin view (#admin)', () => {
	test('offers Start Game and sends start', async () => {
		const { text, sent, $, flush } = boot({ hash: '#admin' });
		await flush();
		assert.match(text(), /Start Game/);
		Array.from($('button')).find((b) => b.textContent.includes('Start Game')).click();
		await flush();
		assert.deepEqual(sent.at(-1), { type: 'start' });
	});

	test('shows the three ending buttons while the game is active', async () => {
		const { recv, text } = boot({ hash: '#admin' });
		await recv({ type: 'status', gameActive: true });
		const t = text();
		assert.match(t, /X Wins/);
		assert.match(t, /O Wins/);
		assert.match(t, /Stalemate/);
	});

	test('ending buttons send the right codes', async () => {
		const { recv, sent, $, flush } = boot({ hash: '#admin' });
		await recv({ type: 'status', gameActive: true });
		for (const [label, code] of [['X Wins', 'x'], ['O Wins', 'o'], ['Stalemate', 's']]) {
			Array.from($('button')).find((b) => b.textContent.trim() === label).click();
			await flush();
			assert.deepEqual(sent.at(-1), { type: 'ending', ending: code });
		}
	});

	test('admin_vote only fires when it is not the collective turn', async () => {
		const { recv, sent, $, flush } = boot({ hash: '#admin' });
		await recv({ type: 'status', gameActive: true });

		// collectiveTurn defaults true -> a tile click must send nothing
		const before = sent.length;
		$('button.tile')[2].click();
		await flush();
		assert.equal(sent.length, before, 'no message during the collective turn');

		await recv({ type: 'turn', collectiveTurn: false });
		// deliberately a different tile: tile 2 is still inside its 1s cooldown
		// from the click above, so it is disabled and would swallow the click.
		$('button.tile')[3].click();
		await flush();
		assert.deepEqual(sent.at(-1), { type: 'admin_vote', tile: 3 });
	});

	test('a clicked tile is disabled for its 1s cooldown', async () => {
		const { recv, $, flush } = boot({ hash: '#admin' });
		await recv({ type: 'status', gameActive: true });
		await recv({ type: 'turn', collectiveTurn: false });
		const tile = $('button.tile')[5];
		assert.equal(tile.disabled, false, 'enabled before the click');
		tile.click();
		await flush();
		assert.equal(tile.disabled, true, 'disabled immediately after');
	});

	test('a tile claimed while cooling down stays disabled', async () => {
		// Regression guard for the bug the Svelte 5 rewrite fixed: previously
		// the expiring 1s timer re-enabled an already-played tile.
		const { recv, $, flush } = boot({ hash: '#admin' });
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
		const { recv, sent, $, flush, text } = boot({ hash: '#admin' });
		await recv({ type: 'ending', ending: 'x' });
		Array.from($('button')).find((b) => b.textContent.trim() === 'Restart').click();
		await flush();
		assert.deepEqual(sent.at(-1), { type: 'restart' });
		assert.match(text(), /Show Info/, 'panel collapsed back to Show Info');
	});
});

describe('info panel', () => {
	const entriesOf = (list) => Object.fromEntries(list.map((e) => [e.ip, e]));

	async function openPanel(rows) {
		const h = boot({ hash: '#admin' });
		await h.recv({ type: 'ending', ending: 'x' });
		await h.recv({ type: 'entries', entries: entriesOf(rows) });
		Array.from(h.$('button')).find((b) => b.textContent.trim() === 'Show Info').click();
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
		const batteries = Array.from($('.info-table tbody tr')).map(
			(tr) => tr.children[1].textContent.trim()
		);
		assert.deepEqual(batteries, ['12%', '80%', 'blocked', 'blocked']);
		const browsers = Array.from($('.info-table tbody tr')).map(
			(tr) => tr.children[4].textContent.trim()
		);
		assert.deepEqual(browsers.slice(2), ['Firefox 133', 'Safari 17'], 'unknowns ordered by browser');
	});

	test('renders all eight columns', async () => {
		const { $ } = await openPanel([{ ip: 'a', browser: 'Chrome', battery: '5%' }]);
		const headers = Array.from($('.info-table thead th')).map((th) => th.textContent.trim());
		assert.deepEqual(headers, [
			'Device', 'Battery', 'Dark Mode', 'OS', 'Browser', 'IP', 'ISP', 'Location'
		]);
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
		const devices = Array.from($('.info-table tbody tr')).map(
			(tr) => tr.children[0].textContent.trim()
		);
		assert.deepEqual(devices, ['Windows PC', 'Pixel 8']);
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
		Array.from(h.$('button')).find((b) => b.textContent.trim() === 'Clear Info').click();
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
