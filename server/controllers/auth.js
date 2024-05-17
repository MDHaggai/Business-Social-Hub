import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

/* Helper function to register user in Chat Engine */
async function registerUserInChatEngine(user) {
    const { firstName, lastName, email, password } = user;
    const username = `${firstName}-${lastName}`; // Construct a unique username

    try {
        const response = await axios.post(
            'https://api.chatengine.io/users/',
            {
                username,
                secret: password, // Use the same password or define a specific secret
                email,
            },
            { headers: { 'Private-Key': process.env.CHAT_ENGINE_PRIVATE_KEY } }
        );
        console.log('Registered user in Chat Engine:', response.data);
        return response.data; // Return data for further processing if needed
    } catch (error) {
        console.error('Error registering user in Chat Engine:', error.message);
        throw error; // Rethrow to handle it in the caller function
    }
}

/* REGISTER USER */
export const register = async (req, res) => {
    try {
        const { firstName, lastName, email, password, picturePath, friends, location, occupation } = req.body;

        const salt = await bcrypt.genSalt();
        const passwordHash = await bcrypt.hash(password, salt);

        const newUser = new User({
            firstName,
            lastName,
            email,
            password: passwordHash,
            picturePath,
            friends,
            location,
            occupation,
            viewedProfile: Math.floor(Math.random() * 10000),
            impressions: Math.floor(Math.random() * 10000),
        });

        const savedUser = await newUser.save();
        const chatEngineUser = await registerUserInChatEngine(savedUser); // Sync user with Chat Engine
        console.log(`Chat Engine user created: ${chatEngineUser.username}`);

        res.status(201).json(savedUser);
    } catch (err) {
        console.error("Registration failed:", err.message);
        res.status(500).json({ error: err.message });
    }
};


/* LOGGING IN */
export const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        try {
            const chatEngineUser = await axios.get(`https://api.chatengine.io/users/${user.username}/`, {
                headers: {
                    'Project-ID': process.env.CHAT_ENGINE_PROJECT_ID,
                    'User-Name': user.username,
                    'User-Secret': user.password
                }
            });

            console.log("Chat Engine login success:", chatEngineUser.data);

            if (chatEngineUser.status !== 200) {
                await registerUserInChatEngine(user);
            }
        } catch (chatEngineError) {
            console.error("Chat Engine login failed:", chatEngineError.response?.data);
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
        res.status(200).json({ token, user });
    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ message: "Something went wrong in login function", error: error.message });
    }
};
