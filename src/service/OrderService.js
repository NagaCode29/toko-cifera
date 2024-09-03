import orderSchema from "../validator/schema/order-schema.js";
import {validate} from "../helper/index.js";
import ProductRepository from "../repository/ProductRepository.js";
import CustomerRepository from "../repository/CustomerRepository.js";
import OrderDetailRepository from "../repository/OrderDetailRepository.js";
import NotFoundError from "../exception/NotFoundError.js";
import InvariantError from "../exception/InvariantError.js";
import Order from "../model/Order.js";
import {nanoid} from "nanoid";
import OrderDetail from "../model/OrderDetail.js";
import pool from "../database/pool.js";


class OrderService {
    #orderRepository;
    #productRepository;
    #customerRepository;
    #orderDetailRepository;

    constructor(orderRepository) {
        this.#orderRepository = orderRepository;
        this.#productRepository = new ProductRepository();
        this.#customerRepository = new CustomerRepository();
        this.#orderDetailRepository = new OrderDetailRepository();
    }

    async getAllOrders() {
        const query = 'SELECT o.id AS id, o.customer_id as customer_id,\n' +
            'c.name AS customer_name, o.total_paid AS total_paid, (SELECT SUM(quantity * price) FROM orders_detail WHERE order_id = o.id) AS total, o.created_at AS created_at, o.updated_at AS updated_at\n' +
            'FROM orders AS o\n' +
            'INNER JOIN customers as c ON o.customer_id = c.id ORDER BY o.created_at DESC';

        return await this.#orderRepository.getAll(query);
    }

    getAddOrder(request){
        const value = validate(orderSchema.getOrderSchema,request);

        const {row} = value;
        return row;
    }

    async getAllProducts(){
        const query = 'SELECT * FROM products ORDER BY name ASC';
        return await this.#productRepository.getAll(query);
    }

    async getAllCustomers(){
        const query = 'SELECT * FROM customers ORDER BY name ASC';
        return await this.#customerRepository.getAll(query);
    }

    async addOrder(request){
        const dataOrderJson = [];
        for (const dataJsonKey in request) {
            dataOrderJson.push(request[dataJsonKey]);
        }
        const customer_id = dataOrderJson[0];
        dataOrderJson.shift();

        const data = [];
        for (let i = 0; i < dataOrderJson.length; i++) {
            if ((i+1) % 3 === 0) {
                const order = {};
                order['product_id'] = dataOrderJson[i-2];
                order['quantity'] = dataOrderJson[i-1];
                order['price'] = dataOrderJson[i];
                data.push(order);
            }
        }
        const dataProductsId = [];
        const dataOrder = [];
        //Validate data
        for (const requestElement of data) {
            const {product_id, quantity, price} = validate(orderSchema.addOrderSchema, requestElement);

            const result = await this.#productRepository.getById(product_id);
            if (result.length === 0) throw new NotFoundError('Add order fail, product not found');
            const [product] = result;

            if (quantity > product.stock){
                throw new InvariantError('Add order fail, quantity wrong. Must quantity < stock');
            }
            dataProductsId.push(product_id);
            dataOrder.push({product_id, quantity, price, restOfStock:product.stock - quantity});
        }

        //Check row not duplicate
        if (dataProductsId.length !== new Set(dataProductsId).size){
            throw new InvariantError('Add order fail, products cannot duplicate');
        }

        const conn = await pool.getConnection();
        try {
            await conn.beginTransaction();

            const orderId = `order-${nanoid(10)}`
            const order = new Order(orderId, customer_id);
            // add order
            await this.#orderRepository.save(order);

            // Add order detail
            for (const orderElement of dataOrder) {
                const orderDetail = new OrderDetail(orderId,orderElement.product_id,orderElement.quantity,orderElement.price);
                await this.#orderDetailRepository.save(orderDetail);

                await this.#productRepository.updateStock(orderElement.product_id,orderElement.restOfStock);
            }

            await conn.commit();
            return 'Successfully added order';
        }catch (e) {
            await conn.rollback();
            throw e;
        }finally {
            conn.release();
        }
    }

    async getDetailOrderById(id){
        const result = await this.#orderRepository.getById(id);
        if (result.length === 0){
            throw new NotFoundError('No order found.');
        }
        const [order] = result;

        const allOrderDetail = await this.#orderDetailRepository. getDetailOrderByOrderId(id);

        return {order, detailOrder: allOrderDetail}
    }

