import React, { useState, useEffect } from 'react';
import { Button, Menu, MenuItem } from '@mui/material';
import ArrowDownIcon from '@mui/icons-material/ArrowDropDown';
import { calcDepartment, calcReferenceId } from '../../../../../APIs/CalApi';
import { NestedMenuItem } from 'mui-nested-menu'; // Use named export
import { Table } from "react-bootstrap";
import { ChevronDown,Trash3, GripVertical, } from 'react-bootstrap-icons';

const QuoteTable = () => {

  const [description, setDescription] = useState({
      index: '',
      field: '',
      value: ''
  });

  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const [data, setData] = useState([]);
  const [dropDownTitle, setDropDownTitle] = useState('select');
  const [subMenuData, setSubMenuData] = useState([]);
  const [emptyRow,setEmptyRow] = useState(true);
  const [rows, setRows] = useState([]);
  const [editingIndex, setEditingIndex] = useState([]);
  const [editData,setEditData] = useState([]);
  const [EditMode, setEditMode] = useState(false);
  const [selectname,setselectname] = useState([]); 
  const [objectLength,setObjectLength] = useState(0);


  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await calcDepartment();
        
        setData(result);
      } catch (error) {
        console.error('An error occurred:', error);
      }
    };
    fetchData();
  }, []);


  const handleInputChange = async (value) => {
    try {
  
      const result = await calcReferenceId(value);
      console.log('objectLength       '+result.length);
     
      setRows((prevRows) => [...prevRows, ...result]);
      console.log('--------------------------------------'+JSON.stringify(rows));
      setObjectLength(result.length);
      setselectname(result.title);
    } catch (error) {
      console.error('An error occurred:', error);
    }
  };

  const handleFieldClick = (index) => {
    setEditingIndex(index);
  };


  const descriptionArray = [];



  const handleInputChangeDescriptiononEdit = (index,field,value)=> {
    const newData  = [...editData];
    newData[index] = { ...newData[index], [field]: value ,['key']: index};
    const updatedRows = rows.map((row, i) =>
      i === index ? { ...row, [field]: value } : row
    );
    setRows(updatedRows);
    //const dataObject = { [index]: value };
    //descriptionArray.push({ [field]: dataObject });
    //console.log('--------------------description array--------------'+JSON.stringify(descriptionArray));
    //console.log("----------on description----"+JSON.stringify(newData[index]));
  }

  const handleInputChangeCostEdit = (index,field,value)=> {
    const newData  = [...editData];
    newData[index] = { ...newData[index], [field]: value ,['key']: index};
    const updatedRows = rows.map((row, i) =>
      i === index ? { ...row, [field]: value } : row
    );
    setRows(updatedRows);
    console.log("----------------on cost--------------------"+JSON.stringify(newData[index]));
  }
  
  const handleInputChangePerHourEdit = (index,field,value)=>{
    const newData  = [...editData];
    newData[index] = { ...newData[index], [field]: value ,['key']: index};
    const updatedRows = rows.map((row, i) =>
      i === index ? { ...row, [field]: value } : row
    );
    setRows(updatedRows);
    console.log("----------------per hour--------------------"+JSON.stringify(newData[index]));
  }

  const handleInputChangeMarginEdit = (index,field,value)=>{
    const newData  = [...editData];
    newData[index] = { ...newData[index], [field]: value ,['key']: index};
    const updatedRows = rows.map((row, i) =>
      i === index ? { ...row, [field]: value } : row
    );
    setRows(updatedRows);
    console.log("----------------margin--------------------"+JSON.stringify(newData[index]));
  }


  const handleInputChangeDiscountEdit = (index,field,value)=>{
    const newData  = [...editData];
    newData[index] = { ...newData[index], [field]: value ,['key']: index};
    const updatedRows = rows.map((row, i) =>
      i === index ? { ...row, [field]: value } : row
    );
    setRows(updatedRows);
    console.log("----------------discount--------------------"+JSON.stringify(newData[index]));
  }

  const handleInputChangeAmountEdit =(index,field,value)=>{
    const newData  = [...editData];
    newData[index] = { ...newData[index], [field]: value ,['key']: index};
    const updatedRows = rows.map((row, i) =>
      i === index ? { ...row, [field]: value } : row
    );
    setRows(updatedRows);
    console.log("---------------amount--------------------"+JSON.stringify(newData[index]));
  }



  const toggleEditMode = ()=>{
    setEditMode(true);
  }
  const handelFocusout = () =>{
    setEditMode(false);
  }
  return (
    <div>


<Table>
  
  
{rows.map((row, index) => (
  
    <tr className='cal_select'>
      
      
      <td className='cal_select_btn'>
        <div className="customDropDown">
          <button>{row.title}</button>
            <ul className="mainMenuData">
              {data.map((item, index) => (
               
                <li key={index}>
                   {index}
                  {item.name}
                  <ul className="subMenudata">
                    {item.subindexes.map((subitem, subIndex) => (
                      <li onClick={(e) => handleInputChange( e.target.value)} value={subitem.id} >{subitem.name}</li>
                    ))}
                  </ul>
                </li>
              ))}
            </ul>
        </div>
      </td>
      
      <td colSpan={7}>
        
        <Table>
          <tr>
            <td>  
            {EditMode ? (
              <React.Fragment key={index}>
                <div className='description'>
                  <textarea
                    value= {row.description}
                    onChange={(e) => handleInputChangeDescriptiononEdit(index, 'description', e.target.value)}
                    onClick={() => handleFieldClick(index)}
                    onBlur={()=> handelFocusout()   }/>
                </div>
              </React.Fragment>
              ) : (
                <textarea onClick={toggleEditMode}  value= {row.description} />
              )};
             

            </td>
             <td>
             {EditMode ? (
              <React.Fragment key={index}>
                          <div className='cost'>
                          <input
                              type= {row.cost}
                              value={row.cost}
                              onChange={(e) => handleInputChangeCostEdit(index, 'cost', e.target.value)}
                            />
                            <select
                              value={row.costType}
                              onChange={(e) => handleInputChangeCostEdit(index, 'costType', e.target.value)}>
                              <option value="hourly">1/H</option>
                              <option value="quantity">1/Q</option>
                            </select>
                            
                          </div>
                </React.Fragment>
                  ) : (
                    <React.Fragment key={index}>
                    <input
                    type="text"
                    value={row.cost}
                    onChange={(e) => handleInputChangeCostEdit(index, 'cost', e.target.value)}
                  />
                  <select
                    value={row.costType}
                    onChange={(e) => handleInputChangeCostEdit(index, 'costType', e.target.value)}>
                    <option value="hourly">1/H</option>
                    <option value="quantity">1/Q</option>
                  </select>
                  </React.Fragment>
                  )}

              </td>
            <td>

            {EditMode ? (
              <React.Fragment key={index}>
                <div className='prhour'>
                  $ <input
                    type="text"
                    value={row.per_hour}
                    onChange={(e) => handleInputChangePerHourEdit(index, 'per_hour', e.target.value)}
                    />
                </div>
                </React.Fragment>
            ):(
              <React.Fragment key={index}>
                  <div className='prhour'>
                    $ <input
                      type="text"
                      value={row.per_hour}
                      onChange={(e) =>  handleInputChangePerHourEdit(index, 'per_hour', e.target.value)}
                      />
                </div>
                </React.Fragment>
            )}

            </td>
            
             <td> 
              
            {EditMode ? (
              <React.Fragment key={index}>
                <div className='margin'>
                    <input
                      type="text"
                      value={row.margin}
                      onChange={(e) => handleInputChangeMarginEdit(index, 'margin', e.target.value)}
                    /> MRG %
                    <select
                    value={row.margin}
                    onChange={(e) => handleInputChangeMarginEdit(index, 'costType', e.target.value)}>
                    <option value="hourly">1/H</option>
                    <option value="quantity">1/Q</option>
                  </select>
                </div>
              </React.Fragment>
               ):(
                  <React.Fragment key={index}>
                  <div className='margin'>
                      <input
                        type="text"
                        value={row.margin}
                        onChange={(e) => handleInputChangeMarginEdit(index, 'margin', e.target.value)}
                      /> MRG %
                      <select
                      value={row.margin}
                      onChange={(e) => handleInputChangeMarginEdit(index, 'costType', e.target.value)}>
                      <option value="hourly">1/H</option>
                      <option value="quantity">1/Q</option>
                    </select>
                  </div>
                </React.Fragment>
               )}
            </td> 

             <td>  
             
          {EditMode ? (
              <React.Fragment key={index}>
                <div className='discount'>
                  $ <input
                          type="text"
                          value={row.discount}
                          onChange={(e) => handleInputChangeDiscountEdit(index, 'discount', e.target.value)}
                        />
                                </div>
              </React.Fragment>
            ):(
              <React.Fragment key={index}>
                                <div className='discount'>
                                  $ <input
                          type="text"
                          value={row.discount}
                          onChange={(e) => handleInputChangeDiscountEdit(index, 'discount', e.target.value)}
                        />
                                </div>
              </React.Fragment>
            )}
              </td> 
             <td>
            
            {EditMode ? (
              <React.Fragment key={index}>
                                    <div className='amount'>
                                      <input
                                        type="text"
                                        value={row.amount}
                                        onChange={(e) =>
                                          handleInputChangeAmountEdit(index, "amount", e.target.value)
                                        }
                                      />
                                      %
                                    </div>
              </React.Fragment>
            ):(
              <React.Fragment key={index}>
                                    <div className='amount'>
                                      <input
                                        type="text"
                                        value={row.amount}
                                        onChange={(e) =>
                                          handleInputChangeAmountEdit(index, "amount", e.target.value)
                                        }
                                      />
                                      %
                                    </div>
              </React.Fragment>
            )}
              </td> 

           
          </tr>
          {emptyRow?
           ''
          :
           <tr>
              <td>
                <textarea placeholder='Textarea'/>
              </td>
              <td>
                <input type="text"/>
                <select>
                  <option value="hourly">1/H</option>
                  <option value="quantity">1/Q</option>
                </select>
              </td>
              <td>
                <div className='cost'>
                  <input type="text"/>
                  <select>
                    <option value="hourly">1/H</option>
                    <option value="quantity">1/Q</option>
                  </select>            
                </div>
              </td>
            <td>
              <div className='cost'>
                <input type="text"/>
                  <select>
                    <option value="hourly">1/H</option>
                    <option value="quantity">1/Q</option>
                  </select>
              </div>
            </td>
            <td>
              <div className='cost'>
                <input type="text"/>
                  <select>
                    <option value="hourly">1/H</option>
                    <option value="quantity">1/Q</option>
                  </select>
              </div>
            </td>
            <td>fgbfb</td>
            <td>fgbfb</td>
          </tr> 
            }
        </Table>
      </td>
    </tr>

))}
    {/* call intially------- */}
     <tr className='rowData'>
      <td>
      <div className="customDropDown">
          <button>Select</button>
            <ul className="mainMenuData">
              {data.map((item, index) => (
                <li key={index}>
                  {item.name}
                  <ul className="subMenudata">
                    {item.subindexes.map((subitem, subIndex) => (
                      <li onClick={(e) => handleInputChange( e.target.value)} value={subitem.id} >{subitem.name}</li>
                    ))}
                  </ul>
                </li>
              ))}
            </ul>
        </div>
      </td>
      <td colSpan={7}>
      {emptyRow?
        <Table>
          <tr>
            <td>
              <textarea placeholder='Textarea'/>
            </td>
            <td>
              <input type="text"/>
                <select>
                  <option value="hourly">1/H</option>
                  <option value="quantity">1/Q</option>
                </select></td>
            <td><div className='cost'>
              <input type="text"/>
                <select>
                  <option value="hourly">1/H</option>
                  <option value="quantity">1/Q</option>
                </select>
                          </div></td>
            <td>
              <div className='cost'>
                <input type="text"/>
                  <select>
                    <option value="hourly">1/H</option>
                    <option value="quantity">1/Q</option>
                  </select>
              </div>
                  </td>
            <td>
              <div className='cost'>
                <input type="text"/>
                  <select>
                    <option value="hourly">1/H</option>
                    <option value="quantity">1/Q</option>
                  </select>
              </div>
            </td>
            <td>fgbfb</td>
            <td>fgbfb</td>
          </tr>
        </Table>
         :''}
      </td>
    </tr> 
  </Table>
    </div>
  );
};

export default QuoteTable;