import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import fp from '../lib/fingerprint.js';

const { fingerprint } = fp;

const entry = (over = {}) => ({
	type: 'entry',
	ip: '203.0.113.7',
	os: 'iOS 17.5',
	browser: 'Mobile Safari 17.5',
	isp: 'T-Mobile USA',
	location: 'Portland, US',
	device: 'Apple iPhone',
	darkMode: 'Dark',
	battery: '61%',
	...over
});

describe('fingerprint', () => {
	test('is stable for the same device', () => {
		assert.equal(fingerprint(entry()), fingerprint(entry()));
	});

	test('ignores battery, so a draining phone keeps one row', () => {
		assert.equal(fingerprint(entry({ battery: '61%' })), fingerprint(entry({ battery: '3%' })));
		assert.equal(
			fingerprint(entry({ battery: 'blocked' })),
			fingerprint(entry({ battery: '100% (charging)' }))
		);
	});

	test('is independent of key order', () => {
		const a = { type: 'entry', ip: '1.1.1.1', os: 'iOS', browser: 'Safari' };
		const b = { browser: 'Safari', os: 'iOS', ip: '1.1.1.1', type: 'entry' };
		assert.equal(fingerprint(a), fingerprint(b));
	});

	test('separates two devices sharing one IP', () => {
		// the whole point: a classroom behind one carrier NAT
		const iphone = entry({ device: 'Apple iPhone', os: 'iOS 17.5' });
		const pixel = entry({ device: 'Google Pixel 8', os: 'Android 15' });
		assert.equal(iphone.ip, pixel.ip, 'same address');
		assert.notEqual(fingerprint(iphone), fingerprint(pixel), 'but different rows');
	});

	test('any distinguishing field is enough to separate them', () => {
		const base = fingerprint(entry());
		for (const field of ['os', 'browser', 'isp', 'location', 'device', 'darkMode', 'ip']) {
			assert.notEqual(
				fingerprint(entry({ [field]: 'something else' })),
				base,
				`${field} should affect the fingerprint`
			);
		}
	});

	test('identical devices on one IP still collide — a real limitation', () => {
		// Two students with the same phone model, OS, browser, carrier and theme
		// are genuinely indistinguishable from what we collect. Pinned so the
		// behaviour is a known trade-off rather than a surprise.
		assert.equal(fingerprint(entry()), fingerprint(entry()));
	});
});
