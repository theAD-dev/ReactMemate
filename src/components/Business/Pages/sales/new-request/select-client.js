import React from "react";
import {
  People,
  PersonAdd,
  HouseDoor,
  ChevronLeft,
} from "react-bootstrap-icons";
import { NavLink } from "react-router-dom";

const SelectClientType = () => {
  try {
    const storedData = window.sessionStorage.getItem(`new-request`);
    if (storedData) window.sessionStorage.removeItem('new-request');
  } catch (error) {
    console.error('Failed to parse form data from sessionStorage', error);
  }
  return (
    <div className="newQuotePage existingClients">
      <div className="dFlex">
        <div className="newQuoteBack">
          <button><NavLink to="/sales">
            <ChevronLeft color="#000000" size={20} /> Go Back{" "}
          </NavLink></button>
        </div>
        <div className="newQuoteContent">
          <h3> Select Client Type </h3>
          <div className="formgroupWrap">
            <ul className="mt-3">
              <li>
                <NavLink
                  className="ActiveClient"
                  to="/sales/newquote/selectyourclient/existing-clients"
                >
                  <span>
                    <People color="#1AB2FF" size={24} />
                  </span>{" "}
                  Existing Client{" "}
                </NavLink>
              </li>
              <li>
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
          <div className="formgroupWrap1">
            <ul className="mt-4">
              <li>
                <NavLink className="ActiveClient" to="#">
                  <span>
                    <HouseDoor color="#667085" size={24} />
                  </span>{" "}
                  Internal Project
                </NavLink>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
export default SelectClientType;
