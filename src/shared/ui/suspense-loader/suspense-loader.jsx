import { useEffect } from 'react';
import { Spinner } from 'react-bootstrap';
import NProgress from 'nprogress';
import style from './suspense-loader.module.scss';

function SuspenseLoader() {
  useEffect(() => {
    NProgress.start();

    return () => {
      NProgress.done();
    };
  }, []);

  return (
    <div className={style.box}>
      <div className={style.innerBox}>
        <Spinner animation="border" className={style.spinnerSize} role="status"/>
      </div>
    </div>
  );
}

export default SuspenseLoader;