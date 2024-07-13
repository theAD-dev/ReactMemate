import React, { useEffect, useState ,forwardRef} from "react";
import { Link } from "react-router-dom";
import Button from 'react-bootstrap/Button';
import Offcanvas from 'react-bootstrap/Offcanvas';
import defaultIcon from "../../../../assets/images/icon/default.png";
import {
  Check,
  ChevronLeft,ArrowDown,ArrowUp ,Building,Person,FilePdf,Link45deg,InfoCircle,PlusSlashMinus
} from "react-bootstrap-icons";

import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import NodataImg from "../../../../assets/images/img/NodataImg.png";
import nodataBg from "../../../../assets/images/nodataBg.png";
import SearchIcon from "../../../../assets/images/icon/searchIcon.png";


import { Table } from "react-bootstrap";
import TableTopBar from "./TableTopBar";
import { Resizable } from 'react-resizable';


  const OrdersTables = forwardRef(({ OrdersData, fetchData, isFetching }, ref) => {
  const [sortField, setSortField] = useState("Quote");
  const [sortDirection, setSortDirection] = useState("asc");
  const [selectedRow, setSelectedRow] = useState(null);

  const ClientsResults = Array.isArray(OrdersData) ? OrdersData : OrdersData.results;

 // Formate Date
 const formatDate = (timestamp) => {
  const date = new Date(timestamp * 1000);
  const day = date.getDate();
  const monthAbbreviation = new Intl.DateTimeFormat("en-US", {
    month: "short",
  }).format(date);
  const year = date.getFullYear();
  return `${day} ${monthAbbreviation} ${year}`;
};



  const toggleSort = (field) => {
    setSortField(field);
    setSortDirection((prevDirection) =>
      prevDirection === "asc" ? "desc" : "asc"
    );
  };

  const sortedClientsData = [...ClientsResults].sort((a, b) => {
    const aValue = a[sortField];
    const bValue = b[sortField];
  
    
    if (aValue === undefined || bValue === undefined) {
      return 0; 
    }
  
    if (sortDirection === "asc") {
      return aValue.localeCompare(bValue, undefined, { numeric: true });
    } else {
      return bValue.localeCompare(aValue, undefined, { numeric: true });
    }
  });

  const [show, setShow] = useState(false);

  const handleRowClick = (rowId) => {
    setSelectedRow(rowId === selectedRow ? null : rowId);
    setShow(true)
  };

 

    const handleClose = () => setShow(false);


  const [selectedRows, setSelectedRows] = useState([]);
  const handleSelectAllCheckboxChange = () => {
    const allRowIds = ClientsResults.map((sale) => sale.id);
    if (selectedRows.length === allRowIds.length) {
      setSelectedRows([]);
    } else {
      setSelectedRows(allRowIds);
    }
  };

  const selectedRowsCount = selectedRows.length;

  const [columns, setColumns] = useState([
    {
      field: "Quote",
      width: 140,
      headerName: (
        <div className="styleColor1" onClick={() => toggleSort("Quote")}>
        <span>Order #</span>
       
      </div>
      ),
 
      renderCell: (params) => (
        <div className="styleColor1 clientTdFlex">
        <div>
        <strong>{params.value.substring(6)} </strong>
        <p>{params.row.created}</p>
        </div>
        <Button className="linkByttonStyle" variant="link">Open</Button>
      </div>
      ),
    },
    {
      field: "",
      sortable: false,
      headerName: "Calculation",
      width: 164,
      renderCell: (params) => (
        <div>
          <ul className="disPlayInline disPlayInlineCenter">
            <li>
              <PlusSlashMinus color="#FDB022" size={16} />
            </li>
            <li>
              <Link to={params.row.invoice_url}>
                <FilePdf color="#FF0000" size={16} />
              </Link>
            </li>
            <li>
              <Link to={params.row.unique_url}>
                <Link45deg color="#3366CC" size={16} />
              </Link>
            </li>
          </ul>
        </div>
      ),
    },
    {
      field: "Client",
      width: 224,
      headerName: (
        <div className="styleColor1" onClick={() => toggleSort("Client")}>
        <span>Customer</span>
       
      </div>
      ),
  
      renderCell: (params) => (
        <div className="userImgStyle">
          <div className="innerFlex styleColor2 d-flex justify-content-between">
            <div className="leftStyle d-flex align-items-center isbusinessIcon"
            style={{ whiteSpace: "nowrap" }}
            >
              {params.row.photo ? (
                <img
                  src={params.row.photo}
                  alt={params.row.photo}
                  style={{ marginRight: "5px" }}
                  onError={(e) => {
                    e.target.src = defaultIcon;
                    e.target.alt = "Image Not Found";
                  }}
                />
              ) : (
                params.row.isbusiness ? (
                  <div className="iconBuilding">
                    <Building size={13.71} color="#667085" />
                  </div>
                ) : (
                  <div className="iconPerson">
                    <Person size={24} color="#667085" />
                  </div>
                )
              )}
              <span>{params.value}</span>
            </div>
           
          </div>
        </div>
      ),
      
    },
    {
      field: "reference",
      minWidth: 300,
      sortable: false,
      headerName: "Order Reference",
      renderCell: (params) => (
        <div
          className="mainStyle reference"
          style={{ textAlign: "left" }}
        >
          {params.value}
        
        </div>
      ),
    },

    {
      field: "",
      sortable: false,
      headerName: "Info",
      width: 68,
      renderCell: (params) => (
        <div
        className=""
        style={{ whiteSpace: "normal", textAlign: "center" }}
      >
         <InfoCircle size={24} color="#98A2B3" />
         
        </div>
      ),
    },

    {
      field: "status",
      sortable: false,
      width: 113,
      headerName: (
        <div className="styleColor1" onClick={() => toggleSort("Status")}>
        <span>Status</span>
        {sortField === "Status" && (
          <span>
            {sortDirection === "asc" ? (
              <ArrowUp size={16} color="#475467" />
            ) : (
              <ArrowDown size={16} color="#475467" />
            )}
          </span>
        )}
      </div>
      ),
    
      renderCell: (params) => (
        <div className={`statusInfo ${params.value}`}>
          <Link to="/">{params.value}</Link>
        </div>
      ),
    },

    
    {
      field: "budget",
      width: 110,
      sortable: false,
      headerName: (
        <div className="styleColor1" onClick={() => toggleSort("Status")}>
        <span>Budget</span>
        {sortField === "Status" && (
          <span>
            {sortDirection === "asc" ? (
              <ArrowUp size={16} color="#475467" />
            ) : (
              <ArrowDown size={16} color="#475467" />
            )}
          </span>
        )}
      </div>
      ),
      
      renderCell: (params) => (
        <div className="styleColor1 budgetColor">
         ${params.value}
        </div>
      ),
    },
    {
      field: "real_cost",
      sortable: false,
      headerName: "Real Cost ",
      width: 138,
      renderCell: (params) => (
        <div
        className="RealCostCircleStyle piCircleStyle"
        style={{ whiteSpace: "normal", textAlign: "left" }}
      >
        <div style={{ width: 32, height: 32 }}>
       <CircularProgressbar 
  value={params.row.RealCost}
  text={`${params.row.RealCost}%`}
  strokeWidth={11}
  styles={{
    root: {},
    path: {
      stroke: `rgba(234, 236, 240, ${params.row.RealCost / 100})`,
      strokeLinecap: 'butt',
      transition: 'stroke-dashoffset 0.5s ease 0s',
      transform: 'rotate(0.25turn)',
      transformOrigin: 'center center',
    },
    trail: {
      stroke: '#25D5D0',
      strokeLinecap: '#EAECF0',
      transform: 'rotate(0.25turn)',
      transformOrigin: 'center center',
    },
    text: {
      fill: '#667085',
      fontSize: '30px',
    },
    background: {
      fill: '#ffffff',
    },
  }}
  
/></div>
         <span>${params.value}
         
         </span>
        </div>
      ),
    },
    {
      field: "labor_expenses",
      sortable: false,
      headerName: "Labour ",
      width: 138,
      renderCell: (params) => (
        <div
        className="labourCircleStyle piCircleStyle"
        style={{ whiteSpace: "normal", textAlign: "left" }}
      >
        <div style={{ width: 32, height: 32 }}>
       <CircularProgressbar 
  value={params.row.LabourCost}
  text={`${params.row.LabourCost}%`}
  strokeWidth={11}
  styles={{
    root: {},
    path: {
      stroke: `rgba(234, 236, 240, ${params.row.LabourCost / 100})`,
      strokeLinecap: 'butt',
      transition: 'stroke-dashoffset 0.5s ease 0s',
      transform: 'rotate(0.25turn)',
      transformOrigin: 'center center',
    },
    trail: {
      stroke: '#F79009',
      strokeLinecap: '#EAECF0',
      transform: 'rotate(0.25turn)',
      transformOrigin: 'center center',
    },
    text: {
      fill: '#667085',
      fontSize: '30px',
    },
    background: {
      fill: '#ffffff',
    },
  }}
  
/></div>
         <span>${params.value}</span>
        </div>
      ),
    },
    {
      field: "cost_of_sale",
      sortable: false,
      headerName: "Cost of Sale ",
      width: 138,
      renderCell: (params) => (
        <div
        className="csCircleStyle piCircleStyle"
        style={{ whiteSpace: "normal", textAlign: "left" }}
      >
        <div style={{ width: 32, height: 32 }}>
       <CircularProgressbar 
  value={params.row.CostofSale}
  text={`${params.row.CostofSale}%`}
  strokeWidth={11}
  styles={{
    root: {},
    path: {
      stroke: `rgba(234, 236, 240, ${params.row.CostofSale / 100})`,
      strokeLinecap: 'butt',
      transition: 'stroke-dashoffset 0.5s ease 0s',
      transform: 'rotate(0.25turn)',
      transformOrigin: 'center center',
    },
    trail: {
      stroke: '#F04438',
      strokeLinecap: '#EAECF0',
      transform: 'rotate(0.25turn)',
      transformOrigin: 'center center',
    },
    text: {
      fill: '#667085',
      fontSize: '30px',
    },
    background: {
      fill: '#ffffff',
    },
  }}
  
/></div>
         <span>${params.value}</span>
        </div>
      ),
    },
    {
      field: "operating_expense",
      sortable: false,
      headerName: "Operating Expense ",
      width: 152,
      renderCell: (params) => (
        <div
        className="oeCircleStyle piCircleStyle"
        style={{ whiteSpace: "normal", textAlign: "left" }}
      >
        <div style={{ width: 32, height: 32 }}>
       <CircularProgressbar 
  value={params.row.OeCast}
  text={`${params.row.OeCast}%`}
  strokeWidth={11}
  styles={{
    root: {},
    path: {
      stroke: `rgba(234, 236, 240, ${params.row.OeCast / 100})`,
      strokeLinecap: 'butt',
      transition: 'stroke-dashoffset 0.5s ease 0s',
      transform: 'rotate(0.25turn)',
      transformOrigin: 'center center',
    },
    trail: {
      stroke: '#1AB2FF',
      strokeLinecap: '#EAECF0',
      transform: 'rotate(0.25turn)',
      transformOrigin: 'center center',
    },
    text: {
      fill: '#667085',
      fontSize: '30px',
    },
    background: {
      fill: '#ffffff',
    },
  }}
  
/></div>
         <span>${params.value}</span>
        </div>
      ),
    },

    
    {
      field: "total",
      sortable: false,
      headerName: "Total Invoice",
      width: 101,
      renderCell: (params) => (
        <div
          className="styleGrey01 totalInvoice"
          style={{ whiteSpace: "normal", textAlign: "left", textTransform: "uppercase" }}
        >
          ${params.value}
        </div>
      ),
    },
    
    
    {
      field: "profit",
      sortable: false,
      headerName: "Operational Profit",
      width: 130,
      renderCell: (params) => (
          <div className={`styleGrey01 exstatus ${params.value}`}>
          {params.value ? (
            <><span className="dots"></span> ${params.value} </>
          ) : (
            <>${params.value}<span className="dots"></span></>
          )}
        </div>
      ),
    },
  
  ]);

  const [rows, setRows] = useState([]);
  useEffect(()=> {
    const rows = ClientsResults.map((Orders) => {
      const realCost = (Orders.labor_expenses + Orders.cost_of_sale + Orders.operating_expense) / Orders.total * 100;
      const labourCost = (Orders.real_cost + Orders.cost_of_sale + Orders.operating_expense) / Orders.total * 100;
      const costofsale = (Orders.real_cost + Orders.labor_expenses + Orders.operating_expense) / Orders.total * 100;
      const oeCast = (Orders.real_cost + Orders.labor_expenses + Orders.cost_of_sale) / Orders.total * 100;

      return {
        isSelected: selectedRows.includes(Orders.id),
        id: Orders.number,
        Quote: Orders.number,
        created: Orders.created,
        photo: Orders.client.photo,
        Client: Orders.client.name,
        isbusiness: Orders.client.is_business,
        has_photo: Orders.client.has_photo,
        reference: Orders.reference,
        status: Orders.status,
        budget: Orders.budget,
        real_cost: Orders.real_cost,
        labor_expenses: Orders.labor_expenses,
        cost_of_sale: Orders.cost_of_sale,
        operating_expense: Orders.operating_expense,
        total: Orders.total,
        profit: Orders.profit,
        invoice_url: Orders.invoice_url,
        unique_url: Orders.unique_url,
        RealCost: realCost,
        LabourCost: labourCost,
        CostofSale: costofsale,
        OeCast: oeCast

      };
    });
    
    setRows(rows)
  }, [ClientsResults,selectedRows])
  

  const onResize = (index) => (event, { size }) => {
    setColumns((prevColumns) => {
      const nextColumns = [...prevColumns];
      nextColumns[index] = {
        ...nextColumns[index],
        width: size.width,
      };
      return nextColumns;
    });
  };
  
  const handleCheckboxChange = (rowId) => {
    const updatedSelectedRows = [...selectedRows];
    if (updatedSelectedRows.includes(rowId)) {
      // Row is already selected, remove it
      updatedSelectedRows.splice(updatedSelectedRows.indexOf(rowId), 1);
    } else {
      // Row is not selected, add it
      updatedSelectedRows.push(rowId);
    }
    setSelectedRows(updatedSelectedRows);
  };
  const isSelected = selectedRows.length > 0;
  const [rowsfilter, setRowsFilter] = useState([]);
  
  const handleRowsFilterChange = (filteredRows) => {
    
    const rows = filteredRows.map((Orders) => {
  
      return {
        isSelected: selectedRows.includes(Orders.id),
        id: Orders.number,
        Quote: Orders.number,
        created: Orders.created,
        photo: Orders.client.photo,
        Client: Orders.client.name,
        isbusiness: Orders.client.is_business,
        has_photo: Orders.client.has_photo,
        reference: Orders.reference,
        status: Orders.status,
        budget: Orders.budget,
        real_cost: Orders.real_cost,
        labor_expenses: Orders.labor_expenses,
        cost_of_sale: Orders.cost_of_sale,
        operating_expense: Orders.operating_expense,
        total: Orders.total,
        profit: Orders.profit,
        invoice_url: Orders.invoice_url,
        unique_url: Orders.unique_url,
      };
    });
    
    setRows(rows);
    setRowsFilter(rows);
  };

  return (
    <div className="OrdersTableWrap">
      <TableTopBar OrdersData={ClientsResults} rowsfilter={rowsfilter} onRowsFilterChange={handleRowsFilterChange} rows={sortedClientsData} selectedRow={selectedRows} selectClass={isSelected ? "selected-row" : ""} selectedRowCount={selectedRowsCount} />
     
    
      <Table responsive>
      <thead style={{ position: "sticky", top: "0px", zIndex: 9 }}>
          <tr>
          <th>
          <label className="customCheckBox">
          <input
            type="checkbox"
            checked={selectedRows.length === ClientsResults.length}
            onChange={handleSelectAllCheckboxChange}
          />
          <span className="checkmark">
            <Check color="#1AB2FF" size={20} />
          </span>
        </label>
          </th>
            {columns.map((column, index) => (
                <th key={column.field} style={{ width: column.width }}>
                <Resizable
                  width={column.width || 100} // Provide a default width if undefined
                  height={0}
                  onResize={onResize(index)}
                >
                  <div>
                    {column.headerName}
                  </div> 
                </Resizable>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          { rows && rows.length && 
            rows.map((row) => (
            <tr data-clientuniqueid={row.clientUniqueId}
              key={row.id} className={row.isSelected ? "selected-row" : ""}
              >
                <td>
                <label className="customCheckBox">
                <input
                  type="checkbox"
                  checked={selectedRows.includes(row.id)}
                  onChange={() => handleCheckboxChange(row.id)}
                />
                <span className="checkmark">
                  <Check color="#1AB2FF" size={20} />
                </span>
              </label>
                </td>
              {columns.map((column) => (
                  <td key={column.field} onClick={["Quote", "Client", "category"].includes(column.field) ? () => handleRowClick(row.id) : null}>
                  {column.renderCell({ value: row[column.field], row })}
                </td>
              ))}
            </tr>
            ))
          }

           {/* intersection observer target ref set */}
           <tr className="rowBorderHide targetObserver">
          <td className="targetObserver" ref={ref} colSpan={12}>
            {isFetching && 'Loading...'}
          </td>
        </tr>

          {rows && rows.length === 0 && (
            <tr className="nodataTableRow">
              <td colSpan={columns.length} style={{ textAlign: "center" }}>
                <div style={{ textAlign: "center", marginTop: "20px" }}>
                  
                  <div
                    className="Nodata"
                    style={{ background: `url(${nodataBg})` }}
                  >
                    <div className="image">
                      <img src={NodataImg} alt="NodataImg" />
                      <img
                        className="SearchIcon"
                        src={SearchIcon}
                        alt="SearchIcon"
                      />
                    </div>
                    <h2>There is no results</h2>
                    <p>
                      The user you are looking for doesn't exist. Here are some
                      helpful links:
                    </p>
                    <Button className="gobackButton mb-4 mt-4" variant="link">
                      {" "}
                      <ChevronLeft color="#000" size={20} />
                      Go back
                    </Button>
                    <Button className="gobackSupport mt-4" variant="link">
                      {" "}
                      Support
                    </Button>
                  </div>
                </div>
              </td>
            </tr>
          )}
        </tbody>
      </Table>
        {/* Sidebar */}
        {selectedRow && (
       <Offcanvas show={show} placement="end" onHide={handleClose}>
       <Offcanvas.Header closeButton>
         <Offcanvas.Title><strong>{selectedRow}.</strong> Client Edit Data Head</Offcanvas.Title>
       </Offcanvas.Header>
       <Offcanvas.Body>
        
       </Offcanvas.Body>
     </Offcanvas>
     
      )}
    </div>
  );
})




export default OrdersTables
