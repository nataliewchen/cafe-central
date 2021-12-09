const BaseJoi = require('joi');
const sanitizeHtml = require('sanitize-html');

// adding another function that we can apply to our fields to prevent injection
const extension = (joi) => ({
    type: 'string',
    base: joi.string(),
    messages: {
        'string.escapeHTML': '{{#label}} must not include HTML!'
    },
    rules: {
        escapeHTML: {
            validate(value, helpers) {
                const clean = sanitizeHtml(value, {
                    allowedTags: [],
                    allowedAttributes: {},
                });
                if (clean !== value) return helpers.error('string.escapeHTML', {value})
                return clean;
            }
        }
    }
});

const Joi = BaseJoi.extend(extension); // now we can use our new method


module.exports.cafeSchema = Joi.object({
    cafe: Joi.object({
        name: Joi.string().required().escapeHTML(),
        location: Joi.string().required().escapeHTML(),
        website: Joi.string().required().escapeHTML(),
        phone: Joi.string().required().escapeHTML(),
        price: Joi.number().required(),
        categories: Joi.array().items(Joi.string().valid('Coffee', 'Boba', 'Bakery').escapeHTML()).single()
    }).required(),
    deleteImages: Joi.array()
});



module.exports.reviewSchema = Joi.object({
    review: Joi.object({
        headline: Joi.string().required().escapeHTML(),
        body: Joi.string().required().escapeHTML(),
        rating: Joi.number().required().min(1).max(5)
    }).required()
});