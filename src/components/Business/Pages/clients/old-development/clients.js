import React, { useEffect, useRef, useState } from 'react';
import { fetchClients } from "../../../../../APIs/ClientsApi";
import ClientsTables from "./clients-tables";
import "./clients-tables.css"
const Clients = () => {
  const [ClientsData, setClientsData] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const [isFetching, setIsFetching] = useState(false); // Track whether data is being fetched
  const [page, setPage] = useState(0);
  const elements = useRef(null);

  function onIntersection(entries) {
    const firstEntry = entries[0];
    if (firstEntry.isIntersecting && hasMore && !isFetching) { // Check if not already fetching
      fetchMoreItems();
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
  }, [ClientsData, hasMore, isFetching]);

  async function fetchMoreItems() {
    setIsFetching(true); // Set isFetching to true when starting to fetch data
    try {
      const limit = 180 // Specify the limit
      const offset = page * limit; // Calculate the offset based on the current page
      const response = await fetchClients(limit, offset); // Pass limit and offset to fetchClients
      const data = await response.results;
      if (data.length === 0) {
        setHasMore(false);
      } else {
        setClientsData(prevClients => [...prevClients, ...data]);
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
      <ClientsTables ClientsData={ClientsData} isFetching={isFetching} ref={elements} />
    </div>
  );
};

export default Clients;

