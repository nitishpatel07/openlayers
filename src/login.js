import React from "react";
import "./map.css";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Logo from "./logo.svg";
import { Link } from "react-router-dom";

export const Login = () => {
  return (
    <div className="login-box">
      <div
        className="login-box-left"
        style={{ width: "50%", backgroundColor: "#1c2d41" }}
      >
        <img src={Logo} alt="Logo" className="big-logo" />
      </div>
      <div className="login-box-right" style={{ width: "50%" }}>
        <div className="login-form">
          <div className="input-form-heading">
            <h2 style={{ margin: "0px", display: "flex" }}>
              Welcome to Attentive
            </h2>
            <p style={{ margin: "0px", fontSize: "17px", color: "gray" }}>
              Please enter email id and password
            </p>
          </div>

          <form style={{ textAlign: "center" }}>
            <label className="gap">
              <TextField
                label="Email"
                type="text"
                name="email"
                style={{ backgroundColor: "white" }}
                size="small"
              />
            </label>
            <label className="gap">
              <TextField
                label="Password"
                type="text"
                name="password"
                style={{ backgroundColor: "white" }}
                size="small"
              />
            </label>
            <Link to="/test">
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
                Login
              </Button>
            </Link>
          </form>
        </div>
      </div>
    </div>
  );
};
