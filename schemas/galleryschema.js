const Joi = require('joi');

module.exports.gallerySchema = Joi.object({
    Gallery: Joi.object({
        image: Joi.string().base64().required(),
        description: Joi.string().required()
    })
});
