const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 120 },
    email: { type: String, required: true, unique: true, trim: true, lowercase: true },
    password: { type: String, required: true },

    bio: { type: String, default: "", maxlength: 500 },
    avatarUrl: { type: String, default: "", maxlength: 500 },
    location: { type: String, default: "", maxlength: 120 },
    website: { type: String, default: "", maxlength: 300 },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);