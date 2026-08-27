import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShieldHalved, faLock } from "@fortawesome/free-solid-svg-icons";
import {
  faFacebookF,
  faGoogle,
  faInstagram,
} from "@fortawesome/free-brands-svg-icons";

export const Login = (props) => {
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [keepSignedIn, setKeepSignedIn] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    if (!email || !pass) {
      setErrorMessage("Please enter both email and password.");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch("http://localhost:8000/api/v1/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email,
          password: pass,
          keepSignedIn: keepSignedIn,
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        sessionStorage.setItem("token", data.token);
        sessionStorage.setItem("user", JSON.stringify(data.user));

        if (props.onFormSwitch) {
          props.onFormSwitch("home");
        }
      } else {
        setErrorMessage(data.message || "Invalid email or password.");
      }
    } catch (error) {
      console.error("Login Error:", error);
      setErrorMessage("Unable to connect to server. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.pageContainer}>
      <div style={styles.card}>
        {/* Header / Branding */}
        <div style={styles.brandHeader}>
          <h1 style={styles.brandTitle}>Banking</h1>
          <p style={styles.subtitle}>
            Enter your details to access your account
          </p>
        </div>

        {/* Error Alert */}
        {errorMessage && (
          <div style={styles.alertError} role="alert">
            {errorMessage}
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.inputGroup}>
            <label style={styles.label} htmlFor="email">
              Username or Email
            </label>
            <input
              style={styles.input}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              id="email"
              name="email"
              required
            />
          </div>

          <div style={styles.inputGroup}>
            <div style={styles.labelRow}>
              <label style={styles.label} htmlFor="password">
                Password
              </label>
              <button
                type="button"
                style={styles.inlineLink}
                onClick={() =>
                  props.onFormSwitch && props.onFormSwitch("forgot")
                }
              >
                Forgot?
              </button>
            </div>
            <input
              style={styles.input}
              value={pass}
              onChange={(e) => setPass(e.target.value)}
              type="password"
              id="password"
              name="password"
              placeholder="••••••••"
              required
            />
          </div>

          {/* Keep Signed In & Options */}
          <div style={styles.checkboxRow}>
            <label style={styles.checkboxLabel}>
              <input
                type="checkbox"
                checked={keepSignedIn}
                onChange={(e) => setKeepSignedIn(e.target.checked)}
                style={styles.checkbox}
              />
              Keep me signed in
            </label>
          </div>

          {/* Submit Button */}
          <button type="submit" disabled={loading} style={styles.submitBtn}>
            {loading ? (
              "Authenticating..."
            ) : (
              <>
                <FontAwesomeIcon icon={faLock} style={{ marginRight: "8px" }} />
                Sign In
              </>
            )}
          </button>
        </form>

        {/* Switch to Register */}
        <div style={styles.registerPrompt}>
          Don't have an account?{" "}
          <button
            style={styles.linkButton}
            onClick={() => props.onFormSwitch && props.onFormSwitch("register")}
          >
            Create an account
          </button>
        </div>

        {/* Divider */}
        <div style={styles.dividerContainer}>
          <div style={styles.dividerLine} />
          <span style={styles.dividerText}>or continue with</span>
          <div style={styles.dividerLine} />
        </div>

        {/* Social Logins */}
        <div style={styles.socialContainer}>
          <button style={styles.socialBtn} title="Sign in with Google">
            <FontAwesomeIcon icon={faGoogle} style={{ color: "#EA4335" }} />
          </button>
          <button style={styles.socialBtn} title="Sign in with Facebook">
            <FontAwesomeIcon icon={faFacebookF} style={{ color: "#1877F2" }} />
          </button>
          <button style={styles.socialBtn} title="Sign in with Instagram">
            <FontAwesomeIcon icon={faInstagram} style={{ color: "#E4405F" }} />
          </button>
        </div>
      </div>
    </div>
  );
};

const styles = {
  pageContainer: {
    minHeight: "100vh",
    width: "100%",
    backgroundColor: "#F8FAFC",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontFamily:
      '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
    padding: "20px",
    boxSizing: "border-box",
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: "12px",
    boxShadow:
      "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
    border: "1px solid #E2E8F0",
    width: "100%",
    maxWidth: "420px",
    padding: "36px 32px",
    boxSizing: "border-box",
  },
  brandHeader: {
    textAlign: "center",
    marginBottom: "24px",
  },
  logoIcon: {
    width: "48px",
    height: "48px",
    backgroundColor: "#F1F5F9",
    borderRadius: "50%",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: "12px",
  },
  brandTitle: {
    margin: "0",
    fontSize: "22px",
    fontWeight: "700",
    color: "#0F172A",
    letterSpacing: "-0.02em",
  },
  subtitle: {
    margin: "6px 0 0 0",
    fontSize: "14px",
    color: "#64748B",
  },
  alertError: {
    backgroundColor: "#FEF2F2",
    color: "#991B1B",
    border: "1px solid #FCA5A5",
    padding: "10px 12px",
    borderRadius: "6px",
    fontSize: "13px",
    marginBottom: "20px",
    textAlign: "center",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "16px",
  },
  inputGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "6px",
  },
  labelRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  label: {
    fontSize: "13px",
    fontWeight: "600",
    color: "#334155",
  },
  input: {
    width: "100%",
    padding: "10px 12px",
    borderRadius: "6px",
    border: "1px solid #CBD5E1",
    fontSize: "14px",
    color: "#0F172A",
    outline: "none",
    boxSizing: "border-box",
    transition: "border-color 0.2s ease",
  },
  checkboxRow: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: "2px",
  },
  checkboxLabel: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    fontSize: "13px",
    color: "#475569",
    cursor: "pointer",
  },
  checkbox: {
    accentColor: "#0F172A",
    width: "15px",
    height: "15px",
    cursor: "pointer",
  },
  inlineLink: {
    background: "none",
    border: "none",
    color: "#2563EB",
    fontSize: "12px",
    fontWeight: "500",
    cursor: "pointer",
    padding: 0,
  },
  submitBtn: {
    marginTop: "8px",
    width: "100%",
    backgroundColor: "#0F172A",
    color: "#FFFFFF",
    padding: "12px",
    borderRadius: "6px",
    border: "none",
    fontSize: "14px",
    fontWeight: "600",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "background-color 0.2s ease",
  },
  registerPrompt: {
    textAlign: "center",
    marginTop: "20px",
    fontSize: "13px",
    color: "#64748B",
  },
  linkButton: {
    background: "none",
    border: "none",
    color: "#2563EB",
    fontSize: "13px",
    fontWeight: "600",
    cursor: "pointer",
    padding: 0,
    marginLeft: "4px",
  },
  dividerContainer: {
    display: "flex",
    alignItems: "center",
    margin: "24px 0",
  },
  dividerLine: {
    flex: 1,
    height: "1px",
    backgroundColor: "#E2E8F0",
  },
  dividerText: {
    padding: "0 10px",
    fontSize: "12px",
    color: "#94A3B8",
    textTransform: "lowercase",
  },
  socialContainer: {
    display: "flex",
    justifyContent: "center",
    gap: "12px",
  },
  socialBtn: {
    width: "44px",
    height: "44px",
    borderRadius: "8px",
    border: "1px solid #E2E8F0",
    backgroundColor: "#FFFFFF",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "16px",
    cursor: "pointer",
    transition: "background-color 0.2s ease, border-color 0.2s ease",
  },
};
