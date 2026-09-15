(() => {
  const compounds = {
    "GlyNAC": { tier: "A", studies: "2 linked trials", dose: "600 mg glycine + 600 mg NAC", pathway: "Redox", summary: "Pairs glycine and N-acetylcysteine to support glutathione synthesis and cellular redox balance." },
    "NMN": { tier: "A", studies: "3 linked trials", dose: "250–500 mg", pathway: "NAD+", summary: "A direct NAD+ precursor studied for age-related changes in cellular energy and metabolic signaling." },
    "Ca-AKG": { tier: "A", studies: "2 linked trials", dose: "1–2 g", pathway: "TCA cycle", summary: "Alpha-ketoglutarate salt connecting cellular energy metabolism with epigenetic enzyme activity." },
    "Sulforaphane": { tier: "A", studies: "2 linked trials", dose: "10–35 mg glucoraphanin", pathway: "NRF2", summary: "An isothiocyanate studied for activation of the NRF2 cellular-defense response." },
    "Spermidine": { tier: "B", studies: "2 linked trials", dose: "1–6 mg", pathway: "Autophagy", summary: "A natural polyamine investigated for autophagy, cardiovascular aging, and cellular maintenance." },
    "Taurine": { tier: "B", studies: "1 linked trial", dose: "1–3 g", pathway: "Mitochondria", summary: "A conditionally essential amino sulfonic acid involved in osmoregulation and mitochondrial function." }
  };

  const systems = {
    mitochondria: { number: "01 / 12", grade: "Tier A", code: "ATP", signal: "energy signal", kicker: "ENERGY · QUALITY CONTROL · SIGNALING", name: "Mitochondrial dysfunction", description: "Mitochondria lose efficiency with age, affecting energy production, oxidative balance, and signals that coordinate cellular repair.", labels: ["NAD+", "AMPK", "TCA"], levers: [["NMN", "NAD+ precursor"], ["Ca-AKG", "TCA support"], ["Taurine", "Osmotic balance"]], filter: "mitochondria" },
    epigenetics: { number: "02 / 12", grade: "Tier A", code: "DNMT", signal: "gene control", kicker: "METHYLATION · CHROMATIN · GENE EXPRESSION", name: "Epigenetic alterations", description: "Age changes the molecular marks and chromatin structure that regulate which genes are active, quiet, or difficult to repair.", labels: ["SIRT1", "TET", "HDAC"], levers: [["Ca-AKG", "TET cofactor"], ["NMN", "Sirtuin support"], ["Spermidine", "Chromatin signal"]], filter: "epigenetics" },
    proteostasis: { number: "03 / 12", grade: "Tier A", code: "GSH", signal: "protein defense", kicker: "FOLDING · REPAIR · CLEARANCE", name: "Loss of proteostasis", description: "Protein production, folding, and disposal become less reliable, allowing damaged proteins to accumulate and disrupt cellular function.", labels: ["GSH", "NRF2", "HSP"], levers: [["GlyNAC", "GSH synthesis"], ["Sulforaphane", "NRF2 signal"], ["Spermidine", "Cell cleanup"]], filter: "proteostasis" },
    autophagy: { number: "04 / 12", grade: "Tier B", code: "ATG", signal: "cell cleanup", kicker: "RECYCLING · LYSOSOMES · QUALITY CONTROL", name: "Disabled autophagy", description: "The cell's recycling system becomes less responsive, reducing its ability to clear dysfunctional proteins and organelles.", labels: ["AMPK", "mTOR", "ATG"], levers: [["Spermidine", "Autophagy signal"], ["NMN", "SIRT1 axis"], ["Ca-AKG", "Nutrient sensing"]], filter: "autophagy" },
    inflammation: { number: "05 / 12", grade: "Tier A", code: "NFκB", signal: "immune signal", kicker: "IMMUNE TONE · ROS · BARRIER FUNCTION", name: "Chronic inflammation", description: "Persistent low-grade immune signaling can damage tissue, disrupt metabolism, and amplify several other aging mechanisms.", labels: ["NRF2", "NFκB", "ROS"], levers: [["Sulforaphane", "NRF2 response"], ["GlyNAC", "Redox support"], ["Taurine", "Immune balance"]], filter: "inflammation" },
    senescence: { number: "06 / 12", grade: "Tier B", code: "SASP", signal: "cell arrest", kicker: "CELL ARREST · SASP · TISSUE SIGNALING", name: "Cellular senescence", description: "Damaged cells can stop dividing yet remain metabolically active, releasing signals that alter nearby tissue and immune behavior.", labels: ["SASP", "p16", "BCL2"], levers: [["Spermidine", "Cell maintenance"], ["Ca-AKG", "Metabolic signal"], ["NMN", "Repair support"]], filter: "senescence" }
  };

  let activeFilter = "all";
  let protocol = [];
  try { protocol = JSON.parse(localStorage.getItem("tnic-protocol") || "[]").filter(name => compounds[name]); } catch (_) { protocol = []; }

  const cards = [...document.querySelectorAll(".compound-card")];
  const search = document.getElementById("compoundSearch");
  const grid = document.getElementById("compoundGrid");
  const emptyState = document.getElementById("emptyState");
  const status = document.getElementById("resultStatus");
  const drawer = document.getElementById("protocolDrawer");
  const drawerBackdrop = document.getElementById("drawerBackdrop");
  const dialog = document.getElementById("evidenceDialog");
  const detailBackdrop = document.getElementById("detailBackdrop");
  const toast = document.getElementById("toast");
  let currentDialogCompound = null;

  function showToast(message) {
    toast.textContent = message;
    toast.classList.add("show");
    clearTimeout(showToast.timer);
    showToast.timer = setTimeout(() => toast.classList.remove("show"), 1900);
  }

  function applyFilters() {
    const query = search.value.trim().toLowerCase();
    let visible = 0;
    cards.forEach(card => {
      const haystack = `${card.dataset.name} ${card.dataset.tags} ${card.textContent}`.toLowerCase();
      const matchesQuery = !query || haystack.includes(query);
      const matchesFilter = activeFilter === "all" || card.dataset.tier === activeFilter || card.dataset.tags.includes(activeFilter);
      card.hidden = !(matchesQuery && matchesFilter);
      if (!card.hidden) visible += 1;
    });
    emptyState.hidden = visible !== 0;
    grid.hidden = visible === 0;
    status.textContent = visible === 1 ? "Showing 1 highlighted compound" : `Showing ${visible} highlighted compounds`;
  }

  function setFilter(value) {
    activeFilter = value;
    document.querySelectorAll(".filter-chip").forEach(button => {
      const on = button.dataset.filter === value;
      button.classList.toggle("active", on);
      button.setAttribute("aria-pressed", String(on));
    });
    applyFilters();
  }

  function renderProtocol() {
    document.querySelectorAll("[data-protocol-count]").forEach(node => node.textContent = String(protocol.length));
    document.getElementById("tierACount").textContent = String(protocol.filter(name => compounds[name].tier === "A").length);
    document.getElementById("pathwayCount").textContent = String(new Set(protocol.map(name => compounds[name].pathway)).size);
    document.getElementById("reviewProtocol").disabled = protocol.length === 0;
    document.querySelectorAll("[data-add]").forEach(button => {
      const added = protocol.includes(button.dataset.add);
      button.classList.toggle("added", added);
      if (button.classList.contains("add-button")) button.textContent = added ? "✓" : "＋";
    });
    const list = document.getElementById("protocolList");
    if (!protocol.length) {
      list.innerHTML = '<div class="protocol-empty"><span aria-hidden="true">＋</span><h3>Build a research shortlist.</h3><p>Add a compound to compare evidence and pathway coverage here.</p></div>';
    } else {
      list.innerHTML = protocol.map((name, index) => `<div class="protocol-item"><span>${String(index + 1).padStart(2, "0")}</span><div><strong>${name}</strong><small>Tier ${compounds[name].tier} · ${compounds[name].pathway}</small></div><button type="button" data-remove="${name}" aria-label="Remove ${name} from protocol">×</button></div>`).join("");
      list.querySelectorAll("[data-remove]").forEach(button => button.addEventListener("click", () => removeFromProtocol(button.dataset.remove)));
    }
    try { localStorage.setItem("tnic-protocol", JSON.stringify(protocol)); } catch (_) {}
  }

  function toggleProtocolItem(name) {
    if (protocol.includes(name)) {
      removeFromProtocol(name);
      return;
    }
    protocol.push(name);
    renderProtocol();
    showToast(`${name} added to your protocol`);
  }

  function removeFromProtocol(name) {
    protocol = protocol.filter(item => item !== name);
    renderProtocol();
    showToast(`${name} removed`);
  }

  function openDrawer() {
    drawerBackdrop.hidden = false;
    drawer.setAttribute("aria-hidden", "false");
    requestAnimationFrame(() => drawer.classList.add("open"));
    document.body.classList.add("drawer-open");
    document.getElementById("closeProtocol").focus();
  }

  function closeDrawer() {
    drawer.classList.remove("open");
    drawer.setAttribute("aria-hidden", "true");
    document.body.classList.remove("drawer-open");
    setTimeout(() => { drawerBackdrop.hidden = true; }, 280);
  }

  function openDialog(name) {
    const data = compounds[name];
    currentDialogCompound = name;
    document.getElementById("dialogTitle").textContent = name;
    document.getElementById("dialogSummary").textContent = data.summary;
    document.getElementById("dialogTier").textContent = `Tier ${data.tier}`;
    document.getElementById("dialogStudies").textContent = data.studies;
    document.getElementById("dialogDose").textContent = data.dose;
    detailBackdrop.hidden = false;
    dialog.showModal();
  }

  function closeDialog() {
    dialog.close();
    detailBackdrop.hidden = true;
  }

  document.querySelectorAll(".filter-chip").forEach(button => button.addEventListener("click", () => setFilter(button.dataset.filter)));
  search.addEventListener("input", applyFilters);
  document.getElementById("clearSearch").addEventListener("click", () => { search.value = ""; setFilter("all"); search.focus(); });
  document.getElementById("focusSearch").addEventListener("click", () => search.focus());
  document.getElementById("browseAll").addEventListener("click", () => document.getElementById("compounds").scrollIntoView({ behavior: "smooth" }));
  document.addEventListener("keydown", event => {
    if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") { event.preventDefault(); search.focus(); }
    if (event.key === "Escape") { if (dialog.open) closeDialog(); else if (drawer.classList.contains("open")) closeDrawer(); }
  });

  document.querySelectorAll("[data-view]").forEach(button => button.addEventListener("click", () => {
    document.querySelectorAll("[data-view]").forEach(item => { const active = item === button; item.classList.toggle("active", active); item.setAttribute("aria-pressed", String(active)); });
    grid.classList.toggle("list-view", button.dataset.view === "list");
  }));

  document.querySelectorAll("[data-add]").forEach(button => button.addEventListener("click", () => toggleProtocolItem(button.dataset.add)));
  document.querySelectorAll("[data-inspect]").forEach(button => button.addEventListener("click", () => openDialog(button.dataset.inspect)));
  document.querySelectorAll(".save-button").forEach(button => button.addEventListener("click", () => { button.classList.toggle("saved"); button.textContent = button.classList.contains("saved") ? "★" : "☆"; showToast(button.classList.contains("saved") ? "Saved to research list" : "Removed from research list"); }));

  ["openProtocolRail", "openProtocolTop", "openProtocolCard", "openProtocolMobile"].forEach(id => document.getElementById(id).addEventListener("click", openDrawer));
  document.getElementById("closeProtocol").addEventListener("click", closeDrawer);
  drawerBackdrop.addEventListener("click", closeDrawer);
  document.getElementById("reviewProtocol").addEventListener("click", () => showToast("Protocol review is ready for the next build phase"));
  document.getElementById("closeDialog").addEventListener("click", closeDialog);
  detailBackdrop.addEventListener("click", closeDialog);
  document.getElementById("dialogAdd").addEventListener("click", () => { if (currentDialogCompound) toggleProtocolItem(currentDialogCompound); closeDialog(); });

  document.querySelectorAll("[data-system]").forEach((button, index, buttons) => button.addEventListener("click", () => {
    buttons.forEach(item => item.setAttribute("aria-selected", String(item === button)));
    const data = systems[button.dataset.system];
    document.getElementById("systemNumber").textContent = data.number;
    document.getElementById("systemGrade").textContent = data.grade;
    document.getElementById("systemCode").textContent = data.code;
    document.getElementById("systemSignal").textContent = data.signal;
    document.getElementById("systemKicker").textContent = data.kicker;
    document.getElementById("systemName").textContent = data.name;
    document.getElementById("systemDescription").textContent = data.description;
    document.querySelectorAll(".orbit-label").forEach((label, i) => label.textContent = data.labels[i]);
    document.getElementById("systemLevers").innerHTML = data.levers.map((lever, i) => `<div><span>${String(i + 1).padStart(2, "0")}</span><strong>${lever[0]}</strong><small>${lever[1]}</small></div>`).join("");
    document.getElementById("filterSystem").dataset.targetFilter = data.filter;
  }));

  document.getElementById("filterSystem").addEventListener("click", event => {
    const filter = event.currentTarget.dataset.targetFilter || "mitochondria";
    search.value = "";
    setFilter(filter);
    document.getElementById("compounds").scrollIntoView({ behavior: "smooth" });
  });

  const mobileMenu = document.getElementById("mobileMenu");
  const rail = document.querySelector(".side-rail");
  mobileMenu.addEventListener("click", () => { const open = rail.classList.toggle("open"); mobileMenu.setAttribute("aria-expanded", String(open)); });
  rail.querySelectorAll("a").forEach(link => link.addEventListener("click", () => { rail.classList.remove("open"); mobileMenu.setAttribute("aria-expanded", "false"); }));

  const sections = [...document.querySelectorAll("main section[id]")];
  const dockLinks = [...document.querySelectorAll(".mobile-dock a")];
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      dockLinks.forEach(link => link.classList.toggle("active", link.getAttribute("href") === `#${entry.target.id}`));
    });
  }, { rootMargin: "-45% 0px -45% 0px" });
  sections.forEach(section => observer.observe(section));

  renderProtocol();
  applyFilters();
})();
