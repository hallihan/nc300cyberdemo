<script>
	import Tile from './tile.svelte';
	import SocketClient from './SocketClient.svelte';
	import InfoPanel from './InfoPanel.svelte';
	import { collectEntry } from './collectEntry.js';

	console.table(document);

	let board = $state([
		{ votes: 0, state: '' },
		{ votes: 0, state: '' },
		{ votes: 0, state: '' },
		{ votes: 0, state: '' },
		{ votes: 0, state: '' },
		{ votes: 0, state: '' },
		{ votes: 0, state: '' },
		{ votes: 0, state: '' },
		{ votes: 0, state: '' }
	]);
	let entries = $state({});
	let showEntries = $state(false);
	let connected = $state(false);
	let time = $state(0);
	let gameActive = $state(false);
	let collectiveTurn = $state(true);
	let ending = $state('');

	let socket;

	// Read once at load. There is deliberately no hashchange listener, so
	// adding #admin to an open page requires a reload.
	const admin = window.location.hash == '#admin';

	const totalVotes = $derived(board.map((x) => x.votes).reduce((a, b) => a + b, 0));
	const resultText = $derived(
		ending == 'x' ? "X's win!" : ending == 'o' ? "O's win!" : 'Stalemate!'
	);

	const send = (payload) => socket.send(JSON.stringify(payload));

	const startGame = () => {
		if (admin) send({ type: 'start' });
	};

	const socketLoad = (sock) => {
		socket = sock;
		console.log('Socket loaded!');

		collectEntry((payload) => sock.send(JSON.stringify(payload)));

		sock.on('error', () => {
			console.log('error');
			connected = false;
		});

		sock.on('message', (res) => {
			console.log(res);
			if (res.type == 'board') board = res.board;
			if (res.type == 'status') gameActive = res.gameActive;
			if (res.type == 'time') time = res.time;
			if (res.type == 'turn') collectiveTurn = res.collectiveTurn;
			if (res.type == 'ending') ending = res.ending;
			if (res.type == 'entries' && admin) entries = res.entries;
		});
	};

	const onTileVote = (i) => {
		if (!admin) {
			send({ type: 'vote', tile: i });
			board[i].votes++; // optimistic; corrected by the next board broadcast
		}
		if (admin && !collectiveTurn) {
			send({ type: 'admin_vote', tile: i });
		}
	};

	const restart = () => {
		send({ type: 'restart' });
		showEntries = false;
		entries = {};
	};

	const clearInfo = () => {
		showEntries = false;
		send({ type: 'reset_entries' });
	};
</script>

<main>
	<SocketClient bind:connected {socketLoad} />
	{#if connected}
		{#if !gameActive}
			{#if !admin}
				<div class="noactive">Waiting for game start...</div>
			{:else}
				<div class="noactive"><button class="button-p" onclick={startGame}>Start Game</button></div>
			{/if}
		{/if}

		{#if time > 0}
			{time}
		{/if}

		{#if !collectiveTurn && !admin && !ending}
			<div class="noactive">Waiting for opponent's turn...</div>
		{/if}

		{#if ending != ''}
			{#if admin}
				<div class="noactive" style="flex-direction: column">
					{resultText}

					<button class="button-p" style="font-size: 0.7em; margin-top: 15px;" onclick={restart}>
						Restart
					</button>
					{#if showEntries}
						<button class="button-p" style="font-size: 0.7em; margin-top: 15px;" onclick={clearInfo}>
							Clear Info
						</button>
						<InfoPanel {entries} />
					{:else}
						<button
							class="button-p"
							style="font-size: 0.7em; margin-top: 15px;"
							onclick={() => (showEntries = true)}
						>
							Show Info
						</button>
					{/if}
				</div>
			{:else}
				<div class="noactive">{resultText}</div>
			{/if}
		{/if}

		<div class="board">
			{#each board as tile, i}
				<Tile votes={tile.votes} total={totalVotes} state={tile.state} onvote={() => onTileVote(i)} />
			{/each}
		</div>

		{#if gameActive && admin}
			<div class="bc">
				<button class="button-w lb" onclick={() => send({ type: 'ending', ending: 'x' })}>
					X Wins
				</button>
				<button class="button-w mb" onclick={() => send({ type: 'ending', ending: 'o' })}>
					O Wins
				</button>
				<button class="button-w rb" onclick={() => send({ type: 'ending', ending: 's' })}>
					Stalemate
				</button>
			</div>
		{/if}
	{:else}
		<p class="">Connecting...</p>
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
		background-color: rgba(10, 10, 10, 0.5);
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
		display: flex;
		flex-wrap: wrap;
		overflow: hidden;
		border: 3px solid #4c566a;
	}
</style>
