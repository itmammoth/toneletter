# toneletter.js
is a jQuery plugin that allows you to put phonetic and tone symbols into your text fields with simple key binding.

# Support languages
* Thai (ไทย)
* Chinese Pinyin (拼音)

# How it works
![demo](https://raw.githubusercontent.com/wiki/itmammoth/toneletter/images/toneletter-demo.gif)
You can try toneletter.js [on this demo page](https://toneletter.herokuapp.com/try.html).

# Usage
Include toneletter.js after jQuery.
```
<script src="jquery.min.js"></script>
<script src="toneletter.js"></script>
```

Build up text fields to accept phonetic and tone symbols.
```
$('.thai').toneletter({ lang: 'th' });
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

# Options
You can initialize with some options.

|Property|type|default|description|
|----------|-------|----------------------------------------------------------|-----------------------|
|fontFamily|String |'"Lucida Sans Unicode", "DejaVu Sans", "Arial Unicode MS"'|Specify the font family|
|lang      |String<br>('th'\|'cn') |-|Choose Thai or Chinese Pinyin|
|phonetics |Object|-|Specify custom bindings and symbols with ```{ key: phonetics }``` object if you want|
|toneKeys  |Array<String>|-|Specify any keys for putting tones ā, à, â, á, ǎ if you don't like default key bindings|

Here's an example.
```
$('.thai').toneletter({
  fontFamily: 'Osaka',
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
You can invoke some plugin methods.

#### jQuery#toneletter('addTone', toneNumber)
Add a tone symbol functionally at current cursor position.
```
$text = $('.text').toneletter({ lang: 'th' });

// Now your cursor is behind a vowel like [pho|m]
$text.toneletter('addTone', 5);
// You'll get [phǒm]
```

#### jQuery#toneletter('off')
Turn off the observer on keypress.
```
$text = $('.text').toneletter({ lang: 'th' });
...
$text.toneletter('off')
```

# Browser Support
* Chrome
* Firefox 40+
* Safari 6+
* Internet Explorer 11+

# Testing
Specs are written using Jasmine and ran with Karma. To run the specs, run ```$ npm run spec```.

# License
Licensed under the MIT License.
