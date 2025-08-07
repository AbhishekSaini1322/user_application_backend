const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/userData");
const { isValidEmail, isValidPassword, generateUsername } = require("../utils/Validation");
require("dotenv").config();

const register = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ message: "All fields are required." });
        }

        if (!isValidEmail(email)) {
            return res.status(400).json({ message: "Invalid email format." });
        }

         const existingUser = await User.findOne({ email: email.trim() });
          if (existingUser) {
            return res.status(409).json({ message: "Email already registered." });
          }

        if (!isValidPassword(password)) {
            return res.status(400).json({
            message:
                "Password must be at least 8 characters long and include uppercase, lowercase, and a number.",
            });
        }

        const username = await generateUsername();


            const saltRounds = 10;
            const hashedPassword = await bcrypt.hash(password, saltRounds);

            const user = new User({ name, email, password: hashedPassword, username });
            await user.save();

            res.status(201).json({success:true, message:"Registration successfull"});
  } catch (error) {
       res.status(500).json({ message: "Server error", error });
  }

};

const login = async (req, res) => {
    try {
      const { email, password } = req.body;
  
      if (!email || !password) {
        return res.status(400).json({ success: false, message: "Email and password are required." });
      }

      const user = await User.findOne({ email });
      if (!user) {
        return res.status(400).json({ success: false, message: "Invalid email or password." });
      }
  
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(401).json({ success: false, message: "Invalid email or password." });
      }
  
      // Generate JWT
      const token = jwt.sign(
        { uid: user.uid, 
          username: user.username ,
          role: user.role
        }, // payload
        process.env.JWT_SECRET,
        { expiresIn: "1d" } 
      );
  
      res.status(200).json({
        success: true,
        message: "Login successful",
        token,
        user: {
          username: user.username,                     
        },
      });
    } catch (error) {
      res.status(500).json({ success: false, message: "Server error", error: error.message });
    }
  };


  const getProfile = async (req, res) => {
  try {
    const { uid } = req.user; 

    if (!uid) {
      return res.status(400).json({ success: false, message: "User ID is required" });
    }

    const user = await User.findOne({ uid }).select('-password'); 

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    res.status(200).json({
      success: true,
      message: "Profile fetched successfully",
      user
    });
  } catch (error) {
    console.error("Error in getProfile:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message
    });
  }
};






module.exports = { register, login, getProfile };
