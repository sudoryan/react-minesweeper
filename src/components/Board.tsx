import React from "react";
import { withStyles } from "@material-ui/styles";
import { BoardType, SquareValue } from "../helpers/gameLogic";
import classNames from "classnames";

const styles = () => ({
  container: { borderStyle: "outset" },
  row: {
    display: "flex"
  },
  square: {
    "-webkit-touch-callout": "none",
    "-webkit-user-select": "none",
    "-khtml-user-select": "none",
    "-moz-user-select": "none",
    "-ms-user-select": "none",
    "user-select": "none",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "32px",
    width: "32px",
    backgroundColor: "#DEDEDE",
    borderStyle: "outset"
  },
  redBackground: {
    backgroundColor: "red"
  },
  hidden: { borderStyle: "outset" },
  revealed: {
    borderStyle: "inset"
  },
  red: {
    color: "red"
  },
  blue: {
    color: "blue"
  },
  green: {
    color: "green"
  }
});

interface Props {
  classes: any;
  board: BoardType;
  onClick: (isFlagClick: boolean, row: number, col: number) => void;
}

const Board = (props: Props) => {
  const { board } = props;

  const renderSquareContent = (n: BoardType[0][0]) => {
    let content = null;
    if (n.flagged) {
      return "🚩";
    }
    if (n.revealed) {
      if (
        n.value === SquareValue.BOMB ||
        n.value === SquareValue.BOMB_TRIGGERED
      ) {
        content = "💣";
      } else if (n.value === SquareValue.FALSE_FLAG) {
        content = "❌";
      } else if (n.value) {
        content = n.value.toString();
      }
    }
    return content;
  };

  const renderSquare = (n: BoardType[0][0], row: number, col: number) => {
    const onClick = (e: any) => {
      e.preventDefault();
      props.onClick(e.type === "contextmenu", row, col);
    };
    const classes = [props.classes.square];

    if (n.flagged) {
      classes.push(props.classes.red);
    } else if (n.revealed) {
      classes.push(props.classes.revealed);
      if (n.value === 1) {
        classes.push(props.classes.blue);
      }
      if (n.value === 2) {
        classes.push(props.classes.green);
      }
      if (n.value === 3) {
        classes.push(props.classes.red);
      }
    }
    if (n.bombed) {
      classes.push(props.classes.redBackground);
    }
    return (
      <div
        className={classNames(...classes)}
        onContextMenu={onClick}
        onClick={onClick}
        key={row + "." + col}
      >
        {renderSquareContent(n)}
      </div>
    );
  };

  const renderBoard = () => {
    const { classes } = props;
    return (
      <div className={classes.container}>
        {board.map((row, rowNumber) => (
          <div className={classes.row} key={rowNumber}>
            {row.map((square, colNumber) =>
              renderSquare(square, rowNumber, colNumber)
            )}
          </div>
        ))}
      </div>
    );
  };

  return renderBoard();
};

export default withStyles(styles)(Board);
