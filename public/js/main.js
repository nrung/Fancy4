/**
 * @description Handles various real-time updates to webpages (so we don't have
 *  to re-load a page) using jQuery.
 *
 * Faculty Research Database - Final Project
 * ISTE 330 01
 *
 * Team 11 (Fancy Four)
 *
 * @author Nick Rung, Brendon Strowe, Andrew Diana
 * @version 15 of May 2017
 */

/**
 * Initiates the removal of a paper when the Delete button is pressed.
 * Uses an AJAX request to call the Papers API.
 * @param  {number} paperId - PaperId number of the paper to be deleted.
 */
function removePaper(paperId) {

  $.ajax({
    url: '/api/paper/' + paperId,
    type: 'DELETE',
    success: function(result) {
      console.log(result.message);
      window.location = '/papers';
    },
    fail: function(result) {
      if (result.message) {
        console.log(result.message);
      } else {
        console.log('ERROR');
      }
    }
  });
}

/**
 * Initiates the saving of an edited paper when the Save button is pressed.
 * Uses an AJAX request to call the Papers API.
 * @param  {number} paperId - ID of the paper tp be updated.
 */
function saveEdits(paperId) {
	let newTitle = document.getElementById("title").value;
	let newCitation = document.getElementById("citation").value;
	let newAbstract = document.getElementById("abstract").value;

	// Ajax Call
  $.ajax({
    url: '/api/paper/' + paperId,
    type: 'PUT',
    data: {title: newTitle, citation: newCitation, abstract: newAbstract},
    success: function(result) {
      console.log(result.message);
      window.location = '/papers';
    },
    fail: function(result) {
      if (result.message) {
        console.log(result.message);
      } else {
        console.log('ERROR');
      }
    },
    dataType: 'json'
  });
}

/**
 * Change all of the h2 and p elements into text input fields for performing
 *  edits to a Paper on a Paper HTML Page.
 * @param  {number} paperId - ID of the paper to include in the newly created Save button.
 */
function enterEditMode(paperId) {

  $('#paper h2').each(
      function(index, element) {
        let attributes = {};

        $.each(element.attributes, function(index, attribute) {
          attributes[attribute.nodeName] = attribute.nodeValue;
        });

        $(element).replaceWith(function() {
          attributes.value = $(this).text();
          attributes.type = 'text';
          attributes.class = 'form-control';
          return $('<input />', attributes);
        });
      },
  );

  $('#paper p').each(
      function(index, element) {
        let attributes = {};

        $.each(element.attributes, function(index, attribute) {
          attributes[attribute.nodeName] = attribute.nodeValue;
        });

        $(element).replaceWith(function() {
          attributes.text = $(this).text();
          attributes.class = 'form-control';
          return $('<textarea />', attributes);
        });
      },
  );

	$('#editMode').
		replaceWith(
        	`<button class="btn btn-warning" onclick="cancelEdit()">Cancel</button>
			<button class="btn btn-success" onclick="saveEdits(${paperId})">Save</button>`
		);
}

/**
 * Cancels the current edit when the Cancel button is pressed.
 * Simply dumps any changes currently on the page and re-loads the page with the
 *  original, unmodified data from the database.
 */
function cancelEdit() {
	window.location.reload(true);
}

/**
 * Initiates the search for papers when the Search button is pressed.
 * Uses an AJAX request to call the Papers API.
 * Updates the page to show the Search Results.
 */
function searchPapers() {
  const type = $('#search_concept').text().substring(1);
  const searchQuery = $('#searchQuery').val();
  console.log(type);
  console.log(searchQuery);

  $.ajax({
    url: '/api/search',
    type: 'POST',
    data: {'type': type, 'query': searchQuery},
    success: function(data) {

      $('#papers').empty();
      console.dir(data);

      if (data.papers.length >= 1) {

        data.papers.forEach(function(item, index) {
          let paperString = '';
          let paper = item.paper;
          console.dir(paper);

          if (item.startRow) {
            paperString += '<div class="row">';
          }

          paperString += `<div class="col-md-3">
      <div class="panel panel-default">
      <div class="panel-heading"><strong>${paper.title}</strong></div>
      <div class="panel-body">
      <p>${paper.abstract}</p>
      </div>
      <div class="panel-footer">
      <a class="btn btn-danger" href="/paper/${paper.id}"> More Info</a>
      </div>
      </div>
      </div>`;
          if (item.endRow) {
            paperString += '</div>';
          }

          $('#papers').append(paperString);
        });
      } else {
        $('#papers').
            append('<h3 class="text-center text-danger"' +
                ' style="padding: 0.5em;">No' +
                ' Results Found.</h3>');
      }
    },
    dataType: 'json',
  });
}

/**
 * Resets the Search Results on the Papers page
 */
function resetSearch() {

  $.ajax({
    url: '/api/search',
    type: 'POST',
    data: {'type': 'Title', 'query': ''},
    success: function(data) {

      console.dir(data);
      $('#papers').empty();

      let paperString = '';
      if (data.papers.length) {
        data.papers.forEach(function(item, index) {

          let paper = item.paper;

          if (item.start) {
            console.log('start');
            paperString += '<div class="row">';
          }

          paperString += `<div class="col-md-3">
<div class="panel panel-default">
<div class="panel-heading"><strong>${paper.title}</strong></div>
<div class="panel-body">
<p>${paper.abstract}</p>
</div>
<div class="panel-footer">
<a class="btn btn-danger" href="/paper/${paper.id}"> More Info</a>
</div>
</div>
</div>`;
          if (item.end) {
            paperString += '</div>';
          }

        });

        $('#papers').append(paperString);
      } else {
        $('#papers').
            append(
                '<h3 class="bg-danger text-center">No Results Found.</h3>');
      }
    },
    dataType: 'json',
  });
}
