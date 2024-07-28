import { getJobs } from "./jobCRUD.js";
import validateId from "./validateId.js";

export async function checkJob(req,res,next){
    try {
        const {error} = validateId(req.params.id);
        if (error){
            res.status(400).send(error.details[0].message);
            return;
        } 
        const job = await getJobs(req.params.id)
        if(!job){
            return res.status(404).send("job not found");
        }
        next();
    } catch (error) {
        res.status(400).send("invalid job");
    }
}