const Joi = require('joi');

module.exports.memberschema = Joi.object({
    Member: Joi.object({
        image: Joi.string().required(),
        name: Joi.string().min(2).max(100),
        designation:Joi.string().required(),
        description: Joi.string().required()
    }).required()
});