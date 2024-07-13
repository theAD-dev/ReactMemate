import React, { useEffect, useState ,forwardRef} from "react";

import Button from 'react-bootstrap/Button';
import Offcanvas from 'react-bootstrap/Offcanvas';
import defaultIcon from "../../../../assets/images/icon/default.png";
import {
  Check,
  ChevronLeft,ArrowDown,ArrowUp,GeoAlt ,Building,Person,Globe
} from "react-bootstrap-icons";



import NodataImg from "../../../../assets/images/img/NodataImg.png";
import nodataBg from "../../../../assets/images/nodataBg.png";
import SearchIcon from "../../../../assets/images/icon/searchIcon.png";


import { Table } from "react-bootstrap";
import TableTopBar from "./TableTopBar";
import { Resizable } from 'react-resizable';


  const ClientsTables = forwardRef(({ ClientsData, fetchData, isFetching }, ref) => {
  const [sortField, setSortField] = useState("Quote");
  const [sortDirection, setSortDirection] = useState("asc");
  const [selectedRow, setSelectedRow] = useState(null);

  const ClientsResults = Array.isArray(ClientsData) ? ClientsData : ClientsData.results;

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
      width: 163,
      headerName: (
        <div className="styleColor1" onClick={() => toggleSort("Quote")}>
        <span>Client ID</span>
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
        <div className="styleColor1 clientTdFlex">
          <div>
          <strong>{params.value.substring(4)} </strong>
          <p>{params.row.created}</p>
          </div>
          <Button className="linkByttonStyle" variant="link">Open</Button>
        </div>
      ),
    },

    {
      field: "Client",
      headerName: (
        <div className="styleColor1" onClick={() => toggleSort("Client")}>
        <span>Client</span>
        {sortField === "Client" && (
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
      field: "category",
      width: 94,
      sortable: false,
      headerName: "Category",
      renderCell: (params) => (
        <div
          className="mainStyle category"
          style={{ whiteSpace: "nowrap", textAlign: "left" }}
        >
          {params.value}
        
        </div>
      ),
    },
    {
      field: "days_in_company",
      sortable: false,
      headerName: "Days",
      width: 60,
      renderCell: (params) => {
        var number = params.value;
        var days = Math.floor(number / 24);
        return (
          <div
            className="mainStyle days_in_company"
            style={{ whiteSpace: "nowrap", textAlign: "left" }}
          >
            {days} 
          </div>
        );
      },
    },
    
    {
      field: "jobsdone",
      width: 64,
      sortable: false,
      headerName: (
        <div className="styleColor1" onClick={() => toggleSort("Status")}>
        <span>Jobs</span>
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
        <div className="styleColor1 jobsdone">
         {params.value}
        </div>
      ),
    },
    {
      field: "total_turnover",
      sortable: false,
      headerName: "Total turnover",
      width: 129,
      renderCell: (params) => (
        <div className="total_turnover">
         ${params.value}
        </div>
      ),
    },
  
    {
      field: "average_pd",
      sortable: false,
      headerName: "Average P/D ",
      width: 120,
      renderCell: (params) => (
        <div
        className="darkborderbox"
        style={{ whiteSpace: "nowrap", textAlign: "left" }}
      >
          ${params.value}
        </div>
      ),
    },
   
    {
      field: "total_requests",
      sortable: false,
      headerName: "Orders",
      width: 88,
      renderCell: (params) => (
        <div className="styleColor1 jobsdone">
         {params.value}
        </div>
      ),
    },
    {
      field: "order_frequency",
      sortable: false,
      headerName: "Order Frequency",
      width: 146,
      renderCell: (params) => (
        <div
        className="styleborderbox"
        style={{ whiteSpace: "nowrap", textAlign: "left" }}
      >
         {params.value} p/m
        </div>
      ),
    },
    {
      field: "country1",
      sortable: false,
      headerName: "Country",
      width: 75,
      renderCell: (params) => (
        <div
          className="styleGrey01"
          style={{ whiteSpace: "nowrap", textAlign: "left", textTransform: "uppercase" }}
        >
          {params.value ? (
            <>
              {params.value}
            </>
          ) : (
            <>
             -
            </>
          )}
        </div>
      ),
    },
    
    
    {
      field: "address",
      sortable: false,
      headerName: "Address",
      renderCell: (params) => (
          <div className="styleGrey02 clientAddress d-flex textLeft justify-content-between align-items-center">
            {params.value ? (
            <>
              <span> {params.value}</span>
          <a href={`https://www.google.com/maps/place/${params.value}`} target="_blank" rel="noreferrer"><Button className="linkByttonStyle" variant="link"><GeoAlt size={20} color="#1AB2FF" /></Button></a>
          
            </>
          ) : (
            <>
             -
            </>
          )}
          
          </div> 
      ),
    },
  
    {
      field: "abn",
      sortable: false,
      headerName: "ABN",
      width: 140,
      renderCell: (params) => (
        <div
        className="styleGrey01"
        style={{ whiteSpace: "normal", textAlign: "left" }}
      >
        {params.value ? (
            <>
              {params.value}
            </>
          ) : (
            <>
             -
            </>
          )}
        </div>
      ),
    },
    {
      field: "website",
      sortable: false,
      headerName: "Website",
      width: 75,
      renderCell: (params) => (
        <div
        className="styleGrey01 WebsiteGlobe"
        style={{ whiteSpace: "normal", textAlign: "center" }}
      >
          <a href={params.value} target="_blank">
            <Globe size={20} color="#98A2B3" />
          </a>
       
        </div>
      ),
    },
  
  ]);

  const [rows, setRows] = useState([]);
  useEffect(()=> {
    const rows = ClientsResults.map((client) => {
      const address = client.addresses.length > 0 ? client.addresses[0].address : '';
      const city = client.addresses.length > 0 ? client.addresses[0].city : '';
      const state = client.addresses.length > 0 ? client.addresses[0].state : '';
      const postcode = client.addresses.length > 0 ? client.addresses[0].postcode : '';
      const country = client.addresses.length > 0 ? client.addresses[0].country : '';
    
      return {
        isSelected: selectedRows.includes(client.id),
        id: client.id,
        Quote: client.number,
        created: client.created,
        isbusiness: client.is_business,
        Client: client.name,
        photo: client.photo,
        category: client.category,
        days_in_company: client.days_in_company,
        jobsdone: client.jobsdone,
        total_turnover: client.total_turnover,
        average_pd: client.average_pd,
        total_requests: client.total_requests,
        order_frequency: client.order_frequency,
        country1: client.country,
        abn: client.abn,
        website: client.website,
        address: address,
        city: city,
        state: state,
        country: country,
        postcode: postcode
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
    
    const rows = filteredRows.map((client) => {
      const address = client.addresses.length > 0 ? client.addresses[0].address : '';
      const city = client.addresses.length > 0 ? client.addresses[0].city : '';
      const state = client.addresses.length > 0 ? client.addresses[0].state : '';
      const postcode = client.addresses.length > 0 ? client.addresses[0].postcode : '';
      const country = client.addresses.length > 0 ? client.addresses[0].country : '';
      return {
        isSelected: selectedRows.includes(client.id),
        id: client.id,
        Quote: client.number,
        created: client.created,
        isbusiness: client.is_business,
        Client: client.name,
        photo: client.photo,
        category: client.category,
        days_in_company: client.days_in_company,
        jobsdone: client.jobsdone,
        total_turnover: client.total_turnover,
        average_pd: client.average_pd,
        total_requests: client.total_requests,
        order_frequency: client.order_frequency,
        country1: client.country,
        abn: client.abn,
        address: address,
        city: city,
        state: state,
        country: country,
        postcode: postcode
      };
    });
    
    setRows(rows);
    setRowsFilter(rows);
  };

  return (
    <div className="clientTableWrap">
      <TableTopBar ClientsData={ClientsResults} rowsfilter={rowsfilter} onRowsFilterChange={handleRowsFilterChange} rows={sortedClientsData} selectedRow={selectedRows} selectClass={isSelected ? "selected-row" : ""} selectedRowCount={selectedRowsCount} />
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




export default ClientsTables
