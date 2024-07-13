import React from 'react';
import { People,InfoSquare,ChevronLeft,Building,CardList,Person} from "react-bootstrap-icons";
import { NavLink } from "react-router-dom";




const ClientInformation = () => {
  return (
    <div className="newQuotePage existingClients">
    <div className="dFlex">
    <div className="newQuoteBack">
        <button><NavLink to="/sales/newquote/selectyourclient/step1"><ChevronLeft color="#000000" size={20} /> Go Back</NavLink></button>
        </div>
        <div className="newQuoteContent">
              <div className='navStepClient'>
                <ul>
                    <li className='activeClientTab'><span><Person color="#D0D5DD" size={15} /></span> <p>Choose Client</p></li>
                    <li><span><InfoSquare color="#D0D5DD" size={15} /></span> <p>Client Information</p> </li>
                    <li><span><CardList color="#D0D5DD" size={15} /></span> <p>Scope of Work</p> </li>
                </ul>
              </div>
              <div className="formgroupWrap clstep01">
               <ul className='mt-4'>
               <li>
                <NavLink className="" to="/sales/newquote/client-information/step2/business-details/"><span><Building color="#667085" size={24} /></span> Business Client</NavLink>
                </li>
                <li>
                <NavLink className="" to="/sales/newquote/client-information/step2/individual-client"><span><People color="#667085" size={24} /></span> Individual Client</NavLink>
                </li>
                 </ul>
                  </div>
             
        </div>
        </div>
        </div>
  )
}
export default ClientInformation