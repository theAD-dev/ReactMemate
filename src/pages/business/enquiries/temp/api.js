export const INQUIRY_FORM_API_URL = `${process.env.REACT_APP_BACKEND_API_URL}/inquiries/form/`;
export const INQUIRY_FORM_DETAIL_URL = `${process.env.REACT_APP_BACKEND_API_URL}/inquiries/form/`;

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

export async function listFormsByOrganization(orgId) {
  const base = `${process.env.REACT_APP_BACKEND_API_URL}/inquiries/forms/`;
  const url = `${base}?organization=${encodeURIComponent(orgId)}`;
  const res = await fetch(url);
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`API ${res.status}: ${text || res.statusText}`);
  }
  return res.json();
}

export async function getFormById(id) {
  const base = `${process.env.REACT_APP_BACKEND_API_URL}/inquiries/form/`;
  const url = `${base}${id}/`;
  const res = await fetch(url);
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`API ${res.status}: ${text || res.statusText}`);
  }
  return res.json();
}

export async function updateFormToApi(id, payload) {
  const base = `${process.env.REACT_APP_BACKEND_API_URL}/inquiries/form/`;
  const url = `${base}${id}/update/`;
  const res = await fetch(url, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`API ${res.status}: ${text || res.statusText}`);
  }
  return res.json();
}