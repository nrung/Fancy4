const express = require('express');
const router = express.Router();

const Paper = require('../db/Paper.js');

/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('index', {title: 'Express'});
});

/* GET a Paper by its id */
router.get('/Papers/:id', function (request, response) {
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
router.get('/papers/:id/keywords', function (request, response) {
	let requestedPaperKeywords = new PaperKeywords(request.params.id);

	// Fetch the requested paper. Respond with data about the paper.
	//  If there is an error, catch it and report it.
	requestedPaperKeywords.fetch().then(function() {
		response.send(requestedPaperKeywords.paperId + " " + requestedPaperKeywords.keywords);
	}).catch(function(error) {
		response.send(error);
	});
});


router.post('/login',
    passport.authenticate('local', { failureRedirect: '/login' }),
    function(req, res) {
        res.redirect('/');
    });

module.exports = router;
