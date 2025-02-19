const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const User = require('../models/user.models');
const bcrypt = require("bcryptjs");
dotenv.config();

const login = async (req, res) => {
    const { username, password } = req.body;
    try {

        if(!username || !password) {
            return res.status(404).json({ message: 'Invalid Login Credentials!' });
        }
        const user = await User.findOne({
            where: { username: username },
        });

        if (!user) {
            return res.status(404).json({ message: 'Invalid Login Credentials!' });
        }
        
        // const hashpassword = await ypt.hash(password,10)
        // const isPasswordValid = await bcrypt.compare(password, user.password);

        // if (!isPasswordValid) {
        //     return res.status(400).json({ message: 'Password is incorrect!' });
        // }
        const userDTO = {
            username : user.username,
            id : user.userid,
            is_junior : user.is_junior
        };
        const accessToken = jwt.sign({ id: user.userid, email: user.email, username: user.username }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN });

        res.cookie('jwt', accessToken, { httpOnly: true, secure: true, sameSite: 'None', maxAge: 60 * 60 * 1000 });
        res.status(200).json({message : 'Login Successful', user : userDTO});

    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

const logout = async(req, res) => {
  if (!req.cookies.jwt) {
    return res.status(401).json({ message: 'Already logged out' });
  }
  res.cookie('jwt', '', { maxAge: 0 });
  res.json({ message: 'Logged out successfully' });
}

module.exports = { login, logout };