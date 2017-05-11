/**
 * Created by Nick on 5/10/2017.
 */

const MySQLDatabase = require('../db/MySQLDatabase.js');
const Paper = require('../db/Paper');

class BusinessAPI {

    removePaper(id) {

        return new Promise((resolve, reject) => {
            let paper = new Paper(id);

            paper.remove().then(resultSet => {
                resolve(resultSet);
            }).catch(error => {
                reject(error);
            });
        });
    };
}

module.exports = BusinessAPI;
