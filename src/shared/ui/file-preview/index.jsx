import { useState } from "react";
import { Document, Page } from 'react-pdf';

export const FilePreview = ({ files }) => {
    const [pageStates, setPageStates] = useState({});

    const isImage = (url) => /\.(jpeg|jpg|png|webp|gif|svg)$/i.test(url);
    const isPDF = (url) => /\.pdf$/i.test(url);

    const handleLoadSuccess = (file, { numPages }) => {
        setPageStates((prev) => ({
            ...prev,
            [file]: { ...prev[file], numPages, currentPage: 1 },
        }));
    };

    const changePage = (file, offset) => {
        setPageStates((prev) => {
            const current = prev[file]?.currentPage || 1;
            const numPages = prev[file]?.numPages || 1;
            const newPage = Math.min(Math.max(current + offset, 1), numPages);
            return {
                ...prev,
                [file]: {
                    ...prev[file],
                    currentPage: newPage,
                },
            };
        });
    };

    return (
        <div style={{ display: 'grid', gap: '2rem' }}>
            {files.map((file, index) => {
                if (isImage(file)) {
                    return (
                        <img
                            key={index}
                            src={file}
                            alt={`preview-${index}`}
                            style={{
                                maxWidth: '100%',
                                maxHeight: '400px',
                                border: '1px solid #ccc',
                            }}
                        />
                    );
                }

                if (isPDF(file)) {
                    const currentState = pageStates[file] || {};
                    const { numPages = null, currentPage = 1 } = currentState;

                    return (
                        <div
                            key={index}
                            style={{
                                border: '1px solid #ccc',
                                padding: '1rem',
                                maxWidth: '420px',
                            }}
                        >
                            <Document
                                file={file}
                                onLoadSuccess={(e) => handleLoadSuccess(file, e)}
                                onLoadError={(err) =>
                                    console.error('PDF load error:', err)
                                }
                            >
                                <Page pageNumber={currentPage} width={400} />
                            </Document>

                            {numPages && (
                                <div
                                    style={{
                                        display: 'flex',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        marginTop: '1rem',
                                        gap: '1rem',
                                    }}
                                >
                                    <button
                                        className='outline-button px-2'
                                        style={{ height: '30px' }}
                                        onClick={() => changePage(file, -1)}
                                        disabled={currentPage <= 1}
                                    >
                                        ‹
                                    </button>
                                    <span>
                                        {currentPage} of {numPages}
                                    </span>
                                    <button
                                        className='outline-button px-2'
                                        style={{ height: '30px' }}
                                        onClick={() => changePage(file, 1)}
                                        disabled={currentPage >= numPages}
                                    >
                                        ›
                                    </button>
                                </div>
                            )}
                        </div>
                    );
                }

                return <p key={index}>Unsupported file type: {file}</p>;
            })}
        </div>
    );
};