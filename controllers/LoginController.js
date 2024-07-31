const Employee = require('../models/Employee');
const { verifyPassword } = require('../utils/bcrypt');
const jwt = require('jsonwebtoken');
const blacklist = require('../utils/blacklist.js');
require('dotenv').config();

module.exports = {
    async login(req, res) {
        try {
            const { email, password } = req.body;

            // Check if the email exist
            const employee = await Employee.findOne({ where: { email: email } });
            if(!employee) {
                return res.status(401).json({ error: "Employee not found!"})
            }

            // Verifying password
            const validPassword = await verifyPassword(password, employee.password);
            if(!validPassword) {
                return res.status(401).json({ error: "wrong email or password!"})
            }

            const token = jwt.sign({ id: employee.id, name: employee.name }, process.env.SECRET);

            return res.status(200).json({ message: 'Login successful', token });
        } catch (error) {
            console.error("Login error.");
            return res.status(500).json({error: "Interval server error."});
        }
    },

    async logout(req, res) {
        const tokenHeader = req.headers['authorization'];
        const token = tokenHeader && tokenHeader.split(' ')[1];
        
        // Check if the token exists
        if (!token) {
            return res.status(400).json({ message: 'Token not provided!' });
        }
        
        blacklist.push(token)

        return res.status(200).json({ message: 'Logout successful!' });
    },

    async verifyToken(req, res, next) {
        const tokenHeader = req.headers['authorization'];
        const token = tokenHeader && tokenHeader.split(' ')[1];

        // Check if the token exists
        if(!token) {
            return res.status(401).json({ message: 'Not authorized!' });
        }
        
        // Checking if token is blacklisted
        if(blacklist.includes(token)) {
            return res.status(401).json({ message: 'Token is blacklisted!' });
        }

        try {
            const decoded = jwt.verify(token, process.env.SECRET);
            req.user = decoded;
            next();
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: "Not authorized." });
        }
    }
};