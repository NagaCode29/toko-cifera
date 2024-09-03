import Joi from "joi";

export default {
    addProductSchema: Joi.object({
        id: Joi.string().trim().min(3).required(),
        name: Joi.string().trim().min(4).required(),
        stock: Joi.number().integer().min(1).required(),
    }),
    updateProductSchema: Joi.object({
        id: Joi.string().trim().min(3).required(),
        name: Joi.string().trim().min(4).required(),
        stock: Joi.number().integer().min(1).required(),
    }),
    searchProductsByDateSchema: Joi.object({
        start: Joi.date().required(),
        end: Joi.date().required(),
    }),
    searchProductsByKeywordSchema: Joi.object({
        keyword: Joi.string().trim().allow('')
    })
}