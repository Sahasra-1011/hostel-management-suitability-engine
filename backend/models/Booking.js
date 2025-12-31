const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(
  {
    hostelId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Hostel",
      required: true,
    },
    userId: {
      type: String, 
      default: "guest",
    },
    bookingDate: {
      type: Date,
      default: Date.now,
    },
    status: {
      type: String,
      default: "confirmed",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Booking", bookingSchema);
