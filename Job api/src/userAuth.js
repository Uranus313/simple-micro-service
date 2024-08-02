import jwt from "jsonwebtoken";
import { endLogger } from "./loggerstarter.js";
export async function auth(req,res,next){
    const token = req.header("x-auth-token");
    if(!token){
        res.status(401).send("access denied. no token provided.");
        res.body = "access denied. no token provided.";
        endLogger(req,res);
        return;
    }
    try {
        const decoded = jwt.verify(token,process.env.JWTSECRET);
        const result = await fetch("http://simplemicroservice:3000/users/allUsers/"+decoded._id)
        const user = await result.json();
        if(!user._id){
            res.status(401).send("access denied. invalid user.");
            res.body = "access denied. invalid user.";
            endLogger(req,res);
            return
        }
        req.user = user;
        next();
    } catch (error) {
        console.log(error);
        res.status(400).send("invalid token");
        res.body = "invalid token";
        endLogger(req,res);
    }
}