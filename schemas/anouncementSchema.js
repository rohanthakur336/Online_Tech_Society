const Joi = require('joi');

module.exports.anouncementSchema = Joi.object({
    anounce: Joi.object({
        send_date: Joi.date().required(),
        to: Joi.string().required(),
        from: Joi.string().required(),
        message: Joi.string().required(),
    }).required()
});