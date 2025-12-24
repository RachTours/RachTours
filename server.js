const express = require("express");
const path = require("path");
const axios = require("axios");

const app = express();
const PORT = process.env.PORT || 3000;

// --- Security Middleware ---
app.use((req, res, next) => {
  // Content Security Policy
  res.setHeader(
    "Content-Security-Policy",
    "default-src 'self'; script-src 'self' 'unsafe-inline' https://cdnjs.cloudflare.com; style-src 'self' 'unsafe-inline' https://cdnjs.cloudflare.com https://fonts.googleapis.com; font-src 'self' https://cdnjs.cloudflare.com https://fonts.gstatic.com; img-src 'self' data: https:; connect-src 'self' https://graph.facebook.com;"
  );
  // Secure Headers
  res.setHeader("X-Frame-Options", "DENY");
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader(
    "Strict-Transport-Security",
    "max-age=31536000; includeSubDomains"
  );
  res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
  next();
});

// --- Middleware ---
app.use(express.static(__dirname)); // Serve static files
app.use(express.json()); // Parse JSON bodies

// --- Configuration ---
const WHATSAPP_TOKEN = process.env.WHATSAPP_TOKEN;
const PHONE_NUMBER_ID = process.env.PHONE_NUMBER_ID;
const MY_PHONE_NUMBER = process.env.MY_PHONE_NUMBER;

// --- Helpers ---
function sanitizeInput(str) {
  if (typeof str !== "string") return "";
  // Basic sanitization: remove potential HTML tags
  return str.replace(/[<>]/g, "").trim();
}

// --- Routes ---

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

// Endpoint to handle form submission and send to WhatsApp
app.post("/send-whatsapp", async (req, res) => {
  try {
    const { name, phone, date, time, guests, special, selectedTours } =
      req.body;

    // 1. Sanitize & Validate
    const safeName = sanitizeInput(name);
    const safePhone = sanitizeInput(phone);
    const safeDate = sanitizeInput(date);
    const safeTime = sanitizeInput(time);
    const safeGuests = parseInt(guests) || 1;
    const safeSpecial = sanitizeInput(special);

    if (
      !safeName ||
      !safePhone ||
      !Array.isArray(selectedTours) ||
      selectedTours.length === 0
    ) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields or no tours selected.",
      });
    }

    // 2. Format Message
    let messageBody = `*New Reservation Request*\n\n`;
    messageBody += `👤 *Name:* ${safeName}\n`;
    messageBody += `📞 *Phone:* ${safePhone}\n`;
    messageBody += `📅 *Date:* ${safeDate}\n`;
    messageBody += `⏰ *Time:* ${safeTime}\n`;
    messageBody += `👥 *Guests:* ${safeGuests}\n`;

    if (safeSpecial) {
      messageBody += `📝 *Note:* ${safeSpecial}\n`;
    }

    messageBody += `\n*Selected Tours:*\n`;

    selectedTours.forEach((item) => {
      const tourIdFormatted = item.tourId.replace(/-/g, " ").toUpperCase();
      const transportText = item.hasTransport ? " [Transport Requested]" : "";
      messageBody += `- ${tourIdFormatted}${transportText}\n`;
    });

    // 3. Send to WhatsApp Graph API
    const url = `https://graph.facebook.com/v17.0/${PHONE_NUMBER_ID}/messages`;
    const payload = {
      messaging_product: "whatsapp",
      to: MY_PHONE_NUMBER,
      type: "text",
      text: { body: messageBody },
    };

    const response = await axios.post(url, payload, {
      headers: {
        Authorization: `Bearer ${WHATSAPP_TOKEN}`,
        "Content-Type": "application/json",
      },
    });

    return res.status(200).json({ success: true, data: response.data });
  } catch (error) {
    console.error(
      "WhatsApp API Error:",
      error.response ? error.response.data : error.message
    );
    return res.status(500).json({
      success: false,
      message: "Failed to send WhatsApp message.",
      error: error.response ? error.response.data : error.message,
    });
  }
});

// --- Start Server ---
app.listen(PORT, () => {
  console.log(`Server running securely on port ${PORT}`);
});
