/**
 * APEX ARCHITECTURAL METALWORKS - CORE ENGINE
 * Real-time 2D Blueprint Visualizer, Dynamic Quotation Engine & Gemini AI Advisor
 */

const STORAGE_KEY = "apex_metalworks_config_v2";
const INQUIRIES_KEY = "apex_metalworks_inquiries_v2";
const ADMIN_PIN_KEY = "apex_metalworks_pin_v2";

let appData = null;
let activeCategory = "all";
let attachedPhotoName = "";
let selectedFinishKey = "powder_coat";
let selectedPatternType = "vertical";

document.addEventListener("DOMContentLoaded", () => {
  loadAppData();
  renderShopInfo();
  renderProducts();
  renderRatesInCalculator();
  renderFinishSwatches();
  renderSpecsTable();
  calculateEstimate();
  setupEventListeners();
  setupBeforeAfterSlider();
  setupGeminiChat();
  renderTestimonials();
  renderInquiriesList();
});

function loadAppData() {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved) {
    try {
      appData = JSON.parse(saved);
    } catch (e) {
      console.error("Using default config", e);
      appData = JSON.parse(JSON.stringify(DEFAULT_CONFIG));
    }
  } else {
    appData = JSON.parse(JSON.stringify(DEFAULT_CONFIG));
    saveAppData();
  }
}

function saveAppData() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(appData));
}

function getInquiries() {
  const saved = localStorage.getItem(INQUIRIES_KEY);
  return saved ? JSON.parse(saved) : [];
}

function saveInquiry(inquiry) {
  const list = getInquiries();
  list.unshift({
    id: "inq_" + Date.now(),
    date: new Date().toLocaleString(),
    ...inquiry,
    status: "New"
  });
  localStorage.setItem(INQUIRIES_KEY, JSON.stringify(list));
  renderInquiriesList();
}

function renderShopInfo() {
  document.querySelectorAll(".dyn-shop-name").forEach(el => el.textContent = appData.shopName);
  document.querySelectorAll(".dyn-tagline").forEach(el => el.textContent = appData.tagline);
  document.querySelectorAll(".dyn-phone").forEach(el => {
    el.textContent = appData.phone;
    if (el.tagName === "A") el.href = `tel:${appData.phone.replace(/[^0-9+]/g, "")}`;
  });
  document.querySelectorAll(".dyn-whatsapp").forEach(el => {
    if (el.tagName === "A") el.href = `https://wa.me/${appData.whatsapp.replace(/[^0-9]/g, "")}`;
  });
  document.querySelectorAll(".dyn-address").forEach(el => el.textContent = `${appData.address}, ${appData.city}`);
  document.querySelectorAll(".dyn-hours").forEach(el => el.textContent = appData.workingHours);
  document.querySelectorAll(".dyn-exp").forEach(el => el.textContent = appData.experienceYears);
  document.querySelectorAll(".dyn-projects").forEach(el => el.textContent = appData.projectsCompleted);
  document.querySelectorAll(".dyn-clients").forEach(el => el.textContent = appData.happyClients);
  document.querySelectorAll(".dyn-about").forEach(el => el.textContent = appData.aboutText);

  const mapFrame = document.getElementById("googleMapFrame");
  const mapDirectionsLink = document.getElementById("mapDirectionsLink");
  const query = encodeURIComponent(`${appData.shopName} ${appData.address} ${appData.city}`);
  if (mapFrame) {
    mapFrame.src = `https://maps.google.com/maps?q=${query}&t=&z=14&ie=UTF8&iwloc=&output=embed`;
  }
  if (mapDirectionsLink) {
    mapDirectionsLink.href = `https://www.google.com/maps/dir/?api=1&destination=${query}`;
  }
}

function renderRatesInCalculator() {
  const materialSelect = document.getElementById("calcMaterial");
  if (!materialSelect) return;

  materialSelect.innerHTML = "";
  Object.keys(appData.rates).forEach(key => {
    const item = appData.rates[key];
    const option = document.createElement("option");
    option.value = key;
    option.textContent = `${item.name} (${appData.currencySymbol}${item.baseRateSqFt}/sq.ft)`;
    materialSelect.appendChild(option);
  });
}

function renderFinishSwatches() {
  const container = document.getElementById("finishSwatchesContainer");
  if (!container) return;

  container.innerHTML = "";
  Object.keys(appData.finishes).forEach(key => {
    const f = appData.finishes[key];
    const card = document.createElement("div");
    card.className = `swatch-card ${key === selectedFinishKey ? "active" : ""}`;
    card.dataset.finish = key;
    card.innerHTML = `
      <div class="swatch-circle" style="background:${f.colorHex};"></div>
      <div class="swatch-name">${escapeHtml(f.name.split("(")[0].trim())}</div>
    `;
    card.addEventListener("click", () => {
      document.querySelectorAll(".swatch-card").forEach(c => c.classList.remove("active"));
      card.classList.add("active");
      selectedFinishKey = key;
      calculateEstimate();
    });
    container.appendChild(card);
  });
}

