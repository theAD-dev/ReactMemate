import React, { useEffect, useState } from 'react'
import { Menu, MenuItem, MenuButton, SubMenu } from '@szhsin/react-menu';
import '@szhsin/react-menu/dist/index.css';
import { ChevronDown } from 'react-bootstrap-icons';
import { useMutation } from '@tanstack/react-query';
import { updateProjectStatusById } from '../../../../../APIs/management-api';

const colorMapping = {
    "#1AB2FF": { bg: "#BAE8FF", border: "#1AB2FF", color: "#0A4766", text: "Blue" },
    "#4E5BA6": { bg: "#EAECF5", border: "#4E5BA6", color: "#293056", text: "Deep Blue" },
    "#2970FF": { bg: "#D1E0FF", border: "#2970FF", color: "#0040C1", text: "Dark Blue" },
    "#FFB258": { bg: "#FFE8CD", border: "#FFB258", color: "#6D471A", text: "Orange" },
    "#15B79E": { bg: "#CCFBEF", border: "#15B79E", color: "#125D56", text: "Green" },
    "#66C61C": { bg: "#E3FBCC", border: "#66C61C", color: "#326212", text: "Light Green" },
    "#7A5AF8": { bg: "#EBE9FE", border: "#7A5AF8", color: "#4A1FB8", text: "Light Purple" },
    "#D444F1": { bg: "#FBE8FF", border: "#D444F1", color: "#821890", text: "Magenta" },
    "#F63D68": { bg: "#FFE4E8", border: "#F63D68", color: "#A11043", text: "Pink" },
    "#FF007F": { bg: "#FFCCE5", border: "#FF007F", color: "#6F0A3C", text: "Soft Pink" },
    "#FFD700": { bg: "#FFF8D1", border: "#FFD700", color: "#997100", text: "Yellow" },
    "#6C6C1C": { bg: "#E1E1B8", border: "#6C6C1C", color: "#444403", text: "Dark Yellow" }
}

const SelectStatus = ({ projectId, statusOptions, custom_status }) => {
    const [selectedOption, setSelectedOption] = useState(null);
    const updateMutation = useMutation({
        mutationFn: (data) => updateProjectStatusById(projectId, data),
        onSuccess: async () => {
        },
        onError: (error) => {
            setSelectedOption(custom_status);
            console.error('Error creating task:', error);
        }
    });
    const handleSubMenuClick = (choosedStatus) => {
        if (choosedStatus?.id) {
            updateMutation.mutate({ custom_status: choosedStatus?.id })
            setSelectedOption(choosedStatus);
        }
    };

    useEffect(() => {
        setSelectedOption(custom_status);
    }, [custom_status]);

    return (
        <Menu
            menuButton={
                <MenuButton style={{
                    width: '204px',
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'flex-end',
                    padding: '8px 0px',
                    cursor: 'pointer',
                    background: 'transparent',
                    border: 'none',
                    color: '#98A2B3',
                    gap: '10px'
                }}>
                    {
                        selectedOption && selectedOption.title ? (
                            <div className="d-flex justify-content-center" style={{ width: '204px', height: '30px', borderRadius: '4px', overflow: 'hidden' }}>
                                <>{
                                    updateMutation.isPending ? (<div class="dot-flashing"></div>) : (
                                        <>
                                            <div className="h-100" style={{ width: '4px', background: `${colorMapping[selectedOption?.color].border}` }}></div>
                                            <div className="h-100 statusFlex d-flex align-items-center" style={{ width: '100%', background: `${colorMapping[selectedOption?.color].bg}` }}>
                                                <span style={{ color: `${colorMapping[selectedOption?.color].color}`, fontSize: '14px', paddingLeft: '12px', fontWeight: '400' }}>{selectedOption?.title}</span>
                                                <span className='inArrow'><ChevronDown color="#98A2B3" size={15} /></span>
                                            </div>

                                        </>
                                    )
                                }
                                </>
                            </div>
                        ) : (
                            <div className="d-flex justify-content-center" style={{ width: '204px', height: '30px', borderRadius: '4px', overflow: 'hidden' }}>
                                <>
                                    {
                                        <>
                                            <div className="h-100" style={{ width: '4px', background: `#1D2939` }}></div>
                                            <div className="h-100 statusFlex d-flex align-items-center" style={{ width: '100%', background: `#F2F4F7` }}>
                                                <span style={{ color: `#1D2939`, fontSize: '14px', paddingLeft: '12px', fontWeight: '400' }}>No Status</span>
                                                <span className='inArrow'><ChevronDown color="#98A2B3" size={15} /></span>
                                            </div>
                                        </>
                                    }
                                </>
                            </div>
                        )
                    }
                    <span className='outArrow'><ChevronDown color="#98A2B3" size={15} /></span>
                </MenuButton>}
            overflow={"auto"}
            position={"anchor"}
        >
            {statusOptions?.map((status, i) => (
                <MenuItem style={{ textAlign: 'left' }} onClick={() => handleSubMenuClick(status)} key={status.id}>
                    <div className="d-flex" style={{ width: '163px', height: '30px', borderRadius: '4px', overflow: 'hidden' }}>
                        <div className="h-100" style={{ width: '4px', background: `${colorMapping[status?.color].border}` }}></div>
                        <div className="h-100 d-flex align-items-center" style={{ width: '100%', background: `${colorMapping[status?.color].bg}` }}>
                            <span style={{ color: `${colorMapping[status?.color].color}`, fontSize: '14px', paddingLeft: '12px', fontWeight: '400' }}>{status?.title}</span>
                        </div>
                    </div>
                </MenuItem>
            ))}
        </Menu>
    )
}

export default SelectStatus