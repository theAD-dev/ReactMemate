export const defaultFormStyle = `
/* Wrapper & form card */
#inquiry-form-container{display:flex;justify-content:center;align-items:flex-start;min-height:60vh;padding:24px;box-sizing:border-box}
#inquiry-form-container .inquiry-form-wrapper{width:min(900px,92vw)}
#inquiry-form-container form{background:#ffffff;border:1px solid #e6e8ee;border-radius:12px;padding:20px;box-shadow:0 6px 18px rgba(20,40,90,.08);font-family:system-ui,-apple-system,'Segoe UI',Roboto,Arial,sans-serif;color:#1f2937}
#inquiry-form-container h2{margin:0 0 12px;font-size:20px}

/* Fields */
#inquiry-form-container .form-field{margin-bottom:14px}
#inquiry-form-container label{display:block;font-size:13px;font-weight:600;margin:0 0 6px}
#inquiry-form-container input,
#inquiry-form-container select,
#inquiry-form-container textarea{width:100%;box-sizing:border-box;padding:10px 12px;border:1px solid #d6dae6;border-radius:10px;background:#fff;font-size:14px;color:#1f2937;outline:none;transition:border-color .15s ease, box-shadow .15s ease}
#inquiry-form-container input:focus,
#inquiry-form-container select:focus,
#inquiry-form-container textarea:focus{border-color:#2563eb;box-shadow:0 0 0 4px rgba(37,99,235,.12)}

/* Checkbox/Radio rows */
#inquiry-form-container .checkbox-field,
#inquiry-form-container .radio-field{display:flex;align-items:center;gap:10px}
#inquiry-form-container .checkbox-field input,
#inquiry-form-container .radio-field input{width:16px;height:16px}

/* Multiselect as compact dropdown */
#inquiry-form-container select[multiple]{min-height:38px}

/* Messages */
#inquiry-form-container .error-message{color:#ef4444;font-size:.9rem;margin-top:.25rem}
#inquiry-success-message{background:#f7faff;border:1px solid #e6e8ee;border-radius:10px;padding:16px;text-align:center;box-shadow:0 4px 12px rgba(0,0,0,.06)}

/* Submit button */
#inquiry-form-container button[type="submit"]{background:#2563eb;border:none;border-radius:10px;color:#fff;padding:12px 20px;font-size:15px;cursor:pointer;transition:background .15s ease}
#inquiry-form-container button[type="submit"]:hover{background:#1d4ed8}
`;