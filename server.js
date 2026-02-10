const express = require("express");
const path = require("path");
require("dotenv").config();
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const xss = require("xss-clean");
const hpp = require("hpp");
const cors = require("cors");

const app = express(); // Initialize Express App

// ... existing imports ...
// --- 1. Configuration & Constants ---
const PORT = process.env.PORT || 3022; // Using 3022 as default to avoid conflicts

// Warn if essential variables are missing
const requiredEnv = ["WHATSAPP_TOKEN", "PHONE_NUMBER_ID", "MY_PHONE_NUMBER"];
requiredEnv.forEach((key) => {
  if (!process.env[key] || process.env[key].includes("YOUR_")) {
    console.warn(
      `WARNING: ${key} is not set or is a placeholder. WhatsApp messages will use MOCK MODE.`
    );
  } else if (key === "WHATSAPP_TOKEN") {
      const token = process.env[key];
      console.log(`DEBUG: Loaded WHATSAPP_TOKEN starting with: ${token.substring(0, 10)}...`);
  }
});

// --- Security Middleware ---

// 1a. Force HTTPS (Production Only)
// 1a. Force HTTPS (Production Only) with Open Redirect Protection
app.use((req, res, next) => {
  if (process.env.NODE_ENV === "production") {
    if (req.headers["x-forwarded-proto"] !== "https") {
      const safeHost = process.env.DOMAIN || "rach-tours.com"; // strict check or allow-list

      // Strict Open Redirect Protection using URL constructor
      try {
        const redirectUrl = new URL(req.url, `https://${safeHost}`);
        return res.redirect(redirectUrl.toString());
      } catch (e) {
        // Fallback to root if URL construction fails
        return res.redirect(`https://${safeHost}`);
      }
    }
  }
  next();
});

// 1. Helmet (Secure Headers & CSP)
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-inline'"],
        styleSrc: ["'self'", "'unsafe-inline'"], // Allow inline styles for JS dynamic styling
        fontSrc: ["'self'"],
        imgSrc: ["'self'", "data:"],
        connectSrc: ["'self'"],
        upgradeInsecureRequests: [],
      },
    },
    crossOriginEmbedderPolicy: false,
    hsts: {
      maxAge: 31536000, // 1 Year
      includeSubDomains: true,
      preload: true,
    },
    frameguard: {
      action: "deny", // Prevent clickjacking (or "sameorigin" if you need usage in iframes)
    },
  })
);

// 2. Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 1000, // Increased for dev/testing
  message: "Too many requests from this IP, please try again later.",
});
app.use(limiter);

// 3. Body Parsing & Sanitization
// 3. Body Parsing & Sanitization
// SECURITY: Block access to sensitive files since we are serving from root
app.use((req, res, next) => {
  const sensitiveFiles = [
    ".env",
    ".env.example",
    "server.js",
    "package.json",
    "package-lock.json",
    "README.md",
    "Procfile",
    ".gitignore",
  ];
  const sensitiveDirs = ["/src", "/.git", "/.vscode", "/node_modules", "/.agent"];

  if (
    sensitiveFiles.some((file) => req.path.includes(file)) ||
    sensitiveDirs.some((dir) => req.path.startsWith(dir))
  ) {
    return res.status(403).send("Access Denied");
  }
  next();
});

const publicPath = __dirname; // Root is now public
app.use(express.static(publicPath)); // Serve static files from root
app.use(express.json({ limit: "10kb" })); // Body limit
app.use(xss()); // Prevent XSS in body/params
app.use(hpp()); // Prevent HTTP Parameter Pollution
app.use(cors()); // Enable CORS

// --- Routes ---

app.get("/", (req, res) => {
  res.sendFile(path.join(publicPath, "index.html"));
});

// API Routes
app.use("/api", require("./src/routes/api"));

app.get("*", (req, res) => {
  // Prevent serving sensitive files via catch-all if they slipped through
  if (
    req.path.includes(".env") ||
    req.path.includes("server.js") ||
    req.path.startsWith("/src")
  ) {
    return res.status(403).send("Access Denied");
  }
  res.sendFile(path.join(publicPath, "index.html"));
});


// --- End of Reservation Routes ---

// --- Error Handling (Optional but recommended) ---
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

// --- 6. Server Activation ---
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});
