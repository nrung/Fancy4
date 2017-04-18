var express = require('express');
var router = express.Router();

var MySQLDatabase = require('../db/MySQLDatabase.js');
var User = require('../db/User.js');

/* GET users listing. */
router.get('/', function (request, response, next) {

	MySQLDatabase.getData("SELECT id, firstName, lastName, email FROM Users").then(function (resultSet) {
		response.send(resultSet.rows);
	}).catch(function(error) {
		response.send(error);
	});
});

/* GET a User by its id */
router.get('/:id', function (request, response) {
	let requestedUser = new User(request.params.id);

	// Fetch the requested user. Respond with data about the user.
	//  If there is an error, catch it and report it.
	requestedUser.fetch().then(function() {
		response.send(requestedUser.id + " " + requestedUser.firstName + " " + requestedUser.lastName);
	}).catch(function(error) {
		response.send(error);
	});
});

module.exports = router;
