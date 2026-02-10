console.log("Tours Module: Loading...");
console.log("Window.TOURS available?", !!window.TOURS);
// Access UMD Globals
const { TOURS, TRANSPORT_FEE } = window;
import { state, saveToLocalStorage } from "../state.js";
import { closeModal } from "./ui.js";

// Helper to get tours safely (consistent with old code structure)
const getTours = () => TOURS;

// --- Dynamic Rendering (Tours) ---
export function renderTours() {
  const allTours = getTours();
  if (!allTours || Object.keys(allTours).length === 0) {
    console.error("Render Error: Tours not found.");
    return;
  }
  const containers = {
    "Local Tours & Experiences": document.getElementById(
      "local-tours-container"
    ),
    "Day Trips & Excursions": document.getElementById("day-trips-container"),
    "Unique Attractions": document.getElementById(
      "unique-attractions-container"
    ),
  };

  // Clear existing content
  Object.values(containers).forEach((c) => {
    if (c) c.innerHTML = "";
  });

  // Track item count per category for staggered delays
  const categoryCounts = {};

  Object.entries(allTours).forEach(([id, tour]) => {
    const container = containers[tour.category];
    if (!container) return;

    if (!categoryCounts[tour.category]) categoryCounts[tour.category] = 0;
    const idx = categoryCounts[tour.category]++;
    const delay = (idx % 3) * 150;

    const card = document.createElement("div");
    card.className = "menu-item reveal";
    card.style.transitionDelay = `${delay}ms`;

    const transportHTML = tour.hideTransport
      ? ""
      : `
        <label class="transport-label">
          <input type="checkbox" class="transport-checkbox" data-tour-id="${id}">
          Transport (+Fee)
        </label>
      `;

    card.innerHTML = `
      <div class="menu-item-image-wrapper">
        <img src="${tour.images[0]}" alt="${
      tour.title
    }" class="menu-item-image" data-tour-id="${id}" loading="lazy">
      </div>
      <div class="menu-item-content">
        <div class="menu-item-header">
           <h3 data-tour-id="${id}">${tour.title}</h3>
           ${
             tour.subtitle
               ? `<span class="menu-item-subtitle">${tour.subtitle}</span>`
               : ""
           }
        </div>
        <div class="price-row">
          <div class="price" data-tour-id="${id}">$${tour.price}</div>
          ${transportHTML}
        </div>
        <div class="menu-item-buttons">
          <button type="button" class="add-to-plan-btn" data-tour-id="${id}" title="Add to Plan">
            <i class="fas fa-plus"></i>
          </button>
          <button type="button" class="details-btn" data-tour-id="${id}">
            More Details
          </button>
        </div>
      </div>
    `;
    container.appendChild(card);
  });
}

// --- Tour Logic ---

export function updateCardPrice(tourId) {
  const tour = TOURS[tourId];
  if (!tour) return;
  const checkboxes = document.querySelectorAll(
    `.transport-label input[data-tour-id="${tourId}"]`
  );
  checkboxes.forEach((cb) => {
    const cardBody = cb.closest(".menu-item-content");
    if (cardBody) {
      const priceEl = cardBody.querySelector(".price");
      if (priceEl) {
        const basePrice = tour.price;
        const hasTransport = state.transportSelections[tourId];
        const finalSinglePrice = basePrice + (hasTransport ? TRANSPORT_FEE : 0);
        priceEl.innerText = `$${finalSinglePrice}`;
      }
    }
  });
}

export function toggleTransport(checkbox, tourId) {
  const isChecked = checkbox.checked;
  state.transportSelections[tourId] = isChecked;
  saveToLocalStorage();

  if (isChecked && !state.selectedTours.includes(tourId)) {
    const addBtn = document.querySelector(
      `.add-to-plan-btn[data-tour-id="${tourId}"]`
    );
    if (addBtn) {
      toggleTour(addBtn, tourId);
    } else {
      state.selectedTours.push(tourId); // Fallback if btn not found
      saveToLocalStorage();
    }
  }
  updateSelectedToursDisplay();
  updateCardPrice(tourId);
}

