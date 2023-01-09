import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import CircularProgress from "@mui/material/CircularProgress";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    height: "100%",
    width: "100%",
    position: "absolute",
    top: 0,
    left: 0,
    backgroundColor: "rgba(255, 255, 255, 0.5)",
  },
}));

function CircularProgressOverlay({ progress }) {
  const classes = useStyles();

  return (
    <div>
      <div className={classes.root}>
        <CircularProgress
          variant="determinate"
          thickness={2}
          style={{ width: "150px", height: "150px", color: "#1f366b" }}
          value={progress}
        />
      </div>
      <h1 className="progress-value">{progress}%</h1>
    </div>
  );
}

export default CircularProgressOverlay;
