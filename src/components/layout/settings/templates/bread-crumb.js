import * as React from 'react';
import Typography from '@mui/material/Typography';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Link from '@mui/material/Link';
import HomeIcon from '@mui/icons-material/Home';
import { ChevronLeft,HouseDoor} from "react-bootstrap-icons";
import { Button } from 'react-bootstrap';
import style from './job-template.module.scss';

function handleClick(event) {
  event.preventDefault();
  console.info('You clicked a breadcrumb.');
}

export default function BreadCrumbPage({departmentsName}) {
  return (
    <div className={style.breadCrumbTemp} role="presentation" onClick={handleClick}>
      <Breadcrumbs aria-label="breadcrumb">
      <Link to='/job-templates' className={style.gobackBut}><ChevronLeft color="#475467" size={20} /> Go Back</Link>
        <Link
          underline="hover"
          sx={{ display: 'flex', alignItems: 'center' }}
          color="inherit"
          href="/"
        >
         <HouseDoor color="#475467" size={20} />
          
        </Link>
        <Link
          underline="hover"
          sx={{ display: 'flex', alignItems: 'center' }}
          color="inherit"
          href="#"
        >
         
         Templates
        </Link>
        <Typography className={style.activeDepartment}
          sx={{ color: 'text.primary', display: 'flex', alignItems: 'center' }}
        >
         
         {departmentsName}
        </Typography>
      </Breadcrumbs>
    </div>
  );
}
