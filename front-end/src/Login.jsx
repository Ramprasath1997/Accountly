import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBuildingColumns,
  faRightToBracket,
  faShieldHalved,
  faEye,
  faEyeSlash,
} from "@fortawesome/free-solid-svg-icons";

export const Login = (props) => {
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");

  const [showPassword, setShowPassword] = useState(false);

  const [keepSignedIn, setKeepSignedIn] = useState(false);
  const [loading, setLoading] = useState(false);

  const [errorMessage, setErrorMessage] = useState("");

  // Field-level validation errors
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  // Prevent browser autofill until user clicks the field
  const [emailEditable, setEmailEditable] = useState(false);
  const [passwordEditable, setPasswordEditable] = useState(false);

  // =========================
  // EMAIL VALIDATION
  // =========================
  const validateEmail = (value) => {
    const trimmedEmail = value.trim();

    if (!trimmedEmail) {
      return "Email address is required.";
    }

    // Professional/basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(trimmedEmail)) {
      return "Please enter a valid email address.";
    }

    return "";
  };

  // =========================
  // PASSWORD VALIDATION
  // =========================
  const validatePassword = (value) => {
    if (!value) {
      return "Password is required.";
    }

    if (value.length < 6) {
      return "Password must be at least 6 characters.";
    }

    if (value.length > 100) {
      return "Password cannot exceed 100 characters.";
    }

    return "";
  };

  // =========================
  // EMAIL CHANGE
  // =========================
  const handleEmailChange = (e) => {
    const value = e.target.value;

    setEmail(value);

    // Clear general API error when user starts correcting
    if (errorMessage) {
      setErrorMessage("");
    }

    // Validate while typing only after something has been entered
    if (value.trim()) {
      setEmailError(validateEmail(value));
    } else {
      setEmailError("");
    }
  };

  // =========================
  // PASSWORD CHANGE
  // =========================
  const handlePasswordChange = (e) => {
    const value = e.target.value;

    setPass(value);

    // Clear general API error when user starts correcting
    if (errorMessage) {
      setErrorMessage("");
    }

    // Validate while typing only after something has been entered
    if (value) {
      setPasswordError(validatePassword(value));
    } else {
      setPasswordError("");
    }
  };

  // =========================
  // EMAIL BLUR
  // =========================
  const handleEmailBlur = () => {
    if (email.trim()) {
      setEmailError(validateEmail(email));
    }
  };

  // =========================
  // PASSWORD BLUR
  // =========================
  const handlePasswordBlur = () => {
    if (pass) {
      setPasswordError(validatePassword(pass));
    }
  };

  // =========================
  // LOGIN
  // =========================
  const handleSubmit = async (e) => {
    e.preventDefault();

    setErrorMessage("");

    // Validate fields
    const emailValidationError = validateEmail(email);
    const passwordValidationError = validatePassword(pass);

    setEmailError(emailValidationError);
    setPasswordError(passwordValidationError);

    // Stop if validation fails
    if (emailValidationError || passwordValidationError) {
      return;
    }

    try {
      setLoading(true);

      const response = await fetch("http://localhost:8080/api/auth/login", {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          email: email.trim(),
          password: pass,
        }),
      });

      const data = await response.json();

      console.log("Login response:", data);

      // =========================
      // SUCCESS
      // =========================
      if (response.ok && data.token) {
        localStorage.removeItem("token");
        sessionStorage.removeItem("token");

        if (keepSignedIn) {
          localStorage.setItem("token", data.token);
        } else {
          sessionStorage.setItem("token", data.token);
        }

        // Login successful
        if (props.onFormSwitch) {
          props.onFormSwitch("home");
        }
      } else {
        setErrorMessage(data.message || "Invalid email or password.");
      }
    } catch (error) {
      console.error("Login Error:", error);

      setErrorMessage(
        "Unable to connect to the server. Please make sure the backend is running.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.pageContainer}>
      <div style={styles.card}>
        {/* =========================
            HEADER
        ========================= */}

        <div style={styles.brandHeader}>
          <div style={styles.logoIcon}>
            <FontAwesomeIcon
              icon={faBuildingColumns}
              style={styles.logoIconStyle}
            />
          </div>

          <h1 style={styles.brandTitle}>Accountly</h1>

          <p style={styles.subtitle}>Secure banking, made simple</p>
        </div>

        {/* =========================
            ERROR
        ========================= */}

        {errorMessage && (
          <div style={styles.alertError} role="alert">
            {errorMessage}
          </div>
        )}

        {/* =========================
            LOGIN FORM
        ========================= */}

        <form
          onSubmit={handleSubmit}
          style={styles.form}
          autoComplete="off"
          noValidate
        >
          {/* =========================
              EMAIL
          ========================= */}

          <div style={styles.inputGroup}>
            <label htmlFor="accountly-email" style={styles.label}>
              Email
            </label>

            <input
              id="accountly-email"
              type="email"
              /*
               * Deliberately use a non-standard name
               * to reduce browser autofill detection.
               */
              name="accountly-user-input"
              value={email}
              onChange={handleEmailChange}
              onFocus={() => setEmailEditable(true)}
              onBlur={handleEmailBlur}
              placeholder="Enter your email address"
              autoComplete="off"
              autoCorrect="off"
              autoCapitalize="none"
              spellCheck="false"
              readOnly={!emailEditable}
              style={{
                ...styles.input,
                ...(emailError ? styles.inputError : {}),
              }}
              required
            />

            {emailError && <span style={styles.fieldError}>{emailError}</span>}
          </div>

          {/* =========================
              PASSWORD
          ========================= */}

          <div style={styles.inputGroup}>
            <label htmlFor="accountly-password" style={styles.label}>
              Password
            </label>

            <div style={styles.passwordWrapper}>
              <input
                id="accountly-password"
                type={showPassword ? "text" : "password"}
                /*
                 * Deliberately use a non-standard name
                 * to reduce browser autofill detection.
                 */
                name="accountly-secret-input"
                value={pass}
                onChange={handlePasswordChange}
                onFocus={() => setPasswordEditable(true)}
                onBlur={handlePasswordBlur}
                placeholder="Enter your password"
                autoComplete="new-password"
                readOnly={!passwordEditable}
                style={{
                  ...styles.passwordInput,
                  ...(passwordError ? styles.inputError : {}),
                }}
                required
              />

              {/* SHOW / HIDE PASSWORD */}

              <button
                type="button"
                onClick={() => setShowPassword((previous) => !previous)}
                style={styles.eyeButton}
                aria-label={showPassword ? "Hide password" : "Show password"}
                title={showPassword ? "Hide password" : "Show password"}
                /*
                 * Prevent the button from
                 * receiving keyboard focus.
                 */
                tabIndex="-1"
              >
                <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
              </button>
            </div>

            {passwordError && (
              <span style={styles.fieldError}>{passwordError}</span>
            )}
          </div>

          {/* =========================
              KEEP SIGNED IN
          ========================= */}

          <div style={styles.checkboxRow}>
            <label style={styles.checkboxLabel}>
              <input
                type="checkbox"
                checked={keepSignedIn}
                onChange={(e) => setKeepSignedIn(e.target.checked)}
                style={styles.checkbox}
              />

              <span>Keep me signed in</span>
            </label>
          </div>

          {/* =========================
              SIGN IN
          ========================= */}

          <button
            type="submit"
            disabled={loading}
            style={{
              ...styles.submitBtn,
              ...(loading ? styles.submitBtnDisabled : {}),
            }}
          >
            {loading ? (
              "Signing in..."
            ) : (
              <>
                <FontAwesomeIcon
                  icon={faRightToBracket}
                  style={styles.buttonIcon}
                />
                Sign In
              </>
            )}
          </button>
        </form>

        {/* =========================
            SIGN UP
        ========================= */}

        <div style={styles.registerPrompt}>
          <span>Don't have an account?</span>

          <button
            type="button"
            style={styles.linkButton}
            onClick={() => props.onFormSwitch && props.onFormSwitch("register")}
          >
            Sign up
          </button>
        </div>

        {/* =========================
            SECURITY FOOTER
        ========================= */}

        <div style={styles.securityNote}>
          <FontAwesomeIcon icon={faShieldHalved} style={styles.securityIcon} />

          <span>Your financial information is protected</span>
        </div>
      </div>
    </div>
  );
};

