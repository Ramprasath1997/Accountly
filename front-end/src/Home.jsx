import React, { useState, useEffect } from "react";

import {
  Container,
  Row,
  Col,
  Spinner,
  Alert,
} from "react-bootstrap";

import { Header } from "./components/Header";
import { Sidebar } from "./components/Sidebar";
import { Dashboard } from "./components/Dashboard";
import { Users } from "./components/User";
import { UserForm } from "./components/UserForm";
import { Profile } from "./components/Profile";

export const Home = ({ onLogout }) => {

  // =========================
  // ACTIVE PAGE
  // =========================
  const [activeTab, setActiveTab] = useState("dashboard");

  // =========================
  // SELECTED USER FOR EDIT
  // =========================
  const [selectedUser, setSelectedUser] = useState(null);

  // =========================
  // USERS
  // =========================
  const [users, setUsers] = useState([]);

  // =========================
  // LOGGED-IN USER
  // =========================
  const [loggedInUser, setLoggedInUser] = useState(null);

  // =========================
  // LOADING
  // =========================
  const [loading, setLoading] = useState(true);

  const [error, setError] = useState(null);

  // =========================
  // MOBILE SIDEBAR
  // =========================
  const [showMobileSidebar, setShowMobileSidebar] =
    useState(false);

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
  // FETCH LOGGED-IN USER
  // =========================
  const fetchLoggedInUser = async () => {

    try {

      const token = getToken();

      if (!token) {
        throw new Error(
          "Authentication token not found."
        );
      }

      const response = await fetch(
        "http://localhost:8080/api/user/profile",
        {
          method: "GET",

          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (
        response.status === 401 ||
        response.status === 403
      ) {

        throw new Error(
          "Your session has expired or the authentication token is invalid."
        );

      }

      if (!response.ok) {

        throw new Error(
          "Failed to fetch logged-in user."
        );

      }

      const data = await response.json();

      console.log(
        "Logged-in user:",
        data
      );

      setLoggedInUser(data);

    } catch (err) {

      console.error(
        "Error fetching logged-in user:",
        err
      );

    }
  };

  // =========================
  // FETCH ALL USERS
  // =========================
  const fetchUsers = async () => {

    try {

      setLoading(true);
      setError(null);

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

      if (
        response.status === 401 ||
        response.status === 403
      ) {

        throw new Error(
          "Your session has expired or the authentication token is invalid."
        );

      }

      if (!response.ok) {

        throw new Error(
          "Failed to fetch users from the server."
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
  // LOAD DATA
  // =========================
  useEffect(() => {

    fetchUsers();

    fetchLoggedInUser();

  }, []);

  // =========================
  // OPEN ADD USER FORM
  // =========================
  const handleAddUser = () => {

    setSelectedUser(null);

    setActiveTab("user-form");
  };

  // =========================
  // OPEN EDIT USER FORM
  // =========================
  const handleEditUser = (user) => {

    console.log(
      "Editing user:",
      user
    );

    setSelectedUser(user);

    setActiveTab("user-form");
  };

  // =========================
  // USER SAVED
  // =========================
  const handleUserSaved = async () => {

    await fetchUsers();

    setSelectedUser(null);

    setActiveTab("users");

  };

  // =========================
  // CANCEL USER FORM
  // =========================
  const handleCancelUserForm = () => {

    setSelectedUser(null);

    setActiveTab("users");

  };

  // =========================
  // PROFILE UPDATED
  // =========================
  const handleProfileUpdated = (updatedUser) => {

    // Update logged-in user in Home
    setLoggedInUser(updatedUser);

    // Also update the matching user in users list
    setUsers((previousUsers) =>
      previousUsers.map((user) =>
        user.id === updatedUser.id
          ? updatedUser
          : user
      )
    );

  };

  return (

    <div className="d-flex flex-column min-vh-100 bg-light">

      {/* =========================
          HEADER
      ========================= */}
      <Header

        onToggleSidebar={() =>
          setShowMobileSidebar(
            (prev) => !prev
          )
        }

        onFormSwitch={setActiveTab}

        onLogout={onLogout}

        loggedInUser={loggedInUser}

      />

      <Container
        fluid
        className="flex-grow-1"
      >

        <Row className="h-100">

          {/* =========================
              SIDEBAR
          ========================= */}
          <Col
            md={3}
            lg={2}
            className="bg-white border-end d-none d-md-block min-vh-100"
          >

            <Sidebar

              activeTab={
                activeTab === "user-form"
                  ? "users"
                  : activeTab
              }

              setActiveTab={setActiveTab}

              showMobile={
                showMobileSidebar
              }

              onCloseMobile={() =>
                setShowMobileSidebar(false)
              }

              onLogout={onLogout}

            />

          </Col>

          {/* =========================
              MAIN CONTENT
          ========================= */}
          <Col
            md={9}
            lg={10}
            className="p-4"
          >

            {/* =========================
                LOADING
            ========================= */}
            {loading && (

              <div className="text-center py-5">

                <Spinner
                  animation="border"
                  variant="primary"
                />

                <p className="mt-2 text-muted">
                  Loading users...
                </p>

              </div>

            )}

            {/* =========================
                ERROR
            ========================= */}
            {error && (

              <Alert
                variant="danger"
                className="my-3"
              >

                <strong>
                  Error:
                </strong>{" "}

                {error}

              </Alert>

            )}

            {/* =========================
                PAGE CONTENT
            ========================= */}
            {!loading && !error && (

              <>

                {/* =========================
                    DASHBOARD
                ========================= */}
                {activeTab === "dashboard" && (

                  <Dashboard
                    users={users}
                  />

                )}

                {/* =========================
                    USERS
                ========================= */}
                {activeTab === "users" && (

                  <Users

                    onNavigateToAddUser={
                      handleAddUser
                    }

                    onNavigateToEditUser={
                      handleEditUser
                    }

                  />

                )}

                {/* =========================
                    ADD / EDIT USER
                ========================= */}
                {activeTab === "user-form" && (

                  <UserForm

                    user={selectedUser}

                    onUserSaved={
                      handleUserSaved
                    }

                    onCancel={
                      handleCancelUserForm
                    }

                  />

                )}

                {/* =========================
                    PROFILE
                ========================= */}
                {activeTab === "profile" && (

                  <Profile

                    loggedInUser={loggedInUser}

                    onProfileUpdated={
                      handleProfileUpdated
                    }

                    onLogout={onLogout}

                  />

                )}

              </>

            )}

          </Col>

        </Row>

      </Container>

    </div>

  );
};