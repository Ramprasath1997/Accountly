import React, { useState, useEffect } from "react";
import { Navbar, Nav, Dropdown, Badge, Button } from "react-bootstrap";

export const Header = ({ onToggleSidebar, onFormSwitch, onLogout }) => {
  const [currentUser, setCurrentUser] = useState({ name: "User", email: "" });

  useEffect(() => {
    const storedUser = sessionStorage.getItem("user");
    if (storedUser) {
      try {
        setCurrentUser(JSON.parse(storedUser));
      } catch (err) {
        console.error("Error reading user data", err);
      }
    }
  }, []);

  const initial = currentUser.name
    ? currentUser.name.charAt(0).toUpperCase()
    : "U";
  return (
    <Navbar
      bg="dark"
      variant="dark"
      className="px-3 shadow-sm sticky-top"
      style={{ zIndex: 1030 }}
    >
      {/* Container with flex-nowrap ensures everything stays on ONE line */}
      <div className="d-flex align-items-center justify-content-between w-100 flex-nowrap">
        {/* LEFT SECTION: Hamburger + Brand Logo */}
        <div className="d-flex align-items-center me-2 text-nowrap">
          {/* 🍔 HAMBURGER TOGGLE BUTTON */}
          <Button
            variant="link"
            className="text-white p-0 me-2 me-sm-3 d-lg-none border-0 text-decoration-none shadow-none"
            onClick={onToggleSidebar}
            aria-label="Toggle Navigation Sidebar"
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          </Button>

          <Navbar.Brand
            onClick={() => onFormSwitch("home")}
            className="fw-bold text-primary fs-5 fs-sm-4 m-0 p-0"
            style={{ cursor: "pointer" }}
          >
            ⚡ Admin<span className="text-white">Portal</span>
          </Navbar.Brand>
        </div>

        {/* RIGHT SECTION: Notifications + User Profile Dropdown */}
        <div className="d-flex align-items-center gap-2 gap-sm-3 text-nowrap ms-auto">
          {/* Notifications Bell */}
          <Nav.Link
            href="#notifications"
            className="position-relative text-light fs-5 p-0 me-2 d-flex align-items-center"
          >
            🔔
            <Badge
              bg="danger"
              pill
              className="position-absolute top-0 start-100 translate-middle"
              style={{ fontSize: "0.55rem" }}
            >
              3
            </Badge>
          </Nav.Link>

          {/* User Profile Dropdown */}
          <Dropdown align="end">
            <Dropdown.Toggle
              variant="dark"
              id="dropdown-user"
              className="d-flex align-items-center border-0 bg-transparent p-0 shadow-none"
            >
              <div
                className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center me-sm-2"
                style={{ width: "32px", height: "32px", fontWeight: "bold" }}
              >
                {initial}
              </div>
              <span className="d-none d-sm-inline text-light">
                {currentUser.name}
              </span>
            </Dropdown.Toggle>

            <Dropdown.Menu
              className="shadow-lg border-0 mt-2"
              style={{ minWidth: "200px", zIndex: 1050 }}
            >
              <Dropdown.Header className="pb-1">
                Signed in as
                <div className="fw-bold text-dark">
                  {currentUser.email || currentUser.name}
                </div>
              </Dropdown.Header>
              <Dropdown.Divider />
              <Dropdown.Item
                onClick={() => onFormSwitch("profile")}
                className="py-2"
              >
                👤 My Profile
              </Dropdown.Item>
              {/* <Dropdown.Item href="#settings" className="py-2">
                ⚙️ Account Settings
              </Dropdown.Item> */}
              <Dropdown.Divider />
              <Dropdown.Item
                onClick={onLogout}
                className="text-danger py-2 fw-semibold"
              >
                🚪 Logout
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </div>
      </div>
    </Navbar>
  );
};