/**
 * Live 2D SVG Grill Blueprint Generator
 */
function update2DGrillBlueprint(widthFt, heightFt, pattern, finishColor) {
  const svg = document.getElementById("grillCanvasSvg");
  if (!svg) return;

  const strokeColor = finishColor || "#f59e0b";
  const frameStroke = "#64748b";
  const barCount = Math.max(3, Math.min(18, Math.round(widthFt * 2.2)));

  let innerContent = "";

  if (pattern === "vertical") {
    // Vertical solid bars
    for (let i = 1; i <= barCount; i++) {
      const x = (i / (barCount + 1)) * 340 + 20;
      innerContent += `<line x1="${x}" y1="20" x2="${x}" y2="180" stroke="${strokeColor}" stroke-width="4" stroke-linecap="round"/>`;
      // Spear/Picket Accent
      innerContent += `<polygon points="${x-3},25 ${x},15 ${x+3},25" fill="${strokeColor}"/>`;
    }
    // Middle bracing bar
    innerContent += `<line x1="20" y1="100" x2="360" y2="100" stroke="${strokeColor}" stroke-width="5"/>`;
    innerContent += `<line x1="20" y1="95" x2="360" y2="95" stroke="${strokeColor}" stroke-width="2" opacity="0.6"/>`;
    innerContent += `<line x1="20" y1="105" x2="360" y2="105" stroke="${strokeColor}" stroke-width="2" opacity="0.6"/>`;
  } else if (pattern === "diamond") {
    // Diamond Lattice criss-cross
    for (let i = -5; i <= 15; i++) {
      const xStart = i * 35;
      innerContent += `<line x1="${xStart}" y1="20" x2="${xStart + 160}" y2="180" stroke="${strokeColor}" stroke-width="3" stroke-linecap="round"/>`;
      innerContent += `<line x1="${xStart + 160}" y1="20" x2="${xStart}" y2="180" stroke="${strokeColor}" stroke-width="3" stroke-linecap="round"/>`;
    }
  } else if (pattern === "belly") {
    // Belly Victorian Curve
    for (let i = 1; i <= barCount; i++) {
      const x = (i / (barCount + 1)) * 340 + 20;
      innerContent += `<path d="M ${x} 20 L ${x} 60 Q ${x+18} 110 ${x} 150 L ${x} 180" stroke="${strokeColor}" stroke-width="4" fill="none" stroke-linecap="round"/>`;
      innerContent += `<circle cx="${x+9}" cy="105" r="4" fill="${strokeColor}"/>`;
    }
    innerContent += `<line x1="20" y1="60" x2="360" y2="60" stroke="${strokeColor}" stroke-width="4"/>`;
    innerContent += `<line x1="20" y1="150" x2="360" y2="150" stroke="${strokeColor}" stroke-width="4"/>`;
  } else if (pattern === "laser") {
    // Parametric Laser Cut Moroccan Honeycomb
    for (let r = 0; r < 3; r++) {
      for (let c = 0; c < 7; c++) {
        const cx = c * 50 + 40;
        const cy = r * 50 + 50;
        innerContent += `<polygon points="${cx},${cy-18} ${cx+16},${cy-9} ${cx+16},${cy+9} ${cx},${cy+18} ${cx-16},${cy+9} ${cx-16},${cy-9}" fill="none" stroke="${strokeColor}" stroke-width="2.5"/>`;
        innerContent += `<circle cx="${cx}" cy="${cy}" r="5" fill="${strokeColor}" opacity="0.8"/>`;
      }
    }
  }

  svg.innerHTML = `
    <!-- Outer Mounting Wall Frame -->
    <rect x="20" y="20" width="340" height="160" rx="4" fill="rgba(0,0,0,0.4)" stroke="${frameStroke}" stroke-width="6"/>
    <!-- Dimension Text Overlay -->
    <text x="190" y="14" fill="#94a3b8" font-size="10" font-family="monospace" text-anchor="middle">WIDTH: ${widthFt} FT</text>
    <text x="10" y="105" fill="#94a3b8" font-size="10" font-family="monospace" text-anchor="middle" transform="rotate(-90, 10, 105)">HEIGHT: ${heightFt} FT</text>
    <!-- Grill Bar Elements -->
    ${innerContent}
    <!-- Corner Anchor Bolts -->
    <circle cx="28" cy="28" r="3" fill="#f59e0b"/>
    <circle cx="352" cy="28" r="3" fill="#f59e0b"/>
    <circle cx="28" cy="172" r="3" fill="#f59e0b"/>
    <circle cx="352" cy="172" r="3" fill="#f59e0b"/>
  `;
}

/**
 * Live Cost & Weight Calculation Engine
 */
