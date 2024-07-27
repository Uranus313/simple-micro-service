import mongoose from "mongoose";
import Joi from "joi";
import joiObjectid from "joi-objectid";
Joi.objectId = joiObjectid(Joi);

const userSchema  = new mongoose.Schema(
    {

        username: {type: String , required : true},
        password: {type: String , required : true},
        firstName: {type: String , required : true},
        middleName: {type: String},
        lastName: {type: String , required : true},
        dateOfBirth: {type: Date, required: true},
        email: {type: String , required : true},
        phoneNumber: {type: Number , required : true},
        location:{
            country: {type: String , required : true},
            region: {type: String},
            city: {type: String}
        },
        // isAdmin : {type: Boolean , required : true , default: false},
        jobs : [{type : mongoose.Schema.Types.ObjectId , ref: "jobs" }]
    }
);

export const UserModel = mongoose.model("users",userSchema);



export function validateUserPost(user ){
    const schema = Joi.object({
        username : Joi.string().min(3).max(50).required(),
        password : Joi.string().min(8).max(100).required(),
        firstName : Joi.string().max(100).required(),
        middleName : Joi.string().max(100),
        lastName : Joi.string().max(100).required(),
        dateOfBirth : Joi.date().required(),
        email : Joi.string().email().required(),
        phoneNumber : Joi.number().positive().required(),
        location : Joi.object({
            country : Joi.string().min(3).max(50).required(),
            region : Joi.string().min(3).max(50),
            city : Joi.string().min(3).max(50),
        }).required()
    });
    return schema.validate(user);
}


export function validateUserPut(user ){
    const schema = Joi.object({
        username : Joi.string().min(3).max(50),
        password : Joi.string().min(8).max(100),
        firstName : Joi.string().max(100),
        middleName : Joi.string().max(100),
        lastName : Joi.string().max(100),
        dateOfBirth : Joi.date(),
        email : Joi.string().email(),
        phoneNumber : Joi.number().positive(),
        location : Joi.object({
            country : Joi.string().min(3).max(50).required(),
            region : Joi.string().min(3).max(50),
            city : Joi.string().min(3).max(50),
        }),
        jobs : Joi.array().items(Joi.objectId())
    }).min(1);
    return schema.validate(user);
}





