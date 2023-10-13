const Joi = require('joi');

module.exports.GallerySchema = Joi.object({
    Gallery: Joi.object({
        image: Joi.string().required(),
        // date: Joi.date().iso().required(),
        description: Joi.string().required()
    }).required()
});

