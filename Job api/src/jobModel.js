import mongoose from "mongoose";
import Joi from "joi";
import joiObjectid from "joi-objectid";
Joi.objectId = joiObjectid(Joi);

const jobSchema = new mongoose.Schema({
    title: {type: String , required : true},
    client : {type : mongoose.Schema.Types.ObjectId , ref: "users" , required : true },
    candidates : [{type : mongoose.Schema.Types.ObjectId , ref: "users" }],
    freelancer : {type : mongoose.Schema.Types.ObjectId , ref: "users"},
    level : {type: String,enum: ["Entry" , "Junior" , "Intermediate" , "Expert", "Any"], required: true , default : "Any"},
    budget : {type: Number , required : true},
    isDone : {type: Boolean , required : true , default : false},
    isAccepted : {type: Boolean , required : true , default : false},
    description : {type: String , required : true},
    postDate : {type: Date , required : true , default : Date.now()},
    startDate : {type : Date},
    endDate : {type : Date}
});

export const JobModel = mongoose.model("jobs",jobSchema);

export function validateJobPost(job){
    const schema = Joi.object({
        title : Joi.string().min(3).max(50).required(),
        client : Joi.objectId().required(),
        level : Joi.string().valid("Entry" , "Junior" , "Intermediate" , "Expert"),
        budget : Joi.number().integer().positive().required(),
        description : Joi.string().min(50).max(2000).required()
    });
    return schema.validate(job);
}
export function validateJobAccept(job){
    const schema = Joi.object({
        freelancer : Joi.objectId().required(),
        startDate : Joi.date()
    });
    return schema.validate(job);
}
export function validateJobChangeInfo(job){
    const schema = Joi.object({
        title : Joi.string().min(3).max(50),
        level : Joi.string().valid("Entry" , "Junior" , "Intermediate" , "Expert", "Any"),
        budget : Joi.number().integer().positive(),
        description : Joi.string().min(50).max(2000),
        // candidates : Joi.array().items(Joi.objectId()),
        // freelancer : Joi.objectId(),
        isDone : Joi.boolean(),
        // isAccepted : Joi.boolean(),
        // startDate : Joi.date(),
        // endDate : Joi.date()
        }).min(1);
    return schema.validate(job);
}

