PHONETICS = [['W', 'ʉ'], ['U', 'ə'], ['E', 'ɛ'], ['O', 'ɔ'], ['N', 'ŋ']];
KEYS = ['1', '2', '3', '4', '5'];
VOWEL_AND_TONES = {
    'i': ['ī', 'ì', 'î', 'í', 'ǐ'],
    'e': ['ē', 'è', 'ê', 'é', 'ě'],
    'ɛ': ['ɛ̄', 'ɛ̀', 'ɛ̂', 'ɛ́', 'ɛ̌'],
    'ʉ': ['ʉ̄', 'ʉ̀', 'ʉ̂', 'ʉ́', 'ʉ̌'],
    'ə': ['ə̄', 'ə̀', 'ə̂', 'ə́', 'ə̌'],
    'a': ['ā', 'à', 'â', 'á', 'ǎ'],
    'u': ['ū', 'ù', 'û', 'ú', 'ǔ'],
    'o': ['ō', 'ò', 'ô', 'ó', 'ǒ'],
    'ɔ': ['ɔ̄', 'ɔ̀', 'ɔ̂', 'ɔ́', 'ɔ̌'],
};


describe('$.fn.toneletter', function() {
    var $el;

    beforeEach(function() {
        $el = $('<textarea></textarea>');
        $el.toneletter({ lang: 'th' });
    });

    it('should return jQuery object', function() {
        expect($el.jquery).toBe('1.11.3');
    });
});

describe('#init', function() {
    var $el;
    var el;

    beforeEach(function() {
        $el = $('<textarea></textarea>');
        $el.appendTo('body'); // This is necessary for chrome to set selectionStart/End.
        el = $el[0];
    });

    describe('with default options', function() {
        it('should set fonts suitable for displaying tones', function() {
            $el.toneletter({ lang: 'th' });
            expect($el.css('font-family')).toContain('Lucida Sans Unicode');
            expect($el.css('font-family')).toContain('DejaVu Sans');
            expect($el.css('font-family')).toContain('Arial Unicode MS');
        });
    });

    describe('with phonetics options', function() {
        it('should override the phonetics conversion (deeply merged)', function() {
            $el.toneletter({ lang: 'th', phonetics: { 'a': ['X'] } });
            $el.trigger(helper.createKeypressEvent('a'));
            $el.trigger(helper.createKeypressEvent('W'));
            expect($el.val()).toBe('Xʉ');
        });
    });

    describe('with toneKeys options', function() {
        it('should override the tone keys', function() {
            $el.toneletter({ lang: 'th', toneKeys: ['9'] });
            $el.val('a|b');
            helper.setCursorAtPipeline(el);
            $el.trigger(helper.createKeypressEvent('9'));
            expect($el.val()).toBe('āb');
        });
    });
});

describe('#off', function() {
    var $el;
    var el;

    beforeEach(function() {
        $el = $('<textarea></textarea>');
        $el.appendTo('body');
        el = $el[0];
    });

    it('should stop the observation', function() {
        $input = $el.toneletter({ lang: 'th' });
        $input.off();
        $el.val('a|');
        helper.setCursorAtPipeline(el);
        $el.trigger(helper.createKeypressEvent('1'));
        expect($el.val()).toBe('a');
    });
});

describe('On toneletter input with lang: "th"', function() {
    var $el;
    var el;

    beforeEach(function() {
        $el = $('<input>').toneletter({ lang: 'th' });
        el = $el[0];
        $el.appendTo('body');
    });

    PHONETICS.forEach(function(keyAndConverted) {
        var key = keyAndConverted[0],
        converted = keyAndConverted[1];

        describe('Pressing key "' + key + '"', function() {
            beforeEach(function() {
                $el.trigger(helper.createKeypressEvent(key));
            });

            it('should insert "' + converted + '" instead of "' + key + '"', function() {
                expect($el.val()).toBe(converted);
            });
            it('should move the cursor to behind', function() {
                expect(el.selectionStart).toBe(1);
                expect(el.selectionEnd).toBe(1);
            });
        });
    });

    $.each(KEYS, function(i, key) {
        $.each(VOWEL_AND_TONES, function(vowel, tones) {
            var converted = tones[i];
            var initialValue = vowel + vowel + '|' + vowel;
            var expectedValue = vowel + converted + vowel;

            describe('Pressing key "' + key + '" at "' + initialValue + '"', function() {
                beforeEach(function() {
                    $el.val(initialValue);
                    helper.setCursorAtPipeline(el);
                    $el.trigger(helper.createKeypressEvent(key));
                });

                it('should change the value to "' + expectedValue + '"', function() {
                    expect($el.val()).toBe(expectedValue);
                });
                it('should keep the cursor behind the "' + converted + '"', function() {
                    assertion.expect_cusrsor_position_to_be(el, 1 + converted.length)
                });
            });
        });
    });

    KEYS.forEach(function(key) {
        var initialValue = 'ab|a'
            describe('Pressing "' + key + '" key behind a consonant like "' + initialValue +'"', function() {
                var expectedValue = 'ab' + key + 'a'
                    beforeEach(function() {
                        $el.val(initialValue);
                        helper.setCursorAtPipeline(el);
                        $el.trigger(helper.createKeypressEvent(key));
                    });

                it('should insert number to be "' + expectedValue + '"', function() {
                    expect($el.val()).toBe(expectedValue);
                });
                it('should move the cursor to behind the "' + key + '"', function() {
                    assertion.expect_cusrsor_position_to_be(el, 3)
                });
            });
    });

    $.each(VOWEL_AND_TONES, (function(vowel, tones) {

        tones.forEach(function(converted, i) {
            var expectedValue = 'x' + converted + 'x';
            var key = String(i + 1);

            tones.forEach(function(initial, j) {
                var initialValue = 'x' + initial + '|' + 'x';

                describe('Pressing key "' + key + '" when the value is "' + initialValue + '"', function() {
                    beforeEach(function() {
                        $el.val(initialValue);
                        helper.setCursorAtPipeline(el);
                        $el.trigger(helper.createKeypressEvent(key));
                    });

                    if (i === j) {
                        it('should not change the value', function() {
                            expect($el.val()).toBe(expectedValue);
                        });
                    } else {
                        it('should change the value to "' + expectedValue + '"', function() {
                            expect($el.val()).toBe(expectedValue);
                        });
                    }
                    it('should keep the cursor behind the "' + converted + '"', function() {
                        assertion.expect_cusrsor_position_to_be(el, 1 + converted.length)
                    });
                });
            });
        });
    }));
});
