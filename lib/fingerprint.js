// Stable identity for a captured device.
//
// Entries used to be keyed by IP alone, which merged every student behind one
// carrier NAT into a single row. Keying on the whole fingerprint separates
// them, as long as their devices differ in any reported field.
//
// Battery is excluded deliberately: it drifts as the phone drains or charges,
// and including it would spawn a new row on every report instead of updating
// the existing one.

const crypto = require('crypto');

const EXCLUDED = new Set(['type', 'battery']);

/**
 * @param {object} entry an `entry` payload
 * @returns {string} 16 hex chars, stable across key order
 */
function fingerprint(entry) {
	const canonical = Object.keys(entry)
		.filter((key) => !EXCLUDED.has(key))
		.sort()
		.map((key) => `${key}=${String(entry[key])}`)
		.join('|');
	return crypto.createHash('sha256').update(canonical).digest('hex').slice(0, 16);
}

module.exports = { fingerprint, EXCLUDED };
