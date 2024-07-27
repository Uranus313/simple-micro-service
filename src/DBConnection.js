import mongoose from "mongoose";
export default function(){
    const username = process.env.MONGO_USERNAME;
    const password = process.env.MONGO_PASSWORD;
    let databaseLink = process.env.DATABASE_LINK;
    databaseLink += "/sms"; 
    mongoose.connect(databaseLink,{
        user: username,
        pass: password
    }).then(() => console.log("connected")).catch(err => console.log(err));
}
