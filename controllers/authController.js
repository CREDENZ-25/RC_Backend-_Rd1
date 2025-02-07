const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { col } = require('sequelize');

const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    // const isMatch = await bcrypt.compare(password, user.password);
    // if (!isMatch) {
    //   return res.status(401).json({ message: 'Invalid credentials' });
    // }
    
    const token = jwt.sign(
      {email: user.email, name: user.name},
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    return res.json({ token, message: 'Login successful' });
  } catch (error) {
    return res.status(500).json({ message: 'Error logging in', error });
  }
};

module.exports = { login };