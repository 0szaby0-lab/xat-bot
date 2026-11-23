var _Activity;
if (_Activity === undefined) {
  _Activity = parent._Activity !== undefined ? parent._Activity : parent.parent._Activity !== undefined ? parent.parent._Activity : parent.parent.parent._Activity !== undefined ? parent.parent.parent._Activity : {};
}
class SettingsPage {
  constructor() {
    this.bkgTick = 0;
    this.background = null;
    this.Macros = null;
    this.toSave = null;
    this.doReload = !1;
    this.Classic = !0;
    this.translator = null;
    this.Config = null;
    this.currentPage = "general";
    this.pstyleTmpKey = "pstyleTmp";
    this.pstyleSettingName = "pstyle";
    this.macrosTbody = null;
    this.macroToEdit = null;
    this.macrosContainer = null;
    this.addMacroBtn = null;
    this.macroNameInput = null;
    this.macroValueInput = null;
    this.keywords = [];
    this.editKeyword = null;
    this.keywordColor = null;
    this.keywordsList = null;
    this.deleteKeyword = null;
    this.keywordToEdit = null;
    this.keywordNameInput = null;
    this.defaultKeywordColor = "#FFF400";
    this.categoryColor = null;
    this.categories = [];
    this.editCategory = null;
    this.deleteCategory = null;
    this.categoryToEdit = null;
    this.categoriesList = null;
    this.friendsCategories = null;
    this.categoryNameInput = null;
    this.defaultCategoryColor = "#000050";
    this.translator = null;
    this.translatorMsg = null;
    this.translatorContent = null;
    this.translatorContainer = null;
    this.translatorLangs = {
      en: "English",
      sq: "Albanian",
      ar: "Arabic",
      bs: "Bosnian",
      bg: "Bulgarian",
      zh: "Chinese",
      "zh-CN": "Chinese Simplified",
      "zh-TW": "Chinese Traditional",
      hr: "Croatian",
      cs: "Czech",
      da: "Danish",
      nl: "Dutch",
      et: "Estonian",
      tl: "Filipino",
      fi: "Finnish",
      fr: "French",
      gl: "Galician",
      de: "German",
      el: "Greek",
      iw: "Hebrew",
      hi: "Hindi",
      hu: "Hungarian",
      id: "Indonesian",
      it: "Italian",
      ja: "Japanese",
      ko: "Korean",
      lt: "Lithuanian",
      mt: "Maltese",
      no: "Norwegian",
      pl: "Polish",
      "pt-PT": "Portuguese",
      ro: "Romanian",
      ru: "Russian",
      es: "Spanish",
      sr: "Serbian",
      sk: "Slovak",
      sv: "Swedish",
      th: "Thai",
      tr: "Turkish",
      uk: "Ukrainian",
      vi: "Vietnamese"
    };
    this.chatLangs = {
      en: "English",
      es: "Español",
      "pt-br": "Português do Brasil",
      fr: "Français",
      bg: "Bulgarian",
      de: "Deutsch",
      it: "Italiano",
      ar: "العربية",
      bs: "Bosanski",
      el: "Greek",
      hr: "Croatian",
      da: "Dansk",
      et: "Eesti",
      fi: "Suomi",
      nl: "Nederlands",
      pl: "Polski",
      ro: "Română",
      sq: "Shqip",
      sr: "Српски / srpski",
      "sr-el": "srpski (latinica)‎",
      sv: "Svenska",
      th: "ไทย",
      tl: "Tagalog",
      tr: "Türkçe"
    };
    this.rapidActions = {
      ignore: 0,
      guest: 0,
      member: 0,
      kick: 0,
      ban: 0,
      unban: 0,
      gag: 41,
      mute: 46,
      zip: 184,
      snakeban: 134,
      spaceban: 136,
      matchban: 140,
      mazeban: 152,
      codeban: 162,
      reverse: 176,
      slotban: 236
    };
    this.powerIds = {
      kPink: "30",
      kPurple: "35",
      kBlueman: "64",
      kEverypower: "95",
      kGold: "153",
      kRuby: "430",
      kYellow: "700",
      kPawnHue: "728"
    };
    this.SettingsAlreadyBinded = !1;
    this.search = document.getElementById("search");
    this.closeBtn = document.getElementById("closeBtn");
    this.avatarHolder = _Activity.instance.IsClassic && !_Activity.instance.Device ? document.getElementById("avatarHolder") : document.getElementById("avatarHolder2");
    this.translatorMsg = document.getElementById("translatorMsg");
    this.translatorContent = document.getElementById("translatorContent");
    this.translatorContainer = document.getElementById("translator");
    this.keywordsL = document.getElementById("categoriesList");
    this.keywordsList = document.getElementById("keywordsList");
    this.categoriesList = document.getElementById("categoriesList");
    this.macrosContainer = document.getElementById("macrosContainer");
    this.savingSnackbar = new Snackbar(["mob2.saving", "Saving settings, please wait..."]);
    this.macroSnackbar = new Snackbar(["mob2.macroadded", "Macro added successfully."]);
    this.keywordAddedSnackbar = new Snackbar(["mob2.keywordadded", "Keyword added successfully."]);
    this.categoryAddedSnackbar = new Snackbar(["mob2.categoryadded", "Category added successfully."]);
    this.keywordEditedSnackbar = new Snackbar(["mob2.keywordedited", "Keyword edited successfully."]);
    this.categoryEditedSnackbar = new Snackbar(["mob2.categoryedited", "Category edited successfully."]);
    this.translatorSnackbar = new Snackbar(["mob2.translatoron", "Translator enabled successfuly."]);
    this.translatorDisabledSnackbar = new Snackbar(["mob2.translatoroff", "Translator disabled successfuly."]);
    this.settingsSnackbar = new Snackbar(["mob2.settingssaved", "Settings saved successfully."]);
    this.previewPstyle = document.getElementById("previewPstyle");
    this.pawnHueData = _Activity.pawnHueData;
    this.setCurrentPawnPreview(_Activity.pawnHuePreviewCode);
    let _0x40a5bb = 0;
    this.bkgTick = setInterval(() => {
      if (!this.background && _0x40a5bb % 12 == 0 && _0x40a5bb < 450) {
        this.background = this.loadBackground();
      }
      _0x40a5bb++;
    }, 83);
    let _0x2a9b0d = "https://xath.hu/web_gear/chat/av/" + Math.floor(Math.random() * 1758 + 1) + ".png";
    try {
      const _0x2eed20 = JSON.parse(localStorage.getItem("todo"))?.w_avatar?.replace(/﻿/g, "");
      if (_0x2eed20) {
        _0x2a9b0d = _0x2eed20;
      }
    } catch (_0xdfa9d3) {
      doDebugLogs(3, "Failed to load avatar: " + _0xdfa9d3);
    }
    const _0x725389 = _0x2a9b0d[0] == "(" ? 30 : 35;
    this.renderAvatar = function () {
      const _0x1166c7 = localStorage.getItem("avatarSettingsTmp");
      const _0x40f12b = JSON.parse(localStorage.getItem("Settings") || "{}");
      const _0x8eb98 = _0x1166c7 ?? _0x40f12b.avatarSettings ?? "";
      if (this.avatarHolder) {
        this.avatarHolder.innerHTML = "";
        _Activity.instance.Avatars.MakeAvatar(this.avatarHolder, _0x2a9b0d, {
          size: _0x725389,
          hasAnimate: true,
          hasShuffle: this.Config?.pFlags & NamePowers.shuffle,
          className: "avatar",
          avatarEffect: _0x8eb98
        });
      }
    };
    this.renderAvatar();
    this.closeBtn.addEventListener("click", this.hideSettigs);
    document.querySelectorAll("[data-target]").forEach(_0x589a77 => {
      _0x589a77.addEventListener("click", () => {
        this.currentPage = _0x589a77.dataset.target;
        if (!_0x589a77.classList.contains("active")) {
          const _0x3e4236 = document.querySelector("li.active");
          const _0x146215 = document.querySelector(".settings.active");
          const _0x4b2baa = document.querySelector("[data-settings=" + _0x589a77.dataset.target + "]");
          _0x589a77.classList.add("active");
          _0x3e4236.classList.remove("active");
          _0x4b2baa.classList.add("active");
          _0x146215.classList.remove("active");
        }
      });
    });
    document.querySelectorAll(".mobileApp").forEach(_0x154bb5 => {
      if (_0x154bb5 && (_Activity.instance.IsMobileApp || _Activity.instance.IsClassic && !_Activity.instance.Device)) {
        _0x154bb5.style.display = "none";
      }
    });
    TranslateAll();
    reloadPowersBank();
  }
  loadBackground() {
    let _0x39f7b9 = document.getElementById("background");
    if (CSS.supports("backdrop-filter", "none") || CSS.supports("-webkit-backdrop-filter", "none")) {
      _0x39f7b9 = document.body;
    }
    _0x39f7b9.classList.add("gradient");
    if (this.Config?.background) {
      const _0x615d6b = new Image();
      _0x615d6b.src = this.Config.background.split(";")[0];
      _0x615d6b.onload = () => _0x39f7b9.style.backgroundImage = "url(" + _0x615d6b.src + ")";
      clearInterval(this.bkgTick);
      return _0x615d6b;
    }
  }
  main(_0x27ebad) {
    xatMain(_0x27ebad);
    try {
      this.Config = JSON.parse(_0x27ebad);
    } catch (_0x4e2eba) {
      doDebugLogs(3, "Failed to set config: " + _0x4e2eba);
    }
    this.Classic = this.Config.Flags & 1;
    reloadPowersBank();
    if (config.MyRegName === undefined || !config.MyRegName && !_Activity.instance.IsClassic) {
      document.querySelectorAll(".acc").forEach(_0x296cd1 => {
        if (_0x296cd1) {
          _0x296cd1.classList.add("d-none");
        }
      });
    }
  }
  configurePage(_0xe37041) {
    try {
      this.Config = JSON.parse(_0xe37041);
    } catch (_0x10ee76) {
      doDebugLogs(3, "Failed to load config: " + _0x10ee76);
    }
  }
  setSettings(_0x468b7f) {
    try {
      _Activity.instance.UserSettings = JSON.parse(_0x468b7f);
    } catch (_0x14ea6a) {
      doDebugLogs(3, "Failed to load user settings: " + _0x14ea6a);
    }
    if (this.SettingsAlreadyBinded) {
      return;
    }
    this.SettingsAlreadyBinded = !0;
    if (_Activity.instance.UserSettings.language === "pt") {
      _Activity.instance.UserSettings.language = "pt-br";
    }
    for (const _0x6952f7 in this.chatLangs) {
      if (this.chatLangs.hasOwnProperty(_0x6952f7)) {
        const _0x434e03 = makeElement(document.getElementById("language"), "option");
        _0x434e03.text = this.chatLangs[_0x6952f7];
        _0x434e03.value = _0x6952f7;
        if (_Activity.instance.UserSettings.language == _0x6952f7) {
          _0x434e03.selected = true;
        }
      }
    }
    for (const _0x222dd4 in this.rapidActions) {
      if (this.rapidActions.hasOwnProperty(_0x222dd4) && (hasPower(this.rapidActions[_0x222dd4]) || this.rapidActions[_0x222dd4] == 0)) {
        const _0x3062d0 = makeElement(document.getElementById("rapidAction"), "option");
        _0x3062d0.text = _0x222dd4;
        _0x3062d0.value = _0x222dd4;
        _0x3062d0.dataset.localize = "mob2." + _0x222dd4;
      }
    }
    this.initAllSettings();
    const _0x39b648 = {};
    [...document.querySelectorAll("[data-keywords]")].forEach(_0x4a5d54 => {
      _0x39b648[_0x4a5d54.dataset.settings] = _0x4a5d54.dataset.keywords.split(",");
    });
    this.search.addEventListener("keyup", _0x36dafb => {
      const _0x2f6190 = this.search.value.trim();
      if (_0x2f6190.length) {
        for (const _0x35c96d in _0x39b648) {
          if (_0x39b648.hasOwnProperty(_0x35c96d) && this.currentPage != _0x35c96d) {
            const _0x549215 = _0x39b648[_0x35c96d];
            for (let _0x1529f7 = 0; _0x1529f7 < _0x549215.length; _0x1529f7++) {
              if (_0x549215[_0x1529f7].substr(0, _0x2f6190.length) == _0x2f6190) {
                document.querySelector("[data-target=\"" + _0x35c96d + "\"]").click();
                break;
              }
            }
          }
        }
      }
    });
  }
  initAllSettings() {
    this.initGeneralSetting();
    this.initCallSetting();
    this.initNotificationsSetting();
    this.initMacrosSetting();
    this.initPowersSetting();
    this.initPstyleSetting();
    this.initTranslatorSetting();
    this.initKeywordsSetting();
    this.initCategoriesSetting();
    this.initAcesSetting();
    this.initAvatarSetting();
    this.initAboutSetting();
    this.initAccount();
    this.updateMacrosTable();
    this.updateCategories();
    this.updateKeywords();
  }
  initGeneralSetting() {
    this.saveGeneralBtn = document.getElementById("saveGeneralBtn");
    this.saveAppearanceBtn = document.getElementById("saveAppearanceBtn");
    document.querySelectorAll("[data-setting]").forEach(_0x572349 => {
      if (_0x572349.dataset.setting == "Stealth" && this.Macros?.Stealth) {
        _0x572349.value = this.Macros?.Stealth;
      } else if (_Activity.instance.UserSettings[_0x572349.dataset.setting]) {
        _0x572349.value = _Activity.instance.UserSettings[_0x572349.dataset.setting];
      }
    });
    if (this.Config?.pFlags & NamePowers.verified) {
      document.getElementById("showVerified").classList.remove("hidden");
    }
    this.saveGeneralBtn.addEventListener("click", this.saveGeneralEvent.bind(this));
    this.saveAppearanceBtn.addEventListener("click", this.saveGeneralEvent.bind(this));
  }
  saveGeneralEvent(_0x4644c0) {
    this.DisableSaveButtons();
    document.querySelectorAll("[data-setting]").forEach(_0x121ecf => {
      if (_0x121ecf.dataset.setting == "Stealth") {
        this.addMacro(_0x121ecf.dataset.setting, _0x121ecf.value);
      } else {
        this.saveSetting(_0x121ecf.dataset.setting, _0x121ecf.value);
      }
      const _0x1370ae = parent.document.getElementById("textEntryEditable");
      if (_0x121ecf.dataset.setting == "textDirection" && _0x1370ae) {
        _0x1370ae.style.direction = _0x121ecf.value;
      }
      this.toSave = this.settingsSnackbar;
      this.savingSnackbar.show();
      this.doReload = !0;
      if (_0x121ecf.dataset.setting == "animation") {
        _Activity.instance.Smilies.ReloadAll(_0x121ecf.value == "enable");
        _Activity.instance.Avatars.ReloadAll(_0x121ecf.value == "enable");
      }
      if (_0x121ecf.dataset.setting == "banner" && _Activity.instance.AdBanner) {
        setTimeout(() => {
          _Activity.instance.AdBanner.contentDocument.location.reload(true);
        }, 5000);
      }
    });
  }
  initNotificationsSetting() {
    this.mainChat = document.getElementById("mainchat");
    this.mentions = document.getElementById("mentions");
    this.notifications = document.getElementById("notifications");
    this.saveNotificationsBtn = document.getElementById("saveNotificationsBtn");
    this.testNotif = document.getElementById("testNotif");
    this.mainChat.value = this.Macros?.notify ?? "";
    this.mentions.value = this.Macros?.mentions ?? "";
    this.notifications.value = _Activity.instance.UserSettings?.notifications || "enable";
    this.saveNotificationsBtn.addEventListener("click", () => {
      const _0xed1457 = this.Macros?.notify ?? "";
      const _0x56be56 = this.Macros?.mentions ?? "";
      if ((_Activity.instance.UserSettings?.notifications || "enable") != this.notifications.value) {
        this.saveSetting("notifications", this.notifications.value);
      }
      if (_0xed1457 != this.mainChat.value) {
        this.addMacro("notify", this.mainChat.value);
      }
      if (_0x56be56 != this.mentions.value) {
        this.addMacro("mentions", this.RemoveHtmlEntities(this.mentions.value).replace(/ /g, ""));
      }
      this.toSave = this.settingsSnackbar;
      this.savingSnackbar.show();
      this.doReload = !0;
      this.DisableSaveButtons();
    });
    this.testNotif.addEventListener("click", settings.sendTestNotification);
  }
  initCallSetting() {
    const _0x5de5a1 = ["LiveAcceptCalls", "LiveRingingSound", "LiveAppMode"];
    this.saveCalls = document.getElementById("saveCalls");
    this.saveCalls.addEventListener("click", () => {
      _0x5de5a1.forEach(_0x300e61 => {
        const _0x5db8ce = document.getElementById(_0x300e61);
        if (_0x5db8ce && _0x5db8ce.value) {
          saveSetting(_0x300e61, _0x5db8ce.value);
        }
      });
      this.toSave = this.settingsSnackbar;
      this.savingSnackbar.show();
      this.doReload = !0;
      this.DisableSaveButtons();
    });
  }
  initMacrosSetting() {
    this.addMacroBtn = document.getElementById("addMacroBtn");
    this.macroNameInput = document.getElementById("macroName");
    this.macroValueInput = document.getElementById("macroValue");
    [this.macroNameInput, this.macroValueInput].forEach(_0x1bd47c => {
      _0x1bd47c.addEventListener("keyup", () => {
        if (this.macroNameInput.value.length && this.macroValueInput.value.length) {
          this.addMacroBtn.disabled = false;
        } else {
          this.addMacroBtn.disabled = true;
        }
      });
    });
    this.addMacroBtn.addEventListener("click", () => {
      const _0x2209b1 = this.RemoveHtmlEntities(this.macroNameInput.value).replace(/ /g, "");
      const _0x5230af = this.RemoveHtmlEntities(this.macroValueInput.value);
      if (_0x2209b1.length && _0x5230af.length) {
        this.macroNameInput.value = "";
        this.macroValueInput.value = "";
        if (["Statusfx", "Stealth"].includes(_0x2209b1)) {
          return;
        }
        if (!Object.keys(this.cleanMacrosObj(this.Macros))?.length) {
          this.macrosContainer.innerHTML = "";
        }
        if (this.macroToEdit != null) {
          this.removeMacro(this.macroToEdit);
          this.addMacroBtn.innerText = "";
          addText(this.addMacroBtn, ["mob2.add", "Add"]);
        }
        this.addMacro(_0x2209b1, _0x5230af);
        this.Macros[_0x2209b1] = _0x5230af;
        this.addMacroRow(_0x2209b1, _0x5230af, this.macroToEdit);
        this.macroToEdit = null;
        this.toSave = this.macroSnackbar;
        this.savingSnackbar.show();
      }
    });
  }
  setMacros(_0x29d75d) {
    try {
      this.Macros = JSON.parse(_0x29d75d);
    } catch (_0x1c4744) {
      doDebugLogs(3, "setMacro() error: " + _0x1c4744);
    }
  }
  addMacro(_0xdd4634, _0x58039f) {
    if (_0xdd4634 == "zz") {
      _0xdd4634 = _0x58039f = "";
    }
    this.sendApp({
      Type: "Macro",
      Command: "Macro",
      Name: _0xdd4634,
      Value: _0x58039f
    });
  }
  addMacroRow(_0x1cc2aa, _0x4f5fc9, _0x567fac = false) {
    if (!this.macrosTbody || !this.macrosContainer?.innerHTML) {
      this.addMacrosTable();
    }
    if (["Statusfx", "Stealth"].includes(_0x1cc2aa)) {
      return;
    }
    const _0x3d99e3 = _0x567fac ? this.macrosTbody?.querySelector("[data-id=\"" + _0x567fac + "\"]") : this.macrosTbody?.querySelector("[data-id=\"" + _0x1cc2aa + "\"]");
    if (_0x3d99e3) {
      _0x3d99e3.querySelector(".macroName").innerText = this.truncateMacroIfTooLong(_0x1cc2aa);
      _0x3d99e3.querySelector(".macroValue").innerText = this.truncateMacroIfTooLong(_0x4f5fc9);
    } else {
      const _0x5c3571 = makeElement(this.macrosTbody, "tr");
      _0x5c3571.setAttribute("data-id", this.truncateMacroIfTooLong(_0x1cc2aa));
      animateFrom(_0x5c3571, {
        opacity: 0,
        transform: "translateY(1rem)",
        offset: 0
      }, {
        duration: 250,
        easing: "ease-in"
      });
      addText(makeElement(_0x5c3571, "td", "macroName"), this.truncateMacroIfTooLong(_0x1cc2aa));
      addText(makeElement(_0x5c3571, "td", "macroValue"), this.truncateMacroIfTooLong(_0x4f5fc9));
      const _0x8083db = makeElement(makeElement(_0x5c3571, "td"), "div", "macroTools");
      const _0x2bec65 = makeElement(_0x8083db, "span");
      _0x2bec65.setAttribute("data-edit", this.truncateMacroIfTooLong(_0x1cc2aa));
      makeElement(_0x2bec65, "img").setAttribute("src", "svg/pencil.svg");
      const _0x540d5a = makeElement(_0x8083db, "span");
      _0x540d5a.setAttribute("data-delete", this.truncateMacroIfTooLong(_0x1cc2aa));
      makeElement(_0x540d5a, "img").setAttribute("src", "svg/xdelete.svg");
      addToolTip(_0x2bec65, ["mob2.editmacro", "Edit Macro"]);
      addToolTip(_0x540d5a, ["mob2.deletemacro", "Delete Macro"]);
      _0x540d5a.addEventListener("click", () => {
        animateTo(_0x5c3571, [{
          opacity: 1,
          transform: "translateX(0rem)"
        }, {
          opacity: 0,
          transform: "translateX(10rem)"
        }], {
          duration: 300,
          easing: "ease-out"
        }, () => {
          if (Object.keys(this.cleanMacrosObj(this.Macros))?.length) {
            _0x5c3571.remove();
          } else {
            this.macrosContainer.innerHTML = "";
            this.addAnimatedText(makeElement(this.macrosContainer, "p"), ["mob2.nomacros", "You haven't added any macro yet."]);
          }
        });
        this.removeMacro(_0x1cc2aa);
      });
      _0x2bec65.addEventListener("click", () => {
        this.addMacroBtn.innerText = "";
        addText(this.addMacroBtn, ["mob2.edit", "Edit"]);
        this.macroToEdit = _0x1cc2aa;
        this.macroNameInput.value = _0x1cc2aa;
        this.macroValueInput.value = _0x4f5fc9;
      });
    }
    this.macrosContainer.scrollTop = this.macrosContainer.scrollHeight;
  }
  truncateMacroIfTooLong(_0x21aa26) {
    if (_0x21aa26) {
      if (_0x21aa26.length > 15) {
        return _0x21aa26.substr(0, 15) + "...";
      } else {
        return _0x21aa26;
      }
    } else {
      return "";
    }
  }
  removeMacro(_0x567a77) {
    delete this.Macros[_0x567a77];
    this.sendApp({
      Type: "Macro",
      Command: "Macro",
      Name: _0x567a77,
      Value: ""
    });
  }
  cleanMacrosObj(_0x369621) {
    const _0x333a9e = {
      ..._0x369621
    };
    const _0x1e9fb0 = _0x333a9e;
    for (let _0x55b82e in _0x1e9fb0) {
      if (!_0x1e9fb0[_0x55b82e] || !!["sline", "away", "rapid", "status", "mentions", "notify", "Statusfx", "Stealth"].includes(_0x55b82e)) {
        delete _0x1e9fb0[_0x55b82e];
      }
    }
    return _0x1e9fb0;
  }
  addMacrosTable() {
    const _0xf1155c = makeElement(this.macrosContainer, "table");
    _0xf1155c.setAttribute("class", "xTable centered");
    const _0x46ac80 = makeElement(makeElement(_0xf1155c, "thead"), "tr");
    addText(makeElement(_0x46ac80, "th"), ["mob2.name", "Name"]);
    addText(makeElement(_0x46ac80, "th"), ["mob2.value", "Value"]);
    addText(makeElement(_0x46ac80, "th"), "&nbsp;", !0);
    this.macrosTbody = makeElement(_0xf1155c, "tbody");
  }
  updateMacrosTable(_0x4ac70e) {
    _0x4ac70e ||= this.Macros;
    this.macrosContainer.innerHTML = "";
    _0x4ac70e = this.cleanMacrosObj(_0x4ac70e);
    if (Object.keys(_0x4ac70e)?.length) {
      const _0x4b700c = Object.keys(_0x4ac70e);
      for (let _0x3cb177 of _0x4b700c) {
        this.addMacroRow(_0x3cb177, _0x4ac70e[_0x3cb177]);
      }
    } else {
      this.addAnimatedText(makeElement(this.macrosContainer, "p"), ["mob2.nomacros", "You haven't added any macro yet."]);
    }
  }
  initPowersSetting() {
    this.away = document.getElementById("away");
    this.statusfx = document.getElementById("statusfx");
    this.statusSpeed = document.getElementById("statusSpeed");
    this.status2 = document.getElementById("status2");
    this.waveFrequency = document.getElementById("waveFrequency");
    this.gback = document.getElementById("gback");
    this.stickers = document.getElementById("stickers");
    this.xavi = document.getElementById("xavi");
    this.pcplus = document.getElementById("pcplus");
    this.rapidAction = document.getElementById("rapidAction");
    this.rapidTime = document.getElementById("rapidTime");
    this.rapidReason = document.getElementById("rapidReason");
    this.sline = document.getElementById("sline");
    this.goodfriend_all = document.getElementById("goodfriend_all");
    this.goodfriend_list = document.getElementById("goodfriend_list");
    this.savePowers = document.getElementById("savePowers");
    this.wOption = document.getElementById("w_Options");
    let _0x3bf441 = GetTranslation("mob2.goodfriendallplaceholder");
    if (_0x3bf441) {
      this.goodfriend_all.placeholder = _0x3bf441;
    }
    let _0x50a5fe = GetTranslation("mob2.goodfriendlistplaceholder");
    if (_0x50a5fe) {
      this.goodfriend_list.placeholder = _0x50a5fe;
    }
    document.querySelectorAll("[data-settings=\"powers\"] [data-power]").forEach(_0x4bdd30 => {
      const _0x2d6675 = _0x4bdd30.dataset.power;
      _0x4bdd30.classList.remove("disabled");
      if (!hasPower(_0x2d6675)) {
        _0x4bdd30.classList.add("disabled");
      }
    });
    const _0x529c36 = hasPower(StatusfxId);
    StatusEffects.forEach(_0x2e80d1 => {
      if (_0x2e80d1.set <= _0x529c36) {
        const _0x56b365 = makeElement(this.statusfx, "option");
        _0x56b365.dataset.localize = "mob2.statusfx" + _0x2e80d1.key;
        _0x56b365.value = _0x2e80d1.key;
        _0x56b365.innerText = _0x2e80d1.name;
      }
    });
    if (this.Macros?.away) {
      this.away.value = this.Macros.away;
    }
    if (this.Macros?.sline) {
      this.sline.value = this.Macros.sline.replace(/ /g, "");
    }
    if (_Activity.instance.UserSettings?.xavi) {
      this.xavi.value = _Activity.instance.UserSettings.xavi;
    }
    if (_Activity.instance.UserSettings?.pcplus) {
      this.pcplus.value = _Activity.instance.UserSettings.pcplus;
    }
    if (_Activity.instance.UserSettings?.gback) {
      this.gback.value = _Activity.instance.UserSettings.gback;
    }
    if (_Activity.instance.UserSettings?.sticker) {
      this.sticker.value = _Activity.instance.UserSettings.sticker;
    }
    if (_Activity.instance.UserSettings?.goodfriends) {
      this.goodfriend_list.value = _Activity.instance.UserSettings.goodfriends;
    }
    if (_Activity.instance.UserSettings?.goodfriends_all) {
      this.goodfriend_all.value = _Activity.instance.UserSettings.goodfriends_all;
    }
    if (_Activity.instance.UserSettings?.w_Options) {
      this.wOption.value = _Activity.instance.UserSettings.w_Options;
    }
    const _0x514cb4 = () => {
      if (["fadeout", "scrollup", "scrolldown", "typing"].includes(this.statusfx.value)) {
        this.status2.classList.remove("hidden");
      } else {
        this.status2.classList.add("hidden");
      }
      if (this.statusfx.value == "wave") {
        this.waveFrequency.classList.remove("hidden");
      } else {
        this.waveFrequency.classList.add("hidden");
      }
    };
    const _0x4b3e6b = makeElement(this.statusfx, "option");
    _0x4b3e6b.value = "noeffect";
    _0x4b3e6b.dataset.localize = "mob2.statusfxnoeffect";
    _0x4b3e6b.innerText = "No Effect";
    this.statusfx.value = "noeffect";
    TranslateAll();
    try {
      if (this.Macros?.Statusfx) {
        let _0x1bc75c = JSON.parse(decodeURIComponent(escape(atob(this.Macros.Statusfx.replace(/\s+/g, "")))));
        this.status2.value = _0x1bc75c?.status2 || "";
        this.statusfx.value = _0x1bc75c?.effect || "noeffect";
        this.statusSpeed.value = Math.max(1, Math.min(6, _0x1bc75c?.speed || 3));
        this.waveFrequency.value = Math.max(1, Math.min(6, _0x1bc75c?.waveFrequency || 3));
        _0x514cb4.bind(this)();
      }
    } catch (_0x578da3) {
      doDebugLogs(3, "Failed to load statusfx: " + _0x578da3 + ", " + this.Macros?.Statusfx);
    }
    addToolTip(this.statusfx, ["mob2.effect", "Effect"]);
    addToolTip(this.status2, ["mob2.status2", "Second Status"]);
    addToolTip(this.statusSpeed, ["mob2.statusspeed", "Status Speed"]);
    addToolTip(this.waveFrequency, ["mob2.wavefrequency", "Wave Frequency"]);
    this.statusfx.addEventListener("change", _0x514cb4.bind(this));
    if (hasPower(441)) {
      this.rapidReason.disabled = false;
    }
    const _0xa82f39 = this.Macros?.rapid?.split(",");
    if (_0xa82f39) {
      this.rapidAction.value = _0xa82f39[0];
      this.rapidTime.value = _0xa82f39[1] || 0;
      this.rapidReason.value = _0xa82f39[2]?.trim() ?? "";
    }
    this.savePowers.addEventListener("click", _0x5234e2 => {
      if (xInt(this.away.value) < 60) {
        this.away.value = 60;
      } else if (xInt(this.away.value) > 3600) {
        this.away.value = 3600;
      }
      const _0x498401 = this.Macros.away;
      const _0x24f5e1 = this.away.value;
      if (_0x24f5e1 != _0x498401 && hasPower(144)) {
        this.addMacro("away", _0x24f5e1);
      }
      const _0x1e6a35 = {
        effect: this.statusfx.value,
        speed: Math.max(1, Math.min(6, this.statusSpeed.value)),
        status2: this.status2.value || "",
        waveFrequency: Math.max(1, Math.min(6, this.waveFrequency.value))
      };
      const _0x3187f0 = btoa(unescape(encodeURIComponent(JSON.stringify(_0x1e6a35)))).replace(/\s+/g, "");
      this.addMacro("Statusfx", _0x3187f0);
      let _0x594206 = [];
      const _0x5ac55f = this.Macros.rapid;
      _0x594206.push(this.rapidAction.value ?? "");
      _0x594206.push(this.rapidTime.value || 0);
      if (hasPower(441)) {
        _0x594206.push(this.rapidReason.value.replace(/,/g, "").trim() ?? "");
      }
      _0x594206 = _0x594206.join(",");
      if (_0x594206 != _0x5ac55f && hasPower(91)) {
        this.addMacro("rapid", _0x594206);
      }
      const _0x276bec = Macros?.sline;
      if (hasPower(452) && this.sline.value != _0x276bec) {
        this.addMacro("sline", this.sline.value.replace(/ /g, ""));
      }
      const _0x3ad1df = _Activity.instance.UserSettings?.gback;
      if (_0x3ad1df != this.gback.value) {
        saveSetting("gback", this.gback.value);
      }
      const _0x5c9fce = _Activity.instance.UserSettings?.stickers;
      if (_0x5c9fce != this.stickers.value) {
        saveSetting("stickers", this.stickers.value);
      }
      const _0x4fe912 = _Activity.instance.UserSettings?.xavi;
      if (_0x4fe912 != this.xavi.value) {
        saveSetting("xavi", this.xavi.value);
      }
      const _0x2543be = _Activity.instance.UserSettings?.pcplus;
      if (_0x2543be != this.pcplus.value) {
        saveSetting("pcplus", this.pcplus.value);
      }
      const _0x401edc = _Activity.instance.UserSettings?.goodfriends_all;
      if (_0x401edc != this.goodfriend_all.value) {
        saveSetting("goodfriends_all", this.goodfriend_all.value);
      }
      const _0x4b88d2 = _Activity.instance.UserSettings?.goodfriends;
      if (_0x4b88d2 != this.goodfriend_list.value) {
        saveSetting("goodfriends", this.goodfriend_list.value);
      }
      const _0x1e6a29 = _Activity.instance.UserSettings?.w_Options;
      if (_0x1e6a29 != this.wOption.value) {
        saveSetting("w_Options", this.wOption.value);
      }
      this.toSave = this.settingsSnackbar;
      this.savingSnackbar.show();
      this.doReload = !0;
      this.DisableSaveButtons();
    });
  }
  initPstyleSetting() {
    this.keywordsList.innerHTML = "";
    const _0x1bd633 = this.getPstyleToUse();
    this.pstyle = document.getElementById("pstyle");
    this.pstylePos = document.getElementById("pstylePos");
    this.pstylecol = document.getElementById("pstylecol");
    this.pstyleicon = document.getElementById("pstyleicon");
    this.pstylegradient = document.getElementById("pstylegradient");
    this.savePstyle = document.getElementById("savePstyle");
    this.pscircle = document.getElementById("pscircle");
    this.psThemeText = document.getElementById("psThemeText");
    this.needPstyle = document.querySelector(".needPstyle");
    this.sunBurst = document.querySelector("option[value=\"pg7\"]");
    this.mushRoom = document.querySelector("option[value=\"pg8\"]");
    this.emerald = document.querySelector("option[value=\"pg9\"]");
    this.superNova = document.querySelector("option[value=\"pg10\"]");
    this.halloween = document.querySelector("option[value=\"pg11\"]");
    this.morgana = document.querySelector("option[value=\"pg12\"]");
    this.lems = document.querySelector("option[value=\"pg13\"]");
    this.kitsune = document.querySelector("option[value=\"pg14\"]");
    let _0x170b82 = null;
    this.colorPicker();
    this.autoColor(this.pstyle);
    this.autoColor(this.pstylecol);
    doDebugLogs(1, "Loaded the following pstyle:\n\n" + _0x1bd633);
    this.pstyle.addEventListener("keyup", _0x400b7e => {
      this.pickrSet(this.pstyle, this.pstyle.value, !0);
    });
    if (!hasPower(672)) {
      this.savePstyle.disabled = !0;
      this.previewPstyle.disabled = !0;
      this.addAnimatedText(this.needPstyle, ["mob2.needpower", "You need $1 power to use this feature.", "Pstyle"]);
      return;
    }
    if (!hasPower(700) && this.sunBurst) {
      this.sunBurst.disabled = true;
    }
    if (!hasPower(704) && this.mushRoom) {
      this.mushRoom.disabled = true;
    }
    if (!hasPower(95) && this.emerald) {
      this.emerald.disabled = true;
    }
    if (!hasPower(95) && this.superNova) {
      this.superNova.disabled = true;
    }
    if (!hasPower(729) && this.halloween) {
      this.halloween.disabled = true;
    }
    if (!hasPower(730) && this.morgana) {
      this.morgana.disabled = true;
    }
    if (!hasPower(731) && this.lems) {
      this.lems.disabled = true;
    }
    if (!hasPower(737) && this.kitsune) {
      this.kitsune.disabled = true;
    }
    if (this.isPstylePreviewSameAsSaved()) {
      this.needPstyle.classList.add("unsavedSettings");
      this.addAnimatedText(this.needPstyle, ["mob2.unsavedsettings", "You have unsaved settings. Save or discard changes."]);
    }
    this.pstylegradient.addEventListener("change", this.gradPreview);
    try {
      if (_0x1bd633) {
        const _0x138f19 = decodeURIComponent(escape(atob(_0x1bd633.replace(/\s+/g, ""))));
        doDebugLogs(1, "Decoded pstyle string:\n\n" + _0x138f19);
        let _0x59eb9d = JSON.parse(_0x138f19);
        doDebugLogs(1, "Parsed pstyle:");
        doDebugLogs(4, _0x59eb9d);
        if (_0x59eb9d?.pstyle) {
          this.pstyle.value = filter(_0x59eb9d.pstyle);
          _0x170b82 = _0x59eb9d.pstyle;
          if (this.pstyle.value.charAt(0) == "#") {
            this.pstyle.style.background = _0x59eb9d.pstyle;
            this.pstyle.style.color = isColorLight(_0x59eb9d.pstyle) ? "#000" : "#FFF";
          }
        }
        if (_0x59eb9d?.pstylePos) {
          this.pstylePos.value = filter(_0x59eb9d.pstylePos);
        }
        if (_0x59eb9d?.pstylecol) {
          this.pstylecol.value = filter(_0x59eb9d.pstylecol);
          this.pstylecol.style.background = _0x59eb9d.pstylecol;
          this.pstylecol.style.color = isColorLight(_0x59eb9d.pstylecol) ? "#000" : "#FFF";
        }
        if (_0x59eb9d?.pstyleicon) {
          this.pstyleicon.checked = filter(_0x59eb9d.pstyleicon);
        }
        if (_0x59eb9d?.pstylegradient) {
          const _0xac94f2 = {
            pg7: 700,
            pg8: 704,
            pg9: 95,
            pg10: 95,
            pg11: 729,
            pg12: 730
          };
          if (_0xac94f2[_0x59eb9d.pstylegradient] && !hasPower(_0xac94f2[_0x59eb9d.pstylegradient])) {
            _0x59eb9d.pstylegradient = "pgNone";
          }
          this.pstylegradient.value = filter(_0x59eb9d.pstylegradient);
          this.gradPreview();
        }
      }
    } catch (_0x3fd39c) {
      doDebugLogs(3, "Failed to load pstyle: " + _0x3fd39c);
    }
    this.savePstyle.addEventListener("click", _0x5260c1 => {
      const _0x74dfd = this.getJsonPStyleReady(this.pstyle, this.pstylePos, this.pstylecol, this.pstyleicon, this.pstylegradient);
      _0x170b82 = this.pstyle.value;
      this.saveSetting("pstyle", _0x74dfd);
      localStorage.removeItem(this.pstyleTmpKey);
      this.previewPstyle.disabled = !0;
      this.toSave = this.settingsSnackbar;
      this.savingSnackbar.show();
      this.doReload = !0;
      this.DisableSaveButtons();
    });
    this.previewPstyle.addEventListener("click", () => {
      if (_0x170b82 != null && _0x170b82 != this.pstyle.value) {
        this.pstylePos.value = "";
      }
      localStorage.setItem(this.pstyleTmpKey, this.getJsonPStyleReady(this.pstyle, this.pstylePos, this.pstylecol, this.pstyleicon, this.pstylegradient));
      localStorage.setItem("pstylePreviewMode", "1");
      _0x170b82 = this.pstyle.value;
      const _0x3edc41 = findNodeInWindowOrParent("#FrameDialog");
      if (_0x3edc41) {
        _0x3edc41.classList.add("d-none");
      }
      classicSetDialog("actions", this.Config.MyId);
    });
  }
  getJsonPStyleReady(_0x992e6d, _0x1c1884, _0x21fdd1, _0x32eb86, _0x3e5b6f) {
    _0x992e6d.value = _0x992e6d.value.includes("http") || isValidHex(_0x992e6d.value) ? _0x992e6d.value : "";
    _0x21fdd1.value = isValidHex(_0x21fdd1.value.substring(0, 7)) ? _0x21fdd1.value : "";
    const _0x237f97 = {
      pstyle: filter(_0x992e6d.value) ?? "",
      pstylePos: filter(_0x1c1884.value) ?? "",
      pstylecol: filter(_0x21fdd1.value) ?? "",
      pstyleicon: filter(_0x32eb86.checked) ?? "",
      pstylegradient: filter(_0x3e5b6f.value) ?? ""
    };
    return btoa(unescape(encodeURIComponent(JSON.stringify(_0x237f97))).replace(/\s+/g, ""));
  }
  gradPreview() {
    const _0x3e64bf = pstylegradient.value;
    psThemeText.classList.remove("ps-theme-text--black");
    psThemeText.classList.remove("ps-theme-text--gradient");
    window.kPstyleClasslist.forEach(_0x551f0d => pscircle.classList.remove(_0x551f0d));
    pscircle.classList.add(_0x3e64bf);
    if (_0x3e64bf !== "pgNone") {
      psThemeText.classList.add("ps-theme-text--gradient");
      switch (_0x3e64bf) {
        case "pg8":
          pscircle.classList.add("mushRoom");
          break;
        case "pg9":
        case "pg10":
          pscircle.classList.add("pstyleFx");
          break;
        case "pg11":
          pscircle.classList.add("psHalloween");
          break;
        case "pg12":
          pscircle.classList.add("psMorgana");
          break;
        case "pg13":
          pscircle.classList.add("psLems");
          break;
        case "pg14":
          pscircle.classList.add("psKitsune");
          psThemeText.classList.remove("ps-theme-text--gradient");
          psThemeText.classList.add("ps-theme-text--black");
      }
    }
  }
  initAcesSetting() {
    this.iconcolor = document.getElementById("iconcolor");
    this.pawnHue = document.getElementById("pawnHue");
    this.saveAces = document.getElementById("saveAces");
    this.colorPicker();
    this.autoColor(this.iconcolor);
    const _0xb3f8ee = document.querySelectorAll("[data-settings=\"aces\"] [data-power]");
    let _0x4e09fe = !1;
    _0xb3f8ee.forEach(_0x997e78 => {
      const _0x593704 = _0x997e78.dataset.power;
      _0x997e78.classList.remove("disabled");
      if (hasPower(_0x593704)) {
        if (_0x593704 === this.powerIds.kPawnHue) {
          if (!hasPower(this.powerIds.kPink) && !hasPower(this.powerIds.kBlueman) && !hasPower(this.powerIds.kYellow) && !hasPower(this.powerIds.kPurple) && !hasPower(this.powerIds.kGold) && !hasPower(this.powerIds.kRuby) && !hasPower(this.powerIds.kEverypower) && (!(this.Config?.pFlags & NamePowers.verified) || _Activity?.UserSettings?.Verified !== "enable")) {
            _0x997e78.classList.add("disabled");
            if (!_0x4e09fe) {
              this.needPawn = document.querySelector(".needPawn");
              this.addAnimatedText(this.needPawn, ["mob2.needpawn", "You need pawn powers to use this feature."]);
              _0x4e09fe = true;
            }
          }
        }
      } else {
        _0x997e78.classList.add("disabled");
      }
    });
    let _0x3ac47d = _Activity.instance.UserSettings.iconcolor;
    if (_Activity.instance.UserSettings?.iconcolor) {
      this.iconcolor.value = _0x3ac47d;
      this.iconcolor.style.background = _0x3ac47d;
      this.iconcolor.style.color = isColorLight(_0x3ac47d) ? "#000" : "#FFF";
    }
    const _0x398604 = _Activity.instance.UserSettings.pawnHue;
    let _0x5dc8b1 = _0x398604 || "0";
    this.hueSlider(_0x5dc8b1);
    this.saveAces.addEventListener("click", _0x4714c0 => {
      const _0x58a6a7 = this.iconcolor.value;
      saveSetting("iconcolor", isValidHex(_0x58a6a7) ? _0x58a6a7 : "");
      const _0x5bf33c = this.pawnHue.value;
      saveSetting("pawnHue", _0x5bf33c);
      this.toSave = this.settingsSnackbar;
      this.savingSnackbar.show();
      this.doReload = !0;
      this.DisableSaveButtons();
    });
  }
  hueSlider(_0x30aad8) {
    const _0x5402ea = document.getElementById("pawnHue");
    const _0x2ff421 = document.getElementById("pawnHuePreviewBut");
    const _0x2ccb2 = document.getElementById("pawnHueDefaultBut");
    _0x5402ea.style.background = "linear-gradient(to right, " + this.pawnHueData[0] + ", " + this.pawnHueData[1] + ")";
    _0x5402ea.min = parseInt(this.pawnHueData[2]);
    _0x5402ea.max = parseInt(this.pawnHueData[3]);
    _0x5402ea.value = parseInt(_0x30aad8);
    _0x2ff421.addEventListener("click", () => {
      ToC({
        Type: "GeneratePawnPreview",
        Value: _0x5402ea.value
      });
    });
    _0x2ccb2.addEventListener("click", () => {
      _0x5402ea.value = 0;
    });
  }
  setCurrentPawnPreview(_0x5456aa) {
    if (!_0x5456aa) {
      return;
    }
    this.pawnHuePreviewCode = _0x5456aa;
    const _0x116455 = document.getElementById("pawnHuePreview");
    _0x116455.innerHTML = "";
    _Activity.instance.Smilies.MakeSmiley(_0x116455, this.pawnHuePreviewCode, {
      size: 20
    });
  }
  setPawnHueSliderColor(_0x1c4cf9, _0x3baff3) {
    document.getElementById("pawnHue").style.background = "linear-gradient(to right, " + _0x1c4cf9 + ", " + _0x3baff3 + ")";
  }
  autoColor(_0x5ef42a) {
    _0x5ef42a.addEventListener("keyup", _0x262e00 => {
      this.pickrSet(_0x5ef42a, _0x5ef42a.value, !0);
    });
  }
  initAvatarSetting() {
    this.avatareffect = document.getElementById("avatareffect");
    this.avatarframe = document.getElementById("avatarframe");
    this.avatarspeed = document.getElementById("avatarspeed");
    this.avatarcolor = document.getElementById("avatarcolor");
    this.avatarrounded = document.getElementById("avatarrounded");
    this.saveAvatar = document.getElementById("saveAvatar");
    this.previewAvatar = document.getElementById("previewAvatar");
    this.avatarMsg = document.getElementById("avatarMsg");
    this.colorPicker();
    this.autoColor(this.avatarcolor);
    let _0x4c2a30 = config.MyRegName === undefined || !config.MyRegName;
    document.querySelectorAll("[data-settings=\"avatar\"] [data-avatar]").forEach(_0x1eb52c => {
      _0x1eb52c.classList.remove("disabled");
      if (_0x4c2a30) {
        _0x1eb52c.classList.add("disabled");
      }
    });
    if (_0x4c2a30) {
      this.addAnimatedText(makeElement(this.avatarMsg, "span", "noDays"), ["mob2.noreg", "You need to be registered to use this feature"]);
    }
    this.avatareffect.innerHTML = "";
    this.avatarframe.innerHTML = "";
    const _0x174f34 = makeElement(this.avatareffect, "option");
    _0x174f34.dataset.localize = "mob2.disable";
    _0x174f34.text = "Disable";
    _0x174f34.value = "";
    const _0x258b98 = _Activity.instance.EFFECTS;
    if (Object.keys(_0x258b98).length) {
      for (const _0x388c43 in _0x258b98) {
        const _0x2240d1 = makeElement(this.avatareffect, "option");
        _0x2240d1.text = this.getTranslationAndRequiredTextForAvatarStuff(_0x388c43, _0x258b98[_0x388c43]);
        _0x2240d1.value = _0x388c43;
        _0x2240d1.disabled = this.disableEffectOrNot(_0x258b98[_0x388c43]);
        _0x2240d1.dataset.baseDisabled = _0x2240d1.disabled ? "1" : "0";
      }
    }
    const _0x3d3e54 = makeElement(this.avatarframe, "option");
    _0x3d3e54.dataset.localize = "mob2.disable";
    _0x3d3e54.text = "Disable";
    _0x3d3e54.value = "";
    const _0x4ea0be = _Activity.instance.FRAMES;
    if (Object.keys(_0x4ea0be).length) {
      for (const _0x9cbda2 in _0x4ea0be) {
        const _0x3c674d = makeElement(this.avatarframe, "option");
        _0x3c674d.text = this.getTranslationAndRequiredTextForAvatarStuff(_0x9cbda2, _0x4ea0be[_0x9cbda2]);
        _0x3c674d.value = _0x9cbda2;
        _0x3c674d.disabled = this.disableEffectOrNot(_0x4ea0be[_0x9cbda2]);
      }
    }
    TranslateAll();
    let _0x16628c = {};
    try {
      const _0x12b73c = _Activity.instance.UserSettings?.avatarSettings ?? "";
      if (_0x12b73c) {
        const _0x48d553 = decodeURIComponent(escape(atob(_0x12b73c)));
        _0x16628c = JSON.parse(_0x48d553);
      }
    } catch (_0xfd8abc) {
      console.error("Failed to parse avatarSettings:", _0xfd8abc);
    }
    if (_0x16628c.avatareffect) {
      this.avatareffect.value = _0x16628c.avatareffect;
    }
    if (_0x16628c.avatarframe) {
      this.avatarframe.value = _0x16628c.avatarframe;
    }
    if (_0x16628c.avatarcolor) {
      const _0xc2bc7a = _0x16628c.avatarcolor;
      this.avatarcolor.value = _0xc2bc7a;
      this.avatarcolor.style.background = _0xc2bc7a;
      this.avatarcolor.style.color = isColorLight(_0xc2bc7a) ? "#000" : "#FFF";
    }
    if (_0x16628c.avatarspeed) {
      this.avatarspeed.value = _0x16628c.avatarspeed;
    }
    if (_0x16628c.avatarrounded) {
      this.avatarrounded.checked = _0x16628c.avatarrounded === "true" || _0x16628c.avatarrounded === true;
    }
    const _0x4be694 = () => {
      const _0x16b212 = {
        avatareffect: filter(this.avatareffect.value) ?? "",
        avatarframe: filter(this.avatarframe.value) ?? "",
        avatarspeed: filter(this.avatarspeed.value) ?? "",
        avatarcolor: isValidHex(this.avatarcolor.value) ? filter(this.avatarcolor.value) : "",
        avatarrounded: this.avatarrounded.checked ? "true" : ""
      };
      const _0x41abed = JSON.stringify(_0x16b212);
      return btoa(unescape(encodeURIComponent(_0x41abed)));
    };
    this.saveAvatar.addEventListener("click", () => {
      const _0x3e3106 = _0x4be694();
      saveSetting("avatarSettings", _0x3e3106);
      this.toSave = this.settingsSnackbar;
      this.savingSnackbar.show();
      this.doReload = !0;
      this.DisableSaveButtons();
    });
    this.previewAvatar.addEventListener("click", () => {
      const _0x1010e6 = _0x4be694();
      localStorage.setItem("avatarSettingsTmp", _0x1010e6);
      this.renderAvatar();
    });
  }
  getTranslationAndRequiredTextForAvatarStuff(_0x272596, _0x2be89f) {
    let _0x21a531 = _0x272596;
    if (_0x2be89f >= 0) {
      switch (_0x2be89f) {
        case 0:
          let _0x243259 = GetTranslation("mob2.subsonly");
          _0x243259 ||= "Subscribers only";
          _0x21a531 += " - " + _0x243259;
          break;
        default:
          const _0x2f7e1f = _Activity.instance.PSSA ?? {};
          const _0x2d1414 = _Activity.instance.ACES ?? {};
          const _0xf98013 = !!_0x2f7e1f && _0x2f7e1f[_0x2be89f + 1];
          const _0x5b251e = _0x2d1414 && _0x2d1414[_0x2be89f];
          if (_0xf98013 || _0x5b251e) {
            const _0x3a686f = _0x5b251e ? "ace" : "power";
            const _0xeeac0f = _0x5b251e ?? _0xf98013;
            let _0x328cc7 = GetTranslation("mob2.required" + _0x3a686f);
            _0x328cc7 ||= "Requires $0 " + _0x3a686f;
            _0x328cc7 = _0x328cc7.replace("$0", _0xeeac0f);
            _0x21a531 += " - " + _0x328cc7;
            break;
          }
      }
    }
    return _0x21a531;
  }
  disableEffectOrNot(_0x4a8629) {
    if (_0x4a8629 === -1) {
      return !config?.MyRegName.length;
    } else if (_0x4a8629 === 0) {
      return !this.hasDays();
    } else {
      return !hasPower(_0x4a8629);
    }
  }
  colorPicker() {
    const _0x513852 = {
      selector: "#ubcolPick",
      inputHandler: pstylecol
    };
    const _0x1abc06 = {
      selector: "#ubcolPick2",
      inputHandler: pstyle
    };
    const _0x511c3e = {
      selector: "#iconcolorPickr",
      inputHandler: iconcolor
    };
    const _0x92e857 = {
      selector: "#avatarcolorPickr",
      inputHandler: avatarcolor
    };
    [_0x513852, _0x1abc06, _0x511c3e, _0x92e857].forEach(_0xdc2415 => {
      const _0x4aef8c = {
        input: !0,
        clear: !0
      };
      const _0x4684f7 = {
        palette: !0,
        preview: !0,
        opacity: !0,
        hue: !0,
        interaction: _0x4aef8c
      };
      let {
        selector: _0x4c96d8,
        inputHandler: _0x32982e
      } = _0xdc2415;
      let _0x5a2235 = Pickr.create({
        el: _0x4c96d8,
        theme: "nano",
        preview: !0,
        useAsButton: !0,
        closeOnScroll: !1,
        lockOpacity: !0,
        components: _0x4684f7
      }).on("change", (_0x337f9e, _0x257078) => {
        let _0x338bae = _0x337f9e.toHEXA().toString();
        this.pickrSet(_0x32982e, _0x338bae);
      }).on("clear", _0x30f5d6 => {
        this.pickrSet(_0x32982e, "");
      }).on("save", _0x584c30 => {
        _0x5a2235.hide();
      });
    });
  }
  pickrSet(_0x18fe05, _0x46264d, _0x76c921) {
    if (_0x46264d.charAt(0) == "#" && _0x46264d.length == 7 && isValidHex(_0x46264d) || !_0x76c921) {
      _0x18fe05.style.background = _0x46264d;
      _0x18fe05.style.color = isColorLight(_0x46264d) ? "#000" : "#FFF";
      _0x18fe05.value = _0x46264d;
    } else {
      _0x18fe05.style.background = "";
      _0x18fe05.style.color = "";
    }
  }
  initTranslatorSetting() {
    if (this.translatorMsg) {
      this.translatorMsg.style.display = "none";
    }
    this.translatorContent.style.display = "block";
    if (!this.hasDays()) {
      this.translatorMsg.innerHTML = "";
      this.translatorMsg.style.display = "block";
      this.translatorContent.style.display = "none";
      this.addAnimatedText(makeElement(this.translatorMsg, "span", "noDays"), ["mob2.nodays", "You need to have subscriber days to use this feature."]);
      return;
    }
    this.yourLang = document.getElementById("yourLang");
    this.translateTo = document.getElementById("translateTo");
    this.enableOnChat = document.getElementById("enableOnChat");
    this.saveTranslator = document.getElementById("saveTranslator");
    this.showTranslation = document.getElementById("showTranslation");
    this.includeOriginalMsg = document.getElementById("includeOriginalMsg");
    for (const _0x465694 in this.translatorLangs) {
      if (this.translatorLangs.hasOwnProperty(_0x465694)) {
        [this.yourLang, this.translateTo].forEach(_0x32b32e => {
          const _0x4c36d2 = makeElement(_0x32b32e, "option");
          _0x4c36d2.text = this.translatorLangs[_0x465694];
          _0x4c36d2.value = _0x465694;
        });
      }
    }
    const _0x482613 = this.Config?.chatid;
    let _0x4a5ac3 = {};
    const _0x50cfa6 = _Activity.instance.UserSettings?.translatorChatsv2;
    if (_0x50cfa6) {
      try {
        _0x4a5ac3 = JSON.parse(_Activity.instance.UserSettings?.translatorChatsv2?.replace(/”/g, "\""));
      } catch (_0x19319e) {
        doDebugLogs(3, "Failed to load translator chats: " + _0x19319e);
      }
    }
    let _0x4426e5 = _0x4a5ac3[_0x482613] ?? "";
    _0x4426e5 = _0x4426e5.split("|");
    this.enableOnChat.checked = _0x4426e5[0] == "enabled";
    this.translateTo.value = _0x4426e5[1] ?? "";
    this.yourLang.value = _0x4426e5[2] ?? "";
    this.showTranslation.value = _0x4426e5[3] || "both";
    this.includeOriginalMsg.checked = !!_0x4426e5[4] && _0x4426e5[4] != "off";
    this.saveTranslator.addEventListener("click", _0x34fb69 => {
      const _0x590bff = this.enableOnChat.checked ? "enabled" : "disabled";
      const _0xc1b2ed = this.includeOriginalMsg.checked ? "on" : "off";
      _0x4a5ac3[_0x482613] = _0x590bff + "|" + this.translateTo.value + "|" + this.yourLang.value + "|" + this.showTranslation.value + "|" + _0xc1b2ed;
      saveSetting("translatorChatsv2", JSON.stringify(_0x4a5ac3));
      this.toSave = this.enableOnChat.checked ? this.translatorSnackbar : this.translatorDisabledSnackbar;
      this.savingSnackbar.show();
      this.doReload = !0;
      this.DisableSaveButtons();
    });
  }
  initKeywordsSetting() {
    this.keywordsList.innerHTML = "";
    if (this.hasMarkPower()) {
      const _0x3cf5c9 = {
        input: !0,
        clear: !0
      };
      const _0x49f164 = {
        palette: !0,
        preview: !0,
        opacity: !0,
        hue: !0,
        interaction: _0x3cf5c9
      };
      this.addKeywordBtn = document.getElementById("addKeyword");
      this.keywordNameInput = document.getElementById("keywordName");
      this.editKeyword = document.getElementById("editKeyword");
      this.deleteKeyword = document.getElementById("deleteKeyword");
      this.keywordNameInput.addEventListener("keyup", () => {
        if (this.keywordNameInput.value.length > 2) {
          this.addKeywordBtn.disabled = false;
        } else {
          this.addKeywordBtn.disabled = true;
        }
      });
      this.keywordColor = Pickr.create({
        el: "#keywordColor",
        theme: "nano",
        default: this.defaultKeywordColor,
        preview: !0,
        useAsButton: !0,
        closeOnScroll: !0,
        lockOpacity: !0,
        components: _0x49f164
      });
      this.keywordColor.on("change", _0x1e537d => {
        const _0x1c65cb = _0x1e537d.toHEXA().toString();
        this.keywordNameInput.style.background = _0x1c65cb;
        this.keywordNameInput.style.color = isColorLight(_0x1c65cb) ? "#000" : "#FFF";
      });
      this.keywordColor.on("clear", () => {
        this.keywordNameInput.style.background = "";
        this.keywordNameInput.style.color = "";
      });
      this.keywordColor.on("save", () => {
        this.keywordColor.hide();
      });
      this.addKeywordBtn.addEventListener("click", this.addKeywordEvent.bind(this));
      if (!parent?.keywordSortable) {
        parent.keywordSortable = !0;
        new Sortable(this.keywordsList, null, _0x132875 => {
          if (this.deleteKeyword.classList.contains("active")) {
            this.keywords = this.keywords.filter(_0x55f147 => _0x55f147.id != _0x132875.id);
            this.saveSetting("marks", JSON.stringify(this.keywords));
            animateTo(_0x132875, {
              opacity: 0,
              transform: "translateY(10rem)",
              fill: "forwards"
            }, {
              duration: 400,
              easing: "ease-out"
            }, () => {
              _0x132875.remove();
              if (!this.keywords?.length) {
                this.addAnimatedText(this.keywordsList, ["mob2.nokeywords", "You haven't added any keyword yet."]);
              }
            });
            this.keywordToEdit = null;
          } else if (this.editKeyword.classList.contains("active") && _0x132875) {
            const _0x5d2416 = this.keywords.filter(_0x40b8ec => _0x40b8ec.id == _0x132875.id)[0];
            const _0x1aefe6 = _0x5d2416.color || this.defaultKeywordColor;
            this.keywordColor.setColor(_0x1aefe6);
            this.addKeywordBtn.disabled = !1;
            this.keywordNameInput.value = _0x5d2416.name;
            this.keywordNameInput.focus();
            this.keywordNameInput.style.background = _0x1aefe6;
            this.keywordNameInput.style.color = isColorLight(_0x1aefe6) ? "#000" : "#FFF";
            this.keywordToEdit = _0x5d2416.id;
          }
        }, this.editKeyword, this.deleteKeyword);
      }
    } else {
      this.addAnimatedText(this.keywordsList, ["mob2.needpower", "You need $1 power to use this feature.", "Mark"]);
    }
  }
  addKeywordEvent() {
    const _0x2c16db = Math.random().toString(36).substr(2, 9);
    const _0x3dd998 = this.keywordColor?.getColor().toHEXA().toString() || this.defaultCategoryColor;
    const _0x51882f = this.RemoveHtmlEntities(this.keywordNameInput?.value).substr(0, 20).replace(/\"/g, "").replace(/ /g, "");
    if (this.keywordToEdit) {
      if (!_0x51882f) {
        return;
      }
      const _0x2a4d42 = this.keywords.filter(_0x30068e => _0x30068e.id == this.keywordToEdit)[0];
      _0x2a4d42.name = _0x51882f;
      _0x2a4d42.color = _0x3dd998;
      this.keywordNameInput.value = "";
      this.keywordNameInput.style.color = "#000";
      this.keywordNameInput.style.background = "#FFF";
      this.friendsCategories = null;
      if (_Activity.instance.UserSettings.friendskeywords) {
        try {
          this.friendsCategories = JSON.parse(_Activity.instance.UserSettings.friendskeywords.replace(/”/g, "\""));
        } catch (_0x52946b) {
          doDebugLogs(3, "Failed to load friends keywords: " + _0x52946b + ", " + _Activity.instance.UserSettings.friendskeywords);
        }
      }
      const _0x26951b = this.friendsCategories?.filter(_0x41b6e2 => _0x41b6e2.id == this.keywordToEdit);
      this.friendsCategories = this.friendsCategories?.filter(_0x26f83a => _0x26f83a.id != this.keywordToEdit);
      _0x26951b?.forEach(_0x5994ac => {
        this.friendsCategories.push({
          user: _0x5994ac.user,
          name: _0x51882f,
          id: this.keywordToEdit
        });
      });
      const _0x2d86d9 = document.getElementById(this.keywordToEdit);
      _0x2d86d9.classList.remove("editActive");
      _0x2d86d9.innerText = _0x51882f;
      _0x2d86d9.style.backgroundColor = _0x3dd998;
      _0x2d86d9.style.color = isColorLight(_0x3dd998) ? "#000" : "#FFF";
      this.keywordToEdit = null;
      saveSetting("marks", JSON.stringify(this.keywords));
      this.toSave = this.keywordEditedSnackbar;
      this.savingSnackbar.show();
    } else if (_0x51882f.length) {
      this.addKeywordBtn.disabled = !1;
      this.keywordNameInput.value = "";
      this.keywordNameInput.style.color = "#000";
      this.keywordNameInput.style.background = "#FFF";
      this.addKeywordItem(_0x2c16db, _0x51882f, _0x3dd998);
      const _0x4f1b12 = {
        name: _0x51882f,
        id: _0x2c16db,
        color: _0x3dd998
      };
      this.keywords.push(_0x4f1b12);
      this.saveSetting("marks", JSON.stringify(this.keywords));
      this.toSave = this.keywordAddedSnackbar;
      this.savingSnackbar.show();
    }
  }
  updateKeywords() {
    if (!this.keywordsList?.innerHTML) {
      if (this.hasMarkPower()) {
        if (_Activity.instance.UserSettings.marks) {
          try {
            this.keywords = JSON.parse(_Activity.instance.UserSettings.marks.replace(/”/g, "\""));
          } catch (_0xacbfc7) {
            doDebugLogs(3, "Failed to load keywords: " + _0xacbfc7 + ", " + _Activity.instance.UserSettings.marks);
          }
        }
        if (this.keywords?.length) {
          this.keywords.forEach(_0x3e3ede => this.addKeywordItem(_0x3e3ede.id, _0x3e3ede.name, _0x3e3ede.color));
        } else {
          this.addAnimatedText(this.keywordsList, ["mob2.nokeywords", "You haven't added any keyword yet."]);
        }
      } else {
        this.addAnimatedText(this.keywordsList, ["mob2.needpower", "You need $1 power to use this feature.", "Mark"]);
      }
    }
  }
  hasMarkPower() {
    return hasPower(462);
  }
  addKeywordItem(_0x53b7b8, _0x32bfcc, _0x1a0bdc) {
    if (!this.keywords?.length) {
      this.keywordsList.innerHTML = "";
    }
    const _0x4fc28e = makeElement(this.keywordsList, "li", "keyword", _0x53b7b8);
    animateFrom(_0x4fc28e, {
      opacity: 0,
      transform: "translateX(10rem)"
    }, {
      duration: 400,
      easing: "ease-in"
    });
    _0x4fc28e.style.backgroundColor = _0x1a0bdc;
    _0x4fc28e.style.color = isColorLight(_0x1a0bdc) ? "#000" : "#FFF";
    _0x4fc28e.innerHTML = _0x32bfcc;
    return _0x4fc28e;
  }
  initCategoriesSetting() {
    this.categoriesList.innerHTML = "";
    if (this.hasCategoryPower()) {
      const _0x48a3eb = {
        input: !0,
        clear: !0
      };
      const _0x419aaf = {
        palette: !0,
        preview: !0,
        opacity: !0,
        hue: !0,
        interaction: _0x48a3eb
      };
      this.addCategoryBtn = document.getElementById("addCategory");
      this.categoryNameInput = document.getElementById("categoryName");
      this.editCategory = document.getElementById("editCategory");
      this.deleteCategory = document.getElementById("deleteCategory");
      this.categoryNameInput.addEventListener("keyup", () => {
        if (this.categoryNameInput.value.length) {
          this.addCategoryBtn.disabled = false;
        } else {
          this.addCategoryBtn.disabled = true;
        }
      });
      this.categoryColor = Pickr.create({
        el: "#categoryColor",
        theme: "nano",
        default: this.defaultCategoryColor,
        preview: true,
        useAsButton: true,
        closeOnScroll: true,
        lockOpacity: true,
        components: _0x419aaf
      });
      this.categoryColor.on("change", _0x17d079 => {
        const _0x562279 = _0x17d079.toHEXA().toString();
        this.categoryNameInput.style.background = _0x562279;
        this.categoryNameInput.style.color = isColorLight(_0x562279) ? "#000" : "#FFF";
      });
      this.categoryColor.on("clear", () => {
        this.categoryNameInput.style.background = "";
        this.categoryNameInput.style.color = "";
      });
      this.categoryColor.on("save", () => {
        this.keywordColor.hide();
      });
      this.addCategoryBtn.addEventListener("click", this.addCategoryEvent.bind(this));
      if (!parent?.categorySortable) {
        parent.categorySortable = true;
        new Sortable(this.categoriesList, this.updateCategories.bind(this), _0x2e32eb => {
          if (this.deleteCategory.classList.contains("active")) {
            this.categories = this.categories.filter(_0x1ef656 => _0x1ef656.id != _0x2e32eb.id);
            if (this.friendsCategories) {
              try {
                this.friendsCategories = JSON.parse(_Activity.instance.UserSettings?.friendscategories?.replace(/”/g, "\""));
                this.friendsCategories = this.friendsCategories.filter(_0x4c7fe6 => _0x4c7fe6.id != _0x2e32eb.id);
              } catch (_0x19add7) {
                doDebugLogs(3, "Failed to load friends categories: " + _0x19add7);
              }
            }
            this.saveSetting("categories", JSON.stringify(this.categories));
            this.saveSetting("friendscategories", JSON.stringify(this.friendsCategories));
            animateTo(_0x2e32eb, {
              opacity: 0,
              transform: "translateY(10rem)",
              fill: "forwards"
            }, {
              duration: 400,
              easing: "ease-out"
            }, () => {
              _0x2e32eb.remove();
              if (!this.categories?.length) {
                this.addAnimatedText(this.categoriesList, ["mob2.nocategories", "You haven't added any category yet."]);
              }
            });
            this.categoryToEdit = null;
          } else if (this.editCategory.classList.contains("active") && _0x2e32eb) {
            const _0x3e257f = this.categories.filter(_0x5e547a => _0x5e547a.id == _0x2e32eb.id)[0];
            const _0x4eb7cd = _0x3e257f.color || this.defaultCategoryColor;
            this.categoryColor.setColor(_0x4eb7cd);
            this.addCategoryBtn.disabled = false;
            this.categoryNameInput.value = _0x3e257f.name;
            this.categoryNameInput.focus();
            this.categoryNameInput.style.background = _0x4eb7cd;
            this.categoryNameInput.style.color = isColorLight(_0x4eb7cd) ? "#000" : "#FFF";
            this.categoryToEdit = _0x3e257f.id;
          }
        }, this.editCategory, this.deleteCategory);
      }
    } else {
      this.addAnimatedText(this.categoriesList, ["mob2.needpower", "You need $1 power to use this feature.", "Category"]);
    }
  }
  addCategoryEvent() {
    const _0x479dd5 = Math.random().toString(36).substr(2, 9);
    const _0x1c5555 = this.categoryColor?.getColor().toHEXA().toString() || this.defaultCategoryColor;
    const _0x391de7 = this.RemoveHtmlEntities(this.categoryNameInput?.value);
    if (this.categoryToEdit) {
      if (!_0x391de7) {
        return;
      }
      const _0x5de058 = this.categories.filter(_0x3e1a35 => _0x3e1a35.id == this.categoryToEdit)[0];
      _0x5de058.name = _0x391de7;
      _0x5de058.color = _0x1c5555;
      this.categoryNameInput.value = "";
      this.categoryNameInput.style.color = "#000";
      this.categoryNameInput.style.background = "#FFF";
      this.friendsCategories = null;
      if (_Activity.instance.UserSettings.friendscategories) {
        try {
          this.friendsCategories = JSON.parse(_Activity.instance.UserSettings.friendscategories.replace(/”/g, "\""));
        } catch (_0x28d612) {
          doDebugLogs(3, "Failed to load friends categories (2): " + _0x28d612);
        }
      }
      const _0x1956cf = this.friendsCategories?.filter(_0x2d1eeb => _0x2d1eeb.id == this.categoryToEdit);
      this.friendsCategories = this.friendsCategories?.filter(_0x127f7b => _0x127f7b.id != this.categoryToEdit);
      _0x1956cf?.forEach(_0x594511 => {
        this.friendsCategories.push({
          user: _0x594511.user,
          name: _0x391de7,
          id: this.categoryToEdit
        });
      });
      const _0x2dec58 = document.getElementById(this.categoryToEdit);
      _0x2dec58.classList.remove("editActive");
      _0x2dec58.innerText = _0x391de7;
      _0x2dec58.style.backgroundColor = _0x1c5555;
      _0x2dec58.style.color = isColorLight(_0x1c5555) ? "#000" : "#FFF";
      this.categoryToEdit = null;
      saveSetting("categories", JSON.stringify(this.categories));
      saveSetting("friendscategories", JSON.stringify(this.friendsCategories));
      this.toSave = this.categoryEditedSnackbar;
      this.savingSnackbar.show();
    } else if (_0x391de7.length) {
      this.addCategoryBtn.disabled = !1;
      this.categoryNameInput.value = "";
      this.categoryNameInput.style.color = "#000";
      this.categoryNameInput.style.background = "#FFF";
      this.addCategoryItem(_0x479dd5, _0x391de7, _0x1c5555);
      const _0x2d8460 = {
        name: _0x391de7,
        id: _0x479dd5,
        color: _0x1c5555
      };
      this.categories.push(_0x2d8460);
      this.saveSetting("categories", JSON.stringify(this.categories));
      this.toSave = this.categoryAddedSnackbar;
      this.savingSnackbar.show();
    }
  }
  updateCategories(_0x252f9b) {
    if (!this.categoriesList?.innerHTML) {
      if (this.hasCategoryPower()) {
        if (_0x252f9b?.length) {
          _0x252f9b = _0x252f9b.split(":");
          this.categories.sort((_0x25a0cc, _0x50cc02) => _0x252f9b.indexOf(_0x25a0cc.id) - _0x252f9b.indexOf(_0x50cc02.id));
          saveSetting("categories", JSON.stringify(this.categories));
        } else {
          if (_Activity.instance.UserSettings.categories) {
            try {
              this.categories = JSON.parse(_Activity.instance.UserSettings.categories.replace(/”/g, "\""));
            } catch (_0x30da89) {
              doDebugLogs(3, "Failed to load categories: " + _0x30da89);
            }
          }
          if (this.categories?.length) {
            this.categories.forEach(_0x460493 => this.addCategoryItem(_0x460493.id, _0x460493.name, _0x460493.color));
          } else {
            this.addAnimatedText(this.categoriesList, ["mob2.nocategories", "You haven't added any category yet."]);
          }
        }
      } else {
        this.addAnimatedText(this.categoriesList, ["mob2.needpower", "You need $1 power to use this feature.", "Category"]);
      }
    }
  }
  hasCategoryPower() {
    return this.Config?.pFlags & NamePowers.category;
  }
  addCategoryItem(_0xf50537, _0x438092, _0x2f9013) {
    if (!this.categories?.length) {
      this.categoriesList.innerHTML = "";
    }
    const _0x54c5bf = makeElement(this.categoriesList, "li", "category", _0xf50537);
    animateFrom(_0x54c5bf, {
      opacity: 0,
      transform: "translateX(10rem)"
    }, {
      duration: 400,
      easing: "ease-in"
    });
    _0x54c5bf.style.backgroundColor = _0x2f9013;
    _0x54c5bf.style.color = isColorLight(_0x2f9013) ? "#000" : "#FFF";
    _0x54c5bf.innerHTML = _0x438092;
    return _0x54c5bf;
  }
  initAboutSetting() {
    document.getElementById("versionNumber").innerText = this.Config?.Version || parent?.config?.Version;
  }
  initAccount() {
    let _0x3f9aa4 = document.getElementById("doDelete");
    let _0x12bf5f = document.getElementById("delErr");
    let _0x4c59f0 = document.getElementById("delSent");
    _0x3f9aa4.addEventListener("click", function (_0x3c1333) {
      if (document.getElementById("confirmdelete").checked != 1) {
        _0x12bf5f.classList.remove("d-none");
        document.querySelector("#accDesc").scrollIntoView({
          behavior: "smooth",
          block: "start"
        });
        _0x12bf5f.innerHTML = "<span data-localize=\"mob2.checkp\">You must check the box to proceed!</span>";
        return !1;
      }
      {
        _0x3c1333.preventDefault();
        let _0x461d69 = {};
        try {
          _0x461d69 = JSON.parse(localStorage.getItem("todo"));
        } catch (_0x51b0c8) {
          _0x461d69 = {};
        }
        let _0x4893e9 = new FormData();
        _0x4893e9.append("Delete", "1");
        _0x4893e9.append("Permanent", "2");
        _0x4893e9.append("UserId", _0x461d69.w_userno);
        _0x4893e9.append("DeviceId", _0x461d69.DeviceId);
        _0x4893e9.append("PassHash", _0x461d69.PassHash);
        urlPost("https://xath.hu/web_gear/chat/register5.php", _0x4893e9).then(function (_0x3b9931) {
          _0x12bf5f.classList.remove("d-none");
          document.querySelector("#accDesc").scrollIntoView({
            behavior: "smooth",
            block: "start"
          });
          if (_0x3b9931.Err.deletep) {
            _0x4c59f0.classList.add("d-none");
            _0x12bf5f.classList.add("delSuccess");
            _0x12bf5f.innerHTML = "<span data-localize=\"mob2.delpsuc\">An email has been sent to you for confirming the permanent deletion request.</span>";
          } else if (_0x3b9931.Err.deleteallready) {
            _0x12bf5f.classList.add("delError");
            _0x12bf5f.innerHTML = "<span data-localize=\"mob2.deleteAlready\">You have already made a request recently, please check your email.</span>";
          } else {
            _0x12bf5f.classList.add("delError");
            _0x12bf5f.innerHTML = _0x3b9931.Err.login;
          }
        });
      }
    });
  }
  hasDays() {
    return !!(this.Config?.pFlags & NamePowers.hasdays);
  }
  addAnimatedText(_0x1e8bd3, _0x45fcc9) {
    const _0x394d49 = makeElement(_0x1e8bd3, "span");
    addText(_0x394d49, _0x45fcc9);
    animateFrom(_0x394d49, {
      opacity: 0
    }, {
      duration: 250,
      easing: "ease-in-out"
    });
    return _0x394d49;
  }
  saveSetting(_0x4fcd28, _0x41fdc3) {
    const _0x122506 = {
      Type: "Setting",
      Command: "Setting",
      Name: _0x4fcd28,
      Value: _0x41fdc3
    };
    this.sendApp(_0x122506);
  }
  sendApp(_0xc0b4be) {
    _0xc0b4be.Page = "settings";
    ToC(_0xc0b4be);
  }
  refresh() {
    parent.parent.location.href = parent.parent.location.href;
  }
  RemoveHtmlEntities(_0x5e9c26) {
    return String(_0x5e9c26).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  }
  hideSettigs() {
    window.parent.setFrameVis();
  }
  doTab(_0xd81a78) {
    document.querySelector("[data-target=\"" + _0xd81a78 + "\"]")?.click();
  }
  doSave() {
    setTimeout(() => {
      this.savingSnackbar.hide();
      this.toSave?.show();
      this.toSave = null;
      parent.keywordSortable = false;
      parent.categorySortable = false;
    }, 2500);
  }
  DisableSaveButtons() {
    if (this.previewPstyle) {
      this.previewPstyle.disabled = true;
    }
    if (this.saveGeneralBtn) {
      this.saveGeneralBtn.disabled = true;
    }
    if (this.saveAppearanceBtn) {
      this.saveAppearanceBtn.disabled = true;
    }
    if (this.saveNotificationsBtn) {
      this.saveNotificationsBtn.disabled = true;
    }
    if (this.saveAvatar) {
      this.saveAvatar.disabled = true;
    }
    if (this.saveCalls) {
      this.saveCalls.disabled = true;
    }
    if (this.savePowers) {
      this.savePowers.disabled = true;
    }
    if (this.savePstyle) {
      this.savePstyle.disabled = true;
    }
    if (this.saveAces) {
      this.saveAces.disabled = true;
    }
    if (this.saveTranslator) {
      this.saveTranslator.disabled = true;
    }
    setTimeout(this.EnableSaveButtons, 5000);
  }
  EnableSaveButtons() {
    if (this.previewPstyle && hasPower(672)) {
      this.previewPstyle.disabled = false;
    }
    if (this.saveGeneralBtn) {
      this.saveGeneralBtn.disabled = false;
    }
    if (this.saveAppearanceBtn) {
      this.saveAppearanceBtn.disabled = false;
    }
    if (this.saveNotificationsBtn) {
      this.saveNotificationsBtn.disabled = false;
    }
    if (this.saveAvatar) {
      this.saveAvatar.disabled = false;
    }
    if (this.saveCalls) {
      this.saveCalls.disabled = false;
    }
    if (this.savePowers) {
      this.savePowers.disabled = false;
    }
    if (this.savePstyle && hasPower(672)) {
      this.savePstyle.disabled = false;
    }
    if (this.saveAces) {
      this.saveAces.disabled = false;
    }
    if (this.saveTranslator) {
      this.saveTranslator.disabled = false;
    }
  }
  sendTestNotification() {
    if (_Activity.instance.Notify.compatible()) {
      _Activity.instance.Notify.authorize();
    }
    _Activity.instance.Notify.show("Hello from neox4t", "This is a test notification!");
  }
  getPstyleForPreview() {
    return localStorage.getItem(this.pstyleTmpKey) ?? "";
  }
  getPstyleToUse() {
    if (this.getPstyleForPreview()) {
      return this.getPstyleForPreview();
    } else {
      return this.getPstyleFromStorage();
    }
  }
  isPstylePreviewSameAsSaved() {
    return !!this.getPstyleForPreview() && this.getPstyleForPreview() !== this.getPstyleFromStorage();
  }
  getPstyleFromStorage() {
    return getSettingsValue(this.pstyleSettingName);
  }
}
var settings = _Activity.instance.Settings = new SettingsPage();
class Sortable {
  constructor(_0x1a9831, _0x39f8ca, _0x4a55de, _0x4ddaa9, _0x288568) {
    this._container = _0x1a9831;
    this._clickItem = null;
    this._dragItem = null;
    this._hovItem = null;
    this._sortLists = [];
    this._click = {};
    this._isTouch = !1;
    this._dragging = !1;
    this._onSwap = _0x39f8ca;
    this._onReleaseUp = _0x4a55de;
    this.serialized = "";
    this._timer;
    this._touchduration = 500;
    this._container.setAttribute("data-is-sortable", 1);
    this._container.style.position = "static";
    this.editBtn = _0x4ddaa9;
    this.deleteBtn = _0x288568;
    window.addEventListener("mousedown", this._onPress.bind(this), !0);
    window.addEventListener("mouseup", this._onRelease.bind(this), !0);
    window.addEventListener("mousemove", this._onMove.bind(this), !0);
    window.addEventListener("touchstart", this._onPressTouch.bind(this), !1);
    window.addEventListener("touchmove", this._onMove.bind(this), !1);
    window.addEventListener("touchend", this._onRelease.bind(this), !1);
  }
  getPoint(_0x334fad) {
    let _0x132bfd = null;
    let _0x26dd56 = null;
    const _0xefe032 = Math.max(0, window.pageXOffset || document.documentElement.scrollLeft || document.body.scrollLeft || 0) - (document.documentElement.clientLeft || 0);
    const _0x57c043 = Math.max(0, window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0) - (document.documentElement.clientTop || 0);
    if (this._isTouch) {
      const _0x9cf281 = _0x334fad !== undefined && _0x334fad.targetTouches !== undefined ? _0x334fad.targetTouches[0] : {};
      _0x132bfd = _0x9cf281 ? Math.max(0, _0x9cf281.pageX || _0x9cf281.clientX || 0) - _0xefe032 : 0;
      _0x26dd56 = _0x9cf281 ? Math.max(0, _0x9cf281.pageY || _0x9cf281.clientY || 0) - _0x57c043 : 0;
    } else {
      _0x132bfd = _0x334fad ? Math.max(0, _0x334fad.pageX || _0x334fad.clientX || 0) - _0xefe032 : 0;
      _0x26dd56 = _0x334fad ? Math.max(0, _0x334fad.pageY || _0x334fad.clientY || 0) - _0x57c043 : 0;
    }
    const _0x1bab56 = {
      x: _0x132bfd,
      y: _0x26dd56
    };
    return _0x1bab56;
  }
  toArray(_0x35c7f4) {
    _0x35c7f4 = _0x35c7f4 ?? "id";
    const _0x26267e = [];
    let _0x4254f2 = null;
    let _0x2a3415 = "";
    for (let _0x2f8e3f = 0; _0x2f8e3f < this._container.children.length; ++_0x2f8e3f) {
      _0x4254f2 = this._container.children[_0x2f8e3f];
      _0x2a3415 = _0x4254f2.getAttribute(_0x35c7f4) || "";
      _0x26267e.push(_0x2a3415);
    }
    return _0x26267e;
  }
  toString(_0x2fab27, _0x16a017) {
    _0x16a017 = _0x16a017 ?? ":";
    return this.toArray(_0x2fab27).join(_0x16a017);
  }
  _isOnTop(_0x3ecde8, _0x39c1bb, _0x4130b) {
    const _0x184a4d = _0x3ecde8.getBoundingClientRect();
    const _0x3267e2 = _0x39c1bb > _0x184a4d.left && _0x39c1bb < _0x184a4d.left + _0x184a4d.width;
    const _0x4f9bba = _0x4130b > _0x184a4d.top && _0x4130b < _0x184a4d.top + _0x184a4d.height;
    return _0x3267e2 && _0x4f9bba;
  }
  _itemClass(_0x3f053b, _0x1a701b, _0xe1f5b5) {
    const _0x5f2a5b = _0x3f053b.className.split(/\s+/);
    const _0x16ced6 = _0x5f2a5b.indexOf(_0xe1f5b5);
    if (_0x1a701b === "add" && _0x16ced6 == -1) {
      _0x5f2a5b.push(_0xe1f5b5);
      _0x3f053b.className = _0x5f2a5b.join(" ");
    } else if (_0x1a701b === "remove" && _0x16ced6 != -1) {
      _0x5f2a5b.splice(_0x16ced6, 1);
      _0x3f053b.className = _0x5f2a5b.join(" ");
    }
  }
  _swapItems(_0x15f09f, _0x303d4d) {
    const _0x2c9cc5 = _0x15f09f.parentNode;
    const _0x4f43ff = _0x303d4d.parentNode;
    if (_0x2c9cc5 !== _0x4f43ff) {
      _0x4f43ff.insertBefore(_0x15f09f, _0x303d4d);
    } else {
      const _0x38c9d2 = document.createElement("div");
      _0x2c9cc5.insertBefore(_0x38c9d2, _0x15f09f);
      _0x4f43ff.insertBefore(_0x15f09f, _0x303d4d);
      _0x2c9cc5.insertBefore(_0x303d4d, _0x38c9d2);
      _0x2c9cc5.removeChild(_0x38c9d2);
    }
  }
  _moveItem(_0x40d80b, _0x39c28a, _0x258538) {
    _0x40d80b.style["-webkit-transform"] = "translateX( " + _0x39c28a + "px ) translateY( " + _0x258538 + "px )";
    _0x40d80b.style["-moz-transform"] = "translateX( " + _0x39c28a + "px ) translateY( " + _0x258538 + "px )";
    _0x40d80b.style["-ms-transform"] = "translateX( " + _0x39c28a + "px ) translateY( " + _0x258538 + "px )";
    _0x40d80b.style.transform = "translateX( " + _0x39c28a + "px ) translateY( " + _0x258538 + "px )";
  }
  _makeDragItem(_0x426208) {
    this._trashDragItem();
    this._sortLists = document.querySelectorAll("[data-is-sortable]");
    this._clickItem = _0x426208;
    this._itemClass(this._clickItem, "add", "dragActive");
    this._dragItem = document.createElement(_0x426208.tagName);
    this._dragItem.className += this._clickItem.className + " dragging";
    this._dragItem.style.color = this._clickItem.style.color;
    this._dragItem.style.backgroundColor = this._clickItem.style.backgroundColor;
    this._dragItem.innerHTML = _0x426208.innerHTML;
    this._dragItem.style.position = "absolute";
    this._dragItem.style["z-index"] = "999";
    this._dragItem.style.left = (_0x426208.offsetLeft || 0) + "px";
    this._dragItem.style.top = (_0x426208.offsetTop || 0) + "px";
    this._container.appendChild(this._dragItem);
  }
  _trashDragItem() {
    if (this._dragItem && this._clickItem) {
      this._itemClass(this._clickItem, "remove", "dragActive");
      this._itemClass(this._clickItem, "remove", "dragRemove");
      this._clickItem = null;
      this._dragItem.remove();
      this._dragItem = null;
      this.editBtn.parentNode.classList.add("hidden");
    }
  }
  _onPress(_0x502a70) {
    if (_0x502a70?.target?.parentNode === this._container) {
      _0x502a70.preventDefault();
      this._dragging = true;
      this._isTouch = false;
      this._click = this.getPoint(_0x502a70);
      this._makeDragItem(_0x502a70.target);
      this._onMove(_0x502a70);
    }
  }
  _onPressTouch(_0x6fb408) {
    if (_0x6fb408?.target?.parentNode === this._container) {
      this._timer ||= setTimeout(() => {
        this._imer = null;
        this._dragging = true;
        this._isTouch = true;
        this._click = this.getPoint(_0x6fb408);
        this._makeDragItem(_0x6fb408.targetTouches[0].target);
        this._onMove(_0x6fb408);
        _0x6fb408.preventDefault();
      }, this._touchduration);
    }
  }
  _onRelease(_0x1d0134) {
    if (this._dragging) {
      this._dragging = false;
      this._onReleaseUp(this._clickItem);
      this._trashDragItem();
      if (this.serialized.length) {
        if (this.serialized != this.toString()) {
          this.serialized = this.toString();
          if (this._onSwap) {
            this._onSwap(this.serialized);
          }
        }
      } else {
        this.serialized = this.toString();
      }
      if (this._timer) {
        clearTimeout(this._timer);
        this._timer = null;
      }
    }
  }
  _onMove(_0x3fd181) {
    if (this._timer) {
      clearTimeout(this._timer);
      this._timer = null;
    }
    if (this._dragItem && this._dragging) {
      const _0x3c19b7 = this.getPoint(_0x3fd181);
      let _0x456e8b = this._container;
      this.editBtn.parentNode.classList.remove("hidden");
      this._moveItem(this._dragItem, _0x3c19b7.x - this._click.x, _0x3c19b7.y - this._click.y);
      for (let _0x176fee = 0; _0x176fee < this._sortLists.length; ++_0x176fee) {
        const _0x302254 = this._sortLists[_0x176fee];
        if (this._isOnTop(_0x302254, _0x3c19b7.x, _0x3c19b7.y)) {
          _0x456e8b = _0x302254;
        }
      }
      if (this._isOnTop(_0x456e8b, _0x3c19b7.x, _0x3c19b7.y) && _0x456e8b.children.length === 0) {
        _0x456e8b.appendChild(this._clickItem);
        return;
      }
      for (let _0x149673 = 0; _0x149673 < _0x456e8b.children.length; ++_0x149673) {
        let _0x134436 = _0x456e8b.children[_0x149673];
        if (_0x134436 !== this._clickItem && _0x134436 !== this._dragItem) {
          if (this._isOnTop(_0x134436, _0x3c19b7.x, _0x3c19b7.y)) {
            this._hovItem = _0x134436;
            if (this._onSwap) {
              this._swapItems(this._clickItem, _0x134436);
            }
          }
        }
      }
      if (this._isOnTop(this.deleteBtn, _0x3c19b7.x, _0x3c19b7.y)) {
        this._clickItem.classList.add("deleteActive");
        this.deleteBtn.classList.add("active");
        this._clickItem.classList.remove("editActive");
        this.editBtn.classList.remove("active");
      } else if (this._isOnTop(this.editBtn, _0x3c19b7.x, _0x3c19b7.y)) {
        this._clickItem.classList.add("editActive");
        this.editBtn.classList.add("active");
        this._clickItem.classList.remove("deleteActive");
        this.deleteBtn.classList.remove("active");
      } else {
        this.editBtn.classList.remove("active");
        this.deleteBtn.classList.remove("active");
        this._clickItem.classList.remove("editActive");
        this._clickItem.classList.remove("deleteActive");
      }
    }
  }
}
if (hasDarkMode()) {
  document.querySelector(".wrapper").classList.add("darkWrapper");
}