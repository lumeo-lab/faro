const STORAGE_KEY = "faro_orders_compact";
const REALIZATION_KEY = "faro_realization_compact";
const ordersList = document.getElementById("ordersList");
const previewModal = document.getElementById("previewModal");
const previewContent = document.getElementById("previewContent");
const closePreviewBtn = document.getElementById("closePreviewBtn");

function loadOrders() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return [];
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function saveOrders(orders) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(orders));
}

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

function renderOrders() {
  const orders = loadOrders();
  if (!orders.length) {
    ordersList.className = "muted";
    ordersList.textContent = "Brak zapisanych kart.";
    return;
  }

  const rows = orders
    .slice()
    .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
    .map((order, index) => `
      <tr>
        <td>${index + 1}</td>
        <td>${order.orderNo}</td>
        <td>${getProductName(order.data)}</td>
        <td>${order.categoryName}</td>
        <td>${order.subcategory}</td>
        <td>${formatDateTime(order.updatedAt)}</td>
        <td>
          <button type="button" class="btn btn-primary" data-action="preview" data-id="${order.id}">Podgląd</button>
          <a class="btn btn-primary" href="index_compact.html?edit=${encodeURIComponent(order.id)}">Edycja</a>
          <button type="button" class="btn btn-accent" data-action="to-realization" data-id="${order.id}">Do realizacji</button>
          <button type="button" class="btn btn-ghost" data-action="delete" data-id="${order.id}">Usuń</button>
        </td>
      </tr>
    `)
    .join("");

  ordersList.className = "";
  ordersList.innerHTML = `
    <div class="table-wrap">
      <table>
        <thead>
          <tr>
            <th>Lp.</th>
            <th>Nr zamówienia</th>
            <th>Nazwa produktu</th>
            <th>Kategoria</th>
            <th>Podkategoria</th>
            <th>Aktualizacja</th>
            <th>Akcje</th>
          </tr>
        </thead>
        <tbody>${rows}</tbody>
      </table>
    </div>
  `;
}

function openPreview(order) {
  const rows = (order.data || [])
    .map((item) => `<tr><th>${item.label}</th><td>${item.value}</td></tr>`)
    .join("");

  previewContent.innerHTML = `
    <div class="meta">
      <p><strong>Nr zamówienia:</strong> ${order.orderNo}</p>
      <p><strong>Kategoria:</strong> ${order.categoryName}</p>
      <p><strong>Podkategoria:</strong> ${order.subcategory}</p>
      <p><strong>Aktualizacja:</strong> ${formatDateTime(order.updatedAt)}</p>
    </div>
    <div class="table-wrap">
      <table>
        <tbody>${rows}</tbody>
      </table>
    </div>
  `;

  previewModal.classList.remove("hidden");
  previewModal.setAttribute("aria-hidden", "false");
}

function closePreview() {
  previewModal.classList.add("hidden");
  previewModal.setAttribute("aria-hidden", "true");
}

function moveToRealization(id) {
  const orders = loadOrders();
  const order = orders.find((item) => item.id === id);
  if (!order) {
    return;
  }

  const nextOrders = orders.filter((item) => item.id !== id);
  const realization = loadRealization();

  const defaultSteps = [
    { id: "potwierdzenie", label: "Potwierdzenie zamówienia", done: false },
    { id: "probki", label: "Weryfikacja próbek", done: false },
    { id: "produkcja", label: "Produkcja", done: false },
    { id: "inspekcja", label: "Inspekcja jakości", done: false },
    { id: "wysylka", label: "Wysyłka / dokumenty", done: false }
  ];

  realization.push({
    ...order,
    movedToRealizationAt: new Date().toISOString(),
    realization: {
      status: "Nowe",
      steps: defaultSteps,
      notes: "",
      attachments: []
    }
  });

  saveOrders(nextOrders);
  saveRealization(realization);
  renderOrders();
}

ordersList.addEventListener("click", (event) => {
  const target = event.target;
  if (!(target instanceof HTMLButtonElement)) {
    return;
  }

  const action = target.dataset.action;
  if (!action) {
    return;
  }

  const id = target.dataset.id;
  if (!id) {
    return;
  }

  if (action === "preview") {
    const orders = loadOrders();
    const order = orders.find((item) => item.id === id);
    if (order) {
      openPreview(order);
    }
    return;
  }

  if (action === "delete") {
    const orders = loadOrders();
    const nextOrders = orders.filter((item) => item.id !== id);
    saveOrders(nextOrders);
    renderOrders();
    return;
  }

  if (action === "to-realization") {
    moveToRealization(id);
  }
});

closePreviewBtn.addEventListener("click", closePreview);
previewModal.addEventListener("click", (event) => {
  if (event.target === previewModal) {
    closePreview();
  }
});

renderOrders();
