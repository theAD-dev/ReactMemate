import React, { useState } from 'react';
import { Button } from 'react-bootstrap';
import { QuestionCircle } from 'react-bootstrap-icons';
import { useMutation } from '@tanstack/react-query';
import { Dialog } from 'primereact/dialog';
import { InputTextarea } from 'primereact/inputtextarea';
import { ProgressSpinner } from 'primereact/progressspinner';
import { RadioButton } from 'primereact/radiobutton';
import { toast } from 'sonner';
import style from './support.module.scss';
import helpImage from '../../../assets/images/help-banner.jpg';
import { reachOutForSupport } from '../../../entities/support/api/support-api';

const headerElement = (
    <div className={`${style.modalHeader}`}>
        <div className="w-100 d-flex align-items-center gap-2">
            <b className={style.iconStyle}>
                <QuestionCircle size={24} color="#1AB2FF" />
            </b>
            <span className={`white-space-nowrap mt-2 mb-2 ${style.headerTitle}`}>
                Need a Hand? We're Here!
            </span>
        </div>
    </div>
);

const Support = ({ visible, setVisible }) => {
    const [issueType, setIssueType] = useState('');
    const [description, setDescription] = useState('');
    const [urgency, setUrgency] = useState('');
    const [error, setError] = useState({ issueType: "", description: "", urgency: "" });

    const issueTypes = [
        { value: 'Technical support', label: '🔧 Technical support', icon: 'pi-wrench' },
        { value: 'Billing question', label: '💳 Billing question', icon: 'pi-credit-card' },
        { value: 'Feature request', label: '🎯 Feature request', icon: 'pi-bullseye' },
        { value: 'General inquiry', label: '❓ General inquiry', icon: 'pi-question-circle' },
        { value: 'Something else', label: '✨ Something else', icon: 'pi-star' }
    ];

    const urgencyLevels = [
        { value: 'Relax, take your time', label: 'Relax, take your time' },
        { value: 'Pretty urgent, help soon', label: 'Pretty urgent, help soon' },
        { value: 'Mission-critical!', label: 'Mission-critical!' }
    ];

    const mutation = useMutation({
        mutationFn: (data) => reachOutForSupport(data),
        onSuccess: () => {
            setVisible(false);
            setDescription('');
            toast.success(`Your message has been sent successfully.`);
        },
        onError: (error) => {
            console.error('Error sending message:', error);
            toast.error(`Failed to sent your message. Please try again.`);
        }
    });

    const handleSubmit = () => {
      let hasError = false;
      const newError = { issueType: "", description: "", urgency: "" };
      
      if (issueType.trim() === "") {
          newError.issueType = "Issue type is required.";
          hasError = true;
      }

      if (description.trim() === "") {
          newError.description = "Description is required.";
          hasError = true;
      }

      if (urgency.trim() === "") {
          newError.urgency = "Urgency level is required.";
          hasError = true;
      }

      setError(newError);

      if (hasError) return;

      mutation.mutate({ issue: issueType, description, urgent: urgency });
    };

    const footerElement = (
        <div className={`d-flex justify-content-between`}>
            <Button className='danger-text-button' onClick={() => setVisible(false)}>Cancel</Button>
            <Button className='solid-button' onClick={handleSubmit}>
                Send
                {mutation?.isPending && <ProgressSpinner style={{ width: '16px', height: '16px', marginLeft: '8px' }} /> }
            </Button>
        </div>
    );

    return (
        <Dialog header={headerElement} footer={footerElement} visible={visible} onHide={() => setVisible(false)} className={`${style.modal} custom-modal`}>
            <div className='d-flex flex-nowrap'>
                <div className='d-flex align-items-center'>
                    <div className={style.helpImage}>
                        <img src={helpImage} alt="Support" className='w-100 h-100' />
                    </div>
                </div>
                <div style={{ width: '1px', height: '550px', background: '#EAECF0', margin: '0px 32px' }}></div>
                <div className={style.formContainer}>
                    <div className={style.formSection}>
                        <h6 className={style.sectionTitle}>What's the issue?</h6>
                        <div className={style.radioGroup}>
                            {issueTypes.map((type) => (
                                <div key={type.value} className={style.radioOption}>
                                    <RadioButton
                                        inputId={`issue-${type.value}`}
                                        name="issueType"
                                        value={type.value}
                                        onChange={(e) => setIssueType(e.value)}
                                        checked={issueType === type.value}
                                    />
                                    <label htmlFor={`issue-${type.value}`} className={style.radioLabel}>
                                        {type.label}
                                    </label>
                                </div>
                            ))}
                        </div>
                        {error.issueType && <div className="error-message">{error.issueType}</div>}
                    </div>

                    <div className={style.formSection}>
                        <h6 className={style.sectionTitle}>Tell us more (the more detail, the quicker we can help!)</h6>
                        <InputTextarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            rows={4}
                            placeholder="What can we help you with today?"
                            className={style.textArea}
                        />
                        {error.description && <div className="error-message">{error.description}</div>}
                    </div>

                    <div className={style.formSection}>
                        <h6 className={style.sectionTitle}>How urgent is this?</h6>
                        <div className={style.radioGroup}>
                            {urgencyLevels.map((level) => (
                                <div key={level.value} className={style.radioOption}>
                                    <RadioButton
                                        inputId={`urgency-${level.value}`}
                                        name="urgency"
                                        value={level.value}
                                        onChange={(e) => setUrgency(e.value)}
                                        checked={urgency === level.value}
                                    />
                                    <label htmlFor={`urgency-${level.value}`} className={style.radioLabel}>
                                        {level.label}
                                    </label>
                                </div>
                            ))}
                        </div>
                        {error.urgency && <div className="error-message">{error.urgency}</div>}
                    </div>
                </div>
            </div>
        </Dialog>
    );
};

export default Support;
