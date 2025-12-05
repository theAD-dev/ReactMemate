import React, { useEffect, useState, useRef } from 'react';
import { Dropdown } from 'primereact/dropdown';
import { newQuoteClientList } from '../../../../../../APIs/NewQuoteApis';

const SelectClient = ({ value, setValue }) => {
    const [options, setOptions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(0);
    const [reset, setReset] = useState(false);
    const limit = 25;
    const [hasMore, setHasMore] = useState(true);

    const lastOptionRef = useRef(null);

    const fetchDropdownData = async () => {
        if (!hasMore) return;

        setLoading(true);
        const offset = page * limit;

        try {
            const response = await newQuoteClientList(limit, offset, value.toLowerCase());

            if (response && response.results) {
                let optionsMap = Array.isArray(response.results)
                    ? response.results.map((res) => ({
                        name: res.name,
                        value: res.id,
                    }))
                    : [];

                if (reset) {
                    setOptions(optionsMap);
                    setReset(false);
                } else {
                    setOptions((prevOptions) => {
                        const existingIds = new Set(prevOptions.map(prev => prev.value));
                        const newOptions = response?.results.filter(client => !existingIds.has(client.id)).map(client => ({
                            name: client.name,
                            value: client.id
                        }));
                        return [...prevOptions, ...newOptions];
                    });
                }
                setHasMore(optionsMap.length === limit);
            }
        } catch (error) {
            console.error("Error fetching data:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDropdownData();
    }, [page, reset]);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setPage((prevPage) => prevPage + 1);
                }
            },
            {
                root: null,
                rootMargin: '0px',
                threshold: 1.0
            }
        );

        const lastOption = lastOptionRef.current;
        if (lastOption) {
            observer.observe(lastOption);
        }

        return () => {
            if (lastOption) {
                observer.unobserve(lastOption);
            }
        };
    }, [hasMore, options]);

    const onSearchChange = (e) => {
        setValue(e.target.value);
        setReset(true);
        setPage(0);
    };

    const itemTemplate = (option) => {
        return (
            <div>
                {option.name}
                {options.length > 0 && options[options.length - 1] === option && (
                    <div ref={lastOptionRef} />
                )}
            </div>
        );
    };

    return (
        <div>
            <Dropdown
                value={value}
                options={options}
                onChange={(e) => setValue(e.value)}
                onInput={onSearchChange}
                scrollHeight="200px"
                loading={loading}
                optionLabel="name"
                optionValue="value"
                filter
                className="w-100"
                itemTemplate={itemTemplate}
                filterInputAutoFocus={true}
            />
        </div>
    );
};

export default SelectClient;
