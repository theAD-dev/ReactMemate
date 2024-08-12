import React, { useEffect, useState, forwardRef } from "react";
import Button from 'react-bootstrap/Button';
import Offcanvas from 'react-bootstrap/Offcanvas';
import {
  Check,
  ChevronLeft, ArrowDown, ArrowUp, Envelope, Person, Globe
} from "react-bootstrap-icons";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";
import NodataImg from "../../../../assets/images/img/NodataImg.png";
import nodataBg from "../../../../assets/images/nodataBg.png";
import SearchIcon from "../../../../assets/images/icon/searchIcon.png";
import { Table } from "react-bootstrap";
import TableTopBar from "./TableTopBar";
import { Resizable } from 'react-resizable';


const SuppliersTables = forwardRef(({ ClientsData, fetchData, isFetching }, ref) => {
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
      width: 139,
      headerName: (
        <div className="styleColor1" onClick={() => toggleSort("Quote")}>
          <span>Supplier ID	</span>
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
        <div
          className="styleColor1 supTdFlex"
          style={{ whiteSpace: "normal", textAlign: "left" }}>
          <strong>{params.value.substring(4)} </strong>
          <Button className="linkByttonStyle" variant="link">Open</Button>
        </div>
      ),
    },

    {
      field: "Supplier",
      headerName: (
        <div className="styleColor1" onClick={() => toggleSort("Client")}>
          <span>Supplier</span>
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
            <div className="leftStyle d-flex align-items-center isbusinessIcon">
              {/* {params.row.photo ? (
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
              <span>{params.value}</span> */}
              {params.row.has_photo ? (
                <img
                  src={params.row.photo}
                  alt={params.row.photo}
                  style={{ marginRight: "5px" }}
                />
              ) : (
                <div className="iconPerson">
                  <Person size={24} color="#667085" />
                </div>
              )}

              <span>{params.value}</span>
            </div>

          </div>
        </div>
      ),

    },
    {
      field: "services",
      sortable: false,
      headerName: "Supplied Services",

      renderCell: (params) => (
        <div
          className="mainStyle SuppServices"
          style={{ textAlign: "left" }}
        >
          {params.value}

        </div>
      ),
    },
    {
      field: "Email",
      sortable: false,
      headerName: "Email",
      width: 68,
      renderCell: (params) => {

        return (
          <div>
            <div className="circleImgStyle">
              {["top-start"].map((placement) => (
                <OverlayTrigger
                  key={placement}
                  placement={placement}
                  overlay={
                    <Tooltip id={`tooltip-${placement}`}>
                      <div className="tooltipBox">{params.value}</div>
                    </Tooltip>
                  }
                >
                  <span variant="light" className="">
                    {params.value ? (
                      <>
                        <Envelope size={20} color="#98A2B3" />

                      </>
                    ) : (
                      <div className="iconPerson">

                      </div>
                    )}

                  </span>
                </OverlayTrigger>
              ))}
            </div>
          </div>

        );
      },
    },

    {
      field: "Address",
      sortable: false,
      headerName: (
        <div className="styleColor1" onClick={() => toggleSort("Status")}>
          <span>Address</span>
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

        params.value ? (
          <div
            className="address"
            style={{ textAlign: "left" }}
          >
            {params.value}
          </div>
        ) : (
          <span></span>
        )
      ),
    },
    {
      field: "Statename",
      sortable: false,
      headerName: "State",
      width: 60,
      renderCell: (params) => (

        params.value ? (
          <div
            className="Statestyle"
            style={{ whiteSpace: "nowrap", textAlign: "left" }}
          >
            {/* {params.value} */}
            {params.row.Statealias}
          </div>
        ) : (
          <>
            {/* {params.row.Statealias} */}
          </>

        )
      ),
    },

    {
      field: "PostCode",
      sortable: false,
      headerName: "Post Code",
      width: 100,
      renderCell: (params) => (
        <div
          className="PostCodestyle"
          style={{ whiteSpace: "nowrap", minWidth: "88px", textAlign: "left" }}
        >
          {params.value}
        </div>
      ),
    },

    {
      field: "TotalSpent",
      sortable: false,
      headerName: "Total Spent",
      width: 114,
      renderCell: (params) => (
        <div className="styleColor1 TotalSpent"
          style={{ whiteSpace: "nowrap", textAlign: "left" }}
        >
          ${params.value}
        </div>
      ),
    },
    {
      field: "Website",
      sortable: false,
      headerName: "Website",
      width: 75,
      renderCell: (params) => (
        params.value !== "NA" ? (
          <div
            className="styleGrey01 WebsiteGlobe"
            style={{ whiteSpace: "nowrap", textAlign: "center" }}
          >
            <a href={"http://" + params.value} target="_blank">
              <Globe size={20} color="#98A2B3" />
            </a>
          </div>
        ) : (
          <>
            <a href="#">
              <Globe size={20} color="#98A2B3" />
            </a>
          </>
        )
      ),
    },

  ]);

  const [rows, setRows] = useState([]);
  useEffect(() => {
    const rows = ClientsResults.map((client) => {


      return {
        isSelected: selectedRows.includes(client.id),
        id: client.id,
        Quote: client.number,
        Supplier: client.name != null ? client.name : "",
        services: client.services,
        Email: client.email,
        Address: client.address,
        Statealias: client.state != null ? client.state.postal != null ? client.state.postal : "" : "",
        Statename: client.state != null ? client.state.name != null ? client.state.name : "" : "",
        photo: client.photo,
        has_photo: client.has_photo,
        PostCode: client.postcode,
        TotalSpent: client.total_spent,
        Website: client.website,
      };
    });

    setRows(rows)
  }, [ClientsResults, selectedRows])


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

      return {
        isSelected: selectedRows.includes(client.id),
        id: client.id,
        Quote: client.number,
        Supplier: client.name != null ? client.name : "",
        services: client.services,
        Email: client.email,
        photo: client.photo,
        has_photo: client.has_photo,
        Address: client.address,
        Statealias: client.state != null ? client.state.postal != null ? client.state.postal : "" : "",
        Statename: client.state != null ? client.state.name != null ? client.state.name : "" : "",
        PostCode: client.postcode,
        TotalSpent: client.total_spent,
        Website: client.website,


      };
    });

    setRows(rows);
    setRowsFilter(rows);
  };

  return (
    <div className="supplierTableWrap">
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
          {rows && rows.length &&
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




export default SuppliersTables
