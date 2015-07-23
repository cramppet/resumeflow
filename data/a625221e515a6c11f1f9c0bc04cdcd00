(function() {
  var hiddenResidents       = [];
  var shownResidents        = [];
  var residentGallery       = null;
  var currentResidentIndex  = 0;
  var MAX_RESIDENT_RESPONSE = 6;
 
  /* Inital page configuration. We want to dynamically populate the page with
   * resident entries that we obtain from our database. */

  $(document).ready(function() {
    // TODO: Perform page initalization
    getResidentBatch().always(function() {
      residentGallery = $('#residents');
      residentGallery.on('click', '.wrv-resident', handleResidentClick);
      refreshResidentGallery();
    });
  });

  $('.previous').click(function() {
    getResidentBatch().always(function() {
      if (shownResidents !== null)
        currentResidentIndex = currentResidentIndex - MAX_RESIDENT_RESPONSE;
      refreshResidentGallery();
    });
  });

  $('.next').click(function() {
    getResidentBatch().always(function() {
      if (shownResidents !== null)
        currentResidentIndex = currentResidentIndex + MAX_RESIDENT_RESPONSE;
      refreshResidentGallery();
    });
  });

  /* handleResidentClick - When a resident's profile is selected from the
   * gallery, we want to clear away all of the other profiles on the page and
   * expand the profile of that resident so that the user can see more info
   * about that resident.
   *
   * 
   */

  function handleResidentClick() {
    hiddenResidents = shownResidents;
    shownResidents  = [this];

    console.log($(this).attr('data-name'));

    // refreshResidentGallery();

  }

  /* */

  function refreshResidentGallery() {
    residentGallery.empty();

    $.each(shownResidents, function(index, resident) {
      if (index === shownResidents.length - 1) {
        residentGallery.append('</div>');
      }

      if (index % 3 === 0) {
        if (index !== 0)
          residentGallery.append('</div>');
        residentGallery.append('<div class="row">');
      }

      residentGallery.append('<div class="col-sm-6 col-md-4 wrv-resident" ');
      residentGallery.append('data-name=' + resident.fullName + '>');
      residentGallery.append('<div class="thumbnail">');
      residentGallery.append('<img src="..." alt="...">');
      residentGallery.append('<div class="caption">');
      residentGallery.append('<h3>Thumbnail Label</h3>');
      residentGallery.append('<p>...</p>');
      residentGallery.append('</div>');
      residentGallery.append('</div>');
      residentGallery.append('</div>');
    });
  }

  /* getResidentBatch - Fetch a batch of residents based on two conditions,
   * which are the current position in the index of residents and how many
   * residents should be returned as a response.
   *
   * @param [cri] (optional) The current resident index that should be used
   *  when determining which residents should be returned. This is essentially
   *  the client's "index" into the server's database of residents. Note, that
   *  if no value is passed, then the global currentResidentIndex is used.
   *
   * @param [mrr] (optional) The maximum number of resident objects that
   *  should be returned by the server. Note, that if no value is passed, then
   *  the global MAX_RESIDENT_RESPONSE is used.
   *
   * @return                 The jqXHR object that corresponds to the request
   * that was made, this response must be handled in an asynchronous way by the
   * caller.
   */

  function getResidentBatch(cri, mrr) {
    cri = typeof cri !== 'undefined' ? cri : currentResidentIndex;
    mrr = typeof mrr !== 'undefined' ? mrr : MAX_RESIDENT_RESPONSE;

    return $.ajax('/getResidents?cri=' + cri + '&mrr=' + mrr)
      .done(function(data) {
        shownResidents = JSON.parse(data);
      })
      .fail(function(xhr, textStatus) {
        console.log(xhr);
        console.log(textStatus);
        shownResidents = null;
      });
  }
})();