var Module;
var ReleaseMode = 0;
const kTickeTab = "10";
class Activity {
  constructor() {
    if (Activity.instance) {
      return Activity.instance;
    }
    const _0x12a3ff = {
      name: "box",
      origin: "https://xath.hu",
      debugLogIgnore: [],
      debugNoLogs: !0
    };
    Activity.instance = this;
    this.instance = this;
    this.MyId;
    this.MyObj;
    this.SavedId;
    this.CurrentPage;
    this.PagesLoaded;
    this.LastActionHero;
    this.LastCommand;
    this.IsAway = !1;
    this.UserSettings = {};
    this.CommandsQueue = [];
    this.cStyle = {};
    this.IsFlixActive = !1;
    this.IsFlixVisible = !1;
    this.FlixChatId = -1;
    this.FlixBackground;
    this.pawnHueData = [];
    this.pawnHuePreviewCode = "";
    this.WebSocket;
    this.ConnectIp;
    this.ConnectPort;
    this.IsSockOpen;
    this.ConsoleOff;
    this.AppFrameLoaded;
    this.OfflinePushToken;
    this.Radio;
    this.Sound = 5;
    this.Volume = [35, 35, 35, 100];
    this.Device = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    this.IsWeb = !0;
    this.IsClassic = !0;
    this.IsLandscape;
    this.IsNarrow;
    this.IsAndroidApp;
    this.IsIOSApp;
    this.IsMobileApp;
    this.LoginBodge;
    this.gConfig;
    this.GroupName;
    this.CurrentChat;
    this.CurrentChatC;
    this.LangFiles = {};
    this.CustomGroupLang;
    this.Notify;
    this.FIFO = [];
    this.LocalNotify;
    this.TickFPS = 10;
    this.TickQueue = [];
    this.PSSA;
    this.TOPSH;
    this.SUPERPOWERS;
    this.SOTH;
    this.SYEL;
    this.UCOLLECTIONS;
    this.EFFECTS;
    this.FRAMES;
    this.ACES;
    this.Smilies;
    this.Avatars;
    this.Selector;
    this.Settings;
    this.Quickbar;
    this.AdBanner;
    this.Window = window;
    this.Parent = parent;
    this.clickedTickleTab = !1;
    this.Reactions = [];
    this.xConsts = {};
    this.xConfig = _0x12a3ff;
    this.LOADURL = 1;
    this.SEND = 2;
    this.CLOSE = 3;
    this.CONNECT = 4;
    this.NOTIFY = 5;
    this.ALERT = 6;
    this.HTTP = 7;
    this.LANGS = 8;
    this.FINISHTRANSACTION = 9;
    this.LOG = 10;
    this.SAVESOL = 11;
    this.LOADSOL = 12;
    this.DEBUG = 13;
    this.PERMISSIONS = {
      denied: "denied",
      granted: "granted",
      prompt: "prompt"
    };
    this.TRIGGERED_PERMISSIONS = [this.PERMISSIONS.prompt];
    this.voteURLs = {
      get: null,
      post: null
    };
    console.log = function (_0xfdef14, _0xbd7475, _0x4f8186) {
      return function () {
        this.xConfig.debugNoLogs;
      }.bind(this);
    }.bind(this)(console.log.bind(console), this.xConfig.name, this.xConfig.debugLogIgnore);
    this.returnPermissionForStorageAccess().then(_0x3daf15 => {
      if (_0x3daf15 === this.PERMISSIONS.granted) {
        return this.requestStorageAccessApi();
      }
    });
    this.InitLocalNotify();
    this.initFocusChange();
    this.clearLiveStats();
    Module = {
      preRun: [],
      postRun: [this.StartChat.bind(this)],
      print: function (_0x4efc42) {
        if (arguments.length > 1) {
          _0x4efc42 = Array.prototype.slice.call(arguments).join(" ");
        }
        _0x4efc42 = String(_0x4efc42).replace(/\/n/g, "\n");
      },
      printErr: function (_0x10c238) {
        if (arguments.length > 1) {
          _0x10c238 = Array.prototype.slice.call(arguments).join(" ");
        }
        console.error("!printErr=" + _0x10c238);
      },
      canvas: [],
      setStatus: function (_0x24a28d) {
        if (arguments.length > 1) {
          _0x24a28d = Array.prototype.slice.call(arguments).join(" ");
        }
      },
      totalDependencies: 0,
      monitorRunDependencies: function (_0x44bf09) {
        this.totalDependencies = Math.max(this.totalDependencies, _0x44bf09);
        this.setStatus(_0x44bf09 ? "Preparing... (" + (this.totalDependencies - _0x44bf09) + "/" + this.totalDependencies + ")" : "All downloads complete.");
      }
    };
    window.onerror = () => {
      Module.setStatus("Exception thrown, see JavaScript console");
      Module.setStatus = _0x585491 => {
        if (_0x585491) {
          Module.printErr("[post-exception status] " + _0x585491);
        }
      };
    };
    window.onbeforeunload = () => {
      this.CloseSock();
      this.clearLiveStats();
    };
    this.LoadModules();
    this.ConnectToC();
    document.addEventListener("click", this.ClickOnDom.bind(this), !0);
    document.getElementById("moreMenu").addEventListener("click", this.onMore.bind(this));
    window.addEventListener("orientationchange", _0x2e84d3 => {
      const _0x52b762 = _0x2e84d3.target.screen.orientation ? _0x2e84d3.target.screen.orientation.angle : window.orientation;
      this.SendStuff(_0x52b762);
      this.SendC("xatCommand", "", JSON.stringify({
        Command: "Refresh"
      }));
    });
  }
  Init() {
    if (this.Parent && !this.Parent.deferredPrompt) {
      this.Parent.sendStuff = this.SendStuff;
    }
    this.SendStuff();
    const _0x4c13b7 = this.SendC("xatInit", "", "");
    if (_0x4c13b7 == -999) {
      return;
    }
    this.MyId = _0x4c13b7;
    this.UserSettings = JSON.parse(localStorage.getItem("Settings")) ?? {};
    if (this.IsClassic) {
      this.SetPage("classic");
    } else if (this.GroupName) {
      this.SetPage("messages");
    } else if (_0x4c13b7 == 0) {
      this.SetPage("groups");
    } else {
      this.SetPage("chats");
    }
    this.SendC("xatMain", "", "");
    this.SendC("leaveBackground", "", this.GroupName);
    this.ConsoleOff = this.SendC("ConsoleOff", "", "") > 0;
    this.SendC("SetPhoneFontSize", "", "1.0");
    this.SendC("setLang", "", window.navigator.userLanguage || window.navigator.language);
    this.Smilies = new Smilies();
    this.Avatars = new Avatars();
    this.Smilies.Animation = this.Avatars.Animation = this.UserSettings.animation != "disable";
    this.AdBanner = this.Parent.document.getElementById("promoframe");
    if (!this.IsClassic) {
      const _0x4c40c4 = ["home", "profile", "friends", "chats", "groups", "settings", "store", "buy", "help", "visitors", "classic", "logout", "login", "install"];
      for (let _0x44ba11 in _0x4c40c4) {
        const _0x586a66 = document.getElementById("sp_" + _0x4c40c4[_0x44ba11]);
        if (_0x586a66) {
          _0x586a66.menuItem = _0x4c40c4[_0x44ba11];
          _0x586a66.addEventListener("click", _0x7d8004 => this.SetPageFromMenuItem(_0x7d8004.currentTarget.menuItem));
        }
      }
      addClass("d-none", "sp_classic");
      if (this.IsIOSApp) {
        addClass("d-none", "sp_buy");
      }
      setDNone(this.CanInstallPWA(), "sp_install");
    }
    GetXconsts(this.IsClassic ? "messages" : "parent");
    this.SendC("xatCommand", "", JSON.stringify({
      Command: "EnableTick"
    }));
    const _0x10b897 = this.SendC("getStuff", "", "");
    if (_0x10b897 != -999) {
      this.GetStuff(_0x10b897);
    }
    window.addEventListener("message", this.OnMessage.bind(this), !1);
    window.setInterval(this.Tick.bind(this), 1000 / this.TickFPS);
  }
  Tick() {
    if (this.PagesLoaded) {
      let _0x401a59 = this.SendC("xatTick", "", "");
      if (_0x401a59 != -999) {
        while (_0x401a59) {
          this.GotJsonFromC(_0x401a59);
          _0x401a59 = this.SendC("ReadToJavaFifo", "", "");
        }
      }
      if (this.OfflinePushToken) {
        this.SendC("setToken", "", this.OfflinePushToken);
        this.OfflinePushToken = "";
      }
      this.TickQueue.forEach(_0x80da9 => _0x80da9());
      this.ProcessCommand(this.CommandsQueue.shift());
    } else {
      this.PagesLoaded = this.IsClassic;
      let _0x483476 = 0;
      const _0x598792 = ["actions", "settings", "selector"];
      if (!this.PagesLoaded) {
        _0x598792.forEach(_0x3416e7 => {
          const _0x529a04 = document.getElementById(_0x3416e7 + "Frame");
          if (_0x529a04 && _0x529a04.contentWindow[_0x3416e7]) {
            _0x483476++;
          }
        });
      }
      if (this.PagesLoaded || _0x483476 == _0x598792.length) {
        this.PagesLoaded = true;
        this.SendC("xatCommand", "", JSON.stringify({
          Command: "EnableTick"
        }));
        if (!this.IsClassic && !this.MyId && !this.GroupName && (!!this.IsIOSApp || !!this.IsAndroidApp)) {
          this.Selector.DoLoginEtc("SignUp");
        }
      }
    }
  }
  IsConnected() {
    return this?.WebSocket?.readyState == 1;
  }
  StartChat() {
    if (this.Parent) {
      this.GroupName = this.GetParameterByName("gn", this.Parent.location.href);
      if (!this.GroupName) {
        this.GroupName = this.GetParameterByName("id", this.Parent.location.href);
        this.GroupName &&= "xat" + this.GroupName;
      }
    }
    this.GroupName ||= this.GetParameterByName("n");
    if (this.GroupName) {
      this.GroupName = this.GroupName.replace(/[^0-9a-zA-Z_]/g, "");
    } else {
      this.GroupName = "";
    }
    let _0x3a36f9 = this.Parent.location.href;
    if (!_0x3a36f9.includes("app=")) {
      _0x3a36f9 += "&" + document.location.href;
    }
    const _0x1d8f15 = this.GetParameterByName("app", _0x3a36f9);
    if (_0x1d8f15 && _0x1d8f15 !== "0") {
      this.IsClassic = !1;
      if (_0x1d8f15 != "1") {
        this.IsMobileApp = true;
      }
      switch (_0x1d8f15) {
        case "2":
          this.IsIOSApp = !0;
          this.IsWeb = !1;
          this.IsAndroidApp = !1;
          this.IsDevice = !0;
          break;
        case "3":
          this.IsAndroidApp = !0;
          this.IsWeb = !1;
          this.IsIOSApp = !1;
          this.IsDevice = !0;
      }
    }
    if (this.IsClassic) {
      this.SetClassicMode(true);
    } else {
      document.getElementById("actionbar").style.display = "block";
      document.getElementById("Overlays").innerHTML = "<div class=\"table\" style=\"height:100%; width:100%;background-color:#F9F9F9;\">\n                        <div class=\"row\" style=\"height:100%; width:100%\">\n                            <div class=\"cell\" style=\"height:100%; width:100%\">\n                            <iframe class=\"d-none\" width=\"100%\" height=\"100%\" id=\"selectorFrame\" align=\"top\" frameborder=\"0\"\n                                src=\"www/selector.html\"></iframe>\n                            <iframe class=\"d-none\" width=\"100%\" height=\"100%\" id=\"actionsFrame\" align=\"top\" frameborder=\"0\"\n                                src=\"www/actions.html\"></iframe>\n                            <iframe class=\"d-none\" width=\"100%\" height=\"100%\" id=\"settingsFrame\" align=\"top\" frameborder=\"0\"\n                                src=\"www/settings.html\"></iframe>\n                            </div>\n                        </div>\n                    </div>";
    }
    if (this.Notify.compatible()) {
      this.Notify.authorize();
    }
    this.Init();
  }
  GetParameterByName(_0x28ba6e, _0x338d53) {
    const _0x23a8ca = window.location.search.length ? window.location.search : window.location.href;
    const _0x7c2514 = _0x338d53 || _0x23a8ca;
    const _0x431f11 = _0x7c2514.includes("?") ? _0x7c2514.split("?")[1].split("#")[0] : "";
    const _0x239177 = _0x7c2514.includes("#") ? _0x7c2514.split("#")[1] : "";
    const _0x5045c5 = _0x239177.startsWith("!") ? _0x239177.slice(1) : _0x239177;
    return new URLSearchParams(_0x431f11 + "&" + _0x5045c5).get(_0x28ba6e);
  }
  CanInstallPWA() {
    return !!this.Parent?.deferredPrompt || !!/iphone|ipad|ipod/.test(window.navigator.userAgent.toLowerCase()) && !window.navigator?.standalone;
  }
  SendStuff(_0x50ce74 = -1) {
    let _0x383d2b = {};
    let _0x286561 = 0;
    this.IsLandscape = window.innerHeight <= window.innerWidth;
    switch (_0x50ce74) {
      case 0:
      case 180:
        this.IsLandscape = !1;
        break;
      case 90:
      case 270:
        this.IsLandscape = !0;
    }
    this.IsNarrow = window.innerWidth < 200;
    if (this.IsDevice) {
      _0x286561 |= 1;
    }
    if (this.IsWeb) {
      _0x286561 |= 2;
    }
    if (this.IsClassic) {
      _0x286561 |= 4;
    }
    if (this.IsLandscape) {
      _0x286561 |= 8;
    }
    if (this.IsNarrow) {
      _0x286561 |= 16;
    }
    if (this.IsAndroidApp) {
      _0x286561 |= 32;
    }
    if (this.IsIOSApp) {
      _0x286561 |= 64;
    }
    if (this.IsMobileApp) {
      _0x286561 |= 256;
    }
    if (this.Parent?.isPWA) {
      _0x286561 |= 128;
    }
    _0x383d2b.Flags = _0x286561;
    _0x383d2b.origin = this.xConfig.origin;
    if (_0x50ce74 >= 0) {
      _0x383d2b.Rotation = _0x50ce74;
    }
    this.SendC("sendStuff", JSON.stringify(_0x383d2b), "");
  }
  SetPage(_0x393daf) {
    let _0x3a78e5 = !1;
    if (!_0x393daf || _0x393daf == "home") {
      return;
    }
    if (_0x393daf == "pop" && this.CurrentPage == "classic") {
      _0x3a78e5 = true;
      _0x393daf = this.CurrentPage;
    }
    let _0x14099e = this.SendC("SetPage", "", _0x393daf);
    if (_0x14099e != -999) {
      if (!_0x3a78e5 && _0x14099e == this.CurrentPage) {
        return;
      }
      this.CurrentPage = _0x14099e;
      if (this.CurrentPage == "profile") {
        this.CurrentPage = "actions";
      }
      this.SendC("viewWillDisappear", "", "");
      const _0x4ba873 = document.getElementById("appframe");
      if (this.CurrentPage === "captcha") {
        const _0x1a140c = JSON.stringify(this.LastCommand);
        _0x4ba873.src = "/web_gear/chat/AreYouaHuman.php?ts=1&m=3&j=" + _0x1a140c;
        addClass("d-none", "Overlays");
      } else {
        _0x4ba873.onload = _0x1f88a1 => {
          this.AppFrameLoaded = !0;
          this.SendC("webViewDidFinishLoad", "", "");
          this.SendC("xatCommand", "", JSON.stringify({
            Command: "webViewDidFinishLoad"
          }));
          if (!this.IsClassic) {
            _0x4ba873.contentDocument.body.classList.add("isApp");
          }
        };
        _0x4ba873.src = "www/" + this.CurrentPage + ".html";
      }
    }
  }
  SetPageFromMenuItem(_0x2b9602) {
    switch (_0x2b9602) {
      case "buy":
        openBuyPage(true, document.getElementById("appframe").contentWindow);
        return;
      case "classic":
        if (!this.IsAndroidApp && !this.IsIOSApp) {
          this.SendC("xatCommand", "", JSON.stringify({
            Command: "GoWebChat"
          }));
          return;
        }
        this.SetClassicMode(!0);
        document.getElementById("appframe").src = "www/classic.html";
        this.SetPage(_0x2b9602);
        return;
      case "profile":
        classicSetDialog("actions", 0);
        return;
      case "settings":
        classicSetDialog("settings", 0);
        return;
      case "logout":
        this.Selector.DoLoginEtc("LogoutOK");
        return;
      case "login":
        this.Selector.DoLoginEtc("LoginForm");
        return;
      case "install":
        this.Parent?.PWAinstall();
        return;
    }
    setFrameVis();
    this.SetPage(_0x2b9602);
  }
  GetStuff(_0x2e079a) {
    LangFiles = this.LangFiles;
    Language = JSON.parse(_0x2e079a).lang;
    LoadLangAll();
  }
  QueueCommand(_0x95e0d2) {
    if (_0x95e0d2) {
      this.CommandsQueue.push(_0x95e0d2);
    }
  }
  ProcessCommand(_0xbcd0a4) {
    if (typeof _0xbcd0a4 == "string") {
      _0xbcd0a4 = decodeURIComponent((_0xbcd0a4 + "").replace(/\+/g, "%20"));
      _0xbcd0a4 = JSON.parse(_0xbcd0a4);
    }
    if (!_0xbcd0a4) {
      return;
    }
    this.LastCommand = _0xbcd0a4;
    if (this.LastCommand.Type == "xtrace") {
      return;
    }
    let _0x5d2d63 = this.LastCommand["this.LastActionHero"] ?? "";
    let _0x4a5c35 = this.LastCommand.SavedId ?? "";
    if (this.LastActionHero != _0x5d2d63 || this.SavedId != _0x4a5c35) {
      this.SavedId = _0x4a5c35;
      this.LastActionHero = _0x5d2d63;
      this.SendC("LastActionHero", this.LastActionHero, this.SavedId);
    }
    const _0x114383 = this.LastCommand.Next;
    this.SendC("xatCommand", "", JSON.stringify(this.LastCommand));
    if (!this.IsClassic || _0x114383 == "captcha" || _0x114383 == "pop") {
      if (_0x114383 == "actions" && _0xbcd0a4.UserNo) {
        classicSetDialog(_0x114383, _0xbcd0a4.UserNo);
      } else {
        this.SetPage(_0x114383);
      }
    }
  }
  Base64ArrayBuffer(_0x150d43) {
    const _0x1ed54b = new Uint8Array(_0x150d43);
    const _0x4c1860 = _0x1ed54b.byteLength;
    const _0x361a1f = _0x4c1860 % 3;
    const _0xa06074 = _0x4c1860 - _0x361a1f;
    const _0x1a71ed = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
    let _0x9847c5;
    let _0x1a7fe6;
    let _0x52a0ee;
    let _0x4489f7;
    let _0x45cb89;
    let _0x2926ee = "";
    for (let _0x4ad102 = 0; _0x4ad102 < _0xa06074; _0x4ad102 += 3) {
      _0x9847c5 = _0x1ed54b[_0x4ad102] << 16 | _0x1ed54b[_0x4ad102 + 1] << 8 | _0x1ed54b[_0x4ad102 + 2];
      _0x1a7fe6 = (_0x9847c5 & 16515072) >> 18;
      _0x52a0ee = (_0x9847c5 & 258048) >> 12;
      _0x4489f7 = (_0x9847c5 & 4032) >> 6;
      _0x45cb89 = _0x9847c5 & 63;
      _0x2926ee += _0x1a71ed[_0x1a7fe6] + _0x1a71ed[_0x52a0ee] + _0x1a71ed[_0x4489f7] + _0x1a71ed[_0x45cb89];
    }
    if (_0x361a1f == 1) {
      _0x9847c5 = _0x1ed54b[_0xa06074];
      _0x1a7fe6 = (_0x9847c5 & 252) >> 2;
      _0x52a0ee = (_0x9847c5 & 3) << 4;
      _0x2926ee += _0x1a71ed[_0x1a7fe6] + _0x1a71ed[_0x52a0ee] + "==";
    } else if (_0x361a1f == 2) {
      _0x9847c5 = _0x1ed54b[_0xa06074] << 8 | _0x1ed54b[_0xa06074 + 1];
      _0x1a7fe6 = (_0x9847c5 & 64512) >> 10;
      _0x52a0ee = (_0x9847c5 & 1008) >> 4;
      _0x4489f7 = (_0x9847c5 & 15) << 2;
      _0x2926ee += _0x1a71ed[_0x1a7fe6] + _0x1a71ed[_0x52a0ee] + _0x1a71ed[_0x4489f7] + "=";
    }
    return _0x2926ee;
  }
  ToUTF8ArrayBuf(_0x37ab3f) {
    const _0x597f61 = [];
    for (let _0x2299d7 = 0; _0x2299d7 < _0x37ab3f.length; _0x2299d7++) {
      let _0x5809ce = _0x37ab3f.charCodeAt(_0x2299d7);
      if (_0x5809ce < 128) {
        _0x597f61.push(_0x5809ce);
      } else if (_0x5809ce < 2048) {
        _0x597f61.push(_0x5809ce >> 6 | 192, _0x5809ce & 63 | 128);
      } else if (_0x5809ce < 55296 || _0x5809ce >= 57344) {
        _0x597f61.push(_0x5809ce >> 12 | 224, _0x5809ce >> 6 & 63 | 128, _0x5809ce & 63 | 128);
      } else {
        _0x2299d7++;
        _0x5809ce = 65536 + ((_0x5809ce & 1023) << 10 | _0x37ab3f.charCodeAt(_0x2299d7) & 1023);
        _0x597f61.push(_0x5809ce >> 18 | 240, _0x5809ce >> 12 & 63 | 128, _0x5809ce >> 6 & 63 | 128, _0x5809ce & 63 | 128);
      }
    }
    const _0x25c998 = _0x597f61.length;
    const _0x193aee = new ArrayBuffer(_0x25c998);
    const _0x18c0ee = new Uint8Array(_0x193aee);
    for (let _0x2d7697 = 0; _0x2d7697 < _0x25c998; _0x2d7697++) {
      _0x18c0ee[_0x2d7697] = _0x597f61[_0x2d7697];
    }
    return _0x193aee;
  }
  SendSock(_0x5dd700) {
    if (this.WebSocket) {
      const _0x175888 = this.ToUTF8ArrayBuf(_0x5dd700);
      this.WebSocket.send(_0x175888);
    }
  }
  CloseSock() {
    this.IsSockOpen = !1;
    this.clickedTickleTab = !1;
    if (this.WebSocket) {
      this.SendSock("<C />");
      this.WebSocket.close();
      this.WebSocket = null;
      this.CustomGroupLang = null;
    }
  }
  PlayRadio(_0x8ab3cd) {
    if (this.Radio) {
      this.Radio.unload();
      this.Radio = null;
    }
    if (_0x8ab3cd && this.Volume[1] != 0 && (this.Sound & 2) != 0) {
      this.Radio = new Howl({
        src: [_0x8ab3cd],
        html5: true,
        volume: this.Volume[1] / 100
      });
      this.Radio.play();
    }
  }
  DoFifoNotification(_0x3efd67) {
    let _0x7a0d9b;
    const _0x4350d1 = JSON.parse(_0x3efd67);
    const _0x5d5772 = document.getElementById("appframe").contentWindow;
    for (let _0x178b27 = 0; _0x178b27 < _0x4350d1.length; _0x178b27++) {
      if (_0x4350d1[_0x178b27].charAt(0) == "{") {
        _0x7a0d9b = JSON.parse(_0x4350d1[_0x178b27]);
        switch (_0x7a0d9b.Command) {
          case "CustLang":
            this.CustomGroupLang = _0x7a0d9b;
            GotLang({
              box: 0
            });
            break;
          case "SendSound":
            this.Volume = [this.xInt(_0x7a0d9b[1]), this.xInt(_0x7a0d9b[2]), this.xInt(_0x7a0d9b[3]), this.xInt(_0x7a0d9b[4])];
            this.Sound = this.xInt(_0x7a0d9b.w_sound);
            if (_0x5d5772.SetSpkIcon) {
              _0x5d5772.SetSpkIcon(this.Sound, _0x7a0d9b.HasRadio);
            }
            break;
          case "PlayRadio":
            if (!this.IsClassic) {
              break;
            }
            this.PlayRadio(_0x7a0d9b.Radio);
            break;
          case "PlaySound":
            if (_0x7a0d9b.isGoodfriend < 1 && (this.Volume[0] == 0 || (this.Sound & 1) == 0)) {
              break;
            }
            const _0x3ad066 = "https://xath.hu/content/sounds/" + _0x7a0d9b.Sound;
            try {
              new Howl({
                src: [_0x3ad066 + ".webm", _0x3ad066 + ".mp3"],
                volume: this.Volume[0] / 100
              }).play();
            } catch (_0x21dbb7) {}
            break;
          case "ToSideapp":
            this.Parent?.postMessage(JSON.stringify(_0x7a0d9b), this.xConfig.origin);
            if (_0x7a0d9b.channel == 30012) {
              try {
                if (JSON.parse(_0x7a0d9b.msg).t.startsWith("DC_")) {
                  try {
                    localStorage.setItem("xatLive.isEnding", "true");
                    localStorage.removeItem("xatLive.isRunning");
                    localStorage.removeItem("xatLive.pendingCall");
                    localStorage.removeItem("xatLive.data");
                  } catch (_0x32d08a) {}
                }
              } catch {}
            }
            break;
          case "setCount":
            let _0x2f284c = _0x7a0d9b.setCount;
            const _0x446bcd = document.getElementById("idactcount");
            if (_0x2f284c > 0) {
              if (_0x2f284c > 9) {
                _0x2f284c = "9+";
              }
              _0x446bcd.innerText = _0x2f284c;
              _0x446bcd.style.visibility = "visible";
            } else {
              _0x446bcd.style.visibility = "hidden";
            }
            break;
          case "LocalNotify":
            if (!this.LocalNotify) {
              break;
            }
            if (!document[this.hidden]) {
              break;
            }
            this.Notify.show(_0x7a0d9b.n, _0x7a0d9b.t);
        }
      } else {
        try {
          _0x5d5772.eval(_0x4350d1[_0x178b27].toString());
        } catch (_0x14d67a) {}
      }
    }
  }
  DoNotify(_0x1f22ec, _0x55ca94) {
    switch (_0x1f22ec) {
      case "FifoNotification":
        if (!this.AppFrameLoaded) {
          this.FIFO.unshift(_0x55ca94);
          return;
        }
        while (this.FIFO.length) {
          this.DoFifoNotification(this.FIFO.pop());
        }
        this.DoFifoNotification(_0x55ca94);
        return;
      case "SetURL":
        if (!this.IsAndroidApp && !this.IsIOSApp) {
          let _0x55f1b3 = JSON.parse(_0x55ca94);
          if (_0x55f1b3 && _0x55f1b3[0].indexOf(this.xConfig.origin) >= 0) {
            _0x55f1b3[0] += "?classic=1";
          }
          window.open(_0x55f1b3[0], "_self");
        }
        return;
      case "SetGroupsPage":
        this.SetPage("groups");
        return;
      case "SetChatsPage":
        this.SetPage("chats");
        return;
      case "SetMePage":
        this.SetPage("profile");
        return;
      case "SetBackPage":
        this.SetPage("pop");
        return;
      case "SetVisitors":
        document.getElementById("appframe").contentWindow.openList(0, "visitors", 0);
        return;
    }
  }
  ProcessDataFromC(_0x10ce8b, _0x1aed79, _0x463f0b) {
    console.log(".FromC", _0x463f0b);
    switch (this.xInt(_0x10ce8b)) {
      case this.DEBUG:
        break;
      case this.SAVESOL:
        if (typeof Storage == "undefined") {
          break;
        }
        if (this.IsClassic || !this.IsClassic && localStorage.getItem("mobCookies") == 1) {
          localStorage.setItem(_0x1aed79, _0x463f0b);
        }
        break;
      case this.LOADSOL:
        if (typeof Storage == "undefined") {
          break;
        }
        if (this.IsClassic || !this.IsClassic && localStorage.getItem("mobCcookies") == 1) {
          localStorage.getItem(_0x1aed79);
          localStorage.setItem(_0x1aed79, _0x463f0b);
        }
        break;
      case this.LOG:
        break;
      case this.LOADURL:
        const _0x2abf07 = new XMLHttpRequest();
        const _0x3de449 = _0x1aed79;
        _0x2abf07.onreadystatechange = () => {
          if (_0x2abf07.readyState === 4) {
            if (_0x2abf07.status === 200) {
              this.SendC("xatURL", _0x2abf07.responseURL, _0x2abf07.responseText);
            } else {
              console.log("LOADURL Err:" + _0x2abf07.status);
            }
          }
        };
        if (_0x463f0b) {
          _0x2abf07.open("POST", _0x3de449, !0);
          _0x2abf07.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
          let _0x1a373f = JSON.parse(_0x463f0b);
          _0x463f0b += "&ts=1";
          if (_0x1a373f["g-recaptcha-response"]) {
            _0x463f0b += "&g-recaptcha-response=" + _0x1a373f["g-recaptcha-response"];
          }
          _0x2abf07.send("json=" + _0x463f0b);
        } else {
          _0x2abf07.open("GET", _0x3de449, !0);
          _0x2abf07.send();
        }
        break;
      case this.SEND:
        this.SendSock(_0x463f0b);
        break;
      case this.CLOSE:
        this.CloseSock();
        break;
      case this.CONNECT:
        _0x1aed79 = "wss://wss.xath.hu";
        _0x463f0b = 443;
        this.ConnectPort = this.xInt(_0x463f0b) + "/v2";
        this.CloseSock();
        this.ConnectIp = _0x1aed79;
        this.WebSocket = new WebSocket(this.ConnectIp + ":" + this.ConnectPort);
        this.WebSocket.binaryType = "arraybuffer";
        this.WebSocket.onopen = _0x3fe4c8 => {
          this.IsSockOpen = !0;
          this.SendC("xatMessageReceived", "#CONNECT_OK", "");
          this.SendC("xatMessageOK", "#CONNECT_CHECK", btoa(window.location.host.replace('xath.hu', 'xat.com')));
        };
        this.WebSocket.onclose = _0xe03a95 => {
          if (_0xe03a95.code != 1000) {
            console.log("WebSocket CLOSE ERROR:" + _0xe03a95.code);
          }
          this.SendC("xatMessageReceived", "#CONNECT_CLOSE", "");
          this.IsSockOpen = !1;
        };
        this.WebSocket.onmessage = _0x1fa40a => {
          this.SendC("xatMessageReceived", "#MESSAGE", this.Base64ArrayBuffer(_0x1fa40a.data));
        };
        this.WebSocket.onerror = _0x5b8a57 => {
          console.log("WebSocket ERROR");
        };
        break;
      case this.NOTIFY:
        this.DoNotify(_0x1aed79, _0x463f0b);
      case this.ALERT:
      case this.HTTP:
      case this.LANGS:
      case this.FINISHTRANSACTION:
    }
  }
  GotJsonFromC(_0x36795f) {
    if (_0x36795f &&= JSON.parse(_0x36795f)) {
      if ((_0x36795f.Type == "1" || _0x36795f.Type == "5" || _0x36795f.Type == "10") && !!this.Settings?.toSave) {
        this.Settings?.doSave();
      }
      this.ProcessDataFromC(_0x36795f.Type, _0x36795f.Cmd, _0x36795f.Data);
    }
  }
  SendC(_0x1b05a4, _0x542854, _0x4f4cee) {
    var _0x507b54 = (_0x1b05a4.length * 2 + 1) * 2;
    var _0x1b8267 = Module._malloc(_0x507b54);
    Module.stringToUTF8(_0x1b05a4, _0x1b8267, _0x507b54);
    var _0x57f479 = (_0x542854.length * 2 + 1) * 2;
    var _0x5238c4 = Module._malloc(_0x57f479);
    Module.stringToUTF8(_0x542854, _0x5238c4, _0x57f479);
    var _0x33de4d = (_0x4f4cee.length * 2 + 1) * 2;
    var _0x2be7c8 = Module._malloc(_0x33de4d);
    Module.stringToUTF8(_0x4f4cee, _0x2be7c8, _0x33de4d);
    var _0x2ef68b = Module.ccall("cToC", null, ["number", "number", "number"], [_0x1b8267, _0x5238c4, _0x2be7c8]);
    var _0x96c9aa = UTF8ToString(_0x2ef68b);
    Module._xFree(_0x2ef68b);
    return _0x96c9aa;
  }
  onMore() {
    const _0x5b2a1a = document.querySelector("#dropdown-content");
    if (_0x5b2a1a) {
      const _0x5c4131 = _0x5b2a1a.style.display == "none" || _0x5b2a1a.style.display == "";
      _0x5b2a1a.style.display = _0x5c4131 ? "block" : "none";
      if (_0x5c4131) {
        if (this.MyId) {
          removeClass("d-none", "sp_logout");
          if (hasMobCookiesEnabled()) {
            removeClass("d-none", "sp_buy");
          } else {
            addClass("d-none", "sp_buy");
          }
          removeClass("d-none", "sp_store");
          addClass("d-none", "sp_login");
        } else {
          addClass("d-none", "sp_logout");
          addClass("d-none", "sp_buy");
          addClass("d-none", "sp_store");
          removeClass("d-none", "sp_login");
        }
        if (this.CurrentChat == "3") {
          addClass("d-none", "sp_visitors");
        } else {
          removeClass("d-none", "sp_visitors");
        }
      }
    }
  }
  ClickOnDom(_0x3613b1) {
    if (_0x3613b1 && _0x3613b1.target.classList.contains("menuOpen")) {
      return;
    }
    const _0x546acd = document.querySelector(".dropdown #dropdown-content");
    if (_0x546acd && _0x546acd.style.display == "block") {
      _0x546acd.style.display = "none";
    }
    const _0x102a59 = findNodeInWindowOrParent("#actionsFrame");
    if (_0x102a59 && _0x102a59.contentWindow && _0x102a59.contentWindow.document) {
      const _0x1a4fe9 = _0x102a59.contentWindow.document.querySelector(".dropdown-content2");
      if (_0x1a4fe9 && _0x1a4fe9.style.display == "block") {
        _0x1a4fe9.style.display = "none";
      }
    }
    this.Quickbar?.shouldCloseQuickBar(_0x3613b1);
  }
  SetClassicMode(_0xc3e68f) {
    if (_0xc3e68f) {
      this.clearDivAct("Overlays");
      var _0x256306 = document.getElementById("actionbar");
      _0x256306.style.height = "0%";
      _0x256306.style.display = "none";
      document.getElementById("app").style.height = "100%";
    }
  }
  OnMessage(_0x234d1a) {
    console.log("OnMessage: ", _0x234d1a);
    if (_0x234d1a.origin !== this.xConfig.origin) {
      console.log("onMessage Bad Origin=", _0x234d1a.origin, _0x234d1a);
      return;
    }
    let _0x497d6d;
    try {
      _0x497d6d = JSON.parse(_0x234d1a.data);
    } catch (_0x4413db) {
      return;
    }
    if (_0x497d6d.action != "sideload") {
      if (_0x497d6d.action != "kissDone" && _0x497d6d.action != "kissClick") {
        if (_0x497d6d.Command != "ToSideapp" && _0x497d6d.action != "kissLoaded") {
          this.SendC("xatCommand", "", JSON.stringify({
            Command: "lcAppToChat",
            channel: _0x497d6d.channel,
            user: _0x497d6d.user,
            msg: _0x497d6d.msg
          }));
        }
      } else {
        this.clearDivAct("kissContainer").style.display = "none";
      }
    } else if (this.Parent) {
      this.Parent.postMessage(_0x234d1a.data, this.xConfig.origin);
    }
  }
  LoadModules() {
    let _0x23f763;
    const _0x171c2e = navigator.userAgent;
    const _0x2fdd61 = ["Chrome", "Edge", "Firefox", "Safari", "OPR", "MSIE", "Trident"];
    for (let _0x301a3b = 0; _0x301a3b < _0x2fdd61.length; _0x301a3b++) {
      if (_0x171c2e.indexOf(_0x2fdd61[_0x301a3b]) > -1) {
        _0x23f763 = _0x2fdd61[_0x301a3b];
        break;
      }
    }
    switch (_0x23f763) {
      case "Chrome":
      case "Firefox":
      case "OPR":
        this.LoadJsModule("www/firebase.js");
    }
    this.LoadJsModule("/content/js/howler.min.js");
  }
  LoadJsModule(_0x5e45be, _0x122b14) {
    return new Promise((_0xb74440, _0x4a2552) => {
      const _0x577cdf = document.createElement("script");
      _0x577cdf.src = _0x5e45be;
      _0x577cdf.async = !0;
      _0x577cdf.onload = _0x1c95ff => _0xb74440();
      _0x577cdf.onerror = _0xe4b04d => {
        const _0x5d4990 = "file not found: " + _0x5e45be;
        if (!_0x122b14) {
          throw _0x5d4990;
        }
        _0x4a2552(_0x5d4990);
      };
      document.head.appendChild(_0x577cdf);
    });
  }
  ConnectToC() {
    if (this.UseWsCore) {
      const _0x48922d = "ws://tst763459.xath.hu:8081";
      this.WsCore = new WebSocket(_0x48922d);
      this.WsCore.onopen = () => {
        console.log("WSCORE: Connection opened");
        this.StartChat();
      };
      this.WsCore.onmessage = _0x23a740 => {
        const _0x499576 = _0x23a740.data.match(/:(.*?):(.*)/);
        switch (_0x499576[1]) {
          case "getUserno":
            break;
          case "xatInit":
            this.MyId = _0x499576[2];
            this.Init();
            break;
          case "getStuff":
            this.GetStuff(_0x499576[2]);
            break;
          case "ConsoleOff":
            this.ConsoleOff = _0x499576[2] == "1";
            break;
          case "SetPage":
            this.SetPage(_0x499576[2]);
            break;
          case "ReadToJavaFifo":
          case "xatTick":
            this.GotJsonFromC(_0x499576[2]);
        }
      };
      this.WsCore.onclose = () => {
        console.log("WSCORE: Connection closed");
      };
    } else if (window.WebAssembly) {
      this.LoadJsModule("xatcorewasm.php", 1).then(_0x13921f => {}, _0x34ecfc => {
        this.LoadJsModule("xatcore.php");
      });
    } else {
      this.LoadJsModule("xatcore.php");
    }
  }
  xInt(_0x338bbf) {
    _0x338bbf = parseInt(_0x338bbf);
    if (isNaN(_0x338bbf)) {
      return 0;
    } else {
      return _0x338bbf;
    }
  }
  InitLocalNotify() {
    const _0x4dc90b = this;
    this.Notify = {
      list: [],
      id: 0,
      compatible: function () {
        return typeof Notification != "undefined" || (console.error("FBM:Notifications are not available for your browser."), !1);
      },
      authorize: function () {
        if (this.compatible()) {
          Notification.requestPermission(function (_0x457fcf) {
            _0x4dc90b.LocalNotify = _0x457fcf == "granted";
          });
        }
      },
      show: function (_0x30a554, _0x4330c2) {
        if (!_0x4dc90b.LocalNotify) {
          return;
        }
        this.id++;
        const _0x12a850 = this.id;
        this.list[_0x12a850] = new Notification(_0x30a554, {
          body: _0x4330c2,
          tag: _0x12a850,
          icon: "https://xath.hu/images/planet.svg",
          lang: "",
          dir: "auto"
        });
        this.logEvent("Notification #" + _0x12a850 + " queued for display");
        this.list[_0x12a850].onclick = () => {
          this.logEvent(_0x12a850, "clicked");
        };
        this.list[_0x12a850].onshow = () => {
          this.logEvent(_0x12a850, "showed");
        };
        this.list[_0x12a850].onerror = () => {
          this.logEvent(_0x12a850, "errored");
        };
        this.list[_0x12a850].onclose = () => {
          this.logEvent(_0x12a850, "closed");
        };
      },
      logEvent: function (_0x35761b, _0x405b15) {}
    };
  }
  initFocusChange() {
    if (document.hidden !== undefined) {
      this.hidden = "hidden";
    } else if (document.msHidden !== undefined) {
      this.hidden = "msHidden";
    } else if (document.webkitHidden !== undefined) {
      this.hidden = "webkitHidden";
    }
  }
  GetInstance() {
    return this.instance;
  }
  setVoteURLFromServerData(_0x4739b0) {
    try {
      const _0x6809d5 = "/json/vote.php?id=" + (_0x4739b0 = JSON.parse(_0x4739b0)).user + "&roomid=" + _0x4739b0.room + "&cb=" + _0x4739b0.cb;
      this.voteURLs.get = _0x6809d5;
      this.voteURLs.post = _0x6809d5 + "&i=" + _0x4739b0.i + "&s=" + _0x4739b0.s + "&t=" + _0x4739b0.t + "&k=" + _0x4739b0.k;
    } catch (_0x3c4d6c) {}
  }
  AreWeOnEmbed() {
    const _0x22c2e9 = document.referrer;
    return /:\/\/nx4t\.in\/embed\/chat(\d*|\.php)/.test(_0x22c2e9);
  }
  async returnPermissionForStorageAccess() {
    if (!this.AreWeOnEmbed() || !this.IsClassic) {
      return !1;
    }
    if (!document.hasStorageAccess) {
      return this.PERMISSIONS.granted;
    }
    if (await document.hasStorageAccess()) {
      return this.PERMISSIONS.granted;
    }
    try {
      return (await navigator.permissions.query({
        name: "storage-access"
      })).state || this.PERMISSIONS.denied;
    } catch (_0x168d06) {
      return !1;
    }
  }
  setNewTodoAndReload() {
    try {
      const _0x267bba = JSON.parse(localStorage.getItem("todo")) ?? {};
      const _0x376dd2 = this.getCookie("sca");
      if (_0x376dd2 && _0x376dd2.includes(",")) {
        const [_0x414e24, _0x5a783e, _0x56f7ac] = _0x376dd2.split(",").filter(Boolean);
        if (!Object.keys(_0x267bba).length || !_0x267bba.w_registered || _0x267bba.DeviceId !== _0x414e24 || _0x267bba.PassHash !== _0x5a783e) {
          _0x267bba.DeviceId = _0x414e24;
          _0x267bba.PassHash = _0x5a783e;
          _0x267bba.w_userno = _0x56f7ac;
          _0x267bba.MobNo = "";
          localStorage.setItem("todo", JSON.stringify(_0x267bba));
        }
      }
    } catch (_0x484905) {
      console.error("An error occurred while setting new todo and reloading:", _0x484905);
    }
  }
  async requestStorageAccessApi() {
    try {
      await document.requestStorageAccess();
      this.setNewTodoAndReload();
    } catch (_0x26e23d) {
      console.log("access denied");
    }
  }
  getCookie(_0x4d01a8) {
    const _0x258849 = _0x4d01a8 + "=";
    const _0xe1b08a = document.cookie.split(";");
    if (!_0xe1b08a.length) {
      return null;
    }
    for (let _0x9ccde7 = 0; _0x9ccde7 < _0xe1b08a.length; _0x9ccde7++) {
      let _0x3c37f1 = _0xe1b08a[_0x9ccde7];
      while (_0x3c37f1.charAt(0) === " ") {
        _0x3c37f1 = _0x3c37f1.substring(1, _0x3c37f1.length);
      }
      if (_0x3c37f1.indexOf(_0x258849) === 0) {
        return _0x3c37f1.substring(_0x258849.length, _0x3c37f1.length);
      }
    }
    return null;
  }
  clearDivAct(_0x4f7938, _0x1e5ad8) {
    if (typeof clearDiv != "function") {
      _0x1e5ad8 ||= document.getElementById(_0x4f7938);
      if (_0x1e5ad8) {
        while (_0x1e5ad8.firstChild) {
          _0x1e5ad8.removeChild(_0x1e5ad8.firstChild);
        }
      }
      return _0x1e5ad8;
    }
    return clearDiv(_0x4f7938, _0x1e5ad8);
  }
  clearLiveStats() {
    localStorage.removeItem("xatLive.isRunning");
    localStorage.removeItem("xatLive.isEnding");
    localStorage.removeItem("xatLive.data");
  }
  setCstyleJson(_0x47672a) {
    _0x47672a ||= "{}";
    this.cStyle = _0x47672a;
  }
  CanUseFlix() {
    return _Activity.instance.UserSettings?.flix !== "disable";
  }
  initFlix(_0x2c3308) {
    if (_0x2c3308.ef === "0" || this.IsFlixActive || !this.IsClassic || !this.CanUseFlix()) {
      return;
    }
    this.FlixChatId = _0x2c3308.cg;
    const _0x2856f8 = _0x2c3308.ef || 0;
    const _0x149343 = _0x2c3308.fl + "_" + _0x2856f8;
    const _0x135d33 = _0x2c3308.bk == null || xInt(_0x2c3308.bk) ? _0x2c3308.fl + "_" + (_0x2c3308.bk || "1") : undefined;
    const _0x232d67 = window.innerWidth + 1;
    const _0x46be28 = window.innerHeight + 1;
    const _0x167803 = xInt(_0x2c3308.XX) || 0;
    const _0x4d626b = xInt(_0x2c3308.YY) || 0;
    const _0x4d678d = xInt(_0x2c3308.SC) || 100;
    const _0x2d9028 = xInt(_0x2c3308.Opt) || 256;
    const _0x580fd1 = xInt(_0x2c3308.Op2) || 0;
    const _0x1f3a07 = xInt(_0x2c3308.PR) || 0;
    const _0x49e7b4 = xInt(_0x2c3308.pw) || 0;
    const _0x4e6c1d = _0x2c3308.SM || undefined;
    const _0x46ba27 = _0x2c3308.col?.split("#");
    let _0x352a9c = [65280, 128];
    for (let _0x469493 in _0x46ba27) {
      _0x352a9c[_0x469493] = Number("0x" + _0x46ba27[_0x469493]);
    }
    const _0x10491f = xInt(_0x2c3308.NUM) || 0;
    const _0x15a971 = xInt(_0x2c3308.GT) || 0;
    const _0x2aeee6 = xInt(_0x2c3308.BA) || 100;
    const _0x44078f = xInt(_0x2c3308.GA) || 100;
    const _0xf17ebb = xInt(_0x2c3308.BT) || 0;
    const _0x207ae0 = document.createElement("script");
    _0x207ae0.src = "./www/flix.js";
    _0x207ae0.async = !1;
    _0x207ae0.onload = _0x1b324e => {
      const _0x4144b6 = {
        WW: _0x232d67,
        HH: _0x46be28,
        XX: _0x167803,
        YY: _0x4d626b,
        SC: _0x4d678d,
        BG: _0x135d33,
        PR: _0x1f3a07,
        PW: _0x49e7b4,
        SM: _0x4e6c1d,
        NUM: _0x10491f,
        GT: _0x15a971,
        Op2: _0x580fd1,
        BA: _0x2aeee6,
        GA: _0x44078f,
        BT: _0xf17ebb
      };
      const _0x985ff4 = {
        Flix: _0x149343,
        Args: _0x4144b6,
        Cols: _0x352a9c,
        Text: ["", ""],
        Opt: _0x2d9028
      };
      FlixStart(_0x985ff4);
    };
    _0x207ae0.onerror = _0x546ebe => {
      const _0x1917ed = "File not found: flix.js";
      if (!doReject) {
        throw _0x1917ed;
      }
      reject(_0x1917ed);
    };
    document.head.appendChild(_0x207ae0);
  }
  SetFlixVisible(_0x3e8274) {
    this.IsFlixVisible = _0x3e8274;
    const _0x2fed3c = _0x3e8274 ? "block" : "none";
    document.getElementById("flix_canvas").style.display = _0x2fed3c;
  }
  DestroyFlix() {
    if (this.IsFlixActive) {
      FlixDestructor();
      this.IsFlixActive = false;
    }
  }
  HandleFlix(_0x5055b5) {
    return !!this.IsFlixActive && ((_0x5055b5 = _0x5055b5.split("_")).length > 1 ? (this.SetFlixVisible(!1), !1) : this.FlixChatId !== _0x5055b5[0] && _0x5055b5[0] !== "10" || !this.CanUseFlix() ? (this.DestroyFlix(), !1) : (this.SetFlixVisible(!0), WakeFlixBackground(), !0));
  }
  setPawnHueValues(_0x3f31e1) {
    if (!_0x3f31e1) {
      return;
    }
    const _0x2f7928 = parseInt(_0x3f31e1.PawnHueMinColor, 10);
    const _0x5a0baa = parseInt(_0x3f31e1.PawnHueMaxColor, 10);
    const _0x2444ae = "#" + _0x2f7928.toString(16).padStart(6, "0");
    const _0x2aa585 = "#" + _0x5a0baa.toString(16).padStart(6, "0");
    const _0x461081 = _0x3f31e1.PawnHueMinValue;
    const _0x454766 = _0x3f31e1.PawnHueMaxValue;
    const _0x21d6ab = _0x3f31e1.PreviewPawn;
    this.pawnHueData[0] = _0x2444ae;
    this.pawnHueData[1] = _0x2aa585;
    this.pawnHueData[2] = _0x461081;
    this.pawnHueData[3] = _0x454766;
    this.pawnHuePreviewCode = _0x21d6ab;
    this.Settings.pawnHueData = this.pawnHueData;
    this.Settings.setCurrentPawnPreview(this.pawnHuePreviewCode);
    this.Settings.setPawnHueSliderColor(_0x2444ae, _0x2aa585);
  }
}
var _Activity = window._Activity = new Activity();