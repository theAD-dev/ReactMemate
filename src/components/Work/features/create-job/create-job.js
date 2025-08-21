import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Button, Card, Col, Row } from 'react-bootstrap';
import { Calendar3, ClockHistory, CloudUpload, X } from 'react-bootstrap-icons';
import { useDropzone } from 'react-dropzone';
import { useMutation, useQuery } from "@tanstack/react-query";
import axios from 'axios';
import clsx from 'clsx';
import { Calendar } from 'primereact/calendar';
import { Dropdown } from 'primereact/dropdown';
import { IconField } from 'primereact/iconfield';
import { InputIcon } from 'primereact/inputicon';
import { InputText } from "primereact/inputtext";
import { InputTextarea } from 'primereact/inputtextarea';
import { ProgressSpinner } from 'primereact/progressspinner';
import { RadioButton } from 'primereact/radiobutton';
import { Sidebar } from 'primereact/sidebar';
import { toast } from 'sonner';
import style from './create-job.module.scss';
import { getJobTemplate, getJobTemplates } from '../../../../APIs/email-template';
import { getProjectsList } from '../../../../APIs/expenses-api';
import { createNewJob, updateJob } from '../../../../APIs/jobs-api';
import { getTeamMobileUser } from '../../../../APIs/team-api';
import { CircularProgressBar } from '../../../../shared/ui/circular-progressbar';
import { FallbackImage } from '../../../../shared/ui/image-with-fallback/image-avatar';

export function getFileIcon(fileType, size = 32, noColor) {
    if (fileType) fileType = fileType?.toLowerCase();

    const fileTypes = {
        'application/pdf': { name: 'PDF', color: '#D92D20' },
        'application/vnd.ms-excel': { name: 'Excel', color: '#22A746' },
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': { name: 'Excel', color: '#22A746' },
        'application/msword': { name: 'Word', color: '#2368E1' },
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document': { name: 'Word', color: '#2368E1' },
        'image/jpeg': { name: 'JPEG', color: '#FFAA00' },
        'image/png': { name: 'PNG', color: '#00ADEF' },
        'image/gif': { name: 'GIF', color: '#F64A8A' },
        'video/mp4': { name: 'MP4', color: '#9C27B0' },
        'audio/mp3': { name: 'MP3', color: '#4CAF50' },
        'audio/wav': { name: 'WAV', color: '#795548' },
        'text/plain': { name: 'Text', color: '#8E8E8E' },
        'application/zip': { name: 'ZIP', color: '#FFD700' },
        'application/json': { name: 'JSON', color: '#22A746' },
        'image/svg+xml': { name: 'SVG', color: '#FF5722' },
        'application/x-rar-compressed': { name: 'RAR', color: '#F44336' },
        'application/vnd.ms-powerpoint': { name: 'PPT', color: '#FF9800' },
        'application/vnd.openxmlformats-officedocument.presentationml.presentation': { name: 'PPT', color: '#FF9800' },
        'application/vnd.ms-publisher': { name: 'Publisher', color: '#4CAF50' },
        'application/x-shockwave-flash': { name: 'SWF', color: '#FFEB3B' },
        'application/x-tar': { name: 'TAR', color: '#FFC107' },
        'zip': { name: 'ZIP', color: '#FFD700' },
        'rar': { name: 'RAR', color: '#F44336' },
        'ppt': { name: 'PPT', color: '#FF9800' },
        'pub': { name: 'Publisher', color: '#4CAF50' },
        'swf': { name: 'SWF', color: '#FFEB3B' },
        'tar': { name: 'TAR', color: '#FFC107' },
        'pdf': { name: 'PDF', color: '#D92D20' },
        'doc': { name: 'Word', color: '#2368E1' },
        'docx': { name: 'Word', color: '#2368E1' },
        'xls': { name: 'Excel', color: '#22A746' },
        'xlsx': { name: 'Excel', color: '#22A746' },
        'jpg': { name: 'JPEG', color: '#FFAA00' },
        'jpeg': { name: 'JPEG', color: '#FFAA00' },
        'png': { name: 'PNG', color: '#00ADEF' },
        'gif': { name: 'GIF', color: '#F64A8A' },
        'mp4': { name: 'MP4', color: '#9C27B0' },
        'mp3': { name: 'MP3', color: '#4CAF50' },
        'wav': { name: 'WAV', color: '#795548' },
        'txt': { name: 'Text', color: '#8E8E8E' },
        'json': { name: 'JSON', color: '#22A746' },
        'svg': { name: 'SVG', color: '#FF5722' },
        'pptx': { name: 'PPT', color: '#FF9800' },
    };

    if (noColor === 'black') {
        fileTypes[fileType] = { name: fileTypes[fileType]?.name || 'Unknown', color: '#000000' };
    }
    
    const fileData = fileTypes[fileType] || { name: 'Unknown', color: '#000000' };
    
    return (
        <div className={style.imgBox}>
            <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 32 41" fill="none">
                <path
                    d="M0 4.5874C0 2.37826 1.79086 0.587402 4 0.587402H20L32 12.5874V36.5874C32 38.7965 30.2091 40.5874 28 40.5874H4C1.79086 40.5874 0 38.7965 0 36.5874V4.5874Z"
                    fill={fileData.color}
                />
                <path
                    opacity="0.3"
                    d="M20 0.587402L32 12.5874H24C21.7909 12.5874 20 10.7965 20 8.5874V0.587402Z"
                    fill="white"
                />
            </svg>
            <div className={`${style.fileType} ${size != 32 ? style.fileTypeSmall : ''}`}>{fileData.name}</div>
        </div>
    );
}

