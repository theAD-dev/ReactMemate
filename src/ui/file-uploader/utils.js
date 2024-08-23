import { nanoid } from "nanoid";

export function base64ToBlob(base64, mime) {
    const byteString = atob(base64.split(',')[1]);
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
    }
    return new Blob([ab], { type: mime });
}

export const base64ToFile = (base64String) => {
    const photoHintId = nanoid(6);
    const fileName = `${photoHintId}.jpg`;
    const byteString = atob(base64String.split(',')[1]); // Decode Base64 string
    const mimeString = base64String.split(',')[0].split(':')[1].split(';')[0]; // Get MIME type

    const arrayBuffer = new ArrayBuffer(byteString.length);
    const uint8Array = new Uint8Array(arrayBuffer);

    for (let i = 0; i < byteString.length; i++) {
        uint8Array[i] = byteString.charCodeAt(i);
    }

    return new File([uint8Array], fileName, { type: mimeString });
};