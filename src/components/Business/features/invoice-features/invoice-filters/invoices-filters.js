import React from 'react';
import { X } from 'react-bootstrap-icons';
import Button from "react-bootstrap/Button";
import style from './invoice-dropdown.module.scss';

const InvoicesFilters = ({ filter, setFilters }) => {
    const handleRemoveTag = (group, itemName) => {
        const newFilters = { ...filter };
        const newItems = newFilters[group].filter((item) => item !== itemName);
        if (newItems.length === 0) {
            delete newFilters[group];
        } else {
            newFilters[group] = newItems;
        }
        setFilters(newFilters);
    };

    const handleRemoveGroup = (groupName) => {
        const newFilters = { ...filter };
        delete newFilters[groupName];
        setFilters(newFilters);
    };

    return (
        <>
            {Object.keys(filter)?.length > 0 && (
                <div className={style.mainTagsWrapper}>
                    {Object.entries(filter)?.map(([group, items]) => (
                        <div key={group}>
                            {items?.length > 0 && (
                                <div className={style.tagsInputContainer}>
                                    <ul className={style.tagItemsWrap}>
                                        {items.map((item, index) => (
                                            <li className={style.tagItemWrap} key={index}>
                                                {item}
                                                {items?.length > 1 && (
                                                    <Button
                                                        variant="link"
                                                        size="sm"
                                                        style={{ marginLeft: "5px" }}
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
                                            style={{ marginLeft: "0px" }}
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

export default InvoicesFilters;