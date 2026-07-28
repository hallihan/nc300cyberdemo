<script>
	import Tile from './tile.svelte';
	import SocketClient from './SocketClient.svelte';
	import InfoPanel from './InfoPanel.svelte';
	import { startEntryReporting } from './collectEntry.js';

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

	// Round/tracking stats, pushed by the server.
	let tracked = $state(0);
	let online = $state(0);
	let voted = $state(0);
	let thinking = $state(false);

	let socket;
	// Set once the first entry report lands; called again on each vote.
	let reportEntry;

	// Read once at load. There is deliberately no hashchange listener, so
	// adding #admin to an open page requires a reload.
	const admin = window.location.hash == '#admin';

	const totalVotes = $derived(board.map((x) => x.votes).reduce((a, b) => a + b, 0));
	const votedPct = $derived(tracked > 0 ? Math.round((voted / tracked) * 100) : 0);
	const resultText = $derived(
		ending == 'x' ? "X's win!" : ending == 'o' ? "O's win!" : 'Stalemate!'
	);

	const send = (payload) => socket.send(JSON.stringify(payload));

	const startGame = (level) => {
		if (!admin) return;
		showEntries = false; // close the device panel when a new game begins
		send({ type: 'start', difficulty: level });
	};

	const socketLoad = (sock) => {
		socket = sock;
		console.log('Socket loaded!');

		// The server can't see the #admin hash, and needs to know so the admin's
		// own connection is excluded from the tracked-user count.
		sock.send(JSON.stringify({ type: 'identify', admin }));

		startEntryReporting((payload) => sock.send(JSON.stringify(payload)))
			.then((again) => {
				reportEntry = again;
			})
			.catch(() => {});

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
			if (res.type == 'stats') {
				tracked = res.tracked;
				online = res.online;
				voted = res.voted;
			}
			if (res.type == 'thinking') thinking = res.thinking;
		});
	};

	// The computer plays O now, so the admin only spectates the board.
	const onTileVote = (i) => {
		if (admin) return;
		send({ type: 'vote', tile: i });
		board[i].votes++; // optimistic; corrected by the next board broadcast
		// Refresh this device's row — keeps battery current and re-asserts
		// presence. The server dedups on everything but battery, so this
		// updates the existing row rather than adding one.
		reportEntry?.();
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
				<div class="noactive start-menu">
					<div class="online-count">
						<strong>{online}</strong>
						{online === 1 ? 'player' : 'players'} online
					</div>
					<div class="start-buttons">
						<button class="button-p" onclick={() => startGame('easy')}>Start Easy</button>
						<button class="button-p" onclick={() => startGame('medium')}>Start Medium</button>
						<button class="button-p" onclick={() => startGame('hard')}>Start Difficult</button>
					</div>
				</div>
			{/if}
		{/if}

		{#if time > 0}
			{time}
		{/if}

		{#if ending != ''}
			{#if admin}
				<div class="noactive" style="flex-direction: column">
					{resultText}

					<!-- Straight into the next game, without going via Restart. -->
					<div class="next-game">
						<div class="next-label">Next game</div>
						<div class="start-buttons">
							<button class="button-p" onclick={() => startGame('easy')}>Start Easy</button>
							<button class="button-p" onclick={() => startGame('medium')}>Start Medium</button>
							<button class="button-p" onclick={() => startGame('hard')}>Start Difficult</button>
						</div>
					</div>

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

		<!-- One shared strip above the board. While the computer thinks, everyone
		     sees the same indicator — the admin screen is projected, so the two
		     views must read identically. Nothing is greyed out; the board stays
		     visible throughout. -->
		{#if thinking && ending == ''}
			<div class="thinking">
				<span>Computer is thinking</span>
				<span class="dots" aria-hidden="true"><i></i><i></i><i></i></span>
			</div>
		{:else if admin}
			<div class="stats">
				<span>
					Voted this round <strong>{voted}</strong>/{tracked}
					<span class="pct" class:full={tracked > 0 && voted >= tracked}>({votedPct}%)</span>
				</span>
			</div>
		{:else}
			<!-- The crowd always plays X; the computer answers as O. -->
			<div class="you-are">
				You are <span class="material-icons-round you-x">close</span>
			</div>
		{/if}

		<div class="board">
			{#each board as tile, i}
				<Tile votes={tile.votes} total={totalVotes} state={tile.state} onvote={() => onTileVote(i)} />
			{/each}
		</div>

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

	.stats {
		display: flex;
		flex-wrap: wrap;
		justify-content: center;
		gap: 0.5em;
		margin-bottom: 10px;
		font-size: 13px;
		color: #d8dee9;
		letter-spacing: 0.02em;
	}

	.stats strong {
		color: #eceff4;
		font-variant-numeric: tabular-nums;
	}

	.pct {
		opacity: 0.7;
	}

	.pct.full {
		color: #00ff95;
		opacity: 1;
	}

	/* 3x the previous 0.6em. .noactive is 2em, so buttons land around 3.6em —
	   sized to read from the back of a room off a projector. */
	.start-menu {
		flex-direction: column;
		gap: 0.5em;
		font-size: 1.8em;
	}

	.start-buttons {
		display: flex;
		flex-wrap: wrap;
		justify-content: center;
		gap: 0.3em;
	}

	/* On the result overlay, matched to the other buttons there rather than to
	   the oversized start screen. */
	.next-game {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0.4em;
		margin-top: 15px;
		font-size: 0.7em;
	}

	.next-label {
		font-size: 0.6em;
		color: #d8dee9;
		letter-spacing: 0.06em;
		text-transform: uppercase;
	}

	.online-count {
		font-size: 0.55em;
		color: #d8dee9;
		letter-spacing: 0.02em;
	}

	.online-count strong {
		color: #00ff95;
		font-variant-numeric: tabular-nums;
	}

	/* Identical on the projected admin screen and on every phone. */
	.thinking {
		display: flex;
		align-items: center;
		gap: 0.5em;
		margin-bottom: 10px;
		font-size: 15px;
		color: #00ff95;
		letter-spacing: 0.02em;
	}

	.dots {
		display: inline-flex;
		align-items: center;
	}

	.dots i {
		width: 0.4em;
		height: 0.4em;
		margin: 0 0.1em;
		border-radius: 50%;
		background: currentColor;
		animation: pulse 1.4s infinite ease-in-out both;
	}

	.dots i:nth-child(1) {
		animation-delay: -0.32s;
	}

	.dots i:nth-child(2) {
		animation-delay: -0.16s;
	}

	@keyframes pulse {
		0%,
		80%,
		100% {
			opacity: 0.25;
			transform: scale(0.75);
		}
		40% {
			opacity: 1;
			transform: scale(1);
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.dots i {
			animation: none;
			opacity: 0.7;
		}
	}

	.you-are {
		display: flex;
		align-items: center;
		gap: 0.35em;
		margin-bottom: 10px;
		font-size: 15px;
		color: #d8dee9;
		letter-spacing: 0.02em;
	}

	/* same glyph and colour as the X tiles, so the mapping is unmistakable */
	.you-x {
		color: red;
		font-size: 24px;
		line-height: 1;
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
