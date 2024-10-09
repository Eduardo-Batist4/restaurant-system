const {Table, Order, Menu, Customer} = require('../models/Association')

module.exports = {
    async createOrder(req, res) {
        try {
            const { menuId, tableId, status } = req.body;

            // check that the menuId, tableId, status and total have been provided
            if(!menuId && !tableId && !status) {
                return res.status(400).json({ error: 'All fields are required!' });
            };

            // check if the menu and table exists
            const searchMenu = await Menu.findOne({ where: { id: menuId } });
            const searchTable = await Table.findOne({ where: { id: tableId } });
            if(!searchMenu) {
                return res.status(404).json({ error: "Not Found!" });
            } else if (!searchTable) {
                return res.status(404).json({ error: "Not Found!" });
            }

            if(!searchMenu.available) {
                return res.status(404).json({ error: "Food is not available!" });
            }

            const total = searchMenu.price

            const order = await Order.create({ menuId, tableId, status, total });
            return res.status(201).json(order);
        } catch (error) {
            console.log(error);
            res.status(500).json({ error: 'Internal Server Error.'});
        };
    },

    async getOrders(req, res) {
        try {
            const orders = await Order.findAll({
                attributes: { exclude: ['menuId', 'tableId', 'createdAt', 'updatedAt'] },
                include: [
                    {
                        model: Table,
                        include: [{
                            model: Customer,
                            attributes: { exclude: ['id', 'email', 'createdAt', 'updatedAt'] }
                        }],
                        attributes: { exclude: ['id', 'clientId', 'createdAt', 'updatedAt'] }
                    },
                    {
                        model: Menu,
                        attributes: { exclude: ['description', 'available', 'createdAt', 'updatedAt'] }
                    }
                ],
            });
            return res.status(200).json(orders);
        } catch (error) {
            console.log(error);
            res.status(500).json({ error: 'Internal Server Error.'});
        };
    },
    
    async getOrder(req, res) {
        try {
            const id = req.params.id;
            
            // check that the ID has been provided
            if(!id) {
                return res.status(400).json({ error: 'ID is required!' });
            }
            
            // check if the order exists
            const orderExists = await Order.findOne({ where: { id: id } });
            if(!orderExists) {
                return res.status(404).json({ error: "The order doesn't exist!" });
            }

            const order = await Order.findByPk(id, {
                include: [
                    {
                        model: Table,
                        include: [{
                            model: Customer,
                            attributes: { exclude: ['id', 'email', 'createdAt', 'updatedAt'] }
                        }],
                        attributes: { exclude: ['id', 'clientId', 'createdAt', 'updatedAt'] }
                    },
                    {
                        model: Menu,
                        attributes: { exclude: ['id', 'description', 'available', 'createdAt', 'updatedAt'] }
                    }
                ]
            });
            return res.status(200).json(order);
        } catch (error) {
            console.log(error);
            res.status(500).json({ error: 'Internal Server Error.'});
        };
    },

    async updateOrder(req, res) {
        try {
            const id = req.params.id;
            const { menuId, tableId, status } = req.body;

            // check that the ID has been provided
            if(!id) {
                return res.status(400).json({ error: 'ID is required!' });
            }

            // check that the menuId, tableId, status and total have been provided
            if(!menuId && !tableId && !status) {
                return res.status(400).json({ error: 'All fields are required!' });
            };

            // check if the menu and table exists
            const searchMenu = await Menu.findOne({ where: { id: menuId } });
            const searchTable = await Table.findOne({ where: { id: tableId } });
            if(!searchMenu) {
                return res.status(404).json({ error: "Not Found!" });
            } else if (!searchTable) {
                return res.status(404).json({ error: "Not Found!" });
            }
            

            const total = searchMenu.price

            await Order.update({ menuId, tableId, status, total }, { where: { id: id } });
            return res.status(201).json({ message: 'Success!' });
        } catch (error) {
            console.log(error);
            res.status(500).json({ error: 'Internal Server Error.'});
        }
    },

    async deleteOrder(req, res) {
        try {
            const id = req.params.id;

            // check that the ID has been provided
            if(!id) {
                return res.status(400).json({ error: 'ID is required!' });
            }

            await Order.destroy({ where: { id: id } });
            return res.status(200).json('Success!');
        } catch (error) {
            console.log(error);
            res.status(500).json({ error: 'Internal Server Error.'});   
        }
    }
};