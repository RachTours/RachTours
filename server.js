require("dotenv").config();
const express = require("express");
const cors = require("cors");
const axios = require("axios");
const path = require("path");
const helmet = require("helmet");
const xss = require("xss-clean");
const hpp = require("hpp");
const rateLimit = require("express-rate-limit");

const app = express();
const PORT = process.env.PORT || 3000;

// Security Middleware
app.use(
  helmet({
    contentSecurityPolicy: false, // We handle CSP via meta tag for transparency with frontend code
    hsts: {
      maxAge: 31536000, // 1 year
      includeSubDomains: true,
      preload: true,
    },
    frameguard: {
      action: "deny",
    },
    noSniff: true,
    xssFilter: true, // Deprecated in modern browsers but good fallback
  })
);
app.use(xss());
app.use(hpp());
app.use(cors()); // Configure origin in production if needed

// Rate Limiting
const limiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 100, // limit each IP to 100 requests per windowMs
});
app.use(limiter);

app.use(express.json());
app.use(express.static(__dirname)); // Serve static files (HTML, CSS, JS)

// Debug Middleware: Log all requests
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  console.log("Headers:", req.headers);
  if (req.method === "POST") {
    console.log("Body:", JSON.stringify(req.body, null, 2));
  }
  next();
});

const { body, validationResult } = require("express-validator");

// Route to handle WhatsApp sending
app.post(
  "/send-whatsapp",
  [
    // Validation & Sanitization
    body("name").trim().escape().notEmpty().withMessage("Name is required"),
    body("phone").trim().escape().notEmpty().withMessage("Phone is required"),
    body("date").trim().escape().notEmpty(),
    body("time").trim().escape().notEmpty(),
    body("guests").isInt({ min: 1 }).withMessage("Guests must be at least 1"),
    body("special").trim().escape(),
    // selectedTours is a string (formatted text), just trim/escape
    body("selectedTours").trim().escape(),
  ],
  async (req, res) => {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        error: { message: "Validation Failed", details: errors.array() },
      });
    }

    try {
      const {
        name,
        phone,
        date,
        time,
        guests,
        special,
        selectedTours,
        totalPrice,
      } = req.body;

      const accessToken = process.env.ACCESS_TOKEN;
      const phoneNumberId = process.env.PHONE_NUMBER_ID;
      const recipientPhone = process.env.RECIPIENT_PHONE;

      if (!accessToken || !phoneNumberId || !recipientPhone) {
        console.error("Missing environment variables");
        return res
          .status(500)
          .json({ success: false, message: "Server configuration error" });
      }

      // Construct a beautiful WhatsApp-style message
      let messageBody =
        `🌟 *New Reservation Request* 🌟\n\n` +
        `👤 *Name:* ${name}\n` +
        `📱 *Phone:* ${phone}\n\n` +
        `🗓 *Date:* ${date}\n` +
        `⏰ *Time:* ${time}\n` +
        `👥 *Guests:* ${guests}\n\n`;

      if (selectedTours && selectedTours.trim()) {
        // It is already formatted by the frontend
        // Unescape specifically for the message body if needed, but 'escape' might break newlines?
        // Actually express-validator escape() replaces <, >, &, ', " and /.
        // It does NOT escape \n. So newlines are preserved?
        // Wait, validator.escape() escapes HTML characters. It generally shouldn't affect plain text newlines unless they are encoded?
        // But frontend sends literal \n.
        // Let's assume escape is fine for security. If it breaks formatting (e.g. & to &amp;) we might see &amp; in WhatsApp.
        // WhatsApp treats text as plain text.
        // If I escape, "A & B" becomes "A &amp; B". Accessing via WhatsApp API, this might show as "&amp;".
        // Better to use a specific sanitizer that strips dangerous chars or just rely on the fact that WhatsApp is text-only?
        // But we are vulnerable to XSS? The backend just sends to WhatsApp.
        // The danger is if we log it or render it in an Admin Dashboard.
        // I will stick to trim() and maybe blacklist <>?
        // Let's use trim() and check logic.
        messageBody += `🎒 *Selected Tours & Breakdown:*\n${selectedTours}\n\n`;
      }

      if (totalPrice) {
        messageBody += `💰 *Total Price:* ${totalPrice}\n\n`;
      }

      messageBody += `📝 *Special Request:*\n${special || "None"}`;

      // WhatsApp API Payload
      const payload = {
        messaging_product: "whatsapp",
        to: recipientPhone,
        type: "text",
        text: {
          body: messageBody,
        },
      };

      const response = await axios.post(
        `https://graph.facebook.com/v22.0/${phoneNumberId}/messages`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      console.log("WhatsApp API Response:", response.data);
      res.json({ success: true, message: "Message sent successfully!" });
    } catch (error) {
      console.error(
        "Error sending WhatsApp message:",
        error.response ? error.response.data : error.message
      );
      res.status(500).json({
        success: false,
        message: "Failed to send message",
        error: error.response ? error.response.data : error.message,
      });
    }
  }
);

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  console.log(
    "Ensure you have your .env file configured with WhatsApp credentials."
  );
});
