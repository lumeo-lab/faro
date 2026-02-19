const REALIZATION_KEY = "faro_realization_compact";

const realizationListView = document.getElementById("realizationListView");
const realizationDetailView = document.getElementById("realizationDetailView");
const realizationList = document.getElementById("realizationList");
const realizationDetail = document.getElementById("realizationDetail");
const backToListBtn = document.getElementById("backToListBtn");

const viewState = {
  selectedOrderId: null
};

function loadRealization() {
  try {
    const raw = localStorage.getItem(REALIZATION_KEY);
    if (!raw) {
      return [];
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function saveRealization(items) {
  localStorage.setItem(REALIZATION_KEY, JSON.stringify(items));
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
  if (!order.realization) {
    order.realization = {
      status: "Nowe",
      steps: createDefaultSteps(),
      notes: "",
      attachments: []
    };
  }

  if (!Array.isArray(order.realization.steps) || !order.realization.steps.length) {
    order.realization.steps = createDefaultSteps();
  }

  if (!Array.isArray(order.realization.attachments)) {
    order.realization.attachments = [];
  }

  if (typeof order.realization.notes !== "string") {
    order.realization.notes = "";
  }

  if (!order.realization.status) {
    order.realization.status = "Nowe";
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

function getOrderById(items, id) {
  return items.find((item) => item.id === id);
}

function normalizeAndSave() {
  const items = loadRealization();
  items.forEach(ensureRealizationFields);
  saveRealization(items);
  return items;
}

function openListView() {
  viewState.selectedOrderId = null;
  realizationListView.classList.remove("hidden");
  realizationDetailView.classList.add("hidden");
  renderList();
}

function openDetailView(orderId) {
  viewState.selectedOrderId = orderId;
  realizationListView.classList.add("hidden");
  realizationDetailView.classList.remove("hidden");
  renderDetail(orderId);
}

function renderList() {
  const items = normalizeAndSave();

  if (!items.length) {
    realizationList.className = "muted";
    realizationList.textContent = "Brak zamówień w realizacji.";
    return;
  }

  const rows = items
    .slice()
    .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
    .map((order, index) => `
      <tr>
        <td>${index + 1}</td>
        <td>${order.orderNo}</td>
        <td>${getProductName(order.data)}</td>
        <td>${order.categoryName}</td>
        <td>${order.subcategory}</td>
        <td><span class="status-pill">${order.realization.status}</span></td>
        <td>${formatDateTime(order.updatedAt)}</td>
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

function renderDetail(orderId) {
  const items = normalizeAndSave();
  const order = getOrderById(items, orderId);

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

  const steps = (order.realization.steps || [])
    .map((step) => `
      <label class="step-item">
        <input type="checkbox" data-action="step" data-order-id="${order.id}" data-step-id="${step.id}" ${step.done ? "checked" : ""} />
        <span>${step.label}</span>
      </label>
    `)
    .join("");

  const attachments = (order.realization.attachments || [])
    .map((file) => `
      <div class="attach-item">
        <span>${file.name}</span>
        <div class="attach-actions">
          <a class="btn btn-primary" href="${file.dataUrl}" download="${file.name}">Pobierz</a>
          <button type="button" class="btn btn-ghost" data-action="remove-file" data-order-id="${order.id}" data-file-id="${file.id}">Usuń</button>
        </div>
      </div>
    `)
    .join("");

  realizationDetail.innerHTML = `
    <article class="realization-card" data-order-id="${order.id}">
      <div class="card-top">
        <div>
          <h3>${order.orderNo} • ${getProductName(order.data)}</h3>
          <div class="meta">
            <span>Kategoria: ${order.categoryName}</span>
            <span>Podkategoria: ${order.subcategory}</span>
            <span>Ostatnia aktualizacja: ${formatDateTime(order.updatedAt)}</span>
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
              ${statusOptions(order.realization.status)}
            </select>
          </div>
          <div class="steps">${steps}</div>
          <div class="status-row" style="margin-top:8px;">
            <label>Notatki realizacyjne</label>
            <textarea data-action="notes" data-order-id="${order.id}">${escapeHtml(order.realization.notes)}</textarea>
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

function persistCardFromDom(orderId) {
  const items = loadRealization();
  const order = getOrderById(items, orderId);
  if (!order) {
    return;
  }

  ensureRealizationFields(order);

  const root = document.querySelector(`.realization-card[data-order-id="${orderId}"]`);
  if (!root) {
    return;
  }

  const statusEl = root.querySelector('select[data-action="status"]');
  const notesEl = root.querySelector('textarea[data-action="notes"]');
  if (statusEl) {
    order.realization.status = statusEl.value;
  }
  if (notesEl) {
    order.realization.notes = notesEl.value;
  }

  const stepEls = root.querySelectorAll('input[data-action="step"]');
  order.realization.steps = Array.from(stepEls).map((el) => {
    const stepId = el.getAttribute("data-step-id") || "step";
    const oldStep = order.realization.steps.find((s) => s.id === stepId);
    return {
      id: stepId,
      label: oldStep?.label || stepId,
      done: el.checked
    };
  });

  const paramInputs = root.querySelectorAll('input[data-action="param"]');
  paramInputs.forEach((input) => {
    const idx = Number(input.getAttribute("data-param-idx"));
    const param = (order.data || []).find((item) => Number(item.idx) === idx);
    if (param) {
      const nextValue = input.value.trim();
      param.value = nextValue || "-";
    }
  });

  order.updatedAt = new Date().toISOString();
  saveRealization(items);
}

function readFileAsDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result || ""));
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

async function uploadFiles(orderId, files) {
  if (!files.length) {
    return;
  }

  const items = loadRealization();
  const order = getOrderById(items, orderId);
  if (!order) {
    return;
  }

  ensureRealizationFields(order);

  for (const file of files) {
    const dataUrl = await readFileAsDataUrl(file);
    order.realization.attachments.push({
      id: `${Date.now()}-${Math.floor(Math.random() * 10000)}`,
      name: file.name,
      type: file.type,
      size: file.size,
      dataUrl,
      uploadedAt: new Date().toISOString()
    });
  }

  order.updatedAt = new Date().toISOString();
  saveRealization(items);
  renderDetail(orderId);
}

function removeAttachment(orderId, fileId) {
  const items = loadRealization();
  const order = getOrderById(items, orderId);
  if (!order) {
    return;
  }

  ensureRealizationFields(order);
  order.realization.attachments = order.realization.attachments.filter((file) => file.id !== fileId);
  order.updatedAt = new Date().toISOString();
  saveRealization(items);
  renderDetail(orderId);
}

realizationList.addEventListener("click", (event) => {
  const target = event.target;
  if (!(target instanceof HTMLElement)) {
    return;
  }
  const button = target.closest("button");
  if (!(button instanceof HTMLButtonElement)) {
    return;
  }

  if (button.dataset.action === "open-detail" && button.dataset.orderId) {
    openDetailView(button.dataset.orderId);
  }
});

realizationDetail.addEventListener("click", (event) => {
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
    persistCardFromDom(orderId);
    renderDetail(orderId);
    return;
  }

  if (action === "remove-file") {
    const fileId = button.dataset.fileId;
    if (fileId) {
      removeAttachment(orderId, fileId);
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
    return;
  }

  const orderId = target.getAttribute("data-order-id");
  if (orderId) {
    persistCardFromDom(orderId);
  }
});

realizationDetail.addEventListener("input", (event) => {
  const target = event.target;
  if (!(target instanceof HTMLElement)) {
    return;
  }

  const orderId = target.getAttribute("data-order-id");
  if (orderId) {
    persistCardFromDom(orderId);
  }
});

backToListBtn.addEventListener("click", openListView);

openListView();
