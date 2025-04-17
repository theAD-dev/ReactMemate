import React, { useEffect, useState } from "react";
import { Spinner } from "react-bootstrap";
import {
  PencilSquare,
  Telephone,
  Link45deg,
  Upload,
} from "react-bootstrap-icons";
import { Helmet } from "react-helmet-async";
import { Controller, useForm } from "react-hook-form";
import { PhoneInput } from "react-international-phone";
import { Link } from "react-router-dom";
import { yupResolver } from "@hookform/resolvers/yup";
import { useQuery, useMutation } from "@tanstack/react-query";
import * as yup from "yup";
import styles from "./setting.profile.module.scss";
import Sidebar from "./Sidebar";
import { fetchProfile, updateProfile } from "../../../APIs/ProfileApi";
import { useTrialHeight } from "../../../app/providers/trial-height-provider";
import exclamationCircle from "../../../assets/images/icon/exclamation-circle.svg";
import ChangePassword from "../../../features/settings/profile/change-passowrd/change-password";
import { FallbackImage } from "../../../shared/ui/image-with-fallback/image-avatar";
import FileUploader from "../../../ui/file-uploader/file-uploader";


const schema = yup.object().shape({
  first_name: yup.string().required("First Name is required"),
  last_name: yup.string().required("Last Name is required"),
  email: yup
    .string()
    .email("Invalid email")
    .required("Main Company Email is required"),
  phone: yup.string(),
});

