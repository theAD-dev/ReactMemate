import { useEffect } from 'react';
import NProgress from 'nprogress';
import { ProgressSpinner } from 'primereact/progressspinner';

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
        <ProgressSpinner className={style.spinnerSize} />
      </div>
    </div>
  );
}

export default SuspenseLoader;