const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');

const Employee = sequelize.define('employees', {
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    position: {
        type: DataTypes.ENUM,
        values: ['garçom', 'cozinheiro', 'recepção'],
        allowNull: false,
    },
});

module.exports = Employee;