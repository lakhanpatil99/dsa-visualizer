export function solveNQueens(N = 4) {
  const board = Array.from({ length: N }, () => new Array(N).fill(0));
  const solutions = [];
  const trace = [];
  let step = 1;

  const isSafe = (row, col) => {
    // Check row on left
    for (let j = 0; j < col; j++) {
      if (board[row][j] === 1) return false;
    }
    // Check upper diagonal on left
    for (let i = row, j = col; i >= 0 && j >= 0; i--, j--) {
      if (board[i][j] === 1) return false;
    }
    // Check lower diagonal on left
    for (let i = row, j = col; i < N && j >= 0; i++, j--) {
      if (board[i][j] === 1) return false;
    }
    return true;
  };

  const solve = (col) => {
    if (col >= N) {
      const solutionCopy = board.map(r => [...r]);
      solutions.push(solutionCopy);
      trace.push({
        step: step++,
        type: 'solution_found',
        col,
        board: solutionCopy,
        message: `Solution #${solutions.length} discovered!`
      });
      return;
    }

    for (let row = 0; row < N; row++) {
      trace.push({
        step: step++,
        type: 'try_place',
        row,
        col,
        board: board.map(r => [...r]),
        message: `Evaluating queen placement at row ${row}, col ${col}`
      });

      if (isSafe(row, col)) {
        board[row][col] = 1;
        trace.push({
          step: step++,
          type: 'place_success',
          row,
          col,
          board: board.map(r => [...r]),
          message: `Safe: Queen placed at (${row}, ${col})`
        });

        solve(col + 1);

        // Backtrack
        board[row][col] = 0;
        trace.push({
          step: step++,
          type: 'backtrack',
          row,
          col,
          board: board.map(r => [...r]),
          message: `Backtracking: Removed queen from (${row}, ${col})`
        });
      } else {
        trace.push({
          step: step++,
          type: 'conflict',
          row,
          col,
          board: board.map(r => [...r]),
          message: `Conflict at (${row}, ${col}): row or diagonal occupied`
        });
      }
    }
  };

  solve(0);

  return { solutions, totalSolutions: solutions.length, trace };
}

export const nQueensComplexity = {
  time: 'O(N!)',
  space: 'O(N)',
  bestCase: 'O(N!)',
  averageCase: 'O(N!)',
  worstCase: 'O(N!)'
};
