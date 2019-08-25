import React from "react";
import Game from "./components/Game";
import { withStyles } from "@material-ui/styles";

const styles = () => ({
  container: { display: "flex", justifyContent: "center" }
});

interface Props {
  classes: any;
}
const App = (props: Props) => {
  const { classes } = props;
  return (
    <div className={classes.container}>
      <Game />
    </div>
  );
};

export default withStyles(styles)(App);
