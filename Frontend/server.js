// const express = require("express");
// const path = require("path");
// const app = express();

// // Middleware to serve static files from the "public" folder
// app.use(express.static(path.join(__dirname, "public")));

// app.use(express.urlencoded({ extended: true }));
// app.use(express.json());

// // Optional: fallback route (in case someone hits `/` explicitly)
// app.get("/", (req, res) => {
//   res.sendFile(path.join(__dirname, "public", "index.html"));
// });

// app.post("/submit", async (req, res) => {
//   try {
//     const response = await fetch("http://localhost:5000/submit", {
//       method: "POST",
//       headers: { "Content-Type": "application/x-www-form-urlencoded" },
//       body: new URLSearchParams(req.body),
//     });

//     const result = await response.text();
//     res.send("Submitted to backend!");
//   } catch (error) {
//     console.error("Error sending to backend:", error.message);
//     res.status(500).send("Failed to send to backend");
//   }
// });

// app.listen(3000, '0.0.0.0', () => {
//   console.log("Server running on port 3000");
// });

const express = require("express");
const path = require("path");
const app = express();

// Add these error handlers at the very beginning
process.on('uncaughtException', (err) => {
  console.error('CRITICAL UNCAUGHT ERROR:', err);
});

process.on('unhandledRejection', (err) => {
  console.error('CRITICAL UNREJECTED PROMISE:', err);
});

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static files
app.use(express.static(path.join(__dirname, "public")));

// Routes
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.post("/submit", async (req, res) => {
  try {
    console.log("Received submission:", req.body); // Add logging
    
    const response = await fetch("http://localhost:5000/submit", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams(req.body),
    });

    if (!response.ok) throw new Error(`Backend responded with ${response.status}`);
    
    const result = await response.json();
    res.json(result);
  } catch (error) {
    console.error("Submission error:", error);
    res.status(500).json({ error: error.message });
  }
});

// Health check endpoint
app.get("/health", (req, res) => {
  res.status(200).send("OK");
});

const PORT = 3000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
}).on('error', (err) => {
  console.error('Server failed to start:', err);
});