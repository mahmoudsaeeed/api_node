const userModel = require('../models/user_model');
const jwt = require('jsonwebtoken');


async function login(req, res) {
  try {
    const { email, password } = req.body;

    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Email is not registered' });
    }

    const isMatch = password == user.password;
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    //* Encrypt payload (user)
    const payload = { id: user._id, email: user.email };
    const token = jwt.sign(
      payload,
      process.env.SECRET_KEY,
    );

    // ✅ لو كله تمام، رجع بيانات أو Token
    res.status(200).json({
      token : token,
    });
    // res.json({message: 'Login successful', userId: user._id })
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
}
//!-----------------------------------------------
async function signup(req, res) {
  try {
    const {
      email,
      password,
      firstName,
      lastName,
      mobileNumber,
      gender
    } = req.body;

    console.log("📩 Email:", email);
    console.log("👤 Name:", firstName, lastName);

    // تحقق إذا كان المستخدم موجود مسبقًا
    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already exists' });
    }

    // إنشاء مستخدم جديد
    const newUser = new userModel({
      email,
      password,
      firstName,
      lastName,
      mobileNumber,
      gender
    });

    await newUser.save();

    // إنشاء توكن JWT
    const payload = { id: newUser._id, email: newUser.email };
    const token = jwt.sign(payload, process.env.SECRET_KEY);

    return res.status(201).json({ token });

  } catch (error) {
    console.error("❌ Signup error:", error.message);
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
}

// //!-----------------------------------------------
// //? returned allUsers
// async function getUsers(req, res) {
//   res.json(await userModel.find(), { "__v": 0 });
// }






module.exports = {
  login,
  signup,


}