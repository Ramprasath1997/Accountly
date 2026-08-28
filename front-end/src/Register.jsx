import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUserPlus,
  faShieldHalved,
  faEye,
  faEyeSlash,
} from "@fortawesome/free-solid-svg-icons";

export const Register = (props) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [confirmPass, setConfirmPass] = useState("");

  // Password visibility
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [loading, setLoading] = useState(false);

  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // Field validation errors
  const [nameError, setNameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");

  // =========================
  // NAME VALIDATION
  // =========================

  const validateName = (value) => {
    const trimmedName = value.trim();

    if (!trimmedName) {
      return "Full name is required.";
    }

    if (trimmedName.length < 2) {
      return "Full name must be at least 2 characters.";
    }

    if (trimmedName.length > 100) {
      return "Full name cannot exceed 100 characters.";
    }

    // Allows letters, spaces, hyphens and apostrophes
    const nameRegex = /^[A-Za-zÀ-ÖØ-öø-ÿ' -]+$/;

    if (!nameRegex.test(trimmedName)) {
      return "Full name can contain only letters, spaces, hyphens and apostrophes.";
    }

    return "";
  };

  // =========================
  // EMAIL VALIDATION
  // =========================

  const validateEmail = (value) => {
    const trimmedEmail = value.trim();

    if (!trimmedEmail) {
      return "Email address is required.";
    }

    if (trimmedEmail.length > 254) {
      return "Email address is too long.";
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

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

    if (value.length < 8) {
      return "Password must be at least 8 characters.";
    }

    if (value.length > 100) {
      return "Password cannot exceed 100 characters.";
    }

    // Prevent passwords consisting only of spaces
    if (!/\S/.test(value)) {
      return "Password cannot contain only spaces.";
    }

    return "";
  };

  // =========================
  // CONFIRM PASSWORD
  // =========================

  const validateConfirmPassword = (value, password) => {
    if (!value) {
      return "Please confirm your password.";
    }

    if (value !== password) {
      return "Passwords do not match.";
    }

    return "";
  };

  // =========================
  // NAME CHANGE
  // =========================

  const handleNameChange = (e) => {
    const value = e.target.value;

    setName(value);

    if (errorMessage) {
      setErrorMessage("");
    }

    if (value.trim()) {
      setNameError(validateName(value));
    } else {
      setNameError("");
    }
  };

  // =========================
  // EMAIL CHANGE
  // =========================

  const handleEmailChange = (e) => {
    const value = e.target.value;

    setEmail(value);

    if (errorMessage) {
      setErrorMessage("");
    }

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

    if (errorMessage) {
      setErrorMessage("");
    }

    if (value) {
      setPasswordError(validatePassword(value));
    } else {
      setPasswordError("");
    }

    // Revalidate confirm password when password changes
    if (confirmPass) {
      setConfirmPasswordError(validateConfirmPassword(confirmPass, value));
    }
  };

  // =========================
  // CONFIRM PASSWORD CHANGE
  // =========================

  const handleConfirmPasswordChange = (e) => {
    const value = e.target.value;

    setConfirmPass(value);

    if (errorMessage) {
      setErrorMessage("");
    }

    if (value) {
      setConfirmPasswordError(validateConfirmPassword(value, pass));
    } else {
      setConfirmPasswordError("");
    }
  };

  // =========================
  // BLUR VALIDATIONS
  // =========================

  const handleNameBlur = () => {
    if (name.trim()) {
      setNameError(validateName(name));
    }
  };

  const handleEmailBlur = () => {
    if (email.trim()) {
      setEmailError(validateEmail(email));
    }
  };

  const handlePasswordBlur = () => {
    if (pass) {
      setPasswordError(validatePassword(pass));
    }
  };

  const handleConfirmPasswordBlur = () => {
    if (confirmPass) {
      setConfirmPasswordError(validateConfirmPassword(confirmPass, pass));
    }
  };

  // =========================
  // REGISTER
  // =========================

  const handleSubmit = async (e) => {
    e.preventDefault();

    setErrorMessage("");
    setSuccessMessage("");

    // =========================
    // VALIDATE ALL FIELDS
    // =========================

    const nameValidationError = validateName(name);
    const emailValidationError = validateEmail(email);
    const passwordValidationError = validatePassword(pass);
    const confirmPasswordValidationError = validateConfirmPassword(
      confirmPass,
      pass,
    );

    setNameError(nameValidationError);
    setEmailError(emailValidationError);
    setPasswordError(passwordValidationError);
    setConfirmPasswordError(confirmPasswordValidationError);

    // Stop submission if validation fails
    if (
      nameValidationError ||
      emailValidationError ||
      passwordValidationError ||
      confirmPasswordValidationError
    ) {
      return;
    }

    try {
      setLoading(true);

      const response = await fetch("http://localhost:8080/api/auth/register", {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          password: pass,
        }),
      });

      const data = await response.json();

      console.log("Register response:", data);

      // =========================
      // SUCCESS
      // =========================

      if (response.ok && data.token) {
        // Remove old tokens
        localStorage.removeItem("token");
        sessionStorage.removeItem("token");

        // Registration returns JWT
        sessionStorage.setItem("token", data.token);

        setSuccessMessage("Account created successfully.");

        // Go directly to Home
        setTimeout(() => {
          if (props.onFormSwitch) {
            props.onFormSwitch("home");
          }
        }, 500);
      } else {
        setErrorMessage(data.message || "Unable to create your account.");
      }
    } catch (error) {
      console.error("Registration Error:", error);

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
              icon={faShieldHalved}
              style={styles.logoIconStyle}
            />
          </div>

          <h1 style={styles.brandTitle}>Create Account</h1>

          <p style={styles.subtitle}>Create your banking account</p>
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
            SUCCESS
        ========================= */}

        {successMessage && (
          <div style={styles.alertSuccess} role="status">
            {successMessage}
          </div>
        )}

        {/* =========================
            REGISTER FORM
        ========================= */}

        <form
          onSubmit={handleSubmit}
          style={styles.form}
          autoComplete="off"
          noValidate
        >
          {/* =========================
              FULL NAME
          ========================= */}

          <div style={styles.inputGroup}>
            <label htmlFor="register-name" style={styles.label}>
              Full Name
            </label>

            <input
              id="register-name"
              name="name"
              type="text"
              value={name}
              onChange={handleNameChange}
              onBlur={handleNameBlur}
              placeholder="Enter your full name"
              autoComplete="name"
              maxLength={100}
              style={{
                ...styles.input,
                ...(nameError ? styles.inputError : {}),
              }}
              required
            />

            {nameError && <span style={styles.fieldError}>{nameError}</span>}
          </div>

          {/* =========================
              EMAIL
          ========================= */}

          <div style={styles.inputGroup}>
            <label htmlFor="register-email" style={styles.label}>
              Email
            </label>

            <input
              id="register-email"
              name="email"
              type="email"
              value={email}
              onChange={handleEmailChange}
              onBlur={handleEmailBlur}
              placeholder="Enter your email"
              autoComplete="email"
              maxLength={254}
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
            <label htmlFor="register-password" style={styles.label}>
              Password
            </label>

            <div style={styles.passwordWrapper}>
              <input
                id="register-password"
                name="password"
                type={showPassword ? "text" : "password"}
                value={pass}
                onChange={handlePasswordChange}
                onBlur={handlePasswordBlur}
                placeholder="Create a password"
                autoComplete="new-password"
                maxLength={100}
                style={{
                  ...styles.passwordInput,
                  ...(passwordError ? styles.inputError : {}),
                }}
                required
              />

              <button
                type="button"
                onClick={() => setShowPassword((previous) => !previous)}
                style={styles.eyeButton}
                aria-label={showPassword ? "Hide password" : "Show password"}
                title={showPassword ? "Hide password" : "Show password"}
                tabIndex="-1"
              >
                <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
              </button>
            </div>

            {!passwordError && (
              <span style={styles.helperText}>
                Password must contain at least 8 characters.
              </span>
            )}

            {passwordError && (
              <span style={styles.fieldError}>{passwordError}</span>
            )}
          </div>

          {/* =========================
              CONFIRM PASSWORD
          ========================= */}

          <div style={styles.inputGroup}>
            <label htmlFor="register-confirm-password" style={styles.label}>
              Confirm Password
            </label>

            <div style={styles.passwordWrapper}>
              <input
                id="register-confirm-password"
                name="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPass}
                onChange={handleConfirmPasswordChange}
                onBlur={handleConfirmPasswordBlur}
                placeholder="Confirm your password"
                autoComplete="new-password"
                maxLength={100}
                style={{
                  ...styles.passwordInput,
                  ...(confirmPasswordError ? styles.inputError : {}),
                }}
                required
              />

              <button
                type="button"
                onClick={() => setShowConfirmPassword((previous) => !previous)}
                style={styles.eyeButton}
                aria-label={
                  showConfirmPassword
                    ? "Hide confirm password"
                    : "Show confirm password"
                }
                title={showConfirmPassword ? "Hide password" : "Show password"}
                tabIndex="-1"
              >
                <FontAwesomeIcon
                  icon={showConfirmPassword ? faEyeSlash : faEye}
                />
              </button>
            </div>

            {confirmPasswordError && (
              <span style={styles.fieldError}>{confirmPasswordError}</span>
            )}
          </div>

          {/* =========================
              REGISTER BUTTON
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
              "Creating account..."
            ) : (
              <>
                <FontAwesomeIcon icon={faUserPlus} style={styles.buttonIcon} />
                Create Account
              </>
            )}
          </button>
        </form>

        {/* =========================
            LOGIN LINK
        ========================= */}

        <div style={styles.loginPrompt}>
          <span>Already have an account?</span>

          <button
            type="button"
            style={styles.linkButton}
            onClick={() => props.onFormSwitch && props.onFormSwitch("login")}
          >
            Sign in
          </button>
        </div>

        {/* =========================
            SECURITY NOTE
        ========================= */}

        <div style={styles.securityNote}>
          <FontAwesomeIcon icon={faShieldHalved} style={styles.securityIcon} />

          <span>Your information is securely protected</span>
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

  logoIconStyle: {
    color: "#0F172A",
    fontSize: "18px",
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

  alertSuccess: {
    backgroundColor: "#F0FDF4",

    color: "#166534",

    border: "1px solid #86EFAC",

    padding: "10px 12px",

    borderRadius: "6px",

    fontSize: "13px",

    marginBottom: "20px",

    textAlign: "center",
  },

  form: {
    display: "flex",

    flexDirection: "column",

    gap: "15px",
  },

  inputGroup: {
    display: "flex",

    flexDirection: "column",

    gap: "6px",
  },

  label: {
    fontSize: "13px",

    fontWeight: "600",

    color: "#334155",
  },

  input: {
    width: "100%",

    padding: "11px 12px",

    borderRadius: "6px",

    border: "1px solid #CBD5E1",

    fontSize: "14px",

    color: "#0F172A",

    outline: "none",

    boxSizing: "border-box",

    backgroundColor: "#FFFFFF",

    transition: "border-color 0.2s ease, box-shadow 0.2s ease",
  },

  passwordWrapper: {
    position: "relative",

    width: "100%",
  },

  passwordInput: {
    width: "100%",

    padding: "11px 42px 11px 12px",

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

  fieldError: {
    color: "#DC2626",

    fontSize: "12px",

    marginTop: "1px",

    lineHeight: "1.4",
  },

  helperText: {
    fontSize: "11px",

    color: "#94A3B8",

    marginTop: "1px",
  },

  submitBtn: {
    marginTop: "7px",

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

  loginPrompt: {
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
