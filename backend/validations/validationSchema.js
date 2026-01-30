const Joi = require("joi");

// schema for Create API
const schemaSignUp = Joi.object({
    name : Joi.string().regex(/^[a-zA-Z ]+$/).min(4).max(20).required(),
    email: Joi.string().email().required(),
    password : Joi.string().required(),
    role : Joi.string()
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