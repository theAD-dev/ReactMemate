import React from 'react';
import { BreadCrumb } from 'primereact/breadcrumb';

const BreadCrumbPage = ({ backHandle }) => {
  const GobackHandle = () => {   
    backHandle();
  };

  const items = [
    { 
      label: 'Go Back',
      template: () => (
        <a onClick={GobackHandle} className="text-primary font-semibold cursor-pointer">
          Go Back
        </a>
      )
    },
    { label: 'Components' },
    { label: 'Form' },
    { 
      label: 'InputText',
      template: () => <span className="text-primary font-semibold">InputText</span>
    }
  ];

  const home = { icon: 'pi pi-home', url: 'https://primereact.org' };

  return (
    <div className="p-breadcrumb p-component">
      
      <a href="https://primereact.org" className="p-menuitem-link">
        <span className="pi pi-home"></span>
      </a>
     
      <span className="p-breadcrumb-chevron"> / </span>

   
      {items.map((item, index) => (
        <React.Fragment key={index}>
          {item.template ? (
            item.template()
          ) : (
            <span className="p-menuitem-text">{item.label}</span>
          )}
    
          {index < items.length - 1 && (
            <span className="p-breadcrumb-chevron"> / </span>
          )}
        </React.Fragment>
      ))}
    </div>
  );
};

export default BreadCrumbPage;
