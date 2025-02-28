import React, { useState } from 'react';
import { Button, Col, Row } from 'react-bootstrap';
import { PencilSquare,Trash,PlusLg} from "react-bootstrap-icons";
import { useForm } from 'react-hook-form';
import { useLocation ,useNavigate} from 'react-router-dom';
import { yupResolver } from '@hookform/resolvers/yup';
import clsx from 'clsx';
import { Editor } from "primereact/editor";
import { IconField } from "primereact/iconfield";
import { InputIcon } from "primereact/inputicon";
import { InputText } from "primereact/inputtext";
import * as yup from 'yup';
import BreadCrumbPage from './bread-crumb';
import style from './job-template.module.scss';
import exclamationCircle from "../../../../assets/images/icon/exclamation-circle.svg";
import Sidebar from '../Sidebar';


const EditProposal = () => {
    const [activeTab, setActiveTab] = useState('proposal-templates');
    const location = useLocation();
    const [text, setText] = useState('');
    const { departments } = location.state || {};
    const [cardData, setCardData] = useState(null);
    const [isDepartments, setisDepartments] = useState(false);
    const [editedDepartments, seteditedDepartments] = useState('');
    const [sections, setSections] = useState([{ name: '', message: '' }]);

    const onSubmit = data => {
        console.log(data);
      };

      const schema = yup.object().shape({
        username: yup.string().required('Username is required'),
      });

      const { register, handleSubmit, formState: { errors } } = useForm({
        resolver: yupResolver(schema),
    });

    const handleEditDepartments = () => {
        setisDepartments(true);
        seteditedDepartments(departments || '');
      };
      const handleDepartmentsChange = (e) => {
        seteditedDepartments(e.target.value);
      };
      const handleSaveDepartment = () => {
        setCardData(prevData => ({
          ...prevData,
          reference: editedDepartments
        }));
        setisDepartments(false);
      };

      const navigate = useNavigate(); 
      const backHandle = () => {   
        navigate("/settings/templates/proposal-templates/");
      };

      const addSection = () => {
        setSections([...sections, { name: '', message: '' }]); 
      };
    
      const removeSection = (index) => {
        setSections(sections.filter((_, i) => i !== index)); 
      };

    return (
        <>
        <div className='content_wrap_main'>
            
        <div className='settings-wrap'>
        <div className="settings-wrapper">
            <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
            <div className='settings-content'>
            <div className={` ${style.templateBoxWrap}`}>
            <BreadCrumbPage backHandle={backHandle} templateName='Proposal Templates' departmentsName={departments || 'No Departments'} /> 
               
                <div className={style.templateHeadBorder}>
                <h1>
                {isDepartments ? (
                  <input
                    type="text"
                    value={editedDepartments}
                    onChange={handleDepartmentsChange}
                    onBlur={handleSaveDepartment}
                    autoFocus
                  />
                ) : (
                  <>
                     {departments}
                    <span> <PencilSquare size={16} color='#106B99' onClick={handleEditDepartments} style={{ cursor: 'pointer' }} /></span>
                  </>
                )}
            </h1>
                </div>
                <div className={style.formTemplateGroup}>
                <form onSubmit={handleSubmit(onSubmit)}>  
               <>
               {sections.map((section, index) => (
        <div key={index} className={style.proposalSetions}>
          <h2>
            Section {index + 1}{' '}
            <span>
              <Trash
                size={16}
                color='#F04438'
                style={{ cursor: 'pointer' }}
                onClick={() => removeSection(index)} // Remove section on click
              />
            </span>
          </h2>
          <Row>
            <Col sm={12}>
              <div className="d-flex flex-column gap-1 mb-4">
                <label className={clsx(style.lable)}>Title</label>
                <IconField>
                  <InputIcon>
                    {errors.name && (
                      <img src={exclamationCircle} className="mb-3" alt="error-icon" />
                    )}
                  </InputIcon>
                  <InputText
                    {...register(`name${index}`)} // Use unique field names for each section
                    className={clsx(style.inputText, { [style.error]: errors[`name${index}`] })}
                    placeholder={`Payment Reminder: Invoice {number}`}
                  />
                </IconField>
                {errors[`name${index}`] && (
                  <p className="error-message">{errors[`name${index}`].message}</p>
                )}
              </div>
            </Col>
            <Col sm={12}>
              <div className="d-flex flex-column gap-1">
                <label className={clsx(style.lable)}>Message</label>
                <Editor
                  value={text}
                  onTextChange={(e) => setText(e.htmlValue)}
                  style={{ height: '407px' }}
                />
                {errors[`description${index}`] && (
                  <p className="error-message">{errors[`description${index}`].message}</p>
                )}
              </div>
            </Col>
          </Row>
        </div>
      ))}
      <div className={style.addNewSections}>
        <Button onClick={addSection}>
          Add New Section <PlusLg size={20} color="#106B99" />
        </Button>
      </div>
               </>
                
                
                 </form>
                </div>  
                 
            </div>
            <Row className='bg-white mt-4 pt-4 pb-4'>
               <Col>
               <Button type="button" className='danger-outline-button' >Delete Template</Button>
               </Col>
              
               <Col className='d-flex justify-content-end align-items-center'>
               <Button type='button'  className='me-2 outline-button'>Cancel</Button>
               <Button type='button' className='solid-button'>Save Template</Button>
               </Col>
               </Row>
            </div>
            
        </div>
        
        </div>
        </div>
        </>
    );
};

export default EditProposal;
