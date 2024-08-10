import React from "react";
import { Col, Row } from "react-bootstrap";
import MemateSelect from "./MemateSelect/MemateSelect";

const Components = () => {
  const handleSelectChange = (value) => {
    console.log(value); // or handle the value as needed
  };
  return (
    <Row className="p-4">
      <Col md={2}>
        <MemateSelect
          options={[{ value: '1', label: 'Option 1' }, { value: '2', label: 'Option 2' }]}
          onChange={handleSelectChange} // Ensure this is a function
          hasError={false}
        />
      </Col>
    </Row>
  );
};

export default Components;
