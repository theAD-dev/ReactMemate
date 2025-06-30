import React, { useEffect, useState } from 'react';
import { PencilSquare } from 'react-bootstrap-icons';
import { Helmet } from 'react-helmet-async';
import { useForm, Controller } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { yupResolver } from '@hookform/resolvers/yup';
import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { Dialog } from 'primereact/dialog';
import { Dropdown } from 'primereact/dropdown';
import * as yup from 'yup';
import style from './accounting.module.scss';
import { useTrialHeight } from '../../../../app/providers/trial-height-provider';
import { useIndustryServiceGetQuery, useXeroCodesGetQuery } from '../../../../entities/setting/accounting/department-turnover-plan/models/get-accounting-list.query';
import { useIndustryServiceUpdateMutations } from '../../../../entities/setting/accounting/department-turnover-plan/models/update-accounting-target.mutation';

const schema = yup.object().shape({
  code: yup.string().required('Code is required'),
});

function IndustryService() {
  const { trialHeight } = useTrialHeight();
  const [selectedData, setSelectedData] = useState(null);
  const [visible, setVisible] = useState(false);
  const [industryService, setIndustryService] = useState([]);
  const industryServiceQuery = useIndustryServiceGetQuery();
  const xeroCodesQuery = useXeroCodesGetQuery();

  const { control, handleSubmit, setValue, formState: { errors } } = useForm({
    resolver: yupResolver(schema),
  });

  const onEdit = (rowData) => {
    setSelectedData(rowData);
    setValue('code', rowData.code);
    setVisible(true);
  };

  const onCancel = () => {
    setVisible(false);
    setValue('code', '');
    setSelectedData(null);
  };

  useEffect(() => {
    if (industryServiceQuery?.data) {
      const services = industryServiceQuery?.data.flatMap(industry =>
        industry.services.map(service => ({
          ...service,
          industryId: industry.id,
          industryName: industry.name,
          industryIcon: industry.icon
        }))
      );
      setIndustryService(services);
    }
  }, [industryServiceQuery?.data]);

  const { mutate: updateTarget, isPending } = useIndustryServiceUpdateMutations();

  const onSubmit = (data) => {
    updateTarget({ id: selectedData?.id, data: { code: data.code } }, {
      onSuccess: () => {
        onCancel();
        industryServiceQuery.refetch();
      }
    });
  };

  const headerElement = (
    <div className={`${style.modalHeader}`}>
      <div className="d-flex align-items-center gap-2">
        <div className={style.circledesignstyle}>
          <div className={style.out}>
            <PencilSquare size={24} color="#17B26A" className='mb-3' />
          </div>
        </div>
        <span className={`white-space-nowrap ${style.headerTitle}`}>
          Edit Code
        </span>
      </div>
    </div>
  );

  const codeBodyTemplate = (rowData) => {
    return <div className='d-flex align-items-center justify-content-center show-on-hover gap-3'>
      <span>{rowData.code}</span>
      <Button label="Edit" onClick={() => onEdit(rowData)} className='primary-text-button ms-3 show-on-hover-element not-show-checked' text />
    </div>;
  };

  return (
    <>
      <Helmet>
        <title>MeMate - Expenses Account</title>
      </Helmet>
      <div className='headSticky'>
        <h1>Accounting</h1>
        <div className='contentMenuTab'>
          <ul>
            <li><Link to="/settings/accounting/department-turnover-plan">Department Turnover Plan</Link></li>
            <li className='menuActive'><Link to="/settings/accounting/industry-service">Industry Service</Link></li>
            <li><Link to="/settings/accounting/account-code">Account Code</Link></li>
          </ul>
        </div>
      </div>
      <div className={`content_wrap_main w-100`} style={{ paddingBottom: `${trialHeight}px` }}>
        <div className='content_wrapper w-100'>
          <div className="listwrapper">
            <div className="topHeadStyle pb-3">
              <h2>Industry Service</h2>
            </div>

            <DataTable className='w-100' showGridlines rowGroupMode="rowspan" groupRowsBy="industryName" value={industryService || []} tableStyle={{ minWidth: '100%', border: '1px solid #f2f2f2' }}>
              <Column field="industryName" header="Industry"></Column>
              <Column field="name" header="Service"></Column>
              <Column field='description' header="Description"></Column>
              <Column field="code" header="Code" body={codeBodyTemplate}></Column>
            </DataTable>

            <Dialog visible={visible} modal={true} header={headerElement} className={`${style.modal} custom-modal`} onHide={() => setVisible(false)}>
              <form onSubmit={handleSubmit(onSubmit)}>
                <div className="d-flex flex-column mb-4">
                  <h6 className='mb-3' style={{ fontSize: '16px', color: '#1D2939', fontWeight: 600 }}>{selectedData?.name}</h6>
                  <p className="font-14 mb-1" style={{ color: '#475467', fontWeight: 500 }}>Code</p>
                  <Controller
                    name="code"
                    control={control}
                    render={({ field }) => (
                      <Dropdown
                        {...field}
                        options={xeroCodesQuery?.data?.map(code => ({
                          value: code.code,
                          label: `${code.code} - ${code.name}`
                        })) || []}
                        onChange={(e) => field.onChange(e.value)}
                        placeholder="Select Code"
                        filter
                        scrollHeight="400px"
                      />
                    )}
                  />
                  {errors.code && <small className="p-error">{errors.code.message}</small>}
                </div>
                <hr />
                <div className='d-flex justify-content-end gap-2 mt-3'>
                  <Button className='outline-button' onClick={onCancel}>Cancel</Button>
                  <Button className='solid-button' style={{ minWidth: '132px' }} type="submit" loading={isPending}>Save Details</Button>
                </div>
              </form>
            </Dialog>
          </div>
        </div>
      </div>
    </>
  );
}

export default IndustryService;