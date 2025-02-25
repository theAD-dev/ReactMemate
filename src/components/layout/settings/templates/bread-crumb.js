import React from 'react';
import { ChevronLeft,HouseDoor ,SlashLg} from "react-bootstrap-icons";
import { BreadCrumb } from 'primereact/breadcrumb';
import style from './job-template.module.scss';

const BreadCrumbPage = ({ backHandle,templateName }) => {
  const GobackHandle = () => {   
    backHandle();
  };

  const items = [
   
    { label: templateName },
   
    { 
      label: '[ Template Name ] ',
      template: () => <span className={style.activeLinkbread}>[ Template Name ] </span>
    }
  ];



  return (
    <div className={style.breadcrumbWrap}>
      <a onClick={GobackHandle} className={`cursor-pointer flex align-items-center ${style.gobackBut}`}>
      <ChevronLeft color="#475467" size={20} /> Go Back
        </a>
      <a href="/" className={style.readcrumbChevron}>
      <HouseDoor color="#475467" size={20} /> 
     
      </a>
      <span className={style.readcrumbChevron}>  <SlashLg color="#D0D5DD" size={20} />  </span> 
      {items.map((item, index) => (
        <React.Fragment key={index}>
          {item.template ? (
            item.template()
          ) : (
            <span className={style.MenuitemText}>{item.label}</span>
          )}
    
          {index < items.length - 1 && (
          <span className={style.readcrumbChevron}>  <SlashLg color="#D0D5DD" size={20} />  </span> 
          )}
        </React.Fragment>
      ))}
    </div>
  );
};

export default BreadCrumbPage;
