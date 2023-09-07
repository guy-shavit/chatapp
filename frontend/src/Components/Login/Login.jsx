import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./Login.css"; // Create this CSS file for custom styling
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import LoginRequests from "../../Services/login.service";
import { useState } from "react";
import { SERVER_URL } from "../../Websocket/socket.js";

const loginRequest = new LoginRequests(SERVER_URL);

const Login = ({ routeNavigator }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  return (
    <div className="login-container">
      <Form className="login-form">
        <Form.Label style={{ fontSize: "30px" }}>Login</Form.Label>

        <Form.Group controlId="formBasicEmail">
          <Form.Label>Username</Form.Label>
          <Form.Control
            placeholder="Enter username"
            onChange={(e) => setUsername(e.target.value)}
          />
        </Form.Group>

        <Form.Group controlId="formBasicPassword">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            placeholder="Password"
            onChange={(e) => setPassword(e.target.value)}
          />
        </Form.Group>

        <Button
          variant="primary"
          onClick={async () => {
            const res = await loginRequest.login(username, password);

            if (res.statusCode === 200) {
              document.title = username;
              routeNavigator("/chats", {
                state: {
                  username: username,
                  bearerToken: res.access_token,
                },
              });
            } else {
              alert("Username or password is wrong!!");
            }
          }}
        >
          Submit
        </Button>

        <Form.Group controlId="formBasicCheckbox">
          <Form.Label>
            Don't have an account?{" "}
            <a href={"http://localhost:3000/signUp"}>Sign Up</a>
          </Form.Label>
        </Form.Group>
      </Form>
    </div>
  );
};

export default Login;
