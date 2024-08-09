import React from 'react';
import Confetti from 'react-dom-confetti';

const ConfettiComponent = ({ active, config }) => {
  return <Confetti active={active} config={config} />;
};

export default ConfettiComponent;




