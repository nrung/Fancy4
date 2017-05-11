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



/*
* Change all of the h2 and p elements into text input fields for performing
*  edits to a Paper on a Paper HTML Page.
*/
function enterEditMode() {

	$('form h2').each(
		function(index, element) {
			var attributes = {};

			$.each(element.attributes, function(index, attribute) {
				attributes[attribute.nodeName] = attribute.nodeValue;
			});

			$(element).replaceWith(function () {
				attributes.value = $(this).text();
				return $('<input />', attributes);
			});
		}
	);

	$('form p').each(
		function(index, element) {
			var attributes = {};

			$.each(element.attributes, function(index, attribute) {
				attributes[attribute.nodeName] = attribute.nodeValue;
			});

			$(element).replaceWith(function () {
				attributes.text = $(this).text();
				return $('<textarea />', attributes);
			});
		}
	);
}
