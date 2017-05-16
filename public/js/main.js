/**
 * @description Allows for a connection to be made to a MySQL Database.
 *
 * Faculty Research Database - Final Project
 * ISTE 330 01
 *
 * Team 11 (Fancy Four)
 *
 * @author Nick Rung
 * @version 9 of May 2017
 */

function removePaper(id) {

  $.ajax({
    url: '/api/paper/' + id,
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
    },
  });
}

/*
 * Change all of the h2 and p elements into text input fields for performing
 *  edits to a Paper on a Paper HTML Page.
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
          `<div id="edit"><button class="btn btn-warning" onclick="cancelEdit(${paperId})">Cancel</button>
<br><br>
<button class="btn btn-success" onclick="saveEdits(${paperId})">Save</button>
</div>`);
}

function cancelEdit(paperId) {
  $('#edit').
      replaceWith(
          `<button class="btn btn-info" onclick="enterEditMode(${paperId})" 
id="editMode">Edit</button>`);

  $('#paper .text-center textarea').each(
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

}

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

      if (data.papers) {

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
            append('<h3 class="bg-danger text-center">No Results Found.</h3>');
      }
    },
    dataType: 'json',
  });
}

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
