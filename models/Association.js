const Customer = require('./Customer');
const Table = require('./Table');
const Menu = require('./Menu');
const Order = require('./Order');

Customer.hasOne(Table, { foreignKey: 'clientId' });
Table.belongsTo(Customer, { foreignKey: 'clientId' });

Menu.hasMany(Order, { foreignKey: 'menuId' });
Order.belongsTo(Menu, { foreignKey: 'menuId' });

Table.hasMany(Order, { foreignKey: 'tableId' });
Order.belongsTo(Table, { foreignKey: 'tableId' });


module.exports = { Customer, Table, Order, Menu };