// JavaScript Document

// Tooplate 2148 Bistro Elegance
// https://www.tooplate.com/view/2148-bistro-elegance

// Mobile menu toggle
const menuToggle = document.querySelector(".menu-toggle");
const navLinks = document.querySelector(".nav-links");

if (menuToggle) {
  menuToggle.addEventListener("click", () => {
    navLinks.classList.toggle("active");
  });
}

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute("href"));
    if (target) {
      // Remove active class from all nav links
      document.querySelectorAll(".nav-links a").forEach((link) => {
        link.classList.remove("active");
      });
      // Add active class to clicked link
      this.classList.add("active");

      target.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
    if (navLinks) {
      navLinks.classList.remove("active");
    }
  });
});

// Update active nav item on scroll
function updateActiveNavItem() {
  const sections = document.querySelectorAll("section[id]");
  const navLinks = document.querySelectorAll('.nav-links a[href^="#"]');

  let current = "";
  const scrollPosition = window.scrollY + 100;

  sections.forEach((section) => {
    const sectionTop = section.offsetTop;
    const sectionHeight = section.offsetHeight;
    if (
      scrollPosition >= sectionTop &&
      scrollPosition < sectionTop + sectionHeight
    ) {
      current = section.getAttribute("id");
    }
  });

  navLinks.forEach((link) => {
    link.classList.remove("active");
    if (link.getAttribute("href") === `#${current}`) {
      link.classList.add("active");
    }
  });
}

// Generate diagonal elements for entire home area
function createDiagonalGrid() {
  const grid = document.querySelector(".diagonal-grid");
  if (!grid) return;

  const blocks = [
    {
      width: 80,
      bottom: -400,
      left: -100,
      delay: 0,
      duration: 22,
    },
    {
      width: 60,
      bottom: -300,
      left: 100,
      delay: 2,
      duration: 20,
    },
    {
      width: 100,
      bottom: -370,
      left: 350,
      delay: 1,
      duration: 24,
    },
    {
      width: 70,
      bottom: -230,
      left: 200,
      delay: 1.5,
      duration: 21,
    },
    {
      width: 90,
      bottom: -170,
      left: 500,
      delay: 0.5,
      duration: 23,
    },
    {
      width: 50,
      bottom: -270,
      left: 400,
      delay: 3,
      duration: 25,
    },
  ];

  blocks.forEach((block) => {
    const element = document.createElement("div");
    element.className = "soft-block";
    element.style.width = `${block.width}px`;
    element.style.bottom = `${block.bottom}px`;
    element.style.left = `${block.left}px`;
    element.style.animationDelay = `${block.delay}s`;
    element.style.animationDuration = `${block.duration}s`;
    grid.appendChild(element);
  });
}

// Create static decoration blocks
function createStaticDecoration() {
  const decoration = document.querySelector(".static-decoration");
  if (!decoration) return;

  const staticBlocks = [
    {
      size: 85,
      top: "20px",
      right: "30px",
      outline: true,
    },
    {
      size: 120,
      top: "80px",
      right: "120px",
      outline: false,
    },
    {
      size: 100,
      top: "140px",
      right: "50px",
      outline: true,
    },
    {
      size: 40,
      top: "50px",
      right: "180px",
      outline: true,
    },
    {
      size: 95,
      top: "200px",
      right: "150px",
      outline: false,
    },
    {
      size: 60,
      top: "100px",
      right: "280px",
      outline: true,
    },
    {
      size: 75,
      top: "180px",
      right: "220px",
      outline: true,
    },
    {
      size: 50,
      top: "300px",
      right: "180px",
      outline: true,
    },
    {
      size: 90,
      top: "60px",
      right: "320px",
      outline: false,
    },
  ];

  staticBlocks.forEach((block) => {
    const element = document.createElement("div");
    element.className = block.outline ? "static-block-outline" : "static-block";
    element.style.width = `${block.size}px`;
    element.style.height = `${block.size}px`;
    element.style.top = block.top;
    element.style.right = block.right;
    decoration.appendChild(element);
  });
}

