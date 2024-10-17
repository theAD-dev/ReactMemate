import React from "react";
import { Placeholder } from "react-bootstrap";
import { QuestionCircle, Search, PlusLg } from "react-bootstrap-icons";
import { Link } from "react-router-dom";

const ProfileInfo = ({ username, userType, aliasName, photo }) => {
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
        <div className="mr">
          <Link className="avatar-info d-flex align-items-center gap-3" to="/settings/generalinformation">
            <div>
              {username ? username : (
                <Placeholder as="p" animation="wave" style={{ marginBottom: '10px', marginTop: '5px' }}>
                  <Placeholder bg="secondary" size='md' style={{ width: '120px' }} />
                </Placeholder>
              )}
              <span>
                {userType ? userType : (
                  <Placeholder as="p" animation="wave" style={{ marginBottom: '5px' }}>
                    <Placeholder bg="secondary" size='sm' style={{ width: '70px' }} />
                  </Placeholder>
                )}
              </span>
            </div>
            {
              photo ? <div style={{ width: '32px', height: '32px', borderRadius: '50%', overflow: 'hidden', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <img src={photo} id="my-profile-img" alt="profile" />
              </div>
                : <div className="userImageBox">{aliasName}</div>
            }
          </Link>
        </div>
      </div>
    </>
  );
};
export default ProfileInfo;
