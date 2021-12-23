import Toneletter from '../src/toneletter';

const TONE_TABLE = Object.freeze({
  th: [
    ["i", "1", "ī"],
    ["i", "2", "ì"],
    ["i", "3", "î"],
    ["i", "4", "í"],
    ["i", "5", "ǐ"],
    ["e", "1", "ē"],
    ["e", "2", "è"],
    ["e", "3", "ê"],
    ["e", "4", "é"],
    ["e", "5", "ě"],
    ["ɛ", "1", "ɛ̄"],
    ["ɛ", "2", "ɛ̀"],
    ["ɛ", "3", "ɛ̂"],
    ["ɛ", "4", "ɛ́"],
    ["ɛ", "5", "ɛ̌"],
    ["ʉ", "1", "ʉ̄"],
    ["ʉ", "2", "ʉ̀"],
    ["ʉ", "3", "ʉ̂"],
    ["ʉ", "4", "ʉ́"],
    ["ʉ", "5", "ʉ̌"],
    ["ə", "1", "ə̄"],
    ["ə", "2", "ə̀"],
    ["ə", "3", "ə̂"],
    ["ə", "4", "ə́"],
    ["ə", "5", "ə̌"],
    ["a", "1", "ā"],
    ["a", "2", "à"],
    ["a", "3", "â"],
    ["a", "4", "á"],
    ["a", "5", "ǎ"],
    ["u", "1", "ū"],
    ["u", "2", "ù"],
    ["u", "3", "û"],
    ["u", "4", "ú"],
    ["u", "5", "ǔ"],
    ["o", "1", "ō"],
    ["o", "2", "ò"],
    ["o", "3", "ô"],
    ["o", "4", "ó"],
    ["o", "5", "ǒ"],
    ["ɔ", "1", "ɔ̄"],
    ["ɔ", "2", "ɔ̀"],
    ["ɔ", "3", "ɔ̂"],
    ["ɔ", "4", "ɔ́"],
    ["ɔ", "5", "ɔ̌"],
  ],
  cn: [
    ["i", "1", "ī"],
    ["i", "2", "í"],
    ["i", "3", "ǐ"],
    ["i", "4", "ì"],
  ],
});

const setValueToInputElement = (value, el) => {
  const cursorAt = value.indexOf("|");
  el.value = value.replace("|", "");
  el.selectionStart = el.selectionEnd = cursorAt;
};

