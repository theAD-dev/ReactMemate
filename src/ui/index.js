import React from "react";
import { Col, Row } from "react-bootstrap";
import MemateSelectComponent from "./memate-select";


const Components = () => {
  return (
    <Row className="p-4">
      <Col md={3}>
        <MemateSelectComponent/>
      </Col>
    </Row>
  );
};


