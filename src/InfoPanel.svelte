<script>
	import { INFO_COLUMNS, sortEntries, deviceCountLabel } from './deviceInfo.js';

	let { entries = {} } = $props();

	// Svelte escapes interpolated text, so the textContent-only rule the
	// imperative renderer enforced by hand holds automatically here. Every
	// value in this table is client-supplied and must never reach innerHTML.
	const rows = $derived(sortEntries(Object.values(entries)));
</script>

<div class="info-wrap">
	{#if rows.length === 0}
		<div class="info-empty">No devices captured yet.</div>
	{:else}
		<table class="info-table">
			<thead>
				<tr>
					{#each INFO_COLUMNS as col}
						<th class:info-num={col.numeric}>{col.label}</th>
					{/each}
				</tr>
			</thead>
			<tbody>
				{#each rows as entry}
					<tr>
						{#each INFO_COLUMNS as col}
							<td class:info-num={col.numeric}>{col.get(entry)}</td>
						{/each}
					</tr>
				{/each}
			</tbody>
		</table>
	{/if}
</div>
<div class="info-count">{deviceCountLabel(rows.length)}</div>

<style>
	.info-wrap {
		width: min(1050px, 94vw);
		max-height: 58vh;
		overflow-y: auto;
		margin-top: 12px;
		border: 1px solid #ccc;
		border-radius: 4px;
		background-color: rgba(10, 10, 10, 0.35);
		backdrop-filter: blur(10px);
	}

	.info-table {
		width: 100%;
		border-collapse: collapse;
		text-align: left;
		color: #eceff4;
		font-size: 13px;
		line-height: 1.35;
	}

	.info-table th {
		position: sticky;
		top: 0;
		z-index: 1;
		background: #3b4252;
		font-size: 10px;
		font-weight: 600;
		letter-spacing: 0.05em;
		text-transform: uppercase;
		padding: 6px 8px;
		border: 1px solid #ccc;
		white-space: nowrap;
	}

	.info-table td {
		padding: 5px 8px;
		border: 1px solid #ccc;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
		max-width: 220px;
	}

	.info-table tbody tr:nth-child(even) {
		background: rgba(255, 255, 255, 0.04);
	}

	.info-num {
		text-align: right;
		font-variant-numeric: tabular-nums;
	}

	.info-empty {
		padding: 16px;
		text-align: center;
		font-size: 13px;
		color: #d8dee9;
	}

	.info-count {
		font-size: 11px;
		color: #d8dee9;
		margin-top: 6px;
		text-align: right;
		width: min(1050px, 94vw);
	}
</style>
