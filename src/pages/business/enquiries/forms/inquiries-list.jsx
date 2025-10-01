import React, { useEffect, useMemo, useState } from 'react';
import { Button } from 'react-bootstrap';
import { Collection, Gear, InputCursorText, WindowSidebar } from 'react-bootstrap-icons';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import clsx from 'clsx';
import { useDebounce } from 'primereact/hooks';
import style from './forms.module.scss';
import { listFormSubmissions } from '../form-builder/api';
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
  const [selected, setSelected] = useState(null);
  const [inputValue, debouncedValue, setInputValue] = useDebounce('', 400);
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
      <Helmet>
        <title>MeMate - Enquiries</title>
      </Helmet>
      <div className={`topbar ${selected?.length ? style.active : ''}`} style={{ padding: '4px 32px 4px 23px', position: 'relative', height: '48px' }}>
        <div className='left-side d-flex align-items-center' style={{ gap: '16px' }}>
          <div className="searchBox" style={{ position: 'relative' }}>
            <div style={{ position: 'absolute', top: '2px', left: '6px' }}>
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M14.6777 12.9299C15.6661 11.5841 16.25 9.92275 16.25 8.125C16.25 3.63769 12.6123 0 8.125 0C3.63769 0 0 3.63769 0 8.125C0 12.6123 3.63769 16.25 8.125 16.25C9.92323 16.25 11.585 15.6658 12.9309 14.6769L12.9299 14.6777C12.9667 14.7277 13.0078 14.7756 13.053 14.8208L17.8661 19.6339C18.3543 20.122 19.1457 20.122 19.6339 19.6339C20.122 19.1457 20.122 18.3543 19.6339 17.8661L14.8208 13.053C14.7756 13.0078 14.7277 12.9667 14.6777 12.9299ZM15 8.125C15 11.922 11.922 15 8.125 15C4.32804 15 1.25 11.922 1.25 8.125C1.25 4.32804 4.32804 1.25 8.125 1.25C11.922 1.25 15 4.32804 15 8.125Z" fill="#98A2B3" />
              </svg>
            </div>
            <input type="text" placeholder="Search" value={inputValue} onChange={(e) => setInputValue(e.target.value)} className="border search-resource" style={{ borderRadius: '4px', width: '184px', border: '1px solid #D0D5DD', color: '#424242', paddingLeft: '36px', fontSize: '14px', height: '32px' }} />
          </div>
        </div>
        <div className="featureName d-flex align-items-center gap-3" style={{ position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%, -50%)' }}>
          <Link to={"/enquiries"} className={clsx('d-flex align-items-center px-2 py-1', style.subMenuLink)}>
            <span className={style.topBarText}>All</span>
          </Link>

          <Link to={"/enquiries"} className={clsx('d-flex align-items-center px-2 py-1', style.subMenuLink)}>
            <WindowSidebar color='#9E77ED' size={16} className='me-2' />
            <span className={style.topBarText}>Web</span>
          </Link>

          <Link to={"/enquiries"} className={clsx('d-flex align-items-center px-2 py-1', style.subMenuLink)}>
            <InputCursorText color='#F79009' size={16} className='me-2' />
            <span className={style.topBarText}>Form</span>
          </Link>

          <Link to={"/enquiries"} className={clsx('d-flex align-items-center px-2 py-1', style.subMenuLink)}>
            <Collection color='#084095' size={16} className='me-2' />
            <span className={style.topBarText}>Fb/In</span>
          </Link>
        </div>
        <div className="right-side d-flex align-items-center" style={{ gap: '8px' }}>
          <Link to={"/enquiries/form-builder/new"}><Button className='solid-button py-1 font-14'>New</Button></Link>
          <Link to={"/enquiries/forms"}><Button className='info-button py-1 font-14'>Set Up <Gear color='#158ECC' size={20} /></Button></Link>
        </div>
      </div>


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
                    <div className="mf-avatar">{initials(pluck(s, ['name', 'full_name']) || 'U')}</div>
                    <span>{pluck(s, ['name', 'full_name']) || 'Unknown'}</span>
                  </div>
                </td>
                <td className="mf-ellipsis" title={pluck(s, ['message', 'note', 'comments'])}>
                  {pluck(s, ['message', 'note', 'comments']) || '—'}
                </td>
                <td>{formatPhone(pluck(s, ['phone', 'mobile', 'tel']))}</td>
                <td className="mf-ellipsis">{pluck(s, ['email'])}</td>
                <td>
                  <div className="mf-cell-name muted">
                    <div className="mf-avatar small">{initials((s.assignee_name) || '')}</div>
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
  return valid.toLocaleDateString(undefined, { day: '2-digit', month: 'short', year: 'numeric' });
}

function formatPhone(p) { return p || ''; }
