'use strict';

var searchResultsTable;
var searchResultsContainer;
var searchQueryForm;
var searchFocusPanel;
var selectedEntry;
var searchFocusPanelBody;

$(document).ready(function() {
  searchResultsTable     = $('.search-results > tbody');
  searchResultsContainer = $('.search-results-container');
  searchQueryForm        = $('.search-query-form');
  searchFocusPanel       = $('.search-focus-panel');
  searchFocusPanelBody   = $('#search-focus-panel-body');

  searchResultsTable.on('click', '.resume-flow-entry', function(event) {
    var entryId = $(event.currentTarget).attr('name');

    searchResultsContainer.addClass('hidden');
    searchQueryForm.addClass('hidden');
    searchFocusPanel.removeClass('hidden');

    $.ajax({
      url: '/entries/' + entryId,
      type: 'GET'
    })
    .done(function(response) {
      $('#search-focus-panel-title').html(response.first_name + ' ' + response.last_name); 
      searchFocusPanelBody.empty();

      selectedEntry = response;

      searchFocusPanelBody.append('<li class="list-group-item">First Name: <span id="first_name_selected" class="pull-right editable strong">' + response.first_name + '</span></li>');
      searchFocusPanelBody.append('<li class="list-group-item">Middle Name: <span id="middle_name_selected" class="pull-right editable strong">' + response.middle_name + '</span></li>');
      searchFocusPanelBody.append('<li class="list-group-item">Last Name: <span id="last_name_selected" class="pull-right editable strong">' + response.last_name + '</span></li>');
      searchFocusPanelBody.append('<li class="list-group-item">Email Address: <span id="email_selected" class="pull-right editable strong">' + response.email + '</span></li>');
      searchFocusPanelBody.append('<li class="list-group-item">Phone Number: <span id="phone_number_selected" class="pull-right editable strong">' + response.phone_number + '</span></li>');
      searchFocusPanelBody.append('<li class="list-group-item">Address: <span id="address_selected" class="pull-right editable strong">' + response.address + '</span></li>');
      searchFocusPanelBody.append('<li class="list-group-item">City: <span id="city_selected" class="pull-right editable strong">' + response.city + '</span></li>');
      searchFocusPanelBody.append('<li class="list-group-item">State: <span id="state_selected" class="pull-right editable strong">' + response.state + '</span></li>');
      
      // Add table for multiple degrees
      var degreeTable = $('<li class="list-group-item">' +
                          '<table class="table table-striped table-bordered table-condensed table-hover">' +
                          '<thead><td>Degree Type</td><td>Degree Major</td><td>University</td><td>&nbsp;</td></thead>' + 
                          '<tbody id="degreeTable">');

      for (var i = 0; i < response.degrees.length; i++) {
        degreeTable.find('tbody').append('<tr>' + 
                                         '<td><span name="degree_type" class="editable strong">' + response.degrees[i].degree_type + '</span></td>' +
                                         '<td><span name="degree_major" class="editable strong">' + response.degrees[i].degree_major + '</span></td>' +
                                         '<td><span name="university" class="editable strong">' + response.degrees[i].university + '</span></td>' +
                                         '<td><button onclick="removeDegreeRow(this)" type="button" class="btn btn-block btn-xs btn-danger"><i class="fa fa-minus"></i></button></td>' + 
                                         '</tr>');
      }

      degreeTable.append('</tbody>');
      degreeTable.append('</table>');
      degreeTable.append('</li>');

      searchFocusPanelBody.append(degreeTable);

      var addRemoveRow = $('<div class="row">' +
                           '<div class="col-md-10 col-md-offset-1">' +
                           '<button onclick="addDegreeRow()" type="button" class="btn btn-sm btn-block btn-success">Add Degree <i class="fa fa-plus"></i></button>' +
                           '</div>' +
                           '</div>');
      degreeTable.append(addRemoveRow);

      searchFocusPanelBody.append('<li class="list-group-item">Skills: <span id="skills_selected" class="pull-right editable strong">' + response.skills + '</span></li>');
      searchFocusPanelBody.append('<li class="list-group-item">Keywords: <span id="keywords_selected" class="pull-right editable strong">' + response.keywords + '</span></li>');

      if (!response.resume_file) {
        $('#downloadButton').attr('title', 'Sorry, no resume has yet been uploaded for this entry!');
        $('#downloadButton').prop('disabled', true);
      } else {
        $('#downloadButton').attr('title', '');
        $('#downloadButton').attr('disabled', false);
      }
    });
  });

  searchFocusPanel.on('click', '.editable', function(event) {
    var uneditableElement = $(event.currentTarget);
    var editableElement = $('<input class="pull-right editing" type="text" value="' + $(event.currentTarget).html() + '">');
 
    uneditableElement.replaceWith(editableElement);
   
    editableElement.on('keydown', function(event) {
      if (event.keyCode === 13) {
        uneditableElement.html(editableElement.val());
        editableElement.replaceWith(uneditableElement);
        uneditableElement = null;
        editableElement   = null;
      }
    });

    searchFocusPanel.on('mousedown', function(event) {
      if (uneditableElement && editableElement && event.toElement.nodeName !== 'INPUT') {
        uneditableElement.html(editableElement.val());
        editableElement.replaceWith(uneditableElement);
        uneditableElement = null;
        editableElement   = null;
      }
    });
  });
});

