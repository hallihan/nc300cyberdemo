<script>
    import { createEventDispatcher } from 'svelte';
    export let socketLoad;
    let socket = {}
    export let connected = socket.connected;
    const dispatch = createEventDispatcher();

    const init = () => {
        const sock = io("https://nc300cyberdemo.azurewebsites.net", { transports : ['websocket'] }).connect();
        socket = sock
        connected = socket.connected
        sock.on("connect", ()=>{
            connected = socket.connected
        })
        sock.on("disconnect", (reason) => {
			connected = socket.connected;
		})
        console.log("sock")
        socketLoad(sock);
    }
</script>

<svelte:head>
    <script 
        src="https://cdnjs.cloudflare.com/ajax/libs/socket.io/4.1.2/socket.io.js" 
        integrity="sha512-iZIBSs+gDyTH0ZhUem9eQ1t4DcEn2B9lHxfRMeGQhyNdSUz+rb+5A3ummX6DQTOIs1XK0gOteOg/LPtSo9VJ+w==" 
        crossorigin="anonymous" 
        referrerpolicy="no-referrer"
        on:load={init}>
    </script>
</svelte:head>

<style>
    
</style>