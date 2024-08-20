import React, { useState, useEffect } from 'react';
import { clientEditApi } from '../../../../APIs/ClientsApi';
import { X,Pen,ArrowUpRight,Telephone } from 'react-bootstrap-icons';
import defaultIcon from "../../../../assets/images/icon/default.png";
import { Button } from 'react-bootstrap';
import styles from './memate-select.module.scss';
import { Col, Row } from 'react-bootstrap';

const ClientView = ({ id, close }) => {
    const [clientView, setClientView] = useState();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await clientEditApi(id);
                setClientView(data);
            } catch (error) {
                console.error("Error fetching client information:", error);
            }
        };

        fetchData();
    }, [id]);

    return (
        <>
          
          <div className={styles.mainHead}>
        <div className='d-flex align-items-center'>
           <div className={styles.clientImgOpacity}>
           {clientView?.photo ? (
                <img
                    src={clientView.photo}
                    alt="Client photo"
                    style={{ marginRight: "5px" }}
                    onError={(e) => {
                        e.target.src = defaultIcon;
                        e.target.alt = "Image Not Found";
                    }}
                />
            ) : (
                <img src={defaultIcon} alt='defaultIcon' />
            )}
           </div>
            <strong>{clientView?.name}</strong>
            <Button>Edit <Pen size={20} color='#1D2939' /></Button>
        </div>
            <button className={styles.CustomCloseModal} onClick={close}>
                <X size={24} color='#667085' />
            </button>
            </div>
            <div className={styles.mainScrollWrap}>
           
            {/* Grey Box */}
            <div className={styles.displayFlexGrid}>
                <strong>Client Details</strong>
                <span>Client ID: {clientView?.id}</span>
            </div>
            <div className={styles.greyBox}>
            <Row>
            <Col md={12}>
             <p className={styles.labelColor}>Customer Category</p>
             <h3 className={styles.inputValue}>{clientView?.category}</h3>
            </Col>
            </Row>
            <Row className='pt-2'>
            <Col md={6}>
             <p className={styles.labelColor}>ABN</p>
             <h3 className={styles.inputValue}>{clientView?.abn}</h3>
            </Col>
            <Col md={6}>
             <p className={styles.labelColor}>Industry</p>
             <h3 className={styles.inputValue}>{clientView?.industry}</h3>
            </Col>
            </Row>
            <Row className='pt-2'>
            <Col md={6}>
             <p className={styles.labelColor}>Customer Type</p>
             <h3 className={styles.inputValue}>
             {clientView?.is_business ? (
                      <>
                        <span>Business</span>

                      </>
                    ) : (
                        <span>Not Business</span>
                    )}
             </h3>
            </Col>
            <Col md={6}>
             <p className={styles.labelColor}>Phone</p>
             <h3 className={styles.inputValue}>{clientView?.phone}</h3>
            </Col>
            </Row>
            <Row className='pt-2'>
            <Col md={6}>
             <p className={styles.labelColor}>Email</p>
             <h3 className={styles.inputValue}><a href='#'><span>{clientView?.email}</span><ArrowUpRight size={20} color='#106B99' /></a></h3>
            </Col>
            <Col md={6}>
             <p className={styles.labelColor}>Website</p>
             <h3 className={styles.inputValue}><a href='#'><span>{clientView?.website}</span><ArrowUpRight size={20} color='#106B99' /></a></h3>
            </Col>
            </Row>
            </div>
            {/* Grey Box */}
              {/* Grey Box */}
              <div className={styles.displayFlexGrid}>
                <strong>Payment Terms</strong>
               
            </div>
              <div className={styles.greyBox}>
            <Row>
            <Col md={12}>
             <p className={styles.labelColor}>Payment Terms</p>
             <h3 className={styles.inputValue}>{clientView?.payment_terms}</h3>
            </Col>
            </Row>
            </div>
            {/* Grey Box */}
            {/* Grey Box */}
            <div className={styles.displayFlexGrid}>
                <strong>Contact Person</strong>
               
            </div>
            <div className={styles.greyBox}>
        
            <Row className='pt-2'>
            <Col md={6}>
             <p className={styles.labelColor}>Full Name</p>
             <h3 className={styles.inputValue}>Paul Stein</h3>
            </Col>
            <Col md={6}>
            <p className={styles.labelColor}>Email</p>
            <h3 className={styles.inputValue}><a href='#'><span>client@email.com</span><ArrowUpRight size={20} color='#106B99' /></a></h3>
            </Col>
            </Row>
         
            <Row className='pt-2'>
            <Col md={6}>
             <p className={styles.labelColor}>Position</p>
             <h3 className={styles.inputValue}>Specialist Claims Manager</h3>
            </Col>
            <Col md={6}>
             <p className={styles.labelColor}>Phone</p>
             <h3 className={styles.inputValue}> <a href='#'>1300882582<Telephone size={20} color='#106B99' /></a></h3>
            </Col>
            </Row>
            </div>
            {/* Grey Box */}
 {/* Grey Box */}

          <div className={`mt-3 ${styles.greyBox}`}>
            <Row className='pt-2'>
            <Col md={6}>
             <p className={styles.labelColor}>Full Name</p>
             <h3 className={styles.inputValue}>Paul Stein</h3>
            </Col>
            <Col md={6}>
            <p className={styles.labelColor}>Email</p>
            <h3 className={styles.inputValue}><a href='#'><span>client@email.com</span><ArrowUpRight size={20} color='#106B99' /></a></h3>
            </Col>
            </Row>
         
            <Row className='pt-2'>
            <Col md={6}>
             <p className={styles.labelColor}>Position</p>
             <h3 className={styles.inputValue}>Specialist Claims Manager</h3>
            </Col>
            <Col md={6}>
             <p className={styles.labelColor}>Phone</p>
             <h3 className={styles.inputValue}> <a href='#'>1300882582<Telephone size={20} color='#106B99' /></a></h3>
            </Col>
            </Row>
            </div>
            {/* Grey Box */}
  {/* Grey Box */}
  <div className={styles.displayFlexGrid}>
                <strong>Locations</strong>
               
            </div>
            <div className={styles.greyBox}>
        
            <Row className='pt-2'>
            <Col>
            <p>Our primary business location is here, serving as the central hub for all our operations and customer interactions.</p>
            </Col>
            </Row>
            </div>
            {/* Grey Box */}


          
            </div>
        </>
    );
};

export default ClientView;
