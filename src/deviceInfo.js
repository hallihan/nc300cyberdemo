// Pure helpers for the device-info panel. Kept out of the component so they
// can be unit tested without a DOM.

/** Leading percentage from a battery string, or null if there isn't one. */
export function batteryPct(value) {
	const match = /(\d+)\s*%/.exec(value || '');
	return match ? parseInt(match[1], 10) : null;
}

/**
 * UAParser reports vendor/model for most phones but nothing for desktops,
 * so fall back to inferring from the OS string.
 */
export function guessDevice(entry) {
	if (entry.device) return entry.device;
	const os = (entry.os || '').toLowerCase();
	if (os.indexOf('ios') === 0) return 'iPhone / iPad';
	if (os.indexOf('android') === 0) return 'Android device';
	if (os.indexOf('mac') === 0) return 'Mac';
	if (os.indexOf('windows') === 0) return 'Windows PC';
	if (os.indexOf('chrom') === 0) return 'Chromebook';
	if (os.indexOf('linux') === 0 || os.indexOf('ubuntu') === 0) return 'Linux PC';
	return 'Unknown';
}

/**
 * Battery ascending. Entries whose battery can't be parsed — "blocked" on
 * Safari and Firefox, or a missing field — sink to the bottom, ordered by
 * browser. Sorts in place and returns the array.
 */
export function sortEntries(rows) {
	return rows.sort((a, b) => {
		const pa = batteryPct(a.battery);
		const pb = batteryPct(b.battery);
		if (pa === null && pb === null) {
			return (a.browser || '').localeCompare(b.browser || '');
		}
		if (pa === null) return 1;
		if (pb === null) return -1;
		return pa - pb;
	});
}

export const INFO_COLUMNS = [
	{ label: 'Device', get: (e) => guessDevice(e) },
	{ label: 'Battery', get: (e) => e.battery || 'n/a', numeric: true },
	{ label: 'Dark Mode', get: (e) => e.darkMode || 'n/a' },
	{ label: 'OS', get: (e) => e.os || 'n/a' },
	{ label: 'Browser', get: (e) => e.browser || 'n/a' },
	{ label: 'IP', get: (e) => e.ip || 'n/a' },
	{ label: 'ISP', get: (e) => e.isp || 'n/a' },
	{ label: 'Location', get: (e) => e.location || 'n/a' }
];

/** "0 devices" / "1 device" / "N devices" */
export function deviceCountLabel(n) {
	return n === 1 ? '1 device' : `${n} devices`;
}
