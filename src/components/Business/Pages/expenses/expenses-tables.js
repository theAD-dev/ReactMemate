import React, { useEffect, useState ,forwardRef} from "react";

import Button from 'react-bootstrap/Button';
import Offcanvas from 'react-bootstrap/Offcanvas';
import defaultIcon from "../../../../assets/images/icon/default.png";
import {
  Check,
  ChevronLeft,ArrowDown,ArrowUp ,
  Building,Person,Plus
} from "react-bootstrap-icons";

import NodataImg from "../../../../assets/images/img/NodataImg.png";
import nodataBg from "../../../../assets/images/nodataBg.png";
import SearchIcon from "../../../../assets/images/icon/searchIcon.png";


import { Table } from "react-bootstrap";
import TableTopBar from "./table-top-bar";
import { Resizable } from 'react-resizable';
import StatusPopup from "./status-popup";



  const ExpensesTables = forwardRef(({ expensesData, fetchData, isFetching }, ref) => {
  const [sortField, setSortField] = useState("Quote");
  const [sortDirection, setSortDirection] = useState("asc");
  const [selectedRow, setSelectedRow] = useState(null);

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

  const sortedClientsData = [...expensesData].sort((a, b) => {
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
    const allRowIds = expensesData.map((sale) => sale.id);
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
      width: 120,
      headerName: (
        <div className="styleColor1" onClick={() => toggleSort("Quote")}>
        <span>Expense ID</span>
        {sortField === "Quote" && (
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
        <div className="styleColor1">
          <strong>{params.value.substring(4)}</strong>
          <p>{formatDate(params.row.created)}</p>
        
        </div>
      ),
    },

    {
      field: "supplier",
      width: 400,
      headerName: (
        <div className="styleColor1" onClick={() => toggleSort("supplier")}>
        <span>Supplier</span>
        {sortField === "supplier" && (
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
        <div className="userImgStyle1">
          <div className="innerFlex styleColor2 d-flex justify-content-between">
            <div className="leftStyle spaceBorder d-flex align-items-center isbusinessIcon">
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
                  <div className="iconBuilding icon">
                    <Building size={13.71} color="#667085" />
                  </div>
                ) : (
                  <div className="iconPerson icon">
                    <Person size={24} color="#667085" />
                  </div>
                )
              )}
              <span>{params.value}</span>
            </div>
            <Button className="linkByttonStyle" variant="link">Open</Button>
          </div>
        </div>
      ),
      
    },
  
    {
      field: "reference",
      sortable: false,
      headerName: "Reference",
      
      renderCell: (params) => {
    
        return (
          <div
            className="mainStyle Style344054"
            style={{ whiteSpace: "nowrap", textAlign: "left" }}
          >
           {params.value}
          </div>
        );
      },
    },
    {
      field: "duedate",
      sortable: false,
      headerName: "Due Date",
      width: 120,
      renderCell: (params) => {

        return (
          <div
            className="mainStyle duedate"
            style={{ whiteSpace: "nowrap", textAlign: "left" }}
          >
            {formatDate(params.value)}
          </div>
        );
      },
    },
    
  
    {
      field: "total",
      sortable: false,
      headerName: "Total",
      width: 131,
      renderCell: (params) => (
          <div
            className="totalpaytotal"
            style={{ whiteSpace: "nowrap", textAlign: "center" }}
          >
         $ {params.value}<span className="plusIcon"><Plus size={12} color="#079455" /></span>
        </div>
      ),
    },
  
    {
      field: "UserInvoice",
      sortable: false,
      headerName: "Interval/Order",
      width: 144,
      renderCell: (params) => (
        params.value ? (
          <div
            className="intervalorder"
            style={{ whiteSpace: "normal", textAlign: "center" }}
          >
            {params.value}
          </div>
        ) : (
          <span></span>
        )
      ),
      
    },
   
    {
      field: "accountCode",
      sortable: false,
      headerName: "Account Code",
      width: 214,
      renderCell: (params) => (
        params.value ? (
          <div
            className="styleColor1 accountCode"
            style={{ whiteSpace: "nowrap", textAlign: "left" }}
          >
            {params.value}: {params.row.accountname}
          </div>
        ) : (
          <span></span>
        )
      ),
    },

    {
      field: "country",
      sortable: false,
      headerName: "Xero/Myob",
      width: 111,
      renderCell: (params) => (
        <div
          className="styleGrey01"
          style={{ whiteSpace: "nowrap", textAlign: "left", textTransform: "uppercase" }}
        >
          
        </div>
      ),
    },

    {
      field: "department",
      sortable: false,
      headerName: "Departments",
      width: 128,
      renderCell: (params) => (
        <div
        className="styleGrey01 departmentstyle"
        style={{ whiteSpace: "nowrap", textAlign: "left" }}
      >
        {params.value}
        
        </div>
      ),
    },
    {
      field: "paid",
      sortable: false,
      headerName: "Status",
      width: 120,
      renderCell: (params) => (
          <StatusPopup statusValue={params.value} />
      ),
    }
  ]);

  const [rows, setRows] = useState([]);
  useEffect(()=> {
    const rows = expensesData.map((expense) => {

    
      return {
        isSelected: selectedRows.includes(expense.id),
        id: expense.id,
        Quote: expense.number,
        created: expense.created,
        paid: expense.paid,
        supplier: expense.supplier ? expense.supplier.name : null,
        photo: expense.supplier ? expense.supplier.photo : null,
        reference: expense.invoice_reference,
        duedate: expense.created,
        total: expense.total,
        UserInvoice: expense.type,
        accountCode: expense.account_code ? expense.account_code.code : null,
        accountname: expense.account_code ? expense.account_code.name : null,
        department: expense.department ? expense.department.name : null,
      
      };
    });
    
    setRows(rows)
  }, [expensesData,selectedRows])
  

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
    
    const rows = filteredRows.map((expense) => {
      return {
        isSelected: selectedRows.includes(expense.id),
        id: expense.id,
        Quote: expense.number,
        created: expense.created,
        supplier: expense.supplier ? expense.supplier.name : null,
        photo: expense.supplier ? expense.supplier.photo : null,
        reference: expense.invoice_reference,
        duedate: expense.created,
        total: expense.total,
        UserInvoice: expense.type,
        accountCode: expense.account_code ? expense.account_code.code : null,
        accountname: expense.account_code ? expense.account_code.name : null,
        department: expense.department ? expense.department.name : null,
      };
    });
    
    setRows(rows);
    setRowsFilter(rows);
  };

  return (
    <div className="expensesTableWrap">
      <TableTopBar expensesData={expensesData} rowsfilter={rowsfilter} onRowsFilterChange={handleRowsFilterChange} rows={sortedClientsData} selectedRow={selectedRows} selectClass={isSelected ? "selected-row" : ""} selectedRowCount={selectedRowsCount} />

      <Table responsive>
      <thead style={{ position: "sticky", top: "0px", zIndex: 9 }}>
          <tr>
          <th>
          <label className="customCheckBox">
          <input
            type="checkbox"
            checked={selectedRows.length === expensesData.length}
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
           
              className={`${row.isSelected ? "selected-row" : ""} ${row.paid}`}
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
});




export default ExpensesTables
