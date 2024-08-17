import userModel from "../models/userModel.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import validator from "validator";

// Function to generate JWT token
const createToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '1h' }); // Added token expiry time for security
};

// Login user
const loginUser = async (req, res) => {
    const { email, password } = req.body;
    try {
        // Validate email
        if (!validator.isEmail(email)) {
            return res.status(400).json({ success: false, message: "Invalid email format" });
        }

        // Check if user exists
        const user = await userModel.findOne({ email });
        if (!user) {
            return res.status(401).json({ success: false, message: "Invalid email or password" });
        }
        
        // Verify password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ success: false, message: "Invalid email or password" });
        }
        
        // Generate token
        const token = createToken(user._id);
        res.json({ success: true, token });
    } catch (error) {
        console.error("Error in loginUser:", error); 
        res.status(500).json({ success: false, message: "Server error" });
    }
};

// Register user
const registerUser = async (req, res) => {
    const { name, password, email } = req.body;
    try {
        // Check if user already exists
        const exists = await userModel.findOne({ email });
        if (exists) {
            return res.status(409).json({ success: false, message: "User already exists" });
        }

        // Validate email and password
        if (!validator.isEmail(email)) {
            return res.status(400).json({ success: false, message: "Please enter a valid email" });
        }
        if (password.length < 8) {
            return res.status(400).json({ success: false, message: "Please enter a strong password" });
        }

        // Hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create new user
        const newUser = new userModel({
            name:name,
            email:email,
            password: hashedPassword
        });
        const user = await newUser.save();

        // Generate token (implement `createToken` function as needed)
        const token = createToken(user._id);

        res.status(201).json({ success: true, token });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

export { loginUser, registerUser };