// Create red decoration blocks for bottom right
function createBottomRightDecoration() {
  const decoration = document.querySelector(".bottom-right-decoration");
  if (!decoration) return;

  const redBlocks = [
    {
      size: 65,
      bottom: "20px",
      right: "40px",
      outline: false,
    },
    {
      size: 45,
      bottom: "60px",
      right: "120px",
      outline: false,
    },
    {
      size: 85,
      bottom: "120px",
      right: "60px",
      outline: false,
    },
    {
      size: 35,
      bottom: "100px",
      right: "150px",
      outline: false,
    },
    {
      size: 55,
      bottom: "40px",
      right: "200px",
      outline: true,
    },
    {
      size: 70,
      bottom: "160px",
      right: "140px",
      outline: true,
    },
  ];

  redBlocks.forEach((block) => {
    const element = document.createElement("div");
    element.className = block.outline ? "red-block-outline" : "red-block";
    element.style.width = `${block.size}px`;
    element.style.height = `${block.size}px`;
    element.style.bottom = block.bottom;
    element.style.right = block.right;
    decoration.appendChild(element);
  });
}

// --- E-Commerce / Cart Logic ---

// --- E-Commerce / Cart Logic ---

// Centralized Tour Data (Loaded from data.js)
const TOURS = typeof TourData !== "undefined" ? TourData.TOURS : {};
const TRANSPORT_FEE =
  typeof TourData !== "undefined" ? TourData.TRANSPORT_FEE : 40;

let selectedTours = []; // Array of tour IDs
let transportSelections = {}; // Object to track transport status: { 'tour-id': true/false }

// --- Functionality to Toggle Transport Selection ---
function toggleTransport(checkbox, tourId) {
  // Update state based on checkbox checked status
  const isChecked = checkbox.checked;
  transportSelections[tourId] = isChecked;

  // Logic: If user selects transport, AUTOMATICALLY select the tour if not already selected.
  // "if the user clicked on Request Transport (+$40) button first and didn't click on add buton make them both selected"
  if (isChecked && !selectedTours.includes(tourId)) {
    // Find the add button for this tour to trigger its visual update logic
    // We need to find the specific button. Since we don't have IDs, we search by onclick attribute.
    const addBtn = document.querySelector(
      `.add-to-plan-btn[onclick*="'${tourId}'"]`
    );
    if (addBtn) {
      toggleTour(addBtn, tourId);
    } else {
      // Fallback if button not found in DOM (e.g. dynamic loading issues?)
      selectedTours.push(tourId);
    }
  }

  // Note: We do NOT deselect the tour if they uncheck transport.
  // "and if clicked on add buton only don't select also the Request Transport"
  // -> This is already default behavior of toggleTour (it doesn't touch transportSelections)

  // Update Display
  updateSelectedToursDisplay();

  // Also update the price displayed on the card itself immediately
  updateCardPrice(tourId);
}

function updateCardPrice(tourId) {
  const tour = TOURS[tourId];
  if (!tour) return;

  // Find the price element for this tour card
  // We search by the checkbox input relative to the card body
  const checkboxes = document.querySelectorAll(
    `.transport-label input[onchange*="'${tourId}'"]`
  );

  checkboxes.forEach((cb) => {
    const cardBody = cb.closest(".menu-item-content");
    if (cardBody) {
      const priceEl = cardBody.querySelector(".price");
      if (priceEl) {
        const basePrice = tour.price;
        const hasTransport = transportSelections[tourId];
        const finalSinglePrice = basePrice + (hasTransport ? TRANSPORT_FEE : 0);
        priceEl.innerText = `$${finalSinglePrice}`;
      }
    }
  });
}

function toggleTour(btn, tourId) {
  const tour = TOURS[tourId];
  if (!tour) return;

  const index = selectedTours.indexOf(tourId);

  if (index === -1) {
    // Add to cart
    selectedTours.push(tourId);
    // Change icon to Check and style to selected
    btn.innerHTML = '<i class="fas fa-check"></i>';
    btn.classList.add("selected");
  } else {
    // Remove from cart
    selectedTours.splice(index, 1);
    // Change icon back to Plus
    btn.innerHTML = '<i class="fas fa-plus"></i>';
    btn.classList.remove("selected");

    // NEW: If transport was selected, deselect it automatically
    if (transportSelections[tourId]) {
      transportSelections[tourId] = false;
      // Uncheck the graphical checkbox
      const checkbox = document.querySelector(
        `.transport-label input[onchange*="'${tourId}'"]`
      );
      if (checkbox) {
        checkbox.checked = false;
      }
      // Revert price display to base price
      updateCardPrice(tourId);
    }
  }

  updateSelectedToursDisplay();
  updateSectionHelperButtons();
}

