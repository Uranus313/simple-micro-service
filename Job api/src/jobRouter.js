import express from "express"
import { acceptFreelancer, addCandidate, deleteJob, endJob, getFreelanceJobs, getJobs, getPostedJobs, saveJob, updateJob } from "./jobCRUD.js";
import { validateJobAccept , validateJobPost , validateJobChangeInfo } from "./jobModel.js";
import validateId from "./validateId.js";
import { auth } from "./userAuth.js";
import { checkJob } from "./checkJob.js";


const router = express.Router();

router.get("/allJobs", async (req, res) =>{
    try {
        const jobs = await getJobs();
        res.send(jobs);
    } catch (err) {
        console.log("Error",err);
        res.status(500).send("internal server error");
    }
});
router.get("/allJobs/:id", async (req, res) =>{
    const {error} = validateId(req.params.id);
    if (error){
        res.status(400).send(error.details[0].message);
        return;
    } 
    try {
        const jobs = await getJobs(req.params.id);
        res.send(jobs);
    } catch (err) {
        console.log("Error",err);
        res.status(500).send("internal server error");
    }
});
router.get("/myPostedJobs/",auth, async (req, res) =>{
    try {
        const jobs = await getPostedJobs(req.user._id);
        res.send(jobs);
    } catch (err) {
        console.log("Error",err);
        res.status(500).send("internal server error");
    }
});

router.get("/myFreelanceJobs/",auth, async (req, res) =>{
    try {
        const jobs = await getFreelanceJobs(req.user._id);
        res.send(jobs);
    } catch (err) {
        console.log("Error",err);
        res.status(500).send("internal server error");
    }
});

router.post("/",auth, async (req, res) =>{
    req.body.client = req.user._id;
    const {error} = validateJobPost(req.body);
    if (error){
        res.status(400).send(error.details[0].message);
        return;
    }
    try {
        const result = await saveJob(req.body);
        if (result.error){
            res.status(400).send(result.error);
            return;
        }
        res.send(result.response);
    } catch (err) {
        console.log("Error",err);
        res.status(500).send("internal server error");
    }
});


router.put("/changeInfo/:id",auth,checkJob,  async (req, res) =>{
    const {error} = validateJobChangeInfo(req.body); 
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
        const result = await updateJob(req.params.id,req.user._id,req.body);
        if (result.error){
            res.status(400).send(result.error);
            return;
        }
        res.send(result.response);
    } catch (err) {
        console.log("Error",err);
        res.status(500).send("internal server error");
    }
});


router.put("/finishJob/:id",auth,checkJob,  async (req, res) =>{
    const {error : e} = validateId(req.params.id);
    if (e){
        res.status(400).send(e.details[0].message);
        return;
    } 
    try {
        const result = await endJob(req.params.id,req.user._id);
        if (result.error){
            res.status(400).send(result.error);
            return;
        }
        res.send(result.response);
    } catch (err) {
        console.log("Error",err);
        res.status(500).send("internal server error");
    }
});

router.put("/addCandidate/:id",auth,checkJob,  async (req, res) =>{
    const {error : e} = validateId(req.params.id);
    if (e){
        res.status(400).send(e.details[0].message);
        return;
    } 
    try {
        const result = await addCandidate(req.params.id,req.user._id);
        if (result.error){
            res.status(400).send(result.error);
            return;
        }
        res.send(result.response);
    } catch (err) {
        console.log("Error",err);
        res.status(500).send("internal server error");
    }
});

router.put("/acceptCandidate/:id",auth,checkJob,  async (req, res) =>{
    const {error} = validateJobAccept(req.body); 
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
        const result = await acceptFreelancer(req.params.id,req.user._id,req.body);
        if (result.error){
            res.status(400).send(result.error);
            return;
        }
        res.send(result.response);
    } catch (err) {
        console.log("Error",err);
        res.status(500).send("internal server error");
    }
});

router.delete("/:id",auth,checkJob,  async (req, res) =>{
    const {error} = validateId(req.params.id);
    if (error){
        res.status(400).send(error.details[0].message);
        return;
    } 
    try {
        const result = await deleteJob(req.params.id, req.user._id);
        res.send(result);
    } catch (err) {
        console.log("Error",err);
        res.status(500).send("internal server error");
    }
});


export default router;