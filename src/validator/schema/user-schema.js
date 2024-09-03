import Joi from "joi";


export default {
    addUserSchema: Joi.object({
        email: Joi.string().email().required(),
        password: Joi.string().min(8).max(255).required(),
        name: Joi.string().min(5).max(255).required(),
    }),
    loginUserSchema: Joi.object({
        email: Joi.string().email().required(),
        password: Joi.string().required(),
    })
}