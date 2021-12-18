# toneletter.js

Toneletter is a javascript plugin that allows you to put phonetic/tone symbols into your text fields with simple key bindings.

# Support languages

* Thai (ไทย)
* Chinese Pinyin (拼音)

# How it works

![demo](https://github.com/itmammoth/toneletter/blob/images/toneletter-demo.gif)
You can try toneletter.js [on this demo page](http://itmammoth.github.io/toneletter/).

# Installation

```bash
$ npm install toneletter --save-dev
```

Or just download `dist/toneletter.min.js`.

# Usage

## For browsers

Include toneletter.js.

```javascript
// for browser
<script src="toneletter.min.js"></script>

// Node
const Toneletter = require("toneletter");

// ES6
import Toneletter from "toneletter";
```

Toneletterize input/textarea.

```javascript
const input = document.getElementById("text");
const toneletter = new Toneletter(input, { lang: 'th' });
toneletter.observe(); // Start observation on keydown
```

You'll have special key bindings on it with default ```lang: 'th'``` option.
* Press '1'~'5' key behind a vowel to add a tone letter.
  * tone 1 (ā), tone 2 (à), tone 3 (â), tone 4 (á), tone 5 (ǎ)
* Type 'W' key to put a phonetic letter 'ʉ'
* Type 'U' key to put a phonetic letter 'ə'
* Type 'E' key to put a phonetic letter 'ɛ'
* Type 'O' key to put a phonetic letter 'ɔ'
* Type 'N' key to put a phonetic letter 'ŋ'

In the case of ```lang: 'cn'```,  it works with Chinese Pinyin bindings.
* Press '1'~'4' key behind a vowel to add a tone letter.
  * tone 1 (ā), tone 2 (á), tone 3 (ǎ), tone 4 (à)
* Type 'U' key to put a phonetic letter 'ü'

# Font

Sometimes phonetic symbols can be troublesome in a proper displaying. If you have no idea about which font is suitable to nicely show the symbols, you can put the fonts below as `font-family` in your css definitions.

```
.toneletter {
  font-family: "Lucida Sans Unicode", "DejaVu Sans", "Arial Unicode MS", serif;
}
```

# Options
You can initialize with some options.

|key             |type         |description                                                                              |
|----------------|-------------|-----------------------------------------------------------------------------------------|
|lang            |String       |Choose 'th' or 'cn'                                                                      |
|phoneticSymbols |Object       |Specify custom bindings and symbols with ```{ key: phonetics }``` object if you want     |
|toneKeys        |Array<String>|Specify any keys for putting tones ā, à, â, á, ǎ if you don't like default key bindings|

Here's an example.
```javascript
new Toneletter(input, ({
  lang: 'th',
  toneKeys: ['0', '1', '2', '3', '4'],  // for tones ā, à, â, á, ǎ
  phonetics: {
    'U': '\u0289', // ʉ
    'A': '\u0259', // ə
    'E': '\u025b', // ɛ
    '@': '\u0254', // ɔ
    'G': '\u014b', // ŋ
  },
});
```

# Methods
#### Toneletter#addTone(toneNumber: Number)

Add a tone symbol functionally at current cursor position.

```javascript
const input = document.getElementById("text");
const toneletter = new Toneletter(input, { lang: 'th' });

// Now your cursor is behind a vowel like [pho|m]

toneletter.addTone(4); // You'll get [phǒm]
```

#### Toneletter#off()

Turn off the observer on keydown.

```javascript
const input = document.getElementById("text");
const toneletter = new Toneletter(input, { lang: 'th' });
toneletter.observe();
...
toneletter.off(); // Stop the observation.
```

# Developing

Fork it, then getting some packages with using npm.
```
$ npm install
```
Other npm tasks.
```bash
$ npm run start   # staring dev server
$ npm run test    # testing
$ npm run build   # build for release
```

# License
Licensed under the MIT License.
