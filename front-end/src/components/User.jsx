import React, { useState } from "react";
import {
  Card,
  Table,
  Badge,
  Button,
  Form,
  Row,
  Col,
  InputGroup,
} from "react-bootstrap";

// 1. Destructure onNavigateToAddUser from props
export const Users = ({ users = [], onNavigateToAddUser }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("All");

  const filteredUsers = users.filter((user) => {
    const name = user.name || "";
    const email = user.email || "";
    const matchesSearch =
      name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      email.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesRole =
      roleFilter === "All" ||
      user.role?.toLowerCase() === roleFilter.toLowerCase();

    return matchesSearch && matchesRole;
  });

  return (
    <div>
      {/* Header with Nav button to Add User Page */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h3 className="fw-bold mb-0">User Management</h3>
          <span className="text-muted small">
            Manage system users, roles, and profiles
          </span>
        </div>
        {/* 2. Pass onNavigateToAddUser directly to onClick */}
        <Button variant="primary" onClick={onNavigateToAddUser}>
          + Create New User
        </Button>
      </div>

      {/* Filter and Search Bar */}
      <Card className="border-0 shadow-sm mb-4">
        <Card.Body>
          <Row className="g-3">
            <Col md={6}>
              <InputGroup size="sm">
                <Form.Control
                  placeholder="Search by Name or Email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </InputGroup>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      {/* Users Table */}
      <Card className="border-0 shadow-sm">
        <Card.Header className="bg-white py-3 border-0 d-flex justify-content-between align-items-center">
          <h5 className="mb-0 fw-bold">
            Registered Users ({filteredUsers.length})
          </h5>
        </Card.Header>
        <Card.Body className="p-0">
          <Table responsive hover className="mb-0 align-middle">
            <thead className="table-light">
              <tr>
                <th>User ID</th>
                <th>Name</th>
                <th>Email</th>

                <th>Joined Date</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user) => {
                  const userId = user._id || user.id || "";
                  const role = user.role || "user";

                  return (
                    <tr key={userId}>
                      <td className="fw-bold text-primary">
                        #{userId.slice(-6).toUpperCase()}
                      </td>
                      <td>
                        <div className="fw-semibold">{user.name}</div>
                      </td>
                      <td className="text-muted">{user.email}</td>

                      <td className="text-muted small">
                        {user.createdAt
                          ? new Date(user.createdAt).toLocaleDateString()
                          : "Recent"}
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="5" className="text-center py-4 text-muted">
                    No users found in database.
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
        </Card.Body>
      </Card>
    </div>
  );
};
