import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import game from '../lib/game.js';

const { winner, boardFull, outcome, highestTile } = game;

/** "xx.oo...." -> a board; '.' is unclaimed */
const b = (s, votes = []) =>
	[...s].map((ch, i) => ({ state: ch === '.' ? '' : ch, votes: votes[i] ?? 0 }));

describe('winner', () => {
	test('detects all three rows', () => {
		assert.equal(winner(b('xxx......')), 'x');
		assert.equal(winner(b('...ooo...')), 'o');
		assert.equal(winner(b('......xxx')), 'x');
	});

	test('detects all three columns', () => {
		assert.equal(winner(b('x..x..x..')), 'x');
		assert.equal(winner(b('.o..o..o.')), 'o');
		assert.equal(winner(b('..x..x..x')), 'x');
	});

	test('detects both diagonals', () => {
		assert.equal(winner(b('x...x...x')), 'x');
		assert.equal(winner(b('..o.o.o..')), 'o');
	});

	test('returns null with no line', () => {
		assert.equal(winner(b('.........')), null);
		assert.equal(winner(b('xoxoxooxo')), null);
	});

	test('does not treat unclaimed tiles as a line', () => {
		// three empties in a row must never count as a win
		assert.equal(winner(b('.........')), null);
		assert.equal(winner(b('xo.......')), null);
	});

	test('ignores the numeric 0 the old restart used to write', () => {
		const board = b('.........');
		board.forEach((t) => (t.state = 0));
		assert.equal(winner(board), null, '0 == "" in JS, so this must not read as a line');
	});
});

describe('boardFull / outcome', () => {
	test('boardFull only when every tile is x or o', () => {
		assert.equal(boardFull(b('xoxxoxoxo')), true);
		assert.equal(boardFull(b('xoxxoxox.')), false);
	});

	test('outcome prefers a win over a full board', () => {
		// full board that also contains a winning row
		assert.equal(outcome(b('xxxooxoxo')), 'x');
	});

	test('outcome reports a stalemate on a full board with no line', () => {
		assert.equal(outcome(b('xoxxoxoxo')), 's');
	});

	test('outcome returns null while play continues', () => {
		assert.equal(outcome(b('xo.......')), null);
	});
});

describe('highestTile', () => {
	test('picks the most-voted unclaimed tile', () => {
		const board = b('.........', [0, 3, 1, 0, 7, 0, 0, 2, 0]);
		assert.equal(highestTile(board), board[4]);
	});

	test('never picks a claimed tile, however many votes it holds', () => {
		const board = b('x........', [99, 4, 0, 0, 0, 0, 0, 0, 0]);
		assert.equal(highestTile(board), board[1]);
	});

	test('ties go to the earliest index', () => {
		const board = b('.........', [5, 5, 0, 0, 0, 0, 0, 0, 0]);
		assert.equal(highestTile(board), board[0]);
	});

	test('returns a zero-vote tile when nobody voted', () => {
		const board = b('.........');
		assert.equal(highestTile(board), board[0]);
	});

	test('returns null when every tile is claimed', () => {
		assert.equal(highestTile(b('xoxxoxoxo')), null);
	});
});
