const mongoose = require("mongoose");
const MONGO_URI =
  "mongodb+srv://prerakjain:Prerak00@cluster0.jq2mab2.mongodb.net/?retryWrites=true&w=majority";

const connectDB = async () => {
  try {
    console.log(MONGO_URI);
    const conn = await mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(`MongoDB connected: ${conn.connection.host}`);
  } catch (err) {
    console.log(`Error: ${err.message}`);
    process.exit();
  }
};

module.exports = connectDB;
