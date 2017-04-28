/**
 * Reflect the Keywords for a Paper from the PaperKeyword table in the database.
 *
 * Faculty Research Database - Final Project
 * ISTE 330 01
 * Team 11 (Fancy 4)
 * @author Brendon Strowe
 * @version 17 of April 2017
 */

let MySQLDatabase = require('../db/MySQLDatabase.js');

// Make the "module" (Class/Object type) available for use in other files.
module.exports = PaperKeywords;

/**
 * Default constructor
 */
function PaperKeywords() {
	this.paperId = -1;
	this.keywords = [];
}

/**
 * Creates a new PaperKeywords object with the id field set.
 * The keywords field is left blank.
 *
 * @param {number} paperId - ID number of a Paper object.
 * @param {array} keywords - Keywords for the Paper object.
 */
function PaperKeywords(paperId) {
	this.paperId = paperId;
	this.keywords = [];
}

/**
 * Fetches all of the keywords for a given Paper from the database based on the Paper's ID number.
 *
 * @return {Promise} Whether or not the fetch was successful.
 */
PaperKeywords.prototype.fetch = () => {

	// Must set a variable definition for 'this' as once iniside the Promise,
	// 'this' will no longer refer to the PaperKeywords object.
	let thesePaperKeywords = this;

	return new Promise((resolve, reject) => {
		MySQLDatabase.getData("SELECT * FROM PaperKeywords WHERE paperId = ?", [thesePaperKeywords.paperId]).then(resultSet => {

			// Check to make sure data was fetched
			if (resultSet.rows.length) {
				// Go through all of the keywords returned from the database
				resultSet.rows.forEach(row => {
					thesePaperKeywords.keywords.push(row.keyword);
				});

				resolve();
			}
			reject("PAPER NOT FOUND. NO KEYWORDS FETCHED.");
		}).catch(error => {
			reject(error);
		});
	});
};

/**
 * Updates an existing list of Keywords for a Paper entry in the database.
 *
 * @return {Promise} Whether or not the update was successful. A successful
 * update resolves with the number of rows affected.
 */
PaperKeywords.prototype.update = function () {

	// Must set a variable definition for 'this' as once iniside the Promise,
	// 'this' will no longer refer to the Paper object.
	let thesePaperKeywords = this;

	return new Promise((resolve, reject) => {
		// Deletes all of the keywords currently in the table for a given paper
		//  then inserts the newly updated list of keywords.
		MySQLDatabase.setData("DELETE FROM PaperKeywords " +
				" WHERE id = ? ",
				[thesePaperKeywords.paperId]
			).then(resultSet => {
				thesePaperKeywords.keywords.forEach(keyword => {
					MySQLDatabase.setData("INSERT INTO PaperKeywords (paperId, keyword)" +
							" VALUES ( ?, ? ) ",
							[thesePaperKeywords.paperId, keyword])
					.catch(error => {
						reject(error);
					});
				});

				resolve(resultSet.rowsAffected);
		}).catch(error => {
			// Error deleting keywords for a given Paper
			reject(error);
		});
	});
};

/**
 * Adds a new Keyword to a Paper entry in the database.
 *
 * @param {string} newKeyword - The new keyword to be added.
 * @return {Promise} Whether or not the addition was successful. A successful
 * POST resolves with the number of rows affected.
 */
PaperKeywords.prototype.post = function(newKeyword) {

	// Must set a variable definition for 'this' as once iniside the Promise,
	// 'this' will no longer refer to the Paper object.
	let thesePaperKeywords = this;

	return new Promise((resolve, reject) => {
		thesePaperKeywords.keywords.push(newKeyword);
		thesePaperKeywords.update().then(numRowsAffected => {
			resolve(numRowsAffected);
		}).catch(error => {
				reject(error);
		});
	});
};

/**
 * Deletes a Keyword for a Paper entry in the database.
 *
 * @param {string} deletedKeyword - The keyword to be deleted.
 * @return {Promise} Whether or not the deletion was successful. A successful
 * DELETE resolves with the number of rows affected.
 */
PaperKeywords.prototype.delete = function(deletedKeyword) {

	// Must set a variable definition for 'this' as once iniside the Promise,
	// 'this' will no longer refer to the Paper object.
	let thesePaperKeywords = this;

	return new Promise((resolve, reject) => {
		let indexToRemove = thesePaperKeywords.keywords.indexOf(deletedKeyword);
		thesePaperKeywords.keywords.splice(indexToRemove, 1);
		thesePaperKeywords.update().then(numRowsAffected => {
			resolve(numRowsAffected);
		}).catch(error => {
				reject(error);
		});
	});
};