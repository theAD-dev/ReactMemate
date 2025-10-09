import React from 'react';
import { Button } from "react-bootstrap";
import { X } from 'react-bootstrap-icons';
import style from './expense-dropdown.module.scss';

const ExpenseFilters = ({ filter, setFilter }) => {
    // Ensure filter is an object with default value
    const currentFilter = filter || {};

    const handleRemoveTag = (group, itemName) => {
        const newFilters = { ...currentFilter };
        const newItems = newFilters[group].filter((item) => item !== itemName);
        if (newItems.length === 0) {
            delete newFilters[group];
        } else {
            newFilters[group] = newItems;
        }
        setFilter(newFilters);
    };

    const handleRemoveGroup = (groupName) => {
        const newFilters = { ...currentFilter };
        delete newFilters[groupName];
        setFilter(newFilters);
    };

    return (
        <>
            {Object.keys(currentFilter)?.length > 0 && (
                <div className={style.mainTagsWrapper}>
                    {Object.entries(currentFilter)?.map(([group, items]) => (
                        <div key={group}>
                            {items?.length > 0 && (
                                <div className={style.tagsInputContainer}>
                                    <ul className={style.tagItemsWrap}>
                                        {items.map((item, index) => (
                                            <li className={style.tagItemWrap} key={index}>
                                                {item?.name}
                                                {items?.length > 1 && (
                                                    <Button
                                                        variant="link"
                                                        size="sm"
                                                        style={{ marginLeft: "5px", padding: 0 }}
                                                        onClick={() => handleRemoveTag(group, item)}
                                                    >
                                                        <X color="#F96969" size={15} />
                                                    </Button>
                                                )}
                                            </li>
                                        ))}
                                        <Button
                                            variant="link"
                                            size="sm"
                                            style={{ marginLeft: "0px", padding: 0 }}
                                            onClick={() => handleRemoveGroup(group)}
                                        >
                                            <X color="#F96969" size={20} />
                                        </Button>
                                    </ul>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </>
    );
};

export default ExpenseFilters;