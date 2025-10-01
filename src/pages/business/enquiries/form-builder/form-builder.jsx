import { useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { getFormById } from './api';
import { defaultFormStyle } from './builder/default-style';
import { initBuilder } from './builder/init-builder';
import './form-builder.css';
import { useAuth } from '../../../../app/providers/auth-provider';
import { useTrialHeight } from '../../../../app/providers/trial-height-provider';

// Inline SVG Icon component for field types
const Icon = ({ type }) => {
  const props = { width: 22, height: 22, viewBox: '0 0 24 24', fill: 'none', stroke: '#2563eb', strokeWidth: 2, strokeLinecap: 'round', strokeLinejoin: 'round' };
  switch (type) {
    case 'text':
      return (<svg {...props}><path d="M4 6h16" /><path d="M9 6v12" /><path d="M15 6v12" /></svg>);
    case 'email':
      return (<svg {...props}><path d="M4 6h16v12H4z" /><path d="M22 6l-10 7L2 6" /></svg>);
    case 'number':
      return (<svg {...props}><path d="M6 10h12" /><path d="M6 14h12" /><path d="M9 7v10" /><path d="M15 7v10" /></svg>);
    case 'phone':
      return (<svg {...props}><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.8 19.8 0 0 1-8.62-3.07 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.09 4.18 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.9 12.9 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 10a16 16 0 0 0 6 6l1.36-1.27a2 2 0 0 1 2.11-.45 12.9 12.9 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" /></svg>);
    case 'textarea':
      return (<svg {...props}><rect x="3" y="5" width="18" height="14" rx="2" /><path d="M7 9h10" /><path d="M7 13h6" /></svg>);
    case 'select':
      return (<svg {...props}><rect x="3" y="5" width="18" height="6" rx="2" /><path d="M8 15l4 4 4-4" /></svg>);
    case 'multiselect':
      return (<svg {...props}><rect x="3" y="5" width="18" height="14" rx="2" /><path d="M7 9h10" /><path d="M7 13h10" /><path d="M7 17h10" /></svg>);
    case 'radio':
      return (<svg {...props}><circle cx="8" cy="12" r="3" /><circle cx="16" cy="12" r="6" /></svg>);
    case 'checkbox':
      return (<svg {...props}><rect x="3" y="5" width="18" height="14" rx="2" /><path d="M7 12l3 3 7-7" /></svg>);
    case 'multicheckbox':
      return (<svg {...props}><rect x="3" y="5" width="18" height="14" rx="2" /><path d="M7 10l3 3" /><path d="M7 14l3 3" /><path d="M14 10h3" /><path d="M14 14h3" /></svg>);
    case 'date':
      return (<svg {...props}><rect x="3" y="5" width="18" height="16" rx="2" /><path d="M8 3v4" /><path d="M16 3v4" /><path d="M3 9h18" /></svg>);
    case 'time':
      return (<svg {...props}><circle cx="12" cy="12" r="9" /><path d="M12 7v6l4 2" /></svg>);
    case 'html':
      return (<svg {...props}><path d="M10 15l-3-3 3-3" /><path d="M14 9l3 3-3 3" /><path d="M4 19h16" /></svg>);
    case 'consent':
      return (<svg {...props}><rect x="3" y="5" width="18" height="14" rx="2" /><path d="M7 12l3 3 7-7" /></svg>);
    default:
      return (<svg {...props}><circle cx="12" cy="12" r="9" /></svg>);
  }
};

export default function TempFormBuilder() {
  const { session } = useAuth();
  const { trialHeight } = useTrialHeight();
  const bootstrappedRef = useRef(false);
  const { id } = useParams();
  const editId = id !== 'new' ? id : null;

  useEffect(() => {
    const orgId = session?.organization?.id;
    if (!orgId) return;               // wait until session is ready
    if (bootstrappedRef.current) return; // run only once
    bootstrappedRef.current = true;

    (async () => {
      try {
        if (editId) {
          const formJson = await getFormById(editId);
          console.log('formJson: ', formJson);
          initBuilder({
            defaultOrgId: orgId,
            getDefaultCss: () => defaultFormStyle,
            initialForm: formJson,
          });
        } else {
          initBuilder({
            defaultOrgId: orgId,
            getDefaultCss: () => defaultFormStyle,
          });
        }
      } catch (e) {
        console.error('Failed to load form for editing:', e);
        initBuilder({
          defaultOrgId: orgId,
          getDefaultCss: () => defaultFormStyle,
        });
      }
    })();
  }, [session?.organization?.id]);

  return (
    <div className="mf-builder" style={{ overflow: 'auto', height: `calc(100vh - 127px - ${trialHeight}px)` }}>
      <div className="mf-container" >
        <header>
          <h1>Form Editor</h1>
        </header>

        <div className="editor-container">
          {/* Field Types (drag sources) */}
          <div className="fields-panel">
            <h2>Field Types</h2>
            <div className="field-types">
              {[
                ['text', 'Text'], ['email', 'Email'], ['number', 'Number'], ['phone', 'Phone'], ['textarea', 'Text Area'], ['select', 'Dropdown'], ['multiselect', 'Multi Select'], ['radio', 'Radio Buttons'], ['checkbox', 'Checkbox'], ['multicheckbox', 'Multi Checkbox'], ['date', 'Date'], ['time', 'Time'], ['html', 'HTML Content'], ['consent', 'Consent']
              ].map(([type, label]) => (
                <div
                  key={type}
                  className="field-type"
                  draggable
                  data-type={type}
                  role="button"
                  aria-label={`Drag ${label} field`}
                  title={`Drag ${label} field`}
                >
                  <span className="icon"><Icon type={type} /></span>
                  <span>{label}</span>
                </div>
              ))}
            </div>

            {/* Custom CSS */}
            <div className="css-editor-container">
              <h3>Custom CSS</h3>
              <textarea id="form_style" className="code-editor" rows={10} defaultValue='' placeholder="Add custom CSS here (optional)" />
              <p className="help-text">These styles will be applied to the embedded form.</p>
            </div>
          </div>

          {/* Canvas */}
          <div className="editor-panel">
            <div className="form-preview" id="preview-container">
              <h3>Form Preview</h3>
              <div className="empty-state">
                <i className="fas fa-inbox" />
                <p>Drag and drop fields from the left panel to build your form</p>
              </div>
            </div>
          </div>

          {/* Properties */}
          <div className="field-properties" id="properties-container">
            <h2>Field Properties</h2>
            <div className="no-field-selected">
              <p>Select a field to edit its properties</p>
            </div>
          </div>

          {/* Form Details */}
          <div className="form-details" id="form-details-container">
            <h2>Form Details</h2>
            <div className="form-field"><label>Title</label><input id="form-title" placeholder="enter your title" /></div>
            <div className="form-field"><label>Domain</label><input id="form-domain" placeholder="enter your domain" defaultValue="https://memate.com.au/" /></div>
            <div className="form-field"><label>To Email</label><input id="form-submit-to" placeholder="enter submit to" /></div>
            <div className="form-field"><label>From Email</label><input id="form-submit-from" placeholder="enter submit from" /></div>
            <div className="form-field"><label>CC Email</label><input id="form-cc-email" placeholder="enter cc email" /></div>
            <div className="form-field"><label>BCC Email</label><input id="form-bcc-email" placeholder="enter bcc email" /></div>
            <div className="form-field"><label>Thank you message</label><input id="form-thank-you" placeholder="enter your thank you message" /></div>
            <div className="form-field"><label>Error message</label><input id="form-error-message" placeholder="enter your error message" /></div>
            <div className="form-field"><label>Submit Button Label</label><input id="form-submit-label" defaultValue="Submit" /></div>
            <div className="form-field"><label>Redirect URL</label><input id="form-redirect-url" placeholder="enter redirect url" /></div>
            <div className="form-field"><label>Google reCAPTCHA Site Key</label><input id="form-recaptcha-key" placeholder="enter your reCAPTCHA site key" /></div>
            <div className="form-field"><label>Google reCAPTCHA Secret Key</label><input id="form-recaptcha-secret" placeholder="enter your reCAPTCHA secret key" /></div>
          </div>
        </div>

        {/* Footer actions */}
        <div className="editor-actions">
          <button className="btn btn-secondary" id="preview-btn">Preview Form</button>
          <button className="btn btn-primary" id="save-btn">Save Form</button>
        </div>

        {/* Preview Modal */}
        <div className="modal" id="preview-modal" style={{ display: 'none' }}>
          <div className="modal-content">
            <div className="modal-header">
              <h2>Form Preview</h2>
              <button className="modal-close">×</button>
            </div>
            <div id="preview-form-container" />
          </div>
        </div>

        {/* Embed Code Modal */}
        <div className="modal" id="embed-modal" style={{ display: 'none' }}>
          <div className="modal-content">
            <div className="modal-header">
              <h2>Embed this Form</h2>
              <button className="modal-close" data-close-embed>×</button>
            </div>
            <p>Copy the snippet below and paste it into your website where you want the form to appear.</p>
            <textarea
              id="embed-snippet"
              readOnly
              rows={4}
              style={{
                width: '100%',
                boxSizing: 'border-box',
                fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace'
              }}
            />
            <div className="editor-actions" style={{ justifyContent: 'flex-end' }}>
              <button className="btn" id="copy-embed-btn">Copy</button>
              <button className="btn btn-primary" id="close-embed-btn" disabled>OK</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}