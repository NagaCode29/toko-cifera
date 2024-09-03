import {Router} from 'express';

import CustomerController from '../controller/CustomerController.js';
import CustomerRepository from "../repository/CustomerRepository.js";
import CustomerService from "../service/CustomerService.js";
import AuthenticationMiddleware from "../middleware/authentication-middleware.js";

const customerService = new CustomerService(new CustomerRepository());
const customerController = new CustomerController(customerService);
const authenticationMiddleware = new AuthenticationMiddleware();

const router = new Router();

router.get('/',authenticationMiddleware.mustLogin,customerController.getCustomersHandler)
router.get('/add-customer',authenticationMiddleware.mustLogin, customerController.getAddCustomerHandler);
router.get('/update-customer/:id',authenticationMiddleware.mustLogin, customerController.getUpdateCustomerHandler);
router.get('/delete-customer/:id',authenticationMiddleware.mustLogin, customerController.deleteCustomerHandler);
router.get('/search',authenticationMiddleware.mustLogin, customerController.searchCustomersByDateHandler);

router.get('/search/query',authenticationMiddleware.mustLogin, customerController.searchCustomersByKeywordHandler);

router.get('/orders-detail/:id', authenticationMiddleware.mustLogin, customerController.getOrdersCustomerHandler);

router.get('/orders-detail/:id/search', authenticationMiddleware.mustLogin, customerController.getOrdersCustomerByDateHandler);

//Post
router.post('/add-customer',authenticationMiddleware.mustLogin, customerController.postCustomerHandler);

router.post('/update-customer/:id',authenticationMiddleware.mustLogin, customerController.putCustomerHandler);

export default router;



