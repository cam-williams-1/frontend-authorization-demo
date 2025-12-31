import { useState } from "react";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";
import Ducks from "./Ducks";
import Login from "./Login";
import MyProfile from "./MyProfile";
import Register from "./Register";

import * as auth from "../utils/auth";
import "./styles/App.css";

function App() {
  // clarifies current user, can send to other pages through props
  const [userData, setUserData] = useState({ username: "", email: "" });
  // state to verify user's auth status, with default of false
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const navigate = useNavigate();

  const handleRegistration = ({
    username,
    password,
    email,
    confirmPassword,
  }) => {
    console.log("in handleRegistration");
    if (password === confirmPassword) {
      auth
        .register(username, password, email)
        .then(() => {
          navigate("/login");
        })
        .catch(console.error);
    }
  };

  const handleLogin = ({ username, password }) => {
    if (!username || !password) {
      // If username or password empty, return without sending a request.
      return;
    }
    auth
      .authorize(username, password)
      .then((data) => {
        if (data.jwt) {
          setUserData(data.user); // save user data to state
          setIsLoggedIn(true); // log user in
          navigate("/ducks"); // send them to /ducks
        }
      })
      .catch(console.error);
  };

  return (
    <Routes>
      <Route
        path="/ducks"
        element={
          <ProtectedRoute isLoggedIn={isLoggedIn}>
            <Ducks />
          </ProtectedRoute>
        }
      />
      <Route
        path="/my-profile"
        element={
          <ProtectedRoute isLoggedIn={isLoggedIn}>
            <MyProfile userData={userData} />
          </ProtectedRoute>
        }
      />
      <Route
        path="/login"
        element={
          <div className="loginContainer">
            <Login handleLogin={handleLogin} />
          </div>
        }
      />
      <Route
        path="/register"
        element={
          <div className="registerContainer">
            <Register handleRegistration={handleRegistration} />
          </div>
        }
      />
      <Route // catch-all route
        path="*"
        element={
          isLoggedIn ? (
            <Navigate to="/ducks" replace />
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />{" "}
    </Routes>
  );
}

export default App;
