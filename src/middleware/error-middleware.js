import ClientError from "../exception/ClientError.js";

export default function middleware(error, req, res, next) {
    console.error(error.message);
    if (error instanceof ClientError) {
        return res.status(error.statusCode).send({
            status: 'fail',
            message: error.message,
        });
    }

    return res.status(500).send({
        status: 'fail',
        message: 'Internal Server Error',
    });
}