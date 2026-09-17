const mongoose = require("mongoose");

const postSchema = new mongoose.Schema(
  {
    author: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    content: { type: String, required: true, maxlength: 2000 },
  },
  { timestamps: true }
);

// ✅ Makes sorting by newest faster
postSchema.index({ createdAt: -1 });

module.exports = mongoose.model("Post", postSchema);
