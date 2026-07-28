<script>
	// socket.io-client is bundled by Vite now, rather than pulled from a CDN
	// with a hand-maintained SRI hash. That keeps the client permanently in
	// step with the server's socket.io version and works without CDN access.
	import { io } from 'socket.io-client';

	// connected is written here and read by the parent, so Svelte 5 needs it
	// declared $bindable for bind:connected to work.
	let { socketLoad, connected = $bindable(false) } = $props();

	$effect(() => {
		// Same-origin: the page and the socket server are always co-hosted.
		const socket = io({ transports: ['websocket'] });
		connected = socket.connected;
		socket.on('connect', () => {
			connected = socket.connected;
		});
		socket.on('disconnect', () => {
			connected = socket.connected;
		});
		socketLoad(socket);
		return () => socket.close();
	});
</script>
