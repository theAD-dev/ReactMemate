import React, { useEffect, useRef, useState } from "react";
import { Table } from "react-bootstrap";
import {
  PlusSlashMinus,
  FilePdf,
  Link45deg,
  Check,
  Person,
} from "react-bootstrap-icons";
import { Resizable } from 'react-resizable';
import { Link } from "react-router-dom";
import { Avatar } from 'primereact/avatar';
import { AvatarGroup } from 'primereact/avatargroup';
import { OverlayPanel } from 'primereact/overlaypanel';
import Button from "react-bootstrap/Button";
import ActionsDots from "./features/actions-dots";
import ContactSales from "./features/contact-sales";
import Progress from "./features/progress";
import QuoteLost from "./features/quote-lost";
import QuoteWon from "./features/quote-won";
import SalesNote from "./features/sales-note";
import TableTopBar from "./table-top-bar";
import { useTrialHeight } from "../../../../app/providers/trial-height-provider";
import ImageAvatar from "../../../../ui/image-with-fallback/image-avatar";
import NoDataFoundTemplate from "../../../../ui/no-data-template/no-data-found-template";



const CustomAvatarGroup = ({ params }) => {
  const op = useRef(null);

  const handleAvatarGroupClick = (event) => {
    op.current.toggle(event);
  };

  return (
    <div>
      <AvatarGroup onClick={handleAvatarGroupClick} style={{ cursor: "pointer" }}>
        {params?.value?.slice(0, 2).map((data, index) => (
          <Avatar key={`${data.email}-${index}`}
            shape="circle"
            image={data.has_photo && data.photo ? data.photo : null}
            icon={!data.has_photo || !data.photo ? <Person color="#667085" size={20} /> : null}
            style={{ background: '#fff', border: '1px solid #dedede' }}
          />
        ))}
        {params?.value?.length > 2 && (
          <Avatar
            label={`+${params.value.length - 2}`}
            shape="circle"
            size="small"
            style={{ fontSize: '14px' }}
          />
        )}
      </AvatarGroup>

      <OverlayPanel className="salesOverlay" ref={op}>
        {params?.value?.map((data, index) => (
          <div key={index} style={{ padding: "0.5rem", display: "flex", alignItems: "center" }}>
            <Avatar
              image={data.has_photo && data.photo ? data.photo : null}
              icon={!data.has_photo || !data.photo ? <Person color="#667085" size={20} /> : null}
              style={{ background: '#fff', border: '1px solid #dedede' }}
              shape="circle" 
            />
            <div style={{ marginLeft: "0.5rem" }}>
              <div className="fullnameText">{data?.full_name}</div>
            </div>
          </div>
        ))}
      </OverlayPanel>
    </div>
  );
};

const formatDate = (timestamp) => {
  const date = new Date(timestamp * 1000);
  const day = date.getDate();
  const monthAbbreviation = new Intl.DateTimeFormat("en-US", {
    month: "short",
  }).format(date);
  const year = date.getFullYear();
  return `${day} ${monthAbbreviation} ${year}`;
};

const createSalesNote = (noteData, saleUniqueId) => (
  <>
    <SalesNote noteData={noteData} saleUniqueId={saleUniqueId} />
  </>
);

export const mapSalesData = (salesData) => {
  return salesData.map((sale) => ({
    unique_id: sale.unique_id,
    id: sale.id,
    Quote: sale.number,
    created: sale.created,
    Client: sale.client.name,
    clientId: sale.client.id,
    photo: sale.client.photo,
    is_business: sale.client.is_business,
    hasPhoto: sale.client.has_photo,
    Reference: sale.reference,
    Status: sale.status,
    Calculation: sale.calculation,
    CalculationPDF: sale.quote_url,
    CalculationURL: sale.unique_url,
    Note: createSalesNote(sale.sales_note, sale.unique_id),
    User: sale.managers,
    fullName: sale.manager.full_name,
    Contact: sale.sales_contacts,
    progressName: sale.lead.name,
    progressPercentage: sale.lead.percentage,
    saleUniqueId: sale.unique_id,
    wonQuote: (sale.number, sale.status),
    LostQuote: (sale.number, sale.status),
    amountData: sale.amount,
    Actions: "Actions",
    history: sale?.previous_versions
  }));
};

