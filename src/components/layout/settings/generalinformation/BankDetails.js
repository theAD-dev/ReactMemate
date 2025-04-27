import React, { useState, useEffect } from "react";
import { PencilSquare } from "react-bootstrap-icons";
import { Helmet } from "react-helmet-async";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { yupResolver } from "@hookform/resolvers/yup";
import { Skeleton } from "primereact/skeleton";
import * as yup from "yup";
import styles from "./general.module.scss";
import {
  SettingsBankInformation,
  updateBankInformation,
} from "../../../../APIs/SettingsGeneral";
import { useTrialHeight } from "../../../../app/providers/trial-height-provider";


const schema = yup.object().shape({
  bank_name: yup.string().required("Bank name is required"),
  bsb: yup
    .string()
    .matches(/^\d{6}$/, "BSB must be 6 digits")
    .required("BSB is required"),
  account_number: yup
    .string()
    .matches(/^\d+$/, "Account number must be numeric")
    .required("Account number is required"),
});

const BankDetails = () => {
  const { trialHeight } = useTrialHeight();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    watch
  } = useForm({
    resolver: yupResolver(schema),
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await SettingsBankInformation();
        const parsedData = JSON.parse(data);
        Object.keys(parsedData).forEach((key) => setValue(key, parsedData[key]));
      } catch (error) {
        console.error("Error fetching Bank information:", error);
        setError("Failed to load bank details. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [setValue]);

  const onSubmit = async (formData) => {
    try {
      setSubmitting(true);
      await updateBankInformation(formData);
      setIsEditing(false);
      window.location.reload();
    } catch (error) {
      console.error("Error updating Bank information:", error);
      setError("Failed to update bank details. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="settings-wrap">
      <Helmet>
        <title>MeMate - Bank Details</title>
      </Helmet>
      <div className="settings-content">
        <div className="headSticky">
          <h1>Company Information</h1>
          <div className="contentMenuTab">
            <ul>
              <li>
                <Link to="/settings/generalinformation">General Information</Link>
              </li>
              <li className="menuActive">
                <Link to="/settings/generalinformation/bank-details">Bank Details</Link>
              </li>
              <li>
                <Link to="/settings/generalinformation/region-and-language">Region & Language</Link>
              </li>
            </ul>
          </div>
        </div>
        <div className={`content_wrap_main pb-0 ${isEditing ? "isEditingwrap" : ""}`} style={{ height: `calc(100vh - 230px - ${trialHeight}px)` }}>
          <div className="content_wrapper pb-0 h-100">
            <div className={`listwrapper ${styles.listwrapp} pb-0`}>
              <div className="topHeadStyle">
                <div>
                  <h2>Bank Details</h2>
                  {isEditing && <p>Provide accurate bank account details to ensure smooth transactions and payments.</p>}
                </div>
                {!isEditing && (
                  <Link to="#" onClick={() => setIsEditing(true)}>
                    Edit <PencilSquare color="#667085" size={20} />
                  </Link>
                )}
              </div>
              <form onSubmit={handleSubmit(onSubmit)}>
                <ul>
                  {["bank_name", "bsb", "account_number"].map((field, index) => (
                    <li key={index}>
                      <span>{field.replace(/_/g, " ").replace(/\b\w/g, (char) => char.toUpperCase())}</span>
                      {loading ? (
                        <Skeleton width="100%" height="2rem" />
                      ) : !isEditing ? (
                        <strong>{watch(field) || ""}</strong>
                      ) : (
                        <div>
                          <input type="text" {...register(field)} />
                          {errors[field] && <p className="error-message">{errors[field].message}</p>}
                        </div>
                      )}
                    </li>
                  ))}
                </ul>
                {isEditing && (
                  <div className="updateButtonGeneral pb-3" style={{ position: 'fixed', bottom: 0, width: 'calc(100vw - 320px)', right: 20 }}>
                    <button type="button" className="cancel" onClick={() => setIsEditing(false)} disabled={loading}>
                      Cancel
                    </button>
                    <button type="submit" className="save" disabled={submitting}>{submitting ? "Saving..." : "Save"}</button>
                  </div>
                )}
              </form>
              {error && <p className="error-message">{error}</p>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BankDetails;
