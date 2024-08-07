import React, { useState, useEffect, useRef, useCallback } from 'react';
import { People, InfoSquare, ChevronLeft, Building, CardList, Search } from "react-bootstrap-icons";
import { NavLink, Link } from "react-router-dom";
import { newQuoteClientList } from "../../../../../APIs/NewQuoteApis";
import nodata from "../../../../../assets/images/img/nodata.png";
import nodatabg from "../../../../../assets/images/img/nodataBg.png";
import { Placeholder } from 'react-bootstrap';
import { useDebounce } from 'use-debounce';

const ExistingClients = () => {
  const [text, setText] = useState('');
  const [value] = useDebounce(text, 500);

  const [itemList, setItemList] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const [isFetching, setIsFetching] = useState(false);
  const [page, setPage] = useState(0);
  const elements = useRef(null);

  // Fetch items with an optional reset parameter
  const fetchItems = useCallback(async (reset = false) => {
    setIsFetching(true);
    try {
      const limit = 25;
      const offset = reset ? 0 : page * limit;
      const response = await newQuoteClientList(limit, offset, value.toLowerCase());
      const data = response.results;

      if (reset) {
        setItemList(data);
        setPage(1);
      } else {
        setItemList((prevItems) => [...prevItems, ...data]);
        setPage((prevPage) => prevPage + 1);
      }

      if (data.length < limit) {
        setHasMore(false); // No more items to load
      }
    } catch (error) {
      console.error('Error fetching items:', error);
    } finally {
      setIsFetching(false);
    }
  }, [page, value]);

  // Intersection Observer callback
  const onIntersection = (entries) => {
    const firstEntry = entries[0];
    if (firstEntry.isIntersecting && hasMore && !isFetching) {
      fetchItems();
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
  }, [onIntersection]);

  // Effect to handle search
  useEffect(() => {
    fetchItems(true);
  }, [value]);

  return (
    <div className="newQuotePage existingClients overflowScroll">
      <div style={{ height: 'calc(100vh - 249px)' }}>
        <div className="newQuoteBack">
          <NavLink to="/sales/newquote/selectyourclient">
            <button>
              <ChevronLeft color="#000000" size={20} /> &nbsp;&nbsp;Go Back
            </button>
          </NavLink>
        </div>
        <div className="newQuoteContent" style={{ height: '100%' }}>
          <div className='navStepClient'>
            <ul>
              <li className='activeClientTab'><span><People color="#D0D5DD" size={15} /></span> <p>Choose Client</p></li>
              <li className='deactiveColorBox'><span><InfoSquare color="#A3E0FF" size={15} /></span> <p>Client Information</p> </li>
              <li className='deactiveColorBox'><span><CardList color="#A3E0FF" size={15} /></span> <p>Scope of Work</p> </li>
            </ul>
          </div>

          <div className="mt-4 h-100">
            <div className="search-header">
              <div className='searchGroupFilter d-flex align-items-center' style={{ gap: '10px' }}>
                <Search color="#98A2B3" size={20} />
                <input
                  id="search-box"
                  placeholder='Search'
                  value={text}
                  className='pl-2'
                  onChange={(e) => setText(e.target.value)}
                />
              </div>
            </div>

            <div className='mt-4 h-100'>
              <ul className='client'>
                {itemList && itemList.map((item) => (
                  <li key={item.id}>
                    <Link to={item.is_business ? `/sales/newquote/selectyourclient/client-information/scope-of-work/${item.id}` : `/sales/newquote/selectyourclient/client-information/scope-of-work/${item.id}`}
                      className='d-flex align-items-center w-100'>
                      <div className='icon1'>
                        {item.photo ? (
                          <img
                            src={item.photo}
                            alt={item.name}
                            style={{ marginRight: "5px" }}
                          />
                        ) : (
                          <div className='icon'>
                            <Building size={13.71} color="#667085" style={{ marginBottom: '8px', marginLeft: '2px' }} />
                          </div>
                        )}
                      </div>
                      <span className='name'>{item.name}</span>
                    </Link>
                  </li>
                ))}

                <div className='rowBorderHide targetObserver'>
                  <div className="targetObserver px-3" ref={elements}>
                    {isFetching && (
                      <>
                        <Placeholder as="p" animation="wave" className="mb-4">
                          <Placeholder xs={12} bg="secondary" style={{ height: '30px' }} />
                        </Placeholder>

                        <Placeholder as="p" animation="wave" className="mb-4">
                          <Placeholder xs={12} bg="secondary" style={{ height: '30px' }} />
                        </Placeholder>
                      </>
                    )}
                  </div>
                </div>

                {!isFetching && (!itemList || itemList.length === 0) && (
                  <div className='no-search' style={{ width: '100%', height: '100%', display: 'flex', justifyContent: "center", alignItems: "center", flexDirection: 'column', backgroundImage: `url(${nodatabg})` }}>
                    <img src={nodata} alt='no-data' style={{ width: '332px' }} />
                    <h1>There is no results</h1>
                    <p>The user you are looking for doesn't exist.</p>
                  </div>
                )}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExistingClients;