function toggleAllInSection(category, btn) {
  // Find all tours in this category
  const tourIds = Object.keys(TOURS).filter(
    (key) => TOURS[key].category === category
  );

  // Check how many are currently selected
  const selectedCount = tourIds.filter((id) =>
    selectedTours.includes(id)
  ).length;

  if (selectedCount > 0) {
    // If ANY post is selected, "Select All" acts as "Unselect All"
    // Remove all items of this category from selectedTours
    tourIds.forEach((id) => {
      const index = selectedTours.indexOf(id);
      if (index > -1) {
        selectedTours.splice(index, 1);

        // NEW: Also clear Transport Selection
        if (transportSelections[id]) {
          transportSelections[id] = false;
          // Visual Reset
          const checkbox = document.querySelector(
            `.transport-label input[onchange*="'${id}'"]`
          );
          if (checkbox) checkbox.checked = false;
          updateCardPrice(id);
        }
      }
    });
    // Visual updates handled by updateAllButtons
  } else {
    // If NO posts are selected, select ALL
    tourIds.forEach((id) => {
      if (!selectedTours.includes(id)) {
        selectedTours.push(id);
        // Note: We do NOT auto-select transport for Select All, user must choose.
      }
    });
  }

  // Update Visuals
  updateAllButtons();
  updateSelectedToursDisplay();
}

function updateSectionHelperButtons() {
  const categories = [...new Set(Object.values(TOURS).map((t) => t.category))];

  categories.forEach((category) => {
    // Find the button for this category by onclick attribute
    // Using a broad selector and filtering is safer than expecting a specific ID
    const allBtns = document.querySelectorAll(".select-all-btn");
    allBtns.forEach((btn) => {
      const onclick = btn.getAttribute("onclick");
      if (onclick && onclick.includes(`'${category}'`)) {
        const tourIds = Object.keys(TOURS).filter(
          (key) => TOURS[key].category === category
        );
        const selectedCount = tourIds.filter((id) =>
          selectedTours.includes(id)
        ).length;

        if (selectedCount > 0) {
          // If ANY item selected => "Unselect All"
          btn.innerText = "Unselect All";
          btn.classList.add("active");
        } else {
          // If NONE selected => "Select All"
          btn.innerText = "Select All";
          btn.classList.remove("active");
        }
      }
    });
  });
}

function updateAllButtons() {
  const buttons = document.querySelectorAll(".add-to-plan-btn");
  buttons.forEach((btn) => {
    // We need to look up the tourId from the onclick attribute string
    // Format: toggleTour(this, 'cms-id')
    const onclick = btn.getAttribute("onclick");
    if (onclick) {
      const match = onclick.match(/'([^']+)'/);
      if (match && match[1]) {
        const tourId = match[1];
        if (selectedTours.includes(tourId)) {
          btn.innerHTML = '<i class="fas fa-check"></i>';
          btn.classList.add("selected");
        } else {
          btn.innerHTML = '<i class="fas fa-plus"></i>';
          btn.classList.remove("selected");
        }
      }
    }
  });
  updateSectionHelperButtons();
}

