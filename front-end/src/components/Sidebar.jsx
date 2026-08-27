import React from "react";
import { Nav, Badge, Offcanvas } from "react-bootstrap";

export const Sidebar = ({
  activeTab,
  setActiveTab,
  orderCount = 0,
  showMobile,
  onCloseMobile,
}) => {
  const handleSelectTab = (tab) => {
    setActiveTab(tab);
    if (onCloseMobile) onCloseMobile();
  };

  return (
    <Offcanvas
      show={showMobile}
      onHide={onCloseMobile}
      responsive="lg" // Handles mobile drawer AND desktop inline display automatically!
      placement="start"
      className="border-end bg-white"
    >
      <Offcanvas.Header closeButton className="border-bottom">
        <Offcanvas.Title className="fw-bold">Menu</Offcanvas.Title>
      </Offcanvas.Header>

      <Offcanvas.Body className="p-3">
        <Nav className="flex-column nav-pills gap-1 w-100">
          <Nav.Link
            active={activeTab === "dashboard"}
            onClick={() => handleSelectTab("dashboard")}
            className="px-3 fw-semibold text-start"
          >
            🏠 Dashboard
          </Nav.Link>





          <Nav.Link
            active={activeTab === "users"}
            onClick={() => handleSelectTab("users")}
            className="px-3 fw-semibold text-start"
          >
            👥 Users
          </Nav.Link>
        </Nav>
      </Offcanvas.Body>
    </Offcanvas>
  );
};
