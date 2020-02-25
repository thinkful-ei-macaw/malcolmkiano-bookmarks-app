/* global $ */

function init() {
  $('#showCode').on('click', function(){
    $('#wf-links').removeClass('active');
    $('#codeSection').toggleClass('active');
  });

  $('#showLinks').on('click', function(){
    $('#codeSection').removeClass('active');
    $('#wf-links').toggleClass('active');
  });
}

$(init);