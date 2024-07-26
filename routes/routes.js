const express = require('express');
const router = express.Router();

// Controllers
const CustomerController = require('../controllers/CustomerController');
const TableController = require('../controllers/TableController');

// Customers
router.post('/customers', CustomerController.createCustomer);
router.get('/customers', CustomerController.getCustomers);
router.get('/customers/:id', CustomerController.getCustomer);
router.patch('/customers/:id', CustomerController.updateCustomer);
router.delete('/customers/:id', CustomerController.deleteCustomer);

// Tables
router.post('/tables', TableController.createTable);
router.get('/tables', TableController.getTables);
router.get('/tables/:id', TableController.getTable);
router.patch('/tables/:id', TableController.updateTable);
router.delete('/tables/:id', TableController.deleteTable);


module.exports = router; 