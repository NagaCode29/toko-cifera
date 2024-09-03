import path from 'path';
import { fileURLToPath } from 'url';

import 'dotenv/config.js';
import cookieParser from 'cookie-parser';

import express from "express";

// Routes
import userRoutes from './router/user-routes.js';
import customerRoutes from './router/customer-routes.js';
import productRoutes from './router/product-routes.js';
import orderRoutes from "./router/order-routes.js";


// middlewares
import errorMiddleware from './middleware/error-middleware.js';


const __filename = fileURLToPath(import.meta.url); // get the resolved path to the file
const __dirname = path.dirname(__filename); // get the name of the directory

const app = express();

app.use(cookieParser()); // Parsing cookie
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.set('views', path.resolve(__dirname,'views'));
app.set('view engine', 'pug');

app.use('/static',express.static(path.resolve(__dirname, '../public')));

app.use('/users',userRoutes);
app.use('/customers',customerRoutes);
app.use('/products',productRoutes);
app.use('/orders',orderRoutes);

app.use((req,res,next)=>{
    res.render('not-found', {title: 'Not Found'});
})
app.use(errorMiddleware);


const port = process.env.PORT || 8000;

app.listen(port,()=>{
    console.log('Server running on port ',port);
});