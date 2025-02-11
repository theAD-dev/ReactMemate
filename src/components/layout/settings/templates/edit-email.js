import React, { useState } from 'react';
import Sidebar from '../Sidebar';
import style from './job-template.module.scss';
import BreadCrumbPage from './bread-crumb';
import { useLocation ,useNavigate} from 'react-router-dom';
import { PencilSquare} from "react-bootstrap-icons";
import { Button, Col, Row } from 'react-bootstrap';
import clsx from 'clsx';
import { IconField } from "primereact/iconfield";
import { InputIcon } from "primereact/inputicon";
import { InputText } from "primereact/inputtext";
import { useForm } from 'react-hook-form';
import exclamationCircle from "../../../../assets/images/icon/exclamation-circle.svg";
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { InputTextarea } from "primereact/inputtextarea"
import { Editor } from "primereact/editor";


const EditEmail = () => {
    const [activeTab, setActiveTab] = useState('email-templates');
    const location = useLocation();
    const [ingredient, setIngredient] = useState('');
    const [text, setText] = useState('');
    const { departments } = location.state || {};
    const [cardData, setCardData] = useState(null);
    const [isDepartments, setisDepartments] = useState(false);
    const [editedDepartments, seteditedDepartments] = useState('');
   

    const onSubmit = data => {
        console.log(data);
      };

      const schema = yup.object().shape({
        username: yup.string().required('Username is required'),
      });

  
      const { control, register, handleSubmit, setValue, formState: { errors } } = useForm({
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
        navigate("/settings/templates/email-templates/");
      };

    return (
        <>
        <div className='content_wrap_main'>
            
        <div className='settings-wrap'>
        <div className="settings-wrapper">
            <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
            <div className='settings-content'>
            <div className={` ${style.templateBoxWrap}`}>
            <BreadCrumbPage backHandle={backHandle} templateName='Email Templates' departmentsName={departments || 'No Departments'} /> 
               
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
                
                <Row>
            
             <Col sm={12}>
            <div className="d-flex flex-column gap-1 mb-4">
                 <label className={clsx(style.lable)}>Subject</label>
                 <IconField>
                 <InputIcon>{errors.name && <img src={exclamationCircle} className='mb-3' alt='error-icon' />}</InputIcon>
                 <InputText {...register("name")} className={clsx(style.inputText, { [style.error]: errors.name })} placeholder='Enter subject' />
                 </IconField>
                 {errors.name && <p className="error-message">{errors.name.message}</p>}
             </div>
             </Col>
            
             <Col sm={12}>
                     <div className="d-flex flex-column gap-1">
                         <label className={clsx(style.lable)}>Message </label>
                         <Editor value={text} onTextChange={(e) => setText(e.htmlValue)} style={{ height: '320px' }} />
                         {errors.description && <p className="error-message">{errors.description.message}</p>}
                     </div>
                 </Col>
            
                </Row>
 
                
                
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
}

export default EditEmail;
