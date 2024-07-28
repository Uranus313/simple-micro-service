import express from "express";
import jobRouter from "./src/jobRouter.js";
import DBConnection from "./src/DBConnection.js";
import cors from "cors";
DBConnection();
const app = express();
const port = process.env.PORT || 3001;


app.get("/",(req,res) => {
    res.send("hello world");
});
app.use(cors());
app.use(express.json());
app.use("/jobs",jobRouter);
app.listen(port, () =>{
    console.log("server is running on port "+port);
});