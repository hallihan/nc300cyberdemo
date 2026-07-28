import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import ai from '../lib/ai.js';
import game from '../lib/game.js';

const { chooseMove, moveScores, optimalMoves } = ai;
const { outcome } = game;

/** "x..o....." -> board; '.' is empty */
const b = (s) => [...s].map((ch) => ({ state: ch === '.' ? '' : ch, votes: 0 }));
const marks = (board) => board.map((t) => t.state || '.').join('');

/** deterministic rng returning a fixed sequence, then repeating the last value */
const seq = (...values) => {
	let i = 0;
	return () => values[Math.min(i++, values.length - 1)];
};

describe('hard', () => {
	test('takes an immediate win', () => {
		// o at 0,1 -> 2 completes the row
		const move = chooseMove(b('oo.xx....'), 'hard', {}, () => 0);
		assert.equal(move.index, 2);
		assert.equal(move.mistake, false);
	});

	test('blocks an immediate threat', () => {
		// x at 0,1 threatens 2; o has nothing better
		const move = chooseMove(b('xx.o.....'), 'hard', {}, () => 0);
		assert.equal(move.index, 2);
	});

	test('prefers winning over blocking', () => {
		// x threatens 6,7->8 ; o threatens 0,1->2. o should win rather than block.
		const move = chooseMove(b('oo....xx.'), 'hard', {}, () => 0);
		assert.equal(move.index, 2, 'take the win');
	});

	test('answers a centre opening with a corner', () => {
		const move = chooseMove(b('....x....'), 'hard', {}, () => 0);
		assert.ok([0, 2, 6, 8].includes(move.index), `expected a corner, got ${move.index}`);
	});

	test('never loses, against every possible line of play', () => {
		// Exhaustively explore every X strategy; O always plays hard.
		let games = 0;
		let losses = 0;

		const playX = (board) => {
			const result = outcome(board);
			if (result) {
				games++;
				if (result === 'x') losses++;
				return;
			}
			board.forEach((tile, i) => {
				if (tile.state !== '') return;
				const next = board.map((t) => ({ ...t }));
				next[i].state = 'x';
				const after = outcome(next);
				if (after) {
					games++;
					if (after === 'x') losses++;
					return;
				}
				const move = chooseMove(next, 'hard', {}, () => 0);
				next[move.index].state = 'o';
				playX(next);
			});
		};

		playX(b('.........'));
		assert.ok(games > 100, `expected a decent search, played ${games}`);
		assert.equal(losses, 0, `hard lost ${losses} of ${games} games`);
	});
});

describe('medium', () => {
	test('spends exactly one mistake, then plays optimally', () => {
		const state = {};
		const board = b('....x....'); // x took centre; edges are losing replies

		const first = chooseMove(board, 'medium', state, () => 0);
		assert.equal(first.mistake, true, 'first move is the deliberate mistake');
		assert.equal(state.mistakeMade, true);
		assert.ok(!optimalMoves(board).includes(first.index), 'and it is genuinely not optimal');

		board[first.index].state = 'o';
		board[1].state = 'x'; // crowd replies somewhere
		const second = chooseMove(board, 'medium', state, () => 0);
		assert.equal(second.mistake, false, 'no second mistake');
		assert.ok(optimalMoves(board).includes(second.index), 'optimal from here on');
	});

	test('the mistake leaves the crowd able to win', () => {
		const state = {};
		const board = b('....x....');
		const move = chooseMove(board, 'medium', state, () => 0);
		board[move.index].state = 'o';

		// From this position x, playing well, can force a win.
		const best = Math.max(...moveScores(board, 'x').map((s) => s.score));
		assert.ok(best > 0, 'x has a winning continuation');
	});

	test('plays optimally when no mistake is available', () => {
		const state = { mistakeMade: false };
		// only one legal move left, so there is nothing suboptimal to choose
		const move = chooseMove(b('xoxxoxox.'), 'medium', state, () => 0);
		assert.equal(move.index, 8);
		assert.equal(move.mistake, false);
		assert.equal(state.mistakeMade, false, 'no mistake was spent');
	});
});

describe('easy', () => {
	test('plays a wrong move when the coin says so', () => {
		const board = b('xx.o.....'); // 2 is the only correct block
		const move = chooseMove(board, 'easy', {}, seq(0.1, 0));
		assert.equal(move.mistake, true);
		assert.notEqual(move.index, 2, 'deliberately did not block');
	});

	test('plays the right move when the coin says so', () => {
		const board = b('xx.o.....');
		const move = chooseMove(board, 'easy', {}, seq(0.9, 0));
		assert.equal(move.mistake, false);
		assert.equal(move.index, 2, 'blocked');
	});

	test('is right roughly half the time over many moves', () => {
		let right = 0;
		const trials = 400;
		for (let n = 0; n < trials; n++) {
			const move = chooseMove(b('xx.o.....'), 'easy', {});
			if (!move.mistake) right++;
		}
		const ratio = right / trials;
		assert.ok(ratio > 0.35 && ratio < 0.65, `expected ~50% correct, got ${Math.round(ratio * 100)}%`);
	});
});

describe('edges', () => {
	test('returns null when the board is full', () => {
		assert.equal(chooseMove(b('xoxxoxoxo'), 'hard', {}), null);
	});

	test('an unknown difficulty falls back to optimal play', () => {
		const move = chooseMove(b('xx.o.....'), 'nonsense', {}, () => 0);
		assert.equal(move.index, 2);
	});
});
