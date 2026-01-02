import { useState, useEffect } from "react";
import {
  Routes,
  Route,
  Navigate,
  useNavigate,
  useLocation,
} from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";
import Ducks from "./Ducks";
import Login from "./Login";
import MyProfile from "./MyProfile";
import Register from "./Register";

import AppContext from "../context/AppContext.jsx";
import * as auth from "../utils/auth";
import * as api from "../utils/api";
import { setToken, getToken } from "../utils/token.js";
import { getUserInfo } from "../utils/api.js";
import "./styles/App.css";

function App() {
  // clarifies current user, can send to other pages through props
  const [userData, setUserData] = useState({ username: "", email: "" });
  // state to verify user's auth status, with default of false
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();
  // necessary for redirecting after login
  const location = useLocation();

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
          setToken(data.jwt); // save token to localStorage
          setUserData(data.user); // save user data to state
          setIsLoggedIn(true); // log user in

          const redirectPath = location.state?.from?.pathname || "/ducks";
          navigate(redirectPath); // after auth, redirect to intended page
        }
      })
      .catch(console.error);
  };

  // on page load, checks for token in localStorage
  useEffect(() => {
    const jwt = getToken();

    if (!jwt) {
      return;
    }
    // if jwt present, call function and pass it
    api
      .getUserInfo(jwt)
      .then(({ username, email }) => {
        // If the res is successful, log the user in, save their
        // data to state, and navigate them to /ducks.
        setIsLoggedIn(true);
        setUserData({ username, email });
      })
      .catch(console.error);
  }, []);

  return (
    <AppContext.Provider value={{ isLoggedIn }}>
      <Routes>
        <Route
          path="/ducks"
          element={
            <ProtectedRoute>
              <Ducks setIsLoggedIn={setIsLoggedIn} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/my-profile"
          element={
            <ProtectedRoute>
              <MyProfile userData={userData} setIsLoggedIn={setIsLoggedIn} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/login"
          element={
            <ProtectedRoute anonymous>
              <div className="loginContainer">
                <Login handleLogin={handleLogin} />
              </div>
            </ProtectedRoute>
          }
        />
        <Route
          path="/register"
          element={
            <ProtectedRoute anonymous>
              <div className="registerContainer">
                <Register handleRegistration={handleRegistration} />
              </div>
            </ProtectedRoute>
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
    </AppContext.Provider>
  );
}

export default App;