$('.form-control').keydown(function(event) {
  // Make sure to enable or disable the search button based on if this user has 
  // any data in the search fields.
  validateSearch();
});

$('.form-control').focusout(function(event) {
  validateSearch();
});

function validateSearch() {
  var first_name   = $('#first_name').val();
  var last_name    = $('#last_name').val();
  var degree_type  = $('#degree_type').val();
  var degree_major = $('#degree_major').val();
  var keywords     = $('#keywords').val();
  var skills       = $('#skills').val();

  $('#searchButton').prop('disabled', !(first_name || last_name || degree_type || degree_major || keywords || skills));
}

function returnToResults() {
  searchResultsContainer.removeClass('hidden');
  searchQueryForm.removeClass('hidden');
  searchFocusPanel.addClass('hidden');

  // We want to make sure that any changes that the user made to the record
  // is displayed when they return back to the search results
  searchRecords(document.getElementById('searchForm'));

}

function downloadResume() {
  window.location = '/download/' + selectedEntry._id;
}

function searchRecords(form) {
  var formData = {};

  if (form) {
    formData = {
      first_name   : form.first_name.value,
      last_name    : form.last_name.value,
      degree_type  : form.degree_type.value,
      degree_major : form.degree_major.value,
      skills       : form.skills.value,
      keywords     : form.keywords.value
    };
  }

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

      nextRow.append('<td>' + response[i].first_name  + '</td>');
      nextRow.append('<td>' + response[i].middle_name + '</td>');
      nextRow.append('<td>' + response[i].last_name   + '</td>');
      nextRow.append('<td>' + response[i].email       + '</td>');

      // So we want to display the degree type and degree major from each
      // canidate, however we also want to display the specific degree type
      // and major based on the query the user might have passed. Meaning that
      // we need to look through the different degrees a canidate might have
      // and check which one we should display.

      var degree_type_display  = 'N/A';
      var degree_major_display = 'N/A';

      if (response[i].degrees.length !== 0) {
        degree_type_display  = response[i].degrees[0].degree_type;
        degree_major_display = response[i].degrees[0].degree_major;

        if (form && (form.degree_type.value || form.degree_major.value)) {
          for (var j = 0; j < response[i].degrees.length; j++) {
            if (response[i].degrees[j].degree_type  === form.degree_type.value ||
                response[i].degrees[j].degree_major === form.degree_major.value) {
              degree_type_display  = response[i].degrees[j].degree_type;
              degree_major_display = response[i].degrees[j].degree_major;
              break;
            }
          }
        }
      }

      nextRow.append('<td>' + degree_type_display   + '</td>');
      nextRow.append('<td>' + degree_major_display  + '</td>');
      nextRow.append('<td>' + response[i].city      + '</td>');
      nextRow.append('<td>' + response[i].state     + '</td>');
    }
  });
}

