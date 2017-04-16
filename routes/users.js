var express = require('express');
var router = express.Router();

var MySQLDatabase = require('../db/MySQLDatabase.js');

/* GET users listing. */
router.get('/', function (request, response, next) {

	MySQLDatabase.getData("SELECT id, firstName, lastName, email FROM User").then(function (resultSet) {
		response.send(resultSet.rows);
	}).catch(function(error) {
		response.send(error);
	});
});

module.exports = router;
