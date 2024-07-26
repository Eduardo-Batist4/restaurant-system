const express = require('express');
const router = express.Router();

// Controllers
const CustomerController = require('../controllers/CustomerController');


router.post('/customers', CustomerController.createCustomer);
router.get('/customers', CustomerController.getCustomers);
router.get('/customers/:id', CustomerController.getCustomer);
router.patch('/customers/:id', CustomerController.updateCustomer);
router.delete('/customers/:id', CustomerController.deleteCustomer);

module.exports = router;