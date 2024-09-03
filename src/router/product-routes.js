import {Router} from 'express';

import ProductController from "../controller/ProductController.js";
import ProductService from "../service/ProductService.js";
import ProductRepository from "../repository/ProductRepository.js";
import AuthenticationMiddleware from "../middleware/authentication-middleware.js";

const productService = new ProductService(new ProductRepository());
const productController = new ProductController(productService);
const authenticationMiddleware = new AuthenticationMiddleware();

const router = new Router();

router.get('/',authenticationMiddleware.mustLogin,productController.getProductsHandler);
router.get('/add-product',authenticationMiddleware.mustLogin,productController.getAddProductHandler);
router.get('/update-product/:id',authenticationMiddleware.mustLogin,productController.getUpdateHandler);
router.get('/delete-product/:id',authenticationMiddleware.mustLogin,productController.deleteProductHandler);
router.get('/search',authenticationMiddleware.mustLogin,productController.getAllProductsByDateHandler);
router.get('/search/query',authenticationMiddleware.mustLogin,productController.getAllProductsByKeyword);


//Post
router.post('/add-product',authenticationMiddleware.mustLogin,productController.postProductHandler)
router.post('/update-product/:id',authenticationMiddleware.mustLogin,productController.postUpdateHandler)

export default router;
