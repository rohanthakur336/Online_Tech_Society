const Joi = require('joi');

module.exports.GallerySchema = Joi.object({
    Galley: Joi.object({
        image: Joi.string().required(),
        description: Joi.string().required()
    }).required()
});
