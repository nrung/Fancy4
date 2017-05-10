const express = require('express');
const router = express.Router();

const MySQLDatabase = require('../db/MySQLDatabase.js');
const User = require('../db/User.js');
const Paper = require('../db/Paper.js');
const PaperKeywords = require('../db/PaperKeywords');

/* GET users listing. */
// router.get('/', function (request, response, next) {
//
// 	MySQLDatabase.getData("SELECT id, firstName, lastName, email FROM Users").then(function (resultSet) {
// 		response.send(resultSet.rows);
// 	}).catch(function(error) {
// 		response.send(error);
// 	});
// });

/* GET a User by its id */
router.get('/:id', function (request, response) {
	let requestedUser = new User(request.params.id);

	// Fetch the requested user. Respond with data about the user.
	//  If there is an error, catch it and report it.
	requestedUser.fetch().then(() => {
		response.send(requestedUser.id + " " + requestedUser.firstName + " " + requestedUser.lastName);
	}).catch(error => {
		response.send(error);
	});
});

/* GET a Paper by its id */
router.get('/papers/:id', isLoggedIn, (request, response) => {
    let requestedPaper = new Paper(request.params.id, "", "", "");

    // Fetch the requested paper. Respond with data about the paper.
    //  If there is an error, catch it and report it.
    requestedPaper.fetch().then(() => {
        response.send(requestedPaper.id + " " + requestedPaper.title);
    }).catch(error => {
        response.send(error);
    });
});

/* GET a Paper's keywords by its id */
router.get('/papers/:id/keywords', isLoggedIn, (request, response) => {
    let requestedPaperKeywords = new PaperKeywords(request.params.id);

    console.log("REQUEST PAPER BY ID");

    // Fetch the requested paper. Respond with data about the paper.
    //  If there is an error, catch it and report it.
    requestedPaperKeywords.fetch().then(() => {
        console.log("FETCHED PAPER BY ID");
        response.send(requestedPaperKeywords.paperId + " " + requestedPaperKeywords.keywords);
    }).catch(error => {
        response.send(error);
    });
});

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
