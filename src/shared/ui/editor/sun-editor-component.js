import { useCallback, useRef, useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'sonner';
import SunEditor from 'suneditor-react';
import 'suneditor/dist/css/suneditor.min.css';

const SunEditorComponent = ({
    value = '',
    onChange,
    placeholder = 'Enter content...',
    height = 299,
    showTable = true,
    showLink = true,
    disabled = false,
    className = '',
    customOptions = {},
    onLoad,
    onFocus,
    onBlur,
    enableS3Upload = false,
    s3UploadEndpoint = null,
    uploadId = null,
    ...props
}) => {

    // State for upload progress and drag states
    const [uploadProgress, setUploadProgress] = useState({});
    const [processingBase64, setProcessingBase64] = useState(false);
    
    // Cache to store already uploaded base64 images to prevent duplicate uploads
    const uploadCacheRef = useRef(new Map());

    // Clean up cache periodically to prevent memory leaks
    useEffect(() => {
        const cleanupInterval = setInterval(() => {
            const cache = uploadCacheRef.current;
            if (cache.size > 50) { // Limit cache to 50 entries
                const entries = Array.from(cache.entries());
                const toKeep = entries.slice(-25); // Keep latest 25 entries
                uploadCacheRef.current = new Map(toKeep);
                // console.log('Cleaned up upload cache, kept', toKeep.length, 'entries');
            }
        }, 60000); // Check every minute

        return () => clearInterval(cleanupInterval);
    }, []);

    // Auto-clear upload progress error/success after a delay
    useEffect(() => {
        if (uploadProgress.error || uploadProgress.success) {
            const timer = setTimeout(() => {
                setUploadProgress({});
            }, 2000);
            return () => clearTimeout(timer);
        }
    }, [uploadProgress.error, uploadProgress.success]);

    // Ref for SunEditor instance (populated in handleLoad)
    const editorInstanceRef = useRef(null);
    
    // Keep currentContentRef in sync with value prop (for reference only)
    const currentContentRef = useRef(value);
    
    useEffect(() => {
        currentContentRef.current = value;
    }, [value]);    // Utility function to check if an image is already hosted on S3
    const isS3Image = useCallback((src) => {
        if (!src || typeof src !== 'string') return false;
        
        // Check for common S3 URL patterns
        const s3Patterns = [
            /^https?:\/\/.*\.s3\..*\.amazonaws\.com\//,
            /^https?:\/\/s3\..*\.amazonaws\.com\//,
            /^https?:\/\/.*\.s3\.amazonaws\.com\//,
            /^https?:\/\/.*\.digitaloceanspaces\.com\//,
            // Add your specific S3 bucket pattern here if needed
            new RegExp(`^https?://${process.env.REACT_APP_S3_BUCKET || '.*'}\\.s3\\..*\\.amazonaws\\.com/`)
        ];
        
        return s3Patterns.some(pattern => pattern.test(src));
    }, []);

    // Utility function to detect all images in content and categorize them
    const categorizeImages = useCallback((content) => {
        const allImageRegex = /<img[^>]+src="([^"]+)"[^>]*>/gi;
        const base64Images = [];
        const s3Images = [];
        const otherImages = [];
        let match;
        
        while ((match = allImageRegex.exec(content)) !== null) {
            const fullMatch = match[0];
            const src = match[1];
            
            if (src.startsWith('data:image/')) {
                // Extract format and base64 data for base64 images
                const base64Match = src.match(/^data:image\/([^;]+);base64,(.+)$/);
                if (base64Match) {
                    base64Images.push({
                        fullMatch,
                        format: base64Match[1],
                        base64Data: base64Match[2],
                        src,
                        index: match.index
                    });
                }
            } else if (isS3Image(src)) {
                s3Images.push({
                    fullMatch,
                    src,
                    index: match.index
                });
            } else {
                otherImages.push({
                    fullMatch,
                    src,
                    index: match.index
                });
            }
        }
        
        return { base64Images, s3Images, otherImages };
    }, [isS3Image]);

    // Utility function to convert base64 to File object
    const base64ToFile = useCallback((base64Data, format, filename) => {
        // Remove data URL prefix if present
        const base64String = base64Data.replace(/^data:image\/[a-z]+;base64,/, '');
        
        // Convert base64 to binary data
        const byteCharacters = atob(base64String);
        const byteNumbers = new Array(byteCharacters.length);
        
        for (let i = 0; i < byteCharacters.length; i++) {
            byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        
        const byteArray = new Uint8Array(byteNumbers);
        const blob = new Blob([byteArray], { type: `image/${format}` });
        
        return new File([blob], filename, { type: `image/${format}` });
    }, []);

    // Upload base64 image to S3 and return the S3 URL (with caching)
    const uploadBase64ImageToS3 = useCallback(async (base64Data, format) => {
        if (!enableS3Upload) return null;

        // Create a hash of the base64 data for caching
        const base64Hash = btoa(base64Data.substring(0, 100)); // Use first 100 chars as hash
        
        // Check if this image was already uploaded
        if (uploadCacheRef.current.has(base64Hash)) {
            const cachedUrl = uploadCacheRef.current.get(base64Hash);
            // console.log('Using cached S3 URL for image:', cachedUrl);
            return cachedUrl;
        }

        try {
            const timestamp = Date.now();
            const filename = `image-${timestamp}.${format}`;
            const file = base64ToFile(base64Data, format, filename);

            // Get signed URL
            const accessToken = localStorage.getItem('access_token');
            const endpoint = s3UploadEndpoint || `${process.env.REACT_APP_BACKEND_API_URL}/proposals/file/${uploadId}/`;

            const response = await axios.post(
                endpoint,
                { file_name: filename },
                {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                }
            );

            const { url } = response.data;
            if (!url) {
                throw new Error("Failed to get upload URL");
            }

            // Upload to S3
            await axios.put(url, file, {
                headers: {
                    "Content-Type": "",
                },
            });

            // Get the S3 URL (remove query parameters)
            const s3Url = url.split("?")[0] || "";
            
            // Cache the uploaded image
            uploadCacheRef.current.set(base64Hash, s3Url);
            // console.log('Cached new upload:', s3Url);
            
            return s3Url;

        } catch (error) {
            console.error("Error uploading base64 image to S3:", error);
            throw error;
        }
    }, [enableS3Upload, s3UploadEndpoint, uploadId, base64ToFile]);



    // Render upload progress overlay
    const renderUploadProgress = () => {
        if (!uploadProgress?.uploading && !uploadProgress?.success && !uploadProgress?.error && !processingBase64) return null;

        return (
            <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 1000,
                borderRadius: '4px'
            }}>
                {(uploadProgress.uploading || processingBase64) && (
                    <>
                        <div style={{
                            width: '60px',
                            height: '60px',
                            border: '4px solid #f3f3f3',
                            borderTop: '4px solid #3498db',
                            borderRadius: '50%',
                            animation: 'spin 1s linear infinite',
                            marginBottom: '16px'
                        }}></div>
                        <div style={{
                            fontSize: '14px',
                            fontWeight: '500',
                            color: '#333',
                            marginBottom: '8px'
                        }}>
                            {processingBase64 ? 'Processing images...' : 'Uploading image...'}
                        </div>
                        {uploadProgress.uploading && (
                            <>
                                <div style={{
                                    width: '200px',
                                    height: '6px',
                                    backgroundColor: '#f0f0f0',
                                    borderRadius: '3px',
                                    overflow: 'hidden'
                                }}>
                                    <div style={{
                                        width: `${uploadProgress.progress}%`,
                                        height: '100%',
                                        backgroundColor: '#3498db',
                                        transition: 'width 0.3s ease'
                                    }}></div>
                                </div>
                                <div style={{
                                    fontSize: '12px',
                                    color: '#666',
                                    marginTop: '4px'
                                }}>
                                    {uploadProgress.progress}%
                                </div>
                            </>
                        )}
                    </>
                )}
                {uploadProgress.success && (
                    <div style={{ textAlign: 'center' }}>
                        <div style={{
                            width: '50px',
                            height: '50px',
                            backgroundColor: '#27ae60',
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            margin: '0 auto 16px'
                        }}>
                            <span style={{ color: 'white', fontSize: '24px' }}>✓</span>
                        </div>
                        <div style={{ fontSize: '14px', color: '#27ae60' }}>
                            Upload completed!
                        </div>
                    </div>
                )}
                {uploadProgress.error && (
                    <div style={{ textAlign: 'center' }}>
                        <div style={{
                            width: '50px',
                            height: '50px',
                            backgroundColor: '#e74c3c',
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            margin: '0 auto 16px'
                        }}>
                            <span style={{ color: 'white', fontSize: '24px' }}>✗</span>
                        </div>
                        <div style={{ fontSize: '14px', color: '#e74c3c' }}>
                            Upload failed
                        </div>
                    </div>
                )}
            </div>
        );
    };



    // Default button configuration
    const getButtonList = () => {
        const buttons = [
            ['undo', 'redo'],
            ['bold', 'italic', 'underline', 'strike'],
            ['formatBlock'],
            ['list'],
            ['align'],
            ['image'],
        ];

        // Conditionally add buttons based on props
        if (showLink) buttons.push(['link']);
        if (showTable) buttons.push(['table']);

        return buttons;
    };


    // Default SunEditor configuration
    const defaultOptions = {
        buttonList: getButtonList(),
        height: height,
        placeholder: placeholder,
        showPathLabel: false,
        charCounter: false,
        resizingBar: false,
        disable: disabled,
        // Custom image handler for S3 upload
        imageUploadUrl: enableS3Upload ? null : undefined,
        // Table configuration
        table: {
            headerStyle: 'background-color: #f8f9fa; font-weight: bold; padding: 8px; min-width: 50px; border: none;',
            cellStyle: 'padding: 8px; min-width: 50px; border: none;'
        },
        // Image configuration
        imageUploadHeader: enableS3Upload ? undefined : {
            'Authorization': `Bearer ${localStorage.getItem('access_token') || ''}`
        },
        // Format options
        formats: ['p', 'div', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6'],
        // Font options
        font: ['Arial', 'Helvetica', 'Georgia', 'Times New Roman', 'Courier New'],
        fontSize: [8, 9, 10, 11, 12, 14, 16, 18, 20, 22, 24, 26, 28, 36, 48, 72],
        // Color options
        colorList: [
            ['#000000', '#424242', '#636363', '#9C9C94', '#CEC6CE', '#EFEFEF', '#F7F3F7', '#FFFFFF'],
            ['#FF0000', '#FF9C00', '#FFFF00', '#00FF00', '#00FFFF', '#0000FF', '#9C00FF', '#FF00FF'],
            ['#F7C6CE', '#FFE7CE', '#FFEFC6', '#D6EFD6', '#CEDEE7', '#CEE7F7', '#D6D6E7', '#E7D6DE'],
            ['#E79C9C', '#FFC69C', '#FFE79C', '#B5D6A5', '#A5C6CE', '#9CC6EF', '#B5A5D6', '#D6A5BD'],
            ['#E76363', '#FF9C63', '#FFCE63', '#9CDE9C', '#63B5CE', '#639CFF', '#9C63E7', '#CE639C'],
            ['#E73131', '#FF7031', '#FFB531', '#73DE73', '#319CCE', '#3173FF', '#7331E7', '#CE3173'],
            ['#9C0000', '#B56308', '#9C9C00', '#089C00', '#008294', '#0031FF', '#4A0A77', '#9C005A'],
            ['#630000', '#7B3900', '#636300', '#006300', '#005A6B', '#002173', '#290A4A', '#630039']
        ]
    };

    // Merge custom options with default options
    const editorOptions = {
        ...defaultOptions,
        ...customOptions,
        // Ensure buttonList is properly merged
        buttonList: customOptions.buttonList || defaultOptions.buttonList
    };

    const handleChange = async (content) => {
        // Check if S3 upload is enabled and content contains images
        if (enableS3Upload && content && typeof content === 'string') {
            const { base64Images, s3Images } = categorizeImages(content);
            
            // Only process base64 images (skip S3 images to prevent re-upload)
            if (base64Images.length > 0) {
                setProcessingBase64(true);
                
                try {
                    let updatedContent = content;
                    
                    // Process each base64 image
                    for (const imageMatch of base64Images) {
                        const { fullMatch, format, base64Data } = imageMatch;
                        
                        // Upload to S3
                        const s3Url = await uploadBase64ImageToS3(base64Data, format);
                        
                        if (s3Url) {
                            // Replace base64 image with S3 URL in content
                            const newImgTag = fullMatch.replace(
                                /src="data:image\/[^;]+;base64,[^"]+"/,
                                `src="${s3Url}"`
                            );
                            updatedContent = updatedContent.replace(fullMatch, newImgTag);
                            console.log('Replaced base64 image with S3 URL:', s3Url);
                        }
                    }
                    
                    setProcessingBase64(false);
                    
                    // Call onChange with updated content containing S3 URLs
                    if (onChange && updatedContent !== content) {
                        onChange(updatedContent);
                        return;
                    }
                } catch (error) {
                    console.error('Error processing base64 images:', error);
                    setProcessingBase64(false);
                    toast.error('Failed to upload images. Please try again.');
                }
            } else if (s3Images.length > 0) {
                // Content has S3 images but no new base64 images to process
                console.log('Content contains only S3 images, no upload needed');
            }
        }
        
        // If no base64 images or S3 upload disabled, proceed normally
        if (onChange) {
            onChange(content);
        }
    };

    const handleLoad = (sunEditor) => {
        // Store the editor instance for later use
        editorInstanceRef.current = sunEditor;

        if (onLoad) {
            onLoad(sunEditor);
        }
    };

    const handleFocus = (event, sunEditor) => {
        if (onFocus) {
            onFocus(event, sunEditor);
        }
    };

    const handleBlur = (event, sunEditor) => {
        if (onBlur) {
            onBlur(event, sunEditor);
        }
    };

    return (
        <>
            <style>{`
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
                .sun-editor-wrapper .se-wrapper-inner *,
                .sun-editor .se-resizing-container {
                    z-index: 0 !important;
                }
            `}</style>
            <div
                className={`sun-editor-wrapper ${className}`}
                style={{ position: 'relative' }}
            >
                <SunEditor
                    setOptions={editorOptions}
                    setContents={value}
                    onChange={handleChange}
                    onLoad={handleLoad}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                    {...props}
                />

                {/* Upload Progress Overlay */}
                {renderUploadProgress()}
            </div>
        </>
    );
};

export default SunEditorComponent;
