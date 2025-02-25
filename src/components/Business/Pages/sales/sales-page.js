import React, { useState, useEffect } from "react";

import "./sales-style.css";
import { Spinner } from "react-bootstrap";
import SalesTables from "./sales-tables";
import { fetchSales } from "../../../../APIs/SalesApi";


const Sales = () => {
  const [isLoading, setIsLoading] = useState(true);
  const profileData = JSON.parse(window.localStorage.getItem('profileData') || '{}');
  const [salesData, setSalesData] = useState([]);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const data = await fetchSales();
      const parsedData = JSON.parse(data);
      setSalesData(parsedData);
    } catch (error) {
      console.error('Error fetching sales data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <>
      {
        isLoading && <div style={{ position: 'fixed', top: '50%', left: '50%', background: 'white', width: '60px', height: '60px', borderRadius: '4px', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 10 }} className="shadow-lg">
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
        </div>
      }
      
      <SalesTables profileData={profileData} salesData={salesData} fetchData={fetchData} isLoading={isLoading} />
    </>
  );
};

export default Sales;
