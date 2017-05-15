/**
 * Created by Nick on 5/10/2017.
 */

const MySQLDatabase = require('../db/MySQLDatabase.js');
const Paper = require('../db/models/Paper');

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

    searchPapers(type, query) {

        return new Promise((resolve, reject) => {

            let sql = "";

            switch (type) {
                case "Author":
                    sql = "SELECT papers.id, papers.title, papers.abstract, papers.citation " +
                        "FROM papers JOIN authorship ON papers.id = authorship.paperId " +
                        "JOIN users ON authorship.userId = users.id " +
                        "WHERE concat(users.firstName, ' ', users.lastName) LIKE concat('%',?,'%')";
                    break;
                case "Title":
                    sql = "SELECT * FROM papers WHERE title LIKE concat('%',?,'%')";
                    break;
                case "Keywords":
                    sql = "SELECT papers.id, papers.title, papers.abstract, papers.citation FROM papers " +
                        "JOIN paperkeywords ON papers.id = paperkeywords.paperId WHERE paperkeywords.keyword LIKE ?";
                    break;
                default:
                    reject("No search type selected.");
            }

            MySQLDatabase.getData(sql, [query]).then(resultSet => {

                let results = [];

                resultSet.rows.forEach((paper, index) => {
                    let startRow = (index + 1) % 4 === 1;
                    let endRow = (index + 1) % 4 === 0 || (index + 1) === resultSet.rows.length;

                    results.push({paper: paper, start: startRow, end: endRow})
                });


                resolve(results);
            }).catch(error => {
                reject(error);
            });
        });
    }
}

module.exports = BusinessAPI;
