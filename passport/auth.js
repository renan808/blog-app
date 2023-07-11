// passport local config

const express = require('express')
const mongoose = require('mongoose')
const passport = require('passport')
const bcrypt = require('bcryptjs')
var LocalStrategy = require('passport-local')
const User = require('../models/User')

function veriffy () {
    passport.use(new LocalStrategy({
        usernameField: 'username',
        passwordField: 'password'
    }, (username, password, done) => {
        User.findOne({user_name: username}).then((user) => {
            if (!user) {
                console.log("a")
                return done(null, false, {message: "Invalid Username"})
            }

            bcrypt.compare(password, user.password,  (err, ok) => {
                if (ok) {
                    return done(null, user)
                }
                
                else {
                    return done(null, false, {message: "Invalid password"})
                }

            })
        })
    }))

    passport.serializeUser((user, done) => {
        done(null, user.id)
    })

    passport.deserializeUser((id, done) => {
        User.findById(id).then((user) => {
            done(null, user)
        }).catch((err) => {
            done(null, err)
        })
    })
}

module.exports = veriffy()
