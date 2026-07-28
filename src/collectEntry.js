import { UAParser } from 'ua-parser-js';

// Gathers everything the page can learn about its visitor. Uses fetch and a
// bundled UAParser — no jQuery, no CDN.

const IPIFY = 'https://api.ipify.org?format=json';
const IPAPI = (ip) => `https://ipapi.co/${ip}/json`;
const IPGEO = 'https://api.ipgeolocation.io/ipgeo?apiKey=ceb5539b1a8e4670868cf6a0e0ff4509';

/** fetch().json() that resolves to {} instead of throwing. */
async function tryJson(url) {
	try {
		const res = await fetch(url);
		if (!res.ok) return {};
		return await res.json();
	} catch {
		return {};
	}
}

/** Battery percentage, or "blocked" where the browser refuses. */
async function readBattery() {
	if (!navigator.getBattery) return 'blocked';
	try {
		const b = await navigator.getBattery();
		return `${Math.round(100 * b.level)}%${b.charging ? ' (charging)' : ''}`;
	} catch {
		return 'blocked';
	}
}

/**
 * Reports this device once, then hands back a function to report it again.
 * Everything except battery is gathered once and reused — the network lookups
 * are slow and their answers don't change — so repeat reports only re-read the
 * battery level.
 *
 * The server keys entries on a hash of every field except battery, so repeat
 * reports update the same row rather than creating new ones.
 *
 * @param {(payload: object) => void} send
 * @returns {Promise<() => Promise<void>>} call to report again
 */
export async function startEntryReporting(send) {
	const ua = new UAParser().getResult();

	// Each lookup degrades independently. The old nested chain meant one failed
	// request sent no entry at all — with a classroom hitting these free APIs
	// at once, a rate-limited response would have dropped students entirely.
	const { ip } = await tryJson(IPIFY);
	const [geo, whoda] = await Promise.all([
		ip ? tryJson(IPAPI(ip)) : Promise.resolve({}),
		tryJson(IPGEO)
	]);

	const base = {
		type: 'entry',
		ip: ip || 'unknown',
		os: `${ua.os.name} ${ua.os.version}`,
		browser: `${ua.browser.name} ${ua.browser.version}`,
		isp: whoda.isp || 'unknown',
		location: geo.city && geo.country ? `${geo.city}, ${geo.country}` : 'unknown',
		device: [ua.device.vendor, ua.device.model].filter(Boolean).join(' '),
		darkMode:
			window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
				? 'Dark'
				: 'Light'
	};

	const report = async () => send({ ...base, battery: await readBattery() });
	await report();
	return report;
}
