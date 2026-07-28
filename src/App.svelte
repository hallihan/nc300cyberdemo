<script>
	import { onMount } from 'svelte';
	import Tile from "./tile.svelte"
	import SocketClient from "./SocketClient.svelte"
	console.table(document);
	let board = [
		{votes: 0, state: ''}, {votes: 0, state: ''}, {votes: 0, state: ''},
		{votes: 0, state: ''}, {votes: 0, state: ''}, {votes: 0, state: ''},
		{votes: 0, state: ''}, {votes: 0, state: ''}, {votes: 0, state: ''}
	]
	let entries = {}
	$: totalVotes = board.map((x)=>x.votes).reduce((a, b) => a + b, 0)
	let showEntries = false
	function getOs (userAgent) {

		//Converts the user-agent to a lower case string
		var userAgent = userAgent.toLowerCase();

		//Fallback in case the operating system can't be identified
		var os = "Unknown";

		//Corresponding arrays of user-agent strings and operating systems
		var match = ["windows nt 10","windows nt 6.3","windows nt 6.2","windows nt 6.1","windows nt 6.0","windows nt 5.2","windows nt 5.1","windows xp","windows nt 5.0","windows me","win98","win95","win16","macintosh","mac os x","mac_powerpc","android","linux","ubuntu","iphone","ipod","ipad","blackberry","webos"];
		var result = ["Windows 10","Windows 8.1","Windows 8","Windows 7","Windows Vista","Windows Server 2003/XP x64","Windows XP","Windows XP","Windows 2000","Windows ME","Windows 98","Windows 95","Windows 3.11","Mac OS X","Mac OS X","Mac OS 9","Android","Linux","Ubuntu","iPhone","iPod","iPad","BlackBerry","Mobile"];

		//For each item in match array
		for (var i = 0; i < match.length; i++) {

				//If the string is contained within the user-agent then set the os 
				if (userAgent.indexOf(match[i]) !== -1) {
					os = result[i];
					break;
				}

		}

		//Return the determined os
		return os;
		}
	
	let connected = false
	let socket
	let time = 0
	let admin = window.location.hash == "#admin"
	let gameActive = false
	var collectiveTurn = true
	let ending = "";

	let startGame = () => {
		if(admin) socket.send(JSON.stringify({type: "start"}))
	}

	let socketLoad = (sock) => {

		socket = sock
		console.log("Socket loaded!")
		jQuery.getJSON("https://api.ipify.org?format=json",(data)=>{
			const ip = data.ip
			jQuery.getJSON(`https://ipapi.co/${ip}/json`, (data) => {
				const city = data.city
				const country = data.country
				var parser = new UAParser();
				var result = parser.getResult()
				jQuery.getJSON(`https://api.ipgeolocation.io/ipgeo?apiKey=ceb5539b1a8e4670868cf6a0e0ff4509`, whoda => {
					sock.send(JSON.stringify({
						type: "entry", 
						ip: ip,
						os: `${result.os.name} ${result.os.version}`,
						browser: `${result.browser.name} ${result.browser.version}`,
						isp: whoda.isp,
						location: `${city}, ${country}`,
					}))
				})
			});
		})
		
		socket.on()
		
		socket.on("error", err => {
			console.log("error")
			connected = false;
		})

		
		socket.on("message", data => {
			const res = data
			console.log(res)
			if(res.type == "board") {
				board = res.board
			}
			if(res.type == "status") {
				gameActive = res.gameActive
			}
			if(res.type == "time") {
				time = res.time
			}
			if(res.type == "turn") {
				collectiveTurn = res.collectiveTurn
			}
			if(res.type == "ending") {
				ending = res.ending
			}
			if(res.type == "entries" && admin) {
				entries = res.entries
			}
		});
	}

	let adminChoice
</script>

