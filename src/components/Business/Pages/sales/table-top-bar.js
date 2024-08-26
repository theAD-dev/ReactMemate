import React, { useEffect, useState, useRef } from "react";
import { NavLink } from "react-router-dom";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import {
  X,
  Filter,
  Person,
  Check,
  ViewStacked,
  CalendarWeek,
  PersonBoundingBox,
  BarChartSteps,
  Search,
  XCircle,
  Download,
  PlusLg,
  CheckCircle,
} from "react-bootstrap-icons";
import SearchFilter from "./search-filter";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import DateRangePicker from "./date-range-picker";
import { fetchMultipleData } from "../../../../APIs/SalesApi";
import { fetchMultipleLost } from "../../../../APIs/SalesApi";
import ConfettiComponent from "../../../layout/ConfettiComponent";
import BankDetailsModel from "./bank-details-model";


const TableTopBar = ({
  rows,
  rowsfilter,
  onRowsFilterChange,
  selectedUniqueIds,
  salesData,
  removeRowMulti,
  selectedRowCount,
  selectClass,
  selectedRow,
  profileData
}) => {
  const [totalAmount, setTotalAmount] = useState(0);
  const [totalFAmount, setTotalFAmount] = useState(0);
  const [selectedItems, setSelectedItems] = useState([]);
  const [buttonClicked, setButtonClicked] = useState(false);
  const [filteredItems, setFilteredItems] = useState([]);
  const [selectedRange, setSelectedRange] = useState([]);
  const [message, setMessage] = useState({ content: "", type: "success" });
  const [totalWonQuote, setTotalWonQuote] = useState(
    sessionStorage.getItem("totalWonQuote") || 0
  );
  const [confetti, setConfetti] = useState(false);
  const filterDropdownRef = useRef(null);

  const handleMoveToWon = async () => {
    try {
      if (selectedUniqueIds) {
        const success = await fetchMultipleData(selectedUniqueIds);
        if (success) {
          removeRowMulti();
          setConfetti(true);
          setMessage({
            content: "Successfully moved to Management!",
            type: "success",
          });
          const newTotalWonQuote = parseInt(totalWonQuote, 10) + 1;
          setTotalWonQuote(newTotalWonQuote);
          sessionStorage.setItem("totalWonQuote", newTotalWonQuote);
        } else {
          setMessage({
            content: "Failed to move to Management. Please try again.",
            type: "error",
          });
        }
      }
    } catch (error) {
      setMessage({
        content: "An error occurred. Please try again.",
        type: "error",
      });
    }
  };
  const handleMoveToLost = async () => {
    try {
      if (selectedUniqueIds) {
        const success = await fetchMultipleLost(selectedUniqueIds);
        if (success) {
          removeRowMulti();
          setConfetti(true);
          setMessage({
            content: "Successfully moved to Management!",
            type: "success",
          });
          const newTotalWonQuote = parseInt(totalWonQuote, 10) + 1;
          setTotalWonQuote(newTotalWonQuote);
          sessionStorage.setItem("totalWonQuote", newTotalWonQuote);
        } else {
          setMessage({
            content: "Failed to move to Management. Please try again.",
            type: "error",
          });
        }
      }
    } catch (error) {
      setMessage({
        content: "An error occurred. Please try again.",
        type: "error",
      });
    }
  };

  const formattedAmount = totalAmount.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  const formattedFAmount = totalFAmount.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });


  useEffect(() => {
    if (rowsfilter) {
      const calculatedFilterAmount = rowsfilter.reduce(
        (total, sale) => total + sale.amountData,
        0
      );
      setTotalFAmount(calculatedFilterAmount); 
    }
  }, [rowsfilter]);


  useEffect(() => {
    if (salesData) {
      const calculatedTotalAmount = salesData.reduce(
        (total, sale) => total + sale.amount,
        0
      );
      setTotalAmount(calculatedTotalAmount);
    }
  }, [salesData]);




  const handleDataApply = (data) => {
    const startDate = data.startDate
      ? data.startDate.toISOString().split("T")[0]
      : "";
    const endDate = data.endDate
      ? data.endDate.toISOString().split("T")[0]
      : "";
    let item = [`${startDate} - ${endDate}`];
    setFilteredItems((prev) => {
      return [...prev, item];
    });
    setSelectedRange(item);

    setButtonClicked(false);
    const filteredRows = rows[0].filter((item) => {
      return (
        selectedItems.includes(item.client.name) ||
        selectedItems.includes(item.status) ||
        selectedRange.includes(`${item.startDate} - ${item.endDate}`)
      );
    });
    onRowsFilterChange(filteredRows);
  };

  useEffect(() => {
    renderGroupedItems();
  }, [selectedRange]);

  const fullNames = [
    ...new Set(salesData && salesData.map((item) => item.manager.full_name)),
  ];
  const statuses = Array.from(
    new Set(salesData && salesData.map((item) => item.status))
  );
  const clientNames = Array.from(
    new Set(salesData && salesData.map((item) => item.client.name))
  );
  const userNames = Array.from(
    new Set(salesData && salesData.map((item) => item.manager.alias_name))
  );
  const lead = Array.from(
    new Set(salesData && salesData.map((item) => item.lead.name))
  );
  const percentage = Array.from(
    new Set(salesData && salesData.map((item) => item.lead.percentage))
  );

  const getStatusCount = (status) => {
    return salesData.filter((item) => item.status === status).length;
  };

  const fullNamesJson = JSON.stringify(fullNames, null, 2);
  const statusesJson = JSON.stringify(statuses, null, 2);
  const leadJson = JSON.stringify(lead, null, 2);
  const percentageJson = JSON.stringify(percentage, null, 2);
  const fullNamesArray = JSON.parse(fullNamesJson);
  const StatusesArray = JSON.parse(statusesJson);
  const clientNamesJson = JSON.stringify(clientNames, null, 2);
  const ClientNamesArray = JSON.parse(clientNamesJson);
  const userNamesJson = JSON.stringify(userNames, null, 2);
  const UserNamesArray = JSON.parse(userNamesJson);
  const leadArray = JSON.parse(leadJson);
  const percentageJsonArray = JSON.parse(percentageJson);

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
    const filteredRows = rows[0].filter((item) => {
      return (
        selectedItems.includes(item.client.name) ||
        selectedItems.includes(item.status)
      );
    });
    onRowsFilterChange(filteredRows);
    setButtonClicked(!buttonClicked);
  };

  const clearSelectedTags = () => {
    setSelectedItems([]);

    setButtonClicked(false);
  };

  const [key, setKey] = useState(fullNamesJson);

  const groupSelectedItems = () => {
    const isEmpty = Array.isArray(selectedRange) && selectedRange.length === 0;
    const groupedItems = {
      FullNames: [],
      Status: [],
      ClientNames: [],
      UserNames: [],
      DateRange: isEmpty ? [] : [selectedRange],
    };

    selectedItems.forEach((item) => {
      if (fullNamesArray.includes(item)) {
        groupedItems["FullNames"].push(item);
      } else if (StatusesArray.includes(item)) {
        groupedItems.Status.push(item);
      } else if (ClientNamesArray.includes(item)) {
        groupedItems["ClientNames"].push(item);
      } else if (UserNamesArray.includes(item)) {
        groupedItems["UserNames"].push(item);
      } else if (leadArray.includes(item)) {
        groupedItems["UserNames"].push(item);
      } else if (selectedRange.includes(item)) {
        groupedItems["DateRange"].push(item);
      }
    });
    return groupedItems;
  };

  const handleButtonClick = () => {
    setButtonClicked(!buttonClicked);
  };

  const handleRemoveTag = (itemName) => {
    setSelectedItems((prevSelectedItems) =>
      prevSelectedItems.filter((item) => item !== itemName)
    );
    setSelectedRange((prevSelectedItems) =>
      prevSelectedItems.filter((item) => item !== item)
    );
    onRowsFilterChange(salesData);
  };

  const handleRemovegroup = (groupName) => {
    onRowsFilterChange(salesData);
    setSelectedItems((prevSelectedItems) =>
      prevSelectedItems.filter((item) => {
        const groupItems = groupSelectedItems()[groupName];
        return !groupItems.includes(item);
      })
    );

    setSelectedRange((prevSelectedRange) =>
      prevSelectedRange.filter(
        (item) => !groupSelectedItems()[groupName].includes(item)
      )
    );
  };

  const [searchValue, setSearchValue] = useState("");
  // Event handler for input change
  const handleInputChange = (event) => {
    setSearchValue(event.target.value);
  };
  // Filter client names based on the search value
  const filteredClientNames = ClientNamesArray.filter((itemName) =>
    itemName.toLowerCase().includes(searchValue.toLowerCase())
  );
  const filteredUserNames = fullNamesArray.filter((itemName) =>
    itemName.toLowerCase().includes(searchValue.toLowerCase())
  );


  const renderGroupedItems = () => {
    const groupedItems = groupSelectedItems();
    return (
      <div className="mainTagsWrapper">
        {Object.entries(groupedItems).map(([group, items]) => (
          <div key={group}>
            {items.length > 0 && (
              <div className="tags-input-container">
                <ul className={group}>
                  {items.map((item, index) => (
                    <li className="mainWrapperTags tag-item-wrap" key={index}>
                      {item}
                      <Button
                        variant="link"
                        size="sm"
                        style={{ marginLeft: "5px" }}
                        onClick={() => handleRemoveTag(item)}
                      >
                        <X color="#F96969" size={15} />
                      </Button>
                    </li>
                  ))}
                  <Button
                    variant="link"
                    size="sm"
                    style={{ marginLeft: "0px" }}
                    onClick={() => handleRemovegroup(group)}
                  >
                    <X color="#F96969" size={20} />
                  </Button>
                </ul>
              </div>
            )}
          </div>
        ))}
      </div>
    );
  };

  // When Click outside then close dropdown
  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (
        filterDropdownRef.current &&
        !filterDropdownRef.current.contains(event.target)
      ) {
        if (!event.target.closest(".tab-content,.nav-tabs")) {
          setButtonClicked(false);
        }
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  return (
    <>
      <div className={`${selectClass} flexbetween paddingLR tableTopBar tableTopBarSales`}>
        {selectedRow.length === 0 ? (
          <Container fluid>
            <Row style={{ display: "flex", alignItems: "center" }}>
              <Col
                style={{
                  textAlign: "left",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <div className="filterDropDown">
                  <Button
                    ref={filterDropdownRef}
                    variant="link"
                    onClick={handleButtonClick}
                  >
                    {buttonClicked ? (
                      <Filter color="#344054" size={20} />
                    ) : (
                      <Filter color="#344054" size={20} />
                    )}
                  </Button>
                </div>
                <div className="filterSearch">
                  <SearchFilter
                    onRowsFilterChange1={onRowsFilterChange}
                    rowsFilter={rows}
                  />
                </div>
              </Col>
              <Col>
                <div className="centerTabSales">
                  <ul>
                    <li>
                      <NavLink to="#">Sales</NavLink>
                    </li>
                    <li>
                    {profileData && profileData.bank_detail && profileData.bank_detail.account_number ? (
                        <NavLink className="tabActive" to="/sales/newquote/selectyourclient">
                          New <PlusLg color="#fff" size={16} />
                        </NavLink>
                      ) : (
                        <BankDetailsModel />
                      )}
                    </li>
                  </ul>
                </div>
              </Col>
              <Col style={{ textAlign: "right" }}>
                {salesData && salesData.length > 0 ? (
                  <p className="flexEndStyle styleT3">
                    Total{" "}
                    <span className="styleT2">
                    
                    {rowsfilter.length ? (
                      <> {rowsfilter.length}</>
                    ) : (
                      <>{salesData.length} </>
                    )}
                    
                    Sales</span>{" "}
                    <strong className="styleT1">
                    ${formattedFAmount !== null && formattedFAmount !== undefined && formattedFAmount > 0 ? (
                        <>{formattedFAmount}</>
                      ) : (
                        <>{formattedAmount}</>
                      )}
                  </strong>
                  </p>
                ) : (
                  <p className="flexEndStyle styleT3">
                    Total <span className="styleT2">0 Sales</span>{" "}
                    <strong className="styleT1">$0.00</strong>
                  </p>
                )}
              </Col>
            </Row>
          </Container>
        ) : (
          <Container fluid>
            <Row style={{ display: "flex", alignItems: "center" }}>
              <Col
                style={{
                  textAlign: "left",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <span className="styleT4">Selected:{selectedRowCount}</span>
                <ul className="filterBtn">
                  <li>
                    <Button variant="lostFilter" onClick={handleMoveToLost}>
                      Lost
                      <XCircle color="#D92D20" size={20} />
                    </Button>
                    <ConfettiComponent
                      active={confetti}
                      config={
                        {
                          /* customize confetti config */
                        }
                      }
                    />
                  </li>
                  <li>
                    {" "}
                    <Button variant="wonFilter" onClick={handleMoveToWon}>
                      Won
                      <CheckCircle color="#079455" size={20} />
                    </Button>
                    <ConfettiComponent
                      active={confetti}
                      config={
                        {
                          /* customize confetti config */
                        }
                      }
                    />
                  </li>
                  <li>
                    <Button variant="downloadBtn">
                      <Download color="#344054" size={20} />
                    </Button>
                  </li>
                </ul>
              </Col>
              <Col>
                <div className="centerTabSales">
                  <ul>
                    <li>
                      <NavLink to="/sales">Sales</NavLink>
                    </li>
                    <li>
                      <BankDetailsModel />
                    </li>
                  </ul>
                </div>
              </Col>
              <Col style={{ textAlign: "right" }}>
              {salesData && salesData.length > 0 ? (
                  <p className="flexEndStyle styleT3">
                    Total{" "}
                    <span className="styleT2">
                    
                    {rowsfilter.length ? (
                      <> {rowsfilter.length}</>
                    ) : (
                      <>{salesData.length} </>
                    )}
                    
                    Sales</span>{" "}
                    <strong className="styleT1">
                    ${formattedFAmount !== null && formattedFAmount !== undefined && formattedFAmount > 0 ? (
                        <>{formattedFAmount}</>
                      ) : (
                        <>{formattedAmount}</>
                      )}
                  </strong>
                  </p>
                ) : (
                  <p className="flexEndStyle styleT3">
                    Total <span className="styleT2">0 Sales</span>{" "}
                    <strong className="styleT1">$0.00</strong>
                  </p>
                )}
              </Col>
            </Row>
          </Container>
        )}
      </div>
      {buttonClicked && (
        <Tabs
          id="controlled-tab-example"
          activeKey={key}
          onSelect={(k) => setKey(k)}
          className="filtterBoxWrapper"
        >
          <Tab
            eventKey="DateRange"
            title={
              <>
                <CalendarWeek color="#667085" size={16} /> Date Range
              </>
            }
          >
            <ul>
              <DateRangePicker salesData={salesData} onDataApply={handleDataApply} />
            </ul>
          </Tab>
          <Tab
            eventKey="Progress"
            title={
              <>
                <BarChartSteps color="#667085" size={16} /> Progress
              </>
            }
          >
            <ul>
              {leadArray.map((itemName, index) => (
                <li
                  key={index}
                  className={
                    selectedItems.includes(itemName.name) ? "checkedList" : ""
                  }
                >
                  <label className="customCheckBox">
                    <div className="userName">
                      <div className="ProgressTag">
                        <div className="option" data-percentage="10">
                          <input
                            type="checkbox"
                            value={itemName}
                            checked={selectedItems.includes(itemName)}
                            onChange={() => handleCheckboxChange(itemName)}
                          />
                          <span className="checkmark">
                            <Check color="#9E77ED" size={20} />
                          </span>
                          <div className="progressWrapper">
                            <div className="labelInfo">
                              <strong>{itemName}</strong>
                              <div className="progress-light-grey">
                                <div
                                  className="progress-container progress-color progress-center"
                                  style={{
                                    background: `linear-gradient(90deg, #1ab2ff ${percentageJsonArray[index]}%, transparent ${percentageJsonArray[index]}%)`,
                                  }}
                                  aria-valuenow={percentageJsonArray[index]}
                                  aria-valuemin="0"
                                  aria-valuemax="100"
                                >
                                  <span>{percentageJsonArray[index]}%</span>
                                </div>
                              </div>
                            </div>
                            <label>{percentageJsonArray[index]}%</label>
                          </div>
                        </div>
                      </div>
                    </div>
                  </label>
                </li>
              ))}
              <Row className="buttomBottom d-flex justify-content-between align-items-center">
                <Col className="pr-2">
                  <Button
                    variant="tabContent tabCancel"
                    onClick={clearSelectedTags}
                  >
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
          <Tab
            eventKey="FullName"
            title={
              <>
                <Person color="#667085" size={16} /> User
              </>
            }
          >
            <ul>
              <div className="filterSearch filterSearchTab">
                <span className="mr-3">
                  <Search color="#98A2B3" size={20} />
                </span>
                <input
                  type="text"
                  placeholder="Search"
                  value={searchValue}
                  onChange={handleInputChange}
                />
              </div>
              <div className="scrollItemsBox">
                {filteredUserNames.map((itemName, index) => (
                  <li
                    key={index}
                    className={
                      selectedItems.includes(itemName) ? "checkedList" : ""
                    }
                  >
                    <label className="customCheckBox">
                      <div className="userName">{itemName}</div>

                      <input
                        type="checkbox"
                        value={itemName}
                        checked={selectedItems.includes(itemName)}
                        onChange={() => handleCheckboxChange(itemName)}
                      />
                      <span className="checkmark">
                        <Check color="#9E77ED" size={20} />
                      </span>
                    </label>
                  </li>
                ))}
              </div>
              <Row className="buttomBottom d-flex justify-content-between align-items-center">
                <Col className="pr-2">
                  <Button
                    variant="tabContent tabCancel"
                    onClick={clearSelectedTags}
                  >
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
          <Tab
            eventKey="ClientNames"
            title={
              <>
                <PersonBoundingBox color="#667085" size={16} />
                Client
              </>
            }
          >
            <ul>
              <div className="filterSearch filterSearchTab">
                <span className="mr-3">
                  <Search color="#98A2B3" size={20} />
                </span>
                <input
                  type="text"
                  placeholder="Search"
                  value={searchValue}
                  onChange={handleInputChange}
                />
              </div>
              {filteredClientNames.map((itemName, index) => (
                <li
                  key={index}
                  className={
                    selectedItems.includes(itemName) ? "checkedList" : ""
                  }
                >
                  <label className="customCheckBox">
                    <div className="userName">{itemName}</div>
                    <input
                      type="checkbox"
                      value={itemName}
                      checked={selectedItems.includes(itemName)}
                      onChange={() => handleCheckboxChange(itemName)}
                    />
                    <span className="checkmark">
                      <Check color="#9E77ED" size={20} />
                    </span>
                  </label>
                </li>
              ))}
              <Row className="buttomBottom d-flex justify-content-between align-items-center">
                <Col className="pr-2">
                  <Button
                    variant="tabContent tabCancel"
                    onClick={clearSelectedTags}
                  >
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
          <Tab
            eventKey="Status"
            title={
              <>
                <ViewStacked color="#667085" size={16} />
                Status
              </>
            }
          >
            <ul>
              {StatusesArray.map((itemName, index) => (
                <li
                  key={index}
                  className={
                    selectedItems.includes(itemName) ? "checkedList" : ""
                  }
                >
                  <label className={`customCheckBox ${itemName}`}>
                    <input
                      type="checkbox"
                      value={itemName}
                      onChange={() => handleCheckboxChange(itemName)}
                      checked={selectedItems.includes(itemName)}
                    />
                    <span className="checkmark">
                      <Check color="#9E77ED" size={20} />
                    </span>
                    <div className="userName">
                      <span className="NameStatus">{itemName}</span>{" "}
                      <span className="countStatus">
                        {getStatusCount(itemName)}
                      </span>
                    </div>
                  </label>
                </li>
              ))}
              <Row className="buttomBottom d-flex justify-content-between align-items-center">
                <Col className="pr-2">
                  <Button
                    variant="tabContent tabCancel"
                    onClick={clearSelectedTags}
                  >
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
      {filteredItems.length > 0 && renderGroupedItems()}
    </>
  );
};

export default TableTopBar;
