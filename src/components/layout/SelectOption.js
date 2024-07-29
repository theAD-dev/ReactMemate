import React, { useState } from "react";
import Select, { components } from "react-select";
import {
  ChevronExpand,
} from "react-bootstrap-icons";

const SelectOption = ({profileUserName}) => {
  const data = [
    {
      value: 1,
      text: "OfficeCityCenter",
    },
    {
      value: 2,
      text: "Floyd Miles",

    },
    {
      value: 3,
      text: "Ronald Richards",
    },
    {
      value: 4,
      text: "Johnson & Johnson",
    },
    {
      value: 5,
      text: "Jacob Jones",
    },
  ];

  const defaultOption = data[0];

  const [selectedOption, setSelectedOption] = useState(defaultOption);

  const handleChange = (e) => {
    setSelectedOption(e);
  };

  const DropdownIndicator = (props) => {
    return (
      <components.DropdownIndicator {...props}>
        <ChevronExpand size={20} color="#98A2B3" className="icon" />
      </components.DropdownIndicator>
    );
  };

  return (
    <>
   <div className="HeaderLocationWrapper">
   <h6>{profileUserName}</h6>
      <Select
        placeholder="Select Option"
        value={selectedOption}
        options={data}
        onChange={handleChange}
        components={{ DropdownIndicator }}
        getOptionLabel={(e) => (
          <div style={{ display: "flex", alignItems: "center" }}>
            {/* {e.icon} */}
            <span
              style={{
                marginLeft: 0,
                maxWidth: "150px",
                fontSize: "12px",
                color: "#667085",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
                background: "transparent",
                padding: 0,
                lineHeight: "14px"

              }}
            >
              {e.text}
            </span>
          </div>
        )}
      />
   </div>
    </>
  );
};

export default SelectOption;