function calculateTourStats(selectedIds, guestCount) {
  const groups = {};
  let totalReservationPrice = 0;
  let messageText = "";

  selectedIds.forEach((tourId) => {
    const tour = TOURS[tourId];
    if (!tour) return;

    if (!groups[tour.category]) {
      groups[tour.category] = [];
    }

    const hasTransport = transportSelections[tourId] || false;
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

function generateTourListHTML(groups) {
  let html = "";
  let messageTextParts = [];

  for (const [category, items] of Object.entries(groups)) {
    const sectionTotal = items.reduce((sum, item) => sum + item.itemTotal, 0);

    // HTML
    html += `<div class="tour-list-category"><h5>${category}</h5>`;

    // Message Text Part
    let sectionMsg = `*${category}* (Section Total: $${sectionTotal}):\n`;

    items.forEach((item) => {
      let htmlTitleSuffix = "";
      let messageSuffix = "";

      if (item.hasTransport) {
        htmlTitleSuffix = `<span style="font-size:0.8em; color:#27ae60; margin-left:5px; font-weight:bold;">(+ Transport)</span>`;
        messageSuffix = " [INCLUDES TRANSPORT]";
      }

      html += `
        <div class="selected-tour-item-row">
            <span class="tour-row-title">${item.title} ${htmlTitleSuffix}</span>
            <div class="tour-row-right">
                <span class="tour-row-price">$${item.itemTotal}</span>
                <span class="tour-remove-btn" onclick="removeTourById('${item.tourId}')" title="Remove">
                    <i class="fas fa-times"></i>
                </span>
            </div>
        </div>`;

      sectionMsg += `  - ${item.title}${messageSuffix}: $${item.itemTotal}\n`;
    });

    html += `</div>`;
    messageTextParts.push(sectionMsg);
  }

  return { html, messageText: messageTextParts.join("\n") };
}

function updateSelectedToursDisplay() {
  const input = document.getElementById("selected-tours-input");
  const displayContainer = document.getElementById("selected-tours-display");
  const containerWrapper = document.getElementById("selected-tours-container");
  const totalContainer = document.getElementById("reservation-total-container");
  const totalValueSpan = document.getElementById("reservation-total-value");
  const guestsSelect = document.getElementById("guests");

  // Show/Hide container
  if (selectedTours.length === 0) {
    containerWrapper.style.display = "none";
    input.value = "";
    displayContainer.innerHTML = "";
    if (totalContainer) totalContainer.style.display = "none";
    return;
  }

  containerWrapper.style.display = "block";
  if (totalContainer) totalContainer.style.display = "flex";

  // Calculations
  const guestCount = guestsSelect.value ? parseInt(guestsSelect.value) : 1;
  const { groups, totalReservationPrice } = calculateTourStats(
    selectedTours,
    guestCount
  );

  // HTML Generation
  const { html, messageText } = generateTourListHTML(groups);

  // DOM Updates
  displayContainer.innerHTML = html;
  if (totalValueSpan) {
    totalValueSpan.innerText = `$${totalReservationPrice}`;
  }
  input.value = messageText.trim();
}

function removeTourById(tourId) {
  // 1. Remove from array
  const index = selectedTours.indexOf(tourId);
  if (index > -1) {
    selectedTours.splice(index, 1);
    updateSelectedToursDisplay();
    updateAllButtons(); // Sync Select All buttons and individual buttons
  }
}

// --- Tour Details Modal Logic ---

function showTourDetails(tourId) {
  const modal = document.getElementById("ingredientsModal");
  const title = document.getElementById("modalTitle");
  const list = document.getElementById("ingredientsList");

  const data = TOURS[tourId];

  if (data) {
    title.innerText = data.title;
    list.innerHTML = data.details.map((item) => `<li>${item}</li>`).join("");
    modal.style.display = "flex";
    modal.classList.add("active");
  }
}

function closeModal() {
  const modal = document.getElementById("ingredientsModal");
  modal.style.display = "none";
  modal.classList.remove("active");
}

// --- Confirmation Modal Logic ---

function showConfirmationModal() {
  const modal = document.getElementById("confirmationModal");
  modal.style.display = "flex";
}

function closeConfirmationModal() {
  const modal = document.getElementById("confirmationModal");
  modal.style.display = "none";
}

function resetApplicationState() {
  // 1. Native Form Reset
  const form = document.querySelector(".reservation-form");
  if (form) form.reset();

  // 2. Force Reset Fields by ID
  const fields = ["name", "phone", "date", "time", "special"];
  fields.forEach((id) => {
    const el = document.getElementById(id);
    if (el) el.value = "";
  });

  // Reset Guest Count
  const guestsEl = document.getElementById("guests");
  if (guestsEl) guestsEl.value = "1";

  // 3. Clear Global Selection State
  selectedTours = [];

  // Reset Transport Selections
  Object.keys(transportSelections).forEach((id) => {
    transportSelections[id] = false;
  });
  transportSelections = {};

  // 4. Manual Checkbox Reset
  document.querySelectorAll('input[type="checkbox"]').forEach((cb) => {
    cb.checked = false;
  });

  // 5. Force Price Reset on All Cards
  Object.keys(TOURS).forEach((id) => {
    updateCardPrice(id);
  });

  // 6. Reset UI Buttons
  updateAllButtons();

  // 7. Reset Section Helper Buttons
  updateSectionHelperButtons();

  // 8. Update Display
  updateSelectedToursDisplay();
}

function confirmClearAll() {
  resetApplicationState();
  closeConfirmationModal();
  showToast(
    "Reset",
    "All selections and form data have been cleared.",
    "success"
  );
}

// --- Reservation & WhatsApp Logic ---

async function handleReservation(event) {
  event.preventDefault();

  const submitBtn = event.target.querySelector('button[type="submit"]');
  const originalBtnText = submitBtn.innerText;
  submitBtn.innerText = "Sending...";
  submitBtn.disabled = true;

  const name = document.getElementById("name").value;
  // Email removed
  const phone = document.getElementById("phone").value;
  const date = document.getElementById("date").value;
  const time = document.getElementById("time").value;
  const guests = document.getElementById("guests").value;
  const special = document.getElementById("special").value;
  const selectedToursInput = document.getElementById(
    "selected-tours-input"
  ).value;

  // Validation: Check if any tours are selected
  if (!selectedToursInput || selectedToursInput.trim() === "") {
    showToast(
      "Action Required",
      "Please select at least one tour to proceed.",
      "error"
    );
    // Re-enable button immediately
    submitBtn.innerText = originalBtnText;
    submitBtn.disabled = false;
    return; // Stop execution
  }

  // Sanitization Helper
  const escapeHtml = (unsafe) => {
    if (typeof unsafe !== "string") return unsafe;
    return unsafe
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  };

  const structuredSelectedTours = selectedTours.map((tourId) => ({
    tourId: tourId,
    hasTransport: !!transportSelections[tourId],
  }));

  const formData = {
    name: escapeHtml(name),
    // email removed
    phone: escapeHtml(phone),
    date: escapeHtml(date),
    time: escapeHtml(time),
    guests: escapeHtml(guests),
    special: escapeHtml(special),
    selectedTours: structuredSelectedTours, // Send structured data for server-side calculation
  };

  try {
    const response = await fetch("/send-whatsapp", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    const text = await response.text();
    let result;
    try {
      result = JSON.parse(text);
    } catch (e) {
      console.error("Server returned non-JSON:", text);
      throw new Error("Server error: " + (text || "Empty response"));
    }

    if (result.success) {
      showToast("Success!", "Reservation sent successfully !", "success");
      resetApplicationState();
    } else {
      // Enhanced Error Reporting for User/Admin
      console.error("Backend Error Details:", result.error);

      let errorDetail = "";
      if (result.error && typeof result.error === "object") {
        if (result.error.error && result.error.error.message) {
          // WhatsApp API specific error structure
          errorDetail = result.error.error.message;
        } else if (result.error.message) {
          errorDetail = result.error.message;
        } else {
          errorDetail = JSON.stringify(result.error);
        }
      } else {
        errorDetail = result.error || "";
      }

      showToast(
        "Sending Failed",
        `Server: ${result.message}${errorDetail ? ` (${errorDetail})` : ""}`,
        "error"
      );
    }
  } catch (error) {
    console.error("Network/Client Error:", error);
    showToast(
      "Connection Error",
      "Could not reach server: " + error.message,
      "error"
    );
  } finally {
    submitBtn.innerText = originalBtnText;
    submitBtn.disabled = false;
  }
}

// --- Initialization ---

// Navbar scroll effect
window.addEventListener("scroll", () => {
  const nav = document.querySelector("nav");
  if (!nav) return;

  if (window.scrollY > 100) {
    nav.style.background = "rgba(255, 255, 255, 0.98)";
    nav.style.boxShadow = "0 2px 20px rgba(0, 0, 0, 0.1)";
  } else {
    nav.style.background = "rgba(255, 255, 255, 0.95)";
    nav.style.boxShadow = "none";
  }

  // Update active nav item
  updateActiveNavItem();
});

// Initialize all elements when page loads
document.addEventListener("DOMContentLoaded", () => {
  // Set minimum date to today
  const dateInput = document.getElementById("date");
  if (dateInput) {
    const today = new Date().toISOString().split("T")[0];
    dateInput.setAttribute("min", today);
  }

  // Restrict Phone Input to Numbers Only
  const phoneInput = document.getElementById("phone");
  if (phoneInput) {
    phoneInput.addEventListener("input", function (e) {
      this.value = this.value.replace(/[^0-9]/g, "");
    });
  }

  // Create all decorative elements
  createDiagonalGrid();
  createStaticDecoration();
  createBottomRightDecoration();

  // Set initial active nav item to Home
  const homeLink = document.querySelector('.nav-links a[href="#home"]');
  if (homeLink) {
    homeLink.classList.add("active");
  }

  // --- Scroll Animation Observer ---
  const observerOptions = {
    root: null,
    rootMargin: "0px",
    threshold: 0.15, // Trigger when 15% visible
  };

  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target); // Only animate once
      }
    });
  }, observerOptions);

  // Target sections and cards for animation
  const animatedElements = document.querySelectorAll(
    ".menu-item, h2, form, .footer-content, .hero-content"
  );
  animatedElements.forEach((el) => {
    el.classList.add("reveal-on-scroll");
    observer.observe(el);
  });

  // --- Scroll Up Button Logic ---
  const scrollBtn = document.getElementById("scroll-up-btn");

  if (scrollBtn) {
    window.onscroll = function () {
      if (
        document.body.scrollTop > 300 ||
        document.documentElement.scrollTop > 300
      ) {
        scrollBtn.style.display = "block";
      } else {
        scrollBtn.style.display = "none";
      }
    };

    scrollBtn.addEventListener("click", function () {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    });
  }

  // --- Guest Change Listener for Price Update ---
  const guestSelect = document.getElementById("guests");
  if (guestSelect) {
    guestSelect.addEventListener("change", function () {
      updateSelectedToursDisplay();
    });
  }
});

