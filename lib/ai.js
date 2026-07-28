// Computer opponent. Plays "o"; the crowd plays "x".
//
// Move quality comes from a full minimax search — tic-tac-toe is small enough
// that there is no need to approximate. Difficulty is then expressed purely as
// how often the computer is allowed to depart from the optimal move:
//
//   hard    always optimal — cannot be beaten, only drawn
//   medium  exactly one deliberate mistake per game, preferring one that hands
//           the crowd a winnable position; optimal thereafter
//   easy    a coin flip each move between an optimal and a non-optimal move
//
// rng is injectable so the tests can pin the coin flips.

const { LINES } = require('./game');

const OPPONENT = { x: 'o', o: 'x' };

/** board of {state} -> array of 'x' | 'o' | '' */
const marksOf = (board) =>
	board.map((tile) => (tile.state === 'x' || tile.state === 'o' ? tile.state : ''));

function winnerOf(marks) {
	for (const [a, b, c] of LINES) {
		if (marks[a] && marks[a] === marks[b] && marks[a] === marks[c]) return marks[a];
	}
	return null;
}

const emptyIndices = (marks) => marks.reduce((acc, m, i) => (m ? acc : (acc.push(i), acc)), []);

/**
 * Minimax with depth bias, so a forced win is taken as early as possible and a
 * forced loss is delayed as long as possible.
 */
function score(marks, turn, me, depth) {
	const won = winnerOf(marks);
	if (won === me) return 10 - depth;
	if (won) return depth - 10;

	const empties = emptyIndices(marks);
	if (empties.length === 0) return 0;

	const results = empties.map((i) => {
		marks[i] = turn;
		const value = score(marks, OPPONENT[turn], me, depth + 1);
		marks[i] = '';
		return value;
	});
	return turn === me ? Math.max(...results) : Math.min(...results);
}

/** @returns {{index: number, score: number}[]} every legal move, scored for `me` */
function moveScores(board, me = 'o') {
	const marks = marksOf(board);
	return emptyIndices(marks).map((index) => {
		marks[index] = me;
		const value = score(marks, OPPONENT[me], me, 1);
		marks[index] = '';
		return { index, score: value };
	});
}

/** Indices tied for the best available outcome. */
function optimalMoves(board, me = 'o') {
	const scores = moveScores(board, me);
	if (scores.length === 0) return [];
	const best = Math.max(...scores.map((s) => s.score));
	return scores.filter((s) => s.score === best).map((s) => s.index);
}

const DIFFICULTIES = ['easy', 'medium', 'hard'];

/**
 * @param {{state: string}[]} board
 * @param {"easy"|"medium"|"hard"} difficulty
 * @param {{mistakeMade?: boolean}} state mutated: mistakeMade is set once medium spends its mistake
 * @param {() => number} rng
 * @returns {{index: number, mistake: boolean}|null} null when the board is full
 */
function chooseMove(board, difficulty, state = {}, rng = Math.random) {
	const scores = moveScores(board, 'o');
	if (scores.length === 0) return null;

	const best = Math.max(...scores.map((s) => s.score));
	const optimal = scores.filter((s) => s.score === best).map((s) => s.index);
	const suboptimal = scores.filter((s) => s.score < best).map((s) => s.index);
	// moves that actively hand the crowd a win, rather than merely giving up a draw
	const losing = scores.filter((s) => s.score < 0).map((s) => s.index);

	const pick = (list) => list[Math.floor(rng() * list.length)];

	if (difficulty === 'medium') {
		if (!state.mistakeMade && suboptimal.length > 0) {
			state.mistakeMade = true;
			return { index: pick(losing.length > 0 ? losing : suboptimal), mistake: true };
		}
		return { index: pick(optimal), mistake: false };
	}

	if (difficulty === 'easy') {
		// Coin flip first, so a test controlling rng can force either branch.
		const goWrong = rng() < 0.5;
		if (goWrong && suboptimal.length > 0) {
			return { index: pick(suboptimal), mistake: true };
		}
		return { index: pick(optimal), mistake: false };
	}

	// hard, and the default for anything unrecognised
	return { index: pick(optimal), mistake: false };
}

module.exports = { chooseMove, moveScores, optimalMoves, marksOf, winnerOf, DIFFICULTIES };
