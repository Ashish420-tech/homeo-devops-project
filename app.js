const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = 3000;

// Log file path
const logFile = path.join(__dirname, "server.log");

// Middleware to log each request
app.use((req, res, next) => {
  const log = `${new Date().toISOString()} - ${req.method} ${req.url}\n`;
  fs.appendFileSync(logFile, log);
  console.log(log.trim());
  next();
});

// Route
app.get("/", (req, res) => {
  res.send("Hello from Homeo DevOps Project with logging enabled!");
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
