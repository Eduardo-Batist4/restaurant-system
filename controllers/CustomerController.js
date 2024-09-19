const { Customer, Table } = require('../models/Association');

module.exports = {
    async createCustomer(req, res) {
        try {
            const { name, email } = req.body;

            // check that the name and e-mail have been provided
            if(!name && !email) {
                return res.status(400).json({ error: 'Name and E-mail is required!' });
            };

            // check if the e-mail is already exists
            const searchName = await Customer.findOne({ where: { name: name } });
            const searchEmail = await Customer.findOne({ where: { email: email } });
            if(searchName) {
                return res.status(400).json({ error: 'Name already exists!' });
            } else if (searchEmail) {
                return res.status(400).json({ error: 'E-mail already exists!' });
            }

            const customer = await Customer.create({ name, email });
            return res.status(201).json(customer);
        } catch (error) {
            console.log(error);
            res.status(500).json({ error: 'Internal Server Error.'});
        };
    },

    async getCustomers(req, res) {
        try {
            const customers = await Customer.findAll();
            return res.status(200).json(customers);
        } catch (error) {
            console.log(error);
            res.status(500).json({ error: 'Internal Server Error.'});
        };
    },
    
    async getCustomer(req, res) {
        try {
            const id = req.params.id;
            
            // check that the ID has been provided
            if(!id) {
                return res.status(400).json({ error: 'ID is required!' });
            }
            
            // check if the customer exists
            const customerExist = await Customer.findOne({ where: { id: id } });
            if(!customerExist) {
                return res.status(400).json({ error: "The customer doesn't exist!" });
            }

            const customer = await Customer.findByPk(id, {
                include: [{
                    model: Table,
                    attributes: { exclude: ['id', 'clientId', 'createdAt', 'updatedAt']}
                }]
            });
            return res.status(200).json(customer);
        } catch (error) {
            console.log(error);
            res.status(500).json({ error: 'Internal Server Error.'});
        };
    },

    async updateCustomer(req, res) {
        try {
            const id = req.params.id;
            const { name, email } = req.body;

            // check that the ID has been provided
            if(!id) {
                return res.status(400).json({ error: 'ID is required!' });
            }
            
            // check that the Name and E-mail have been provided
            if(!name && !email) {
                return res.status(400).json({ error: 'Name or E-mail is required!' });
            }

            // check if the customer exists
            const customerExist = await Customer.findOne({ where: { id: id } });
            if(!customerExist) {
                return res.status(404).json({ error: "The customer doesn't exist!" });
            }

            await Customer.update({ name, email }, { where: { id: id } });
            return res.status(200).json({ message: 'Success!'});
        } catch (error) {
            console.log(error);
            return res.status(500).json({ error: 'Internal Server Error.' });
        }
    },

    async deleteCustomer(req, res) {
        try {
            const id = req.params.id;

            // check that the ID has been provided
            if(!id) {
                return res.status(400).json({ error: 'ID is required!' });
            }
            
            // check if the customer exists
            const customerExist = await Customer.findOne({ where: { id: id } });
            if(!customerExist) {
                return res.status(400).json({ error: "The customer doesn't exist!" });
            }

            await Customer.destroy({ where: { id: id } });
            return res.status(200).json({ message: 'Success!' });
        } catch (error) {
            console.log(error);
            res.status(500).json({ error: 'Internal Server Error.'});
        }
    }
};

