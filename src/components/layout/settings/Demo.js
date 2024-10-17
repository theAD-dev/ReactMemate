import React, { useState } from 'react';
import { Row, Col } from 'react-bootstrap';
import { Plus } from 'react-bootstrap-icons';

const Demo = () => {
  const [address1, setAddress1] = useState('');
  const [suburb1, setSuburb1] = useState('');
  const [state1, setState1] = useState('');
  const [postcode1, setPostcode1] = useState('');

  const [addresses, setAddresses] = useState([]);

  const handleAddNewAddress1 = () => {
    const newAddress = {
      address1: address1,
      suburb1: suburb1,
      state1: state1,
      postcode1: postcode1
    };
    setAddresses([...addresses, newAddress]);
    setAddress1('');
    setSuburb1('');
    setState1('');
    setPostcode1('');
  };

  return (
    <>
      {addresses.map((addr, index) => (
        <Row key={index} className='addNewRow text-left mt-4'>
          <h2>Main Company address1</h2>
          <Col>
            <div className="formgroup mb-2 mt-3">
              <label>Street address1</label>
              <div className={`inputInfo `}>
                <input
                  type="text"
                  name="address1"
                  value={addr.address1}
                  placeholder='Enter main address1'
                  onChange={(e) => {
                    let updatedAddresses = [...addresses];
                    updatedAddresses[index].address1 = e.target.value;
                    setAddresses(updatedAddresses);
                  }}
                />
              </div>
            </div>
          </Col>
          <Col sm={6}>
            <div className="formgroup mb-2 mt-3">
              <label>City/suburb1</label>
              <div className={`inputInfo `}>
                <input
                  type="text"
                  name="suburb1"
                  value={addr.suburb1}
                  placeholder='Enter city'
                  onChange={(e) => {
                    let updatedAddresses = [...addresses];
                    updatedAddresses[index].suburb1 = e.target.value;
                    setAddresses(updatedAddresses);
                  }}
                />
              </div>
            </div>
          </Col>

          <Col sm={6}>
            <div className="formgroup mb-2 mt-3">
              <label>state1</label>
              <div className={`inputInfo `}>
                <input
                  type="text"
                  name="state1"
                  value={addr.state1}
                  placeholder='Enter state1'
                  onChange={(e) => {
                    let updatedAddresses = [...addresses];
                    updatedAddresses[index].state1 = e.target.value;
                    setAddresses(updatedAddresses);
                  }}
                />
              </div>
            </div>
          </Col>
          <Col sm={6}>
            <div className="formgroup mb-2 mt-3">
              <label>postcode1</label>
              <div className={`inputInfo `}>
                <input
                  type="text"
                  name="postcode1"
                  value={addr.postcode1}
                  placeholder='Enter postcode1'
                  onChange={(e) => {
                    let updatedAddresses = [...addresses];
                    updatedAddresses[index].postcode1 = e.target.value;
                    setAddresses(updatedAddresses);
                  }}
                />
              </div>
            </div>
          </Col>
        </Row>
      ))}

      <Row className='textRightRow mt-3'>
        <Col sm={12}>
          <button className='addbuttonRight' onClick={handleAddNewAddress1}>
            Add New <Plus color="#344054" size={20} />
          </button>
        </Col>
      </Row>
    </>
  );
};

export default Demo;
