import React from "react";
import { Placeholder } from "react-bootstrap";
import { QuestionCircle, Search, PlusLg, Bell } from "react-bootstrap-icons";
import { Link } from "react-router-dom";
import style from './header.module.scss';
import { FallbackImage } from "../../ui/image-with-fallback/image-avatar";

const ProfileInfo = ({ username, userType, aliasName, photo, has_photo }) => {
  return (
    <>
      <div className="avatar-wrap flexEndbox colMinWidth">
        <ul className="d-flex flex-nowrap gap-2">
          <li className={style.navbarActionIcon}>
            <Bell color="#667085" size={20} />
          </li>
          <li className={style.navbarActionIcon}>
            <PlusLg color="#667085" size={20} />
          </li>
          <li className={style.navbarActionIcon}>
            <Search color="#667085" size={20} />
          </li>
          <li className={style.navbarActionIcon}>
            <QuestionCircle color="#667085" size={20} />
          </li>
        </ul>
        <div className="mr">
          <Link className="avatar-info d-flex align-items-center gap-3" to="/settings/generalinformation">
            <div style={{ whiteSpace: 'nowrap' }}>
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
              has_photo ? <div style={{ width: '32px', height: '32px', borderRadius: '50%', overflow: 'hidden', display: 'flex', justifyContent: 'center', alignItems: 'center', background: 'linear-gradient(180deg, #f9fafb 0%, #edf0f3 100%)', border: '0.75px solid #ccc' }}>
                <FallbackImage has_photo={has_photo} photo={photo} is_business={false} />
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
