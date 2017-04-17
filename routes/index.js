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

module.exports = router;
