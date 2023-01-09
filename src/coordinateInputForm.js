import React from "react";
import { MyContext } from "./testMap";
import "./map.css";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";

const CoordinateInputForm = () => {
  const { coordinates, setCoordinates } = React.useContext(MyContext);

  const convertToNumericArray = (inputString) => {
    return inputString.split(",").map((x) => parseFloat(x));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setCoordinates([
      convertToNumericArray(event.target.coord1.value),
      convertToNumericArray(event.target.coord2.value),
      convertToNumericArray(event.target.coord3.value),
      convertToNumericArray(event.target.coord4.value),
    ]);
    event.target.reset();
  };

  return (
    <div className="input-form">
      <div className="input-form-heading">
        <h3 style={{ margin: "0px", display: "flex" }}>
          <LocationOnIcon style={{ transform: "scale(.95)" }} />
          Input Coordinates
        </h3>
        <p style={{ margin: "0px", fontSize: "17px", color: "gray" }}>
          enter all the four co-ordinates in format of (lat,lon)
        </p>
      </div>

      <form onSubmit={handleSubmit} style={{ textAlign: "center" }}>
        <label className="gap">
          <TextField
            label="Bottom Left"
            type="text"
            name="coord1"
            style={{ backgroundColor: "white" }}
            size="small"
          />
        </label>
        <label className="gap">
          <TextField
            label="Bottom Right"
            type="text"
            name="coord2"
            style={{ backgroundColor: "white" }}
            size="small"
          />
        </label>
        <label className="gap">
          <TextField
            label="Top Right"
            type="text"
            name="coord3"
            style={{ backgroundColor: "white" }}
            size="small"
          />
        </label>
        <label className="gap">
          <TextField
            label="Top Left"
            type="text"
            name="coord4"
            style={{ backgroundColor: "white" }}
            size="small"
          />
        </label>
        <Button
          variant="contained"
          style={{
            cursor: "pointer",
            backgroundColor: "#6171c7",
            marginTop: "1.25rem",
          }}
          type="submit"
          size="small"
        >
          Submit
        </Button>
      </form>
    </div>
  );
};

export default CoordinateInputForm;
