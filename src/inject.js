try {
try {

;(() => {
  ////////////////////////////////////////////////////////////////////////////
  // Variables
  ////////////////////////////////////////////////////////////////////////////

  // set to true when we are recording transcriptions
  let isTranscribing = false;
  let isShowing = false;

  let isTextAreaCreated = null;
  let buttons = null;
  let caption_lines = [];
  let tab_text_array = [];

  let text_color;

  let SpeechRecognition;
  let recognition;
  let finalTranscript = '';

  let speava_select_language;
  // adjusted code part from https://www.google.com/intl/ja/chrome/demos/speech.html
  // If you modify this array, also update default language / dialect below.
  const langs =
      [['Afrikaans', ['af-ZA']],
        ['አማርኛ', ['am-ET']],
        ['Azərbaycanca', ['az-AZ']],
        ['বাংলা', ['bn-BD', 'বাংলাদেশ'],
          ['bn-IN', 'ভারত']],
        ['Bahasa Indonesia', ['id-ID']],
        ['Bahasa Melayu', ['ms-MY']],
        ['Català', ['ca-ES']],
        ['Čeština', ['cs-CZ']],
        ['Dansk', ['da-DK']],
        ['Deutsch', ['de-DE']],
        ['English', ['en-AU', 'Australia'],
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
        ['Español', ['es-AR', 'Argentina'],
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
        ['Euskara', ['eu-ES']],
        ['Filipino', ['fil-PH']],
        ['Français', ['fr-FR']],
        ['Basa Jawa', ['jv-ID']],
        ['Galego', ['gl-ES']],
        ['ગુજરાતી', ['gu-IN']],
        ['Hrvatski', ['hr-HR']],
        ['IsiZulu', ['zu-ZA']],
        ['Íslenska', ['is-IS']],
        ['Italiano', ['it-IT', 'Italia'],
          ['it-CH', 'Svizzera']],
        ['ಕನ್ನಡ', ['kn-IN']],
        ['ភាសាខ្មែរ', ['km-KH']],
        ['Latviešu', ['lv-LV']],
        ['Lietuvių', ['lt-LT']],
        ['മലയാളം', ['ml-IN']],
        ['मराठी', ['mr-IN']],
        ['Magyar', ['hu-HU']],
        ['ລາວ', ['lo-LA']],
        ['Nederlands', ['nl-NL']],
        ['नेपाली भाषा', ['ne-NP']],
        ['Norsk bokmål', ['nb-NO']],
        ['Polski', ['pl-PL']],
        ['Português', ['pt-BR', 'Brasil'],
          ['pt-PT', 'Portugal']],
        ['Română', ['ro-RO']],
        ['සිංහල', ['si-LK']],
        ['Slovenščina', ['sl-SI']],
        ['Basa Sunda', ['su-ID']],
        ['Slovenčina', ['sk-SK']],
        ['Suomi', ['fi-FI']],
        ['Svenska', ['sv-SE']],
        ['Kiswahili', ['sw-TZ', 'Tanzania'],
          ['sw-KE', 'Kenya']],
        ['ქართული', ['ka-GE']],
        ['Հայերեն', ['hy-AM']],
        ['தமிழ்', ['ta-IN', 'இந்தியா'],
          ['ta-SG', 'சிங்கப்பூர்'],
          ['ta-LK', 'இலங்கை'],
          ['ta-MY', 'மலேசியா']],
        ['తెలుగు', ['te-IN']],
        ['Tiếng Việt', ['vi-VN']],
        ['Türkçe', ['tr-TR']],
        ['اُردُو', ['ur-PK', 'پاکستان'],
          ['ur-IN', 'بھارت']],
        ['Ελληνικά', ['el-GR']],
        ['български', ['bg-BG']],
        ['Pусский', ['ru-RU']],
        ['Српски', ['sr-RS']],
        ['Українська', ['uk-UA']],
        ['한국어', ['ko-KR']],
        ['中文', ['cmn-Hans-CN', '普通话 (中国大陆)'],
          ['cmn-Hans-HK', '普通话 (香港)'],
          ['cmn-Hant-TW', '中文 (台灣)'],
          ['yue-Hant-HK', '粵語 (香港)']],
        ['日本語', ['ja-JP']],
        ['हिन्दी', ['hi-IN']],
        ['ภาษาไทย', ['th-TH']]];


  ////////////////////////////////////////////////////////////////////////////
  // Constants
  ////////////////////////////////////////////////////////////////////////////

  // Version of the format for localstorage data
  const LOCALSTORAGE_VERSION = 1;
  let DEBUG;

  // -------------------------------------------------------------------------
  // make a localStorage key with the version prefixed
  // -------------------------------------------------------------------------
  const makeFullKey = (key, version = LOCALSTORAGE_VERSION) => {
    let versionPostfix = version === null ? '' : `_v${version}`;
    return `__gmla${versionPostfix}_${key}`;
  };

  //
  // // -------------------------------------------------------------------------
  // // make a localStorage key for hangouts following the format above
  // // -------------------------------------------------------------------------
  // const makeTranscriptKey = (...args) => {
  //    const [transcriptId, sessionIndex, speakerIndex] = args;
  //
  //   const keyParts = [`hangout_${transcriptId}`];
  //
  //   if (args.length >= 2) {
  //     keyParts.push(`session_${sessionIndex}`);
  //
  //     if (args.length >= 3) {
  //       keyParts.push(`speaker_${speakerIndex}`);
  //     }
  //   }
  //
  //   return keyParts.join('_');
  // };

  // -------------------------------------------------------------------------
  // retrieve a key from localStorage parsed as JSON
  // -------------------------------------------------------------------------
  const get = (key, version) => {
    const raw = window.localStorage.getItem(makeFullKey(key, version));
    if (typeof raw === 'string' || raw instanceof String) {
      debug(key, raw);
      return JSON.parse(raw);
    } else {
      return raw;
    }
  };

  // -------------------------------------------------------------------------
  // retrieve a key in localStorage stringified as JSON
  // -------------------------------------------------------------------------
  const set = (key, value, version) => {
    window.localStorage.setItem(makeFullKey(key, version), JSON.stringify(value));
  };

  // -------------------------------------------------------------------------
  // delete a key from localStorage
  // -------------------------------------------------------------------------
  const remove = (key, version) => {
    debug(`remove ${makeFullKey(key, version)}`);

    if (!READONLY) {
      window.localStorage.removeItem(makeFullKey(key, version));
    }
  };

  // -------------------------------------------------------------------------
  // get a key from local storage and set it to the default if it doesn't
  // exist yet
  // -------------------------------------------------------------------------
  const getOrSet = (key, defaultValue, version) => {
    const value = get(key, version);

    if (value === undefined || value === null) {
      set(key, defaultValue, version);
      return defaultValue;
    } else {
      return value;
    }
  }

  // -------------------------------------------------------------------------
  // increment a key in local storage, set to to 0 if it doesn't exist
  // -------------------------------------------------------------------------
  const increment = (key, version) => {
    const current = get(key, version);

    if (current === undefined || current === null) {
      set(key, 0);
      return 0;
    } else {
      let next = current + 1;
      set(key, next);
      return next;
    }
  }

  ////////////////////////////////////////////////////////////////////////////
  // DOM Utilities
  ////////////////////////////////////////////////////////////////////////////

  // -------------------------------------------------------------------------
  // execute an xpath query and return the first matching node
  // -------------------------------------------------------------------------
  const xpath = (search, root = document) => {
    return document.evaluate(search, root, null, XPathResult.FIRST_ORDERED_NODE_TYPE).singleNodeValue;
  };

  // -------------------------------------------------------------------------
  // sync settings from localStorage
  // -------------------------------------------------------------------------
  const getAllStorageSyncData = () => {
    // Immediately return a promise and start asynchronous work
    return new Promise((resolve) => {
      // Asynchronously fetch all data from storage.sync.
      chrome.storage.sync.get({
      window_positions: '{"z_index":"65000","elem_others.style.width":"1000px","elem_others.style.top":"300px","fixed_part_of_utterance.style.width":"800px","buttons.style.top":"100px"}',
      text_color: "#FFFFFF",
      background_color: "#000000",
      tab_text:'you know\nyeah\nlike',
      speava_select_language: "en-US"
    }, (items) => {
        // resolve(is_synced = true);
        is_synced = true
        // Pass any observed errors down the promise chain.
        if (chrome.runtime.lastError) {
          return reject(chrome.runtime.lastError);
        }
        // Pass the data retrieved from storage down the promise chain.
        window_positions =       items.window_positions;
        text_color =             items.text_color;
        background_color =       items.background_color;
        tab_text =               items.tab_text;
        speava_select_language = items.speava_select_language;
        setTextArray(tab_text);
        applyFontColor(text_color,background_color);
        applyOptionStyles();
      });
    });
  }

  // -------------------------------------------------------------------------
  // //console.log only if DEBUG is false
  // -------------------------------------------------------------------------
  const debug = (...args) => {
    if (DEBUG) {
      console.log('[google-meet-live-analytics]', ...args);
    }
  };

  const tryTo = (fn, label) => async (...args) => {
    try {
      return await fn(...args);
    } catch (e) {
      console.error(`error ${label}:`, e);
    }
  };

  const open_option_dialog = () => {
    if (chrome.runtime.openOptionsPage) {
      chrome.runtime.openOptionsPage();
    } else {
      let dialog = document.createElement('dialog');
      let request = new Request(chrome.runtime.getURL('options.html'));
      fetch(request).then( function(response){
        return response.text().then( function(text) {
          dialog.innerHTML = text;

          dialog.oncancel = function(){
            dialog.remove();
          }
          const update_select_language = () => {

            const speava_select_language = document.getElementById('select_language');
            for (var i = 0; i < langs.length; i++) {
              speava_select_language.options[i] = new Option(langs[i][0], i);
            }
            // Set default language / dialect.
            // select_language.selectedIndex = 10;
            updateCountry();
            // select_dialect.selectedIndex = 11;
            //showInfo('info_start');
          }
          const save_options = () => {
            window_positions = document.getElementById('window_positions').value;
            text_color = document.getElementById('text_color').value;
            background_color = document.getElementById('background_color').value;
            tab_text = document.getElementById('tab_text').value;
            var element_speava_select_language = document.getElementById('select_language');
            var element_speava_select_dialect = document.getElementById('select_dialect');
            var speava_select_language_value = langs[element_speava_select_language.options.selectedIndex];
            speava_select_language = element_speava_select_dialect.value;

            applyFontColor(text_color,background_color);
            applyOptionStyles();
            setTextArray(tab_text);
            chrome.storage.sync.set({
              window_positions: window_positions,
              text_color: text_color,
              background_color: background_color,
              tab_text: tab_text,
              speava_select_language: speava_select_language
            }, function() {
              var status = document.getElementById('status');
              status.textContent = 'Options saved.';
              setTimeout(function() {
                status.textContent = '';
                dialog.remove();
              }, 750);
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
          const restore_options = () => {
            chrome.storage.sync.get({
              window_positions: '{"z_index":"65000","elem_others.style.width":"1000px","elem_others.style.top":"300px","fixed_part_of_utterance.style.width":"800px","buttons.style.top":"100px"}',
              text_color: "#FFFFFF",
              background_color: "#000000",
              tab_text:'you know\nyeah\nlike',
              speava_select_language: 'en-US'
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
          document.body.appendChild(dialog);
          dialog.showModal();
          update_select_language();
          restore_options();
          document.getElementById('option_save').addEventListener('click',
            save_options);
            });
          });
    }
  }

  // -------------------------------------------------------------------------
  // Toggle adhoc button
  // -------------------------------------------------------------------------
  const turnCaptionsOn_adhoc = () => {
    recognition.lang = speava_select_language;
    const captionsButtonOn = xpath(`//button[@id="webkit_speech_recognition_toggle"]`, document);
    if (captionsButtonOn) {
      if (!captionsButtonOn.classList.contains("speava_button_active")) {
        // captionsButtonOn.click();
        captionsButtonOn.classList.add("speava_button_active");
        recognition.start()
      }
      weTurnedCaptionsOn = true;
    }
  }

  const turnCaptionsOff_adhoc = () => {
    const captionsButtonOff =  xpath(`//button[@id="webkit_speech_recognition_toggle"]`, document);
    if (captionsButtonOff) {
      if (captionsButtonOff.classList.contains("speava_button_active")){
        // captionsButtonOff.click();
        captionsButtonOff.classList.remove("speava_button_active");
      }
      weTurnedCaptionsOn = false;
    }
    recognition.stop();
  }


  const addButtons = () => {
    if (is_synced === null){
      return;
    }
    if (isTextAreaCreated === null) {
      const elem = document.createElement('div');
      elem.id = "space_textarea";
      elem.style.top = "0px"
      elem.style.witdh = "300px"
      elem.style.font.fontcolor(text_color);
      const text = document.createTextNode('Show stats');
      const objBody = document.getElementsByTagName("body").item(0);

      const elem_others = document.createElement('div');
      elem_others.id = "all_others";
      elem_others.style.position = 'absolute';
      elem_others.innerText = 'Place holder for heading';
      objBody.appendChild(elem_others);

      const elem_others_number = document.createElement('div');
      elem_others_number.id = "counting_number";
      elem_others_number.innerText = 'Place holder for number';
      elem_others.appendChild(elem_others_number);

      const toggle_button_div = document.createElement('div');
      const toggle_button = document.createElement('button');
      toggle_button.setAttribute('id',`webkit_speech_recognition_toggle`)
      toggle_button.innerText = "caption on/off";
      toggle_button.setAttribute('class',"speava_button");
      toggle_button.onclick = () => {
        isTranscribing ? stopTranscribing() : startTranscribing()
        isTranscribing = !isTranscribing;
      }
      toggle_button_div.appendChild(toggle_button);
      elem_others.appendChild(toggle_button_div);



      const elem_transcript = document.createElement('div');
      elem_transcript.id = "fixed_part_of_utterance";
      const elem_interim = document.createElement('div');
      elem_interim.id = "interim_part_of_utterance";

      elem_others.appendChild(elem_transcript);
      elem_others.appendChild(elem_interim);
      // SpeechRecognition = webkitSpeechRecognition || SpeechRecognition;
      SpeechRecognition = SpeechRecognition || webkitSpeechRecognition;

      recognition = new SpeechRecognition();
      recognition.lang = speava_select_language;
      recognition.interimResults = true;
      recognition.continuous = true;
      recognition.onresult = (event) => {
        const fixed_part_of_utterance = document.getElementById('fixed_part_of_utterance');
        const interim_part_of_utterance = document.getElementById('interim_part_of_utterance');
        let interimTranscript = '';
        let alternating_sub_zero = 0;
        // const node = document.getElementById('fixed_part_of_utterance');
        let index = fixed_part_of_utterance.speava_index;
        if (index === undefined){
          index = -1;
          fixed_part_of_utterance.speava_index = -1;
          fixed_part_of_utterance.latest_trascript_part = "";
          fixed_part_of_utterance.speava_index += 1;
        }
                  for (let i = event.resultIndex; i < event.results.length; i++) {
            let transcript = event.results[i][0].transcript;
            if (event.results[i].isFinal) {
              finalTranscript += "<br>" + transcript;
              finalTranscript = finalTranscript.split("<br>").slice(finalTranscript.split("<br>").length - 2,finalTranscript.split("<br>").length).join("<br>")
              fixed_part_of_utterance.speava_index = -1;
              fixed_part_of_utterance.latest_trascript_part = "";
            } else {
              interimTranscript = transcript;
              interimTranscriptReadAloud = interimTranscript;
              check_and_progress();
              for (let item of tab_text_array){
                let input_string = " "+interimTranscript.toLowerCase()+" "
                let comparing_string = " "+item.toLowerCase() +" ";
                if (input_string.indexOf(comparing_string) != -1 ){
                  toast_to_notify(item,2000);
                }
              }

              // split when the length exceeds 100
              if (transcript.length >= 100){
                finalTranscript += "<br>" + transcript;
                finalTranscript = finalTranscript.split("<br>").slice(finalTranscript.split("<br>").length - 2,finalTranscript.split("<br>").length).join("<br>")
                fixed_part_of_utterance.speava_index = -1;
                fixed_part_of_utterance.latest_trascript_part = "";
                fixed_part_of_utterance.innerHTML = '<style="color:'
                    + text_color+ ';">' + finalTranscript + '</>';
                interim_part_of_utterance.innerHTML =  '';
                recognition.stop()
              }
              if (index===-1) {
                fixed_part_of_utterance.speava_index += 1;
              } else {
                let setSpeaker_done = false;
                if ((fixed_part_of_utterance.latest_trascript_part ==="") || (transcript.split(" ").length >= 5)) {
                  if ((transcript.split(" ").length >= 5 ) &&
                      (transcript.split(" ").length >= fixed_part_of_utterance.latest_trascript_part.split(" ").length)){
                    fixed_part_of_utterance.latest_trascript_part = transcript ;
                  }
                }
                if (setSpeaker_done===false&&(transcript.split(" ").length === 1)&&(transcript.length >=10)){
                  // send once in 0.5 sec for continuous text (for languages such as Japanese)
                  let current_time = new Date();
                  let current_sub_zero = current_time.getMilliseconds() + 1;
                  current_sub_zero = Math.floor(current_sub_zero / 100 );
                  if ((current_sub_zero === 0 )||(current_sub_zero === 5)) {
                    if (alternating_sub_zero !== current_sub_zero){
                      alternating_sub_zero = current_sub_zero;
                        fixed_part_of_utterance.latest_trascript_part = transcript ;
                    }
                  }
                }
              }

            }
          }
              fixed_part_of_utterance.innerHTML = '<style="color:'
            + text_color+ ';">' + finalTranscript + '</>';
        interim_part_of_utterance.innerHTML =  '<i style="color:'
            + text_color+ ';">' + interimTranscript + '</i>';
      }

      recognition.onerror = function(e){
        console.log(e);
      }
      recognition.onend = function(e) {
        console.log("voice recognition terminated");
        console.log(e);
        if (isTranscribing === true){
          recognition.lang = speava_select_language;
          recognition.start();
          toggle_button.classList.add('speava_button_active');
        } else {
          toggle_button.classList.remove('speava_button_active')
          isTranscribing = false;
        }
      };

      let finalTranscript = "Initial load";

      fixed_part_of_utterance.innerHTML = '<style="color:'
          + text_color+ ';">' + finalTranscript + '</>';

      isTextAreaCreated = true;

      const objBody_buttons = document.getElementsByTagName("body").item(0);
      buttons = document.createElement('div');
      isShowing = true;
      buttons.id = "buttons";
      buttons.style.position = 'absolute';
      objBody_buttons.appendChild(buttons);

      const url_icon_config = chrome.runtime.getURL("icons/icon_config.png");
      const open_options = () => open_option_dialog();
      const _PNG_CONFIG = {
        viewBoxWidth: 448,
        viewBoxHeight: 512,
        path: url_icon_config,
      };
      const configButton = document.createElement('div');
      buttons.prepend(configButton);
      configButton.style.display = 'flex';
      configButton.style.position = 'relative';
      configButton.style.float = 'left';
      configButton.appendChild(makePng(_PNG_CONFIG, 36, 36, { id: "config", onclick: open_options }));

      applyFontColor(text_color,background_color);
      applyOptionStyles();
      addReadAloudElements(tab_text_array[0]);
    }

  };

  const setTextArray = (inText) => {
    const dataArray = [];
    let procssing_text = inText;
    procssing_text = procssing_text.replace('\r\n','\n');
    procssing_text = procssing_text.replace('\n\r','\n');
    const dataString = procssing_text.split('\n');
    tab_text_array = dataString;
  }

  ////////////////////////////////////////////////////////////////////////////
  // read aloud
  ////////////////////////////////////////////////////////////////////////////

  let read_list_of_elements = [];
  let last_selected_fragment = null;
  let current_item_in_list = 0;
  let current_sequence_number_in_item = 0;
  let current_sequence_number_in_item_from = 0;
  let current_sequence_number_in_item_to = 0;
  let target_text = "";
  let interimTranscriptReadAloud = "";
  let current_selected_from = 0;
  let current_selected_to = 0;

  // selected -> repeat, not selected -> start

  const addReadAloudElements = (inTag) => {
    const list_of_tag_elements = document.getElementsByTagName(inTag);
    for (let item of list_of_tag_elements){
      read_list_of_elements.push([item, item.innerHTML]);
    }
    document.addEventListener('selectionchange', (e)=>{
      // if (e.target.tagName != 'P'){
      //   return;
      // }
      const selected_node = window.getSelection();
      const selected_text = selected_node.anchorNode.wholeText.substring(selected_node.anchorOffset,selected_node.focusOffset)
      console.log("Archor node - ",selected_node);
      console.log("Archor node - ",selected_text);
      last_selected_fragment = selected_node;
        for (let item of list_of_tag_elements){
          if (item[0]==e.target){
            console.log("found target", e.target);
        // window.getSelection().anchorNode.parentElement
          }
        }

    });
    document.addEventListener('click', function (e) {
      console.log("click event",e);
      if (e.target.tagName != inTag.toUpperCase()){
        current_item_in_list = 0;
        current_sequence_number_in_item = 0;
        current_sequence_number_in_item_from = 0;
        current_sequence_number_in_item_to = 0;
        target_text = "";
        interimTranscriptReadAloud = "";
        current_selected_from = 0;
        current_selected_to = 0;
        window.alert("clicked an irrelevant element");
        return;
      }
      e.target.style.outline = "solid blue 1px";

      let item_count = 0;
      for (let item of read_list_of_elements){
        if (item[0]==e.target){
          console.log("found target", e.target);
          console.log("fragment", last_selected_fragment);
          let char_from = last_selected_fragment.anchorOffset;
          let char_to = last_selected_fragment.focusOffset;
          if (char_from == char_to){
            if (current_selected_to != 0 && current_selected_to !== undefined  ){
              const current_node = read_list_of_elements[current_item_in_list][0];
              current_node.setHTML(read_list_of_elements[current_item_in_list][1]);
              current_item_in_list = 0;
              current_sequence_number_in_item = 0;
              current_sequence_number_in_item_from = 0;
              current_sequence_number_in_item_to = 0;
              target_text = "";
              interimTranscriptReadAloud = "";
              current_selected_from = 0;
              current_selected_to = 0;
              window.alert("selection reseted");
              return;
            }
            // set to the begining of the element and don't set the end
            current_item_in_list = item_count;

          }
          if (char_from < char_to ){
            [char_to,char_from] = [char_from,char_to];
          }


          const selected_text = last_selected_fragment.anchorNode.wholeText.substring(char_from,char_to);
          // const split_selected_text = selected_text.split(" ");
          current_selected_from = 0;
          current_selected_to = 0;
          // reverse order
          // for (let item_selected of split_selected_text){
          if ( item[1].indexOf(selected_text) != -1 ){
            // get fragement's position
            current_selected_from = item[1].indexOf(selected_text);
            current_selected_to = current_selected_from + selected_text.length;
            current_sequence_number_in_item_from  = item[1].substring(0,current_selected_from).split(" ").length - 1;
            current_sequence_number_in_item = current_sequence_number_in_item_from;
            current_sequence_number_in_item_to  = item[1].substring(0,current_selected_to).split(" ").length - 1;
          }
          // }

          current_item_in_list = item_count;
          if (( last_selected_fragment.focusOffset - last_selected_fragment.anchorOffset  ) >= 3 ){
            target_text = selected_text;
          } else {
            target_text = item[0].innerText;
          }
          return;
        }
        item_count += 1;
      }
    });
  }

  const check_and_progress = () => {
    const all_others = document.getElementById("counting_number");
    let text_of_the_progresses = 0;
    text_of_the_progresses = "At:" + current_item_in_list.toString() + ""

    const current_node = read_list_of_elements[current_item_in_list][0];
    let inPartText = interimTranscriptReadAloud;
    inPartText = inPartText.trim();
    if (current_node === undefined || current_node === null) {
      all_others.innerText = text_of_the_progresses;
      return;
    }

    const list_words = current_node.innerText.split(" ");
    let the_word_to_highlight = list_words[current_sequence_number_in_item];
    if (the_word_to_highlight === undefined){
      all_others.innerText = text_of_the_progresses;
      return;
    }
    let deltaNumberOfWords = 0;
    const split_inPartText = inPartText.split(" ");
    if (inPartText == ""){
      list_words[current_sequence_number_in_item + deltaNumberOfWords ] = "<span style='color:blue'>" + list_words[current_sequence_number_in_item + deltaNumberOfWords] + "</span>";
    } else {
      for (let item of split_inPartText) {
        let base_string = " " + the_word_to_highlight.toLowerCase().trim().replace(/[^a-z]/g, '') + " ";
        let compara_string =  " " + item.toLowerCase().trim().replace(/[^a-z]/g, '') + " ";
        if (base_string.indexOf(compara_string) != -1) {
          list_words[current_sequence_number_in_item + deltaNumberOfWords] = "<span style='opacity:50%'>" + list_words[current_sequence_number_in_item + deltaNumberOfWords] + "</span>";
          deltaNumberOfWords += 1;
          the_word_to_highlight = list_words[current_sequence_number_in_item + deltaNumberOfWords];
        } else {
          list_words[current_sequence_number_in_item + deltaNumberOfWords] = "<span style='color:red'>" + list_words[current_sequence_number_in_item + deltaNumberOfWords] + "</span>";
        }
      }
    }
    current_sequence_number_in_item = current_sequence_number_in_item+deltaNumberOfWords;

    if (current_sequence_number_in_item_to == 0){
      const max_of_words_in_block = list_words.length;
      if (current_sequence_number_in_item== max_of_words_in_block){
        // move to next block
        if (current_item_in_list < read_list_of_elements.length){
          current_item_in_list += 1;
        } else {
          current_item_in_list = 0;
        }
      }
    } else {
      if (current_sequence_number_in_item_to < current_sequence_number_in_item ){
        current_sequence_number_in_item = current_sequence_number_in_item_from;
      }
    }
    let replacing_HTML = list_words.join(" ");
    current_node.setHTML(replacing_HTML);
    text_of_the_progresses = "At:" + current_item_in_list.toString() + " / word:" + current_sequence_number_in_item.toString()
        + ` / ${current_selected_from} to ${current_selected_to} / `
        + `${current_sequence_number_in_item_from} to ${current_sequence_number_in_item_to}`;
    all_others.innerText = text_of_the_progresses;
  }

  ////////////////////////////////////////////////////////////////////////////
  // Transcribing Controls
  ////////////////////////////////////////////////////////////////////////////

  // -------------------------------------------------------------------------
  // Stop transcribing
  // -------------------------------------------------------------------------
  const stopTranscribing = () => {
    turnCaptionsOff_adhoc();
  }

  // -------------------------------------------------------------------------
  // Start transcribing
  // -------------------------------------------------------------------------
  const startTranscribing = () => {
    turnCaptionsOn_adhoc();
  }

  const makePng = ({ viewBoxWidth, viewBoxHeight, path }, widthPx, heightPx, options = {}) => {
    const png = document.createElement('img');
    png.style.width = `${widthPx}px`;
    png.style.height = `${heightPx}px`;
    png.setAttribute('viewBox', `0 0 ${viewBoxWidth} ${viewBoxHeight}`);
    png.src = path;

    png.id = options.id ? options.id : '';
    if (options.className) {
      png.classList.add(options.className);
    }
    png.onclick = options.onclick ? options.onclick : null;

    return png;
  };

  const applyFontColor = (font_color, background_color) => {

    const all_others = document.getElementById("all_others");
    const counting_number = document.getElementById("counting_number");
    const fixed_part_of_utterance = document.getElementById("fixed_part_of_utterance");
    const interim_part_of_utterance = document.getElementById("interim_part_of_utterance");
    if (all_others) {
      all_others.style.color = font_color;
      all_others.style.backgroundColor = background_color;
    }
    if (counting_number){
      counting_number.style.color = font_color;
      counting_number.style.backgroundColor = background_color;
      counting_number.style.fontSize = "30px";

    }
    if (fixed_part_of_utterance) {
      fixed_part_of_utterance.style.color = font_color;
      fixed_part_of_utterance.style.backgroundColor = background_color;
      fixed_part_of_utterance.style.fontSize = "30px";
    }
    if (interim_part_of_utterance) {
      interim_part_of_utterance.style.color = font_color;
      interim_part_of_utterance.style.backgroundColor = background_color;
      interim_part_of_utterance.style.fontSize = "30px";
    }

  }

  const addPxString = (outPxNumber) =>{
    let outputString = "";
    outputString = outPxNumber.toString() + "px";
    return outputString;
  }

  const applyOptionStyles = () => {

    const all_others = document.getElementById("all_others");
    const fixed_part_of_utterance = document.getElementById("fixed_part_of_utterance");
    const buttons_for_command = document.getElementById("buttons");

    let parsed_json = null;
    let buttons_style_top = '0px';
    let buttons_style_right = '100px';
    let fixed_part_of_utterance_style_top = null;
    let fixed_part_of_utterance_style_right = null;
    let fixed_part_of_utterance_style_width = null;
    let elem_others_style_top = '0px';
    let elem_others_style_right = null;
    let elem_others_style_width = null;
    let z_index = 65000;
    let factor_top = parseInt(1 * +1 * scrollY);
    try {
      parsed_json = JSON.parse(window_positions);
      if ('buttons.style.top' in parsed_json){
        buttons_style_top = parseInt(parsed_json["buttons.style.top"]) + factor_top;
      }
      if ('buttons.style.right' in parsed_json){
        buttons_style_right = parsed_json["buttons.style.right"];
      }
      if ('fixed_part_of_utterance.style.right' in parsed_json){
        fixed_part_of_utterance_style_right = parsed_json["fixed_part_of_utterance.style.right"];
      }
       if ('fixed_part_of_utterance.style.top' in parsed_json){
        fixed_part_of_utterance_style_top = parseInt(parsed_json["fixed_part_of_utterance.style.top"]) + factor_top;
      }
      if ('fixed_part_of_utterance.style.width' in parsed_json){
        fixed_part_of_utterance_style_width = parsed_json["fixed_part_of_utterance.style.width"];
      }
      if ('elem_others.style.right' in parsed_json){
        elem_others_style_right = parsed_json["elem_others.style.right"];
      }
       if ('elem_others.style.top' in parsed_json){
        elem_others_style_top = parseInt(parsed_json["elem_others.style.top"]) + factor_top;
      }
      if ('elem_others.style.width' in parsed_json){
        elem_others_style_width = parsed_json["elem_others.style.width"];
      }

      if ('z_index' in parsed_json){
        z_index = parsed_json["z_index"];
      }
    } catch (e) {
      console.log(`error window_positions parse:`, e);
    }
    if (all_others){
      all_others.style.zIndex = z_index;
      all_others.style.top = addPxString(elem_others_style_top);
      if (elem_others_style_right) {
        all_others.style.right = elem_others_style_right;
      }
      if (elem_others_style_width) {
        all_others.style.width = elem_others_style_width;
      }
    }
    if (fixed_part_of_utterance){
      fixed_part_of_utterance.style.zIndex = z_index;
      if (fixed_part_of_utterance_style_top) {
        fixed_part_of_utterance.style.top = addPxString(fixed_part_of_utterance_style_top);
      }
      if (fixed_part_of_utterance_style_right){
        fixed_part_of_utterance.style.right = fixed_part_of_utterance_style_right;
      }
      if (fixed_part_of_utterance_style_width) {
        fixed_part_of_utterance.style.width = fixed_part_of_utterance_style_width;
      }
    }
    if (buttons_for_command){
      buttons_for_command.style.zIndex = z_index;
      buttons_for_command.style.top = addPxString(buttons_style_top);
      buttons_for_command.style.right = buttons_style_right;
    }
  }

  const toast_to_notify = (input_text, duration) => {
    let dialog = document.createElement('dialog');
    dialog.innerHTML = input_text;
    document.body.appendChild(dialog);
    dialog.oncancel = function(){
      dialog.remove();
    }
    dialog.showModal();
    setTimeout( function() {dialog.remove();}, duration);
  }

  ////////////////////////////////////////////////////////////////////////////
  // Main App
  ////////////////////////////////////////////////////////////////////////////

  console.log(`starting`);
  is_synced = null;
  getAllStorageSyncData();
  setInterval(tryTo(addButtons, 'adding buttons'), 500);
  setInterval(tryTo(check_and_progress, 'utter check'), 500);
  window.addEventListener("scroll", (event) => {
      applyOptionStyles();
  });

})();

} catch (e) {
  console.error('init error', e);
}

} catch (e) {
  console.log('error injecting script', e);
}