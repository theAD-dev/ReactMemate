import React from "react";
import {
  People,
  PersonAdd,
  HouseDoor,
  ChevronLeft,
  Person,
  InfoSquare,
  CardList,
} from "react-bootstrap-icons";
import { NavLink } from "react-router-dom";
import { ExistingClientsSearch } from "./existing-clients";
import { useTrialHeight } from "../../../../../app/providers/trial-height-provider";

const SelectClientType = () => {
  const { trialHeight } = useTrialHeight();
  try {
    const storedData = window.sessionStorage.getItem(`new-request`);
    if (storedData) window.sessionStorage.removeItem('new-request');
  } catch (error) {
    console.error('Failed to parse form data from sessionStorage', error);
  }
  return (
    <div className="newQuotePage existingClients p-0 pt-4" style={{ height: `calc(100vh - 130px - ${trialHeight}px)` }}>
      <div className="dFlex h-100 m-0 p-0" style={{ overflowY: 'hidden' }}>
        <div className="newQuoteBack">
          <button><NavLink to="/sales">
            <ChevronLeft color="#000000" size={20} /> Go Back{" "}
          </NavLink></button>
        </div>
        <div className="newQuoteContent mb-0">
          <div className='navStepClient'>
            <ul>
              <li className='activeClientTab'><span><Person color="#D0D5DD" size={15} /></span> <p>Choose Client</p></li>
              <li className='deactiveColorBox'><span><InfoSquare color="#D0D5DD" size={15} /></span> <p>Client Information</p> </li>
              <li className='deactiveColorBox'><span><CardList color="#D0D5DD" size={15} /></span> <p>Scope of Work</p> </li>
            </ul>
          </div>

          <div className="formgroupWrap">
            <ul className="mt-2">
              <li className="w-50 me-1">
                <NavLink
                  className="ActiveClient"
                  to="/sales/newquote/selectyourclient/new-clients"
                >
                  <span>
                    <PersonAdd color="#1AB2FF" size={24} />
                  </span>{" "}
                  New Client{" "}
                </NavLink>
              </li>
              <li className="w-50 ms-1" style={{ opacity: '.6', cursor: 'not-allowed' }}>
                <NavLink className="ActiveClient" to="#" style={{ cursor: 'not-allowed' }}>
                  <span>
                    <HouseDoor color="#667085" size={24} />
                  </span>{" "}
                  Internal Project
                </NavLink>
              </li>
            </ul>
          </div>

          <div className="formgroupWrap">
            <ul className="mt-2">
              <li className="w-100">
                <NavLink
                  className="ActiveClient border-bottom-0"
                  to="#"
                  style={{ cursor: 'default', background: 'none' }}
                >
                  <span>
                    <People color="#1AB2FF" size={24} />
                  </span>{" "}
                  Existing Client{" "}
                </NavLink>
              </li>
            </ul>
          </div>

          <ExistingClientsSearch />
        </div>
      </div>
    </div>
  );
};
export default SelectClientType;
