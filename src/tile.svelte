<script>
	// Svelte 5: props via $props(), and the parent gets an onvote callback
	// instead of createEventDispatcher + on:vote.
	// The prop is still named `state` from the parent's side; it is bound
	// locally as `tileState` because a local `state` would make the `$state`
	// rune ambiguous with a store subscription.
	let { total, votes, state: tileState, onvote } = $props();

	// The original wrote `$: enabled = state == ""` and then assigned `enabled`
	// directly for the click cooldown. Expressing the cooldown as its own flag
	// keeps `enabled` purely derived.
	//
	// This also fixes a latent bug: previously, if a tile was claimed while
	// cooling down, the 1s timer would re-enable an already-played tile until
	// the next `state` change. Here `state` is part of the derivation, so that
	// cannot happen.
	let cooling = $state(false);
	const enabled = $derived(tileState == '' && !cooling);

	const vote = () => {
		cooling = true;
		setTimeout(() => {
			cooling = false;
		}, 1000);
		onvote?.();
	};

	// total is 0 on a fresh board; guard the division so the font-size doesn't
	// evaluate to the string "NaNem", which browsers silently discard.
	const share = $derived(total > 0 ? votes / total : 0);
</script>

<button
	class="tile"
	disabled={!enabled}
	onclick={vote}
	style="position: relative; background: rgba(0, 255, 149, {(votes > 0 ? share * 0.8 : 0).toPrecision(2)});"
>
	<div class="con">
		{#if tileState != ''}
			{#if tileState == 'x'}
				<span class="material-icons-round icon x">close</span>
			{:else}
				<span class="material-icons-outlined icon o">circle</span>
			{/if}
		{:else}
			<p
				style="opacity: {Math.max(votes > 0 ? share * 5 : 0, 0.1)}; font-size: {Math.min(
					Math.max(1, share * 3),
					3.5
				) + 'em'}"
			>
				{votes}
			</p>
		{/if}
	</div>
</button>

<style>
	.icon {
		font-size: 8em;
	}

	.x {
		color: red;
	}

	.o {
		font-size: 6.5em;
		color: blue;
	}

	.tile:enabled {
		cursor: pointer;
	}

	.con {
		position: absolute;
		left: 0;
		top: 0;
		bottom: 0;
		right: 0;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.tile {
		color: inherit;
		font-size: inherit;
		margin: 0;
		background: inherit;
		width: 33.3333333%;

		height: 0;
		padding-bottom: 32.3333333%;
		position: relative;

		border: 0.5px solid #3b4252;
		box-sizing: border-box;
		transition: background 0.5s;
	}

	.tile:active {
		background: none;
	}

	.tile:after {
		content: '';
		background: #00ff95;
		display: block;
		position: absolute;
		left: 0;
		right: 0;
		top: 0;
		bottom: 0;
		opacity: 0;
		transition: all 0.5s;
	}

	.tile:enabled:hover:before {
		content: '';
		position: absolute;
		left: 0;
		right: 0;
		bottom: 0;
		top: 0;
		width: 100%;
		height: 100%;
		background: rgba(255, 255, 255, 0.05);
	}

	.tile:active:enabled:after {
		left: 50%;
		right: 50%;
		top: 50%;
		bottom: 50%;
		opacity: 0.5;
		transition: 0s;
	}
</style>
