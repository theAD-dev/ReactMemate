import React, { useEffect, useState } from 'react';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { Button, Col, Form, Modal, OverlayTrigger, Row, Tooltip } from 'react-bootstrap';
import {
    ChevronLeft,
    Eye,
    PencilSquare,
    Upload,
    XCircle,
    Linkedin,
    Twitter,
    Instagram,
    Facebook,
    Github,
    Youtube,
    Globe,
    CheckCircle
} from "react-bootstrap-icons";
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { useMutation, useQuery } from '@tanstack/react-query';
import clsx from 'clsx';
import { Checkbox } from 'primereact/checkbox';
import { Dropdown } from 'primereact/dropdown';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { ProgressSpinner } from 'primereact/progressspinner';
import { toast } from 'sonner';
import { socialIcons } from './social-icons-base64';
import { createEmailSignature, deleteEmailSignature, getEmailSignature, setDefaultEmailSignature, updateEmailSignature } from '../../../../../APIs/email-template';
import { useTrialHeight } from '../../../../../app/providers/trial-height-provider';
import Sidebar from '../../Sidebar';
import style from '../job-template.module.scss';
import premiumStyle from './premium-email-signatures.module.scss';


// Premium template data with HTML thumbnails
const premiumTemplates = [
    {
        id: 'minimal',
        title: 'Minimal',
        type: 'Premium',
        htmlThumbnail: `
      <div style="width:100%;height:100%;padding:8px;background:#f9fafb;border-radius:4px;">
        <div style="height:6px;width:60%;background:#e4e7ec;margin-bottom:6px;border-radius:4px;"></div>
        <div style="height:6px;width:40%;background:#e4e7ec;margin-bottom:12px;border-radius:4px;"></div>
        <div style="height:6px;width:90%;background:#e4e7ec;margin-bottom:4px;border-radius:4px;"></div>
        <div style="height:6px;width:80%;background:#e4e7ec;margin-bottom:4px;border-radius:4px;"></div>
        <div style="display:flex;gap:4px;margin-top:12px;">
          <div style="height:8px;width:8px;background:#4285F4;border-radius:50%;"></div>
          <div style="height:8px;width:8px;background:#3b5998;border-radius:50%;"></div>
          <div style="height:8px;width:8px;background:#000000;border-radius:50%;"></div>
        </div>
      </div>
    `,
        description: 'A clean, minimal signature without dividers'
    },
    {
        id: 'single-column',
        title: 'Single Column',
        type: 'Premium',
        htmlThumbnail: `
      <div style="width:100%;height:100%;padding:8px;background:#f9fafb;border-radius:4px;">
        <div style="width:24px;height:24px;background:#e4e7ec;border-radius:50%;margin-bottom:8px;"></div>
        <div style="height:1px;width:100%;background:#e4e7ec;margin:8px 0;"></div>
        <div style="height:6px;width:60%;background:#e4e7ec;margin-bottom:6px;border-radius:4px;"></div>
        <div style="height:6px;width:40%;background:#e4e7ec;margin-bottom:6px;border-radius:4px;"></div>
        <div style="height:6px;width:90%;background:#e4e7ec;margin-bottom:4px;border-radius:4px;"></div>
        <div style="height:6px;width:80%;background:#e4e7ec;margin-bottom:4px;border-radius:4px;"></div>
        <div style="height:1px;width:100%;background:#e4e7ec;margin:8px 0;"></div>
        <div style="display:flex;gap:4px;margin-top:4px;">
          <div style="height:8px;width:8px;background:#4285F4;border-radius:50%;"></div>
          <div style="height:8px;width:8px;background:#3b5998;border-radius:50%;"></div>
          <div style="height:8px;width:8px;background:#000000;border-radius:50%;"></div>
          <div style="height:8px;width:8px;background:#E1306C;border-radius:50%;"></div>
        </div>
      </div>
    `,
        description: 'A clean, single-column signature with dividers'
    },
    {
        id: 'two-column',
        title: 'Two Column',
        type: 'Premium',
        htmlThumbnail: `
      <div style="width:100%;height:100%;padding:8px;background:#f9fafb;border-radius:4px;">
        <div style="display:flex;margin-bottom:8px;">
          <div style="width:24px;height:24px;background:#e4e7ec;border-radius:50%;"></div>
          <div style="margin-left:8px;width:calc(100% - 32px);">
            <div style="height:6px;width:70%;background:#e4e7ec;margin-bottom:6px;border-radius:4px;"></div>
            <div style="height:6px;width:50%;background:#e4e7ec;margin-bottom:6px;border-radius:4px;"></div>
          </div>
        </div>
        <div style="height:1px;width:100%;background:#e4e7ec;margin:8px 0;"></div>
        <div style="display:flex;">
          <div style="width:30%;">
            <div style="width:24px;height:24px;background:#e4e7ec;border-radius:4px;"></div>
          </div>
          <div style="width:70%;">
            <div style="height:6px;width:90%;background:#e4e7ec;margin-bottom:4px;border-radius:4px;"></div>
            <div style="height:6px;width:80%;background:#e4e7ec;margin-bottom:4px;border-radius:4px;"></div>
          </div>
        </div>
        <div style="height:1px;width:100%;background:#e4e7ec;margin:8px 0;"></div>
        <div style="display:flex;gap:4px;margin-top:4px;">
          <div style="height:8px;width:8px;background:#4285F4;border-radius:50%;"></div>
          <div style="height:8px;width:8px;background:#3b5998;border-radius:50%;"></div>
          <div style="height:8px;width:8px;background:#000000;border-radius:50%;"></div>
          <div style="height:8px;width:8px;background:#E1306C;border-radius:50%;"></div>
        </div>
      </div>
    `,
        description: 'A two-column signature with photo and logo'
    },
    {
        id: 'vertical',
        title: 'Vertical',
        type: 'Premium',
        htmlThumbnail: `
      <div style="width:100%;height:100%;padding:8px;background:#f9fafb;border-radius:4px;">
        <div style="width:24px;height:24px;background:#e4e7ec;border-radius:50%;margin:0 auto 8px;"></div>
        <div style="height:6px;width:60%;background:#e4e7ec;margin:0 auto 6px;border-radius:4px;"></div>
        <div style="height:6px;width:40%;background:#e4e7ec;margin:0 auto 6px;border-radius:4px;"></div>
        <div style="height:1px;width:100%;background:#e4e7ec;margin:8px 0;"></div>
        <div style="width:30%;margin:0 auto;">
          <div style="width:24px;height:24px;background:#e4e7ec;border-radius:4px;margin:0 auto;"></div>
        </div>
        <div style="height:6px;width:90%;background:#e4e7ec;margin:8px auto 4px;border-radius:4px;"></div>
        <div style="height:6px;width:80%;background:#e4e7ec;margin:0 auto 4px;border-radius:4px;"></div>
        <div style="height:1px;width:100%;background:#e4e7ec;margin:8px 0;"></div>
        <div style="display:flex;gap:4px;margin:4px auto;width:fit-content;">
          <div style="height:8px;width:8px;background:#4285F4;border-radius:50%;"></div>
          <div style="height:8px;width:8px;background:#3b5998;border-radius:50%;"></div>
          <div style="height:8px;width:8px;background:#000000;border-radius:50%;"></div>
          <div style="height:8px;width:8px;background:#E1306C;border-radius:50%;"></div>
        </div>
      </div>
    `,
        description: 'A vertical signature with centered content'
    },
    {
        id: 'modern-divider',
        title: 'Modern Divider',
        type: 'Premium',
        htmlThumbnail: `
      <div style="width:100%;height:100%;padding:8px;background:#f9fafb;border-radius:4px;">
        <div style="display:flex;margin-bottom:8px;">
          <div style="width:24px;height:24px;background:#e4e7ec;border-radius:50%;"></div>
          <div style="margin-left:8px;width:calc(100% - 32px);">
            <div style="height:6px;width:70%;background:#00BCD4;margin-bottom:6px;border-radius:4px;"></div>
            <div style="height:6px;width:50%;background:#e4e7ec;margin-bottom:6px;border-radius:4px;"></div>
          </div>
        </div>
        <div style="height:1px;width:100%;background:#00BCD4;margin:8px 0;"></div>
        <div style="height:6px;width:90%;background:#e4e7ec;margin-bottom:4px;border-radius:4px;"></div>
        <div style="height:6px;width:80%;background:#e4e7ec;margin-bottom:4px;border-radius:4px;"></div>
        <div style="height:1px;width:100%;background:#00BCD4;margin:8px 0;"></div>
        <div style="display:flex;gap:4px;margin-top:4px;">
          <div style="height:8px;width:8px;background:#4285F4;border-radius:50%;"></div>
          <div style="height:8px;width:8px;background:#3b5998;border-radius:50%;"></div>
          <div style="height:8px;width:8px;background:#000000;border-radius:50%;"></div>
          <div style="height:8px;width:8px;background:#E1306C;border-radius:50%;"></div>
        </div>
      </div>
    `,
        description: 'A modern signature with colored dividers'
    },
    {
        id: 'photo-left',
        title: 'Photo Left',
        type: 'Premium',
        htmlThumbnail: `
      <div style="width:100%;height:100%;padding:8px;background:#f9fafb;border-radius:4px;">
        <div style="display:flex;margin-bottom:8px;">
          <div style="width:30px;height:30px;background:#e4e7ec;border-radius:50%;margin-right:8px;"></div>
          <div style="width:calc(100% - 38px);">
            <div style="height:6px;width:70%;background:#e4e7ec;margin-bottom:6px;border-radius:4px;"></div>
            <div style="height:6px;width:50%;background:#e4e7ec;margin-bottom:6px;border-radius:4px;"></div>
            <div style="height:6px;width:90%;background:#e4e7ec;margin-bottom:4px;border-radius:4px;"></div>
            <div style="height:6px;width:80%;background:#e4e7ec;margin-bottom:4px;border-radius:4px;"></div>
          </div>
        </div>
        <div style="height:1px;width:100%;background:#e4e7ec;margin:8px 0;"></div>
        <div style="display:flex;gap:4px;margin-top:4px;">
          <div style="height:8px;width:8px;background:#4285F4;border-radius:50%;"></div>
          <div style="height:8px;width:8px;background:#3b5998;border-radius:50%;"></div>
          <div style="height:8px;width:8px;background:#000000;border-radius:50%;"></div>
          <div style="height:8px;width:8px;background:#E1306C;border-radius:50%;"></div>
        </div>
      </div>
    `,
        description: 'A signature with photo on the left side'
    },
    {
        id: 'photo-right',
        title: 'Photo Right',
        type: 'Premium',
        htmlThumbnail: `
      <div style="width:100%;height:100%;padding:8px;background:#f9fafb;border-radius:4px;">
        <div style="display:flex;margin-bottom:8px;">
          <div style="width:calc(100% - 38px);">
            <div style="height:6px;width:70%;background:#e4e7ec;margin-bottom:6px;border-radius:4px;"></div>
            <div style="height:6px;width:50%;background:#e4e7ec;margin-bottom:6px;border-radius:4px;"></div>
            <div style="height:6px;width:90%;background:#e4e7ec;margin-bottom:4px;border-radius:4px;"></div>
            <div style="height:6px;width:80%;background:#e4e7ec;margin-bottom:4px;border-radius:4px;"></div>
          </div>
          <div style="width:30px;height:30px;background:#e4e7ec;border-radius:50%;margin-left:8px;"></div>
        </div>
        <div style="height:1px;width:100%;background:#e4e7ec;margin:8px 0;"></div>
        <div style="display:flex;gap:4px;margin-top:4px;">
          <div style="height:8px;width:8px;background:#4285F4;border-radius:50%;"></div>
          <div style="height:8px;width:8px;background:#3b5998;border-radius:50%;"></div>
          <div style="height:8px;width:8px;background:#000000;border-radius:50%;"></div>
          <div style="height:8px;width:8px;background:#E1306C;border-radius:50%;"></div>
        </div>
      </div>
    `,
        description: 'A signature with photo on the right side'
    },
    {
        id: 'logo-banner',
        title: 'Logo Banner',
        type: 'Premium',
        htmlThumbnail: `
      <div style="width:100%;height:100%;padding:8px;background:#f9fafb;border-radius:4px;">
        <div style="height:20px;background:#e4e7ec;margin-bottom:8px;border-radius:4px;display:flex;align-items:center;justify-content:center;">
          <div style="width:40px;height:12px;background:#ffffff;border-radius:2px;"></div>
        </div>
        <div style="height:6px;width:60%;background:#e4e7ec;margin-bottom:6px;border-radius:4px;"></div>
        <div style="height:6px;width:40%;background:#e4e7ec;margin-bottom:6px;border-radius:4px;"></div>
        <div style="height:6px;width:90%;background:#e4e7ec;margin-bottom:4px;border-radius:4px;"></div>
        <div style="height:6px;width:80%;background:#e4e7ec;margin-bottom:4px;border-radius:4px;"></div>
        <div style="height:1px;width:100%;background:#e4e7ec;margin:8px 0;"></div>
        <div style="display:flex;gap:4px;margin-top:4px;">
          <div style="height:8px;width:8px;background:#4285F4;border-radius:50%;"></div>
          <div style="height:8px;width:8px;background:#3b5998;border-radius:50%;"></div>
          <div style="height:8px;width:8px;background:#000000;border-radius:50%;"></div>
          <div style="height:8px;width:8px;background:#E1306C;border-radius:50%;"></div>
        </div>
      </div>
    `,
        description: 'A signature with a logo banner at the top'
    }
];

