var searchResultsTable;
var searchResultsContainer;
var searchQueryForm;
var searchFocusPanel;
var selectedId;

$(document).ready(function() {
  searchResultsTable = $('.search-results > tbody');
  searchResultsContainer = $('.search-results-container');
  searchQueryForm = $('.search-query-form');
  searchFocusPanel = $('.search-focus-panel');

  searchResultsTable.on('click', '.resume-flow-entry', function(event) {
    var entryId = $(event.currentTarget).attr('name');
    selectedId = entryId;

    searchResultsContainer.addClass('hidden');
    searchQueryForm.addClass('hidden');
    searchFocusPanel.removeClass('hidden');

    $.ajax({
      url: '/entries/' + entryId,
      type: 'GET'
    })
    .done(function(response) {
      $('#search-focus-panel-title').html(response.first_name + ' ' + response.last_name); 
      $('#search-focus-panel-body').empty();

      $('#search-focus-panel-body').append('<li class="list-group-item">First Name: <span class="pull-right editable strong">' + response.first_name + '</span></li>');
      $('#search-focus-panel-body').append('<li class="list-group-item">Middle Name: <span class="pull-right editable strong">' + response.middle_name + '</span></li>');
      $('#search-focus-panel-body').append('<li class="list-group-item">Last Name: <span class="pull-right editable strong">' + response.last_name + '</span></li>');
      $('#search-focus-panel-body').append('<li class="list-group-item">Email Address: <span class="pull-right editable strong">' + response.email + '</span></li>');
      $('#search-focus-panel-body').append('<li class="list-group-item">Phone Number: <span class="pull-right editable strong">' + response.phone_number + '</span></li>');
      $('#search-focus-panel-body').append('<li class="list-group-item">Address: <span class="pull-right editable strong">' + response.address + '</span></li>');
      $('#search-focus-panel-body').append('<li class="list-group-item">City: <span class="pull-right editable strong">' + response.city + '</span></li>');
      $('#search-focus-panel-body').append('<li class="list-group-item">State: <span class="pull-right editable strong">' + response.state + '</span></li>');
      $('#search-focus-panel-body').append('<li class="list-group-item">Degree Type: <span class="pull-right editable strong">' + response.degree_type + '</span></li>');
      $('#search-focus-panel-body').append('<li class="list-group-item">Degree Major: <span class="pull-right editable strong">' + response.degree_major + '</span></li>');
      $('#search-focus-panel-body').append('<li class="list-group-item">University: <span class="pull-right editable strong">' + response.university + '</span></li>');
      $('#search-focus-panel-body').append('<li class="list-group-item">Skills: <span class="pull-right editable strong">' + response.skills + '</span></li>');
      $('#search-focus-panel-body').append('<li class="list-group-item">Keywords: <span class="pull-right editable strong">' + response.keywords + '</span></li>');

      if (!response.resume_file) {
        $('#downloadButton').attr('title', 'Sorry, no resume has yet been uploaded for this entry!');
        $('#downloadButton').prop('disabled', true);
      } else {
        $('#downloadButton').attr('title', '');
        $('#downloadButton').attr('disabled', false);
      }

    });
  }); 
});

function returnToResults() {
  searchResultsContainer.removeClass('hidden');
  searchQueryForm.removeClass('hidden');
  searchFocusPanel.addClass('hidden');
}

function downloadResume() {
  window.location = '/download/' + selectedId;
}

function searchRecords(form) {
  var formData = {
    first_name   : form.first_name.value,
    last_name    : form.last_name.value,
    degree_type  : form.degree_type.value,
    skills       : form.skills.value,
    keywords     : form.keywords.value
  };

  $.ajax({
    url: '/query',
    type: 'GET',
    data: formData,
    dataType: 'json',
    contentType: 'application/x-www-form-urlencoded'
  })
  .done(function(response) {
    $('.search-results-container').removeClass('hidden');
    searchResultsTable.empty(); 
    var nextRow;

    $('#resultCount').html(response.length);

    for (var i = 0; i < response.length; i++) {
      nextRow = $('<tr name="' + response[i]._id + '" class="resume-flow-entry"></tr>'); 
      searchResultsTable.append(nextRow);
      nextRow.append('<td>' + response[i].first_name + '</td>');
      nextRow.append('<td>' + response[i].middle_name + '</td>');
      nextRow.append('<td>' + response[i].last_name + '</td>');
      nextRow.append('<td>' + response[i].email + '</td>');
      nextRow.append('<td>' + response[i].degree_type + '</td>');
      nextRow.append('<td>' + response[i].degree_major + '</td>');
      nextRow.append('<td>' + response[i].city + '</td>');
      nextRow.append('<td>' + response[i].state + '</td>');
    }
  });
}

function viewAllRecords() {

}
