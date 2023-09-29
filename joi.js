const joi = require('joi');


//joi schema
const signupSchema = joi.object({
    name: joi.string().required(),
    username: joi.string().min(3).max(15).required(),
    password: joi.string().required()
})

//validation middleware
exports.validateSignup = (req, res, next)=>{
    const {error} = signupSchema.validate(req.body);

    if(error){
        const errorMessage = error.details.map((detail)=> detail.message).join(', ')
        console.log(errorMessage)
        return res.status(400).json({message: `There is an error: ${errorMessage}`})
    }

    next();
}

//login schema
const loginSchema = joi.object({
    username: joi.string().min(3).max(15).required(),
    password: joi.string().required()
})

//login validator
exports.loginValidator = (req, res, next)=>{
    const {error} = loginSchema.validate(req.body)

    if(error){
        const errorMessage = error.details.map((detail)=> detail.message).join(', ')
        console.log(errorMessage)
        return res.status(400).json({message: `There is an error: ${errorMessage}`})
    }

    next();
};