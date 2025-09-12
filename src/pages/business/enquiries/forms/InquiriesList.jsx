import React, { useEffect, useMemo, useState } from 'react';
import { listFormSubmissions } from '../temp/api';

/**
 * InquiriesList
 * -----------------
 * Shows submissions for a single form (by formId).
 *
 * API expected: GET /api/v1/inquiries/form/:id/submissions/
 * Returns an array of submissions. Each submission may contain a flat map
 * or an array of { name, label, value } items. We defensively extract
 * "name", "email", "phone", and a generic message field.
 *
 * This component is self‑contained and scoped with a unique root class
 * to avoid CSS collisions with the host app.
 */
export default function InquiriesList() {
  // Try to get formId from query string (?id=123) or route param (/forms/:id)
  const url = typeof window !== 'undefined' ? new URL(window.location.href) : null;
  const qsId = url ? url.searchParams.get('id') : null;
  const pathMatch = url?.pathname.match(/forms\/(\d+)/);
  const initialFormId = pathMatch?.[1] || qsId || '';

  const [formId, setFormId] = useState(initialFormId);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [items, setItems] = useState([]);
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState('All'); // All | Web | Form | Fb/In (placeholder)

  const loadedForId = React.useRef(new Set());

  useEffect(() => {
    if (!formId) return;
    // Prevent double-fetch on mount in StrictMode and repeated ids
    if (loadedForId.current.has(formId)) return;
    loadedForId.current.add(formId);
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formId]);

  async function load() {
    setError('');
    setLoading(true);
    try {
      const data = await listFormSubmissions(formId);
      setItems(Array.isArray(data) ? data : (data?.results || []));
    } catch (e) {
      setError(e.message || 'Failed to load');
    } finally {
      setLoading(false);
    }
  }

  // Extract common fields from each submission payload
  function pluck(sub, keys) {
    if (!sub) return '';
    // If backend gives array of fields
    if (Array.isArray(sub.fields)) {
      const map = {};
      sub.fields.forEach(f => {
        const key = (f.name || f.label || '').toLowerCase();
        map[key] = f.value ?? f.answer ?? '';
      });
      for (const k of keys) {
        const hit = map[k];
        if (hit) return hit;
      }
      // try contains (e.g., "message", "note")
      for (const key in map) {
        if (keys.some(k => key.includes(k))) return map[key];
      }
      return '';
    }
    // Else if backend gives plain dict
    const dict = sub.payload || sub.data || sub || {};
    for (const k of keys) {
      if (dict[k] != null) return dict[k];
    }
    // last resort: first matching contains
    const first = Object.keys(dict).find(k => keys.some(n => k.toLowerCase().includes(n)));
    return first ? dict[first] : '';
  }

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return items;
    return items.filter((s) => {
      const hay = [
        pluck(s, ['name', 'full_name']),
        pluck(s, ['email']),
        pluck(s, ['phone', 'mobile', 'tel']),
        pluck(s, ['message', 'note', 'comments'])
      ].join(' ').toLowerCase();
      return hay.includes(q);
    });
  }, [items, search]);

  return (
    <div className="mf-inquiries-page">
      <div className="mf-toolbar">
        <div className="mf-toolbar-left">
          <input
            className="mf-input"
            placeholder="Form ID"
            value={formId}
            onChange={(e) => setFormId(e.target.value)}
            style={{ width: 120 }}
          />
          <button className="mf-btn" onClick={load} disabled={!formId || loading}>Load</button>
          <button className="mf-btn ghost" onClick={() => setSearch('')}>Reload</button>
        </div>
        <div className="mf-toolbar-mid">
          <input
            className="mf-search"
            placeholder="Search"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          <div className="mf-tabs">
            {['All','Web','Form','Fb/In'].map(t => (
              <button key={t} className={`mf-tab ${activeTab===t?'active':''}`} onClick={()=>setActiveTab(t)}>{t}</button>
            ))}
          </div>
        </div>
        <div className="mf-toolbar-right">
          <button className="mf-btn primary" disabled>New</button>
          <button className="mf-btn ghost" disabled>Set Up</button>
        </div>
      </div>

      {error && <div className="mf-error">{error}</div>}

      <div className="mf-table-wrap">
        <table className="mf-table">
          <thead>
            <tr>
              <th>Lead Source</th>
              <th>Name</th>
              <th>Message</th>
              <th>Phone</th>
              <th>Email</th>
              <th>Assign To</th>
              <th>Spam</th>
              <th>No Go</th>
              <th>Move to Quote</th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr><td colSpan={9} className="mf-empty">Loading…</td></tr>
            )}
            {!loading && filtered.length === 0 && (
              <tr><td colSpan={9} className="mf-empty">No inquiries</td></tr>
            )}
            {!loading && filtered.map((s, idx) => (
              <tr key={s.id || idx}>
                <td>
                  <div className="mf-cell-lead">
                    <span className="mf-chip">{s.source || 'Form'}</span>
                    <div className="mf-subtext">{formatDate(s.created)}</div>
                  </div>
                </td>
                <td>
                  <div className="mf-cell-name">
                    <div className="mf-avatar">{initials(pluck(s,['name','full_name']) || 'U')}</div>
                    <span>{pluck(s,['name','full_name']) || 'Unknown'}</span>
                  </div>
                </td>
                <td className="mf-ellipsis" title={pluck(s,['message','note','comments'])}>
                  {pluck(s,['message','note','comments']) || '—'}
                </td>
                <td>{formatPhone(pluck(s,['phone','mobile','tel']))}</td>
                <td className="mf-ellipsis">{pluck(s,['email'])}</td>
                <td>
                  <div className="mf-cell-name muted">
                    <div className="mf-avatar small">{initials((s.assignee_name)||'')}</div>
                    <span>{s.assignee_name || '—'}</span>
                  </div>
                </td>
                <td className="mf-icon-col">🧹</td>
                <td className="mf-icon-col">🚫</td>
                <td>
                  <button className="mf-btn small">Move</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <style>{`
        .mf-inquiries-page {font-family: Inter, system-ui, -apple-system, Segoe UI, Roboto, sans-serif;}
        .mf-toolbar {display:flex; align-items:center; justify-content:space-between; gap:12px; margin:12px 0;}
        .mf-toolbar-left, .mf-toolbar-right {display:flex; gap:8px; align-items:center;}
        .mf-toolbar-mid {display:flex; align-items:center; gap:12px; flex:1;}
        .mf-input {height:36px; border:1px solid #e5e7eb; border-radius:8px; padding:0 10px; background:#fff;}
        .mf-search {flex:1; height:36px; border:1px solid #e5e7eb; border-radius:18px; padding:0 14px;}
        .mf-tabs {display:flex; gap:6px;}
        .mf-tab {height:30px; padding:0 12px; border-radius:16px; border:1px solid #e5e7eb; background:#fff;}
        .mf-tab.active {background:#eef2ff; border-color:#c7d2fe; color:#3730a3;}
        .mf-btn {height:32px; padding:0 12px; border-radius:8px; border:1px solid #e5e7eb; background:#fff; cursor:pointer;}
        .mf-btn.primary {background:#2563eb; color:#fff; border-color:#2563eb;}
        .mf-btn.ghost {background:transparent;}
        .mf-btn.small {height:28px; padding:0 10px;}
        .mf-error {margin:8px 0; color:#b91c1c;}
        .mf-table-wrap {background:#fff; border:1px solid #e5e7eb; border-radius:12px; overflow:hidden;}
        table.mf-table {width:100%; border-collapse:separate; border-spacing:0;}
        .mf-table th {text-align:left; font-weight:600; font-size:12px; color:#6b7280; padding:12px; background:#f9fafb; border-bottom:1px solid #eef2f7;}
        .mf-table td {padding:14px 12px; border-bottom:1px solid #f3f4f6; vertical-align:middle;}
        .mf-empty {text-align:center; padding:24px; color:#6b7280;}
        .mf-cell-lead {display:flex; flex-direction:column; gap:4px;}
        .mf-chip {display:inline-block; font-size:12px; background:#eef2ff; color:#3730a3; padding:4px 8px; border-radius:999px;}
        .mf-subtext {font-size:11px; color:#9ca3af;}
        .mf-cell-name {display:flex; align-items:center; gap:10px;}
        .mf-cell-name.muted span {color:#6b7280}
        .mf-avatar {width:28px; height:28px; border-radius:50%; background:#e5e7eb; display:flex; align-items:center; justify-content:center; font-size:12px; font-weight:600; color:#374151;}
        .mf-avatar.small {width:22px; height:22px; font-size:10px;}
        .mf-ellipsis {max-width:420px; overflow:hidden; text-overflow:ellipsis; white-space:nowrap;}
        .mf-icon-col {text-align:center;}
      `}</style>
    </div>
  );
}

function initials(name) {
  const s = String(name || '').trim();
  if (!s) return '—';
  const parts = s.split(/\s+/).slice(0, 2);
  return parts.map(p => p[0]?.toUpperCase()).join('');
}

function formatDate(ts) {
  if (!ts) return '';
  // backend sometimes uses epoch seconds; sometimes ISO
  const n = Number(ts);
  const d = Number.isFinite(n) && n > 1e10 ? new Date(n) : new Date(n * 1000);
  const valid = isNaN(d.getTime()) ? new Date(ts) : d;
  if (isNaN(valid.getTime())) return '';
  return valid.toLocaleDateString(undefined, { day:'2-digit', month:'short', year:'numeric' });
}

function formatPhone(p) { return p || ''; }
