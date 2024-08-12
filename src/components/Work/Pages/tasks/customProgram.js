import { useEffect, useState } from 'react';
import Select from 'react-select';
import { defaultTheme } from 'react-select';
import { ChevronDown, ChevronUp } from "react-bootstrap-icons";

const { colors } = defaultTheme;

const selectStyles = {
  control: (provided, state) => ({
    ...provided,
    minWidth: 240,
    margin: 8,
    padding: 3,
    height: 44,
    borderColor: state.isFocused ? 'blue' : provided.borderColor, // Change border color on focus
    boxShadow: state.isFocused ? '0 0 0 1px blue' : provided.boxShadow, // Add box shadow on focus
  }),
  menu: () => ({ boxShadow: 'inset 0 1px 0 rgba(0, 0, 0, 0.1)' }),
  option: (provided, state) => ({
    ...provided,
    backgroundColor: state.isSelected ? colors.primary : provided.backgroundColor,
    color: state.isSelected ? 'white' : provided.color,
  }),
};

const CustomProgram = ({ projects, handleChange, error }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [value, setValue] = useState(null);

  useEffect(() => {
    handleChange(value?.value);
  }, [value]);

  return (
    <Dropdown
      isOpen={isOpen}
      onClose={() => setIsOpen(false)}
      style={{ position: 'relative' }}
      target={
        <button
          className={`w-100 d-flex justify-content-between align-items-center bg-white text-left border ${error ? "border-danger" : ''}`}
          style={{ padding: '4px 12px', height: '44px', fontWeight: 400 }}
          onClick={() => setIsOpen((prev) => !prev)}
        >
          {value ? <span style={{ color: '#101828' }}>${value.label}</span> : <span style={{ color: '#98a2b3' }}>Select project</span>}
          { isOpen ? <ChevronUp color="#98A2B3" size={16} /> : <ChevronDown color="#98A2B3" size={16} />}
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
          setValue(newValue);
          setIsOpen(false);
        }}
        className='border select-position-absolute select-control'
        styles={selectStyles}
        options={projects}
        placeholder="Search..."
        tabSelectsValue={false}
        value={value}
      />
    </Dropdown>
  );
};

export default CustomProgram;

// styled components

const Menu = (props) => {
  const shadow = 'hsla(218, 50%, 10%, 0.1)';
  return (
    <div
      style={{
        backgroundColor: 'white',
        borderRadius: 4,
        boxShadow: `0 0 0 1px ${shadow}, 0 4px 11px ${shadow}`,
        marginTop: 8,
        position: 'absolute',
        zIndex: 2,
      }}
      {...props}
    />
  );
};

const Blanket = (props) => (
  <div
  style={{
      bottom: 0,
      left: 0,
      top: 0,
      right: 0,
      position: 'fixed',
      zIndex: 1,
    }}
    {...props}
  />
);

const Dropdown = ({ children, isOpen, target, onClose }) => (
  <div style={{ position: 'relative' }}>
    {target}
    {isOpen ? <Menu>{children}</Menu> : null}
    {isOpen ? <Blanket onClick={onClose} /> : null}
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
  <div style={{ color: colors.neutral20, height: 24, width: 32 }}>
    <Svg>
      <path
        d="M16.436 15.085l3.94 4.01a1 1 0 0 1-1.425 1.402l-3.938-4.006a7.5 7.5 0 1 1 1.423-1.406zM10.5 16a5.5 5.5 0 1 0 0-11 5.5 5.5 0 0 0 0 11z"
        fill="currentColor"
        fillRule="evenodd"
      />
    </Svg>
  </div>
);