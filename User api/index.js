import express from "express";
import userRouter from "./src/userRouter.js";
import DBConnection from "./src/DBConnection.js";
import cors from "cors";
DBConnection();
const app = express();
const port = process.env.PORT || 3000;


app.get("/",(req,res) => {
    res.send("hello world");
});
app.use(cors());
app.use(express.json());
app.use("/users",userRouter);
app.listen(port, () =>{
    console.log("server is running on port "+port);
});