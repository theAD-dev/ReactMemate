import React from 'react';
import { People, InfoSquare, ChevronLeft, Building, CardList, Person } from "react-bootstrap-icons";
import { NavLink } from "react-router-dom";

const NewClient = () => {
  return (
    <div className="newQuotePage existingClients borderSkyColor">
      <div className="dFlex">
        <div className="newQuoteBack">
          <NavLink to="/sales/newquote/selectyourclient">
            <button>
              <ChevronLeft color="#000000" size={20} /> &nbsp;&nbsp;Go Back
            </button>
          </NavLink>
        </div>
        <div className="newQuoteContent">
          <div className='navStepClient'>
            <ul>
              <li className='activeClientTab'><span><Person color="#D0D5DD" size={15} /></span> <p>Choose Client</p></li>
              <li className='deactiveColorBox'><span><InfoSquare color="#D0D5DD" size={15} /></span> <p>Client Information</p> </li>
              <li className='deactiveColorBox'><span><CardList color="#D0D5DD" size={15} /></span> <p>Scope of Work</p> </li>
            </ul>
          </div>
          <div className="formgroupWrap clstep01">
            <ul className='mt-4'>
              <li>
                <NavLink className="" to="/sales/newquote/selectyourclient/business-client"><span><Building color="#667085" size={24} /></span> Business Client</NavLink>
              </li>
              <li>
                <NavLink className="" to="/sales/newquote/selectyourclient/individual-client"><span><People color="#667085" size={24} /></span> Individual Client</NavLink>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
export default NewClient