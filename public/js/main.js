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
        success: function (result) {
            console.log(result.message);
            window.location = "/papers";
        },
        fail: function (result) {
            if (result.message) {
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
function enterEditMode(paperId) {

    $('form h2').each(
        function (index, element) {
            let attributes = {};

            $.each(element.attributes, function (index, attribute) {
                attributes[attribute.nodeName] = attribute.nodeValue;
            });

            $(element).replaceWith(function () {
                attributes.value = $(this).text();
                attributes.type = "text";
                attributes.class = "form-control";
                return $('<input />', attributes);
            });
        }
    );

    $('form p').each(
        function (index, element) {
            let attributes = {};

            $.each(element.attributes, function (index, attribute) {
                attributes[attribute.nodeName] = attribute.nodeValue;
            });

            $(element).replaceWith(function () {
                attributes.text = $(this).text();
                attributes.class = "form-control";
                return $('<textarea />', attributes);
            });
        }
    );

    $('#editMode').replaceWith(`<button class="btn btn-success" onclick="saveEdits(${paperId})" >Save</button>`);
}

function searchPapers() {
    console.log("In Search Paper");
    const type = $('#search_concept').text().substring(1);
    const searchQuery = $('#searchQuery').val();
    console.log(type);
    console.log(searchQuery);

    $.ajax({
        url: "/api/search",
        type: "POST",
        data: {"type": type, "query": searchQuery},
        success: function (data) {
            let papers = data.papers;
            console.dir(data);

            $('#papers').empty();

            if (papers.length) {
                papers.forEach(function (paper) {
                    $("#papers").append(`<div class="col-md-3">\n<div class="panel panel-default">\n<div class="panel-heading"><h2>${paper.title}</h2></div>\n<div class="panel-body"><p>${paper.abstract}</p></div>\n<div class="panel-footer">\n<a class="btn btn-danger" href="/paper/${paper.id}"> More Info</a>\n</div>\n</div>\n</div>`);
                });
            } else {
                $("#papers").append("<h3 class='bg-danger text-center'>No Results Found.</h3>");
            }
        },
        dataType: "json"
    });
}

function resetSearch() {

    $.ajax({
        url: "/api/search",
        type: "POST",
        data: {"type": "Title", "query": ""},
        success: function (data) {

            console.dir(data);
            $('#papers').empty();

            if (data.papers.length) {
                data.papers.forEach(function (item, index) {
                    let paper = item.paper;
                    // let startRow = ((index + 1) % 4 === 1);
                    // let endRow = ((index) % 4 === 0) || ((index) === data.papers.length);
                    let paperString = "";
                    //
                    // if(startRow) {
                    //     paperString += '<div class="row">';
                    // }

                    paperString += `<div class="col-md-3"><div class="panel panel-default"><div class="panel-heading"><h2>${paper.title}</h2></div><div class="panel-body"><p>${paper.abstract}</p></div><div class="panel-footer"><a class="btn btn-danger" href="/paper/${paper.id}"> More Info</a></div></div></div>`;

                    // if(endRow) {
                    //     paperString += '</div>';
                    // }

                    $('#papers').append(paperString);

                });
            } else {
                $("#papers").append("<h3 class='bg-danger text-center'>No Results Found.</h3>");
            }
        },
        dataType: "json"
    });

}