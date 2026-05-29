const user = require('../model/user.model');
const asyncWrapper = require('../utils/aysncWapper');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const ApiError = require('../utils/ApiError');
const ApiResponse = require('../utils/ApiResponse');

const register = asyncWrapper(async (req, res) => {
    // Implementation for registration logic
    try {
        const { username, email, password, bio } = req.body;
        if (!username || !email || !password) {
            throw new ApiError(400, "All fields are required");
        }
        const existingUser = await user.findOne({ $or: [{ username }, { email }] });
        if (existingUser) {
            throw new ApiError(400, "Username or email already exists");
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await user.create({ username, email, password: hashedPassword, bio });
        const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, { expiresIn: "1h" });

        const createdUser = await user.findById(user.id).select("-password")

        res.cookie("token", token);
        res.status(201).json(new ApiResponse(201, { message: "User registered successfully", user: createdUser, token }));
    } catch (error) {
        res.status(500).json(new ApiResponse(500, { message: "Server error", error: error.message }));
    }
});

const login = asyncWrapper(async (req, res) => {
    // Implementation for login logic
    try {
        const { email, password , username} = req.body;
        if ((!email && !username) || !password) {
            throw new ApiError(400, "Email or username and password are required");
        }
        const existingUser = await user.findOne({ $or: [
            {
                username: username
            },
            {
                email: email
            }
        ] });
        if (!existingUser) {
            throw new ApiError(400, "Invalid credentials");
        }
        const isPasswordValid = await bcrypt.compare(password, existingUser.password);
        if (!isPasswordValid) {
            throw new ApiError(400, "Invalid credentials");
        }
        const loggedInUser = await user.findById(existingUser._id).select("-password");

        const token = jwt.sign({ id: existingUser._id }, process.env.JWT_SECRET, { expiresIn: "1h" });
        res.cookie("token", token);
        res.status(200).json(new ApiResponse(200, { message: "User logged in successfully", loggedInUser, token }));
    } catch (error) {
        res.status(500).json(new ApiResponse(500, { message: "Server error", error: error.message }));  
    }  
});

module.exports = { register, login };