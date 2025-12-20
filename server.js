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
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: [
          "'self'",
          "'unsafe-inline'",
          "cdnjs.cloudflare.com",
          "cdn.jsdelivr.net",
        ],
        styleSrc: [
          "'self'",
          "'unsafe-inline'",
          "fonts.googleapis.com",
          "cdnjs.cloudflare.com",
          "cdn.jsdelivr.net",
        ],
        fontSrc: ["'self'", "fonts.gstatic.com", "cdnjs.cloudflare.com"],
        imgSrc: ["'self'", "data:", "https:"],
        connectSrc: ["'self'"],
        frameAncestors: ["'none'"], // X-Frame-Options equivalent
        upgradeInsecureRequests: [], // Force HTTPS
      },
    },
    hsts: {
      maxAge: 31536000,
      includeSubDomains: true,
      preload: true,
    },
  })
);
app.use(xss());
app.use(hpp());
app.use(cors());

// Trust Proxy for Render (Required for rate limit and HTTPS redirect)
app.set("trust proxy", 1);

// Force HTTPS
app.use((req, res, next) => {
  if (
    req.header("x-forwarded-proto") !== "https" &&
    process.env.NODE_ENV === "production"
  ) {
    res.redirect(`https://${req.header("host")}${req.url}`);
  } else {
    next();
  }
});

// Rate Limiting
const limiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 100, // limit each IP to 100 requests per windowMs
});
app.use(limiter);

app.use(express.json());
app.use(express.static(__dirname)); // Serve static files (HTML, CSS, JS)

const { body, validationResult } = require("express-validator");

// Route to handle WhatsApp sending
app.post(
  "/send-whatsapp",
  [
    // Input Sanitization & Validation
    body("name").trim().escape().notEmpty().withMessage("Name is required"),
    body("phone")
      .trim()
      .escape()
      .matches(/^[0-9+]+$/)
      .withMessage("Phone must contain only numbers"), // Keep + for backend validation just in case
    body("date").trim().escape().notEmpty(),
    body("time").trim().escape().notEmpty(),
    body("guests").isInt({ min: 1 }).withMessage("Guests must be at least 1"),
    body("special").trim().escape(),
    // Allow extended formatting chars (newline, *, (), $, :) for the tour list
    body("selectedTours")
      .trim()
      .customSanitizer((value) => {
        return value.replace(/[<>]/g, ""); // Basic XSS prevention while keeping format
      }),
  ],
  async (req, res) => {
    // Check validation results
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: "Validation error",
        error: errors.array(),
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
