/**
 * Allows for a connection to be made to a MySQL Database.
 *
 * Faculty Research Database - Final Project
 * ISTE 330 01
 * Team 11 (Fancy Four)
 * @author Nick Rung
 * @version 9 of May 2017
 */

function removePaper(id) {

    $.ajax({
        url: '/api/paper/' + id,
        type: 'DELETE',
        success: function(result) {
            console.log(result.message);
            window.location = "/papers";
        },
        fail: function(result) {
            if(result.message) {
                console.log(result.message);
            } else {
                console.log("ERROR");
            }
        }
    });
}