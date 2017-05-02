/**
 * Created by Nick on 5/2/2017.
 */

const MySQLDatabase = require('../db/MySQLDatabase.js');
const Paper = require('../db/Paper');

class BusinessIndex {

    getAllPapers() {

        MySQLDatabase.getData("SELECT * FROM papers", []).then(resultSet => {

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

            return Papers;
        }).catch(error => {
            return error;
        })

    }
}

module.exports = BusinessIndex;
