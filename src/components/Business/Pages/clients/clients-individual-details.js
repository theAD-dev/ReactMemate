





import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

function ClientsIndividualDetails() {
  const { id } = useParams(); // Extract the 'id' from the URL
  const [clientData, setClientData] = useState(null);
  console.log('clientData: ', clientData);

  useEffect(() => {
    // Fetch client details using the id
    fetchClientDetails(id);
  }, [id]);

  const fetchClientDetails = async (clientId) => {
    // Replace with your API call or data fetching logic
    const response = await fetch(`/api/clients/${clientId}`);
    const data = await response.json();
    setClientData(data);
  };

  useEffect(() => {
    if (!clientData) {
      // Display a message or redirect if no data is found
    }
  }, [clientData]);

  return (
    <div>
      <h1>Client Individual Details for ID: {id}</h1>
      <p>Client Name: {clientData?.name}</p>
      <p>Client Category: {clientData?.category}</p>
      {/* Render other client details */}
    </div>


   
  );
}

export default ClientsIndividualDetails;
