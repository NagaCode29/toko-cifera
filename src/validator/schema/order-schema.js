import Joi from "joi";

export default {
    getOrderSchema : Joi.object({
        row : Joi.number().integer().min(1).required(),
    }),
    addOrderSchema: Joi.object({
        product_id: Joi.string().trim().required(),
        quantity: Joi.number().integer().min(1).required(),
        price: Joi.number().integer().min(1).required(),
    }),
    updateOrderSchema:Joi.object({
        total_paid: Joi.number().integer().min(0).required(),
    }),
    getOrdersByDateSchema: Joi.object({
        start: Joi.date().required(),
        end: Joi.date().required(),
    }),
    getOrdersByKeyword: Joi.object({
        keyword: Joi.string().trim().allow('')
    })
}