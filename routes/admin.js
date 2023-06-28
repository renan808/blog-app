// admin panel routes

const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const Category = require('../models/Category')
const Post = require('../models/Post')
const is_admin = require('../helpers/verifyadm')
const passport = require('passport')



router.get('/', is_admin, (req, res) => {
    // admin page
    res.render('./admin/index')
})

router.get('/categories', is_admin, (req, res) => {
    //showing categories on screen
    Category.find().sort({date: 'desc'}).lean().then((cat) => {
        res.render("admin/categories", {categorys: cat})
    }).catch((err) => {
        req.flash("error_msg")
        res.redirect("/admin")
    })
})

router.get('/categories/add', is_admin, (req, res) => {
    // page for admins add categories
    res.render('admin/addcategories')
})

router.post('/categories/new', is_admin, (req, res) => {
    //creating a new categorie

    let error = []

    if (!req.body.name || req.body.name.length <= 1) {
        error.push({text: 'Small or Empty Name'})

}  if (!req.body.slug || req.body.slug.length <= 1) {
        error.push({text:'Small or Empty Slug'})

}  if (error.length > 0) {
        res.render('admin/addcategories', {erros: error})

} else {
    new Category({
        name: req.body.name,
        slug: req.body.slug.replaceAll(' ', '-')
    }).save().then(() => {
        req.flash("success_msg", "Categorie added successfully")
        res.redirect('/admin/categories')
    }).catch((err) => {
        req.flash("error_msg", "there was an error saving the Categorie")
        res.redirect('/admin')
    })
}
})

router.get('/category/edit/:id', is_admin, (req, res) => {
    Category.findOne({_id: req.params.id}).lean().then((category) => {
        console.log(category)
        res.render('admin/editcategory', {category: category})}).catch(() => {
        req.flash('error_msg', 'this Categorie does not exist')
        res.redirect('/admin/categories')
    })
})

router.post('/category/edited', is_admin, (req, res) => {

    //checking if categorie can be edited
        let error = []

        if (!req.body.name) {
            error.push('no name for edit')
        }

        if (req.body.name.length < 2) {
            error.push('name is very small')
        }

        if (!req.body.slug) {
            error.push('no slug for edit')
        }

        if (req.body.slug.length < 2) {
            error.push('slug is very small')
        }

        if (error.length > 0) {
            req.flash("error_msg", 'erro to edit categorie, ' + error.slice(0, 1))
            res.redirect('/admin/categories')
        }

        else {
            Category.findOneAndUpdate({_id: req.body.id}, 
                {name: req.body.name, slug: req.body.slug.replaceAll(' ', '-')}).then(() => {
                    req.flash("success_msg", 'Categorie edited succesfully')
                    res.redirect('/admin/categories')
                }).catch((err) => {
                    res.redirect('/admin/categories')
                    console.log("error to edit categorie" + err)
                })}})

router.post("/category/delete", is_admin, (req, res) => {
    //deleting categorie

    Category.findOneAndDelete({_id: req.body.id}).then(() => {
        console.log(req.body.id)
        req.flash("success_msg", "categorie as been deleted")
        res.redirect("/admin/categories")
    }).catch((err) => {
        console.log(err)
        req.flash("error_msg", "No deleted")
        res.redirect('/admin/categories')
    })
})


router.get("/posts", is_admin, (req, res) => {
    //showing posts on screen

    Post.find().sort({date: 'desc'}).lean().then((post) => {
        res.render('admin/posts', {posts: post})
    }).catch((err) => {
        res.redirect('/')
    })
})

router.get('/post/add', is_admin, (req, res) => {
    //add post

    Category.find().lean().then((cat) => {
        res.render('admin/add-post', {categorys: cat})
    })
})

router.post('/posts/added', is_admin, (req, res) => {
    //checking and creating post

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
        res.render("admin/add-post", {errors: error[0]})

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
            res.redirect("/admin/posts")
        }).catch(() => {
            console.log("erro")
            req.flash("error_msg", "Error adding post")
            res.redirect("/admin/posts")
        })
        
    }

})

router.post('/post-delete', is_admin, (req, res) => {
    //deleting post

    Post.findOneAndDelete({_id: req.body.id}).then(() => {
        console.log("Post deleted")
        req.flash("success_msg", "Post deleted")
        res.redirect('/admin/posts')
    }).catch((err) => {
        console.log("erro " + err)
        req.flash("error_msg", "error adding post")
        res.redirect('/')
    })
})

router.get("/post-edit/:id", is_admin, (req, res) => {
    //editing post

    Category.find().lean().then((cat) => {
        Post.findOne({_id: req.params.id}).lean().then((post) => {
            res.render('admin/post-edit', {post: post, cat: cat})
        }).catch(() => {
            req.flash("error_msg", "post not found")
            res.redirect('/admin/posts')
    })})})

router.post("/post-edited", is_admin, (req, res) => {
    //checking and editing post

    let error = []
    
    if (!req.body.title || req.body.title.length < 1) {
        error.push('Empty or small title')
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
        res.render('admin/post-edit', {errors: error[0]})
        console.log(error[0])

    }

    else {
        Post.findOneAndUpdate({_id: req.body.post},
            {
                title: req.body.title,
                content: req.body.content,
                description: req.body.desc,
                category: req.body.select,
                slug: req.body.slug.replaceAll(' ', '-')
            }).then(() => {
                console.log('post edited')
                req.flash("success_msg", "successfully edited post")
                res.redirect('/admin/posts')
            }).catch((err) => {
                console.log(err)
                res.redirect('/admin/posts')
            })

    }
})


module.exports = router