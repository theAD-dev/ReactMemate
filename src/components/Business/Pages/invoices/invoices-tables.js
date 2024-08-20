import React, { useEffect, useState, forwardRef } from "react";

import { Link } from "react-router-dom";
import Button from 'react-bootstrap/Button';
import Offcanvas from 'react-bootstrap/Offcanvas';
import {
  Check,
  ChevronLeft, ArrowDown, ArrowUp, Building, Person, ThreeDotsVertical, Coin, FilePdf, InfoCircle,
  Link45deg, Plus
} from "react-bootstrap-icons";
import NodataImg from "../../../../assets/images/img/NodataImg.png";
import stripe from "../../../../assets/images/icon/stripe.png";
import nodataBg from "../../../../assets/images/nodataBg.png";
import SearchIcon from "../../../../assets/images/icon/searchIcon.png";
import { Table } from "react-bootstrap";
import TableTopBar from "./table-top-bar";
import { Resizable } from 'react-resizable';


const InvoicesTables = forwardRef(({ InvoicesData, fetchData, isFetching }, ref) => {
  const [sortField, setSortField] = useState("Quote");
  const [sortDirection, setSortDirection] = useState("asc");
  const [selectedRow, setSelectedRow] = useState(null);
  const InvoicesResults = Array.isArray(InvoicesData) ? InvoicesData : InvoicesData.results;
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

  const sortedInvoicesData = [...InvoicesResults].sort((a, b) => {
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
    const allRowIds = InvoicesResults.map((sale) => sale.id);
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
      headerName: (
        <div className="styleColor1" onClick={() => toggleSort("Quote")}>
          <span>Invoice ID</span>
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
      width: 170,
      renderCell: (params) => (
        <div className="invoiceidFlex">
          <div className={`styleColor1 ${params.row.paid}`}>
            <span className="greenborderStyle dotosCircle">{params.value.substring(6)}</span>
            <p>{formatDate(params.row.created)}</p>

          </div>
          <Button className="linkByttonStyle" variant="link">Open</Button></div>
      ),
    },


    {
      field: "Invoice",
      sortable: false,
      headerName: "Invoice",
      width: 109,
      renderCell: (params) => (
        <div>
          <ul className="disPlayInline disPlayInlineCenteri"
            style={{ whiteSpace: "nowrap" }}
          >
            <li>
              <Link to={params.row.invoiceURL}>
                <FilePdf color="#FF0000" size={16} />
              </Link>
            </li>
            <li>
              <Link to={params.row.uniqueURL}>
                <Link45deg color="#3366CC" size={16} />
              </Link>
            </li>
          </ul>
        </div>
      ),
    },
    {
      field: "client",

      headerName: (
        <div className="styleColor1" onClick={() => toggleSort("client")}>
          <span>Client</span>
          {sortField === "client" && (
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
              {params.row.hasPhoto ? (
                <img
                  src={params.row.photo}
                  alt={params.row.photo}
                  style={{ marginRight: "5px" }}
                />
              ) : (
                params.row.is_business ? (
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
      field: "paid",
      sortable: false,
      headerName: "Date Due",
      width: 350,
      renderCell: (params) => {
        return (
          <div
            className="mainStyle invoiceDue"
            style={{ whiteSpace: "nowrap", textAlign: "left" }}
          >
            <ul>
              {params.row.paid ? (
                <>
                  <li className="invoicepaid dotosCircleRight">Paid</li>
                </>

              ) : (
                params.row.overdue ? (
                  <><li className="OverdueStyle dotosCircleRight">Overdue {params.row.overdue} days</li></>
                ) : null
              )}

              <li>09 Dec 2029</li>
              <li> <Button className="linkByttonStyle" variant="link">Resend</Button></li>
            </ul>

          </div>
        );


      },
    },

    {
      field: "status",
      sortable: false,
      headerName: (
        <div className="styleColor1" onClick={() => toggleSort("status")}>
          <span>Payment Status</span>
          {sortField === "status" && (
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
      width: 119,
      renderCell: (params) => (
        <div className="leftStyle statusifwn d-flex align-items-center paymentStyle">
          {params.row.statusPaid === "paid" ? (
            <div className="">
              <img src={stripe} alt="stripe" />
            </div>
          ) : params.row.statusPaid === "not_paid" ? (
            <div className="iconBuilding">
              <Coin size={13.71} color="#667085" />
            </div>
          ) : (
            <div className="iconBuilding">
              <Building size={13.71} color="#667085" />
            </div>
          )}

        </div>
      ),
    },
    {
      field: "amount",
      sortable: false,
      headerName: "Amount + GST",
      width: 133,
      renderCell: (params) => (
        <div className="amountGst">
          ${params.value}
        </div>
      ),
    },

    {
      field: "tobePaid",
      sortable: false,
      headerName: "To be paid",
      width: 120,
      renderCell: (params) => (
        <div
          className="tobePaid1"
          style={{ whiteSpace: "nowrap", textAlign: "left" }}
        >
          ${params.value}
        </div>
      ),
    },

    {
      field: "deposit",
      sortable: false,
      headerName: "Deposit/Payment",
      width: 148,
      renderCell: (params) => (

        <div
          className="totalpayEx"
          style={{ whiteSpace: "nowrap", textAlign: "center" }}
        >
          $ {params.value}<span className="lineVerticle"><Plus size={17} color="#079455" /></span>
        </div>
      ),
    },
    {
      field: "order_frequency",
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
      field: "country",
      sortable: false,
      headerName: "Xero/Myob",
      width: 91,
      renderCell: (params) => (
        <div
          className="styleGrey01"
          style={{ whiteSpace: "normal", textAlign: "center", textTransform: "uppercase" }}
        >

        </div>
      ),
    },




    {
      field: "Actions",
      sortable: false,
      headerName: "Actions",
      width: 72,
      renderCell: (params) => (
        <div
          className="styleGrey01"
          style={{ whiteSpace: "normal", textAlign: "left" }}
        >
          <ThreeDotsVertical size={24} color="#667085" />

        </div>
      ),
    },


  ]);

  const [rows, setRows] = useState([]);
  useEffect(() => {
    const rows = InvoicesResults.map((invoice) => {


      return {
        isSelected: selectedRows.includes(invoice.id),
        id: invoice.id,
        Quote: invoice.number,
        created: invoice.created,
        invoiceURL: invoice.invoice_url,
        uniqueURL: invoice.unique_url,
        client: invoice.client.name,
        photo: invoice.client.photo,
        isbusiness: invoice.client.is_business,
        hasPhoto: invoice.client.has_photo,
        overdue: invoice.overdue,
        paid: invoice.paid,
        dueDate: invoice.due_date,
        toBePaid: invoice.to_be_paid,
        status: invoice.status,
        amount: invoice.amount,
        tobePaid: invoice.to_be_paid,
        deposit: invoice.deposit,
        statusPaid: invoice.payment_status,



      };
    });

    setRows(rows)
  }, [InvoicesResults, selectedRows])


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

    const rows = filteredRows.map((invoice) => {
      return {
        isSelected: selectedRows.includes(invoice.id),
        id: invoice.id,
        Quote: invoice.number,
        created: invoice.created,
        invoiceURL: invoice.invoice_url,
        uniqueURL: invoice.unique_url,
        client: invoice.client.name,
        photo: invoice.client.photo,
        isbusiness: invoice.client.is_business,
        hasPhoto: invoice.client.has_photo,
        overdue: invoice.overdue,
        paid: invoice.paid,
        dueDate: invoice.due_date,
        toBePaid: invoice.to_be_paid,
        status: invoice.status,
        amount: invoice.amount,
        tobePaid: invoice.to_be_paid,
        deposit: invoice.deposit,
        statusPaid: invoice.payment_status,

      };
    });

    setRows(rows);
    setRowsFilter(rows);
  };


  // intersection observer


  return (
    <div className="invoiceTableWrap">
      <TableTopBar InvoicesData={InvoicesResults} rowsfilter={rowsfilter} onRowsFilterChange={handleRowsFilterChange} rows={sortedInvoicesData} selectedRow={selectedRows} selectClass={isSelected ? "selected-row" : ""} selectedRowCount={selectedRowsCount} />


      <Table responsive>
        <thead style={{ position: "sticky", top: "0px", zIndex: 9 }}>
          <tr>
            <th>
              <label className="customCheckBox">
                <input
                  type="checkbox"
                  checked={selectedRows.length === InvoicesResults.length}
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
              <tr
                data-clientuniqueid={row.clientUniqueId}
                key={row.id}
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




export default InvoicesTables
