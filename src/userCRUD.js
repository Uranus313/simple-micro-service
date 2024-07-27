import { UserModel } from "./userModel.js";
export async function saveUser(userCreate){
    const user = new UserModel(userCreate);
    const result = await user.save();
    return result;
}

export async function getUsers(id){
    if(id === undefined){
        const users = await UserModel.find();
        return users;
    }else{
        const user = await UserModel.find({_id : id});
        return user;
    }
}
export async function deleteUser(id){
    const result = await UserModel.deleteOne({_id : id});
    return result;
}

export async function updateUser(id,userUpdate ){
    console.log(userUpdate);
    const result = await UserModel.findByIdAndUpdate(id,{$set :userUpdate},{new : true});
    return(result);
}

