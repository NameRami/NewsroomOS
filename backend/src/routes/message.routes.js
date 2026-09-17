const express = require("express");
const mongoose = require("mongoose");
const Message = require("../models/Message");
const auth = require("../middleware/auth.middleware");

const router = express.Router();

// Send message
router.post("/", auth, async (req, res) => {
  try {
    const { to, body } = req.body;
    if (!to || !mongoose.isValidObjectId(to)) {
      return res.status(400).json({ message: "Valid recipient user id (to) is required" });
    }
    if (!body || !body.trim()) {
      return res.status(400).json({ message: "Message body is required" });
    }

    const msg = await Message.create({
      from: req.user.id,
      to,
      body: body.trim(),
    });

    const populated = await msg.populate([
      { path: "from", select: "name email" },
      { path: "to", select: "name email" },
    ]);

    res.status(201).json(populated);
  } catch (e) {
    res.status(500).json({ message: "Server error" });
  }
});
// List conversation threads (users I've chatted with + last message)
router.get("/threads", auth, async (req, res) => {
  try {
    const me = new mongoose.Types.ObjectId(req.user.id);

    const threads = await Message.aggregate([
      // only messages where I'm either sender or receiver
      {
        $match: {
          $or: [{ from: me }, { to: me }],
        },
      },

      // newest first so $first gives last message
      { $sort: { createdAt: -1 } },

      // compute "otherUser" (the person I'm talking to)
      {
        $addFields: {
          otherUser: {
            $cond: [{ $eq: ["$from", me] }, "$to", "$from"],
          },
        },
      },

      // group by otherUser, keep the newest message as "lastMessage"
      {
        $group: {
          _id: "$otherUser",
          lastMessage: { $first: "$$ROOT" },
        },
      },

      // sort threads by last message time
      { $sort: { "lastMessage.createdAt": -1 } },

      // join user info
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "user",
        },
      },
      { $unwind: "$user" },

      // shape response
      {
        $project: {
          _id: 0,
          user: { _id: "$user._id", name: "$user.name", email: "$user.email" },
          lastMessage: {
            _id: "$lastMessage._id",
            body: "$lastMessage.body",
            from: "$lastMessage.from",
            to: "$lastMessage.to",
            createdAt: "$lastMessage.createdAt",
          },
        },
      },
    ]);

    res.json(threads);
  } catch (e) {
    console.error("threads error", e);
    res.status(500).json({ message: "Server error" });
  }
});

// Inbox (latest messages to me)
router.get("/inbox", auth, async (req, res) => {
  try {
    const msgs = await Message.find({ to: req.user.id })
      .populate("from", "name email")
      .sort({ createdAt: -1 })
      .limit(100);

    res.json(msgs);
  } catch (e) {
    res.status(500).json({ message: "Server error" });
  }
});

// Conversation with a specific user
router.get("/with/:userId", auth, async (req, res) => {
  try {
    const other = req.params.userId;
    if (!mongoose.isValidObjectId(other)) {
      return res.status(400).json({ message: "Invalid user id" });
    }

    const msgs = await Message.find({
      $or: [
        { from: req.user.id, to: other },
        { from: other, to: req.user.id },
      ],
    })
      .populate("from", "name email")
      .populate("to", "name email")
      .sort({ createdAt: 1 })
      .limit(200);

    res.json(msgs);
  } catch (e) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
