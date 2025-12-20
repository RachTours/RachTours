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

// Centralized Tour Data
const TOURS = {
  "souk-tour": {
    title: "Agadir Souk El Had Half Day Tour",
    category: "Local Tours & Experiences",
    price: 15,
    details: [
      "Duration: 3-4 Hours",
      "Pick up: 10AM or 2PM",
      "Hotel pickup and drop-off included",
      "Free time to explore the market independently",
      "Discover spices, crafts, and local culture",
    ],
  },
  "small-desert": {
    title: "Small Desert Trip from Agadir & Taghazout",
    category: "Local Tours & Experiences",
    price: 40,
    details: [
      "Duration: 5-6 Hours",
      "Pick up: 2 PM",
      "Explore sand dunes and Berber villages",
      "Technical stop at Youssef Bin Tachfine Dam",
      "Traditional Moroccan tea break included",
    ],
  },
  "horse-riding": {
    title: "Horse Riding from Agadir & Taghazout",
    category: "Local Tours & Experiences",
    price: 20,
    details: [
      "Duration: 2 Hours",
      "Ride along the beach and Souss river",
      "Suitable for all skill levels",
      "Equipment and guide included",
      "Beautiful sunset option available",
    ],
  },
  "airport-transfer": {
    title: "Airport Transfer to Agadir & Taghazout",
    category: "Local Tours & Experiences",
    price: 35,
    details: [
      "Private comfortable vehicle",
      "Professional driver",
      "Meet and greet service at airport",
      "Available 24/7",
      "Fixed price, no hidden fees",
    ],
  },
  "sahara-dunes": {
    title: "Sahara Dunes Trip",
    category: "Local Tours & Experiences",
    price: 35,
    details: [
      "Full day adventure",
      "Lunch with locals included",
      "Visit Tiznit (Silver City)",
      "Explore massive sand dunes",
      "Scenic drive through Anti-Atlas mountains",
    ],
  },
  "cooking-class": {
    title: "Cooking Class in Agadir",
    category: "Local Tours & Experiences",
    price: 45,
    details: [
      "Duration: 4 Hours",
      "Market visit for ingredients",
      "Learn to cook Tagine or Couscous",
      "Enjoy your meal afterwards",
      "Transport included",
    ],
  },
  "old-medina": {
    title: "Visit Old Medina of Agadir (Coco Polizzi)",
    category: "Local Tours & Experiences",
    price: 20,
    details: [
      "Duration: 2-3 Hours",
      "Admire traditional masonry and architecture",
      "Visit artisan workshops",
      "Great photo opportunities",
      "Entrance fee included",
    ],
  },
  "buggy-tour": {
    title: "Buggy Tour in Agadir",
    category: "Local Tours & Experiences",
    price: 65,
    details: [
      "Duration: 2 Hours (driving)",
      "Safety briefing and gear included",
      "Off-road tracks through argan and eucalyptus forests",
      "Tea break in a Berber village",
      "Valid driver license required for driver",
    ],
  },
  "hammam-massage": {
    title: "Moroccan Hammam & Massage (2h)",
    category: "Local Tours & Experiences",
    price: 45,
    details: [
      "1 Hour Traditional Hammam (Scrub)",
      "1 Hour Relaxing Massage with Argan Oil",
      "Transport included",
      "Towels and slippers provided",
      "Ultimate relaxation experience",
    ],
  },
  "quad-bike": {
    title: "Quad Bike Tour in the Sand",
    category: "Local Tours & Experiences",
    price: 55,
    details: [
      "Duration: 2 Hours",
      "Ride through dunes and beach",
      "Safety equipment provided",
      "Briefing for beginners",
      "Tea break included",
    ],
  },
  "taroudant-trip": {
    title: "Taroudant Trip from Agadir & Taghazout",
    category: "Day Trips & Excursions",
    price: 50,
    details: [
      "Duration: Half Day or Full Day",
      'Explore the "Little Marrakech"',
      "Visit ancient ramparts and souks",
      "See the Tiout Oasis",
      "Hotel pickup included",
    ],
  },
  "souss-park": {
    title: "Souss National Park Trip",
    category: "Day Trips & Excursions",
    price: 45,
    details: [
      "Guided nature walk",
      "Spot migratory birds including flamingos",
      "Visit the museum of the park",
      "Ideal for nature lovers",
      "Morning tour recommended",
    ],
  },
  "cable-car": {
    title: "Cable Car Tour from Agadir & Taghazout",
    category: "Day Trips & Excursions",
    price: 25,
    details: [
      "Ride to the historic Kasbah Oufella",
      "Panoramic views of the city and bay",
      "Modern comfortable cabins",
      "Driver waits for return trip",
      "Ticket included",
    ],
  },
  "paradise-valley": {
    title: "Paradise Valley Trip",
    category: "Day Trips & Excursions",
    price: 30,
    details: [
      "Half day trip",
      "Short hike through palm groves",
      "Swimming in natural rock pools",
      "Visit argan oil cooperative",
      "Stunning photography spots",
    ],
  },
  sandboarding: {
    title: "Sandboarding from Agadir & Taghazout",
    category: "Day Trips & Excursions",
    price: 45,
    details: [
      "Combine with half-day desert trip",
      "Boards provided",
      "Slide down the steep dunes of Taboga",
      "Tea break with panoramic view",
      "Fun for all ages",
    ],
  },
  "camel-ride": {
    title: "Camel Ride Tour in Agadir & Taghazout",
    category: "Day Trips & Excursions",
    price: 25,
    details: [
      "2 Hours riding experience",
      "Costumes provided for photos",
      "Ride along the Souss river mouth",
      "Flamingo spotting (seasonally)",
      "Pick up and drop off included",
    ],
  },
  "marrakech-trip": {
    title: "Marrakech Day Trip",
    category: "Day Trips & Excursions",
    price: 55,
    details: [
      "Early morning departure (approx 7 AM)",
      "3 hours highway drive",
      "Guided tour of Medina, Koutoubia, Jemaa el-Fna",
      "Free time for shopping",
      "Return by evening",
    ],
  },
  "city-tour": {
    title: "City Tour from Agadir & Taghazout",
    category: "Day Trips & Excursions",
    price: 25,
    details: [
      "Duration: 3 Hours",
      "Visit Kasbah Oufella (Historic Fortress)",
      "See the biggest Mosque in Agadir",
      "Drive through Marina and City Center",
      "Visit Argan Oil factory",
    ],
  },
  "essaouira-trip": {
    title: "Essaouira Day Trip",
    category: "Day Trips & Excursions",
    price: 50,
    details: [
      "Full day excursion",
      'Stop for "Goats on Trees" photo',
      "Explore the Portuguese fortress and port",
      "Walk through the blue and white Medina",
      "Fresh seafood lunch opportunities",
    ],
  },
  "boat-trip": {
    title: "Boat Trip from Agadir & Taghazout",
    category: "Day Trips & Excursions",
    price: 40,
    details: [
      "Half day cruising",
      "Fishing equipment available",
      "Swimming break",
      "Lunch cooked on board included",
      "Relaxing atmosphere",
    ],
  },
  crocoparc: {
    title: "Crocoparc Tour from Agadir",
    category: "Unique Attractions",
    price: 35,
    details: [
      "Entrance ticket and transfer included",
      "Walk through thematic botanical gardens",
      "Watch crocodile feeding times",
      "Educational and fun",
      "Great for families",
    ],
  },
  "dolphin-show": {
    title: "Dolphin Show in Agadir",
    category: "Unique Attractions",
    price: 30,
    details: [
      "Show times vary (usually afternoon)",
      "Watch dolphins and sea lions perform",
      "Photo opportunities available",
      "Transfer from hotel included",
      "Duration approx 1 hour + transport",
    ],
  },
  "hot-air-balloon": {
    title: "Hot Air Balloon Trip",
    category: "Unique Attractions",
    price: 220,
    details: [
      "Sunrise flight",
      "Approximately 1 hour in air",
      "Traditional Berber breakfast included",
      "Flight certificate",
      "Unique perspective of the varied landscape",
    ],
  },
  "goats-tree": {
    title: "Goats on the Tree Tour",
    category: "Unique Attractions",
    price: 20,
    details: [
      "Short trip or included in Essaouira/Marrakech trips",
      "See goats climbing Argan trees",
      "Unique to this region of Morocco",
      "Photo stop",
      "Visit Argan cooperative",
    ],
  },
};

