const express = require("express");
const app = express();
const port = 3000;

// Set EJS as the templating engine
app.set("view engine", "ejs");

// Define routes
app.get("/", (req, res) => {
  res.redirect("/login");
});

app.get("/login", (req, res) => {
  res.render("login");
});

app.get("/register", (req, res) => {
  res.render("register");
});

app.get("/chat", (req, res) => {
  res.render("chat");
});

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