function calculateEstimate() {
  const widthFt = parseFloat(document.getElementById("calcWidth").value) || 0;
  const heightFt = parseFloat(document.getElementById("calcHeight").value) || 0;
  const quantity = parseInt(document.getElementById("calcQty").value) || 1;
  const materialKey = document.getElementById("calcMaterial").value;
  const patternSelect = document.getElementById("calcPattern");
  selectedPatternType = patternSelect ? patternSelect.value : "vertical";
  const complexity = parseFloat(document.getElementById("calcComplexity").value) || 1.0;
  const productType = document.querySelector(".calc-type-btn.active")?.dataset.type || "Window Grill";

  document.getElementById("calcWidthVal").textContent = widthFt + " ft";
  document.getElementById("calcHeightVal").textContent = heightFt + " ft";
  document.getElementById("calcQtyVal").textContent = quantity + " unit(s)";

  const singleSqFt = widthFt * heightFt;
  const totalSqFt = singleSqFt * quantity;

  const material = appData.rates[materialKey] || Object.values(appData.rates)[0];
  const finish = appData.finishes[selectedFinishKey] || Object.values(appData.finishes)[0];

  const baseRatePerSqFt = material.baseRateSqFt;
  const finishRatePerSqFt = finish.extraPerSqFt;
  const effectiveRateSqFt = Math.round((baseRatePerSqFt + finishRatePerSqFt) * complexity);

  const approxWeightKg = Math.round(totalSqFt * (material.weightPerSqFt || 3.5) * complexity);
  const estimatedTotal = Math.round(totalSqFt * effectiveRateSqFt);

  document.getElementById("summarySqFt").textContent = `${totalSqFt.toFixed(1)} sq. ft (${singleSqFt.toFixed(1)} sq.ft × ${quantity})`;
  document.getElementById("summaryRate").textContent = `${appData.currencySymbol}${effectiveRateSqFt} / sq. ft`;
  document.getElementById("summaryWeight").textContent = `~${approxWeightKg} kg approx`;
  document.getElementById("summaryMaterial").textContent = material.name.split("(")[0].trim();
  document.getElementById("summaryFinish").textContent = finish.name.split("(")[0].trim();
  document.getElementById("summaryTotal").textContent = `${appData.currencySymbol}${estimatedTotal.toLocaleString()}`;

  // Update live SVG blueprint
  update2DGrillBlueprint(widthFt, heightFt, selectedPatternType, finish.colorHex);

  // Build WhatsApp Quotation Link
  const waBtn = document.getElementById("btnEstimateWhatsApp");
  if (waBtn) {
    const waNumber = appData.whatsapp.replace(/[^0-9]/g, "");
    let photoNote = attachedPhotoName ? `\n📸 *Attached Blueprint/Site Photo:* ${attachedPhotoName}` : "";

    const msg = `*Quotation Inquiry — ${appData.shopName}* 🛠️\n\n` +
      `📌 *Item Type:* ${productType}\n` +
      `📐 *Dimensions:* ${widthFt} ft (W) × ${heightFt} ft (H) [Qty: ${quantity} unit(s)]\n` +
      `📏 *Total Area:* ${totalSqFt.toFixed(1)} Sq. Ft.\n` +
      `🔩 *Material Alloy:* ${material.name}\n` +
      `🎨 *Finish:* ${finish.name} (${finish.warranty})\n` +
      `⚖️ *Approx Weight:* ~${approxWeightKg} kg\n` +
      `💰 *Estimated Quotation:* ${appData.currencySymbol}${estimatedTotal.toLocaleString()} (${appData.currencySymbol}${effectiveRateSqFt}/sq.ft)${photoNote}\n\n` +
      `Please confirm availability for laser site measurement and formal invoice.`;

    waBtn.href = `https://wa.me/${waNumber}?text=${encodeURIComponent(msg)}`;
  }
}

window.handleAttachPhoto = function(input) {
  if (input.files && input.files[0]) {
    attachedPhotoName = input.files[0].name;
    const label = document.getElementById("photoAttachLabel");
    if (label) {
      label.textContent = `Attached: ${attachedPhotoName}`;
      label.style.color = "var(--accent-gold)";
    }
    calculateEstimate();
    showToast(`Blueprint/Photo "${attachedPhotoName}" attached for WhatsApp!`);
  }
};

/**
 * Interactive Before & After Slider
 */
function setupBeforeAfterSlider() {
  const container = document.getElementById("beforeAfterContainer");
  const handle = document.getElementById("baHandle");
  const afterLayer = document.getElementById("baAfterLayer");

  if (!container || !handle || !afterLayer) return;

  let isDragging = false;

  function setSliderPosition(x) {
    const rect = container.getBoundingClientRect();
    let pos = (x - rect.left) / rect.width;
    pos = Math.max(0.05, Math.min(0.95, pos));
    const percentage = pos * 100;
    afterLayer.style.width = percentage + "%";
    handle.style.left = percentage + "%";
  }

  container.addEventListener("mousedown", (e) => {
    isDragging = true;
    setSliderPosition(e.clientX);
  });

  window.addEventListener("mouseup", () => isDragging = false);

  window.addEventListener("mousemove", (e) => {
    if (!isDragging) return;
    setSliderPosition(e.clientX);
  });

  // Touch Support
  container.addEventListener("touchstart", (e) => {
    isDragging = true;
    setSliderPosition(e.touches[0].clientX);
  });

  window.addEventListener("touchend", () => isDragging = false);

  window.addEventListener("touchmove", (e) => {
    if (!isDragging) return;
    setSliderPosition(e.touches[0].clientX);
  });
}

