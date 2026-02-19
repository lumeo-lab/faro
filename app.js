const categoryData = [
  {
    id: "posciel",
    name: "Pościel",
    desc: "Komplety i zestawy sypialniane",
    subcategories: ["Pościel satynowa", "Pościel bawełniana", "Pościel flanelowa", "Pościel hotelowa"]
  },
  {
    id: "przescieradla",
    name: "Prześcieradła",
    desc: "Modele z gumką i bez gumki",
    subcategories: ["Prześcieradło jersey", "Prześcieradło frotte", "Prześcieradło satynowe", "Prześcieradło hotelowe"]
  },
  {
    id: "reczniki",
    name: "Ręczniki",
    desc: "Produkty kąpielowe i plażowe",
    subcategories: ["Ręcznik kąpielowy", "Ręcznik plażowy", "Ręcznik hotelowy", "Ręcznik dziecięcy"]
  },
  {
    id: "koce",
    name: "Koce",
    desc: "Koce domowe i dekoracyjne",
    subcategories: ["Koc polarowy", "Koc akrylowy", "Koc bawełniany", "Koc dziecięcy"]
  },
  {
    id: "poduszki",
    name: "Poduszki",
    desc: "Poduszki i wyroby poduszkowe",
    subcategories: ["Poduszka dekoracyjna", "Poduszka hotelowa", "Poduszka dziecięca", "Jaś dekoracyjny"]
  },
  {
    id: "szlafroki",
    name: "Szlafroki",
    desc: "Szlafroki domowe i SPA",
    subcategories: ["Szlafrok bawełniany", "Szlafrok waflowy", "Szlafrok hotelowy", "Szlafrok dziecięcy"]
  }
];

const parameterDefinitions = [
  { label: "Nazwa produktu", options: ["Komplet pościeli", "Ręcznik", "Koc", "Poduszka", "Prześcieradło", "Szlafrok"] },
  { label: "Nazwa kolekcji / wzór", options: ["Basic", "Classic", "Premium", "Hotel", "Kids", "Seasonal"] },
  { label: "Nr zapytania", options: ["ZAP/2026/001", "ZAP/2026/002", "ZAP/2026/003"] },
  { label: "Rozmiar", options: ["70x140 cm", "140x200 cm", "160x200 cm", "200x220 cm", "50x60 cm"] },
  { label: "Składniki (nr z porówki, pudełko itp)", options: ["Komplet + pudełko", "Produkt + opaska", "Produkt + worek", "Produkt luzem"] },
  { label: "Gramatura", options: ["120 g/m2", "140 g/m2", "160 g/m2", "180 g/m2", "220 g/m2", "300 g/m2"] },
  { label: "Konstrukcja (skład)", options: ["Tkana", "Dzianina", "Jersey", "Frotte", "Polar"] },
  { label: "Kolor / druk (reaktywny)", options: ["Jednolity", "Nadruk reaktywny", "Nadruk pigmentowy", "Żakard"] },
  { label: "Rodzaj druku (rotacja, panel)", options: ["Rotacja", "Panel", "Brak druku"] },
  { label: "Oeko-Tex / BSCI", options: ["Oeko-Tex", "BSCI", "Oeko-Tex + BSCI", "Brak"] },
  { label: "Kod kreskowy", options: ["EAN-13", "EAN-8", "Kod wewnętrzny"] },
  { label: "Temperatura prania (40, 60, 90°C)", options: ["30°C", "40°C", "60°C", "90°C"] },
  { label: "Made in Green (certyfikaty)", options: ["Tak", "Nie", "W trakcie"] },
  { label: "Rodzaj zapięcia (zamek, guziki, zakładki)", options: ["Zamek", "Guziki", "Zakładka", "Brak"] },
  { label: "Wykurcz ± 2%", options: ["Tak", "Nie", "Do potwierdzenia"] },
  { label: "Skład (100% bawełna)", options: ["100% bawełna", "80% bawełna / 20% poliester", "100% poliester", "Mikrofibra"] },
  { label: "Wymiar opakowania jednostkowego", options: ["30x40x5 cm", "35x45x8 cm", "40x50x10 cm"] },
  { label: "Waga sztuki", options: ["0.25 kg", "0.5 kg", "0.8 kg", "1.2 kg"] },
  { label: "Waga opakowania zbiorczego", options: ["5 kg", "8 kg", "12 kg", "15 kg"] },
  { label: "Rodzaj pakowania (PVC, opaska, worek itp) poduszka / kocyk", options: ["PVC", "Opaska", "Worek", "Pudełko", "Folia"] },
  { label: "Ilość w kartonie (jak pakowane: jedna sztuka w woreczku / mix kolorów)", options: ["5 szt.", "10 szt.", "20 szt.", "Mix kolorów", "Jedna sztuka / woreczek"] },
  { label: "Ilość zamawiana w rozmiarze / kolorze", options: ["100", "200", "500", "1000"] },
  { label: "Oczekiwana cena (FOB, CIF)", options: ["FOB", "CIF", "EXW", "Do negocjacji"] },
  { label: "Termin realizacji", options: ["14 dni", "21 dni", "30 dni", "45 dni"] },
  { label: "Dla kogo i ile komu", options: ["Sieć handlowa", "E-commerce", "Klient detaliczny", "Klient B2B"] },
  { label: "Nr partii", options: ["PARTIA-001", "PARTIA-002", "PARTIA-003"] },
  { label: "Index wewnętrzny", options: ["IDX-1001", "IDX-1002", "IDX-1003"] },
  { label: "Czy jest wszywka (gdzie)", options: ["Tak - bok", "Tak - dół", "Tak - środek", "Brak"] },
  { label: "Etykieta", options: ["Papierowa", "Tekstylna", "Hangtag", "Brak"] },
  { label: "Do kiedy ważna oferta", options: ["7 dni", "14 dni", "30 dni", "60 dni"] },
  { label: "Jakie jest MOQ", options: ["100 szt.", "300 szt.", "500 szt.", "1000 szt."] },
  { label: "Czy oznaczenia FARO", options: ["Tak", "Nie", "Do ustalenia"] },
  { label: "Data produkcji", options: ["Q1 2026", "Q2 2026", "Q3 2026", "Q4 2026"] }
];

