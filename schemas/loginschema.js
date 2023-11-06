const Joi = require('joi');

module.exports.loginSchema = Joi.object({
    log: Joi.object({
        username: Joi.string().required(),
        password: Joi.string().required(),
        role: Joi.string().valid('admin', 'head', 'member', 'visitor').default('visitor'),
    }).required()
});

