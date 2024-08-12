import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import Select from "react-select";
import { defaultTheme } from "react-select";
import { ChevronDown, ChevronUp } from "react-bootstrap-icons";
import classNames from "classnames";
import styles from "./MemateSelect.module.scss";

const { colors } = defaultTheme;
const setCSSVariables = () => {
  document.documentElement.style.setProperty("--neutral20", colors.neutral20);
};

setCSSVariables();

const selectStyles = {
  control: (provided, state) => ({
    ...provided,
    minWidth: 240,
    margin: 8,
    padding: 3,
    height: 44,
    borderColor: state.isFocused ? "blue" : provided.borderColor,
    boxShadow: state.isFocused ? "0 0 0 1px blue" : provided.boxShadow,
  }),
  menu: () => ({ boxShadow: "inset 0 1px 0 rgba(0, 0, 0, 0.1)" }),
  option: (provided, state) => ({
    ...provided,
    backgroundColor: state.isSelected
      ? colors.primary
      : provided.backgroundColor,
    color: state.isSelected ? "white" : provided.color,
  }),
};

const MemateSelect = ({ options, onChange, hasError }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedValue, setSelectedValue] = useState(null);

  useEffect(() => {
    onChange(selectedValue?.value);
  }, [selectedValue]);

  return (
    <Dropdown
      isOpen={isOpen}
      onClose={() => setIsOpen(false)}
      target={
        <button
          className={classNames(
            "w-100 d-flex justify-content-between align-items-center",
            styles.button,
            { [styles.error]: hasError }
          )}
          onClick={() => setIsOpen((prev) => !prev)}
        >
          {selectedValue ? (
            <span className={styles.selectedValue}>{selectedValue.label}</span>
          ) : (
            <span className={styles.placeholder}>Select option</span>
          )}
          {isOpen ? (
            <ChevronUp color="#98A2B3" size={16} />
          ) : (
            <ChevronDown color="#98A2B3" size={16} />
          )}
        </button>
      }
    >
      <Select
        autoFocus
        backspaceRemovesValue={false}
        components={{ DropdownIndicator, IndicatorSeparator: null }}
        controlShouldRenderValue={false}
        hideSelectedOptions={false}
        isClearable={false}
        menuIsOpen
        onChange={(newValue) => {
          setSelectedValue(newValue);
          setIsOpen(false);
        }}
        className={classNames("border", styles.select)}
        styles={selectStyles}
        options={options}
        placeholder="Search..."
        tabSelectsValue={false}
        value={selectedValue}
      />
    </Dropdown>
  );
};

MemateSelect.propTypes = {
  options: PropTypes.array.isRequired,
  onChange: PropTypes.func.isRequired,
  hasError: PropTypes.bool,
};

export default MemateSelect;

const Menu = (props) => <div className={styles.menu} {...props} />;

const Blanket = (props) => <div className={styles.blanket} {...props} />;

const Dropdown = ({ children, isOpen, target, onClose }) => (
  <div className={styles.dropdown}>
    {target}
    {isOpen && <Menu>{children}</Menu>}
    {isOpen && <Blanket onClick={onClose} />}
  </div>
);

const Svg = (props) => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    focusable="false"
    role="presentation"
    {...props}
  />
);

const DropdownIndicator = () => (
  <div className={styles.dropdownIndicator}>
    <Svg>
      <path
        d="M16.436 15.085l3.94 4.01a1 1 0 0 1-1.425 1.402l-3.938-4.006a7.5 7.5 0 1 1 1.423-1.406zM10.5 16a5.5 5.5 0 1 0 0-11 5.5 5.5 0 0 0 0 11z"
        fill="currentColor"
        fillRule="evenodd"
      />
    </Svg>
  </div>
);
