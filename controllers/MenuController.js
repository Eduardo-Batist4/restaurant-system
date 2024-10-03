const { Menu } = require('../models/Association');

module.exports = {
    async createMenu(req, res) {
        try {
            const { name, description, price, available } = req.body;

            // check if the name has been provided
            if(!name && !description && !price && !available) {
                return res.status(400).json({ error: 'All fields are required!' });
            }

            const menuExist = await Menu.findOne({ where: { name: name } });
            if(menuExist) {
                return res.status(409).json({ error: 'The food already exists!'});
            }

            const menu = await Menu.create({ name, description, price, available: available || false });
            return res.status(201).json(menu);
        } catch (error) {
            console.log(error);
            res.status(500).json({ error: 'Internal Server Error.'});
        }
    },

    async getMenus(req, res) {
        try {
            const menu = await Menu.findAll();
            return res.status(200).json(menu);
        } catch (error) {
            console.log(error);
            res.status(500).json({ error: 'Internal Server Error.'});
        }
    },
    
    async updateMenu(req, res) {
        try {
            const id = req.params.id;
            const { name, description, price, available } = req.body;

            // check that the ID has been provided
            if(!id) {
                return res.status(400).json({ error: 'ID is required!' });
            }

            // check that the name, desc, price or available have been provided
            if(name === undefined && description === undefined && price === undefined && available === undefined) {
                return res.status(400).json({ error: 'All fields are required!' });
            }
            
            // check if the menu exists
            const menuExist = await Menu.findOne({ where: { id: id } });
            if(!menuExist) {
                return res.status(404).json({ error: "Not Found!" });
            }

            await Menu.update({ name, description, price, available }, { where:{ id: id} });
            return res.status(200).json({ message: 'Success!' });
        } catch (error) {
            console.log(error);
            res.status(500).json({ error: 'Internal Server Error.'});   
        }
    },

    async deleteMenu(req, res) {
        try {
            const id = req.params.id;

            // check that the ID has been provided
            if(!id) {
                return res.status(400).json({ error: 'ID is required!' });
            }

            await Menu.destroy({ where: { id: id } });
            return res.status(200).json('Success!');
        } catch (error) {
            console.log(error);
            res.status(500).json({ error: 'Internal Server Error.'});   
        }
    }
};