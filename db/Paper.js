/**
 * Reflect the Papers table in the database.
 *
 * Faculty Research Database - Final Project
 * ISTE 330 01
 * Team 11 (Fancy 4)
 * @author Brendon Strowe
 * @version 16 of April 2017
 */

let MySQLDatabase = require('../db/MySQLDatabase.js');

// Make the "module" (Class/Object type) available for use in other files.
module.exports = Paper;

/**
 * Default constructor
 */
function Paper() {
	this.id = -1;
	this.title = "";
	this.abstract = "";
	this.citation = "";
}

/**
 * Creates a new Paper object with only the id field set.
 * All other fields are left blank.
 *
 * @param {number} id - ID number of the user from the database User table.
 */
function Paper(id) {
	this.id = id;
	this.title = "";
	this.abstract = "";
	this.citation = "";
}

/**
 * Fetches the Paper entry from the database based on its ID number.
 *
 * @return {Promise} Whether or not the fetch was successful.
 */
Paper.prototype.fetch = function() {

	// Must set a variable definition for 'this' as once iniside the Promise,
	// 'this' will no longer refer to the Paper object.
	let thisPaper = this;

	return new Promise(function(resolve, reject) {
		MySQLDatabase.getData("SELECT * FROM Papers WHERE id = ?", [thisPaper.id]).then(function (resultSet) {

			// Check to make sure data was fetched
			if (resultSet.rows.length) {
				thisPaper.title = resultSet.rows[0].title;
				thisPaper.abstract = resultSet.rows[0].abstract;
				thisPaper.citation = resultSet.rows[0].citation;

				resolve();
			}
			reject("PAPER NOT FOUND");
		}).catch(function (error) {
			reject(error);
		});
	});
}

/**
 * Updates an existing Paper entry in the database.
 *
 * @return {Promise} Whether or not the update was successful. A successful
 * update resolves with the number of rows affected.
 */
Paper.prototype.update = function () {

	// Must set a variable definition for 'this' as once iniside the Promise,
	// 'this' will no longer refer to the Paper object.
	let thisPaper = this;

	return new Promise(function(resolve, reject) {
		MySQLDatabase.setData("UPDATE Papers " +
				" SET title = ?, abstract = ?, citation = ? " +
				" WHERE id = ?",
				[thisPaper.title, thisPaper.abstract, thisPaper.citation, thisPaper.id]
			).then(function (resultSet) {

			resolve(resultSet.rowsAffected);
		}).catch(function (error) {
			reject(error);
		});
	});
};

/**
 * Adds a new Paper entry to the database.
 *
 * @return {Promise} Whether or not the addition was successful. A successful
 * POST resolves with the number of rows affected.
 */
Paper.prototype.post = function() {

	// Must set a variable definition for 'this' as once iniside the Promise,
	// 'this' will no longer refer to the Paper object.
	let thisPaper = this;

	return new Promise(function(resolve, reject) {
		MySQLDatabase.setData("INSERT INTO Papers (title, abstract, description) " +
				" VALUES (?, ?, ?) ",
				[thisPaper.title, thisPaper.abstract, thisPaper.citation]
			).then(function (resultSet) {

			resolve(resultSet.rowsAffected);
		}).catch(function (error) {
			reject(error);
		});
	});
}

/**
 * Deletes a Paper entry from the database.
 *
 * @return {Promise} Whether or not the deletion was successful. A successful
 * DELETE resolves with the number of rows affected.
 */
Paper.prototype.delete = function() {

	// Must set a variable definition for 'this' as once iniside the Promise,
	// 'this' will no longer refer to the Paper object.
	let thisPaper = this;

	return new Promise(function(resolve, reject) {
		MySQLDatabase.setData("DELETE FROM Papers " +
				" WHERE id = ? ",
				[thisPaper.id]
			).then(function (resultSet) {

			resolve(resultSet.rowsAffected);
		}).catch(function (error) {
			reject(error);
		});
	});
}
