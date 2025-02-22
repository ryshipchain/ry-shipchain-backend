import User from '../models/user.model.js';
import { hashPassword, comparePassword } from '../helpers/auth.helper.js';
import { loginSchema, registerSchema } from '../utils/validator.js';
import { generateToken } from '../utils/auth.utils.js';

export const register = async (req, res) => {
  try {
    console.log(req.body)
    const { error } = registerSchema.validate(req.body);
    if (error) return res.status(400).json({ success: false, message: error.details[0].message });

    const { firstName, lastName, email, password, role } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ success: false, message: "A user with this email already exists. please try with another email" });

    const hashedPassword = await hashPassword(password);
    const user = new User({ firstName, lastName, email, password: hashedPassword, role });
    await user.save();
    res.status(201).json({ success: true, message: "User registered successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Login user
export const login = async (req, res) => {
  const { error } = loginSchema.validate(req.body);
  if (error) return res.status(400).json({ success: false, message: error.details[0].message });

  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    const isMatch = await comparePassword(password, user.password);
    if (!isMatch) return res.status(400).json({ success: false, message: "Invalid credentials" });

    const token = generateToken({ id: user._id, role: user.role });
    res.status(200).json({ success: true, message: "Logged in successfully", data: { token } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

