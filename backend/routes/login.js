const express = require("express");
const router = express.Router();
const z = require("zod");
const User = require("../model/user"); 
const dotenv = require("dotenv");
dotenv.config();
const JWT_SECRET = process.env.jwt;
const jwt = require("jsonwebtoken");
const authenticate = require('../middleware/authenticate');


router.get('/me', authenticate, async (req, res) => {
  try {
    
    return res.status(200).json(req.user);
  } catch (err) {
    console.error('Failed to fetch current user', err);
    return res.status(500).json({ message: 'Server error' });
  }
});

const signinbody = z.object({
  email: z.string().email(),
  password: z.string().min(3).max(12),
});

router.post("/login", async (req, res) => {
  try {
    const parse = signinbody.safeParse(req.body);
    if (!parse.success) {
      return res.status(400).json({ message: "Invalid credentials" });
    }
    const { email, password } = parse.data;

    const user = await User.findOne({
      email,
      password,
    });

    if (user) {
      const token = jwt.sign({ userId: user._id }, JWT_SECRET);
    
      const safeUser = { _id: user._id, name: user.name, email: user.email, avatarUrl: user.avatarUrl };
      return res.json({ user: safeUser, token });
    }

    return res.status(401).json({ message: "Invalid email or password" });
  } catch (err) {
    console.error("Signin error:", err);
    return res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;