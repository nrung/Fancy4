/**
 * Reflect the Papers table in the database.
 *
 * Faculty Research Database - Final Project
 * ISTE 330 01
 * Team 11 (Fancy 4)
 * @author Brendon Strowe
 * @version 2 of May 2017
 */

let MySQLDatabase = require('../MySQLDatabase.js');

class Paper {

    /**
     * Creates a new Paper object with the ID, Title, Abstract, and Citation
     *  properties defined.
     *
     * @param {number} id - ID number of the paper from the Paper table.
     * @param {string} title - Title of the paper
     * @param {string} abstract - Abstract for the paper
     * @param {string} citation - Citation for the paper
     */
    constructor(id, title, abstract, citation) {
        this.id = id;
        this.title = title;
        this.abstract = abstract;
        this.citation = citation;
    }

  /**
   * Fetches the Paper entry from the database based on its ID number.
   *
   * @return {Promise} Whether or not the fetch was successful.
   */
  fetch() {

    // Must set a variable definition for 'this' as once iniside the Promise,
    // 'this' will no longer refer to the Paper object.
    let thisPaper = this;

    return new Promise((resolve, reject) => {
        MySQLDatabase.getData('SELECT * FROM Papers WHERE id = ?', [thisPaper.id]).then(resultSet => {

            // Check to make sure data was fetched
            if (resultSet.rows.length) {
              thisPaper.title = resultSet.rows[0].title;
              thisPaper.abstract = resultSet.rows[0].abstract;
              thisPaper.citation = resultSet.rows[0].citation;
              resolve();
            } else {
              reject('PAPER NOT FOUND');
            }
          }).catch(error => {
            reject(error);
          });
      });
  };

  /**
   * Updates an existing Paper entry in the database.
   *
   * @return {Promise} Whether or not the update was successful. A successful
   * update resolves with the number of rows affected.
   */
  update() {

    // Must set a variable definition for 'this' as once inside the Promise,
    // 'this' will no longer refer to the Paper object.
    let thisPaper = this;

    return new Promise((resolve, reject) => {
        MySQLDatabase.setData('UPDATE Papers ' +
            ' SET title = ?, abstract = ?, citation = ? ' +
            ' WHERE id = ?',
            [thisPaper.title, thisPaper.abstract, thisPaper.citation, thisPaper.id]
        ).then(resultSet => {

            resolve(resultSet.rowsAffected);
          }).catch(error => {
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
  post() {

    // Must set a variable definition for 'this' as once inside the Promise,
    // 'this' will no longer refer to the Paper object.
    let thisPaper = this;

    return new Promise((resolve, reject) => {
        MySQLDatabase.setData('INSERT INTO Papers (title, abstract, citation) ' +
            ' VALUES (?, ?, ?) ',
            [thisPaper.title, thisPaper.abstract, thisPaper.citation]
        ).then(resultSet => {

            resolve(resultSet.rowsAffected);
          }).catch(error => {
            console.dir(error);
            reject(error);
          });
      });
  };

  /**
   * Deletes a Paper entry from the database.
   *
   * @return {Promise} Whether or not the deletion was successful. A successful
   * DELETE resolves with the number of rows affected.
   */
  remove() {

    // Must set a variable definition for 'this' as once iniside the Promise,
    // 'this' will no longer refer to the Paper object.
    let thisPaper = this;

    return new Promise((resolve, reject) => {
        MySQLDatabase.setData('DELETE FROM Papers ' +
            ' WHERE id = ? ',
            [thisPaper.id]
        ).then(resultSet => {

            resolve(resultSet.rowsAffected);
          }).catch(error => {
            reject(error);
          });
      });
  };

}
// Make the "module" (Class/Object type) available for use in other files.
module.exports = Paper;
