export const getFileSizeFromURL = async (url) => {
    try {
        const response = await fetch(url, { method: 'HEAD' });
        const contentLength = response.headers.get('content-length');

        if (contentLength) {
            const sizeInBytes = parseInt(contentLength, 10);
            const sizeInKB = sizeInBytes / 1024;
            return parseFloat(sizeInKB).toFixed(2); // Returns size in KB
        } else {
            console.log('Content-Length header not found');
            return 0;
        }
    } catch (error) {
        console.error('Error fetching file size:', error);
        return 0;
    }
};