export function toggleTour(btn, tourId) {
  const tour = TOURS[tourId];
  if (!tour) return;

  const index = state.selectedTours.indexOf(tourId);
  if (index === -1) {
    state.selectedTours.push(tourId);
    saveToLocalStorage();
    if (btn) {
      btn.innerHTML = '<i class="fas fa-check"></i>';
      btn.classList.add("selected");
    }
  } else {
    state.selectedTours.splice(index, 1);
    saveToLocalStorage();
    if (btn) {
      btn.innerHTML = '<i class="fas fa-plus"></i>';
      btn.classList.remove("selected");
    }
    // Auto deselect transport if tour removed
    if (state.transportSelections[tourId]) {
      state.transportSelections[tourId] = false;
      saveToLocalStorage();
      const checkbox = document.querySelector(
        `.transport-label input[data-tour-id="${tourId}"]`
      );
      if (checkbox) checkbox.checked = false;
      updateCardPrice(tourId);
    }
  }
  updateSelectedToursDisplay();
  updateSectionHelperButtons();
}

export function toggleAllInSection(category, btn) {
  const tourIds = Object.keys(TOURS).filter(
    (key) => TOURS[key].category === category
  );
  const selectedCount = tourIds.filter((id) =>
    state.selectedTours.includes(id)
  ).length;

  if (selectedCount > 0) {
    // Unselect All
    tourIds.forEach((id) => {
      const index = state.selectedTours.indexOf(id);
      if (index > -1) {
        state.selectedTours.splice(index, 1);
        saveToLocalStorage();
        if (state.transportSelections[id]) {
          state.transportSelections[id] = false;
          saveToLocalStorage();
          const checkbox = document.querySelector(
            `.transport-label input[data-tour-id="${id}"]`
          );
          if (checkbox) checkbox.checked = false;
          updateCardPrice(id);
        }
      }
    });
  } else {
    // Select All
    tourIds.forEach((id) => {
      if (!state.selectedTours.includes(id)) {
        state.selectedTours.push(id);
        saveToLocalStorage();
      }
    });
  }
  updateAllButtons();
  updateSelectedToursDisplay();
}

export function updateSectionHelperButtons() {
  const categories = Array.from(
    new Set(Object.values(TOURS).map((t) => t.category))
  );
  categories.forEach((category) => {
    const allBtns = document.querySelectorAll(
      `.select-all-btn[data-category="${category}"]`
    );
    allBtns.forEach((btn) => {
      const tourIds = Object.keys(TOURS).filter(
        (key) => TOURS[key].category === category
      );
      const selectedCount = tourIds.filter((id) =>
        state.selectedTours.includes(id)
      ).length;
      if (selectedCount > 0) {
        btn.innerText = "Unselect All";
        btn.classList.add("active");
      } else {
        btn.innerText = "Select All";
        btn.classList.remove("active");
      }
    });
  });
}

export function updateAllButtons() {
  const buttons = document.querySelectorAll(".add-to-plan-btn");
  buttons.forEach((btn) => {
    const tourId = btn.getAttribute("data-tour-id");
    if (tourId) {
      if (state.selectedTours.includes(tourId)) {
        btn.innerHTML = '<i class="fas fa-check"></i>';
        btn.classList.add("selected");
      } else {
        btn.innerHTML = '<i class="fas fa-plus"></i>';
        btn.classList.remove("selected");
      }
    }
  });
  updateSectionHelperButtons();
}

export function calculateTourStats(selectedIds, guestCount) {
  const groups = {};
  let totalReservationPrice = 0;
  selectedIds.forEach((tourId) => {
    const tour = TOURS[tourId];
    if (!tour) return;
    if (!groups[tour.category]) {
      groups[tour.category] = [];
    }
    const hasTransport = state.transportSelections[tourId] || false;
    const singlePersonPrice = tour.price + (hasTransport ? TRANSPORT_FEE : 0);
    const itemTotal = singlePersonPrice * guestCount;

    groups[tour.category].push({
      ...tour,
      hasTransport,
      singlePersonPrice,
      itemTotal,
      tourId,
    });
    totalReservationPrice += itemTotal;
  });
  return { groups, totalReservationPrice };
}

