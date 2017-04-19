const express = require('express');
const router = express.Router();
const passport = require('passport');

const Paper = require('../db/Paper.js');

/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('index.hbs', {title: 'Express'});
});

/* GET a Paper by its id */
router.get('/papers/:id', isLoggedIn, function (request, response) {
	let requestedPaper = new Paper(request.params.id);

	// Fetch the requested paper. Respond with data about the paper.
	//  If there is an error, catch it and report it.
	requestedPaper.fetch().then(function() {
		response.send(requestedPaper.id + " " + requestedPaper.title);
	}).catch(function(error) {
		response.send(error);
	});
});

/* GET a Paper's keywords by its id */
router.get('/papers/:id/keywords', isLoggedIn, function (request, response) {
	let requestedPaperKeywords = new PaperKeywords(request.params.id);

	console.log("REQUEST PAPER BY ID");

	// Fetch the requested paper. Respond with data about the paper.
	//  If there is an error, catch it and report it.
	requestedPaperKeywords.fetch().then(function() {
		console.log("FETCHED PAPER BY ID");
		response.send(requestedPaperKeywords.paperId + " " + requestedPaperKeywords.keywords);
	}).catch(function(error) {
		response.send(error);
	});
});

router.get('/login', function (req, res) {
	res.render('login.hbs', {message: req.flash('loginMessage')});
});

router.post('/login', passport.authenticate('local-login', {
	successRedirect: '/profile',
	failureRedirect: '/login'
}));

router.get('/profile', isLoggedIn, function (req, res) {
    res.render('profile.hbs', {user: req.user});
});

router.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/');
});

router.get('/signup', function(req, res) {
	if (req.isAuthenticated()) {
		res.redirect('/');
	} else {
        res.render('signup.hbs', {message: req.flash('signupMessage')});
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

module.exports = router;
