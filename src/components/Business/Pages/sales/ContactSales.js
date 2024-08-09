import React from 'react';
import { Envelope, Telephone, Calendar,X } from "react-bootstrap-icons";
import { Button, ButtonToolbar, OverlayTrigger, Popover } from 'react-bootstrap';
import ContactAdd from "./ContactAdd";
 // Format Date
 const formatDate = (timestamp) => {
  const date = new Date(timestamp * 1000);
  const day = date.getDate();
  const monthAbbreviation = new Intl.DateTimeFormat("en-US", {
    month: "short",
  }).format(date);
  const year = date.getFullYear();
  return `${day} ${monthAbbreviation} ${year}`;
};
const ContactSales = ({saleUniqueId,type,refreshData}) => {
  const [popoverVisible, setPopoverVisible] = React.useState(null);

  const handlePopoverClick = (index) => {
    var btnsSecondary = document.querySelectorAll('.ClosePopover');
    if (btnsSecondary.length > 0) {
      btnsSecondary.forEach(function(btn) {
        btn.click();
      });
    }

    setPopoverVisible(popoverVisible === index ? null : index);
  };

  const contactRefresh = () =>{
    refreshData()
  }

  const handlePopoverClose = () => {
    setPopoverVisible(null);
  };

  return (
    <>
      <div className="innerTableStyle ">
        <ul>
          {type.map((item, index) => (
            <li key={index}>
              <ButtonToolbar key={index}>
                <OverlayTrigger
                  trigger="click"
                  rootClose
                  placement="bottom"
                  show={popoverVisible === index}
                  onHide={handlePopoverClose}
                  overlay={
                    <Popover
                      id={`popover-trigger-click-root-close-${index}`} className='salesTableWrap'
                      title=""
                    >
                      <div className="contactInfo">
                      <div className='contactInfoflex'>
                      
                        <div className="iconStyle">
                          {item.type === 'Phone' && (
                            <Telephone color="#667085" size={24} />
                          )}
                          {item.type === 'Email' && (
                            <Envelope color="#667085" size={24} />
                          )}
                          {item.type === 'Meeting' && (
                            <Calendar color="#667085" size={24} />
                          )}
                        </div>
                        <Button
                          variant="link" className='ClosePopover'
                          onClick={handlePopoverClose}>
                          <X color="#667085" size={24} />
                        </Button>
                      </div>
                        <p className="contactdate">{formatDate(item.date)}</p>
                        <p>{item.note}</p>
                      </div>
                    </Popover>
                  }
                >
                  <Button
                    variant="saleContacte"
                    onClick={() => handlePopoverClick(index)}
                  >
                    <>
                      {item.type === 'Phone' && (
                        <Telephone color="#344054" size={16} />
                      )}
                      {item.type === 'Email' && (
                        <Envelope color="#344054" size={16} />
                      )}
                      {item.type === 'Meeting' && (
                        <Calendar color="#344054" size={16} />
                      )}
                      <div>{formatDate(item.date)}</div>
                    </>
                  </Button>
                </OverlayTrigger>
              </ButtonToolbar>
            </li>
          ))}
          {Array.from({ length: Math.max(3 - type.length, 0) }).map(
            (_, index) => (
              <li key={type.length + index}>
                <span className="contactButList">
                  <div className="contactButListIn1">
                    <div className="contactButListIn2">
                      <ContactAdd saleUniqueIdold={saleUniqueId} contactRefresh={contactRefresh}/>
                    </div>
                  </div>
                </span>
              </li>
            )
          )}
        </ul>
      </div>
    </>
  );
};

export default ContactSales
