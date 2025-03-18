import React, { useEffect, useState, useRef } from "react";
import {
  X,
  Filter,
  Check,
  ViewStacked,
  CalendarWeek,
  BarChartSteps,
  XCircle,
  Download,
  CheckCircle,
  Person,
} from "react-bootstrap-icons";
import { NavLink } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import clsx from 'clsx';
import { useDebounce } from "primereact/hooks";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import { toast } from 'sonner';
import BankDetailsModel from "./features/bank-details-model";
import DateRangePicker from "./features/date-range-picker";
import { mapSalesData } from "./sales-tables";
import SearchFilter from "./search-filter";
import { getProjectManager } from "../../../../APIs/ClientsApi";
import { fetchMultipleLost } from "../../../../APIs/SalesApi";
import { fetchMultipleData } from "../../../../APIs/SalesApi";
import { formatAUD } from "../../../../shared/lib/format-aud";
import ImageAvatar from "../../../../ui/image-with-fallback/image-avatar";
import ConfettiComponent from "../../../layout/ConfettiComponent";

const leadArray = [
  {
    percentage: 10,
    label: "Lead",
    gradient: "linear-gradient(90deg, #1AB2FF 10%, transparent 10%)",
  },
  {
    percentage: 20,
    label: "Prospect",
    gradient: "linear-gradient(90deg, #1AB2FF 20%, transparent 20%)",
  },
  {
    percentage: 40,
    label: "Proposal sent",
    gradient: "linear-gradient(90deg, #1AB2FF 40%, transparent 40%)",
  },
  {
    percentage: 60,
    label: "Negotiation",
    gradient: "linear-gradient(90deg, #1AB2FF 60%, transparent 60%)",
  },
  {
    percentage: 80,
    label: "Awaiting approval",
    gradient: "linear-gradient(90deg, #1AB2FF 80%, transparent 80%)",
  },
];

