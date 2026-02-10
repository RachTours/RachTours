/**
 * ============================================================================
 * 🛡️ RACH TOURS | SECURE RESERVATION HANDLER (v6.0 Enterprise)
 * ============================================================================
 * 
 * INSTRUCTIONS:
 * 1. Open your Google Sheet.
 * 2. Go to Extensions > Apps Script.
 * 3. Paste this entire code into Code.gs (Delete old code).
 * 4. Configure the 'CONFIG' object below (especially extracted_TOKEN).
 * 5. Run 'setupDashboard' once to initialize the sheet design.
 * 6. Deploy as Web App:
 *    - Click 'Deploy' > 'New deployment'
 *    - Type: 'Web app'
 *    - Description: 'Reservation Hook v6'
 *    - Execute as: 'Me'
 *    - Who has access: 'Anyone' (Security is handled by the Token check)
 * 7. Copy the Web App URL and add it to your server .env file.
 */

// ============================================================================
// ⚙️ CONFIGURATION
// ============================================================================
const CONFIG = {
  // SECURITY: This MUST match the 'GOOGLE_SHEET_API_TOKEN' in your server .env
  EXPECTED_TOKEN: "rach-tours-secret-123", 

  // SHEET SETTINGS
  SHEET_NAME: "Reservations", // The tab name to use
  SPREADSHEET_ID: "1uSISw3hZ0Zqjd-LtGbbN2IpYWqH0Lueds2iBVNVG7Jw", // Explicit ID for robust connection
  LOCALE: "en-US",
  TIMEZONE: "GMT",
  
  // UI COLORS (Enterprise Dark/Light Theme)
  COLORS: {
    HEADER_BG: "#1e293b",
    HEADER_TEXT: "#ffffff",
    PENDING_BG: "#fffbeb",
    PENDING_TEXT: "#b45309",
    CONFIRMED_BG: "#f0fdf4",
    CONFIRMED_TEXT: "#15803d",
    CANCELLED_BG: "#fef2f2",
    CANCELLED_TEXT: "#991b1b",
    WHATSAPP_BTN: "#dcfce7",
    WHATSAPP_TEXT: "#166534"
  }
};

/**
 * Helper to get the spreadsheet instance safely
 */
function getSpreadsheet() {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    if (ss) return ss;
  } catch(e) {}
  
  if (CONFIG.SPREADSHEET_ID) {
    return SpreadsheetApp.openById(CONFIG.SPREADSHEET_ID);
  }
  throw new Error("Spreadsheet not found. Please bind script to sheet or set SPREADSHEET_ID.");
}

// ============================================================================
// 🌐 WEBHOOK HANDLER (doPost)
// ============================================================================
function doPost(e) {
  // 1. Security Check: Block invalid requests immediately
  if (!e || !e.postData || !e.postData.contents) {
    return createJSONResponse("error", "Invalid Request: No data received");
  }

  try {
    const data = JSON.parse(e.postData.contents);

    // 2. Token Validation (Critical Security Step)
    if (data.token !== CONFIG.EXPECTED_TOKEN) {
      console.warn("Unauthorized access attempt. Invalid Token.");
      return createJSONResponse("error", "Unauthorized: Invalid Security Token");
    }

    // 3. Process Reservation
    const result = processReservation(data);
    return createJSONResponse("success", "Reservation processed", result);

  } catch (error) {
    console.error("System Error: " + error.toString());
    return createJSONResponse("error", "Server Error: " + error.toString());
  }
}

/**
 * Core Logic to parse data and append to sheet
 */
function processReservation(data) {
  const ss = getSpreadsheet();
  let sheet = ss.getSheetByName(CONFIG.SHEET_NAME);
  
  // Auto-create sheet if missing
  if (!sheet) {
    sheet = ss.insertSheet(CONFIG.SHEET_NAME);
    setupDashboard(); // Initialize headers if new
  }

  const timestamp = new Date();
  
  // Format Tours nicely
  let toursFormatted = "No tours selected";
  if (data.tours && Array.isArray(data.tours)) {
    toursFormatted = data.tours.map(t => 
      `• ${t.title || "Unknown Tour"} ${t.hasTransport ? "(🚕 +Transfer)" : ""}`
    ).join("\n");
  }

  // Generate WhatsApp Direct Link
  const cleanPhone = (data.phone || "").replace(/\D/g, "");
  const waBody = `Marhaba ${data.name || "Guest"}! 🇲🇦 This is Rach Tours. We have your reservation for ${data.date}.`;
  const waLink = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(waBody)}`;

  // Prepare Row Data
  // Columns: [Status, Action, Timestamp, Date, Time, Name, Phone, Pax, Total, Trans, Tours, Notes]
  const newRow = [
    "🟡 Pending",                                // A: Status
    `=HYPERLINK("${waLink}", "💬 WhatsApp")`,    // B: Action
    timestamp,                                   // C: Timestamp
    data.date || "-",                            // D: Rez Date
    data.time || "-",                            // E: Rez Time
    data.name || "Guest",                        // F: Name
    `'${data.phone || ""}`,                      // G: Phone (Force string)
    data.guests || 1,                            // H: Pax
    data.totalPrice || 0,                        // I: Total
    data.transport ? "Yes" : "No",               // J: Transport
    toursFormatted,                              // K: Tours
    data.specialRequest || "-"                   // L: Notes
  ];

  // Insert at top (Row 8 now, because of v7 layout changes)
  sheet.insertRowAfter(7); // Headers are at 6, Border at 7
  sheet.getRange(8, 1, 1, newRow.length).setValues([newRow]);
  
  // Optional: Update dashboard stats
  try { refreshStats(); } catch(e) {}

  return { row: 8, status: "Appended" };
}

