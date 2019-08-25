import React, { useState, useEffect } from "react";
import { withStyles } from "@material-ui/styles";
import Board from "./Board";
import {
  generateBoard,
  squareClick,
  BoardType,
  SquareValue,
  isGameComplete,
  revealBoard
} from "../helpers/gameLogic";
import Timer from "./Timer";

const styles = () => ({
  container: { marginTop: "5em", borderStyle: "outset" },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    minWidth: "17em",
    height: "2em",
    padding: "1em",
    borderStyle: "inset",
    background: "grey",
    backgroundColor: "#DEDEDE"
  },
  headerItem: {
    width: "3em",
    padding: "4px",
    textAlign: "center" as "center",
    color: "red",
    borderStyle: "inset"
  },
  resetButton: {
    borderStyle: "outset",
    background: "none"
  },
  resetButtonContent: {
    fontSize: "2em"
  }
});

interface Props {
  classes: any;
}

const Game = (props: Props) => {
  const ROWS = 9;
  const COLS = 9;
  const MINES = 11;
  const { classes } = props;
  const [gameLoop, setGameLoop] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [board, setBoard] = useState([] as BoardType);
  const [mines, setMines] = useState(MINES);
  const [gameStatus, setGameStatus] = useState("default" as
    | "default"
    | "win"
    | "lose");

  useEffect(() => {
    setBoard(generateBoard(ROWS, COLS, MINES));
  }, []);

  const renderReset = () => {
    let content = "🙂";
    if (gameStatus === "win") {
      content = "😎";
    } else if (gameStatus === "lose") {
      content = "😵";
    }
    return (
      <div className={classes.resetButton}>
        <button onClick={handleReset} style={{ background: "none" }}>
          <div className={classes.resetButtonContent}>{content}</div>
        </button>
      </div>
    );
  };

  const handleReset = () => {
    setGameStatus("default");
    setGameLoop(false);
    setGameOver(false);
    setMines(MINES);
    setBoard(generateBoard(ROWS, COLS, MINES));
  };

  const handleGameWin = (_board: BoardType) => {
    setGameStatus("win");
    setGameOver(true);
    setGameLoop(false);
    setMines(0);
    revealBoard(_board);
    return setBoard(_board);
  };

  const handleSquareClick = (
    isFlagClick: boolean,
    row: number,
    col: number
  ) => {
    if (!gameOver) {
      setGameLoop(true);
      const newBoard: BoardType = squareClick(board, row, col, isFlagClick);
      if (isGameComplete(newBoard)) {
        return handleGameWin(newBoard);
      }
      setBoard(newBoard);
      if (isFlagClick) {
        if (board[row][col].flagged) {
          setMines(mines - 1);
        } else {
          setMines(mines + 1);
        }
      } else if (
        !newBoard[row][col].flagged &&
        newBoard[row][col].value === SquareValue.BOMB
      ) {
        setGameStatus("lose");
        setGameOver(true);
        setGameLoop(false);
      }
    }
  };

  return (
    <div className={classes.container}>
      <div className={classes.header}>
        <div className={classes.headerItem}>{mines}</div>
        {renderReset()}
        <div className={classes.headerItem}>
          <Timer gameLoop={gameLoop} gameOver={gameOver} />
        </div>
      </div>
      <Board board={board} onClick={handleSquareClick} />
    </div>
  );
};

export default withStyles(styles)(Game);
