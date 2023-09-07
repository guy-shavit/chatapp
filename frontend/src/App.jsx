import { Routes, Route, useNavigate } from "react-router-dom";
import Login from "./Components/Login/Login";
import Chats from "./Components/Chats/Chats";
import SignUp from "./Components/SignUp/SignUp";
import "./App.css";

function App() {
  const navigate = useNavigate();

  return (
    <Routes>
      <Route path="/" element={<Login routeNavigator={navigate} />} />{" "}
      {/* login page*/}
      <Route path="/chats" element={<Chats routeNavigator={navigate} />} />
      <Route path="/signUp" element={<SignUp routeNavigator={navigate} />} />
    </Routes>
  );
}

export default App;
