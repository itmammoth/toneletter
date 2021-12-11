const PHONETIC_KEY_AND_SYMBOLS = Object.freeze([
  ["W", "ʉ"],
  ["U", "ə"],
  ["E", "ɛ"],
  ["O", "ɔ"],
  ["N", "ŋ"],
]);
const TONE_KEYS = Object.freeze(["1", "2", "3", "4", "5"]);
const VOWEL_AND_TONES = Object.freeze({
  i: ["ī", "ì", "î", "í", "ǐ"],
  e: ["ē", "è", "ê", "é", "ě"],
  ɛ: ["ɛ̄", "ɛ̀", "ɛ̂", "ɛ́", "ɛ̌"],
  ʉ: ["ʉ̄", "ʉ̀", "ʉ̂", "ʉ́", "ʉ̌"],
  ə: ["ə̄", "ə̀", "ə̂", "ə́", "ə̌"],
  a: ["ā", "à", "â", "á", "ǎ"],
  u: ["ū", "ù", "û", "ú", "ǔ"],
  o: ["ō", "ò", "ô", "ó", "ǒ"],
  ɔ: ["ɔ̄", "ɔ̀", "ɔ̂", "ɔ́", "ɔ̌"],
});

describe("$.fn.toneletter", () => {
  let $el;

  beforeEach(() => {
    $el = $("<textarea></textarea>");
    $el.toneletter({ lang: "th" });
  });

  it("should return jQuery object", () => {
    expect($el.jquery).toBe("3.6.0");
  });
});

describe("#init", () => {
  let $el;
  let el;

  beforeEach(() => {
    $el = $("<textarea></textarea>");
    $el.appendTo("body"); // This is necessary for chrome to set selectionStart/End.
    el = $el[0];
  });

  describe("with phonetics options", () => {
    it("should override the phonetics conversion (deeply merged)", () => {
      $el.toneletter({ lang: "th", phonetics: { a: ["X"] } });
      $el.trigger(helper.createKeypressEvent("a"));
      $el.trigger(helper.createKeypressEvent("W"));
      expect($el.val()).toBe("Xʉ");
    });
  });

  describe("with toneKeys options", () => {
    it("should override the tone keys", () => {
      $el.toneletter({ lang: "th", toneKeys: ["9"] });
      $el.val("a|b");
      helper.setCursorAtPipeline(el);
      $el.trigger(helper.createKeypressEvent("9"));
      expect($el.val()).toBe("āb");
    });
  });
});

describe("#off", () => {
  let $el;
  let el;

  beforeEach(() => {
    $el = $("<textarea></textarea>");
    $el.appendTo("body");
    el = $el[0];
  });

  it("should stop the observation", () => {
    $input = $el.toneletter({ lang: "th" });
    $input.off();
    $el.val("a|");
    helper.setCursorAtPipeline(el);
    $el.trigger(helper.createKeypressEvent("1"));
    expect($el.val()).toBe("a");
  });
});

describe('On toneletter input with lang: "th"', () => {
  let $el;
  let el;

  beforeEach(() => {
    $el = $("<input>").toneletter({ lang: "th" });
    el = $el[0];
    $el.appendTo("body");
  });

  describe("Pressing a tone key at the beginning of a line", () => {
    beforeEach(() => {
      $el.trigger(helper.createKeypressEvent("1"));
    });

    it("should insert a number as normal", () => {
      expect($el.val()).toBe("1");
    });
  });

  PHONETIC_KEY_AND_SYMBOLS.forEach((keyAndConverted) => {
    const key = keyAndConverted[0],
      converted = keyAndConverted[1];

    describe('Pressing key "' + key + '"', () => {
      beforeEach(() => {
        $el.trigger(helper.createKeypressEvent(key));
      });

      it(`should insert '${converted}' instead of '${key}'`, () => {
        expect($el.val()).toBe(converted);
      });
      it("should move the cursor to behind", () => {
        expect(el.selectionStart).toBe(1);
        expect(el.selectionEnd).toBe(1);
      });
    });
  });

  $.each(TONE_KEYS, (i, key) => {
    $.each(VOWEL_AND_TONES, (vowel, tones) => {
      const converted = tones[i];
      const initialValue = vowel + vowel + "|" + vowel;
      const expectedValue = vowel + converted + vowel;

      describe(`Pressing key '${key}' at '${initialValue}'`, () => {
        beforeEach(() => {
          $el.val(initialValue);
          helper.setCursorAtPipeline(el);
          $el.trigger(helper.createKeypressEvent(key));
        });

        it(`should change the value to '${expectedValue}'`, () => {
          expect($el.val()).toBe(expectedValue);
        });
        it(`should keep the cursor behind the '${converted}'`, () => {
          assertion.expect_cusrsor_position_to_be(el, 1 + converted.length);
        });
      });
    });
  });

  TONE_KEYS.forEach((key) => {
    const initialValue = "ab|a";
    describe(`Pressing '${key}' key behind a consonant like '${initialValue}'`, () => {
      const expectedValue = "ab" + key + "a";
      beforeEach(() => {
        $el.val(initialValue);
        helper.setCursorAtPipeline(el);
        $el.trigger(helper.createKeypressEvent(key));
      });

      it(`should insert number to be '${expectedValue}'`, () => {
        expect($el.val()).toBe(expectedValue);
      });
      it(`should move the cursor to behind the '${key}'`, () => {
        assertion.expect_cusrsor_position_to_be(el, 3);
      });
    });
  });

  $.each(VOWEL_AND_TONES, (vowel, tones) => {
    tones.forEach((converted, i) => {
      const expectedValue = "x" + converted + "x";
      const key = String(i + 1);

      tones.forEach((initial, j) => {
        const initialValue = "x" + initial + "|" + "x";

        describe(`Pressing key '${key}' when the value is '${initialValue}'`, () => {
          beforeEach(() => {
            $el.val(initialValue);
            helper.setCursorAtPipeline(el);
            $el.trigger(helper.createKeypressEvent(key));
          });

          if (i === j) {
            it("should not change the value", () => {
              expect($el.val()).toBe(expectedValue);
            });
          } else {
            it(`should change the value to '${expectedValue}'`, () => {
              expect($el.val()).toBe(expectedValue);
            });
          }
          it(`should keep the cursor behind the '${converted}'`, () => {
            assertion.expect_cusrsor_position_to_be(el, 1 + converted.length);
          });
        });
      });
    });
  });
});
