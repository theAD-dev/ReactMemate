import React, { useEffect, useState } from "react";
import {
  ChevronExpand,
} from "react-bootstrap-icons";
import { Menu, MenuItem, MenuButton } from '@szhsin/react-menu';
import '@szhsin/react-menu/dist/index.css';
import style from '../header.module.scss';

const SelectLocation = ({ currentLocation, locations, profileUserName }) => {
  const [selectedLocation, setSelectedLocation] = useState({ id: null, name: null });
  const changeLocation = (id, name) => {

    setSelectedLocation({ id, name });
  };
  useEffect(() => {
    const data = locations.find((location) => location.id === currentLocation);
    setSelectedLocation(data);
  }, [locations, currentLocation]);

  return (
    <Menu
      menuButton={
        <MenuButton 
        className={style.locationDropDown}
        style={{
          width: '150px',
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '2px 9px',
          borderRadius: '4px',
          cursor: 'pointer',
          background: '#FCFCFD',
          border: '1px solid #F2F4F7',
          textAlign: 'left'
        }}>
          <div style={{ lineHeight: '18px' }}>
            <span style={{ color: '#1D2939', fontSize: '16px', fontWeight: 400, maxWidth: '120px' }} className="ellipsis-width">{profileUserName || "Company"}</span>
            <span style={{ color: '#667085', fontSize: '12px', fontWeight: 400, maxWidth: '120px' }} className="ellipsis-width">{selectedLocation?.name || "Location"}</span>
          </div>
          <span><ChevronExpand color="#98A2B3" size={15} /></span>
        </MenuButton>}
      overflow={"auto"}
      position={"anchor"}
    >
      {
        locations.map((location) => {
          return <MenuItem onClick={() => changeLocation(location.id, location.name)} style={{ color: '#667085', textAlign: 'left', fontSize: '12px', fontWeight: 400, padding: '6px', background: `${currentLocation === location.id ? '#ebf8ff' : ''}` }} key={location.id}>{location?.name}</MenuItem>;
        })
      }

    </Menu>
  );
};

export default SelectLocation;
