const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');
const Menu = require('./Menu');
const Table = require('./Table');

const Order = sequelize.define('orders', {
    menuId: {
        type: DataTypes.INTEGER,
        references: {
            model: Menu,
            key: 'id'
        },
        allowNull: false,
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
    },
    tableId: {
        type: DataTypes.INTEGER,
        references: {
            model: Table,
            key: 'id'
        },
        allowNull: false,
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
    },
    status: {
        type: DataTypes.ENUM,
        values: ['recebido', 'preparando', 'entregue'],
        allowNull: false,
        defaultValue: 'recebido'
    },
    total: {
        type: DataTypes.DECIMAL(10,2),
    }
});

Menu.hasMany(Order, { foreignKey: 'menuId' });
Order.belongsTo(Menu, { foreignKey: 'menuId' });

Table.hasMany(Order, { foreignKey: 'tableId' });
Order.belongsTo(Table, { foreignKey: 'tableId' });


module.exports = Order;