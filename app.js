//post blog with admin authentications

const express = require('express')
const handlebars = require('express-handlebars')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const app = express()
const admin = require('./routes/admin')
const path = require('path')
const session = require('express-session')
const flash = require('connect-flash')
const Post = require('./models/Post')
const Category = require('./models/Category')
const passport = require('passport')
const auth = require('./passport/auth')
const User = require('./routes/users')
const db = require('./config/db')



//session settings
app.use(session({
    secret: 'senha123x',
    resave: true,
    saveUninitialized: true,
}))

//middleware and global variables
app.use(passport.initialize())
app.use(passport.session())
app.use(flash())
app.use((req, res, next) => {
    app.locals.success_msg = req.flash("success_msg")
    app.locals.error_msg = req.flash("error_msg")
    app.locals.error = req.flash("error")
    app.locals.user = req.user || false
    next()
})

//settings
app.use(express.urlencoded({extended: true}))
app.use(express.json())
app.engine('handlebars', handlebars.engine({defaultLayout: 'main'}))
app.set('view engine', 'handlebars')
app.use(express.static(path.join(__dirname +'/public')))


//mongo
mongoose.Promise = global.Promise;
mongoose.connect(db.mongoURI).then(() => {
    console.log("connect")
}).catch(() => {
    console = log("Error connect db")
})



//routes

app.use('/admin', admin)
app.use('/users', User)


app.get('/', (req, res) => {
    Post.find().populate('category').lean().sort({date: "desc"}).limit(2).then((posts) => {
        res.render('index', {posts: posts})
    })
})

app.get('/posts', (req, res) => {
    Post.find().lean().sort({date: "desc"}).then((posts) => {
        res.render('all_posts', {posts: posts})
    }).catch((err) => {
        console.log(err)
        req.flash("error_msg", "erro to load posts")
        res.redirect('/')

    })
})
app.get('/posts/:slug', (req, res) => {
    Post.find({slug: req.params.slug}).lean().then((post) => {
        res.render('specific_post', {post: post})
    }).catch((err) => {
        console.log(err)
        req.flash("error_msg", "error to load this post")
        res.redirect('/')

    })
})

app.get('/categorys', (req, res) => {
    Category.find().lean().sort({date: "desc"}).then((cat) => {
        res.render('all_categorys', {category: cat})
    }).catch((err) => {
        req.flash("error_msg", "error to render categorys page")
        res.redirect('/404')
        console.log(err)
    })
})

app.get('/categorys/:slug', (req, res) => {
    Category.findOne({slug: req.params.slug}).lean().then((cat) => {
        Post.find({category: cat._id}).lean().then((posts) => {
            res.render('specific_category', {category: cat, posts: posts})
        }).catch((err) => {
            console.log(err)
            req.flash("error_msg", "erro to load this category")
            res.redirect('/')
        })
    })
})

//starting the server
const PORT = process.env.PORT || 8089
app.listen(PORT,() => {
    
})