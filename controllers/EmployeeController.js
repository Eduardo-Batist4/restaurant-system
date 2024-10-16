const Employee = require('../models/Employee');
const { hashPassword } = require('../utils/bcrypt');

module.exports = {
    async createEmployee(req, res) {
        try {
            const { name, email, password, confirmPassword, position } = req.body;

            // check if the content exists 
            if(!name && !email && !password && !confirmPassword && !position) {
                return res.status(400).json({ error: 'All fields are required!' });
            }

            // check if the password is equal to confirmPassword
            if(password !== confirmPassword) {
                return res.status(400).json({error: 'Wrong password!'})
            }

            // check if the name exists
            const nameExists = await Employee.findOne({ where: { name: name } });
            if(nameExists) {
                return res.status(409).json({error: 'This name already exists!'});
            }

            // check if the email exists
            const emailExists = await Employee.findOne({ where: { email: email } });
            if(emailExists) {
                return res.status(409).json({error: 'This email already exists!'});
            }

            const hashedPassword = await hashPassword(password);

            const employees = await Employee.create({ name, email, password: hashedPassword, position });
            return res.status(201).json(employees);
        } catch (error) {
            console.log(error);
            res.status(500).json({ error: 'Internal Server Error.'});
        }
    },

    async getEmployees(req, res) {
        try {
            const employees = await Employee.findAll({ attributes: { exclude: ['email', 'password', 'createdAt', 'updatedAt']}});
            return res.status(200).json(employees);
        } catch (error) {
            console.log(error);
            return res.status(500).json({error: "Internal Server Error."});
        }
    },

    async getEmployee(req, res) {
        try {
            const employee = await Employee.findOne({
                where: { id: req.params.id },
                attributes: { exclude: ['password'] } 
            });
            if(!employee) {
                return res.status(404).json({ error: "Not found!" });
            }

            return res.status(200).json(employee);
        } catch (error) {
            console.log(error);
            return res.status(500).json({ error: "Internal Server Error." });
        }
    },

    async deleteEmployee(req, res) {
        try {
            const id = req.params.id;
            
            // check that the ID has been provided
            if(!id) {
                return res.status(400).json({ error: 'ID is required!' });
            }

            const employeeExist = await Employee.findByPk(id);
            if(!employeeExist) {
                return res.status(404).json({ error: "Not Found!" });
            }

            await Employee.destroy({ where: { id: req.params.id } });
            return res.status(200).json('Success!');
        } catch (error) {
            console.log(error);
            res.status(500).json({ error: 'Internal Server Error.'});   
        }
    }
}