const CreateJob = ({ visible, setVisible, setRefetch = () => { }, workerId, isEditMode = false, jobData = null, jobId = null, jobProjectId, refetch = () => { } }) => {
    const accessToken = localStorage.getItem("access_token");
    const publishRef = useRef(null);
    const url = React.useMemo(() => window.location.href, []);
    const urlObj = React.useMemo(() => new URL(url), [url]);
    const params = React.useMemo(() => new URLSearchParams(urlObj.search), [urlObj]);

    const [templateId, setTemplatedId] = useState("");
    const [isOpenRepeatSection, setIsOpenRepeatSection] = useState(false);
    const [isOpenAttachmentsSection, setIsOpenAttachmentsSection] = useState(false);
    const [isOpenProjectPhotoSection, setIsOpenProjectPhotoSection] = useState(false);

    const [jobReference, setJobReference] = useState("");
    const [description, setDescription] = useState("");

    const [userId, setUserId] = useState("");
    const [selectedUserInfo, setSelectedUserInfo] = useState({});
    const [hourlyRate, setHourlyRate] = useState("0.00");
    const [paymentCycle, setPaymentCycle] = useState("");

    const [projectId, setProjectId] = useState("");
    const [repeat, setRepeat] = useState('Weekly');
    const [weeks, setWeeks] = useState([]);
    const [months, setMonths] = useState([]);
    const [repeatStart, setRepeatStart] = useState("");
    const [ending, setEnding] = useState([]);
    const [repeatEnd, setRepeatEnd] = useState("");
    const [occurrences, setOccurrences] = useState("");

    const [projectPhotoDeliver, setProjectPhotoDeliver] = useState("");


    const [files, setFiles] = useState([]);
    const {
        getRootProps,
        getInputProps
    } = useDropzone({
        onDrop: acceptedFiles => {
            const newFiles = acceptedFiles.map(file => Object.assign(file, {
                preview: URL.createObjectURL(file),
                progress: 0,
            }));

            setFiles((prevFiles) => [
                ...prevFiles,
                ...newFiles,
            ]);
        }
    });


    // @type and @time_type
    // type: 2 - fix, 3 - hours, 4 - time tracker
    // time_type: 1 - shift, T - time frame 
    const [type, setType] = useState('2');
    const [time_type, set_time_type] = useState('1');

    const [cost, setCost] = useState(0.00);
    const today = new Date();
    const [start, setStart] = useState(today);
    const [end, setEnd] = useState("");
    const [duration, setDuration] = useState("1.00");
    const [dayShiftHours, setDayShiftHours] = useState("1.00");

    const [errors, setErrors] = useState({});

    const templateQuery = useQuery({
        queryKey: ["jobTemplate"],
        queryFn: getJobTemplates,
    });
    const getTemplateByIDQuery = useQuery({
        queryKey: ["templateId", templateId],
        queryFn: () => getJobTemplate(templateId),
        enabled: !!templateId,
        retry: 1,
    });

    const mobileUserQuery = useQuery({
        queryKey: ["mobileuser"],
        queryFn: getTeamMobileUser,
    });

    const projectQuery = useQuery({ queryKey: ['getProjectsList'], queryFn: getProjectsList, staleTime: 0 });

    const itemTemplate = (option) => {
        return (
            <div className="d-flex gap-2 align-items-center">
                <div className='d-flex justify-content-center align-items-center' style={{ width: '24px', height: '24px', borderRadius: '50%', overflow: 'hidden', border: '1px solid #dedede' }}>
                    {option?.image === "openJob"
                        ? <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 20 20" fill="none">
                            <path d="M7.14307 6.57171C6.82748 6.57171 6.57164 6.82754 6.57164 7.14314C6.57164 7.45873 6.82748 7.71457 7.14307 7.71457H12.8574C13.1729 7.71457 13.4288 7.45873 13.4288 7.14314C13.4288 6.82754 13.1729 6.57171 12.8574 6.57171H7.14307Z" fill="#475467" />
                            <path d="M7.14307 8.85742C6.82748 8.85742 6.57164 9.11326 6.57164 9.42885C6.57164 9.74444 6.82748 10.0003 7.14307 10.0003H10.5716C10.8872 10.0003 11.1431 9.74444 11.1431 9.42885C11.1431 9.11326 10.8872 8.85742 10.5716 8.85742H7.14307Z" fill="#475467" />
                            <path fillRule="evenodd" clipRule="evenodd" d="M10.0002 3.14314C11.2626 3.14314 12.2859 2.11979 12.2859 0.857422H15.1431C16.0898 0.857422 16.8574 1.62493 16.8574 2.57171V17.4289C16.8574 18.3756 16.0898 19.1431 15.1431 19.1431H4.85735C3.91058 19.1431 3.14307 18.3756 3.14307 17.4289V2.57171C3.14307 1.62493 3.91058 0.857422 4.85735 0.857422H7.7145C7.7145 2.11979 8.73784 3.14314 10.0002 3.14314ZM10.0002 4.28599C11.493 4.28599 12.763 3.33193 13.2337 2.00028H15.1431C15.4587 2.00028 15.7145 2.25612 15.7145 2.57171V17.4289C15.7145 17.7444 15.4587 18.0003 15.1431 18.0003H4.85735C4.54176 18.0003 4.28592 17.7444 4.28592 17.4289V2.57171C4.28592 2.25612 4.54176 2.00028 4.85735 2.00028H6.76673C7.2374 3.33193 8.50739 4.28599 10.0002 4.28599Z" fill="#475467" />
                        </svg>
                        : <FallbackImage photo={option?.image} has_photo={option?.has_photo} is_business={false} size={17} />
                    }
                </div>
                <div>{option.label}</div>
            </div>
        );
    };

    const selectedItemTemplate = (option, props) => {
        if (option) {
            return (
                <div className="d-flex gap-2 align-items-center">
                    <div className='d-flex justify-content-center align-items-center' style={{ width: '24px', height: '24px', borderRadius: '50%', overflow: 'hidden', border: '1px solid #dedede' }}>
                        {option?.image === "openJob"
                            ? <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 20 20" fill="none">
                                <path d="M7.14307 6.57171C6.82748 6.57171 6.57164 6.82754 6.57164 7.14314C6.57164 7.45873 6.82748 7.71457 7.14307 7.71457H12.8574C13.1729 7.71457 13.4288 7.45873 13.4288 7.14314C13.4288 6.82754 13.1729 6.57171 12.8574 6.57171H7.14307Z" fill="#475467" />
                                <path d="M7.14307 8.85742C6.82748 8.85742 6.57164 9.11326 6.57164 9.42885C6.57164 9.74444 6.82748 10.0003 7.14307 10.0003H10.5716C10.8872 10.0003 11.1431 9.74444 11.1431 9.42885C11.1431 9.11326 10.8872 8.85742 10.5716 8.85742H7.14307Z" fill="#475467" />
                                <path fillRule="evenodd" clipRule="evenodd" d="M10.0002 3.14314C11.2626 3.14314 12.2859 2.11979 12.2859 0.857422H15.1431C16.0898 0.857422 16.8574 1.62493 16.8574 2.57171V17.4289C16.8574 18.3756 16.0898 19.1431 15.1431 19.1431H4.85735C3.91058 19.1431 3.14307 18.3756 3.14307 17.4289V2.57171C3.14307 1.62493 3.91058 0.857422 4.85735 0.857422H7.7145C7.7145 2.11979 8.73784 3.14314 10.0002 3.14314ZM10.0002 4.28599C11.493 4.28599 12.763 3.33193 13.2337 2.00028H15.1431C15.4587 2.00028 15.7145 2.25612 15.7145 2.57171V17.4289C15.7145 17.7444 15.4587 18.0003 15.1431 18.0003H4.85735C4.54176 18.0003 4.28592 17.7444 4.28592 17.4289V2.57171C4.28592 2.25612 4.54176 2.00028 4.85735 2.00028H6.76673C7.2374 3.33193 8.50739 4.28599 10.0002 4.28599Z" fill="#475467" />
                            </svg>
                            : <FallbackImage photo={option?.image} has_photo={option?.has_photo} is_business={false} size={17} />
                        }
                    </div>
                    <div>{option.label}</div>
                </div>
            );
        }

        return <span>{props.placeholder}</span>;
    };

    const reset = () => {
        setTemplatedId("");
        setIsOpenRepeatSection(false);
        setIsOpenAttachmentsSection(false);
        setIsOpenProjectPhotoSection(false);
        setJobReference("");
        setDescription("");
        setUserId("");
        setSelectedUserInfo({});
        setHourlyRate("0.00");
        setPaymentCycle("");
        setProjectId("");
        setRepeat('Weekly');
        setWeeks([]);
        setMonths([]);
        setRepeatStart("");
        setEnding([]);
        setRepeatEnd("");
        setOccurrences("");
        setProjectPhotoDeliver("");
        setFiles([]);
        setType('2');
        setCost(0.00);
        set_time_type('1');
        setStart(today);
        setEnd("");
        setDuration("1.00");
        setDayShiftHours("1.00");
        setErrors({});
    };

    useEffect(() => {
        if (getTemplateByIDQuery?.data) {
            // Limit job reference to 50 characters when loading from template
            const templateTitle = getTemplateByIDQuery?.data?.title || "";
            setJobReference(templateTitle.substring(0, 50));
            setDescription(getTemplateByIDQuery?.data?.description || "");
            setErrors((others) => ({ ...others, jobReference: false }));
            setErrors((others) => ({ ...others, description: false }));
        }
    }, [getTemplateByIDQuery?.data]);

    useEffect(() => {
        const projectParamId = params.get('projectId');
        const reference = params.get('reference');
        if (reference) {
            setJobReference(reference);
            urlObj.searchParams.delete('reference');
            window.history.replaceState({}, '', urlObj);
        }

        if (projectParamId) {
            setVisible(true);
            setProjectId(+projectParamId);
            urlObj.searchParams.delete('projectId');
            window.history.replaceState({}, '', urlObj);
        }
    }, [setVisible, params, urlObj]);

    const uploadToS3 = async (file, url) => {
        try {
            const response = await axios.put(url, file, {
                headers: {
                    "Content-Type": "",
                },
                onUploadProgress: (progressEvent) => {
                    const progress = Math.round(
                        (progressEvent.loaded / progressEvent.total) * 100
                    );
                    setFiles((prevFiles) => {
                        return prevFiles.map((f) =>
                            f.name === file.name
                                ? Object.assign(f, { progress, url })
                                : f
                        );
                    });
                },
            });

            // Mark as successfully uploaded
            setFiles((prevFiles) => {
                return prevFiles.map((f) =>
                    f.name === file.name
                        ? Object.assign(f, { progress: 100, uploaded: true })
                        : f
                );
            });

            return response;
        } catch (err) {
            // Handle specific error types
            let errorMessage = "Upload failed";

            if (err.response) {
                if (err.response.status === 403) {
                    errorMessage = "Permission denied (403 Forbidden)";
                } else {
                    errorMessage = `Server error: ${err.response.status}`;
                }
            } else if (err.request) {
                errorMessage = "No response from server";
            } else {
                errorMessage = err.message;
            }

            console.error(`Error uploading ${file.name}:`, errorMessage);

            // Update file with error status but don't stop other uploads
            setFiles((prevFiles) => {
                return prevFiles.map((f) =>
                    f.name === file.name
                        ? Object.assign(f, {
                            progress: 0,
                            error: true,
                            errorMessage,
                            uploadFailed: true
                        })
                        : f
                );
            });

            // Return error object instead of throwing
            return { error: true, message: errorMessage };
        }
    };

    const attachmentsUpdateInJob = async (id) => {
        let attachments = [];
        for (const file of files) {
            if (file.error || !file.url) continue;

            let obj = {
                "name": file?.name,
                "link": file?.url?.split("?")[0] || "",
                "size": file?.size
            };
            attachments.push(obj);
        }

        try {
            const response = await axios.post(
                `${process.env.REACT_APP_BACKEND_API_URL}/jobs/attachments/${id}/`,
                { attachments: attachments || [] },
                {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                }
            );
            console.log('response', response);
        } catch (err) {
            console.error("Error uploading file:", err);
            toast.error(`Failed to update attachments in DB. Please try again.`);
        }
    };

    const fileUploadBySignedURL = async (id) => {
        if (!files.length) return;
        if (!id) return toast.error(`Job id not found`);

        let successCount = 0;
        let errorCount = 0;

        // Process each file independently
        for (const file of files) {
            try {
                // Step 1: Get the signed URL from the backend
                const response = await axios.post(
                    `${process.env.REACT_APP_BACKEND_API_URL}/jobs/attachments/url/${id}/`,
                    { filename: file.name },
                    {
                        headers: {
                            Authorization: `Bearer ${accessToken}`,
                        },
                    }
                );

                const { url } = response.data;
                if (!url) {
                    console.error(`No URL returned for file: ${file.name}`);
                    errorCount++;
                    continue;
                }

                // Step 2: Upload the file to S3 using the signed URL
                const result = await uploadToS3(file, url);

                // Check if upload was successful
                if (result && !result.error) {
                    successCount++;
                } else {
                    errorCount++;
                }
            } catch (error) {
                console.error("Error uploading file:", file.name, error);

                // Update file with error status
                setFiles((prevFiles) => {
                    return prevFiles.map((f) =>
                        f.name === file.name
                            ? Object.assign(f, {
                                progress: 0,
                                error: true,
                                errorMessage: error.message || "Failed to get upload URL",
                                uploadFailed: true
                            })
                            : f
                    );
                });

                errorCount++;
                // Continue with next file instead of stopping
            }
        }

        // Show summary toasts
        if (successCount > 0) {
            toast.success(`Successfully uploaded ${successCount} file(s)`);
        }
        if (errorCount > 0) {
            toast.error(`Failed to upload ${errorCount} file(s)`);
        }
    };

    const mutation = useMutation({
        mutationFn: (data) => {
            if (isEditMode && jobId) {
                return updateJob(jobId, data);
            } else {
                return createNewJob(data);
            }
        },
        onSuccess: async (response) => {
            const id = isEditMode ? jobId : response.id;

            if (files.length > 0) {
                await fileUploadBySignedURL(id);
                await attachmentsUpdateInJob(id);
            }

            // Call setRefetch to trigger a refresh in the parent component
            if (jobData) refetch();
            setRefetch((prev) => !prev);

            toast.success(`Job ${isEditMode ? 'updated' : 'created'} successfully`);
            setVisible(false);
            reset();
            publishRef.current = null;
        },
        onError: (error) => {
            publishRef.current = null;
            console.error(`Error ${isEditMode ? 'updating' : 'creating'} job:`, error);
            toast.error(`Failed to ${isEditMode ? 'update' : 'create'} job. Please try again.`);
        }
    });

    const onSubmit = (isPublish) => {
        // Initialize a temporary errors object
        const tempErrors = {
            jobReference: false,
            description: false,
            userId: false,
            type: false,
            cost: false,
            duration: false,
            time_type: false,
            start: false,
            end: false,
            projectId: false
        };

        const payload = {};

        if (!jobReference) tempErrors.jobReference = true;
        else payload.short_description = jobReference;

        if (description) payload.long_description = description;

        if (!userId) tempErrors.userId = true;
        else if (userId && userId != "0") payload.worker = userId;

        if (!type) tempErrors.type = true;
        else payload.type = type;

        if (!duration || Number(duration) <= 0) tempErrors.duration = true;
        else if (duration) payload.duration = +duration;

        if (!time_type) tempErrors.time_type = true;
        else payload.time_type = time_type;

        if (!start) tempErrors.start = true;
        else payload.start_date = new Date(start).toISOString();

        if (time_type !== '1' && !end) tempErrors.end = true;
        else if (end) payload.end_date = new Date(end).toISOString();

        if ((time_type === '1' && type === '3') && !dayShiftHours) tempErrors.dayShiftHours = true;
        else if ((time_type === '1' && type === '3') && dayShiftHours) {
            const safeDuration = duration || 0;
            const safeDayShiftHours = dayShiftHours || 0;
            const workDays =
                safeDayShiftHours > 0
                    ? safeDuration / safeDayShiftHours
                    : 0;
            const hoursToAdd = workDays * 24; // convert working days to calendar time in hours
            payload.end_date = new Date(new Date(start).getTime() + (hoursToAdd * 60 * 60 * 1000)).toISOString();
        }

        if (projectId) {
            const project = projectQuery?.data?.find(project => project.id === projectId);
            if (project) payload.project = project.unique_id;
        }

        if (type === '2' && (!cost || cost == '0.00')) tempErrors.cost = true;
        else if (type === '2') payload.cost = cost;
        else if (payload.duration && hourlyRate) {
            payload.cost = parseFloat(+payload.duration * +hourlyRate).toFixed(2);
        }

        if (projectPhotoDeliver)
            payload.project_photos = projectPhotoDeliver;

        payload.published = isPublish;
        publishRef.current = isPublish;

        // Batch update errors at the end
        setErrors(tempErrors);

        console.log('payload: ', payload);
        // Check if there are no errors and proceed
        if (!Object.values(tempErrors).includes(true)) {
            mutation.mutate(payload);
        }
    };

    const workerDetailsSet = useCallback((id) => {
        let user = mobileUserQuery?.data?.users?.find(user => user.id === id);
        let paymentCycleObj = {
            "7": "WEEK",
            "14": "TWO_WEEKS",
            "28": "FOUR_WEEKS",
            "1": "MONTH"
        };
        if (user) {
            setHourlyRate(parseFloat(user?.hourly_rate || 0).toFixed(2));
            setSelectedUserInfo({
                hourlyRate: parseFloat(user?.hourly_rate || 0).toFixed(2),
                paymentCycle: paymentCycleObj[user?.payment_cycle] || "",
                image: user?.photo || "",
                has_photo: user?.has_photo,
                name: `${user.first_name} ${user.last_name}`,
            });
        } else {
            setHourlyRate(0);
        }
    }, [mobileUserQuery?.data?.users]);

    useEffect(() => {
        if (workerId) {
            setUserId(+workerId || "0");
            workerDetailsSet(+workerId || "");
        }
    }, [workerId, workerDetailsSet]);

    useEffect(() => {
        if (jobProjectId) {
            setProjectId(+jobProjectId);
        }
    }, [jobProjectId]);

    // Populate form with job data when in edit mode
    useEffect(() => {
        if (isEditMode && jobData && projectQuery?.data) {
            // Set job reference and description
            setJobReference(jobData.short_description || "");
            setDescription(jobData.long_description || "");

            // Set worker details
            if (jobData.worker) {
                setUserId(jobData.worker.id);
                workerDetailsSet(jobData.worker.id);
            }

            // Set project
            if (jobData.project) {
                const project = projectQuery?.data?.find(project => project.unique_id === jobData.project.unique_id);
                setProjectId(project?.id || "");
            }

            // Set payment type and cost
            setType(jobData.type || "2");
            setCost(jobData.cost || 0.00);

            // Set time type and duration
            set_time_type(jobData.time_type || "");
            setDuration(jobData.duration || "");

            // Set dates
            if (jobData.start_date) {
                const startDate = new Date(+jobData.start_date * 1000);
                setStart(startDate);
            }
            if (jobData.end_date) {
                const endDate = new Date(+jobData.end_date * 1000);
                setEnd(endDate);
            }

            // set day shift hours
            // if (jobData.time_type === '1' && jobData.type === '3') {
            const startDate = new Date(+jobData.start_date * 1000);
            const endDate = new Date(+jobData.end_date * 1000);
            const diffInMs = endDate - startDate;
            const dayCount = diffInMs / (24 * 60 * 60 * 1000);
            const durationInHours = Number(jobData.duration) || 0;
            const dayShiftHours =
                dayCount > 0
                    ? Math.round((durationInHours / dayCount) * 100) / 100
                    : 0;
            setDayShiftHours(dayShiftHours.toFixed(2));
            // }

            // Set project photos
            setProjectPhotoDeliver(jobData.project_photos || "3");

            // Set attachments if available
            if (jobData.attachments && jobData.attachments.length > 0) {
                setFiles(jobData.attachments.map(attachment => ({
                    name: attachment.name,
                    size: attachment.size,
                    url: attachment.link,
                    progress: 100,
                    isExisting: true
                })));
            }
        }
    }, [isEditMode, jobData, workerDetailsSet, projectQuery?.data]);

    useEffect(() => {
        if (mobileUserQuery?.data && userId && ((time_type === '1' && type === '2') || (time_type === 'T' && type === '4'))) {
            const findUser = mobileUserQuery?.data?.users.find((user) => user.id === userId);
            if (findUser) {
                let duration = cost / findUser?.hourly_rate;
                setDuration(parseFloat(duration).toFixed(2));
            }
        }

        if (userId === '0' && +hourlyRate && ((time_type === '1' && type === '2') || (time_type === 'T' && type === '4'))) {
            let duration = cost / hourlyRate;
            setDuration(parseFloat(duration).toFixed(2));
        }
    }, [cost, mobileUserQuery?.data, userId, time_type, type, hourlyRate]);

    useEffect(() => {
        if (type === '4') set_time_type('T');
    }, [type]);

    return (
        <Sidebar visible={visible} position="right" onHide={() => { setVisible(false); reset(); }} modal={false} dismissable={false} style={{ width: '702px' }}
            content={({ closeIconRef, hide }) => (
                <div className='create-sidebar d-flex flex-column'>
                    <div className="d-flex align-items-center justify-content-between flex-shrink-0" style={{ borderBottom: '1px solid #EAECF0', padding: '12px' }}>
                        <div className="d-flex align-items-center gap-3">
                            {!isEditMode && (
                                <div style={{ position: 'relative', textAlign: 'start' }}>
                                    <Dropdown
                                        options={
                                            (templateQuery &&
                                                templateQuery.data?.map((template) => ({
                                                    value: template.id,
                                                    label: `${template.name}`,
                                                }))) ||
                                            []
                                        }
                                        className={clsx(
                                            style.dropdownSelect,
                                            "dropdown-height-fixed",
                                            "outline-none"
                                        )}
                                        style={{ height: "44px", width: '606px' }}
                                        placeholder="Select template"
                                        onChange={(e) => {
                                            setTemplatedId(e.value);
                                        }}
                                        value={templateId}
                                        loading={templateQuery?.isFetching}
                                        filter
                                        filterInputAutoFocus={true}
                                    />
                                </div>
                            )}
                            {isEditMode && (
                                <h2 className="mb-0" style={{ fontSize: '18px', fontWeight: '500' }}>Edit Job #{jobId}</h2>
                            )}
                        </div>
                        <span>
                            <Button type="button" className='text-button' ref={closeIconRef} onClick={(e) => hide(e)}>
                                <X size={24} color='#667085' />
                            </Button>
                        </span>
                    </div>

                    <div className='modal-body' style={{ padding: '24px', height: 'calc(100vh - 68px - 80px)', overflow: 'auto' }}>
                        <Card className={clsx(style.border, 'mb-3')}>
                            <Card.Body className={clsx('d-flex justify-content-between align-items-center', style.borderBottom)}>
                                <h1 className='font-16 mb-0 font-weight-light' style={{ color: '#475467', fontWeight: 400 }}>Job Details</h1>
                                <div className={clsx(style.newJobTag, 'mb-0')}>{isEditMode ? 'Edit Job' : 'New Job'}</div>
                            </Card.Body>
                            <Card.Header className={clsx(style.background, 'border-0')}>
                                <div className='form-group mb-3'>
                                    <label className={clsx(style.customLabel)}>Job Reference<span className="required">*</span></label>
                                    <div style={{ position: 'relative' }}>
                                        <IconField>
                                            <InputIcon>
                                                {getTemplateByIDQuery?.isFetching && <ProgressSpinner style={{ width: '20px', height: '20px', position: 'relative', top: '-5px' }} />}
                                            </InputIcon>
                                            <InputText
                                                value={jobReference}
                                                className={clsx(style.inputBox, 'w-100')}
                                                onChange={(e) => {
                                                    const value = e.target.value;
                                                    if (value.length <= 50) {
                                                        setJobReference(value);
                                                        if (value)
                                                            setErrors((others) => ({ ...others, jobReference: false }));
                                                    }
                                                }}
                                                maxLength={50}
                                                placeholder="Enter job reference"
                                            />
                                        </IconField>
                                    </div>
                                    <div className="d-flex justify-content-between">
                                        {errors?.jobReference && (
                                            <p className="error-message mb-0">{"Job reference is required"}</p>
                                        )}
                                        <small className="text-muted ms-auto">{jobReference.length}/50</small>
                                    </div>
                                </div>

                                <div className='form-group mb-3'>
                                    <label className={clsx(style.customLabel)}>Job Description</label>
                                    <div style={{ position: 'relative' }}>
                                        <IconField>
                                            <InputIcon>
                                                {getTemplateByIDQuery?.isFetching && <ProgressSpinner style={{ width: '20px', height: '20px', position: 'relative', top: '-5px' }} />}
                                            </InputIcon>
                                            <InputTextarea
                                                value={description}
                                                className={clsx(style.inputBox, 'w-100 outline-none')}
                                                onChange={(e) => {
                                                    setDescription(e.target.value);
                                                    if (e.target.value)
                                                        setErrors((others) => ({ ...others, description: false }));
                                                }}
                                                style={{
                                                    height: '126px'
                                                }}
                                                placeholder="Enter a description..."
                                            />
                                        </IconField>
                                    </div>
                                    {errors?.description && (
                                        <p className="error-message mb-0">{"Description is required"}</p>
                                    )}
                                </div>

                            </Card.Header>
                        </Card>

                        <Card className={clsx(style.border, 'mb-3')}>
                            <Card.Header className={clsx(style.background, 'border-0 py-4')}>
                                <h1 className='font-16 font-weight-light' style={{ color: '#475467', fontWeight: 400 }}>Assigned to<span className="required">*</span></h1>
                                <Row>
                                    <Col sm={5} className='d-flex align-items-center'>
                                        <div style={{ position: 'relative', textAlign: 'start' }}>
                                            <label className={clsx(style.customLabel)}>Choose User</label>
                                            <Dropdown
                                                options={[
                                                    { value: "0", label: "Open job", image: "openJob", has_photo: false },
                                                    ...(mobileUserQuery?.data?.users
                                                        ?.filter((user) => user.status !== 'disconnected')
                                                        ?.map((user) => ({
                                                            value: user.id,
                                                            label: `${user.first_name} ${user.last_name}`,
                                                            image: user?.photo,
                                                            has_photo: user?.has_photo
                                                        })) || [])
                                                ]}
                                                itemTemplate={itemTemplate}
                                                className={clsx(
                                                    style.dropdownSelect,
                                                    "dropdown-height-fixed",
                                                    "outline-none"
                                                )}
                                                style={{ height: "44px", width: '245px' }}
                                                placeholder="Select user"
                                                onChange={(e) => {
                                                    setUserId(e.value);
                                                    workerDetailsSet(e.value);
                                                    if (e.value)
                                                        setErrors((others) => ({ ...others, userId: false }));
                                                }}
                                                value={userId}
                                                valueTemplate={selectedItemTemplate}
                                                loading={mobileUserQuery?.isFetching}
                                                scrollHeight="350px"
                                                filter
                                                filterInputAutoFocus={true}
                                            />
                                            {errors?.userId && (
                                                <p className="error-message mb-0">{"Worker is required"}</p>
                                            )}
                                        </div>
                                    </Col>
                                    <Col sm={7}>
                                        {userId && userId != "0" &&
                                            <Row className={clsx(style.chooseUserBox, 'flex-nowrap')}>
                                                <Col sm={2} className='p-0'>
                                                    <div className='d-flex justify-content-center align-items-center' style={{ width: '62px', height: '62px', borderRadius: '50%', overflow: 'hidden', border: '1px solid #dedede' }}>
                                                        <FallbackImage photo={selectedUserInfo?.image} has_photo={selectedUserInfo?.has_photo} is_business={false} size={40} />
                                                    </div>
                                                </Col>
                                                <Col sm={5} className='pe-0 ps-0'>
                                                    <label className={clsx(style.customLabel, 'text-nowrap')}>{selectedUserInfo?.name || "-"}</label>
                                                    <div style={{ background: '#EBF8FF', border: '1px solid #A3E0FF', borderRadius: '23px', textAlign: 'center' }}>Employee</div>
                                                </Col>
                                                <Col sm={5} className=''>
                                                    <div className='d-flex align-items-center gap-2 mb-3'>
                                                        <div style={{ width: '16px', height: '16px', background: '#EBF8FF', border: '1px solid #A3E0FF', borderRadius: '23px', textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>$</div>
                                                        <span>{selectedUserInfo?.hourlyRate || "-"} AUD</span>
                                                    </div>
                                                    <div className='d-flex align-items-center gap-2'>
                                                        <div style={{ width: '16px', height: '16px', background: '#EBF8FF', border: '1px solid #A3E0FF', borderRadius: '23px', textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Calendar3 color="#158ECC" size={16} /></div>
                                                        <span>{selectedUserInfo?.paymentCycle || "-"}</span>
                                                    </div>
                                                </Col>
                                            </Row>
                                        }
                                    </Col>
                                </Row>
                            </Card.Header>
                        </Card>

                        <Card className={clsx(style.border, 'mb-3')}>
                            <Card.Body className={clsx(style.borderBottom)}>
                                <h1 className='font-16 mb-0 font-weight-light' style={{ color: '#475467', fontWeight: 400 }}>Time / Money</h1>
                            </Card.Body>
                            <Card.Header className={clsx(style.background, 'border-0 pt-2', style.borderBottom)}>
                                <div className={style.paymentType}>
                                    <label className={clsx(style.lable)}>Payment Type</label>
                                    <div className={style.paymentmain}>
                                        <div className={`flex align-items-center ${style.RadioButton}`}>
                                            <input
                                                type="radio"
                                                id="fix"
                                                name="paymentype"
                                                value="2"
                                                onChange={(e) => {
                                                    setType(e.target.value);
                                                    if (e.target.value === "2")
                                                        setErrors((others) => ({ ...others, type: false }));
                                                }}
                                                checked={type === '2'}
                                                className={style.customRadio}
                                            />
                                            <label htmlFor="fix" className={clsx(style.radioLabel, style.fix)}>Fix</label>
                                        </div>
                                        <span>OR</span>
                                        <div className={`flex align-items-center ${style.RadioButton}`}>
                                            <input
                                                type="radio"
                                                id="hours"
                                                name="paymentype"
                                                value="3"
                                                onChange={(e) => {
                                                    setType(e.target.value);
                                                    if (e.target.value === "3")
                                                        setErrors((others) => ({ ...others, type: false }));
                                                }}
                                                checked={type === '3'}
                                                className={style.customRadio}
                                            />
                                            <label htmlFor="hours" className={clsx(style.radioLabel, style.hours)}>Hours</label>
                                        </div>
                                        <span>OR</span>
                                        <div className={`flex align-items-center ${style.RadioButton}`}>
                                            <input
                                                type="radio"
                                                id="timetracker"
                                                name="paymentype"
                                                value="4"
                                                onChange={(e) => {
                                                    setType(e.target.value);
                                                    if (e.target.value === "4")
                                                        setErrors((others) => ({ ...others, type: false }));
                                                }}
                                                checked={type === '4'}
                                                className={style.customRadio}
                                            />
                                            <label htmlFor="timetracker" className={clsx(style.radioLabel, style.timetracker)}>Time Tracker</label>
                                        </div>
                                    </div>
                                    {errors?.type && (
                                        <p className="error-message mb-0">{"Payment Type is required"}</p>
                                    )}
                                    {
                                        type === "2" ? <>
                                            <label className={clsx(style.lable, 'mt-4 mb-2')}>Payment<span className="required">*</span></label>
                                            <IconField iconPosition="left">
                                                <InputIcon><span style={{ position: 'relative', top: '-4px' }}>$</span></InputIcon>
                                                <InputText value={cost} onChange={(e) => {
                                                    setCost(e.target.value);
                                                    if (e.target.value)
                                                        setErrors((others) => ({ ...others, cost: false }));
                                                }} keyfilter={"num"} onBlur={(e) => setCost(parseFloat(e?.target?.value || 0).toFixed(2))} style={{ paddingLeft: '28px', width: '230px' }} className={clsx(style.inputBox, "outline-none")} placeholder='20' />
                                            </IconField>
                                            {errors?.cost && (
                                                <p className="error-message mb-0">{"Payment is required and must be greater than zero."}</p>
                                            )}
                                        </>
                                            : <div style={{ width: 'fit-content' }}>
                                                <label className={clsx(style.lable, 'mt-4 mb-2 d-block')}>{type === '3' ? "Hours" : "Time Estimation"}<span className="required">*</span></label>
                                                <IconField iconPosition="left">
                                                    <InputIcon><span style={{ position: 'relative', top: '-4px' }}>H</span></InputIcon>
                                                    <InputText value={duration}
                                                        onChange={(e) => {
                                                            setDuration(e.target.value);
                                                            setDayShiftHours(e.target.value);
                                                            if (e.target.value)
                                                                setErrors((others) => ({ ...others, duration: false }));
                                                        }}
                                                        keyfilter={"num"}
                                                        onBlur={(e) => {
                                                            setDuration(parseFloat(e?.target?.value || 0).toFixed(2));
                                                            setDayShiftHours(parseFloat(e.target.value || 0).toFixed(2));
                                                        }}
                                                        style={{ paddingLeft: '28px', width: '150px' }} className={clsx(style.inputBox, "outline-none")} placeholder='1.0'
                                                    />
                                                </IconField>
                                                {errors?.duration && (
                                                    <p className="error-message mb-0">{type === '3' ? "Hours is required" : "Time Estimation is required"}</p>
                                                )}
                                            </div>
                                    }
                                </div>
                            </Card.Header>
                            <Card.Header className={clsx(style.background, 'border-0')}>
                                <div className={style.paymentType}>
                                    <label className={clsx(style.lable)}>Time<span className="required">*</span></label>
                                    <div className={style.paymentmain}>
                                        {
                                            type !== "4" && <>
                                                <div className={`flex align-items-center ${style.RadioButton}`}>
                                                    <input
                                                        type="radio"
                                                        id="shift"
                                                        name="timetype"
                                                        value="1"
                                                        onChange={(e) => {
                                                            set_time_type(e.target.value);
                                                            if (e.target.value === "1")
                                                                setErrors((others) => ({ ...others, time_type: false }));
                                                        }}
                                                        checked={time_type === '1'}
                                                        className={style.customRadio}
                                                    />
                                                    <label htmlFor="shift" className={clsx(style.radioLabel, style.shift)}>Shift</label>
                                                </div>
                                                <span>OR</span>
                                            </>
                                        }

                                        <div className={`flex align-items-center ${style.RadioButton}`}>
                                            <input
                                                type="radio"
                                                id="timeframe"
                                                name="timetype"
                                                value="T"
                                                onChange={(e) => {
                                                    set_time_type(e.target.value);
                                                    if (e.target.value === "T")
                                                        setErrors((others) => ({ ...others, time_type: false }));
                                                }}
                                                checked={time_type === 'T'}
                                                className={style.customRadio}
                                            />
                                            <label htmlFor="timeframe" className={clsx(style.radioLabel, style.timeFrame)}>Time Frame</label>
                                        </div>
                                    </div>
                                    {errors?.time_type && (
                                        <p className="error-message mb-0">{"Time type is required"}</p>
                                    )}
                                </div>

                                <div className='d-flex gap-2'>
                                    <div className='form-group'>
                                        <label className={clsx(style.lable, 'mt-4 mb-2 d-block')}>Starts<span className="required">*</span></label>
                                        <Calendar
                                            value={start}
                                            onChange={(e) => {
                                                setStart(e.value);
                                                if (e.value)
                                                    setErrors((others) => ({ ...others, start: false }));
                                            }}
                                            showButtonBar
                                            placeholder='17 Jun 2021'
                                            dateFormat="dd M yy"
                                            locale="en"
                                            showIcon
                                            style={{ height: '46px', width: '230px', overflow: 'hidden' }}
                                            icon={<Calendar3 color='#667085' size={20} />}
                                            className={clsx(style.inputBox, 'p-0 outline-none')}
                                            hourFormat="24"
                                            showTime
                                        />
                                        {errors?.start && (
                                            <p className="error-message mb-0">{"Start is required"}</p>
                                        )}
                                    </div>
                                    {
                                        time_type !== '1' && <div className='form-group'>
                                            <label className={clsx(style.lable, 'mt-4 mb-2 d-block')}>End<span className="required">*</span></label>
                                            <Calendar
                                                value={end}
                                                onChange={(e) => {
                                                    setEnd(e.value);
                                                    if (e.value)
                                                        setErrors((others) => ({ ...others, end: false }));
                                                }}
                                                showButtonBar
                                                placeholder='20 Jun 2021'
                                                dateFormat="dd M yy"
                                                locale="en"
                                                showIcon
                                                style={{ height: '46px', width: '230px', overflow: 'hidden' }}
                                                icon={<Calendar3 color='#667085' size={20} />}
                                                className={clsx(style.inputBox, 'p-0 outline-none')}
                                                hourFormat="24"
                                                showTime
                                            />
                                            {errors?.end && (
                                                <p className="error-message mb-0">{"End is required"}</p>
                                            )}
                                        </div>
                                    }
                                    {
                                        (type === '2' && time_type !== 'T') ? (
                                            <div style={{ width: 'fit-content' }}>
                                                <label className={clsx(style.lable, 'mt-4 mb-2 d-block')}>Hours<span className="required">*</span></label>
                                                <IconField iconPosition="right">
                                                    <InputIcon><ClockHistory color='#667085' size={20} style={{ position: 'relative', top: '-5px' }} /></InputIcon>
                                                    <InputText value={duration} onChange={(e) => setDuration(e.target.value)} keyfilter={"num"} onBlur={(e) => setDuration(parseFloat(e?.target?.value || 0).toFixed(2))} style={{ paddingLeft: '12px', width: '150px' }} className={clsx(style.inputBox, "outline-none")} placeholder='1.0' />
                                                </IconField>
                                                {errors?.duration && (
                                                    <p className="error-message mb-0">{"Hours is required"}</p>
                                                )}
                                            </div>
                                        ) : (time_type === '1' || (time_type !== '1' && type === '4')) ?
                                            <div style={{ width: 'fit-content' }}>
                                                <label className={clsx(style.lable, 'mt-4 mb-2 d-block')}>Hours<span className="required">*</span></label>
                                                <IconField iconPosition="right">
                                                    <InputIcon><ClockHistory color='#667085' size={20} style={{ position: 'relative', top: '-5px' }} /></InputIcon>
                                                    <InputText value={dayShiftHours} onChange={(e) => setDayShiftHours(e.target.value)} keyfilter={"num"} onBlur={(e) => setDayShiftHours(parseFloat(e?.target?.value || 0).toFixed(2))} style={{ paddingLeft: '12px', width: '150px' }} className={clsx(style.inputBox, "outline-none")} placeholder='1.0' />
                                                </IconField>
                                                {errors?.dayShiftHours && (
                                                    <p className="error-message mb-0">{"Hours is required"}</p>
                                                )}
                                            </div> : ""
                                    }
                                </div>

                            </Card.Header>
                        </Card>

                        <Card className={clsx(style.border, 'mb-3')}>
                            <Card.Body className={clsx(style.borderBottom)}>
                                <h1 className='font-16 mb-0 font-weight-light' style={{ color: '#475467', fontWeight: 400 }}>Link to Project</h1>
                            </Card.Body>
                            <Card.Header className={clsx(style.background, 'border-0', style.borderBottom)}>
                                <div style={{ position: 'relative', textAlign: 'start' }}>
                                    <label className={clsx(style.customLabel)}>Project</label>
                                    <Dropdown
                                        options={
                                            (projectQuery &&
                                                projectQuery.data?.map((project) => ({
                                                    value: project.id,
                                                    label: `${project.number}: ${project.reference}`
                                                }))) ||
                                            []
                                        }
                                        className={clsx(
                                            style.dropdownSelect,
                                            "dropdown-height-fixed",
                                            "outline-none",
                                            "mb-3"
                                        )}
                                        style={{ height: "44px", width: '100%' }}
                                        placeholder="Select project"
                                        onChange={(e) => {
                                            setProjectId(e.value);
                                            if (e.value)
                                                setErrors((others) => ({ ...others, projectId: false }));
                                        }}
                                        value={projectId}
                                        loading={projectQuery?.isFetching}
                                        scrollHeight="400px"
                                        filter
                                        filterInputAutoFocus={true}
                                    />
                                    {errors?.projectId && (
                                        <p className="error-message mb-0">{"Project is required"}</p>
                                    )}
                                </div>
                            </Card.Header>
                            {/* <Card.Header className={clsx(style.background, 'border-0')}>
                                <div className='form-group mb-3'>
                                    <label className={clsx(style.customLabel)}>Reference</label>
                                    <div style={{ position: 'relative' }}>
                                        <IconField>
                                            <InputIcon>
                                                {projectQuery?.isFetching && <ProgressSpinner style={{ width: '20px', height: '20px', position: 'relative', top: '-5px' }} />}
                                            </InputIcon>
                                            <InputText
                                                value={projectReference}
                                                className={clsx(style.inputBox, 'w-100')}
                                                onChange={(e) => {
                                                    setProjectReference(e.target.value);
                                                    setErrors((others) => ({ ...others, projectReference: false }));
                                                }}
                                                placeholder="Enter project reference"
                                            />
                                        </IconField>
                                    </div>
                                </div>
                                <div className='form-group mb-3'>
                                    <label className={clsx(style.customLabel)}>Description</label>
                                    <div style={{ position: 'relative' }}>
                                        <IconField>
                                            <InputIcon>
                                                {projectQuery?.isFetching && <ProgressSpinner style={{ width: '20px', height: '20px', position: 'relative', top: '-40px' }} />}
                                            </InputIcon>
                                            <InputTextarea
                                                value={projectDescription}
                                                style={{ height: '120px' }}
                                                className={clsx(style.inputBox, 'w-100 outline-0')}
                                                onChange={(e) => {
                                                    setProjectDescription(e.target.value);
                                                    setErrors((others) => ({ ...others, projectDescription: false }));
                                                }}
                                                placeholder="Enter a description..."
                                            />
                                        </IconField>
                                    </div>
                                </div>
                            </Card.Header> */}
                        </Card>

                        <Card className={clsx(style.border, 'mb-3')}>
                            <Card.Body className={clsx(style.borderBottom, 'cursor-pointer')} onClick={() => setIsOpenRepeatSection(!isOpenRepeatSection)}>
                                <div className='d-flex justify-content-between align-items-center'>
                                    <h1 className='font-16 mb-0 font-weight-light' style={{ color: '#475467', fontWeight: 400 }}>Set to repeat</h1>
                                    <button className='text-button p-0'>
                                        {
                                            isOpenRepeatSection ? <svg xmlns="http://www.w3.org/2000/svg" width="14" height="8" viewBox="0 0 14 8" fill="none">
                                                <path fillRule="evenodd" clipRule="evenodd" d="M13.3536 7.35355C13.1583 7.54882 12.8417 7.54882 12.6464 7.35355L7 1.70711L1.35355 7.35355C1.15829 7.54881 0.841709 7.54881 0.646446 7.35355C0.451184 7.15829 0.451184 6.84171 0.646446 6.64645L6.64645 0.646446C6.84171 0.451184 7.15829 0.451184 7.35355 0.646446L13.3536 6.64645C13.5488 6.84171 13.5488 7.15829 13.3536 7.35355Z" fill="#344054" />
                                            </svg> : <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                                                <path fillRule="evenodd" clipRule="evenodd" d="M1.64645 4.64645C1.84171 4.45118 2.15829 4.45118 2.35355 4.64645L8 10.2929L13.6464 4.64645C13.8417 4.45118 14.1583 4.45118 14.3536 4.64645C14.5488 4.84171 14.5488 5.15829 14.3536 5.35355L8.35355 11.3536C8.15829 11.5488 7.84171 11.5488 7.64645 11.3536L1.64645 5.35355C1.45118 5.15829 1.45118 4.84171 1.64645 4.64645Z" fill="#344054" />
                                            </svg>
                                        }
                                    </button>
                                </div>
                            </Card.Body>
                            {
                                isOpenRepeatSection && <div className={style.openTransition}>
                                    <Card.Header className={clsx(style.background, 'border-0', style.borderBottom)}>
                                        <div className='d-flex align-items-center gap-4 py-1'>
                                            <div className="flex align-items-center">
                                                <RadioButton inputId="Weekly" name="repeat" value="Weekly" onChange={(e) => setRepeat(e.value)} checked={repeat === 'Weekly'} />
                                                <label htmlFor="Weekly" className="ms-2 cursor-pointer">Weekly</label>
                                            </div>
                                            <div className="flex align-items-center">
                                                <RadioButton inputId="Monthly" name="repeat" value="Monthly" onChange={(e) => setRepeat(e.value)} checked={repeat === 'Monthly'} />
                                                <label htmlFor="Monthly" className="ms-2 cursor-pointer">Monthly</label>
                                            </div>
                                        </div>
                                    </Card.Header>
                                    <Card.Header className={clsx(style.background, 'border-0', style.borderBottom)}>
                                        <div className='d-flex flex-column'>
                                            <label className='mb-2'>Repeat on</label>
                                            {
                                                repeat === 'Weekly' && <div className='d-flex gap-3 align-items-center'>
                                                    {
                                                        ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, index) =>
                                                            <button key={day} onClick={() => {
                                                                setWeeks((prevWeeks) =>
                                                                    prevWeeks.includes(index)
                                                                        ? prevWeeks.filter((d) => d !== index)
                                                                        : [...prevWeeks, index]
                                                                );
                                                            }} className={clsx('outline-button', { 'active-outline-button': weeks.includes(index) })}>
                                                                {day}
                                                            </button>
                                                        )
                                                    }
                                                </div>
                                            }
                                            {
                                                repeat === 'Monthly' && <div className='d-flex gap-2 align-items-center flex-wrap'>
                                                    {
                                                        Array.from({ length: 31 }, (_, i) => i + 1).map((month) => (
                                                            <button key={month} onClick={() => {
                                                                setMonths((prevMonths) =>
                                                                    prevMonths.includes(month)
                                                                        ? prevMonths.filter((m) => m !== month)
                                                                        : [...prevMonths, month]
                                                                );
                                                            }} className={clsx('outline-button', { 'active-outline-button': months.includes(month) })}>
                                                                {month}
                                                            </button>
                                                        ))
                                                    }
                                                </div>
                                            }
                                            {errors?.on && (
                                                <p className="error-message mb-0">{"Repeats on are required"}</p>
                                            )}
                                        </div>
                                    </Card.Header>
                                    <Card.Header className={clsx(style.background, 'border-0', style.borderBottom)}>
                                        <label className='mb-2'>Starts</label>
                                        <Calendar
                                            value={repeatStart}
                                            onChange={(e) => setRepeatStart(e.value)}
                                            showButtonBar
                                            placeholder='17 Jun 2021'
                                            dateFormat="dd M yy"
                                            locale="en"
                                            showIcon
                                            style={{ height: '46px', width: '180px', overflow: 'hidden' }}
                                            icon={<Calendar3 color='#667085' size={20} />}
                                            className={clsx(style.inputBox, 'p-0 outline-none')}
                                        />
                                        {errors?.repeatStart && (
                                            <p className="error-message mb-0">{"Starts is required"}</p>
                                        )}
                                    </Card.Header>
                                    <Card.Header className={clsx(style.background, 'border-0 d-flex', style.borderBottom)}>
                                        <div className='d-flex flex-column'>
                                            <label className='mb-1'>Ends</label>
                                            <div className='d-flex align-items-center gap-4 py-1'>
                                                <div className="flex align-items-center">
                                                    <RadioButton inputId="On" name="ending" value="On" onChange={(e) => setEnding(e.value)} checked={repeat === 'On'} />
                                                    <label htmlFor="On" className="ms-2 cursor-pointer">On</label>
                                                </div>
                                                <Calendar
                                                    value={repeatEnd}
                                                    onChange={(e) => setRepeatEnd(e.value)}
                                                    showButtonBar
                                                    placeholder='20 Jun 2021'
                                                    dateFormat="dd M yy"
                                                    locale="en"
                                                    showIcon
                                                    style={{ height: '46px', width: '180px', overflow: 'hidden' }}
                                                    icon={<Calendar3 color='#667085' size={20} />}
                                                    className={clsx(style.inputBox, 'p-0 outline-none')}
                                                />
                                                <div className="flex align-items-center">
                                                    <RadioButton inputId="Never" name="ending" value="Never" onChange={(e) => setEnding(e.value)} checked={repeat === 'Never'} />
                                                    <label htmlFor="Never" className="ms-2 cursor-pointer">Never</label>
                                                </div>
                                            </div>
                                        </div>
                                        <div className='d-flex flex-column ms-3'>
                                            <label className='mb-1'>Occurrences</label>
                                            <Dropdown
                                                options={
                                                    [
                                                        { label: 1, value: 1 },
                                                        { label: 2, value: 2 },
                                                        { label: 3, value: 3 },
                                                        { label: 4, value: 4 },
                                                        { label: 5, value: 5 },
                                                        { label: 6, value: 6 },
                                                        { label: 7, value: 7 },
                                                    ]
                                                }
                                                className={clsx(
                                                    style.dropdownSelect,
                                                    "dropdown-height-fixed",
                                                    "outline-none",
                                                    "mb-3"
                                                )}
                                                style={{ height: "44px", width: '100%' }}
                                                placeholder="Select Occurrences"
                                                onChange={(e) => {
                                                    setProjectId(e.value);
                                                }}
                                                value={projectId}
                                                loading={projectQuery?.isFetching}
                                                filter
                                                filterInputAutoFocus={true}
                                            />
                                        </div>
                                    </Card.Header>
                                    <Card.Header className={clsx(style.background, 'border-0 d-flex flex-column', style.borderBottom)}>
                                        <label className='mb-1'>Set Schedule Ahead</label>
                                        <Dropdown
                                            options={
                                                [
                                                    { label: "1 Week", value: 1 },
                                                    { label: "2 Week", value: 2 },
                                                    { label: "3 Week", value: 3 },
                                                    { label: "4 Week", value: 4 },
                                                    { label: "5 Week", value: 5 },
                                                    { label: "6 Week", value: 6 },
                                                    { label: "7 Week", value: 7 },
                                                ]
                                            }
                                            className={clsx(
                                                style.dropdownSelect,
                                                "dropdown-height-fixed",
                                                "outline-none",
                                                "mb-3"
                                            )}
                                            style={{ height: "44px", width: '250px' }}
                                            placeholder="Select week"
                                            onChange={(e) => {
                                                setOccurrences(e.value);
                                            }}
                                            value={occurrences}
                                            filterInputAutoFocus={true}
                                        />
                                    </Card.Header>
                                    <Card.Header className={clsx(style.background, 'border-0 d-flex justify-content-between', style.borderBottom)}>
                                        <Button className='outline-button'>Cancel</Button>
                                        <Button className='outline-button active-outline-button'>Apply</Button>
                                    </Card.Header>
                                </div>
                            }
                        </Card>

                        <Card className={clsx(style.border, 'mb-3')}>
                            <Card.Body className={clsx(style.borderBottom, 'cursor-pointer')} onClick={() => setIsOpenProjectPhotoSection(!isOpenProjectPhotoSection)}>
                                <div className='d-flex justify-content-between align-items-center'>
                                    <h1 className='font-16 mb-0 font-weight-light' style={{ color: '#475467', fontWeight: 400 }}>Project Photos</h1>
                                    <button className='text-button p-0'>
                                        {
                                            isOpenProjectPhotoSection ? <svg xmlns="http://www.w3.org/2000/svg" width="14" height="8" viewBox="0 0 14 8" fill="none">
                                                <path fillRule="evenodd" clipRule="evenodd" d="M13.3536 7.35355C13.1583 7.54882 12.8417 7.54882 12.6464 7.35355L7 1.70711L1.35355 7.35355C1.15829 7.54881 0.841709 7.54881 0.646446 7.35355C0.451184 7.15829 0.451184 6.84171 0.646446 6.64645L6.64645 0.646446C6.84171 0.451184 7.15829 0.451184 7.35355 0.646446L13.3536 6.64645C13.5488 6.84171 13.5488 7.15829 13.3536 7.35355Z" fill="#344054" />
                                            </svg> : <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                                                <path fillRule="evenodd" clipRule="evenodd" d="M1.64645 4.64645C1.84171 4.45118 2.15829 4.45118 2.35355 4.64645L8 10.2929L13.6464 4.64645C13.8417 4.45118 14.1583 4.45118 14.3536 4.64645C14.5488 4.84171 14.5488 5.15829 14.3536 5.35355L8.35355 11.3536C8.15829 11.5488 7.84171 11.5488 7.64645 11.3536L1.64645 5.35355C1.45118 5.15829 1.45118 4.84171 1.64645 4.64645Z" fill="#344054" />
                                            </svg>
                                        }
                                    </button>
                                </div>
                            </Card.Body>
                            {
                                isOpenProjectPhotoSection && <Card.Header className={clsx(style.background, 'border-0 d-flex justify-content-between', style.borderBottom)}>
                                    <div className='d-flex align-items-center gap-4 py-1'>
                                        <div className="flex align-items-center">
                                            <RadioButton inputId="None" name="projectPhotoDeliver" value="" onChange={(e) => setProjectPhotoDeliver(e.value)} checked={projectPhotoDeliver == ''} />
                                            <label htmlFor="None" className="ms-2 cursor-pointer">None</label>
                                        </div>
                                        <div className="flex align-items-center">
                                            <RadioButton inputId="Before and After" name="projectPhotoDeliver" value="1" onChange={(e) => setProjectPhotoDeliver(e.value)} checked={projectPhotoDeliver == '1'} />
                                            <label htmlFor="Before and After" className="ms-2 cursor-pointer">Before and After</label>
                                        </div>
                                        <div className="flex align-items-center">
                                            <RadioButton inputId="After" name="projectPhotoDeliver" value="2" onChange={(e) => setProjectPhotoDeliver(e.value)} checked={projectPhotoDeliver === '2'} />
                                            <label htmlFor="After" className="ms-2 cursor-pointer">Photos Of the Process</label>
                                        </div>
                                        <div className="flex align-items-center">
                                            <RadioButton inputId="All" name="projectPhotoDeliver" value="3" onChange={(e) => setProjectPhotoDeliver(e.value)} checked={projectPhotoDeliver == '3'} />
                                            <label htmlFor="All" className="ms-2 cursor-pointer">All</label>
                                        </div>
                                    </div>
                                </Card.Header>
                            }
                        </Card>

                        <Card className={clsx(style.border, 'mb-3')}>
                            <Card.Body className={clsx(style.borderBottom, 'cursor-pointer')} onClick={() => setIsOpenAttachmentsSection(!isOpenAttachmentsSection)}>
                                <div className='d-flex justify-content-between align-items-center'>
                                    <h1 className='font-16 mb-0 font-weight-light' style={{ color: '#475467', fontWeight: 400 }}>Attachments</h1>
                                    <button className='text-button p-0'>
                                        {
                                            isOpenAttachmentsSection ? <svg xmlns="http://www.w3.org/2000/svg" width="14" height="8" viewBox="0 0 14 8" fill="none">
                                                <path fillRule="evenodd" clipRule="evenodd" d="M13.3536 7.35355C13.1583 7.54882 12.8417 7.54882 12.6464 7.35355L7 1.70711L1.35355 7.35355C1.15829 7.54881 0.841709 7.54881 0.646446 7.35355C0.451184 7.15829 0.451184 6.84171 0.646446 6.64645L6.64645 0.646446C6.84171 0.451184 7.15829 0.451184 7.35355 0.646446L13.3536 6.64645C13.5488 6.84171 13.5488 7.15829 13.3536 7.35355Z" fill="#344054" />
                                            </svg> : <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                                                <path fillRule="evenodd" clipRule="evenodd" d="M1.64645 4.64645C1.84171 4.45118 2.15829 4.45118 2.35355 4.64645L8 10.2929L13.6464 4.64645C13.8417 4.45118 14.1583 4.45118 14.3536 4.64645C14.5488 4.84171 14.5488 5.15829 14.3536 5.35355L8.35355 11.3536C8.15829 11.5488 7.84171 11.5488 7.64645 11.3536L1.64645 5.35355C1.45118 5.15829 1.45118 4.84171 1.64645 4.64645Z" fill="#344054" />
                                            </svg>
                                        }
                                    </button>
                                </div>
                            </Card.Body>
                            {
                                isOpenAttachmentsSection && <>
                                    <Card.Header className={clsx(style.background, 'border-0 d-flex justify-content-between')}>
                                        <div {...getRootProps({ className: 'dropzone d-flex justify-content-center align-items-center flex-column' })} style={{ width: '100%', height: '126px', background: '#fff', borderRadius: '4px', border: '1px solid #EAECF0', marginTop: '16px' }}>
                                            <input {...getInputProps()} />
                                            <button type='button' className='d-flex justify-content-center align-items-center' style={{ width: '40px', height: '40px', border: '1px solid #EAECF0', background: '#fff', borderRadius: '8px', marginBottom: '16px' }}>
                                                <CloudUpload />
                                            </button>
                                            <p className='mb-0' style={{ color: '#475467', fontSize: '14px' }}><span style={{ color: '#106B99', fontWeight: '600' }}>Click to upload</span> or drag and drop</p>
                                            <span style={{ color: '#475467', fontSize: '12px' }}>SVG, PNG, JPG or GIF (max. 800x400px)</span>
                                        </div>
                                    </Card.Header>
                                    <Card.Header className={clsx(style.background, 'border-0 d-flex flex-column', style.borderBottom)}>
                                        <div className='d-flex flex-column gap-3'>
                                            {
                                                files?.map((file, index) => (
                                                    <div key={index} className={style.fileBox}>
                                                        {getFileIcon(file.type)}
                                                        <div className={style.fileNameBox}>
                                                            <p className='mb-0'>{file?.name || ""}</p>
                                                            <p className='mb-0'>
                                                                {parseFloat(file?.size / 1024).toFixed(2)} KB
                                                                {file.error ?
                                                                    <span style={{ color: "#F04438" }}> - Upload failed</span> :
                                                                    ` - ${parseInt(file?.progress) || 0}% uploaded`
                                                                }
                                                            </p>
                                                            {file.errorMessage &&
                                                                <p className='mb-0' style={{ color: "#F04438", fontSize: "12px" }}>{file.errorMessage}</p>
                                                            }
                                                        </div>
                                                        <div className='ms-auto'>
                                                            {file.error ?
                                                                <div style={{ color: "#F04438", width: "30px", height: "30px", display: "flex", alignItems: "center", justifyContent: "center" }}>!</div> :
                                                                <CircularProgressBar percentage={parseInt(file?.progress) || 0} size={30} color="#158ECC" />
                                                            }
                                                        </div>
                                                    </div>
                                                ))
                                            }
                                        </div>
                                    </Card.Header>
                                </>
                            }
                        </Card>


                    </div>

                    <div className='modal-footer d-flex align-items-center justify-content-end gap-3' style={{ padding: '16px 24px', borderTop: "1px solid var(--Gray-200, #EAECF0)", height: '72px' }}>
                        <Button type='button' onClick={(e) => { e.stopPropagation(); setVisible(false); }} className='outline-button'>Cancel</Button>
                        <Button type='button' onClick={() => onSubmit(false)} className='outline-button active-outline-button' disabled={mutation?.isPending}>
                            {isEditMode ? "Update Draft" : "Save Draft"}
                            {mutation?.isPending && !publishRef.current && <ProgressSpinner style={{ width: "20px", height: "20px", color: "#fff" }} />}
                        </Button>
                        <Button type='button' onClick={() => onSubmit(true)} className='solid-button' style={{ minWidth: '75px' }} disabled={mutation?.isPending}>
                            {isEditMode ? 'Update and Publish' : 'Save and Publish'}
                            {mutation?.isPending && publishRef.current && <ProgressSpinner style={{ width: "20px", height: "20px", color: "#fff" }} />}
                        </Button>
                    </div>
                </div>
            )}
        ></Sidebar>
    );
};

export default CreateJob;