export function generateTourListHTML(groups) {
  let html = "";
  let messageTextParts = [];
  for (const [category, items] of Object.entries(groups)) {
    const sectionTotal = items.reduce((sum, item) => sum + item.itemTotal, 0);
    html += `<div class="tour-list-category"><h5>${category}</h5>`;
    let sectionMsg = `*${category}* (Total: $${sectionTotal}):\n`;
    items.forEach((item) => {
      let htmlTitleSuffix = "";
      if (item.hasTransport) {
        htmlTitleSuffix = `<span style="font-size:0.8em; color:#27ae60; margin-left:5px; font-weight:bold;">(+ Transport)</span>`;
      }
      html += `
            <div class="selected-tour-item-row">
                <span class="tour-row-title">${item.title} ${htmlTitleSuffix}</span>
                <div class="tour-row-right">
                    <span class="tour-row-price">$${item.itemTotal}</span>
                    <span class="tour-remove-btn" data-tour-id="${item.tourId}" title="Remove">
                        <i class="fas fa-times"></i>
                    </span>
                </div>
            </div>`;
      const transpSuffix = item.hasTransport ? " [+Transport]" : "";
      sectionMsg += `  • ${item.title} ($${item.itemTotal})${transpSuffix}\n`;
    });
    html += `</div>`;
    messageTextParts.push(sectionMsg);
  }
  return { html, messageText: messageTextParts.join("\n") };
}

export function updateSelectedToursDisplay() {
  const input = document.getElementById("selected-tours-input");
  const displayContainer = document.getElementById("selected-tours-display");
  const containerWrapper = document.getElementById("selected-tours-container");
  const totalContainer = document.getElementById("reservation-total-container");
  const totalValueSpan = document.getElementById("reservation-total-value");
  const guestsSelect = document.getElementById("guests");

  if (!input || !displayContainer || !containerWrapper || !guestsSelect) return;

  if (state.selectedTours.length === 0) {
    containerWrapper.style.display = "none";
    input.value = "";
    displayContainer.innerHTML = "";
    if (totalContainer) totalContainer.style.display = "none";
    return;
  }
  containerWrapper.style.display = "block";
  if (totalContainer) totalContainer.style.display = "flex";

  const guestCount = guestsSelect.value ? parseInt(guestsSelect.value) : 1;
  const { groups, totalReservationPrice } = calculateTourStats(
    state.selectedTours,
    guestCount
  );
  const { html, messageText } = generateTourListHTML(groups);

  displayContainer.innerHTML = html;
  if (totalValueSpan) {
    totalValueSpan.innerText = `$${totalReservationPrice}`;
  }
  input.value = messageText.trim();
}

export function removeTourById(tourId) {
  const index = state.selectedTours.indexOf(tourId);
  if (index > -1) {
    state.selectedTours.splice(index, 1);
    saveToLocalStorage();
    if (state.transportSelections[tourId]) {
      state.transportSelections[tourId] = false;
      saveToLocalStorage();
      const checkbox = document.querySelector(
        `.transport-label input[data-tour-id="${tourId}"]`
      );
      if (checkbox) checkbox.checked = false;
      updateCardPrice(tourId);
    }
    updateSelectedToursDisplay();
    updateAllButtons();
  }
}

export function showTourDetails(tourId) {
  const modal = document.getElementById("detailsModal");
  const title = document.getElementById("modalTitle");
  const list = document.getElementById("detailsList");
  const allTours = getTours();
  const data = allTours[tourId];

  if (data && modal && title && list) {
    title.innerText = data.title;
    list.innerHTML = data.details.map((item) => `<li>${item}</li>`).join("");
    modal.style.display = "flex";
    modal.classList.add("active");
    const nav = document.querySelector("nav");
    if (nav) nav.style.display = "none";
  }
}

export { getTours };
