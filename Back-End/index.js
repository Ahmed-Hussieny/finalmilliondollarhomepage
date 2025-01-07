import express from "express";
import { initiateApp } from "./src/initiate-app.js";
import cors from 'cors'
const app = express();
app.use(
  cors({
    origin: "*", // Allow all origins
  })
  );
initiateApp({app, express});

app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
});
