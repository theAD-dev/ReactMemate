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

export async function listFormSubmissions(formId, params = {}) {
  if (!formId) throw new Error('formId is required');
  const base = `${process.env.REACT_APP_BACKEND_API_URL}/inquiries/form/${encodeURIComponent(formId)}/submissions/`;

  const qs = new URLSearchParams();
  // Optional filters/pagination if backend supports them
  if (params.page) qs.set('page', params.page);
  if (params.page_size) qs.set('page_size', params.page_size);
  if (params.status != null) qs.set('status', params.status); // e.g., 0,1,2
  if (params.assigned_to) qs.set('assigned_to', params.assigned_to); // user id/email if supported
  if (params.search) qs.set('search', params.search);
  if (params.ordering) qs.set('ordering', params.ordering);

  const url = qs.toString() ? `${base}?${qs.toString()}` : base;
  const res = await fetch(url);
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`API ${res.status}: ${text || res.statusText}`);
  }
  return res.json();
}

export async function deleteForm(id) {
  const base = `${process.env.REACT_APP_BACKEND_API_URL}/inquiries/form/`;
  const url = `${base}${id}/delete/`;
  const res = await fetch(url, { method: 'DELETE' });
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`API ${res.status}: ${text || res.statusText}`);
  }
  return true;
}