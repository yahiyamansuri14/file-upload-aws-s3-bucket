const mongoose = require('mongoose')
const Schema = mongoose.Schema

const userSchema = new Schema({
    name:String,
    age:Number
})

const UserModel = mongoose.model('User', userSchema)

module.exports = UserModel