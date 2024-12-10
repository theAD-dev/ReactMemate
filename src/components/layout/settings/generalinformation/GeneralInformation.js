import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import exclamationCircle from "../../../../assets/images/icon/exclamation-circle.svg";
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { SettingsGeneralInformation, updateGeneralInformation } from '../../../../APIs/SettingsGeneral';
import { Link, useNavigate } from 'react-router-dom';
import Sidebar from '.././Sidebar';
import styles from "./general.module.scss";
import { PencilSquare, Telephone, Building, Link45deg, Upload } from "react-bootstrap-icons";
import AvatarImg from "../../../../assets/images/img/Avatar.png";
import FileUploader from '../../../../ui/file-uploader/file-uploader';
import { toast } from 'sonner';
import { Spinner } from 'react-bootstrap';

const schema = yup.object().shape({
  legal_name: yup.string().required('Company Legal Name is required'),
  trading_name: yup.string(),
  abn: yup.string(),
  main_email: yup.string().email('Invalid email').required('Main Company Email is required'),
  main_phone: yup.string(),
  address: yup.string(),
  state: yup.string(),
  postcode: yup.string(),
  company_logo: yup.mixed().nullable(),

});

function GeneralInformation() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState('generalinformation');
  const [isEditingGroup, setIsEditingGroup] = useState(false);
  const [photo, setPhoto] = useState({});
  const { register, handleSubmit, formState: { errors }, reset } = useForm({
    resolver: yupResolver(schema),
  });

  const { data, isLoading, error } = useQuery({
    queryKey: ['generalInfo'],
    queryFn: SettingsGeneralInformation,
    onSuccess: (data) => {
      reset(data);
    },
    onError: (error) => {
      console.error('Error fetching data:', error);
    },
  });



  const mutation = useMutation({
    mutationFn: (data) => updateGeneralInformation(data, photo),
    onSuccess: () => {
      window.location.reload();
      toast.success(`Company Information updated successfully`);
    },
  });

  const onSubmit = (data) => {
    mutation.mutate({ ...data });
  };

  if (isLoading || error) return <div style={{ position: 'fixed', top: '50%', left: '50%', background: 'white', width: '60px', height: '60px', borderRadius: '4px', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 10 }} className="shadow-lg">
    <Spinner animation="border" role="status">
      <span className="visually-hidden">Loading...</span>
    </Spinner>
  </div>;


  const handleEditGroup = () => {
    setIsEditingGroup(true);

  };



  return (
    <form onSubmit={handleSubmit(onSubmit)}>

      <div className='settings-wrap'>
        <div className="settings-wrapper">
          <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
          <div className="settings-content">
            <div className='headSticky'>
              <h1>Company Information </h1>
              <div className='contentMenuTab'>
                <ul>
                  <li className='menuActive'><Link to="/settings/generalinformation">General Information</Link></li>
                  <li><Link to="/settings/generalinformation/bank-details">Bank Details </Link></li>
                  <li><Link to="/settings/generalinformation/region-and-language">Region & Language</Link></li>
                </ul>
              </div>
            </div>
            <div className={`content_wrap_main ${isEditingGroup ? 'isEditingwrap' : ''}`}>
              <div className='content_wrapper'>
                <div className="listwrapper">
                  <div className="topHeadStyle">
                    <div className=''>
                      <h2>General Information</h2>
                      {!isEditingGroup ? (
                        <></>
                      ) : (
                        <p>Lorem Ipsum dolores</p>
                      )}
                    </div>

                    {!isEditingGroup && (
                      <Link to="#" onClick={handleEditGroup}>Edit<PencilSquare color="#344054" size={20} /></Link>
                    )}
                  </div>

                  <ul>
                    <li className={`${isEditingGroup ? `${styles.editBorderWrap}` : `${styles.viewBorderWrap}`}`}>
                      <div className={styles.editinfo}>
                        <span>Company Legal Name</span>
                        {!isEditingGroup ? (
                          <strong>{data?.legal_name} </strong>
                        ) : (
                          <>
                            <div className={`inputInfo ${errors?.legal_name ? 'error-border' : ''}`}>
                              <input
                                {...register("legal_name")}
                                placeholder='Enter company legal name'
                                defaultValue={data?.legal_name}
                              />
                              {errors?.legal_name && <img className="ExclamationCircle" src={exclamationCircle} alt="Exclamation Circle" />}
                            </div>
                            {errors?.legal_name && <p className="error-message">{errors?.legal_name?.message}</p>}
                          </>
                        )}
                      </div>
                      {!isEditingGroup ? (
                        <>
                        </>
                      ) : (
                        <div className={styles.editpara}>
                          <p>Please provide the complete legal name of your company, as it will be displayed on outgoing documentation.</p>
                        </div>
                      )}
                    </li>
                    <li className={`${isEditingGroup ? `${styles.editBorderWrap}` : `${styles.viewBorderWrap}`}`}>
                      <div className={styles.editinfo}>
                        <span>Company Trading name</span>
                        {!isEditingGroup ? (
                          <strong>{data.trading_name} </strong>
                        ) : (
                          <>
                            <div className={`inputInfo ${errors.trading_name ? 'error-border' : ''}`}>
                              <input
                                {...register("trading_name")}
                                placeholder='Enter Trading Name'
                                defaultValue={data.trading_name}
                              />
                              {errors.trading_name && <img className="ExclamationCircle" src={exclamationCircle} alt="Exclamation Circle" />}
                            </div>
                            {errors.trading_name && <p className="error-message">{errors.trading_name.message}</p>}
                          </>
                        )}
                      </div>
                      {!isEditingGroup ? (
                        <>
                        </>
                      ) : (
                        <div className={styles.editpara}>
                          <p>Please enter a trading name. This will be displayed when you communicate with contractors, clients, and suppliers.</p>
                        </div>
                      )}
                    </li>
                    <li className={`${isEditingGroup ? `${styles.editBorderWrap}` : `${styles.viewBorderWrap}`}`}>
                      <div className={styles.editinfo}>
                        <span>ABN</span>
                        {!isEditingGroup ? (
                          <strong>{data.abn} </strong>
                        ) : (
                          <>
                            <div className={`inputInfo ${errors.abn ? 'error-border' : ''}`}>
                              <input
                                {...register("abn")}
                                placeholder='Enter ABN'
                                defaultValue={data.abn}
                              />
                              {errors.abn && <img className="ExclamationCircle" src={exclamationCircle} alt="Exclamation Circle" />}
                            </div>
                            {errors.abn && <p className="error-message">{errors.abn.message}</p>}
                          </>
                        )}
                      </div>
                      {!isEditingGroup ? (
                        <>
                        </>
                      ) : (
                        <div className={styles.editpara}>
                          <p>Please input Active Business Number</p>
                        </div>
                      )}
                    </li>
                    <li className={`${isEditingGroup ? `${styles.editBorderWrap}` : `${styles.viewBorderWrap}`}`}>
                      <div className={styles.editinfo}>
                        <span>Main Company Email</span>
                        {!isEditingGroup ? (
                          <strong>{data.main_email} <Link45deg color="#158ECC" size={20} /></strong>
                        ) : (
                          <>
                            <div className={`inputInfo ${errors.main_email ? 'error-border' : ''}`}>
                              <input
                                {...register("main_email")}
                                placeholder='Enter Email'
                                defaultValue={data.main_email}
                              />
                              {errors.main_email && <img className="ExclamationCircle" src={exclamationCircle} alt="Exclamation Circle" />}
                            </div>
                            {errors.main_email && <p className="error-message">{errors.main_email.message}</p>}
                          </>
                        )}
                      </div>
                      {!isEditingGroup ? (
                        <>
                        </>
                      ) : (
                        <div className={styles.editpara}>
                          <p>Insert emails which will be used to send all your automatic outgoing emails and notifications.</p>
                        </div>
                      )}
                    </li>
                    <li className={`${isEditingGroup ? `${styles.editBorderWrap}` : `${styles.viewBorderWrap}`}`}>
                      <div className={styles.editinfo}>
                        <span>Main Company Phone Number</span>
                        {!isEditingGroup ? (
                          <strong>{data.main_phone} <Telephone color="#158ECC" size={20} /></strong>
                        ) : (
                          <>
                            <div className={`inputInfo ${errors.main_phone ? 'error-border' : ''}`}>
                              <input
                                {...register("main_phone")}
                                placeholder='Enter Phone Number'
                                defaultValue={data.main_phone}
                              />
                              {errors.main_phone && <img className="ExclamationCircle" src={exclamationCircle} alt="Exclamation Circle" />}
                            </div>
                            {errors.main_phone && <p className="error-message">{errors.main_phone.message}</p>}
                          </>
                        )}
                      </div>
                      {!isEditingGroup ? (
                        <>
                        </>
                      ) : (
                        <div className={styles.editpara}>
                          <p>Insert emails which will be used to send all your automatic outgoing emails and notifications.</p>
                        </div>
                      )}
                    </li>
                    <li className={`${isEditingGroup ? `${styles.editBorderWrap}` : `${styles.viewBorderWrap}`}`}>
                      <div className={styles.editinfo}>
                        <span>Street Address</span>
                        {!isEditingGroup ? (
                          <strong>{data.address}</strong>
                        ) : (
                          <>
                            <div className={`inputInfo ${errors.address ? 'error-border' : ''}`}>
                              <input
                                {...register("address")}
                                placeholder='Enter Address'
                                defaultValue={data.address}
                              />
                              {errors.address && <img className="ExclamationCircle" src={exclamationCircle} alt="Exclamation Circle" />}
                            </div>
                            {errors.address && <p className="error-message">{errors.address.message}</p>}
                          </>
                        )}
                      </div>
                      {!isEditingGroup ? (
                        <>
                        </>
                      ) : (
                        <div className={styles.editpara}>
                          <p></p>
                        </div>
                      )}
                    </li>
                    <li className={`${isEditingGroup ? `${styles.editBorderWrap}` : `${styles.viewBorderWrap}`}`}>
                      <div className={styles.editinfo}>
                        <span>State</span>
                        {!isEditingGroup ? (
                          <strong>{data.state}</strong>
                        ) : (
                          <>
                            <div className={`inputInfo ${errors.state ? 'error-border' : ''}`}>
                              <input
                                {...register("state")}
                                placeholder='Enter state'
                                defaultValue={data.state}
                              />
                              {errors.state && <img className="ExclamationCircle" src={exclamationCircle} alt="Exclamation Circle" />}
                            </div>
                            {errors.state && <p className="error-message">{errors.state.message}</p>}
                          </>
                        )}
                      </div>
                      {!isEditingGroup ? (
                        <>
                        </>
                      ) : (
                        <div className={styles.editpara}>
                          <p></p>
                        </div>
                      )}
                    </li>
                    <li className={`${isEditingGroup ? `${styles.editBorderWrap}` : `${styles.viewBorderWrap}`}`}>
                      <div className={styles.editinfo}>
                        <span>Postcode</span>
                        {!isEditingGroup ? (
                          <strong>{data.postcode}</strong>
                        ) : (
                          <>
                            <div className={`inputInfo ${errors.postcode ? 'error-border' : ''}`}>
                              <input
                                {...register("postcode")}
                                placeholder='Enter postcode'
                                defaultValue={data.postcode}
                              />
                              {errors.postcode && <img className="ExclamationCircle" src={exclamationCircle} alt="Exclamation Circle" />}
                            </div>
                            {errors.postcode && <p className="error-message">{errors.postcode.message}</p>}
                          </>
                        )}
                      </div>
                      {!isEditingGroup ? (
                        <>
                        </>
                      ) : (
                        <div className={styles.editpara}>
                          <p></p>
                        </div>
                      )}
                    </li>
                    <li className={`${isEditingGroup ? `${styles.editBorderWrap}` : `${styles.viewBorderWrap}`}`}>
                      <div className={styles.editinfo}>
                        <span>Company Logo for Documentation</span>
                        {!isEditingGroup ? (
                          <strong>
                            {data.company_logo ? (
                              <img src={data.company_logo} width={76} alt="Company Logo" />
                            ) : (
                              <img src={AvatarImg} alt="DummyImg" />
                            )}
                          </strong>
                        ) : (

                          <div className="upload-btn-wrapper">
                            <FileUpload photo={photo} data={data} setPhoto={setPhoto} />
                          </div>
                        )}
                      </div>

                      {!isEditingGroup ? (
                        <>
                        </>
                      ) : (

                        <div className={styles.editpara}>
                          <div className='logo'>
                            <h5>Company logo</h5>
                            <p>Upload the logo for your unique quotes and invoices.</p>
                          </div>

                        </div>

                      )}

                    </li>

                  </ul>
                </div>

              </div>
            </div>
            {isEditingGroup && (
              <div className='updateButtonGeneral'>
                <button className="cancel" >Cancel</button>
                <button type="submit" className="save mr-3" disabled={mutation.isLoading}>
                  {mutation.isLoading ? 'Updating...' : 'Update'}
                </button>

              </div>
            )}
          </div>
        </div>
      </div>


      {/* 
        {mutation.isError && <div>Error updating data</div>}
        {mutation.isSuccess && <div>Data updated successfully</div>} */}

    </form>
  );
}



