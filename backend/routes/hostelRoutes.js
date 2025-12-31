const express = require("express");
const Hostel = require("../models/Hostel");
const User = require("../models/User");
const calculateSuitabilityScore = require("../utils/suitability");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

/* ================================
   GET RECOMMENDED HOSTELS (MUST BE FIRST)
================================ */
router.get("/recommended", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const hostels = await Hostel.find();

    const ranked = hostels.map((hostel) => {
      const suitability = calculateSuitabilityScore(user, hostel);
      return {
        ...hostel.toObject(),
        suitability,
      };
    });

    ranked.sort((a, b) => b.suitability.score - a.suitability.score);

    res.status(200).json(ranked);
  } catch (error) {
    console.error("Recommendation error:", error);
    res.status(500).json({ message: "Failed to fetch recommendations" });
  }
});

/* ================================
   GET ALL HOSTELS (OPTIONAL CITY FILTER)
================================ */
router.get("/", async (req, res) => {
  try {
    const { city } = req.query;
    const hostels = city
      ? await Hostel.find({ city })
      : await Hostel.find();

    res.status(200).json(hostels);
  } catch (error) {
    console.error("Error fetching hostels:", error);
    res.status(500).json({ message: "Server error" });
  }
});

/* ================================
   CREATE HOSTEL
================================ */
router.post("/", async (req, res) => {
  try {
    const hostel = new Hostel(req.body);
    const savedHostel = await hostel.save();
    res.status(201).json(savedHostel);
  } catch (error) {
    console.error("Error creating hostel:", error);
    res.status(400).json({ message: "Invalid hostel data" });
  }
});

/* ================================
   GET HOSTEL BY ID (KEEP THIS LAST)
================================ */
router.get("/:id", async (req, res) => {
  try {
    const hostel = await Hostel.findById(req.params.id);
    if (!hostel) {
      return res.status(404).json({ message: "Hostel not found" });
    }
    res.json(hostel);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch hostel" });
  }
});


module.exports = router;
