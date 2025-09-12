import { useEffect, useMemo, useState } from 'react';
import { listFormsByOrganization, deleteForm } from '../temp/api';
import '../temp/temp-form-builder.css';

const DEFAULT_ORG_ID = 5;

export default function FormsList({ organizationId = DEFAULT_ORG_ID }) {
  const [orgId, setOrgId] = useState(String(organizationId || DEFAULT_ORG_ID));
  const [forms, setForms] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchData = async (id) => {
    setLoading(true);
    setError('');
    try {
      const data = await listFormsByOrganization(id);
      // API returns an array (per backend impl)
      const normalized = Array.isArray(data) ? data : (data?.results || []);
      setForms(normalized);
    } catch (e) {
      setError(e.message || 'Failed to load forms');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(orgId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleReload = () => fetchData(orgId);
  const handleOrgChange = (e) => setOrgId(e.target.value);
  const handleGo = () => fetchData(orgId);

  const copyEmbed = async (formId) => {
    const host = process.env.REACT_APP_URL || window.location.origin;
    const snippet = `<script src="${host}/astatic/inquiries/embed.js" data-form-id="${formId}"></` + `script>`;
    try {
      await navigator.clipboard.writeText(snippet);
      alert('Embed code copied to clipboard');
    } catch (_) {
      // Fallback
      const ta = document.createElement('textarea');
      ta.value = snippet;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand && document.execCommand('copy');
      document.body.removeChild(ta);
      alert('Embed code copied to clipboard');
    }
  };

  const handleDelete = async (formId) => {
    if (!window.confirm('Are you sure you want to delete this form?')) return;
    try {
      await deleteForm(formId);
      alert('Form deleted successfully');
      fetchData(orgId); // refresh list
    } catch (e) {
      alert(e.message || 'Failed to delete form');
    }
  };

  return (
    <div className="mf-builder">{/* reuse base styles */}
      <div className="container">
        <header>
          <h1>Forms</h1>
        </header>

        <div className="editor-actions" style={{gap:12}}>
          <div className="form-field" style={{display:'flex',alignItems:'center',gap:8,margin:0}}>
            <label htmlFor="org-id" style={{margin:0}}>Organization ID</label>
            <input id="org-id" value={orgId} onChange={handleOrgChange} style={{width:120}} />
            <button className="btn" onClick={handleGo}>Load</button>
            <button className="btn" onClick={handleReload}>Reload</button>
            <a className="btn btn-primary" href="/enquiries/form-builder/new">New Form</a>
          </div>
        </div>

        {loading && <p>Loading…</p>}
        {error && <p className="error-message">{error}</p>}

        {!loading && !error && (
          <div className="table-wrap" style={{overflowX:'auto', marginTop:12}}>
            <table className="mf-table" style={{width:'100%',borderCollapse:'collapse'}}>
              <thead>
                <tr>
                  <th style={{textAlign:'center',padding:'8px 10px',borderBottom:'1px solid #e5e7eb'}}>ID</th>
                  <th style={{textAlign:'center',padding:'8px 10px',borderBottom:'1px solid #e5e7eb'}}>Form</th>
                  <th style={{textAlign:'center',padding:'8px 10px',borderBottom:'1px solid #e5e7eb'}}>Domain</th>
                  <th style={{textAlign:'center',padding:'8px 10px',borderBottom:'1px solid #e5e7eb'}}>Created At</th>
                  <th style={{textAlign:'center',padding:'8px 10px',borderBottom:'1px solid #e5e7eb'}}>Inquiries</th>
                  <th style={{textAlign:'center',padding:'8px 10px',borderBottom:'1px solid #e5e7eb'}}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {forms.length === 0 && (
                  <tr>
                    <td colSpan={6} style={{padding:'12px'}}>No forms found for this organization.</td>
                  </tr>
                )}
                {forms.map((f) => (
                  <tr key={f.id}>
                    <td style={{padding:'8px 10px'}}>{f.id}</td>
                    <td style={{padding:'8px 10px'}}>{f.title || '(untitled)'}</td>
                    <td style={{padding:'8px 10px'}}>{f.domain || '-'}</td>
                    <td style={{padding:'8px 10px'}}>{f.created ? new Date(f.created).toLocaleString() : '-'}</td>
                    <td style={{padding:'8px 10px'}}>{f.inquiries_count || 0}</td>
                    <td style={{padding:'8px 10px',display:'flex',gap:8}}>
                      <button className="btn btn-secondary" onClick={() => copyEmbed(f.id)}>Copy Embed</button>
                      <a className="btn btn-secondary" href={`/enquiries/form-builder/new?id=${f.id}`}>Edit</a>
                      <a className="btn btn-secondary" href={`/enquiries/form-builder/inquiries?id=${f.id}`}>Inquiries</a>
                      <button className="btn" style={{ backgroundColor: '#f87171', color: 'white' }} onClick={() => handleDelete(f.id)}>Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}