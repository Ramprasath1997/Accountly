import React, { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import "./App.css";

import { Login } from "./Login";
import { Register } from "./Register";
import {Home} from "./Home"

function App() {
  const [currentForm, setCurrentForm] = useState("login");
  const [loading, setLoading] = useState(true);

  // =========================
  // LOGOUT
  // =========================
  const handleLogout = () => {
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("user");

    localStorage.removeItem("token");
    localStorage.removeItem("user");

    setCurrentForm("login");
  };

  // =========================
  // GET STORED TOKEN
  // =========================
  const getToken = () => {
    return (
      localStorage.getItem("token") ||
      sessionStorage.getItem("token")
    );
  };

  // =========================
  // CHECK JWT ON APP LOAD
  // =========================
  useEffect(() => {
    const checkTokenSession = () => {
      const token = getToken();

      // No token
      if (!token) {
        setCurrentForm("login");
        setLoading(false);
        return;
      }

      try {
        const decoded = jwtDecode(token);

        const currentTime = Date.now() / 1000;

        // Token has not expired
        if (decoded.exp && decoded.exp > currentTime) {
          setCurrentForm("home");
        } else {
          console.warn("Token expired.");

          localStorage.removeItem("token");
          sessionStorage.removeItem("token");

          setCurrentForm("login");
        }
      } catch (error) {
        console.error("Invalid JWT token:", error);

        localStorage.removeItem("token");
        sessionStorage.removeItem("token");

        setCurrentForm("login");
      }

      setLoading(false);
    };

    checkTokenSession();
  }, []);

  // =========================
  // SWITCH LOGIN / REGISTER
  // =========================
  const toggleForm = (formName) => {
    setCurrentForm(formName);
  };

  // =========================
  // LOADING
  // =========================
  if (loading) {
    return (
      <div className="app-loading">
        Loading...
      </div>
    );
  }

  // =========================
  // AUTHENTICATION PAGES
  // =========================
  if (
    currentForm === "login" ||
    currentForm === "register"
  ) {
    return (
      <div className="App">

        {currentForm === "login" ? (
          <Login
            onFormSwitch={toggleForm}
          />
        ) : (
          <Register
            onFormSwitch={toggleForm}
          />
        )}

      </div>
    );
  }

  // =========================
  // AUTHENTICATED USER
  // =========================
  return (
    <Home
      onLogout={handleLogout}
    />
  );
}

export default App;