import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from 'react-bootstrap/Button';
import {X,Filter,Person,Check,CalendarWeek, Search,Download,PlusLg} from "react-bootstrap-icons";
import SearchFilter from './SearchFilter';
import User01 from "../../../../assets/images/icon/user-01.png";
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import DateRangePicker from "./DateRangePicker";
import NewTaskModal from "../../../layout/modals/NewTaskModal";

const TableTopBar = ({rows,onRowsFilterChange, TasksData, selectedRowCount,selectClass,selectedRow }) => {
  const [totalAmount, setTotalAmount] = useState(0);
  const [selectedItems, setSelectedItems] = useState([]);
  const [buttonClicked, setButtonClicked] = useState(false);
  const [filteredItems, setFilteredItems] = useState([]);
  const [selectedRange, setSelectedRange] = useState([]);

  const formattedAmount = totalAmount.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  useEffect(() => {
    if (TasksData) {
      const calculatedTotalAmount = TasksData.reduce(
        (total, sale) => total + sale.amount,
        0
      );
      setTotalAmount(calculatedTotalAmount);
    }
  }, [TasksData]);


  const handleDataApply = (data) => {
    const startDate = data.startDate ? data.startDate.toISOString().split("T")[0] : "";
    const endDate = data.endDate ? data.endDate.toISOString().split("T")[0] : "";
    let item = [`${startDate} - ${endDate}`];
    setFilteredItems((prev)=>{
      return [...prev, item]
    })
    setSelectedRange(item);
    setButtonClicked(false);
    const filteredRows = rows.filter((item) => {
      return (
        selectedItems.includes(item.name) || selectedItems.includes(item.status) || selectedRange.includes(`${item.startDate} - ${item.endDate}`)
        );
      });
      onRowsFilterChange(filteredRows); 
  };
  
  useEffect(()=> {
    renderGroupedItems();
  }, [selectedRange])
  
  
  const fullNames = [...new Set(TasksData.map(item => item.user.full_name))];

  
  const fullCategoryJson = JSON.stringify(fullNames, null, 2);
  const fullCategoryArray = JSON.parse(fullCategoryJson);


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
    const filteredRows = rows.filter((item) => {
      return (
        selectedItems.includes(item.name) || selectedItems.includes(item.status) 
      );
    });
    onRowsFilterChange(filteredRows);
    setButtonClicked(!buttonClicked); // When select then close toggle filter
  };

  const clearSelectedTags = () => {
    setSelectedItems([]);
    
    setButtonClicked(false);
  };

  const [key, setKey] = useState(fullCategoryJson);

  const groupSelectedItems = () => {
    const isEmpty = Array.isArray(selectedRange) && selectedRange.length === 0;
    const groupedItems = {
      'Category': [],
      'DateRange': isEmpty ? [] : [selectedRange],
    };

    selectedItems.forEach((item) => {
      if (fullCategoryArray.includes(item)) {
        groupedItems['Category'].push(item);
      } else if (selectedRange.includes(item)) {
        groupedItems['DateRange'].push(item);
      }
    });
    return groupedItems;
  };


  const sliceWords = (str, numWords) => {
    const words = str.split(' ');
    return words.slice(0, numWords).join(' ');
  };


  const handleButtonClick = () => {
    setButtonClicked(!buttonClicked);
  }


  const [searchValue, setSearchValue] = useState('');

// Event handler for input change
const handleInputChange = (event) => {
  setSearchValue(event.target.value);
};

