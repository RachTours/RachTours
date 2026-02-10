const { validationResult } = require("express-validator");
const axios = require("axios");
const { unescapeHTMLEntities, escapeSequencesToLiteral } = require("../utils/stringUtils");

// Load Data (Support ESM/CJS transition logic if needed, but for now we trust global or re-import)
// Note: In detailed architecture, we might want a DataService. 
// For now, we will import the data logic or access it if it was passed. 
// However, since the original server.js loaded it asynchronously, we need to handle that.
// Best approach: Initialize data in server.js and pass to controller, or separate data loader.
// Let's rely on re-importing distinct from server.js to avoid circular deps or complexity.
// Load Data (Universal UMD support allows simple require)
const { TOURS, TRANSPORT_FEE } = require("../../js/data.js");
console.log("Controller: Data loaded successfully.");

const WHATSAPP_TOKEN = process.env.WHATSAPP_TOKEN;
const PHONE_NUMBER_ID = process.env.PHONE_NUMBER_ID;
const MY_PHONE_NUMBER = process.env.MY_PHONE_NUMBER;

exports.createReservation = async (req, res) => {
  // Check Validation Results
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.error("Validation Errors:", errors.array());
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      error: errors.array(),
    });
  }

  try {
    const { name, phone, date, time, guests, special, selectedTours } = req.body;

    // Log only non-PII metrics
    console.log(`New Reservation: ${selectedTours ? selectedTours.length : 0} tours selected.`);

    // Strict Type Validation
    if (typeof selectedTours !== "object" || !Array.isArray(selectedTours)) {
      return res.status(400).json({ success: false, message: "Invalid tours data" });
    }

    const safeGuests = typeof guests === "string" ? parseInt(guests, 10) : (typeof guests === "number" ? guests : 1) || 1;
    const safeName = typeof name === "string" ? name : String(name || "");
    const safePhone = typeof phone === "string" ? phone : String(phone || "");
    const safeDate = typeof date === "string" ? date : String(date || "");
    const safeTime = typeof time === "string" ? time : String(time || "");
    let safeSpecial = special && typeof special === "string" ? special : "";

    if (selectedTours.length === 0) {
      return res.status(400).json({ success: false, message: "No tours selected." });
    }

    // --- Message Construction ---
    let anyTransport = false;
    let tourDetailsText = "";
    let totalReservationPrice = 0;

    const groups = {};

    selectedTours.forEach((item) => {
      const tourId = item.tourId;
      const tour = TOURS[tourId];
      if (tour) {
        if (!groups[tour.category]) {
          groups[tour.category] = [];
        }
        const hasTransport = item.hasTransport === true;
        const basePrice = tour.price;
        const singlePersonPrice = basePrice + (hasTransport ? TRANSPORT_FEE : 0);
        const itemTotal = singlePersonPrice * safeGuests;

        groups[tour.category].push({
          title: tour.title,
          hasTransport,
          itemTotal,
        });

        totalReservationPrice += itemTotal;
      }
    });

    for (const [category, items] of Object.entries(groups)) {
      const sectionTotal = items.reduce((sum, i) => sum + i.itemTotal, 0);
      tourDetailsText += `*${category}* (Total: $${sectionTotal}):\n`;
      items.forEach((item) => {
        if (item.hasTransport) anyTransport = true;
        const transportSuffix = item.hasTransport ? " [🚕+Transport]" : "";
        tourDetailsText += `  • ${item.title} ($${item.itemTotal})${transportSuffix}\n`;
      });
    }

    if (tourDetailsText.length > 1000) {
      tourDetailsText = tourDetailsText.substring(0, 1000);
    }

    if (safeSpecial) safeSpecial = unescapeHTMLEntities(safeSpecial);
    if (safeSpecial && safeSpecial.length > 200) safeSpecial = safeSpecial.substring(0, 200);
    if (safeSpecial) safeSpecial = escapeSequencesToLiteral(safeSpecial);

    const transportLine = anyTransport ? "🚕 *Transport Requested* :✅ Yes" : "";
    const transportLineConfirm = anyTransport
      ? "|🚕 *Transport Requested*|\n Send us your location to get the most relevant transport service."
      : "";

    // Admin Notification
    let messageBody = `🔔 *New Reservation Request*\n`;
    messageBody += `══════════════════════\n`;
    messageBody += `👤 *Customer:* ${safeName}\n`;
    messageBody += `📞 *Phone:* ${safePhone}\n`;
    messageBody += `📅 *Date:* ${safeDate}\n`;
    messageBody += `⏰ *Time:* ${safeTime}\n`;
    messageBody += `👥 *Guests:* ${safeGuests}\n`;
    if (anyTransport) messageBody += `${transportLine}\n`;
    messageBody += `══════════════════════\n`;
    messageBody += `🎫 *Tour Details:*\n${tourDetailsText}`;
    messageBody += `\n💰 *Total Price:* $${totalReservationPrice}\n`;

    if (safeSpecial) {
      messageBody += `══════════════════════\n`;
      messageBody += `📝 *Note:*\n <|${safeSpecial}|>\n`;
    }
    messageBody += `══════════════════════\n`;

    // Reply Links
    let cleanPhone = safePhone.replace(/\D/g, "");
    const businessPhone = MY_PHONE_NUMBER || "212659727363";
    const cleanBusinessPhone = businessPhone.replace(/\D/g, "");

    const reconfirmText = `✅ Reservation Confirmed :\n👤 *${safeName}*\n📞 *${safePhone}*\n📅 *${safeDate}* at ⏰ *${safeTime}*\n👥 *${safeGuests}* guests \n ${transportLine}`;
    const reconfirmLink = `https://wa.me/${cleanBusinessPhone}?text=${encodeURIComponent(reconfirmText)}`;

    const confirmationMsg = `Hello Mr/Mrs *${safeName}* ! \n\nThis is Rach Tours. We've received your reservation request for:\n\n${tourDetailsText}\n💰 *Total:* $${totalReservationPrice}\n📞 *Phone:* *${safePhone}*\n📅 *Date:* *${safeDate}*\n⏰ *Time:* *${safeTime}*\n👥 *Guests:* *${safeGuests}*\n${transportLineConfirm}\n Is this correct?\n   ❌ If no, please\n*Resubmit Again:*\n🔗 https://rach-tours.com \n   ✅ If yes, please\n*Confirm By clicking on the link :*\n ${reconfirmLink}\n\nWe look forward to seeing you soon.Thank you for choosing us! ✨`;

    const replyLinkPart = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(confirmationMsg)}`;

    const url = `https://graph.facebook.com/v17.0/${PHONE_NUMBER_ID}/messages`;
    const headers = {
      Authorization: `Bearer ${WHATSAPP_TOKEN}`,
      "Content-Type": "application/json",
    };

    // --- Parallel Execution for Speed ---
    const promises = [];

    // 1. Send Main WhatsApp to Admin (Critical)
    const sendAdminMsg = axios.post(
      url,
      {
        messaging_product: "whatsapp",
        to: MY_PHONE_NUMBER,
        type: "text",
        text: { body: messageBody },
      },
      { headers }
    );
    promises.push(sendAdminMsg);

    // 2. Send Reply Link (Non-blocking but good to have)
    if (replyLinkPart) {
      const sendReplyLink = axios.post(
        url,
        {
          messaging_product: "whatsapp",
          to: MY_PHONE_NUMBER,
          type: "text",
          text: { body: `👉 *Click to Reply:* ${replyLinkPart}` },
        },
        { headers }
      );
      promises.push(sendReplyLink);
    }

    // 3. Google Sheets (Non-Critical, fail-safe)
    const SHEET_URL = process.env.GOOGLE_SHEET_SCRIPT_URL;
    const SHEET_TOKEN = process.env.GOOGLE_SHEET_API_TOKEN;

    if (SHEET_URL && SHEET_TOKEN) {
      const sheetPayload = {
        token: SHEET_TOKEN,
        date: safeDate,
        time: safeTime,
        name: safeName,
        phone: safePhone,
        guests: safeGuests,
        totalPrice: totalReservationPrice,
        transport: anyTransport,
        tours: selectedTours.map(t => {
          const tour = TOURS[t.tourId];
          return {
             title: tour ? tour.title : t.tourId,
             hasTransport: t.hasTransport
          };
        }),
        specialRequest: safeSpecial
      };

      // Wrap in catch to prevent sheet errors from failing the whole request
      const updateSheet = axios.post(SHEET_URL, sheetPayload)
        .then(() => console.log("Google Sheet updated."))
        .catch(err => console.error("Failed to update Google Sheet:", err.message));
      
      promises.push(updateSheet);
    }

    // Wait for ALL to finish (or fail if critical ones fail)
    // This ensures we verify success before responding to user
    await Promise.all(promises);
    console.log("All notifications sent successfully.");

    return res.status(200).json({ success: true, message: "Reservation Confirmed" });
  } catch (error) {
    console.error("WhatsApp API Error:", error.response ? error.response.data : error.message);
    return res.status(500).json({
      success: false,
      message: "Failed to send WhatsApp message.",
      error: error.response ? error.response.data : error.message,
    });
  }
};