const SalesTables = ({ profileData, salesData, fetchData, isLoading }) => {
  const { trialHeight } = useTrialHeight();
  const [rows, setRows] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);

  const removeRow = async () => {
    fetchData();
  };

  const refreshData = () => {
    fetchData();
  };

  const handleSelectAllCheckboxChange = () => {
    const allRowIds = salesData && salesData.length && salesData.map((sale) => sale.id) || [];
    if (selectedRows.length === allRowIds.length) {
      setSelectedRows([]);
    } else {
      setSelectedRows(allRowIds);
    }
  };

  const selectedRowsCount = selectedRows.length;
  const columns = [
    {
      field: "Quote",
      width: 144,
      headerName: (
        <div className="styleColor1">
          <span className="ps-3">Quote</span>
        </div>
      ),

      renderCell: (params) => (
        <div className="innerFlex styleColor2 d-flex justify-content-between">
          <div className="styleColor1">
            <strong className="ellipsis-width" style={{ maxWidth: '80px' }}>{params.value}</strong>
            <p>{formatDate(params.row.created)}</p>
          </div>
          <Link to={`/sales/quote-calculation/${params.row.unique_id}`}><Button className="linkByttonStyle" variant="link">Open</Button></Link>
        </div>
      ),
    },
    {
      field: "Client",
      width: 270,
      headerName: (
        <div className="styleColor1">
          <span>Client</span>
        </div>
      ),

      renderCell: (params) => (
        <div className="userImgStyle">
          <div className="innerFlex styleColor2 d-flex justify-content-between">
            <div className="leftStyle d-flex align-items-center">
              <ImageAvatar has_photo={params.row.hasPhoto} photo={params.row?.photo} is_business={params.row?.is_business} />
              <span>{params.value}</span>
            </div>
          </div>
        </div>
      ),

    },
    {
      field: "Reference",
      sortable: false,
      headerName: "Reference",
      renderCell: (params) => (
        <div
          className="mainStyle mainStyleMin"
          style={{ whiteSpace: "normal", textAlign: "left" }}
        >
          {params.value}
        </div>
      ),
    },
    {
      field: "Status",
      sortable: false,
      headerName: (
        <div className="styleColor1">
          <span>Status</span>
        </div>
      ),
      width: 118,
      renderCell: (params) => (
        <div className={`statusInfo ${params.value}`}>
          <Link to="/" style={{ pointerEvents: 'none' }}>{params.value}</Link>
        </div>
      ),
    },
    {
      field: "Calculation",
      sortable: false,
      headerName: "Calculation",
      width: 147,
      renderCell: (params) => (
        <div>
          <ul className="disPlayInline disPlayInlineCenter">
            <Link to={`/sales/quote-calculation/${params.row.unique_id}`}>
              <li className="plusminus">
                <PlusSlashMinus color="#FDB022" size={16} />
              </li>
            </Link>
            <li className={`${params.row.Status}`}>
              <Link to={params.row.CalculationPDF} target="_blank" rel="noopener noreferrer">
                <FilePdf color="#FF0000" size={16} />
              </Link>
            </li>
            <li className={`${params.row.Status}`}>
              <Link to={`/quote/${params.row.unique_id}`} target="_blank" rel="noopener noreferrer">
                <Link45deg color="#3366CC" size={16} />
              </Link>
            </li>
          </ul>
        </div>
      ),
    },
    {
      field: "Note",
      sortable: false,
      headerName: "Note",
      width: 94,
      renderCell: (params) => <div>{params.value}</div>,
    },
    {
      field: "User",
      sortable: false,
      headerName: "User",
      width: 56,
      renderCell: (params) => {
        return <CustomAvatarGroup params={params} />;
      }
    },
    {
      field: "Contact",
      sortable: false,
      headerName: "Contact",
      width: 183,
      renderCell: (params) => (
        <div>
          <ContactSales type={params.value} saleUniqueId={params.row.saleUniqueId} refreshData={refreshData} created={params.row.created} />
        </div>
      ),
    },
    {
      field: "Progress",
      headerName: (
        <div className="styleColor1">
          <span>Progress</span>
        </div>
      ),

      width: 232,
      renderCell: (params) => (
        <div style={{ width: "100%" }}>
          <Progress
            progressName1={params.row.progressName}
            progressPercentage1={params.row.progressPercentage}
            salesUniqId1={params.row.saleUniqueId}
            refreshData={() => { }}
          />
        </div>
      ),
    },

    {
      field: "W",
      sortable: false,
      headerName: "Lost / Won",
      width: 106,
      renderCell: (params) => (
        <div>
          <div className="styleActionBtn">
            <QuoteLost
              size={16}
              color="#D92D20"
              LostQuote={params.row.LostQuote}
              saleUniqueId={params.row.saleUniqueId}
              saleId={params.row.id}
              status={params.row.status}
              onRemoveRow={removeRow}
              fetchData1={setRows}
              quoteType="lost"
            />
            <QuoteWon
              size={16}
              color="#079455"
              wonQuote={params.row.wonQuote}
              saleUniqueId={params.row.saleUniqueId}
              saleId={params.row.id}
              status={params.row.status}
              onRemoveRow={removeRow}
              fetchData1={setRows}
              quoteType="won"
            />
          </div>
        </div>
      ),
    },
    {
      field: "Actions",
      sortable: false,
      headerName: "Actions",
      width: 72,
      className: "ActionBtn",
      renderCell: (params) => {
        return <ActionsDots key={params.row.saleUniqueId} saleUniqueId={params.row.saleUniqueId}
          clientId={params.row.clientId} refreshData={refreshData} status={params.row.Status} salesHistory={params.row.history} />;
      },
    },
  ];

  useEffect(() => {
    const rows = mapSalesData(salesData);
    setRows(rows);
  }, [salesData, selectedRows]);


  const handleCheckboxChange = (rowId) => {
    const updatedSelectedRows = [...selectedRows];
    if (updatedSelectedRows.includes(rowId)) {
      updatedSelectedRows.splice(updatedSelectedRows.indexOf(rowId), 1);
    } else {
      updatedSelectedRows.push(rowId);
    }
    setSelectedRows(updatedSelectedRows || []);
  };

  // Define selected1UniqueIds as a function that returns the selected unique IDs
  const selected1UniqueIds = () => {
    // Get the unique_id of the selected rows
    const selectedUniqueIds = salesData
      .filter(row => selectedRows.includes(row.id))
      .map(row => row.unique_id);
    return selectedUniqueIds;
  };

  const handleRowsFilterChange = (filteredRows) => {
    setRows(filteredRows);
  };

  return (
    <div className="salesTableWrap">
      <TableTopBar
        profileData={profileData}
        salesData={salesData}
        removeRowMulti={removeRow}
        selectedUniqueIds={selected1UniqueIds()}
        onRowsFilterChange={handleRowsFilterChange}
        rows={rows}
        setSelectedRows={setSelectedRows}
        selectedRow={selectedRows}
        selectedRowCount={selectedRowsCount}
      />

      {!isLoading &&
        <Table responsive style={{ marginBottom: `${trialHeight}px` }}>
          <thead style={{ position: "sticky", top: "0px", zIndex: 9 }}>
            <tr>
              <th>
                <label className="customCheckBox">
                  <input
                    type="checkbox"
                    checked={selectedRows.length && (selectedRows.length === salesData.length)}
                    onChange={handleSelectAllCheckboxChange}
                  />
                  <span className="checkmark">
                    <Check color="#1AB2FF" size={20} />
                  </span>
                </label>
              </th>
              {columns.map((column) => (
                <th key={column.field} style={{ width: column.width }}>
                  <Resizable
                    width={column.width || 100} // Provide a default width if undefined
                    height={0}

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
            {rows.length === 0 ? (
              <tr className="nodataTableRow">
                <td colSpan={columns.length} style={{ textAlign: "center", overflow: 'auto' }}>
                  <NoDataFoundTemplate isDataExist={!!salesData.length} />
                </td>
              </tr>
            ) : (
              rows.map((row) => (
                <tr data-saleuniqueid={row.saleUniqueId}
                  key={row.id} className={selectedRows.includes(row.id) ? "selected-row" : ""}>
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
                    <td key={column.field + row.id}>
                      {column.renderCell({ value: row[column.field], row })}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </Table>}
    </div>
  );
};

export default SalesTables;
