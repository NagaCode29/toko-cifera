import pool from "../database/pool.js";

class CustomerRepository {
    async save(customer){
        const conn = await pool.getConnection();
        try{
            const [result] = await conn.execute('INSERT INTO `customers`(id,name,phone,address) VALUES(?,?,?,?)',[customer.id,customer.name,customer.phone,customer.address]);
            return result;
        }finally {
            conn.release();
        }
    }

    async getById(id){
        const conn = await pool.getConnection();
        try{
            const [result] = await conn.execute('SELECT * FROM `customers` WHERE id = ?',[id]);
            return result;
        }finally {
            conn.release();
        }
    }

    async getAll(query){
        const conn = await pool.getConnection();
        try{
            const [result] = await conn.execute(query);
            return result;
        }finally {
            conn.release();
        }
    }

    async update(customer){
        const conn = await pool.getConnection();
        try{
            const [result] = await conn.execute('UPDATE `customers` SET name=?, phone=?, address=?, updated_at=NOW() WHERE id=?',[customer.name,customer.phone,customer.address, customer.id]);
            return result;
        }finally {
            conn.release();
        }
    }

    async delete(id){
        const conn = await pool.getConnection();
        try{
            const [result] = await conn.execute('DELETE FROM `customers` WHERE id = ?',[id]);
            return result;
        }finally {
            conn.release();
        }
    }
}

export default CustomerRepository;
