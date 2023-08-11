// Saves options to chrome.storage
function save_options() {
  var window_positions = document.getElementById('window_positions').value;
  var text_color = document.getElementById('text_color').value;
  var background_color = document.getElementById('background_color').value;
  var tab_text = document.getElementById('tab_text').value;
  var element_speava_select_language = document.getElementById('select_language');
  var element_speava_select_dialect = document.getElementById('select_dialect');
  var speava_select_language_value = langs[element_speava_select_language.options.selectedIndex];
  var speava_select_language = element_speava_select_dialect.value;

  chrome.storage.sync.set({
    window_positions: window_positions,
    text_color: text_color,
    background_color: background_color,
    tab_text: tab_text,
    speava_select_language: speava_select_language
  }, function() {
    // Update status to let user know options were saved.
    var status = document.getElementById('status');
    status.textContent = 'Options saved.';
    setTimeout(function() {
      status.textContent = '';
    }, 750);
  });
}

// Restores select box and checkbox state using the preferences
// stored in chrome.storage.
function restore_options() {
  // Use default value color = 'red' and likesColor = true.
  chrome.storage.sync.get({
    window_positions: '{"z_index":"65000","elem_others.style.width":"1000px","elem_others.style.top":"300px","fixed_part_of_utterance.style.width":"800px",,"buttons.style.top":"100px"}',
    text_color: "#FFFFFF",
    background_color: "#000000",
    tab_text:'word\tdef\tdetails\ntest\ttest def\ttest detail description',
    speava_select_language: "en-US"
  }, function(items) {
    document.getElementById('window_positions').value = items.window_positions;
    document.getElementById('text_color').value = items.text_color;
    document.getElementById('background_color').value = items.background_color;
    document.getElementById('tab_text').value = items.tab_text;
    const item_number = list_of_codes( items.speava_select_language);
    document.getElementById('select_language').value = item_number;
    updateCountry();
    // dialect has to be set after script populats country values
    document.getElementById('select_dialect').value = items.speava_select_language;

  });
}

const updateCountry = () => {
    const speava_select_language = document.getElementById('select_language');
    const speava_select_dialect = document.getElementById('select_dialect');
    for (var i = speava_select_dialect.options.length - 1; i >= 0; i--) {
      speava_select_dialect.remove(i);
    }
    var list = langs[speava_select_language.selectedIndex];
    for (var i = 1; i < list.length; i++) {
      speava_select_dialect.options.add(new Option(list[i][1], list[i][0]));
    }
    speava_select_dialect.style.visibility = list[1].length == 1 ? 'hidden' : 'visible';
}


document.addEventListener('DOMContentLoaded', restore_options);
document.getElementById('option_save').addEventListener('click',
    save_options);

document.getElementById('select_language').addEventListener('change', updateCountry);

const list_of_codes = (language_code) => {
    let list_code = [];
    let list_counter = -1;
    let found_at = 0;
    langs.forEach(item => {
      if (item[1].length === 1){
        // console.log(item[1][0])
        list_counter++;
        if (item[1][0] === language_code){
          found_at = list_counter;
          // return list_counter;
        }

      } else {
        list_counter++;
        item.forEach(subitem => {
          if (subitem.length===2){
            // console.log(subitem[0])
            // list_code.push([subitem[0],list_counter]);
            if (subitem[0] === language_code){
              found_at = list_counter;
              // return list_counter;
            }
          }
        } )
      }
    });
    return found_at;
}

