const express = require("express");
const mongoose= require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const hostelRoutes = require("./routes/hostelRoutes");
const bookingRoutes = require("./routes/bookingRoutes");
const authRoutes = require("./routes/authRoutes");



dotenv.config();
connectDB();

const app = express();

app.use(cors());
app.use(express.json());
app.use("/hostels", hostelRoutes);
app.use("/auth", authRoutes);
app.use("/bookings", bookingRoutes);


app.get('/',(req,res)=>{
   res.send("API running successfully");
});


const PORT = process.env.PORT || 4003;

app.listen(PORT,()=>{
  console.log(`Server running on port ${PORT}`);
});



