import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    const connect = await mongoose.connect(process.env.MONGO_URI)
    console.log(`MongoDB connected Successfully`)
  } catch (error) {
    console.log(`Unable to connect with MongoDB: `, error.message)
  }
}