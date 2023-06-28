const express = require('express')
const mongoose = require('mongoose')
const passport = require('passport')
const bcrypt = require('bcryptjs')
var LocalStrategy = require('passport-local')
const User = require('../models/User')

function veriffy () {
    passport.use(new LocalStrategy({usernameField: 'username'}, (username, password, done) => {
        User.findOne({user_name: username})

    }))

}

module.exports = veriffy()