const state = {
  category: null,
  subcategory: null,
  lastGeneratedData: null
};

const categoryGrid = document.getElementById("categoryGrid");
const subcategoryGrid = document.getElementById("subcategoryGrid");
const productForm = document.getElementById("productForm");
const generateBtn = document.getElementById("generateBtn");
const exportBtn = document.getElementById("exportBtn");
const resetBtn = document.getElementById("resetBtn");
const summary = document.getElementById("summary");

function createCard(text, desc, selected, onClick) {
  const btn = document.createElement("button");
  btn.type = "button";
  btn.className = `card ${selected ? "selected" : ""}`;
  btn.innerHTML = `<strong>${text}</strong><span>${desc}</span>`;
  btn.addEventListener("click", onClick);
  return btn;
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
        renderCategories();
        renderSubcategories();
        renderForm();
      }
    );
    categoryGrid.appendChild(card);
  });
}

function renderSubcategories() {
  subcategoryGrid.innerHTML = "";
  if (!state.category) {
    subcategoryGrid.classList.add("muted");
    subcategoryGrid.innerHTML = '<p class="placeholder">Najpierw wybierz rodzaj karty produktowej.</p>';
    return;
  }

  subcategoryGrid.classList.remove("muted");
  state.category.subcategories.forEach((name) => {
    const card = createCard(
      name,
      "Wariant produktowy",
      state.subcategory === name,
      () => {
        state.subcategory = name;
        renderSubcategories();
        renderForm();
      }
    );
    subcategoryGrid.appendChild(card);
  });
}

function createParameterRow(param, index) {
  const row = document.createElement("div");
  row.className = "field";

  const label = document.createElement("label");
  label.setAttribute("for", `manual-${index}`);
  label.textContent = `${index + 1}. ${param.label}`;

  const controls = document.createElement("div");
  controls.className = "controls";

  const select = document.createElement("select");
  select.name = `select-${index}`;
  select.dataset.label = param.label;
  select.innerHTML = [
    '<option value="">Wybierz z listy</option>',
    ...param.options.map((option) => `<option value="${option}">${option}</option>`)
  ].join("");

  const manual = document.createElement("input");
  manual.type = "text";
  manual.id = `manual-${index}`;
  manual.name = `manual-${index}`;
  manual.placeholder = "lub wpisz ręcznie";
  manual.dataset.label = param.label;

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
  productForm.innerHTML = "";

  if (!state.category || !state.subcategory) {
    generateBtn.disabled = true;
    exportBtn.disabled = true;
    productForm.classList.add("muted");
    productForm.innerHTML = '<p class="placeholder">Po wyborze kategorii i podkategorii pojawią się pola do uzupełnienia.</p>';
    return;
  }

  productForm.classList.remove("muted");
  parameterDefinitions.forEach((param, index) => {
    productForm.appendChild(createParameterRow(param, index));
  });
  generateBtn.disabled = false;
  exportBtn.disabled = true;
}

function collectFormData() {
  const output = [];
  parameterDefinitions.forEach((param, index) => {
    const select = productForm.querySelector(`[name="select-${index}"]`);
    const manual = productForm.querySelector(`[name="manual-${index}"]`);
    const value = manual.value.trim() || select.value.trim() || "-";
    output.push({ label: param.label, value });
  });
  return output;
}

function renderSummary(data) {
  const rows = data
    .map((item) => `<tr><th>${item.label}</th><td>${item.value}</td></tr>`)
    .join("");

  summary.classList.remove("muted");
  summary.innerHTML = `
    <div class="summary-head">
      <p><strong>Kategoria:</strong> ${state.category.name}</p>
      <p><strong>Podkategoria:</strong> ${state.subcategory}</p>
    </div>
    <div class="table-wrap">
      <table>
        <tbody>${rows}</tbody>
      </table>
    </div>
  `;
}

function sanitizeFilename(value) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
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
    ["Kategoria", state.category.name],
    ["Podkategoria", state.subcategory],
    ["Data wygenerowania", datePart],
    [],
    ["Parametr", "Wartość"]
  ];

  state.lastGeneratedData.forEach((item) => {
    aoa.push([item.label, item.value]);
  });

  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.aoa_to_sheet(aoa);
  ws["!cols"] = [{ wch: 52 }, { wch: 40 }];
  XLSX.utils.book_append_sheet(wb, ws, "Karta Produktowa");

  const fileBase = sanitizeFilename(`${state.category.name}-${state.subcategory}`) || "karta-produktowa";
  XLSX.writeFile(wb, `${fileBase}-${datePart}.xlsx`);
}

generateBtn.addEventListener("click", () => {
  const data = collectFormData();
  state.lastGeneratedData = data;
  renderSummary(data);
  exportBtn.disabled = false;
});

exportBtn.addEventListener("click", () => {
  exportToExcel();
});

resetBtn.addEventListener("click", () => {
  state.category = null;
  state.subcategory = null;
  state.lastGeneratedData = null;
  summary.classList.add("muted");
  summary.textContent = "Wypełnij formularz i kliknij „Generuj kartę”.";
  exportBtn.disabled = true;
  renderCategories();
  renderSubcategories();
  renderForm();
});

renderCategories();
renderSubcategories();
renderForm();
