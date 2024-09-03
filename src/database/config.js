export default {
    host: process.env.HOST,
    user: process.env.USER,
    password: process.env.PASSWORD,
    database: process.env.NODE_ENV !== 'test' ? process.env.DATABASE : process.env.DATABASE_TEST,
    port: process.env.PORT_DATABASE,
}