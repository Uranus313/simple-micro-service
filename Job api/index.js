import express from "express";
import jobRouter from "./src/jobRouter.js";
import DBConnection from "./src/DBConnection.js";
import winston from "winston";
import cors from "cors";
import { endLogger } from "./src/loggerstarter.js";
DBConnection();
const app = express();
const port = process.env.PORT || 3000;

// winston.add(new winston.transports.File({filename : "C:\\Users\\Hico\\Desktop\\smslogs\\jobs.log"}));
// app.get("/",(req,res) => {
//     res.send("hello world");
// });
app.use(cors());
app.use(express.json());
app.use("/jobs",jobRouter);
app.use(endLogger);
app.listen(port, () =>{
    console.log("server is running on port "+port);
});