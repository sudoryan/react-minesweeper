import React, { useState, useEffect } from "react";
import { withStyles } from "@material-ui/styles";

const styles = () => ({});

interface Props {
  classes: any;
  gameLoop: boolean;
  gameOver: boolean;
}

const Timer = (props: Props) => {
  const [timer, setTimer] = useState(0);

  useEffect(() => {
    if (!props.gameLoop && !props.gameOver) {
      setTimer(0);
    }
    const interval = setInterval(() => {
      if (props.gameLoop) {
        setTimer(timer + 1);
      }
    }, 1000);
    return () => {
      clearInterval(interval);
    };
  }, [timer, props.gameLoop, props.gameOver]);

  return <div>{timer}</div>;
};

export default withStyles(styles)(Timer);
