import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { X, CurrencyDollar ,Filter,FileEarmark,FilePdf,Link45deg} from "react-bootstrap-icons";
import { Table } from 'react-bootstrap';
import AddNote from './AddNote';
import NewTask from './NewTask';
import SendSMS from './SendSMS';
import ComposeEmail from './ComposeEmail';
import OrdersIcon from "../../../../assets/images/icon/OrdersIcon.svg";
import ExpenseIcon from "../../../../assets/images/icon/ExpenseIcon.svg";
const ProjectCardModel = ({ taskId }) => {
  const [viewShow, setViewShow] = useState(false);


 
  const handleClose = () => {
    setViewShow(false);
  };
  const handleShow = () => {
    setViewShow(true);

  };

  return (
    <>
      {/* View modal trigger */}
      <div className="linkByttonStyle" onClick={handleShow}>
         Project Card
      </div>

      {/* View modal */}
      <Modal
        show={viewShow}
        aria-labelledby="contained-modal-title-vcenter"
        centered
        className="projectCardModel"
        onHide={handleClose}
        animation={false}
      >
        <Modal.Header className="mb-0 pb-0 ">
          <div className="modelHeader">
          <ul className='d-flex justify-content-between align-items-center'>
            <li><strong className='dollorIcon'><CurrencyDollar size={13} color='#F04438'/></strong><span className='cardId'>Q-THE-230401-1</span></li>
            <li>
            <label>
      <select name="selectedStatus">
        <option value="">Status</option>
        <option value="">WN</option>
        <option value="">LOST</option>
      </select>
    </label>
            </li>
            <li className='refrencesTag'>Reference: <strong>Front End Development / Dec 23</strong></li>
          </ul>
          </div>
          <button className='CustonCloseModal' onClick={handleClose}>
        <X size={24} color='#667085'/>
        </button>
        </Modal.Header>
        <Modal.Body className='p-0'>
            <div className="ContactModel">
                <Row className="text-left mt-0">
                <Col className='orderDiscription'>
                 <stron>Order Description</stron>
                 <p className='customScrollBar'>Order ID 875309, placed on January 22, 2024, by customer Alex Johnson, includes two main items. The first item is a pair of stainless steel water bottles, each priced at $15.99, bringing the total for this item to $31.98. Alongside this, the order also contains one set of wireless Bluetooth headphones, with a noise-canceling feature, priced at $89.99. The overall total for the order, combining both items, comes to $121.97...</p>
                  <div className='currentJobsTable'>
                    <h5>Current Jobs / Expense for this order</h5>
                    <Table responsive>
                        <thead style={{ position: "sticky", top: "0px", zIndex: 9 }}>
                     
                            <tr>
                            <th>#</th>
                            <th>Reference</th>
                            <th>Supplier</th>
                            <th>Estimate/Total</th>
                            <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>ELT-286535-1</td>
                                <td>Front End Developm...</td>
                                <td>gh</td>
                                <td>$1300</td>
                                <td><span>Not finish</span></td>
                            </tr>
                            <tr>
                                <td>ELT-286535-1</td>
                                <td>Front End Developm...</td>
                                <td>gh</td>
                                <td>$1300</td>
                                <td><span>Not finish</span></td>
                            </tr>
                            <tr>
                                <td>ELT-286535-1</td>
                                <td>Front End Developm...</td>
                                <td>gh</td>
                                <td>$1300</td>
                                <td><span>Not finish</span></td>
                            </tr>
                            <tr>
                                <td>ELT-286535-1</td>
                                <td>Front End Developm...</td>
                                <td>gh</td>
                                <td>$1300</td>
                                <td><span>Not finish</span></td>
                            </tr>
                            <tr>
                                <td>ELT-286535-1</td>
                                <td>Front End Developm...</td>
                                <td>gh</td>
                                <td>$1300</td>
                                <td><span>Not finish</span></td>
                            </tr>
                            <tr>
                                <td>ELT-286535-1</td>
                                <td>Front End Developm...</td>
                                <td>gh</td>
                                <td>$1300</td>
                                <td><span>Not finish</span></td>
                            </tr>
                            <tr>
                                <td>ELT-286535-1</td>
                                <td>Front End Developm...</td>
                                <td>gh</td>
                                <td>$1300</td>
                                <td><span>Not finish</span></td>
                            </tr>
                            <tr>
                                <td>ELT-286535-1</td>
                                <td>Front End Developm...</td>
                                <td>gh</td>
                                <td>$1300</td>
                                <td><span>Not finish</span></td>
                            </tr>
                            <tr>
                                <td>ELT-286535-1</td>
                                <td>Front End Developm...</td>
                                <td>gh</td>
                                <td>$1300</td>
                                <td><span>Not finish</span></td>
                            </tr>
                            <tr>
                                <td>ELT-286535-1</td>
                                <td>Front End Developm...</td>
                                <td>gh</td>
                                <td>$1300</td>
                                <td><span>Not finish</span></td>
                            </tr>
                            <tr>
                                <td>ELT-286535-1</td>
                                <td>Front End Developm...</td>
                                <td>gh</td>
                                <td>$1300</td>
                                <td><span>Not finish</span></td>
                            </tr>
                            <tr>
                                <td>ELT-286535-1</td>
                                <td>Front End Developm...</td>
                                <td>gh</td>
                                <td>$1300</td>
                                <td><span>Not finish</span></td>
                            </tr>
                            <tr>
                                <td>ELT-286535-1</td>
                                <td>Front End Developm...</td>
                                <td>gh</td>
                                <td>$1300</td>
                                <td><span>Not finish</span></td>
                            </tr>
                            <tr>
                                <td>ELT-286535-1</td>
                                <td>Front End Developm...</td>
                                <td>gh</td>
                                <td>$1300</td>
                                <td><span>Not finish</span></td>
                            </tr>
                            <tr>
                                <td>ELT-286535-1</td>
                                <td>Front End Developm...</td>
                                <td>gh</td>
                                <td>$1300</td>
                                <td><span>Not finish</span></td>
                            </tr>
                            <tr>
                                <td>ELT-286535-1</td>
                                <td>Front End Developm...</td>
                                <td>gh</td>
                                <td>$1300</td>
                                <td><span>Not finish</span></td>
                            </tr>
                        </tbody>
                    </Table>
                   
                  </div>
                </Col>
                <Col className='projectHistoryCol'>
                 <Row>
                    <Col className='tabModelMenu d-flex justify-content-between align-items-center' ><AddNote /><NewTask /><SendSMS /><ComposeEmail /></Col>
                    <Col className='d-flex justify-content-center align-items-center filter'  ><span><Filter size={20} color='#344054'/></span></Col>
                 </Row>
                 <Row className='projectHistoryWrap'>
                    <Col className='p-0' >
                    <h3>Project History</h3>
                    <div className='projectHistoryScroll'>
                    <div className='projectHistorygroup'>{/* Group Start */}
                    <ul>
                        <li><FileEarmark size={16} color='#1AB2FF'/></li>
                            <li><strong>Quote</strong></li>
                            <li><FilePdf size={16} color='#F04438'/></li>
                            <li><Link45deg size={16} color='#3366CC'/></li>
                        </ul>
                        <h6>This is example subtitle</h6>
                        <p>17:19 PM | Tue | 06.02.2024 by Danny Vinkl</p>
                    </div>{/* Group End */}
                    <div className='projectHistorygroup'>{/* Group Start */}
                    <ul>
                        <li><FileEarmark size={16} color='#1AB2FF'/></li>
                            <li><strong>Quote</strong></li>
                            <li><FilePdf size={16} color='#F04438'/></li>
                            <li><Link45deg size={16} color='#3366CC'/></li>
                        </ul>
                        <h6>This is example subtitle</h6>
                        <p>17:19 PM | Tue | 06.02.2024 by Danny Vinkl</p>
                    </div>{/* Group End */}
                    <div className='projectHistorygroup'>{/* Group Start */}
                    <ul>
                        <li><FileEarmark size={16} color='#1AB2FF'/></li>
                            <li><strong>Quote</strong></li>
                            <li><FilePdf size={16} color='#F04438'/></li>
                            <li><Link45deg size={16} color='#3366CC'/></li>
                        </ul>
                        <h6>This is example subtitle</h6>
                        <p>17:19 PM | Tue | 06.02.2024 by Danny Vinkl</p>
                    </div>{/* Group End */}
                    <div className='projectHistorygroup'>{/* Group Start */}
                    <ul>
                        <li><FileEarmark size={16} color='#1AB2FF'/></li>
                            <li><strong>Quote</strong></li>
                            <li><FilePdf size={16} color='#F04438'/></li>
                            <li><Link45deg size={16} color='#3366CC'/></li>
                        </ul>
                        <h6>This is example subtitle</h6>
                        <p>17:19 PM | Tue | 06.02.2024 by Danny Vinkl</p>
                    </div>{/* Group End */}
                    <div className='projectHistorygroup'>{/* Group Start */}
                    <ul>
                        <li><FileEarmark size={16} color='#1AB2FF'/></li>
                            <li><strong>Quote</strong></li>
                            <li><FilePdf size={16} color='#F04438'/></li>
                            <li><Link45deg size={16} color='#3366CC'/></li>
                        </ul>
                        <h6>This is example subtitle</h6>
                        <p>17:19 PM | Tue | 06.02.2024 by Danny Vinkl</p>
                    </div>{/* Group End */}
                    <div className='projectHistorygroup'>{/* Group Start */}
                    <ul>
                        <li><FileEarmark size={16} color='#1AB2FF'/></li>
                            <li><strong>Quote</strong></li>
                            <li><FilePdf size={16} color='#F04438'/></li>
                            <li><Link45deg size={16} color='#3366CC'/></li>
                        </ul>
                        <h6>This is example subtitle</h6>
                        <p>17:19 PM | Tue | 06.02.2024 by Danny Vinkl</p>
                    </div>{/* Group End */}
                    <div className='projectHistorygroup'>{/* Group Start */}
                    <ul>
                        <li><FileEarmark size={16} color='#1AB2FF'/></li>
                            <li><strong>Quote</strong></li>
                            <li><FilePdf size={16} color='#F04438'/></li>
                            <li><Link45deg size={16} color='#3366CC'/></li>
                        </ul>
                        <h6>This is example subtitle</h6>
                        <p>17:19 PM | Tue | 06.02.2024 by Danny Vinkl</p>
                    </div>{/* Group End */}
                    <div className='projectHistorygroup'>{/* Group Start */}
                    <ul>
                        <li><FileEarmark size={16} color='#1AB2FF'/></li>
                            <li><strong>Quote</strong></li>
                            <li><FilePdf size={16} color='#F04438'/></li>
                            <li><Link45deg size={16} color='#3366CC'/></li>
                        </ul>
                        <h6>This is example subtitle</h6>
                        <p>17:19 PM | Tue | 06.02.2024 by Danny Vinkl</p>
                    </div>{/* Group End */}
                    <div className='projectHistorygroup'>{/* Group Start */}
                    <ul>
                        <li><FileEarmark size={16} color='#1AB2FF'/></li>
                            <li><strong>Quote</strong></li>
                            <li><FilePdf size={16} color='#F04438'/></li>
                            <li><Link45deg size={16} color='#3366CC'/></li>
                        </ul>
                        <h6>This is example subtitle</h6>
                        <p>17:19 PM | Tue | 06.02.2024 by Danny Vinkl</p>
                    </div>{/* Group End */}
                    </div>
                    </Col>
                 </Row>
                </Col>
                </Row>
                <Row className='projectCardButWrap'>
                    <Col><Button>Schedule Project  <img src={OrdersIcon} alt="OrdersIcon" /></Button>
                   <Button>Expense <img src={ExpenseIcon} alt="Expense" /></Button>
                    <Button>Create PO  <img src={OrdersIcon} alt="OrdersIcon" /></Button>
                    <Button>Create a Job  <img src={OrdersIcon} alt="OrdersIcon" /></Button>
                    <Button>Google Review  <img src={OrdersIcon} alt="OrdersIcon" /></Button>
                   <Button>Files  <img src={OrdersIcon} alt="OrdersIcon" /></Button>
                    <Button>Send to Calendar  <img src={OrdersIcon} alt="OrdersIcon" /></Button></Col>
                </Row>
            </div>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default ProjectCardModel;