// =====================================================
// STYLES
// =====================================================

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
    width: "100%",
    maxWidth: "420px",

    backgroundColor: "#FFFFFF",

    borderRadius: "12px",

    border: "1px solid #E2E8F0",

    boxShadow:
      "0 10px 15px -3px rgba(0,0,0,0.08), 0 4px 6px -2px rgba(0,0,0,0.04)",

    padding: "36px 32px",

    boxSizing: "border-box",
  },

  brandHeader: {
    textAlign: "center",
    marginBottom: "26px",
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

  logoIconStyle: {
    color: "#0F172A",
    fontSize: "19px",
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

    gap: "7px",
  },

  label: {
    fontSize: "13px",

    fontWeight: "600",

    color: "#334155",
  },

  input: {
    width: "100%",

    padding: "12px",

    borderRadius: "6px",

    border: "1px solid #CBD5E1",

    fontSize: "14px",

    color: "#0F172A",

    outline: "none",

    boxSizing: "border-box",

    backgroundColor: "#FFFFFF",

    transition: "border-color 0.2s ease, box-shadow 0.2s ease",
  },

  // Password input has extra right padding
  // so text doesn't overlap the eye icon.
  passwordWrapper: {
    position: "relative",

    width: "100%",
  },

  passwordInput: {
    width: "100%",

    padding: "12px 42px 12px 12px",

    borderRadius: "6px",

    border: "1px solid #CBD5E1",

    fontSize: "14px",

    color: "#0F172A",

    outline: "none",

    boxSizing: "border-box",

    backgroundColor: "#FFFFFF",

    transition: "border-color 0.2s ease, box-shadow 0.2s ease",
  },

  inputError: {
    border: "1px solid #DC2626",

    boxShadow: "0 0 0 1px rgba(220, 38, 38, 0.05)",
  },

  fieldError: {
    color: "#DC2626",

    fontSize: "12px",

    marginTop: "1px",
  },

  eyeButton: {
    position: "absolute",

    right: "10px",

    top: "50%",

    transform: "translateY(-50%)",

    background: "none",

    border: "none",

    padding: "6px",

    color: "#64748B",

    cursor: "pointer",

    fontSize: "14px",

    display: "flex",

    alignItems: "center",

    justifyContent: "center",

    borderRadius: "4px",

    transition: "color 0.2s ease, background-color 0.2s ease",
  },

  checkboxRow: {
    display: "flex",

    alignItems: "center",

    marginTop: "0",
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

  submitBtn: {
    marginTop: "6px",

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

    transition: "all 0.2s ease",
  },

  submitBtnDisabled: {
    opacity: 0.7,

    cursor: "not-allowed",
  },

  buttonIcon: {
    marginRight: "8px",
  },

  registerPrompt: {
    display: "flex",

    justifyContent: "center",

    alignItems: "center",

    gap: "4px",

    marginTop: "22px",

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

    padding: "2px 0",
  },

  securityNote: {
    display: "flex",

    alignItems: "center",

    justifyContent: "center",

    gap: "6px",

    marginTop: "24px",

    paddingTop: "18px",

    borderTop: "1px solid #F1F5F9",

    fontSize: "11px",

    color: "#94A3B8",
  },

  securityIcon: {
    fontSize: "10px",
  },
};
