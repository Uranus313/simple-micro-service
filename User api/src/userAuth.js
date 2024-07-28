import jwt from "jsonwebtoken";
import { getUsers } from "./userCRUD.js";
export async function auth(req,res,next){
    const token = req.header("x-auth-token");
    if(!token){
        return res.status(401).send("access denied. no token provided.");
    }
    try {
        const decoded = jwt.verify(token,process.env.JWTSECRET);
        req.userId = decoded._id;
        const user = await getUsers(req.userId);
        if(!user){
            return res.status(401).send("access denied. invalid user.");
        }
        req.user = user;
        next();
    } catch (error) {
        res.status(400).send("invalid token");
    }
}