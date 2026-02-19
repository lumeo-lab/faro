const categoryData = [
  {
    id: "posciel",
    name: "Pościel",
    desc: "Komplety i zestawy",
    subcategories: ["Pościel satynowa", "Pościel bawełniana", "Pościel flanelowa", "Pościel hotelowa"]
  },
  {
    id: "przescieradla",
    name: "Prześcieradła",
    desc: "Z gumką i bez",
    subcategories: ["Prześcieradło jersey", "Prześcieradło frotte", "Prześcieradło satynowe", "Prześcieradło hotelowe"]
  },
  {
    id: "reczniki",
    name: "Ręczniki",
    desc: "Kąpielowe i plażowe",
    subcategories: ["Ręcznik kąpielowy", "Ręcznik plażowy", "Ręcznik hotelowy", "Ręcznik dziecięcy"]
  },
  {
    id: "koce",
    name: "Koce",
    desc: "Domowe i dekoracyjne",
    subcategories: ["Koc polarowy", "Koc akrylowy", "Koc bawełniany", "Koc dziecięcy"]
  },
  {
    id: "poduszki",
    name: "Poduszki",
    desc: "Dekoracyjne i użytkowe",
    subcategories: ["Poduszka dekoracyjna", "Poduszka hotelowa", "Poduszka dziecięca", "Jaś dekoracyjny"]
  },
  {
    id: "szlafroki",
    name: "Szlafroki",
    desc: "Domowe i hotelowe",
    subcategories: ["Szlafrok bawełniany", "Szlafrok waflowy", "Szlafrok hotelowy", "Szlafrok dziecięcy"]
  }
];

const handlowiecParameters = [
  { label: "Opis", options: ["Pościel", "Ręcznik", "Koc", "Poduszka", "Prześcieradło", "Szlafrok"] },
  { label: "Marka", options: ["FARO", "Marka własna", "Private Label"] },
  { label: "Certyfikaty", options: ["Oeko-Tex", "BSCI", "GOTS", "Brak"] },
  { label: "Skład", options: ["100% bawełna", "100% poliester", "80% bawełna / 20% poliester", "Mikrofibra"] },
  { label: "Rozmiar", options: ["70x140 cm", "140x200 cm", "160x200 cm", "200x220 cm", "50x60 cm"] },
  { label: "Gramatura (GSM)", options: ["120 g/m2", "140 g/m2", "160 g/m2", "180 g/m2", "220 g/m2", "300 g/m2"] },
  { label: "Kolory solidowe", options: ["Biały", "Beż", "Szary", "Granat", "Czarny", "Mix"] },
  { label: "Konstrukcja tkaniny", options: ["Tkana", "Dzianina", "Jersey", "Frotte", "Polar"] },
  { label: "Tolerancja rozmiaru i wagi", options: ["+/- 2%", "+/- 3%", "Do uzgodnienia"] },
  { label: "Tolerancja ilości", options: ["+/- 3%", "+/- 5%", "Do uzgodnienia"] },
  { label: "Liczba wzorów", options: ["1", "2", "3", "4", "5+"] },
  { label: "Numer zamówienia", options: ["ZAM-0001", "ZAM-0002", "ZAM-0003"] },
  { label: "Data promocji", options: ["Q1 2026", "Q2 2026", "Q3 2026", "Q4 2026"] },
  { label: "ETA Gdynia", options: ["14 dni", "21 dni", "30 dni", "45 dni"] },
  { label: "Pakowanie indywidualne (np. folia, banderola, extra usztywnienie kartonikiem ect)", options: ["Folia", "Banderola", "Folia + kartonik", "Worek", "Pudełko"] }
];

const importBasicParameters = [
  { label: "Nazwa produktu", options: ["Pościel", "Ręcznik", "Koc", "Poduszka", "Prześcieradło", "Szlafrok"] },
  { label: "Kraj produkcji", options: ["Polska", "Turcja", "Chiny", "Pakistan", "Indie"] },
  { label: "ETD, INCOTERMS", options: ["FOB", "CIF", "EXW", "DAP"] },
  { label: "Numer partii", options: ["PARTIA-001", "PARTIA-002", "PARTIA-003"] },
  { label: "Rozmiary do wykrojnika", options: ["140x200", "160x200", "200x220", "50x60", "70x140"] }
];

