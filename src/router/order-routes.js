import {Router} from 'express';

import OrderController from '../controller/OrderController.js';
import OrderService from "../service/OrderService.js";
import OrderRepository from "../repository/OrderRepository.js";
import AuthenticationMiddleware from "../middleware/authentication-middleware.js";

const orderService = new OrderService(new OrderRepository());
const orderController = new OrderController(orderService);
const authenticationMiddleware = new AuthenticationMiddleware();

const router = new Router();

router.get('/',authenticationMiddleware.mustLogin, orderController.getOrdersHandler);
router.get('/add-order',authenticationMiddleware.mustLogin,orderController.getAddOrderHandler)
router.get('/detail/:id',authenticationMiddleware.mustLogin,orderController.getDetailOrderHandler)

router.get('/search',authenticationMiddleware.mustLogin,orderController.getAllOrdersByDateHandler);
router.get('/search/query',authenticationMiddleware.mustLogin,orderController.getAllOrdersByKeywordHandler);

router.get('/delete-order/:id',authenticationMiddleware.mustLogin,orderController.deleteOrderHandler);

router.get('/invoice/:id', authenticationMiddleware.mustLogin, orderController.getInvoice);

router.get('/total-paid-in-week', authenticationMiddleware.mustLogin, orderController.getTotalPaidInWeekHandler);

router.get('/total-sales-in-week', authenticationMiddleware.mustLogin, orderController.getTotalSalesInWeekHandler);

//Post
router.post('/add-order',authenticationMiddleware.mustLogin,orderController.postOrderHandler);
router.post('/update-order/:id',authenticationMiddleware.mustLogin,orderController.updateOrderHandler);

export default router;

