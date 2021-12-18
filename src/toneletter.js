const LANG_SETTINGS = Object.freeze({
  th: {
    phoneticSymbols: {
      W: "\u0289", // ʉ
      U: "\u0259", // ə
      E: "\u025b", // ɛ
      O: "\u0254", // ɔ
      N: "\u014b", // ŋ
    },
    // tone 1 (ā), tone 2 (à), tone 3 (â), tone 4 (á), tone 5 (ǎ)
    toneKeys: ["1", "2", "3", "4", "5"],
  },
  cn: {
    phoneticSymbols: {
      U: "\u00FC", //ü
    },
    // tone 1 (ā), tone 2 (à), tone 3 (â), tone 4 (á), tone 5 (ǎ)
    toneKeys: ["1", "4", null, "2", "3"],
  },
});

const TONE_CONVERT_TABLE = Object.freeze({
  // i
  "\u0069": ["\u012B", "\u00EC", "\u00EE", "\u00ED", "\u01D0"],
  // e
  "\u0065": ["\u0113", "\u00E8", "\u00EA", "\u00E9", "\u011B"],
  // ɛ
  "\u025B": [
    "\u025B\u0304",
    "\u025B\u0300",
    "\u025B\u0302",
    "\u025B\u0301",
    "\u025B\u030C",
  ],
  // ʉ
  "\u0289": [
    "\u0289\u0304",
    "\u0289\u0300",
    "\u0289\u0302",
    "\u0289\u0301",
    "\u0289\u030C",
  ],
  // ə
  "\u0259": [
    "\u0259\u0304",
    "\u0259\u0300",
    "\u0259\u0302",
    "\u0259\u0301",
    "\u0259\u030C",
  ],
  // a
  "\u0061": ["\u0101", "\u00E0", "\u00E2", "\u00E1", "\u01CE"],
  // u
  "\u0075": ["\u016B", "\u00F9", "\u00FB", "\u00FA", "\u01D4"],
  // o
  "\u006F": ["\u014D", "\u00F2", "\u00F4", "\u00F3", "\u01D2"],
  // ɔ
  "\u0254": [
    "\u0254\u0304",
    "\u0254\u0300",
    "\u0254\u0302",
    "\u0254\u0301",
    "\u0254\u030C",
  ],
  // ü
  "\u00FC": ["\u01D6", "\u01DC", "", "\u01D8", "\u01DA"],
});

const TONE_SYMBOLS = Object.freeze([
  "\u0304",
  "\u0300",
  "\u0302",
  "\u0301",
  "\u030C",
]);

export default class Toneletter {
  constructor(
    inputElement,
    settings = { lang: "", phoneticSymbols: null, toneKeys: null }
  ) {
    if (!inputElement) {
      throw new Error("`inputElement` must be given");
    }
    if (settings.lang === "") {
      throw new Error("`settings.lang` must be given");
    }
    if (!["th", "cn"].includes(settings.lang)) {
      throw new Error("`settings.lang` must be 'th' or 'cn'");
    }

    this.inputElement = inputElement;
    const phoneticSymbols =
      settings.phoneticSymbols ?? LANG_SETTINGS[settings.lang].phoneticSymbols;
    const toneKeys = settings.toneKeys ?? LANG_SETTINGS[settings.lang].toneKeys;
    this.__keyToCallbacks = {
      ...this.__createPhoneticSymbolCallbacks(phoneticSymbols),
      ...this.__createToneCallbacks(toneKeys),
    };
  }

  get version() {
    // TODO: retrive from package.json
    return "2.0.0";
  }

  observe() {
    this.__onKeyDown.__bound = (e) => this.__onKeyDown(e);
    this.inputElement.addEventListener("keydown", this.__onKeyDown.__bound);
  }
  
  off() {
    this.inputElement.removeEventListener("keydown", this.__onKeyDown.__bound);
  }

  addTone(toneNumber, pressedKey) {
    if (this.__isConvertable(this.__previousCharacter)) {
      this.__insertTone(this.__convertToTone(toneNumber));
    } else if (pressedKey) {
      this.__insert(pressedKey);
    }
  }

  __createPhoneticSymbolCallbacks(phoneticSymbols) {
    return Object.entries(phoneticSymbols).reduce((accum, [key, symbol]) => {
      accum[key] = () => {
        this.__insert(symbol);
      };
      return accum;
    }, {});
  }

  __createToneCallbacks(toneKeys) {
    return toneKeys.reduce((accum, key, i) => {
      if (key) {
        accum[key] = () => {
          this.addTone(i, key);
        };
      }
      return accum;
    }, {});
  }

  __onKeyDown(e) {
    const callback = this.__keyToCallbacks[e.key];
    if (callback) {
      callback();
      e.preventDefault();
      return;
    }
  }

  __insert(text) {
    var at = this.__cursorPosition;
    this.inputElement.value =
      this.inputElement.value.slice(0, at) +
      text +
      this.inputElement.value.slice(at);
    this.__setCursor(at + text.length);
  }

  __insertTone(tone) {
    this.__backspace();
    this.__insert(tone);
  }

  __backspace() {
    const from = this.__cursorPosition;
    const length = this.__calcBSLength(from, this.__previousCharacter);
    this.inputElement.value =
      this.inputElement.value.slice(0, from - length) +
      this.inputElement.value.slice(from);
    this.__setCursor(from - length);
  }

  __calcBSLength(position, character) {
    return (
      this.inputElement.value
        .substring(0, position)
        .split("")
        .reverse()
        .map(this.__removeTone)
        .indexOf(character) + 1
    );
  }

  get __cursorPosition() {
    return this.inputElement.selectionEnd;
  }

  get __previousCharacter() {
    const position = this.__cursorPosition;
    const prevChar = this.inputElement.value.charAt(position - 1);
    if (prevChar === "") return prevChar;
    // Skip if the previous character is just a tone symbol
    if (this.__isTone(prevChar)) {
      return this.inputElement.value.charAt(position - 2);
    }
    return this.__removeTone(prevChar);
  }

  __setCursor(position) {
    this.inputElement.focus();
    this.inputElement.selectionStart = this.inputElement.selectionEnd =
      position;
  }

  __isTone(character) {
    return TONE_SYMBOLS.indexOf(character) > -1;
  }

  __isConvertable(character) {
    return TONE_CONVERT_TABLE[character] !== undefined;
  }

  __convertToTone(toneNumber) {
    return TONE_CONVERT_TABLE[this.__previousCharacter][toneNumber];
  }

  __removeTone(character) {
    for (const vowel in TONE_CONVERT_TABLE) {
      if (TONE_CONVERT_TABLE[vowel].indexOf(character) > -1) {
        return vowel;
      }
    }
    return character;
  }
}