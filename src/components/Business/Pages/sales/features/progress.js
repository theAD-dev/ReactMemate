import React, { useState } from "react";
import { ChevronDown } from "react-bootstrap-icons";
import CircleProgressBar from "./circle-progress-bar";
import { fetchSaleslead } from "../../../../../APIs/SalesApi";


const Option = ({ percentage, label, gradient, onSelect, isActive }) => {
  return (
    <li
      className={`option ${isActive ? "active" : ""}`}
      data-percentage={percentage}
      onClick={onSelect}
    >
      <input
        className="radio-custom"
        name="radio-group"
        type="radio"
        checked={isActive} // Set checked based on isActive prop
        onChange={() => { }}
      />
      <em className="radio-custom-label"></em>
      <div className="progressWrapper">
        <div className="labelInfo">
          <strong>{label}</strong>
          <div className="progress-light-grey">
            <div
              className="progress-container progress-color progress-center"
              aria-valuenow={percentage}
              aria-valuemin="0"
              aria-valuemax="100"
              style={{ "--value": percentage, background: gradient }}
            >
              <span>{percentage}%</span>
            </div>
          </div>
        </div>
        <label>{percentage}%</label>
      </div>
    </li>
  );
};

const Progress = ({ progressName1, progressPercentage1, salesUniqId1, refreshData }) => {
  const [selectedOption, setSelectedOption] = useState({
    text: progressName1,
    percentage: progressPercentage1,
    background: "linear-gradient(90deg, #9E77ED 10%, transparent 10%)",
  });

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [updatedLead, setUpdatedLead] = useState(selectedOption.percentage);

  const toggleOptions = () => {
    // Close any open dropdowns
    const openDropdowns = document.querySelectorAll(".options.active");
    openDropdowns.forEach((dropdown) => dropdown.classList.remove("active"));
    // Open or close the current dropdown
    setDropdownOpen((prevState) => !prevState);
  };

  const selectOption = async (option) => {
    try {
      const saleUniqueId = salesUniqId1;
      const newUpdatedLead = option.percentage;

      await fetchSaleslead(saleUniqueId, newUpdatedLead);
      setSelectedOption({
        text: option.label,
        percentage: option.percentage,
        background: option.gradient,
      });
      setUpdatedLead(newUpdatedLead);
      refreshData();
      setDropdownOpen(false);
    } catch (error) {
      console.error('Error updating sales lead:', error);
    }
  };


  const isActive = (percentage) => {
    return percentage === updatedLead;
  };

  const options = [
    {
      percentage: 10,
      label: "Lead",
      gradient: "linear-gradient(90deg, #1AB2FF 10%, transparent 10%)",
    },
    {
      percentage: 20,
      label: "Prospect",
      gradient: "linear-gradient(90deg, #1AB2FF 20%, transparent 20%)",
    },
    {
      percentage: 40,
      label: "Proposal sent",
      gradient: "linear-gradient(90deg, #1AB2FF 40%, transparent 40%)",
    },
    {
      percentage: 60,
      label: "Negotiation",
      gradient: "linear-gradient(90deg, #1AB2FF 60%, transparent 60%)",
    },
    {
      percentage: 80,
      label: "Awaiting approval",
      gradient: "linear-gradient(90deg, #1AB2FF 80%, transparent 80%)",
    },
  ];

  return (
    <div className="select-menu">
      <div className="select-btn" onClick={toggleOptions}>
        <CircleProgressBar
          percentage={selectedOption.percentage}
          selectlabel={selectedOption.text}
        />
        <ChevronDown color="#98A2B3" size={16} />
      </div>
      <ul className={`options ${dropdownOpen ? "active" : ""}`}>
        {options.map((option) => (
          <Option
            key={option.percentage}
            percentage={option.percentage}
            label={option.label}
            gradient={option.gradient}
            onSelect={() => selectOption(option)}
            isActive={isActive(option.percentage)}// Pass percentage to isActive
          />
        ))}
      </ul>
    </div>
  );
};

export default Progress;