// adjusted code part from https://www.google.com/intl/ja/chrome/demos/speech.html
// If you modify this array, also update default language / dialect below.
var langs =
[['Afrikaans',       ['af-ZA']],
 ['አማርኛ',           ['am-ET']],
 ['Azərbaycanca',    ['az-AZ']],
 ['বাংলা',            ['bn-BD', 'বাংলাদেশ'],
                     ['bn-IN', 'ভারত']],
 ['Bahasa Indonesia',['id-ID']],
 ['Bahasa Melayu',   ['ms-MY']],
 ['Català',          ['ca-ES']],
 ['Čeština',         ['cs-CZ']],
 ['Dansk',           ['da-DK']],
 ['Deutsch',         ['de-DE']],
 ['English',         ['en-AU', 'Australia'],
                     ['en-CA', 'Canada'],
                     ['en-IN', 'India'],
                     ['en-KE', 'Kenya'],
                     ['en-TZ', 'Tanzania'],
                     ['en-GH', 'Ghana'],
                     ['en-NZ', 'New Zealand'],
                     ['en-NG', 'Nigeria'],
                     ['en-ZA', 'South Africa'],
                     ['en-PH', 'Philippines'],
                     ['en-GB', 'United Kingdom'],
                     ['en-US', 'United States']],
 ['Español',         ['es-AR', 'Argentina'],
                     ['es-BO', 'Bolivia'],
                     ['es-CL', 'Chile'],
                     ['es-CO', 'Colombia'],
                     ['es-CR', 'Costa Rica'],
                     ['es-EC', 'Ecuador'],
                     ['es-SV', 'El Salvador'],
                     ['es-ES', 'España'],
                     ['es-US', 'Estados Unidos'],
                     ['es-GT', 'Guatemala'],
                     ['es-HN', 'Honduras'],
                     ['es-MX', 'México'],
                     ['es-NI', 'Nicaragua'],
                     ['es-PA', 'Panamá'],
                     ['es-PY', 'Paraguay'],
                     ['es-PE', 'Perú'],
                     ['es-PR', 'Puerto Rico'],
                     ['es-DO', 'República Dominicana'],
                     ['es-UY', 'Uruguay'],
                     ['es-VE', 'Venezuela']],
 ['Euskara',         ['eu-ES']],
 ['Filipino',        ['fil-PH']],
 ['Français',        ['fr-FR']],
 ['Basa Jawa',       ['jv-ID']],
 ['Galego',          ['gl-ES']],
 ['ગુજરાતી',           ['gu-IN']],
 ['Hrvatski',        ['hr-HR']],
 ['IsiZulu',         ['zu-ZA']],
 ['Íslenska',        ['is-IS']],
 ['Italiano',        ['it-IT', 'Italia'],
                     ['it-CH', 'Svizzera']],
 ['ಕನ್ನಡ',             ['kn-IN']],
 ['ភាសាខ្មែរ',          ['km-KH']],
 ['Latviešu',        ['lv-LV']],
 ['Lietuvių',        ['lt-LT']],
 ['മലയാളം',          ['ml-IN']],
 ['मराठी',             ['mr-IN']],
 ['Magyar',          ['hu-HU']],
 ['ລາວ',              ['lo-LA']],
 ['Nederlands',      ['nl-NL']],
 ['नेपाली भाषा',        ['ne-NP']],
 ['Norsk bokmål',    ['nb-NO']],
 ['Polski',          ['pl-PL']],
 ['Português',       ['pt-BR', 'Brasil'],
                     ['pt-PT', 'Portugal']],
 ['Română',          ['ro-RO']],
 ['සිංහල',          ['si-LK']],
 ['Slovenščina',     ['sl-SI']],
 ['Basa Sunda',      ['su-ID']],
 ['Slovenčina',      ['sk-SK']],
 ['Suomi',           ['fi-FI']],
 ['Svenska',         ['sv-SE']],
 ['Kiswahili',       ['sw-TZ', 'Tanzania'],
                     ['sw-KE', 'Kenya']],
 ['ქართული',       ['ka-GE']],
 ['Հայերեն',          ['hy-AM']],
 ['தமிழ்',            ['ta-IN', 'இந்தியா'],
                     ['ta-SG', 'சிங்கப்பூர்'],
                     ['ta-LK', 'இலங்கை'],
                     ['ta-MY', 'மலேசியா']],
 ['తెలుగు',           ['te-IN']],
 ['Tiếng Việt',      ['vi-VN']],
 ['Türkçe',          ['tr-TR']],
 ['اُردُو',            ['ur-PK', 'پاکستان'],
                     ['ur-IN', 'بھارت']],
 ['Ελληνικά',         ['el-GR']],
 ['български',         ['bg-BG']],
 ['Pусский',          ['ru-RU']],
 ['Српски',           ['sr-RS']],
 ['Українська',        ['uk-UA']],
 ['한국어',            ['ko-KR']],
 ['中文',             ['cmn-Hans-CN', '普通话 (中国大陆)'],
                     ['cmn-Hans-HK', '普通话 (香港)'],
                     ['cmn-Hant-TW', '中文 (台灣)'],
                     ['yue-Hant-HK', '粵語 (香港)']],
 ['日本語',           ['ja-JP']],
 ['हिन्दी',             ['hi-IN']],
 ['ภาษาไทย',         ['th-TH']]];

const speava_select_language = document.getElementById('select_language');

for (var i = 0; i < langs.length; i++) {
  speava_select_language.options[i] = new Option(langs[i][0], i);
}
// Set default language / dialect.
// select_language.selectedIndex = 10;
updateCountry();
// select_dialect.selectedIndex = 11;