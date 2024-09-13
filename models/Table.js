const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');
const Customer = require('./Customer');

const Table = sequelize.define('tables', {
    number: {
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: true
    },
    clientId: {
        type: DataTypes.INTEGER,
        references: {
            model: Customer,
            key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
        allowNull: true,
    }
});

module.exports = Table;