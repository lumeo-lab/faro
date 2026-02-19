const realizationListView = document.getElementById("realizationListView");
const realizationDetailView = document.getElementById("realizationDetailView");
const realizationList = document.getElementById("realizationList");
const realizationDetail = document.getElementById("realizationDetail");
const backToListBtn = document.getElementById("backToListBtn");

const state = {
  items: [],
  selectedOrderId: null,
  attachments: []
};

function ensureSupabase() {
  if (!window.sb) {
    realizationList.className = "muted";
    realizationList.textContent = "Brak połączenia z Supabase.";
    return false;
  }
  return true;
}

function formatDateTime(iso) {
  if (!iso) {
    return "-";
  }
  const d = new Date(iso);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  const h = String(d.getHours()).padStart(2, "0");
  const min = String(d.getMinutes()).padStart(2, "0");
  return `${y}-${m}-${day} ${h}:${min}`;
}

function getProductName(data) {
  const row = Array.isArray(data)
    ? data.find((item) => item.label === "Opis") || data.find((item) => item.label === "Nazwa produktu")
    : null;
  return row?.value && row.value !== "-" ? row.value : "-";
}

function createDefaultSteps() {
  return [
    { id: "potwierdzenie", label: "Potwierdzenie zamówienia", done: false },
    { id: "probki", label: "Weryfikacja próbek", done: false },
    { id: "produkcja", label: "Produkcja", done: false },
    { id: "inspekcja", label: "Inspekcja jakości", done: false },
    { id: "wysylka", label: "Wysyłka / dokumenty", done: false }
  ];
}

function ensureRealizationFields(order) {
  if (!order.realization_status) {
    order.realization_status = "Nowe";
  }

  if (!Array.isArray(order.realization_steps) || !order.realization_steps.length) {
    order.realization_steps = createDefaultSteps();
  }

  if (typeof order.realization_notes !== "string") {
    order.realization_notes = "";
  }

  if (!Array.isArray(order.data)) {
    order.data = [];
  }
}

