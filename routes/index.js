const express = require('express');
const router = express.Router();
const passport = require('passport');

const Paper = require('../db/Paper');
const PaperKeywords = require('../db/PaperKeywords');
const BusinessIndex = require('../business/BusinessIndex');

// RowDataPacket {
//     id: 5,
//         firstName: 'userlast',
//         lastName: 'userfirst',
//         email: 'username@rit.edu',
//         role: 's',
//         password: '$2a$10$iCpK/QanLJPpBxByKyIim.KG4Y6whGoCHJLFgzZX.k3nhIP/HH3Ha' }


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
router.get('/insertpaper', isLoggedIn, (req, res) => {
    res.render('insertpaper', {user: req.user});
});

router.post('/submit', isLoggedIn, (req, res) => {

    let title = req.body.title;
    let abstract = req.body.abstract;
    let citation = req.body.citation;

    let Business = new BusinessIndex();

    let papers = Business.submitPaper(title, abstract, citation).then(resultSet => {

        res.render('submit', {title: "Paper Submission", user: req.user, papers: resultSet});
    }).catch(error => {

        console.dir(error);
        res.render('submit', {title: "Paper Submission", user: req.user, papers: [], hideNav: true});
    });


});

router.get('/submit', isLoggedIn, (req, res) => {
    res.render('submit', {title: "Paper Submission", user: req.user})
});

router.get('/index', isLoggedIn, (req, res) => {
    console.dir(req.user);
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
