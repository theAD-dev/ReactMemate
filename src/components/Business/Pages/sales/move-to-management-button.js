import React, { useState } from 'react';
import { fetchOutCome } from "../../../../APIs/SalesApi"

const MoveToManagementButton = (props) => {
  const [totalWonQuote, setTotalWonQuote] = useState(sessionStorage.getItem('totalWonQuote') || 0);

  const handleMoveToManagementWon = async () => {
    try {
      if (props.saleUniqueId) {
        const success = await fetchOutCome(props.saleUniqueId, 'won');
        if (success) {
          const elementToRemove = document.querySelector(`[data-saleuniqueid="${props.saleUniqueId}"]`);
          props.fetchData1();
          if (elementToRemove) {
            elementToRemove.classList.add('slide-up');
            setTimeout(() => {
              props.onRemoveRow(`[data-saleuniqueid="${props.saleUniqueId}"]`);
              elementToRemove.remove();
              elementToRemove.classList.remove('slide-up');
            }, 1000);
          }

          // Update the totalWonQuote in session storage
          const newTotalWonQuote = parseInt(totalWonQuote, 10) + 1;
          setTotalWonQuote(newTotalWonQuote);
          sessionStorage.setItem('totalWonQuote', newTotalWonQuote);
        } else {
        }
      }
    } catch (error) {
      console.log('Error:', error);
    }
    props.handleClose();
  };

  return (
    <button onClick={handleMoveToManagementWon}>Move to Management</button>
  );
};

export default MoveToManagementButton
