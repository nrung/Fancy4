/**
 * Allows for a connection to be made to a MySQL Database.
 *
 * Faculty Research Database - Final Project
 * ISTE 330 01
 * Team 11 (Fancy Four)
 * @author Brendon Strowe
 * @version 16 of April 2017
 */

let mysql = require('mysql');

/**
 * Connection pool object
 * @type {mysql.Pool}
 */
let pool = mysql.createPool({
	connectionLimit	: 1024,
	host			: process.env.DB_HOST,
	user			: process.env.DB_USERNAME,
	password		: process.env.DB_PASSWORD,
	database		: process.env.DB_DATABASE
});

/**
 * This method will query the database using a precompiled SQL Statement.
 *  The SQL statement provided should include '?' where data values are to be
 *  inserted. An array of values to be inserted should also be provided.
 *
 * @param {string} sql - A string of precompiled SQL.
 * @param {array} values - A list of values to be bound to the precompiled SQL Statement.
 * @return {Promise} Whether or not establishing a connection and retrieving the data was successful or not.
 */
exports.getData = function (sql, values) {

	// If an error is encountered, the Promise will be rejected with an explanitory error.
	//  Else, it will be resolved with the resulting data from the database query.
	return new Promise(function(resolve, reject) {

		// Attempt to connect using connection pool.
		pool.getConnection(function(connectionError, connection) {
			if (connectionError) {
				console.log("ERROR: " + connectionError.code);
				reject("Error connecting to database. Message: " + connectionError.code);
			}

			console.log('connected as id ' + connection.threadId);

			// Perform SQL query.
			connection.query(sql, values, function(queryError, results, fields) {
				connection.release();

				if (queryError) {
					reject("Error querying database. Message: " + queryError.code);
				}

				// Information provided from Query.
				let resultSet = {
					headers : fields,
					rows : results
				};
				resolve(resultSet);
			});
		});
	});
};


/**
 * This method will update the database using a precompiled SQL Statement.
 *
 * @param {string} sql - A string of precompiled SQL.
 * @param {array} values - A list of values to be bound to the precompiled SQL Statement.
 * @return {Promise} whether or not the command execution was successful.
 */
exports.setData = function (sql, values) {

	// If an error is encountered, the Promise will be rejected with an explanitory error.
	//  Else, it will be resolved with the resulting data from the database query.
	return new Promise(function(resolve, reject) {

		// Attempt to connect using connection pool.
		pool.getConnection(function(connectionError, connection) {
			if (connectionError) {
				reject("Error connecting to database. Message: " + connectionError.code);
			}

			console.log('connected as id ' + connection.threadId);

			// Perform SQL update.
			connection.query(sql, values, function(updateError, results) {
				connection.release();

				if (updateError) {
					reject("Error updating the database. Message: " + updateError.code);
				}

				// Information provided from Update.
				let resultSet = {
					insertId : results.insertId,
					rowsAffected : results.affectedRows
				};
				resolve(resultSet);
			});
		});
	});
};
