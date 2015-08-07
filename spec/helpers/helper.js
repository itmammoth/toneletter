var helper = {
  createKeypressEvent: function(character) {
    var code = character.charCodeAt();
    var e = $.Event('keypress.toneletter');
    e.keyCode = 0;
    e.charCode = code;
    return e;
  },

  setCursorAtPipeline: function(input) {
    var position = input.value.indexOf('|');
    input.value = input.value.replace('|', '');
    input.selectionStart = input.selectionEnd = position;
  },
}