const importSamplesParameters = [
  { label: "Ilość próbek przedprodukcyjnych", options: ["1", "2", "3", "5", "10"] },
  { label: "Etykiety (banderole) przedprodukcyjne", options: ["Tak", "Nie", "Do potwierdzenia"] },
  { label: "Ilość próbek produkcyjnych per wzór", options: ["1", "2", "3", "5", "10"] },
  { label: "Data dostarczenia próbek produkcyjnych", options: ["Q1 2026", "Q2 2026", "Q3 2026", "Q4 2026"] }
];

const importInspectionsParameters = [
  { label: "Inspekcja", options: ["AQL", "Inline", "Finalna", "Brak"] },
  { label: "Kod taryfy celnej", options: ["6302", "6301", "6307", "Do uzupełnienia"] }
];

const importParameters = [
  ...importBasicParameters.map((item) => ({ ...item, importSection: "basic" })),
  ...importSamplesParameters.map((item) => ({ ...item, importSection: "samples" })),
  ...importInspectionsParameters.map((item) => ({ ...item, importSection: "inspections" }))
];

const parameterDefinitions = [...handlowiecParameters, ...importParameters].map((item, index) => ({
  ...item,
  idx: index,
  required: index < handlowiecParameters.length
}));

const state = {
  category: null,
  subcategory: null,
  lastGeneratedData: null,
  editingOrderId: null,
  editingOrderNo: null
};

const categoryGrid = document.getElementById("categoryGrid");
const subcategoryGrid = document.getElementById("subcategoryGrid");
const requiredForm = document.getElementById("requiredForm");
const optionalFormBasic = document.getElementById("optionalFormBasic");
const optionalFormSamples = document.getElementById("optionalFormSamples");
const optionalFormInspections = document.getElementById("optionalFormInspections");
const generateBtn = document.getElementById("generateBtn");
const saveBtn = document.getElementById("saveBtn");
const exportBtn = document.getElementById("exportBtn");
const exportPdfBtn = document.getElementById("exportPdfBtn");
const resetBtn = document.getElementById("resetBtn");
const summary = document.getElementById("summary");

function ensureSupabase() {
  if (!window.sb) {
    alert("Brak połączenia z Supabase. Sprawdź konfigurację supabase-client.js.");
    return false;
  }
  return true;
}

function createCard(text, desc, selected, onClick) {
  const btn = document.createElement("button");
  btn.type = "button";
  btn.className = `card ${selected ? "selected" : ""}`;
  btn.innerHTML = `<strong>${text}</strong><span>${desc}</span>`;
  btn.addEventListener("click", onClick);
  return btn;
}

function updateSaveButtonLabel() {
  saveBtn.textContent = state.editingOrderId ? "Zapisz zmiany" : "Zapisz kartę";
}

function renderCategories() {
  categoryGrid.innerHTML = "";
  categoryData.forEach((category) => {
    const card = createCard(
      category.name,
      category.desc,
      state.category?.id === category.id,
      () => {
        state.category = category;
        state.subcategory = null;
        state.lastGeneratedData = null;
        state.editingOrderId = null;
        state.editingOrderNo = null;
        updateSaveButtonLabel();
        renderCategories();
        renderSubcategories();
        renderForm();
        clearSummary();
      }
    );
    categoryGrid.appendChild(card);
  });
}

function renderSubcategories() {
  subcategoryGrid.innerHTML = "";
  if (!state.category) {
    subcategoryGrid.classList.add("muted");
    subcategoryGrid.innerHTML = '<p class="placeholder">Najpierw wybierz rodzaj karty.</p>';
    return;
  }

  subcategoryGrid.classList.remove("muted");
  state.category.subcategories.forEach((name) => {
    const card = createCard(
      name,
      "Wariant",
      state.subcategory === name,
      () => {
        state.subcategory = name;
        state.lastGeneratedData = null;
        state.editingOrderId = null;
        state.editingOrderNo = null;
        updateSaveButtonLabel();
        renderSubcategories();
        renderForm();
        clearSummary();
      }
    );
    subcategoryGrid.appendChild(card);
  });
}