function FileUpload({ photo, setPhoto, data }) {
  const [show, setShow] = useState(false);

  return (
    <section className="container mb-3" style={{ marginTop: '24px', padding: '0px' }}>
      {/* <label className='mb-2' style={{ color: '#475467', fontSize: '14px', fontWeight: '500' }}>App Logo</label> */}
      <div className='d-flex justify-content-center align-items-center flex-column' style={{ width: '100%', minHeight: '126px', padding: '16px', background: '#fff', borderRadius: '4px', border: '1px solid #D0D5DD' }}>
        {
          photo?.croppedImageBase64 ? (
            <div className='text-center'>
              <img
                alt='uploaded-file'
                src={photo?.croppedImageBase64}
                style={{ width: '64px', height: '64px', marginBottom: '12px' }}
              />
            </div>
          ) : (
            <button type='button' onClick={() => setShow(true)} className='d-flex justify-content-center align-items-center' style={{ width: '40px', height: '40px', padding: '2px', border: '1px solid #EAECF0', background: '#fff', borderRadius: '4px', marginBottom: '16px' }}>
              {data?.company_logo ? (
                <div
                  style={{
                    width: '64px',
                    height: '64px',
                    borderRadius: '50%',
                    overflow: 'hidden',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                >
                  <img
                    src={data?.company_logo}
                    style={{ width: '100%' }}
                    alt="Uploaded Photo"
                  />
                </div>
              ) : (
                <Upload />
              )}
            </button>
          )
        }
        <p className='mb-0' style={{ color: '#475467', fontSize: '14px' }}><span style={{ color: '#1AB2FF', fontWeight: '600', cursor: 'pointer' }} onClick={() => setShow(true)}>Click to upload</span></p>
        <span style={{ color: '#475467', fontSize: '12px' }}>SVG, PNG, JPG or GIF (max. 800x400px)</span>
      </div>
      <FileUploader show={show} setShow={setShow} setPhoto={setPhoto} />
    </section>
  );
}
export default GeneralInformation;
