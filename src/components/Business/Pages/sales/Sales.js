import React, { useState, useEffect } from "react";
import "./salesStyle.css";
import SalesTables from "./SalesTables";
import { fetchSales } from "../../../../APIs/SalesApi";

const Sales = ({profileData}) => {
  const [salesData, setSalesData] = useState([]);
  // const [flag,setFlag] = useState(false)
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
