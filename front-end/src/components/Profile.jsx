import React, { useEffect, useState } from "react";

import {
  Container,
  Row,
  Col,
  Card,
  Badge,
  Button,
  Form,
  Alert,
  Spinner,
} from "react-bootstrap";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import {
  faEye,
  faEyeSlash,
} from "@fortawesome/free-solid-svg-icons";

export const Profile = ({
  loggedInUser,
  onProfileUpdated,
  onLogout,
}) => {
  // =========================
  // EDIT MODE
  // =========================
  const [isEditing, setIsEditing] = useState(false);

  // =========================
  // FORM DATA
  // =========================
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    accountBalance: "",
  });

  // =========================
  // PASSWORD
  // =========================
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] =
    useState("");

  // =========================
  // PASSWORD VISIBILITY
  // =========================
  const [showNewPassword, setShowNewPassword] =
    useState(false);

  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);

  // =========================
  // VALIDATION ERRORS
  // =========================
  const [nameError, setNameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [balanceError, setBalanceError] = useState("");
  const [passwordError, setPasswordError] =
    useState("");
  const [confirmPasswordError, setConfirmPasswordError] =
    useState("");

  // =========================
  // LOADING
  // =========================
  const [loading, setLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] =
    useState(false);

  // =========================
  // MESSAGE
  // =========================
  const [message, setMessage] = useState({
    type: "",
    text: "",
  });

  // =====================================================
  // GET JWT TOKEN
  // =====================================================

  const getToken = () => {
    return (
      localStorage.getItem("token") ||
      sessionStorage.getItem("token")
    );
  };

  // =====================================================
  // LOAD USER DATA
  // =====================================================

  useEffect(() => {
    if (loggedInUser) {
      setFormData({
        name: loggedInUser.name || "",
        email: loggedInUser.email || "",
        accountBalance:
          loggedInUser.accountBalance ?? "",
      });
    }
  }, [loggedInUser]);

  // =====================================================
  // VALIDATE NAME
  // =====================================================

  const validateName = (value) => {
    const trimmedName = value.trim();

    if (!trimmedName) {
      return "Name is required.";
    }

    if (trimmedName.length < 2) {
      return "Name must be at least 2 characters.";
    }

    if (trimmedName.length > 100) {
      return "Name cannot exceed 100 characters.";
    }

    // Letters, spaces, hyphens and apostrophes
    const nameRegex =
      /^[A-Za-zÀ-ÖØ-öø-ÿ' -]+$/;

    if (!nameRegex.test(trimmedName)) {
      return (
        "Name can contain only letters, spaces, " +
        "hyphens and apostrophes."
      );
    }

    return "";
  };

  // =====================================================
  // VALIDATE EMAIL
  // =====================================================

  const validateEmail = (value) => {
    const trimmedEmail = value.trim();

    if (!trimmedEmail) {
      return "Email address is required.";
    }

    if (trimmedEmail.length > 254) {
      return "Email address is too long.";
    }

    const emailRegex =
      /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

    if (!emailRegex.test(trimmedEmail)) {
      return "Please enter a valid email address.";
    }

    return "";
  };

  // =====================================================
  // VALIDATE ACCOUNT BALANCE
  // =====================================================

  const validateBalance = (value) => {
    if (
      value === "" ||
      value === null ||
      value === undefined
    ) {
      return "Account balance is required.";
    }

    const balanceString = String(value).trim();

    if (!balanceString) {
      return "Account balance is required.";
    }

    const balance = Number(balanceString);

    if (!Number.isFinite(balance)) {
      return "Please enter a valid account balance.";
    }

    if (balance < 0) {
      return "Account balance cannot be negative.";
    }

    // Maximum 2 decimal places
    const decimalRegex = /^\d+(\.\d{1,2})?$/;

    if (!decimalRegex.test(balanceString)) {
      return (
        "Account balance can have a maximum of " +
        "2 decimal places."
      );
    }

    // Prevent excessively large values
    if (balance > 999999999999.99) {
      return "Account balance is too large.";
    }

    return "";
  };

  // =====================================================
  // VALIDATE PASSWORD
  // =====================================================

  const validatePassword = (value) => {
    // Password is optional on profile update
    if (!value) {
      return "";
    }

    if (value.length < 8) {
      return "New password must be at least 8 characters.";
    }

    if (value.length > 100) {
      return "New password cannot exceed 100 characters.";
    }

    // Don't allow password consisting only of spaces
    if (!/\S/.test(value)) {
      return "Password cannot contain only spaces.";
    }

    return "";
  };

  // =====================================================
  // VALIDATE CONFIRM PASSWORD
  // =====================================================

  const validateConfirmPassword = (
    value,
    password
  ) => {
    // If no new password is entered,
    // confirmation is not required.
    if (!password) {
      return "";
    }

    if (!value) {
      return "Please confirm your new password.";
    }

    if (value !== password) {
      return "Passwords do not match.";
    }

    return "";
  };

  // =====================================================
  // HANDLE INPUT
  // =====================================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear general message while editing
    if (message.text) {
      setMessage({
        type: "",
        text: "",
      });
    }

    // Validate individual field
    if (name === "name") {
      if (value.trim()) {
        setNameError(validateName(value));
      } else {
        setNameError("");
      }
    }

    if (name === "email") {
      if (value.trim()) {
        setEmailError(validateEmail(value));
      } else {
        setEmailError("");
      }
    }

    if (name === "accountBalance") {
      if (value !== "") {
        setBalanceError(
          validateBalance(value)
        );
      } else {
        setBalanceError("");
      }
    }
  };

  // =====================================================
  // PASSWORD CHANGE
  // =====================================================

  const handlePasswordChange = (e) => {
    const value = e.target.value;

    setNewPassword(value);

    if (message.text) {
      setMessage({
        type: "",
        text: "",
      });
    }

    if (value) {
      setPasswordError(
        validatePassword(value)
      );
    } else {
      setPasswordError("");
    }

    // Revalidate confirmation when password changes
    if (confirmPassword) {
      setConfirmPasswordError(
        validateConfirmPassword(
          confirmPassword,
          value
        )
      );
    } else {
      setConfirmPasswordError("");
    }
  };

  // =====================================================
  // CONFIRM PASSWORD CHANGE
  // =====================================================

  const handleConfirmPasswordChange = (e) => {
    const value = e.target.value;

    setConfirmPassword(value);

    if (message.text) {
      setMessage({
        type: "",
        text: "",
      });
    }

    if (value) {
      setConfirmPasswordError(
        validateConfirmPassword(
          value,
          newPassword
        )
      );
    } else {
      setConfirmPasswordError("");
    }
  };

  // =====================================================
  // BLUR VALIDATION
  // =====================================================

  const handleNameBlur = () => {
    if (formData.name.trim()) {
      setNameError(
        validateName(formData.name)
      );
    }
  };

  const handleEmailBlur = () => {
    if (formData.email.trim()) {
      setEmailError(
        validateEmail(formData.email)
      );
    }
  };

  const handleBalanceBlur = () => {
    if (formData.accountBalance !== "") {
      setBalanceError(
        validateBalance(
          formData.accountBalance
        )
      );
    }
  };

  const handlePasswordBlur = () => {
    if (newPassword) {
      setPasswordError(
        validatePassword(newPassword)
      );
    }
  };

  const handleConfirmPasswordBlur = () => {
    if (confirmPassword) {
      setConfirmPasswordError(
        validateConfirmPassword(
          confirmPassword,
          newPassword
        )
      );
    }
  };

  // =====================================================
  // UPDATE PROFILE
  // =====================================================

  const handleUpdateProfile = async (e) => {
    e.preventDefault();

    setMessage({
      type: "",
      text: "",
    });

    // ===================================================
    // VALIDATE ALL FIELDS
    // ===================================================

    const nameValidationError =
      validateName(formData.name);

    const emailValidationError =
      validateEmail(formData.email);

    const balanceValidationError =
      validateBalance(
        formData.accountBalance
      );

    const passwordValidationError =
      validatePassword(newPassword);

    const confirmPasswordValidationError =
      validateConfirmPassword(
        confirmPassword,
        newPassword
      );

    // Set validation errors
    setNameError(nameValidationError);
    setEmailError(emailValidationError);
    setBalanceError(balanceValidationError);
    setPasswordError(
      passwordValidationError
    );
    setConfirmPasswordError(
      confirmPasswordValidationError
    );

    // ===================================================
    // STOP IF VALIDATION FAILED
    // ===================================================

    if (
      nameValidationError ||
      emailValidationError ||
      balanceValidationError ||
      passwordValidationError ||
      confirmPasswordValidationError
    ) {
      return;
    }

    try {
      setLoading(true);

      const token = getToken();

      if (!token) {
        throw new Error(
          "Authentication token not found. Please login again."
        );
      }

      // =================================================
      // CURRENT USER ENDPOINT
      // =================================================

      const url =
        "http://localhost:8080/api/user/profile";

      // =================================================
      // REQUEST BODY
      // =================================================

      const requestBody = {
        name: formData.name.trim(),
        email: formData.email.trim(),
        accountBalance: Number(
          formData.accountBalance
        ),
      };

      // =================================================
      // SEND PASSWORD ONLY IF PROVIDED
      // =================================================

      if (newPassword) {
        requestBody.password =
          newPassword;
      }

      console.log(
        "Updating current profile:",
        {
          ...requestBody,
          password: requestBody.password
            ? "***"
            : undefined,
        }
      );

      // =================================================
      // API REQUEST
      // =================================================

      const response = await fetch(url, {
        method: "PUT",

        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },

        body: JSON.stringify(requestBody),
      });

      // =================================================
      // HANDLE RESPONSE SAFELY
      // =================================================

      const responseText =
        await response.text();

      let data = {};

      if (responseText) {
        try {
          data = JSON.parse(responseText);
        } catch (parseError) {
          console.error(
            "Invalid JSON response:",
            responseText
          );
        }
      }

      console.log(
        "Profile update response:",
        data
      );

      // =================================================
      // UNAUTHORIZED
      // =================================================

      if (
        response.status === 401 ||
        response.status === 403
      ) {
        throw new Error(
          "You are not authorized. Please login again."
        );
      }

      // =================================================
      // OTHER ERRORS
      // =================================================

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Failed to update profile."
        );
      }

      // =================================================
      // UPDATE HOME STATE
      // =================================================

      if (onProfileUpdated) {
        onProfileUpdated(data);
      }

      // =================================================
      // UPDATE STORED USER
      // =================================================

      sessionStorage.setItem(
        "user",
        JSON.stringify(data)
      );

      if (localStorage.getItem("user")) {
        localStorage.setItem(
          "user",
          JSON.stringify(data)
        );
      }

      // =================================================
      // CLEAR PASSWORD FIELDS
      // =================================================

      setNewPassword("");
      setConfirmPassword("");

      setShowNewPassword(false);
      setShowConfirmPassword(false);

      // Clear validation errors
      setNameError("");
      setEmailError("");
      setBalanceError("");
      setPasswordError("");
      setConfirmPasswordError("");

      // =================================================
      // EXIT EDIT MODE
      // =================================================

      setIsEditing(false);

      setMessage({
        type: "success",
        text: "Profile updated successfully.",
      });
    } catch (error) {
      console.error(
        "Profile update error:",
        error
      );

      setMessage({
        type: "danger",
        text:
          error.message ||
          "Failed to update profile.",
      });
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // DELETE CURRENT ACCOUNT
  // =====================================================

  const handleDeleteAccount = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to delete your account?\n\nThis action cannot be undone."
    );

    if (!confirmed) {
      return;
    }

    try {
      setDeleteLoading(true);

      const token = getToken();

      if (!token) {
        throw new Error(
          "Authentication token not found. Please login again."
        );
      }

      // =================================================
      // CURRENT USER DELETE
      // =================================================

      const url =
        "http://localhost:8080/api/user/profile";

      const response = await fetch(url, {
        method: "DELETE",

        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // =================================================
      // SAFE RESPONSE HANDLING
      // =================================================

      const responseText =
        await response.text();

      let data = {};

      if (responseText) {
        try {
          data = JSON.parse(responseText);
        } catch (parseError) {
          console.error(
            "Invalid delete response:",
            responseText
          );
        }
      }

      console.log(
        "Delete account response:",
        data
      );

      // =================================================
      // UNAUTHORIZED
      // =================================================

      if (
        response.status === 401 ||
        response.status === 403
      ) {
        throw new Error(
          "You are not authorized. Please login again."
        );
      }

      // =================================================
      // OTHER ERRORS
      // =================================================

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Failed to delete account."
        );
      }

      // =================================================
      // CLEAR AUTH DATA
      // =================================================

      localStorage.removeItem("token");
      localStorage.removeItem("user");

      sessionStorage.removeItem("token");
      sessionStorage.removeItem("user");

      alert(
        "Account deleted successfully."
      );

      // =================================================
      // LOGOUT
      // =================================================

      if (onLogout) {
        onLogout();
      }
    } catch (error) {
      console.error(
        "Delete account error:",
        error
      );

      setMessage({
        type: "danger",
        text:
          error.message ||
          "Failed to delete account.",
      });
    } finally {
      setDeleteLoading(false);
    }
  };

  // =====================================================
  // RESET VALIDATION
  // =====================================================

  const clearValidationErrors = () => {
    setNameError("");
    setEmailError("");
    setBalanceError("");
    setPasswordError("");
    setConfirmPasswordError("");
  };

  // =====================================================
  // CANCEL EDIT
  // =====================================================

  const handleCancel = () => {
    setFormData({
      name: loggedInUser?.name || "",
      email: loggedInUser?.email || "",
      accountBalance:
        loggedInUser?.accountBalance ?? "",
    });

    setNewPassword("");
    setConfirmPassword("");

    setShowNewPassword(false);
    setShowConfirmPassword(false);

    clearValidationErrors();

    setIsEditing(false);

    setMessage({
      type: "",
      text: "",
    });
  };

  // =====================================================
  // START EDITING
  // =====================================================

  const handleStartEditing = () => {
    clearValidationErrors();

    setMessage({
      type: "",
      text: "",
    });

    setIsEditing(true);
  };

  // =====================================================
  // USER NOT AVAILABLE
  // =====================================================

  if (!loggedInUser) {
    return (
      <Alert variant="warning">
        Unable to load your profile.
      </Alert>
    );
  }

  // =====================================================
  // INITIAL
  // =====================================================

  const initial = loggedInUser.name
    ? loggedInUser.name
        .charAt(0)
        .toUpperCase()
    : "U";

  // =====================================================
  // ROLE
  // =====================================================

  const role = loggedInUser.role
    ? loggedInUser.role
        .toString()
        .toUpperCase()
    : "USER";

  // =====================================================
  // CREATED DATE
  // =====================================================

  const createdDate =
    loggedInUser.createdAt
      ? new Date(
          loggedInUser.createdAt
        ).toLocaleDateString("en-IN", {
          day: "2-digit",
          month: "long",
          year: "numeric",
        })
      : "Not available";

  // =====================================================
  // DISPLAY BALANCE
  // =====================================================

  const displayBalance = Number(
    loggedInUser.accountBalance || 0
  ).toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  return (
    <Container fluid className="py-2">

      {/* =================================================
          PROFILE HEADER
      ================================================= */}

      <Card
        className="
          border-0
          shadow-sm
          mb-4
          bg-primary
          text-white
        "
      >
        <Card.Body className="p-4">

          <div className="d-flex align-items-center">

            <div
              className="
                rounded-circle
                bg-white
                text-primary
                d-flex
                align-items-center
                justify-content-center
                fw-bold
                shadow-sm
                me-3
              "
              style={{
                width: "75px",
                height: "75px",
                fontSize: "32px",
              }}
            >
              {initial}
            </div>

            <div>

              <h2 className="mb-1 fw-bold">
                {loggedInUser.name}
              </h2>

              <p className="mb-2 opacity-75">
                {loggedInUser.email}
              </p>

              <Badge
                bg="light"
                text="dark"
              >
                Role: {role}
              </Badge>

            </div>

          </div>

        </Card.Body>
      </Card>

      {/* =================================================
          MESSAGE
      ================================================= */}

      {message.text && (
        <Alert
          variant={message.type}
          dismissible
          onClose={() =>
            setMessage({
              type: "",
              text: "",
            })
          }
        >
          {message.text}
        </Alert>
      )}

      <Row className="g-4">

        {/* =================================================
            PERSONAL INFORMATION
        ================================================= */}

        <Col lg={7}>

          <Card className="border-0 shadow-sm">

            <Card.Header className="bg-white py-3">

              <h5 className="mb-0 fw-bold">
                Personal Information
              </h5>

            </Card.Header>

            <Card.Body className="p-4">

              {!isEditing ? (

                <>
                  {/* FULL NAME */}

                  <div className="mb-4">

                    <small className="text-muted d-block mb-1">
                      Full Name
                    </small>

                    <div className="fw-semibold fs-5">
                      {loggedInUser.name}
                    </div>

                  </div>

                  {/* EMAIL */}

                  <div className="mb-4">

                    <small className="text-muted d-block mb-1">
                      Email Address
                    </small>

                    <div className="fw-semibold fs-5">
                      {loggedInUser.email}
                    </div>

                  </div>

                  {/* BALANCE */}

                  <div className="mb-4">

                    <small className="text-muted d-block mb-1">
                      Account Balance
                    </small>

                    <div className="fw-semibold fs-5">
                      ₹{displayBalance}
                    </div>

                  </div>

                  {/* ROLE */}

                  <div className="mb-4">

                    <small className="text-muted d-block mb-1">
                      Account Role
                    </small>

                    <Badge bg="primary">
                      {role}
                    </Badge>

                  </div>

                  {/* CREATED DATE */}

                  <div className="mb-4">

                    <small className="text-muted d-block mb-1">
                      Account Created
                    </small>

                    <div className="fw-semibold">
                      {createdDate}
                    </div>

                  </div>

                  {/* EDIT */}

                  <Button
                    variant="primary"
                    onClick={handleStartEditing}
                  >
                    Edit Profile
                  </Button>

                </>

              ) : (

                <Form
                  onSubmit={
                    handleUpdateProfile
                  }
                  autoComplete="off"
                  noValidate
                >

                  {/* =================================================
                      NAME
                  ================================================= */}

                  <Form.Group className="mb-4">

                    <Form.Label className="fw-semibold">
                      Full Name
                    </Form.Label>

                    <Form.Control
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      onBlur={
                        handleNameBlur
                      }
                      placeholder="Enter your full name"
                      autoComplete="off"
                      maxLength={100}
                      isInvalid={!!nameError}
                      required
                    />

                    <Form.Control.Feedback type="invalid">
                      {nameError}
                    </Form.Control.Feedback>

                  </Form.Group>

                  {/* =================================================
                      EMAIL
                  ================================================= */}

                  <Form.Group className="mb-4">

                    <Form.Label className="fw-semibold">
                      Email Address
                    </Form.Label>

                    <Form.Control
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      onBlur={
                        handleEmailBlur
                      }
                      placeholder="Enter your email"
                      autoComplete="off"
                      maxLength={254}
                      isInvalid={!!emailError}
                      required
                    />

                    <Form.Control.Feedback type="invalid">
                      {emailError}
                    </Form.Control.Feedback>

                  </Form.Group>

                  {/* =================================================
                      ACCOUNT BALANCE
                  ================================================= */}

                  <Form.Group className="mb-4">

                    <Form.Label className="fw-semibold">
                      Account Balance
                    </Form.Label>

                    <Form.Control
                      type="number"
                      name="accountBalance"
                      value={
                        formData.accountBalance
                      }
                      onChange={handleChange}
                      onBlur={
                        handleBalanceBlur
                      }
                      placeholder="Enter account balance"
                      min="0"
                      max="999999999999.99"
                      step="0.01"
                      inputMode="decimal"
                      isInvalid={!!balanceError}
                      required
                    />

                    <Form.Control.Feedback type="invalid">
                      {balanceError}
                    </Form.Control.Feedback>

                  </Form.Group>

                  {/* =================================================
                      NEW PASSWORD
                  ================================================= */}

                  <Form.Group className="mb-4">

                    <Form.Label className="fw-semibold">
                      New Password
                    </Form.Label>

                    <div
                      style={
                        styles.passwordWrapper
                      }
                    >

                      <Form.Control
                        type={
                          showNewPassword
                            ? "text"
                            : "password"
                        }
                        value={newPassword}
                        onChange={
                          handlePasswordChange
                        }
                        onBlur={
                          handlePasswordBlur
                        }
                        placeholder="Leave blank to keep current password"
                        autoComplete="new-password"
                        maxLength={100}
                        isInvalid={!!passwordError}
                        style={
                          styles.passwordInput
                        }
                      />

                      <button
                        type="button"
                        onClick={() =>
                          setShowNewPassword(
                            (previous) =>
                              !previous
                          )
                        }
                        style={styles.eyeButton}
                        aria-label={
                          showNewPassword
                            ? "Hide new password"
                            : "Show new password"
                        }
                        title={
                          showNewPassword
                            ? "Hide password"
                            : "Show password"
                        }
                        tabIndex="-1"
                      >

                        <FontAwesomeIcon
                          icon={
                            showNewPassword
                              ? faEyeSlash
                              : faEye
                          }
                        />

                      </button>

                    </div>

                    {passwordError ? (
                      <div className="text-danger small mt-1">
                        {passwordError}
                      </div>
                    ) : (
                      <Form.Text className="text-muted">
                        Leave blank if you don't want
                        to change your password.
                        If changing it, use at least
                        8 characters.
                      </Form.Text>
                    )}

                  </Form.Group>

                  {/* =================================================
                      CONFIRM PASSWORD
                  ================================================= */}

                  {newPassword && (

                    <Form.Group className="mb-4">

                      <Form.Label className="fw-semibold">
                        Confirm New Password
                      </Form.Label>

                      <div
                        style={
                          styles.passwordWrapper
                        }
                      >

                        <Form.Control
                          type={
                            showConfirmPassword
                              ? "text"
                              : "password"
                          }
                          value={
                            confirmPassword
                          }
                          onChange={
                            handleConfirmPasswordChange
                          }
                          onBlur={
                            handleConfirmPasswordBlur
                          }
                          placeholder="Confirm your new password"
                          autoComplete="new-password"
                          maxLength={100}
                          isInvalid={
                            !!confirmPasswordError
                          }
                          style={
                            styles.passwordInput
                          }
                        />

                        <button
                          type="button"
                          onClick={() =>
                            setShowConfirmPassword(
                              (previous) =>
                                !previous
                            )
                          }
                          style={
                            styles.eyeButton
                          }
                          aria-label={
                            showConfirmPassword
                              ? "Hide confirm password"
                              : "Show confirm password"
                          }
                          title={
                            showConfirmPassword
                              ? "Hide password"
                              : "Show password"
                          }
                          tabIndex="-1"
                        >

                          <FontAwesomeIcon
                            icon={
                              showConfirmPassword
                                ? faEyeSlash
                                : faEye
                            }
                          />

                        </button>

                      </div>

                      {confirmPasswordError && (
                        <div className="text-danger small mt-1">
                          {
                            confirmPasswordError
                          }
                        </div>
                      )}

                    </Form.Group>

                  )}

                  {/* =================================================
                      BUTTONS
                  ================================================= */}

                  <div className="d-flex gap-2">

                    <Button
                      type="submit"
                      variant="success"
                      disabled={loading}
                    >

                      {loading ? (

                        <>
                          <Spinner
                            size="sm"
                            animation="border"
                            className="me-2"
                          />

                          Updating...
                        </>

                      ) : (

                        "Save Changes"

                      )}

                    </Button>

                    <Button
                      type="button"
                      variant="light"
                      onClick={
                        handleCancel
                      }
                      disabled={loading}
                    >
                      Cancel
                    </Button>

                  </div>

                </Form>

              )}

            </Card.Body>

          </Card>

        </Col>

        {/* =================================================
            SECURITY / DELETE
        ================================================= */}

        <Col lg={5}>

          <Card className="border-0 shadow-sm">

            <Card.Header className="bg-white py-3">

              <h5 className="mb-0 fw-bold">
                Security
              </h5>

            </Card.Header>

            <Card.Body className="p-4">

              <p className="text-muted mb-4">
                Your password is securely stored
                using encryption. You can change
                your password using the Edit Profile
                button.
              </p>

              <Button
                variant="primary"
                onClick={handleStartEditing}
              >
                Change Password
              </Button>

            </Card.Body>

          </Card>

          {/* =================================================
              DANGER ZONE
          ================================================= */}

          <Card className="border-0 shadow-sm mt-4">

            <Card.Header className="bg-white py-3">

              <h5 className="mb-0 fw-bold text-danger">
                Danger Zone
              </h5>

            </Card.Header>

            <Card.Body className="p-4">

              <h6 className="fw-bold">
                Delete Account
              </h6>

              <p className="text-muted small">
                Permanently delete your account.
                This action cannot be undone.
              </p>

              <Button
                variant="outline-danger"
                onClick={
                  handleDeleteAccount
                }
                disabled={deleteLoading}
              >

                {deleteLoading ? (

                  <>
                    <Spinner
                      size="sm"
                      animation="border"
                      className="me-2"
                    />

                    Deleting...
                  </>

                ) : (

                  "Delete Account"

                )}

              </Button>

            </Card.Body>

          </Card>

        </Col>

      </Row>

    </Container>
  );
};

// =====================================================
// STYLES
// =====================================================

const styles = {
  passwordWrapper: {
    position: "relative",
    width: "100%",
  },

  passwordInput: {
    paddingRight: "44px",
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

    zIndex: 5,

    transition:
      "color 0.2s ease, background-color 0.2s ease",
  },
};