function saveChanges() {
  var degrees = [];
  var degreeTable = $('#degreeTable')[0];
  var totalDegrees = degreeTable.rows.length;

  if (totalDegrees === 1) {
    degrees.push({
        degree_type  : degreeTable.rows[0].childNodes[0].textContent,
        degree_major : degreeTable.rows[0].childNodes[1].textContent,
        university   : degreeTable.rows[0].childNodes[2].textContent
    });
  }

  else if (totalDegrees > 1) {
    for (var i = 0; i < totalDegrees; i++) {
      degrees.push({
        degree_type  : degreeTable.rows[i].childNodes[0].textContent,
        degree_major : degreeTable.rows[i].childNodes[1].textContent,
        university   : degreeTable.rows[i].childNodes[2].textContent
      });
    }
  }

  var formData = {
    first_name   : $('#first_name_selected').html(),
    middle_name  : $('#middle_name_selected').html(),
    last_name    : $('#last_name_selected').html(),
    email        : $('#email_selected').html(),
    phone_number : $('#phone_number_selected').html(),
    address      : $('#address_selected').html(),
    city         : $('#city_selected').html(),
    state        : $('#state_selected').html(),
    degrees      : degrees,
    skills       : $('#skills_selected').html(),
    keywords     : $('#keywords_selected').html()
  };

  $.ajax({
    url         : '/entries/' + selectedEntry._id,
    type        : 'PUT',
    data        : formData,
    dataType    : 'json',
    contentType : 'application/x-www-form-urlencoded'
  })
  .done(function(response) {
    if (newResumeFile.files[0]) {
      var fileData = new FormData();
      fileData.append('resume', newResumeFile.files[0]);

      $.ajax({
        url         : '/upload/' + selectedEntry._id,
        type        : 'POST',
        data        : fileData,
        contentType : false,
        processData : false,
        cache       : false
      })
      .done(function() {
        displayAlert('success', 'Entry successfully updated!');
      })
      .fail(function(jqXHR, textStatus) {
        displayAlert('danger', 'Entry could not be updated: ' + textStatus);
      });
    } else {
      displayAlert('success', 'Entry successfully updated!');
    }
  })
  .fail(function(jqXHR, textStatus) {
    displayAlert('danger', 'Entry could not be updated: ' + textStatus);
  });
}

function viewAllRecords() {
  $('#first_name').val('');
  $('#last_name').val('');
  $('#degree_type').val('');
  $('#degree_major').val('');
  $('#skills').val('');
  $('#keywords').val('');
  validateSearch();
  searchRecords(null);
}

function addDegreeRow() {
  $('#degreeTable')
    .append('<tr>' + 
            '<td><span name="degree_type" class="editable strong">N/A</span></td>' +
            '<td><span name="degree_major" class="editable strong">N/A</span></td>' +
            '<td><span name="university" class="editable strong">N/A</span></td>' +
            '<td><button onclick="removeDegreeRow(this)" type="button" class="btn btn-block btn-xs btn-danger">' +
            '<i class="fa fa-minus"></i></button></td>' + 
            '</tr>');
}

function removeDegreeRow(caller) {
  var containingRow = $(caller).closest('tr');
  containingRow.remove();
}

function deleteEntry() {
  if (selectedEntry && window.confirm("Are you sure you want to delete this entry?")) {
    $.ajax({
      url: '/entries/' + selectedEntry._id,
      type: 'DELETE'
    })
    .done(function(response) {
      returnToResults();
      displayAlert('success', 'Successfully deleted entry!');
    })
    .fail(function(jqXHR, textStatus) {
      displayAlert('danger', 'Could not delete entry: ' + textStatus);
    });
  }
}
