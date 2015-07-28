$('#newPassword').keyup(function() {
  $('#savePassword').prop('disabled', $(this).val() === '');
});

function updatePassword() {
  var newPassword     = $('#newPassword').val();
  var confirmPassword = $('#confirmPassword').val();

  if (newPassword !== confirmPassword) {
    displayAlert('warning', 'Passwords did not match. Please try again.');
    return;
  }
 
  $.ajax({
    url: '/profile',
    type: 'PUT',
    data: { password: newPassword },
    dataType: 'json',
    contentType : 'application/x-www-form-urlencoded'
  })
  .done(function(response) {
    displayAlert('success', 'Password successfully updated.');
  })
  .fail(function(jqXHR, textStatus) {
    displayAlert('danger', 'Could not update password: ' + textStatus);
  });
}
