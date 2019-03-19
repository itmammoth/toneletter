$(document).ready(function() {
    $('#example1').toneletter({ lang: 'th' });
    $('#example2').toneletter({ lang: 'th' });
    $text3 = $('#example3').toneletter({ lang: 'th' });
    $text4 = $('#example4').toneletter({ lang: 'th' });
    $('#example5').toneletter({
        lang: 'th',
        toneKeys: ['0', '1', '2', '3', '4'],
        phonetics: {
            'U': '\u0289',
            'A': '\u0259',
            'E': '\u025b',
            '@': '\u0254',
            'G': '\u014b',
        },
    });
    $('#example6').toneletter({ lang: 'cn' });

    $('#off').click(function(e) {
        $text3.toneletter('off');
    });

    $('.add-tone').click(function(e) {
        $text4.toneletter('addTone', e.currentTarget.dataset.toneNumber);
    });
});

