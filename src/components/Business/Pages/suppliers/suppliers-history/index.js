import React, { useRef, useState } from 'react';
import { BoxArrowLeft, ChevronLeft, Download } from 'react-bootstrap-icons';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Button } from 'primereact/button';
import { useDebounce } from 'primereact/hooks';
import { Sidebar } from 'primereact/sidebar';
import { toast } from 'sonner';
import SupplierHistoryTable from './supplier-history-table';
import style from './supplier-history.module.scss';
import { getSupplierById } from '../../../../../APIs/SuppliersApi';
import SupplierLoadingSidebar from '../../../features/supliers-features/supplier-loading-sidebar';
import SupplierView from '../../../features/supliers-features/supplier-view';



const SupplierHistoryPage = () => {
  const navigate = useNavigate();
  const dt = useRef(null);
  const { id } = useParams();
  const [visible, setVisible] = useState(true);
  const [selected, setSelected] = useState(null);
  const [inputValue, debouncedValue, setInputValue] = useDebounce('', 400);

  const supplierDetails = useQuery({ queryKey: ['supplier-read', id], queryFn: () => getSupplierById(id), enabled: !!id, retry: 1, cacheTime: 0 });

  // Listen for global search result events to open sidebar
  React.useEffect(() => {
    const handleSearchResult = (event) => {
      const { type } = event.detail;
      if (type === 'supplier') {
        setVisible(true);
      }
    };

    window.addEventListener('openSearchResult', handleSearchResult);
    return () => {
      window.removeEventListener('openSearchResult', handleSearchResult);
    };
  }, []);

  const exportCSV = (selectionOnly) => {
    if (dt.current) {
      dt.current.exportCSV({ selectionOnly });
    } else {
      console.error('DataTable ref is null');
    }
  };

  if (supplierDetails?.error?.message === "Not found") {
    toast.error('Supplier not found');
    navigate('/suppliers');
  }
  return (
    <div className='supplier-order-history-page'>
      <div className='client-order-history' style={{ width: visible ? 'calc(100% - 559px)' : '100%' }}>
        <div className={`topbar ${selected?.length ? style.active : ''}`} style={{ padding: '4px 32px 4px 23px', position: 'relative', height: '48px' }}>
          <div className='left-side d-flex align-items-center' style={{ gap: '16px' }}>
            {
              selected?.length ? (
                <>
                  <h6 className={style.selectedCount}>Selected: {selected?.length}</h6>
                  <div className='filtered-box'>
                    <button className={`${style.filterBox}`} onClick={() => exportCSV(true)}><Download /></button>
                  </div>
                </>
              ) : (
                <>
                  <Link to={"/suppliers"} className={`${style.gobackBtn}`}><ChevronLeft size={17} />Back</Link>
                  <div className="searchBox" style={{ position: 'relative' }}>
                    <div style={{ position: 'absolute', top: '2px', left: '6px' }}>
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                        <path d="M14.6777 12.9299C15.6661 11.5841 16.25 9.92275 16.25 8.125C16.25 3.63769 12.6123 0 8.125 0C3.63769 0 0 3.63769 0 8.125C0 12.6123 3.63769 16.25 8.125 16.25C9.92323 16.25 11.585 15.6658 12.9309 14.6769L12.9299 14.6777C12.9667 14.7277 13.0078 14.7756 13.053 14.8208L17.8661 19.6339C18.3543 20.122 19.1457 20.122 19.6339 19.6339C20.122 19.1457 20.122 18.3543 19.6339 17.8661L14.8208 13.053C14.7756 13.0078 14.7277 12.9667 14.6777 12.9299ZM15 8.125C15 11.922 11.922 15 8.125 15C4.32804 15 1.25 11.922 1.25 8.125C1.25 4.32804 4.32804 1.25 8.125 1.25C11.922 1.25 15 4.32804 15 8.125Z" fill="#98A2B3" />
                      </svg>
                    </div>
                    <input type="text" placeholder="Search" value={inputValue} onChange={(e) => setInputValue(e.target.value)} className="border search-resource" style={{ borderRadius: '4px', width: '184px', border: '1px solid #D0D5DD', color: '#424242', paddingLeft: '36px', fontSize: '14px', height: '32px' }} />
                  </div>
                </>
              )
            }
          </div>

          <div className="featureName d-flex align-items-center" style={{ position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%, -50%)' }}>
            <h1 onClick={() => { setVisible(true); }} className={`${style.supplierName} m-0 p-0 cursor-pointer`} title={supplierDetails?.data?.name}>{supplierDetails?.data?.name || ""}</h1>
          </div>
          <div className="right-side d-flex align-items-center" style={{ gap: '8px' }}>
            <Button label={
              <>
                <BoxArrowLeft color='#1ab2ff' size={20} /> &nbsp; <span style={{ position: 'relative', top: '2px' }}>Open</span>
              </>
            } onClick={() => setVisible(true)} className='primary-text-button' text />
          </div>
        </div>
        <SupplierHistoryTable ref={dt} selected={selected} setSelected={setSelected} />
      </div>
      <Sidebar visible={visible} position="right" onHide={() => setVisible(false)} modal={false} dismissable={false} style={{ width: '559px' }}
        content={({ closeIconRef, hide }) => (
          <>
            {
              supplierDetails?.isLoading
                ? <SupplierLoadingSidebar closeIconRef={closeIconRef} hide={hide} />
                : <SupplierView data={supplierDetails?.data} refetch={supplierDetails.refetch} closeIconRef={closeIconRef} hide={hide} />
            }
          </>
        )}
      ></Sidebar>
    </div>
  );
};

export default SupplierHistoryPage;