import React, { useState, useEffect } from "react";
import "./map.css";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Logo from "./logo.svg";
import { useHistory } from "react-router-dom";
import { Link } from "react-router-dom";

export const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // const [condition, setCondition] = useState(null);

  const handleSubmit = (event) => {
    event.preventDefault();
    setEmail(event.target.email.value);
    setPassword(event.target.password.value);
    event.target.reset();
  };
  // useEffect(() => {}, [email]);
  let condition = email === "test@attentive.ai" && password === "12345";
  console.log(condition);
  // setCondition(condition);

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

          <form onSubmit={handleSubmit} style={{ textAlign: "center" }}>
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
                type="password"
                name="password"
                style={{ backgroundColor: "white" }}
                size="small"
              />
            </label>

            <Link to={condition ? "/test" : "/test"}>
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
