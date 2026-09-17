const express = require("express");
const mongoose = require("mongoose");
const User = require("../models/User");
const Post = require("../models/Post");
const auth = require("../middleware/auth.middleware");

const router = express.Router();

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

router.get("/search", auth, async (req, res) => {
  try {
    const q = (req.query.q || "").trim();
    if (!q) return res.json([]);

    const users = await User.find({
      _id: { $ne: req.user.id },
      $or: [
        { name: { $regex: q, $options: "i" } },
        { email: { $regex: q, $options: "i" } },
      ],
    })
      .select("_id name email bio avatarUrl location website createdAt updatedAt")
      .limit(20);

    res.json(users);
  } catch (e) {
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/me", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json(publicUser(user));
  } catch (e) {
    res.status(500).json({ message: "Server error" });
  }
});

router.put("/me", auth, async (req, res) => {
  try {
    const { name, bio, avatarUrl, location, website } = req.body;

    const update = {
      name: typeof name === "string" ? name.trim() : undefined,
      bio: typeof bio === "string" ? bio.trim() : undefined,
      avatarUrl: typeof avatarUrl === "string" ? avatarUrl.trim() : undefined,
      location: typeof location === "string" ? location.trim() : undefined,
      website: typeof website === "string" ? website.trim() : undefined,
    };

    Object.keys(update).forEach((key) => {
      if (update[key] === undefined) delete update[key];
    });

    if (update.name !== undefined && !update.name) {
      return res.status(400).json({ message: "Name is required" });
    }

    const user = await User.findByIdAndUpdate(req.user.id, update, {
      new: true,
      runValidators: true,
    });

    if (!user) return res.status(404).json({ message: "User not found" });

    res.json(publicUser(user));
  } catch (e) {
    console.error("update me error", e);
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/:id", auth, async (req, res) => {
  try {
    const id = req.params.id;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ message: "Invalid user id" });
    }

    const user = await User.findById(id).select(
      "_id name email bio avatarUrl location website createdAt updatedAt"
    );

    if (!user) return res.status(404).json({ message: "User not found" });

    const postsCount = await Post.countDocuments({ author: id });

    res.json({
      ...publicUser(user),
      postsCount,
    });
  } catch (e) {
    console.error("get profile error", e);
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/:id/posts", auth, async (req, res) => {
  try {
    const id = req.params.id;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ message: "Invalid user id" });
    }

    const posts = await Post.find({ author: id })
      .populate("author", "name email bio avatarUrl location website")
      .sort({ createdAt: -1 })
      .limit(50)
      .lean();

    res.json(posts);
  } catch (e) {
    console.error("get user posts error", e);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;