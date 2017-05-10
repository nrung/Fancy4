/**
 * Created by Nick on 5/2/2017.
 */

const MySQLDatabase = require('../db/MySQLDatabase.js');
const Paper = require('../db/Paper');

class BusinessIndex {

    getAllPapers() {

        return new Promise((resolve, reject) => {
            MySQLDatabase.getData("SELECT * FROM papers").then(resultSet => {

                let Papers = [];

                resultSet.rows.forEach((paper, index) => {
                    let thisPaper = new Paper(paper.id, paper.title, paper.abstract, paper.citation);
                    let startRow = (index + 1) % 4 === 1;
                    let endRow = (index + 1) % 4 === 0 || (index + 1) === resultSet.rows.length;

                    Papers.push({
                        paper: thisPaper,
                        start: startRow,
                        end: endRow
                    });
                });

                resolve(Papers);
            }).catch(error => {
                reject(error);
            });
        });
    }

    getPaper(id) {

        return new Promise((resolve, reject) => {
            let paper = new Paper(id);

            paper.fetch().then(resultSet => {

                resolve(resultSet);
            }).catch(error => {
                reject(error);
            });
        });
    }

    submitPaper(title, abstract, citation) {

        return new Promise((resolve, reject) => {
            let paper = new Paper(-1, title, abstract, citation);

            paper.post().then(resultSet => {

                resolve(resultSet);
            }).catch(error => {
                reject(error);
            });
        });
    }
}

module.exports = BusinessIndex;
