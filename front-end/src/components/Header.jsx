import React from "react";
import { Navbar, Dropdown, Button } from "react-bootstrap";

export const Header = ({
  onToggleSidebar,
  onFormSwitch,
  onLogout,
  loggedInUser,
}) => {

  // =========================
  // USER NAME
  // =========================
  const userName = loggedInUser?.name || "User";

  // =========================
  // USER EMAIL
  // =========================
  const userEmail = loggedInUser?.email || "";

  // =========================
  // AVATAR INITIAL
  // =========================
  const initial = userName
    ? userName.charAt(0).toUpperCase()
    : "U";

  return (
    <Navbar
      bg="dark"
      variant="dark"
      className="px-3 shadow-sm sticky-top"
      style={{ zIndex: 1030 }}
    >

      <div className="d-flex align-items-center justify-content-between w-100 flex-nowrap">

        {/* =========================
            LEFT SECTION
        ========================= */}
        <div className="d-flex align-items-center me-2 text-nowrap">

          {/* MOBILE HAMBURGER */}
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

          {/* BRAND */}
          <Navbar.Brand
            onClick={() => onFormSwitch("dashboard")}
            className="fw-bold text-primary fs-5 fs-sm-4 m-0 p-0"
            style={{ cursor: "pointer" }}
          >
            ⚡ Accountly
          </Navbar.Brand>

        </div>

        {/* =========================
            RIGHT SECTION
        ========================= */}
        <div className="d-flex align-items-center ms-auto">

          {/* =========================
              USER DROPDOWN
          ========================= */}
          <Dropdown align="end">

            <Dropdown.Toggle
              variant="dark"
              id="dropdown-user"
              className="d-flex align-items-center border-0 bg-transparent p-0 shadow-none"
              style={{
                outline: "none",
                boxShadow: "none",
              }}
            >

              {/* AVATAR */}
              <div
                className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center me-2"
                style={{
                  width: "36px",
                  height: "36px",
                  minWidth: "36px",
                  fontWeight: "600",
                  fontSize: "15px",
                }}
              >
                {initial}
              </div>

              {/* USER NAME */}
              <div className="d-none d-sm-flex flex-column align-items-start me-2">

                <span
                  className="text-white"
                  style={{
                    fontSize: "14px",
                    fontWeight: "600",
                    lineHeight: "18px",
                  }}
                >
                  {userName}
                </span>

                <span
                  className="text-secondary"
                  style={{
                    fontSize: "11px",
                    lineHeight: "14px",
                  }}
                >
                  Account
                </span>

              </div>

            </Dropdown.Toggle>

            {/* =========================
                DROPDOWN MENU
            ========================= */}
            <Dropdown.Menu
              className="shadow-lg border-0 mt-2 p-0 overflow-hidden"
              style={{
                minWidth: "280px",
                borderRadius: "12px",
                zIndex: 1050,
              }}
            >

              {/* =========================
                  PROFILE HEADER
              ========================= */}
              <div
                className="px-3 py-3"
                style={{
                  backgroundColor: "#f8f9fa",
                }}
              >

                <div className="d-flex align-items-center">

                  {/* LARGE AVATAR */}
                  <div
                    className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center me-3"
                    style={{
                      width: "48px",
                      height: "48px",
                      minWidth: "48px",
                      fontSize: "19px",
                      fontWeight: "600",
                    }}
                  >
                    {initial}
                  </div>

                  {/* USER DETAILS */}
                  <div
                    style={{
                      minWidth: 0,
                    }}
                  >

                    <div
                      className="fw-semibold text-dark"
                      style={{
                        fontSize: "15px",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        maxWidth: "190px",
                      }}
                    >
                      {userName}
                    </div>

                    <div
                      className="text-muted"
                      style={{
                        fontSize: "12px",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        maxWidth: "190px",
                      }}
                    >
                      {userEmail}
                    </div>

                  </div>

                </div>

              </div>

              {/* =========================
                  PROFILE OPTION
              ========================= */}
              <Dropdown.Item
                onClick={() => onFormSwitch("profile")}
                className="py-3 px-3"
              >
                <div className="d-flex align-items-center">

                  <span
                    className="me-3 d-flex align-items-center justify-content-center"
                    style={{
                      width: "32px",
                      height: "32px",
                      borderRadius: "8px",
                      backgroundColor: "#e9f2ff",
                      fontSize: "16px",
                    }}
                  >
                    👤
                  </span>

                  <div>
                    <div
                      className="fw-semibold text-dark"
                      style={{ fontSize: "14px" }}
                    >
                      My Profile
                    </div>

                    <div
                      className="text-muted"
                      style={{ fontSize: "11px" }}
                    >
                      View your account
                    </div>
                  </div>

                </div>
              </Dropdown.Item>

              {/* =========================
                  LOGOUT
              ========================= */}
              <Dropdown.Item
                onClick={onLogout}
                className="py-3 px-3"
              >
                <div className="d-flex align-items-center">

                  <span
                    className="me-3 d-flex align-items-center justify-content-center"
                    style={{
                      width: "32px",
                      height: "32px",
                      borderRadius: "8px",
                      backgroundColor: "#fff0f0",
                      fontSize: "16px",
                    }}
                  >
                    🚪
                  </span>

                  <div>
                    <div
                      className="fw-semibold text-danger"
                      style={{ fontSize: "14px" }}
                    >
                      Logout
                    </div>

                    <div
                      className="text-muted"
                      style={{ fontSize: "11px" }}
                    >
                      Sign out of your account
                    </div>
                  </div>

                </div>
              </Dropdown.Item>

            </Dropdown.Menu>

          </Dropdown>

        </div>

      </div>

    </Navbar>
  );
};