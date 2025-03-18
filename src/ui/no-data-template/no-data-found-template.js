import React, { useState } from 'react';
import { Button } from 'react-bootstrap';
import { ChevronLeft } from 'react-bootstrap-icons';
import { Link } from 'react-router-dom';
import clsx from 'clsx';
import style from './no-data-found-template.module.scss';
import NodataImg from "../../assets/images/img/NodataImg.png";
import Support from '../../shared/ui/support/support';


const NoDataFoundTemplate = ({ isDataExist = true }) => {
    const [visible, setVisible] = useState(false);
    return (
        <div className={clsx(style.noDataBox)}>
            <div className='position-relative d-flex flex-column'>
                <img src={NodataImg} alt='no-data' />
            </div>
            {
                isDataExist ? (
                    <>
                        <h2 className={clsx(style.title)}>There is no results</h2>
                        <p className={clsx(style.subTitle)}>
                            The user you are looking for doesn't exist. <br />Here are some helpful links:
                        </p>
                        <Link to={"/"}><Button className='outline-button' style={{ marginBottom: '32px' }}> <ChevronLeft /> Go back</Button></Link>
                        <Link onClick={() => setVisible(true)} to={"#"}><span className={clsx(style.supportext)}>Support</span></Link>
                    </>
                ) : (
                    <>
                        <h2 className={clsx(style.title)}>No historical records yet.</h2>
                    </>
                )
            }
            <Support setVisible={setVisible} visible={visible} />
        </div>
    );
};

export default NoDataFoundTemplate;