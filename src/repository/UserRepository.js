import pool from "../database/pool.js";

class UserRepository {
    async save(user){
        const conn = await pool.getConnection();
        try {
            const [result] = await conn.execute('INSERT INTO `users`(id,email,password,name,updated_at) VALUES(?,?,?,?,NOW())',[user.id, user.email,user.password,user.name]);

            return result;
        }finally {
            conn.release();
        }
    }

    async getById(id){
        const conn = await pool.getConnection();

        try {
            const [result] = await conn.execute('SELECT id,email,name FROM `users` WHERE id = ?',[id]);

            return result;
        }finally {
            conn.release();
        }
    }

    async getByEmail(email){
        const conn = await pool.getConnection();

        try {
            const [result] = await conn.execute('SELECT * FROM `users` WHERE email = ?',[email]);

            return result;
        }finally {
            conn.release();
        }
    }

}

export default UserRepository;
