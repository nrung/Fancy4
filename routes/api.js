const express = require('express');
const router = express.Router();

const MySQLDatabase = require('../db/MySQLDatabase.js');
const User = require('../db/User.js');
const Paper = require('../db/Paper.js');
const PaperKeywords = require('../db/PaperKeywords');
const BusinessAPI = require('../business/BusinessAPI');
const Business = new BusinessAPI();

/* GET users listing. */
// router.get('/', function (req, res, next) {
//
// 	MySQLDatabase.getData("SELECT id, firstName, lastName, email FROM Users").then(function (resultSet) {
// 		res.send(resultSet.rows);
// 	}).catch(function(error) {
// 		res.send(error);
// 	});
// });

router.delete('/paper/:id', isLoggedIn, checkRole('a'), (req, res) => {
    let id = req.params.id;

    Business.removePaper(id).then(result => {
        console.dir(result);
        req.flash('papersMessage', 'Paper Deleted.');
        res.redirect(200, '/papers');
    }).catch(error => {
        console.dir(error);
        res.status(500);
    });
});

/* GET a User by its id */
router.get('/:id', function (req, res) {
	let reqedUser = new User(req.params.id);

	// Fetch the reqed user. Respond with data about the user.
	//  If there is an error, catch it and report it.
	reqedUser.fetch().then(() => {
		res.send(reqedUser.id + " " + reqedUser.firstName + " " + reqedUser.lastName);
	}).catch(error => {
		res.send(error);
	});
});

/* GET a Paper by its id */
router.get('/papers/:id', isLoggedIn, (req, res) => {
    let reqedPaper = new Paper(req.params.id, "", "", "");

    // Fetch the reqed paper. Respond with data about the paper.
    //  If there is an error, catch it and report it.
    reqedPaper.fetch().then(() => {
        res.send(reqedPaper.id + " " + reqedPaper.title);
    }).catch(error => {
        res.send(error);
    });
});

/* GET a Paper's keywords by its id */
router.get('/papers/:id/keywords', isLoggedIn, (req, res) => {
    let reqedPaperKeywords = new PaperKeywords(req.params.id);

    // Fetch the reqed paper. Respond with data about the paper.
    //  If there is an error, catch it and report it.
    reqedPaperKeywords.fetch().then(() => {
        res.send(reqedPaperKeywords.paperId + " " + reqedPaperKeywords.keywords);
    }).catch(error => {
        res.send(error);
    });
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