/**
 * Render Product Catalog Cards
 */
function renderProducts() {
  const grid = document.getElementById("productGrid");
  if (!grid) return;

  grid.innerHTML = "";

  const filtered = activeCategory === "all"
    ? appData.products
    : appData.products.filter(p => p.category === activeCategory);

  if (filtered.length === 0) {
    grid.innerHTML = `<div style="grid-column: 1/-1; text-align: center; padding: 40px; color: var(--text-muted);">No architectural installations found in this category.</div>`;
    return;
  }

  filtered.forEach(product => {
    const card = document.createElement("div");
    card.className = "product-card";
    
    const featuresHtml = (product.features || [])
      .slice(0, 3)
      .map(f => `<li>${escapeHtml(f)}</li>`)
      .join("");

    const categoryLabel = getCategoryName(product.category);

    card.innerHTML = `
      <div class="product-img-wrap">
        <img src="${escapeHtml(product.image)}" alt="${escapeHtml(product.title)}" class="product-img" loading="lazy">
        <span class="product-category-tag">${categoryLabel}</span>
      </div>
      <div class="product-body">
        <h3 class="product-title">${escapeHtml(product.title)}</h3>
        <div class="product-material-pill">${escapeHtml(product.material)}</div>
        <p class="product-desc">${escapeHtml(product.description)}</p>
        <ul class="product-features-list">${featuresHtml}</ul>
        <div class="product-footer">
          <div class="product-price-info">
            <span class="product-price-label">Reference Rate</span>
            <span class="product-price-val">${escapeHtml(product.priceRange)}</span>
          </div>
          <button class="btn btn-sm btn-whatsapp" onclick="inquireProduct('${product.id}')">
            <span>WhatsApp</span> 💬
          </button>
        </div>
      </div>
    `;

    grid.appendChild(card);
  });
}

function getCategoryName(cat) {
  const map = {
    window: "Window Grill",
    gates: "Main Gate",
    doors: "Safety Door",
    balcony: "Balcony Railing",
    stairs: "Staircase Railing",
    laser: "Laser Cut Facade"
  };
  return map[cat] || "Architectural Work";
}

window.inquireProduct = function(productId) {
  const product = appData.products.find(p => p.id === productId);
  if (!product) return;

  const waNumber = appData.whatsapp.replace(/[^0-9]/g, "");
  const msg = `*Inquiry for ${escapeHtml(product.title)}* 🛠️\n\n` +
    `Hello ${appData.shopName}, I am reviewing this architectural design on your site:\n` +
    `• *Category:* ${getCategoryName(product.category)}\n` +
    `• *Material Alloy:* ${product.material}\n` +
    `• *Reference Rate:* ${product.priceRange}\n\n` +
    `Please share more CAD blueprints or book a site visit.`;

  window.open(`https://wa.me/${waNumber}?text=${encodeURIComponent(msg)}`, "_blank");
};

/**
 * Render Technical Specifications & Material Tolerances Table
 */
