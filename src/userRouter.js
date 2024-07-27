import express from "express"
import { deleteUser, getUsers, logIn, saveUser, updateUser } from "./userCRUD.js";
import { validateUserPut,validateUserPost, validateUserLogIn } from "./userModel.js";
import validateId from "./validateId.js";
import jwt from "jsonwebtoken";
import { auth } from "./userAuth.js";

const router = express.Router();

router.get("/", async (req, res) =>{
    try {
        const jobs = await getUsers();
        const token = jwt.sign(jobs,process.env.JWTSECRET);

        res.header("x-auth-token",token).send(jobs.response);

        res.send(jobs);
    } catch (err) {
        console.log("Error",err);
        res.status(500).send("internal server error");
    }
});

router.get("/:id", async (req, res) =>{
    const {error} = validateId(req.params.id);
    if (error){
        res.status(400).send(error.details[0].message);
        return;
    } 
    try {
        const jobs = await getUsers(req.params.id);
        res.send(jobs);
    } catch (err) {
        console.log("Error",err);
        res.status(500).send("internal server error");
    }
});

router.post("/",  async (req, res) =>{
    const {error} = validateUserPost(req.body); 
    if (error){
        res.status(400).send(error.details[0].message);
        return;
    }
    try {
        const result = await saveUser(req.body);
        if (result.error){
            res.status(400).send(result.error);
            return;
        }


        const token = jwt.sign(result.response,process.env.JWTSECRET);
        res.header("x-auth-token",token).send(result.response);
    } catch (err) {
        console.log("Error",err);
        res.status(500).send("internal server error");
    }
});


router.put("/:id",auth,  async (req, res) =>{
    const {error} = validateUserPut(req.body); 
    if (error){
        res.status(400).send(error.details[0].message);
        return;
    }
    const {error : e} = validateId(req.params.id);
    if (e){
        res.status(400).send(e.details[0].message);
        return;
    } 
    if(req.params.id != req.user._id){
        res.status(400).send("you can not change another user's account");
        return;
    }

    try {
        const result = await updateUser(req.params.id,req.body);
        if (result.error){
            res.status(400).send(result.error);
            return;
        }
        const token = jwt.sign(result.response,process.env.JWTSECRET);
        res.header("x-auth-token",token).send(result.response);
    } catch (err) {
        console.log("Error",err);
        res.status(500).send("internal server error");
    }
});

router.delete("/:id",auth,  async (req, res) =>{
    const {error} = validateId(req.params.id);
    if (error){
        res.status(400).send(error.details[0].message);
        return;
    } 
    if(req.params.id != req.user._id){
        res.status(400).send("you can not delete another user's account");
        return;
    }
    try {
        const result = await deleteUser(req.params.id);
        res.send(result);
    } catch (err) {
        console.log("Error",err);
        res.status(500).send("internal server error");
    }
});

router.get("/checkToken", async (req,res) =>{
    try {
        res.send(req.user);
    } catch (err) {
        console.log("Error",err);
        res.status(500).send("internal server error");
    }
})

router.post("/logIn",  async (req, res) =>{
    const {error} = validateUserLogIn(req.body); 
    if (error){
        res.status(400).send(error.details[0].message);
        return;
    }
    try {
        const result = await logIn(req.body.username, req.body.password);
        if (result.error){
            res.status(400).send(result.error);
            return;
        }
        const token = jwt.sign(result.response,process.env.JWTSECRET);
        console.log(token);
        res.header("x-auth-token",token).send(result.response);
    } catch (err) {
        console.log("Error",err);
        res.status(500).send("internal server error");
    }
});

export default router;