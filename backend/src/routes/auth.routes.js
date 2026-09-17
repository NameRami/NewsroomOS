//Auth routes (signup + login)

const express = require("express"); //Imports Express, the web framework you’re using to build APIs.
const bcrypt = require("bcrypt");//Imports bcrypt, used to hash passwords and compare hashes securely
const jwt = require("jsonwebtoken"); //Imports jsonwebtoken, used to create and verify JWT tokens
const User = require("../models/User");
const authMiddleware = require("../middleware/auth.middleware");



const router = express.Router();


// Signup
router.post("/signup", async (req, res) => {
  const { name, email, password } = req.body;

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(400).json({ message: "User already exists" });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await User.create({
    name,
    email,
    password: hashedPassword
  });

  const token = jwt.sign(
    { id: user._id },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );

  res.json({ token, user });
});

// Login





function publicUser(user) {
  return {
    _id: user._id,
    name: user.name,
    email: user.email,
    bio: user.bio || "",
    avatarUrl: user.avatarUrl || "",
    location: user.location || "",
    website: user.website || "",
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
}

// Signup
router.post("/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.json({ token, user: publicUser(user) });
  } catch (e) {
    res.status(500).json({ message: "Server error" });
  }
});

// Login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.json({ token, user: publicUser(user) });
  } catch (e) {
    res.status(500).json({ message: "Server error" });
  }
});




module.exports = router;