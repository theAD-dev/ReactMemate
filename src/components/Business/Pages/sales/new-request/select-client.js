import React from "react";
import {
  People,
  PersonAdd,
  HouseDoor,
  ChevronLeft,
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
          <h3>Select Client Type</h3>

          <div className="formgroupWrap1">
            <ul className="mt-3" style={{ opacity: '.6', cursor: 'not-allowed' }}>
              <li>
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
                  className="ActiveClient"
                  to="/sales/newquote/selectyourclient/new-clients"
                >
                  <span>
                    <PersonAdd color="#1AB2FF" size={24} />
                  </span>{" "}
                  New Client{" "}
                </NavLink>
              </li>
            </ul>
          </div>

          <div className="formgroupWrap">
            <ul className="mt-2">
              <li className="w-100">
                <NavLink
                  className="ActiveClient"
                  to="#"
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
