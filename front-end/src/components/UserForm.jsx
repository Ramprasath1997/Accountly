import React, { useEffect, useState } from "react";
import { Card, Form, Button, Alert } from "react-bootstrap";

export const UserForm = ({
  user,
  onUserSaved,
  onCancel,
}) => {
  const isEditMode = !!user;

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    accountBalance: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // =========================
  // LOAD USER DATA FOR EDIT
  // =========================
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
        password: "",
        accountBalance: user.accountBalance ?? "",
      });
    } else {
      setFormData({
        name: "",
        email: "",
        password: "",
        accountBalance: "",
      });
    }

    setError("");
  }, [user]);

  // =========================
  // HANDLE INPUT
  // =========================
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // =========================
  // SUBMIT
  // =========================
  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setError("");

    try {
      // =========================
      // GET JWT
      // =========================
      const token =
        localStorage.getItem("token") ||
        sessionStorage.getItem("token");

      if (!token) {
        throw new Error(
          "Authentication token not found."
        );
      }

      // =========================
      // VALIDATION
      // =========================
      if (!formData.name.trim()) {
        throw new Error("Name is required.");
      }

      if (!formData.email.trim()) {
        throw new Error("Email is required.");
      }

      if (!isEditMode && !formData.password.trim()) {
        throw new Error("Password is required.");
      }

      if (
        formData.accountBalance === "" ||
        Number(formData.accountBalance) < 0
      ) {
        throw new Error(
          "Please enter a valid account balance."
        );
      }

      // =========================
      // URL & METHOD
      // =========================
      const url = isEditMode
        ? `http://localhost:8080/api/user/${user.id}`
        : "http://localhost:8080/api/user/users";

      const method = isEditMode ? "PUT" : "POST";

      // =========================
      // REQUEST BODY
      // =========================
      const requestBody = {
        name: formData.name.trim(),
        email: formData.email.trim(),
        password: formData.password,
        accountBalance: Number(
          formData.accountBalance
        ),
      };

      const response = await fetch(url, {
        method: method,

        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },

        body: JSON.stringify(requestBody),
      });

      const data = await response.json();

      console.log(
        isEditMode
          ? "Update user response:"
          : "Create user response:",
        data
      );

      if (!response.ok) {
        throw new Error(
          data.message ||
            (isEditMode
              ? "Failed to update user."
              : "Failed to create user.")
        );
      }

      // =========================
      // SUCCESS
      // =========================
      if (onUserSaved) {
        onUserSaved(data);
      }

    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="border-0 shadow-sm mx-auto">
      <Card.Header className="bg-white py-3 border-0">
        <h4 className="fw-bold mb-0">
          {isEditMode
            ? "Edit User"
            : "Add New User"}
        </h4>

        <span className="text-muted small">
          {isEditMode
            ? "Update user account information"
            : "Create a new user account"}
        </span>
      </Card.Header>

      <Card.Body>

        {/* =========================
            ERROR
        ========================= */}
        {error && (
          <Alert
            variant="danger"
            className="mb-3"
          >
            {error}
          </Alert>
        )}

        <Form onSubmit={handleSubmit}  autoComplete="off">

          {/* =========================
              NAME
          ========================= */}
          <Form.Group className="mb-3">

            <Form.Label className="fw-semibold">
              Full Name
            </Form.Label>

            <Form.Control
              type="text"
              name="name"
               
              placeholder="Enter user name"
              value={formData.name}
              onChange={handleChange}
              required
            />

          </Form.Group>

          {/* =========================
              EMAIL
          ========================= */}
          <Form.Group className="mb-3">

            <Form.Label className="fw-semibold">
              Email Address
            </Form.Label>

            <Form.Control
              type="email"
              name="email"
               autoComplete="off"
              placeholder="Enter user email"
              value={formData.email}
              onChange={handleChange}
              required
            />

          </Form.Group>

          {/* =========================
              PASSWORD
          ========================= */}
          <Form.Group className="mb-3">

            <Form.Label className="fw-semibold">
              Password
            </Form.Label>

            <Form.Control
              type="password"
              name="password"
                autoComplete="new-password"
              placeholder={
                isEditMode
                  ? "Leave blank to keep current password"
                  : "Enter password"
              }
              value={formData.password}
              onChange={handleChange}
              required={!isEditMode}
            />

            {isEditMode && (
              <Form.Text className="text-muted">
                Leave blank if you don't want to
                change the password.
              </Form.Text>
            )}

          </Form.Group>

          {/* =========================
              ACCOUNT BALANCE
          ========================= */}
          <Form.Group className="mb-4">

            <Form.Label className="fw-semibold">
              Account Balance
            </Form.Label>

            <Form.Control
              type="number"
              name="accountBalance"
              placeholder="Enter account balance"
              value={formData.accountBalance}
              onChange={handleChange}
              min="0"
              step="0.01"
              required
            />

          </Form.Group>

          {/* =========================
              BUTTONS
          ========================= */}
          <div className="d-flex justify-content-end gap-2">

            <Button
              variant="light"
              type="button"
              onClick={onCancel}
              disabled={loading}
            >
              Cancel
            </Button>

            <Button
              variant="primary"
              type="submit"
              disabled={loading}
            >
              {loading
                ? isEditMode
                  ? "Updating..."
                  : "Creating..."
                : isEditMode
                  ? "Update User"
                  : "Create User"}
            </Button>

          </div>

        </Form>

      </Card.Body>
    </Card>
  );
};