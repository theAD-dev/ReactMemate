import React, { useState } from "react";
import Select, { components } from "react-select";
import {
  BuildingCheck,
  Person,
  ChevronExpand,
  GeoAlt,
} from "react-bootstrap-icons";

const SelectOption = () => {
  const data = [
    {
      value: 1,
      text: "OfficeCityCenter",
      icon: <GeoAlt size={20} color="#667085" className="icon" />,
    },
    {
      value: 2,
      text: "Floyd Miles",
      icon: <BuildingCheck size={20} color="#667085" className="icon" />,
    },
    {
      value: 3,
      text: "Ronald Richards",
      icon: <Person size={20} color="#667085" className="icon" />,
    },
    {
      value: 4,
      text: "Johnson & Johnson",
      icon: <BuildingCheck size={20} color="#667085" className="icon" />,
    },
    {
      value: 5,
      text: "Jacob Jones",
      icon: <Person size={20} color="#667085" className="icon" />,
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
      <Select
        placeholder="Select Option"
        value={selectedOption}
        options={data}
        onChange={handleChange}
        components={{ DropdownIndicator }}
        getOptionLabel={(e) => (
          <div style={{ display: "flex", alignItems: "center" }}>
            {e.icon}
            <span
              style={{
                marginLeft: 5,
                maxWidth: "150px",
                fontSize: "16px",
                color: "#101828",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {e.text}
            </span>
          </div>
        )}
      />
    </>
  );
};

export default SelectOption;
