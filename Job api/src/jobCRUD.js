import { JobModel } from "./jobModel.js";



export async function saveJob(jobCreate){
    const result = {};
    let pastJob = await JobModel.find({title : jobCreate.title ,client: jobCreate.client}).findOne();
    if(pastJob){
        result.error = "you already posted a job with the same title";
        return result;
    }
    const job = new JobModel(jobCreate);
    const response = await job.save();
    result.response = response.toJSON();
    return result;
}

export async function getJobs(id){
    if(id === undefined){
        const jobs = await JobModel.find();
        return jobs;
    }else{
        const job = await JobModel.find({_id : id}).findOne();
        return job;
    }
}
export async function getPostedJobs(userID){
    const jobs = await JobModel.find({client : userID});
    return jobs;
}

export async function getFreelanceJobs(userID){
    const jobs = await JobModel.find({freelance : userID});
    return jobs;
}



export async function deleteJob(jobId , clientID){
    const result = {};
    const job = await JobModel.find({_id : jobId ,client: clientID}).findOne();
    if(!job){
        result.error = "you can't delete a job you don't own";
        return result;
    }
    const response = await JobModel.deleteOne({_id : id});
    result.response = response;
    return result;
}

export async function updateJob(jobId , clientID, jobUpdate ){
    const result = {};
    const job = await JobModel.find({_id : jobId ,client: clientID}).findOne();
    if(!job){
        result.error = "you can't change a job you don't own";
        return result;
    }
    if(job.isDone){
        result.error = "this job is already finished";
        return result;
    }
    const response = await JobModel.findByIdAndUpdate(jobId,{$set :jobUpdate},{new : true});
    result.response = response.toJSON();
    return(result);
}

export async function endJob(jobId , clientID){
    const result = {};
    const job = await JobModel.find({_id : jobId ,client: clientID}).findOne();
    if(!job){
        result.error = "you can't finish a job you don't own";
        return result;
    }
    if(job.isDone){
        result.error = "this job is already finished";
        return result;
    }
    const response = await JobModel.findByIdAndUpdate(jobId,{$set :
        { 
            isDone : true,
            endDate : Date.now()
        }
    },{new : true});
    result.response = response.toJSON();
    return(result);
}

export async function acceptFreelancer(jobId , clientID, acceptJob){
    const result = {};
    const job = await JobModel.find({_id : jobId ,client: clientID}).findOne();
    
    if(!job){
        result.error = "you don't own this job";
        return result;
    }
    if(job.isDone){
        result.error = "this job is already finished";
        return result;
    }
    if(!job.candidates.includes(acceptJob.freelancer)){
        result.error = "this freelancer is not listed for this job";
        return result;
    }
    if(acceptJob.startDate && new Date(acceptJob.startDate) < Date.now()){
        result.error = "start date must be in the future";
        return result;
    }
    const response = await JobModel.findByIdAndUpdate(jobId,{$set :
        { 
            isAccepted : true,
            startDate :  acceptJob.startDate? acceptJob.startDate : Date.now(),
            freelancer : acceptJob.freelancer
        }
    },{new : true});
    result.response = response.toJSON();
    return(result);
}

export async function addCandidate(jobId , freelancerID){
    const result = {};
    const job = await JobModel.find({_id : jobId}).findOne();
    if(job.isDone){
        result.error = "this job is already finished";
        return result;
    }
    if(job.client == freelancerID){
        result.error = "you own this job";
        return result;
    }
    if(job.candidates.includes(freelancerID)){
        result.error = "this freelancer is already in the list";
        return result;
    }
    const response = await JobModel.findByIdAndUpdate(jobId,{$push :
        { 
            candidates : freelancerID
        }
    },{new : true});
    result.response = response.toJSON();
    return(result);
}