function MyProfile() {
  const { trialHeight } = useTrialHeight();
  const [activeTab, setActiveTab] = useState("profile");
  const [isEditingGroup, setIsEditingGroup] = useState(false);
  const editingHeight = isEditingGroup ? 100 : 0;
  const [photo, setPhoto] = useState({});
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    control,
    setValue
  } = useForm({
    resolver: yupResolver(schema),
  });

  const { data, isLoading, error } = useQuery({
    queryKey: ["profile"],
    queryFn: fetchProfile,
    onSuccess: (data) => {
      reset(data);
    },
    onError: (error) => {
      console.error("Error fetching data:", error);
    },
  });

  useEffect(() => {
    if (data?.phone) setValue('phone', data.phone);
  }, [data]);

  const mutation = useMutation({
    mutationFn: (data) => updateProfile(data, photo),
    onSuccess: () => {
      window.location.reload();
      setIsEditingGroup(false);
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
      <div className="settings-wrap">
        <Helmet>
          <title>MeMate - My Profile</title>
        </Helmet>
        <div className="settings-wrapper">
          <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
          <div className="settings-content">
            <div className="headSticky">
              <h1>My Profile </h1>
            </div>
            <div className={`content_wrap_main ${isEditingGroup ? "isEditingwrap" : ""}`} style={{ height: `calc(100vh - 200px - ${trialHeight}px - ${editingHeight}px)` }}>
              <div className="content_wrapper">
                <div className="listwrapper">
                  <div className="topHeadStyle">
                    <div className="">
                      <h2>My Profile</h2>
                      {!isEditingGroup ? (
                        <></>
                      ) : (
                        <p>
                          For your user picture, we suggest choosing a simple,
                          neutral photo of yourself or a corporate headshot to
                          ensure clear and professional communication.
                        </p>
                      )}
                    </div>
                    {!isEditingGroup && (
                      <Link to="#" onClick={handleEditGroup}>
                        Edit
                        <PencilSquare color="#344054" size={20} />
                      </Link>
                    )}
                  </div>
                  <ul>
                    <li
                      className={`${isEditingGroup
                        ? `${styles.editBorderWrap}`
                        : `${styles.viewBorderWrap}`
                        }`}
                    >
                      <div className={styles.editinfo}>
                        <span>First Name</span>
                        {!isEditingGroup ? (
                          <strong>{data.first_name} </strong>
                        ) : (
                          <>
                            <div
                              className={`inputInfo ${errors.first_name ? "error-border" : ""
                                }`}
                            >
                              <input
                                {...register("first_name")}
                                placeholder="Enter First Name"
                                defaultValue={data.first_name}
                                className="w-100"
                              />
                              {errors.first_name && (
                                <img
                                  className="ExclamationCircle"
                                  src={exclamationCircle}
                                  alt="Exclamation Circle"
                                />
                              )}
                            </div>
                            {errors.first_name && (
                              <p className="error-message ms-2">
                                {errors.first_name.message}
                              </p>
                            )}
                          </>
                        )}
                      </div>
                      {!isEditingGroup ? <></> : <></>}
                    </li>
                    <li
                      className={`${isEditingGroup
                        ? `${styles.editBorderWrap}`
                        : `${styles.viewBorderWrap}`
                        }`}
                    >
                      <div className={styles.editinfo}>
                        <span>Last Name</span>
                        {!isEditingGroup ? (
                          <strong>{data.last_name} </strong>
                        ) : (
                          <>
                            <div
                              className={`inputInfo ${errors.last_name ? "error-border" : ""
                                }`}
                            >
                              <input
                                {...register("last_name")}
                                placeholder="Enter Last name name"
                                defaultValue={data.last_name}
                                className="w-100"
                              />
                              {errors.last_name && (
                                <img
                                  className="ExclamationCircle"
                                  src={exclamationCircle}
                                  alt="Exclamation Circle"
                                />
                              )}
                            </div>
                            {errors.last_name && (
                              <p className="error-message ms-2">
                                {errors.last_name.message}
                              </p>
                            )}
                          </>
                        )}
                      </div>
                      {!isEditingGroup ? <></> : <></>}
                    </li>
                    <li
                      className={`${isEditingGroup
                        ? `${styles.editBorderWrap}`
                        : `${styles.viewBorderWrap}`
                        }`}
                    >
                      <div className={styles.editinfo}>
                        <span>User picture</span>
                        {!isEditingGroup ? (
                          <div className='d-flex justify-content-center align-items-center' style={{ border: '1px solid #dedede', width: '50px', height: '50px', borderRadius: '50%', overflow: 'hidden' }}>
                            <FallbackImage photo={data.photo} has_photo={data.has_photo} is_business={false} size={28} />
                          </div>
                        ) : (
                          <div className="upload-btn-wrapper">
                            <FileUpload photo={photo} data={data} setPhoto={setPhoto} />
                          </div>
                        )}
                      </div>

                      {!isEditingGroup ? (
                        <></>
                      ) : (
                        ''
                      )}
                    </li>

                    <li
                      className={`${isEditingGroup
                        ? `${styles.editBorderWrap}`
                        : `${styles.viewBorderWrap}`
                        }`}
                    >
                      <div className={styles.editinfo}>
                        <span>Email</span>
                        {!isEditingGroup ? (
                          <strong>
                            {data.email} <Link45deg color="#158ECC" size={20} />
                          </strong>
                        ) : (
                          <>
                            <div
                              className={`inputInfo ${errors.email ? "error-border" : ""
                                }`}
                            >
                              <input
                                {...register("email")}
                                placeholder="Enter Email"
                                defaultValue={data.email}
                                className="w-100"
                              />
                              {errors.email && (
                                <img
                                  className="ExclamationCircle"
                                  src={exclamationCircle}
                                  alt="Exclamation Circle"
                                />
                              )}
                            </div>
                            {errors.email && (
                              <p className="error-message ms-2">
                                {errors.email.message}
                              </p>
                            )}
                          </>
                        )}
                      </div>
                      {!isEditingGroup ? (
                        <></>
                      ) : (
                        ''
                      )}
                    </li>
                    <li
                      className={`${isEditingGroup
                        ? `${styles.editBorderWrap}`
                        : `${styles.viewBorderWrap}`
                        }`}
                    >
                      <div className={styles.editinfo}>
                        <span>Phone Number</span>
                        {!isEditingGroup ? (
                          <strong>
                            {data.phone} <Telephone color="#158ECC" size={20} />
                          </strong>
                        ) : (
                          <>
                            <div
                              className={`inputInfo ${errors.phone ? "error-border" : ""
                                }`}
                            >
                              <Controller
                                name="phone"
                                control={control}
                                render={({ field }) => (
                                  <PhoneInput
                                    className='phoneInput'
                                    defaultCountry='au'
                                    value={field.value || ''}
                                    placeholder='Enter Phone Number'
                                    style={{ width: '315px' }}
                                    onChange={(phone) => field.onChange(phone)}
                                  />
                                )}
                              />
                              {errors.phone && (
                                <img
                                  className="ExclamationCircle"
                                  src={exclamationCircle}
                                  alt="Exclamation Circle"
                                />
                              )}
                            </div>
                            {errors.phone && (
                              <p className="error-message ms-2">
                                {errors.phone.message}
                              </p>
                            )}
                          </>
                        )}
                      </div>
                      {!isEditingGroup ? (
                        <></>
                      ) : (
                        <div className={styles.editpara}>
                          <></>
                        </div>
                      )}
                    </li>
                    <li
                      className={`${isEditingGroup
                        ? `${styles.editBorderWrap}`
                        : `${styles.viewBorderWrap}`
                        }`}
                    >
                      <div className={styles.editinfo}>
                        <span>Position</span>
                        {!isEditingGroup ? (
                          <strong>{data.type}</strong>
                        ) : (
                          <>
                            <div
                              className={`inputInfo ${errors.type ? "error-border" : ""
                                }`}
                            >
                              <input
                                {...register("type")}
                                placeholder="Enter Position"
                                defaultValue={data.type}
                                className="w-100"
                              />
                              {errors.type && (
                                <img
                                  className="ExclamationCircle"
                                  src={exclamationCircle}
                                  alt="Exclamation Circle"
                                />
                              )}
                            </div>
                            {errors.type && (
                              <p className="error-message ms-2">
                                {errors.type.message}
                              </p>
                            )}
                          </>
                        )}
                      </div>
                      {!isEditingGroup ? (
                        <></>
                      ) : (
                        <div className={styles.editpara}>
                          <p></p>
                        </div>
                      )}
                    </li>
                    {
                      !isEditingGroup && (
                        <li>
                          <ChangePassword />
                        </li>
                      )
                    }
                  </ul>
                </div>
              </div>
            </div>
            {isEditingGroup && (
              <div className="updateButtonGeneral">
                <button type="button" onClick={() => setIsEditingGroup(false)} className="cancel">Cancel</button>
                <button
                  type="submit"
                  className="save mr-3"
                  disabled={mutation.isLoading}
                >
                  {mutation.isLoading ? "Updating..." : "Update"}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* {mutation.isError && <div>Error updating data</div>}
      {mutation.isSuccess && <div>Data updated successfully</div>} */}
    </form>
  );
}

function FileUpload({ photo, setPhoto, data }) {
  const [show, setShow] = useState(false);

  return (
    <section
      className="container mb-3"
      style={{ marginTop: "24px", padding: "0px" }}
    >
      {/* <label className='mb-2' style={{ color: '#475467', fontSize: '14px', fontWeight: '500' }}>App Logo</label> */}
      <div
        className="d-flex justify-content-center align-items-center flex-column"
        style={{
          width: "100%",
          minHeight: "126px",
          padding: "16px",
          background: "#fff",
          borderRadius: "4px",
          border: "1px solid #D0D5DD",
        }}
      >
        {photo?.croppedImageBase64 ? (
          <div className="text-center">
            <img
              alt="uploaded-file"
              src={photo?.croppedImageBase64}
              style={{ width: "64px", height: "64px", marginBottom: "12px" }}
            />
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setShow(true)}
            className="d-flex justify-content-center align-items-center"
            style={{
              width: "40px",
              height: "40px",
              border: "1px solid #EAECF0",
              background: "#fff",
              borderRadius: "4px",
              marginBottom: "16px",
            }}
          >
            {data.photo ? (
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
                  src={data.photo}
                  className="w-100"
                  alt="Uploaded Photo"
                />
              </div>
            ) : (
              <Upload />
            )}



          </button>
        )}
        <p className="mb-0" style={{ color: "#475467", fontSize: "14px" }}>
          <span
            style={{ color: "#1AB2FF", fontWeight: "600", cursor: "pointer" }}
            onClick={() => setShow(true)}
          >
            Click to upload
          </span>
        </p>
        <span style={{ color: "#475467", fontSize: "12px" }}>
          SVG, PNG, JPG or GIF (max. 800x400px)
        </span>
      </div>
      <FileUploader show={show} setShow={setShow} setPhoto={setPhoto} shape="round" />
    </section>
  );
}
export default MyProfile;
