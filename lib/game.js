// Pure game rules, kept out of server.js so they can be unit tested.
// CommonJS, because server.js is.

const LINES = [
	[0, 1, 2],
	[3, 4, 5],
	[6, 7, 8], // rows
	[0, 3, 6],
	[1, 4, 7],
	[2, 5, 8], // columns
	[0, 4, 8],
	[2, 4, 6] // diagonals
];

/** A tile counts as played only for the marks we actually use. */
const isPlayed = (tile) => tile.state === 'x' || tile.state === 'o';

/**
 * @returns {"x"|"o"|null} the winning mark, or null if nobody has three in a row
 */
function winner(board) {
	for (const [a, b, c] of LINES) {
		const mark = board[a].state;
		if (!isPlayed(board[a])) continue;
		if (board[b].state === mark && board[c].state === mark) return mark;
	}
	return null;
}

/** Every tile claimed. */
function boardFull(board) {
	return board.every(isPlayed);
}

/**
 * @returns {"x"|"o"|"s"|null} an ending code, or null if play continues
 */
function outcome(board) {
	const won = winner(board);
	if (won) return won;
	return boardFull(board) ? 's' : null;
}

/**
 * Highest-voted unclaimed tile. Ties go to the earliest index, matching the
 * original behaviour. Returns null when nothing is votable.
 */
function highestTile(board) {
	let best = null;
	let bestVotes = -1;
	for (const tile of board) {
		if (isPlayed(tile)) continue;
		if (tile.votes > bestVotes) {
			bestVotes = tile.votes;
			best = tile;
		}
	}
	return best;
}

module.exports = { LINES, winner, boardFull, outcome, highestTile, isPlayed };
