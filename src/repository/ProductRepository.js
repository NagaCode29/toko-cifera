import pool from "../database/pool.js";

class ProductRepository{

    async getById(id){
        const conn = await pool.getConnection();
        try{
            const [result] = await conn.execute('SELECT * FROM products WHERE id=?',[id]);

            return result;
        }finally {
            conn.release()
        }
    }

    async getAll(query){
        const conn = await pool.getConnection();
        try{
            const [result] = await conn.execute(query);

            return result;
        }finally {
            conn.release()
        }
    }

    async save(product){
        const conn = await pool.getConnection();
        try{
            const [result] = await conn.execute(`INSERT INTO products(id,name,stock) VALUES(?,?,?)`,[product.id,product.name, product.stock]);

            return result;
        }finally {
            conn.release()
        }
    }

    async update(idOld,product){
        const conn = await pool.getConnection();
        try{
            const [result] = await conn.execute(`UPDATE products SET id=?, name=?, stock=?, updated_at=NOW() WHERE id=?`,[product.id,product.name,product.stock, idOld]);

            return result;
        }finally {
            conn.release()
        }
    }

    async delete(id){
        const conn = await pool.getConnection();
        try{
            const [result] = await conn.execute(`DELETE FROM products WHERE id=?`,[id]);

            return result;
        }finally {
            conn.release()
        }
    }

    async updateStock(id, stock){
        const conn = await pool.getConnection();
        try{
            const [result] = await conn.execute(`UPDATE products SET stock=? WHERE id=?`,[stock, id]);

            return result;
        }finally {
            conn.release()
        }
    }


}

export default ProductRepository;