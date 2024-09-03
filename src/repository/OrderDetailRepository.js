import pool from "../database/pool.js";

class OrderDetailRepository {
    async save(orderDetail){
        const conn = await pool.getConnection();
        try{
            const [result ] = await conn.execute(`INSERT INTO orders_detail(order_id, product_id, quantity, price) VALUES(?,?,?,?)`,[orderDetail.order_id, orderDetail.product_id, orderDetail.quantity, orderDetail.price]);

            return result;
        }finally {
            conn.release();
        }
    }

    async getDetailOrderByOrderId(order_id){
        const conn = await pool.getConnection();
        try{
            const [result] = await conn.execute(`SELECT od.order_id AS order_id, od.product_id AS product_id, p.name AS product_name, od.quantity AS quantity, od.price AS price FROM orders_detail AS od INNER JOIN products p ON od.product_id = p.id WHERE od.order_id=?`,[order_id]);

            return result;
        }finally {
            conn.release();
        }
    }

    async getTotalOrderById(order_id){
        const conn = await pool.getConnection();
        try{
            const [result] = await conn.execute(`SELECT SUM(quantity*price) AS total FROM orders_detail WHERE order_id=?`,[order_id]);

            return result[0];
        }finally {
            conn.release();
        }
    }

    async detailOrderByProductId(product_id){
        const conn = await pool.getConnection();
        try{
            const [result] = await conn.execute(`SELECT * FROM orders_detail WHERE product_id = ? `,[product_id]);

            return result;
        }finally {
            conn.release();
        }
    }
}

export default OrderDetailRepository;