function createParameterRow(param) {
  const row = document.createElement("div");
  row.className = "field";

  const label = document.createElement("label");
  label.setAttribute("for", `manual-${param.idx}`);
  label.textContent = `${param.idx + 1}. ${param.label}`;

  const controls = document.createElement("div");
  controls.className = "controls";

  const select = document.createElement("select");
  select.name = `select-${param.idx}`;
  select.innerHTML = [
    '<option value="">Wybierz z listy</option>',
    ...param.options.map((option) => `<option value="${option}">${option}</option>`)
  ].join("");

  const manual = document.createElement("input");
  manual.type = "text";
  manual.id = `manual-${param.idx}`;
  manual.name = `manual-${param.idx}`;
  manual.placeholder = "lub wpisz ręcznie";

  select.addEventListener("change", () => {
    if (!manual.value.trim()) {
      manual.value = select.value;
    }
  });

  controls.appendChild(select);
  controls.appendChild(manual);
  row.appendChild(label);
  row.appendChild(controls);

  return row;
}

function renderForm() {
  requiredForm.innerHTML = "";
  optionalFormBasic.innerHTML = "";
  optionalFormSamples.innerHTML = "";
  optionalFormInspections.innerHTML = "";

  if (!state.category || !state.subcategory) {
    generateBtn.disabled = true;
    saveBtn.disabled = true;
    exportBtn.disabled = true;
    exportPdfBtn.disabled = true;
    requiredForm.classList.add("muted");
    optionalFormBasic.classList.add("muted");
    optionalFormSamples.classList.add("muted");
    optionalFormInspections.classList.add("muted");
    requiredForm.innerHTML = '<p class="placeholder">Pola pojawią się po wyborze kategorii i podkategorii.</p>';
    optionalFormBasic.innerHTML = '<p class="placeholder">Pola pojawią się po wyborze kategorii i podkategorii.</p>';
    optionalFormSamples.innerHTML = '<p class="placeholder">Pola pojawią się po wyborze kategorii i podkategorii.</p>';
    optionalFormInspections.innerHTML = '<p class="placeholder">Pola pojawią się po wyborze kategorii i podkategorii.</p>';
    return;
  }

  requiredForm.classList.remove("muted");
  optionalFormBasic.classList.remove("muted");
  optionalFormSamples.classList.remove("muted");
  optionalFormInspections.classList.remove("muted");

  parameterDefinitions.filter((p) => p.required).forEach((param) => {
    requiredForm.appendChild(createParameterRow(param));
  });

  parameterDefinitions.filter((p) => !p.required && p.importSection === "basic").forEach((param) => {
    optionalFormBasic.appendChild(createParameterRow(param));
  });

  parameterDefinitions.filter((p) => !p.required && p.importSection === "samples").forEach((param) => {
    optionalFormSamples.appendChild(createParameterRow(param));
  });

  parameterDefinitions.filter((p) => !p.required && p.importSection === "inspections").forEach((param) => {
    optionalFormInspections.appendChild(createParameterRow(param));
  });

  generateBtn.disabled = false;
  saveBtn.disabled = false;
  exportBtn.disabled = !state.lastGeneratedData;
  exportPdfBtn.disabled = !state.lastGeneratedData;
}

function collectFormData() {
  return parameterDefinitions.map((param) => {
    const select = document.querySelector(`[name="select-${param.idx}"]`);
    const manual = document.querySelector(`[name="manual-${param.idx}"]`);
    const value = (manual?.value || "").trim() || (select?.value || "").trim() || "-";
    return { label: param.label, value, required: param.required, idx: param.idx };
  });
}

function setFormData(data) {
  data.forEach((item) => {
    const select = document.querySelector(`[name="select-${item.idx}"]`);
    const manual = document.querySelector(`[name="manual-${item.idx}"]`);
    if (!select || !manual) {
      return;
    }

    const normalizedValue = item.value === "-" ? "" : item.value;
    const hasOption = Array.from(select.options).some((opt) => opt.value === normalizedValue);
    select.value = hasOption ? normalizedValue : "";
    manual.value = normalizedValue;
  });
}

