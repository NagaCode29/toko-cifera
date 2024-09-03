import Joi from "joi";

export default {
    addCustomerSchema: Joi.object({
        name: Joi.string().trim().min(4).required(),
        phone: Joi.string().trim().allow(''),
        address: Joi.string().trim().allow(''),
    }),
    updateCustomerSchema: Joi.object({
        name: Joi.string().trim().min(4).required(),
        phone: Joi.string().trim().allow(''),
        address: Joi.string().trim().allow(''),
    }),
    searchCustomersByDateSchema: Joi.object({
        start: Joi.date().required(),
        end: Joi.date().required(),
    }),
    searchCustomersByKeywordSchema: Joi.object({
        keyword: Joi.string().trim().allow(''),
    }),
    searchOrdersCustomerByDateSchema: Joi.object({
        start: Joi.date().required(),
        end: Joi.date().required(),
    })
}