const mongoose = require("mongoose")

const registerSchema = new mongoose.Schema({
    email:{
        type: String,
         required: true
    }, 
    password:{
        type: String,
        required: true
    }
})

const registerModel = mongoose.model("register" , registerSchema)

module.exports = registerModel