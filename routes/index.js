const express = require('express');
const router = express.Router();
const passport = require('passport');

const Paper = require('../db/Paper');
const PaperKeywords = require('../db/PaperKeywords');
const BusinessIndex = require('../business/BusinessIndex');
const Business = new BusinessIndex();

// RowDataPacket {
//		id: 5,
//		firstName: 'userlast',
//		lastName: 'userfirst',
//		email: 'username@rit.edu',
//		role: 's',
//		password: '$2a$10$iCpK/QanLJPpBxByKyIim.KG4Y6whGoCHJLFgzZX.k3nhIP/HH3Ha'
// }

/* GET home page. */
router.get('/', (req, res) => {
    if (req.isAuthenticated()) {
        res.redirect('/papers');
    } else {
        res.redirect('/login');
    }
});

router.get('/login', (req, res) => {

    if (req.isAuthenticated()) {
        res.redirect('/papers');
    } else {
        res.render('login', {hideNav: true, message: req.flash('loginMessage')});
    }
});

router.post('/login', passport.authenticate('local-login', {
    //Changed to papers to view papers
    successRedirect: '/papers',
    failureRedirect: '/login',
    failureFlash: true
}));

router.get('/profile', isLoggedIn, (req, res) => {
    res.render('profile', {user: req.user});
});

router.post('/submit', isLoggedIn, checkRole(['a', 'f']), (req, res) => {

    let title = req.body.title;
    let abstract = req.body.abstract;
    let citation = req.body.citation;

    console.dir({title: title, abstract: abstract, citation: citation});

    let Business = new BusinessIndex();

    Business.submitPaper(title, abstract, citation).then(resultSet => {

        console.dir(resultSet);
        res.render('submit', {title: "Paper Submission", user: req.user});
    }).catch(error => {

        console.dir(error);
        res.redirect('/');
    });
});

router.get('/submit', isLoggedIn, checkRole(['a', 'f']), (req, res) => {
    res.render('submit', {title: "Paper Submission", user: req.user})
});

router.get('/papers', (req, res) => {

    Business.getAllPapers().then(resultSet => {

        res.render('papers', {title: "Papers Page", user: req.user, papers: resultSet});
    }).catch(error => {

        console.dir(error);
        res.render('papers', {title: "Papers Page", user: req.user, papers: [], hideNav: true});
    });
});

router.get('/paper/:id', isLoggedIn, (req, res) => {
    let id = req.params.id;
    let admin = false;
    if(req.isAuthenticated()) {
        if (req.user.role === 'a') {
            admin = true;
        }
    }
    Business.getPaper(id).then(result => {
        console.dir(result);
        res.render('paper', {paper: result, admin: admin});
    }).catch(error => {
        console.dir(error);
        res.status(500);
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

router.get('*', (req, res) => {
    res.render('404');
});

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated())
        return next();
    res.redirect('/');
}

function checkRole(role) {
    return (req, res, next) => {

        if (typeof role === "string" && role === req.user.role) {
            next();
        } else if (typeof role === "object" && role.includes(req.user.role)) {
            next();
        } else {
            res.redirect(401, '/');
        }
    };
}

module.exports = router;
