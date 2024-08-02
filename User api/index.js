import express from "express";
import userRouter from "./src/userRouter.js";
import DBConnection from "./src/DBConnection.js";
import cors from "cors";
import winston from "winston";
import {endLogger } from "./src/loggerstarter.js";
DBConnection();
const app = express();
const port = process.env.PORT || 3000;

// winston.add(new winston.transports.File({filename : "C:\\Users\\Hico\\Desktop\\smslogs\\users.log"}));
app.use(cors());
app.use(express.json());

app.get("/",(req,res,next) => {
    res.send("hello world");
    next();
});

app.use("/users",userRouter);
app.use(endLogger);
app.listen(port, () =>{
    console.log("server is running on port "+port);
});