let selectedTours = []; // Array of tour IDs

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
      if (index > -1) selectedTours.splice(index, 1);
    });
    // Visual updates handled by updateAllButtons
  } else {
    // If NO posts are selected, select ALL
    tourIds.forEach((id) => {
      if (!selectedTours.includes(id)) selectedTours.push(id);
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

function updateSelectedToursDisplay() {
  /*
   * Update the hidden input value AND the visual display list
   */
  const input = document.getElementById("selected-tours-input");
  const displayContainer = document.getElementById("selected-tours-display");
  const containerWrapper = document.getElementById("selected-tours-container");

  // New Total Elements targets
  const totalContainer = document.getElementById("reservation-total-container");
  const totalValueSpan = document.getElementById("reservation-total-value");

  // Show/Hide container based on selection
  if (selectedTours.length === 0) {
    containerWrapper.style.display = "none";
    input.value = "";
    displayContainer.innerHTML = "";
    if (totalContainer) totalContainer.style.display = "none";
    return;
  }

  containerWrapper.style.display = "block";
  if (totalContainer) totalContainer.style.display = "flex";

  // Group tours by category
  const groups = {};
  let totalPrice = 0;

  // Get guest count (default to 1 if not selected yet)
  const guestsSelect = document.getElementById("guests");
  const guestCount = guestsSelect.value ? parseInt(guestsSelect.value) : 1;

  selectedTours.forEach((tourId) => {
    const tour = TOURS[tourId];
    if (!tour) return;

    if (!groups[tour.category]) {
      groups[tour.category] = [];
    }
    groups[tour.category].push(tour);
    totalPrice += tour.price * guestCount;
  });

  // Generate HTML (List Only)
  let html = "";
  // Generate Text for Message (Structured)
  let messageText = "";

  for (const [category, tours] of Object.entries(groups)) {
    // Calculate Section Total
    const sectionTotal = tours.reduce(
      (sum, t) => sum + t.price * guestCount,
      0
    );

    // 1. HTML Display
    html += `<div class="tour-list-category">
              <h5>${category}</h5>`;

    // 2. Message Text: "Category Name (Section Total: $X):\n"
    messageText += `*${category}* (Section Total: $${sectionTotal}):\n`;

    tours.forEach((tour) => {
      const itemPrice = tour.price * guestCount;
      // HTML
      const tourKey = Object.keys(TOURS).find((k) => TOURS[k] === tour);
      html += `
        <div class="selected-tour-item-row">
            <span class="tour-row-title">${tour.title}</span>
            <div class="tour-row-right">
                <span class="tour-row-price">$${itemPrice}</span>
                <span class="tour-remove-btn" onclick="removeTourById('${tourKey}')" title="Remove">
                    <i class="fas fa-times"></i>
                </span>
            </div>
        </div>`;

      // Message Text: Item Name: $Price
      messageText += `  - ${tour.title}: $${itemPrice}\n`;
    });

    html += `</div>`;
    messageText += `\n`; // Spacing between sections
  }

  // Update List Display
  displayContainer.innerHTML = html;

  // Update Separate Total Display
  if (totalValueSpan) {
    totalValueSpan.innerText = `$${totalPrice}`;
  }

  // Update hidden input with the structured text
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

// Close modal when clicking outside

window.onclick = function (event) {
  const ingredientsModal = document.getElementById("ingredientsModal");
  if (event.target == ingredientsModal) {
    ingredientsModal.style.display = "none";
    ingredientsModal.classList.remove("active");
  }
  const confirmationModal = document.getElementById("confirmationModal");
  if (event.target == confirmationModal) {
    confirmationModal.style.display = "none";
  }
};

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

  const formData = {
    name,
    // email removed
    phone,
    date,
    time,
    guests,
    special,
    selectedTours: selectedToursInput,
    totalPrice:
      document.getElementById("reservation-total-value")?.innerText || "$0",
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
      event.target.reset();

      // Reset selected tours
      selectedTours = [];
      updateSelectedToursDisplay();
      updateAllButtons();
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

function confirmClearAll() {
  // Clear array
  selectedTours = [];

  // Update Display
  updateSelectedToursDisplay();

  // Reset all buttons in DOM
  const buttons = document.querySelectorAll(".add-to-plan-btn");
  buttons.forEach((btn) => {
    btn.innerHTML = '<i class="fas fa-plus"></i>';
    btn.classList.remove("selected");
  });

  // Close Modal
  closeConfirmationModal();
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
