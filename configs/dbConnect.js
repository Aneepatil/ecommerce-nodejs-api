import mongoose from "mongoose";

export const dbConnect = async (req,res) => {
  try {
    const connected = await mongoose.connect(process.env.MONGO_URL);
    console.log(`mongoDB Connected ${connected.connection.host}`);
  } catch (error) {
    console.log("Error",error.message)
    process.exit(1);
  }
};
