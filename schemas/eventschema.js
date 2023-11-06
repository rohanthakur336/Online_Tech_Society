const Joi = require('joi');

module.exports.eventschema = Joi.object({
    Event: Joi.object({
        start_date: Joi.date().required(),
        end_date: Joi.date().required(),
        img: Joi.any().required(),
        description: Joi.string().required(),
        venue: Joi.string().required()
    }).required()
});
