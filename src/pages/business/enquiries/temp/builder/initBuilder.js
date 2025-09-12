// src/builder/initBuilder.js
import { saveFormToApi, updateFormToApi } from '../api';

export function initBuilder({ defaultOrgId, getDefaultCss, initialForm = null }) {
    // Guard against double binding in React StrictMode (dev) or accidental re-calls
  if (typeof window !== 'undefined') {
    if (window.__INQ_BUILDER_INITED__) {
      return; // already initialized, skip attaching listeners again
    }
    window.__INQ_BUILDER_INITED__ = true;
  }
  // Scope all DOM lookups to the builder root to avoid collisions with host app
const root = document.querySelector('.mf-builder') || document;

  // Core nodes
const preview = root.querySelector('#preview-container');
const properties = root.querySelector('#properties-container');
const cssTextarea = root.querySelector('#form_style');
const previewBtn = root.querySelector('#preview-btn');
const saveBtn = root.querySelector('#save-btn');
const previewModal = root.querySelector('#preview-modal');
const previewFormContainer = root.querySelector('#preview-form-container');

  // Fill default CSS only when empty
  if (cssTextarea && !cssTextarea.value && typeof getDefaultCss === 'function') {
    const css = getDefaultCss();
    if (css) cssTextarea.value = css;
  }

  // Internal state (must exist before any hydration uses it)
  let fieldCounter = 1;
  let fieldsData = {};
  let currentField = null;
  // If we're editing an existing form, keep its id so subsequent saves PATCH instead of POST
  let currentFormId = initialForm?.id || null;

  // If an existing form was passed in, hydrate all UI
  if (initialForm) {
    try {
      hydrateInitialForm(initialForm);
    } catch (err) {
      console.error('Hydration failed:', err);
    }
  }

  // Field palette (delegated to support dragging from child elements reliably)
  const palette = root.querySelector('.field-types');
  if (palette) {
    palette.addEventListener('dragstart', (e) => {
      const item = e.target && e.target.closest('.field-type');
      if (!item) return;
      try {
        if (e.dataTransfer) {
          e.dataTransfer.effectAllowed = 'copy';
          // Set both a standard and a custom MIME so all browsers carry data
          e.dataTransfer.setData('text/plain', item.dataset.type);
          e.dataTransfer.setData('application/x-field-type', item.dataset.type);
        }
      } catch(_) {}
    }, true);
  }

  // Drop target
  preview.addEventListener('dragenter', (e) => {
    e.preventDefault();
    preview.classList.add('dragover');
  });
  preview.addEventListener('dragover', (e) => {
    e.preventDefault();
    if (e.dataTransfer) e.dataTransfer.dropEffect = 'copy';
  });
  preview.addEventListener('dragleave', (e) => {
    if (!preview.contains(e.relatedTarget)) {
      preview.classList.remove('dragover');
    }
  });
  preview.addEventListener('drop', (e) => {
    e.preventDefault();
    preview.classList.remove('dragover');
    let type = '';
    try {
      type = (e.dataTransfer && (
        e.dataTransfer.getData('application/x-field-type') ||
        e.dataTransfer.getData('text/plain') ||
        e.dataTransfer.getData('field-type')
      )) || '';
    } catch(_) {}
    if (!type) return;
    addField(type);
  });

  function addField(type) {
    const id = `field-${fieldCounter++}`;
    const el = document.createElement('div');
    el.className = 'preview-field';
    el.id = id;
    el.dataset.type = type;
    el.innerHTML = getTemplate(type) + actionBar();
    preview.appendChild(el);

    fieldsData[id] = seedDataFor(type);
    wireField(el, id, type);
    selectField(id, type);
    updateMoveButtons();
  }

  function getTemplate(type) {
    const map = {
      text: `<div class="form-field"><label>Text Field</label><input type="text" placeholder="Enter text"></div>`,
      email:`<div class="form-field"><label>Email Field</label><input type="email" placeholder="Enter email"></div>`,
      number:`<div class="form-field"><label>Number Field</label><input type="number" placeholder="Enter number"></div>`,
      phone:`<div class="form-field"><label>Phone Field</label><input type="tel" placeholder="Enter phone"></div>`,
      textarea:`<div class="form-field"><label>Text Area</label><textarea placeholder="Enter text"></textarea></div>`,
      select:`<div class="form-field"><label>Dropdown</label><select><option value="">Select an option</option><option>Option 1</option><option>Option 2</option></select></div>`,
      multiselect:`<div class="form-field"><label>Multi Select</label><select multiple><option>Option 1</option><option>Option 2</option></select></div>`,
      radio:`<div class="form-field"><label>Radio Buttons</label><div class="radio-field"><input id="r1" type="radio" name="rg"><label for="r1">Option 1</label></div><div class="radio-field"><input id="r2" type="radio" name="rg"><label for="r2">Option 2</label></div></div>`,
      checkbox:`<div class="form-field"><div class="checkbox-field"><input id="cb" type="checkbox"><label for="cb">Checkbox</label></div></div>`,
      multicheckbox:`<div class="form-field"><label>Multi Checkbox</label><div class="checkbox-field"><input id="m1" type="checkbox"><label for="m1">Option 1</label></div><div class="checkbox-field"><input id="m2" type="checkbox"><label for="m2">Option 2</label></div></div>`,
      date:`<div class="form-field"><label>Date</label><input type="date"></div>`,
      time:`<div class="form-field"><label>Time</label><input type="time"></div>`,
      url:`<div class="form-field"><label>Website URL</label><input type="url" placeholder="https://example.com"></div>`,
      html:`<div class="form-field html-content"><p>HTML Content</p></div>`,
      consent:`<div class="form-field"><div class="checkbox-field"><input id="consent" type="checkbox"><label for="consent">I agree to the terms and conditions</label></div></div>`,
      submit_button:`<div class="form-field"><button type="submit" class="btn-primary">Submit</button></div>`
    };
    return map[type] || map.text;
  }

  function actionBar() {
    return `
      <div class="field-actions">
        <button class="move-field-up" title="Up">↑</button>
        <button class="move-field-down" title="Down">↓</button>
        <button class="edit-field" title="Edit">✎</button>
        <button class="remove-field" title="Remove">✖</button>
      </div>`;
  }

  function seedDataFor(type) {
    const base = {
      type,
      field_type: type,
      label: `${capitalize(type)} Field`,
      name: `${type}_field`,
      required: false,
      placeholder: `Enter ${type}`,
      maxlength: '',
      regex: '',
      error_message: '',
      options: []
    };
    if (['select','radio','multicheckbox','multiselect'].includes(type)) {
      base.options = ['Option 1','Option 2'];
    }
    if (type === 'submit_button') {
      base.button_text = 'Submit';
      base.custom_style = '';
    }
    if (type === 'html') {
      base.html = '<p>HTML Content</p>';
    }
    if (type === 'consent') {
      base.label = 'I agree to the terms and conditions';
    }
    return base;
  }

  function wireField(el, id, type) {
    el.addEventListener('click', e => {
      if (!e.target.closest('.field-actions')) selectField(id, type);
    });
    el.querySelector('.remove-field').addEventListener('click', () => {
      delete fieldsData[id];
      el.remove();
      updateMoveButtons();
    });
    el.querySelector('.move-field-up').addEventListener('click', e => {
      e.stopPropagation();
      if (el.previousElementSibling) el.parentNode.insertBefore(el, el.previousElementSibling);
      reindex();
      updateMoveButtons();
    });
    el.querySelector('.move-field-down').addEventListener('click', e => {
      e.stopPropagation();
      const next = el.nextElementSibling;
      if (next) el.parentNode.insertBefore(next, el);
      reindex();
      updateMoveButtons();
    });
    el.querySelector('.edit-field').addEventListener('click', e => {
      e.stopPropagation();
      selectField(id, type);
    });
  }

  function reindex() {
    const newOrder = {};
    preview.querySelectorAll('.preview-field').forEach(node => {
      newOrder[node.id] = fieldsData[node.id];
    });
    fieldsData = newOrder;
    updateMoveButtons();
  }

  function updateMoveButtons(){
    const nodes = Array.from(preview.querySelectorAll('.preview-field'));
    nodes.forEach((node, idx) => {
      const upBtn = node.querySelector('.move-field-up');
      const downBtn = node.querySelector('.move-field-down');
      if (upBtn) upBtn.disabled = (idx === 0);
      if (downBtn) downBtn.disabled = (idx === nodes.length - 1);
    });
  }

  function selectField(id, type) {
    currentField = id;
    const data = fieldsData[id];

    properties.innerHTML = `
      <h2>Field Properties</h2>
      <div class="property-group">
        <h3>Basic</h3>
        <label>Label <input id="fp-label" value="${escapeHtml(data.label)}"></label>
        ${(['text','email','number','phone','url','textarea'].includes(type) ?
          `<label>Placeholder <input id="fp-ph" value="${escapeHtml(data.placeholder||'')}"></label>` : '')}
        ${(['text','email','number','phone','url','textarea'].includes(type) ?
          `<label>Max Length <input id="fp-max" type="number" value="${escapeAttr(data.maxlength||'')}"></label>` : '')}
        ${(['text','email','number','phone','url','textarea'].includes(type) ? `
          <div class="property-subtle">
            <label>Validation Pattern (Regex)
              <input id="fp-regex" placeholder="e.g. ^[A-Za-z]{3,}$" value="${escapeAttr(data.regex||'')}">
            </label>
            <p class="help-text">Optional. Add a regex pattern for validation.</p>
            <label>Custom Error Message
              <input id="fp-errmsg" placeholder="e.g. Please enter only letters" value="${escapeAttr(data.error_message||'')}">
            </label>
            <p class="help-text">Optional. Custom message to show when validation fails.</p>
          </div>` : '')}
        <label class="inline"><input type="checkbox" id="fp-req" ${data.required ? 'checked':''}> <span>Required</span></label>
      </div>
      ${(['select','radio','multicheckbox','multiselect'].includes(type) ? `
        <div class="property-group">
          <h3>Options</h3>
          <div id="fp-options"></div>
          <button id="fp-addopt" type="button">Add Option</button>
        </div>` : '')}
      ${type === 'html' ? `
        <div class="property-group">
          <h3>HTML</h3>
          <textarea id="fp-html" rows="5">${escapeHtml(data.html || '')}</textarea>
        </div>` : ''}
      ${type === 'submit_button' ? `
        <div class="property-group">
          <h3>Button</h3>
          <label>Text <input id="fp-btntext" value="${escapeHtml(data.button_text || 'Submit')}"></label>
          <label>Style (CSS) <textarea id="fp-btncss" rows="3">${escapeHtml(data.custom_style || '')}</textarea></label>
        </div>` : ''}
      <div class="property-group"><button id="fp-apply" type="button">Update Field</button></div>
    `;

    if (['select','radio','multicheckbox','multiselect'].includes(type)) {
      const wrap = root.querySelector('#fp-options');
      wrap.innerHTML = '';
      (data.options || []).forEach((opt, i) => {
        const row = document.createElement('div');
        row.innerHTML = `<input data-i="${i}" value="${escapeAttr(opt)}"> <button data-i="${i}" class="rm" type="button">✖</button>`;
        wrap.appendChild(row);
      });
      root.querySelector('#fp-addopt').onclick = () => {
        data.options.push(`Option ${data.options.length + 1}`);
        selectField(id, type);
      };
      wrap.addEventListener('click', e => {
        if (e.target.classList.contains('rm')) {
          const i = +e.target.dataset.i;
          data.options.splice(i,1);
          selectField(id, type);
        }
      });
      wrap.addEventListener('input', e => {
        if (e.target.matches('input[data-i]')) {
          data.options[+e.target.dataset.i] = e.target.value;
        }
      });
    }

    root.querySelector('#fp-apply').onclick = () => {
      data.label = val('#fp-label');
      if (root.querySelector('#fp-name')) data.name = val('#fp-name');
      if (root.querySelector('#fp-ph')) data.placeholder = val('#fp-ph');
      if (root.querySelector('#fp-max')) data.maxlength = val('#fp-max');
      if (root.querySelector('#fp-regex')) data.regex = val('#fp-regex');
      if (root.querySelector('#fp-errmsg')) data.error_message = val('#fp-errmsg');
      data.required = root.querySelector('#fp-req').checked;
      if (type === 'html') data.html = val('#fp-html');
      if (type === 'submit_button') {
        data.button_text = val('#fp-btntext') || 'Submit';
        data.custom_style = val('#fp-btncss') || '';
      }
      // Refresh simple label text in preview
      const host = root.querySelector('#' + id);
      const label = host.querySelector('.form-field > label, .checkbox-field label');
      if (label) label.textContent = data.label;
      alert('Field updated');
    };
  }

  // Preview modal
  previewBtn.addEventListener('click', () => {
    const html = renderPreview(Object.values(fieldsData));
    previewFormContainer.innerHTML = html;
    previewModal.style.display = 'block';
  });
  root.querySelectorAll('.modal-close').forEach(btn => {
    btn.addEventListener('click', () => (btn.closest('.modal').style.display = 'none'));
  });
  // Initial move button state (in case of zero nodes, this is a no-op)
  updateMoveButtons();

  // Seed default first four fields for brand-new forms
  if (!initialForm && preview.querySelectorAll('.preview-field').length === 0) {
    seedDefaultFields();
  }

  function renderPreview(fields) {
    let out = `<form>`;
    fields.forEach(f => {
      const t = f.field_type || f.type;
      if (t === 'html') {
        out += `<div class="form-field html-content">${f.html || ''}</div>`;
        return;
      }
      out += `<div class="form-field ${f.required ? 'required':''}">`;
      if (!['checkbox','consent'].includes(t)) out += `<label>${escapeHtml(f.label || '')}</label>`;
      if (['text','email','number','phone','url','date','time'].includes(t)) {
        const inputType = t === 'phone' ? 'tel' : t;
        out += `<input type="${inputType}" placeholder="${escapeAttr(f.placeholder || '')}" ${f.maxlength ? `maxlength="${f.maxlength}"` : ''} ${f.required ? 'required':''} />`;
      } else if (t === 'textarea') {
        out += `<textarea placeholder="${escapeAttr(f.placeholder || '')}" ${f.required ? 'required':''}></textarea>`;
      } else if (t === 'select') {
        out += `<select ${f.required ? 'required':''}><option value="">${escapeHtml(f.placeholder || 'Select an option')}</option>${(f.options||[]).map(o=>`<option>${escapeHtml(o)}</option>`).join('')}</select>`;
      } else if (t === 'multiselect') {
        out += `<select multiple ${f.required ? 'required':''}>${(f.options||[]).map(o=>`<option>${escapeHtml(o)}</option>`).join('')}</select>`;
      } else if (t === 'radio') {
        out += (f.options||[]).map((o,i)=>`<div class="radio-field"><input type="radio" id="${f.name}-${i}" name="${f.name}"><label for="${f.name}-${i}">${escapeHtml(o)}</label></div>`).join('');
      } else if (t === 'multicheckbox') {
        out += (f.options||[]).map((o,i)=>`<div class="checkbox-field"><input type="checkbox" id="${f.name}-${i}" name="${f.name}[]"><label for="${f.name}-${i}">${escapeHtml(o)}</label></div>`).join('');
      } else if (t === 'checkbox' || t === 'consent') {
        out += `<div class="checkbox-field"><input type="checkbox" id="${f.name}" ${f.required?'required':''}><label for="${f.name}">${escapeHtml(f.label || '')}</label></div>`;
      } else if (t === 'submit_button') {
        out += `<button type="submit" style="${escapeAttr(f.custom_style||'')}">${escapeHtml(f.button_text || 'Submit')}</button>`;
      }
      out += `</div>`;
    });
    // safety submit button in preview
    if (!fields.some(f => (f.type||f.field_type) === 'submit_button')) {
      out += `<div class="form-field"><button type="submit">Submit</button></div>`;
    }
    out += `</form>`;
    return out;
  }

  // Save -> API
  saveBtn.addEventListener('click', async () => {
    // Enforce Google reCAPTCHA site key required
    const siteKeyEl = root.querySelector('#form-recaptcha-key');
    if (!siteKeyEl || !siteKeyEl.value.trim()) {
      alert('Google reCAPTCHA site key is required');
      return;
    }
    // Enforce Google reCAPTCHA secret key required
    const secretKeyEl = root.querySelector('#form-recaptcha-secret');
    if (!secretKeyEl || !secretKeyEl.value.trim()) {
      alert('Google reCAPTCHA secret key is required');
      return;
    }

    const payload = buildApiPayload();
    try {
      const json = currentFormId
      ? await updateFormToApi(currentFormId, payload)
      : await saveFormToApi(payload);
      
      // If we just created, remember the id so next saves will update
      if (!currentFormId && json && json.id) {
        currentFormId = json.id;
      }

      // Build embed code and show modal
      const embedCode = `<script src="${process.env.REACT_APP_URL}/astatic/inquiries/embed.js" data-form-id="${json?.id}"></` + `script>`;
      const embedModal = root.querySelector('#embed-modal');
      const snippetEl = root.querySelector('#embed-snippet');
      const copyBtn = root.querySelector('#copy-embed-btn');
      const closeBtn = root.querySelector('#close-embed-btn');
      const xBtn = embedModal ? embedModal.querySelector('[data-close-embed]') : null;

      if (snippetEl) snippetEl.value = embedCode;
      if (closeBtn) closeBtn.disabled = true; // must copy before closing
      if (embedModal) embedModal.style.display = 'block';

      const doCopy = async () => {
        try {
          await navigator.clipboard.writeText(embedCode);
        } catch (_) {
          // Fallback for older browsers
          if (snippetEl && snippetEl.select) {
            snippetEl.select();
            document.execCommand && document.execCommand('copy');
          }
        }
        if (copyBtn) copyBtn.textContent = 'Copied!';
        if (closeBtn) closeBtn.disabled = false;
      };

      if (copyBtn) copyBtn.onclick = doCopy;
      if (closeBtn) closeBtn.onclick = () => { if (embedModal) embedModal.style.display = 'none'; };
      if (xBtn) xBtn.onclick = () => { if (closeBtn && !closeBtn.disabled && embedModal) embedModal.style.display = 'none'; };

    } catch (e) {
      alert(`Failed to save: ${e.message}`);
    }
  });

  function buildApiPayload() {
    const fields = Object.values(fieldsData).map((f, idx) => ({
      id: f._id || undefined,    // include id when editing
      name: f.name || `${f.type}_field`,
      label: f.label || capitalize(f.type),
      placeholder: f.placeholder || '',
      field_type: f.field_type || f.type,
      required: !!f.required,
      max_length: f.maxlength || null,
      error_message: f.error_message || null,
      options: Array.isArray(f.options) ? f.options : undefined,
      regex: f.regex || undefined,
      html: f.type === 'html' ? f.html : undefined,
      button_text: f.type === 'submit_button' ? (f.button_text || undefined) : undefined,
      custom_style: f.type === 'submit_button' ? (f.custom_style || undefined) : undefined,
      order: idx
    }));

    const get = id => (root.querySelector('#' + id)?.value || '').trim();

    const payload = {
      organization: defaultOrgId, // hard default as requested
      title: get('form-title'),
      domain: get('form-domain'),
      submit_to: get('form-submit-to'),
      submit_from: get('form-submit-from'),
      cc_email: get('form-cc-email'),
      bcc_email: get('form-bcc-email'),
      thank_you_message: get('form-thank-you') || 'Thank you for reaching out. We’ll get back to you soon!',
      error_message: get('form-error-message') || 'Something went wrong. Please try again later.',
      submit_button_label: get('form-submit-label') || 'Submit',
      custom_css: cssTextarea?.value ?? '',
      recaptcha_site_key: get('form-recaptcha-key'),
      recaptcha_secret_key: get('form-recaptcha-secret'),
      fields
    };

    const redirect = get('form-redirect-url');
    if (redirect) payload.redirect_url = redirect;
    return payload;
  }

  // helpers
  function val(sel){ return root.querySelector(sel)?.value || ''; }
  function capitalize(s){ return (s||'').charAt(0).toUpperCase() + (s||'').slice(1); }
  function escapeHtml(s=''){ return s.replace(/[&<>"']/g,c=>({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;', "'":'&#39;' }[c])); }
  function escapeAttr(s=''){ return escapeHtml(s).replace(/"/g,'&quot;'); }

  function seedDefaultFields() {
    const defaults = [
      { field_type: 'text',     name: 'name',    label: 'Name',    placeholder: 'Enter your name',    order: 0 },
      { field_type: 'email',    name: 'email',   label: 'Email',   placeholder: 'Enter your email',   order: 1 },
      { field_type: 'phone',    name: 'phone',   label: 'Phone',   placeholder: 'Enter your phone',   order: 2 },
      { field_type: 'textarea', name: 'message', label: 'Message', placeholder: 'Type your message',  order: 3 },
    ];
    defaults.forEach(addFieldFromData);
  }

  // ----- Hydration helpers -----
  function setVal(id, v) {
    const el = document.getElementById(id);
    if (el) el.value = v ?? '';
  }

  function hydrateInitialForm(form) {
    // right-column details
    setVal('form-title', form.title);
    setVal('form-domain', form.domain);
    setVal('form-submit-to', form.submit_to);
    setVal('form-submit-from', form.submit_from);
    setVal('form-cc-email', form.cc_email);
    setVal('form-bcc-email', form.bcc_email);
    setVal('form-thank-you', form.thank_you_message);
    setVal('form-error-message', form.error_message);
    setVal('form-submit-label', form.submit_button_label || 'Submit');
    setVal('form-redirect-url', form.redirect_url);
    setVal('form-recaptcha-key', form.recaptcha_site_key);
    setVal('form-recaptcha-secret', form.recaptcha_secret_key);

    // custom css
    if (cssTextarea && form.custom_css) {
      cssTextarea.value = form.custom_css;
    }

    // fields canvas
    const fields = (form.fields || []).slice().sort((a,b)=>(a.order ?? 0)-(b.order ?? 0));
    preview.innerHTML = '';
    fieldsData = {};
    fieldCounter = 1;

    fields.forEach(addFieldFromData);
    updateMoveButtons();
  }

  function addFieldFromData(f) {
    const type = f.field_type || f.type || 'text';
    const id = `field-${fieldCounter++}`;
    const el = document.createElement('div');
    el.className = 'preview-field';
    el.id = id;
    el.dataset.type = type;
    el.innerHTML = getTemplate(type) + actionBar();
    preview.appendChild(el);

    const data = {
      type,
      field_type: type,
      _id: f.id,
      label: f.label ?? `${capitalize(type)} Field`,
      name: f.name ?? `${type}_field`,
      required: !!f.required,
      placeholder: f.placeholder ?? '',
      maxlength: f.max_length ?? f.maxlength ?? '',
      regex: f.regex ?? '',
      error_message: f.error_message ?? '',
      options: Array.isArray(f.options) ? [...f.options] : [],
      html: f.html ?? undefined,
      button_text: f.button_text ?? undefined,
      custom_style: f.custom_style ?? undefined,
    };

    fieldsData[id] = data;
    wireField(el, id, type);

    const labelEl = el.querySelector('.form-field > label, .checkbox-field label');
    if (labelEl && data.label) labelEl.textContent = data.label;

    if (['text','email','number','phone','url','date','time'].includes(type)) {
      const input = el.querySelector('input');
      if (input) {
        if (type === 'phone') input.type = 'tel';
        if (data.placeholder) input.placeholder = data.placeholder;
        if (data.maxlength)  input.maxLength  = parseInt(data.maxlength, 10);
        if (data.required)   input.required   = true;
      }
    } else if (type === 'textarea') {
      const ta = el.querySelector('textarea');
      if (ta) {
        if (data.placeholder) ta.placeholder = data.placeholder;
        if (data.maxlength)   ta.maxLength   = parseInt(data.maxlength, 10);
        if (data.required)    ta.required    = true;
      }
    } else if (type === 'select') {
      const sel = el.querySelector('select');
      if (sel) {
        sel.innerHTML =
          `<option value="">${data.placeholder || 'Select an option'}</option>` +
          (data.options || []).map(o => `<option>${escapeHtml(o)}</option>`).join('');
        if (data.required) sel.required = true;
      }
    } else if (type === 'multiselect') {
      const sel = el.querySelector('select');
      if (sel) {
        sel.multiple = true;
        sel.innerHTML = (data.options || []).map(o => `<option>${escapeHtml(o)}</option>`).join('');
        if (data.required) sel.required = true;
      }
    } else if (type === 'radio') {
      const wrap = el.querySelector('.form-field');
      if (wrap) {
        wrap.querySelectorAll('.radio-field').forEach(n => n.remove());
        (data.options || []).forEach((o,i) => {
          const div = document.createElement('div');
          div.className = 'radio-field';
          const rid = `${data.name}-${i}`;
          div.innerHTML = `<input id="${rid}" type="radio" name="${escapeHtml(data.name)}">
                           <label for="${rid}">${escapeHtml(o)}</label>`;
          wrap.appendChild(div);
        });
      }
    } else if (type === 'multicheckbox') {
      const wrap = el.querySelector('.form-field');
      if (wrap) {
        wrap.querySelectorAll('.checkbox-field').forEach(n => n.remove());
        (data.options || []).forEach((o,i) => {
          const div = document.createElement('div');
          div.className = 'checkbox-field';
          const cid = `${data.name}-${i}`;
          div.innerHTML = `<input id="${cid}" type="checkbox" name="${escapeHtml(data.name)}[]">
                           <label for="${cid}">${escapeHtml(o)}</label>`;
          wrap.appendChild(div);
        });
      }
    } else if (type === 'checkbox' || type === 'consent') {
      const lab = el.querySelector('.checkbox-field label');
      if (lab && data.label) lab.textContent = data.label;
    } else if (type === 'html') {
      const block = el.querySelector('.html-content');
      if (block) block.innerHTML = data.html || '<p></p>';
    } else if (type === 'submit_button') {
      const btn = el.querySelector('button');
      if (btn) {
        btn.textContent = data.button_text || 'Submit';
        if (data.custom_style) btn.setAttribute('style', data.custom_style);
      }
    }

    selectField(id, type);
  }
}