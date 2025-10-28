const mongoose = require('mongoose');

const connectDB = async () => {
  try {
  const conn = await mongoose.connect('mongodb+srv://amarnath10kct:Amarnath8667@cluster0.my8jqd8.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