function statusOptions(selected) {
  const options = ["Nowe", "W toku", "Oczekuje na dokumenty", "Wysłane", "Zakończone"];
  return options
    .map((status) => `<option value="${status}" ${status === selected ? "selected" : ""}>${status}</option>`)
    .join("");
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function getOrderById(id) {
  return state.items.find((item) => item.id === id);
}

async function loadRealization() {
  if (!ensureSupabase()) {
    return;
  }

  const { data, error } = await window.sb
    .from("cards")
    .select("*")
    .eq("stage", "realization")
    .order("updated_at", { ascending: false });

  if (error) {
    realizationList.className = "muted";
    realizationList.textContent = `Błąd pobierania realizacji: ${error.message}`;
    return;
  }

  state.items = Array.isArray(data) ? data : [];
  state.items.forEach(ensureRealizationFields);
}

function openListView() {
  state.selectedOrderId = null;
  realizationListView.classList.remove("hidden");
  realizationDetailView.classList.add("hidden");
  renderList();
}

async function openDetailView(orderId) {
  state.selectedOrderId = orderId;
  realizationListView.classList.add("hidden");
  realizationDetailView.classList.remove("hidden");
  await loadAttachments(orderId);
  renderDetail(orderId);
}

function renderList() {
  const items = state.items;

  if (!items.length) {
    realizationList.className = "muted";
    realizationList.textContent = "Brak zamówień w realizacji.";
    return;
  }

  const rows = items
    .map((order, index) => `
      <tr>
        <td>${index + 1}</td>
        <td>${order.order_no || "-"}</td>
        <td>${getProductName(order.data)}</td>
        <td>${order.category_name || "-"}</td>
        <td>${order.subcategory || "-"}</td>
        <td><span class="status-pill">${order.realization_status}</span></td>
        <td>${formatDateTime(order.updated_at || order.created_at)}</td>
        <td><button type="button" class="btn btn-primary" data-action="open-detail" data-order-id="${order.id}">Wejdź</button></td>
      </tr>
    `)
    .join("");

  realizationList.className = "";
  realizationList.innerHTML = `
    <div class="table-wrap">
      <table>
        <thead>
          <tr>
            <th>Lp.</th>
            <th>Nr zamówienia</th>
            <th>Nazwa produktu</th>
            <th>Kategoria</th>
            <th>Podkategoria</th>
            <th>Status</th>
            <th>Aktualizacja</th>
            <th>Akcja</th>
          </tr>
        </thead>
        <tbody>${rows}</tbody>
      </table>
    </div>
  `;
}

async function loadAttachments(orderId) {
  const { data, error } = await window.sb
    .from("card_attachments")
    .select("*")
    .eq("card_id", orderId)
    .order("created_at", { ascending: false });

  if (error) {
    alert(`Nie udało się pobrać załączników: ${error.message}`);
    state.attachments = [];
    return;
  }

  state.attachments = Array.isArray(data) ? data : [];
}

function getFileUrl(filePath) {
  const { data } = window.sb.storage.from("card-files").getPublicUrl(filePath);
  return data?.publicUrl || "#";
}

function renderDetail(orderId) {
  const order = getOrderById(orderId);

  if (!order) {
    openListView();
    return;
  }

  const paramsRows = (order.data || [])
    .map((param) => `
      <tr>
        <th>${param.label}</th>
        <td><input class="param-input" data-action="param" data-order-id="${order.id}" data-param-idx="${param.idx}" value="${escapeHtml(param.value || "")}" /></td>
      </tr>
    `)
    .join("");

  const steps = (order.realization_steps || [])
    .map((step) => `
      <label class="step-item">
        <input type="checkbox" data-action="step" data-order-id="${order.id}" data-step-id="${step.id}" ${step.done ? "checked" : ""} />
        <span>${step.label}</span>
      </label>
    `)
    .join("");

  const attachments = (state.attachments || [])
    .map((file) => `
      <div class="attach-item">
        <span>${file.file_name}</span>
        <div class="attach-actions">
          <a class="btn btn-primary" href="${getFileUrl(file.file_path)}" target="_blank" rel="noopener">Pobierz</a>
          <button type="button" class="btn btn-ghost" data-action="remove-file" data-order-id="${order.id}" data-file-id="${file.id}" data-file-path="${file.file_path}">Usuń</button>
        </div>
      </div>
    `)
    .join("");

  realizationDetail.innerHTML = `
    <article class="realization-card" data-order-id="${order.id}">
      <div class="card-top">
        <div>
          <h3>${order.order_no || "-"} • ${getProductName(order.data)}</h3>
          <div class="meta">
            <span>Kategoria: ${order.category_name || "-"}</span>
            <span>Podkategoria: ${order.subcategory || "-"}</span>
            <span>Ostatnia aktualizacja: ${formatDateTime(order.updated_at || order.created_at)}</span>
          </div>
        </div>
        <div class="actions">
          <button type="button" class="btn btn-ok" data-action="save-card" data-order-id="${order.id}">Zapisz kartę realizacji</button>
        </div>
      </div>

      <div class="card-grid">
        <div class="box">
          <h4>Status i kroki</h4>
          <div class="status-row">
            <label>Status zamówienia</label>
            <select data-action="status" data-order-id="${order.id}">
              ${statusOptions(order.realization_status)}
            </select>
          </div>
          <div class="steps">${steps}</div>
          <div class="status-row" style="margin-top:8px;">
            <label>Notatki realizacyjne</label>
            <textarea data-action="notes" data-order-id="${order.id}">${escapeHtml(order.realization_notes || "")}</textarea>
          </div>

          <div class="attachments" style="margin-top:8px;">
            <h4>Załączniki i dokumenty</h4>
            <input type="file" data-action="upload" data-order-id="${order.id}" multiple />
            <div class="attach-list">${attachments || '<span class="muted">Brak załączników.</span>'}</div>
          </div>
        </div>

        <div class="box">
          <h4>Karta produktowa (edycja)</h4>
          <table class="param-table">
            <tbody>${paramsRows}</tbody>
          </table>
        </div>
      </div>
    </article>
  `;
}

function collectDetailPayload(orderId) {
  const order = getOrderById(orderId);
  if (!order) {
    return null;
  }

  const root = document.querySelector(`.realization-card[data-order-id="${orderId}"]`);
  if (!root) {
    return null;
  }

  const statusEl = root.querySelector('select[data-action="status"]');
  const notesEl = root.querySelector('textarea[data-action="notes"]');
  const stepsEls = root.querySelectorAll('input[data-action="step"]');
  const paramInputs = root.querySelectorAll('input[data-action="param"]');

  const realization_status = statusEl ? statusEl.value : order.realization_status;
  const realization_notes = notesEl ? notesEl.value : order.realization_notes;

  const realization_steps = Array.from(stepsEls).map((el) => {
    const stepId = el.getAttribute("data-step-id") || "step";
    const oldStep = (order.realization_steps || []).find((s) => s.id === stepId);
    return {
      id: stepId,
      label: oldStep?.label || stepId,
      done: el.checked
    };
  });

  const nextData = Array.isArray(order.data) ? [...order.data] : [];
  paramInputs.forEach((input) => {
    const idx = Number(input.getAttribute("data-param-idx"));
    const param = nextData.find((item) => Number(item.idx) === idx);
    if (param) {
      const nextValue = input.value.trim();
      param.value = nextValue || "-";
    }
  });

  return { realization_status, realization_notes, realization_steps, data: nextData };
}

async function saveDetail(orderId) {
  const payload = collectDetailPayload(orderId);
  if (!payload) {
    return;
  }

  const { error } = await window.sb
    .from("cards")
    .update(payload)
    .eq("id", orderId);

  if (error) {
    alert(`Nie udało się zapisać karty realizacji: ${error.message}`);
    return;
  }

  await loadRealization();
  renderDetail(orderId);
}

function toSafePathPart(name) {
  return name.replace(/[^a-zA-Z0-9._-]+/g, "-");
}

async function uploadFiles(orderId, files) {
  if (!files.length) {
    return;
  }

  for (const file of files) {
    const path = `${orderId}/${Date.now()}-${toSafePathPart(file.name)}`;

    const { error: uploadError } = await window.sb.storage
      .from("card-files")
      .upload(path, file);

    if (uploadError) {
      alert(`Błąd uploadu pliku ${file.name}: ${uploadError.message}`);
      continue;
    }

    const { error: insertError } = await window.sb
      .from("card_attachments")
      .insert({
        card_id: orderId,
        file_name: file.name,
        file_path: path,
        mime_type: file.type,
        size_bytes: file.size
      });

    if (insertError) {
      alert(`Plik wysłany, ale nie zapisano metadanych: ${insertError.message}`);
    }
  }

  await loadAttachments(orderId);
  await loadRealization();
  renderDetail(orderId);
}

async function removeAttachment(orderId, fileId, filePath) {
  const { error: storageError } = await window.sb.storage
    .from("card-files")
    .remove([filePath]);

  if (storageError) {
    alert(`Nie udało się usunąć pliku z bucketu: ${storageError.message}`);
  }

  const { error: dbError } = await window.sb
    .from("card_attachments")
    .delete()
    .eq("id", fileId);

  if (dbError) {
    alert(`Nie udało się usunąć metadanych pliku: ${dbError.message}`);
    return;
  }

  await loadAttachments(orderId);
  renderDetail(orderId);
}

realizationList.addEventListener("click", async (event) => {
  const target = event.target;
  if (!(target instanceof HTMLElement)) {
    return;
  }
  const button = target.closest("button");
  if (!(button instanceof HTMLButtonElement)) {
    return;
  }

  if (button.dataset.action === "open-detail" && button.dataset.orderId) {
    await openDetailView(button.dataset.orderId);
  }
});

realizationDetail.addEventListener("click", async (event) => {
  const target = event.target;
  if (!(target instanceof HTMLElement)) {
    return;
  }

  const button = target.closest("button");
  if (!(button instanceof HTMLButtonElement)) {
    return;
  }

  const action = button.dataset.action;
  const orderId = button.dataset.orderId;
  if (!action || !orderId) {
    return;
  }

  if (action === "save-card") {
    await saveDetail(orderId);
    return;
  }

  if (action === "remove-file") {
    const fileId = button.dataset.fileId;
    const filePath = button.dataset.filePath;
    if (fileId && filePath) {
      await removeAttachment(orderId, fileId, filePath);
    }
  }
});

realizationDetail.addEventListener("change", async (event) => {
  const target = event.target;
  if (!(target instanceof HTMLElement)) {
    return;
  }

  if (target instanceof HTMLInputElement && target.dataset.action === "upload") {
    const orderId = target.dataset.orderId;
    if (!orderId || !target.files) {
      return;
    }

    const files = Array.from(target.files);
    await uploadFiles(orderId, files);
    target.value = "";
  }
});

backToListBtn.addEventListener("click", openListView);

async function init() {
  if (!ensureSupabase()) {
    return;
  }

  await loadRealization();
  openListView();
}

init();
