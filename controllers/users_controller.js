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
    const { email, password } = req.body;
    console.log("email " + email + "\npassword " + password);

    //! check if user aleady exist
    const existingUser = await userModel.findOne({ email: email });
    console.log("user " + existingUser);

    if (existingUser) {
      return res.status(400).json(
        {
          message: 'Email already exists',
        },
      );
    }

    //! create new user
    const newUser = new userModel({ email, password });
    await newUser.save();

    //* Encrypt payload (user)
    const payload = { id: newUser._id, email: newUser.email };
    const token = jwt.sign(
      payload,
      process.env.SECRET_KEY,
    );

    res.status(201).json({token : token});

  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
}

//!-----------------------------------------------
//? returned allUsers
async function getUsers(req, res) {
  res.json(await userModel.find(), { "__v": 0 });
}






module.exports = {
  login,
  signup,
  getUsers,


}