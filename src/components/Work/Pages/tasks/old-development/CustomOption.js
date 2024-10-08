// src/CustomOption.js
import React from 'react';

const CustomOption = ({ image, text, isSelected }) => {
  return (
    <div className="custom-option">
   <div className="custom-optionText">
   <img src={image} alt={text} className="option-image" />
   <span className="option-text">{text}</span>
    </div>
      {isSelected && <span className="checkbox-icon"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
<path d="M15.9206 4.96209C16.2819 4.59597 16.8677 4.59597 17.229 4.96209C17.5859 5.32371 17.5903 5.90727 17.2422 6.27434L9.85031 15.0122C9.8432 15.0212 9.8356 15.0298 9.82756 15.0379C9.46625 15.404 8.88046 15.404 8.51915 15.0379L4.02098 10.4799C3.65967 10.1137 3.65967 9.52015 4.02098 9.15403C4.38229 8.78791 4.96808 8.78791 5.32939 9.15403L9.14548 13.0209L15.8961 4.99013C15.9037 4.98029 15.9119 4.97093 15.9206 4.96209Z" fill="#158ECC"/>
</svg></span>}
    </div>
  );
};

export default CustomOption;
