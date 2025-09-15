const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const fs = require("fs");
const xlsx = require("xlsx");

const app = express();
const PORT = 3000;

// Middlewares
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files (HTML, CSS, JS, images)
app.use(express.static(__dirname));

// Excel file path
const filePath = "enquiries.xlsx";

// POST route for enquiry form
app.post("/submit-enquiry", (req, res) => {
  const { name, email, phone, message } = req.body;
  console.log("📩 Received enquiry:", req.body);

  try {
    let wb;
    let ws;

    // If file exists, read it
    if (fs.existsSync(filePath)) {
      wb = xlsx.readFile(filePath);
      ws = wb.Sheets["Enquiries"];

      // If sheet missing, create it
      if (!ws) {
        ws = xlsx.utils.aoa_to_sheet([["Name", "Email", "Phone", "Message"]]);
        xlsx.utils.book_append_sheet(wb, ws, "Enquiries");
      }
    } else {
      // If file missing, create new
      wb = xlsx.utils.book_new();
      ws = xlsx.utils.aoa_to_sheet([["Name", "Email", "Phone", "Message"]]);
      xlsx.utils.book_append_sheet(wb, ws, "Enquiries");
    }

    // Convert sheet to JSON
    const data = xlsx.utils.sheet_to_json(ws);

    // Add new row
    data.push({ Name: name, Email: email, Phone: phone, Message: message });

    // Convert JSON back to sheet
    const newWS = xlsx.utils.json_to_sheet(data, { origin: "A1" });
    wb.Sheets["Enquiries"] = newWS;

    // Save file
    xlsx.writeFile(wb, filePath);

    console.log("✅ Enquiry saved to Excel.");
    res.json({ success: true });
  } catch (error) {
    console.error("❌ Error saving enquiry:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