const TableTopBar = ({
  profileData,
  salesData,
  removeRowMulti,
  selectedUniqueIds,
  onRowsFilterChange,
  rows,
  setSelectedRows,
  selectedRow,
  selectedRowCount,
}) => {
  const [totalAmount, setTotalAmount] = useState(0);
  const [key, setKey] = useState("DateRange");
  const [filter, setFilters] = useState({});
  const [filterState, setFilterState] = useState({});
  const [buttonClicked, setButtonClicked] = useState(false);
  const [confetti, setConfetti] = useState(false);
  const filterDropdownRef = useRef(null);
  const [inputValue, debouncedValue, setInputValue] = useDebounce('', 400);

  const projectManagerQuery = useQuery({ queryKey: ['project-manager'], queryFn: getProjectManager });

  const handleMoveToWon = async () => {
    try {
      if (selectedUniqueIds) {
        const success = await fetchMultipleData(selectedUniqueIds);
        if (success) {
          setSelectedRows([]);
          removeRowMulti();
          setConfetti(true);
          toast.success("Successfully moved to Management!");
        } else {
          toast.error("Failed to move to Management. Please try again.");
        }
      }
    } catch (error) {
      toast.error("An error occurred. Please try again.");
    }
  };

  const handleMoveToLost = async () => {
    try {
      if (selectedUniqueIds) {
        const success = await fetchMultipleLost(selectedUniqueIds);
        if (success) {
          setSelectedRows([]);
          removeRowMulti();
          setConfetti(true);
          toast.success("Sale request has been updated to Lost!");
        } else {
          toast.error("Failed to update to Lost. Please try again.");
        }
      }
    } catch (error) {
      toast.error("An error occurred. Please try again.");
    }
  };

  const startFilter = (state) => {
    let filteredRows = mapSalesData(salesData);
    if (state?.dateRange) {
      const [startDate, endDate] = state.dateRange;
      filteredRows = rows.filter((item) => {
        const itemDate = new Date(
          parseInt(item.created) * 1000
        ).toLocaleDateString("en-CA");
        return itemDate >= startDate && itemDate <= endDate;
      });
    }

    if (state?.progress) {
      filteredRows = filteredRows.filter((item) =>
        state?.progress?.includes(item.progressName)
      );
    }

    if (state.statuses?.length > 0) {
      filteredRows = filteredRows.filter((item) =>
        state?.statuses?.includes(item?.Status)
      );
    }

    if (state?.projectManager?.length > 0) {
      filteredRows = filteredRows.filter((item) =>
        item?.User?.map((user) => user?.full_name).some((name) =>
          state?.projectManager?.includes(name)
        )
      );
    }


    filteredRows = filteredRows.filter((item) =>
      item?.Client?.toLowerCase().includes(debouncedValue?.toLowerCase())
    );

    onRowsFilterChange(filteredRows);
  };

  const handleDataApply = (data) => {
    const formatDate = (date) =>
      date ? new Date(date).toLocaleDateString("en-CA") : "";

    const startDate = formatDate(data.startDate);
    const endDate = formatDate(data.endDate);
    const newRange = `${startDate} - ${endDate}`;
    setFilters({ ...filter, dateRange: [newRange] });

    let state = { ...filterState };
    state.dateRange = [startDate, endDate];
    setFilterState(state);
    startFilter(state);
    setButtonClicked(false);
  };

  const handleProgressChange = (label) => {
    setFilterState((prevFilterState) => {
      const prevProgress = prevFilterState.progress || [];
      if (prevProgress?.includes(label)) {
        return {
          ...prevFilterState,
          progress: prevProgress.filter((item) => item !== label),
        };
      } else {
        return {
          ...prevFilterState,
          progress: [...prevProgress, label],
        };
      }
    });
  };

  const applyProgressFilters = () => {
    const progressItems = filterState.progress || [];
    setFilters({ ...filter, progress: progressItems });
    startFilter(filterState);
    setButtonClicked(false);
  };

  const clearProgressFilters = () => {
    setFilterState((prevFilterState) => {
      const { progress, ...rest } = prevFilterState;
      return rest;
    });
  };

  const handleStatusChange = (status) => {
    setFilterState((prevFilterState) => {
      const prevStatuses = prevFilterState.statuses || [];
      if (prevStatuses?.includes(status)) {
        return {
          ...prevFilterState,
          statuses: prevStatuses.filter((item) => item !== status),
        };
      } else {
        return {
          ...prevFilterState,
          statuses: [...prevStatuses, status],
        };
      }
    });
  };

  const applyStatusFilters = () => {
    const newFilterState = { ...filterState };
    setFilterState(newFilterState);
    startFilter(newFilterState);
    setFilters({ ...filter, statuses: newFilterState.statuses });
    setButtonClicked(false);
  };

  const clearStatusFilters = () => {
    setFilterState((prevFilterState) => {
      const { statuses, ...rest } = prevFilterState;
      return rest;
    });
  };

  const handleProjectManagerChange = (projectManager) => {
    setFilterState((prevFilterState) => {
      const prevProjectManager = prevFilterState.projectManager || [];
      if (prevProjectManager?.includes(projectManager)) {
        return {
          ...prevFilterState,
          projectManager: prevProjectManager.filter((item) => item !== projectManager),
        };
      } else {
        return {
          ...prevFilterState,
          projectManager: [...prevProjectManager, projectManager],
        };
      }
    });
  };

  const applyProjectManagerFilters = () => {
    const newFilterState = { ...filterState };
    setFilterState(newFilterState);
    startFilter(newFilterState);
    setFilters({ ...filter, projectManager: newFilterState.projectManager });
    setButtonClicked(false);
  };

  const clearProjectManagerFilters = () => {
    console.log('...');
    setFilterState((prevFilterState) => {
      const { projectManager, ...rest } = prevFilterState;
      return rest;
    });
  };

  const handleRemoveTag = (group, itemName) => {
    const newFilters = { ...filter };
    const newItems = newFilters[group].filter((item) => item !== itemName);
    newFilters[group] = newItems;
    setFilters(newFilters);
    setFilterState({ ...filterState, [group]: newItems });
    startFilter({ ...filterState, [group]: newItems });
  };

  const handleRemoveGroup = (groupName) => {
    const newFilters = { ...filter };
    delete newFilters[groupName];
    setFilters(newFilters);

    const newFilterState = { ...filterState };
    delete newFilterState[groupName];
    setFilterState(newFilterState);
    startFilter(newFilterState);
  };

  const formattedAmount = formatAUD(totalAmount);
  useEffect(() => {
    if (rows?.length) {
      const calculatedFilterAmount = rows.reduce(
        (total, sale) => total + sale.amountData,
        0
      );
      setTotalAmount(calculatedFilterAmount);
    }
  }, [rows]);


  const handleButtonClick = () => {
    setButtonClicked(!buttonClicked);
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

  useEffect(() => {
    startFilter(filterState);
  }, [debouncedValue]);

  return (
    <>
      <div
        className={`${selectedRowCount ? "selected-row" : ""
          } flexbetween paddingLR tableTopBar tableTopBarSales`}
        style={{ borderBottom: "1px solid #f2f2f2" }}
      >
        {!selectedRow || selectedRow?.length === 0 ? (
          <Container fluid>
            <Row style={{ display: "flex", alignItems: "center" }}>
              <Col
                style={{
                  textAlign: "left",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <div className="filterDropDown" onClick={handleButtonClick}>
                  <Button ref={filterDropdownRef} variant="link">
                    {buttonClicked ? (
                      <Filter color="#344054" size={20} />
                    ) : (
                      <Filter color="#344054" size={20} />
                    )}
                  </Button>
                </div>
                <div className="filterSearch">
                  <SearchFilter
                    setInputValue={setInputValue}
                    inputValue={inputValue}
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
                      {profileData &&
                        profileData.bank_detail &&
                        profileData.bank_detail.account_number ? (
                        <NavLink
                          className="tabActive"
                          to="/sales/newquote/selectyourclient"
                        >
                          New
                        </NavLink>
                      ) : (
                        <BankDetailsModel />
                      )}
                    </li>
                  </ul>
                </div>
              </Col>
              <Col style={{ textAlign: "right" }}>
                {salesData && salesData?.length > 0 ? (
                  <p className="flexEndStyle styleT3">
                    Total{" "}
                    <span className="styleT2">
                      {rows?.length ? (
                        <> {rows?.length}</>
                      ) : (
                        <>{salesData?.length} </>
                      )}{" "}
                      Sales
                    </span>
                    <strong className="styleT1">
                      $
                      {formattedAmount !== null &&
                        formattedAmount !== undefined &&
                        formattedAmount > 0 ? (
                        <>{formattedAmount}</>
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
                <span className="styleT4">Selected: {selectedRowCount}</span>
                <ul className="filterBtn">
                  <li>
                    <Button variant="lostFilter" onClick={handleMoveToLost}>
                      Lost
                      <XCircle color="#D92D20" size={20} />
                    </Button>
                    <ConfettiComponent active={confetti} config={{}} />
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
              <Col></Col>
              <Col style={{ textAlign: "right" }}>
                {salesData && salesData?.length > 0 ? (
                  <p className="flexEndStyle styleT3">
                    Total{" "}
                    <span className="styleT2">
                      {rows?.length ? (
                        <> {rows?.length}</>
                      ) : (
                        <>{salesData?.length} </>
                      )}{" "}
                      Sales
                    </span>
                    <strong className="styleT1">
                      $
                      {formattedAmount !== null &&
                        formattedAmount !== undefined &&
                        formattedAmount > 0 ? (
                        <>{formattedAmount}</>
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
              <DateRangePicker onDataApply={handleDataApply} />
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
              <div style={{ maxHeight: "350px", overflow: "auto" }}>
                {leadArray.map((item, index) => (
                  <li
                    key={index}
                    className={
                      filterState?.progress?.includes(item.label)
                        ? "checkedList"
                        : ""
                    }
                  >
                    <label className="customCheckBox">
                      <div className="userName">
                        <div className="ProgressTag">
                          <div
                            className="option"
                            data-percentage={item.percentage}
                          >
                            <input
                              type="checkbox"
                              value={item.label}
                              checked={filterState?.progress?.includes(
                                item.label
                              )}
                              onChange={() => handleProgressChange(item.label)}
                            />
                            <span className="checkmark">
                              <Check color="#9E77ED" size={20} />
                            </span>
                            <div className="progressWrapper">
                              <div className="labelInfo">
                                <strong>{item.label}</strong>
                                <div className="progress-light-grey">
                                  <div
                                    className="progress-container progress-color progress-center"
                                    style={{ background: item.gradient }}
                                    aria-valuenow={item.percentage}
                                    aria-valuemin="0"
                                    aria-valuemax="100"
                                  >
                                    <span>{item.percentage}%</span>
                                  </div>
                                </div>
                              </div>
                              <label>{item.percentage}%</label>
                            </div>
                          </div>
                        </div>
                      </div>
                    </label>
                  </li>
                ))}
              </div>
              <Row className="buttomBottom d-flex justify-content-between align-items-center">
                <Col className="pr-2">
                  <Button variant="tabContent tabCancel" onClick={clearProgressFilters}>
                    Cancel
                  </Button>
                </Col>
                <Col>
                  <Button
                    variant="tabContent tabApply"
                    onClick={applyProgressFilters}
                  >
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
              <div style={{ maxHeight: "350px", overflow: "auto" }}>
                {['Draft', 'Saved', 'Sent', 'Accepted', 'Recurring', 'Review', 'Declined', 'Required'].map((itemName, index) => (
                  <li
                    key={index}
                    className={
                      filterState?.statuses?.includes(itemName) ? "checkedList" : ""
                    }
                  >
                    <label className={`customCheckBox ${itemName}`}>
                      <input
                        type="checkbox"
                        value={itemName}
                        checked={filterState?.statuses?.includes(itemName)}
                        onChange={() => handleStatusChange(itemName)}
                      />
                      <span className="checkmark">
                        <Check color="#9E77ED" size={20} />
                      </span>
                      <div className="userName">
                        <span className={clsx('statusInfo', itemName)}><a>{itemName}</a></span>{" "}
                      </div>
                    </label>
                  </li>
                ))}
              </div>
              <Row className="buttomBottom d-flex justify-content-between align-items-center">
                <Col className="pr-2">
                  <Button
                    variant="tabContent tabCancel"
                    onClick={clearStatusFilters}
                  >
                    Cancel
                  </Button>
                </Col>
                <Col>
                  <Button
                    variant="tabContent tabApply"
                    onClick={applyStatusFilters}
                  >
                    Apply
                  </Button>
                </Col>
              </Row>
            </ul>
          </Tab>

          <Tab
            eventKey="projectManager"
            title={
              <>
                <Person color="#667085" size={16} />
                Project Manager
              </>
            }
          >
            <ul>
              <div id="controlled-tab-example-tabpane-Status" style={{ maxHeight: "350px", overflow: "auto" }}>
                {
                  projectManagerQuery?.data?.map((itemName, index) => (
                    <li
                      key={index}
                      className={
                        filterState?.projectManager?.includes(itemName.name) ? "checkedList" : ""
                      }
                    >
                      <label className={`customCheckBox ${itemName.name}`}>
                        <input
                          type="checkbox"
                          value={itemName.name}
                          checked={filterState?.projectManager?.includes(itemName.name) || false}
                          onChange={() => handleProjectManagerChange(itemName.name)}
                        />
                        <span className="checkmark">
                          <Check color="#9E77ED" size={20} />
                        </span>
                        <div className="ms-3 d-flex justify-content-center align-items-center">
                          <ImageAvatar has_photo={itemName.has_photo} photo={itemName.photo} is_business={false} />
                          <span className="font-14" style={{ color: '#374151' }}><a>{itemName.name}</a></span>
                        </div>
                      </label>
                    </li>
                  ))
                }
              </div>
              <Row className="buttomBottom d-flex justify-content-between align-items-center">
                <Col className="pr-2">
                  <Button
                    variant="tabContent tabCancel"
                    onClick={clearProjectManagerFilters}
                  >
                    Cancel
                  </Button>
                </Col>
                <Col>
                  <Button
                    variant="tabContent tabApply"
                    onClick={applyProjectManagerFilters}
                  >
                    Apply
                  </Button>
                </Col>
              </Row>
            </ul>
          </Tab>
        </Tabs>
      )}
      {Object.keys(filter)?.length > 0 && (
        <div className="mainTagsWrapper">
          {Object.entries(filter)?.map(([group, items]) => (
            <div key={group}>
              {items?.length > 0 && (
                <div className="tags-input-container">
                  <ul>
                    {items.map((item, index) => (
                      <li className="mainWrapperTags tag-item-wrap" key={index}>
                        {item}
                        {items?.length > 1 && (
                          <Button
                            variant="link"
                            size="sm"
                            style={{ marginLeft: "5px" }}
                            onClick={() => handleRemoveTag(group, item)}
                          >
                            <X color="#F96969" size={15} />
                          </Button>
                        )}
                      </li>
                    ))}
                    <Button
                      variant="link"
                      size="sm"
                      style={{ marginLeft: "0px" }}
                      onClick={() => handleRemoveGroup(group)}
                    >
                      <X color="#F96969" size={20} />
                    </Button>
                  </ul>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </>
  );
};

export default TableTopBar;
