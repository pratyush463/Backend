import dotenv from "dotenv";
import connectDB from "./db/index.js";
import express from "express";
const app = express();

dotenv.config({
  path: "./env",
});

// (async () => {
//   try {
//     await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`);
//     app.on("error", (error) => {
//       console.log("ERROR:", error);
//       throw error;
//     });
//     app.listen(process.env.PORT, () => {
//       console.log(`App is listening on port : ${process.env.PORT}`);
//     });
//   } catch {
//     console.error("ERROR: ", error);
//   }
// })();

connectDB()
  .then(() => {
    app.on("error", (error) => {
      console.log("ERROR:", error);
      throw error;
    });
    app.listen(process.env.PORT || 8000, () => {
      console.log(`Server is running at port : ${process.env.PORT}`);
    });
  })
  .catch((error) => {
    console.log("MONGO  db connection failed", error);
  });
