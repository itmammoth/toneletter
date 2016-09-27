/*
 * toneletter.js
 *   A jQuery plugin that allows you to put phonetic and tone symbols into text field.
 *
 * GitHub:      https://github.com/itmammoth/toneletter
 * Demo site:   https://toneletter.herokuapp.com/try.html
 *
 */
(function($) {
    var LANG = {
        'th': {
            phonetics: {
                'W': '\u0289',  // ʉ
                'U': '\u0259',  // ə
                'E': '\u025b',  // ɛ
                'O': '\u0254',  // ɔ
                'N': '\u014b',  // ŋ
            },
            // tone 1 (ā), tone 2 (à), tone 3 (â), tone 4 (á), tone 5 (ǎ)
            toneKeys: ['1', '2', '3', '4', '5']
        },
        'cn': {
            phonetics: {
                'U': '\u00FC',  //ü
            },
            // tone 1 (ā), tone 2 (à), tone 3 (â), tone 4 (á), tone 5 (ǎ)
            toneKeys: ['1', '4', null, '2', '3']
        },
    };

    var pluginMethods = {
        init: function(options) {
            var settings = $.extend({
//              lang: '(th|cn)',
//              phonetics: {},  // You can override if you want
//              toneKeys: [],   // You can override if you want
            }, options);

            return this.each(function() {
                var $this = $(this);
                var toneLetterInput = new ToneLetterInput(this, settings);
                toneLetterInput.observe();
                $this.data('toneletter', toneLetterInput);
            });
        },

        addTone: function(toneNumber) {
            return this.each(function() {
                toneLetterInput = $(this).data('toneletter');
                toneLetterInput.addTone(Number(toneNumber) - 1);
            });
        },

        off: function() {
            return this.each(function() {
                toneLetterInput = $(this).data('toneletter');
                toneLetterInput.off();
            });
        },
    };

    $.fn.toneletter = function(method) {
        if (pluginMethods[method]) {
            return pluginMethods[method].apply(this, Array.prototype.slice.call(arguments, 1));
        } else if (typeof method === 'object' || !method) {
            return pluginMethods.init.apply(this, arguments);
        } else {
            $.error('Method ' +  method + ' does not exist on jQuery.toneletter');
        }
    };

    var TONE_CONVERT_TABLE = {
        // i
        '\u0069': ['\u012B', '\u00EC', '\u00EE', '\u00ED', '\u01D0'],
        // e
        '\u0065': ['\u0113', '\u00E8', '\u00EA', '\u00E9', '\u011B'],
        // ɛ
        '\u025B': ['\u025B\u0304', '\u025B\u0300', '\u025B\u0302', '\u025B\u0301', '\u025B\u030C'],
        // ʉ
        '\u0289': ['\u0289\u0304', '\u0289\u0300', '\u0289\u0302', '\u0289\u0301', '\u0289\u030C'],
        // ə
        '\u0259': ['\u0259\u0304', '\u0259\u0300', '\u0259\u0302', '\u0259\u0301', '\u0259\u030C'],
        // a
        '\u0061': ['\u0101', '\u00E0', '\u00E2', '\u00E1', '\u01CE'],
        // u
        '\u0075': ['\u016B', '\u00F9', '\u00FB', '\u00FA', '\u01D4'],
        // o
        '\u006F': ['\u014D', '\u00F2', '\u00F4', '\u00F3', '\u01D2'],
        // ɔ
        '\u0254': ['\u0254\u0304', '\u0254\u0300', '\u0254\u0302', '\u0254\u0301', '\u0254\u030C'],
        // ü
        '\u00FC': ['\u01D6', '\u01DC', '', '\u01D8', '\u01DA'],
    };

    var TONE_SYMBOLS = ['\u0304', '\u0300', '\u0302', '\u0301', '\u030C'];

    /*
     * ToneLetterInput class
     */
    var ToneLetterInput = (function() {

        /*
         * Constructor
         */
        var ToneLetterInput = function(el, settings) {
            this.settings = settings;
            this.el = el;
            this.$el = $(el);

            this.callbacks = {};
            this.__addPhoneticCallbacks(),
            this.__addToneCallbacks()
        };

        /*
         * Instance methods
         */
        ToneLetterInput.prototype = {
            observe: function() {
                this.$el.on('keypress.toneletter', this.__keyPress.bind(this));
            },

            off: function() {
                this.$el.off('.toneletter');
            },

            addTone: function(toneNumber, pressedKey) {
                this.previousCharacter = this.__getPreviousCharacter();

                if (this.__isConvertable(this.previousCharacter)) {
                    this.__insertTone(this.__convertToTone(toneNumber));
                } else if (pressedKey) {
                    this.__insert(pressedKey);
                }
            },

            __keyPress: function(e) {
                var callback = this.callbacks[this.__getPressedChar(e)];
                if (!callback) return;
                callback();
                e.preventDefault();
            },

            __addPhoneticCallbacks: function() {
                var phonetics = $.extend(true, {},
                        LANG[this.settings.lang].phonetics, this.settings.phonetics);
                var that = this;
                $.each(phonetics, function(key, value) {
                    that.callbacks[key] = function() {
                        that.__insert(value);
                    };
                });
            },

            __addToneCallbacks: function(toneKeys) {
                var toneKeys = this.settings.toneKeys || LANG[this.settings.lang].toneKeys;
                var that = this;
                $.each(toneKeys, function(i, key) {
                    if (key == null || key === '') return;
                    that.callbacks[key] = function() {
                        that.addTone(i, key);
                    };
                });
            },

            __getPressedChar: function(e) {
                var charCode = (e.keyCode != 0 ? e.keyCode : e.charCode);
                return String.fromCharCode(charCode);
            },

            __getCursorPosition: function() {
                return this.el.selectionEnd;
            },

            __insertTone: function(tone) {
                this.__backspace();
                this.__insert(tone);
            },

            __insert: function(character) {
                var at = this.__getCursorPosition();
                this.el.value =
                      this.el.value.slice(0, at)
                    + character
                    + this.el.value.slice(at);
                this.__setCursor(at + character.length);
            },

            __setCursor: function(position) {
                this.el.focus();
                this.el.selectionStart = this.el.selectionEnd = position;
            },

            __getPreviousCharacter: function() {
                var position = this.__getCursorPosition();
                var prevChar = this.el.value.charAt(position - 1);
                // Skip if the previous character is just a tone symbol
                if (this.__isTone(prevChar)) {
                    return this.el.value.charAt(position - 2);
                }
                return this.__removeTone(prevChar);
            },

            __isTone: function(character) {
                return TONE_SYMBOLS.indexOf(character) > -1;
            },

            __isConvertable: function(character) {
                return TONE_CONVERT_TABLE[character] !== undefined;
            },

            __convertToTone: function(toneNumber) {
                return TONE_CONVERT_TABLE[this.previousCharacter][toneNumber];
            },

            __backspace: function() {
                var from = this.__getCursorPosition();
                var length = this.__calcBSLength(from, this.previousCharacter);
                this.el.value =
                      this.el.value.slice(0, from - length)
                    + this.el.value.slice(from)
                this.__setCursor(from - length);
            },

            __calcBSLength: function(position, character) {
                return this.el.value.substring(0, position)
                                    .split("")
                                    .reverse()
                                    .map(this.__removeTone)
                                    .indexOf(character) + 1;
            },

            __removeTone: function(character) {
                for (var vowel in TONE_CONVERT_TABLE) {
                    if (TONE_CONVERT_TABLE[vowel].indexOf(character) > -1) {
                        return vowel;
                    }
                }
                return character;
            },
        };

        return ToneLetterInput;
    })();

})(jQuery);
