const express = require('express');
const router = express.Router();

// Controllers
const CustomerController = require('../controllers/CustomerController');
const TableController = require('../controllers/TableController');
const MenuController = require('../controllers/MenuController');
const OrderController = require('../controllers/OrderController');
const EmployeeController = require('../controllers/EmployeeController');

// Customers
router.post('/customers', CustomerController.createCustomer);
router.get('/customers', CustomerController.getCustomers);
router.get('/customer/:id', CustomerController.getCustomer);
router.patch('/customer/:id', CustomerController.updateCustomer);
router.delete('/customer/:id', CustomerController.deleteCustomer);

// Tables
router.post('/tables', TableController.createTable);
router.get('/tables', TableController.getTables);
router.get('/table/:id', TableController.getTable);
router.patch('/table/:id', TableController.updateTable);
router.delete('/table/:id', TableController.deleteTable);

// Menu
router.post('/menus', MenuController.createMenu);
router.get('/menus', MenuController.getMenus);
router.patch('/menu/:id', MenuController.updateMenu);
router.delete('/menu/:id', MenuController.deleteMenu);

// Orders
router.post('/orders', OrderController.createOrder);
router.get('/orders', OrderController.getOrders);
router.get('/order/:id', OrderController.getOrder);
router.patch('/order/:id', OrderController.updateOrder);
router.delete('/order/:id', OrderController.deleteOrder);

// Employees
router.post('/employees', EmployeeController.createEmployee);
router.get('/employees', EmployeeController.getEmployees);
router.get('/employee/:id', EmployeeController.getEmployee);
router.delete('/employee/:id', EmployeeController.deleteEmployee);


module.exports = router; 