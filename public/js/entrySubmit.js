function submitForm(form) {
  // TODO: Perform client-side validation as well

  var formData = {
    first_name   : form.first_name.value,
    middle_name  : form.middle_name.value,
    last_name    : form.last_name.value,
    email        : form.email.value,
    phone_number : form.phone_number.value,
    address      : form.address.value,
    city         : form.city.value,
    state        : form.state.value,
    degree_type  : form.degree_type.value,
    degree_major : form.degree_major.value,
    university   : form.university.value,
    skills       : form.skills.value,
    keywords     : form.keywords.value,
  };

  $.ajax({
      url: '/entries',
      type: 'POST',
      data: formData,
      dataType: 'json',
      contentType: 'application/x-www-form-urlencoded'
    })
    .done(function(response) {
      if (!($('#resume')[0].files[0]))
        return;

      var fileData = new FormData();
      fileData.append('resume', $('#resume')[0].files[0]);

      $.ajax({
        url: '/upload/' + response.id,
        type: 'POST',
        data: fileData,
        contentType: false,
        processData: false,
        cache: false
      })
      .done(function(response) {
        console.log(response);
      })
      .fail(function(jqXHR, textStatus) {
        console.log(jqXHR);
        console.log(textStatus);
      })
      .always(function() {

      });
    })
    .fail(function(jqXHR, textStatus) {
      console.log(jqXHR);
      console.log(textStatus);
    });
}