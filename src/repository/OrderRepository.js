import pool from "../database/pool.js";

class OrderRepository{
    async getAll(query){
        const conn = await pool.getConnection();
        try{
            const [result] = await conn.execute(query);

            return result;
        }finally {
            conn.release();
        }
    }

    async getById(id){
        const conn = await pool.getConnection();
        try{
            const [result] = await conn.execute(`SELECT o.id AS id, o.customer_id as customer_id, c.name AS customer_name, o.total_paid AS total_paid, o.created_at AS created_at, o.updated_at AS updated_at, c.phone AS phone, c.address AS address FROM orders AS o INNER JOIN customers AS c ON o.customer_id = c.id WHERE o.id=?`,[id]);

            return result;
        }finally {
            conn.release();
        }
    }

    async save(order){
        const conn = await pool.getConnection();
        try{
            const [result] = await conn.execute(`INSERT INTO orders(id,customer_id) VALUES(?,?)`,[order.id, order.customer_id])

            return result;
        }finally {
            conn.release();
        }
    }

    async delete(id){
        const conn = await pool.getConnection();
        try{
            const [result] = await conn.execute(`DELETE FROM orders WHERE id=?`,[id])

            return result;
        }finally {
            conn.release();
        }
    }

    async update(order){
        const conn = await pool.getConnection();
        try{
            const [result] = await conn.execute(`UPDATE orders SET total_paid=?, updated_at=NOW() WHERE id=?`,[order.total_paid, order.id])

            return result;
        }finally {
            conn.release();
        }
    }

    async getTotalPaidByDate(date){
        const conn = await pool.getConnection();
        try{
            const [result] = await conn.execute(`SELECT SUM(orders.total_paid) AS totalPaid FROM orders WHERE DATE(created_at) = DATE(${date})`,[date]);

            return result[0];
        }finally {
            conn.release();
        }
    }

    async getTotalSaleByDate(date){
        const conn = await pool.getConnection();
        try{
            const [result] = await conn.execute(`SELECT SUM((SELECT SUM(quantity * price) FROM orders_detail WHERE order_id = orders.id)) AS total FROM orders WHERE DATE(created_at) = DATE(${date})`,[date]);

            return result[0];
        }finally {
            conn.release();
        }
    }

    async getOrdersByCustomerId(customer_id){
        const conn = await pool.getConnection();
        try{
            const [result] = await conn.execute(`SELECT * FROM orders WHERE customer_id=?`,[customer_id]);

            return result;
        }finally {
            conn.release();
        }
    }
}

export default OrderRepository;