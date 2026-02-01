import { useEffect, useRef, useState, useCallback } from 'react';
import * as Icon from 'react-bootstrap-icons';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ProgressSpinner } from 'primereact/progressspinner';
import { toast } from 'sonner';
import { getFormById } from './api';
import { initBuilder, cleanupBuilder } from './builder/init-builder';
import './form-builder.css';
import { getOutgoingEmail } from '../../../../APIs/email-template';
import { useAuth } from '../../../../app/providers/auth-provider';
import { useTrialHeight } from '../../../../app/providers/trial-height-provider';

// Inline SVG Icon component for field types
const FieldIcon = ({ type }) => {
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
    case 'image':
      return (
        <svg {...props}>
          <rect x="3" y="3" width="18" height="18" rx="2" />
          <path d="M8 14l2-2 3 3 2-2 4 4" />
          <circle cx="9" cy="9" r="1" />
        </svg>
      );
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

  // State management
  const [toolboxCollapsed, setToolboxCollapsed] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('designer'); // 'designer' or 'preview'
  const [formType, setFormType] = useState('web');

  // Field types data
  const fieldTypes = [
    ['text', 'Single-Line Input'],
    ['email', 'Email'],
    ['number', 'Number'],
    ['phone', 'Phone'],
    ['textarea', 'Text Area'],
    ['select', 'Dropdown'],
    ['radio', 'Radio Button Group'],
    ['checkbox', 'Checkboxes'],
    ['multicheckbox', 'Multi-Select Checkboxes'],
    ['date', 'Date'],
    ['time', 'Time'],
    ['address', 'Address'],
    ['image', 'Image Upload'],
    ['html', 'HTML Block'],
    ['consent', 'Consent']
  ];

  // Filter field types based on search
  const filteredFieldTypes = fieldTypes.filter(([type, label]) =>
    label.toLowerCase().includes(searchTerm.toLowerCase()) ||
    type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Handle preview
  const handlePreview = useCallback(() => {
    setActiveTab('preview');
    // Trigger preview build from init-builder
    setTimeout(() => {
      const previewBtn = document.querySelector('#preview-btn');
      if (previewBtn) {
        previewBtn.click();
      }
    }, 100);
  }, []);

  // Handle undo/redo (these will be wired to init-builder)
  const handleUndo = useCallback(() => {
    window.dispatchEvent(new CustomEvent('builder-undo'));
  }, []);

  const handleRedo = useCallback(() => {
    window.dispatchEvent(new CustomEvent('builder-redo'));
  }, []);

  const outgoingEmailTemplateQuery = useQuery({
    queryKey: ["getOutgoingEmail"],
    queryFn: getOutgoingEmail
  });
  const fromEmail = outgoingEmailTemplateQuery?.data?.outgoing_email || 'no-reply@memate.com.au';

  useEffect(() => {
    const orgId = session?.organization?.id;
    if (!orgId) return;               // wait until session is ready
    if (bootstrappedRef.current) return; // run only once

    // Wait for DOM to be fully rendered
    const timer = setTimeout(async () => {
      bootstrappedRef.current = true;

      try {
        if (editId) {
          const formJson = await getFormById(editId);
          console.log('formJson: ', formJson);
          // Set form type from loaded data
          setFormType(formJson.type || 'web');
          initBuilder({
            defaultOrgId: orgId,
            initialForm: formJson,
          });
        } else {
          initBuilder({
            defaultOrgId: orgId,
          });
        }
      } catch (e) {
        console.error('Failed to load form for editing:', e);
        initBuilder({
          defaultOrgId: orgId,
        });
      }
    }, 100);

    return () => {
      clearTimeout(timer);
      cleanupBuilder(); // Clean up on unmount
    };
  }, [session?.organization?.id, editId]);

  // Listen for save events from init-builder
  useEffect(() => {
    const handleSaveError = (e) => {
      const errorMessage = e.detail?.message || 'Failed to save form';
      toast.error(errorMessage, {
        duration: 5000,
      });
      setSaving(false);
    };

    const handleSaveSuccess = () => {
      toast.success('Form saved successfully!', {
        duration: 3000,
      });
      setSaving(false);
    };

    const handleClearError = () => {
      toast.dismiss();
    };

    window.addEventListener('builder-save-error', handleSaveError);
    window.addEventListener('builder-save-success', handleSaveSuccess);
    window.addEventListener('builder-clear-error', handleClearError);

    return () => {
      window.removeEventListener('builder-save-error', handleSaveError);
      window.removeEventListener('builder-save-success', handleSaveSuccess);
      window.removeEventListener('builder-clear-error', handleClearError);
    };
  }, []);

  return (
    <>
      <div className="mf-builder" style={{
        overflow: 'auto',
        height: `calc(100vh - 127px - ${trialHeight}px)`,
        '--trial-height': `${trialHeight}px`
      }}>
        <div className="mf-container">
          {/* Tabs Navigation */}
          <div className="builder-tabs">
            <div className="tabs-left">
              <button
                className={`tab-btn ${activeTab === 'designer' ? 'active' : ''}`}
                onClick={() => setActiveTab('designer')}
              >
                Designer
              </button>
              <button
                className={`tab-btn ${activeTab === 'preview' ? 'active' : ''}`}
                onClick={handlePreview}
              >
                Preview
              </button>
            </div>
            <div className="tabs-right">
              <button className="icon-btn" title="Undo" onClick={handleUndo}>
                <Icon.ArrowCounterclockwise size={18} />
              </button>
              <button className="icon-btn" title="Redo" onClick={handleRedo}>
                <Icon.ArrowClockwise size={18} />
              </button>
              <button
                className="btn btn-primary"
                id="save-btn"
                disabled={saving}
              >
                {saving ? (
                  <>
                    <ProgressSpinner style={{ width: '16px', height: '16px' }} strokeWidth="2" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Icon.Save size={16} />
                    Save Form
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Designer Tab - Main Form Builder */}
          <div className="editor-container" style={{ display: activeTab === 'designer' ? 'grid' : 'none' }}>
            {/* Toolbox (Field Types) */}
            <div className={`fields-panel ${toolboxCollapsed ? 'collapsed' : ''}`}>
              <div className="panel-header">
                <div className="panel-header-top">
                  <h2>{toolboxCollapsed ? '' : 'Toolbox'}</h2>
                  <button
                    className="collapse-btn"
                    onClick={() => setToolboxCollapsed(!toolboxCollapsed)}
                    title={toolboxCollapsed ? 'Expand Toolbox' : 'Collapse Toolbox'}
                  >
                    {toolboxCollapsed ? <Icon.ChevronRight size={18} /> : <Icon.ChevronLeft size={18} />}
                  </button>
                </div>
                {!toolboxCollapsed && (
                  <input
                    type="text"
                    placeholder="Type to search..."
                    className="search-input"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                )}
              </div>
              <div className="field-types">
                {filteredFieldTypes.map(([type, label]) => (
                  <div
                    key={type}
                    className="field-type"
                    draggable
                    data-type={type}
                    role="button"
                    aria-label={`Drag ${label} field`}
                    title={`Drag ${label} field`}
                  >
                    <span className="icon"><FieldIcon type={type} /></span>
                    {!toolboxCollapsed && <span>{label}</span>}
                  </div>
                ))}
              </div>

              {!toolboxCollapsed && (
                <div className="css-editor-container">
                  <h3>Custom CSS</h3>
                  <textarea id="form_style" className="code-editor" rows={10} defaultValue='' placeholder="Add custom CSS here (optional)" />
                  <p className="help-text">These styles will be applied to the embedded form.</p>
                </div>
              )}
            </div>

            {/* Design Surface (Canvas) */}
            <div className="editor-panel">
              <div className="panel-header-inline">
                <h3>Design Surface</h3>
              </div>
              <div className="form-preview" id="preview-container">
                <div className="page-header">
                  <div>
                    <h4 id="preview-form-title">Title</h4>
                    <p className="page-description" id="preview-form-description">Description</p>
                  </div>
                </div>
                <div className="empty-state" style={{ display: 'none' }}>
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" opacity="0.2">
                    <rect x="3" y="3" width="18" height="18" rx="2" />
                    <path d="M3 9h18M9 21V9" />
                  </svg>
                  <p>Drag and drop fields from the Toolbox to build your form</p>
                </div>
              </div>
            </div>

            {/* Property Grid - Field Properties First, then General settings */}
            <div className="field-properties" id="properties-container">
              {/* This will be dynamically filled by field properties when a field is selected */}
              <div className="field-props-placeholder">
                <div className="panel-header">
                  <h2>Properties</h2>
                </div>
                <div className="no-selection">
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" opacity="0.2">
                    <rect x="3" y="5" width="18" height="14" rx="2" />
                    <path d="M7 10h10M7 14h6" />
                  </svg>
                  <p>Select a field to edit its properties</p>
                </div>
              </div>

              {/* General Settings - Always visible below field properties */}
              <div className="general-settings">
                <div className="panel-header">
                  <h2>General</h2>
                </div>

                {/* Form Settings */}
                <div className="property-section">
                  <div className="form-field">
                    <label>Form Type</label>
                    <select id="form-type" defaultValue="web" onChange={(e) => setFormType(e.target.value)}>
                      <option value="web">Web</option>
                      <option value="form">Form</option>
                    </select>
                  </div>
                  <div className="form-field">
                    <label>Form title<span style={{ color: '#f04438' }}>*</span></label>
                    <input id="form-title" placeholder="Enter form title" />
                  </div>
                  <div className="form-field">
                    <label>Form description</label>
                    <textarea id="form-description" placeholder="Enter description" rows="3" />
                  </div>
                </div>

                {/* Additional Settings */}
                <div className="property-section">
                  <h3 className="section-title">Settings</h3>
                  {formType === 'web' && (
                    <div className="form-field">
                      <label>Domain</label>
                      <input id="form-domain" placeholder="Enter domain" defaultValue="https://memate.com.au/" />
                    </div>
                  )}
                  <div className="form-field">
                    <label>To Email<span style={{ color: '#f04438' }}>*</span></label>
                    <input id="form-submit-to" placeholder="Enter email" />
                  </div>
                  <div className="form-field">
                    <label>From Email</label>
                    <input id="form-submit-from" placeholder="Enter email" defaultValue={fromEmail} disabled={fromEmail === 'no-reply@memate.com.au'} />
                  </div>
                  <div className="form-field">
                    <label>CC Email</label>
                    <input id="form-cc-email" placeholder="Enter email" />
                  </div>
                  <div className="form-field">
                    <label>BCC Email</label>
                    <input id="form-bcc-email" placeholder="Enter email" />
                  </div>
                </div>

                {/* Messages */}
                <div className="property-section">
                  <h3 className="section-title">Messages</h3>
                  <div className="form-field">
                    <label>Thank you message</label>
                    <input id="form-thank-you" placeholder="Enter message" />
                  </div>
                  <div className="form-field">
                    <label>Error message</label>
                    <input id="form-error-message" placeholder="Enter message" />
                  </div>
                  <div className="form-field">
                    <label>Submit Button Label</label>
                    <input id="form-submit-label" defaultValue="Submit" />
                  </div>
                  <div className="form-field">
                    <label>Redirect URL</label>
                    <input id="form-redirect-url" placeholder="Enter URL" />
                  </div>
                </div>

                {/* reCAPTCHA */}
                {formType === 'web' && (
                  <div className="property-section">
                    <h3 className="section-title">reCAPTCHA</h3>
                    <div className="form-field">
                      <label>Site Key<span style={{ color: '#f04438' }}>*</span></label>
                      <input id="form-recaptcha-key" placeholder="Enter site key" />
                    </div>
                    <div className="form-field">
                      <label>Secret Key<span style={{ color: '#f04438' }}>*</span></label>
                      <input id="form-recaptcha-secret" placeholder="Enter secret key" />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Preview Tab - Shows the form preview */}
          <div className="preview-tab-container" style={{ display: activeTab === 'preview' ? 'block' : 'none' }}>
            {/* <div className="preview-tab-header">
              <h3>Form Preview</h3>
              <button className="btn btn-secondary" onClick={() => setActiveTab('designer')}>
                Back to Designer
              </button>
            </div> */}
            <div id="preview-form-container-tab" className="preview-form-content" />
          </div>

          {/* Footer actions - Removed from here, now in header */}

          {/* Hidden button for preview trigger */}
          <button id="preview-btn" style={{ display: 'none' }} />

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
    </>
  );
}