// Gathers everything the page can learn about its visitor and hands it to
// `send`. Depends on jQuery and UAParser, both loaded from CDNs in index.html.

/**
 * @param {(payload: object) => void} send called once with the entry payload
 */
export function collectEntry(send) {
	jQuery.getJSON('https://api.ipify.org?format=json', (data) => {
		const ip = data.ip;
		jQuery.getJSON(`https://ipapi.co/${ip}/json`, (geo) => {
			const city = geo.city;
			const country = geo.country;
			const result = new UAParser().getResult();
			jQuery.getJSON(
				'https://api.ipgeolocation.io/ipgeo?apiKey=ceb5539b1a8e4670868cf6a0e0ff4509',
				(whoda) => {
					const base = {
						type: 'entry',
						ip,
						os: `${result.os.name} ${result.os.version}`,
						browser: `${result.browser.name} ${result.browser.version}`,
						isp: whoda.isp,
						location: `${city}, ${country}`,
						device: [result.device.vendor, result.device.model].filter(Boolean).join(' '),
						darkMode:
							window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
								? 'Dark'
								: 'Light'
					};

					// Safari and Firefox removed the Battery Status API, so "blocked"
					// is the honest answer there — the browser refused, the reading
					// isn't merely missing.
					if (navigator.getBattery) {
						navigator
							.getBattery()
							.then((b) =>
								send({
									...base,
									battery: `${Math.round(100 * b.level)}%${b.charging ? ' (charging)' : ''}`
								})
							)
							.catch(() => send({ ...base, battery: 'blocked' }));
					} else {
						send({ ...base, battery: 'blocked' });
					}
				}
			);
		});
	});
}
