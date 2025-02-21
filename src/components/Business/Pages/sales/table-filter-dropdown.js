import { useState } from 'react';
import Tab from 'react-bootstrap/Tab';
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Tabs from 'react-bootstrap/Tabs';
import { X } from 'react-bootstrap-icons';
import Button from 'react-bootstrap/Button';

const TableFilterDropdown = ({ salesData }) => {
  console.log('salesData: ', salesData);
  const [selectedItems, setSelectedItems] = useState([]);
  const [buttonClicked, setButtonClicked] = useState(false);
  const [filteredItems, setFilteredItems] = useState([]);

  const fullNames = [...new Set(salesData.map(item => item.manager.full_name))];
  const statuses = Array.from(new Set(salesData.map(item => item.status)));
  const clientNames = Array.from(new Set(salesData.map(item => item.client.name)));
  const userNames = Array.from(new Set(salesData.map(item => item.manager.alias_name)));

  const getStatusCount = (status) => {
    return salesData.filter(item => item.status === status).length;
  };

  const fullNamesJson = JSON.stringify(fullNames, null, 2);
  const statusesJson = JSON.stringify(statuses, null, 2);
  const fullNamesArray = JSON.parse(fullNamesJson);
  const StatusesArray = JSON.parse(statusesJson);
  const clientNamesJson = JSON.stringify(clientNames, null, 2);
  const ClientNamesArray = JSON.parse(clientNamesJson);
  const userNamesJson = JSON.stringify(userNames, null, 2);
  const UserNamesArray = JSON.parse(userNamesJson);

  const handleCheckboxChange = (itemName) => {
    setSelectedItems((prevSelectedItems) => {
      if (prevSelectedItems.includes(itemName)) {
        return prevSelectedItems.filter((item) => item !== itemName);
      } else {
        return [...prevSelectedItems, itemName];
      }
    });
  };

  const applyFilters = () => {
    setFilteredItems(selectedItems);
    setButtonClicked(false);
  };

  const clearSelectedTags = () => {
    setSelectedItems([]);
    setButtonClicked(false);
  };

  const [key, setKey] = useState(fullNamesJson);

  const groupSelectedItems = () => {
    const groupedItems = {
      'FullNames': [],
      Status: [],
      'ClientNames': [],
      'UserNames': [],
    };

    selectedItems.forEach((item) => {
      if (fullNamesArray.includes(item)) {
        groupedItems['FullNames'].push(item);
      } else if (StatusesArray.includes(item)) {
        groupedItems.Status.push(item);
      } else if (ClientNamesArray.includes(item)) {
        groupedItems['ClientNames'].push(item);
      } else if (UserNamesArray.includes(item)) {
        groupedItems['UserNames'].push(item);
      }
    });

    return groupedItems;
  };

  const handleButtonClick = () => {
    setButtonClicked(!buttonClicked);
  }

  const renderGroupedItems = () => {
    const groupedItems = groupSelectedItems();

    return (
      <>
        {Object.entries(groupedItems).map(([group, items]) => (
          <div key={group}>
            {items.length > 0 && (
              <div className="tags-input-container">
                <ul className={group}>
                  {items.map((item, index) => (
                    <li className='mainWrapperTags tag-item-wrap' key={index}>{item}<Button variant="link" size="sm" style={{ marginLeft: '5px' }} onClick={() => handleRemoveTag(item)}><X color="#F96969" size={15} /></Button></li>
                  ))}
                </ul>
                <Button

                  variant="link"
                  size="sm"
                  style={{ marginLeft: '5px' }}
                >
                  <X color="#F96969" size={20} />
                </Button>
              </div>
            )}
          </div>
        ))}
      </>
    );
  };

  const handleRemoveTag = (itemName) => {
    setSelectedItems((prevSelectedItems) => prevSelectedItems.filter((item) => item !== itemName));
  };

  const newLocal = "d-flex justify-content-between align-items-center";
  return (
    <>
      <button onClick={handleButtonClick}>
        {buttonClicked ? 'Hide Data' : 'Show Data'}
      </button>
      {buttonClicked && (
        <Tabs
          id="controlled-tab-example"
          activeKey={key}
          onSelect={(k) => setKey(k)}
          className="mb-3"
        >
          <Tab eventKey="FullName" title="Full Names">
            <ul>
              {fullNamesArray.map((itemName, index) => (
                <li key={index}>
                  <label>
                    <input
                      type="checkbox"
                      value={itemName}
                      checked={selectedItems.includes(itemName)}
                      onChange={() => handleCheckboxChange(itemName)}
                    />
                    {itemName}
                  </label>
                </li>
              ))}
              <Row className={newLocal}>
                <Col className="pr-2">
                  <Button variant="tabContent tabCancel" onClick={clearSelectedTags}>
                    Cancel
                  </Button>
                </Col>
                <Col>
                  <Button variant="tabContent tabApply" onClick={applyFilters}>
                    Apply
                  </Button>
                </Col>
              </Row>
            </ul>
          </Tab>
          <Tab eventKey="Status" title="Status">
            <ul>
              {StatusesArray.map((itemName, index) => (
                <li key={index}>
                  <label>
                    <input
                      type="checkbox"
                      value={itemName}
                      checked={selectedItems.includes(itemName)}
                      onChange={() => handleCheckboxChange(itemName)}
                    />
                    {itemName} ({getStatusCount(itemName)})
                  </label>
                </li>
              ))}
              <Row className="d-flex justify-content-between align-items-center">
                <Col className="pr-2">
                  <Button variant="tabContent tabCancel" onClick={clearSelectedTags}>
                    Cancel
                  </Button>
                </Col>
                <Col>
                  <Button variant="tabContent tabApply" onClick={applyFilters}>
                    Apply
                  </Button>
                </Col>
              </Row>
            </ul>
          </Tab>
          <Tab eventKey="ClientNames" title="Client Names">
            <ul>
              {ClientNamesArray.map((itemName, index) => (
                <li key={index}>
                  <label>
                    <input
                      type="checkbox"
                      value={itemName}
                      checked={selectedItems.includes(itemName)}
                      onChange={() => handleCheckboxChange(itemName)}
                    />
                    {itemName}
                  </label>
                </li>
              ))}
              <Row className="d-flex justify-content-between align-items-center">
                <Col className="pr-2">
                  <Button variant="tabContent tabCancel" onClick={clearSelectedTags}>
                    Cancel
                  </Button>
                </Col>
                <Col>
                  <Button variant="tabContent tabApply" onClick={applyFilters}>
                    Apply
                  </Button>
                </Col>
              </Row>
            </ul>
          </Tab>
          <Tab eventKey="UserNames" title="User Names">
            <ul>
              {UserNamesArray.map((itemName, index) => (
                <li key={index}>
                  <label>
                    <input
                      type="checkbox"
                      value={itemName}
                      checked={selectedItems.includes(itemName)}
                      onChange={() => handleCheckboxChange(itemName)} />
                    {itemName}
                  </label>
                </li>
              ))}
              <Row className="d-flex justify-content-between align-items-center">
                <Col className="pr-2">
                  <Button variant="tabContent tabCancel" onClick={clearSelectedTags}>
                    Cancel
                  </Button>
                </Col>
                <Col>
                  <Button variant="tabContent tabApply" onClick={applyFilters}>
                    Apply
                  </Button>
                </Col>
              </Row>
            </ul>
          </Tab>
        </Tabs>
      )}
      {/* Display selected items as tags */}
      {filteredItems.length > 0 && renderGroupedItems()}
    </>
  );
};

export default TableFilterDropdown
