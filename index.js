const express = require("express");
const app = express();
const port = process.env.PORT || 3000;


app.get("/",(req,res) => {
    res.send("hello worlds oooo");
});
app.listen(port, () =>{
    console.log("server is running on portoooo "+port);
});