import React, { useState, useRef } from 'react';

function formatFileSize(size) {
  if (size >= 1024 * 1024) return (size / (1024 * 1024)).toFixed(1) + ' MB';
  if (size >= 1024) return (size / 1024).toFixed(1) + ' KB';
  return size + ' B';
}

const ChatAttachmentPopover = ({ onFileChange, styles, file, onRemoveFile }) => {
  const [open, setOpen] = useState(false);
  const buttonRef = useRef();

  return (
    <div style={{ position: 'relative', display: 'inline-block' }}>
      <button
        className={styles.attachButton}
        type="button"
        aria-label="Attach file"
        ref={buttonRef}
        onClick={() => setOpen((v) => !v)}
      >
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M18.0833 8.33333L9.16667 17.25C8.17221 18.2444 6.82407 18.8042 5.41667 18.8042C4.00926 18.8042 2.66112 18.2444 1.66667 17.25C0.672214 16.2556 0.112446 14.9074 0.112446 13.5C0.112446 12.0926 0.672214 10.7444 1.66667 9.75L10.5833 0.833329C11.2486 0.167998 12.1514 -0.149151 13.0833 0.0666624C14.0153 0.282476 14.8056 0.947998 15.25 1.83333C15.6944 2.71866 15.7361 3.75 15.3333 4.66666C14.9306 5.58333 14.1389 6.29166 13.1667 6.5L5.08333 14.5833C4.75 14.9167 4.31944 15.0833 3.83333 15.0833C3.34722 15.0833 2.91667 14.9167 2.58333 14.5833C2.25 14.25 2.08333 13.8194 2.08333 13.3333C2.08333 12.8472 2.25 12.4167 2.58333 12.0833L9.16667 5.5" stroke="#667085" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      {open && (
        <div className={styles.attachmentPopover} style={{ position: 'absolute', bottom: '40px', left: 0, zIndex: 20, minWidth: 220, background: '#fff', borderRadius: 8, boxShadow: '0 4px 24px rgba(16,24,40,0.18)', padding: 16 }}>
          {!file && (
            <label className={styles.attachmentLabel} style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', gap: 8 }}>
              <input
                type="file"
                style={{ display: 'none' }}
                onChange={(e) => {
                  onFileChange(e);
                  setOpen(false);
                }}
              />
              <svg width="20" height="20" fill="none" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M16.25 10V15.8333C16.25 16.7538 15.5038 17.5 14.5833 17.5H5.41667C4.49619 17.5 3.75 16.7538 3.75 15.8333V10" stroke="#667085" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/><path d="M13.3333 6.66667L10 3.33333M10 3.33333L6.66667 6.66667M10 3.33333V13.3333" stroke="#667085" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
              <span>Upload file</span>
            </label>
          )}
          {file && (
            <div style={{ display: 'flex', alignItems: 'center', background: '#F9FAFB', borderRadius: 8, padding: 12, marginBottom: 8, gap: 12, border: '1px solid #EAECF0' }}>
              <div style={{ background: '#EAECF0', borderRadius: 6, padding: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {/* File type icon, e.g. JPG */}
                <span style={{ fontWeight: 600, color: '#344054', fontSize: 14 }}>{file.name.split('.').pop().toUpperCase()}</span>
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600, color: '#101828', fontSize: 16, marginBottom: 2 }}>{file.name}</div>
                <div style={{ color: '#667085', fontSize: 14 }}>{formatFileSize(file.size)}</div>
              </div>
              <button onClick={onRemoveFile} style={{ background: 'none', border: 'none', color: '#667085', fontSize: 18, cursor: 'pointer', marginLeft: 8 }} aria-label="Remove attachment">&times;</button>
            </div>
          )}
          <button
            className={styles.attachmentClose}
            style={{ background: 'none', border: 'none', color: '#667085', marginTop: 8, cursor: 'pointer', fontSize: 13 }}
            onClick={() => setOpen(false)}
          >
            Cancel
          </button>
        </div>
      )}
    </div>
  );
};

export default ChatAttachmentPopover;
