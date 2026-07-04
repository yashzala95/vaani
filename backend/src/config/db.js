// ==============================================
// MongoDB Database Connection
// Agar MONGO_URI nahi diya hai to app bina DB ke
// bhi chal jayega (in-memory / file-based mode)
// ==============================================

const mongoose = require("mongoose");

const connectDB = async () => {
  // Agar user ne Mongo URI nahi diya, DB skip karo (optional hai)
  if (!process.env.MONGO_URI) {
    console.log("⚠️  MONGO_URI not set — running without database.");
    return;
  }

  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ MongoDB connected successfully");
  } catch (error) {
    console.error("❌ MongoDB connection failed:", error.message);
    console.log("⚠️  Continuing without database...");
    // Hum process ko exit nahi kar rahe kyunki DB optional hai
  }
};

module.exports = connectDB;
