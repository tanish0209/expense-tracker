import jwt from 'jsonwebtoken'
import userModel from '../models/User.js';
import validator from 'validator'
import bcrypt from 'bcryptjs';
//API TO REGISTER USER
const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.json({ success: false, message: "Missing Details" });
        }
        if (!validator.isEmail(email)) {
            return res.json({ success: false, message: "Enter a Valid Email Address" });
        }
        if (password.length < 8) {
            return res.json({ success: false, message: "Enter a password of minimum length 8 characters" });
        }
        //Hashing user Password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const userData = {
            name, email, password: hashedPassword
        }
        const newUser = new userModel(userData);
        const user = await newUser.save();

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
        res.json({ success: true, token });
    } catch (error) {

        console.log(error);
        res.json({ success: false, message: error.message })
    }
}

//API FOR USER LOGIN
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await userModel.findOne({ email });
        if (!user) {
            return res.json({ success: false, message: "User Does Not Exist" })
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (isMatch) {
            const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
            res.json({ success: true, token, user });
        }
        else {
            res.json({ success: false, message: "Password does not match" });
        }
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message })
    }
}

//API TO GET USER INFO
const getUserInfo = async (req, res) => {
    try {
        const user = await userModel.findById(req.user.id).select('-password');
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }
        res.json({ success: true, user });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: error.message });
    }
}


export { registerUser, loginUser, getUserInfo }