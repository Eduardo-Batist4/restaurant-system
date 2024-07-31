const express = require('express');
const router = express.Router();

// Controllers
const CustomerController = require('../controllers/CustomerController');
const TableController = require('../controllers/TableController');
const MenuController = require('../controllers/MenuController');
const OrderController = require('../controllers/OrderController');
const EmployeeController = require('../controllers/EmployeeController');
const LoginController = require('../controllers/LoginController');

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
router.post('/menus', LoginController.verifyToken, MenuController.createMenu);
router.get('/menus', MenuController.getMenus);
router.patch('/menu/:id', LoginController.verifyToken, MenuController.updateMenu);
router.delete('/menu/:id', LoginController.verifyToken, MenuController.deleteMenu);

// Orders
router.post('/orders', LoginController.verifyToken, OrderController.createOrder);
router.get('/orders', LoginController.verifyToken, OrderController.getOrders);
router.get('/order/:id', LoginController.verifyToken, OrderController.getOrder);
router.patch('/order/:id', LoginController.verifyToken, OrderController.updateOrder);
router.delete('/order/:id', LoginController.verifyToken, OrderController.deleteOrder);

// Employees
router.post('/employees', EmployeeController.createEmployee);
router.get('/employees', LoginController.verifyToken, EmployeeController.getEmployees);
router.get('/employee/:id', LoginController.verifyToken, EmployeeController.getEmployee);
router.delete('/employee/:id', LoginController.verifyToken, EmployeeController.deleteEmployee);

// Login
router.post('/login', LoginController.login);
router.post('/logout', LoginController.logout);

module.exports = router; 