// ============================================================================
// 🛠️ UTILITIES & RESPONSE HELPERS
// ============================================================================
function createJSONResponse(status, message, data) {
  return ContentService.createTextOutput(JSON.stringify({
    result: status,
    message: message,
    data: data || null
  })).setMimeType(ContentService.MimeType.JSON);
}

// ============================================================================
// 📊 DASHBOARD SETUP (The "Professional" Look)
// ============================================================================
// ============================================================================
// 📊 DASHBOARD SETUP (v7: Modern Cards Design 💎)
// ============================================================================
function onOpen() {
  SpreadsheetApp.getUi()
    .createMenu('💎 Admin Panel')
    .addItem('🎨 Apply New Design', 'setupDashboard')
    .addSeparator()
    .addItem('🧪 Test Connection', 'testLocal')
    .addToUi();
}

function setupDashboard() {
  const ss = getSpreadsheet();
  let sheet = ss.getSheetByName(CONFIG.SHEET_NAME);
  if (!sheet) sheet = ss.insertSheet(CONFIG.SHEET_NAME);
  sheet.activate();

  // 1. GLOBAL RESET (The "Nuclear" Option) ☢️
  // We MUST unmerge EVERYTHING first. This fixes the "You must select all cells..." error.
  try {
    sheet.getRange("A1:Z3000").breakApart(); 
  } catch(e) {}

  // 2. CLEANUP
  sheet.getRange("1:7").clear(); 
  sheet.getRange("A1:Z1000").clearFormat(); 
  
  // 3. LAYOUT SETUP
  sheet.setHiddenGridlines(true);
  sheet.setFrozenRows(7);

  // Row Heights
  sheet.setRowHeight(1, 15);  // Top Padding
  sheet.setRowHeight(2, 45);  // Stats Cards (Top Half)
  sheet.setRowHeight(3, 40);  // Stats Cards (Bottom Half)
  sheet.setRowHeight(4, 15);  // Gap
  sheet.setRowHeight(5, 10);  // Gap
  sheet.setRowHeight(6, 45);  // Headers
  sheet.setRowHeight(7, 5);   // Border Line

  // Column Widths (Adjusted for "Card" feel)
  const widths = [140, 140, 150, 110, 80, 160, 140, 60, 110, 60, 300, 200];
  widths.forEach((w, i) => sheet.setColumnWidth(i + 1, w));

  // 3. STATS CARDS (Merged Cells for "Card" look)
  // Revenue Card (A2:B3)
  drawCard(sheet, "A2:B3", "A2", "💰 REVENUE", "B2:B3", "=SUM(I8:I)", "#eff6ff", "#1e3a8a", "$#,##0.00");

  // Guests Card (D2:E3)
  drawCard(sheet, "D2:E3", "D2", "👥 GUESTS", "E2:E3", "=SUM(H8:H)", "#f0fdf4", "#14532d", "0");

  // Bookings Card (G2:H3)
  drawCard(sheet, "G2:H3", "G2", "📅 BOOKINGS", "G2:H3", "=COUNTA(F8:F)", "#f5f3ff", "#4c1d95", "0");

  // Pending Card (J2:K3)
  drawCard(sheet, "J2:K3", "J2", "⏳ PENDING", "K2:K3", `=COUNTIF(A8:A, "*Pending*")`, "#fef2f2", "#b91c1c", "0");

  // Helper text for "Pending" count logic
  sheet.getRange("K4").setFontColor("#dc2626"); 

  // 4. MAIN HEADERS (Row 6)
  const headers = [
    "STATUS", "ACTION", "TIMESTAMP", "RES. DATE", "TIME", 
    "NAME", "PHONE", "PAX", "TOTAL ($)", "TAXI", "TOURS SELECTED", "SPECIAL NOTES"
  ];
  const headerRange = sheet.getRange(6, 1, 1, headers.length);
  headerRange.setValues([headers]);
  headerRange.setBackground("#334155")
             .setFontColor("#f8fafc")
             .setFontFamily("Verdana")
             .setFontWeight("bold")
             .setFontSize(10)
             .setHorizontalAlignment("center")
             .setVerticalAlignment("middle");

  // 5. DATA ROWS FORMATTING (Row 8+)
  sheet.getRange("A8:L1000")
       .setFontFamily("Arial")
       .setFontSize(10)
       .setVerticalAlignment("middle")
       .setWrap(true);
       
  // Alignments
  sheet.getRange("A8:A").setHorizontalAlignment("center").setFontWeight("bold"); // Status
  sheet.getRange("B8:B").setHorizontalAlignment("center"); // Action
  sheet.getRange("H8:J").setHorizontalAlignment("center"); // Pax, Total, Taxi
  sheet.getRange("I8:I").setNumberFormat("$#,##0.00").setFontWeight("bold").setFontColor("#059669"); // Money
  
  applyConditionalFormatting(sheet);

  Logger.log("Modern Design Applied! 💎");
}

