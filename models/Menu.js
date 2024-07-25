const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');

const Menu = sequelize.define('menus', {
    name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    price: {
        type: DataTypes.DECIMAL(10,2),
        allowNull: false,
    },
    available: {
        type: DataTypes.BOOLEAN,
    }
});

module.exports = Menu;