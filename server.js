const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;
const DATA_DIR = path.join(__dirname, "data");
const DATA_FILE = path.join(DATA_DIR, "enquiries.json");

fs.mkdirSync(DATA_DIR, { recursive: true });
if (!fs.existsSync(DATA_FILE)) {
  fs.writeFileSync(DATA_FILE, "[]\n", "utf8");
}

app.use(express.json({ limit: "20kb" }));
app.use(express.static(path.join(__dirname, "public")));

function readEnquiries() {
  try {
    const contents = fs.readFileSync(DATA_FILE, "utf8");
    const parsed = JSON.parse(contents);
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    console.error("Could not read enquiry database:", error.message);
    throw new Error("Enquiry storage is temporarily unavailable.");
  }
}

function saveEnquiries(enquiries) {
  const tempFile = DATA_FILE + ".tmp";
  fs.writeFileSync(tempFile, JSON.stringify(enquiries, null, 2) + "\n", "utf8");
  fs.renameSync(tempFile, DATA_FILE);
}

app.post("/api/enquiries", (req, res) => {
  const { name, phone, email = "", interest, message = "" } = req.body || {};

  if (typeof name !== "string" || name.trim().length < 2 || name.length > 100) {
    return res.status(400).json({ error: "Please enter a valid name." });
  }
  if (typeof phone !== "string" || phone.trim().length < 7 || phone.length > 30) {
    return res.status(400).json({ error: "Please enter a valid phone number." });
  }
  if (typeof email !== "string" || email.length > 150 ||
      (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))) {
    return res.status(400).json({ error: "Please enter a valid email address." });
  }
  const allowed = ["Free trial", "Basic membership", "Premium membership", "VIP membership", "Personal training"];
  if (!allowed.includes(interest)) {
    return res.status(400).json({ error: "Please select a valid enquiry type." });
  }
  if (typeof message !== "string" || message.length > 2000) {
    return res.status(400).json({ error: "Message is too long." });
  }

  try {
    const enquiries = readEnquiries();
    const enquiry = {
      id: Date.now().toString(36) + "-" + Math.random().toString(36).slice(2, 8),
      name: name.trim(),
      phone: phone.trim(),
      email: email.trim(),
      interest,
      message: message.trim(),
      createdAt: new Date().toISOString()
    };
    enquiries.push(enquiry);
    saveEnquiries(enquiries);
    return res.status(201).json({ success: true, enquiryId: enquiry.id });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Could not save your enquiry. Please try again." });
  }
});

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", storage: "local-json" });
});

app.listen(PORT, () => {
  console.log(`PowerFit website running at http://localhost:${PORT}`);
});
