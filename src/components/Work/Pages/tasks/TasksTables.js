import React, { useEffect, useState ,forwardRef} from "react";

import Button from 'react-bootstrap/Button';
import Offcanvas from 'react-bootstrap/Offcanvas';
import defaultIcon from "../../../../assets/images/icon/default.png";
import {
  Check,
  ChevronLeft,ArrowDown,ArrowUp,FileText ,Building,Person
} from "react-bootstrap-icons";



import NodataImg from "../../../../assets/images/img/NodataImg.png";
import nodataBg from "../../../../assets/images/nodataBg.png";
import SearchIcon from "../../../../assets/images/icon/searchIcon.png";


import { Table } from "react-bootstrap";
import TableTopBar from "./TableTopBar";
import { Resizable } from 'react-resizable';
import ViewTaskModal from "./ViewTaskModal";


  const TasksTables = forwardRef(({ TasksData, fetchData, isFetching }, ref) => {
    console.log('TasksData: ', TasksData);
  const [sortField, setSortField] = useState("Quote");
  const [sortDirection, setSortDirection] = useState("asc");
  const [selectedRow, setSelectedRow] = useState(null);

  const TasksResults = Array.isArray(TasksData) ? TasksData : TasksData.results;

  const toggleSort = (field) => {
    setSortField(field);
    setSortDirection((prevDirection) =>
      prevDirection === "asc" ? "desc" : "asc"
    );
  };
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



  const sortedClientsData = [...TasksResults].sort((a, b) => {
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
    const allRowIds = TasksResults.map((sale) => sale.id);
    if (selectedRows.length === allRowIds.length) {
      setSelectedRows([]);
    } else {
      setSelectedRows(allRowIds);
    }
  };

  const selectedRowsCount = selectedRows.length;

  const [columns, setColumns] = useState([
    {
      field: "number",
      width: 163,
      headerName: (
        <div className="styleColor1" onClick={() => toggleSort("number")}>
        <span>Task ID	</span>
        {sortField === "number" && (
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
          <strong>{params.value}</strong>
          
          </div>
         <ViewTaskModal taskId={params.row.id} />
        </div>
      ),
    },

    {
      field: "title",
      headerName: (
        <div className="styleColor1" onClick={() => toggleSort("title")}>
        <span>Task Title</span>
        {sortField === "title" && (
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
        className="mainStyle taskTitle"
        style={{ whiteSpace: "nowrap", textAlign: "left" }}
      >
        <strong>{params.value}</strong>
      
      </div>
      ),
      
    },
    {
      field: "userName",
      // userName: TaskData.user,
      // aliasTask: TaskData.user.alias,
      width: 191,
      sortable: false,
      headerName: "Assigne",
      renderCell: (params) => (
        <div
          className="mainStyle tasksAssigne"
          style={{ whiteSpace: "nowrap", textAlign: "left" }}
        >
          <em><i>{params.row.aliasTask}</i></em><span>{params.value}</span>
        
        </div>
      ),
    },
    {
      field: "TaskStatus",
      sortable: false,
      headerName: "Status",
      width: 128,
      renderCell: (params) => {
        return (
          <div
            className={`mainStyle taskStatusStyle ${params.value}`}
            style={{ whiteSpace: "nowrap", textAlign: "center" }}
          >
          
          {params.value ? (
                  <>
                   <span>Complete</span> 
                  </>
                ) : (
                  <span>Not Complete</span> 
                )}
        
          </div>
        );
      },
    },
    
    {
      field: "taskProject",
      width: 574,
      sortable: false,
      headerName: (
        <div className="styleColor1" onClick={() => toggleSort("Status")}>
        <span>Project</span>
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
        <div className="styleProject d-flex">
         <div className="leftIcon"> <FileText size={13.71} color="#475467" /></div>
         <div className="textWrap"> 
         <p>{params.value}</p>
          <span>{params.row.taskProjectNo}</span>
         </div>
        </div>
      ),
    },
    {
      field: "TaskStartDate",
      sortable: false,
      headerName: "Start Date",
      width: 122,
      renderCell: (params) => (
       
          <div className="taskDatesDue">{formatDate(params.value)}</div>
       
      ),
    },
  
    {
      field: "TaskStartEnd",
      sortable: false,
      headerName: "Due Date",
      width: 137,
      renderCell: (params) => (
        <div className="taskDatesDue">{formatDate(params.value)}</div>
      ),
    },
   
   
  
  ]);

  const [rows, setRows] = useState([]);
  useEffect(()=> {
    const rows = TasksResults.map((TaskData) => {
  
    
      return {
        isSelected: selectedRows.includes(TaskData.id),
        id: TaskData.id,
        number: TaskData.number,
        title: TaskData.title,
        userName: TaskData.user.full_name,
        aliasTask: TaskData.user.alias,
        TaskStatus: TaskData.finished,
        TaskStartDate: TaskData.from_date,
        TaskStartEnd: TaskData.to_date,
        taskProject: TaskData.project.reference,
        taskProjectNo: TaskData.project.number,
      
    
      };
    });
    
    setRows(rows)
  }, [TasksResults,selectedRows])
  

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
    
    const rows = filteredRows.map((TaskData) => {
    
      return {

        isSelected: selectedRows.includes(TaskData.id),
        id: TaskData.id,
        number: TaskData.number,
        title: TaskData.title,
        userName: TaskData.user,
        aliasTask: TaskData.user.alias,
        TaskStatus: TaskData.finished,
        TaskStartDate: TaskData.from_date,
        TaskStartEnd: TaskData.to_date,
        taskProject: TaskData.project.reference,
     
    
      };
    });
    
    setRows(rows);
    setRowsFilter(rows);
  };

  return (
    <div className="tasksTableWrap">
      <TableTopBar TasksData={TasksResults} rowsfilter={rowsfilter} onRowsFilterChange={handleRowsFilterChange} rows={sortedClientsData} selectedRow={selectedRows} selectClass={isSelected ? "selected-row" : ""} selectedRowCount={selectedRowsCount} />
      <Table responsive>
      <thead style={{ position: "sticky", top: "0px", zIndex: 9 }}>
          <tr>
          <th>
          <label className="customCheckBox">
          <input
            type="checkbox"
            checked={selectedRows.length === TasksResults.length}
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




export default TasksTables
