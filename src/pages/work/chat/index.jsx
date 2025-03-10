import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import clsx from 'clsx';
import { IconField } from "primereact/iconfield";
import { InputIcon } from "primereact/inputicon";
import { InputSwitch } from "primereact/inputswitch";
import { InputText } from "primereact/inputtext";
import style from './chat.module.scss';
import { useTrialHeight } from '../../../app/providers/trial-height-provider';

const Chat = () => {
    const { trialHeight } = useTrialHeight();
    const location = useLocation();
    const params = new URLSearchParams(location.search);
    const chatId = params.get("id");
    console.log('chatId: ', chatId);

    const mockChatData = {
        1: {
            name: "Andi Lane",
            messages: [
                { sender: "You", text: "Awesome! Thanks. I'll look at this today.", time: "Friday 2:20pm" },
                { sender: "Andi Lane", text: "No rush though — we still have to wait for Lana's designs.", time: "Friday 2:20pm" },
                { sender: "Andi Lane", text: "Hey Olivia, can you please review the latest design when you can?", time: "Today" },
                { sender: "You", text: "Sure thing, I'll have a look today. They're looking great!", time: "Friday 2:20pm" },
            ],
            avatar: "https://via.placeholder.com/40",
            status: "online",
            attachment: "latest_design_screenshot.jpg"
        },
        2: { name: "Jane Cooper", status: "offline", avatar: "https://via.placeholder.com/40", messages: [] },
        3: { name: "Marvin McKinney", status: "offline", avatar: "https://via.placeholder.com/40", messages: [] },
        4: { name: "Phoenix Baker", status: "offline", avatar: "https://via.placeholder.com/40", messages: [] },
    };

    const currentChat = chatId ? mockChatData[chatId] : null;

    return (
        <div className={style.chatContainer} style={{ height: `calc(100vh - 130px - ${trialHeight}px)` }}>
            <div className={style.chatSidebar}>
                <div className={style.chartSidebarHeader}>
                    <div className={style.chartSidebarHeaderFirstRow}>
                        <div className='d-flex align-items-center gap-2'>
                            <h1 className={style.chatSidebarTitle}>Messages</h1>
                            <div className={style.unreadChatCount}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="8" height="9" viewBox="0 0 8 9" fill="none">
                                    <circle cx="4" cy="4.5" r="3" fill="#17B26A" />
                                </svg>
                                <span>40</span>
                            </div>
                        </div>
                        <div className='d-flex align-items-center gap-2'>
                            <InputSwitch style={{ opacity: '.5' }} />
                            <h1 className={style.chatSidebarArchived}>Archived</h1>
                        </div>
                    </div>
                    <div className={style.chartSidebarHeaderSecondRow}>
                        <IconField iconPosition="left" className='border w-100 rounded text-start'>
                            <InputIcon style={{ position: 'relative' }}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                                    <path d="M14.6777 12.9299C15.6661 11.5841 16.25 9.92275 16.25 8.125C16.25 3.63769 12.6123 0 8.125 0C3.63769 0 0 3.63769 0 8.125C0 12.6123 3.63769 16.25 8.125 16.25C9.92323 16.25 11.585 15.6658 12.9309 14.6769L12.9299 14.6777C12.9667 14.7277 13.0078 14.7756 13.053 14.8208L17.8661 19.6339C18.3543 20.122 19.1457 20.122 19.6339 19.6339C20.122 19.1457 20.122 18.3543 19.6339 17.8661L14.8208 13.053C14.7756 13.0078 14.7277 12.9667 14.6777 12.9299ZM15 8.125C15 11.922 11.922 15 8.125 15C4.32804 15 1.25 11.922 1.25 8.125C1.25 4.32804 4.32804 1.25 8.125 1.25C11.922 1.25 15 4.32804 15 8.125Z" fill="#98A2B3" />
                                </svg>
                            </InputIcon>
                            <InputText placeholder="Search" style={{ padding: '10px 10px 10px 20px' }} />
                        </IconField>
                    </div>
                    <div className={style.chartSidebarHeaderThirdRow}>
                        <div className={clsx(style.chartSidebarHeaderUserCount, style.active)}>
                            <span>Users</span>
                            <div>12</div>
                        </div>
                        <div className={style.chartSidebarHeaderProjectCount}>
                            <span>Projects</span>
                            <div>4</div>
                        </div>
                    </div>
                </div>
                <div className={style.chartSidebarUsers}>
                    <Link to={"?id=1"} className={style.chartSidebarUserContainer}>
                        <div className='d-flex justify-content-between align-items-center w-100'>
                            <div className='d-flex align-items-center gap-2'>
                                <div className={style.userAvatar}></div>
                                <span className={style.chatUserName}>Andi Lane</span>
                            </div>
                            <span className={style.lastMessageTime}>5min ago</span>
                        </div>
                        <p className='mb-0 text-start ellipsis-width text-dark font-14' style={{ maxWidth: '100%' }}>You: Sure thing, I'll have a look today. They're...</p>
                    </Link>
                    {/* Add more user links as needed */}
                    <Link to={"?id=2"} className={style.chartSidebarUserContainer}>
                        <div className='d-flex justify-content-between align-items-center w-100'>
                            <div className='d-flex align-items-center gap-2'>
                                <div className={style.userAvatar}></div>
                                <span className={style.chatUserName}>Jane Cooper</span>
                            </div>
                            <span className={style.lastMessageTime}>12min ago</span>
                        </div>
                        <p className='mb-0 text-start ellipsis-width text-dark font-14' style={{ maxWidth: '100%' }}>You: Sure thing, I'll have a look today. They're...</p>
                    </Link>
                    <Link to={"?id=3"} className={style.chartSidebarUserContainer}>
                        <div className='d-flex justify-content-between align-items-center w-100'>
                            <div className='d-flex align-items-center gap-2'>
                                <div className={style.userAvatar}></div>
                                <span className={style.chatUserName}>Marvin McKinney</span>
                            </div>
                            <span className={style.lastMessageTime}>32min ago</span>
                        </div>
                        <p className='mb-0 text-start ellipsis-width text-dark font-14' style={{ maxWidth: '100%' }}>You: Sure thing, I'll have a look today. They're...</p>
                    </Link>
                    <Link to={"?id=4"} className={style.chartSidebarUserContainer}>
                        <div className='d-flex justify-content-between align-items-center w-100'>
                            <div className='d-flex align-items-center gap-2'>
                                <div className={style.userAvatar}></div>
                                <span className={style.chatUserName}>Phoenix Baker</span>
                            </div>
                            <span className={style.lastMessageTime}>5min ago</span>
                        </div>
                        <p className='mb-0 text-start ellipsis-width text-dark font-14' style={{ maxWidth: '100%' }}>Hey Olivia, Katherine sent me over the latest doc...</p>
                    </Link>
                </div>
            </div>
            <div className={style.chatArea}>
                {
                    chatId ? (
                        <div className={style.selectedChatArea}>
                            <div className={style.selectedChatAreaHeader}>
                                <div className='d-flex align-items-center gap-2'>
                                    <div className={style.userAvatar} style={{ backgroundImage: `url(${currentChat.avatar})` }}></div>
                                    <div>
                                        <h2 className={style.chatHeaderName}>{currentChat.name}</h2>
                                        <span className={style.chatHeaderStatus}>{currentChat.status}</span>
                                    </div>
                                </div>
                            </div>
                            <div className={style.selectedChatAreaChats}>
                                {currentChat?.messages?.length ? currentChat.messages.map((msg, index) => (
                                    <div key={index} className={style.chatMessage} data-sender={msg.sender === "You" ? "sent" : "received"}>
                                        <p className={style.messageText}>{msg.text}</p>
                                        <span className={style.messageTime}>{msg.time}</span>
                                    </div>
                                )) : (
                                    <div className='d-flex flex-column justify-content-center align-items-center w-100 h-100 gap-3'>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="220" height="171" viewBox="0 0 220 171" fill="none">
                                            <circle cx="110" cy="80" r="80" fill="#EAECF0" />
                                            <circle cx="18" cy="12" r="8" fill="#F2F4F7" />
                                            <circle cx="198" cy="142" r="6" fill="#F2F4F7" />
                                            <circle cx="25" cy="138" r="10" fill="#F2F4F7" />
                                            <circle cx="210" cy="46" r="10" fill="#F2F4F7" />
                                            <circle cx="191" cy="11" r="7" fill="#F2F4F7" />
                                            <path opacity="0.7" d="M140.356 4H75.0524C72.3887 4.00774 69.8364 5.06932 67.9528 6.95284C66.0693 8.83635 65.0077 11.3887 65 14.0524V20.7589C65.0077 23.4226 66.0693 25.975 67.9528 27.8585C69.8364 29.742 72.3887 30.8036 75.0524 30.8113H140.356L150.409 36.7694V14.0231C150.391 11.3651 149.326 8.82132 147.444 6.94454C145.561 5.06776 143.014 4.00961 140.356 4Z" fill="#667085" />
                                            <path d="M138.537 13.605H76.8355V15.2779H138.537V13.605Z" fill="white" />
                                            <path d="M138.537 19.5339H88.7074V21.2069H138.537V19.5339Z" fill="white" />
                                            <path opacity="0.15" d="M75.0156 48.6416H140.32C142.983 48.6493 145.536 49.7109 147.419 51.5944C149.303 53.478 150.364 56.0303 150.372 58.694V65.3932C150.364 68.0569 149.303 70.6092 147.419 72.4928C145.536 74.3763 142.983 75.4378 140.32 75.4456H75.0156L64.9631 81.4037V58.6573C64.9786 55.9994 66.0438 53.4553 67.9267 51.5793C69.8096 49.7033 72.3576 48.6474 75.0156 48.6416Z" fill="#667085" />
                                            <path opacity="0.5" d="M138.537 58.239H76.8355V59.912H138.537V58.239Z" fill="#667085" />
                                            <path opacity="0.5" d="M105.452 64.175H76.8355V65.848H105.452V64.175Z" fill="#667085" />
                                            <path opacity="0.5" d="M121.558 64.175H109.92V65.848H121.558V64.175Z" fill="#667085" />
                                            <path opacity="0.7" d="M140.356 93.2759H75.0524C72.3887 93.2836 69.8364 94.3452 67.9528 96.2287C66.0693 98.1123 65.0077 100.665 65 103.328V110.027C65.0058 112.692 66.0668 115.245 67.9507 117.129C69.8346 119.013 72.3881 120.074 75.0524 120.08H140.356L150.409 126.038V103.292C150.39 100.635 149.323 98.093 147.441 96.2178C145.559 94.3426 143.013 93.2855 140.356 93.2759Z" fill="#667085" />
                                            <path d="M138.537 102.873H76.8355V104.546H138.537V102.873Z" fill="white" />
                                            <path d="M138.537 108.809H88.7074V110.482H138.537V108.809Z" fill="white" />
                                            <path opacity="0.15" d="M75.0156 137.91H100.425C103.089 137.92 105.64 138.982 107.523 140.865C109.406 142.748 110.468 145.299 110.478 147.963V154.669C110.468 157.332 109.406 159.883 107.523 161.767C105.64 163.65 103.089 164.712 100.425 164.721H75.0156L64.9631 170.672V147.963C64.9709 145.299 66.0325 142.747 67.916 140.863C69.7995 138.979 72.3519 137.918 75.0156 137.91Z" fill="#667085" />
                                            <path opacity="0.5" d="M80.1079 151.316C80.1079 151.896 79.9357 152.464 79.6132 152.946C79.2907 153.429 78.8324 153.805 78.2961 154.027C77.7598 154.249 77.1696 154.308 76.6003 154.194C76.0309 154.081 75.508 153.801 75.0975 153.391C74.687 152.981 74.4075 152.458 74.2942 151.888C74.181 151.319 74.2391 150.729 74.4613 150.192C74.6834 149.656 75.0596 149.198 75.5423 148.875C76.0249 148.553 76.5924 148.381 77.1729 148.381C77.9483 148.39 78.6893 148.702 79.2377 149.251C79.7861 149.799 80.0984 150.54 80.1079 151.316Z" fill="#667085" />
                                            <path opacity="0.5" d="M86.0441 151.91C87.6853 151.91 89.0157 150.579 89.0157 148.938C89.0157 147.297 87.6853 145.967 86.0441 145.967C84.4028 145.967 83.0724 147.297 83.0724 148.938C83.0724 150.579 84.4028 151.91 86.0441 151.91Z" fill="#667085" />
                                            <path opacity="0.5" d="M97.9162 154.874C97.9162 155.455 97.744 156.022 97.4215 156.505C97.099 156.988 96.6406 157.364 96.1043 157.586C95.568 157.808 94.9779 157.866 94.4086 157.753C93.8392 157.64 93.3163 157.36 92.9058 156.95C92.4953 156.539 92.2158 156.016 92.1025 155.447C91.9893 154.878 92.0474 154.288 92.2696 153.751C92.4917 153.215 92.8679 152.757 93.3506 152.434C93.8332 152.112 94.4007 151.939 94.9812 151.939C95.7596 151.939 96.5061 152.249 97.0565 152.799C97.6069 153.35 97.9162 154.096 97.9162 154.874Z" fill="#667085" />
                                        </svg>
                                        <p className={style.chatEmptyText}>You Are Starting New Conversation</p>
                                    </div>
                                )}
                            </div>
                            <div className={style.selectedChatAreaInput}>
                                <IconField iconPosition="left" className='border w-100 rounded text-start'>
                                    <InputIcon>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                                            <path d="M14.6777 12.9299C15.6661 11.5841 16.25 9.92275 16.25 8.125C16.25 3.63769 12.6123 0 8.125 0C3.63769 0 0 3.63769 0 8.125C0 12.6123 3.63769 16.25 8.125 16.25C9.92323 16.25 11.585 15.6658 12.9309 14.6769L12.9299 14.6777C12.9667 14.7277 13.0078 14.7756 13.053 14.8208L17.8661 19.6339C18.3543 20.122 19.1457 20.122 19.6339 19.6339C20.122 19.1457 20.122 18.3543 19.6339 17.8661L14.8208 13.053C14.7756 13.0078 14.7277 12.9667 14.6777 12.9299ZM15 8.125C15 11.922 11.922 15 8.125 15C4.32804 15 1.25 11.922 1.25 8.125C1.25 4.32804 4.32804 1.25 8.125 1.25C11.922 1.25 15 4.32804 15 8.125Z" fill="#98A2B3" />
                                        </svg>
                                    </InputIcon>
                                    <InputText placeholder="Type a message..." />
                                </IconField>
                                <button className={style.sendButton}>Send</button>
                            </div>
                        </div>
                    ) : (
                        <div className='d-flex flex-column justify-content-center align-items-center w-100 h-100 gap-3'>
                            <svg xmlns="http://www.w3.org/2000/svg" width="220" height="171" viewBox="0 0 220 171" fill="none">
                                <circle cx="110" cy="80" r="80" fill="#EAECF0" />
                                <circle cx="18" cy="12" r="8" fill="#F2F4F7" />
                                <circle cx="198" cy="142" r="6" fill="#F2F4F7" />
                                <circle cx="25" cy="138" r="10" fill="#F2F4F7" />
                                <circle cx="210" cy="46" r="10" fill="#F2F4F7" />
                                <circle cx="191" cy="11" r="7" fill="#F2F4F7" />
                                <path opacity="0.7" d="M140.356 4H75.0524C72.3887 4.00774 69.8364 5.06932 67.9528 6.95284C66.0693 8.83635 65.0077 11.3887 65 14.0524V20.7589C65.0077 23.4226 66.0693 25.975 67.9528 27.8585C69.8364 29.742 72.3887 30.8036 75.0524 30.8113H140.356L150.409 36.7694V14.0231C150.391 11.3651 149.326 8.82132 147.444 6.94454C145.561 5.06776 143.014 4.00961 140.356 4Z" fill="#667085" />
                                <path d="M138.537 13.605H76.8355V15.2779H138.537V13.605Z" fill="white" />
                                <path d="M138.537 19.5339H88.7074V21.2069H138.537V19.5339Z" fill="white" />
                                <path opacity="0.15" d="M75.0156 48.6416H140.32C142.983 48.6493 145.536 49.7109 147.419 51.5944C149.303 53.478 150.364 56.0303 150.372 58.694V65.3932C150.364 68.0569 149.303 70.6092 147.419 72.4928C145.536 74.3763 142.983 75.4378 140.32 75.4456H75.0156L64.9631 81.4037V58.6573C64.9786 55.9994 66.0438 53.4553 67.9267 51.5793C69.8096 49.7033 72.3576 48.6474 75.0156 48.6416Z" fill="#667085" />
                                <path opacity="0.5" d="M138.537 58.239H76.8355V59.912H138.537V58.239Z" fill="#667085" />
                                <path opacity="0.5" d="M105.452 64.175H76.8355V65.848H105.452V64.175Z" fill="#667085" />
                                <path opacity="0.5" d="M121.558 64.175H109.92V65.848H121.558V64.175Z" fill="#667085" />
                                <path opacity="0.7" d="M140.356 93.2759H75.0524C72.3887 93.2836 69.8364 94.3452 67.9528 96.2287C66.0693 98.1123 65.0077 100.665 65 103.328V110.027C65.0058 112.692 66.0668 115.245 67.9507 117.129C69.8346 119.013 72.3881 120.074 75.0524 120.08H140.356L150.409 126.038V103.292C150.39 100.635 149.323 98.093 147.441 96.2178C145.559 94.3426 143.013 93.2855 140.356 93.2759Z" fill="#667085" />
                                <path d="M138.537 102.873H76.8355V104.546H138.537V102.873Z" fill="white" />
                                <path d="M138.537 108.809H88.7074V110.482H138.537V108.809Z" fill="white" />
                                <path opacity="0.15" d="M75.0156 137.91H100.425C103.089 137.92 105.64 138.982 107.523 140.865C109.406 142.748 110.468 145.299 110.478 147.963V154.669C110.468 157.332 109.406 159.883 107.523 161.767C105.64 163.65 103.089 164.712 100.425 164.721H75.0156L64.9631 170.672V147.963C64.9709 145.299 66.0325 142.747 67.916 140.863C69.7995 138.979 72.3519 137.918 75.0156 137.91Z" fill="#667085" />
                                <path opacity="0.5" d="M80.1079 151.316C80.1079 151.896 79.9357 152.464 79.6132 152.946C79.2907 153.429 78.8324 153.805 78.2961 154.027C77.7598 154.249 77.1696 154.308 76.6003 154.194C76.0309 154.081 75.508 153.801 75.0975 153.391C74.687 152.981 74.4075 152.458 74.2942 151.888C74.181 151.319 74.2391 150.729 74.4613 150.192C74.6834 149.656 75.0596 149.198 75.5423 148.875C76.0249 148.553 76.5924 148.381 77.1729 148.381C77.9483 148.39 78.6893 148.702 79.2377 149.251C79.7861 149.799 80.0984 150.54 80.1079 151.316Z" fill="#667085" />
                                <path opacity="0.5" d="M86.0441 151.91C87.6853 151.91 89.0157 150.579 89.0157 148.938C89.0157 147.297 87.6853 145.967 86.0441 145.967C84.4028 145.967 83.0724 147.297 83.0724 148.938C83.0724 150.579 84.4028 151.91 86.0441 151.91Z" fill="#667085" />
                                <path opacity="0.5" d="M97.9162 154.874C97.9162 155.455 97.744 156.022 97.4215 156.505C97.099 156.988 96.6406 157.364 96.1043 157.586C95.568 157.808 94.9779 157.866 94.4086 157.753C93.8392 157.64 93.3163 157.36 92.9058 156.95C92.4953 156.539 92.2158 156.016 92.1025 155.447C91.9893 154.878 92.0474 154.288 92.2696 153.751C92.4917 153.215 92.8679 152.757 93.3506 152.434C93.8332 152.112 94.4007 151.939 94.9812 151.939C95.7596 151.939 96.5061 152.249 97.0565 152.799C97.6069 153.35 97.9162 154.096 97.9162 154.874Z" fill="#667085" />
                            </svg>
                            <p className={style.chatEmptyText}>No conversation selected. <br /> Please choose a user or project to start chatting.</p>
                        </div>
                    )
                }
            </div>
        </div>
    );
};

export default Chat;