import React from 'react';

const CircleProgressBar = ({percentage,selectlabel}) => {
    return (
      <>
          <div className="progress" data-percentage= {percentage}>
            <span className="progress-left">
              <span className="progress-bar"></span>
            </span>
            <span className="progress-right">
              <span className="progress-bar"></span>
            </span>
            <div className="progress-value">
              <div>
             
                {percentage === null
              ? "0%"
              : "" + percentage + "%"} 
              </div>
            </div>
          </div>
          <span>{selectlabel}</span>
        
      </>
    );
  };
  
  export default CircleProgressBar
  