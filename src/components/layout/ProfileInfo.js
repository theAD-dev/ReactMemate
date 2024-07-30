import React from "react";
import { QuestionCircle, Search, PlusLg } from "react-bootstrap-icons";
import { Link } from "react-router-dom";

const ProfileInfo = ({ username, userType, aliasName }) => {
  return (
    <>
      <div className="avatar-wrap flexEndbox colMinWidth">
        <ul>
          <li>
            <PlusLg color="#667085" size={20} />
          </li>
          <li>
            <Search color="#667085" size={20} />
          </li>
          <li>
            <QuestionCircle color="#667085" size={20} />
          </li>
        </ul>
        <div className=" mr">
        <Link className="avatar-info" to="/settings/generalinformation">
          {username}
          <span>{userType}</span>
          </Link>
        </div>
        <Link to="/settings/generalinformation">
          <div className="userImageBox">{aliasName} </div>
          </Link>
      </div>
    </>
  );
};
export default ProfileInfo;