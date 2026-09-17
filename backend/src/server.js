// Express server
require("dotenv").config(); // Loads environment variables
const express = require("express"); // Web server framework
const cors = require("cors"); // Allows frontend to call backend
const connectDB = require("./config/db.js");

const app = express(); // Creates an Express application instance

// 🔥 MIDDLEWARE (MUST be before routes)
app.use(cors());
app.use(express.json()); // Parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Parse form data (optional but safe)

// Connect database
connectDB();

// Routes (mounted AFTER middleware)
app.use("/auth", require("./routes/auth.routes"));
app.use("/posts", require("./routes/post.routes"));


app.use("/users", require("./routes/user.routes"));
app.use("/messages", require("./routes/message.routes"));



// Test Route
app.get("/", (req, res) => {
  res.send("API is running");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
