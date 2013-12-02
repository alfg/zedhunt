$(document).ready(function() {
  $('#create-match-form').validate();

});

Object.size = function(obj) {
    var size = 0, key;
    for (key in obj) {
        if (obj.hasOwnProperty(key)) size++;
    }
    return size;
};
$("#copy-url").focus(function() {
  $(this).select();
});
$("#copy-url").mouseup(function() {
  e.preventDefault();
});
