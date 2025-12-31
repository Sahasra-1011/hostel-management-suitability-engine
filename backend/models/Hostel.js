const mongoose = require("mongoose");

const hostelSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
    address: {
      type: String,
    },
    price: {
      type: Number,
      required: true,
    },
    facilities: {
      type: [String],
    },
    gender: {
      type: String,
      enum: ["Boys", "Girls", "Co-ed"],
    },
    totalBeds: {
      type: Number,
    },
    availableBeds: {
      type: Number,
    },
    ownerName: {
  type: String,
},

phone: {
  type: String,
},

images: {
  type: [String], // array of image URLs
},

foodMenu: {
  type: Map,
  of: String,
},

rules: {
  type: [String],
},

checkInTime: {
  type: String,
},

checkOutTime: {
  type: String,
},

location: {
  lat: {
    type: Number,
  },
  lng: {
    type: Number,
  },
},

  },
  {
    timestamps: true,
  }
  
);

module.exports = mongoose.model("Hostel", hostelSchema);