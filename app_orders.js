const ordersList = document.getElementById("ordersList");
const previewModal = document.getElementById("previewModal");
const previewContent = document.getElementById("previewContent");
const closePreviewBtn = document.getElementById("closePreviewBtn");

const state = {
  orders: []
};

function ensureSupabase() {
  if (!window.sb) {
    ordersList.className = "muted";
    ordersList.textContent = "Brak połączenia z Supabase.";
    return false;
  }
  return true;
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

async function loadOrders() {
  if (!ensureSupabase()) {
    return;
  }

  const { data, error } = await window.sb
    .from("cards")
    .select("*")
    .eq("stage", "orders")
    .order("updated_at", { ascending: false });

  if (error) {
    ordersList.className = "muted";
    ordersList.textContent = `Błąd pobierania zamówień: ${error.message}`;
    return;
  }

  state.orders = Array.isArray(data) ? data : [];
  renderOrders();
}

function renderOrders() {
  const orders = state.orders;

  if (!orders.length) {
    ordersList.className = "muted";
    ordersList.textContent = "Brak zapisanych kart.";
    return;
  }

  const rows = orders
    .map((order, index) => `
      <tr>
        <td>${index + 1}</td>
        <td>${order.order_no || "-"}</td>
        <td>${getProductName(order.data)}</td>
        <td>${order.category_name || "-"}</td>
        <td>${order.subcategory || "-"}</td>
        <td>${formatDateTime(order.updated_at || order.created_at)}</td>
        <td>
          <button type="button" class="btn btn-primary" data-action="preview" data-id="${order.id}">Podgląd</button>
          <a class="btn btn-primary" href="index.html?edit=${encodeURIComponent(order.id)}">Edycja</a>
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
      <p><strong>Nr zamówienia:</strong> ${order.order_no || "-"}</p>
      <p><strong>Kategoria:</strong> ${order.category_name || "-"}</p>
      <p><strong>Podkategoria:</strong> ${order.subcategory || "-"}</p>
      <p><strong>Aktualizacja:</strong> ${formatDateTime(order.updated_at || order.created_at)}</p>
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

function createDefaultSteps() {
  return [
    { id: "potwierdzenie", label: "Potwierdzenie zamówienia", done: false },
    { id: "probki", label: "Weryfikacja próbek", done: false },
    { id: "produkcja", label: "Produkcja", done: false },
    { id: "inspekcja", label: "Inspekcja jakości", done: false },
    { id: "wysylka", label: "Wysyłka / dokumenty", done: false }
  ];
}

async function moveToRealization(id) {
  if (!ensureSupabase()) {
    return;
  }

  const { error } = await window.sb
    .from("cards")
    .update({
      stage: "realization",
      realization_status: "Nowe",
      realization_steps: createDefaultSteps(),
      realization_notes: ""
    })
    .eq("id", id);

  if (error) {
    alert(`Nie udało się przenieść do realizacji: ${error.message}`);
    return;
  }

  await loadOrders();
}

async function deleteOrder(id) {
  if (!ensureSupabase()) {
    return;
  }

  const { error } = await window.sb
    .from("cards")
    .delete()
    .eq("id", id);

  if (error) {
    alert(`Nie udało się usunąć zamówienia: ${error.message}`);
    return;
  }

  await loadOrders();
}

ordersList.addEventListener("click", async (event) => {
  const target = event.target;
  if (!(target instanceof HTMLButtonElement)) {
    return;
  }

  const action = target.dataset.action;
  const id = target.dataset.id;
  if (!action || !id) {
    return;
  }

  if (action === "preview") {
    const order = state.orders.find((item) => item.id === id);
    if (order) {
      openPreview(order);
    }
    return;
  }

  if (action === "delete") {
    await deleteOrder(id);
    return;
  }

  if (action === "to-realization") {
    await moveToRealization(id);
  }
});

closePreviewBtn.addEventListener("click", closePreview);
previewModal.addEventListener("click", (event) => {
  if (event.target === previewModal) {
    closePreview();
  }
});

loadOrders();

