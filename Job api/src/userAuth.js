import jwt from "jsonwebtoken";
export async function auth(req,res,next){
    const token = req.header("x-auth-token");
    if(!token){
        return res.status(401).send("access denied. no token provided.");
    }
    try {
        const decoded = jwt.verify(token,process.env.JWTSECRET);
        const result = await fetch("http://simplemicroservice:3000/users/"+decoded._id)
        const user = await result.json();
        console.log(user)
        if(!user._id){
            return res.status(401).send("access denied. invalid user.");
        }
        req.user = user;
        next();
    } catch (error) {
        console.log(error);
        res.status(400).send("invalid token");
    }
}