import  userService from '../services/user.service.js';
import userModel from '../models/user.model.js';
import {validationResult} from 'express-validator';

export const createUserController = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const user = await userService.createUser(req.body);
        const token = user.generateJWT();
         res.cookie('token', token, {
            httpOnly: true,
            sameSite: 'strict',
            // secure: true, // enable in production (HTTPS)
        });
        res.status(201).json({user, token})
    } catch (error) {
        res.status(500).json({ error: error.message });
        
    }
}

export const loginUserController = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const { email, password } = req.body;

        const user = await userModel.findOne({ email }).select('+password');
        if (!user) {
            return res.status(400).json({ error: "Invalid email or password" });
        }

        const isMatch = await user.isValidPassword(password);
        if (!isMatch) {
            return res.status(400).json({ error: "Invalid email or password" });
        }

        const token = user.generateJWT();

        // ✅ set cookie FIRST
        res.cookie('token', token, {
            httpOnly: true,
            sameSite: 'strict',
            // secure: true, // enable in production (HTTPS)
        });

        // ✅ then send response
        return res.status(200).json({
            user,
            token
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: error.message });
    }
};


export const logoutUserController = async (req, res) => {
    const token = req.cookies?.token;

    if (!token) {
        return res.status(400).json({
            message: "User is already logged out"
        });
    }

    res.clearCookie('token', {
        httpOnly: true,
        sameSite: 'strict',
        // secure: true, // enable in production (HTTPS)
    });

    return res.status(200).json({
        message: "Logged out successfully"
    });
};


export const getProfileController = async (req, res) => {
    console.log(req.user);
    return res.status(200).json({user: req.user});
}

export const getAllUsersController = async (req, res) => {
    try {
        const loggedInUser = await userModel.findOne({ email: req.user.email })
        const userId = loggedInUser._id
        const allUsers = await userService.getAllUsers({userId: loggedInUser._id});
        return res.status(200).json({ users: allUsers });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Failed to fetch users' });
    }
}