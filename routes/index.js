const express = require('express');
const router = express.Router();
const passport = require('passport');

const Paper = require('../db/Paper');
const PaperKeywords = require('../db/PaperKeywords');
const BusinessIndex = require('../business/BusinessIndex');

/* GET home page. */
router.get('/', (req, res) => {
    res.redirect('/login');
});

router.get('/login', (req, res) => {

    if(req.isAuthenticated()) {
        res.redirect()
    } else {
        res.render('login', {hideNav: true, message: req.flash('loginMessage')});
    }
});

router.post('/login', passport.authenticate('local-login', {
    //Changed to index to view papers
    successRedirect: '/index',
    failureRedirect: '/login',
    failureFlash: true
}));

router.get('/profile', isLoggedIn, (req, res) => {
    res.render('profile', {user: req.user});
});

router.get('/index', isLoggedIn, (req, res) => {

    let Business = new BusinessIndex();

    let papers = Business.getAllPapers().then(resultSet => {

        res.render('index', {title: "Papers Page", user: req.user, papers: resultSet});
    }).catch(error => {

        console.dir(error);
        res.render('index', {title: "Papers Page", user: req.user, papers: [], hideNav: true});
    });


});

router.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/');
});

router.get('/signup', (req, res) => {
    if (req.isAuthenticated()) {
        res.redirect('/');
    } else {
        res.render('signup', {message: req.flash('signupMessage')});
    }
});

router.post('/signup', passport.authenticate('local-signup', {
    successRedirect: '/profile',
    failureRedirect: '/signup',
    failureFlash: true,
}));

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated())
        return next();
    res.redirect('/');
}

function checkRole(role) {
    return (req, res, next) => {
        if(req.user.role === role) {
            next();
        } else {
            res.redirect(401, '/');
        }
    }
}

module.exports = router;