function renderSummary(data) {
  const rows = data
    .map((item) => `<tr><th>${item.label}${item.required ? " *" : ""}</th><td>${item.value}</td></tr>`)
    .join("");

  summary.classList.remove("muted");
  summary.innerHTML = `
    <div class="summary-head">
      <p><strong>Nr zamówienia:</strong> ${state.editingOrderNo || "Nowe"}</p>
      <p><strong>Kategoria:</strong> ${state.category.name}</p>
      <p><strong>Podkategoria:</strong> ${state.subcategory}</p>
      <p><strong>Tryb:</strong> ${state.editingOrderId ? "Edycja" : "Nowa karta"}</p>
    </div>
    <div class="table-wrap">
      <table>
        <tbody>${rows}</tbody>
      </table>
    </div>
    <p class="note">* pola oznaczone gwiazdką należą do sekcji „Wypełnia handlowiec”.</p>
  `;
}

function clearSummary() {
  summary.classList.add("muted");
  summary.textContent = "Wypełnij formularz i kliknij „Generuj kartę”.";
}

function sanitizeFilename(value) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
}

function generateOrderNo() {
  const now = new Date();
  const stamp = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, "0")}${String(now.getDate()).padStart(2, "0")}${String(now.getHours()).padStart(2, "0")}${String(now.getMinutes()).padStart(2, "0")}${String(now.getSeconds()).padStart(2, "0")}`;
  const rand = Math.floor(100 + Math.random() * 900);
  return `ZAM-${stamp}-${rand}`;
}

async function upsertOrderFromCurrentForm() {
  if (!ensureSupabase()) {
    return;
  }

  if (!state.category || !state.subcategory) {
    alert("Najpierw wybierz kategorię i podkategorię.");
    return;
  }

  const data = collectFormData();
  state.lastGeneratedData = data;
  renderSummary(data);

  const payload = {
    category_id: state.category.id,
    category_name: state.category.name,
    subcategory: state.subcategory,
    data
  };

  if (state.editingOrderId) {
    const { error } = await window.sb
      .from("cards")
      .update(payload)
      .eq("id", state.editingOrderId);

    if (error) {
      alert(`Nie udało się zapisać zmian: ${error.message}`);
      return;
    }
  } else {
    const orderNo = generateOrderNo();
    const { data: inserted, error } = await window.sb
      .from("cards")
      .insert({
        ...payload,
        order_no: orderNo,
        stage: "orders",
        realization_status: "Nowe",
        realization_steps: [],
        realization_notes: ""
      })
      .select("id, order_no")
      .single();

    if (error) {
      alert(`Nie udało się zapisać karty: ${error.message}`);
      return;
    }

    state.editingOrderId = inserted.id;
    state.editingOrderNo = inserted.order_no;
  }

  updateSaveButtonLabel();
  exportBtn.disabled = false;
  exportPdfBtn.disabled = false;
  alert("Karta została zapisana w bazie. Znajdziesz ją w podstronie Zamówienia.");
}

async function applyEditFromQuery() {
  if (!ensureSupabase()) {
    return;
  }

  const params = new URLSearchParams(window.location.search);
  const editId = params.get("edit");
  if (!editId) {
    return;
  }

  const { data: order, error } = await window.sb
    .from("cards")
    .select("*")
    .eq("id", editId)
    .single();

  if (error || !order) {
    alert("Nie znaleziono zamówienia do edycji.");
    return;
  }

  const category = categoryData.find((item) => item.id === order.category_id);
  if (!category) {
    alert("Kategoria zamówienia nie istnieje w aktualnym słowniku.");
    return;
  }

  state.category = category;
  state.subcategory = order.subcategory;
  state.lastGeneratedData = Array.isArray(order.data) ? order.data : [];
  state.editingOrderId = order.id;
  state.editingOrderNo = order.order_no;

  renderCategories();
  renderSubcategories();
  renderForm();
  setFormData(state.lastGeneratedData);
  renderSummary(state.lastGeneratedData);
  updateSaveButtonLabel();
  exportBtn.disabled = false;
  exportPdfBtn.disabled = false;
}

function exportToExcel() {
  if (!state.lastGeneratedData || !state.category || !state.subcategory) {
    return;
  }

  if (typeof XLSX === "undefined") {
    alert("Biblioteka do eksportu Excel nie została załadowana.");
    return;
  }

  const now = new Date();
  const datePart = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
  const aoa = [
    ["Karta produktowa FARO"],
    ["Nr zamówienia", state.editingOrderNo || "Nowe"],
    ["Kategoria", state.category.name],
    ["Podkategoria", state.subcategory],
    ["Data wygenerowania", datePart],
    [],
    ["Parametr", "Wartość", "Typ pola"]
  ];

  state.lastGeneratedData.forEach((item) => {
    aoa.push([item.label, item.value, item.required ? "Wypełnia handlowiec" : "Wypełnia import"]);
  });

  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.aoa_to_sheet(aoa);
  ws["!cols"] = [{ wch: 50 }, { wch: 38 }, { wch: 22 }];
  XLSX.utils.book_append_sheet(wb, ws, "Karta Compact");

  const fileBase = sanitizeFilename(`${state.category.name}-${state.subcategory}`) || "karta-produktowa";
  XLSX.writeFile(wb, `${fileBase}-${datePart}.xlsx`);
}

function exportToPdf() {
  if (!state.lastGeneratedData || !state.category || !state.subcategory) {
    return;
  }

  if (typeof window.jspdf === "undefined") {
    alert("Biblioteka do eksportu PDF nie została załadowana.");
    return;
  }

  const { jsPDF } = window.jspdf;
  const doc = new jsPDF({ orientation: "portrait", unit: "pt", format: "a4" });
  const now = new Date();
  const datePart = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;

  doc.setFontSize(14);
  doc.text("Karta produktowa FARO", 40, 38);
  doc.setFontSize(10);
  doc.text(`Nr zamówienia: ${state.editingOrderNo || "Nowe"}`, 40, 58);
  doc.text(`Kategoria: ${state.category.name}`, 40, 74);
  doc.text(`Podkategoria: ${state.subcategory}`, 40, 90);
  doc.text(`Data wygenerowania: ${datePart}`, 40, 106);

  const body = state.lastGeneratedData.map((item) => [
    item.label,
    item.value,
    item.required ? "Wypełnia handlowiec" : "Wypełnia import"
  ]);

  doc.autoTable({
    startY: 122,
    head: [["Parametr", "Wartość", "Sekcja"]],
    body,
    styles: { fontSize: 9, cellPadding: 4, overflow: "linebreak" },
    headStyles: { fillColor: [31, 60, 109] },
    columnStyles: {
      0: { cellWidth: 180 },
      1: { cellWidth: 220 },
      2: { cellWidth: 110 }
    }
  });

  const fileBase = sanitizeFilename(`${state.category.name}-${state.subcategory}`) || "karta-produktowa";
  doc.save(`${fileBase}-${datePart}.pdf`);
}

generateBtn.addEventListener("click", () => {
  const data = collectFormData();
  state.lastGeneratedData = data;
  renderSummary(data);
  exportBtn.disabled = false;
  exportPdfBtn.disabled = false;
});

saveBtn.addEventListener("click", async () => {
  await upsertOrderFromCurrentForm();
});

exportBtn.addEventListener("click", () => {
  exportToExcel();
});

exportPdfBtn.addEventListener("click", () => {
  exportToPdf();
});

resetBtn.addEventListener("click", () => {
  state.category = null;
  state.subcategory = null;
  state.lastGeneratedData = null;
  state.editingOrderId = null;
  state.editingOrderNo = null;
  updateSaveButtonLabel();
  clearSummary();
  exportBtn.disabled = true;
  exportPdfBtn.disabled = true;
  renderCategories();
  renderSubcategories();
  renderForm();
});

async function init() {
  if (!ensureSupabase()) {
    return;
  }

  renderCategories();
  renderSubcategories();
  renderForm();
  updateSaveButtonLabel();
  await applyEditFromQuery();
}

init();
