import mongoose from "mongoose";

let isConnected = false;

export const connectMongo = async () => {
  mongoose.set("strictQuery", true);
  if (isConnected) {
    console.log("MongoDB is already connected");
  }
  try {
    await mongoose.connect(process.env.MONGO_URL, {
        dbName: "trello",
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }
    );
    isConnected = true;
    console.log("MongoDB connected");
  } catch (error) {
    console.log(error);
  }
};
