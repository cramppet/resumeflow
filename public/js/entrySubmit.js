var emailRegex = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;

function inputValidation(formData) {
  var firstNameValid = true, lastNameValid = true, emailValid = true;

  if (!formData.first_name)
    firstNameValid = false;

  if (!formData.last_name)
    lastNameValid  = false;

  if (!formData.email || !emailRegex.test(formData.email))
    emailValid     = false;

  (firstNameValid ? $('#first_name_error').removeClass('has-error') : $('#first_name_error').addClass('has-error'));
  (lastNameValid ? $('#last_name_error').removeClass('has-error') : $('#last_name_error').addClass('has-error'));
  (emailValid ? $('#email_error').removeClass('has-error') : $('#email_error').addClass('has-error'));

  return (firstNameValid || lastNameValid || emailValid);
}

function submitForm(form) {
  // TODO: Perform client-side validation as well

  // We have to initally create the degree objects before adding them to
  // the submitted form data.

  var degrees = [];
  var totalDegrees = (form.degree_type.length || form.degree_major.length || form.university.length);

  if (typeof totalDegrees === 'undefined' &&
     (form.degree_type.value || form.degree_major.value || form.university.value)) {
    degrees.push({
        degree_type  : form.degree_type.value,
        degree_major : form.degree_major.value,
        university   : form.university.value
    });
  }

  else if (typeof totalDegrees !== 'undefined') {
    for (var i = 0; i < totalDegrees; i++) {
      degrees.push({
        degree_type  : form.degree_type[i].value,
        degree_major : form.degree_major[i].value,
        university   : form.university[i].value
      });
    }
  }

  var formData = {
    first_name   : form.first_name.value,
    middle_name  : form.middle_name.value,
    last_name    : form.last_name.value,
    email        : form.email.value,
    phone_number : form.phone_number.value,
    address      : form.address.value,
    city         : form.city.value,
    state        : form.state.value,
    degrees      : degrees,
    skills       : form.skills.value,
    keywords     : form.keywords.value,
  };

  if (!inputValidation(formData)) {
    displayAlert('danger', 'The following fields must be fixed.');
    return;
  }

  $.ajax({
      url         : '/entries',
      type        : 'POST',
      data        : formData,
      dataType    : 'json',
      contentType : 'application/x-www-form-urlencoded'
    })
    .done(function(response) {
      if (!($('#resume')[0].files[0])) {
        displayAlert('success', 'Entry created successfully!');
        return;
      }

      var fileData = new FormData();
      fileData.append('resume', $('#resume')[0].files[0]);

      $.ajax({
        url         : '/upload/' + response.id,
        type        : 'POST',
        data        : fileData,
        contentType : false,
        processData : false,
        cache       : false
      })
      .done(function(response) {
        displayAlert('success', 'Entry created successfully!');
      })
      .fail(function(jqXHR, textStatus) {
        displayAlert('danger', 'Entry could not be created: ' + textStatus);
      })
    })
    .fail(function(jqXHR, textStatus) {
      displayAlert('danger', 'Entry could not be created: ' + textStatus);
    });
}

function addDegreeRow() {
  var degreeRow =
  $('<div class="row">' +
    '<div class="form-group">' +
    '<div class="col-md-2">' + 
    '<label for="type">Degree Level</label>' + 
    '<input type="text" name="degree_type" id="type" placeholder="B.S." class="form-control"/>' +
    '</div>' +
    '<div class="col-md-3">' + 
    '<label for="major">Field of Study</label>' + 
    '<input type="text" name="degree_major" id="major" placeholder="Computer Science" class="form-control"/>' +
    '</div>' + 
    '<div class="col-md-6">' +
    '<label for="uni">University Name</label>' + 
    '<input type="text" name="university" id="uni" placeholder="Example University" class="form-control"/>' + 
    '</div>' +
    '<div class="col-md-1">' + 
    '<label for="removeDegree">&nbsp;</label>' + 
    '<button id="addDegree" class="form-control btn btn-danger btn-block" onclick="removeDegreeRow(this)">' +
    '<i class="fa fa-minus"></i>' +
    '</button>' +
    '</div>' +
    '</div>' + 
    '</div>');

  $('#degreeContainer').append(degreeRow);
}

function removeDegreeRow(row) {
  // Attempt to get the containing row
  var containingRow = $(row).closest('.row');

  if (containingRow) {
    containingRow.remove();
  }
}
