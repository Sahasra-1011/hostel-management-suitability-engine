const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },

    // 🌱 Preferences for Suitability Score
    preferences: {
      cities: {
        type: Map,
        of: Number,
        default: {},
      },
      facilities: {
        type: Map,
        of: Number,
        default: {},
      },
      budget: {
        min: {
          type: Number,
        },
        max: {
          type: Number,
        },
      },
      gender: {
        type: String,
      },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
