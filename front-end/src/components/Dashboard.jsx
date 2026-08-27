import React from "react";
import { Row, Col, Card } from "react-bootstrap";

export const Dashboard = ({ users }) => {
  const totalItems = users.length;

  // Convert string stock to Number to avoid string concatenation ("0" + "5" = "05")

  return (
    <div>
      <div className="mb-4">
        <h3 className="fw-bold mb-0">Users Overview</h3>
        <span className="text-muted small">Real-time summary of user</span>
      </div>

      <Row className="g-3 mb-4">
        <Col sm={6} lg={3}>
          <Card className="border-0 shadow-sm">
            <Card.Body>
              <div className="text-muted small text-uppercase fw-semibold">
                Total Users
              </div>
              <h3 className="fw-bold mb-0 text-dark">{totalItems}</h3>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
};
