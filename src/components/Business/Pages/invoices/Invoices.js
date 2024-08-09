import React, { useEffect, useRef, useState } from 'react';
import { fetchInvoices } from "../../../../APIs/InvoicesApi";
import InvoicesTables from "./InvoicesTables";
import "./InvoicesTables.css"
const Clients = () => {
  const [InvoicesData, setInvoicesData] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const [isFetching, setIsFetching] = useState(false); // Track whether data is being fetched
  const [page, setPage] = useState(0);
  const elements = useRef(null);

  function onIntersection(entries) {
    const firstEntry = entries[0];
    if (firstEntry.isIntersecting && hasMore && !isFetching) { // Check if not already fetching
      fetchMoreItems();
      console.log('Last item seen');
    }
  }

  useEffect(() => {
    const observer = new IntersectionObserver(onIntersection);
    if (elements.current) {
      observer.observe(elements.current);
    }
    return () => {
      observer.disconnect();
    };
  }, [elements]);

  async function fetchMoreItems() {
    setIsFetching(true); // Set isFetching to true when starting to fetch data
    try {
      const limit = 50 ; // Specify the limit
      const offset = page * limit; // Calculate the offset based on the current page
      const response = await fetchInvoices(limit, offset); // Pass limit and offset to fetchInvoices
      const data = await response.results;
      if (data.length === 0) {
        setHasMore(false);
      } else {
        setInvoicesData(prevInvoices => [...prevInvoices, ...data]);
        setPage(prevPage => prevPage + 1);
      }
    } catch (error) {
      console.error('Error fetching more items:', error);
    } finally {
      setIsFetching(false); // Set isFetching to false after fetching is complete
    }
  }
  
  return (
    <div>
   
   <InvoicesTables InvoicesData={InvoicesData} isFetching={isFetching} ref={elements}  />
    </div>
  );
};

export default Clients;

