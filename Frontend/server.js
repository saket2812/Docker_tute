const express = require("express");
const path = require("path");
const app = express();

// Middleware to serve static files from the "public" folder
app.use(express.static(path.join(__dirname, "public")));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Optional: fallback route (in case someone hits `/` explicitly)
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.post("/submit", async (req, res) => {
  try {
    const response = await fetch("http://backend:5000/submit", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams(req.body),
    });

    const result = await response.text();
    res.send("Submitted to backend!");
  } catch (error) {
    console.error("Error sending to backend:", error.message);
    res.status(500).send("Failed to send to backend");
  }
});

app.listen(3000, () => console.log("✅ Frontend running on port 3000"));
