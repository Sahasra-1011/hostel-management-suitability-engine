const express = require("express");
const Booking = require("../models/Booking");
const Hostel = require("../models/Hostel");
const authMiddleware = require("../middleware/authMiddleware");
const User = require("../models/User");



const router = express.Router();

/* CREATE BOOKING */
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { hostelId } = req.body;

    const hostel = await Hostel.findById(hostelId);
    if (!hostel)
      return res.status(404).json({ message: "Hostel not found" });

    if (hostel.availableBeds <= 0)
      return res.status(400).json({ message: "No beds available" });

    // ✅ Create booking
    const booking = await Booking.create({
      hostelId,
      userId: req.user.id,
    });

    // ✅ Reduce available beds
    hostel.availableBeds -= 1;
    await hostel.save();

    // 🌱 UPDATE USER PREFERENCES
    const user = await User.findById(req.user.id);

    if (user) {
      // City preference
      const cityCount = user.preferences.cities.get(hostel.city) || 0;
      user.preferences.cities.set(hostel.city, cityCount + 2);

      // Facilities preference
      hostel.facilities.forEach((facility) => {
        const count = user.preferences.facilities.get(facility) || 0;
        user.preferences.facilities.set(facility, count + 1);
      });

      // Budget preference
      if (!user.preferences.budget?.min) {
        user.preferences.budget = {
          min: hostel.price,
          max: hostel.price,
        };
      } else {
        user.preferences.budget.min = Math.min(
          user.preferences.budget.min,
          hostel.price
        );
        user.preferences.budget.max = Math.max(
          user.preferences.budget.max,
          hostel.price
        );
      }

      // Gender preference
      user.preferences.gender = hostel.gender;

      await user.save();
    }

    res.status(201).json({
      message: "Booking successful",
      booking,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Booking failed" });
  }
});


router.get("/", authMiddleware, async (req, res) => {
  try {
    const bookings = await Booking.find({ userId: req.user.id })
      .populate("hostelId", "name city price");

    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch bookings" });
  }
});

// CANCEL BOOKING
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    if (booking.userId.toString() !== req.user.id) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    const hostel = await Hostel.findById(booking.hostelId);
    if (hostel) {
      hostel.availableBeds += 1;
      await hostel.save();
    }

    await booking.deleteOne();

    res.status(200).json({ message: "Booking cancelled successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to cancel booking" });
  }
});



module.exports = router;
