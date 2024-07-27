import express from "express"
import { deleteUser, getUsers, saveUser, updateUser } from "./userCRUD.js";
import { validateUserPut,validateUserPost } from "./userModel.js";
import validateId from "./validateId.js";
const router = express.Router();

router.get("/", async (req, res) =>{
    try {
        const jobs = await getUsers();
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
        res.send(result);
    } catch (err) {
        console.log("Error",err);
        res.status(500).send("internal server error");
    }
});


router.put("/:id",  async (req, res) =>{
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
    try {
        const result = await updateUser(req.params.id,req.body);
        res.send(result);
    } catch (err) {
        console.log("Error",err);
        res.status(500).send("internal server error");
    }
});

router.delete("/:id",  async (req, res) =>{
    const {error} = validateId(req.params.id);
    if (error){
        res.status(400).send(error.details[0].message);
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


router.post("/logIn",  async (req, res) =>{
    const {error} = validateUserPost(req.body); 
    if (error){
        res.status(400).send(error.details[0].message);
        return;
    }
    try {
        const result = await saveUser(req.body);
        res.send(result);
    } catch (err) {
        console.log("Error",err);
        res.status(500).send("internal server error");
    }
});

export default router;