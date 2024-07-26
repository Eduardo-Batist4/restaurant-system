const Customer = require('../models/Customer');
const Table = require('../models/Table');

module.exports = {
    async createTable(req, res) {
        try {
            const { number, clientId } = req.body;

            // check if the number has been provided
            if(!number) {
                return res.status(400).json({ error: 'Number is required!' });
            }

            // check if the table number exists
            const tableExist = await Table.findOne({ where: { number: number } });
            if(tableExist) {
                return res.status(400).json({ error: 'The table number already exits!'});
            }

            if(clientId !== undefined && clientId !== null) {
                // check if the customer exists
                const searchClient = await Customer.findOne({ where: { id: clientId } });
                if(!searchClient) {
                    return res.status(400).json({ error: "The customer doesn't exist!" });
                }

                // check if the customer already has a table
                const customerHasATable = await Table.findOne({ where: { clientId: clientId } });
                if(customerHasATable) {
                    return res.status(400).json({ error: 'The customer already a table!'});
                }
            };

            const table = await Table.create({ number, clientId: clientId || null });
            return res.status(201).json(table);
        } catch (error) {
            console.log(error);
            res.status(500).json({ error: 'Internal Server Error'});
        }
    },

    async getTables(req, res) {
        try {
            const tables = await Table.findAll({
                include: [{
                    model: Customer,
                    attributes: { exclude: ['id', 'email', 'createdAt', 'updatedAt'] },
                }],
                attributes: { exclude: ['createdAt', 'updatedAt'] }
            });
            return res.status(200).json(tables);
        } catch (error) {
            console.log(error);
            res.status(500).json({ error: 'Internal Server Error'});
        }
    },
    async getTable(req, res) {
        try {
            const id = req.params.id;
            
            // check that the ID has been provided
            if(!id) {
                return res.status(400).json({ error: 'ID is required!' });
            }

            // check if the customer exists
            const tableExist = await Customer.findOne({ where: { id: id } });
            if(!tableExist) {
                return res.status(400).json({ error: "The table doesn't exist!" });
            }

            const tables = await Table.findByPk(id, {
                include: [{
                    model: Customer,
                    attributes: { exclude: ['id', 'email', 'createdAt', 'updatedAt'] },
                }],
            });
            return res.status(200).json(tables);
        } catch (error) {
            console.log(error);
            res.status(500).json({ error: 'Internal Server Error'});
        }
    },

    async updateTable(req, res) {
        try {
            const id = req.params.id;
            const { number, clientId } = req.body;

            // check that the ID has been provided
            if(!id) {
                return res.status(400).json({ error: 'ID is required!' });
            }

            // check that the Number and clientId have been provided
            if(!number && !clientId) {
                return res.status(400).json({ error: 'Number or clientId is required!' });
            }
            
            // check if the table exists
            const tableExist = await Table.findOne({ where: { id: id } });
            if(!tableExist) {
                return res.status(400).json({ error: "The table doesn't exist!" });
            }

            if(clientId !== undefined && clientId !== null) {
                // check if the customer exists
                const searchClient = await Customer.findOne({ where: { id: clientId } });
                if(!searchClient) {
                    return res.status(400).json({ error: "The customer doesn't exist!" });
                }
            };

            await Table.update({ number, clientId }, { where: { id: id } });
            return res.status(200).json({ message: 'Success!' });
        } catch (error) {
            console.log(error);
            res.status(500).json({ error: 'Internal Server Error'});
        }
    },
    
    async deleteTable(req, res) {
        try {
            const id = req.params.id;

            // check that the ID has been provided
            if(!id) {
                return res.status(400).json({ error: 'ID is required!' });
            }

            await Table.destroy({ where: { id: id } });
            return res.status(200).json('Success!');
        } catch (error) {
            console.log(error);
            res.status(500).json({ error: 'Internal Server Error'});
        }
    }
};