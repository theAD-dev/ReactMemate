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



const EditTemplates = () => {
    const [activeTab, setActiveTab] = useState('job-templates');
    const location = useLocation();
    const [ingredient, setIngredient] = useState('');

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
        navigate("/settings/templates/job-templates/");
      };

    return (
        <>
        <div className='content_wrap_main'>
            
        <div className='settings-wrap'>
        <div className="settings-wrapper">
            <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
            <div className='settings-content'>
            <div className={` ${style.templateBoxWrap}`}>
            <BreadCrumbPage backHandle={backHandle} departmentsName={departments || 'No Departments'} /> 
               
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
                <InputText {...register("name")} className={clsx(style.inputText, { [style.error]: errors.name })} placeholder='Type Subject' />
                </IconField>
                {errors.name && <p className="error-message">{errors.name.message}</p>}
            </div>
            </Col>
           
            <Col sm={12}>
                    <div className="d-flex flex-column gap-1">
                        <label className={clsx(style.lable)}>Message </label>
                        <IconField>
                            <InputIcon style={{ top: '80%' }}>{errors.description && <img src={exclamationCircle} />}</InputIcon>
                            <InputTextarea {...register("description")} rows={5} cols={30} className={clsx(style.inputText, { [style.error]: errors.description })} style={{ resize: 'none' }} placeholder='Enter a description...' />
                        </IconField>
                        {errors.description && <p className="error-message">{errors.description.message}</p>}
                    </div>
                </Col>
            <Col sm={12}>
            <div className="card flex justify-content-center">
            <label className={clsx(style.lable1)}>Time / Money </label>
            <div className={style.paymentType}>
    <label className={clsx(style.lable)}>Payment Type</label>
    <div className={style.paymentmain}>
        <div className={`flex align-items-center ${style.RadioButton}`}>
            <input
                type="radio"
                id="fix"
                name="paymentype"
                value="fix"
                onChange={(e) => setIngredient(e.target.value)}
                checked={ingredient === 'fix'}
                className={style.customRadio}
            />
            <label htmlFor="fix" className={style.radioLabel}>Fix</label>
        </div>
        <span>or</span>
        <div className={`flex align-items-center ${style.RadioButton}`}>
            <input
                type="radio"
                id="hours"
                name="paymentype"
                value="hours"
                onChange={(e) => setIngredient(e.target.value)}
                checked={ingredient === 'hours'}
                className={style.customRadio}
            />
            <label htmlFor="hours" className={style.radioLabel}>Hours</label>
        </div>
        <span>or</span>
        <div className={`flex align-items-center ${style.RadioButton}`}>
            <input
                type="radio"
                id="timetracker"
                name="paymentype"
                value="timetracker"
                onChange={(e) => setIngredient(e.target.value)}
                checked={ingredient === 'timetracker'}
                className={style.customRadio}
            />
            <label htmlFor="timetracker" className={style.radioLabel}>Time Tracker</label>
        </div>
    </div>
</div>
           
            <div className={`${style.typeBorder} ${style.paymentType}`}>
    <label className={clsx(style.lable)}>Time</label>
    <div className={style.paymentmain}>
        <div className={`flex align-items-center ${style.RadioButton}`}>
            <input
                type="radio"
                id="shift"
                name="paymentype"
                value="shift"
                onChange={(e) => setIngredient(e.target.value)}
                checked={ingredient === 'shift'}
                className={style.customRadio}
            />
            <label htmlFor="shift" className={style.radioLabel}>Shift</label>
        </div>
        <span>or</span>
        <div className={`flex align-items-center ${style.RadioButton}`}>
            <input
                type="radio"
                id="timeframe"
                name="paymentype"
                value="timeframe"
                onChange={(e) => setIngredient(e.target.value)}
                checked={ingredient === 'timeframe'}
                className={style.customRadio}
            />
            <label htmlFor="timeframe" className={style.radioLabel}>Time Frame</label>
        </div>
       
    </div>
</div>
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

export default EditTemplates;
