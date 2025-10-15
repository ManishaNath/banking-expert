const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const { MONGO_URI, MONGO_URL } = process.env;
    const mongoURI = (MONGO_URI || MONGO_URL || "").trim();

    if (!mongoURI) {
      throw new Error(
        "MongoDB connection string is not defined. Set the MONGO_URI or MONGO_URL environment variable."
      );
    }

    await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  } catch (error) {
    throw new Error("Failed to connect to MongoDB: " + error.message);
  }
};

module.exports = connectDB;
