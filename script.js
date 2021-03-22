const Keyboard = {
  elements: {
    main: null,
    keysContainer: null,
    keys: []
  },

  eventHandlers: {
    oninput: null,
    onclose: null
  },

  properties: {
    value: '',
    capsLock: false,
    shift: false,
    language: 'en',
    volume: true
  },

  mainbtns: {
    shift: null,
    caps: null
  },

  textarea: document.querySelector('.use-keyboard-input'),

  init() {
    // Create main elements
    this.elements.main = document.createElement('div');
    this.elements.keysContainer = document.createElement('div');

    // Setup main elements
    this.elements.main.classList.add('keyboard', 'keyboard--hiden');
    this.elements.keysContainer.classList.add('keyboard__keys');
    this.elements.keysContainer.appendChild(this._createKeys());

    this.elements.keys = this.elements.keysContainer.querySelectorAll('.keyboard__key');

    // Add to DOM
    this.elements.main.appendChild(this.elements.keysContainer);
    document.body.appendChild(this.elements.main);


    // Automatically use keyboard elements with .use-keyboard-input
    document.querySelectorAll('.use-keyboard-input').forEach(element => {
      element.addEventListener('focus', () => {
        this.open(element.value, currentValue => {
          element.value = currentValue;
        });
      });
    });
  },

  _createKeys() {
    const fragment = document.createDocumentFragment();
    const keyLayoutEn = [
      "1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "backspace",
      "q", "w", "e", "r", "t", "y", "u", "i", "o", "p",
      "caps", "a", "s", "d", "f", "g", "h", "j", "k", "l", "enter",
      "shift", "z", "x", "c", "v", "b", "n", "m", ",", ".", "?",
      "volume", "en", "done", "space", "arrow_left", "arrow_right"
    ];
    const keyLayoutRu = [
      "1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "backspace",
      "й", "ц", "у", "к", "е", "н", "г", "ш", "щ", "з", "х", "ъ",
      "caps", "ф", "ы", "в", "а", "п", "р", "о", "л", "д", "э", "enter",
      "shift", "я", "ч", "с", "м", "и", "т", "ь", "б", "ю", ".",
      "volume", "ru", "done", "space", "arrow_left", "arrow_right"
    ];
    const altKeysEn = [
      "!", "@", "#", "$", "%", "^", "&", "*", "(", ")"
    ];
    const altKeysRu = [
      "!", "\"", "№", ";", "%", ":", "?", "*", "(", ")"
    ];
    let keyLayout;
    let altKeys;

    //Audio click
    function removeTransition(e) {
      if (e.propertyName !== 'transform') return;
      e.target.classList.remove('playing');
    }

    function playSound(e) {
      const audio = document.querySelector(`audio[data-sound="${e}"]`);
      const key = document.querySelector(`.keyboard__key`);
      if (!audio) return;

      key.classList.add('playing');
      audio.currentTime = 0;
      audio.play();
    }

    //Audio
    const keys = Array.from(document.querySelectorAll('.keyboard__key'));
    keys.forEach(key => key.addEventListener('transitionend', removeTransition));


    if (this.properties.language === 'en') {
      keyLayout = keyLayoutEn;
      altKeys = altKeysEn;
    } else if (this.properties.language === 'ru') {
      keyLayout = keyLayoutRu;
      altKeys = altKeysRu;
    }

    // Create HTML for an icon
    const createIconHTML = (icon_name) => {
      return `<i class="material-icons">${icon_name}</i>`
    };

    keyLayout.forEach(key => {
      const keyElement = document.createElement('button');
      let insertLineBreak = this.properties.language === 'en' ? (["backspace", "p", "enter", "?"].indexOf(key) !== -1) : (["backspace", "ъ", "enter", "."].indexOf(key) !== -1);

      // Add attributes/classes
      keyElement.setAttribute('type', 'button');
      keyElement.classList.add('keyboard__key');

      //Light pressed buttons
      function pressLightKey(key) {
        document.addEventListener('keydown', (event) => {
          if (event.key.toLowerCase() === key.toLowerCase()) {
            keyElement.classList.add('keyboard__key--pressed');
          }
        });
        document.addEventListener('keyup', (event) => {
          if (event.key.toLowerCase() === key.toLowerCase()) {
            keyElement.classList.remove('keyboard__key--pressed');
          }
        });
      }

      function pressLightCode(code) {
        document.addEventListener('keydown', (event) => {
          if (event.code === code) {
            keyElement.classList.add('keyboard__key--pressed');
          }
        });
        document.addEventListener('keyup', (event) => {
          if (event.code === code) {
            keyElement.classList.remove('keyboard__key--pressed');
          }
        });
      }



      switch (key) {
        case 'backspace':
          keyElement.classList.add('keyboard__key--wide');
          keyElement.innerHTML = createIconHTML('backspace');

          keyElement.addEventListener('click', () => {
            if (this.properties.volume) playSound('special');
            this.textarea.setRangeText("", this.textarea.selectionStart - 1, this.textarea.selectionEnd, "end");
            this.textarea.focus();
          });
          pressLightCode('Backspace');
          break;

        case 'caps':
          this.mainbtns.caps = keyElement;
          keyElement.classList.add('keyboard__key--wide', 'keyboard__key--activatable');
          keyElement.innerHTML = createIconHTML('keyboard_capslock');

          keyElement.addEventListener('click', () => {
            if (this.properties.volume) playSound('special');
            if (this.properties.shift) {
              this._toggleShift();
              this.mainbtns.shift.classList.toggle('keyboard__key--dark', this.properties.shift);
            }
            this._toggleCapsLock();
            keyElement.classList.toggle('keyboard__key--active', this.properties.capsLock);
            this.textarea.focus();
          });
          pressLightCode('CapsLock');
          break;

        case 'enter':
          keyElement.classList.add('keyboard__key--wide');
          keyElement.innerHTML = createIconHTML('keyboard_return');

          keyElement.addEventListener('click', () => {
            if (this.properties.volume) playSound('special');
            this.textarea.setRangeText("\n", this.textarea.selectionStart, this.textarea.selectionEnd, "end");
            this.textarea.focus();
          });
          pressLightCode('Enter');
          break;

        case 'shift':
          this.mainbtns.shift = keyElement;
          keyElement.classList.add('keyboard__key--wide');
          keyElement.innerHTML = createIconHTML('arrow_upward');

          keyElement.addEventListener('click', () => {
            if (this.properties.volume) playSound('special');
            if (this.properties.capsLock) {
              this._toggleCapsLock();
              this.mainbtns.caps.classList.toggle('keyboard__key--active', this.properties.capsLock);
            }
            this._toggleShift();
            keyElement.classList.toggle('keyboard__key--dark', this.properties.shift);
            this.textarea.focus();
          });
          pressLightKey('Shift');
          break;

        case 'volume':
          keyElement.textContent = key.toLowerCase();
          if (this.properties.volume) keyElement.innerHTML = createIconHTML('volume_up');
          else keyElement.innerHTML = createIconHTML('volume_off');


          keyElement.addEventListener('click', () => {
            if (this.properties.volume) {
              if (this.properties.language === 'en') playSound('en');
              else playSound('ru');
            }
            this.properties.volume = !this.properties.volume;
            if (this.properties.volume) {
              keyElement.innerHTML = createIconHTML('volume_up');
            } else if (!this.properties.volume) {
              keyElement.innerHTML = createIconHTML('volume_off');
            }
            this.textarea.focus();
          });
          break;

        case 'en':
          keyElement.classList.add('keyboard__key--wide');
          keyElement.textContent = key.toLowerCase();

          keyElement.addEventListener('click', () => {
            if (this.properties.volume) {
              if (this.properties.language === 'en') playSound('en');
              else playSound('ru');
            };
            if (this.properties.shift) {
              this._toggleShift();
              this.mainbtns.shift.classList.toggle('keyboard__key--dark', this.properties.shift);
            }
            if (this.properties.capsLock) {
              this._toggleCapsLock();
              this.mainbtns.caps.classList.toggle('keyboard__key--active', this.properties.capsLock);
            }
            this._toggleLanguage();
            this.textarea.focus();
          });
          break;

        case 'ru':
          keyElement.classList.add('keyboard__key--wide');
          keyElement.textContent = key.toLowerCase();

          keyElement.addEventListener('click', () => {
            if (this.properties.volume) {
              if (this.properties.language === 'en') playSound('en');
              else playSound('ru');
            }
            if (this.properties.shift) {
              this._toggleShift();
              this.mainbtns.shift.classList.toggle('keyboard__key--dark', this.properties.shift);
            }
            if (this.properties.capsLock) {
              this._toggleCapsLock();
              this.mainbtns.caps.classList.toggle('keyboard__key--active', this.properties.capsLock);
            }
            this._toggleLanguage();
            this.textarea.focus();
          });
          break;

        case 'space':
          keyElement.classList.add('keyboard__key--extra-wide');
          keyElement.innerHTML = createIconHTML('space_bar');

          keyElement.addEventListener('click', () => {
            if (this.properties.volume) {
              if (this.properties.language === 'en') playSound('en');
              else playSound('ru');
            }
            this.textarea.setRangeText(" ", this.textarea.selectionStart, this.textarea.selectionEnd, "end");
            this.textarea.focus();
          });
          pressLightCode('Space');
          break;

        case 'done':
          keyElement.classList.add('keyboard__key--wide', 'keyboard__key--dark');
          keyElement.innerHTML = createIconHTML('check_circle');

          keyElement.addEventListener('click', () => {
            if (this.properties.volume) {
              if (this.properties.language === 'en') playSound('en');
              else playSound('ru');
            };
            this.close();
            this._triggerEvent('onclose');
            this.textarea.blur();
          });

          break;

        case 'arrow_left':
          keyElement.innerHTML = createIconHTML('keyboard_arrow_left');

          keyElement.addEventListener('click', () => {
            if (this.properties.volume) {
              if (this.properties.language === 'en') playSound('en');
              else playSound('ru');
            }
            if (this.textarea.selectionStart > 0) {
              this.textarea.selectionStart--;
              this.textarea.selectionEnd--;
            }
            this.textarea.focus();
          });
          pressLightCode('ArrowLeft');
          break;

        case 'arrow_right':
          keyElement.innerHTML = createIconHTML('keyboard_arrow_right');

          keyElement.addEventListener('click', () => {
            if (this.properties.volume) {
              if (this.properties.language === 'en') playSound('en');
              else playSound('ru');
            }
            if (this.textarea.selectionStart < this.textarea.value.length) {
              this.textarea.selectionEnd++;
              this.textarea.selectionStart++;
            }
            this.textarea.focus();
          });
          pressLightCode('ArrowRight');
          break;
        default:
          keyElement.textContent = key.toLowerCase();

          keyElement.addEventListener('click', () => {
            if (this.properties.language === 'en') {
              if (this.properties.volume) {
                playSound('en');
              }
              if (this.properties.shift) {
                let k;
                switch (key) {
                  case '1':
                    k = '!';
                    break;
                  case '2':
                    k = '@';
                    break;
                  case '3':
                    k = '#';
                    break;
                  case '4':
                    k = '$';
                    break;
                  case '5':
                    k = '%';
                    break;
                  case '6':
                    k = '^';
                    break;
                  case '7':
                    k = '&';
                    break;
                  case '8':
                    k = '*';
                    break;
                  case '9':
                    k = '(';
                    break;
                  case '0':
                    k = ')';
                    break;
                  default:
                    break;
                }
                if (!isNaN(+key)) {
                  this.textarea.setRangeText(k, this.textarea.selectionStart, this.textarea.selectionEnd, "end");
                } else {
                  this.textarea.setRangeText(key.toUpperCase(), this.textarea.selectionStart, this.textarea.selectionEnd, "end");
                }

              } else {
                this.textarea.setRangeText((this.properties.capsLock || this.properties.shift ? key.toUpperCase() : key.toLowerCase()), this.textarea.selectionStart, this.textarea.selectionEnd, "end");
              }
            } else if (this.properties.language === 'ru') {
              if (this.properties.volume) {
                playSound('ru');
              }
              if (this.properties.shift) {
                let k;
                switch (key) {
                  case '1':
                    k = '!';
                    break;
                  case '2':
                    k = '"';
                    break;
                  case '3':
                    k = '№';
                    break;
                  case '4':
                    k = ';';
                    break;
                  case '5':
                    k = '%';
                    break;
                  case '6':
                    k = ':';
                    break;
                  case '7':
                    k = '?';
                    break;
                  case '8':
                    k = '*';
                    break;
                  case '9':
                    k = '(';
                    break;
                  case '0':
                    k = ')';
                    break;
                  default:
                    break;
                }
                if (!isNaN(+key)) {
                  this.textarea.setRangeText(k, this.textarea.selectionStart, this.textarea.selectionEnd, "end");
                } else {
                  this.textarea.setRangeText(key.toUpperCase(), this.textarea.selectionStart, this.textarea.selectionEnd, "end");
                }

              } else {
                this.textarea.setRangeText((this.properties.capsLock || this.properties.shift ? key.toUpperCase() : key.toLowerCase()), this.textarea.selectionStart, this.textarea.selectionEnd, "end");
              }
            }

            this.textarea.focus();
          });
          pressLightKey(key);
          break;

      }

      fragment.appendChild(keyElement);


      if (insertLineBreak) {
        fragment.appendChild(document.createElement('br'));
      }
    });

    return fragment;
  },


  _triggerEvent(handlerName) {
    if (typeof this.eventHandlers[handlerName] == 'function') {
      this.eventHandlers[handlerName](this.properties.value);
    }
  },

  _toggleCapsLock() {
    this.properties.capsLock = !this.properties.capsLock;

    for (const key of this.elements.keys) {
      if (key.childElementCount === 0) {
        key.textContent = this.properties.capsLock ? key.textContent.toUpperCase() : key.textContent.toLowerCase();
      }
    }
  },

  _toggleShift() {
    this.properties.shift = !this.properties.shift;

    for (const key of this.elements.keys) {
      if (key.childElementCount === 0) {
        key.textContent = this.properties.shift ? key.textContent.toUpperCase() : key.textContent.toLowerCase();
        if (this.properties.language === 'en') {
          if (this.properties.shift) {
            switch (key.textContent) {
              case '1':
                key.textContent = '!';
                break;
              case '2':
                key.textContent = '@';
                break;
              case '3':
                key.textContent = '#';
                break;
              case '4':
                key.textContent = '$';
                break;
              case '5':
                key.textContent = '%';
                break;
              case '6':
                key.textContent = '^';
                break;
              case '7':
                key.textContent = '&';
                break;
              case '8':
                key.textContent = '*';
                break;
              case '9':
                key.textContent = '(';
                break;
              case '0':
                key.textContent = ')';
                break;
              default:
                break;
            }
          } else if (!this.properties.shift) {
            switch (key.textContent) {
              case '!':
                key.textContent = '1';
                break;
              case '@':
                key.textContent = '2';
                break;
              case '#':
                key.textContent = '3';
                break;
              case '$':
                key.textContent = '4';
                break;
              case '%':
                key.textContent = '5';
                break;
              case '^':
                key.textContent = '6';
                break;
              case '&':
                key.textContent = '7';
                break;
              case '*':
                key.textContent = '8';
                break;
              case '(':
                key.textContent = '9';
                break;
              case ')':
                key.textContent = '0';
                break;
              default:
                break;

            }
          }

        } else if (this.properties.language === 'ru') {
          if (this.properties.shift) {
            switch (key.textContent) {
              case '1':
                key.textContent = '!';
                break;
              case '2':
                key.textContent = '"';
                break;
              case '3':
                key.textContent = '№';
                break;
              case '4':
                key.textContent = ';';
                break;
              case '5':
                key.textContent = '%';
                break;
              case '6':
                key.textContent = ':';
                break;
              case '7':
                key.textContent = '?';
                break;
              case '8':
                key.textContent = '*';
                break;
              case '9':
                key.textContent = '(';
                break;
              case '0':
                key.textContent = ')';
                break;
              default:
                break;
            }
          } else if (!this.properties.shift) {
            switch (key.textContent) {
              case '!':
                key.textContent = '1';
                break;
              case '"':
                key.textContent = '2';
                break;
              case '№':
                key.textContent = '3';
                break;
              case ';':
                key.textContent = '4';
                break;
              case '%':
                key.textContent = '5';
                break;
              case ':':
                key.textContent = '6';
                break;
              case '?':
                key.textContent = '7';
                break;
              case '*':
                key.textContent = '8';
                break;
              case '(':
                key.textContent = '9';
                break;
              case ')':
                key.textContent = '0';
                break;
              default:
                break;

            }
          }
        }

      }

    }
  },

  _toggleLanguage() {
    this.properties.language = this.properties.language === 'en' ? 'ru' : 'en';
    document.querySelector('.keyboard__keys').innerHTML = '';
    this.elements.keysContainer.appendChild(this._createKeys());
    this.elements.keys = this.elements.keysContainer.querySelectorAll('.keyboard__key');
  },

  open(initialValue, oninput, onclose) {
    this.properties.value = initialValue || '';
    this.eventHandlers.oninput = oninput;
    this.eventHandlers.onclose = onclose;
    this.elements.main.classList.remove('keyboard--hidden');
  },

  close() {
    this.properties.value = '';
    this.eventHandlers.oninput = oninput;
    this.eventHandlers.onclose = onclose;
    this.elements.main.classList.add('keyboard--hidden');
  }
};

window.addEventListener('DOMContentLoaded', function () {
  Keyboard.init();
});