describe("Toneletter", () => {
  describe("constructor", () => {
    test("throws an error when inputElement is not given", () => {
      expect(() => new Toneletter()).toThrow("`inputElement` must be given");
    });
    test("throws an error when settings.lang is not given", () => {
      const el = document.createElement("textarea");
      expect(() => new Toneletter(el)).toThrow("`settings.lang` must be given");
    });
    test('throws an error when settings.lang is not included in "th"|"cn"', () => {
      const el = document.createElement("textarea");
      expect(() => new Toneletter(el, { lang: "en" })).toThrow(
        "`settings.lang` must be 'th' or 'cn'"
      );
    });
  });
  describe("#version", () => {
    it("should return current version", () => {
      expect(Toneletter.version).toBe("2.0.5");
    });
  });
  describe("#observe", () => {
    describe("pressing normal keys", () => {
      test("does nothing", () => {
        const el = document.createElement("textarea");
        new Toneletter(el, { lang: "th" }).observe();
        el.dispatchEvent(new KeyboardEvent("keydown", { key: "a" }));
        expect(el.value).toBe("");
      });
    });
    describe("pressing phonetic symbol keys", () => {
      test("puts phonetic symbols (lang: th)", () => {
        const el = document.createElement("textarea");
        new Toneletter(el, { lang: "th" }).observe();
        el.dispatchEvent(new KeyboardEvent("keydown", { key: "W" }));
        el.dispatchEvent(new KeyboardEvent("keydown", { key: "U" }));
        el.dispatchEvent(new KeyboardEvent("keydown", { key: "E" }));
        el.dispatchEvent(new KeyboardEvent("keydown", { key: "O" }));
        el.dispatchEvent(new KeyboardEvent("keydown", { key: "N" }));
        expect(el.value).toBe("ʉəɛɔŋ");
      });
      test("puts phonetic symbols (lang: cn)", () => {
        const el = document.createElement("textarea");
        new Toneletter(el, { lang: "cn" }).observe();
        el.dispatchEvent(new KeyboardEvent("keydown", { key: "U" }));
        expect(el.value).toBe("ü");
      });
    });
    describe("pressing tone keys behind vowels", () => {
      test.each(TONE_TABLE.th)(
        "appends tone to `%s` with pressing `%s` to be `%s` (lang: th)",
        (vowel, key, vowelWithTone) => {
          const el = document.createElement("textarea");
          setValueToInputElement(`${vowel}|z`, el);
          new Toneletter(el, { lang: "th" }).observe();
          el.dispatchEvent(new KeyboardEvent("keydown", { key: key }));
          expect(el.value).toBe(`${vowelWithTone}z`);
          expect(el.selectionStart).toBe(vowelWithTone.length);
          expect(el.selectionEnd).toBe(vowelWithTone.length);
        }
      );
      test.each(TONE_TABLE.cn)(
        "appends tone to `%s` with pressing `%s` to be `%s` (lang: cn)",
        (vowel, key, vowelWithTone) => {
          const el = document.createElement("textarea");
          setValueToInputElement(`${vowel}|z`, el);
          new Toneletter(el, { lang: "cn" }).observe();
          el.dispatchEvent(new KeyboardEvent("keydown", { key: key }));
          expect(el.value).toBe(`${vowelWithTone}z`);
          expect(el.selectionStart).toBe(vowelWithTone.length);
          expect(el.selectionEnd).toBe(vowelWithTone.length);
        }
      );
    });
    describe("pressing tone keys behind non-vowels", () => {
      test.each(TONE_TABLE.th)("does nothing", (_, key, __) => {
        const el = document.createElement("textarea");
        setValueToInputElement("x|y", el);
        new Toneletter(el, { lang: "th" }).observe();
        el.dispatchEvent(new KeyboardEvent("keydown", { key: key }));
        expect(el.value).toBe(`x${key}y`);
        expect(el.selectionStart).toBe(2);
        expect(el.selectionEnd).toBe(2);
      });
    });
    describe("override settings", () => {
      test("overrides phoneticSymbols when settings.phoneticSymbols is given", () => {
        const el = document.createElement("textarea");
        new Toneletter(el, {
          lang: "th",
          phoneticSymbols: { a: ["X"] },
        }).observe();
        el.dispatchEvent(new KeyboardEvent("keydown", { key: "a" }));
        expect(el.value).toBe("X");
      });
      test("overrides toneKeys when settings.toneKeys is given", () => {
        const el = document.createElement("textarea");
        setValueToInputElement("a|b", el);
        new Toneletter(el, {
          lang: "th",
          toneKeys: ["9"],
        }).observe();
        el.dispatchEvent(new KeyboardEvent("keydown", { key: "9" }));
        expect(el.value).toBe("āb");
      });
    });
  });
  describe("#off", () => {
    test("stops the observation", () => {
      const el = document.createElement("textarea");
      const toneletter = new Toneletter(el, { lang: "th" });
      toneletter.observe();
      toneletter.off();
      el.dispatchEvent(new KeyboardEvent("keydown", { key: "W" }));
      expect(el.value).toBe("");
    });
  });
  describe("#addTone", () => {
    test("adds a tone to the vowel behind cursor", () => {
      const el = document.createElement("textarea");
      setValueToInputElement("a|", el);
      const toneletter = new Toneletter(el, { lang: "th" });
      toneletter.addTone(0, "1");
      expect(el.value).toBe("ā");
    });
    test("put as typed", () => {
      const el = document.createElement("textarea");
      setValueToInputElement("b|", el);
      const toneletter = new Toneletter(el, { lang: "th" });
      toneletter.addTone(0, "1");
      expect(el.value).toBe("b1");
    });
  });
});
