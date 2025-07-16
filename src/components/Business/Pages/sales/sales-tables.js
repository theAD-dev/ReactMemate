import React, { useCallback, useEffect, useRef, useState } from "react";
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
            label={!data.has_photo || !data.photo ? <small>{data.alias_name}</small> : null}
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

const createSalesNote = (noteData, saleUniqueId, refreshData) => (
  <>
    <SalesNote noteData={noteData} saleUniqueId={saleUniqueId} refreshData={refreshData} />
  </>
);

export const mapSalesData = (salesData, refreshData) => {
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
    Note: createSalesNote(sale.sales_note, sale.unique_id, refreshData),
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
    history: sale?.previous_versions,
    has_recurring: sale.has_recurring,
  }));
};

const SalesTables = ({ profileData, salesData, fetchData, isLoading }) => {
  const { trialHeight } = useTrialHeight();
  const [rows, setRows] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);

  const removeRow = useCallback(async () => {
    await fetchData();
  }, [fetchData]);

  const refreshData = useCallback(() => {
    fetchData();
  }, [fetchData]);

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
            <strong className="ellipsis-width" style={{ maxWidth: '85px' }} title={params.value}>{params.value}</strong>
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
        <div className="d-flex align-items-center">
          <ImageAvatar has_photo={params.row.hasPhoto} photo={params.row?.photo} is_business={params.row?.is_business} />
          <div className="ellipsis-width" style={{ maxWidth: '200px' }} title={params.value}>{params.value}</div>
        </div>
      ),

    },
    {
      field: "Reference",
      sortable: false,
      width: 500,
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
        <div className={"d-flex align-items-center justify-content-center"}>
          <div className={`statusInfo ${params.value}`}>
            <Link to="/" style={{ pointerEvents: 'none' }}>{params.value}</Link>
          </div>
          {
            params.row.has_recurring && <Link to={`/settings/quotesjobs/recurring-quotes?recurringId=${params.row.unique_id}`} className="ms-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="17" height="14" viewBox="0 0 17 14" fill="none">
                <path d="M11.5 4.46622V2.99998H5.5C3.29086 2.99998 1.5 4.79085 1.5 6.99998C1.5 7.63948 1.6497 8.24258 1.91552 8.77747C2.03841 9.02476 1.93757 9.32485 1.69028 9.44774C1.44299 9.57063 1.1429 9.46979 1.02 9.2225C0.687005 8.55243 0.5 7.79733 0.5 6.99998C0.5 4.23856 2.73858 1.99998 5.5 1.99998H11.5V0.533742C11.5 0.321783 11.7472 0.205993 11.91 0.341687L14.2695 2.30793C14.3895 2.40788 14.3895 2.59209 14.2695 2.69204L11.91 4.65828C11.7472 4.79397 11.5 4.67818 11.5 4.46622Z" fill="#158ECC" />
                <path d="M15.3097 4.55223C15.557 4.42934 15.8571 4.53018 15.98 4.77747C16.313 5.44754 16.5 6.20264 16.5 6.99998C16.5 9.76141 14.2614 12 11.5 12H5.5V13.4662C5.5 13.6782 5.25279 13.794 5.08995 13.6583L2.73047 11.692C2.61053 11.5921 2.61053 11.4079 2.73047 11.3079L5.08995 9.34169C5.25279 9.20599 5.5 9.32178 5.5 9.53374V11H11.5C13.7091 11 15.5 9.20912 15.5 6.99998C15.5 6.36049 15.3503 5.75739 15.0845 5.2225C14.9616 4.97521 15.0624 4.67512 15.3097 4.55223Z" fill="#158ECC" />
              </svg>
            </Link>
          }
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
    const rows = mapSalesData(salesData, refreshData);
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
                    <Check color="#1ab2ff" size={20} />
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
