import { comparePassword, hashPassword } from "./hashing.js";
import { UserModel } from "./userModel.js";



export async function saveUser(userCreate){
    const result = {};
    let pastUser = await UserModel.find({username : userCreate.username}).findOne();
    if(pastUser){
        result.error = "username already exists";
        return result;
    }
    pastUser = await UserModel.find({email : userCreate.email}).findOne();
    if(pastUser){
        result.error = "email already exists";
        return result;
    }
    userCreate.password = await hashPassword(userCreate.password);
    const user = new UserModel(userCreate);
    const response = await user.save();
    result.response = response.toJSON();
    return result;
}

export async function getUsers(id){
    if(id === undefined){
        const users = await UserModel.find();
        return users;
    }else{
        const user = await UserModel.find({_id : id}).findOne();
        return user;
    }
}
//unique email and username
export async function logIn(username , password){
    const result = {};
    const user = await UserModel.find({username : username}).findOne();
    if(!user){
        result.error = "no user with this username exists";
        return result;
    }
    const passwordCheck = await comparePassword(password , user.password);
    if(!passwordCheck){
        result.error = "wrong password";
        return result;
    }
    result.response = user.toJSON();
    return result;
}
export async function deleteUser(id){
    const result = await UserModel.deleteOne({_id : id});
    return result;
}

export async function updateUser(id,userUpdate ){
    const result = {};
    let pastUser = null;
    if(userUpdate.username){
        pastUser = await UserModel.find({username : userUpdate.username}).findOne();
        if(pastUser){
            result.error = "username already exists";
            return result;
        }
    }
    if(userUpdate.email){
        pastUser = await UserModel.find({email : userUpdate.email}).findOne();
        if(pastUser){
            result.error = "email already exists";
            return result;
        }
    }
    if(userUpdate.password){
        userUpdate.password = await hashPassword(userUpdate.password);
    }
    if(userUpdate.password){
        userUpdate.password = await hashPassword(userUpdate.password);
    }
    const response = await UserModel.findByIdAndUpdate(id,{$set :userUpdate},{new : true});
    result.response = response.toJSON();
    return(result);
}

