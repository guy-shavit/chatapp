import "bootstrap/dist/css/bootstrap.min.css";
import "./SignUp.css";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import SignUpRequests from "../../Services/signUp.service";
import { useState } from "react";
import { SERVER_URL } from "../../Websocket/socket.js";
import "./SignUp.css";


const signUpRequest = new SignUpRequests(SERVER_URL);

const SignUp = ({ routeNavigator }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isMatchingPassword, setIsMatchingPassword] = useState(false);

  return (
    <div className="login-container">
    <Form className="login-form">
    <Form className="p-4" onSubmit={(event) => {
        event.preventDefault();
    }}>
      <Form.Label
        style={{ fontSize: "30px", left: "30%", position: "relative" }}
      >
        SignUp
      </Form.Label>

      <Form.Group className="mb-3" controlId="formBasicEmail">
        <Form.Label>Username</Form.Label>
        <Form.Control
          required
          placeholder="Enter username"
          minLength="3"
          onChange={(e) => setUsername(e.target.value)}
        />
      </Form.Group>

      <Form.Group className="mb-3" controlId="formBasicPassword">
        <Form.Label>Password</Form.Label>
        <Form.Control
          required
          type="password"
          minLength="8"
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
        />
      </Form.Group>

      <Form.Group className="mb-3" controlId="formBasicPassword2">
        <Form.Label>Verify Password</Form.Label>
        <Form.Control
          required
          className="shadow-none"
          type="password"
          minLength="8"
          placeholder="Password"
          style={{
            borderWidth: "2px",
          }}
          onChange={(e) => {
            let element = e.target;

            if (element.value !== password) {
              element.style.borderColor = "red";

              setIsMatchingPassword(false);
            } else {
              setIsMatchingPassword(true);
              
              element.style.borderColor = "green";
            }
          }}
        />
      </Form.Group>

      <Button
        variant="primary"
        style={{ left: "33%", position: "relative" }}
        type="submit"
        onClick={async () => {
          if (!isMatchingPassword) {
            return;
          }

          let result = await signUpRequest.signUp(username, password);
          if (result.statusCode === 409) {
              alert(result.message);
              return ;
          }
          routeNavigator('/');

        }}
      >
        Submit
      </Button>

      <Form.Group className="mb-3" controlId="formBasicCheckbox">
        <Form.Label>
          Already have an account?{" "}
          {<a href={"http://localhost:3000/"}>Login</a>}
        </Form.Label>
      </Form.Group>
    </Form>
    </Form>
    </div>
  );
};

export default SignUp;
