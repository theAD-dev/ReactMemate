import React from 'react'
import clsx from 'clsx';

import style from './no-data-found-template.module.scss';
import NodataImg from "../../assets/images/img/NodataImg.png";
import SearchIcon from "../../assets/images/icon/searchIcon.png";
import { Button } from 'react-bootstrap';
import { ChevronLeft } from 'react-bootstrap-icons';
import { Link } from 'react-router-dom';

const NoDataFoundTemplate = () => {
    return (
        <div className={clsx(style.noDataBox)}>
            <div className='position-relative d-flex flex-column'>
                <img src={NodataImg} alt='no-data' />
                <img className={clsx(style.searchImg)} src={SearchIcon} alt='search' />
            </div>
            <h2 className={clsx(style.title)}>There is no results</h2>
            <p className={clsx(style.subTitle)}>
                The user you are looking for doesn't exist. <br />Here are some helpful links:
            </p>
            <Button className='outline-button' style={{ marginBottom: '32px' }}> <ChevronLeft /> Go back</Button>
            <Link to={"#"}><span className={clsx(style.supportext)}>Support</span></Link>
        </div>
    )
}

export default NoDataFoundTemplate