// Social media platforms
const socialPlatforms = [
    { id: 'linkedin', name: 'LinkedIn', icon: Linkedin, color: '#0A66C2' },
    { id: 'twitter', name: 'Twitter', icon: Twitter, color: '#1DA1F2' },
    { id: 'instagram', name: 'Instagram', icon: Instagram, color: '#E4405F' },
    { id: 'facebook', name: 'Facebook', icon: Facebook, color: '#1877F2' },
    { id: 'github', name: 'GitHub', icon: Github, color: '#181717' },
    { id: 'youtube', name: 'YouTube', icon: Youtube, color: '#FF0000' },
    { id: 'website', name: 'Website', icon: Globe, color: '#0E85C7' }
];

const CreateEmailSignatureTemplate = () => {
    const { trialHeight } = useTrialHeight();
    const profileData = JSON.parse(window.localStorage.getItem('profileData') || '{}');
    const has_work_subscription = !!profileData?.has_work_subscription;
    const has_twilio = !!profileData?.has_twilio;
    const navigate = useNavigate();
    const { id } = useParams();
    const [searchParams] = useSearchParams();
    const templateId = searchParams.get('templateId');

    const [title, setTitle] = useState("");
    const [text, setText] = useState(null);
    const [errors, setErrors] = useState({});
    const [isEdit, setIsEdit] = useState(false);
    const [activeTab, setActiveTab] = useState('job-templates');
    const [showPreview, setShowPreview] = useState(false);
    const [previewDevice, setPreviewDevice] = useState('desktop'); // 'desktop', 'tablet', or 'mobile'

    // Premium signature fields
    const [selectedTemplate, setSelectedTemplate] = useState(templateId || premiumTemplates[0].id);
    const [fullName, setFullName] = useState('');
    const [jobTitle, setJobTitle] = useState('');
    const [company, setCompany] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [website, setWebsite] = useState('');
    const [address, setAddress] = useState('');
    const [profileImage, setProfileImage] = useState(null);
    const [companyLogo, setCompanyLogo] = useState(null);
    const [socialLinks, setSocialLinks] = useState({});
    const [activeSocials, setActiveSocials] = useState([]);

    // Advanced customization options
    const [fontFamily, setFontFamily] = useState('Arial, sans-serif');
    const [primaryColor, setPrimaryColor] = useState('#00BCD4'); // Default teal color
    const [textColor, setTextColor] = useState('#333333');
    const [secondaryTextColor, setSecondaryTextColor] = useState('#666666');
    const [linkColor, setLinkColor] = useState('#0E85C7');
    const [fontSize, setFontSize] = useState('normal'); // 'small', 'normal', 'large'
    const [backgroundColor, setBackgroundColor] = useState('transparent');
    const [dividerStyle, setDividerStyle] = useState('solid'); // 'solid', 'dashed', 'dotted'
    const [dividerWidth, setDividerWidth] = useState('1px'); // '1px', '2px', '3px'
    const [dividerColor, setDividerColor] = useState('#0E85C7'); // Default to primary color
    const [profileImageStyle, setProfileImageStyle] = useState('circle'); // 'circle', 'square', 'rounded'
    const [profileImageSize, setProfileImageSize] = useState('medium'); // 'small', 'medium', 'large'
    const [companyLogoSize, setCompanyLogoSize] = useState('medium'); // 'small', 'medium', 'large'
    const [previewKey, setPreviewKey] = useState(0); // Used to force preview re-render
    const [showAdvancedOptions, setShowAdvancedOptions] = useState(false);
    const [isDefault, setIsDefault] = useState(false);

    // Handle social media toggle
    const toggleSocialPlatform = (platformId) => {
        if (activeSocials.includes(platformId)) {
            setActiveSocials(activeSocials.filter(id => id !== platformId));
        } else {
            setActiveSocials([...activeSocials, platformId]);
        }
    };

    // Handle social media link change
    const handleSocialLinkChange = (platformId, value) => {
        setSocialLinks({
            ...socialLinks,
            [platformId]: value
        });
    };

    // Handle image upload with validation and optimization
    const handleImageUpload = (e, type) => {
        const file = e.target.files[0];
        if (!file) return;

        // Validate file type
        const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
        if (!validTypes.includes(file.type)) {
            toast.error('Please upload a valid image file (JPEG, PNG, GIF, or WebP)');
            return;
        }

        // Validate file size (max 2MB)
        if (file.size > 2 * 1024 * 1024) {
            toast.error('Image size should be less than 2MB');
            return;
        }

        const reader = new FileReader();
        reader.onload = (event) => {
            // Create an image element to get dimensions
            const img = new Image();
            img.onload = () => {
                // Create a canvas to resize the image if needed
                const canvas = document.createElement('canvas');
                let width = img.width;
                let height = img.height;

                // Resize if image is too large (max dimension 800px)
                const maxDimension = 800;
                if (width > maxDimension || height > maxDimension) {
                    if (width > height) {
                        height = Math.round(height * (maxDimension / width));
                        width = maxDimension;
                    } else {
                        width = Math.round(width * (maxDimension / height));
                        height = maxDimension;
                    }

                    canvas.width = width;
                    canvas.height = height;
                    const ctx = canvas.getContext('2d');
                    ctx.drawImage(img, 0, 0, width, height);

                    // Convert to optimized data URL
                    const optimizedDataUrl = canvas.toDataURL('image/jpeg', 0.85);

                    if (type === 'profile') {
                        setProfileImage(optimizedDataUrl);
                    } else if (type === 'logo') {
                        setCompanyLogo(optimizedDataUrl);
                    }
                } else {
                    // Use original image if it's already small enough
                    if (type === 'profile') {
                        setProfileImage(event.target.result);
                    } else if (type === 'logo') {
                        setCompanyLogo(event.target.result);
                    }
                }
            };
            img.src = event.target.result;
        };
        reader.onerror = () => {
            toast.error('Error reading file');
        };
        reader.readAsDataURL(file);
    };

    // Remove uploaded image
    const removeImage = (type) => {
        if (type === 'profile') {
            setProfileImage(null);
        } else if (type === 'logo') {
            setCompanyLogo(null);
        }
    };
    const signatureQuery = useQuery({
        queryKey: ["getEmailSignature", id],
        queryFn: () => getEmailSignature(id),
        enabled: !!id,
        retry: 1,
    });
    const mutation = useMutation({
        mutationFn: (templateData) => (id ? updateEmailSignature(id, templateData) : createEmailSignature(templateData)),
        onSuccess: () => {
            toast.success("Template saved successfully!");
            navigate('/settings/templates/email-signatures/');
        },
        onError: (error) => {
            console.error("Error saving template:", error);
            toast.error("Failed to save the template. Please try again.");
        },
    });
    const deleteMutation = useMutation({
        mutationFn: () => (id && deleteEmailSignature(id)),
        onSuccess: () => {
            toast.success("Template deleted successfully!");
            navigate('/settings/templates/email-signatures/');
        },
        onError: (error) => {
            console.error("Error deleting template:", error);
            toast.error("Failed to delete the template. Please try again.");
        },
    });

    const setDefaultTemplateMutation = useMutation({
        mutationFn: () => setDefaultEmailSignature(id),
        onSuccess: () => {
            toast.success("Default template set successfully!");
        },
        onError: (error) => {
            console.error("Error setting default template:", error);
            toast.error("Failed to set the default template. Please try again.");
        },
    });

    // Function to get company logo size based on selection
    const getCompanyLogoSize = (size) => {
        switch (size) {
            case 'small':
                return { height: '40px', width: '40px' };
            case 'large':
                return { height: '80px', width: '80px' };
            case 'medium':
            default:
                return { height: '60px', width: '60px' };
        }
    };

    // Function to get profile image size based on selection
    const getProfileImageSize = (size) => {
        switch (size) {
            case 'small':
                return { width: '40px', height: '40px' };
            case 'large':
                return { width: '80px', height: '80px' };
            case 'medium':
            default:
                return { width: '60px', height: '60px' };
        }
    };

    // Generate HTML for the signature based on selected template and user inputs
    const generateSignatureHTML = () => {
        // Get font size in pixels based on selection
        const getFontSize = (size) => {
            switch (size) {
                case 'small': return { base: '13px', heading: '15px' };
                case 'large': return { base: '15px', heading: '18px' };
                default: return { base: '14px', heading: '16px' }; // normal
            }
        };

        // Get border radius based on style
        const getIconRadius = (style) => {
            switch (style) {
                case 'square': return '0';
                case 'rounded': return '4px';
                default: return '50%'; // circle
            }
        };

        // Get profile image styling
        const getProfileImageStyle = () => {
            const radius = getIconRadius(profileImageStyle);
            const isCircle = profileImageStyle === 'circle';

            if (isCircle) {
                // For circle style, ensure perfect circular cropping
                return `border-radius: ${radius}; object-fit: cover; aspect-ratio: 1/1; overflow: hidden;`;
            } else {
                return `border-radius: ${radius};`;
            }
        };

        // Get border style for dividers
        const getBorderStyle = (style, width) => {
            return `${width} ${style} ${dividerColor}`;
        };

        // Base styling for cross-platform compatibility
        const baseStyles = `
            .email-signature {
                font-family: ${fontFamily};
                max-width: 500px;
                color: ${textColor};
                line-height: 1.4;
                width: 100%;
                background-color: ${backgroundColor};
            }
            .email-signature table {
                border-collapse: collapse;
                mso-table-lspace: 0pt;
                mso-table-rspace: 0pt;
                width: 100%;
            }
            .email-signature td {
                padding: 0;
                vertical-align: top;
            }
            .email-signature img {
                border: 0;
                height: auto;
                line-height: 100%;
                outline: none;
                text-decoration: none;
                -ms-interpolation-mode: bicubic;
            }
            .email-signature a {
                text-decoration: none;
            }
            .email-signature .social-icon {
                display: inline-block;
                margin-right: 8px;
                margin-bottom: 8px;
            }

            /* Responsive styles */
            @media screen and (max-width: 480px) {
                .email-signature .mobile-stack {
                    display: block !important;
                    width: 100% !important;
                    padding-right: 0 !important;
                    padding-bottom: 15px !important;
                }
                .email-signature .mobile-text-center {
                    text-align: center !important;
                }
                .email-signature .mobile-img-center {
                    margin: 0 auto !important;
                }
            }
        `;

        // Generate social media icons HTML
        const socialIconsHTML = activeSocials.map(platformId => {
            const platform = socialPlatforms.find(p => p.id === platformId);
            const link = socialLinks[platformId] || '#';
            // Use Base64 encoded icons to ensure they display in email clients
            return `
                <a href="${link}" class="social-icon" target="_blank" rel="noopener noreferrer" style="display: inline-block; margin-right: 8px;">
                    <img src="${socialIcons[platformId] || socialIcons['website']}"
                         alt="${platform.name}" width="24" height="24"
                         style="border: none; display: inline-block; padding: 2px;" />
                </a>
            `;
        }).join('');

        // Different templates
        let signatureHTML = '';

        switch (selectedTemplate) {
            case 'single-column':
                signatureHTML = `
                    <div class="email-signature" style="background-color: ${backgroundColor};">
                        <table cellpadding="0" cellspacing="0" border="0" style="width: 100%;">
                            <tr>
                                <td class="mobile-text-center">
                                    ${profileImage ? `<div style="width: ${getProfileImageSize(profileImageSize).width}; height: ${getProfileImageSize(profileImageSize).height}; ${profileImageStyle === 'circle' ? 'overflow: hidden; border-radius: 50%;' : ''} margin-bottom: 10px;">
                                        <img src="${profileImage}" alt="${fullName}" width="${getProfileImageSize(profileImageSize).width.replace('px', '')}" height="${getProfileImageSize(profileImageSize).height.replace('px', '')}" style="${getProfileImageStyle()}; display: block;" class="mobile-img-center" />
                                    </div>` : ''}
                                    <div style="border-bottom: ${getBorderStyle(dividerStyle, dividerWidth)}; margin: 10px 0;"></div>
                                    <h3 style="margin: 0 0 5px 0; font-size: ${getFontSize(fontSize).heading}; color: ${textColor}; font-weight: 600; font-family: ${fontFamily};">${fullName}</h3>
                                    <p style="margin: 0 0 10px 0; font-size: ${getFontSize(fontSize).base}; color: ${secondaryTextColor}; font-family: ${fontFamily};">${jobTitle}${company ? ` at ${company}` : ''}</p>
                                    ${email ? `<p style="margin: 0 0 3px 0; font-size: ${getFontSize(fontSize).base}; font-family: ${fontFamily};"><a href="mailto:${email}" style="color: ${linkColor};">${email}</a></p>` : ''}
                                    ${phone ? `<p style="margin: 0 0 3px 0; font-size: ${getFontSize(fontSize).base}; font-family: ${fontFamily};"><a href="tel:${phone}" style="color: ${textColor};">${phone}</a></p>` : ''}
                                    ${website ? `<p style="margin: 0 0 3px 0; font-size: ${getFontSize(fontSize).base}; font-family: ${fontFamily};"><a href="${website}" style="color: ${linkColor};">${website}</a></p>` : ''}
                                    ${address ? `<p style="margin: 0 0 3px 0; font-size: ${getFontSize(fontSize).base}; color: ${secondaryTextColor}; font-family: ${fontFamily};">${address}</p>` : ''}
                                    <div style="border-bottom: ${getBorderStyle(dividerStyle, dividerWidth)}; margin: 10px 0;"></div>
                                    ${socialIconsHTML ? `<div style="margin-top: 10px;">${socialIconsHTML}</div>` : ''}
                                </td>
                            </tr>
                        </table>
                    </div>
                `;
                break;

            case 'two-column':
                signatureHTML = `
                    <div class="email-signature" style="background-color: ${backgroundColor};">
                        <table cellpadding="0" cellspacing="0" border="0" style="width: 100%;">
                            <tr>
                                ${profileImage ? `
                                <td class="mobile-stack" style="padding-right: 15px; width: 80px; vertical-align: center;">
                                    ${profileImage ? `<div style="width: ${getProfileImageSize(profileImageSize).width}; height: ${getProfileImageSize(profileImageSize).height}; ${profileImageStyle === 'circle' ? 'overflow: hidden; border-radius: 50%;' : ''} margin-bottom: 0;">
                                        <img src="${profileImage}" alt="${fullName}" width="${getProfileImageSize(profileImageSize).width.replace('px', '')}" height="${getProfileImageSize(profileImageSize).height.replace('px', '')}" style="${getProfileImageStyle()}; display: block;" class="mobile-img-center" />
                                    </div>` : ''}
                                </td>` : ''}
                                <td class="mobile-text-center">
                                    <h3 style="margin: 0 0 5px 0; font-size: ${getFontSize(fontSize).heading}; color: ${textColor}; font-weight: 600; font-family: ${fontFamily};">${fullName}</h3>
                                    <p style="margin: 0 0 0px 0; font-size: ${getFontSize(fontSize).base}; color: ${secondaryTextColor}; font-family: ${fontFamily};">${jobTitle}${company ? ` at ${company}` : ''}</p>
                                </td>
                            </tr>
                        </table>
                        <div style="border-bottom: ${getBorderStyle(dividerStyle, dividerWidth)}; margin: 10px 0;"></div>
                        <table cellpadding="0" cellspacing="0" border="0" style="width: 100%;">
                            <tr>
                                ${companyLogo ? `
                                <td class="mobile-stack" style="padding-right: 15px; width: 80px; vertical-align: top;">
                                    ${companyLogo ? `<img src="${companyLogo}" alt="${company}" height="${getCompanyLogoSize(companyLogoSize).height.replace('px', '')}" style="display: block; margin-top: 10px; width: ${getCompanyLogoSize(companyLogoSize).width};" class="mobile-img-center" />` : ''}
                                </td>` : ''}
                                <td class="mobile-stack mobile-text-center" style="vertical-align: top;">
                                    ${email ? `<p style="margin: 0 0 3px 0; font-size: ${getFontSize(fontSize).base}; font-family: ${fontFamily};"><a href="mailto:${email}" style="color: ${linkColor};">${email}</a></p>` : ''}
                                    ${phone ? `<p style="margin: 0 0 3px 0; font-size: ${getFontSize(fontSize).base}; font-family: ${fontFamily};"><a href="tel:${phone}" style="color: ${textColor};">${phone}</a></p>` : ''}
                                    ${website ? `<p style="margin: 0 0 3px 0; font-size: ${getFontSize(fontSize).base}; font-family: ${fontFamily};"><a href="${website}" style="color: ${linkColor};">${website}</a></p>` : ''}
                                    ${address ? `<p style="margin: 0 0 3px 0; font-size: ${getFontSize(fontSize).base}; color: ${secondaryTextColor}; font-family: ${fontFamily};">${address}</p>` : ''}
                                </td>
                            </tr>
                        </table>
                        <div style="border-bottom: ${getBorderStyle(dividerStyle, dividerWidth)}; margin: 10px 0;"></div>
                        ${socialIconsHTML ? `<div style="margin-top: 10px;">${socialIconsHTML}</div>` : ''}
                    </div>
                `;
                break;

            case 'vertical':
                signatureHTML = `
                    <div class="email-signature" style="background-color: ${backgroundColor};">
                        <table cellpadding="0" cellspacing="0" border="0" style="width: 100%;">
                            <tr>
                                <td class="mobile-text-center" style="text-align: center;">
                                    ${profileImage ? `<div style="width: ${getProfileImageSize(profileImageSize).width}; height: ${getProfileImageSize(profileImageSize).height}; ${profileImageStyle === 'circle' ? 'overflow: hidden; border-radius: 50%;' : ''} margin: 0 auto 10px;">
                                        <img src="${profileImage}" alt="${fullName}" width="${getProfileImageSize(profileImageSize).width.replace('px', '')}" height="${getProfileImageSize(profileImageSize).height.replace('px', '')}" style="${getProfileImageStyle()}; display: block;" />
                                    </div>` : ''}
                                    <h3 style="margin: 0 0 5px 0; font-size: ${getFontSize(fontSize).heading}; color: ${textColor}; font-weight: 600; font-family: ${fontFamily};">${fullName}</h3>
                                    <p style="margin: 0 0 10px 0; font-size: ${getFontSize(fontSize).base}; color: ${secondaryTextColor}; font-family: ${fontFamily};">${jobTitle}${company ? ` at ${company}` : ''}</p>
                                    <div style="border-bottom: ${getBorderStyle(dividerStyle, dividerWidth)}; margin: 10px 0;"></div>
                                    ${companyLogo ? `<img src="${companyLogo}" alt="${company}" height="${getCompanyLogoSize(companyLogoSize).height}" style="display: block; margin: 10px auto; width: ${getCompanyLogoSize(companyLogoSize).width};" />` : ''}
                                    ${email ? `<p style="margin: 0 0 3px 0; font-size: ${getFontSize(fontSize).base}; font-family: ${fontFamily};"><a href="mailto:${email}" style="color: ${linkColor};">${email}</a></p>` : ''}
                                    ${phone ? `<p style="margin: 0 0 3px 0; font-size: ${getFontSize(fontSize).base}; font-family: ${fontFamily};"><a href="tel:${phone}" style="color: ${textColor};">${phone}</a></p>` : ''}
                                    ${website ? `<p style="margin: 0 0 3px 0; font-size: ${getFontSize(fontSize).base}; font-family: ${fontFamily};"><a href="${website}" style="color: ${linkColor};">${website}</a></p>` : ''}
                                    ${address ? `<p style="margin: 0 0 3px 0; font-size: ${getFontSize(fontSize).base}; color: ${secondaryTextColor}; font-family: ${fontFamily};">${address}</p>` : ''}
                                    <div style="border-bottom: ${getBorderStyle(dividerStyle, dividerWidth)}; margin: 10px 0;"></div>
                                    ${socialIconsHTML ? `<div style="margin-top: 10px; text-align: center;">${socialIconsHTML}</div>` : ''}
                                </td>
                            </tr>
                        </table>
                    </div>
                `;
                break;

            case 'modern-divider':
                signatureHTML = `
                    <div class="email-signature" style="background-color: ${backgroundColor};">
                        <table cellpadding="0" cellspacing="0" border="0" style="width: 100%;">
                            <tr>
                                ${profileImage ? `
                                <td class="mobile-stack" style="padding-right: 15px; width: 80px; vertical-align: top;">
                                    <div style="width: ${getProfileImageSize(profileImageSize).width}; height: ${getProfileImageSize(profileImageSize).height}; ${profileImageStyle === 'circle' ? 'overflow: hidden; border-radius: 50%;' : ''} margin-top: 10px;">
                                        <img src="${profileImage}" alt="${fullName}" width="${getProfileImageSize(profileImageSize).width.replace('px', '')}" height="${getProfileImageSize(profileImageSize).height.replace('px', '')}" style="${getProfileImageStyle()}; display: block;" class="mobile-img-center" />
                                    </div>
                                </td>` : ''}
                                <td class="mobile-stack mobile-text-center" style="vertical-align: top;">
                                    <h3 style="margin: 0 0 5px 0; font-size: ${getFontSize(fontSize).heading}; color: ${primaryColor}; font-weight: 600; font-family: ${fontFamily};">${fullName}</h3>
                                    <p style="margin: 0 0 10px 0; font-size: ${getFontSize(fontSize).base}; color: ${secondaryTextColor}; font-family: ${fontFamily};">${jobTitle}${company ? ` at ${company}` : ''}</p>
                                </td>
                            </tr>
                        </table>
                        <div style="border-bottom: ${dividerWidth} ${dividerStyle} ${dividerColor}; margin: 10px 0;"></div>
                        <table cellpadding="0" cellspacing="0" border="0" style="width: 100%;">
                            <tr>
                                <td>
                                    ${email ? `<p style="margin: 0 0 3px 0; font-size: ${getFontSize(fontSize).base}; font-family: ${fontFamily};"><a href="mailto:${email}" style="color: ${linkColor};">${email}</a></p>` : ''}
                                    ${phone ? `<p style="margin: 0 0 3px 0; font-size: ${getFontSize(fontSize).base}; font-family: ${fontFamily};"><a href="tel:${phone}" style="color: ${textColor};">${phone}</a></p>` : ''}
                                    ${website ? `<p style="margin: 0 0 3px 0; font-size: ${getFontSize(fontSize).base}; font-family: ${fontFamily};"><a href="${website}" style="color: ${linkColor};">${website}</a></p>` : ''}
                                    ${address ? `<p style="margin: 0 0 3px 0; font-size: ${getFontSize(fontSize).base}; color: ${secondaryTextColor}; font-family: ${fontFamily};">${address}</p>` : ''}
                                </td>
                            </tr>
                        </table>
                        <div style="border-bottom: ${dividerWidth} ${dividerStyle} ${primaryColor}; margin: 10px 0;"></div>
                        ${socialIconsHTML ? `<div style="margin-top: 10px;">${socialIconsHTML}</div>` : ''}
                    </div>
                `;
                break;

            case 'photo-left':
                signatureHTML = `
                    <div class="email-signature" style="background-color: ${backgroundColor};">
                        <table cellpadding="0" cellspacing="0" border="0" style="width: 100%;">
                            <tr>
                                ${profileImage ? `
                                <td class="mobile-stack" style="padding-right: 15px; width: 80px; vertical-align: top;">
                                    <div style="width: ${getProfileImageSize(profileImageSize).width}; height: ${getProfileImageSize(profileImageSize).height}; ${profileImageStyle === 'circle' ? 'overflow: hidden; border-radius: 50%;' : ''} margin-top: 10px;">
                                        <img src="${profileImage}" alt="${fullName}" width="${getProfileImageSize(profileImageSize).width.replace('px', '')}" height="${getProfileImageSize(profileImageSize).height.replace('px', '')}" style="${getProfileImageStyle()}; display: block;" class="mobile-img-center" />
                                    </div>
                                </td>` : ''}
                                <td class="mobile-stack mobile-text-center" style="vertical-align: top;">
                                    <h3 style="margin: 0 0 5px 0; font-size: ${getFontSize(fontSize).heading}; color: ${textColor}; font-weight: 600; font-family: ${fontFamily};">${fullName}</h3>
                                    <p style="margin: 0 0 5px 0; font-size: ${getFontSize(fontSize).base}; color: ${secondaryTextColor}; font-family: ${fontFamily};">${jobTitle}${company ? ` at ${company}` : ''}</p>
                                    ${email ? `<p style="margin: 0 0 3px 0; font-size: ${getFontSize(fontSize).base}; font-family: ${fontFamily};"><a href="mailto:${email}" style="color: ${linkColor};">${email}</a></p>` : ''}
                                    ${phone ? `<p style="margin: 0 0 3px 0; font-size: ${getFontSize(fontSize).base}; font-family: ${fontFamily};"><a href="tel:${phone}" style="color: ${textColor};">${phone}</a></p>` : ''}
                                    ${website ? `<p style="margin: 0 0 3px 0; font-size: ${getFontSize(fontSize).base}; font-family: ${fontFamily};"><a href="${website}" style="color: ${linkColor};">${website}</a></p>` : ''}
                                    ${address ? `<p style="margin: 0 0 3px 0; font-size: ${getFontSize(fontSize).base}; color: ${secondaryTextColor}; font-family: ${fontFamily};">${address}</p>` : ''}
                                </td>
                            </tr>
                        </table>
                        <div style="border-bottom: ${getBorderStyle(dividerStyle, dividerWidth)}; margin: 10px 0;"></div>
                        ${socialIconsHTML ? `<div style="margin-top: 10px;">${socialIconsHTML}</div>` : ''}
                    </div>
                `;
                break;

            case 'photo-right':
                signatureHTML = `
                    <div class="email-signature" style="background-color: ${backgroundColor};">
                        <table cellpadding="0" cellspacing="0" border="0" style="width: 100%;">
                            <tr>
                                <td class="mobile-stack mobile-text-center" style="vertical-align: top;">
                                    <h3 style="margin: 0 0 5px 0; font-size: ${getFontSize(fontSize).heading}; color: ${textColor}; font-weight: 600; font-family: ${fontFamily};">${fullName}</h3>
                                    <p style="margin: 0 0 5px 0; font-size: ${getFontSize(fontSize).base}; color: ${secondaryTextColor}; font-family: ${fontFamily};">${jobTitle}${company ? ` at ${company}` : ''}</p>
                                    ${email ? `<p style="margin: 0 0 3px 0; font-size: ${getFontSize(fontSize).base}; font-family: ${fontFamily};"><a href="mailto:${email}" style="color: ${linkColor};">${email}</a></p>` : ''}
                                    ${phone ? `<p style="margin: 0 0 3px 0; font-size: ${getFontSize(fontSize).base}; font-family: ${fontFamily};"><a href="tel:${phone}" style="color: ${textColor};">${phone}</a></p>` : ''}
                                    ${website ? `<p style="margin: 0 0 3px 0; font-size: ${getFontSize(fontSize).base}; font-family: ${fontFamily};"><a href="${website}" style="color: ${linkColor};">${website}</a></p>` : ''}
                                    ${address ? `<p style="margin: 0 0 3px 0; font-size: ${getFontSize(fontSize).base}; color: ${secondaryTextColor}; font-family: ${fontFamily};">${address}</p>` : ''}
                                </td>
                                ${profileImage ? `
                                <td class="mobile-stack" style="padding-left: 15px; width: 80px; vertical-align: top;">
                                    <div style="width: ${getProfileImageSize(profileImageSize).width}; height: ${getProfileImageSize(profileImageSize).height}; ${profileImageStyle === 'circle' ? 'overflow: hidden; border-radius: 50%;' : ''} margin-top: 10px;">
                                        <img src="${profileImage}" alt="${fullName}" width="${getProfileImageSize(profileImageSize).width.replace('px', '')}" height="${getProfileImageSize(profileImageSize).height.replace('px', '')}" style="${getProfileImageStyle()}; display: block;" class="mobile-img-center" />
                                    </div>
                                </td>` : ''}
                            </tr>
                        </table>
                        <div style="border-bottom: ${getBorderStyle(dividerStyle, dividerWidth)}; margin: 10px 0;"></div>
                        ${socialIconsHTML ? `<div style="margin-top: 10px;">${socialIconsHTML}</div>` : ''}
                    </div>
                `;
                break;

            case 'logo-banner':
                signatureHTML = `
                    <div class="email-signature" style="background-color: ${backgroundColor};">
                        ${companyLogo ? `
                        <div style="background-color: ${primaryColor}; padding: 10px; text-align: center; margin-bottom: 15px;">
                            <img src="${companyLogo}" alt="${company}" height="${getCompanyLogoSize(companyLogoSize).height}" style="display: inline-block; width: ${getCompanyLogoSize(companyLogoSize).width};" />
                        </div>` : ''}
                        <table cellpadding="0" cellspacing="0" border="0" style="width: 100%;">
                            <tr>
                                ${profileImage ? `
                                <td class="mobile-stack" style="padding-right: 15px; width: 80px; vertical-align: top;">
                                    <div style="width: ${getProfileImageSize(profileImageSize).width}; height: ${getProfileImageSize(profileImageSize).height}; ${profileImageStyle === 'circle' ? 'overflow: hidden; border-radius: 50%;' : ''} margin-top: 10px;">
                                        <img src="${profileImage}" alt="${fullName}" width="${getProfileImageSize(profileImageSize).width.replace('px', '')}" height="${getProfileImageSize(profileImageSize).height.replace('px', '')}" style="${getProfileImageStyle()}; display: block;" class="mobile-img-center" />
                                    </div>
                                </td>` : ''}
                                <td class="mobile-stack mobile-text-center" style="vertical-align: top;">
                                    <h3 style="margin: 0 0 5px 0; font-size: ${getFontSize(fontSize).heading}; color: ${textColor}; font-weight: 600; font-family: ${fontFamily};">${fullName}</h3>
                                    <p style="margin: 0 0 5px 0; font-size: ${getFontSize(fontSize).base}; color: ${secondaryTextColor}; font-family: ${fontFamily};">${jobTitle}${company ? ` at ${company}` : ''}</p>
                                    ${email ? `<p style="margin: 0 0 3px 0; font-size: ${getFontSize(fontSize).base}; font-family: ${fontFamily};"><a href="mailto:${email}" style="color: ${linkColor};">${email}</a></p>` : ''}
                                    ${phone ? `<p style="margin: 0 0 3px 0; font-size: ${getFontSize(fontSize).base}; font-family: ${fontFamily};"><a href="tel:${phone}" style="color: ${textColor};">${phone}</a></p>` : ''}
                                    ${website ? `<p style="margin: 0 0 3px 0; font-size: ${getFontSize(fontSize).base}; font-family: ${fontFamily};"><a href="${website}" style="color: ${linkColor};">${website}</a></p>` : ''}
                                    ${address ? `<p style="margin: 0 0 3px 0; font-size: ${getFontSize(fontSize).base}; color: ${secondaryTextColor}; font-family: ${fontFamily};">${address}</p>` : ''}
                                </td>
                            </tr>
                        </table>
                        <div style="border-bottom: ${getBorderStyle(dividerStyle, dividerWidth)}; margin: 10px 0;"></div>
                        ${socialIconsHTML ? `<div style="margin-top: 10px;">${socialIconsHTML}</div>` : ''}
                    </div>
                `;
                break;

            case 'minimal':
                signatureHTML = `
                    <div class="email-signature" style="background-color: ${backgroundColor};">
                        <table cellpadding="0" cellspacing="0" border="0" style="width: 100%;">
                            <tr>
                                <td class="mobile-text-center">
                                    <h3 style="margin: 0 0 5px 0; font-size: ${getFontSize(fontSize).heading}; color: ${textColor}; font-weight: 600; font-family: ${fontFamily};">${fullName}</h3>
                                    <p style="margin: 0 0 10px 0; font-size: ${getFontSize(fontSize).base}; color: ${secondaryTextColor}; font-family: ${fontFamily};">${jobTitle}${company ? ` at ${company}` : ''}</p>
                                    ${email ? `<p style="margin: 0 0 3px 0; font-size: ${getFontSize(fontSize).base}; font-family: ${fontFamily};"><a href="mailto:${email}" style="color: ${linkColor};">${email}</a></p>` : ''}
                                    ${phone ? `<p style="margin: 0 0 3px 0; font-size: ${getFontSize(fontSize).base}; font-family: ${fontFamily};"><a href="tel:${phone}" style="color: ${textColor};">${phone}</a></p>` : ''}
                                    ${website ? `<p style="margin: 0 0 3px 0; font-size: ${getFontSize(fontSize).base}; font-family: ${fontFamily};"><a href="${website}" style="color: ${linkColor};">${website}</a></p>` : ''}
                                    ${address ? `<p style="margin: 0 0 3px 0; font-size: ${getFontSize(fontSize).base}; color: ${secondaryTextColor}; font-family: ${fontFamily};">${address}</p>` : ''}
                                    ${socialIconsHTML ? `<div style="margin-top: 10px;">${socialIconsHTML}</div>` : ''}
                                </td>
                            </tr>
                        </table>
                    </div>
                `;
                break;

            // Keep the default case for backward compatibility
            default:
                signatureHTML = `
                    <div class="email-signature" style="background-color: ${backgroundColor};">
                        <table cellpadding="0" cellspacing="0" border="0">
                            <tr>
                                <td>
                                    <h3 style="margin: 0 0 5px 0; font-size: ${getFontSize(fontSize).heading}; color: ${textColor}; font-weight: 600; font-family: ${fontFamily};">${fullName}</h3>
                                    <p style="margin: 0 0 5px 0; font-size: ${getFontSize(fontSize).base}; color: ${secondaryTextColor}; font-family: ${fontFamily};">${jobTitle}${company ? ` | ${company}` : ''}</p>
                                    ${phone ? `<p style="margin: 0 0 5px 0; font-size: ${getFontSize(fontSize).base}; font-family: ${fontFamily};">Phone: <a href="tel:${phone}" style="color: ${textColor};">${phone}</a></p>` : ''}
                                    ${email ? `<p style="margin: 0 0 5px 0; font-size: ${getFontSize(fontSize).base}; font-family: ${fontFamily};">Email: <a href="mailto:${email}" style="color: ${linkColor};">${email}</a></p>` : ''}
                                    ${website ? `<p style="margin: 0 0 5px 0; font-size: ${getFontSize(fontSize).base}; font-family: ${fontFamily};">Website: <a href="${website}" style="color: ${linkColor};">${website}</a></p>` : ''}
                                    ${address ? `<p style="margin: 0 0 5px 0; font-size: ${getFontSize(fontSize).base}; color: ${secondaryTextColor}; font-family: ${fontFamily};">Address: ${address}</p>` : ''}
                                    ${socialIconsHTML ? `<div style="margin-top: 10px;">${socialIconsHTML}</div>` : ''}
                                </td>
                            </tr>
                        </table>
                    </div>
                `;
        }

        // Add style tag for cross-platform compatibility
        return `<style type="text/css">${baseStyles}</style>${signatureHTML}`;
    };

    // Handle export signature
    const handleExportSignature = () => {
        const signatureHTML = generateSignatureHTML();
        const blob = new Blob([signatureHTML], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${title || 'email-signature'}.html`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        toast.success('Email signature exported successfully!');
    };

    // Handle copy to clipboard
    const handleCopySignature = () => {
        const signatureHTML = generateSignatureHTML();
        navigator.clipboard.writeText(signatureHTML)
            .then(() => {
                toast.success('Email signature copied to clipboard!');
            })
            .catch(err => {
                console.error('Failed to copy signature: ', err);
                toast.error('Failed to copy signature to clipboard');
            });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setErrors({});

        const newErrors = {};
        if (!title) newErrors.title = true;
        if (!fullName) newErrors.fullName = true;
        if (!email) newErrors.email = true;

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        const signatureHTML = generateSignatureHTML();

        const templateData = {
            name: title,
            text: id ? text : signatureHTML,
            template_id: selectedTemplate || null,
            default: isDefault
        };

        console.log(templateData);
        toast.success("Saving your email signature...");
        mutation.mutate(templateData);
    };

    const handleDelete = () => {
        if (id) {
            deleteMutation.mutate();
        }
    };

    useEffect(() => {
        if (signatureQuery?.data) {
            setTitle(signatureQuery?.data?.title);
            setText(signatureQuery?.data?.text);
            setIsDefault(signatureQuery?.data?.is_default || false);
        }
    }, [signatureQuery?.data]);

    return (
        <div className='settings-wrap'>
            <div className="settings-wrapper">
                <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
                <div className="settings-content setModalelBoots">
                    <div className='headSticky' style={{ position: 'relative' }}>
                        <h1>Templates</h1>
                        <div className='contentMenuTab'>
                            <ul>
                                <li><Link to="/settings/templates/email-templates">Email Templates</Link></li>
                                <li className='menuActive'><Link to="/settings/templates/email-signatures">Email Signatures</Link></li>
                                <li><Link to="/settings/templates/proposal-templates">Proposal Templates</Link></li>
                                {!has_work_subscription ? (
                                    <OverlayTrigger
                                        key="top"
                                        placement="top"
                                        overlay={
                                            <Tooltip className='TooltipOverlay width-300' id="tooltip-job-templates">
                                                Work environment is not available for this subscription type
                                            </Tooltip>
                                        }
                                    >
                                        <li style={{ opacity: '.5', cursor: 'not-allowed' }}><Link to="#">Job Templates</Link></li>
                                    </OverlayTrigger>
                                ) : (
                                    <li><Link to="/settings/templates/job-templates">Job Templates</Link></li>
                                )}
                                {!has_twilio ? (
                                    <OverlayTrigger
                                        key="top"
                                        placement="top"
                                        overlay={
                                            <Tooltip className='TooltipOverlay width-300' id="tooltip-job-templates">
                                                Your Twilio account has not been set up yet.
                                            </Tooltip>
                                        }
                                    >
                                        <li style={{ opacity: '.5', cursor: 'not-allowed' }}><Link to="#">SMS Templates</Link></li>
                                    </OverlayTrigger>
                                ) : (
                                    <li><Link to="/settings/templates/sms-templates">SMS Templates</Link></li>
                                )}
                            </ul>
                        </div>
                    </div>

                    {/* Email Signature Preview Modal */}
                    <Modal show={showPreview} onHide={() => setShowPreview(false)} size="lg" centered>
                        <Modal.Header closeButton>
                            <Modal.Title className="font-16 mb-0 p-2">{title || "Email Signature Preview"}</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <div className="d-flex justify-content-center mb-3">
                                <div className="d-flex gap-2">
                                    <Button
                                        onClick={() => setPreviewDevice('desktop')}
                                        className={previewDevice === 'desktop' ? 'info-button' : 'outline-button'}
                                    >
                                        <i className="bi bi-laptop"></i> Desktop
                                    </Button>
                                    <Button
                                        onClick={() => setPreviewDevice('tablet')}
                                        className={previewDevice === 'tablet' ? 'info-button' : 'outline-button'}
                                    >
                                        <i className="bi bi-tablet"></i> Tablet
                                    </Button>
                                    <Button
                                        onClick={() => setPreviewDevice('mobile')}
                                        className={previewDevice === 'mobile' ? 'info-button' : 'outline-button'}
                                    >
                                        <i className="bi bi-phone"></i> Mobile
                                    </Button>
                                </div>
                            </div>
                            <div
                                className={style.emailPreviewContainer}
                                style={{
                                    maxWidth: previewDevice === 'desktop' ? '100%' : previewDevice === 'tablet' ? '768px' : '375px',
                                    margin: '0 auto'
                                }}
                            >
                                <div className={style.emailPreviewHeader}>
                                    <div className={style.emailPreviewHeaderItem}>
                                        <strong>From:</strong> Your Name &lt;your.email@example.com&gt;
                                    </div>
                                    <div className={style.emailPreviewHeaderItem}>
                                        <strong>To:</strong> Recipient &lt;recipient@example.com&gt;
                                    </div>
                                    <div className={style.emailPreviewHeaderItem}>
                                        <strong>Subject:</strong> Email with Signature
                                    </div>
                                </div>
                                <div className={style.emailPreviewBody}>
                                    <p>Hello,</p>
                                    <p>This is a sample email message. Your actual email content would appear here.</p>
                                    <p>Best regards,</p>
                                    <div className={style.emailSignature}>
                                        <div key={previewKey} className={style.emailSignatureContent} dangerouslySetInnerHTML={{ __html: generateSignatureHTML() }} />
                                    </div>
                                </div>
                            </div>
                        </Modal.Body>
                        <Modal.Footer>
                            <Button className="outline-button" variant="secondary" onClick={() => setShowPreview(false)}>
                                Close
                            </Button>
                        </Modal.Footer>
                    </Modal>

                    <div className={`content_wrap_main mt-0`} style={{ background: '#F9FAFB', paddingBottom: `${trialHeight}px` }}>
                        <div className='content_wrapper d-block px-3' style={{ paddingTop: '24px', paddingBottom: '100px' }}>
                            <Link to='/settings/templates/email-signatures/' className={clsx(style.transparent, 'text-button border px-0')} style={{ width: "fit-content", marginBottom: '16px' }}>
                                <ChevronLeft color="#475467" size={20} /> <span style={{ color: '#475467' }}>Go Back</span>
                            </Link>

                            <div className='d-flex align-items-center w-100'>
                                {
                                    isEdit ? (
                                        <>
                                            <InputText onBlur={() => setIsEdit(false)} className={clsx(style.inputBox, style.templateName, style.transparent, 'me-2 p-0')} value={title} onChange={(e) => {
                                                setTitle(e.target.value);
                                                setErrors((others) => ({ ...others, title: false }));
                                            }} autoFocus
                                                placeholder='[ Template ]'
                                            />
                                        </>
                                    ) : <span className={clsx(style.templateName, 'me-2')}>{title || "[ Template Name ]"}</span>
                                }
                                <div style={{ width: '30px' }}>
                                    {signatureQuery?.isFetching ?
                                        <ProgressSpinner style={{ width: '20px', height: '20px', position: 'relative', top: '2px' }} />
                                        : <PencilSquare color='#106B99' onClick={() => setIsEdit(true)} size={16} style={{ cursor: 'pointer' }} />
                                    }
                                </div>
                            </div>
                            {errors?.title && (
                                <p className="error-message mb-0">{"Title is required"}</p>
                            )}

                            <div className={style.divider}></div>
                            {!id ? (
                                <Row className="mt-4">
                                    {/* Left Column - Form */}
                                    <Col md={7}>
                                        <div className={premiumStyle.formSection}>
                                            <h3>Select your template</h3>
                                            <div className={premiumStyle.templateSelector}>
                                                <div className={premiumStyle.templateOptions}>
                                                    {premiumTemplates.map(template => (
                                                        <div
                                                            key={template.id}
                                                            className={clsx(
                                                                premiumStyle.templateOption,
                                                                { [premiumStyle.selected]: selectedTemplate === template.id }
                                                            )}
                                                            onClick={() => setSelectedTemplate(template.id)}
                                                        >
                                                            <div
                                                                className={premiumStyle.thumbnailContainer}
                                                                dangerouslySetInnerHTML={{ __html: template.htmlThumbnail }}
                                                            ></div>
                                                            <div className={premiumStyle.templateName}>{template.title}</div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>

                                            <h3>Personal Information</h3>
                                            <Form>
                                                <Row>
                                                    <Col md={6}>
                                                        <Form.Group className="mb-3">
                                                            <Form.Label className={premiumStyle.label}>Full Name <span className="text-danger">*</span></Form.Label>
                                                            <Form.Control
                                                                type="text"
                                                                value={fullName}
                                                                onChange={(e) => {
                                                                    setFullName(e.target.value);
                                                                    setErrors(prev => ({ ...prev, fullName: false }));
                                                                }}
                                                                isInvalid={errors.fullName}
                                                                placeholder="John Doe"
                                                                className={premiumStyle.inputBox}
                                                            />
                                                            {errors.fullName && <Form.Text className="text-danger">Full name is required</Form.Text>}
                                                        </Form.Group>
                                                    </Col>
                                                    <Col md={6}>
                                                        <Form.Group className="mb-3">
                                                            <Form.Label className={premiumStyle.label}>Job Title</Form.Label>
                                                            <Form.Control
                                                                type="text"
                                                                value={jobTitle}
                                                                onChange={(e) => setJobTitle(e.target.value)}
                                                                placeholder="Marketing Manager"
                                                                className={premiumStyle.inputBox}
                                                            />
                                                        </Form.Group>
                                                    </Col>
                                                </Row>

                                                <Row>
                                                    <Col md={6}>
                                                        <Form.Group className="mb-3">
                                                            <Form.Label className={premiumStyle.label}>Email <span className="text-danger">*</span></Form.Label>
                                                            <Form.Control
                                                                type="email"
                                                                value={email}
                                                                onChange={(e) => {
                                                                    setEmail(e.target.value);
                                                                    setErrors(prev => ({ ...prev, email: false }));
                                                                }}
                                                                isInvalid={errors.email}
                                                                placeholder="john.doe@example.com"
                                                                className={premiumStyle.inputBox}
                                                            />
                                                            {errors.email && <Form.Text className="text-danger">Email is required</Form.Text>}
                                                        </Form.Group>
                                                    </Col>
                                                    <Col md={6}>
                                                        <Form.Group className="mb-3">
                                                            <Form.Label className={premiumStyle.label}>Phone</Form.Label>
                                                            <Form.Control
                                                                type="text"
                                                                value={phone}
                                                                onChange={(e) => setPhone(e.target.value)}
                                                                placeholder="+1 (555) 123-4567"
                                                                className={premiumStyle.inputBox}
                                                            />
                                                        </Form.Group>
                                                    </Col>
                                                </Row>

                                                <Row>
                                                    <Col md={6}>
                                                        <Form.Group className="mb-3">
                                                            <Form.Label className={premiumStyle.label}>Company</Form.Label>
                                                            <Form.Control
                                                                type="text"
                                                                value={company}
                                                                onChange={(e) => setCompany(e.target.value)}
                                                                placeholder="Acme Inc."
                                                                className={premiumStyle.inputBox}
                                                            />
                                                        </Form.Group>
                                                    </Col>
                                                    <Col md={6}>
                                                        <Form.Group className="mb-3">
                                                            <Form.Label className={premiumStyle.label}>Website</Form.Label>
                                                            <Form.Control
                                                                type="text"
                                                                value={website}
                                                                onChange={(e) => setWebsite(e.target.value)}
                                                                placeholder="https://example.com"
                                                                className={premiumStyle.inputBox}
                                                            />
                                                        </Form.Group>
                                                    </Col>
                                                </Row>

                                                <Form.Group className="mb-3">
                                                    <Form.Label className={premiumStyle.label}>Address</Form.Label>
                                                    <Form.Control
                                                        type="text"
                                                        value={address}
                                                        className={premiumStyle.inputBox}
                                                        onChange={(e) => setAddress(e.target.value)}
                                                        placeholder="123 Main St, City, State, 12345"
                                                    />
                                                </Form.Group>
                                            </Form>

                                            <h3>Images</h3>
                                            <div className={premiumStyle.imageUploadSection}>
                                                <div className={premiumStyle.imageUploadContainer}>
                                                    <div>
                                                        <Form.Label>Profile Picture</Form.Label>
                                                        {profileImage ? (
                                                            <div className={clsx(premiumStyle.imageUploadBox, premiumStyle.hasImage)}>
                                                                <img src={profileImage} alt="Profile" />
                                                                <button
                                                                    className={premiumStyle.removeImageButton}
                                                                    onClick={() => removeImage('profile')}
                                                                    type="button"
                                                                >
                                                                    <XCircle size={14} />
                                                                </button>
                                                            </div>
                                                        ) : (
                                                            <label className={premiumStyle.imageUploadBox}>
                                                                <Upload className={premiumStyle.uploadIcon} size={24} />
                                                                <p>Upload Image</p>
                                                                <input
                                                                    type="file"
                                                                    accept="image/*"
                                                                    style={{ display: 'none' }}
                                                                    onChange={(e) => handleImageUpload(e, 'profile')}
                                                                />
                                                            </label>
                                                        )}
                                                    </div>

                                                    <div>
                                                        <Form.Label>Company Logo</Form.Label>
                                                        {companyLogo ? (
                                                            <div className={clsx(premiumStyle.imageUploadBox, premiumStyle.hasImage)}>
                                                                <img
                                                                    src={companyLogo}
                                                                    alt="Company Logo"
                                                                    style={{
                                                                        height: getCompanyLogoSize(companyLogoSize).height,
                                                                        width: getCompanyLogoSize(companyLogoSize).width
                                                                    }}
                                                                />
                                                                <button
                                                                    className={premiumStyle.removeImageButton}
                                                                    onClick={() => removeImage('logo')}
                                                                    type="button"
                                                                >
                                                                    <XCircle size={14} />
                                                                </button>
                                                            </div>
                                                        ) : (
                                                            <label className={premiumStyle.imageUploadBox}>
                                                                <Upload className={premiumStyle.uploadIcon} size={24} />
                                                                <p>Upload Logo</p>
                                                                <input
                                                                    type="file"
                                                                    accept="image/*"
                                                                    style={{ display: 'none' }}
                                                                    onChange={(e) => handleImageUpload(e, 'logo')}
                                                                />
                                                            </label>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>

                                            <h3>Social Media</h3>
                                            <div className={premiumStyle.socialMediaSection}>
                                                <Form.Label>Select platforms to include:</Form.Label>
                                                <div className={premiumStyle.socialMediaList}>
                                                    {socialPlatforms.map(platform => {
                                                        const isActive = activeSocials.includes(platform.id);
                                                        return (
                                                            <div
                                                                key={platform.id}
                                                                className={clsx(
                                                                    premiumStyle.socialMediaItem,
                                                                    { [premiumStyle.active]: isActive }
                                                                )}
                                                                onClick={() => toggleSocialPlatform(platform.id)}
                                                            >
                                                                <platform.icon className={premiumStyle.socialIcon} size={16} />
                                                                <span className="font-14">{platform.name}</span>
                                                            </div>
                                                        );
                                                    })}
                                                </div>

                                                {activeSocials.length > 0 && (
                                                    <div className="mt-3">
                                                        {activeSocials.map(platformId => {
                                                            const platform = socialPlatforms.find(p => p.id === platformId);
                                                            return (
                                                                <Form.Group key={platformId} className="mb-2">
                                                                    <Form.Label className={premiumStyle.label}>{platform.name} URL</Form.Label>
                                                                    <Form.Control
                                                                        type="text"
                                                                        value={socialLinks[platformId] || ''}
                                                                        onChange={(e) => handleSocialLinkChange(platformId, e.target.value)}
                                                                        placeholder={`https://${platformId}.com/username`}
                                                                        className={premiumStyle.inputBox}
                                                                    />
                                                                </Form.Group>
                                                            );
                                                        })}
                                                    </div>
                                                )}
                                            </div>

                                            <h3>Advanced Options</h3>
                                            <div className={premiumStyle.advancedOptionsSection}>
                                                <div className="d-flex justify-content-between align-items-center mb-2">
                                                    <Form.Label className="mb-0">Customize your signature appearance</Form.Label>
                                                    <Button
                                                        onClick={() => setShowAdvancedOptions(!showAdvancedOptions)}
                                                        className="py-1 outline-button"
                                                        style={{ width: '80px' }}
                                                    >
                                                        {showAdvancedOptions ? 'Hide' : 'Show'}
                                                    </Button>
                                                </div>

                                                {showAdvancedOptions && (
                                                    <div className="p-3 border rounded">
                                                        <Form.Group className="mb-3">
                                                            <Form.Label className={premiumStyle.label}>Font Family</Form.Label>
                                                            <Dropdown
                                                                value={fontFamily}
                                                                onChange={(e) => setFontFamily(e.value)}
                                                                options={[
                                                                    { label: 'Arial', value: 'Arial, sans-serif' },
                                                                    { label: 'Helvetica', value: '\'Helvetica Neue\', Helvetica, sans-serif' },
                                                                    { label: 'Times New Roman', value: '\'Times New Roman\', Times, serif' },
                                                                    { label: 'Georgia', value: 'Georgia, serif' },
                                                                    { label: 'Verdana', value: 'Verdana, sans-serif' },
                                                                    { label: 'Tahoma', value: 'Tahoma, sans-serif' },
                                                                    { label: 'Trebuchet MS', value: '\'Trebuchet MS\', sans-serif' },
                                                                    { label: 'Courier New', value: '\'Courier New\', Courier, monospace' }
                                                                ]}
                                                                style={{ width: '520px', outline: 'none', boxShadow: 'none' }}
                                                                placeholder="Select a font family"
                                                            />
                                                        </Form.Group>

                                                        <Row>
                                                            <Col md={6}>
                                                                <Form.Group className="mb-3">
                                                                    <Form.Label className={premiumStyle.label}>Primary Color</Form.Label>
                                                                    <Form.Control
                                                                        type="color"
                                                                        value={primaryColor}
                                                                        onChange={(e) => setPrimaryColor(e.target.value)}
                                                                        className={premiumStyle.inputBox}
                                                                    />
                                                                </Form.Group>
                                                            </Col>
                                                            <Col md={6}>
                                                                <Form.Group className="mb-3">
                                                                    <Form.Label className={premiumStyle.label}>Text Color</Form.Label>
                                                                    <Form.Control
                                                                        type="color"
                                                                        value={textColor}
                                                                        onChange={(e) => setTextColor(e.target.value)}
                                                                        className={premiumStyle.inputBox}
                                                                    />
                                                                </Form.Group>
                                                            </Col>
                                                        </Row>

                                                        <Row>
                                                            <Col md={6}>
                                                                <Form.Group className="mb-3">
                                                                    <Form.Label className={premiumStyle.label}>Secondary Text Color</Form.Label>
                                                                    <Form.Control
                                                                        type="color"
                                                                        value={secondaryTextColor}
                                                                        className={premiumStyle.inputBox}
                                                                        onChange={(e) => setSecondaryTextColor(e.target.value)}
                                                                    />
                                                                </Form.Group>
                                                            </Col>
                                                            <Col md={6}>
                                                                <Form.Group className="mb-3">
                                                                    <Form.Label className={premiumStyle.label}>Link Color</Form.Label>
                                                                    <Form.Control
                                                                        type="color"
                                                                        value={linkColor}
                                                                        className={premiumStyle.inputBox}
                                                                        onChange={(e) => setLinkColor(e.target.value)}
                                                                    />
                                                                </Form.Group>
                                                            </Col>
                                                        </Row>

                                                        <Row>
                                                            <Col md={6}>
                                                                <Form.Group className="mb-3">
                                                                    <Form.Label className={premiumStyle.label}>Background Color</Form.Label>
                                                                    <Form.Control
                                                                        type="color"
                                                                        className={premiumStyle.inputBox}
                                                                        value={backgroundColor === 'transparent' ? '#ffffff' : backgroundColor}
                                                                        onChange={(e) => setBackgroundColor(e.target.value)}
                                                                    />
                                                                    <div className="d-flex gap-2 mt-3">
                                                                        <Checkbox
                                                                            checked={backgroundColor === 'transparent'}
                                                                            onChange={(e) => setBackgroundColor(e.checked ? 'transparent' : '#ffffff')}
                                                                        />
                                                                        <label className="form-label">Transparent</label>
                                                                    </div>
                                                                </Form.Group>
                                                            </Col>
                                                            <Col md={6}>
                                                                <Form.Group className="mb-3">
                                                                    <Form.Label className={premiumStyle.label}>Font Size</Form.Label>
                                                                    <Dropdown
                                                                        value={fontSize}
                                                                        options={[
                                                                            { label: 'Small', value: 'small' },
                                                                            { label: 'Normal', value: 'normal' },
                                                                            { label: 'Large', value: 'large' }
                                                                        ]}
                                                                        onChange={(e) => setFontSize(e.value)}
                                                                        style={{ width: '100%', outline: 'none', boxShadow: 'none' }}
                                                                        placeholder="Select font size"
                                                                    />
                                                                </Form.Group>
                                                            </Col>
                                                        </Row>

                                                        <Row>
                                                            <Col md={4}>
                                                                <Form.Group className="mb-3">
                                                                    <Form.Label className={premiumStyle.label}>Divider Style</Form.Label>
                                                                    <Dropdown
                                                                        value={dividerStyle}
                                                                        options={[
                                                                            { label: 'Solid', value: 'solid' },
                                                                            { label: 'Dashed', value: 'dashed' },
                                                                            { label: 'Dotted', value: 'dotted' }
                                                                        ]}
                                                                        onChange={(e) => setDividerStyle(e.value)}
                                                                        style={{ width: '100%', outline: 'none', boxShadow: 'none' }}
                                                                        placeholder="Select divider style"
                                                                    />
                                                                </Form.Group>
                                                            </Col>
                                                            <Col md={4}>
                                                                <Form.Group className="mb-3">
                                                                    <Form.Label className={premiumStyle.label}>Divider Width</Form.Label>
                                                                    <Dropdown
                                                                        value={dividerWidth}
                                                                        options={[
                                                                            { label: 'Thin', value: '1px' },
                                                                            { label: 'Medium', value: '2px' },
                                                                            { label: 'Thick', value: '3px' }
                                                                        ]}
                                                                        onChange={(e) => setDividerWidth(e.value)}
                                                                        style={{ width: '100%', outline: 'none', boxShadow: 'none' }}
                                                                        placeholder="Select divider width"
                                                                    />
                                                                </Form.Group>
                                                            </Col>
                                                            <Col md={4}>
                                                                <Form.Group className="mb-3">
                                                                    <Form.Label className={premiumStyle.label}>Divider Color</Form.Label>
                                                                    <Form.Control
                                                                        type="color"
                                                                        value={dividerColor}
                                                                        className={premiumStyle.inputBox}
                                                                        onChange={(e) => setDividerColor(e.target.value)}
                                                                    />
                                                                </Form.Group>
                                                            </Col>
                                                        </Row>

                                                        <Row>
                                                            <Col md={4}>
                                                                <Form.Group className="mb-3">
                                                                    <Form.Label className={premiumStyle.label}>Profile Image Style</Form.Label>
                                                                    <Dropdown
                                                                        value={profileImageStyle}
                                                                        options={[
                                                                            { label: 'Circle', value: 'circle' },
                                                                            { label: 'Square', value: 'square' },
                                                                            { label: 'Rounded', value: 'rounded' }
                                                                        ]}
                                                                        style={{ width: '100%', outline: 'none', boxShadow: 'none' }}
                                                                        onChange={(e) => {
                                                                            setProfileImageStyle(e.value);
                                                                            setPreviewKey(prev => prev + 1); // Force preview re-render
                                                                        }}
                                                                        placeholder="Select image style"
                                                                    />
                                                                </Form.Group>
                                                            </Col>
                                                            <Col md={4}>
                                                                <Form.Group className="mb-3">
                                                                    <Form.Label className={premiumStyle.label}>Profile Image Size</Form.Label>
                                                                    <Dropdown
                                                                        value={profileImageSize}
                                                                        options={[
                                                                            { label: 'Small', value: 'small' },
                                                                            { label: 'Medium', value: 'medium' },
                                                                            { label: 'Large', value: 'large' }
                                                                        ]}
                                                                        onChange={(e) => {
                                                                            setProfileImageSize(e.value);
                                                                            setPreviewKey(prev => prev + 1); // Force preview re-render
                                                                        }}
                                                                        style={{ width: '100%', outline: 'none', boxShadow: 'none' }}
                                                                        placeholder="Select image size"
                                                                    />
                                                                </Form.Group>
                                                            </Col>
                                                            <Col md={4}>
                                                                <Form.Group className="mb-3">
                                                                    <Form.Label className={premiumStyle.label}>Company Logo Size</Form.Label>
                                                                    <Dropdown
                                                                        value={companyLogoSize}
                                                                        options={[
                                                                            { label: 'Small', value: 'small' },
                                                                            { label: 'Medium', value: 'medium' },
                                                                            { label: 'Large', value: 'large' }
                                                                        ]}
                                                                        onChange={(e) => {
                                                                            setCompanyLogoSize(e.value);
                                                                            setPreviewKey(prev => prev + 1); // Force preview re-render
                                                                        }}
                                                                        style={{ width: '100%', outline: 'none', boxShadow: 'none' }}
                                                                        placeholder="Select logo size"
                                                                    />
                                                                </Form.Group>
                                                            </Col>
                                                        </Row>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </Col>

                                    {/* Right Column - Preview */}
                                    <Col md={5}>
                                        <div className={premiumStyle.previewSection}>
                                            <div className={premiumStyle.previewCard}>
                                                <div className={premiumStyle.previewHeader}>
                                                    <h3>Live Preview</h3>
                                                </div>
                                                <div className={premiumStyle.previewBody}>
                                                    <div className={premiumStyle.emailPreview}>
                                                        <div className={premiumStyle.emailHeader}>
                                                            <div className={premiumStyle.emailHeaderItem}>
                                                                <strong>From:</strong> {fullName || 'Your Name'} &lt;{email || 'your.email@example.com'}&gt;
                                                            </div>
                                                            <div className={premiumStyle.emailHeaderItem}>
                                                                <strong>To:</strong> Recipient &lt;recipient@example.com&gt;
                                                            </div>
                                                            <div className={premiumStyle.emailHeaderItem}>
                                                                <strong>Subject:</strong> Email with Signature
                                                            </div>
                                                        </div>
                                                        <div className={premiumStyle.emailBody}>
                                                            <p>Hello,</p>
                                                            <p>This is a sample email message. Your actual email content would appear here.</p>
                                                            <p>Best regards,</p>
                                                            <div className={premiumStyle.emailSignature}>
                                                                <div key={previewKey} dangerouslySetInnerHTML={{ __html: generateSignatureHTML() }} />
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className={premiumStyle.compatibilityInfo}>
                                                    <h4>Compatible with:</h4>
                                                    <div className={premiumStyle.compatibilityList}>
                                                        <div className={premiumStyle.compatibilityItem}>
                                                            <CheckCircle className={premiumStyle.compatibilityIcon} size={12} /> Gmail
                                                        </div>
                                                        <div className={premiumStyle.compatibilityItem}>
                                                            <CheckCircle className={premiumStyle.compatibilityIcon} size={12} /> Outlook
                                                        </div>
                                                        <div className={premiumStyle.compatibilityItem}>
                                                            <CheckCircle className={premiumStyle.compatibilityIcon} size={12} /> Apple Mail
                                                        </div>
                                                        <div className={premiumStyle.compatibilityItem}>
                                                            <CheckCircle className={premiumStyle.compatibilityIcon} size={12} /> Yahoo Mail
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="mt-3 d-flex gap-2">
                                                <Button
                                                    className="outline-button w-100"
                                                    onClick={handleCopySignature}
                                                >
                                                    Copy HTML
                                                </Button>
                                                <Button
                                                    className="outline-button w-100"
                                                    onClick={handleExportSignature}
                                                >
                                                    Export as HTML
                                                </Button>
                                            </div>
                                        </div>
                                    </Col>
                                </Row>
                            ) :
                                <Row>
                                    <Col sm={7}>
                                        <div className={premiumStyle.formSection}>
                                            <label className={premiumStyle.label}>Signature HTML</label>
                                            <InputTextarea
                                                value={text || ""}
                                                onChange={(e) => setText(e.target.value)}
                                                className={premiumStyle.textarea}
                                                placeholder="Enter your signature HTML here..."
                                                autoResize
                                            />
                                        </div>
                                    </Col>
                                    <Col sm={5}>
                                        <div className={premiumStyle.previewSection}>
                                            <div className={premiumStyle.previewCard}>
                                                <div className={premiumStyle.previewHeader}>
                                                    <h3>Live Preview</h3>
                                                </div>
                                                <div className={premiumStyle.previewBody}>
                                                    <div className={premiumStyle.emailPreview}>
                                                        <div className={premiumStyle.emailHeader}>
                                                            <div className={premiumStyle.emailHeaderItem}>
                                                                <strong>From:</strong> {fullName || 'Your Name'} &lt;{email || 'your.email@example.com'}&gt;
                                                            </div>
                                                            <div className={premiumStyle.emailHeaderItem}>
                                                                <strong>To:</strong> Recipient &lt;recipient@example.com&gt;
                                                            </div>
                                                            <div className={premiumStyle.emailHeaderItem}>
                                                                <strong>Subject:</strong> Email with Signature
                                                            </div>
                                                        </div>
                                                        <div className={premiumStyle.emailBody}>
                                                            <p>Hello,</p>
                                                            <p>This is a sample email message. Your actual email content would appear here.</p>
                                                            <p>Best regards,</p>
                                                            <div className={premiumStyle.emailSignature}>
                                                                <div key={previewKey} dangerouslySetInnerHTML={{ __html: text }} />
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </Col>
                                </Row>
                            }

                        </div>
                    </div>
                    <div className={style.bottom}>
                        <div className="d-flex align-items-center gap-4">
                            {
                                id ?
                                    <>
                                        <Button onClick={handleDelete} className='danger-outline-button ms-2'>{deleteMutation.isPending ? "Loading..." : "Delete Template"}</Button>
                                        <div className="d-flex align-items-center gap-2">
                                            <Checkbox
                                                inputId='defaultSignature'
                                                checked={isDefault}
                                                onChange={(e) => {
                                                    setIsDefault(e.checked);
                                                    setDefaultTemplateMutation.mutate();
                                                }}
                                            />
                                            <label htmlFor="defaultSignature" className={clsx(premiumStyle.label, 'mb-0 cursor-pointer')}>Set as default signature</label>
                                        </div>
                                    </>
                                    : <span></span>
                            }

                        </div>
                        <div className='d-flex gap-2'>
                            <Link to={'/settings/templates/email-signatures/'}>
                                <Button className='outline-button'>Cancel</Button>
                            </Link>
                            <Button onClick={() => setShowPreview(true)} className='outline-button'>
                                <Eye size={16} className="me-1" /> Preview
                            </Button>
                            <Button onClick={handleSubmit} className='solid-button'>{mutation.isPending ? "Loading..." : "Save Template"}</Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CreateEmailSignatureTemplate;