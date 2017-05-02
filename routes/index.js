const express = require('express');
const router = express.Router();
const passport = require('passport');

const Paper = require('../db/Paper');
const PaperKeywords = require('../db/PaperKeywords');

/* GET home page. */
router.get('/', (req, res, next) => {
    res.redirect('/login');
});

router.get('/login', (req, res) => {
    if(req.isAuthenticated()) {
        res.redirect()
    } else {
        res.render('login', {message: req.flash('loginMessage')});
    }
});

router.post('/login', passport.authenticate('local-login', {
    successRedirect: '/profile',
    failureRedirect: '/login',
    failureFlash: true
}));

router.get('/profile', isLoggedIn, (req, res) => {
    res.render('profile', {user: req.user});
});

router.get('/papers', isLoggedIn, (req, res) => {
    res.render('profile', {user: req.user});
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
