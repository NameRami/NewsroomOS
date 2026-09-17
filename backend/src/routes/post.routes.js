const express = require("express");
const mongoose = require("mongoose");
const User = require("../models/User");
const Post = require("../models/Post");
const auth = require("../middleware/auth.middleware");

const router = express.Router();

/**
 * POST /posts
 * Create a new post (auth required)
 */
router.post("/", auth, async (req, res) => {
  try {
    const { content } = req.body;

    if (!content || !content.trim()) {
      return res.status(400).json({ message: "Post content is required" });
    }

    const post = await Post.create({
      author: req.user.id,
      content: content.trim(),
    });

    const populated = await post.populate("author", "name email avatarUrl");
    return res.status(201).json(populated);
  } catch (error) {
    console.error("Create post error:", error);
    return res.status(500).json({ message: "Server error" });
  }
});

/**
 * GET /posts
 * Get feed posts (newest first) (auth required)
 */
router.get("/", auth, async (req, res) => {
  try {
    const posts = await Post.find()
      .populate("author", "name email avatarUrl")
      .sort({ createdAt: -1 })
      .limit(50)
      .lean();

    return res.json(posts);
  } catch (error) {
    console.error("List posts error:", error);
    return res.status(500).json({ message: "Server error" });
  }
});

/**
 * POST /posts/generate
 * Generate a post draft with AI (auth required)
 */
router.post("/generate", auth, async (req, res) => {
  try {
    const { prompt } = req.body;

    if (!prompt || !prompt.trim()) {
      return res.status(400).json({ message: "Prompt is required" });
    }

    if (!process.env.PPQ_API_KEY) {
      return res.status(500).json({ message: "Missing PPQ_API_KEY in server environment" });
    }

    const response = await fetch("https://api.ppq.ai/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.PPQ_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "openai/gpt-4o-mini",
        messages: [
          {
            role: "system",
            content:
              "You are a helpful assistant that writes engaging, clear, concise social media posts for journalists. Keep the post natural, polished, and ready to publish. Do not use hashtags unless the user asks for them.",
          },
          {
            role: "user",
            content: `Create a social media post about: ${prompt.trim()}`,
          },
        ],
        max_tokens: 200,
        temperature: 0.7,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("PPQ API error:", data);
      return res.status(500).json({
        message: data?.error?.message || "AI generation failed",
      });
    }

    const generated =
      data?.choices?.[0]?.message?.content?.trim() || "";

    if (!generated) {
      return res.status(500).json({ message: "AI returned an empty response" });
    }

    return res.json({ content: generated });
  } catch (error) {
    console.error("Generate post error:", error);
    return res.status(500).json({ message: "Server error" });
  }
});

/**
 * PUT /posts/:id
 * Update a post (only author can edit)
 */
router.put("/:id", auth, async (req, res) => {
  try {
    const { id } = req.params;
    const { content } = req.body;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ message: "Invalid post id" });
    }

    if (!content || !content.trim()) {
      return res.status(400).json({ message: "Post content is required" });
    }

    const post = await Post.findById(id);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    if (post.author.toString() !== req.user.id) {
      return res.status(403).json({ message: "You can only edit your own posts" });
    }

    post.content = content.trim();
    await post.save();

    const populated = await post.populate("author", "name email avatarUrl");
    return res.json(populated);
  } catch (error) {
    console.error("Update post error:", error);
    return res.status(500).json({ message: "Server error" });
  }
});

/**
 * DELETE /posts/:id
 * Delete a post (only author can delete)
 */
router.delete("/:id", auth, async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ message: "Invalid post id" });
    }

    const post = await Post.findById(id);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    if (post.author.toString() !== req.user.id) {
      return res.status(403).json({ message: "You can only delete your own posts" });
    }

    await Post.findByIdAndDelete(id);

    return res.json({ message: "Post deleted successfully", _id: id });
  } catch (error) {
    console.error("Delete post error:", error);
    return res.status(500).json({ message: "Server error" });
  }
});

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

// Search users by name or email
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

// Get my profile
router.get("/me", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json(publicUser(user));
  } catch (e) {
    res.status(500).json({ message: "Server error" });
  }
});

// Update my profile
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

// Get public profile by id
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
    res.status(500).json({ message: "Server error" });
  }
});

// Get posts by user id
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
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;