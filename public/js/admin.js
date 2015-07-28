var userTable   = $('#userTable');

$(document).ready(function() {
  // Begin by pulling all of the user accounts into the admin view.
  refreshUserTable();

  userTable.on('click', '.editable', function(caller) {
    var uneditableElement, editableElement;
    uneditableElement = $(caller.currentTarget);
    editableElement   = $('<input value="' +
                           caller.currentTarget.innerHTML + '" type="' +
                           caller.currentTarget.getAttribute('data-type') + '">');
    
    uneditableElement.replaceWith(editableElement);

    editableElement.on('keydown', function(event) {
      if (event.keyCode === 13) {
        if (event.currentTarget.getAttribute('type') === 'password') {
          uneditableElement.html('**********');
          uneditableElement.attr('data-value', editableElement.val());
        } else {
          uneditableElement.html(editableElement.val());
        }

        editableElement.replaceWith(uneditableElement);
        uneditableElement = null;
        editableElement   = null;
      }
    });

    userTable.on('mousedown', function(event) {
      if (uneditableElement && editableElement && event.toElement.nodeName !== 'INPUT') {
        if (event.currentTarget.getAttribute('type') === 'password') {
          uneditableElement.html('**********');
          uneditableElement.attr('data-value', editableElement.val());
        } else {
          uneditableElement.html(editableElement.val());
        }

        editableElement.replaceWith(uneditableElement);
        uneditableElement = null;
        editableElement   = null;
      }
    });
  });
});

function saveUserChanges(caller) {
  var newUserData      = {};
  var userId           = caller.parentNode.parentNode.getAttribute('id');
  newUserData.email    = caller.parentNode.parentNode.querySelector('span[name="email"]').innerHTML;
  newUserData.password = caller.parentNode.parentNode.querySelector('span[name="password"]').getAttribute('data-value');
  newUserData.admin    = caller.parentNode.parentNode.querySelector('span[name="admin"').innerHTML;

  if (newUserData.admin === 'true')
    newUserData.admin = true;
  else
    newUserData.admin = false;

  $.ajax({
    url         : '/user/' + userId,
    type        : 'PUT',
    data        : newUserData,
    dataType    : 'json',
    contentType : 'application/x-www-form-urlencoded'
  })
  .done(function(response) {
    if (response.message === 'User account already exists.') {
      displayAlert('warning', 'Could not update account with that email because it already exists.');
    } else {
      displayAlert('success', 'Successfully updated user account.');
    }
  })
  .fail(function(jqXHR, textStatus) {
    displayAlert('danger', 'Could not update user account: ' + textStatus);
  });
}

function deleteUser(caller) {
  if (caller) {
    var callerName = caller.parentNode.parentNode.getAttribute('name');
    var callerId   = caller.parentNode.parentNode.getAttribute('id');

    if (window.confirm('Do you really want to delete \'' + callerName + '\'?')) {
      $.ajax({
        url: '/user/' + callerId,
        type: 'DELETE'
      })
      .done(function() {
        displayAlert('success', 'User account \'' + callerName + '\' successfully deleted');
        refreshUserTable();
      })
      .fail(function() {
        displayAlert('danger', 'User account \'' + callerName + '\' could not be deleted!');
      });
    }
  }
}

function createUser() {
  var email      = window.prompt('Enter the new users email: ');

  if (email) {
    var password = window.prompt('Enter the new users password: ');

    if (password && password === window.prompt('Re-enter the new users password: ')) {
      $.ajax({
        url         : '/user',
        type        : 'POST',
        dataType    : 'json',
        contentType : 'application/x-www-form-urlencoded',
        data        : { email: email, password: password, admin: false }
      })
      .done(function(response) {
        if (response.message === 'User account already exists.') {
          displayAlert('warning', 'Could not create account with that email because it already exists.');
        } else {
          displayAlert('success', 'User successfully created.');
          refreshUserTable();
        }
      })
      .fail(function(jqXHR, textStatus) {
        displayAlert('danger', 'Could not create new user: ' + textStatus);
      });
    } else {
      displayAlert('warning', 'Passwords did not match, please try again.');
    }
  }
}

function refreshUserTable() {
  $.ajax({
    url: '/users',
    type: 'GET'
  })
  .done(function(response) {
    userTable.empty();

    for (var i = 0; i < response.length; i++) {
      userTable.append(
          '<tr name="' + response[i].email + '" id="' + response[i]._id + '" class="userAccount">' +
          '<td><span name="email" data-type="text">' + response[i].email + '</span></td>' +
          '<td><span name="password" data-type="password" class="editable">**********</span></td>' + 
          '<td><span name="admin" data-type="text" class="editable">' + response[i].admin + '</span></td>' +
          '<td width="50px"><button onclick="saveUserChanges(this)" class="btn saveButton btn-sm btn-default"><i class="fa fa-floppy-o"></i></button></td>' +
          '<td width="50px"><button onclick="deleteUser(this)" class="btn btn-sm btn-danger"><i class="fa fa-minus"></i></button></td>' +
          '</tr>'
        );
    }
  })
  .fail(function(jqXHR, textStatus) {
    displayAlert('danger', 'Could not get a listing of all the users: ' + textStatus);
  });
}