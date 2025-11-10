// src/builder/initBuilder.js
import { toast } from 'sonner';
import { saveFormToApi, updateFormToApi } from '../api';

export function initBuilder({ defaultOrgId, getDefaultCss, initialForm = null }) {
  // Guard against double binding in React StrictMode (dev) or accidental re-calls
  if (typeof window === 'undefined') {
    return;
  }
  // Scope all DOM lookups to the builder root to avoid collisions with host app
  const root = document.querySelector('.mf-builder') || document;

  // Prevent duplicate initialization
  if (root.dataset.builderInitialized === 'true') {
    console.log('Builder already initialized, skipping...');
    return;
  }
  root.dataset.builderInitialized = 'true';

  // Core nodes
  const preview = root.querySelector('#preview-container');
  const properties = root.querySelector('#properties-container');
  const cssTextarea = root.querySelector('#form_style');
  const previewBtn = root.querySelector('#preview-btn');
  const saveBtn = root.querySelector('#save-btn');

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

  // Undo/Redo history
  let history = [];
  let historyIndex = -1;
  const MAX_HISTORY = 50;

  // Save state to history
  function saveHistory() {
    // Remove any future history if we're not at the end
    if (historyIndex < history.length - 1) {
      history = history.slice(0, historyIndex + 1);
    }

    // Save current state
    history.push(JSON.parse(JSON.stringify(fieldsData)));

    // Limit history size
    if (history.length > MAX_HISTORY) {
      history.shift();
    } else {
      historyIndex++;
    }
  }

  // Undo
  function undo() {
    if (historyIndex > 0) {
      historyIndex--;
      restoreFromHistory(history[historyIndex]);
    }
  }

  // Redo
  function redo() {
    if (historyIndex < history.length - 1) {
      historyIndex++;
      restoreFromHistory(history[historyIndex]);
    }
  }

  // Restore state from history
  function restoreFromHistory(state) {
    fieldsData = JSON.parse(JSON.stringify(state));
    rebuildPreview();
  }

  // Rebuild preview from fieldsData
  function rebuildPreview() {
    // Clear preview but keep page header and empty state
    preview.querySelectorAll('.preview-field').forEach(f => f.remove());

    // Rebuild all fields
    Object.keys(fieldsData).forEach(id => {
      const data = fieldsData[id];
      const type = data.field_type || data.type;
      const el = document.createElement('div');
      el.className = 'preview-field';
      el.id = id;
      el.dataset.type = type;
      el.innerHTML = getTemplate(type) + actionBar();
      preview.appendChild(el);
      wireField(el, id, type);
      updateFieldDisplay(el, id, type, data);
    });

    updateMoveButtons();

    // Show/hide empty state
    const emptyState = preview.querySelector('.empty-state');
    if (emptyState) {
      emptyState.style.display = Object.keys(fieldsData).length === 0 ? 'flex' : 'none';
    }
  }

  // Update field display based on data
  function updateFieldDisplay(el, id, type, data) {
    const labelEl = el.querySelector('.form-field > label, .checkbox-field label');
    if (labelEl && data.label) labelEl.textContent = data.label;

    if (['text', 'email', 'number', 'phone', 'url', 'date', 'time'].includes(type)) {
      const input = el.querySelector('input');
      if (input && data.placeholder) input.placeholder = data.placeholder;
    } else if (type === 'textarea') {
      const ta = el.querySelector('textarea');
      if (ta && data.placeholder) ta.placeholder = data.placeholder;
    }
  }

  // Listen for undo/redo events
  window.addEventListener('builder-undo', undo);
  window.addEventListener('builder-redo', redo);

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
      } catch (_) { }
    }, true);
  }

  // Drop target - improved with insertion between fields
  let dragOverField = null;
  let dropPosition = null; // 'before' or 'after'

  preview.addEventListener('dragenter', (e) => {
    e.preventDefault();
    preview.classList.add('dragover');
  });

  preview.addEventListener('dragover', (e) => {
    e.preventDefault();
    if (e.dataTransfer) e.dataTransfer.dropEffect = 'copy';

    // Find which field we're hovering over
    const target = e.target.closest('.preview-field');
    if (target) {
      const rect = target.getBoundingClientRect();
      const midpoint = rect.top + rect.height / 2;
      const mouseY = e.clientY;

      // Remove previous indicators
      preview.querySelectorAll('.preview-field').forEach(f => {
        f.classList.remove('drag-over-top', 'drag-over-bottom');
      });

      // Determine if we're in top or bottom half
      if (mouseY < midpoint) {
        target.classList.add('drag-over-top');
        dragOverField = target;
        dropPosition = 'before';
      } else {
        target.classList.add('drag-over-bottom');
        dragOverField = target;
        dropPosition = 'after';
      }
    } else {
      // Clear indicators if not over a field
      preview.querySelectorAll('.preview-field').forEach(f => {
        f.classList.remove('drag-over-top', 'drag-over-bottom');
      });
      dragOverField = null;
      dropPosition = null;
    }
  });

  preview.addEventListener('dragleave', (e) => {
    if (!preview.contains(e.relatedTarget)) {
      preview.classList.remove('dragover');
      preview.querySelectorAll('.preview-field').forEach(f => {
        f.classList.remove('drag-over-top', 'drag-over-bottom');
      });
      dragOverField = null;
      dropPosition = null;
    }
  });

  preview.addEventListener('drop', (e) => {
    e.preventDefault();
    preview.classList.remove('dragover');
    preview.querySelectorAll('.preview-field').forEach(f => {
      f.classList.remove('drag-over-top', 'drag-over-bottom');
    });

    let type = '';
    try {
      type = (e.dataTransfer && (
        e.dataTransfer.getData('application/x-field-type') ||
        e.dataTransfer.getData('text/plain') ||
        e.dataTransfer.getData('field-type')
      )) || '';
    } catch (_) { }
    if (!type) return;

    // Add field at the determined position
    addField(type, dragOverField, dropPosition);
    dragOverField = null;
    dropPosition = null;
  });

  function addField(type, referenceField = null, position = null) {
    const id = `field-${fieldCounter++}`;
    const el = document.createElement('div');
    el.className = 'preview-field';
    el.id = id;
    el.dataset.type = type;
    el.innerHTML = getTemplate(type) + actionBar();

    // Insert at the appropriate position
    if (referenceField && position === 'before') {
      preview.insertBefore(el, referenceField);
    } else if (referenceField && position === 'after') {
      if (referenceField.nextSibling) {
        preview.insertBefore(el, referenceField.nextSibling);
      } else {
        preview.appendChild(el);
      }
    } else {
      // Default: append to end (or insert in fields container if it exists)
      const fieldsContainer = preview.querySelector('.form-fields-container');
      if (fieldsContainer) {
        fieldsContainer.appendChild(el);
      } else {
        preview.appendChild(el);
      }
    }

    fieldsData[id] = seedDataFor(type);
    wireField(el, id, type);
    selectField(id, type);
    updateMoveButtons();

    // Save to history after adding field
    saveHistory();

    // Hide empty state if it exists
    const emptyState = preview.querySelector('.empty-state');
    if (emptyState) {
      emptyState.style.display = 'none';
    }
  }

  function getTemplate(type) {
    const map = {
      text: `<div class="form-field"><label>Text Field</label><input type="text" placeholder="Enter text"></div>`,
      email: `<div class="form-field"><label>Email Field</label><input type="email" placeholder="Enter email"></div>`,
      number: `<div class="form-field"><label>Number Field</label><input type="number" placeholder="Enter number"></div>`,
      phone: `<div class="form-field"><label>Phone Field</label><input type="tel" placeholder="Enter phone"></div>`,
      textarea: `<div class="form-field"><label>Text Area</label><textarea placeholder="Enter text"></textarea></div>`,
      select: `<div class="form-field"><label>Dropdown</label><select><option value="">Select an option</option><option>Option 1</option><option>Option 2</option></select></div>`,
      multiselect: `<div class="form-field"><label>Multi Select</label><select multiple><option>Option 1</option><option>Option 2</option></select></div>`,
      radio: `<div class="form-field"><label>Radio Buttons</label><div class="radio-field"><input id="r1" type="radio" name="rg"><label for="r1">Option 1</label></div><div class="radio-field"><input id="r2" type="radio" name="rg"><label for="r2">Option 2</label></div></div>`,
      checkbox: `<div class="form-field"><div class="checkbox-field"><input id="cb" type="checkbox"><label for="cb" class="mb-0">Checkbox</label></div></div>`,
      multicheckbox: `<div class="form-field"><label>Multi Checkbox</label><div class="checkbox-field"><input id="m1" type="checkbox"><label for="m1">Option 1</label></div><div class="checkbox-field"><input id="m2" type="checkbox"><label for="m2">Option 2</label></div></div>`,
      date: `<div class="form-field"><label>Date</label><input type="date"></div>`,
      time: `<div class="form-field"><label>Time</label><input type="time"></div>`,
      url: `<div class="form-field"><label>Website URL</label><input type="url" placeholder="https://example.com"></div>`,
      html: `<div class="form-field html-content"><p>HTML Content</p></div>`,
      consent: `<div class="form-field"><div class="checkbox-field"><input id="consent" type="checkbox"><label for="consent" class="mb-0">I agree to the terms and conditions</label></div></div>`,
      submit_button: `<div class="form-field"><button type="submit" class="btn-primary">Submit</button></div>`
    };
    return map[type] || map.text;
  }

  function actionBar() {
    return `
      <div class="field-actions">
        <button class="move-field-up" title="Up">↑</button>
        <button class="move-field-down" title="Down">↓</button>
        <button class="edit-field" title="Edit">✎</button>
        <button class="remove-field" title="Remove">⛌</button>
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
    if (['select', 'radio', 'multicheckbox', 'multiselect'].includes(type)) {
      base.options = ['Option 1', 'Option 2'];
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

      // Save to history after removing field
      saveHistory();

      // If the removed field was selected, clear selection
      if (currentField === id) {
        properties.classList.remove('has-selection');
        // Reset to placeholder
        const placeholder = properties.querySelector('.field-props-placeholder');
        if (placeholder) {
          placeholder.innerHTML = `
            <div class="panel-header">
              <h2>Properties</h2>
            </div>
            <div class="no-selection">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" opacity="0.2">
                <rect x="3" y="5" width="18" height="14" rx="2"/>
                <path d="M7 10h10M7 14h6"/>
              </svg>
              <p>Select a field to edit its properties</p>
            </div>
          `;
        }
      }

      // Show empty state if no fields left
      const remainingFields = preview.querySelectorAll('.preview-field');
      const emptyState = preview.querySelector('.empty-state');
      if (remainingFields.length === 0 && emptyState) {
        emptyState.style.display = 'flex';
      }
    });
    el.querySelector('.move-field-up').addEventListener('click', e => {
      e.stopPropagation();
      if (el.previousElementSibling && el.previousElementSibling.classList.contains('preview-field')) {
        el.parentNode.insertBefore(el, el.previousElementSibling);
      }
      reindex();
      updateMoveButtons();
      saveHistory(); // Save to history after moving
    });
    el.querySelector('.move-field-down').addEventListener('click', e => {
      e.stopPropagation();
      const next = el.nextElementSibling;
      if (next && next.classList.contains('preview-field')) {
        el.parentNode.insertBefore(next, el);
      }
      reindex();
      updateMoveButtons();
      saveHistory(); // Save to history after moving
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

  function updateMoveButtons() {
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

    // Remove selected class from all fields
    preview.querySelectorAll('.preview-field').forEach(f => f.classList.remove('selected'));
    // Add selected class to current field
    const selectedEl = preview.querySelector(`#${id}`);
    if (selectedEl) selectedEl.classList.add('selected');

    // Add has-selection class to properties container
    properties.classList.add('has-selection');

    // Find or create field properties container
    let fieldPropsContainer = properties.querySelector('.field-props-placeholder');
    if (!fieldPropsContainer) {
      fieldPropsContainer = document.createElement('div');
      fieldPropsContainer.className = 'field-props-placeholder';
      properties.insertBefore(fieldPropsContainer, properties.firstChild);
    }

    fieldPropsContainer.innerHTML = `
      <div class="panel-header">
        <h2>Properties</h2>
      </div>
      <div class="property-group">
        <h3>Basic</h3>
        <label>Label <input id="fp-label" value="${escapeHtml(data.label)}"></label>
        ${(['text', 'email', 'number', 'phone', 'url', 'textarea'].includes(type) ?
        `<label>Placeholder <input id="fp-ph" value="${escapeHtml(data.placeholder || '')}"></label>` : '')}
        ${(['text', 'email', 'number', 'phone', 'url', 'textarea'].includes(type) ?
        `<label>Max Length <input id="fp-max" type="number" value="${escapeAttr(data.maxlength || '')}"></label>` : '')}
        ${(['text', 'email', 'number', 'phone', 'url', 'textarea'].includes(type) ? `
          <div class="property-subtle">
            <label>Validation Pattern (Regex)
              <input id="fp-regex" placeholder="e.g. ^[A-Za-z]{3,}$" value="${escapeAttr(data.regex || '')}">
            </label>
            <p class="help-text text-start">Optional. Add a regex pattern for validation.</p>
            <label>Custom Error Message
              <input id="fp-errmsg" placeholder="e.g. Please enter only letters" value="${escapeAttr(data.error_message || '')}">
            </label>
            <p class="help-text">Optional. Custom message to show when validation fails.</p>
          </div>` : '')}
        <label class="inline"><input type="checkbox" id="fp-req" ${data.required ? 'checked' : ''}> <span>Required</span></label>
      </div>
      ${(['select', 'radio', 'multicheckbox', 'multiselect'].includes(type) ? `
        <div class="property-group">
          <h3>Options</h3>
          <div id="fp-options"></div>
          <button id="fp-addopt" type="button" class="fp-addopt">Add Option</button>
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

    // Helper function to update preview in real-time - Comprehensive
    const updateFieldPreview = () => {
      const host = root.querySelector('#' + id);
      if (!host) return;
      
      // Update label
      const label = host.querySelector('.form-field > label, .checkbox-field label');
      if (label) label.textContent = data.label;

      // Update text-like inputs (text, email, number, phone, url, date, time)
      if (['text', 'email', 'number', 'phone', 'url', 'date', 'time'].includes(type)) {
        const input = host.querySelector('input');
        if (input) {
          if (data.placeholder) input.placeholder = data.placeholder;
          if (data.maxlength) input.maxLength = parseInt(data.maxlength, 10);
          if (data.required) input.setAttribute('required', '');
          else input.removeAttribute('required');
        }
      } 
      // Update textarea
      else if (type === 'textarea') {
        const ta = host.querySelector('textarea');
        if (ta) {
          if (data.placeholder) ta.placeholder = data.placeholder;
          if (data.maxlength) ta.maxLength = parseInt(data.maxlength, 10);
          if (data.required) ta.setAttribute('required', '');
          else ta.removeAttribute('required');
        }
      } 
      // Update select
      else if (type === 'select') {
        const sel = host.querySelector('select');
        if (sel) {
          sel.innerHTML = `<option value="">${data.placeholder || 'Select an option'}</option>` +
            (data.options || []).map(o => `<option>${escapeHtml(o)}</option>`).join('');
          if (data.required) sel.setAttribute('required', '');
          else sel.removeAttribute('required');
        }
      }
      // Update multiselect
      else if (type === 'multiselect') {
        const sel = host.querySelector('select');
        if (sel) {
          sel.innerHTML = (data.options || []).map(o => `<option>${escapeHtml(o)}</option>`).join('');
          if (data.required) sel.setAttribute('required', '');
          else sel.removeAttribute('required');
        }
      }
      // Update radio buttons
      else if (type === 'radio') {
        const wrap = host.querySelector('.form-field');
        if (wrap) {
          wrap.querySelectorAll('.radio-field').forEach(n => n.remove());
          (data.options || []).forEach((o, i) => {
            const div = document.createElement('div');
            div.className = 'radio-field';
            const rid = `${data.name}-${i}`;
            div.innerHTML = `<input id="${rid}" type="radio" name="${escapeHtml(data.name)}" ${data.required ? 'required' : ''}>
                             <label for="${rid}">${escapeHtml(o)}</label>`;
            wrap.appendChild(div);
          });
        }
      }
      // Update multicheckbox
      else if (type === 'multicheckbox') {
        const wrap = host.querySelector('.form-field');
        if (wrap) {
          wrap.querySelectorAll('.checkbox-field').forEach(n => n.remove());
          (data.options || []).forEach((o, i) => {
            const div = document.createElement('div');
            div.className = 'checkbox-field';
            const cid = `${data.name}-${i}`;
            div.innerHTML = `<input id="${cid}" type="checkbox" name="${escapeHtml(data.name)}[]" ${data.required ? 'required' : ''}>
                             <label for="${cid}">${escapeHtml(o)}</label>`;
            wrap.appendChild(div);
          });
        }
      }
      // Update checkbox
      else if (type === 'checkbox') {
        const cbl = host.querySelector('.checkbox-field label');
        if (cbl) cbl.textContent = data.label;
        const cbinput = host.querySelector('.checkbox-field input');
        if (cbinput) {
          if (data.required) cbinput.setAttribute('required', '');
          else cbinput.removeAttribute('required');
        }
      }
      // Update consent
      else if (type === 'consent') {
        const cbl = host.querySelector('.checkbox-field label');
        if (cbl) cbl.textContent = data.label;
        const cbinput = host.querySelector('.checkbox-field input');
        if (cbinput) {
          if (data.required) cbinput.setAttribute('required', '');
          else cbinput.removeAttribute('required');
        }
      }
      // Update button
      else if (type === 'submit_button') {
        const btn = host.querySelector('button');
        if (btn) {
          btn.textContent = data.button_text || 'Submit';
          if (data.custom_style) btn.setAttribute('style', data.custom_style);
          else btn.removeAttribute('style');
        }
      }
      // Update HTML
      else if (type === 'html') {
        const block = host.querySelector('.html-content');
        if (block) block.innerHTML = data.html || '<p></p>';
      }
    };

    if (['select', 'radio', 'multicheckbox', 'multiselect'].includes(type)) {
      const wrap = root.querySelector('#fp-options');
      
      const renderOptions = () => {
        wrap.innerHTML = '';
        (data.options || []).forEach((opt, i) => {
          const row = document.createElement('div');
          row.innerHTML = `<input data-i="${i}" value="${escapeAttr(opt)}"> <button data-i="${i}" class="rm" type="button">x</button>`;
          wrap.appendChild(row);
        });
      };
      
      renderOptions();
      
      root.querySelector('#fp-addopt').onclick = () => {
        data.options.push(`Option ${data.options.length + 1}`);
        renderOptions();
        attachRealtimeListeners(); // Re-attach listeners to new options
        updateFieldPreview(); // Update preview
        saveHistory();
      };
      
      wrap.addEventListener('click', e => {
        if (e.target.classList.contains('rm')) {
          const i = +e.target.dataset.i;
          data.options.splice(i, 1);
          renderOptions();
          updateFieldPreview(); // Update preview when option removed
          saveHistory();
        }
      });
      
      wrap.addEventListener('input', e => {
        if (e.target.matches('input[data-i]')) {
          data.options[+e.target.dataset.i] = e.target.value;
          updateFieldPreview(); // Update preview when option text changed
          saveHistory();
        }
      });
    }

    // Real-time property updates with event listeners
    const attachRealtimeListeners = () => {
      const labelEl = root.querySelector('#fp-label');
      const phEl = root.querySelector('#fp-ph');
      const maxEl = root.querySelector('#fp-max');
      const regexEl = root.querySelector('#fp-regex');
      const errmsgEl = root.querySelector('#fp-errmsg');
      const reqEl = root.querySelector('#fp-req');
      const htmlEl = root.querySelector('#fp-html');
      const btntextEl = root.querySelector('#fp-btntext');
      const btncssEl = root.querySelector('#fp-btncss');

      if (labelEl) {
        labelEl.addEventListener('input', (e) => {
          data.label = e.target.value;
          updateFieldPreview();
          saveHistory();
        });
      }
      if (phEl) {
        phEl.addEventListener('input', (e) => {
          data.placeholder = e.target.value;
          updateFieldPreview();
          saveHistory();
        });
      }
      if (maxEl) {
        maxEl.addEventListener('input', (e) => {
          data.maxlength = e.target.value;
          updateFieldPreview();
          saveHistory();
        });
      }
      if (regexEl) {
        regexEl.addEventListener('input', (e) => {
          data.regex = e.target.value;
          saveHistory();
        });
      }
      if (errmsgEl) {
        errmsgEl.addEventListener('input', (e) => {
          data.error_message = e.target.value;
          saveHistory();
        });
      }
      if (reqEl) {
        reqEl.addEventListener('change', (e) => {
          data.required = e.target.checked;
          updateFieldPreview(); // Update required attribute on inputs
          saveHistory();
        });
      }
      if (htmlEl) {
        htmlEl.addEventListener('input', (e) => {
          data.html = e.target.value;
          updateFieldPreview();
          saveHistory();
        });
      }
      if (btntextEl) {
        btntextEl.addEventListener('input', (e) => {
          data.button_text = e.target.value || 'Submit';
          updateFieldPreview();
          saveHistory();
        });
      }
      if (btncssEl) {
        btncssEl.addEventListener('input', (e) => {
          data.custom_style = e.target.value || '';
          updateFieldPreview();
          saveHistory();
        });
      }
    };

    // Attach listeners and hide the update button
    setTimeout(() => {
      attachRealtimeListeners();
      const applyBtn = root.querySelector('#fp-apply');
      if (applyBtn) {
        applyBtn.style.display = 'none';
      }
    }, 0);
  }

  // Preview modal and tab
  if (previewBtn) {
    previewBtn.addEventListener('click', () => {
      const html = renderPreview(Object.values(fieldsData));

      // Only update tab preview (don't show modal)
      const tabPreviewContainer = root.querySelector('#preview-form-container-tab');
      if (tabPreviewContainer) {
        tabPreviewContainer.innerHTML = html;

        // Add validation handler to submit button
        setTimeout(() => {
          const submitBtn = tabPreviewContainer.querySelector('.preview-submit-btn');
          if (submitBtn) {
            submitBtn.addEventListener('click', (e) => {
              e.preventDefault();
              const form = submitBtn.closest('form');
              if (form && form.checkValidity()) {
                alert('Form is valid! (This is a preview - form will not be submitted)');
              } else {
                form.reportValidity();
              }
            });
          }
        }, 100);
      }
    });
  }
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
    let out = `<form class="preview-form-rendered">`;
    fields.forEach(f => {
      const t = f.field_type || f.type;
      if (t === 'html') {
        out += `<div class="form-field html-content">${f.html || ''}</div>`;
        return;
      }
      out += `<div class="form-field ${f.required ? 'required' : ''}">`;
      if (!['checkbox', 'consent'].includes(t)) out += `<label>${escapeHtml(f.label || '')}</label>`;
      if (['text', 'email', 'number', 'phone', 'url', 'date', 'time'].includes(t)) {
        const inputType = t === 'phone' ? 'tel' : t;
        out += `<input type="${inputType}" placeholder="${escapeAttr(f.placeholder || '')}" ${f.maxlength ? `maxlength="${f.maxlength}"` : ''} ${f.required ? 'required' : ''} />`;
      } else if (t === 'textarea') {
        out += `<textarea placeholder="${escapeAttr(f.placeholder || '')}" ${f.required ? 'required' : ''}></textarea>`;
      } else if (t === 'select') {
        out += `<select ${f.required ? 'required' : ''}><option value="">${escapeHtml(f.placeholder || 'Select an option')}</option>${(f.options || []).map(o => `<option>${escapeHtml(o)}</option>`).join('')}</select>`;
      } else if (t === 'multiselect') {
        out += `<select multiple ${f.required ? 'required' : ''}>${(f.options || []).map(o => `<option>${escapeHtml(o)}</option>`).join('')}</select>`;
      } else if (t === 'radio') {
        out += (f.options || []).map((o, i) => `<div class="radio-field"><input type="radio" id="${f.name}-${i}" name="${f.name}"><label for="${f.name}-${i}">${escapeHtml(o)}</label></div>`).join('');
      } else if (t === 'multicheckbox') {
        out += (f.options || []).map((o, i) => `<div class="checkbox-field"><input type="checkbox" id="${f.name}-${i}" name="${f.name}[]"><label for="${f.name}-${i}">${escapeHtml(o)}</label></div>`).join('');
      } else if (t === 'checkbox' || t === 'consent') {
        out += `<div class="checkbox-field"><input type="checkbox" id="${f.name}" ${f.required ? 'required' : ''}><label for="${f.name}">${escapeHtml(f.label || '')}</label></div>`;
      } else if (t === 'submit_button') {
        out += `<button type="button" class="preview-submit-btn" style="${escapeAttr(f.custom_style || '')}">${escapeHtml(f.button_text || 'Submit')}</button>`;
      }
      out += `</div>`;
    });
    // safety submit button in preview
    if (!fields.some(f => (f.type || f.field_type) === 'submit_button')) {
      out += `<div class="form-field"><button type="button" class="preview-submit-btn">Submit</button></div>`;
    }
    out += `</form>`;
    return out;
  }

  // Save -> API
  saveBtn.addEventListener('click', async () => {
    // Add loading state
    saveBtn.disabled = true;
    const originalHTML = saveBtn.innerHTML;
    saveBtn.innerHTML = `
      <svg class="spin" style="width: 16px; height: 16px; display: inline-block; vertical-align: middle; margin-right: 6px;" viewBox="0 0 50 50">
        <circle cx="25" cy="25" r="20" fill="none" stroke="currentColor" stroke-width="4" stroke-dasharray="80" stroke-dashoffset="60" />
      </svg>
      Saving...
    `;

    // Clear previous errors
    window.dispatchEvent(new CustomEvent('builder-clear-error'));

  try {
    // Validate form title
    const titleEl = root.querySelector('#form-title');
    if (!titleEl || !titleEl.value.trim()) {
      throw new Error('Form title is required');
    }

    // Validate Submit To email
    const submitToEl = root.querySelector('#form-submit-to');
    if (!submitToEl || !submitToEl.value.trim()) {
      throw new Error('Submit To email address is required');
    }

    // Enforce Google reCAPTCHA site key required
    const siteKeyEl = root.querySelector('#form-recaptcha-key');
    if (!siteKeyEl || !siteKeyEl.value.trim()) {
      throw new Error('Google reCAPTCHA site key is required');
    }
    // Enforce Google reCAPTCHA secret key required
    const secretKeyEl = root.querySelector('#form-recaptcha-secret');
    if (!secretKeyEl || !secretKeyEl.value.trim()) {
      throw new Error('Google reCAPTCHA secret key is required');
    }

    // Check if form has at least one field
    const fieldCount = Object.keys(fieldsData).length;
    if (fieldCount === 0) {
      throw new Error('Please add at least one field to your form');
    }

    const payload = buildApiPayload();
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

    // Notify success
    window.dispatchEvent(new CustomEvent('builder-save-success'));

  } catch (e) {
    // Log to console for debugging
    console.error('Form save error:', e.message || e);

    // Dispatch error event to React component
    window.dispatchEvent(new CustomEvent('builder-save-error', {
      detail: { message: e.message || 'Failed to save form' }
    }));
  } finally {
    // Restore button state
    saveBtn.disabled = false;
    saveBtn.innerHTML = originalHTML;
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
    type: get('form-type') || 'web',
    domain: get('form-domain'),
    submit_to: get('form-submit-to'),
    submit_from: get('form-submit-from'),
    cc_email: get('form-cc-email'),
    bcc_email: get('form-bcc-email'),
    thank_you_message: get('form-thank-you') || 'Thank you for reaching out. We\'ll get back to you soon!',
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
function val(sel) { return root.querySelector(sel)?.value || ''; }
function capitalize(s) { return (s || '').charAt(0).toUpperCase() + (s || '').slice(1); }
function escapeHtml(s = '') { return s.replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c])); }
function escapeAttr(s = '') { return escapeHtml(s).replace(/"/g, '&quot;'); }

function seedDefaultFields() {
  const defaults = [
    { field_type: 'text', name: 'name', label: 'Name', placeholder: 'Enter your name', order: 0 },
    { field_type: 'email', name: 'email', label: 'Email', placeholder: 'Enter your email', order: 1 },
    { field_type: 'phone', name: 'phone', label: 'Phone', placeholder: 'Enter your phone', order: 2 },
    { field_type: 'textarea', name: 'message', label: 'Message', placeholder: 'Type your message', order: 3 },
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
  setVal('form-type', form.type || 'web');
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
  const fields = (form.fields || []).slice().sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
  preview.innerHTML = '';
  fieldsData = {};
  fieldCounter = 1;

  fields.forEach(addFieldFromData);
  updateMoveButtons();

  // Hide empty state if fields exist
  if (fields.length > 0) {
    const emptyState = preview.querySelector('.empty-state');
    if (emptyState) {
      emptyState.style.display = 'none';
    }
  }
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

  if (['text', 'email', 'number', 'phone', 'url', 'date', 'time'].includes(type)) {
    const input = el.querySelector('input');
    if (input) {
      if (type === 'phone') input.type = 'tel';
      if (data.placeholder) input.placeholder = data.placeholder;
      if (data.maxlength) input.maxLength = parseInt(data.maxlength, 10);
      if (data.required) input.required = true;
    }
  } else if (type === 'textarea') {
    const ta = el.querySelector('textarea');
    if (ta) {
      if (data.placeholder) ta.placeholder = data.placeholder;
      if (data.maxlength) ta.maxLength = parseInt(data.maxlength, 10);
      if (data.required) ta.required = true;
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
      (data.options || []).forEach((o, i) => {
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
      (data.options || []).forEach((o, i) => {
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

// Cleanup function to reset builder state
export function cleanupBuilder() {
  const root = document.querySelector('.mf-builder');
  if (root) {
    delete root.dataset.builderInitialized;

    // Clear the preview container
    const preview = root.querySelector('#preview-container');
    if (preview) {
      // Remove all field elements but keep the page header and empty state
      preview.querySelectorAll('.preview-field').forEach(field => field.remove());
    }
  }
}