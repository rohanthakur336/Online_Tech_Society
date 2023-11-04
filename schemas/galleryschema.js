const Joi = require('joi');

module.exports.GallerySchema = Joi.object({
    Galley: Joi.object({
        image: Joi.binary().required(),
    }).required()
});
