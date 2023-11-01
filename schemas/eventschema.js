const Joi = require('joi');

module.exports.eventschema = Joi.object({
    Event: Joi.object({
        date: Joi.date().required(),
        img: Joi.string().required(),
        description: Joi.string().required(),
        venue: Joi.string().required()
    }).required()
});
