/**
 * Reflect the Users table in the database.
 *
 * Faculty Research Database - Final Project
 * ISTE 330 01
 * Team 11 (Fancy Four)
 * @author Brendon Strowe
 * @modified Nick Rung
 * @version 17 of April 2017
 */

 const MySQLDatabase = require('../db/MySQLDatabase.js');

 // Make the "module" (Class/Object type) available for use in other files.
 module.exports = User;

/**
 * Default constructor
 */
function User() {
	this.id = 0;
	this.firstName = "";
	this.lastName = "";
	this.email = "";
	this.role = "";
	this.password = "";
}

/**
 * Creates a new User object with only the id field set.
 * All other fields are left blank.
 *
 * @param {number} id - ID number of the user from the database User table.
 */
function User(id) {
	this.id = id;
	this.firstName = "";
	this.lastName = "";
	this.email = "";
}

/**
 * Fetches the User entry from the database based on its ID number.
 *
 * @return {Promise} Whether or not the fetch was successful.
 */
User.prototype.fetch = function() {

	// Must set a variable definition for 'this' as once iniside the Promise,
	// 'this' will no longer refer to the User object.
	let thisUser = this;

	return new Promise((resolve, reject) => {
		MySQLDatabase.getData("SELECT * FROM Users WHERE id = ?", [thisUser.id]).then(resultSet => {

			// Check to make sure data was fetched
			if (resultSet.rows.length) {
				thisUser.firstName = resultSet.rows[0].firstName;
				thisUser.lastName = resultSet.rows[0].lastName;
				thisUser.email = resultSet.rows[0].email;

				resolve();
			}
			reject("USER NOT FOUND");
		}).catch(error => {
			reject(error);
		});
	});
};

/**
 * Updates an existing User entry in the database.
 *
 * @return {Promise} Whether or not the update was successful. A successful
 * update resolves with the number of rows affected.
 */
User.prototype.update = () => {

	// Must set a variable definition for 'this' as once iniside the Promise,
	// 'this' will no longer refer to the User object.
	let thisUser = this;

	return new Promise((resolve, reject) => {
		MySQLDatabase.setData("UPDATE Users " +
				" SET firstName = ?, lastName = ?, email = ? " +
				" WHERE id = ?",
				[thisUser.firstName, thisUser.lastName, thisUser.email, thisUser.id]
			).then(resultSet => {

			resolve(resultSet.rowsAffected);
		}).catch(error => {
			reject(error);
		});
	});
};

/**
 * Adds a new User entry to the database.
 *
 * @return {Promise} Whether or not the addition was successful. A successful
 * POST resolves with the number of rows affected.
 */
User.prototype.post = () => {

	// Must set a variable definition for 'this' as once iniside the Promise,
	// 'this' will no longer refer to the User object.
	let thisUser = this;

	return new Promise((resolve, reject) => {
		MySQLDatabase.setData("INSERT INTO Users (title, abstract, description) " +
				" VALUES (?, ?, ?) ",
				[thisUser.firstName, thisUser.lastName, thisUser.email]
			).then((resultSet) => {

			resolve(resultSet.rowsAffected);
		}).catch(error => {
			reject(error);
		});
	});
};

/**
 * Deletes a User entry from the database.
 *
 * @return {Promise} Whether or not the deletion was successful. A successful
 * DELETE resolves with the number of rows affected.
 */
User.prototype.delete = () => {

	// Must set a variable definition for 'this' as once iniside the Promise,
	// 'this' will no longer refer to the User object.
	let thisUser = this;

	return new Promise((resolve, reject) => {
		MySQLDatabase.setData("DELETE FROM Users " +
				" WHERE id = ? ",
				[thisUser.id]
			).then(resultSet => {

			resolve(resultSet.rowsAffected);
		}).catch(error => {
			reject(error);
		});
	});
};
