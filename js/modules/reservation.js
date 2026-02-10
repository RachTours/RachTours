import { state, resetState } from "../state.js";
import {
  updateSelectedToursDisplay,
  updateAllButtons,
  updateSectionHelperButtons,
  updateCardPrice,
  getTours,
} from "./tours.v2.js";
import { showToast, closeModal } from "./ui.js";
import { escapeHTML } from "./utils.js";

export function showConfirmationModal() {
  if (state.selectedTours.length === 0) return;
  const modal = document.getElementById("confirmationModal");
  if (modal) {
    modal.style.display = "flex";
    modal.classList.add("active");
  }
}

export function closeConfirmationModal() {
  const modal = document.getElementById("confirmationModal");
  if (modal) {
    modal.style.display = "none";
    modal.classList.remove("active");
  }
}

export function resetApplicationState() {
  const form = document.querySelector(".reservation-form");
  if (form) form.reset();

  // Force reset values
  ["name", "phone", "date", "time", "special"].forEach((id) => {
    const el = document.getElementById(id);
    if (el) el.value = "";
  });

  const guestsEl = document.getElementById("guests");
  if (guestsEl) guestsEl.value = "1";

  // Reset state
  resetState();

  // Reset checkboxes
  document.querySelectorAll('input[type="checkbox"]').forEach((cb) => {
    cb.checked = false;
  });

  // Reset prices
  Object.keys(getTours()).forEach((id) => {
    updateCardPrice(id);
  });

  updateAllButtons();
  updateSectionHelperButtons();
  updateSelectedToursDisplay();
}

export function confirmClearAll() {
  resetApplicationState();
  closeConfirmationModal();
  showToast(
    "Reset",
    "All selections and form data have been cleared.",
    "success"
  );
}

export function updateGuestCount(change, btn) {
  const input = document.getElementById("guests");
  let val = parseInt(input.value) || 1;
  val += change;
  if (val < 1) val = 1;
  input.value = String(val);

  updateSelectedToursDisplay();

  if (btn) {
    btn.style.transform = "scale(0.9)";
    setTimeout(() => (btn.style.transform = ""), 150);
  }
}

export async function handleReservation(event) {
  event.preventDefault();
  const form = event.target;
  // Fix: Ensure we match the submit button correctly even with class variations
  const submitBtn = form.querySelector('button[type="submit"]');
  if (!submitBtn) return;

  const originalBtnText = submitBtn.innerText;
  submitBtn.innerText = "Sending...";
  submitBtn.disabled = true;

  try {
    const name = document.getElementById("name").value;
    let phone = "";
    if (window.phoneInputInstance) {
        phone = window.phoneInputInstance.getFullNumber();
    } else {
        const phoneEl = document.getElementById("phone");
        phone = phoneEl ? phoneEl.value : "";
    }

    const date = document.getElementById("date").value;
    const time = document.getElementById("time").value;
    const guests = document.getElementById("guests").value;
    const special = document.getElementById("special").value;
    // The hidden input value is used for sync, but we should construct payload from state for security/consistency
    // But the backend expects selectedTours array with transport flags

    if (state.selectedTours.length === 0) {
      showToast(
        "Action Required",
        "Please select at least one tour to proceed.",
        "error"
      );
      throw new Error("No tours selected");
    }

    const structuredSelectedTours = state.selectedTours.map((tourId) => ({
      tourId: tourId,
      hasTransport: !!state.transportSelections[tourId],
    }));

    const formData = {
      name: escapeHTML(name),
      phone: escapeHTML(phone),
      date: escapeHTML(date),
      time: escapeHTML(time),
      guests: escapeHTML(guests),
      special: escapeHTML(special),
      selectedTours: structuredSelectedTours, // Send the array, not the string representation
    };

    const response = await fetch("/api/send-whatsapp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
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
      console.error("Backend Error Details:", JSON.stringify(result.error, null, 2));
      const errorDetail = result.error
        ? result.error.message || JSON.stringify(result.error)
        : "";
      showToast(
        "Sending Failed",
        `Server: ${result.message} ${errorDetail}`,
        "error"
      );
    }
  } catch (error) {
    if (error.message !== "No tours selected") {
      console.error("Network/Client Error:", error);
      showToast(
        "Connection Error",
        "Could not reach server: " + error.message,
        "error"
      );
    }
  } finally {
    if (submitBtn) {
      submitBtn.innerText = originalBtnText;
      submitBtn.disabled = false;
    }
  }
}
