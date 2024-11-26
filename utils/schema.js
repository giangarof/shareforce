import Joi from 'joi'

const postSchema = Joi.object({
    post: Joi.object({
        title: Joi.string().required(),
        description: Joi.string().required(),
        //image: Joi.string().required(),
    }).required(),
    deleteImages: Joi.array()
});

const reviewSchema = Joi.object({
    review: Joi.object({
        body: Joi.string().required()
    }).required()
});

export {
    postSchema, reviewSchema
}