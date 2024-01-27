const express = require("express");
const app = express();
const http = require("http").createServer(app);
const io = require("socket.io")(http);
const mongoose = require("mongoose");
const bodyParser = require("body-parser"); // Include body-parser
const User = require("./models/user"); // Ensure this path is correct
const port = 3000;

// MongoDB Connection
mongoose
  .connect("Mongo Connection string", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log(err));

app.set("view engine", "ejs");

// Use body-parser middleware
app.use(bodyParser.urlencoded({ extended: true }));

// Routes
app.get("/", (req, res) => {
  res.redirect("/login");
});

app.get("/login", (req, res) => {
  res.render("login");
});

app.get("/register", (req, res) => {
  res.render("register");
});

// Registration POST Route
app.post("/register", async (req, res) => {
  try {
    const { username, password } = req.body;
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.send("User already exists");
    }
    const newUser = new User({ username, password });
    await newUser.save();
    res.redirect("/login");
  } catch (err) {
    res.status(500).send("Error during registration");
  }
});

app.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (user && password === user.password) {
      res.redirect("/chat");
    } else {
      res.send("Login failed");
    }
  } catch (err) {
    res.status(500).send("Error during login");
  }
});

app.get("/chat", (req, res) => {
  res.render("chat");
});

// Socket.IO Communication
io.on("connection", (socket) => {
  console.log("a user connected");

  socket.on("chat message", (msg) => {
    io.emit("chat message", msg);
  });

  socket.on("disconnect", () => {
    console.log("user disconnected");
  });
});

// Start the server
http.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
