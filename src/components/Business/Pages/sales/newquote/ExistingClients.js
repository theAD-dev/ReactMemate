import React, { useState, useEffect, useRef } from 'react';
import { People, InfoSquare, ChevronLeft, Building, CardList, Search } from "react-bootstrap-icons";
import { NavLink, Link } from "react-router-dom";
import { newQuoteClientList, SearchClientList } from "../../../../../APIs/NewQuoteApis";

const ExistingClients = () => {
  const [itemList, setItemList] = useState([]);
  const [filteredList, setFilteredList] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const [isFetching, setIsFetching] = useState(false);
  const [page, setPage] = useState(0);
  const elements = useRef(null);

  const onIntersection = (entries) => {
    const firstEntry = entries[0];
    if (firstEntry.isIntersecting && hasMore && !isFetching) {
      fetchMoreItems();
    }
  };

  useEffect(() => {
    const observer = new IntersectionObserver(onIntersection);
    if (elements.current) {
   
      observer.observe(elements.current);
    }
    return () => {
      if (elements.current) {
        observer.unobserve(elements.current);
      }
    };
  }, [filteredList, hasMore, isFetching]);

  const fetchMoreItems = async () => {
    setIsFetching(true);
    try {
      const limit = 2;
      const offset = page * limit;
      const response = await newQuoteClientList(limit, offset);
      const data = response.results;
      setItemList((prevItems) => [...prevItems, ...data]);
      setFilteredList((prevItems) => [...prevItems, ...data]);
      if (data.length === 0) {
        setHasMore(false);
      } else {
        setPage((prevPage) => prevPage + 1);
      }
    } catch (error) {
      console.error('Error fetching more items:', error);
    } finally {
      setIsFetching(false);
    }
  };

  // const filterBySearch = async (event) => {
  //   const query = event.target.value.toLowerCase();
  //   console.log('query: ', query);
  //   try {
  //     const response = await SearchClientList(query);
  //     const filteredData = response.results;
  //     setFilteredList(filteredData);
  //   } catch (error) {
  //     console.error('Error searching clients:', error);
  //   }
  // };

  const filterBySearch = (event) => {
    const query = event.target.value.toLowerCase();
    SearchClientList(query);
    const updatedList = itemList.filter((item) =>
      item.name.toLowerCase().includes(query)
    );
    setFilteredList(updatedList);
  };

  return (
    <div className="newQuotePage existingClients overflowScroll">
      <div className="dFlex">
        <div className="newQuoteBack">
          <button><NavLink to="/sales/newquote/selectyourclient/step1"><ChevronLeft color="#000000" size={20} /> Go Back</NavLink></button>
        </div>
        <div className="newQuoteContent">
          <div className='navStepClient'>
            <ul>
              <li className='activeClientTab'><span><People color="#D0D5DD" size={15} /></span> <p>Choose Client</p></li>
              <li><span><InfoSquare color="#D0D5DD" size={15} /></span> <p>Client Information</p> </li>
              <li><span><CardList color="#D0D5DD" size={15} /></span> <p>Scope of Work</p> </li>
            </ul>
          </div>

          <div className="mt-4">
            <div className="search-header">
              <div className='searchGroupFilter'>
                <Search color="#98A2B3" size={20} /> <input id="search-box" placeholder='Search' onChange={filterBySearch} />
              </div>
            </div>
            <div id="item-list" className='mt-4 filterListSearch'>
              <ul>
                {/* {filteredList.map((item, index) => ( */}
                    {filteredList.length > 0 && filteredList.map((item, index) => (
                  <li key={index}>
                    <Link to={`/sales/newquote/client-information/step3/scope-of-work/${item.id}`}>
                      <span className='icon1'>
                        {item.photo ? (
                          <img
                            src={item.photo}
                            alt={item.name}
                            style={{ marginRight: "5px" }}
                          />
                        ) : (
                          <span className='icon' style={{ marginRight: "5px" }}>
                            <Building size={13.71} color="#667085" />
                          </span>
                        )}
                      </span>
                      <span className='name'>{item.name}</span>
                    </Link>
                  </li>
                ))}
                 <div className='rowBorderHide targetObserver'>
                 <div className="targetObserver" ref={elements}> {isFetching && 'Loading...'}</div>
                 </div>
                 
              
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ExistingClients;