    async getOrdersByDate(request){
        const value = validate(orderSchema.getOrdersByDateSchema, request);

        let {start, end} = value;

        start = start.toISOString().split('T')[0] + ' 00:00:00';
        end = end.toISOString().split('T')[0] + ' 23:59:59';

        const query = `SELECT o.id AS id, o.customer_id AS customer_id, c.name AS customer_name, o.total_paid AS total_paid, (SELECT SUM(quantity * price) FROM orders_detail WHERE order_id = o.id) AS total, o.created_at AS created_at, o.updated_at AS updated_at FROM orders AS o INNER JOIN customers c ON o.customer_id=c.id WHERE o.created_at>= '${start}' AND o.created_at<='${end}' ORDER BY created_at DESC`;

        return await this.#orderRepository.getAll(query);
    }

    async getOrdersByKeyword(request){
        const {keyword} = validate(orderSchema.getOrdersByKeyword, request);

        const query = `SELECT o.id AS id, o.customer_id AS customer_id, c.name AS customer_name, o.total_paid AS total_paid, (SELECT SUM(quantity * price) FROM orders_detail WHERE order_id = o.id) AS total, o.created_at AS created_at, o.updated_at AS updated_at FROM orders AS o INNER JOIN customers c ON o.customer_id=c.id WHERE LOWER(o.id) LIKE '${keyword}' OR LOWER(o.customer_id) LIKE '%${keyword}%' OR LOWER(c.name) LIKE '%${keyword}%' ORDER BY created_at DESC`;

        return await this.#orderRepository.getAll(query);
    }

    async deleteOrder(id){
        await this.checkOrderExist(id);
        const orderDetail = await this.#orderDetailRepository.getDetailOrderByOrderId(id);

        for (const orderDetailElement of orderDetail) {
            const [product] = await this.#productRepository.getById(orderDetailElement.product_id);
            await this.#productRepository.updateStock(product.id,product.stock + orderDetailElement.quantity);
        }

        return await this.#orderRepository.delete(id);
    }

    async updateOrderById(id, request){
        const {total_paid} = validate(orderSchema.updateOrderSchema, request);
        const order = await this.checkOrderExist(id);

        // Check total_paid
        const {total} = await this.#orderDetailRepository.getTotalOrderById(order.id);
        console.log(total, total_paid)
        if (total_paid > total){
            throw new InvariantError('Total paid wrong. Total paid <= Total')
        }
        const orderUpdate = new Order(order.id,order.customer_id,order.created_at,order.updated_at,total_paid);
        return await this.#orderRepository.update(orderUpdate);
    }

    async getTotalPaidOrdersInWeek(){
        const dates = ['SUBDATE(NOW(), INTERVAL 5 DAY )','SUBDATE(NOW(), INTERVAL 4 DAY )','SUBDATE(NOW(), INTERVAL 3 DAY )','SUBDATE(NOW(), INTERVAL 2 DAY )','SUBDATE(NOW(), INTERVAL 1 DAY )','NOW()'];

        const totalPaidDates = [];
        for (const date of dates) {
            const {totalPaid} = await this.#orderRepository.getTotalPaidByDate(date);
            totalPaidDates.push(totalPaid ? totalPaid : 0);
        }

        return totalPaidDates;
    }

    async getTotalSalesInWeek(){
        const dates = ['SUBDATE(NOW(), INTERVAL 5 DAY )','SUBDATE(NOW(), INTERVAL 4 DAY )','SUBDATE(NOW(), INTERVAL 3 DAY )','SUBDATE(NOW(), INTERVAL 2 DAY )','SUBDATE(NOW(), INTERVAL 1 DAY )','NOW()'];

        const totalSalesDates = [];
        for (const date of dates) {
            const {total} = await this.#orderRepository.getTotalSaleByDate(date);
            totalSalesDates.push(total ? total : 0);
        }
        return totalSalesDates;
    }

    async checkOrderExist(id){
        const result = await this.#orderRepository.getById(id);
        if (result.length === 0){
            throw new NotFoundError('No order found.');
        }

        return result[0];
    }
}

export default OrderService;