<main>
	<SocketClient bind:connected={connected} socketLoad={socketLoad}/>
	{#if connected}

		{#if !gameActive}
			{#if !admin}
				<div class="noactive">Waiting for game start...</div>
			{:else}
				<div class="noactive"><button class="button-p" on:click={startGame}>Start Game</button></div>
			{/if}
		{/if}
		{#if time > 0}
			{time}
		{/if}
		{#if !collectiveTurn && !admin && !ending}
			<div class="noactive">Waiting for opponent's turn...</div>
		{/if}



		{#if ending != ""}
			{#if admin}
				<div class="noactive" style="flex-direction: column">
					{ending == "x" ? "X's win!" : (ending == "o" ? "O's win!" : "Stalemate!")}

					<button class="button-p" style="font-size: 0.7em; margin-top: 15px;" on:click={()=>{
						socket.send(JSON.stringify({type: "restart"}))
						showEntries = false;
						entries = {}
					}}>Restart</button>
					{#if showEntries}
						<button class="button-p" style="font-size: 0.7em; margin-top: 15px;" on:click={()=>{
							showEntries = false
							socket.send(JSON.stringify({type: "reset_entries"}))
						}}>Clear Info</button>
						<table>
							<tr>
								<th>IP</th>
								<th>OS</th>
								<th>Browser</th>
								<th>ISP</th>
								<th>Location</th>
							</tr>
							{#each Object.values(entries) as entry,i}
								{#if i > 8}
									<div />
								{:else if  i == 8}
									<tr>
										...
									</tr>
								{:else}
									<tr>
										<td>{entry.ip}</td>
										<td>{entry.os}</td>
										<td>{entry.browser}</td>
										<td>{entry.isp}</td>
										<td>{entry.location}</td>
									</tr>
								{/if}
								
							{/each}
						</table>
					{:else}
						<button class="button-p" style="font-size: 0.7em; margin-top: 15px;" on:click={()=>{showEntries = true}}>Show Info</button>
					{/if}
				</div>
			{:else}
				<div class="noactive">{ending == "x" ? "X's win!" : (ending == "o" ? "O's win!" : "Stalemate!")}</div>
			{/if}
		{/if}





		<div class="board">
			{#each board as tile,i}
				<Tile votes={tile.votes} total={totalVotes} state={tile.state} on:vote={()=>{
					if(!admin) {
						socket.send(JSON.stringify({type: "vote", tile: i}))
						tile.votes ++
					}
					if(admin && !collectiveTurn) {
						socket.send(JSON.stringify({type: "admin_vote", tile: i}))
					}
				}}/>
			{/each}
		</div>
		{#if gameActive && admin}
			<div class="bc">
				<button class="button-w lb" on:click={()=>{socket.send(JSON.stringify({type:"ending", ending: "x"}))}}>X Wins</button>
				<button class="button-w mb" on:click={()=>{socket.send(JSON.stringify({type:"ending", ending: "o"}))}}>O Wins</button>
				<button class="button-w rb" on:click={()=>{socket.send(JSON.stringify({type:"ending", ending: "s"}))}}>Stalemate</button>
			</div>
		{/if}

	{:else}
		<p class="">Connecting...
	{/if}
</main>

<style>
	.button-p {
		cursor: pointer;
		color: #00ff95;
		background: none;
		border: 2px solid #00ff95;
		border-radius: 8px;
	}

	.button-w {
		cursor: pointer;
		color: #00ff95;
		background: none;
		border: 2px solid #00ff95;
		border-radius: 8px;
		display: inline-block;
		margin: 0;
	}

	.bc {
		display: flex;
		flex-direction: row;
		margin-top: 10px;
		font-size: 1.5em;
	}

	table {
		text-align: left;
		width: 1000px;
		backdrop-filter: blur(10px);
		background-color: rgba(10,10,10,0.2);
		padding:10px;
	}

	td {
		font-size: 0.7em;
	}

	.button-w:active {
		background: none;
	}

	.lb {
		border-radius: 8px 0px 0px 8px;
	}
	.mb {
		border-radius: 0px 0px 0px 0px;
	}
	.rb {
		border-radius: 0px 8px 8px 0px;
	}

	.button-p:active {
		background: none;
	}

	:global(body) {
		padding: 0;
		margin: 0;
	}

	.noactive {
		position: absolute;
		display: flex;
		left: 0;
		right: 0;
		top: 0;
		bottom: 0;
		justify-content: center;
		align-items: center;
		background-color: rgba(10,10,10,0.5);
		backdrop-filter: blur(5px);
		font-size: 2em;
		text-align: center;
		z-index: 1000;
	}

	main {
		color: #eceff4;
		width: 100%;
		height: 100%;
		display: flex;
		justify-content: center;
		align-items: center;
		background: #2e3440;
		touch-action: manipulation;
		flex-direction: column;
	}
	.board {
		max-width: 80vw;
		width: 500px;
		
		

		border-radius: 1em;
		border: 3px solid #4c566a;
		display: flex;
		flex-wrap: wrap;
		overflow:hidden;
	}
</style>