// --- Clear All Logic ---

function clearAllTours() {
  if (selectedTours.length === 0) return;
  // Show Custom Confirmation Modal
  const modal = document.getElementById("confirmationModal");
  modal.style.display = "flex";
  // Flex is needed for the CSS alignment to work
}

function closeConfirmationModal() {
  document.getElementById("confirmationModal").style.display = "none";
}

// --- Guest Count Logic ---

function updateGuestCount(change) {
  const input = document.getElementById("guests");
  let val = parseInt(input.value) || 1;
  val += change;
  if (val < 1) val = 1;

  input.value = val;

  // Trigger update of prices
  updateSelectedToursDisplay();

  // Visual Feedback (optional pop effect)
  const btn = event.currentTarget; // The clicked button
  if (btn) {
    btn.style.transform = "scale(0.9)";
    setTimeout(() => (btn.style.transform = ""), 150);
  }
}

// --- Toast Notification Logic ---
function showToast(title, message, type = "success") {
  const container = document.getElementById("toast-container");
  if (!container) return;

  const toast = document.createElement("div");
  toast.className = `toast ${type}`;

  const icon =
    type === "success"
      ? '<i class="fas fa-check-circle"></i>'
      : '<i class="fas fa-exclamation-circle"></i>';

  toast.innerHTML = `
    ${icon}
    <div class="toast-content">
      <div class="toast-title">${title}</div>
      <div class="toast-message">${message}</div>
    </div>
    <div class="toast-close" onclick="this.parentElement.remove()">&times;</div>
  `;

  container.appendChild(toast);

  // Auto remove after 5 seconds
  setTimeout(() => {
    toast.style.animation = "fadeOutToast 0.5s ease forwards";
    toast.addEventListener("animationend", () => {
      toast.remove();
    });
  }, 5000);
}
