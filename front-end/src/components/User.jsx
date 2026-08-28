import React, { useEffect, useState } from "react";
import {
  Card,
  Table,
  Button,
  Form,
  Row,
  Col,
  InputGroup,
  Modal,
  Alert,
} from "react-bootstrap";

export const Users = ({
  onNavigateToAddUser,
  onNavigateToEditUser,
}) => {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // User selected for deletion
  const [deleteUser, setDeleteUser] = useState(null);

  // Delete loading state
  const [deleteLoading, setDeleteLoading] = useState(false);

  // =========================
  // GET JWT TOKEN
  // =========================
  const getToken = () => {
    return (
      localStorage.getItem("token") ||
      sessionStorage.getItem("token")
    );
  };

  // =========================
  // FETCH USERS
  // =========================
  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError("");

      const token = getToken();

      if (!token) {
        throw new Error(
          "Authentication token not found."
        );
      }

      const response = await fetch(
        "http://localhost:8080/api/user/users",
        {
          method: "GET",

          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // =========================
      // AUTH ERROR
      // =========================
      if (
        response.status === 401 ||
        response.status === 403
      ) {
        throw new Error(
          "Your session has expired or the token is invalid."
        );
      }

      // =========================
      // OTHER ERROR
      // =========================
      if (!response.ok) {
        throw new Error(
          "Failed to fetch users."
        );
      }

      const data = await response.json();

      console.log(
        "Users from Spring Boot:",
        data
      );

      setUsers(data);

    } catch (err) {
      console.error(
        "Error fetching users:",
        err
      );

      setError(err.message);

    } finally {
      setLoading(false);
    }
  };

  // =========================
  // INITIAL LOAD
  // =========================
  useEffect(() => {
    fetchUsers();
  }, []);

  // =========================
  // DELETE USER
  // =========================
  const handleDeleteUser = async () => {
    if (!deleteUser) {
      return;
    }

    try {
      setDeleteLoading(true);
      setError("");

      const token = getToken();

      if (!token) {
        throw new Error(
          "Authentication token not found."
        );
      }

      const response = await fetch(
        `http://localhost:8080/api/user/${deleteUser.id}`,
        {
          method: "DELETE",

          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // =========================
      // AUTH ERROR
      // =========================
      if (
        response.status === 401 ||
        response.status === 403
      ) {
        throw new Error(
          "You are not authorized to delete this user."
        );
      }

      // =========================
      // USER NOT FOUND
      // =========================
      if (response.status === 404) {
        throw new Error(
          "User not found."
        );
      }

      // =========================
      // OTHER ERROR
      // =========================
      if (!response.ok) {
        throw new Error(
          "Failed to delete user."
        );
      }

      console.log(
        "User deleted successfully:",
        deleteUser.id
      );

      // =========================
      // REMOVE USER FROM TABLE
      // =========================
      setUsers((prevUsers) =>
        prevUsers.filter(
          (user) =>
            user.id !== deleteUser.id
        )
      );

      // Close modal
      setDeleteUser(null);

    } catch (err) {
      console.error(
        "Delete user error:",
        err
      );

      setError(err.message);

    } finally {
      setDeleteLoading(false);
    }
  };

  // =========================
  // SEARCH USERS
  // =========================
  const filteredUsers = users.filter(
    (user) => {
      const name = user.name || "";
      const email = user.email || "";

      const search =
        searchTerm.toLowerCase();

      return (
        name
          .toLowerCase()
          .includes(search) ||
        email
          .toLowerCase()
          .includes(search)
      );
    }
  );

  // =========================
  // FORMAT ACCOUNT BALANCE
  // =========================
  const formatBalance = (balance) => {
    return Number(
      balance || 0
    ).toLocaleString(
      "en-IN",
      {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }
    );
  };

  return (
    <div>

      {/* =========================
          HEADER
      ========================= */}
      <div className="d-flex justify-content-between align-items-center mb-4">

        <div>
          <h3 className="fw-bold mb-0">
            User Management
          </h3>

          <span className="text-muted small">
            Manage users and account information
          </span>
        </div>

        <Button
          variant="primary"
          onClick={onNavigateToAddUser}
        >
          + Create New User
        </Button>

      </div>

      {/* =========================
          SEARCH
      ========================= */}
      <Card className="border-0 shadow-sm mb-4">

        <Card.Body>

          <Row className="g-3">

            <Col md={6}>

              <InputGroup size="sm">

                <Form.Control
                  placeholder="Search by Name or Email..."
                  value={searchTerm}
                  onChange={(e) =>
                    setSearchTerm(
                      e.target.value
                    )
                  }
                />

              </InputGroup>

            </Col>

          </Row>

        </Card.Body>

      </Card>

      {/* =========================
          ERROR
      ========================= */}
      {error && (
        <Alert
          variant="danger"
          className="mb-3"
          dismissible
          onClose={() => setError("")}
        >
          {error}
        </Alert>
      )}

      {/* =========================
          USERS TABLE
      ========================= */}
      <Card className="border-0 shadow-sm">

        <Card.Header className="bg-white py-3 border-0">

          <h5 className="mb-0 fw-bold">
            Registered Users (
            {filteredUsers.length}
            )
          </h5>

        </Card.Header>

        <Card.Body className="p-0">

          {loading ? (

            <div className="text-center py-5 text-muted">

              Loading users...

            </div>

          ) : (

            <Table
              responsive
              hover
              className="mb-0 align-middle"
            >

              <thead className="table-light">

                <tr>

                  <th>
                    User ID
                  </th>

                  <th>
                    Name
                  </th>

                  <th>
                    Email
                  </th>

                  <th>
                    Account Balance
                  </th>

                  <th className="text-center">
                    Actions
                  </th>

                </tr>

              </thead>

              <tbody>

                {filteredUsers.length > 0 ? (

                  filteredUsers.map(
                    (user) => (

                      <tr key={user.id}>

                        {/* =========================
                            USER ID
                        ========================= */}
                        <td className="fw-bold text-primary">
                          #{user.id}
                        </td>

                        {/* =========================
                            NAME
                        ========================= */}
                        <td>

                          <div className="fw-semibold">
                            {user.name}
                          </div>

                        </td>

                        {/* =========================
                            EMAIL
                        ========================= */}
                        <td className="text-muted">
                          {user.email}
                        </td>

                        {/* =========================
                            ACCOUNT BALANCE
                        ========================= */}
                        <td className="fw-semibold">

                          ₹
                          {formatBalance(
                            user.accountBalance
                          )}

                        </td>

                        {/* =========================
                            ACTIONS
                        ========================= */}
                        <td>

                          <div className="d-flex justify-content-center gap-2">

                            {/* EDIT */}
                            <Button
                              variant="outline-primary"
                              size="sm"
                              onClick={() =>
                                onNavigateToEditUser(
                                  user
                                )
                              }
                            >
                              Edit
                            </Button>

                            {/* DELETE */}
                            <Button
                              variant="outline-danger"
                              size="sm"
                              onClick={() =>
                                setDeleteUser(
                                  user
                                )
                              }
                              disabled={deleteLoading}
                            >
                              Delete
                            </Button>

                          </div>

                        </td>

                      </tr>

                    )

                  )

                ) : (

                  <tr>

                    <td
                      colSpan="5"
                      className="text-center py-4 text-muted"
                    >
                      No users found in database.
                    </td>

                  </tr>

                )}

              </tbody>

            </Table>

          )}

        </Card.Body>

      </Card>

      {/* =========================
          DELETE CONFIRMATION MODAL
      ========================= */}
      <Modal
        show={!!deleteUser}
        onHide={() =>
          !deleteLoading &&
          setDeleteUser(null)
        }
        centered
      >

        <Modal.Header
          closeButton
        >

          <Modal.Title>
            Delete User
          </Modal.Title>

        </Modal.Header>

        <Modal.Body>

          <p className="mb-1">
            Are you sure you want to delete this user?
          </p>

          {/* USER INFORMATION */}
          <div className="mt-3 p-3 bg-light rounded">

            <div>
              <strong>
                User ID:
              </strong>{" "}
              #{deleteUser?.id}
            </div>

            <div>
              <strong>
                Name:
              </strong>{" "}
              {deleteUser?.name}
            </div>

            <div>
              <strong>
                Email:
              </strong>{" "}
              {deleteUser?.email}
            </div>

          </div>

          <div className="text-danger small mt-3">

            ⚠️ This action cannot be undone.

          </div>

        </Modal.Body>

        <Modal.Footer>

          {/* CANCEL */}
          <Button
            variant="light"
            onClick={() =>
              setDeleteUser(null)
            }
            disabled={deleteLoading}
          >
            Cancel
          </Button>

          {/* CONFIRM DELETE */}
          <Button
            variant="danger"
            onClick={handleDeleteUser}
            disabled={deleteLoading}
          >

            {deleteLoading
              ? "Deleting..."
              : "Delete User"}

          </Button>

        </Modal.Footer>

      </Modal>

    </div>
  );
};