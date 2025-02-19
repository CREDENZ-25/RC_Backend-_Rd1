const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const User = require('../models/user.models');
const bcrypt = require("bcryptjs");
dotenv.config();

const login = async (req, res) => {
    const { email, password } = req.body;
    // console.log(email);
    try {
        const user = await User.findOne({
            // attributes: ['password', 'userid', 'isSenior'],
            where: { email: email },
        });

        if (!user) {
            return res.status(404).json({ message: 'Invalid Login Credentials' });
        }
        // console.log(password)
        // const hashpassword = await ypt.hash(password,10)
        // console.log(hashpassword)

        //const isPasswordValid = await bcrypt.compare(password, user.password);
        // console.log(user.password)

        // if (!isPasswordValid) {
        //     return res.status(400).json({ message: 'Password is incorrect!' });
        // }
        const userDTO = {
            username : user.username,
            name : user.name,
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
    
}

module.exports = login;