// Filter client names based on the search value
const filteredCategory = fullCategoryArray.filter((itemName) =>
  itemName.toLowerCase().includes(searchValue.toLowerCase())
);








  const handleRemoveTag = (itemName) => {
    setSelectedItems((prevSelectedItems) => prevSelectedItems.filter((item) => item !== itemName));
    setSelectedRange((prevSelectedItems) => prevSelectedItems.filter((item) => item !== item));
    
  };
  const handleRemovegroup = (groupName) => {
    onRowsFilterChange(rows);
    setSelectedItems((prevSelectedItems) =>
      prevSelectedItems.filter((item) => {
        const groupItems = groupSelectedItems()[groupName];
        return !groupItems.includes(item); 
      })
    );
  
    setSelectedRange((prevSelectedRange) =>
      prevSelectedRange.filter((item) => !groupSelectedItems()[groupName].includes(item))
      );
  };
  
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
                    <li className='mainWrapperTags tag-item-wrap' key={index}>{item}<Button variant="link" size="sm" style={{ marginLeft: '5px' }} onClick={() => handleRemoveTag(item)}><X color="#F96969" size={15} /></Button></li>
                    ))}
                  <Button variant="link" size="sm" style={{ marginLeft: '0px' }} onClick={() => handleRemovegroup(group)} ><X color="#F96969" size={20} /></Button>
                </ul>
              </div>
            )}
          </div>
        ))}
      </div>
    );
  };
  
  return (
    <>
  <div className={`${selectClass} flexbetween paddingLR tableTopBar`}>
        {selectedRow.length === 0 ? (
          <Container fluid>
            <Row style={{ display: "flex", alignItems: "center" }}>
              <Col style={{ textAlign: "left", display: "flex", alignItems: "center" }}>
              <div className="filterDropDown">
            <Button variant="link" onClick={handleButtonClick}>
              {buttonClicked ? <Filter color='#344054' size={20} /> : <Filter color='#344054' size={20} />}
            </Button>
         </div>
    <div className='filterSearch'>
    <SearchFilter onRowsFilterChange1={onRowsFilterChange} rowsFilter={rows}/>
   </div>
  </Col>
  <Col>
    <div className="centerTabSales">
      <ul>
        <li>
          <NavLink to="/">Tasks</NavLink>
         
        </li>
        <li>
          {/* <NavLink to="/new" className="tabActive">
            New
          </NavLink> */}
          <NewTaskModal />
        </li>
      </ul>
    </div>
  </Col>
  <Col style={{ textAlign: "right" }}>
    {TasksData && TasksData.length > 0 ? (
      <p className="flexEndStyle styleT3" >
        Total <span className="styleT2">{TasksData.length} Tasks</span>{" "}
        
      </p>
    ) : (
      <p className="flexEndStyle styleT3">
        Total <span className="styleT2">0 Tasks</span>
      </p>
    )}
  </Col>
</Row>
</Container>
      ) : (
        <Container fluid>
        <Row style={{ display: "flex", alignItems: "center" }}>
          <Col style={{ textAlign: "left", display: "flex", alignItems: "center" }}>
            <span className="styleT4">Selected:{selectedRowCount}</span>
            <ul className="filterBtn">
             
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
                  <NavLink to="/">Clients</NavLink>
                </li>
                <li>
                  <NavLink to="/new" className="tabActive">
                    New 
                  </NavLink>
                </li>
              </ul>
            </div>
          </Col>
          <Col style={{ textAlign: "right" }}>
            {TasksData && TasksData.length > 0 ? (
              <p className="flexEndStyle styleT3">
                Total <span className="styleT2">{TasksData.length} Tasks</span>{" "}
              
              </p>
            ) : (
              <p className="flexEndStyle styleT3">
                Total <span className="styleT2">0 Tasks</span> 
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
       className="filtterBoxWrapper">
        <Tab eventKey="DateRange" title={<><CalendarWeek color="#667085" size={16} /> Date Range</>}>
        <ul>
        <DateRangePicker onDataApply={handleDataApply} />
         </ul>
        </Tab>
      
        <Tab eventKey="Category" title={<><Person color="#667085" size={16} /> Category</>}>
          <ul>
          <div className='filterSearch filterSearchTab'>
          <span className='mr-3'>
        <Search color='#98A2B3' size={20} />
          </span>
            <input
              type="text"
              placeholder="Search"
              value={searchValue}
              onChange={handleInputChange}
            />
          </div>
            {filteredCategory.map((itemName, index) => (
               <li key={index} className={selectedItems.includes(itemName) ? 'checkedList' : ''}>
                <label className="customCheckBox">
                <div className="userName">
                  <img src={User01} alt="User01" />
                  {itemName} <span className="shortNameTag">@{sliceWords(itemName, 1)}</span>
                </div>
              
                  <input
                    type="checkbox"
                    value={itemName}
                    checked={selectedItems.includes(itemName)}
                    onChange={() => handleCheckboxChange(itemName)}
                  />
                 <span className="checkmark">
                  <Check color="#1AB2FF" size={20} />
                </span>
                </label>
              </li>
            ))}
               <Row className="buttomBottom d-flex justify-content-between align-items-center">
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
      {filteredItems.length > 0 && renderGroupedItems()}
</>
  );
};

export default TableTopBar
