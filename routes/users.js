// users routes

const express = require('express')
const mongoose = require('mongoose')
const router = express.Router()
const User = require('../models/User')
const bcrypt = require('bcryptjs')
const passport = require('passport')
const Category = require('../models/Category')
const Post = require('../models/Post')


router.get('/register', (req, res) => {
    res.render('users/register')
})

router.post('/registred', (req, res) => {
    const error = []
    if (!req.body.username || req.body.username < 2) {
        error.push('empty or invalid username')
    }

    if (!req.body.password || req.body.password < 5) {
        error.push('empty or invalid password')
    }

    if (!req.body.repeat || req.body.repeat != req.body.password) {
        error.push('The passwords do not match')
    }

    if (error.length > 0) {
        req.flash('error_msg', error[0])
        res.redirect('/users/register')
    }
    else {
        User.findOne({user_name: req.body.username}).then((username) => {
            if (username) {
                req.flash('error_msg', "this username already exists")
                res.redirect('/users/register')

            }
            else {
                const n_user = new User({
                    user_name: req.body.username,
                    password: req.body.password
                })
                
                bcrypt.genSalt(10, (err, salt) => {
                    bcrypt.hash(n_user.password, salt, (err, hash) => {
                        if (err) {
                            req.flash("error_msg", "error to save user")
                            res.redirect('/users/register')
                        }

                        else {
                            n_user.password = hash
                            n_user.save().then(() => {
                                req.flash("success_msg", "Successfully Registered")
                                res.redirect('/users/login')
                            }).catch((err) => {
                                console.log(err)
                                req.flash("error_msg", "Error registering user")
                            })
                        }
                    })
                })        
            }
        })}
    })


router.get('/login', (req, res, next) => {
    res.render('users/login')
    
})

router.post('/logged', passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: 'back',
    failureFlash: true}),
    (req, res, next) => {})

router.get('/logout', (req, res, next) => {
    if (!req.user) {
        req.flash("error_msg", "You are not logged in")
        res.redirect('back')
    } else {
        req.logout((err) => {
        if (err) {return next(err)}

        req.flash("success_msg", "You are been deslogged")
        res.redirect('/')
    })}
})

router.get('/add-post', (req, res, next) => {
    Category.find().lean().then((cat) => {
        res.render('users/add-post', {categorys: cat})})
})

router.post('/post-added', (req, res, next) => {
    error = []

    if (!req.body.title || req.body.title.length < 1) {
        error.push("Small or empty Title")
    }

    if (!req.body.desc || req.body.desc.length < 2) {
        error.push("Small or empty Desc")
    }

    if (!req.body.content || req.body.content.length < 2) {
        error.push("Small or empty content")
    }

    if (!req.body.slug || req.body.slug.length < 2) {
        error.push("Small or empty slug")
    }

    if (!req.body.select || req.body.select <= 0) {
        error.push("Empty or invalid Categorie")
    }
    
    if (error.length > 0) {
        res.render("/add-post", {errors: error[0]})

    }

    else {
        new Post({
            title: req.body.title,
            content: req.body.content,
            description: req.body.desc,
            category: req.body.select,
            slug: req.body.slug.replaceAll(' ', '-')
        }).save().then(() => {
            req.flash("success_msg", "Post added")
            console.log("OK")
            res.redirect("/posts")
        }).catch(() => {
            console.log("erro")
            req.flash("error_msg", "Error adding post")
            res.redirect("/posts")
        })
        
    }

})

module.exports = router