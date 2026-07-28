<script>
	// connected is written by this component and read by the parent, so in
	// Svelte 5 it must be declared $bindable for bind:connected to work.
	let { socketLoad, connected = $bindable(false) } = $props();

	let socket = {};

	const init = () => {
		// Same-origin. The page and the socket server are always co-hosted, and
		// a hardcoded production URL meant a local server could never be tested
		// without mutating the live game.
		const sock = io({ transports: ['websocket'] }).connect();
		socket = sock;
		connected = socket.connected;
		sock.on('connect', () => {
			connected = socket.connected;
		});
		sock.on('disconnect', () => {
			connected = socket.connected;
		});
		socketLoad(sock);
	};
</script>

<svelte:head>
	<script
		src="https://cdnjs.cloudflare.com/ajax/libs/socket.io/4.1.2/socket.io.js"
		integrity="sha512-iZIBSs+gDyTH0ZhUem9eQ1t4DcEn2B9lHxfRMeGQhyNdSUz+rb+5A3ummX6DQTOIs1XK0gOteOg/LPtSo9VJ+w=="
		crossorigin="anonymous"
		referrerpolicy="no-referrer"
		onload={init}
	></script>
</svelte:head>