function renderSpecsTable() {
  const container = document.getElementById("specsTableBody");
  if (!container) return;

  container.innerHTML = "";
  Object.keys(appData.rates).forEach(key => {
    const r = appData.rates[key];
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td><strong>${escapeHtml(r.name)}</strong></td>
      <td><span style="font-family:var(--font-mono); color:var(--accent-steel);">${escapeHtml(r.tensile || "400 MPa")}</span></td>
      <td><span class="badge badge-gold" style="padding:2px 8px; font-size:0.7rem;">${escapeHtml(r.antiBurglary || "Grade 4")}</span></td>
      <td>${escapeHtml(r.weightPerSqFt)} kg / sq.ft</td>
      <td><strong style="color:var(--accent-gold);">${appData.currencySymbol}${r.baseRateSqFt} / sq.ft</strong></td>
    `;
    container.appendChild(tr);
  });
}

/**
 * Render Testimonials
 */
function renderTestimonials() {
  const grid = document.getElementById("testimonialGrid");
  if (!grid) return;

  grid.innerHTML = "";
  (appData.testimonials || []).forEach(t => {
    const card = document.createElement("div");
    card.className = "testimonial-card";
    const initial = t.name ? t.name.charAt(0).toUpperCase() : "A";
    card.innerHTML = `
      <div class="stars">${"★".repeat(t.rating || 5)}</div>
      <p class="testimonial-text">"${escapeHtml(t.text)}"</p>
      <div class="client-meta">
        <div class="client-avatar">${initial}</div>
        <div class="client-info">
          <span class="client-name">${escapeHtml(t.name)}</span>
          <span class="client-role">${escapeHtml(t.role)}</span>
        </div>
      </div>
    `;
    grid.appendChild(card);
  });
}

/**
 * ==========================================================================
 * GEMINI AI ARCHITECTURAL ADVISOR SYSTEM
 * ==========================================================================
 */
const EXPERT_KNOWLEDGE = {
  rust: "To ensure 100% rust-free life on Mild Steel (MS):\n1. Immersion in 7-tank hot chemical zinc phosphating.\n2. Epoxy red oxide zinc chromate corrosion inhibitor.\n3. High-heat baked polyester powder coat (8+ years zero oxidation guarantee).\nFor coastal oceanfront locations, Marine SS-316 or SS-304 is the definitive standard.",
  gauge: "Steel Gauge Engineering Rules:\n• 10G / 12G (2.8mm - 3.2mm): Heavy armored, required for Main Entrance Driveway Gates & High-Security Safety Doors.\n• 14G (2.0mm): Architectural golden standard for Window Grills, Balconies & Terraces.\n• 16G (1.5mm): Secondary internal partitions & mosquito screen frame insets.",
  difference: "Mild Steel (MS) vs Stainless Steel (SS-304):\n• MS: Budget-friendly (₹240-₹310/sq.ft), superior custom shape forgeability, requires powder coating.\n• SS-304: Premium (₹490-₹620/sq.ft), zero maintenance, completely immune to water/salt corrosion, luxury satin/mirror finish.",
  balcony: "Balcony Fall Prevention Standards:\n• Minimum 42 inches (3.5 ft) finished railing height.\n• Vertical baluster spacing must never exceed 4.0 inches (100mm) for child safety.\n• High-tensile SS-316 invisible wire cables offer 300kg tensile break threshold with zero sightline blockage.",
  cost: `Fabication pricing standards:\n• Window Grills: ₹240 - ₹310 per sq. ft.\n• Safety Security Doors: ₹340 - ₹460 per sq. ft.\n• Main Driveway Gates: ₹420 - ₹540 per sq. ft.\n• Balcony Railings: ₹380 - ₹620 per sq. ft.\nUse our 2D Live Visualizer at the top of the page for an exact real-time quote!`,
  powder: "Powder Coating vs Oil Paint:\nPowder coating uses electrostatic charged polyester resin cured in a 200°C oven. It creates a rock-solid, UV-resistant shield that will not crack or peel for 8-12 years, while normal liquid paint degrades in 18-24 months under sun and monsoon rain."
};

function setupGeminiChat() {
  const btnToggle = document.getElementById("btnToggleGeminiChat");
  const chatWidget = document.getElementById("geminiChatWidget");
  const btnClose = document.getElementById("btnCloseGeminiChat");
  const chatForm = document.getElementById("geminiChatForm");
  const chatInput = document.getElementById("geminiChatInput");

  if (btnToggle && chatWidget) {
    btnToggle.addEventListener("click", () => {
      chatWidget.classList.toggle("active");
      if (chatWidget.classList.contains("active")) {
        chatInput.focus();
      }
    });
  }

  if (btnClose && chatWidget) {
    btnClose.addEventListener("click", () => {
      chatWidget.classList.remove("active");
    });
  }

  if (chatForm) {
    chatForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const query = chatInput.value.trim();
      if (!query) return;
      chatInput.value = "";
      handleUserChat(query);
    });
  }

  document.querySelectorAll(".chat-chip").forEach(chip => {
    chip.addEventListener("click", () => {
      const q = chip.dataset.query;
      handleUserChat(q);
    });
  });
}

function appendChatMessage(sender, text) {
  const container = document.getElementById("chatMessages");
  if (!container) return;

  const msgDiv = document.createElement("div");
  msgDiv.className = `chat-msg ${sender}`;
  const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  msgDiv.innerHTML = `
    <div class="msg-bubble">${escapeHtml(text).replace(/\n/g, "<br>")}</div>
    <span class="msg-time">${timeStr}</span>
  `;

  container.appendChild(msgDiv);
  container.scrollTop = container.scrollHeight;
}

async function handleUserChat(query) {
  appendChatMessage("user", query);

  if (appData.geminiApiKey && appData.geminiApiKey.trim().length > 10) {
    appendChatMessage("bot", "Analyzing with Gemini AI Architectural Engine...");
    const lastMsg = document.querySelector("#chatMessages .chat-msg.bot:last-child .msg-bubble");

    try {
      const prompt = `You are a master architectural metal fabricator and consultant for "${appData.shopName}".\n` +
        `Shop Details: Heavy MS 10G/12G/14G grills, Forged Wrought Iron, SS-304/316, CNC laser cutting. Base rate: MS (₹240/sqft), Wrought Iron (₹420/sqft), SS-304 (₹490/sqft).\n` +
        `Customer Question: ${query}\n` +
        `Provide an authoritative, elegant, and technically accurate architectural metal fabrication answer in 2-3 structured paragraphs.`;

      const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${encodeURIComponent(appData.geminiApiKey.trim())}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
      });

      const json = await res.json();
      const aiReply = json.candidates?.[0]?.content?.parts?.[0]?.text || getSmartOfflineResponse(query);
      if (lastMsg) lastMsg.innerHTML = escapeHtml(aiReply).replace(/\n/g, "<br>");
    } catch (err) {
      console.warn("Gemini API fallback", err);
      const fallbackReply = getSmartOfflineResponse(query);
      if (lastMsg) lastMsg.innerHTML = escapeHtml(fallbackReply).replace(/\n/g, "<br>");
    }
  } else {
    setTimeout(() => {
      const reply = getSmartOfflineResponse(query);
      appendChatMessage("bot", reply);
    }, 350);
  }
}

function getSmartOfflineResponse(query) {
  const q = query.toLowerCase();

  if (q.includes("rust") || q.includes("corrosion") || q.includes("paint") || q.includes("primer")) {
    return EXPERT_KNOWLEDGE.rust;
  }
  if (q.includes("gauge") || q.includes("thickness") || q.includes("12g") || q.includes("14g") || q.includes("16g") || q.includes("heavy")) {
    return EXPERT_KNOWLEDGE.gauge;
  }
  if (q.includes("difference") || q.includes("ms") || q.includes("mild steel") || q.includes("stainless") || q.includes("ss") || q.includes("ss304")) {
    return EXPERT_KNOWLEDGE.difference;
  }
  if (q.includes("balcony") || q.includes("child") || q.includes("invisible") || q.includes("high rise") || q.includes("apartment")) {
    return EXPERT_KNOWLEDGE.balcony;
  }
  if (q.includes("cost") || q.includes("price") || q.includes("rate") || q.includes("quote") || q.includes("how much") || q.includes("window")) {
    return EXPERT_KNOWLEDGE.cost;
  }
  if (q.includes("powder") || q.includes("coat") || q.includes("enamel")) {
    return EXPERT_KNOWLEDGE.powder;
  }

  return `Welcome to ${appData.shopName}. I can provide engineering guidance on:\n• Alloy selection (MS 10G/12G vs SS-304/316)\n• 7-Tank Zinc Anti-Rust powder coating specifications\n• Structural balcony fall-prevention codes\n• Motorized gate automation & live quotes.\n\nHow can I assist your architectural project today?`;
}

/**
 * Setup Event Listeners
 */
function setupEventListeners() {
  const calcInputs = ["calcWidth", "calcHeight", "calcQty", "calcMaterial", "calcComplexity", "calcPattern"];
  calcInputs.forEach(id => {
    const el = document.getElementById(id);
    if (el) el.addEventListener("input", calculateEstimate);
  });

  document.querySelectorAll(".calc-type-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".calc-type-btn").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      calculateEstimate();
    });
  });

  document.querySelectorAll(".filter-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".filter-btn").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      activeCategory = btn.dataset.category;
      renderProducts();
    });
  });

  const inquiryForm = document.getElementById("inquiryForm");
  if (inquiryForm) {
    inquiryForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const name = document.getElementById("inqName").value.trim();
      const phone = document.getElementById("inqPhone").value.trim();
      const location = document.getElementById("inqLocation").value.trim();
      const workType = document.getElementById("inqWorkType").value;
      const notes = document.getElementById("inqNotes").value.trim();

      if (!name || !phone) {
        showToast("Please enter your name and contact phone number.");
        return;
      }

      const inquiryData = { name, phone, location, workType, notes };
      saveInquiry(inquiryData);

      showToast("Opening WhatsApp with your site measurement booking...");

      const waNumber = appData.whatsapp.replace(/[^0-9]/g, "");
      const msg = `*Site Measurement & Blueprint Consultation Request* 📐\n\n` +
        `• *Client Name:* ${name}\n` +
        `• *Contact Phone:* ${phone}\n` +
        `• *Site Location:* ${location || "Not specified"}\n` +
        `• *Scope of Work:* ${workType}\n` +
        `• *Project Notes:* ${notes || "None"}\n\n` +
        `Please confirm when your senior technician can visit for laser measurement.`;

      setTimeout(() => {
        window.open(`https://wa.me/${waNumber}?text=${encodeURIComponent(msg)}`, "_blank");
      }, 600);

      inquiryForm.reset();
    });
  }

  // Admin Modal
  const btnOpenAdmin = document.getElementById("btnOpenAdmin");
  const adminModal = document.getElementById("adminModal");
  const btnCloseAdmin = document.getElementById("btnCloseAdmin");

  if (btnOpenAdmin && adminModal) {
    btnOpenAdmin.addEventListener("click", () => {
      const storedPin = localStorage.getItem(ADMIN_PIN_KEY) || "1234";
      const userPin = prompt("Enter Studio Admin PIN (Default: 1234):");
      if (userPin === storedPin) {
        openAdminModal();
      } else if (userPin !== null) {
        alert("Incorrect PIN code.");
      }
    });
  }

  if (btnCloseAdmin && adminModal) {
    btnCloseAdmin.addEventListener("click", () => {
      adminModal.classList.remove("active");
    });
  }

  document.querySelectorAll(".admin-tab-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".admin-tab-btn").forEach(b => b.classList.remove("active"));
      document.querySelectorAll(".admin-tab-panel").forEach(p => p.classList.remove("active"));
      btn.classList.add("active");
      const targetPanel = document.getElementById(btn.dataset.tab);
      if (targetPanel) targetPanel.classList.add("active");
    });
  });

  const mobileMenuToggle = document.getElementById("mobileMenuToggle");
  const navLinks = document.getElementById("navLinks");
  if (mobileMenuToggle && navLinks) {
    mobileMenuToggle.addEventListener("click", () => {
      const isVisible = navLinks.style.display === "flex";
      navLinks.style.display = isVisible ? "none" : "flex";
      navLinks.style.flexDirection = "column";
      navLinks.style.position = "absolute";
      navLinks.style.top = "76px";
      navLinks.style.left = "0";
      navLinks.style.right = "0";
      navLinks.style.background = "var(--bg-surface)";
      navLinks.style.padding = "24px";
      navLinks.style.borderBottom = "1px solid var(--border-medium)";
    });
  }
}

