const Joi = require("joi");

// schema for Create API
const schemaSignUp = Joi.object({
    name : Joi.string().trim().regex(/^(?=.*[A-Z])(?=.*[a-z])[A-Za-z]+(?: [A-Za-z]+)?$/).min(4).max(20).required().messages({
        'string.pattern.base': 'Invalid name format',
        'string.min': 'name length min 4, max 20 characters',
        'string.max': 'name length min 4, max 20 characters',
        'string.empty': 'required field',
        'any.required': 'name is required',
    }),
    email: Joi.string().email().required().messages({
        'string.email': 'Invalid email format',
        'string.empty': 'required field',
        'any.required': 'email is required',
    }),
    password : Joi.string().regex(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]+$/).min(8).required().messages({
        'string.pattern.base': 'Password must include uppercase, lowercase and a number',
        'any.required': 'password is required',
        'string.min': 'password length more than 8 characters',
        'string.empty': 'required field'
    }),
    role : Joi.string().valid('USER', 'MANAGER').messages({
        'any.only': 'role must be either USER or MANAGER'
    })
});
// validator for Create API
const validator =(payload) =>{
    return schemaSignUp.validateAsync(payload,{abortEarly : false});
};

// schema for Update API
const updateSchema = Joi.object({
    name : Joi.string().regex(/^[a-zA-Z ]+$/).min(4).max(20).required(),
    email: Joi.string().email(),
    password : Joi.string().required(),
    role : Joi.string()
}).min(1);
// Validator for Update API
const UpdateValidator = (payload) =>{
    return updateSchema.validateAsync(payload, {abortEarly : false});
};

// schema for Id
const idSchema = Joi.object({
    Id : Joi.number().integer().positive().required()
});
// Validator for Id
const idValidator = (payload) =>{
    return idSchema.validateAsync(payload);
};

module.exports = {validator, UpdateValidator, idValidator};