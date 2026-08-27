import React, { useState } from "react";

export const Register = (props) => {
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage(""); // Clear previous errors

    if (!name || !email || !pass) {
      setErrorMessage("Please fill in all fields.");
      return;
    }

    try {
      setLoading(true);

      // Make API POST request to your Express backend
      const response = await fetch("http://localhost:8000/api/v1/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: name,
          email: email,
          password: pass,
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        // Save session token & user info in sessionStorage
        sessionStorage.setItem("token", data.token);
        sessionStorage.setItem("user", JSON.stringify(data.user));

        alert("Registration Successful!");
        props.onFormSwitch("login"); // Redirect to login or home dashboard
      } else {
        // Show error message returned by backend (e.g. "User already exists")
        setErrorMessage(data.message || "Registration failed. Try again.");
      }
    } catch (error) {
      console.error("Register Error:", error);
      setErrorMessage("Unable to connect to server. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-form-container">
      <h2>Register</h2>

      {/* Render Dynamic Error Alert */}
      {errorMessage && (
        <div
          className="alert alert-danger p-2 small my-2 text-center"
          role="alert"
          style={{ color: "red" }}
        >
          {errorMessage}
        </div>
      )}

      <form className="register-form" onSubmit={handleSubmit}>
        <label htmlFor="name">Full name</label>
        <input
          value={name}
          name="name"
          onChange={(e) => setName(e.target.value)}
          id="name"
          placeholder="Full Name"
          required
        />

        <label htmlFor="email">Email</label>
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          type="email"
          placeholder="youremail@gmail.com"
          id="email"
          name="email"
          required
        />

        <label htmlFor="password">Password</label>
        <input
          value={pass}
          onChange={(e) => setPass(e.target.value)}
          type="password"
          placeholder="********"
          id="password"
          name="password"
          required
        />

        <button type="submit" disabled={loading}>
          {loading ? "Registering..." : "Register"}
        </button>
      </form>

      <button className="link-btn" onClick={() => props.onFormSwitch("login")}>
        Already have an account? Login here.
      </button>
    </div>
  );
};