function openAdminModal() {
  const adminModal = document.getElementById("adminModal");
  if (!adminModal) return;

  document.getElementById("adminShopName").value = appData.shopName || "";
  document.getElementById("adminTagline").value = appData.tagline || "";
  document.getElementById("adminPhone").value = appData.phone || "";
  document.getElementById("adminWhatsapp").value = appData.whatsapp || "";
  document.getElementById("adminEmail").value = appData.email || "";
  document.getElementById("adminAddress").value = appData.address || "";
  document.getElementById("adminCity").value = appData.city || "";
  document.getElementById("adminHours").value = appData.workingHours || "";
  document.getElementById("adminAbout").value = appData.aboutText || "";
  document.getElementById("adminGeminiKey").value = appData.geminiApiKey || "";

  renderAdminRates();
  renderAdminProductList();
  renderInquiriesList();

  adminModal.classList.add("active");
}

function renderAdminRates() {
  const container = document.getElementById("adminRatesTableBody");
  if (!container) return;

  container.innerHTML = "";
  Object.keys(appData.rates).forEach(key => {
    const r = appData.rates[key];
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td><strong>${escapeHtml(r.name)}</strong></td>
      <td><input type="number" id="rate_${key}" value="${r.baseRateSqFt}" style="width:100px;"></td>
      <td><input type="number" step="0.1" id="weight_${key}" value="${r.weightPerSqFt}" style="width:100px;"></td>
    `;
    container.appendChild(tr);
  });
}

function renderAdminProductList() {
  const container = document.getElementById("adminProductsList");
  if (!container) return;

  container.innerHTML = "";
  appData.products.forEach(p => {
    const item = document.createElement("div");
    item.style.display = "flex";
    item.style.alignItems = "center";
    item.style.justifyContent = "space-between";
    item.style.padding = "10px";
    item.style.marginBottom = "8px";
    item.style.background = "var(--bg-input)";
    item.style.borderRadius = "var(--radius-xs)";
    item.style.border = "1px solid var(--border-subtle)";

    item.innerHTML = `
      <div style="display:flex; align-items:center; gap:12px;">
        <img src="${escapeHtml(p.image)}" style="width:46px; height:46px; border-radius:4px; object-fit:cover;">
        <div>
          <div style="font-weight:600; color:var(--text-bright);">${escapeHtml(p.title)}</div>
          <div style="font-size:0.75rem; color:var(--text-muted);">${getCategoryName(p.category)} • ${escapeHtml(p.priceRange)}</div>
        </div>
      </div>
      <button class="btn btn-sm btn-secondary" onclick="deleteProduct('${p.id}')" style="color:#ef4444; border-color:rgba(239,68,68,0.3);">Delete</button>
    `;
    container.appendChild(item);
  });
}

window.addNewProduct = function() {
  const title = document.getElementById("newProdTitle").value.trim();
  const category = document.getElementById("newProdCategory").value;
  const material = document.getElementById("newProdMaterial").value.trim();
  const price = document.getElementById("newProdPrice").value.trim();
  const image = document.getElementById("newProdImage").value.trim() || "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=80";
  const desc = document.getElementById("newProdDesc").value.trim();

  if (!title) {
    alert("Please enter a design title.");
    return;
  }

  const newProd = {
    id: "prod_" + Date.now(),
    title,
    category,
    material: material || "MS 12G Solid Alloy",
    priceRange: price || "₹280 - ₹380 / sq.ft",
    image,
    description: desc || "Architectural grade fabrication with 7-tank powder coating.",
    features: ["Solid Gauge Alloy", "7-Tank Zinc Coating", "Custom Fitted"]
  };

  appData.products.unshift(newProd);
  saveAppData();
  renderProducts();
  renderAdminProductList();

  document.getElementById("newProdTitle").value = "";
  document.getElementById("newProdMaterial").value = "";
  document.getElementById("newProdPrice").value = "";
  document.getElementById("newProdImage").value = "";
  document.getElementById("newProdDesc").value = "";

  showToast("New architectural design added!");
};

window.deleteProduct = function(id) {
  if (confirm("Delete this architectural design?")) {
    appData.products = appData.products.filter(p => p.id !== id);
    saveAppData();
    renderProducts();
    renderAdminProductList();
    showToast("Design removed.");
  }
};

window.saveAllAdminSettings = function() {
  appData.shopName = document.getElementById("adminShopName").value.trim();
  appData.tagline = document.getElementById("adminTagline").value.trim();
  appData.phone = document.getElementById("adminPhone").value.trim();
  appData.whatsapp = document.getElementById("adminWhatsapp").value.trim();
  appData.email = document.getElementById("adminEmail").value.trim();
  appData.address = document.getElementById("adminAddress").value.trim();
  appData.city = document.getElementById("adminCity").value.trim();
  appData.workingHours = document.getElementById("adminHours").value.trim();
  appData.aboutText = document.getElementById("adminAbout").value.trim();
  appData.geminiApiKey = document.getElementById("adminGeminiKey").value.trim();

  Object.keys(appData.rates).forEach(key => {
    const rateEl = document.getElementById(`rate_${key}`);
    const weightEl = document.getElementById(`weight_${key}`);
    if (rateEl && appData.rates[key]) {
      appData.rates[key].baseRateSqFt = parseFloat(rateEl.value) || appData.rates[key].baseRateSqFt;
    }
    if (weightEl && appData.rates[key]) {
      appData.rates[key].weightPerSqFt = parseFloat(weightEl.value) || appData.rates[key].weightPerSqFt;
    }
  });

  saveAppData();
  renderShopInfo();
  renderRatesInCalculator();
  renderSpecsTable();
  calculateEstimate();
  renderProducts();

  showToast("All studio settings, rates, and AI keys updated!");
  document.getElementById("adminModal").classList.remove("active");
};

function renderInquiriesList() {
  const container = document.getElementById("adminInquiriesTableBody");
  if (!container) return;

  const inquiries = getInquiries();
  if (inquiries.length === 0) {
    container.innerHTML = `<tr><td colspan="5" style="text-align:center; color:var(--text-muted);">No quotation requests logged yet.</td></tr>`;
    return;
  }

  container.innerHTML = "";
  inquiries.forEach(inq => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td><span style="font-size:0.75rem; color:var(--text-muted);">${escapeHtml(inq.date)}</span></td>
      <td><strong>${escapeHtml(inq.name)}</strong></td>
      <td><a href="tel:${escapeHtml(inq.phone)}" style="color:var(--accent-steel);">${escapeHtml(inq.phone)}</a></td>
      <td>${escapeHtml(inq.workType || "-")} (${escapeHtml(inq.location || "-")})</td>
      <td>
        <a href="https://wa.me/${inq.phone.replace(/[^0-9]/g, "")}" target="_blank" class="btn btn-sm btn-whatsapp" style="padding:4px 8px; font-size:0.75rem;">Reply</a>
      </td>
    `;
    container.appendChild(tr);
  });
}

