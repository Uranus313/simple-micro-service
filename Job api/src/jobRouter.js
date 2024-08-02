import express from "express"
import { acceptFreelancer, addCandidate, deleteJob, endJob, getFreelanceJobs, getJobs, getPostedJobs, saveJob, updateJob } from "./jobCRUD.js";
import { validateJobAccept , validateJobPost , validateJobChangeInfo } from "./jobModel.js";
import validateId from "./validateId.js";
import { auth } from "./userAuth.js";
import { checkJob } from "./checkJob.js";
import { LogModel } from "./loggerstarter.js";

const router = express.Router();

router.get("/allJobs", async (req, res,next) =>{
    try {
        const jobs = await getJobs();
        res.send(jobs);
        res.body = jobs;
    } catch (err) {
        console.log("Error",err);
        res.status(500).send("internal server error");
        res.body = "internal server error";
    }
    next();
});
router.get("/allJobs/:id", async (req, res,next) =>{
    const {error} = validateId(req.params.id);
    if (error){
        res.status(400).send(error.details[0].message);
        res.body = error.details[0].message; 
        next();
        return;
    } 
    try {
        const jobs = await getJobs(req.params.id);
        res.send(jobs);
        res.body = jobs;
    } catch (err) {
        console.log("Error",err);
        res.status(500).send("internal server error");
        res.body = "internal server error";
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
router.get("/myPostedJobs/",auth, async (req, res,next) =>{
    try {
        const jobs = await getPostedJobs(req.user._id);
        res.send(jobs);
        res.body = jobs;
    } catch (err) {
        console.log("Error",err);
        res.status(500).send("internal server error");
        res.body = "internal server error";
    }
    next();
});

router.get("/myFreelanceJobs/",auth, async (req, res,next) =>{
    try {
        const jobs = await getFreelanceJobs(req.user._id);
        res.send(jobs);
        res.body = jobs;
    } catch (err) {
        console.log("Error",err);
        res.status(500).send("internal server error");
        res.body = "internal server error";
    }
    next();
});

router.post("/",auth, async (req, res,next) =>{
    req.body.client = req.user._id;
    const {error} = validateJobPost(req.body);
    if (error){
        res.status(400).send(error.details[0].message);
        res.body = error.details[0].message; 
        next();
        return;
    }
    try {
        const result = await saveJob(req.body);
        if (result.error){
            res.status(400).send(result.error);
            res.body = result.error;
            next();
            return;
        }
        res.send(result.response);
        res.body = result.response;
    } catch (err) {
        console.log("Error",err);
        res.status(500).send("internal server error");
        res.body = "internal server error";
    }
    next();
});


router.put("/changeInfo/:id",auth,checkJob,  async (req, res,next) =>{
    const {error} = validateJobChangeInfo(req.body); 
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
    try {
        const result = await updateJob(req.params.id,req.user._id,req.body);
        if (result.error){
            res.status(400).send(result.error);
            res.body = result.error;
            next();
            return;
        }
        res.send(result.response);
        res.body = result.response;
    } catch (err) {
        console.log("Error",err);
        res.status(500).send("internal server error");
        res.body = "internal server error";
    }
    next();
});


router.put("/finishJob/:id",auth,checkJob,  async (req, res,next) =>{
    const {error : e} = validateId(req.params.id);
    if (e){
        res.status(400).send(e.details[0].message);
        res.body = e.details[0].message;
        next();
        return;
    } 
    try {
        const result = await endJob(req.params.id,req.user._id);
        if (result.error){
            res.status(400).send(result.error);
            res.body = result.error;
            next();
            return;
        }
        res.send(result.response);
        res.body = result.response;
    } catch (err) {
        console.log("Error",err);
        res.status(500).send("internal server error");
        res.body = "internal server error";
    }
    next();
});

router.put("/addCandidate/:id",auth,checkJob,  async (req, res,next) =>{
    const {error : e} = validateId(req.params.id);
    if (e){
        res.status(400).send(e.details[0].message);
        res.body = e.details[0].message;
        next();
        return;
    } 
    try {
        const result = await addCandidate(req.params.id,req.user._id);
        if (result.error){
            res.status(400).send(result.error);
            res.body = result.error;
            next();
            return;
        }
        res.send(result.response);
        res.body = result.response;
    } catch (err) {
        console.log("Error",err);
        res.status(500).send("internal server error");
        res.body = "internal server error";
    }
    next();
});

router.put("/acceptCandidate/:id",auth,checkJob,  async (req, res,next) =>{
    const {error} = validateJobAccept(req.body); 
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
    try {
        const result = await acceptFreelancer(req.params.id,req.user._id,req.body);
        if (result.error){
            res.status(400).send(result.error);
            res.body = result.error;
            next();
            return;
        }
        res.send(result.response);
        res.body = result.response;
    } catch (err) {
        console.log("Error",err);
        res.status(500).send("internal server error");
        res.body = "internal server error";
    }
    next();
});

router.delete("/:id",auth,checkJob,  async (req, res,next) =>{
    const {error} = validateId(req.params.id);
    if (error){
        res.status(400).send(error.details[0].message);
        res.body = error.details[0].message; 
        next();
        return;
    } 
    try {
        const result = await deleteJob(req.params.id, req.user._id);
        res.send(result);
        res.body = result;
    } catch (err) {
        console.log("Error",err);
        res.status(500).send("internal server error");
        res.body = "internal server error";
    }
    next();
});


export default router;