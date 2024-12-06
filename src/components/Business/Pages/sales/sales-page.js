import React, { useState, useEffect } from "react";
import "./sales-style.css";
import SalesTables from "./sales-tables";
import { fetchSales } from "../../../../APIs/SalesApi";

const Sales = () => {
  const profileData = JSON.parse(window.localStorage.getItem('profileData') || '{}');
  const [salesData, setSalesData] = useState([]);
  useEffect(() => {
    fetchData(); 
  }, []);
  const fetchData = async () => {
    try {
      const data = await fetchSales();
      const parsedData = JSON.parse(data);
      setSalesData(parsedData);
    } catch (error) {
      console.error('Error fetching sales data:', error);
    }
  };

  return (
    <>
      <SalesTables profileData={profileData} salesData={salesData} fetchData={fetchData}  />
    </>
  );
};

export default Sales;
