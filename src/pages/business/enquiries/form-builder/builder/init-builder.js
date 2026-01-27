// src/builder/initBuilder.js
import { saveFormToApi, updateFormToApi } from "../api";

export function initBuilder({ defaultOrgId, initialForm = null }) {
  // Guard against double binding in React StrictMode (dev) or accidental re-calls
  if (typeof window === "undefined") {
    return;
  }
  // Scope all DOM lookups to the builder root to avoid collisions with host app
  const root = document.querySelector(".mf-builder") || document;

  // Prevent duplicate initialization
  if (root.dataset.builderInitialized === "true") {
    console.log("Builder already initialized, skipping...");
    return;
  }
  root.dataset.builderInitialized = "true";

  // Core nodes
  const preview = root.querySelector("#preview-container");
  const properties = root.querySelector("#properties-container");
  const cssTextarea = root.querySelector("#form_style");
  const previewBtn = root.querySelector("#preview-btn");
  const saveBtn = root.querySelector("#save-btn");

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
    preview.querySelectorAll(".preview-field").forEach((f) => f.remove());

    // Rebuild all fields
    Object.keys(fieldsData).forEach((id) => {
      const data = fieldsData[id];
      const type = data.field_type || data.type;
      const el = document.createElement("div");
      el.className = "preview-field";
      el.id = id;
      el.dataset.type = type;
      el.innerHTML = getTemplate(type) + actionBar();
      preview.appendChild(el);
      wireField(el, id, type);
      updateFieldDisplay(el, id, type, data);
    });

    updateMoveButtons();
    applyConditionalVisibilityRecursively();

    // Show/hide empty state
    const emptyState = preview.querySelector(".empty-state");
    if (emptyState) {
      emptyState.style.display =
        Object.keys(fieldsData).length === 0 ? "flex" : "none";
    }
  }

  // Update field display based on data
  function updateFieldDisplay(el, id, type, data) {
    const labelEl = el.querySelector(
      ".form-field > label, .checkbox-field label"
    );
    if (labelEl && data.label) labelEl.textContent = data.label;

    if (
      ["text", "email", "number", "phone", "url", "date", "time"].includes(type)
    ) {
      const input = el.querySelector("input");
      if (input && data.placeholder) input.placeholder = data.placeholder;
    } else if (type === "textarea") {
      const ta = el.querySelector("textarea");
      if (ta && data.placeholder) ta.placeholder = data.placeholder;
    }
  }

  // ----- Conditional visibility (visible_if) -----
  function getControllerValue(controllerFieldId) {
    const controllerHost = root.querySelector(`#${controllerFieldId}`);
    if (!controllerHost) return null;

    const controllerType = controllerHost.dataset.type;

    if (controllerType === "select") {
      const sel = controllerHost.querySelector("select");
      if (!sel) return null;
      const opt = sel.options?.[sel.selectedIndex];
      const text = opt ? (opt.textContent || "").trim() : "";
      return text || null;
    }

    if (controllerType === "radio") {
      const checked = controllerHost.querySelector(
        'input[type="radio"]:checked'
      );
      if (!checked) return null;
      const lbl = controllerHost.querySelector(`label[for="${checked.id}"]`);
      return (lbl?.textContent || "").trim() || null;
    }

    if (controllerType === "multicheckbox") {
      const checked = Array.from(
        controllerHost.querySelectorAll('input[type="checkbox"]:checked')
      );
      if (!checked.length) return [];
      return checked
        .map((cb) => {
          const lbl = controllerHost.querySelector(`label[for="${cb.id}"]`);
          return (lbl?.textContent || "").trim();
        })
        .filter(Boolean);
    }

    if (controllerType === "checkbox" || controllerType === "consent") {
      const cb = controllerHost.querySelector('input[type="checkbox"]');
      if (!cb) return null;
      return cb.checked ? "Checked" : "Unchecked";
    }

    const input = controllerHost.querySelector("input, select, textarea");
    if (!input) return null;
    const v = (input.value || "").trim();
    return v || null;
  }

  function isFieldVisible(fieldId) {
    const data = fieldsData[fieldId];
    if (!data || !data.visible_if) return true;

    const { field_id: controllerId, value: expected } = data.visible_if;
    if (!controllerId || expected == null || expected === "") return true;

    const actual = getControllerValue(controllerId);

    if (Array.isArray(actual)) {
      return actual.includes(expected);
    }

    return actual === expected;
  }

  // Track if we're in preview mode (conditional visibility only applies in preview)
  let isPreviewMode = false;

  function applyConditionalVisibilityRecursively() {
    // In designer mode, don't hide fields - just show visual indicator
    if (!isPreviewMode) {
      Object.keys(fieldsData).forEach((fid) => {
        const host = root.querySelector(`#${fid}`);
        if (!host) return;
        const hasCondition = !!fieldsData[fid]?.visible_if;
        // Show all fields in designer mode but add visual indicator for conditional fields
        host.style.display = "";
        if (hasCondition) {
          host.classList.add("has-condition");
        } else {
          host.classList.remove("has-condition");
        }
      });
      return;
    }

    // Preview mode - actually apply visibility
    const maxPasses = 5;
    let prevSignature = "";

    for (let pass = 0; pass < maxPasses; pass++) {
      Object.keys(fieldsData).forEach((fid) => {
        const host = root.querySelector(`#${fid}`);
        if (!host) return;
        const visible = isFieldVisible(fid);
        host.style.display = visible ? "" : "none";

        if (!visible && currentField === fid) {
          currentField = null;
          properties.classList.remove("has-selection");
          preview
            .querySelectorAll(".preview-field")
            .forEach((f) => f.classList.remove("selected"));
        }
      });

      const sig = Object.keys(fieldsData)
        .map((fid) => {
          const host = root.querySelector(`#${fid}`);
          return `${fid}:${host?.style.display === "none" ? 0 : 1}`;
        })
        .join("|");

      if (sig === prevSignature) break;
      prevSignature = sig;
    }
  }

  // Listen for undo/redo events
  window.addEventListener("builder-undo", undo);
  window.addEventListener("builder-redo", redo);

  // If an existing form was passed in, hydrate all UI
  if (initialForm) {
    try {
      hydrateInitialForm(initialForm);

      // Force update preview after hydration
      setTimeout(() => {
        const previewTitleEl = root.querySelector("#preview-form-title");
        const previewDescriptionEl = root.querySelector(
          "#preview-form-description"
        );
        const formTitleEl = root.querySelector("#form-title");
        const formDescriptionEl = root.querySelector("#form-description");

        if (previewTitleEl && formTitleEl && formTitleEl.value) {
          previewTitleEl.textContent = formTitleEl.value;
        }
        if (
          previewDescriptionEl &&
          formDescriptionEl &&
          formDescriptionEl.value
        ) {
          previewDescriptionEl.textContent = formDescriptionEl.value;
        }
      }, 100);
    } catch (err) {
      console.error("Hydration failed:", err);
    }
  }

  // Update preview title and description in real-time
  const formTitleEl = root.querySelector("#form-title");
  const formDescriptionEl = root.querySelector("#form-description");
  const previewTitleEl = root.querySelector("#preview-form-title");
  const previewDescriptionEl = root.querySelector("#preview-form-description");

  if (formTitleEl && previewTitleEl) {
    formTitleEl.addEventListener("input", (e) => {
      previewTitleEl.textContent = e.target.value || "Title";
    });
  }

  if (formDescriptionEl && previewDescriptionEl) {
    formDescriptionEl.addEventListener("input", (e) => {
      previewDescriptionEl.textContent = e.target.value || "Description";
    });
  }

  // Field palette (delegated to support dragging from child elements reliably)
  const palette = root.querySelector(".field-types");
  if (palette) {
    palette.addEventListener(
      "dragstart",
      (e) => {
        const item = e.target && e.target.closest(".field-type");
        if (!item) return;
        try {
          if (e.dataTransfer) {
            e.dataTransfer.effectAllowed = "copy";
            // Set both a standard and a custom MIME so all browsers carry data
            e.dataTransfer.setData("text/plain", item.dataset.type);
            e.dataTransfer.setData(
              "application/x-field-type",
              item.dataset.type
            );
          }
        } catch (_) {
          /* Silently ignore errors */
        }
      },
      true
    );
  }

  // Drop target - improved with insertion between fields
  let dragOverField = null;
  let dropPosition = null; // 'before' or 'after'

  preview.addEventListener("dragenter", (e) => {
    e.preventDefault();
    preview.classList.add("dragover");
  });

  preview.addEventListener("dragover", (e) => {
    e.preventDefault();
    if (e.dataTransfer) e.dataTransfer.dropEffect = "copy";

    // Find which field we're hovering over
    const target = e.target.closest(".preview-field");
    if (target) {
      const rect = target.getBoundingClientRect();
      const midpoint = rect.top + rect.height / 2;
      const mouseY = e.clientY;

      // Remove previous indicators
      preview.querySelectorAll(".preview-field").forEach((f) => {
        f.classList.remove("drag-over-top", "drag-over-bottom");
      });

      // Determine if we're in top or bottom half
      if (mouseY < midpoint) {
        target.classList.add("drag-over-top");
        dragOverField = target;
        dropPosition = "before";
      } else {
        target.classList.add("drag-over-bottom");
        dragOverField = target;
        dropPosition = "after";
      }
    } else {
      // Clear indicators if not over a field
      preview.querySelectorAll(".preview-field").forEach((f) => {
        f.classList.remove("drag-over-top", "drag-over-bottom");
      });
      dragOverField = null;
      dropPosition = null;
    }
  });

  preview.addEventListener("dragleave", (e) => {
    if (!preview.contains(e.relatedTarget)) {
      preview.classList.remove("dragover");
      preview.querySelectorAll(".preview-field").forEach((f) => {
        f.classList.remove("drag-over-top", "drag-over-bottom");
      });
      dragOverField = null;
      dropPosition = null;
    }
  });

  preview.addEventListener("drop", (e) => {
    e.preventDefault();
    preview.classList.remove("dragover");
    preview.querySelectorAll(".preview-field").forEach((f) => {
      f.classList.remove("drag-over-top", "drag-over-bottom");
    });

    let type = "";
    try {
      type =
        (e.dataTransfer &&
          (e.dataTransfer.getData("application/x-field-type") ||
            e.dataTransfer.getData("text/plain") ||
            e.dataTransfer.getData("field-type"))) ||
        "";
    } catch (_) {
      /* Silently ignore errors */
    }
    if (!type) return;

    // Add field at the determined position
    addField(type, dragOverField, dropPosition);
    dragOverField = null;
    dropPosition = null;
  });

  preview.addEventListener("change", () => {
    applyConditionalVisibilityRecursively();
  });

  // Show selected file names for image fields
  preview.addEventListener("change", (e) => {
    const input = e.target;
    if (!input || input.type !== "file") return;

    const host = input.closest(".preview-field");
    if (!host) return;

    const fileNameEl = host.querySelector(".upload-filename");
    if (!fileNameEl) return;

    const files = Array.from(input.files || []);
    fileNameEl.textContent = files.length
      ? files.map((f) => f.name).join(", ")
      : "";

    applyConditionalVisibilityRecursively();
  });

  function addField(type, referenceField = null, position = null) {
    const id = `field-${fieldCounter++}`;
    const el = document.createElement("div");
    el.className = "preview-field";
    el.id = id;
    el.dataset.type = type;
    el.innerHTML = getTemplate(type) + actionBar();

    // Insert at the appropriate position
    if (referenceField && position === "before") {
      preview.insertBefore(el, referenceField);
    } else if (referenceField && position === "after") {
      if (referenceField.nextSibling) {
        preview.insertBefore(el, referenceField.nextSibling);
      } else {
        preview.appendChild(el);
      }
    } else {
      // Default: append to end (or insert in fields container if it exists)
      const fieldsContainer = preview.querySelector(".form-fields-container");
      if (fieldsContainer) {
        fieldsContainer.appendChild(el);
      } else {
        preview.appendChild(el);
      }
    }

    fieldsData[id] = seedDataFor(type);

    // Ensure every field starts with a unique, stable name.
    // Some field types define a preferred name (e.g. address/image), but we must guarantee uniqueness.
    const existingNames = new Set(
      Object.keys(fieldsData)
        .filter((fid) => fid !== id)
        .map((fid) => (fieldsData[fid]?.name || "").trim())
        .filter(Boolean)
    );

    const preferredBaseName = (fieldsData[id].name || "").trim();
    const fallbackBaseName = `${type}_${String(id).replace("field-", "")}`;
    const baseName = preferredBaseName || fallbackBaseName;

    let uniqueName = baseName;
    let suffix = 2;
    while (existingNames.has(uniqueName)) {
      uniqueName = `${baseName}_${suffix++}`;
    }
    fieldsData[id].name = uniqueName;

    wireField(el, id, type);
    // Do not auto-select field when adding - let user click to select
    // selectField(id, type);
    updateMoveButtons();

    applyConditionalVisibilityRecursively();

    // Save to history after adding field
    saveHistory();

    // Hide empty state if it exists
    const emptyState = preview.querySelector(".empty-state");
    if (emptyState) {
      emptyState.style.display = "none";
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
      radio: `<div class="form-field"><label>Radio Buttons</label><div class="radio-field"><input id="r1" type="radio" name="rg"><label for="r1">Option 1</label></div><div class="radio-field"><input id="r2" type="radio" name="rg"><label for="r2">Option 2</label></div></div>`,
      checkbox: `<div class="form-field"><div class="checkbox-field"><input id="cb" type="checkbox"><label for="cb" class="mb-0">Checkbox</label></div></div>`,
      multicheckbox: `<div class="form-field"><label>Multi Checkbox</label><div class="checkbox-field"><input id="m1" type="checkbox"><label for="m1">Option 1</label></div><div class="checkbox-field"><input id="m2" type="checkbox"><label for="m2">Option 2</label></div></div>`,
      date: `<div class="form-field"><label>Date</label><input type="date"></div>`,
      time: `<div class="form-field"><label>Time</label><input type="time"></div>`,
      url: `<div class="form-field"><label>Website URL</label><input type="url" placeholder="https://example.com"></div>`,
      address: `<div class="form-field"><label>Address</label><div class="address-grid" style="display:grid;grid-template-columns:1fr 1fr;gap:10px;">
        <input type="text" placeholder="Address line 1">
        <input type="text" placeholder="Address line 2">
        <input type="text" placeholder="City">
        <input type="text" placeholder="State">
        <input type="text" placeholder="Postcode">
        <input type="text" placeholder="Country">
      </div></div>`,
      image: `<div class="form-field"><label>Image Upload</label>
        <div class="upload-box" style="border:1px dashed #d0d5dd;border-radius:10px;padding:16px 20px;display:flex;align-items:center;justify-content:space-between;gap:16px;background:#fff;">
          <div style="display:flex;flex-direction:column;gap:2px;">
            <div style="font-weight:600;font-size:14px;color:#101828;">Drop image here</div>
            <div style="font-size:13px;color:#158ecc;">or click <span style="color:#158ecc;font-weight:500;">Browse</span></div>
          </div>
          <label class="upload-browse-btn" style="margin:0;cursor:pointer;padding:8px 16px;border-radius:8px;border:1px solid #d0d5dd;background:#fff;font-size:14px;font-weight:500;color:#344054;transition:all 0.2s;">
            Browse
            <input type="file" accept="image/*" style="display:none;" />
          </label>
        </div>
        <div class="upload-filename" style="margin-top:8px;font-size:12px;color:#667085;"></div>
      </div>`,
      html: `<div class="form-field html-content"><p>HTML Content</p></div>`,
      consent: `<div class="form-field"><div class="checkbox-field"><input id="consent" type="checkbox"><label for="consent" class="mb-0">I agree to the terms and conditions</label></div></div>`,
      submit_button: `<div class="form-field"><button type="submit" class="btn-primary">Submit</button></div>`,
    };
    return map[type] || map.text;
  }

  function actionBar(isRequired = false) {
    return `
      <div class="field-actions">
        <input type="checkbox" class="required-toggle" title="Required" ${
          isRequired ? "checked" : ""
        } />
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
      name: ``,
      required: false,
      visible_if: null,
      custom_class: "",
      placeholder: `Enter ${type}`,
      maxlength: "",
      regex: "",
      error_message: "",
      options: [],
    };
    if (["select", "radio", "multicheckbox"].includes(type)) {
      base.options = ["Option 1", "Option 2"];
    }
    if (type === "submit_button") {
      base.button_text = "Submit";
      base.custom_style = "";
    }
    if (type === "html") {
      base.html = "<p>HTML Content</p>";
    }
    if (type === "consent") {
      base.label = "I agree to the terms and conditions";
    }
    if (type === "address") {
      base.label = "Address";
      base.name = "address";
      base.placeholder = "";
      // NOTE: for address we store structured parts in options (object, not array)
      base.options = {
        parts: [
          {
            key: "line1",
            label: "Address Line 1",
            required: true,
            placeholder: "Address line 1",
          },
          {
            key: "line2",
            label: "Address Line 2",
            required: false,
            placeholder: "Address line 2",
          },
          { key: "city", label: "City", required: true, placeholder: "City" },
          {
            key: "state",
            label: "State",
            required: true,
            placeholder: "State",
          },
          {
            key: "postcode",
            label: "Postcode",
            required: true,
            placeholder: "Postcode",
          },
          {
            key: "country",
            label: "Country",
            required: false,
            placeholder: "Country",
          },
        ],
      };
    }
    if (type === "image") {
      base.label = "Image Upload";
      base.name = "image";
      base.placeholder = "";
      base.options = {
        accept: "image/*",
        multiple: false,
      };
    }
    return base;
  }

  function updateFieldRequiredUI(id) {
    const data = fieldsData[id];
    const host = root.querySelector(`#${id}`);
    if (!host) return;
    const type = host.dataset.type;

    // --- Action bar checkbox ---
    const actionReq = host.querySelector(".required-toggle");
    if (actionReq) actionReq.checked = !!data.required;

    // --- Properties panel checkbox ---
    const propReq = root.querySelector("#fp-req");
    if (propReq) propReq.checked = !!data.required;

    // --- Handle address field specially ---
    if (type === "address") {
      const addressGrid = host.querySelector(".address-grid");
      if (addressGrid) {
        const inputs = addressGrid.querySelectorAll("input");
        const parts = data.options?.parts || [];
        inputs.forEach((input, idx) => {
          const part = parts[idx];
          // Child input is required only if parent is required AND part.required is true
          if (data.required && part?.required) {
            input.setAttribute("required", "");
          } else {
            input.removeAttribute("required");
          }
        });
      }
    } else {
      // --- Required attribute for non-address fields ---
      host.querySelectorAll("input, textarea, select").forEach((el) => {
        if (data.required) el.setAttribute("required", "");
        else el.removeAttribute("required");
      });
    }

    // --- Required star ---
    const label = host.querySelector(".form-field > label");
    if (label) {
      let star = label.querySelector(".required-star");

      if (data.required && !star) {
        label.insertAdjacentHTML(
          "beforeend",
          ' <span class="required-star">*</span>'
        );
      } else if (!data.required && star) {
        star.remove();
      }
    }
  }

  function wireField(el, id, type) {
    el.addEventListener("click", (e) => {
      if (!e.target.closest(".field-actions")) selectField(id, type);
    });
    const reqToggle = el.querySelector(".required-toggle");
    if (reqToggle) {
      reqToggle.addEventListener("change", (e) => {
        fieldsData[id].required = e.target.checked;

        // sync preview + properties
        updateFieldRequiredUI(id);

        saveHistory();
      });
    }
    el.querySelector(".remove-field").addEventListener("click", () => {
      delete fieldsData[id];
      el.remove();
      updateMoveButtons();

      // Save to history after removing field
      saveHistory();

      // If the removed field was selected, clear selection
      if (currentField === id) {
        properties.classList.remove("has-selection");
        // Reset to placeholder
        const placeholder = properties.querySelector(
          ".field-props-placeholder"
        );
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
      const remainingFields = preview.querySelectorAll(".preview-field");
      const emptyState = preview.querySelector(".empty-state");
      if (remainingFields.length === 0 && emptyState) {
        emptyState.style.display = "flex";
      }
    });
    el.querySelector(".move-field-up").addEventListener("click", (e) => {
      e.stopPropagation();
      if (
        el.previousElementSibling &&
        el.previousElementSibling.classList.contains("preview-field")
      ) {
        el.parentNode.insertBefore(el, el.previousElementSibling);
      }
      reindex();
      updateMoveButtons();
      saveHistory(); // Save to history after moving
    });
    el.querySelector(".move-field-down").addEventListener("click", (e) => {
      e.stopPropagation();
      const next = el.nextElementSibling;
      if (next && next.classList.contains("preview-field")) {
        el.parentNode.insertBefore(next, el);
      }
      reindex();
      updateMoveButtons();
      saveHistory(); // Save to history after moving
    });
    el.querySelector(".edit-field").addEventListener("click", (e) => {
      e.stopPropagation();
      selectField(id, type);
    });
  }

  function reindex() {
    const newOrder = {};
    preview.querySelectorAll(".preview-field").forEach((node) => {
      newOrder[node.id] = fieldsData[node.id];
    });
    fieldsData = newOrder;
    updateMoveButtons();
  }

  function updateMoveButtons() {
    const nodes = Array.from(preview.querySelectorAll(".preview-field"));
    nodes.forEach((node, idx) => {
      const upBtn = node.querySelector(".move-field-up");
      const downBtn = node.querySelector(".move-field-down");
      if (upBtn) upBtn.disabled = idx === 0;
      if (downBtn) downBtn.disabled = idx === nodes.length - 1;
    });
  }

  function selectField(id, type) {
    currentField = id;
    const data = fieldsData[id];

    // Remove selected class from all fields
    preview
      .querySelectorAll(".preview-field")
      .forEach((f) => f.classList.remove("selected"));
    // Add selected class to current field
    const selectedEl = preview.querySelector(`#${id}`);
    if (selectedEl) selectedEl.classList.add("selected");

    // Add has-selection class to properties container
    properties.classList.add("has-selection");

    // Find or create field properties container
    let fieldPropsContainer = properties.querySelector(
      ".field-props-placeholder"
    );
    if (!fieldPropsContainer) {
      fieldPropsContainer = document.createElement("div");
      fieldPropsContainer.className = "field-props-placeholder";
      properties.insertBefore(fieldPropsContainer, properties.firstChild);
    }

    fieldPropsContainer.innerHTML = `
      <div class="panel-header">
        <h2>Properties</h2>
      </div>
      <div class="property-group">
        <h3>Basic</h3>
        <label>Label <input id="fp-label" value="${escapeHtml(
          data.label
        )}"></label>
        <label>CSS class (optional)
          <input id="fp-class" value="${escapeAttr(data.custom_class || "")}" placeholder="e.g. contact-form__field" />
        </label>
        <p class="help-text">
          Optional. Adds a class on this field wrapper so your website can style it. Leave blank if you’re not sure.
        </p>
        ${
          ["text", "email", "number", "phone", "url", "textarea"].includes(type)
            ? `<label>Placeholder <input id="fp-ph" value="${escapeHtml(
                data.placeholder || ""
              )}"></label>`
            : ""
        }
        ${
          ["text", "email", "number", "phone", "url", "textarea"].includes(type)
            ? `<label>Max Length <input id="fp-max" min="0" type="number" value="${escapeAttr(
                data.maxlength || ""
              )}"></label>`
            : ""
        }
        ${
          ["text", "email", "number", "phone", "url", "textarea"].includes(type)
            ? `
          <div class="property-subtle">
            <label>Validation Pattern (Regex)
              <input id="fp-regex" placeholder="e.g. ^[A-Za-z]{3,}$" value="${escapeAttr(
                data.regex || ""
              )}">
            </label>
            <p class="help-text text-start">Optional. Add a regex pattern for validation.</p>
            <label>Regex Error Message <span id="fp-errmsg-required" class="required" style="display: ${
              data.regex ? "inline" : "none"
            };">*</span>
              <input id="fp-errmsg" placeholder="e.g. Please enter only letters" value="${escapeAttr(
                data.error_message || ""
              )}" style="border-color: ${
                data.regex && !data.error_message ? "#dc3545" : ""
              };">
            </label>
            <p class="help-text">Required when Validation Pattern is set. Custom message to show when validation fails.</p>
          </div>`
            : ""
        }
        <label class="inline"><input type="checkbox" id="fp-req" ${
          data.required ? "checked" : ""
        }> <span>Required</span></label>
      </div>
      ${(() => {
        // Only show conditional section if there are eligible controller fields
        if (type === "submit_button") return "";
        const allowedTypes = ["select", "radio", "multicheckbox", "checkbox", "consent"];
        const eligibleControllers = Object.keys(fieldsData)
          .filter((fid) => fid !== id)
          .map((fid) => fieldsData[fid])
          .filter((d) => allowedTypes.includes(d.field_type || d.type));
        if (eligibleControllers.length === 0) return "";
        return `
      <div class="property-group" id="fp-conditional-group">
        <h3>Conditional</h3>
        <label class="inline">
          <input type="checkbox" id="fp-cond-enabled" ${
            data.visible_if ? "checked" : ""
          }>
          <span>Show this field conditionally</span>
        </label>
        <div id="fp-cond-wrap" style="display:${
          data.visible_if ? "block" : "none"
        }; margin-top: 12px;">
          <label>Controlling field
            <select id="fp-cond-field"></select>
          </label>
          <label>Value
            <select id="fp-cond-value"></select>
          </label>
        </div>
        <p class="help-text">Show this field only when the selected field above has a specific value.</p>
      </div>
      `;
      })()}
      ${
        type === "image"
          ? `
        <div class="property-group">
          <h3>Upload</h3>
          <label>Allowed types
            <input id="fp-accept" value="${escapeAttr(
              (data.options && !Array.isArray(data.options) && data.options.accept) || "image/*"
            )}" placeholder="image/*">
          </label>
          <label class="inline" style="margin-top:8px;">
            <input type="checkbox" id="fp-multiple" ${
              data.options && !Array.isArray(data.options) && data.options.multiple ? "checked" : ""
            }>
            <span>Allow multiple</span>
          </label>
          <p class="help-text">Frontend-only. Stored in form JSON for renderer.</p>
        </div>`
          : ""
      }
      ${
        ["select", "radio", "multicheckbox"].includes(type)
          ? `
        <div class="property-group">
          <h3>Options</h3>
          <div id="fp-options"></div>
          <button id="fp-addopt" type="button" class="fp-addopt">Add Option</button>
        </div>`
          : ""
      }
      ${
        type === "html"
          ? `
        <div class="property-group">
          <h3>HTML</h3>
          <textarea id="fp-html" rows="5">${escapeHtml(
            data.html || ""
          )}</textarea>
        </div>`
          : ""
      }
      ${
        type === "submit_button"
          ? `
        <div class="property-group">
          <h3>Button</h3>
          <label>Text <input id="fp-btntext" value="${escapeHtml(
            data.button_text || "Submit"
          )}"></label>
          <label>Style (CSS) <textarea id="fp-btncss" rows="3">${escapeHtml(
            data.custom_style || ""
          )}</textarea></label>
        </div>`
          : ""
      }
      <div class="property-group"><button id="fp-apply" type="button">Update Field</button></div>
    `;

    // Helper function to update preview in real-time - Comprehensive
    const updateFieldPreview = () => {
      const host = root.querySelector("#" + id);
      if (!host) return;

      // Update label
      const label = host.querySelector(
        ".form-field > label, .checkbox-field label"
      );
      if (label) label.textContent = data.label;

      // Update text-like inputs (text, email, number, phone, url, date, time)
      if (
        ["text", "email", "number", "phone", "url", "date", "time"].includes(
          type
        )
      ) {
        const input = host.querySelector("input");
        if (input) {
          if (data.placeholder) input.placeholder = data.placeholder;
          if (data.maxlength && !isNaN(data.maxlength) && data.maxlength > 0) {
            input.maxLength = parseInt(data.maxlength, 10);
          }
          if (data.required) input.setAttribute("required", "");
          else input.removeAttribute("required");
        }
      }
      // Update textarea
      else if (type === "textarea") {
        const ta = host.querySelector("textarea");
        if (ta) {
          if (data.placeholder) ta.placeholder = data.placeholder;
          if (data.maxlength && !isNaN(data.maxlength) && data.maxlength > 0) {
            ta.maxLength = parseInt(data.maxlength, 10);
          }
          if (data.required) ta.setAttribute("required", "");
          else ta.removeAttribute("required");
        }
      }
      else if (type === "image") {
        const lbl = host.querySelector(".form-field > label");
        if (lbl) lbl.textContent = data.label;

        const fileInput = host.querySelector('input[type="file"]');
        if (fileInput) {
          const accept =
            data?.options && !Array.isArray(data.options)
              ? data.options.accept
              : "image/*";
          fileInput.setAttribute("accept", accept || "image/*");

          if (data?.options && !Array.isArray(data.options) && data.options.multiple) {
            fileInput.setAttribute("multiple", "");
          } else {
            fileInput.removeAttribute("multiple");
          }

          if (data.required) fileInput.setAttribute("required", "");
          else fileInput.removeAttribute("required");
        }
      }
      // Update select
      else if (type === "select") {
        const sel = host.querySelector("select");
        if (sel) {
          sel.innerHTML =
            `<option value="">${
              data.placeholder || "Select an option"
            }</option>` +
            (data.options || [])
              .map((o) => `<option>${escapeHtml(o)}</option>`)
              .join("");
          if (data.required) sel.setAttribute("required", "");
          else sel.removeAttribute("required");
        }
      }
      // Update radio buttons
      else if (type === "radio") {
        normalizeOptionFieldDom(host, id, type, data);
      }
      // Update multicheckbox
      else if (type === "multicheckbox") {
        normalizeOptionFieldDom(host, id, type, data);
      }
      // Update checkbox
      else if (type === "checkbox") {
        const cbl = host.querySelector(".checkbox-field label");
        if (cbl) cbl.textContent = data.label;
        const cbinput = host.querySelector(".checkbox-field input");
        if (cbinput) {
          if (data.required) cbinput.setAttribute("required", "");
          else cbinput.removeAttribute("required");
        }
      }
      // Update consent
      else if (type === "consent") {
        const cbl = host.querySelector(".checkbox-field label");
        if (cbl) cbl.textContent = data.label;
        const cbinput = host.querySelector(".checkbox-field input");
        if (cbinput) {
          if (data.required) cbinput.setAttribute("required", "");
          else cbinput.removeAttribute("required");
        }
      }
      // Update button
      else if (type === "submit_button") {
        const btn = host.querySelector("button");
        if (btn) {
          btn.textContent = data.button_text || "Submit";
          if (data.custom_style) btn.setAttribute("style", data.custom_style);
          else btn.removeAttribute("style");
        }
      }
      // Update HTML
      else if (type === "html") {
        const block = host.querySelector(".html-content");
        if (block) block.innerHTML = data.html || "<p></p>";
      }

      applyConditionalVisibilityRecursively();
    };

    if (["select", "radio", "multicheckbox"].includes(type)) {
      const wrap = root.querySelector("#fp-options");

      const renderOptions = () => {
        wrap.innerHTML = "";
        (data.options || []).forEach((opt, i) => {
          const row = document.createElement("div");
          row.innerHTML = `<input data-i="${i}" value="${escapeAttr(
            opt
          )}"> <button data-i="${i}" class="rm" type="button">x</button>`;
          wrap.appendChild(row);
        });
      };

      renderOptions();

      root.querySelector("#fp-addopt").onclick = () => {
        data.options.push(`Option ${data.options.length + 1}`);
        renderOptions();
        attachRealtimeListeners(); // Re-attach listeners to new options
        updateFieldPreview(); // Update preview
        saveHistory();
      };

      wrap.addEventListener("click", (e) => {
        if (e.target.classList.contains("rm")) {
          const i = +e.target.dataset.i;
          data.options.splice(i, 1);
          renderOptions();
          updateFieldPreview(); // Update preview when option removed
          saveHistory();
        }
      });

      wrap.addEventListener("input", (e) => {
        if (e.target.matches("input[data-i]")) {
          data.options[+e.target.dataset.i] = e.target.value;
          updateFieldPreview(); // Update preview when option text changed
          saveHistory();
        }
      });
    }

    // ----- Conditional visibility UI (visible_if) -----
    const getConditionalControllers = () => {
      // Controllers are fields that have discrete options (including yes/no checkboxes)
      const allowed = new Set([
        "select",
        "radio",
        "multicheckbox",
        "checkbox",
        "consent",
      ]);
      return Object.keys(fieldsData)
        .filter((fid) => fid !== id)
        .map((fid) => ({ id: fid, data: fieldsData[fid] }))
        .filter(({ data }) => allowed.has(data.field_type || data.type));
    };

    const renderConditionalUI = () => {
      const enabledEl = root.querySelector("#fp-cond-enabled");
      const wrapEl = root.querySelector("#fp-cond-wrap");
      const fieldSel = root.querySelector("#fp-cond-field");
      const valueSel = root.querySelector("#fp-cond-value");
      if (!enabledEl || !wrapEl || !fieldSel || !valueSel) return;

      const controllers = getConditionalControllers();

      // Populate controlling field select
      fieldSel.innerHTML = controllers.length
        ? controllers
            .map((c) => {
              const label = c.data.label || c.id;
              return `<option value="${c.id}">${escapeHtml(label)}</option>`;
            })
            .join("")
        : `<option value="">No eligible fields</option>`;

      // Decide current controller
      let currentControllerId = controllers[0]?.id || "";

      if (data.visible_if?.field_name) {
        const match = controllers.find(
          (c) => (c.data.name || "").trim() === data.visible_if.field_name
        );
        if (match) currentControllerId = match.id;
      } else if (data.visible_if?.field_id) {
        currentControllerId = data.visible_if.field_id;
      }

      if (currentControllerId) fieldSel.value = currentControllerId;

      const controller = controllers.find((c) => c.id === fieldSel.value);
      let opts = [];
      const controllerType =
        controller?.data?.field_type || controller?.data?.type;

      if (controllerType === "checkbox" || controllerType === "consent") {
        opts = ["Checked", "Unchecked"];
      } else {
        opts = Array.isArray(controller?.data?.options)
          ? controller.data.options
          : [];
      }

      valueSel.innerHTML = opts.length
        ? opts
            .map(
              (o) =>
                `<option value="${escapeAttr(o)}">${escapeHtml(o)}</option>`
            )
            .join("")
        : `<option value="">No options</option>`;

      if (data.visible_if?.value) {
        valueSel.value = data.visible_if.value;
      }

      // If enabled but no controllers, force disable the UI
      if (!controllers.length) {
        enabledEl.checked = false;
        wrapEl.style.display = "none";
        data.visible_if = null;
      }
    };

    // Initial render
    renderConditionalUI();

    // Wire conditional enable/disable toggle explicitly
    const condEnabledEl = root.querySelector("#fp-cond-enabled");
    const condWrapEl = root.querySelector("#fp-cond-wrap");

    if (condEnabledEl && condWrapEl) {
      condEnabledEl.addEventListener("change", (e) => {
        const enabled = e.target.checked;

        if (!enabled) {
          data.visible_if = null;
          condWrapEl.style.display = "none";
        } else {
          // initialize with defaults if enabling
          const controllers = Object.keys(fieldsData)
            .filter((fid) => fid !== id)
            .map((fid) => ({ id: fid, data: fieldsData[fid] }))
            .filter(({ data }) =>
              ["select", "radio", "multicheckbox", "checkbox", "consent"].includes(
                data.field_type || data.type
              )
            );

          if (controllers.length) {
            const controllerType = controllers[0].data.field_type || controllers[0].data.type;
            let initialValue = "";
            if (controllerType === "checkbox" || controllerType === "consent") {
              initialValue = "Checked";
            } else {
              initialValue = controllers[0].data.options?.[0] || "";
            }
            data.visible_if = {
              field_id: controllers[0].id,
              field_name: (controllers[0].data?.name || "").trim(),
              operator: "equals",
              value: initialValue,
            };
            condWrapEl.style.display = "block";
            // Re-render to show the controller and value dropdowns
            renderConditionalUI();
          } else {
            // no valid controllers → auto-disable
            e.target.checked = false;
            data.visible_if = null;
            condWrapEl.style.display = "none";
          }
        }

        applyConditionalVisibilityRecursively();
        saveHistory();
      });
    }

    // Real-time property updates with event listeners
    const attachRealtimeListeners = () => {
      const labelEl = root.querySelector("#fp-label");
      const phEl = root.querySelector("#fp-ph");
      const isRequiredEl = root.querySelector("#fp-req");
      const classEl = root.querySelector("#fp-class");
      const condFieldEl = root.querySelector("#fp-cond-field");
      const condValueEl = root.querySelector("#fp-cond-value");
      const maxEl = root.querySelector("#fp-max");
      const regexEl = root.querySelector("#fp-regex");
      const errmsgEl = root.querySelector("#fp-errmsg");
      const htmlEl = root.querySelector("#fp-html");
      const btntextEl = root.querySelector("#fp-btntext");
      const btncssEl = root.querySelector("#fp-btncss");
      const acceptEl = root.querySelector("#fp-accept");
      const multipleEl = root.querySelector("#fp-multiple");

      if (labelEl) {
        labelEl.addEventListener("input", (e) => {
          data.label = e.target.value;
          updateFieldPreview();
          saveHistory();
        });
      }
      if (classEl) {
        classEl.addEventListener("input", (e) => {
          data.custom_class = e.target.value;
          saveHistory();
        });
      }
      if (phEl) {
        phEl.addEventListener("input", (e) => {
          data.placeholder = e.target.value;
          updateFieldPreview();
          saveHistory();
        });
      }
      if (isRequiredEl) {
        isRequiredEl.addEventListener("change", (e) => {
          data.required = e.target.checked;
          updateFieldPreview();
          updateFieldRequiredUI(id);
          saveHistory();
        });
      }
      if (maxEl) {
        maxEl.addEventListener("input", (e) => {
          data.maxlength = e.target.value;
          updateFieldPreview();
          saveHistory();
        });
      }
      if (regexEl) {
        regexEl.addEventListener("input", (e) => {
          data.regex = e.target.value;

          // Show/hide required indicator for error message
          const requiredSpan = root.querySelector("#fp-errmsg-required");
          const errmsgInput = root.querySelector("#fp-errmsg");

          if (requiredSpan) {
            requiredSpan.style.display = data.regex ? "inline" : "none";
          }

          // Highlight error message field if regex is set but error message is empty
          if (errmsgInput) {
            if (data.regex && !data.error_message) {
              errmsgInput.style.borderColor = "#dc3545";
            } else {
              errmsgInput.style.borderColor = "";
            }
          }

          saveHistory();
        });
      }
      if (errmsgEl) {
        errmsgEl.addEventListener("input", (e) => {
          data.error_message = e.target.value;

          // Remove red border when error message is filled
          if (data.regex && data.error_message) {
            e.target.style.borderColor = "";
          } else if (data.regex && !data.error_message) {
            e.target.style.borderColor = "#dc3545";
          }

          saveHistory();
        });
      }
      if (htmlEl) {
        htmlEl.addEventListener("input", (e) => {
          data.html = e.target.value;
          updateFieldPreview();
          saveHistory();
        });
      }
      if (btntextEl) {
        btntextEl.addEventListener("input", (e) => {
          data.button_text = e.target.value || "Submit";
          updateFieldPreview();
          saveHistory();
        });
      }
      if (btncssEl) {
        btncssEl.addEventListener("input", (e) => {
          data.custom_style = e.target.value || "";
          updateFieldPreview();
          saveHistory();
        });
      }
      if (acceptEl) {
        acceptEl.addEventListener("input", (e) => {
          if (!data.options || Array.isArray(data.options)) {
            data.options = { accept: "image/*", multiple: false };
          }
          data.options.accept = e.target.value || "image/*";
          updateFieldPreview();
          saveHistory();
        });
      }

      if (multipleEl) {
        multipleEl.addEventListener("change", (e) => {
          if (!data.options || Array.isArray(data.options)) {
            data.options = { accept: "image/*", multiple: false };
          }
          data.options.multiple = !!e.target.checked;
          updateFieldPreview();
          saveHistory();
        });
      }

      if (condFieldEl) {
        condFieldEl.addEventListener("change", (e) => {
          const newControllerId = e.target.value;

          // Update first, then re-render
          const controller = Object.keys(fieldsData)
            .map((fid) => ({ id: fid, data: fieldsData[fid] }))
            .find((x) => x.id === newControllerId);

          data.visible_if = {
            field_id: newControllerId,
            field_name: (controller?.data?.name || "").trim(),
            operator: "equals",
            value: data.visible_if?.value || "",
          };

          // Re-render values for this controller
          renderConditionalUI();

          // Pull current value after re-render
          const valueSel = root.querySelector("#fp-cond-value");
          const value = valueSel ? valueSel.value : "";
          data.visible_if.value = value;

          applyConditionalVisibilityRecursively();
          saveHistory();
        });
      }

      if (condValueEl) {
        condValueEl.addEventListener("change", (e) => {
          if (data.visible_if) {
            data.visible_if.value = e.target.value;
            data.visible_if.operator = "equals";
            applyConditionalVisibilityRecursively();
            saveHistory();
          }
        });
      }
    };

    // Attach listeners and hide the update button
    setTimeout(() => {
      attachRealtimeListeners();
      const applyBtn = root.querySelector("#fp-apply");
      if (applyBtn) {
        applyBtn.style.display = "none";
      }
    }, 0);
  }

  // Deselect field and hide properties
  function deselectField() {
    currentField = null;
    // Remove selected class from all fields
    preview
      .querySelectorAll(".preview-field")
      .forEach((f) => f.classList.remove("selected"));

    // Remove has-selection class from properties container
    properties.classList.remove("has-selection");

    // Reset to placeholder
    const placeholder = properties.querySelector(".field-props-placeholder");
    if (placeholder) {
      placeholder.innerHTML = `
        <div class="panel-header">
          <h2>Properties</h2>
        </div>
        <div class="no-selection">
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" opacity="0.2">
            <rect x="3" y="5" width="18" height="14" rx="2" />
            <path d="M7 10h10M7 14h6" />
          </svg>
          <p>Select a field to edit its properties</p>
        </div>
      `;
    }
  }

  // Click outside handler to deselect fields
  properties.addEventListener("click", (e) => {
    // Check if click is outside of any input/select/textarea within properties
    const isClickInProperties = e.target.closest(
      ".property-group, .field-props-placeholder, .general-settings"
    );
    if (!isClickInProperties) {
      deselectField();
    }
  });

  // Also handle clicks on the preview area background to deselect
  preview.addEventListener("click", (e) => {
    // If click is not on a preview-field or its action buttons, deselect
    const clickedField = e.target.closest(".preview-field");
    if (!clickedField) {
      deselectField();
    }
  });

  // Preview modal and tab

  if (previewBtn) {
    previewBtn.addEventListener("click", () => {
      // Get fields in DOM order to maintain correct sequence
      const orderedFields = [];
      preview.querySelectorAll(".preview-field").forEach((el) => {
        const fieldId = el.id;
        if (fieldsData[fieldId]) {
          orderedFields.push(fieldsData[fieldId]);
        }
      });
      
      const html = renderPreview(orderedFields);

      // Only update tab preview (don't show modal)
      const tabPreviewContainer = root.querySelector(
        "#preview-form-container-tab"
      );
      if (tabPreviewContainer) {
        const formTitleEl = root.querySelector("#form-title");
        const formDescriptionEl = root.querySelector("#form-description");
        const title = document.createElement("h6");
        title.textContent = formTitleEl
          ? formTitleEl.value || "Title"
          : "Title";
        const desc = document.createElement("small");
        desc.style.color = "#6b7280";
        desc.textContent = formDescriptionEl
          ? formDescriptionEl.value || "Description"
          : "Description";

        let htmlWithHeader = `<b>${escapeHtml(title.textContent)}</b>`;
        if (desc.textContent) {
          htmlWithHeader += `<small style="color: #6b7280;display: block;">${escapeHtml(
            desc.textContent
          )}</small>`;
        }
        htmlWithHeader += html;

        tabPreviewContainer.innerHTML = htmlWithHeader;

        // Add conditional visibility handler
        applyPreviewConditionalVisibility(tabPreviewContainer);
        
        // Listen for changes to update visibility
        tabPreviewContainer.addEventListener("change", () => {
          applyPreviewConditionalVisibility(tabPreviewContainer);
        });

        // Add validation handler to submit button
        setTimeout(() => {
          const submitBtn = tabPreviewContainer.querySelector(
            ".preview-submit-btn"
          );
          if (submitBtn) {
            submitBtn.addEventListener("click", (e) => {
              e.preventDefault();
              const form = submitBtn.closest("form");
              if (form && form.checkValidity()) {
                alert(
                  "Form is valid! (This is a preview - form will not be submitted)"
                );
              } else {
                form.reportValidity();
              }
            });
          }
        }, 100);
      }
    });
  }
  
  // Apply conditional visibility in preview mode
  function applyPreviewConditionalVisibility(container) {
    const conditionalFields = container.querySelectorAll("[data-visible-if]");
    
    conditionalFields.forEach((field) => {
      try {
        const visibleIf = JSON.parse(field.dataset.visibleIf);
        const { controller_name, value: expectedValue } = visibleIf;
        
        if (!controller_name || expectedValue == null || expectedValue === "") {
          field.style.display = "";
          return;
        }
        
        // Find the controller field by name
        let actualValue = null;
        let controllerFound = false;
        
        // Check for radio buttons
        const radios = container.querySelectorAll(`input[type="radio"][name="${controller_name}"]`);
        
        if (radios.length > 0) {
          controllerFound = true;
          const checkedRadio = container.querySelector(`input[type="radio"][name="${controller_name}"]:checked`);
          if (checkedRadio) {
            const label = container.querySelector(`label[for="${checkedRadio.id}"]`);
            actualValue = label ? label.textContent.trim() : checkedRadio.value;
          } else {
            // No radio selected - hide conditional field
            field.style.display = "none";
            return;
          }
        }
        
        // Check for select
        const select = container.querySelector(`select[name="${controller_name}"]`);
        if (select && !controllerFound) {
          controllerFound = true;
          const opt = select.options[select.selectedIndex];
          // Only count as having a value if not the placeholder option
          if (opt && opt.value !== "") {
            actualValue = opt.textContent.trim();
          } else {
            // No option selected - hide conditional field
            field.style.display = "none";
            return;
          }
        }
        
        // Check for checkboxes (single checkbox)
        const checkbox = container.querySelector(`input[type="checkbox"][name="${controller_name}"]`);
        if (checkbox && !controllerFound) {
          controllerFound = true;
          actualValue = checkbox.checked ? "Checked" : "Unchecked";
        }
        
        // Check for multi-checkboxes
        const multiCheckboxes = container.querySelectorAll(`input[type="checkbox"][name="${controller_name}[]"]:checked`);
        if (multiCheckboxes.length > 0) {
          const values = Array.from(multiCheckboxes).map((cb) => {
            const label = container.querySelector(`label[for="${cb.id}"]`);
            return label ? label.textContent.trim() : cb.value;
          });
          // Show if expected value is in the checked values
          field.style.display = values.includes(expectedValue) ? "" : "none";
          return;
        }
        
        // If controller not found, hide field
        if (!controllerFound) {
          field.style.display = "none";
          return;
        }
        
        // Compare values - show only if value matches
        if (actualValue === expectedValue) {
          field.style.display = "";
        } else {
          field.style.display = "none";
        }
      } catch (e) {
        console.error("Error parsing visible_if:", e);
        field.style.display = "";
      }
    });
  }
  root.querySelectorAll(".modal-close").forEach((btn) => {
    btn.addEventListener(
      "click",
      () => (btn.closest(".modal").style.display = "none")
    );
  });
  // Initial move button state (in case of zero nodes, this is a no-op)
  updateMoveButtons();

  // Seed default first four fields for brand-new forms
  if (!initialForm && preview.querySelectorAll(".preview-field").length === 0) {
    seedDefaultFields();
  }

  function renderPreview(fields) {
    let out = `<form class="preview-form-rendered">`;

    // Create a map of field names for conditional visibility
    const fieldNameMap = {};
    fields.forEach((f) => {
      if (f.name) fieldNameMap[f.name] = f;
    });

    fields.forEach((f) => {
      const t = f.field_type || f.type;
      
      // Build visible_if data attribute if this field has conditional visibility
      let visibleIfAttr = "";
      if (f.visible_if && f.visible_if.field_name && f.visible_if.value) {
        const visibleIfData = {
          controller_name: f.visible_if.field_name,
          value: f.visible_if.value
        };
        visibleIfAttr = ` data-visible-if='${JSON.stringify(visibleIfData).replace(/'/g, "&apos;")}'`;
      }

      if (t === "address") {
        const parts =
          f.options && !Array.isArray(f.options) && f.options.parts
            ? f.options.parts
            : [];

        const customClass = (f.custom_class || "").trim();
        out += `<div class="form-field ${f.required ? "required" : ""}${customClass ? " " + escapeAttr(customClass) : ""}"${visibleIfAttr}>`;
        
        out += `<label>${escapeHtml(f.label || "Address")}${
          f.required ? '<span class="required-star">*</span>' : ""
        }</label>`;
        out += `<div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;">`;
        parts.forEach((p) => {
          // Child is required only if parent is required AND part.required is true
          const isChildRequired = f.required && p.required;
          out += `<div class="form-field">`;
          out += `<label>${escapeHtml(p.label || p.key || "")}${
            isChildRequired ? '<span class="required-star">*</span>' : ""
          }</label>`;
          out += `<input type="text" placeholder="${escapeAttr(
            p.placeholder || ""
          )}" ${isChildRequired ? "required" : ""} />`;
          out += `</div>`;
        });
        out += `</div>`;
        out += `</div>`;
        return;
      }
      if (t === "image") {
        const accept =
          f.options && !Array.isArray(f.options) ? (f.options.accept || "image/*") : "image/*";
        const multiple =
          f.options && !Array.isArray(f.options) ? !!f.options.multiple : false;


        const customClass = (f.custom_class || "").trim();
        out += `<div class="form-field ${f.required ? "required" : ""}${customClass ? " " + escapeAttr(customClass) : ""}"${visibleIfAttr}>`;


        out += `<label>${escapeHtml(f.label || "Image Upload")}${
          f.required ? '<span class="required-star">*</span>' : ""
        }</label>`;
        out += `<input type="file" accept="${escapeAttr(accept)}" ${multiple ? "multiple" : ""} ${
          f.required ? "required" : ""
        } />`;
        out += `</div>`;
        return;
      }

      if (t === "html") {
        out += `<div class="form-field html-content"${visibleIfAttr}>${f.html || ""}</div>`;
        return;
      }

      const customClass = (f.custom_class || "").trim();
      out += `<div class="form-field ${f.required ? "required" : ""}${customClass ? " " + escapeAttr(customClass) : ""}"${visibleIfAttr}>`;

      // LABEL (with required star)
      if (!["checkbox", "consent"].includes(t)) {
        out += `<label>
        ${escapeHtml(f.label || "")}
        ${f.required ? '<span class="required-star">*</span>' : ""}
      </label>`;
      }

      // INPUT TYPES
      if (
        ["text", "email", "number", "phone", "url", "date", "time"].includes(t)
      ) {
        const inputType = t === "phone" ? "tel" : t;
        out += `<input 
        type="${inputType}" 
        placeholder="${escapeAttr(f.placeholder || "")}" 
        ${f.maxlength ? `maxlength="${f.maxlength}"` : ""} 
        ${f.required ? "required" : ""} 
      />`;
      } else if (t === "textarea") {
        out += `<textarea 
        placeholder="${escapeAttr(f.placeholder || "")}" 
        ${f.required ? "required" : ""}>
      </textarea>`;
      } else if (t === "select") {
        out += `<select name="${escapeAttr(f.name)}" ${f.required ? "required" : ""}>
        <option value="">
          ${escapeHtml(f.placeholder || "Select an option")}
        </option>
        ${(f.options || [])
          .map((o) => `<option>${escapeHtml(o)}</option>`)
          .join("")}
      </select>`;
      } else if (t === "radio") {
        out += (f.options || [])
          .map(
            (o, i) => `
          <div class="radio-field">
            <input type="radio" id="${escapeAttr(f.name)}-${i}" name="${escapeAttr(f.name)}">
            <label for="${escapeAttr(f.name)}-${i}">
              ${escapeHtml(o)}
            </label>
          </div>`
          )
          .join("");
      } else if (t === "multicheckbox") {
        out += (f.options || [])
          .map(
            (o, i) => `
          <div class="checkbox-field">
            <input type="checkbox" id="${escapeAttr(f.name)}-${i}" name="${escapeAttr(f.name)}[]">
            <label for="${escapeAttr(f.name)}-${i}">
              ${escapeHtml(o)}
            </label>
          </div>`
          )
          .join("");
      } else if (t === "checkbox" || t === "consent") {
        out += `
        <div class="checkbox-field">
          <input type="checkbox" id="${f.name}" name="${escapeAttr(f.name)}" ${f.required ? "required" : ""}>
          <label for="${f.name}">
            ${escapeHtml(f.label || "")}
            ${f.required ? '<span class="required-star">*</span>' : ""}
          </label>
        </div>
      `;
      } else if (t === "submit_button") {
        out += `<button 
        type="button" 
        class="preview-submit-btn" 
        style="${escapeAttr(f.custom_style || "")}">
        ${escapeHtml(f.button_text || "Submit")}
      </button>`;
      }

      out += `</div>`;
    });

    // Safety submit button in preview
    if (!fields.some((f) => (f.type || f.field_type) === "submit_button")) {
      out += `
      <div class="form-field">
        <button type="button" class="preview-submit-btn">Submit</button>
      </div>
    `;
    }

    out += `</form>`;
    return out;
  }

  // Save -> API
  saveBtn.addEventListener("click", async () => {
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
    window.dispatchEvent(new CustomEvent("builder-clear-error"));

    try {
      // Validate form title
      const titleEl = root.querySelector("#form-title");
      if (!titleEl || !titleEl.value.trim()) {
        throw new Error("Form title is required");
      }

      // Validate Submit To email
      const submitToEl = root.querySelector("#form-submit-to");
      if (!submitToEl || !submitToEl.value.trim()) {
        throw new Error("Submit To email address is required");
      }

      // Get form type
      const formTypeEl = root.querySelector("#form-type");
      const formType = formTypeEl?.value || "web";

      // Only validate reCAPTCHA fields for 'web' type forms
      if (formType === "web") {
        // Enforce Google reCAPTCHA site key required
        const siteKeyEl = root.querySelector("#form-recaptcha-key");
        if (!siteKeyEl || !siteKeyEl.value.trim()) {
          throw new Error("Google reCAPTCHA site key is required");
        }
        // Enforce Google reCAPTCHA secret key required
        const secretKeyEl = root.querySelector("#form-recaptcha-secret");
        if (!secretKeyEl || !secretKeyEl.value.trim()) {
          throw new Error("Google reCAPTCHA secret key is required");
        }
      }

      // Check if form has at least one field
      const fieldCount = Object.keys(fieldsData).length;
      if (fieldCount === 0) {
        throw new Error("Please add at least one field to your form");
      }

      // Validate that name and email fields are present and required
      const fields = Object.values(fieldsData);
      console.log("fields: ", fields);
      const nameField = fields.find((f) => f.name?.toLowerCase() === "name");
      const emailField = fields.find((f) => f.name?.toLowerCase() === "email");

      if (!nameField) {
        throw new Error(
          'A "name" field is required. Please add a field with name "name".'
        );
      }
      if (!nameField.required) {
        throw new Error('The "name" field must be marked as required.');
      }

      if (!emailField) {
        throw new Error(
          'An "email" field is required. Please add a field with name "email".'
        );
      }
      if (!emailField.required) {
        throw new Error('The "email" field must be marked as required.');
      }

      // Validate that if regex is set, error_message is required
      Object.values(fieldsData).forEach((field) => {
        if (field.regex && field.regex.trim() && !field.error_message) {
          throw new Error(
            `Field "${field.label}" has a Validation Pattern but is missing a Custom Error Message. Custom Error Message is required when Validation Pattern is set.`
          );
        }
      });

      // Validate that field names are unique (no duplicates)
      const fieldNames = Object.values(fieldsData)
        .map((f) => (f.name || "").trim())
        .filter((name) => name); // Filter out empty names

      const duplicateNames = fieldNames.filter(
        (name, idx, arr) => arr.indexOf(name) !== idx
      );
      if (duplicateNames.length > 0) {
        throw new Error(
          `Duplicate field name(s) found: "${duplicateNames.join(
            '", "'
          )}". Each field must have a unique name.`
        );
      }

      const payload = buildApiPayload();
      const json = currentFormId
        ? await updateFormToApi(currentFormId, payload)
        : await saveFormToApi(payload);

      // If we just created, remember the id so next saves will update
      if (!currentFormId && json && json.id) {
        currentFormId = json.id;
      }

      // Get public_key and determine content to show based on form type
      const publicKey = json?.public_key || json?.id;
      const savedFormType = formTypeEl?.value || "web";

      // Build embed code or direct link based on form type
      let contentToShow;
      if (savedFormType === "form") {
        // For type "form", show the direct link
        const apiBase =
          process.env.REACT_APP_BACKEND_API_URL ||
          "https://app.memate.com.au/api/v1";
        contentToShow = `${apiBase}/inquiries/form/page/${publicKey}/`;
      } else {
        // For type "web", show the embed code using the domain from response
        const host = process.env.REACT_APP_URL || window.location.origin;
        contentToShow =
          `<script src="${host}/astatic/inquiries/embed.js" data-form-id="${publicKey}"></` +
          `script>`;
      }

      const embedModal = root.querySelector("#embed-modal");
      const snippetEl = root.querySelector("#embed-snippet");
      const copyBtn = root.querySelector("#copy-embed-btn");
      const closeBtn = root.querySelector("#close-embed-btn");
      const xBtn = embedModal
        ? embedModal.querySelector("[data-close-embed]")
        : null;
      const modalTitle = embedModal
        ? embedModal.querySelector(".modal-header h2")
        : null;
      const modalDescription = embedModal
        ? embedModal.querySelector(".modal-content > p")
        : null;

      // Update modal content based on form type
      if (modalTitle) {
        modalTitle.textContent =
          savedFormType === "form" ? "Form Link" : "Embed this Form";
      }
      if (modalDescription) {
        modalDescription.textContent =
          savedFormType === "form"
            ? "Copy the link below to share your form."
            : "Copy the snippet below and paste it into your website where you want the form to appear.";
      }

      if (snippetEl) snippetEl.value = contentToShow;
      if (closeBtn) closeBtn.disabled = true; // must copy before closing
      if (embedModal) embedModal.style.display = "block";

      const doCopy = async () => {
        try {
          await navigator.clipboard.writeText(contentToShow);
        } catch (_) {
          // Fallback for older browsers
          if (snippetEl && snippetEl.select) {
            snippetEl.select();
            document.execCommand && document.execCommand("copy");
          }
        }
        if (copyBtn) copyBtn.textContent = "Copied!";
        if (closeBtn) closeBtn.disabled = false;

        // Redirect to forms list after 1 second
        setTimeout(() => {
          window.location.href = "/enquiries/forms";
        }, 1000);
      };

      if (copyBtn) copyBtn.onclick = doCopy;
      if (closeBtn)
        closeBtn.onclick = () => {
          if (embedModal) embedModal.style.display = "none";
          window.location.href = "/enquiries/forms";
        };
      if (xBtn)
        xBtn.onclick = () => {
          if (closeBtn && !closeBtn.disabled && embedModal)
            embedModal.style.display = "none";
          window.location.href = "/enquiries/forms";
        };

      // Notify success
      window.dispatchEvent(new CustomEvent("builder-save-success"));
    } catch (e) {
      // Log to console for debugging
      console.error("Form save error:", e.message || e);

      // Dispatch error event to React component
      window.dispatchEvent(
        new CustomEvent("builder-save-error", {
          detail: { message: e.message || "Failed to save form" },
        })
      );
    } finally {
      // Restore button state
      saveBtn.disabled = false;
      saveBtn.innerHTML = originalHTML;
    }
  });

  function buildApiPayload() {
    // Get fields in DOM order to preserve the correct sequence
    const orderedFieldIds = [];
    preview.querySelectorAll(".preview-field").forEach((el) => {
      if (fieldsData[el.id]) {
        orderedFieldIds.push(el.id);
      }
    });
    
    const fields = orderedFieldIds.map((fid, idx) => {
      const f = fieldsData[fid];
      return {
        id: f._id || undefined, // include id when editing
        name: f.name || `${f.type}_field`,
        label: f.label || capitalize(f.type),
        placeholder: f.placeholder || "",
        field_type: f.field_type || f.type,
        required: !!f.required,
        custom_class: (f.custom_class || "").trim() || undefined,
        visible_if: f.visible_if && (f.visible_if.field_name || f.visible_if.field_id)
          ? {
              // Persist by controller field NAME (stable across hydration)
              field_name: f.visible_if.field_name
                ? f.visible_if.field_name
                : (fieldsData[f.visible_if.field_id]?.name || ""),
              value: f.visible_if.value ?? "",
              operator: f.visible_if.operator || "equals",
            }
          : null,
        max_length: f.maxlength || null,
        error_message: f.error_message || null,
        options: Array.isArray(f.options)
        ? f.options
        : (f.field_type || f.type) === "address" || (f.field_type || f.type) === "image"
        ? f.options
        : undefined,
        regex: f.regex || undefined,
        html: f.type === "html" ? f.html : undefined,
        button_text:
          f.type === "submit_button" ? f.button_text || undefined : undefined,
        custom_style:
          f.type === "submit_button" ? f.custom_style || undefined : undefined,
        order: idx,
      };
    });

    const get = (id) => (root.querySelector("#" + id)?.value || "").trim();
    const formType = get("form-type") || "web";

    const payload = {
      organization: defaultOrgId, // hard default as requested
      title: get("form-title"),
      description: get("form-description"),
      type: formType,
      submit_to: get("form-submit-to"),
      submit_from: get("form-submit-from"),
      cc_email: get("form-cc-email"),
      bcc_email: get("form-bcc-email"),
      thank_you_message:
        get("form-thank-you") ||
        "Thank you for reaching out. We'll get back to you soon!",
      error_message:
        get("form-error-message") ||
        "Something went wrong. Please try again later.",
      submit_button_label: get("form-submit-label") || "Submit",
      custom_css: cssTextarea?.value ?? "",
      fields,
    };

    // Only include domain and reCAPTCHA fields for 'web' type forms
    if (formType === "web") {
      payload.domain = get("form-domain");
      payload.recaptcha_site_key = get("form-recaptcha-key");
      payload.recaptcha_secret_key = get("form-recaptcha-secret");
    }

    const redirect = get("form-redirect-url");
    if (redirect) payload.redirect_url = redirect;
    return payload;
  }

  // helpers
  function capitalize(s) {
    return (s || "").charAt(0).toUpperCase() + (s || "").slice(1);
  }
  function normalizeOptionFieldDom(host, id, type, data) {
    if (!host) return;

    const groupName = data?.name || id;

    if (type === "radio") {
      const wrap = host.querySelector(".form-field");
      if (!wrap) return;

      wrap.querySelectorAll(".radio-field").forEach((n) => n.remove());

      const opts = Array.isArray(data.options) ? data.options : [];
      opts.forEach((o, i) => {
        const div = document.createElement("div");
        div.className = "radio-field";
        const rid = `${groupName}-r-${i}`;
        div.innerHTML = `<input id="${rid}" type="radio" name="${escapeHtml(
          groupName
        )}" ${data.required ? "required" : ""}>
                       <label for="${rid}">${escapeHtml(o)}</label>`;
        wrap.appendChild(div);
      });
      return;
    }

    if (type === "multicheckbox") {
      const wrap = host.querySelector(".form-field");
      if (!wrap) return;

      wrap.querySelectorAll(".checkbox-field").forEach((n) => n.remove());

      const opts = Array.isArray(data.options) ? data.options : [];
      opts.forEach((o, i) => {
        const div = document.createElement("div");
        div.className = "checkbox-field";
        const cid = `${groupName}-c-${i}`;
        div.innerHTML = `<input id="${cid}" type="checkbox" name="${escapeHtml(
          groupName
        )}[]" ${data.required ? "required" : ""}>
                       <label for="${cid}">${escapeHtml(o)}</label>`;
        wrap.appendChild(div);
      });
    }
  }
  function escapeHtml(s = "") {
    const str = String(s || "");
    return str.replace(
      /[&<>"']/g,
      (c) =>
        ({
          "&": "&amp;",
          "<": "&lt;",
          ">": "&gt;",
          '"': "&quot;",
          "'": "&#39;",
        }[c])
    );
  }
  function escapeAttr(s = "") {
    return escapeHtml(s).replace(/"/g, "&quot;");
  }

  function seedDefaultFields() {
    const defaults = [
      {
        field_type: "text",
        name: "name",
        label: "Name",
        placeholder: "Enter your name",
        required: true,
        order: 0,
      },
      {
        field_type: "email",
        name: "email",
        label: "Email",
        placeholder: "Enter your email",
        required: true,
        order: 1,
      },
      {
        field_type: "phone",
        name: "phone",
        label: "Phone",
        placeholder: "Enter your phone",
        order: 2,
      },
      {
        field_type: "textarea",
        name: "message",
        label: "Message",
        placeholder: "Type your message",
        order: 3,
      },
    ];
    defaults.forEach(addFieldFromData);
  }

  // ----- Hydration helpers -----
  function setVal(id, v) {
    const el = document.getElementById(id);
    if (el) el.value = v ?? "";
  }

  function hydrateInitialForm(form) {
    // right-column details
    setVal("form-title", form.title);
    setVal("form-type", form.type || "web");
    setVal("form-domain", form.domain);
    setVal(
      "form-description",
      form.description || form.meta?.description || ""
    );
    setVal("form-submit-to", form.submit_to);
    setVal("form-submit-from", form.submit_from);
    setVal("form-cc-email", form.cc_email);
    setVal("form-bcc-email", form.bcc_email);
    setVal("form-thank-you", form.thank_you_message);
    setVal("form-error-message", form.error_message);
    setVal("form-submit-label", form.submit_button_label || "Submit");
    setVal("form-redirect-url", form.redirect_url);
    setVal("form-recaptcha-key", form.recaptcha_site_key);
    setVal("form-recaptcha-secret", form.recaptcha_secret_key);

    // Update preview title and description
    const previewTitleEl = root.querySelector("#preview-form-title");
    const previewDescriptionEl = root.querySelector(
      "#preview-form-description"
    );
    if (previewTitleEl) previewTitleEl.textContent = form.title || "Title";
    if (previewDescriptionEl)
      previewDescriptionEl.textContent =
        form.description || form.meta?.description || "" || "Description";

    // custom css
    if (cssTextarea && form.custom_css) {
      cssTextarea.value = form.custom_css;
    }

    // fields canvas - only remove field elements, keep page header
    const fields = (form.fields || [])
      .slice()
      .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
    preview.querySelectorAll(".preview-field").forEach((f) => f.remove());
    fieldsData = {};
    fieldCounter = 1;

    fields.forEach(addFieldFromData);
    updateMoveButtons();

    // Hide empty state if fields exist
    if (fields.length > 0) {
      const emptyState = preview.querySelector(".empty-state");
      if (emptyState) {
        emptyState.style.display = "none";
      }
    }
    
    // After all fields are hydrated, resolve field_id from field_name for visible_if
    // This is needed because field_id is session-specific and field_name is the stable identifier
    Object.keys(fieldsData).forEach((fid) => {
      const data = fieldsData[fid];
      if (data.visible_if && data.visible_if.field_name) {
        // Find the controller field by name
        const controllerId = Object.keys(fieldsData).find(
          (id) => (fieldsData[id]?.name || "").trim() === data.visible_if.field_name
        );
        if (controllerId) {
          data.visible_if.field_id = controllerId;
        }
      }
    });
    
    // Apply conditional visibility after resolving field_ids
    applyConditionalVisibilityRecursively();
  }

  function addFieldFromData(f) {
    const type = f.field_type || f.type || "text";
    const id = `field-${fieldCounter++}`;
    const el = document.createElement("div");
    el.className = "preview-field";
    el.id = id;
    el.dataset.type = type;
    el.innerHTML = getTemplate(type) + actionBar(!!f.required);
    preview.appendChild(el);

    const data = {
      type,
      field_type: type,
      _id: f.id,
      label: f.label ?? `${capitalize(type)} Field`,
      name: f.name ?? `${type}_field`,
      required: !!f.required,
      visible_if: f.visible_if ?? null,
      custom_class: f.custom_class ?? "",
      placeholder: f.placeholder ?? "",
      maxlength: f.max_length ?? f.maxlength ?? "",
      regex: f.regex ?? "",
      error_message: f.error_message ?? "",
      options: Array.isArray(f.options)
        ? [...f.options]
        : f.options && typeof f.options === "object"
        ? { ...f.options }
        : [],
      html: f.html ?? undefined,
      button_text: f.button_text ?? undefined,
      custom_style: f.custom_style ?? undefined,
    };

    fieldsData[id] = data;
    // Ensure hydrated field names are unique (legacy forms may contain duplicates)
    const used = new Set(
      Object.keys(fieldsData)
        .filter((fid) => fid !== id)
        .map((fid) => (fieldsData[fid]?.name || "").trim())
        .filter(Boolean)
    );

    const t = fieldsData[id].field_type || fieldsData[id].type;
    const baseName =
      (fieldsData[id].name || "").trim() || `${t}_${String(id).replace("field-", "")}`;

    let unique = baseName;
    let s = 2;
    while (used.has(unique)) {
      unique = `${baseName}_${s++}`;
    }
    fieldsData[id].name = unique;
    wireField(el, id, type);

    // Do not auto-select field when hydrating - let user click to select
    // selectField(id, type);

    const labelEl = el.querySelector(
      ".form-field > label, .checkbox-field label"
    );
    if (labelEl && data.label) {
      labelEl.innerHTML = `${data.label} ${
        data.required ? ' <span class="required-star">*</span>' : ""
      }`;
    }

    if (
      ["text", "email", "number", "phone", "url", "date", "time"].includes(type)
    ) {
      const input = el.querySelector("input");
      if (input) {
        if (type === "phone") input.type = "tel";
        if (data.placeholder) input.placeholder = data.placeholder;
        if (data.maxlength && !isNaN(data.maxlength) && data.maxlength > 0) {
          input.maxLength = parseInt(data.maxlength, 10);
        }
        if (data.required) input.required = true;
      }
    } else if (type === "textarea") {
      const ta = el.querySelector("textarea");
      if (ta) {
        if (data.placeholder) ta.placeholder = data.placeholder;
        if (data.maxlength && !isNaN(data.maxlength) && data.maxlength > 0) {
          ta.maxLength = parseInt(data.maxlength, 10);
        }
        if (data.required) ta.required = true;
      }
    } else if (type === "select") {
      const sel = el.querySelector("select");
      if (sel) {
        sel.innerHTML =
          `<option value="">${
            data.placeholder || "Select an option"
          }</option>` +
          (data.options || [])
            .map((o) => `<option>${escapeHtml(o)}</option>`)
            .join("");
        if (data.required) sel.required = true;
      }
    } else if (type === "radio") {
      const wrap = el.querySelector(".form-field");
      if (wrap) {
        wrap.querySelectorAll(".radio-field").forEach((n) => n.remove());
        (data.options || []).forEach((o, i) => {
          const div = document.createElement("div");
          div.className = "radio-field";
          const rid = `${data.name}-${i}`;
          div.innerHTML = `<input id="${rid}" type="radio" name="${escapeHtml(
            data.name
          )}">
                           <label for="${rid}">${escapeHtml(o)}</label>`;
          wrap.appendChild(div);
        });
      }
    } else if (type === "multicheckbox") {
      const wrap = el.querySelector(".form-field");
      if (wrap) {
        wrap.querySelectorAll(".checkbox-field").forEach((n) => n.remove());
        (data.options || []).forEach((o, i) => {
          const div = document.createElement("div");
          div.className = "checkbox-field";
          const cid = `${data.name}-${i}`;
          div.innerHTML = `<input id="${cid}" type="checkbox" name="${escapeHtml(
            data.name
          )}[]">
                           <label for="${cid}">${escapeHtml(o)}</label>`;
          wrap.appendChild(div);
        });
      }
    } else if (type === "checkbox" || type === "consent") {
      const lab = el.querySelector(".checkbox-field label");
      if (lab && data.label) lab.textContent = data.label;
    } else if (type === "html") {
      const block = el.querySelector(".html-content");
      if (block) block.innerHTML = data.html || "<p></p>";
    } else if (type === "submit_button") {
      const btn = el.querySelector("button");
      if (btn) {
        btn.textContent = data.button_text || "Submit";
        if (data.custom_style) btn.setAttribute("style", data.custom_style);
      }
    }

    // Do not auto-select field when adding from data - let user click to select
    // selectField(id, type);
  }
}

// Cleanup function to reset builder state
export function cleanupBuilder() {
  const root = document.querySelector(".mf-builder");
  if (root) {
    delete root.dataset.builderInitialized;

    // Clear the preview container
    const preview = root.querySelector("#preview-container");
    if (preview) {
      // Remove all field elements but keep the page header and empty state
      preview
        .querySelectorAll(".preview-field")
        .forEach((field) => field.remove());
    }
  }
}
