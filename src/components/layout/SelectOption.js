import React, { useEffect, useState } from "react";
import { Menu, MenuItem, MenuButton, SubMenu } from '@szhsin/react-menu';
import '@szhsin/react-menu/dist/index.css';
import {
  ChevronExpand,
} from "react-bootstrap-icons";

const SelectOption = ({ currentLocation, locations, profileUserName }) => {
  const [selectedLocation, setSelectedLocation] = useState({ id: null, name: null });
  const changeLocation = (id, name) => {

    setSelectedLocation({ id, name });
  }
  useEffect(() => {
    const data = locations.find((location) => location.id === currentLocation);
    setSelectedLocation(data);
  }, [locations, currentLocation]);

  return (
    <Menu
      menuButton={
        <MenuButton style={{
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
            <span style={{ color: '#1D2939', fontSize: '16px', fontWeight: 400, display: 'block' }}>{profileUserName || "Company"}</span>
            <span style={{ color: '#667085', fontSize: '12px', fontWeight: 400 }}>{selectedLocation?.name || "Location"}</span>
          </div>
          <span><ChevronExpand color="#98A2B3" size={15} /></span>
        </MenuButton>}
      overflow={"auto"}
      position={"anchor"}
    >
      {
        locations.map((location) => {
          return <MenuItem onClick={() => changeLocation(location.id, location.name)} style={{ color: '#667085', textAlign: 'left', fontSize: '12px', fontWeight: 400, padding: '6px', background: `${currentLocation === location.id ? '#ebf8ff' : ''}` }} key={location.id}>{location?.name}</MenuItem>
        })
      }

    </Menu>
  )
}

// const SelectOption = ({profileUserName}) => {
//   const data = [
//     {
//       value: 1,
//       text: "OfficeCityCenter",
//     },
//     {
//       value: 2,
//       text: "Floyd Miles",

//     },
//     {
//       value: 3,
//       text: "Ronald Richards",
//     },
//     {
//       value: 4,
//       text: "Johnson & Johnson",
//     },
//     {
//       value: 5,
//       text: "Jacob Jones",
//     },
//   ];

//   const defaultOption = data[0];

//   const [selectedOption, setSelectedOption] = useState(defaultOption);

//   const handleChange = (e) => {
//     setSelectedOption(e);
//   };

//   const DropdownIndicator = (props) => {
//     return (
//       <components.DropdownIndicator {...props}>
//         <ChevronExpand size={20} color="#98A2B3" className="icon" />
//       </components.DropdownIndicator>
//     );
//   };

//   return (
//     <>
//    <div className="HeaderLocationWrapper">
//    <h6>{profileUserName}</h6>
//       <Select
//         placeholder="Select Option"
//         value={selectedOption}
//         options={data}
//         onChange={handleChange}
//         components={{ DropdownIndicator }}
//         getOptionLabel={(e) => (
//           <div style={{ display: "flex", alignItems: "center" }}>
//             {/* {e.icon} */}
//             <span
//               style={{
//                 marginLeft: 0,
//                 maxWidth: "150px",
//                 fontSize: "12px",
//                 color: "#667085",
//                 overflow: "hidden",
//                 textOverflow: "ellipsis",
//                 whiteSpace: "nowrap",
//                 background: "transparent",
//                 padding: 0,
//                 lineHeight: "14px"

//               }}
//             >
//               {e.text}
//             </span>
//           </div>
//         )}
//       />
//    </div>
//     </>
//   );
// };

export default SelectOption;
