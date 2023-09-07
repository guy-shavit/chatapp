import "bootstrap/dist/css/bootstrap.min.css";
import "./Login.css";
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
    <Form className="p-4">
      <Form.Label
        style={{ fontSize: "30px", left: "30%", position: "relative" }}
      >
        Login
      </Form.Label>

      <Form.Group className="mb-3" controlId="formBasicEmail">
        <Form.Label>Username</Form.Label>
        <Form.Control
          placeholder="Enter username"
          onChange={(e) => setUsername(e.target.value)}
        />
      </Form.Group>

      <Form.Group className="mb-3" controlId="formBasicPassword">
        <Form.Label>Password</Form.Label>
        <Form.Control
          type="password"
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
        />
      </Form.Group>

      <Button
        variant="primary"
        style={{ left: "33%", position: "relative" }}
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
            alert("username or password are wrong!!");
          }
        }}
      >
        Submit
      </Button>

      <Form.Group className="mb-3" controlId="formBasicCheckbox">
        <Form.Label>
          Dont have an account?{" "}
          {<a href={"http://localhost:3000/signUp"}>Sign Up</a>}
        </Form.Label>
      </Form.Group>
    </Form>
  );
};

export default Login;
