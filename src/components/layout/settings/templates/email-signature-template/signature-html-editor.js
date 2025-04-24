import React, { useState, useEffect, useRef } from 'react';
import { Button, Form } from 'react-bootstrap';
import { Code, Clipboard } from 'react-bootstrap-icons';
import { toast } from 'sonner';
import styles from './signature-html-editor.module.scss';

/**
 * A specialized editor for email signatures that preserves HTML structure
 * @param {Object} props - Component props
 * @param {string} props.value - The HTML content
 * @param {Function} props.onChange - Function to call when content changes
 * @param {string} props.placeholder - Placeholder text
 */
const SignatureHtmlEditor = ({ value, onChange, placeholder }) => {
  const textareaRef = useRef(null);
  const pasteAreaRef = useRef(null);
  const [internalValue, setInternalValue] = useState(value || '');
  const [showPasteArea, setShowPasteArea] = useState(false);

  // Update internal value when prop value changes
  useEffect(() => {
    setInternalValue(value || '');
  }, [value]);

  // Handle changes to the HTML textarea
  const handleHtmlChange = (e) => {
    const newValue = e.target.value;
    setInternalValue(newValue);
    onChange(newValue);
  };

  // Handle paste from clipboard
  const handlePaste = (e) => {
    // Get clipboard data
    const clipboardData = e.clipboardData || window.clipboardData;
    const pastedData = clipboardData.getData('text/html') || clipboardData.getData('text');

    if (pastedData) {
      // Set the value directly without any processing
      setInternalValue(pastedData);
      onChange(pastedData);
      setShowPasteArea(false);
      toast.success('Signature pasted successfully!');
    }
  };

  // Toggle paste area
  const togglePasteArea = () => {
    setShowPasteArea(!showPasteArea);
    // Focus the paste area when shown
    if (!showPasteArea) {
      setTimeout(() => {
        if (pasteAreaRef.current) {
          pasteAreaRef.current.focus();
        }
      }, 100);
    }
  };

  return (
    <div className={styles.signatureEditor}>

      <div className={styles.editorContainer}>
        <div className={styles.editorSide}>
          <div className={styles.editorHeader}>
            <h5>Signature</h5>
            <div className={styles.editorControls}>
              <div className={styles.htmlLabel}>
                <Code size={14} /> HTML
              </div>
              <Button
                variant="outline-primary"
                size="sm"
                className="text-button"
                onClick={togglePasteArea}
              >
                <Clipboard size={14} /> Paste Signature
              </Button>
            </div>
          </div>

          {showPasteArea && (
            <div className={styles.pasteArea}>
              <div className={styles.pasteInstructions}>
                <p>Paste your signature below (Ctrl+V or Cmd+V):</p>
                <div
                  ref={pasteAreaRef}
                  className={styles.pasteTarget}
                  contentEditable
                  onPaste={handlePaste}
                  tabIndex={0}
                >
                  Click here and paste your signature
                </div>
                <div className={styles.pasteActions}>
                  <Button size="sm" variant="secondary" onClick={() => setShowPasteArea(false)}>Cancel</Button>
                </div>
              </div>
            </div>
          )}
          <Form.Control
            as="textarea"
            ref={textareaRef}
            className={styles.codePane}
            value={internalValue}
            onChange={handleHtmlChange}
            placeholder={placeholder}
            rows={30}
          />
        </div>

        <div className={styles.previewSide}>
          <div className={styles.previewHeader}>
            <h5 style={{ padding: '12px' }}>Preview</h5>
          </div>
          <div className={styles.previewPane}>
            {internalValue ? (
              <div style={{ marginRight: 'auto' }} dangerouslySetInnerHTML={{ __html: internalValue }} />
            ) : (
              <div className={styles.previewPlaceholder}>
                <div className={styles.previewPlaceholderContent}>
                  <div className={styles.previewPlaceholderIcon}>
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M20 4H4C2.9 4 2 4.9 2 6V18C2 19.1 2.9 20 4 20H20C21.1 20 22 19.1 22 18V6C22 4.9 21.1 4 20 4Z" stroke="#D0D5DD" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M22 6L12 13L2 6" stroke="#D0D5DD" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <h6>Your signature preview will appear here</h6>
                  <p>Enter your signature in the editor or paste an existing one</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignatureHtmlEditor;
