import React, { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import "./App.css";

import { Login } from "./Login";
import { Register } from "./Register";
import { Home } from "./Home";

function App() {
  const [currentForm, setCurrentForm] = useState("login");
  const [loading, setLoading] = useState(true);

  // Central Logout Handler
  const handleLogout = () => {
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("user");
    setCurrentForm("login");
  };

  // Verify JWT session on app load/refresh
  useEffect(() => {
    const checkTokenSession = () => {
      const token = sessionStorage.getItem("token");

      if (token) {
        try {
          const decoded = jwtDecode(token);
          const currentTime = Date.now() / 1000;

          if (decoded.exp > currentTime) {
            setCurrentForm("home");
          } else {
            console.warn("Token expired. Logging out...");
            handleLogout();
          }
        } catch (error) {
          console.error("Invalid token format:", error);
          handleLogout();
        }
      } else {
        setCurrentForm("login");
      }
      setLoading(false);
    };

    checkTokenSession();
  }, []);

  const toggleForm = (formName) => {
    setCurrentForm(formName);
  };

  if (loading) {
    return <div className="text-center mt-5">Loading session...</div>;
  }

  // 1. Unauthenticated State: Show Login or Register
  if (currentForm === "login" || currentForm === "register") {
    return (
      <div className="App">
        {currentForm === "login" ? (
          <Login onFormSwitch={toggleForm} />
        ) : (
          <Register onFormSwitch={toggleForm} />
        )}
      </div>
    );
  }

  // 2. Authenticated State: Render Home (which wraps Header, Sidebar, Dashboard, Profile, etc.)
  return <Home onLogout={handleLogout} />;
}

export default App;
