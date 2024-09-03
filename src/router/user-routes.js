import {Router} from 'express';
import UserController from '../controller/UserController.js';
import UserService from "../service/UserService.js";
import UserRepository from "../repository/UserRepository.js";
const userService = new UserService(new UserRepository());
const userController = new UserController(userService)
import AuthenticationMiddleware from '../middleware/authentication-middleware.js';

const router = new Router();
const authenticationMiddleware = new AuthenticationMiddleware();
//Get
router.get('/register',authenticationMiddleware.notLogin,userController.getRegisterUserHandler);
router.get('/login', authenticationMiddleware.notLogin,userController.getUserLoginHandler);
router.get('/logout', authenticationMiddleware.mustLogin,userController.getUserLogoutHandler);

//Post
router.post('/register',authenticationMiddleware.notLogin,userController.postUserHandler);
router.post('/login',authenticationMiddleware.notLogin,userController.postUserLoginHandler);

// Secret
router.get('/dashboard',authenticationMiddleware.mustLogin,userController.getUserHomeHandler)

export default router;

