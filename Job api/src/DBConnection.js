import mongoose from "mongoose";
export default function(){
    const username = process.env.MONGO_USERNAME;
    const password = process.env.MONGO_PASSWORD;
    const MONGO_HOST = process.env.MONGO_HOST || 'localhost'; // Default to localhost
    const MONGO_PORT = process.env.MONGO_PORT || 27017; // Default MongoDB port
    let dbURL = `mongodb://${username}:${password}@${MONGO_HOST}:${MONGO_PORT}`;
    if (!username){
        dbURL = `mongodb://${MONGO_HOST}:${MONGO_PORT}`;
    }
    dbURL += "/sms?authSource=admin"; 
    console.log(dbURL)
    mongoose.connect(dbURL).then(() => console.log("connected")).catch(err => console.log(err));
}
