import {validate} from '../helper/index.js';
import customerSchema from "../validator/schema/customer-schema.js";
import {nanoid} from "nanoid";
import Customer from "../model/Customer.js";
import NotFoundError from "../exception/NotFoundError.js";
import OrderRepository from "../repository/OrderRepository.js";
import InvariantError from "../exception/InvariantError.js";

class CustomerService {
    #customerRepository;
    #orderRepository;

    constructor(customerRepository) {
        this.#customerRepository = customerRepository;
        this.#orderRepository = new OrderRepository();
    }

    async getAllCustomers(){
        const query = 'SELECT * FROM `customers` ORDER BY created_at DESC';
        return await this.#customerRepository.getAll(query);
    }

    async addCustomer(request){
        const {name, phone, address} = validate(customerSchema.addCustomerSchema,request)
        const id = 'cus-'+nanoid(8)
        const customer = new Customer(id, name, phone, address);
        await this.#customerRepository.save(customer);
        return id;
    }

    async updateCustomer(id, request){
        await this.checkCustomer(id);
        const {name, phone, address} = validate(customerSchema.updateCustomerSchema,request);

        const customer= new Customer(id, name, phone, address);
        await this.#customerRepository.update(customer);

        return {id, name, phone, address};
    }

    async deleteCustomer(id){
        await this.checkCustomer(id);

        if (await this.checkCustomerInOrders(id)){
            throw new InvariantError('Customer cannot delete');
        }

        await this.#customerRepository.delete(id);
    }

    async searchCustomersByDate(request){
        const value = validate(customerSchema.searchCustomersByDateSchema,request);
        let {start, end} = value;

        start = start.toISOString().split('T')[0] + ' 00:00:00';
        end = end.toISOString().split('T')[0] + ' 23:59:59';

        const query = `SELECT * FROM customers WHERE created_at>= '${start}' AND created_at<='${end}' ORDER BY created_at DESC`;
        return await this.#customerRepository.getAll(query);
    }

    async searchCustomersByKeyword(request){
        const value = validate(customerSchema.searchCustomersByKeywordSchema,request);
        const {keyword} = value;

        const query = `SELECT * FROM customers WHERE LOWER(id) LIKE '%${keyword}%' OR LOWER(name) LIKE '%${keyword}%' OR phone LIKE '%${keyword}%' OR LOWER(address) LIKE '%${keyword}%' ORDER BY created_at DESC`;

        return await this.#customerRepository.getAll(query);
    }

    async getOrdersCustomersById(id){
        const customer = await this.checkCustomer(id);

        // Get orders customer
        const query = `SELECT o.id AS id, o.customer_id AS customer_id, c.name AS customer_name, o.total_paid AS total_paid, (SELECT SUM(quantity * price) FROM orders_detail WHERE order_id = o.id) AS total, o.created_at AS created_at, o.updated_at AS updated_at FROM orders AS o INNER JOIN customers c ON o.customer_id=c.id WHERE o.customer_id = '${customer.id}' ORDER BY created_at DESC`;

        const orders = await this.#orderRepository.getAll(query);
        return {customer, orders};
    }

    async getOrdersCustomerByDate(id,request){
        const customer = await this.checkCustomer(id);

        let {start, end} = validate(customerSchema.searchOrdersCustomerByDateSchema,request);

        start = start.toISOString().split('T')[0] + ' 00:00:00';
        end = end.toISOString().split('T')[0] + ' 23:59:59';

        // Get orders customer
        const query = `SELECT o.id AS id, o.customer_id AS customer_id, c.name AS customer_name, o.total_paid AS total_paid, (SELECT SUM(quantity * price) FROM orders_detail WHERE order_id = o.id) AS total, o.created_at AS created_at, o.updated_at AS updated_at FROM orders AS o INNER JOIN customers c ON o.customer_id=c.id WHERE o.created_at>='${start}' AND o.created_at<='${end}' AND o.customer_id='${customer.id}' ORDER BY created_at DESC`;

        const orders = await this.#orderRepository.getAll(query);
        return {customer, orders};
    }

    async checkCustomer(id){
        const result = await this.#customerRepository.getById(id);

        if (result.length === 0) {
            throw new NotFoundError('id is wrong, customer not found');
        }
        return result[0];
    }

    async checkCustomerInOrders(id){
        const result = await this.#orderRepository.getOrdersByCustomerId(id);

        if (result.length === 0){
            return null;
        }
        return result;
    }
}

export default CustomerService;