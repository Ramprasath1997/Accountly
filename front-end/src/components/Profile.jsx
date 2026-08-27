import React, { useState, useEffect } from "react";
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
  Table,
} from "react-bootstrap";

export const Profile = ({ onLogout }) => {
  const [userData, setUserData] = useState({
    _id: "",
    name: "",
    email: "",
    role: "user",
    createdAt: "",
  });

  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [isEditing, setIsEditing] = useState(false);

  // Form states
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [message, setMessage] = useState({ type: "", text: "" });

  // 1. Fetch user from session & fetch user-specific orders
  useEffect(() => {
    const storedUser = sessionStorage.getItem("user");
    if (storedUser) {
      try {
        const parsed = JSON.parse(storedUser);
        setUserData(parsed);
        setName(parsed.name || "");
        setEmail(parsed.email || "");

        // Fetch user's orders from backend
        fetchUserOrders(parsed._id);
      } catch (err) {
        console.error("Error loading profile details", err);
      }
    }
  }, []);

  const fetchUserOrders = async (userId) => {
    try {
      setLoadingOrders(true);
      const token = sessionStorage.getItem("token");

      const response = await fetch(`http://localhost:8000/api/v1/orders`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        // Filter orders belonging to this user if your backend returns all orders
        const userOrders = (data.orders || []).filter(
          (order) => order.user === userId || order.userId === userId,
        );
        setOrders(userOrders);
      }
    } catch (err) {
      console.error("Failed to load user orders", err);
    } finally {
      setLoadingOrders(false);
    }
  };

  // Example handleUpdate with error logging
  const handleUpdate = async (e) => {
    e.preventDefault();
    setMessage({ type: "", text: "" });

    try {
      const payload = { name, email };
      if (newPassword.trim() !== "") {
        payload.password = newPassword;
      }

      const response = await fetch(
        `http://localhost:8000/api/v1/user/${userData._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${sessionStorage.getItem("token")}`, // Include auth token
          },
          body: JSON.stringify(payload),
        },
      );

      // If server responds with 400/404/500 status codes
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.message || `Server Error: ${response.status}`,
        );
      }

      const data = await response.json();

      if (data.success) {
        setMessage({ type: "success", text: "Profile updated successfully!" });
        sessionStorage.setItem("user", JSON.stringify(data.user));
        setUserData(data.user);
        setIsEditing(false);
      }
    } catch (error) {
      console.error("Full Network/Fetch Error:", error);
      setMessage({
        type: "danger",
        text:
          error.message ||
          "Failed to connect to server. Check server status and CORS setup.",
      });
    }
  };

  // 3. Handle Account Deletion
  const handleDeleteAccount = async () => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete your account? This action cannot be undone.",
    );

    if (!confirmDelete) return;

    try {
      const response = await fetch(
        `http://localhost:8000/api/v1/user/${userData._id}`,
        {
          method: "DELETE",
        },
      );

      const data = await response.json();

      if (data.success) {
        alert("Account deleted successfully.");
        onLogout();
      } else {
        setMessage({
          type: "danger",
          text: data.message || "Failed to delete account",
        });
      }
    } catch (error) {
      setMessage({ type: "danger", text: "Network error during deletion." });
    }
  };

  const initial = userData.name ? userData.name.charAt(0).toUpperCase() : "U";

  return (
    <Container fluid className="py-2">
      {/* Header Banner */}
      <Card className="border-0 shadow-sm mb-4 bg-primary text-white p-3">
        <div className="d-flex align-items-center">
          <div
            className="rounded-circle bg-white text-primary d-flex align-items-center justify-content-center me-3 fw-bold fs-2 shadow-sm"
            style={{ width: "70px", height: "70px" }}
          >
            {initial}
          </div>
          <div>
            <h2 className="m-0 fw-bold">{userData.name}</h2>
            <p className="m-0 opacity-75">{userData.email}</p>
            <Badge bg="light" text="dark" className="mt-1">
              Role: {userData.role ? userData.role.toUpperCase() : "USER"}
            </Badge>
          </div>
        </div>
      </Card>

      {message.text && (
        <Alert
          variant={message.type}
          dismissible
          onClose={() => setMessage({ type: "", text: "" })}
        >
          {message.text}
        </Alert>
      )}

      <Row className="g-4">
        {/* LEFT COLUMN: Profile Info & Account Actions */}
        <Col lg={4}>
          <Card className="shadow-sm border-0 mb-4">
            <Card.Header className="bg-white fw-bold py-3">
              👤 Personal Details
            </Card.Header>
            <Card.Body>
              {!isEditing ? (
                <div>
                  <div className="mb-3">
                    <small className="text-muted d-block">Full Name</small>
                    <span className="fw-semibold fs-5">{userData.name}</span>
                  </div>
                  <div className="mb-3">
                    <small className="text-muted d-block">Email Address</small>
                    <span className="fw-semibold fs-5">{userData.email}</span>
                  </div>
                  <div className="mb-3">
                    <small className="text-muted d-block">
                      Account Created
                    </small>
                    <span className="fw-semibold">
                      {userData.createdAt
                        ? new Date(userData.createdAt).toLocaleDateString()
                        : "N/A"}
                    </span>
                  </div>
                  <Button
                    variant="primary"
                    className="w-100 mt-2"
                    onClick={() => setIsEditing(true)}
                  >
                    Edit Profile
                  </Button>
                </div>
              ) : (
                <Form onSubmit={handleUpdate}>
                  <Form.Group className="mb-3">
                    <Form.Label className="small fw-semibold">
                      Full Name
                    </Form.Label>
                    <Form.Control
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label className="small fw-semibold">Email</Form.Label>
                    <Form.Control
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </Form.Group>

                  <div className="d-flex gap-2">
                    <Button
                      type="submit"
                      variant="success"
                      className="flex-grow-1"
                    >
                      Save
                    </Button>
                    <Button
                      type="button"
                      variant="outline-secondary"
                      onClick={() => setIsEditing(false)}
                    >
                      Cancel
                    </Button>
                  </div>
                </Form>
              )}
            </Card.Body>
          </Card>

          {/* Security & Danger Zone Card */}
          <Card className="shadow-sm border-0">
            <Card.Header className="bg-white fw-bold text-danger py-3">
              ⚙️ Account Settings & Security
            </Card.Header>
            <Card.Body>
              <Form onSubmit={handleUpdate}>
                <Form.Group className="mb-3">
                  <Form.Label className="small fw-semibold">
                    New Password
                  </Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="Enter new password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label className="small fw-semibold">
                    Confirm Password
                  </Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="Confirm new password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                </Form.Group>

                <Button
                  type="submit"
                  variant="outline-primary"
                  className="w-100 mb-3"
                  disabled={!newPassword}
                >
                  Update Password
                </Button>
              </Form>

              <hr />

              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <strong className="text-danger d-block">
                    Delete Account
                  </strong>
                  <small className="text-muted">Permanently remove data</small>
                </div>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={handleDeleteAccount}
                >
                  Delete
                </Button>
              </div>
            </Card.Body>
          </Card>
        </Col>

        {/* RIGHT COLUMN: Order History & Activity */}
        <Col lg={8}>
          <Card className="shadow-sm border-0 h-100">
            <Card.Header className="bg-white fw-bold py-3 d-flex justify-content-between align-items-center">
              <span>🛒 My Orders History</span>
              <Badge bg="primary" pill>
                {orders.length} Total
              </Badge>
            </Card.Header>

            <Card.Body className="p-0">
              {loadingOrders ? (
                <div className="text-center py-5">
                  <Spinner animation="border" variant="primary" />
                  <p className="mt-2 text-muted">Loading your orders...</p>
                </div>
              ) : orders.length === 0 ? (
                <div className="text-center py-5">
                  <p className="text-muted fs-5 m-0">No orders found.</p>
                  <small className="text-muted">
                    When you place orders, they will appear right here.
                  </small>
                </div>
              ) : (
                <Table responsive hover className="m-0 align-middle">
                  <thead className="table-light">
                    <tr>
                      <th>Order ID</th>
                      <th>Date</th>
                      <th>Items</th>
                      <th>Total Amount</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map((order) => (
                      <tr key={order._id}>
                        <td className="fw-bold">
                          #{order._id.substring(0, 8)}
                        </td>
                        <td>
                          {order.createdAt
                            ? new Date(order.createdAt).toLocaleDateString()
                            : "N/A"}
                        </td>
                        <td>
                          {order.orderItems ? order.orderItems.length : 1}
                        </td>
                        <td className="fw-semibold">
                          ${order.totalPrice || order.amount || 0}
                        </td>
                        <td>
                          <Badge
                            bg={
                              order.status === "Delivered"
                                ? "success"
                                : order.status === "Pending"
                                  ? "warning"
                                  : "info"
                            }
                          >
                            {order.status || "Completed"}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};
