const Customer = require('../models/Customer');

module.exports = {
    async createCustomer(req, res) {
        try {
            const { name, email } = req.body;

            // Check if content exists
            if(!name && !email) {
                return res.status(401).json({ message: 'Empty content!' });
            };

            const customer = await Customer.create({ name, email });
            return res.status(201).json(customer);
        } catch (error) {
            console.log(error);
            res.status(500).json({ error: ''});
        };
    },

    async getCustomers(req, res) {
        try {
            const customers = await Customer.findAll();
            return res.status(200).json(customers);
        } catch (error) {
            console.log(error);
            res.status(500).json({ error: ''});
        };
    },
};

