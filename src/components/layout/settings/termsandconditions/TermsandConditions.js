import { Link } from 'react-router-dom';
import React, { useState,useEffect } from 'react';
import Sidebar from '../Sidebar';
import { PencilSquare, Check, X } from "react-bootstrap-icons";
import style from './terms-.module.scss';
import { Button, Col, Row } from 'react-bootstrap';
import clsx from 'clsx';
import { useForm } from 'react-hook-form';
import { IconField } from "primereact/iconfield";
import { InputIcon } from "primereact/inputicon";
import { InputTextarea } from "primereact/inputtextarea"
import { yupResolver } from '@hookform/resolvers/yup';
import exclamationCircle from "../../../../assets/images/icon/exclamation-circle.svg";
import * as yup from 'yup';
import { ProgressSpinner } from "primereact/progressspinner";
import { Editor } from "primereact/editor";
import { useQuery } from "@tanstack/react-query";

const TermsandConditions = () => {
    const [activeTab, setActiveTab] = useState('terms-and-conditions');
    const [edit, setEdit] = useState(false);

    const schema = yup.object().shape({
        username: yup.string().required('Username is required'),
      });

    const { control, register, handleSubmit, setValue, formState: { errors } } = useForm({
        resolver: yupResolver(schema),
    });


    const [terms, setTerms] = useState(` <p>Terms and Conditions</p>
 <p>General Site Usage</p>
 <p>Last Revised: December 16, 2013</p>

 <p>Welcome to www.lorem-ipsum.info. This site is provided as a service to our visitors and may be used for informational purposes only. Because the Terms and Conditions contain legal obligations, please read them carefully.</p>

<ul>
<li>
<span>1. YOUR AGREEMENT</span>
<p>By using this Site, you agree to be bound by, and to comply with, these Terms and Conditions. If you do not agree to these Terms and Conditions, please do not use this site.</p>
<p>PLEASE NOTE: We reserve the right, at our sole discretion, to change, modify or otherwise alter these Terms and Conditions at any time. Unless otherwise indicated, amendments will become effective immediately. Please review these Terms and Conditions periodically. Your continued use of the Site following the posting of changes and/or modifications will constitute your acceptance of the revised Terms and Conditions and the reasonableness of these standards for notice of changes. For your information, this page was last updated as of the date at the top of these terms and conditions.
</p>
</li>
<li>
<span>2. PRIVACYT</span>
<p>Please review our Privacy Policy, which also governs your visit to this Site, to understand our practices.
</p>
</li>
<li>
<span>3. LINKED SITES</span>
<p>This Site may contain links to other independent third-party Web sites ("Linked Sites”). These Linked Sites are provided solely as a convenience to our visitors. Such Linked Sites are not under our control, and we are not responsible for and does not endorse the content of such Linked Sites, including any information or materials contained on such Linked Sites. You will need to make your own independent judgment regarding your interaction with these Linked Sites.
</p>
</li>
<li>
<span>4. FORWARD LOOKING STATEMENTS</span>
<p>All materials reproduced on this site speak as of the original date of publication or filing. The fact that a document is available on this site does not mean that the information contained in such document has not been modified or superseded by events or by a subsequent document or filing. We have no duty or policy to update any information or statements contained on this site and, therefore, such information or statements should not be relied upon as being current as of the date you access this site.
</p>
</li>
<li>
<span>5. DISCLAIMER OF WARRANTIES AND LIMITATION OF LIABILITY</span>
<p>A. THIS SITE MAY CONTAIN INACCURACIES AND TYPOGRAPHICAL ERRORS. WE DOES NOT WARRANT THE ACCURACY OR COMPLETENESS OF THE MATERIALS OR THE RELIABILITY OF ANY ADVICE, OPINION, STATEMENT OR OTHER INFORMATION DISPLAYED OR DISTRIBUTED THROUGH THE SITE. YOU EXPRESSLY UNDERSTAND AND AGREE THAT: (i) YOUR USE OF THE SITE, INCLUDING ANY RELIANCE ON ANY SUCH OPINION, ADVICE, STATEMENT, MEMORANDUM, OR INFORMATION CONTAINED HEREIN, SHALL BE AT YOUR SOLE RISK; (ii) THE SITE IS PROVIDED ON AN "AS IS" AND "AS AVAILABLE" BASIS; (iii) EXCEPT AS EXPRESSLY PROVIDED HEREIN WE DISCLAIM ALL WARRANTIES OF ANY KIND, WHETHER EXPRESS OR IMPLIED, INCLUDING, BUT NOT LIMITED TO IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, WORKMANLIKE EFFORT, TITLE AND NON-INFRINGEMENT; (iv) WE MAKE NO WARRANTY WITH RESPECT TO THE RESULTS THAT MAY BE OBTAINED FROM THIS SITE, THE PRODUCTS OR SERVICES ADVERTISED OR OFFERED OR MERCHANTS INVOLVED; (v) ANY MATERIAL DOWNLOADED OR OTHERWISE OBTAINED THROUGH THE USE OF THE SITE IS DONE AT YOUR OWN DISCRETION AND RISK; and (vi) YOU WILL BE SOLELY RESPONSIBLE FOR ANY DAMAGE TO YOUR COMPUTER SYSTEM OR FOR ANY LOSS OF DATA THAT RESULTS FROM THE DOWNLOAD OF ANY SUCH MATERIAL.
</p>
<p>B. YOU UNDERSTAND AND AGREE THAT UNDER NO CIRCUMSTANCES, INCLUDING, BUT NOT LIMITED TO, NEGLIGENCE, SHALL WE BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, PUNITIVE OR CONSEQUENTIAL DAMAGES THAT RESULT FROM THE USE OF, OR THE INABILITY TO USE, ANY OF OUR SITES OR MATERIALS OR FUNCTIONS ON ANY SUCH SITE, EVEN IF WE HAVE BEEN ADVISED OF THE POSSIBILITY OF SUCH DAMAGES. THE FOREGOING LIMITATIONS SHALL APPLY NOTWITHSTANDING ANY FAILURE OF ESSENTIAL PURPOSE OF ANY LIMITED REMEDY.
</p>
</li>
<li>
<span>6. EXCLUSIONS AND LIMITATIONS</span>
<p>SOME JURISDICTIONS DO NOT ALLOW THE EXCLUSION OF CERTAIN WARRANTIES OR THE LIMITATION OR EXCLUSION OF LIABILITY FOR INCIDENTAL OR CONSEQUENTIAL DAMAGES. ACCORDINGLY, OUR LIABILITY IN SUCH JURISDICTION SHALL BE LIMITED TO THE MAXIMUM EXTENT PERMITTED BY LAW.
</p>
</li>
<li>
<span>7. OUR PROPRIETARY RIGHTS</span>
<p>This Site and all its Contents are intended solely for personal, non-commercial use. Except as expressly provided, nothing within the Site shall be construed as conferring any license under our or any third party's intellectual property rights, whether by estoppel, implication, waiver, or otherwise. Without limiting the generality of the foregoing, you acknowledge and agree that all content available through and used to operate the Site and its services is protected by copyright, trademark, patent, or other proprietary rights. You agree not to: (a) modify, alter, or deface any of the trademarks, service marks, trade dress (collectively "Trademarks") or other intellectual property made available by us in connection with the Site; (b) hold yourself out as in any way sponsored by, affiliated with, or endorsed by us, or any of our affiliates or service providers; (c) use any of the Trademarks or other content accessible through the Site for any purpose other than the purpose for which we have made it available to you; (d) defame or disparage us, our Trademarks, or any aspect of the Site; and (e) adapt, translate, modify, decompile, disassemble, or reverse engineer the Site or any software or programs used in connection with it or its products and services.
</p>
<p>The framing, mirroring, scraping or data mining of the Site or any of its content in any form and by any method is expressly prohibited.</p>
</li>
<li>
<span>8. INDEMNITY</span>
<p>By using the Site web sites you agree to indemnify us and affiliated entities (collectively "Indemnities") and hold them harmless from any and all claims and expenses, including (without limitation) attorney's fees, arising from your use of the Site web sites, your use of the Products and Services, or your submission of ideas and/or related materials to us or from any person's use of any ID, membership or password you maintain with any portion of the Site, regardless of whether such use is authorized by you.
</p>
</li>
<li>
<span>9. COPYRIGHT AND TRADEMARK NOTICE</span>
<p>Except our generated dummy copy, which is free to use for private and commercial use, all other text is copyrighted. generator.lorem-ipsum.info © 2013, all rights reserved
</p>
</li>
<li>
<span>10. INTELLECTUAL PROPERTY INFRINGEMENT CLAIMS</span>
<p>It is our policy to respond expeditiously to claims of intellectual property infringement. We will promptly process and investigate notices of alleged infringement and will take appropriate actions under the Digital Millennium Copyright Act ("DMCA") and other applicable intellectual property laws. Notices of claimed infringement should be directed to:
</p>
</li>
<li>
<span>10. INTELLECTUAL PROPERTY INFRINGEMENT CLAIMS</span>
<p>generator.lorem-ipsum.info

126 Electricov St.

Kiev, Kiev 04176

Ukraine

contact@lorem-ipsum.info</p>
</li>
<li>
<span>11. PLACE OF PERFORMANCE</span>
<p>This Site is controlled, operated and administered by us from our office in Kiev, Ukraine. We make no representation that materials at this site are appropriate or available for use at other locations outside of the Ukraine and access to them from territories where their contents are illegal is prohibited. If you access this Site from a location outside of the Ukraine, you are responsible for compliance with all local laws.
</p>
</li>
<li>
<span>12. GENERAL</span>
<p>
A. If any provision of these Terms and Conditions is held to be invalid or unenforceable, the provision shall be removed (or interpreted, if possible, in a manner as to be enforceable), and the remaining provisions shall be enforced. Headings are for reference purposes only and in no way define, limit, construe or describe the scope or extent of such section. Our failure to act with respect to a breach by you or others does not waive our right to act with respect to subsequent or similar breaches. These Terms and Conditions set forth the entire understanding and agreement between us with respect to the subject matter contained herein and supersede any other agreement, proposals and communications, written or oral, between our representatives and you with respect to the subject matter hereof, including any terms and conditions on any of customer's documents or purchase orders.
</p>
<p>
B. No Joint Venture, No Derogation of Rights. You agree that no joint venture, partnership, employment, or agency relationship exists between you and us as a result of these Terms and Conditions or your use of the Site. Our performance of these Terms and Conditions is subject to existing laws and legal process, and nothing contained herein is in derogation of our right to comply with governmental, court and law enforcement requests or requirements relating to your use of the Site or information provided to or gathered by us with respect to such use.
 </p>
</li>
</ul>`);  


useEffect(() => {
    setValue('terms', 'This is the pre-filled description.');
}, [setValue]);
const [text, setText] = useState(null);
const [subject, setSubject] = useState(null);
const [emailTemplateId, setEmailTemplatedId] = useState(null);
const emailQuery = useQuery({
    queryKey: ["emailQuery", emailTemplateId],

    enabled: !!emailTemplateId,
    retry: 1,
});
const [errors1, setErrors] = useState({});
useEffect(() => {
    setText(emailQuery?.data?.body || "");
    setSubject(emailQuery?.data?.subject);
    setErrors((others) => ({ ...others, subject: false }));
    setErrors((others) => ({ ...others, text: false }));
}, [emailQuery?.data?.body]);



    const handleEditClick = () => setEdit(true);
    const handleSaveClick = () => setEdit(false);  // Add your save logic here
    const handleCancelClick = () => setEdit(false);

    return (
        <div className='settings-wrap'>
            <div className="settings-wrapper">
                <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
                <div className="settings-content setModalelBoots">
                    <div className='headSticky'>
                        <h1>Terms and Conditions</h1>
                        <div className='contentMenuTab'>
                            <ul>
                                <li className='menuActive'><Link to="/settings/termsandconditions/terms-and-conditions">Terms and Conditions Application</Link></li>
                                <li><Link to="/settings/termsandconditions/terms-and-conditions-invoice">Terms and Conditions Invoice</Link></li>
                            </ul>
                        </div>
                    </div>
                    <div className="content_wrap_main">
                        <div className='content_wrapper'>
                            <div className="listwrapper">
                                <div className={`topHeadStyle pb-4 ${style.topHeadStyle}`}>
                                    <div>
                                        <h2>Terms and Conditions for Application</h2>
                                        <p>Please fill in your company Terms and Conditions for Subcontractors, which they will follow while using the MeMate Application.</p>
                                    </div>
                                    {!edit && <button onClick={handleEditClick}>Edit &nbsp; <PencilSquare color="#344054" size={20} /></button>}
                                </div>

                                <div>
                                    {edit ? (
                                        <>
                                       
                                            <Row>
                                    
                <Col sm={12}>
                    <div className="d-flex flex-column gap-1" style={{ position: 'relative' }}>
                        <label className={clsx(style.lable)}>Message</label>
                        <InputIcon style={{ position: 'absolute', right: '15px', top: '40px', zIndex: 1 }}>
                            {emailQuery?.isFetching && <ProgressSpinner style={{ width: '20px', height: '20px', position: 'relative', top: '-5px' }} />}
                        </InputIcon>
                        <Editor 
                                    value={terms} 
                                    onTextChange={(e) => setTerms(e.htmlValue)} 
                                />
                    </div>
                    {errors?.text && (
                        <p className="error-message mb-0">{"Message is required"}</p>
                    )}
                </Col>
                                            </Row>
                                            <div className='d-flex justify-content-end mt-4'>
                                               <Button className=' outline-button me-2' onClick={handleCancelClick}>Cancel &nbsp; </Button>
                                                <Button className=' solid-button' onClick={handleSaveClick}>Send &nbsp; </Button>
                                               
                                            </div>
                                        </>
                                    ) : (
                                  
                                        <div className={style.editPara} dangerouslySetInnerHTML={{ __html: terms }} />
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default TermsandConditions;
