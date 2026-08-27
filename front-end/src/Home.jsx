import React, { useState, useEffect } from "react";
import { Container, Row, Col, Spinner, Alert } from "react-bootstrap";
import { Header } from "./components/Header";
import { Sidebar } from "./components/Sidebar";
import { Dashboard } from "./components/Dashboard";

import { Users } from "./components/User";
import { AddUser } from "./components/AddUser";
import { Profile } from "./components/Profile"; // 👈 Import Profile component

export const Home = ({ onLogout }) => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showMobileSidebar, setShowMobileSidebar] = useState(false);

  const fetchAdminData = async () => {
    try {
      setLoading(true);

      const [productsRes, ordersRes, usersRes] = await Promise.all([
        fetch("http://localhost:8000/api/v1/products"),
        fetch("http://localhost:8000/api/v1/orders").catch(() => null),
        fetch("http://localhost:8000/api/v1/users").catch(() => null),
      ]);

      if (!productsRes.ok) {
        throw new Error("Failed to connect to backend server.");
      }

      const productsData = await productsRes.json();
      setProducts(productsData.products || []);

      if (ordersRes && ordersRes.ok) {
        const ordersData = await ordersRes.json();
        setOrders(ordersData.orders || []);
      }
      if (usersRes && usersRes.ok) {
        const usersData = await usersRes.json();
        setUsers(usersData.users || []);
      }
    } catch (err) {
      console.error("Error fetching admin data:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  return (
    <div className="d-flex flex-column min-vh-100 bg-light">
      {/* Pass navigation & logout handlers to Header */}
      <Header
        onToggleSidebar={() => setShowMobileSidebar((prev) => !prev)}
        onFormSwitch={setActiveTab}
        onLogout={onLogout}
      />

      <Container fluid className="flex-grow-1">
        <Row className="h-100">
          <Col
            md={3}
            lg={2}
            className="bg-white border-end d-none d-md-block min-vh-100"
          >
            <Sidebar
              activeTab={
                activeTab === "add-order"
                  ? "orders"
                  : activeTab === "add-user"
                    ? "users"
                    : activeTab
              }
              setActiveTab={setActiveTab}
              orderCount={orders.length}
              showMobile={showMobileSidebar}
              onCloseMobile={() => setShowMobileSidebar(false)}
              onLogout={onLogout}
            />
          </Col>

          <Col md={9} lg={10} className="p-4">
            {loading && (
              <div className="text-center py-5">
                <Spinner animation="border" variant="primary" />
                <p className="mt-2 text-muted">Loading admin data...</p>
              </div>
            )}

            {error && (
              <Alert variant="danger" className="my-3">
                <strong>Connection Error:</strong> {error}
              </Alert>
            )}

            {!loading && !error && (
              <>
               {activeTab === "dashboard" && <Dashboard users={users} />}
                {activeTab === "users" && (
                  <Users
                    users={users}
                    onNavigateToAddUser={() => setActiveTab("add-user")}
                  />
                )}

                {activeTab === "add-user" && (
                  <AddUser
                    onUserAdded={() => {
                      fetchAdminData();
                      setActiveTab("users");
                    }}
                    onCancel={() => setActiveTab("users")}
                  />
                )}

                {/* Profile View */}
                {activeTab === "profile" && <Profile onLogout={onLogout} />}
              </>
            )}
          </Col>
        </Row>
      </Container>
    </div>
  );
};
