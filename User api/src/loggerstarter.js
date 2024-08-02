import { response } from "express";
import winston from "winston";
import mongoose from "mongoose";
// export async function startLogger(req,res,next){
//     try {
//         // console.log(req);
//         console.log(req.url)
//         console.log(req.method)
//         console.log(req.body)
//         next();
//     } catch (error) {
//         res.status(500).send("something went wrong");
//     }
// }
export const LogModel = mongoose.model("userlogs",new mongoose.Schema({
    request_url : String,
    request_method : String,
    request_body : mongoose.Schema.Types.Mixed, 
    response_status : Number,
    response_body :  mongoose.Schema.Types.Mixed,
    time : {type : Date , default : Date.now}
}));
export async function endLogger(req,res){
    try {
        // console.log(res.req.url)
        // console.log(res.req.method)
        // console.log(res.req.body);
        // console.log(res.statusCode)
        // console.log(res.body)
        // winston.log("info",{
        //     request_url : res.req.url,
        //     request_method : res.req.method,
        //     request_body : res.req.body,
        //     response_status : res.statusCode,
        //     response_body : res.body
        // })
        const user = new LogModel({
                request_url : res.req.url,
                request_method : res.req.method,
                request_body : res.req.body,
                response_status : res.statusCode,
                response_body : res.body
            });
        user.save();
    } catch (error) {
        console.log("something went wrong",error);
    }
}