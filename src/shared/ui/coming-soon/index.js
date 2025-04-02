import React from 'react';
import style from './coming-soon.module.scss';

const ComingSoon = () => {
  return (
    <div className='w-100 h-100 d-flex flex-column justify-content-center align-items-center'>
      <h1 className={style.heading}>coming soon</h1>
      <p className={style.paragraph}>We couldn't wait to launch our updated website, so some features are still under<br/> construction. Stay tuned—exciting new updates are coming soon!</p>
      <img src='/comingsoonPic.png' className={style.img}/>
    </div>
  );
};

export default ComingSoon;