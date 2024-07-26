import mongoose from "mongoose";

const userSchema  = new mongoose.Schema(
    {

        username: {type: String , required : true},
        password: {type: String , required : true},
        firstname: {type: String , required : true},
        middlename: {type: String},
        lastname: {type: String , required : true},
        dateOfBirth: {type: Date, required: true},
        email: {type: String , required : true},
        phoneNumber: {type: Number , required : true},
        location:{
            country: {type: String , required : true},
            region: {type: String},
            city: {type: String}
        },
        jobs : [{type : mongoose.Schema.Types.ObjectId , ref: "jobs" }]
    }
);

export const UserModel = mongoose.model("users",userSchema);