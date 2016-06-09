'use strict'
var mongoose = require('mongoose')
var bcrypt = require('bcrypt')
var jwt = require('jsonwebtoken')

var userSchema = mongoose.Schema({
  username: {type : String, unique : true, required : true, dropDups: true},
  name: String,
  password: {type: String, required: true}
})

userSchema.pre('save', function(next) {
  this.password = bcrypt.hashSync(this.password, bcrypt.genSaltSync(10))
  next()
})

userSchema.methods.generateToken = function() {
  return jwt.sign({_id: this._id}, process.env.SECRET || 'secrets')
}

userSchema.methods.compareHash = function(pass, hash) {
  return bcrypt.compareSync(pass, hash)
}

var User = mongoose.model('User', userSchema)

module.exports = User
