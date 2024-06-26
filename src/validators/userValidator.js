import Joi from "joi";

export const validateUserLogin = (req, res, next) => {

    const schema = Joi.object({
        email: Joi.string().min(3).max(30).required(),
        password: Joi.string().min(8).required()
    });

    const { error } = schema.validate(req.body);

    if (error) {
        console.log("error details", error.details);
        return res.status(400).send(error.details[0].message);
    }

    next();

};