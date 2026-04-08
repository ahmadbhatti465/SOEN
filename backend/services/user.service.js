import userModel from '../models/user.model.js';

const createUser = async ({
    email,
    password
})=>{
    if(!email || !password){
        throw new Error("Email and Password are required")
    }

    const hashedPassword = await userModel.hashPassword(password);

    const user = await userModel.create({
        email,
        password : hashedPassword
    })

    return user;
}

const getAllUsers = async ({userId}) => {
    const users = await userModel.find({
        _id: { $ne: userId }
    }).select('-password');
    return users;
}

const userService = {
  createUser,
  getAllUsers
};

export default userService;
