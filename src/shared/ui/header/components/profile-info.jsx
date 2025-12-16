import React from "react";
import { Placeholder } from "react-bootstrap";
import { QuestionCircle } from "react-bootstrap-icons";
import { Link, NavLink } from "react-router-dom";
import clsx from "clsx";
import chatIcon from '../../../../assets/images/icon/message-text.svg';
import { FallbackImage } from "../../image-with-fallback/image-avatar";
import style from '../header.module.scss';
import GlobalSearch from "./global-search";
import Notification from "./notification";
import useChatNotification from "../../../hooks/use-chat-notification";

const ProfileInfo = ({ username, userType, aliasName, photo, has_photo }) => {
    const { chatUnreadCount } = useChatNotification();
    return (
        <>
            <div className="avatar-wrap flexEndbox colMinWidth">
                <ul className="d-flex flex-nowrap">
                    <li className="mx-1" style={{ position: 'relative' }}>
                        <NavLink
                            to="/chat"
                            className={({ isActive }) =>
                                (isActive ? "menuActive" : "link") + " chat"
                            }
                        >

                            Chat
                            <div style={{ width: '20px', height: '20px', overflow: 'hidden', marginLeft: '0px', paddingTop: '0px', position: 'relative', top: '-2px' }}>
                                <img src={chatIcon} alt="chat" width={'20px'} height={'20px'} style={{ width: '20px', height: '20px' }} />
                            </div>
                        </NavLink>
                        {
                            chatUnreadCount > 0 && <span className={style.badge}>
                                {chatUnreadCount > 99 ? '99+' : chatUnreadCount}
                            </span>
                        }
                    </li>
                    <Notification />
                    <GlobalSearch />
                    <NavLink
                        to={"/help"}
                        className={({ isActive }) =>
                            (isActive ? style.navbarActionIconActive : "")
                        }
                    >
                        <li className={clsx(style.navbarActionIcon)}>
                            <QuestionCircle color="#475467" size={20} />
                        </li>
                    </NavLink>
                </ul>
                <div className="mr">
                    <Link className={clsx("avatar-info d-flex align-items-center gap-3 px-2", style.profileLink)} to="/settings/generalinformation">
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
