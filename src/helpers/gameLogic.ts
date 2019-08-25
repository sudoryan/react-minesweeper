export type BoardType = Array<
  Array<{
    revealed: boolean;
    value: SquareValue | number;
    flagged: boolean;
    bombed: boolean;
  }>
>;

export enum SquareValue {
  FALSE_FLAG = -3,
  BOMB_TRIGGERED = -2,
  BOMB = -1
}

export const generateBoard = (rows: number, cols: number, mines: number) => {
  let board: BoardType = [];

  initializeBoard(board, rows, cols);
  addMines(board, rows, cols, mines);
  markNbNeighborMines(board);
  return board;
};

const initializeBoard = (
  board: BoardType,
  rows: number,
  cols: number
): BoardType => {
  for (let row = 0; row < rows; row++) {
    board.push([]);
  }
  for (let row = 0; row < rows; row++) {
    board[row] = [];
    for (let col = 0; col < cols; col++) {
      board[row].push({
        revealed: false,
        value: 0,
        flagged: false,
        bombed: false
      });
    }
  }
  return board;
};

const addMines = (
  board: BoardType,
  rows: number,
  cols: number,
  mines: number
): BoardType => {
  for (let mine = 0; mine < mines; ) {
    const row = Math.floor(Math.random() * rows);
    const col = Math.floor(Math.random() * cols);
    if (!board[row][col].value) {
      board[row][col].value = -1;
      mine++;
    }
  }
  return board;
};

const markNbNeighborMines = (board: BoardType): BoardType => {
  for (let row = 0; row < board.length; row++) {
    for (let col = 0; col < board[row].length; col++) {
      if (board[row][col].value === -1) {
        continue;
      }
      let neighborMines = 0;
      // Top left
      if (
        row - 1 >= 0 &&
        col - 1 >= 0 &&
        board[row - 1][col - 1].value === -1
      ) {
        neighborMines++;
      }
      // Top
      if (row - 1 >= 0 && board[row - 1][col].value === -1) {
        neighborMines++;
      }
      // Top Right
      if (
        row - 1 >= 0 &&
        col + 1 < board[row].length &&
        board[row - 1][col + 1].value === -1
      ) {
        neighborMines++;
      }
      // Left
      if (col - 1 >= 0 && board[row][col - 1].value === -1) {
        neighborMines++;
      }
      // Right
      if (col + 1 < board[row].length && board[row][col + 1].value === -1) {
        neighborMines++;
      }
      // Bottom Left
      if (
        row + 1 < board.length &&
        col - 1 >= 0 &&
        board[row + 1][col - 1].value === -1
      ) {
        neighborMines++;
      }
      // Bottom
      if (row + 1 < board.length && board[row + 1][col].value === -1) {
        neighborMines++;
      }
      // Bottom Right
      if (
        row + 1 < board.length &&
        col + 1 < board[row].length &&
        board[row + 1][col + 1].value === -1
      ) {
        neighborMines++;
      }
      board[row][col].value = neighborMines;
    }
  }
  return board;
};

const isFirstMove = (board: BoardType): boolean => {
  for (let row = 0; row < board.length; row++) {
    for (let col = 0; col < board[row].length; col++) {
      if (board[row][col].revealed) {
        return false;
      }
    }
  }
  return true;
};

const countMines = (board: BoardType) => {
  let mines = 0;
  for (let row = 0; row < board.length; row++) {
    for (let col = 0; col < board[row].length; col++) {
      if (board[row][col].value === -1) {
        mines++;
      }
    }
  }
  return mines;
};

const revealSquare = (board: BoardType, row: number, col: number): boolean => {
  if (
    row >= 0 &&
    row < board.length &&
    (col >= 0 && col < board[row].length) &&
    !board[row][col].flagged &&
    !board[row][col].revealed
  ) {
    board[row][col].revealed = true;
    return true;
  }
  return false;
};

const revealNeighborsOfZero = (board: BoardType) => {
  let revealed = true;
  while (revealed) {
    revealed = false;
    for (let row = 0; row < board.length; row++) {
      for (let col = 0; col < board[row].length; col++) {
        if (board[row][col].value !== 0 || !board[row][col].revealed) {
          continue;
        }
        revealed = revealSquare(board, row - 1, col - 1) || revealed;
        revealed = revealSquare(board, row - 1, col) || revealed;
        revealed = revealSquare(board, row - 1, col + 1) || revealed;
        revealed = revealSquare(board, row, col - 1) || revealed;
        revealed = revealSquare(board, row, col + 1) || revealed;
        revealed = revealSquare(board, row + 1, col - 1) || revealed;
        revealed = revealSquare(board, row + 1, col) || revealed;
        revealed = revealSquare(board, row + 1, col + 1) || revealed;
      }
    }
  }
};

const migrateFlags = (board: BoardType, oldBoard: BoardType) => {
  for (let row = 0; row < board.length; row++) {
    for (let col = 0; col < board[row].length; col++) {
      if (oldBoard[row][col].flagged) {
        board[row][col].flagged = true;
      }
    }
  }
};

const revealBombs = (board: BoardType) => {
  for (let row = 0; row < board.length; row++) {
    for (let col = 0; col < board[row].length; col++) {
      const square = board[row][col];
      if (square.value === SquareValue.BOMB) {
        square.revealed = true;
      }
      if (square.value >= 0 && square.flagged) {
        square.value = SquareValue.FALSE_FLAG;
        square.flagged = false;
        square.revealed = true;
      }
    }
  }
};

export const squareClick = (
  board: BoardType,
  row: number,
  col: number,
  isFlagClick: boolean
): BoardType => {
  let newBoard: BoardType = [];
  for (let row = 0; row < board.length; row++) {
    newBoard[row] = board[row].slice();
  }
  if (isFlagClick) {
    if (!newBoard[row][col].revealed) {
      newBoard[row][col].flagged = !newBoard[row][col].flagged;
    }
    return newBoard;
  }
  if (!newBoard[row][col].flagged) {
    if (newBoard[row][col].value !== 0 && isFirstMove(newBoard)) {
      const mines = countMines(board);
      while (newBoard[row][col].value !== 0) {
        newBoard = generateBoard(board.length, board[0].length, mines);
        migrateFlags(newBoard, board);
      }
    }
    if (newBoard[row][col].value === SquareValue.BOMB) {
      newBoard[row][col] = {
        ...newBoard[row][col],
        revealed: true,
        bombed: true
      };
      revealBombs(newBoard);
    } else {
      newBoard[row][col] = { ...newBoard[row][col], revealed: true };
    }
    revealNeighborsOfZero(newBoard);
  }
  return newBoard;
};

export const revealBoard = (board: BoardType) => {
  for (let row = 0; row < board.length; row++) {
    for (let col = 0; col < board[row].length; col++) {
      if (board[row][col].value === SquareValue.BOMB) {
        board[row][col].flagged = true;
      }
      board[row][col].revealed = true;
    }
  }
};

export const isGameComplete = (board: BoardType): boolean => {
  for (let row = 0; row < board.length; row++) {
    for (let col = 0; col < board[row].length; col++) {
      if (board[row][col].value >= 0 && !board[row][col].revealed) {
        return false;
      }
    }
  }
  return true;
};