window.exportConfig = function() {
  const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(appData, null, 2));
  const downloadAnchor = document.createElement("a");
  downloadAnchor.setAttribute("href", dataStr);
  downloadAnchor.setAttribute("download", `apex_metalworks_config_${Date.now()}.json`);
  document.body.appendChild(downloadAnchor);
  downloadAnchor.click();
  downloadAnchor.remove();
};

window.resetToDefault = function() {
  if (confirm("Reset studio config to default?")) {
    appData = JSON.parse(JSON.stringify(DEFAULT_CONFIG));
    saveAppData();
    renderShopInfo();
    renderRatesInCalculator();
    renderSpecsTable();
    calculateEstimate();
    renderProducts();
    openAdminModal();
    showToast("Reset to default configuration.");
  }
};

function showToast(message) {
  let toastContainer = document.getElementById("toastContainer");
  if (!toastContainer) {
    toastContainer = document.createElement("div");
    toastContainer.id = "toastContainer";
    toastContainer.className = "toast-container";
    document.body.appendChild(toastContainer);
  }

  const toast = document.createElement("div");
  toast.className = "toast";
  toast.textContent = message;
  toastContainer.appendChild(toast);

  setTimeout(() => {
    toast.remove();
  }, 4000);
}

function escapeHtml(str) {
  if (!str) return "";
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
