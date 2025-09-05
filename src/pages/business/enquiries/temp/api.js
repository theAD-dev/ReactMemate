export const INQUIRY_FORM_API_URL = `${process.env.REACT_APP_BACKEND_API_URL}/inquiries/form/`;

export async function saveFormToApi(payload) {
  const res = await fetch(INQUIRY_FORM_API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`API ${res.status}: ${text || res.statusText}`);
  }
  return res.json();
}