/**
 * Helper to draw a "Stat Card"
 */
function drawCard(sheet, rangeCode, labelCell, labelText, valueCell, formula, bgColor, textColor, numFormat) {
  // Merge the block
  const range = sheet.getRange(rangeCode);
  range.merge()
       .setBackground(bgColor)
       .setBorder(true, true, true, true, null, null, "#cbd5e1", SpreadsheetApp.BorderStyle.SOLID_MEDIUM);

  // Label (Top Left)
  range.breakApart(); // Temp break to style individual parts if needed, but actually we want main value centered.
  
  // Wait, for 2x2 grid (A2:B3), we want:
  // Label at Top (A2:B2 merged?) or Label at Left (A2:A3)?
  // Let's do: Label Small at Top, Value Big at Bottom.
  
  // Re-merge fully for background
  sheet.getRange(rangeCode).merge().setBackground(bgColor);
  
  // Let's use the Cells passed.
  // We will assume the User passed a block range like "A2:B3". 
  // We'll put Label in Top-Left cell, Value in Bottom-Right or Centered.
  
  // SIMPLER STRATEGY:
  // 1. Set background on whole block.
  sheet.getRange(rangeCode).setBackground(bgColor)
       .setBorder(true, true, true, true, true, true, bgColor, SpreadsheetApp.BorderStyle.SOLID); // Clear internal
       
  // 2. Set Value (Big Number)
  const valRange = sheet.getRange(valueCell); // e.g. B2:B3 or just B2
  valRange.merge().setFormula(formula)
       .setFontWeight("bold")
       .setFontSize(22) // Bigger
       .setFontColor(textColor)
       .setNumberFormat(numFormat)
       .setHorizontalAlignment("center")
       .setVerticalAlignment("middle");

  // 3. Set Label (Small Text)
  const lblRange = sheet.getRange(labelCell);
  lblRange.setValue(labelText)
       .setFontWeight("bold")
       .setFontSize(9)
       .setFontColor(textColor) // Same color but smaller
       .setVerticalAlignment("middle")
       .setHorizontalAlignment("center");
       
  // 4. Outer Border
  sheet.getRange(rangeCode).setBorder(true, true, true, true, false, false, "#94a3b8", SpreadsheetApp.BorderStyle.SOLID);
}

function applyConditionalFormatting(sheet) {
  sheet.clearConditionalFormatRules();
  const rules = [];
  const range = sheet.getRange("A8:A1000"); // Note start row is 8 now

  // Pending
  rules.push(SpreadsheetApp.newConditionalFormatRule().whenTextContains("Pending").setBackground("#fff7ed").setFontColor("#c2410c").setRanges([range]).build());
  // Confirmed
  rules.push(SpreadsheetApp.newConditionalFormatRule().whenTextContains("Confirmed").setBackground("#f0fdfa").setFontColor("#0f766e").setRanges([range]).build());
  // Cancelled
  rules.push(SpreadsheetApp.newConditionalFormatRule().whenTextContains("Cancelled").setBackground("#fef2f2").setFontColor("#991b1b").setRanges([range]).build());

  // WhatsApp Button
  const actionRange = sheet.getRange("B8:B1000");
  rules.push(SpreadsheetApp.newConditionalFormatRule().whenTextContains("WhatsApp").setBackground("#dcfce7").setFontColor("#166534").setBold(true).setRanges([actionRange]).build());

  sheet.setConditionalFormatRules(rules);
}

function refreshStats() {
  SpreadsheetApp.flush();
}

function testLocal() {
   // no-op test
}
