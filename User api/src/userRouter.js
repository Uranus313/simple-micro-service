import express from "express"
import { deleteUser, getUsers, logIn, saveUser, updateUser } from "./userCRUD.js";
import { validateUserPut,validateUserPost, validateUserLogIn } from "./userModel.js";
import validateId from "./validateId.js";
import jwt from "jsonwebtoken";
import { auth } from "./userAuth.js";
import { LogModel } from "./loggerstarter.js";

const router = express.Router();

router.get("/allUsers", async (req, res,next) =>{
    try {
        const users = await getUsers();
        res.body = users;
        res.send(users);
    } catch (err) {
        console.log("Error",err);
        res.body = "internal server error";
        res.status(500).send("internal server error");
    }
    next();
});
router.get("/logs", async (req,res) =>{
    try {
        const users = await LogModel.find().sort({time : -1});
        res.send(users);
    } catch (err) {
        console.log("Error",err);
        res.body = "internal server error";
        res.status(500).send("internal server error");
    }
})
router.get("/allusers/:id", async (req, res, next) =>{
    const {error} = validateId(req.params.id);
    if (error){
        res.status(400).send(error.details[0].message);
        res.body = error.details[0].message;
        next();
        return;
    } 
    try {
        const user = await getUsers(req.params.id);
        res.body = user;
        res.send(user);
    } catch (err) {
        console.log("Error",err);
        res.body = "internal server error";
        res.status(500).send("internal server error");
    }
    next();
});

router.post("/",  async (req, res, next) =>{
    const {error} = validateUserPost(req.body); 
    if (error){
        res.status(400).send(error.details[0].message);
        res.body = error.details[0].message;
        next();
        return;
    }
    try {
        const result = await saveUser(req.body);
        if (result.error){
            res.status(400).send(result.error);
            res.body = result.error;
            next();
            return;
        }


        const token = jwt.sign(result.response,process.env.JWTSECRET);
        res.header("x-auth-token",token).send(result.response);
        res.body = result.response;
    } catch (err) {
        console.log("Error",err);
        res.body = "internal server error";
        res.status(500).send("internal server error");
    }
    next();
});


router.put("/:id",auth,  async (req, res, next) =>{
    const {error} = validateUserPut(req.body); 
    if (error){
        res.status(400).send(error.details[0].message);
        res.body = error.details[0].message;
        next();
        return;
    }
    const {error : e} = validateId(req.params.id);
    if (e){
        res.status(400).send(e.details[0].message);
        res.body = e.details[0].message;
        next();
        return;
    } 
    if(req.params.id != req.user._id){
        res.status(400).send("you can not change another user's account");
        res.body = "you can not change another user's account";
        next();
        return;
    }

    try {
        const result = await updateUser(req.params.id,req.body);
        if (result.error){
            res.status(400).send(result.error);
            res.body = result.error;
            next();
            return;
        }
        const token = jwt.sign(result.response,process.env.JWTSECRET);
        res.header("x-auth-token",token).send(result.response);
        res.body = result.response;
    } catch (err) {
        console.log("Error",err);
        res.body = "internal server error";
        res.status(500).send("internal server error");
    }
    next();
});

router.delete("/:id",auth,  async (req, res, next) =>{
    const {error} = validateId(req.params.id);
    if (error){
        res.status(400).send(error.details[0].message);
        res.body = error.details[0].message;
        next();
        return;
    } 
    if(req.params.id != req.user._id){
        res.status(400).send("you can not delete another user's account");
        res.body = "you can not delete another user's account";
        next();
        return;
    }
    try {
        const result = await deleteUser(req.params.id);
        res.send(result);
        res.body = result;
    } catch (err) {
        console.log("Error",err);
        res.body = "internal server error";
        res.status(500).send("internal server error");
    }
    next();
});

router.get("/checkToken", async (req,res) =>{
    try {
        res.send(req.user);
        res.body = req.user;
    } catch (err) {
        console.log("Error",err);
        res.body = "internal server error";
        res.status(500).send("internal server error");
    }
})

router.post("/logIn",  async (req, res, next) =>{
    const {error} = validateUserLogIn(req.body); 
    if (error){
        res.status(400).send(error.details[0].message);
        res.body = error.details[0].message;
        next();
        return;
    }
    try {
        const result = await logIn(req.body.username, req.body.password);
        if (result.error){
            res.status(400).send(result.error);
            res.body = result.error;
            next();
            return;
        }
        const token = jwt.sign(result.response,process.env.JWTSECRET);
        console.log(token);
        res.header("x-auth-token",token).send(result.response);
        res.body = result.response;
    } catch (err) {
        console.log("Error",err);
        res.body = "internal server error";
        res.status(500).send("internal server error");
    }
    next();
});

export default router;