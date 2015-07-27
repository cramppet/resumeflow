'use strict';

function displayAlert(type, message) {
  var alertElement = $('<div class="animated fadeIn alert alert-' + type + ' alert-dismissible" role="alert">' +
                       '<button type="button" class="close" data-dismiss="alert" aria-label="Close">' +
                       '<span aria-hidden="true">&times;</span></button>' +
                       '<span>' + message + '</span>' + 
                       '</div>');

  $('#globalAlertContainer').append(alertElement);

  window.setTimeout(function() {
    alertElement.addClass('fadeOut');
    window.setTimeout(function() {
      alertElement.remove();
    }, 500);
  }, 2000);
}
