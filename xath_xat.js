"use strict";
var DoneHiddenDivs;
var Language;
var defconfig = {
  fake: 0,
  xtrace: 1,
  trace: 0,
  xatback: "XatBackground.jpg"
};
var config = defconfig;
var uniqueid = 1;
var ImageHash = {};
var iidLine = 1;
var ImageMemory = 0;
var Seconds = 0;
var ThisPage = "";
var HiddenDivs = {};
var Fac72 = {
  "1": 1,
  "2": 1,
  "3": 1,
  "4": 1,
  "6": 1,
  "8": 1,
  "9": 1,
  "12": 1,
  "18": 1,
  "24": 1,
  "36": 1,
  "72": 1
};
var ToCq = [];
var HugKissDebug = !1;
var Marks = null;
var Player = null;
var Playlist = !1;
var PMMODE = !1;
var reloadPowers = !1;
var userFlags = 0;
var ISGRP = null;
var PSSA = null;
var TOPSH = null;
var SUPERPAWNS = null;
var SUPERPOWERS = null;
var STICKERS = null;
var REACTIONS = null;
var POWERS = null;
var MAXPOWER = null;
var MASKED = null;
var w_Powers = null;
var w_PowerO = null;
var w_Mask = null;
let forceUpdateAnimation = !1;
var isWEB;
var sendFunc;
var Classic;
var PhoneTypes = {
  IPHONE: 1,
  DROIDPHONE: 5,
  WEB: 3,
  WINPHONE: 4
};
var CurrentPhoneType = null;
var xatdomain = "https://xath.hu";
var chatUrl = xatdomain + "/web_gear/chat/";
var IDLE_ROOM = 3;
let audiesList = ["howl", "44", "44inside", "accessdeniedfemale", "accessdeniedmale", "accessgranted", "airbrake", "airbrake2", "airhorn", "alarmbeep", "alarmclockbeep", "allclear", "ambulance", "and", "angrywoman", "aoogahorn", "aoogahorn2", "applausesmall", "arrowhit", "babyrattle", "balloonblowout", "balloonblowup", "balloonstretchsnap", "bangecho", "banneropen", "basketballbounce", "bass", "bathtubsplash", "bbboard", "bbswish", "bee", "beeswarm", "birdfly", "biteonice", "blink", "blip", "bloop", "blowraspberry", "boatairhorn", "boatcreak", "boathorn", "boing", "boing2", "bookpages", "bottlerocket", "boxingbellmulti", "breakplate", "breakwindow", "bricksfall", "bubbling2", "bulletbody", "bulletricochet", "burp", "busdoorslide", "bushorn", "button", "buttonbeep", "buttondroop", "buttonflutter", "buttonzip", "buzzer", "buzzer2", "buzzer3", "buzzer4", "buzzer5", "buzzerheavy", "buzzthroughloud", "buzzthru", "buzzthruloud", "camel", "cameraclick", "cameraclick2", "camerashutter", "camerazoomout", "cannedlaugh2", "cannon", "caralarm", "carcrash", "cardoording", "cardooropen", "cardoorshut", "carhornold2", "carhornshort", "carhorntwice", "carscreech", "carscreech2", "carscreech3", "carscreechstop", "carstart", "cartooncharge", "cartoonfall", "cartoonhammer", "cartoonphone", "cartoonrise", "cartoonrun", "cartoonspinstop", "cartoonsplit", "cartoonsqueak", "cartoonyahoo", "cashregister", "catmeow", "catmeow2", "catscream", "catscreech", "catyell", "cellphone", "censoredbeep", "chaching", "chain", "chainrattle", "chainsaw", "chalkboard", "chimp", "choke", "chop", "chop2", "cicadachirp2", "clickfast", "clickon", "clockchime1", "clocktick", "clocktickfast", "closewindow", "clownbugle", "cockatiel", "cockatiel2", "cockgun", "cockgun2", "cockgun3", "codered", "coinstable", "cointable", "colt45", "computerbeep", "computerbeep2", "computerbeep3", "computerbeep4", "computerprocess", "computerprocess2", "computerspring", "coocoo3", "cough", "cowboy", "creakslam", "cricket", "crow", "crow2", "crowdohh", "crunch", "cupsaucer", "dice", "dissolve", "dissolve2", "dogbark", "dogbark2", "doggrowl", "dolphin", "donkey", "donyahoo", "doorbell", "doorbell2", "doorbell3", "doorcreak", "doorcreak2", "doorcreak3", "dooropen", "doorslam", "dotmatrix3", "doubleclick", "dovefly", "drain", "dream", "drillshort", "dropinwater", "duckquack", "dullthump", "eagle", "eatcookie", "eatlikeapig", "electricalcurrent2", "electricarc", "electricdrill", "electricshock", "electronicheart", "electronicping", "eleoogahorn", "elephant", "elephant2", "elevator", "elevatording", "elevatordoor", "error", "explode", "explosion", "explosion2", "fall", "fall2", "fanfare", "fanfare2", "fart", "fart2", "fart3", "fart4", "fasttalk", "faucet", "fight", "fightmotion", "fill", "firetrucksiren2", "fireworkfire", "fireworks", "fireworksparklepop", "fishingreel", "flagpole", "flashbulb", "flashbulbs", "flashbulbs2", "flatline2", "flicklighter", "flushtoilet", "fly", "flyacross", "flymetal", "foghorn", "foghorn2", "freezerdoor", "frog2", "funnycarburnout", "fuse", "futurebeep", "futurebeep2", "futurebeep3", "gavel", "giantalienlaugh", "giddy", "giddylaugh", "glassbreak", "glassbreaking", "goaway", "golfball", "goodbyefemale", "goodbyemale", "goodmorningfemale", "goopy", "gotaproblem", "gotgas", "gotmailrap", "gotmailrap2", "gotmega", "gravelwalk", "groan", "groan2", "grow", "grow2", "gunfight2", "gunshots3", "hallelujah", "hammer", "handbellchristmas", "happynewyear", "happythanksgiving", "hardknock", "harp", "heartbeat3", "heartmonitorbeep", "hellobaby", "highpitchsqueal", "hisexy", "hiss", "hithard", "hockeystick", "hohoho", "hornwarning", "horsegallop2", "horseneigh", "horseneigh2", "horserun", "horsesrun", "howl2", "huh", "hurryup", "hurtdog", "iceglass", "iloveyoufemale", "iloveyoumale", "implosion", "implosion2", "indiancall", "indiancall2", "indiandrums", "inhale", "insidejet", "interference", "intruderalert", "invaliduser", "jaildoorclose", "jaildoorclose2", "jarlidtwist", "jelly", "jetpass", "jetstart2", "jetstart3", "jokedrum", "keylock", "keys", "kick", "kickass", "kickdoor", "kickdoordown", "kidscheer", "kidsscream", "kiss", "kiss2", "knockdoor", "knockhard", "ladder", "laserfire", "laserfire2", "laserfire3", "lasersword", "lasersword2", "laughcartoon", "laughingman", "laughingman2", "laughingman3", "laughingman4", "laughingman6", "laughingman7", "laughslow", "launchexplode", "lick", "lick2", "lion", "lion2", "lionscream", "liquidblast", "loadclip", "luger", "lumbercrash", "m16", "m16singleshot", "m80", "machinegun", "machineshutdown", "magic", "manwah", "match", "meatsizzle", "merrychristmaself", "metal", "metal2", "metalclang", "metaldooropen", "metalspecial", "metronome", "mice", "missilebeep", "missilebeep2", "missilebeep3", "modem", "monitorflatline", "morsecode", "motorcycle", "mouse", "mousesqueak", "movieend", "musicalhorn", "muzzleloadshot", "navywhistle", "niceday", "nightingale", "officephone", "ohhh", "oldcarhorn", "oldphone", "oldphonering2", "outboard", "ovendoor", "ow", "owl", "pageturn", "paintcanclickfast", "pan", "pant", "panther", "paperturnquick", "parrott", "partyhorn", "pasqueal", "peellongrubber", "peelshortrubber", "penclick", "phonebusy", "phonepickup", "phonering", "pianosmash", "pig", "pigeon", "pinball", "ping", "pipebang", "pissmiss", "pistolshot", "planeidle", "planelow", "platebreak", "platesilverware", "ploop", "policebullhorn", "poolballhit", "poolbreak", "poolpocket", "poolsplash", "pop2", "pop3", "poptop", "potsandpans", "pourbeer", "poursoda", "poweroff", "poweron", "puke", "pukewet", "punch", "punch123", "punch5", "punchhard", "pushpin", "racecar", "radarping", "radioadjustecho", "radiobeep", "raspberryfart", "rattlespray", "reversecymbal", "rifleshotecho", "ringbellmedium", "ringbellsmall", "ringbellsmall2", "robotarm", "rockdoor", "rooster", "ropestretch", "rundoorslam", "runtowards", "safeclose", "saxophone", "scarycartoon", "scarynote", "schoolbellshort", "scratchneedle", "scratchneedlelong", "scream", "screamman", "screamshort", "screamshutup", "screamwhat", "screendoor", "screendoorclose", "shakerolldice", "sheep", "shockperson", "shootglass", "shortbeeptone", "shotclockhorn", "shotgun", "shotgun2", "showercurtain", "shrink", "shutdowninprocess", "shutupmexican", "silvercoin", "singlegunshot", "sirenhorn", "slambigdoor", "slap", "slash", "slice", "sliderock", "slowlaugh", "slurp", "slurpfast", "slurping", "smallbell", "smallchimes", "smallgiggle", "smallwaterfall", "smash", "snakehiss", "snaredrumroll", "sneeze", "sneezewoman", "snore", "snore2", "sodatwistoff", "spaceball", "spacebeep", "sparkle", "sparrow", "specialgift", "spin", "splat", "spookylaugh", "spraybottle", "spraypaint", "spurssteps4", "squeaky", "squeaky2", "stapler", "startinggate", "static", "staticlong", "stumblebreak", "success", "suck", "suck2", "swing", "sword", "takeone", "tapetearoff", "tearcloth", "telegraph", "tennis", "thankyoufemale", "thankyoumale", "thunderrumble2", "tincan", "tireblowout", "tiresquealcorner", "tminus", "toasterpopup", "toytrainhorn", "traffichorns", "trafficjam", "trainhorn", "trainpassfast", "trashcan", "trashcan2", "triangle", "triangle2", "truckairhorn", "truckbrake", "truckhorn", "trumpet", "tugboathorn", "turkey", "turnofftv", "turnontv", "typewriter", "typewriterding", "typewritershift", "ugh", "uhohcomputer", "uhohcomputer2", "uhohcomputer3", "uncork", "underwater", "urconnected", "voicesample", "vwhorn", "walkhall", "warning", "warningbass", "waterballoon", "waterflow", "waterflow2", "wawaahorn", "weatherwarning", "welcomefemale", "welcomewindows2k", "welder2", "whip", "whip2", "whipcrack", "whiskaway", "whistleblow", "whistleblowhere", "whistledown", "whistlehere", "whistleshort", "whistlesparkle", "whistleup", "whistlewolf", "wildcat", "wildcat2", "windchandelier", "windowclose", "windows2kgoodbye", "windowslide", "windup", "witchlaugh", "womancry", "womanlaugh", "womanscream", "womansneeze", "woodplaner", "woodsplinter", "write", "wronganswer", "wronganswer2", "wrongnumbertone", "xpgoodbye", "xylophone", "yawn", "yougotcheesypoofs", "yougotmailscary", "yougotmailwhispered", "zipper", "zoom", "zoomaway"];
let resizeBtn = null;
let minimized = !1;
let playerToolBar = null;
let playerContainer = null;
let tooltip = null;
let timeoutId = null;
let showRapid = !1;
const a0_0x353314 = {
  name: "heartthorns",
  scale: 1.3,
  isRound: !1
};
const a0_0xd9efc7 = {
  name: "heartpunk",
  scale: 1.3,
  isRound: !1
};
const a0_0x45cf89 = {
  name: "heartlocked",
  scale: 1.28,
  isRound: !1
};
const a0_0x1decb2 = {
  name: "heartgarden",
  scale: 1.25,
  isRound: !1
};
const a0_0x56c43b = {
  name: "heartcloud",
  scale: 1.2,
  isRound: !1
};
const a0_0x5b77b5 = {
  name: "heartbloom",
  scale: 1.26,
  isRound: !1
};
const a0_0x966b06 = {
  name: "heartaurea",
  scale: 1.2,
  isRound: !0
};
const a0_0x526a29 = {
  name: "frost",
  scale: 1.25,
  isRound: !1
};
const a0_0x1609bd = {
  name: "christmas",
  scale: 1.3,
  isRound: !1
};
const avatarFrames = [a0_0x353314, a0_0xd9efc7, a0_0x45cf89, a0_0x1decb2, a0_0x56c43b, a0_0x5b77b5, a0_0x966b06, a0_0x526a29, a0_0x1609bd];
const kFreeId = 45;
const StatusfxId = 623;
const StatusEffects = [{
  set: 1,
  key: "scrollleft",
  name: "Scroll Left"
}, {
  set: 1,
  key: "scrollright",
  name: "Scroll Right"
}, {
  set: 1,
  key: "scrollup",
  name: "Scroll Up"
}, {
  set: 1,
  key: "scrolldown",
  name: "Scroll Down"
}, {
  set: 2,
  key: "bounce",
  name: "Bounce"
}, {
  set: 2,
  key: "fadeout",
  name: "Fade-Out"
}, {
  set: 2,
  key: "shake",
  name: "Shake"
}, {
  set: 2,
  key: "translucent",
  name: "Translucent"
}, {
  set: 3,
  key: "flip",
  name: "Flip"
}, {
  set: 3,
  key: "slidedown",
  name: "Slide Down"
}, {
  set: 3,
  key: "slideright",
  name: "Slide Right"
}, {
  set: 3,
  key: "typing",
  name: "Typing"
}, {
  set: 4,
  key: "wave",
  name: "Wave"
}];
window.kPstyleClasslist = Object.freeze(["pg1", "pg2", "pg3", "pg4", "pg5", "pg6", "pg7", "pg8", "pg9", "pg10", "pg11", "pg12", "pg13", "pg14", "pgNone", "mushRoom", "psHalloween", "psMorgana", "psLems", "psKitsune", "pstyleFx"]);
window.kPstyleKeys = Object.freeze(["pg1", "pg2", "pg3", "pg4", "pg5", "pg6", "pg7", "pg8", "pg9", "pg10", "pg11", "pg12", "pg13", "pg14"]);
const a0_0x1ab0e4 = {
  LinkInLinkMarkupDetected: -1
};
const MessageErrorCodes = a0_0x1ab0e4;
var _Activity;
try {
  if (_Activity === undefined) {
    _Activity = parent._Activity !== undefined ? parent._Activity : parent.parent._Activity !== undefined ? parent.parent._Activity : parent.parent.parent._Activity !== undefined ? parent.parent.parent._Activity : parent?.box?._Activity !== undefined ? parent.box._Activity : {};
  }
} catch (a0_0x290176) {
  console.warn("Cross-origin restriction encountered while accessing _Activity.", a0_0x290176);
  _Activity = {};
}
let appFromUrl = null;
function xatMain(_0x174910) {
  var _0x26c841 = JSON.parse(_0x174910);
  config = defconfig;
  setdarkmode();
  for (var _0x292a78 in _0x26c841) {
    config[_0x292a78] = _0x26c841[_0x292a78];
  }
  if (_0x26c841.MyId !== undefined) {
    _Activity.instance.MyId = xInt(_0x26c841.MyId);
  }
  if (!_Activity.instance.IsClassic && config.MyId && parent) {
    _Activity.instance.MyObj = config;
  }
  if (_Activity.instance.IsClassic && !_Activity.instance.QuickBar) {
    loadQuickBar();
  }
  config.PhoneType = xInt(config.PhoneType);
  if (!config.GroupName) {
    config.GroupName = parent.ClassicGroup || "";
  }
  xatdomain = config.dom;
  ThisPage = _0x26c841.page;
  if (config.chatid) {
    setEventsLink(config.chatid);
  }
  let _0x17d06e = Macros?.sline?.split(",");
  if (_0x17d06e) {
    _0x17d06e = _0x17d06e.filter(_0x5716c9 => _0x5716c9);
  }
  if (_0x17d06e?.length && config.pFlags & NamePowers.sline) {
    addSmileyBar(Macros.sline, config.Flags & NamePowers.NoSmilieLine);
  } else if (gconfig && gconfig.g74) {
    addSmileyBar(gconfig.g74, config.Flags & NamePowers.NoSmilieLine);
  } else {
    addSmileyBar(null, config.Flags & NamePowers.NoSmilieLine);
  }
  document.addEventListener("visibilitychange", function () {
    if (document.visibilityState === "visible") {
      document.body.classList.remove("noAnimations");
    } else {
      document.body.classList.add("noAnimations");
    }
  });
  window.addEventListener("pagehide", _0x57c876 => {
    if (_0x57c876.persisted) {
      document.body.classList.add("noAnimations");
    }
  }, !1);
  if (!appFromUrl && (appFromUrl = new URLSearchParams(parent.parent.location.search).get("open"), appFromUrl && appFromUrl.indexOf(".") != -1)) {
    const _0x3087f5 = appFromUrl.split(".")[0].toLowerCase();
    const _0x4dbf81 = capitalize(appFromUrl.split(".")[1].toLowerCase());
    let _0x258645;
    try {
      _0x258645 = appFromUrl.split(".")[2].toLowerCase();
    } catch (_0x792056) {}
    const _0xc4ba32 = {
      Type: _0x4dbf81,
      Pack: _0x258645,
      Config: config
    };
    classicSetDialog(_0x3087f5, _0xc4ba32);
  }
  if (reloadPowers) {
    reloadPowersBank();
    reloadPowers = false;
  }
  isWEB = config.PhoneType == PhoneTypes.WEB;
  CurrentPhoneType = config.PhoneType;
  if (!(Language = config.lang.substr(0, 2).toLowerCase())) {
    Language = "en";
  }
  if (_0x26c841.roomid) {
    _Activity.instance.CurrentChat = _0x26c841.roomid;
  }
  if (_0x26c841.pFlags) {
    userFlags = _0x26c841.pFlags;
  }
}
function IsAnimationOn() {
  return _Activity.instance?.UserSettings?.animation !== "disable";
}
function isBackgroundAnimationOn() {
  return _Activity.instance?.UserSettings?.backgroundanimation !== "disable";
}
function isHugAnimationOn() {
  return _Activity.instance?.UserSettings?.huganimation !== "disable";
}
function loadQuickBar(_0x5f1430) {
  if (typeof _Activity.instance.QuickBar != "object" || !_Activity.instance.IsClassic || _0x5f1430) {
    try {
      _Activity.instance.QuickBar = new Quickbar();
      _Activity.instance.QuickBar.init(_0x5f1430);
    } catch (_0x281bb7) {}
  }
}
function SetPow() {
  if (PSSA || parent?.PSSA) {
    if (localStorage.getItem("w_Powers") && localStorage.getItem("todo")) {
      MAXPOWER = (PSSA || parent?.PSSA).length - 1;
      w_Powers = [];
      let _0x3f0649 = JSON.parse(localStorage.getItem("w_Powers"));
      for (let _0x4734f5 in _0x3f0649) {
        w_Powers[xInt(_0x4734f5)] = xInt(_0x3f0649[_0x4734f5]);
      }
      w_PowerO = JSON.parse(localStorage.getItem("todo")).w_PowerO;
      if (w_Powers.length > 0) {
        setUserBank();
      }
    }
    if (localStorage.getItem("w_Mask") && (w_Mask = JSON.parse(localStorage.getItem("w_Mask")))) {
      setDisabledPowers();
    }
  }
}
function reloadPowersBank() {
  SetPow();
  setUserBank();
  setDisabledPowers();
}
function debug(_0x7e3dd0) {
  return config[_0x7e3dd0];
}
function xtrace(_0x5a535a) {
  if (debug("xtrace")) {
    ToC({
      Type: "xtrace",
      msg: _0x5a535a
    }, true);
  }
}
function FromObjC(_0x1c8e8e) {
  switch (_0x1c8e8e) {
    case "webViewDidFinishLoad":
    case "viewWillAppear":
    case "MessageUpdate":
    case "MessageUpdateAll":
    case "FriendsUpdate":
    case "ChatsUpdate":
    case "VisitorsUpdate":
      break;
    default:
      return;
  }
  if (ThisPage) {
    ToC({
      Type: _0x1c8e8e,
      Page: ThisPage
    });
  }
}
let commandRegex = /\/(\w+)(?: (\w+))?/;
function ToC(_0xd0417f, _0xf48005) {
  if (!_0xd0417f.Type) {
    _0xd0417f.Type = _0xd0417f.Command;
  }
  if (!_0xd0417f.Command) {
    _0xd0417f.Command = _0xd0417f.Type;
  }
  if (!_0xd0417f.Page) {
    _0xd0417f.Page = ThisPage;
  }
  if (_0xd0417f.Command == "LoadClassicDialog") {
    _Activity.instance.CurrentChatC = null;
  }
  if (typeof messages != "undefined" && _0xd0417f.Command === "Click") {
    messages.editMode = false;
  }
  if (_0xd0417f.ChatId && _0xd0417f.Page && _0xd0417f.Page == "chats") {
    if (_0xd0417f.ChatId.indexOf("_") >= 0) {
      _Activity.instance.CurrentChatC = null;
    } else if (_0xd0417f.ChatId > 0) {
      _Activity.instance.CurrentChatC = _0xd0417f.ChatId;
    }
  }
  if (Classic && _0xd0417f.Next == "pop") {
    _0xd0417f.Next = "";
  }
  if (!(!_0xd0417f.Message || _0xd0417f.Message.substr(0, 2) != "/+" && _0xd0417f.Message.substr(0, 2) != "/-")) {
    reloadPowers = true;
    messages.setTypingOff();
  }
  if (!(Classic || typeof messages == "undefined")) {
    if (_0xd0417f.Command && ["swipeleft", "swiperight"].indexOf(_0xd0417f.Command) >= 0 || _0xd0417f.Next && _0xd0417f.Next == "visitors") {
      messages.setTypingOff();
    }
  }
  if (_0xd0417f.Type == "Send" && _0xd0417f.Message[0] == "/") {
    let _0x12279a = commandRegex.exec(_0xd0417f.Message);
    if (_0x12279a) {
      _0x12279a = _0x12279a[1];
    }
    if (_0x12279a) {
      switch (_0x12279a.toLowerCase()) {
        case "rtl":
        case "ltr":
          saveSetting("textDirection", _0x12279a);
          document.getElementById("textEntryEditable").style.direction = _0x12279a;
          break;
        case "away":
          messages.setTypingOff();
          break;
        case "gameban":
          GameBan(_0xd0417f.Message.split(" ")[1], Date.now() + 10000000);
          break;
        case "bump":
          document.body.classList.add("bump");
          // TOLOOK
          setTimeout(() => {
            document.body.classList.remove("bump");
          }, 1300);
          doSound("laserfire3");
      }
    }
  }
  _Activity.instance.QueueCommand(_0xd0417f);
}
function GetXconst(_0x19acaf, _0x3f9ad2) {
  try {
    _0x3f9ad2 = JSON.parse(_0x3f9ad2);
  } catch (_0x23d03b) {
    if (typeof _0x3f9ad2 == "string") {
      _0x3f9ad2 = _0x3f9ad2.split(",");
    }
  }
  _Activity.instance.xConsts[_0x19acaf] = _0x3f9ad2;
  switch (_0x19acaf) {
    case "isgrp":
      ISGRP = _0x3f9ad2;
      break;
    case "pssa":
      _Activity.instance.PSSA = PSSA = _0x3f9ad2;
      SetPow();
      break;
    case "topsh":
      _Activity.instance.TOPSH = TOPSH = _0x3f9ad2;
      break;
    case "SuperPowers":
      _Activity.instance.SUPERPOWERS = SUPERPOWERS = _0x3f9ad2;
      break;
    case "SuperPawns":
      SUPERPAWNS = _0x3f9ad2;
      break;
    case "Stickers":
      STICKERS = _0x3f9ad2;
      break;
    case "reactions":
      if (!_0x3f9ad2 || _0x3f9ad2.length === 0) {
        break;
      }
      REACTIONS = _0x3f9ad2;
      if (!messages.reactionsInit) {
        messages.reactionsInit = true;
        messages.setUpReactionsSelector();
      }
      break;
    case "soth":
      _Activity.instance.SOTH = _0x3f9ad2;
      break;
    case "syel":
      _Activity.instance.SYEL = _0x3f9ad2;
      break;
    case "uCollections":
      _Activity.instance.UCOLLECTIONS = _0x3f9ad2;
      break;
    case "effects":
      _Activity.instance.EFFECTS = _0x3f9ad2;
      break;
    case "frames":
      _Activity.instance.FRAMES = _0x3f9ad2;
      break;
    case "aces":
      _Activity.instance.ACES = _0x3f9ad2;
  }
}
function GetXconsts(_0x498fbf, _0xe1635f, _0x11a3b6) {
  if (!_0xe1635f) {
    _0xe1635f = ["pssa", "topsh", "SuperPowers", "SuperPawns", "isgrp", "Stickers", "reactions", "soth", "syel", "uCollections", "effects", "frames", "aces"];
  }
  if (_0x11a3b6) {
    let _0x2c223d = [];
    for (let _0x380716 in _0xe1635f) {
      let _0x5ce510 = _0xe1635f[_0x380716];
      if (!(_0x11a3b6[_0x5ce510] && _0x5ce510 != "end" && _0x5ce510 != "MainObj")) {
        _0x2c223d.push(_0x5ce510);
      }
    }
    _0xe1635f = _0x2c223d;
  }
  if (_Activity.instance.xConsts) {
    delete _Activity.instance.xConsts.reactions;
    delete _Activity.instance.xConsts.pssa;
    delete _Activity.instance.xConsts.topsh;
  }
  for (let _0x32f85a in _0xe1635f) {
    if (!(_0x498fbf !== "selector" && _Activity.instance.xConsts[_0xe1635f[_0x32f85a]])) {
      ToC({
        Command: "GetXconst",
        js: _0x498fbf,
        obj: _0xe1635f[_0x32f85a]
      });
    }
  }
}
function loadXavi(_0xaf109b, _0x414092, _0x4b6de7, _0x5d5e46, _0x5b2e77, _0xc21c8c, _0x583e30) {
  const _0x762a0e = makeElement(_0xaf109b, "div", "messageAvatar xavi");
  const _0x1525fe = makeElement(_0x762a0e, "iframe", "xaviFrame");
  _0x1525fe.scrolling = "no";
  _0x1525fe.loading = "lazy";
  _0x1525fe.src = "../../xavi/xavi.html#chat&" + _0x414092 + "&" + encodeURIComponent(_0x4b6de7) + "&" + _0x5d5e46 + "&" + _0xc21c8c + "&" + _0x583e30 + "&" + encodeURIComponent(PSSA);
  return _0x762a0e;
}
function GameBan(_0xa2bc56, _0xe620e2, _0x556193, _0x29f064) {
  if (_0x556193 === undefined) {
    _0x556193 = 0;
  }
  if (_0x29f064 === undefined) {
    _0x29f064 = 0;
  }
  let _0xe960fb = document.querySelector("#gamesContainer");
  if (_0xa2bc56 == 0 || _0xe960fb.childNodes.length == 0) {
    if (_0xa2bc56 != 0) {
      if (_0xe960fb) {
        _0xe960fb.innerHTML = "";
        _0xe960fb.style.display = "block";
      }
      let _0x522803 = makeElement(_0xe960fb, "iframe", "gameFrame");
      switch (xInt(_0xa2bc56)) {
        case 162:
          _0x522803.src = "../gameban/codeban/index.html#" + _0xe620e2;
          break;
        case 134:
          _0x522803.src = "../gameban/snakeban/index.html#" + _0xe620e2;
          break;
        case 136:
          _0x522803.src = "../gameban/spaceban/index.html#" + _0xe620e2;
          break;
        case 236:
        case 152:
        case 140:
          const {
            innerWidth: _0x445a50,
            innerHeight: _0x232e30
          } = window;
          const _0x2ae66d = "" + [_0xe620e2, _0x556193, _0x29f064, _0xa2bc56, config.MyId, _0x445a50, _0x232e30].join(",");
          _0x522803.src = "../gameban/other/index.html#" + _0x2ae66d;
          break;
        default:
          _0xe960fb.innerHTML = "";
          _0xe960fb.style.display = "none";
      }
    } else {
      closeGameBan();
    }
  }
}
function closeGameBan() {
  let _0x490f41 = document.querySelector("#gamesContainer") || parent.document.querySelector("#gamesContainer");
  if (_0x490f41) {
    _0x490f41.innerHTML = "";
    _0x490f41.style.display = "none";
  }
}
function openInNewTab(_0x2a4139, _0x8dfaa5) {
  if (!_0x8dfaa5) {
    _0x8dfaa5 = "_blank";
  }
  if (_0x8dfaa5 = window.open(_0x2a4139, _0x8dfaa5)) {
    _0x8dfaa5.focus();
  }
}
function HitWeb(_0x33c0c5, _0x344614) {
  if (!(_0x33c0c5.search(/app:/i) >= 0)) {
    if (_0x33c0c5.search("://") < 0) {
      _0x33c0c5 = "https://" + _0x33c0c5;
    }
    openInNewTab(_0x33c0c5);
  }
}
function HitWiki(_0x1fb89b, _0x490d9f) {
  HitWeb("https://util.xath.hu/wiki/index.php?title=" + _0x1fb89b, _0x490d9f);
}
function LinkValidator(_0x80fd06, _0x4653f2, _0x2a6180) {
  if ((_0x4653f2 = _0x4653f2.replace(/＆/g, "&")).includes("linkvalidator.xath.hu/")) {
    return;
  }
  if (_0x80fd06) {
    _0x80fd06.stopPropagation();
  }
  var _0x55fdbb;
  var _0x1ff94b = _0x4653f2.charAt(0);
  if (_0x1ff94b == "^") {
    ToC({
      Command: "StartApp",
      n: "canvas",
      a1: _0x4653f2.substr(1)
    });
    return;
  }
  if (_0x1ff94b == "@") {
    _0x55fdbb = "https://me.xath.hu/" + _0x4653f2.substr(1);
    if (_0x2a6180) {
      return _0x55fdbb;
    } else {
      HitWeb(_0x55fdbb);
      return;
    }
  }
  if (_0x1ff94b == "%") {
    _0x55fdbb = xatdomain + "/" + _0x4653f2.substr(1);
    if (_0x2a6180) {
      return _0x55fdbb;
    } else if (isWEB) {
      HitWeb(_0x55fdbb);
      return;
    } else {
      ToC({
        Command: "StartGroup",
        Group: _0x4653f2.substr(1)
      });
      return;
    }
  }
  if (_0x4653f2 === "vote") {
    _Activity.instance.QuickBar.toggleSideBar(!0);
    let _0x104b54 = findNodeInWindowOrParent("#sideBarItemvote");
    if (!_Activity.IsClassic) {
      const _0x2704aa = findNodeInWindowOrParent("#textEntryEditable");
      _0x2704aa?.blur();
    }
    if (_0x104b54) {
      _0x104b54.click();
    }
    return;
  }
  let _0xc714a8;
  _0x4653f2 = _0x4653f2?.replace(/\u00A0/, "");
  try {
    _0xc714a8 = new URL(_0x4653f2);
  } catch (_0x33cf79) {
    _0xc714a8 = {};
  }
  if (_Activity.instance.UserSettings?.linkvalidator == "disable" && ["^", "@", "%"].indexOf(_0x4653f2.charAt(0)) == -1 || ["xath.hu", "xat.wiki", "forum.xath.hu"].includes(_0xc714a8.host)) {
    if (_0x2a6180) {
      return _0x4653f2;
    } else {
      HitWeb(_0x4653f2);
      return;
    }
  }
  var _0xc06c41;
  var _0x5c6c80 = new Array(64);
  for (_0xc06c41 = 0; _0xc06c41 < 26; _0xc06c41++) {
    _0x5c6c80[_0xc06c41] = String.fromCharCode(_0xc06c41 + 65);
  }
  for (_0xc06c41 = 26; _0xc06c41 < 52; _0xc06c41++) {
    _0x5c6c80[_0xc06c41] = String.fromCharCode(_0xc06c41 + 71);
  }
  for (_0xc06c41 = 52; _0xc06c41 < 62; _0xc06c41++) {
    _0x5c6c80[_0xc06c41] = String.fromCharCode(_0xc06c41 - 4);
  }
  _0x5c6c80[62] = "+";
  _0x5c6c80[63] = "/";
  var _0x5c148f = new Array();
  var _0x53e74a = new Array();
  for (_0xc06c41 = 0; _0xc06c41 < _0x4653f2.length; _0xc06c41++) {
    _0x5c148f[_0xc06c41] = _0x4653f2.charCodeAt(_0xc06c41);
  }
  for (_0xc06c41 = 0; _0xc06c41 < _0x5c148f.length; _0xc06c41++) {
    switch (_0xc06c41 % 3) {
      case 0:
        _0x53e74a.push(_0x5c6c80[(_0x5c148f[_0xc06c41] & 252) >> 2]);
        break;
      case 1:
        _0x53e74a.push(_0x5c6c80[(_0x5c148f[_0xc06c41 - 1] & 3) << 4 | (_0x5c148f[_0xc06c41] & 240) >> 4]);
        break;
      case 2:
        _0x53e74a.push(_0x5c6c80[(_0x5c148f[_0xc06c41 - 1] & 15) << 2 | (_0x5c148f[_0xc06c41] & 192) >> 6]);
        _0x53e74a.push(_0x5c6c80[_0x5c148f[_0xc06c41] & 63]);
    }
  }
  if (_0xc06c41 % 3 == 1) {
    _0x53e74a.push(_0x5c6c80[(_0x5c148f[_0xc06c41 - 1] & 3) << 4]);
  } else if (_0xc06c41 % 3 == 2) {
    _0x53e74a.push(_0x5c6c80[(_0x5c148f[_0xc06c41 - 1] & 15) << 2]);
  }
  _0xc06c41 = _0x53e74a.length;
  for (; _0xc06c41 % 4 != 0; _0xc06c41++) {
    _0x53e74a.push("=");
  }
  var _0x30e8c9 = "m=1&";
  if (isWEB) {
    _0x30e8c9 = "";
  }
  var _0x1c3579 = "https://linkvalidator.xath.hu/warn.php?" + _0x30e8c9 + "p=";
  for (_0xc06c41 = 0; _0xc06c41 < _0x53e74a.length; _0xc06c41++) {
    _0x1c3579 += _0x53e74a[_0xc06c41];
  }
  if (_0x2a6180) {
    return _0x1c3579;
  }
  HitWeb(_0x1c3579);
}
var gconfig;
var Macros;
function setGconfig(_0x4b3b32) {
  for (var _0x1a3471 in gconfig = JSON.parse(_0x4b3b32)) {
    if (gconfig[_0x1a3471].charAt(0) == "{") {
      if (gconfig[_0x1a3471].charAt(1) == "`") {
        gconfig[_0x1a3471] = gconfig[_0x1a3471].replace(/`/g, "\"");
      }
      gconfig[_0x1a3471] = JSON.parse(gconfig[_0x1a3471]);
    }
  }
  if (gconfig.g100) {
    var _0x3ea498 = gconfig.g100.split(",");
    gconfig.g100 = {};
    for (var _0x48ffe9 = 0; _0x48ffe9 + 1 < _0x3ea498.length; _0x48ffe9 += 2) {
      gconfig.g100[_0x3ea498[_0x48ffe9]] = _0x3ea498[_0x48ffe9 + 1];
    }
  }
  _Activity.instance.gConfig = gconfig;
}
function setMacros(_0xd5e382) {
  Macros = JSON.parse(_0xd5e382);
}
function setSettings(_0x24699a) {
  _Activity.instance.UserSettings = JSON.parse(_0x24699a);
}
function setAppIcon(_0x4de970) {
  const _0x1d2827 = {
    channel: _0x4de970,
    user: 0,
    msg: "",
    tobox: 1
  };
  let _0x295346 = _0x1d2827;
  parent.parent.parent.postMessage(JSON.stringify(_0x295346), "https://xath.hu");
}
let prevSmilies = null;
let smTimeoutId = null;
let gotSmConfig = !1;
let debugFlag = 0;
function addSmileyBar(_0x19d698, _0x492867) {
  if (!(_0x19d698 && _0x19d698.replace(/ /g, "").length != 0)) {
    _0x19d698 = "smile,biggrin,wink,eek,tongue,cool,mad,confused,redface,frown,crying,sleepy";
  }
  let _0x4afbc9 = document.querySelector("#smileyBar");
  if (prevSmilies != _0x19d698 || debugFlag != (config.Flags & NamePowers.ChatIsDebug) || forceUpdateAnimation) {
    gotSmConfig = false;
  }
  if (gotSmConfig || !_0x4afbc9 || window.innerHeight <= 300) {
    return;
  }
  if (gconfig && gconfig.hasOwnProperty("g74")) {
    gotSmConfig = true;
  }
  prevSmilies = _0x19d698;
  forceUpdateAnimation = !1;
  _0x19d698 = _0x19d698.split(",");
  let _0x288ac2 = ["smile", "biggrin", "wink", "eek", "tongue", "cool", "mad", "confused", "redface", "frown", "crying", "sleepy"];
  _0x4afbc9.innerHTML = "";
  for (let _0x360052 = 0; _0x360052 < _0x19d698.length; _0x360052++) {
    if (_0x19d698[_0x360052]) {
      _0x288ac2[_0x360052] = _0x19d698[_0x360052];
    }
  }
  const _0x3a39b4 = window.innerWidth > 500 ? 12 : 8;
  _0x288ac2.length = _0x3a39b4;
  _0x288ac2.forEach((_0x4ca8c2, _0x193dfe) => {
    let _0x1ec937 = _0x492867 && _0x193dfe == 0 ? "smiley smToggle" : _0x492867 ? "smiley smToggle2 smOff" : "smiley";
    const _0x28565b = _Activity.instance.Smilies.MakeSmiley(makeElement(_0x4afbc9, "div", _0x1ec937), _0x4ca8c2, {
      size: 30,
      tooltip: "(" + _0x4ca8c2 + ")",
      tooltipPosition: "low",
      showAd: !1,
      align: !0,
      addGback: !0,
      callback: () => {
        smiliePressed("(" + _0x4ca8c2 + ")");
      }
    });
    if (_0x492867 && !_0x193dfe) {
      _0x28565b.addEventListener("mouseenter", _0x36cc94 => {
        window.clearTimeout(smTimeoutId);
        smTimeoutId = window.setTimeout(() => {
          document.querySelectorAll(".smOff").forEach(_0x5004b3 => {
            _0x5004b3.classList.remove("smOff");
          });
          document.querySelectorAll(".smiley").forEach(_0x2781a5 => {
            _0x2781a5.addEventListener("mouseleave", _0xc8d8ac => {
              window.clearTimeout(smTimeoutId);
              smTimeoutId = window.setTimeout(() => {
                document.querySelectorAll(".smToggle2").forEach(_0x8c5783 => {
                  _0x8c5783.classList.add("smOff");
                });
              }, 500);
            });
          });
        }, 500);
      });
    }
  });
  const _0x63c44f = makeElement(_0x4afbc9, "div", "cell svgBack smline sideApp shake");
  _0x63c44f.style.cssText = "width: 6%; height: 30px; right: 0; background-image: url('svg/8ball" + (config.Flags & NamePowers.ChatIsDebug ? "b" : "") + ".svg')";
  _0x63c44f.onclick = getStuffPressed;
  const _0x37548e = makeElement(_0x4afbc9, "div", "cell svgBack smline sideApp");
  _0x37548e.style.cssText = "width: 6%; height: 30px; right: 0; background-image: url('svg/getx.svg')";
  _0x37548e.onclick = buyPressed;
  const _0x24c1a9 = makeElement(_0x4afbc9, "div", "cell svgBack smline sideApp", "spkBut");
  _0x24c1a9.style.cssText = "width: 6%; height: 30px; right: 0;";
  _0x24c1a9.onclick = spkPressed;
  addToolTip(_0x63c44f, ["box.139", "Get Stuff"], {
    position: "low"
  });
  addToolTip(_0x37548e, ["box.207", "Click to buy"], {
    position: "low"
  });
  addToolTip(_0x24c1a9, ["mob1.managesounds", "Manage sounds"], {
    position: "low"
  });
  debugFlag = config.Flags & NamePowers.ChatIsDebug;
}
var keywords = {
  xavi: 9,
  wiki: "wiki",
  twitter: "twitter",
  facebook: "facebook",
  instagram: "instagram",
  android: "android",
  search: "search",
  power: "power",
  powers: "power",
  store: "store",
  promote: "promotion",
  promotion: "promotion",
  shortname: "shortname",
  auction: "auction",
  audies: "audies",
  doodle: 9,
  trade: 9,
  smilie: 3,
  smilies: 3,
  smiley: 3,
  register: 5,
  login: 6,
  buy: 7,
  coin: 7,
  coins: 7,
  xats: 7,
  subscriber: 7,
  gift: 8,
  grid: 9,
  spacewar: 9,
  matchrace: 9,
  doodlerace: 9,
  snakerace: 9,
  switch: 9,
  hearts: 9,
  darts: 9,
  zwhack: 9,
  stick: 9,
  chess: 9,
  fourinarow: 9,
  canvas: 9,
  pool: 9,
  media: 10001,
  translator: 11,
  translate: 11,
  pawns: 9,
  vote: "vote",
  aces: "aces",
  nuclear: 9,
  supercycle: 9,
  count: 9
};
const customAppCodes = {
  "20008": "nuclear#freeze#w12#size#w7",
  "20009": "count#",
  "20012": "supercycle#",
  "20038": "stick#"
};
function openApp(_0x4cd928) {
  if (!_0x4cd928) {
    return;
  }
  const _0x44e170 = {
    trade: 30008,
    doodle: "doodle2",
    grid: 30004,
    live: 40000,
    spacewar: 60201,
    matchrace: 60193,
    doodlerace: 60189,
    snakerace: 60195,
    switch: 60239,
    hearts: 60225,
    darts: 60247,
    zwhack: 60257,
    stick: 20038,
    music: 20042,
    chess: 20002,
    fourinarow: 20010,
    canvas: 60002,
    pool: 20006,
    media: 10001,
    xavi: 20047,
    pawns: 60685,
    supercycle: 20012,
    nuclear: 20008,
    count: 20009
  };
  let _0x3721f5 = {};
  if (_0x4cd928.type && _0x4cd928.type == "media") {
    _0x3721f5 = {
      n: _0x4cd928.type,
      i: _0x44e170.media,
      l: _0x4cd928.link,
      action: "sideload"
    };
  } else if (_0x4cd928.toLowerCase() == "translator" || _0x4cd928.toLowerCase() == "translate") {
    const _0x5cbf2f = {
      UserNo: config.MyId,
      tab: "translator"
    };
    let _0x989b70 = _0x5cbf2f;
    classicSetDialog("actions", config.MyId);
    classicSetDialog("settings", _0x989b70);
  } else {
    _0x3721f5 = {
      n: _0x4cd928,
      i: _0x44e170[_0x4cd928],
      action: "sideload"
    };
  }
  if (parent) {
    parent.postMessage(JSON.stringify(_0x3721f5), "https://xath.hu");
  }
}
function WordIsLink(_0x13c656, _0x16d7d9, _0x34aa46, _0x3271fe) {
  if (!(_0x13c656.match(/['"<>❯`]/) || _0x13c656 && _0x13c656[0] === "(" && _0x13c656[_0x13c656.length - 1] === ")" && _0x13c656.includes("#w"))) {
    var _0x1ebf8e;
    var _0x2775a6 = _0x13c656.toLowerCase();
    if (!_0x3271fe || !_Activity.instance.QuickBar?.isGiphyLink(_0x13c656)) {
      if (_0x13c656.match(/^[@%][a-zA-Z0-9_]+$/)) {
        return _0x2775a6;
      }
      if (_0x1ebf8e = _0x13c656.match(/^(play\.|app\.)([a-zA-Z0-9_]+)$/)) {
        return "^" + _0x1ebf8e[2];
      }
      if (keywords.hasOwnProperty(_0x2775a6) && !_0x34aa46) {
        switch (_0x4a5469 = xInt(_0x1ebf8e = keywords[_0x2775a6])) {
          case 9:
          case 11:
            if (_0x2775a6 == "doodle") {
              _0x2775a6 = "doodle2";
            }
            return {
              l: ">",
              c: "#000000",
              callBack: () => {
                openApp(_0x2775a6);
              }
            };
          case 10001:
            return {
              l: ">",
              c: "#000000",
              callBack: () => {
                openApp({
                  type: "media",
                  link: null
                });
              }
            };
          case 5:
            if (isWEB) {
              return "https://xath.hu/login?mode=1";
            }
          case 6:
            if (isWEB) {
              return "https://xath.hu/login";
            }
          case 7:
            if (isWEB) {
              return openBuyPage();
            }
          default:
            if (_0x1ebf8e == "vote") {
              return "vote";
            }
            if (_0x4a5469 < 1) {
              return "https://xath.hu/" + _0x1ebf8e;
            }
        }
      }
      if (gconfig && (_0x1ebf8e = gconfig.g100) && _0x1ebf8e.hasOwnProperty(_0x2775a6)) {
        return {
          l: "https://bit.ly/" + (_0x1ebf8e = _0x1ebf8e[_0x2775a6]),
          c: "#000080"
        };
      }
      if (!_0x16d7d9 && !(_0x13c656.indexOf(".") < 0 || _0x13c656[0] == "." || _0x2775a6.indexOf("app:") >= 0)) {
        if (_0x2775a6.indexOf("http") >= 0) {
          return _0x13c656;
        }
        if (_0x2775a6[0] == "(" && _0x2775a6[_0x2775a6.length - 1] == ")") {
          const _0x378be4 = _0x2775a6.split(" ");
          if (_0x378be4.length > 1) {
            const _0x25e2d6 = _0x378be4.filter(_0xc8798b => WordIsLink(_0xc8798b.replace("(", "").replace(")", "")));
            if (_0x25e2d6.length && _0x25e2d6[0].length > 0) {
              _0x13c656 = _0x25e2d6[0].replace("(", "").replace(")", "");
            }
          }
        }
        var _0x37fb7c = !1;
        var _0x404586 = 2;
        if (_0x2775a6.indexOf("www.") >= 0) {
          _0x37fb7c = true;
        }
        var _0x2647ab;
        var _0x5c2210 = _0x2775a6.indexOf("/");
        if (_0x5c2210 == -1) {
          _0x5c2210 = _0x2775a6.length;
        }
        for (var _0x4a5469 = 0; _0x4a5469 < _0x5c2210; _0x4a5469++) {
          if (((_0x2647ab = _0x2775a6.charCodeAt(_0x4a5469)) < 48 || _0x2647ab > 57) && _0x2647ab != 46) {
            _0x404586 = 0;
            break;
          }
        }
        if (_0x2775a6.charAt(_0x5c2210 - 1) == ".") {
          _0x404586 = 2;
        }
        if (_0x2775a6.charAt(_0x5c2210 - 2) == ".") {
          _0x404586 = 2;
        }
        if (_0x2775a6.charAt(_0x5c2210 - 3) == ".") {
          _0x404586++;
        }
        if (_0x2775a6.charAt(_0x5c2210 - 4) == ".") {
          _0x404586++;
        }
        if (_0x2775a6.charAt(_0x5c2210 - 5) == ".") {
          _0x404586++;
        }
        if (_0x404586 == 1) {
          _0x37fb7c = true;
        }
        if (_0x37fb7c) {
          return "https://" + _0x13c656;
        } else {
          return undefined;
        }
      }
    }
  }
}
function setEventsLink(_0x43eb56) {
  if (keywords && _0x43eb56) {
    keywords.events = "chats#!events&roomid=" + _0x43eb56 + "&GroupName=" + config.GroupName;
  }
}
const lut15 = [128, 180, 222, 249, 254, 238, 203, 154, 102, 53, 18, 2, 7, 34, 76];
const usefA = {
  "1": 1,
  "3": 2,
  "4": 4
};
const RepeatA = {
  "2": 50,
  "3": 33.3
};
function toColor(_0x3a9b1e) {
  return "#" + (16777216 + ((_0x3a9b1e >>>= 0) & 255 | (_0x3a9b1e & 65280) >>> 8 << 8 | (_0x3a9b1e & 16711680) >>> 16 << 16)).toString(16).slice(1);
}
function MakeGrad(_0x1c7697) {
  let _0x55c8bb;
  let _0x57c87d;
  let _0x5cb719;
  let _0x248015;
  let _0x30e4fd = 0;
  let _0x4f3562 = 0;
  let _0x5de0f7 = !1;
  let _0x10c685 = [];
  _0x1c7697.reverse();
  if ((_0x1c7697 = _0x1c7697.filter(Boolean)).length <= 1) {
    _0x1c7697 = [..._0x1c7697, 6359443, 2951035, 40440, 48184, 16578129, 16736060, 16711680];
  }
  _0x57c87d = 0;
  for (; _0x57c87d < _0x1c7697.length; _0x57c87d++) {
    let _0xc6132d = _0x1c7697[_0x57c87d];
    if (!_0xc6132d) {
      continue;
    }
    _0xc6132d = _0xc6132d.toString();
    if (_0xc6132d == "NW") {
      _0x5de0f7 = !0;
      if (_0x55c8bb === undefined) {
        _0x55c8bb = true;
      }
      continue;
    }
    let _0x1c2223;
    let _0x13a934 = _0xc6132d.charAt(0);
    _0x1c2223 = xInt(_0xc6132d.substr(1));
    if (_0x13a934 != "r") {
      if (_0x13a934 != "s") {
        if (_0x13a934 != "f") {
          if (_0x13a934 != "o") {
            _0xc6132d = xInt(_0xc6132d);
            if (!_0xc6132d) {
              break;
            }
            _0x10c685.push(toColor(_0xc6132d));
          } else {
            if (_0x1c2223 == 0) {
              _0x55c8bb = !1;
              continue;
            }
            _0x55c8bb = _0x5de0f7;
            _0x248015 = RepeatA[_0x1c2223];
          }
        } else {
          _0x55c8bb = _0x5de0f7;
          _0x30e4fd = usefA[_0x1c2223];
        }
      } else {
        _0x4f3562 = _0x1c2223;
      }
    } else {
      _0x5cb719 = _0x1c2223;
    }
  }
  if (_0x10c685.length > 15) {
    _0x10c685.length = 15;
  }
  if (_0x10c685.length < 2) {
    for (let _0x36545c = 0; _0x36545c < 15; _0x36545c++) {
      let _0x5b0fcd = lut15[(_0x36545c + _0x4f3562) % 15];
      let _0x5dab0e = lut15[(_0x36545c + _0x4f3562 + 10) % 15];
      let _0x1ef3b0 = lut15[(_0x36545c + _0x4f3562 + 5) % 15];
      _0x10c685[_0x36545c] = (_0x5b0fcd << 16) + (_0x5dab0e << 8) + _0x1ef3b0;
    }
  }
  if (_0x5cb719 === undefined) {
    _0x5cb719 = 45;
  }
  if (_0x55c8bb) {
    if (_0x5cb719 > 45) {
      _0x5cb719 = 45;
    } else if (_0x5cb719 < -45) {
      _0x5cb719 = -45;
    }
    if (!_0x30e4fd) {
      _0x30e4fd = usefA[4];
    }
    _0x5cb719 = _0x5cb719 > 0 ? 90 - _0x5cb719 : -90 - _0x5cb719;
    if (_0x10c685[0] != _0x10c685[_0x10c685.length - 1]) {
      _0x10c685.push(_0x10c685[0]);
    }
  }
  _0x5cb719 = -_0x5cb719;
  if (_0x248015 || _0x55c8bb) {
    if (!_0x248015 && _0x55c8bb) {
      if (!_0x248015) {
        _0x248015 = 100;
      }
    }
  } else if (!_0x248015) {
    _0x248015 = 200;
  }
  let _0xd8c7e7 = (90 - Math.abs(_0x5cb719)) / 15 * _0x248015 / 100;
  _0x248015 = (_0x248015 / 2 - _0xd8c7e7) / (_0x10c685.length - 1);
  let _0x1bfad2 = (IsAnimationOn() ? "repeating-" : "") + ("linear-gradient(" + _0x5cb719 + "deg");
  for (let _0x4d2264 = 0; _0x4d2264 < _0x10c685.length; _0x4d2264++) {
    _0x1bfad2 += "," + _0x10c685[_0x4d2264];
    _0x1bfad2 += _0x55c8bb ? " " + (_0xd8c7e7 + _0x248015 * _0x4d2264) + "%" : " " + _0x4d2264 * 100 / (_0x10c685.length - 1) + "%";
  }
  _0x1bfad2 += ")";
  return [_0x30e4fd, _0x1bfad2];
}
function nameFlag(_0x4aaaae, _0x21fb0b, _0x58feb3, _0x1bbb04) {
  const _0x3dcd6c = {
    "1": 12,
    "3": 72
  };
  const _0x195d60 = {
    "1": 0,
    "3": 0.2,
    "4": 0.3
  };
  let _0x60f221;
  let _0x525ffc = 4;
  let _0xf4888 = 0.25;
  let _0x1df269 = 36;
  let _0x55df32 = 1;
  let _0x4e31b1 = -1;
  let _0x171eb3 = _0x4aaaae[0] == "jewel";
  let _0x3edfae = 2 / 3;
  let _0x20992a = 36;
  let _0x553b0a = _0x1bbb04 & NamePowers.everypower;
  if (_0x171eb3) {
    _0x60f221 = _0x553b0a ? "10A012" : "DC143C";
  }
  if (_0x4aaaae.length) {
    if (_0x171eb3 && _0x4aaaae[1] && _0x4aaaae[1].length == 6) {
      let _0x40cfae = getJewelCol(_0x4aaaae[1], _0x553b0a);
      if (_0x40cfae) {
        _0x60f221 = _0x40cfae;
      }
    }
    for (let _0x233377 = 1; _0x233377 < _0x4aaaae.length; _0x233377++) {
      if (!_0x4aaaae[_0x233377]) {
        continue;
      }
      let _0x44b3be = _0x4aaaae[_0x233377].charAt(0);
      let _0x1afa45 = parseInt(_0x4aaaae[_0x233377].substr(1));
      switch (_0x44b3be) {
        case "r":
          _0x525ffc = 2;
          break;
        case "e":
          _0x525ffc = 3;
          break;
        case "u":
          _0x525ffc = 5;
          break;
        case "f":
          switch (_0x1afa45) {
            case 1:
              _0x20992a = 72;
              break;
            case 2:
              _0x20992a = 48;
              break;
            case 3:
              _0x20992a = 36;
              break;
            case 4:
              _0x20992a = 18;
          }
          break;
        case "c":
          _0x1df269 = _0x3dcd6c[_0x1afa45];
          if (!_0x1df269) {
            _0x1df269 = 36;
          }
          break;
        case "g":
          _0xf4888 = _0x195d60[_0x1afa45];
          if (!_0xf4888) {
            _0xf4888 = 0.1;
          }
          break;
        case "d":
          _0x4e31b1 = -_0x4e31b1;
      }
    }
  }
  let _0x144871 = _0x20992a / 12;
  if (_0x525ffc == 5) {
    let _0x29b567 = document.createElement("canvas");
    _0x29b567.width = Math.ceil(_0x21fb0b.offsetWidth);
    _0x29b567.height = Math.round(_0x29b567.width * (_0x58feb3.naturalHeight / _0x58feb3.naturalWidth));
    let _0x55fb58 = _0x29b567.getContext("2d");
    if (_0x171eb3) {
      _0x55fb58.fillStyle = "#" + _0x60f221;
      _0x55fb58.fillRect(0, 0, _0x29b567.width, _0x29b567.height);
    }
    _0x55fb58.drawImage(_0x58feb3, 0, 0, _0x29b567.width, _0x29b567.height);
    _0x21fb0b.style.backgroundImage = "url('" + _0x29b567.toDataURL() + "')";
    if (IsAnimationOn()) {
      _0x21fb0b.style.animation = "nameFlag " + _0x144871 + "s ease-in-out infinite alternate";
    }
    addClass("nameFlag", 0, _0x21fb0b);
    return;
  }
  if (!_0x21fb0b) {
    return !1;
  }
  if (_0x171eb3) {
    _0x3edfae = 1;
  }
  let _0x70e156 = Math.ceil(_0x21fb0b.offsetWidth);
  let _0x7c4022 = Math.ceil(_0x21fb0b.offsetHeight);
  if (!_0x7c4022) {
    return;
  }
  let _0x2443fa = document.createElement("canvas");
  _0x2443fa.width = _0x70e156;
  _0x2443fa.height = _0x7c4022 * _0x20992a;
  let _0x1bd050 = _0x2443fa.getContext("2d");
  let _0x4675c8 = document.createElement("canvas");
  _0x4675c8.width = _0x70e156;
  _0x4675c8.height = _0x7c4022;
  let _0x3a20bf = _0x4675c8.getContext("2d");
  let _0x4bf280 = _0x58feb3.naturalWidth;
  let _0x1fb3f3 = _0x58feb3.naturalHeight;
  let _0x1af47f = _0x70e156 / _0x4bf280;
  let _0x48a948 = _0x4bf280 * _0x1af47f * _0x3edfae;
  let _0x58cf14 = _0x1fb3f3 * _0x1af47f;
  if (_0x171eb3) {
    _0x1bd050.fillStyle = "#" + _0x60f221;
    _0x1bd050.fillRect(0, 0, _0x70e156, _0x7c4022 * _0x20992a);
  }
  let _0x306d4a = new Array();
  let _0x57ac69 = new Array();
  if (_0x525ffc == 2 || _0x525ffc == 3 || _0x525ffc == 4) {
    let _0x56fb9a = _0x4bf280 / _0x1fb3f3;
    if (_0x56fb9a > _0x55df32) {
      _0x55df32 = _0x56fb9a;
    }
  }
  if (_0x525ffc == 3 || _0x525ffc == 4) {
    for (var _0x10ae5c = 0; _0x10ae5c < _0x1df269; _0x10ae5c++) {
      if (!(_0x525ffc != 3 && _0x525ffc != 4)) {
        _0x306d4a[_0x10ae5c] = Math.sin(Math.PI * 2 * (_0x10ae5c / _0x1df269));
      }
      if (_0x525ffc == 4) {
        _0x57ac69[_0x10ae5c] = Math.cos(Math.PI * 2 * (_0x10ae5c / _0x1df269));
      }
    }
  }
  for (let _0x450051 = 0; _0x450051 < _0x20992a; _0x450051++) {
    let _0x58f553 = _0x70e156 / 2;
    let _0x5666b9 = _0x7c4022 / 2;
    let _0x1b04a6 = 0;
    let _0x395b56 = 1;
    switch (_0x525ffc) {
      case 2:
        _0x1b04a6 = -360 / _0x20992a * _0x450051 * _0x4e31b1;
        _0x58f553 = _0x70e156 / 2;
        _0x5666b9 = _0x7c4022 / 2;
        _0x395b56 = _0x55df32;
        break;
      case 3:
        _0x1b04a6 = -360 / _0x20992a * _0x450051 * _0x4e31b1;
        _0x58f553 = _0x70e156 / 2;
        _0x5666b9 = _0x7c4022 / 2;
        _0x395b56 = _0x55df32 + _0x55df32 * _0xf4888 + _0x55df32 * _0xf4888 * _0x306d4a[_0x450051 % _0x1df269];
        break;
      case 4:
        _0x1b04a6 = -360 / _0x20992a * _0x450051 * _0x4e31b1;
        _0x58f553 = _0x70e156 / 2 + _0x70e156 * _0xf4888 * _0x57ac69[_0x450051 % _0x1df269];
        _0x5666b9 = _0x7c4022 / 2 + _0x7c4022 * _0xf4888 * _0x306d4a[_0x450051 % _0x1df269];
        _0x395b56 = _0x55df32 + _0x55df32 * _0xf4888 * 2;
    }
    _0x3a20bf.clearRect(0, 0, _0x70e156, _0x7c4022);
    _0x3a20bf.save();
    _0x3a20bf.translate(_0x58f553, _0x5666b9);
    _0x3a20bf.rotate(_0x1b04a6 * Math.PI / 180);
    _0x3a20bf.scale(_0x395b56, _0x395b56);
    _0x3a20bf.translate(-_0x70e156 / 2, -_0x7c4022 / 2);
    _0x3a20bf.drawImage(_0x58feb3, _0x70e156 / 2 - _0x48a948 / 2, _0x7c4022 / 2 - _0x58cf14 / 2, _0x48a948, _0x58cf14);
    _0x3a20bf.restore();
    _0x1bd050.drawImage(_0x4675c8, 0, _0x7c4022 * _0x450051, _0x70e156, _0x7c4022);
  }
  _0x21fb0b.style.backgroundImage = "url('" + _0x2443fa.toDataURL() + "')";
  addClass("nameStrip", 0, _0x21fb0b);
  if (IsAnimationOn()) {
    _0x21fb0b.style.animation = "nameStrip" + _0x20992a + " " + _0x144871 + "s steps(" + _0x20992a + ") infinite normal";
    _0x21fb0b.style.backgroundSize = "100% " + _0x20992a + "00%";
  }
}
function getJewelCol(_0x4ec8fa, _0x257d18) {
  if (!_0x4ec8fa) {
    return !1;
  }
  if (!_0x257d18) {
    let _0x3f08e6 = parseInt(_0x4ec8fa, 16);
    if (isNaN(_0x3f08e6)) {
      _0x3f08e6 = 1;
    }
    let _0x190897 = _0x3f08e6 >> 16 & 255;
    let _0x33b6d9 = _0x3f08e6 >> 8 & 255;
    let _0x1ea8a9 = _0x3f08e6 & 255;
    if (_0x33b6d9 > _0x190897) {
      _0x33b6d9 = _0x190897;
    }
    if (_0x33b6d9 > _0x1ea8a9) {
      _0x33b6d9 = _0x1ea8a9;
    }
    _0x3f08e6 = (_0x190897 << 16) + (_0x33b6d9 << 8) + _0x1ea8a9;
    _0x4ec8fa = toHex6(_0x3f08e6);
  }
  return _0x4ec8fa;
}
function removeDodgy(_0x4e5b04) {
  if (_0x4e5b04.match(/&.*;/)) {
    _0x4e5b04 = _0x4e5b04.replace(/&apos;/g, "'").replace(/&quot;/g, "\"").replace(/&amp;/g, "＆").replace(/&slsh;/g, "\\").replace(/&gt;/g, "〉").replace(/&lt;/g, "〈");
  }
  return _0x4e5b04;
}
function ProcessName(_0x5040ae, _0x1a046a, _0x10fde6) {
  if (_0x5040ae === undefined) {
    _0x5040ae = "";
  }
  if (_0x1a046a === undefined) {
    _0x1a046a = 0;
  }
  if (_0x10fde6 === undefined) {
    _0x10fde6 = "";
  }
  const _0x1a8ce0 = {};
  if (_0x10fde6 && typeof _0x10fde6 == "string") {
    const _0x45351b = _0x10fde6.split("#");
    _0x1a8ce0.statusColor = hasDarkMode() ? "#969696" : 0;
    if (_0x1a046a & NamePowers.status) {
      _0x1a8ce0.status = _0x45351b[0].replace(/_/g, " ");
    }
    if (_0x1a046a & NamePowers.statusglow && _0x45351b.length > 1) {
      _0x1a8ce0.statusGlow = DecodeColor(_0x45351b[1], _0x1a046a);
      if (_0x1a046a & NamePowers.statuscol && _0x45351b.length > 2) {
        _0x1a8ce0.statusColor = DecodeColor(_0x45351b[2], _0x1a046a);
      }
    }
  }
  if (_0x5040ae) {
    _0x1a8ce0.name = _0x5040ae.replace(/\s*\(\uFEFF?hat#.*?\)\s*/gi, " ").replace(/\s*\(\uFEFF?pawn.*?\)\s*/gi, " ").replace(/\s*\(\uFEFF?text.*?\)\s*/gi, " ").replace(/\s*\(\uFEFF?glow.*?\)\s*/gi, " ").replace(/[\s_]*$/gi, "");
    if (_0x1a046a & NamePowers.nospace) {
      _0x1a8ce0.name = _0x1a8ce0.name.replace(/_/g, " ");
    }
    let _0x39da04 = -1;
    if (_0x1a046a & NamePowers.glow && (_0x39da04 = _0x5040ae.toLowerCase().indexOf("(glow")) != -1) {
      const _0x5d472f = _0x5040ae.slice(_0x39da04, _0x5040ae.indexOf(")", _0x39da04)).split("#");
      if (_0x5d472f[0]) {
        _0x1a8ce0.glow = 65280;
      }
      if (_0x5d472f[1]) {
        _0x1a8ce0.glow = DecodeColor(_0x5d472f[1], _0x1a046a);
      }
      if (_0x5d472f[2] == "grad" && _0x1a046a & NamePowers.grad) {
        if (_0x5d472f.length - 3 == 1 && _0x5d472f[3]) {
          _0x1a8ce0.color = DecodeColor(_0x5d472f[3], _0x1a046a);
        } else {
          _0x1a8ce0.grad = [];
          _0x1a046a |= NamePowers.valid;
          for (let _0x3f065b = 3; _0x3f065b < _0x5d472f.length; _0x3f065b++) {
            const _0x4285aa = _0x5d472f[_0x3f065b][0];
            if (_0x4285aa != "o" && (_0x4285aa != "f" || _0x5d472f[_0x3f065b].length == 6) || _0x1a046a & NamePowers.wave) {
              _0x1a8ce0.grad.push(DecodeColor(_0x5d472f[_0x3f065b], _0x1a046a));
            }
          }
          if (_0x1a046a & NamePowers.wave) {
            _0x1a8ce0.grad.push("NW");
          }
        }
      } else if (_0x5d472f[2] == "jewel" && _0x1a046a & NamePowers.jewel) {
        _0x1a8ce0.flag = [];
        for (let _0x53c52f = 2; _0x53c52f < _0x5d472f.length; _0x53c52f++) {
          _0x1a8ce0.flag[_0x53c52f - 2] = _0x5d472f[_0x53c52f];
        }
      } else if (_0x5d472f[2] == "flag" && _0x1a046a & NamePowers.flag) {
        _0x1a8ce0.flag = [];
        for (let _0x3558e4 = 3; _0x3558e4 < _0x5d472f.length; _0x3558e4++) {
          _0x1a8ce0.flag[_0x3558e4 - 3] = _0x5d472f[_0x3558e4];
        }
      } else if (_0x1a046a & NamePowers.col && _0x5d472f[2]) {
        _0x1a8ce0.color = DecodeColor(_0x5d472f[2], _0x1a046a);
      }
    }
    let _0x52db39 = -1;
    if ((_0x52db39 = _0x5040ae.toLowerCase().indexOf("pawn")) != -1) {
      if (_0x1a046a & NamePowers.jewel || _0x1a046a & NamePowers.everypower) {
        let _0x3c55db = _0x5040ae.slice(_0x52db39, _0x5040ae.indexOf(")", _0x52db39)).split("#");
        _0x1a8ce0.pawncolor = DecodeColor(_0x3c55db[1], _0x1a046a);
      }
    }
  }
  return _0x1a8ce0;
}
function addGlow(_0x5db564, _0x4f4aa0, _0x2d77b2) {
  const _0x343929 = _0x5db564.cloneNode(!0);
  let _0x14e044;
  _0x343929.className = "userNick nameGlow";
  _0x343929.style.cssText = "position: absolute; left: 0; z-index: -1;";
  if (_0x14e044 = _0x343929.querySelector(".nameGlow")) {
    _0x14e044.remove();
  }
  _0x5db564.appendChild(_0x343929);
  const _0x279f09 = [..._0x343929.querySelectorAll("[data-sm]")];
  for (let _0x1f7464 = 0; _0x1f7464 < _0x279f09.length; _0x1f7464++) {
    const _0x2bc6e7 = _0x279f09[_0x1f7464];
    _0x2bc6e7.innerHTML = "";
    _0x2bc6e7.dataset.noload = !0;
  }
  _0x5db564.style.position = "relative";
  _0x343929.style.textShadow = MakeGlow(_0x4f4aa0.glow);
  _0x343929.style["-webkit-text-fill-color"] = "transparent";
}
function createNameSm(_0x1187d6, _0x3d9d60, _0x230590) {
  if (_0x230590 === undefined) {
    _0x230590 = {};
  }
  const {
    flags: _0x3bf116 = 0,
    pawn: _0x181a17,
    status: _0x3c6897 = "",
    statusfx: _0x4bb227 = "",
    userId: _0x458416,
    xNum: _0x255b9a = 0,
    parent: _0x13ff5c,
    fromActions: _0xd5bc4 = !1,
    forceStatus: _0x50edeb = !1
  } = _0x230590;
  _0x230590.align3 = !0;
  _0x230590.align2 = !1;
  const _0x5d8e6a = ProcessName(_0x3d9d60 = removeDodgy(_0x3d9d60), _0x3bf116 | NamePowers.nospace, removeDodgy(_0x3c6897));
  
  
  
  
  let _0x2cbe91 = _0x181a17;
  if (_0x181a17 && _0x5d8e6a.pawncolor) {
    const _0x531aff = _0x181a17.slice(1, -1).split("#");
    if (_0x5d8e6a.pawncolor) {
      _0x531aff[1] = toHex6(_0x5d8e6a.pawncolor);
    }
    _0x2cbe91 = "(" + _0x531aff.join("#") + ")";
  }
  
  
  
  
  
  if (_0xd5bc4) {
    _0x5d8e6a.name = actions.stripParenthesesAndReduceString(_0x5d8e6a.name);
  }
  if (_0x50edeb && _0x3c6897) {
    _0x5d8e6a.status = _0x3c6897;
  }
  const _0x5e34b8 = createTextSm(_0x1187d6, (_0x2cbe91 || "") + _0x5d8e6a.name, _0x230590);
  if (_0x5d8e6a.status) {
    const _0x4c8970 = _0x4bb227 ? _0x4bb227.replaceAll("#", "").split(",") : [];
    const _0x15acae = _0x4c8970.length ? xInt(_0x4c8970[0]) : 0;
    let _0x394f72 = {};
    if (_0x4c8970.length && IsAnimationOn()) {
      try {
        let _0x3c18b4 = decodeURIComponent(escape(atob(_0x4c8970[1])));
        if (!_0x3c18b4.endsWith("}")) {
          _0x3c18b4 += "}";
        }
        _0x394f72 = JSON.parse(_0x3c18b4);
      } catch (_0x4f450f) {
        _0x394f72 = {};
      }
    }
    _0x13ff5c.classList.add("hasStatus");
    const _0x390c4b = makeElement(_0x1187d6, "p", null, "status" + _0x458416);
    _0x390c4b.className = "visitorsStatus darkStatus";
    const _0x2689de = makeElement(_0x390c4b, "p", null, "statusText" + _0x458416);
    _0x2689de.style.display = "inline-block";
    if ("statusGlow" in _0x5d8e6a) {
      _0x390c4b.style["text-shadow"] = MakeGlow(_0x5d8e6a.statusGlow);
    }
    if ("statusColor" in _0x5d8e6a) {
      _0x390c4b.style.color = "#" + toHex6(_0x5d8e6a.statusColor);
    }
    if (_0x255b9a) {
      _0x390c4b.style.left = "calc(1.2rem + 20px + .35rem)";
    }
    if (!_Activity?.instance?.IsClassic) {
      _0x390c4b.style.top = "1rem";
    }
    createStatusfx(_0x5d8e6a.status, _0x394f72, _0x458416, _0x15acae, _0x394f72.effect == "translucent" ? _0x5d8e6a.statusGlow : null, _0x390c4b, _0x2689de);
  }
  if (_0x5d8e6a.grad) {
    const _0x133cce = MakeGrad(_0x5d8e6a.grad);
    _0x5e34b8.classList.add("clip");
    _0x5e34b8.style.backgroundImage = _0x133cce[1];
    if (_0x5d8e6a.grad.join("").toLowerCase().includes("o3")) {
      _0x5e34b8.style.backgroundSize = "220% 100%";
    }
    if (_0x133cce[0] && IsAnimationOn()) {
      _0x5e34b8.className += " nameWave";
      _0x5e34b8.style.animationDuration = _0x133cce[0] + "s";
    }
    addGlow(_0x5e34b8, _0x5d8e6a, _0x230590);
    return _0x5e34b8;
  }
  if (_0x5d8e6a.flag) {
    const _0x5c99c3 = _0x5d8e6a.flag[0] || "x";
    const _0x199dcd = _0x5c99c3 == "jewel" ? "png" : "svg";
    const _0x2b9664 = new Image();
    _0x2b9664.src = "/images/js/flag/" + _0x5c99c3 + "." + _0x199dcd;
    _0x2b9664.onload = _0x62a4a9 => {
      _0x5e34b8.classList.add("clip");
      nameFlag(_0x5d8e6a.flag, _0x5e34b8, _0x62a4a9.target, _0x3bf116);
    };
    addGlow(_0x5e34b8, _0x5d8e6a, _0x230590);
    return _0x5e34b8;
  }
  if (_0x5d8e6a.glow || _0x5d8e6a.glow == 0) {
    _0x5e34b8.style.textShadow = MakeGlow(_0x5d8e6a.glow);
  }
  if (_0x5d8e6a.color) {
    _0x5e34b8.style.color = "#" + toHex6(_0x5d8e6a.color);
  }
  return _0x5e34b8;
}
const appCodes = {
  "30008": "trade",
  "10000": "doodle2",
  "30004": "grid",
  "20034": "translator",
  "40000": "live",
  "60201": "spacewar",
  "60193": "matchrace",
  "60189": "doodlerace",
  "60195": "snakerace",
  "60239": "switch",
  "60225": "hearts",
  "60247": "darts",
  "60257": "zwhack",
  "20038": "stick",
  "20042": "music",
  "20002": "chess",
  "20010": "fourinarow",
  "60002": "canvas",
  "20006": "pool",
  "20012": "supercycle",
  "20008": "nuclear",
  "20009": "count",
  "60685": "pawns"
};
function Debounce(_0x43624e) {
  let _0x5e732a;
  return function () {
    for (var _0x19fb14 = arguments.length, _0x522575 = new Array(_0x19fb14), _0x4ff89e = 0; _0x4ff89e < _0x19fb14; _0x4ff89e++) {
      _0x522575[_0x4ff89e] = arguments[_0x4ff89e];
    }
    if (_0x5e732a) {
      cancelAnimationFrame(_0x5e732a);
    }
    _0x5e732a = requestAnimationFrame(() => {
      _0x43624e(..._0x522575);
    });
  };
}
function getOccurrencesCount(_0x48a67a, _0x3c832d) {
  return (_0x3c832d.match(new RegExp(_0x48a67a, "g")) || []).length;
}
function runWhen(_0x15ec0, _0xe73056) {
  if (_0x15ec0) {
    _0xe73056();
  } else {
    window.setTimeout(() => runWhen(_0x15ec0, _0xe73056), 100);
  }
}
function createTextSm(_0x1d93a2, _0x5f0b65, _0x40ace0 = {}) {
  const {
    maxSmilies: _0x45fb63 = 10,
    flags: _0x533b5e = 0,
    flags2: _0x56b37f = 0,
    useMarkdown: _0x35d6ad,
    useLinks: _0x3cb290,
    smClass: _0x29292b = "messageSm",
    align2: _0x11eb7c,
    pawnFlags: _0x3b4e22,
    xNum: _0x14be9d = 0,
    pawnTooltip: _0x3a98f0,
    scrollParent: _0x56f249,
    userId: _0x5f2279,
    userName: _0x40f666,
    useMark: _0x33c371,
    className: _0x2fe262 = "messageText",
    size: _0x386a0b = 20,
    align3: _0x4994dd = !0,
    relation: _0x6b7763,
    flagPawn: _0x2adb9a = "",
    hasBig: _0x3e6742,
    showTooltip: _0x2b483b = !0,
    isName: _0x391995 = !1
  } = _0x40ace0;
  _0x5f0b65 = removeDodgy(_0x5f0b65);
  _0x1d93a2.documentBody = document.body;
  let _0xce80e5 = _0x5f0b65.trim().split(/(\([a-zA-Z0-9].*?\)|<.*?>|[ \t]+)/).filter(_0x324806 => _0x324806?.length);
  let _0x1a413e = "";
  for (const _0x1f3631 in _0xce80e5) {
    if (_0x1a413e && _0xce80e5[_0x1f3631].startsWith("(") && _0x1a413e.slice(-1) == "﻿") {
      _0xce80e5[_0x1f3631] = _0xce80e5[_0x1f3631].replace("(", "(﻿");
      _0x1a413e = "";
    }
    _0x1a413e = _0xce80e5[_0x1f3631];
  }
  const _0x3849c6 = _0x3e6742 && _0xce80e5.length == 1 && _0xce80e5[0][0] == "(" && _0xce80e5[0].indexOf("#size#w") == -1;
  const _0x4649ea = _Activity.instance.UserSettings?.inappwords != "disable";
  const _0x233058 = makeElement(_0x1d93a2, "span", _0x2fe262);
  _0x233058.holder = _0x1d93a2;
  if (_0x533b5e & NamePowers.italic || _0x5f0b65.substr(0, 6) == "<inf8>" || _0x2fe262 != "userNick" && _0x5f2279 == 0) {
    _0x233058.style.fontStyle = "italic";
  }
  const _0x1dce89 = {
    bold: !1,
    italic: !1,
    strike: !1,
    quote: !1,
    quoteId: !1,
    hyperText: !1
  };
  let _0x51bc84 = 0;
  let _0x3f0968 = !1;
  let _0xc4a3bf = _0x1dce89;
  let _0x3f3279 = "";
  let _0x3a0a77 = "";
  let _0x482aa5 = 0;
  const _0x5981ac = /\[.*?\]\(.*?\)/.test(_0x5f0b65);
  for (let _0x53b5a8 = 0; _0x53b5a8 < _0xce80e5.length; _0x53b5a8++) {
    let _0x5547a7 = _0xce80e5[_0x53b5a8];
    let _0x11b030 = !1;
    let _0x322a64 = WordIsLink(_0x5547a7);
    if (_0x35d6ad) {
      let _0x53a521 = 0;
      let _0x2517fc = 0;
      let _0x57ba9a = 0;
      let _0x4348b3 = 0;
      if (_0x5981ac && (_0xc4a3bf.hyperText || (_0x57ba9a = _0x5547a7.indexOf("[")) != -1 && _0x5547a7.indexOf("❯") == -1)) {
        _0x3f0968 = !0;
        if ((_0x57ba9a = _0x5547a7.indexOf("](")) != -1 && (_0x4348b3 = _0x5547a7.indexOf(")", _0x57ba9a + 1)) > _0x57ba9a && _0x4348b3 - _0x57ba9a > 1) {
          const _0x1b6232 = _0x5547a7.split("](");
          const _0xb92dbd = _0x1b6232[1].split(")");
          const _0x2c184d = _0xb92dbd[0];
          const _0x428b5b = WordIsLink(_0x2c184d);
          if (_0x428b5b) {
            if (_0x5547a7.indexOf("[") != -1) {
              const _0x31bc1c = _0x1b6232[0].split("[");
              _0x3f3279 += _0x31bc1c[1];
              _0xb92dbd[1] = _0x31bc1c[0];
            } else {
              _0x3f3279 += _0x1b6232[0];
            }
            const _0x26862d = makeElement(_0x233058, "a", "msgLink");
            _0x26862d.style.color = "#190046";
            addText(_0x26862d, _0x3f3279, !0);
            if (_0x428b5b.c) {
              _0x26862d.style.color = _0x428b5b.c;
              if (_0x428b5b.l && !_0x428b5b.callBack) {
                _0x26862d.addEventListener("click", _0x343a8d => {
                  _0x343a8d.preventDefault();
                  handleLink(_0x343a8d, _0x428b5b.l, _0x40f666);
                });
              } else {
                _0x26862d.addEventListener("click", _0x428b5b.callBack);
              }
            } else {
              _0x26862d.addEventListener("mousedown", _0x339cf4 => {
                _0x339cf4.preventDefault();
                if (_0x339cf4.which == 2) {
                  handleLink(_0x339cf4, _0x2c184d, _0x40f666);
                }
              });
              _0x26862d.addEventListener("click", _0x381beb => {
                _0x381beb.preventDefault();
                handleLink(_0x381beb, _0x2c184d, _0x40f666);
              });
            }
            if (_0x428b5b.c) {
              _0x26862d.dataset.dark = true;
            } else {
              _0x26862d.dataset.dark2 = true;
            }
            _0xc4a3bf.hyperText = !1;
            numberOfHyperTexts++;
            _0x322a64 = !1;
            _0x3f3279 = "";
            if (!(_0x5547a7 = _0xb92dbd[1])) {
              continue;
            }
          } else {
            if (_0x3f3279.length && _0x3f3279[0] != "[") {
              _0x3f3279 = "[" + _0x3f3279;
            }
            _0xc4a3bf.hyperText = !1;
            _0x5547a7 = "" + _0x3f3279 + _0x5547a7;
            _0x3f3279 = "";
            _0x322a64 = !1;
          }
        } else if (_0x5547a7.indexOf("[") != -1) {
          if (_0x53b5a8 != _0xce80e5.length - 1) {
            _0xc4a3bf.hyperText = !0;
            const _0x15c055 = _0x5547a7.split("[");
            _0x3f3279 += _0x15c055[1];
            _0x5547a7 = _0x15c055[0];
          }
        } else {
          _0xc4a3bf.hyperText = !0;
          _0x3f3279 += _0x5547a7;
          if (_0x53b5a8 != _0xce80e5.length - 1) {
            continue;
          }
          _0xc4a3bf.hyperText = !1;
          _0x5547a7 = "[" + _0x3f3279;
          _0x3f3279 = "";
          _0x322a64 = !1;
        }
      }
      if (_0x3f0968 && _0xc4a3bf.bold && _0xc4a3bf.bold || (_0x57ba9a = _0x5547a7.indexOf("*")) != -1 && getOccurrencesCount("\\*", _0x5f0b65) > 1) {
        if (!_0xc4a3bf.bold && (_0x4348b3 = _0x5547a7.lastIndexOf("*")) > _0x57ba9a && _0x4348b3 - _0x57ba9a > 1) {
          if (!_0x322a64 || _0x57ba9a <= 0 || _0x57ba9a <= 0 && _0x4348b3 >= _0x5547a7.length - 1) {
            const _0x3c3e55 = _0x5547a7.slice(_0x57ba9a, _0x4348b3 + 1);
            const _0x1a3f61 = _0x3c3e55.replace("*", "").replace(/\*$/, "");
            _0x5547a7 = _0x5547a7.replace(_0x3c3e55, "<strong style=\"font-family: Arial Black, Arial Bold, Gadget, sans-serif; user-select: auto;\">" + _0x1a3f61 + "</strong>");
            _0x3f0968 = !0;
            _0x322a64 &&= WordIsLink(_0x1a3f61);
          }
        } else {
          _0x3f0968 = !0;
          if (_0xc4a3bf.bold && _0x5547a7.indexOf("*") != -1) {
            _0xc4a3bf.bold = false;
          } else {
            _0xc4a3bf.bold = true;
          }
          const _0x315f4a = _0x5547a7.replace("*", "");
          _0x5547a7 = "<strong style=\"font-family: Arial Black, Arial Bold, Gadget, sans-serif; user-select: auto;\">" + _0x315f4a + "</strong>";
          _0x322a64 &&= WordIsLink(_0x315f4a);
        }
      }
      if (_0x3f0968 && _0xc4a3bf.italic || (_0x57ba9a = _0x5547a7.indexOf("_")) != -1 && getOccurrencesCount("_", _0x5f0b65) > 1) {
        if (!_0xc4a3bf.italic && (_0x4348b3 = _0x5547a7.lastIndexOf("_")) > _0x57ba9a && _0x4348b3 - _0x57ba9a > 1) {
          if ((!(_0x53a521 = _0x5547a7[_0x57ba9a - 1]) || _0x53a521 == " ") && (!(_0x2517fc = _0x5547a7[_0x4348b3 + 1]) || _0x2517fc == " ") && (!_0x322a64 || _0x57ba9a <= 0 || _0x57ba9a <= 0 && _0x4348b3 >= _0x5547a7.length - 1)) {
            const _0x4a5231 = _0x5547a7.slice(_0x57ba9a, _0x4348b3 + 1);
            const _0x5ec2a9 = _0x4a5231.replace("_", "").replace(/_$/, "");
            _0x5547a7 = _0x5547a7.replace(_0x4a5231, "<em style='user-select: auto;'>" + _0x5ec2a9 + "</em>");
            _0x3f0968 = !0;
            _0x322a64 &&= WordIsLink(_0x5ec2a9);
          }
        } else {
          _0x3f0968 = !0;
          if (_0xc4a3bf.italic && _0x5547a7.indexOf("_") != -1) {
            _0xc4a3bf.italic = false;
          } else {
            _0xc4a3bf.italic = true;
          }
          const _0x4c297d = _0x5547a7.replace("_", "");
          _0x5547a7 = "<em style='user-select: auto;'>" + _0x4c297d + "</em>";
          _0x322a64 &&= WordIsLink(_0x4c297d);
        }
      }
      if (_0x3f0968 && _0xc4a3bf.strike || (_0x57ba9a = _0x5547a7.indexOf("~")) != -1 && getOccurrencesCount("~", _0x5f0b65) > 1) {
        if (!_0xc4a3bf.strike && (_0x4348b3 = _0x5547a7.lastIndexOf("~")) > _0x57ba9a && _0x4348b3 - _0x57ba9a > 1) {
          if (!_0x322a64 || _0x57ba9a <= 0 || _0x57ba9a <= 0 && _0x4348b3 >= _0x5547a7.length - 1) {
            const _0x1b5834 = _0x5547a7.slice(_0x57ba9a, _0x4348b3 + 1);
            const _0x571a51 = _0x1b5834.replace("~", "").replace(/~$/, "");
            _0x5547a7 = _0x5547a7.replace(_0x1b5834, "<del style='user-select: auto;'>" + _0x571a51 + "</del>");
            _0x3f0968 = !0;
            _0x322a64 &&= WordIsLink(_0x571a51);
          }
        } else {
          _0x3f0968 = !0;
          if (_0xc4a3bf.strike && _0x5547a7.indexOf("~") != -1) {
            _0xc4a3bf.strike = false;
          } else {
            _0xc4a3bf.strike = true;
          }
          const _0x5ab00d = _0x5547a7.replace("~", "");
          _0x5547a7 = "<del style='user-select: auto;'>" + _0x5ab00d + "</del>";
          _0x322a64 &&= WordIsLink(_0x5ab00d);
        }
      }
      if (_0xc4a3bf.quote || _0x482aa5 < 1 && (_0x57ba9a = _0x5547a7.indexOf("❯[")) != -1 && _0x5547a7.indexOf("❯#") == -1) {
        if (!_0xc4a3bf.quote && (_0x4348b3 = _0x5547a7.indexOf("]", _0x57ba9a + 1)) > _0x57ba9a && _0x4348b3 - _0x57ba9a > 1) {
          _0x482aa5++;
          let _0x18d0ee = _0x5547a7.slice(_0x57ba9a, _0x4348b3 + 1);
          _0x18d0ee = cleanXatTagsIcons(_0x18d0ee);
          _0x5547a7 = _0x5547a7.replace(_0x18d0ee, "<p class=\"blockquote\"><span class=\"pill\"></span>" + _0x18d0ee.replace("❯[", "").replace("]", "") + "</p>");
          _0x11b030 = _0x3f0968 = !0;
        } else {
          _0x3f0968 = !0;
          if (_0x5547a7.indexOf("[") != -1) {
            if (_0x53b5a8 != _0xce80e5.length - 1) {
              _0xc4a3bf.quote = !0;
              const _0x57d621 = _0x5547a7.split("❯[");
              _0x3a0a77 += _0x57d621[1].replace("❯[", "");
              _0x5547a7 = _0x57d621[0] + "<p class=\"blockquoteContent\"></p>";
            }
          } else if (_0x5547a7.indexOf("]") != -1) {
            _0x482aa5++;
            const _0x578796 = _0x5547a7.split("]");
            _0x3a0a77 += _0x578796[0];
            _0x3a0a77 = cleanXatTagsIcons(_0x3a0a77);
            _0x233058.querySelector(".blockquoteContent").insertAdjacentHTML("beforeend", "<p class=\"blockquote\"><span class=\"pill\"></span>" + _0x3a0a77 + "</p>");
            _0xc4a3bf.quote = !1;
            _0x3a0a77 = "";
            if (_0x322a64 && _0x578796[1]) {
              _0x322a64 = WordIsLink(_0x578796[1]);
            }
            if (!(_0x5547a7 = _0x578796[1])) {
              continue;
            }
          } else {
            _0xc4a3bf.quote = !0;
            _0x3a0a77 += _0x5547a7;
            if (_0x53b5a8 != _0xce80e5.length - 1) {
              continue;
            }
            _0xc4a3bf.quote = !1;
            _0x5547a7 = "❯[" + _0x3a0a77;
          }
        }
      }
      if (_0xc4a3bf.quoteId || _0x482aa5 < 1 && (_0x57ba9a = _0x5547a7.indexOf("❯#")) != -1 && _0x5547a7.indexOf("[") != -1) {
        if (!_0xc4a3bf.quoteId && (_0x4348b3 = _0x5547a7.indexOf("]", _0x57ba9a + 1)) > _0x57ba9a && _0x4348b3 - _0x57ba9a > 1) {
          _0x482aa5++;
          let _0x3370b0 = _0x5547a7.slice(_0x57ba9a, _0x4348b3 + 1);
          _0x3370b0 = cleanXatTagsIcons(_0x3370b0);
          _0x5547a7 = _0x5547a7.replace(_0x3370b0, "<p class=\"blockquote\"><span class=\"pill\"></span>" + _0x3370b0.replace(/(\❯\#.*?)\[/, "").replace("]", "") + "</p>");
          _0x11b030 = _0x3f0968 = !0;
        } else {
          _0x3f0968 = !0;
          if (_0x5547a7.indexOf("[") != -1) {
            if (_0x53b5a8 != _0xce80e5.length - 1) {
              _0xc4a3bf.quoteId = !0;
              const _0x3a99c3 = _0x5547a7.split(/\❯\#.*?\[/);
              const _0xdad319 = _0x5547a7.match(/\❯\#(.*?)\[/)[1];
              _0x3a0a77 += _0x3a99c3[1].replace(/(\❯\#.*?)\[/, "");
              _0x5547a7 = _0x3a99c3[0] + "<p class=\"blockquoteContent\" data-quote=\"" + _0xdad319 + "\"></p>";
            }
          } else if (_0x5547a7.indexOf("]") != -1) {
            _0x482aa5++;
            const _0x2d310d = _0x5547a7.split("]");
            _0x3a0a77 += _0x2d310d[0].replace(/\(.*?\)/g, "");
            _0x3a0a77 = cleanXatTagsIcons(_0x3a0a77);
            const _0x582bee = _0x233058.querySelector(".blockquoteContent");
            _0x582bee.insertAdjacentHTML("beforeend", "<p class=\"blockquote\"><span class=\"pill\"></span>" + _0x3a0a77 + "</p>");
            if (_0x322a64 && _0x2d310d[1]) {
              _0x322a64 = WordIsLink(_0x2d310d[1]);
            }
            let _0x2e5a48 = document.querySelector("[data-msgid=\"" + _0x582bee.dataset.quote + "\"]");
            if (_0x2e5a48) {
              addToolTip(_0x582bee, ["mob2.originalmsg", "Go to original message"], {
                position: "low"
              });
              _0x582bee.addEventListener("click", _0x54dab1 => {
                if (_0x2e5a48) {
                  _0x2e5a48.scrollIntoView({
                    behavior: "smooth",
                    block: "end"
                  });
                }
              });
            }
            _0xc4a3bf.quoteId = !1;
            _0x3a0a77 = "";
            if (!(_0x5547a7 = _0x2d310d[1])) {
              continue;
            }
          } else {
            _0xc4a3bf.quoteId = !0;
            _0x3a0a77 += _0x5547a7;
            _0x3a0a77 = cleanXatTagsIcons(_0x3a0a77);
            if (_0x53b5a8 != _0xce80e5.length - 1) {
              continue;
            }
            {
              const _0x1cc8b0 = _0x233058.querySelector(".blockquoteContent");
              _0xc4a3bf.quoteId = !1;
              _0x5547a7 = "❯#" + _0x1cc8b0.dataset.quote + "[" + _0x3a0a77;
            }
          }
        }
      }
    }
    if (!_0x3cb290 || !_0x322a64 || _0x322a64[0] == "(" && _0x322a64[_0x322a64.length - 1] == ")") {
      if (_0x5547a7.length > 2) {
        let _0x56ce6a = _0x5547a7;
        const _0x1919c5 = _0x5547a7.match(/(\(.*?\))/);
        if (_0x1919c5) {
          _0x56ce6a = _0x1919c5[1];
        }
        if (_0x56ce6a[0] == "(" && _0x56ce6a[_0x56ce6a.length - 1] == ")" && _0x56ce6a[1] != "﻿" && _0x56ce6a[1] != " ") {
          if (_0x51bc84 == _0x45fb63 || _0x5547a7.toLowerCase() == "(glow)" || _0x5547a7.toLowerCase() == "(none)" || _0x5547a7.toLowerCase().indexOf("(none#") >= 0 || _0x5547a7.toLowerCase().indexOf("(glow#") >= 0) {
            continue;
          }
          const _0x54d155 = _0x56ce6a.substr(0, 3) == "(p1";
          let _0x392c09 = _0x54d155 ? _0x3a98f0 : _0x56ce6a;
          let _0x30307c = _0x54d155 ? "left" : "top";
          const _0x117cf9 = _Activity.instance.Smilies.MakeSmiley(_0x233058, _0x56ce6a, {
            size: _0x3849c6 ? _0x386a0b * 2 : _0x386a0b,
            align2: _0x11eb7c,
            align3: _0x4994dd,
            addGback: !0,
            userID: _0x5f2279,
            showAd: !_0x54d155,
            userName: _0x40f666,
            scrollParent: _0x56f249,
            className: _0x29292b + (_0x3849c6 ? " big" : ""),
            _window: window,
            applyEffects: !_0x54d155 && getSettingsValue("ultrasmiley") === "enable",
            pawnFlags: _0x54d155 ? _0x3b4e22 : 0,
            tooltip: _0x2b483b || _0x54d155 ? _0x392c09 : "",
            tooltipPosition: _0x30307c,
            isName: _0x391995
          });
          if (_0x54d155) {
            const _0x1f07d4 = _0x3b4e22 & PawnFlags.isBffed;
            const _0x4c3c9a = _0x3b4e22 & PawnFlags.isMarried;
            let _0x5a76aa = _0x117cf9.querySelector(".pawnStuff");
            _0x5a76aa ||= makeElement(_0x117cf9, "div", "pawnStuff");
            _0x5a76aa.innerHTML = "";
            if (_0x14be9d) {
              _Activity.instance.Smilies.MakeSmiley(_0x233058, _0x14be9d, {
                size: 20,
                userID: _0x5f2279,
                userName: _0x40f666,
                scrollParent: _0x56f249,
                tooltip: ["box.143", "On App"],
                tooltipPosition: "left",
                showAd: false,
                className: "appIcon",
                align2: _0x11eb7c,
                align3: _0x4994dd,
                callback: _0x152126 => {
                  const _0x2ce9bd = {
                    id: _0x5f2279,
                    regname: _0x40f666
                  };
                  _0x152126.stopPropagation();
                  if (_0x14be9d.indexOf("#") >= 0) {
                    openApp(_0x14be9d.split("#")[0]);
                  } else if (_0x14be9d == 10001) {
                    openApp({
                      type: "media",
                      link: null
                    });
                  } else if (_0x14be9d == 20044) {
                    openGift(_0x2ce9bd);
                  } else {
                    openApp(appCodes[_0x14be9d]);
                  }
                }
              });
            }
            if (_0x3b4e22 & PawnFlags.isInvisible) {
              _0x117cf9.style.opacity = 0.35;
            } else {
              _0x117cf9.style.opacity = 1;
            }
            if (_0x56b37f & NamePowers.isBlocked) {
              makeElement(_0x5a76aa, "img", "blockIcon").src = "svg/report2.svg";
            } else {
              if (_0x2adb9a) {
                _Activity.instance.Smilies.MakeSmiley(_0x5a76aa, "(tickle#flgpwn#w" + _0x2adb9a + ")", {
                  size: 20,
                  align2: _0x11eb7c,
                  align3: _0x4994dd,
                  userID: _0x5f2279,
                  showAd: false,
                  userName: _0x40f666,
                  scrollParent: _0x56f249,
                  className: "flagPawn"
                });
              }
              if (_0x3b4e22 & PawnFlags.isAway) {
                _Activity.instance.Smilies.MakeSmiley(_0x5a76aa, "(tickle#away)", {
                  size: 20,
                  align2: _0x11eb7c,
                  align3: _0x4994dd,
                  userID: _0x5f2279,
                  showAd: false,
                  userName: _0x40f666,
                  scrollParent: _0x56f249,
                  className: "away"
                });
              }
            }
            if (_0x4c3c9a || _0x1f07d4) {
              let _0x46ce43;
              let _0x28355c;
              if (_0x6b7763) {
                _0x46ce43 = document.querySelector("[data-user=\"" + _0x6b7763 + "\"]");
                const _0x1096c9 = _0x46ce43.querySelector(".relIcon2");
                _0x1096c9?.parentNode.removeChild(_0x1096c9);
              }
              if (_0x3b4e22 & PawnFlags.isBuddyAbove && _0x1f07d4) {
                _0x28355c = makeElement(_0x5a76aa, "img", Classic ? "relIcon" : "relMob");
                _0x28355c.src = "svg/bffed.svg";
                if (Classic && _0x46ce43?.classList.contains("hasStatus")) {
                  _0x28355c.style.top = "-12px";
                }
              } else if (_0x3b4e22 & PawnFlags.isBuddyAbove && _0x4c3c9a) {
                _0x28355c = makeElement(_0x5a76aa, "img", Classic ? "relIcon" : "relMob");
                _0x28355c.src = "svg/married.svg";
                if (Classic && _0x46ce43?.classList.contains("hasStatus")) {
                  _0x28355c.style.top = "-12px";
                }
              } else if (!!(_0x3b4e22 & PawnFlags.isRegistered) && _0x56ce6a.indexOf("#frnt1#w128") == -1 && _0x56ce6a.indexOf("#frnt1#w288") == -1 && _0x56ce6a.indexOf("#frnt1#w272") == -1 && _0x56ce6a.indexOf("#frnt1#w32") == -1 && _0x56ce6a.indexOf("#frnt1#w16") == -1 && _0x56ce6a.indexOf("#frnt1w256") == -1 && !(_0x3b4e22 & PawnFlags.isBuddyBelow) && !(_0x3b4e22 & PawnFlags.isTyping) && !(_0x3b4e22 & PawnFlags.isAway) && !(_0x3b4e22 & PawnFlags.isGagged)) {
                if (_0x1f07d4) {
                  _0x28355c = makeElement(_0x5a76aa, "img", "relIcon2");
                  _0x28355c.src = "svg/bffed" + (_0x3b4e22 & PawnFlags.isSubscriber ? "" : 2) + ".svg";
                } else if (_0x4c3c9a) {
                  _0x28355c = makeElement(_0x5a76aa, "img", "relIcon2");
                  _0x28355c.src = "svg/married" + (_0x3b4e22 & PawnFlags.isSubscriber ? "" : 2) + ".svg";
                }
              }
            }
          }
          _0x51bc84++;
          continue;
        }
        if (_0x56ce6a[0] == "#" && audiesList.includes(_0x5547a7.substr(1))) {
          const _0xffaeee = makeElement(makeElement(_0x233058, "span"), "img", "speaker");
          _0xffaeee.src = "svg/spk.svg";
          addToolTip(_0xffaeee, _0x56ce6a);
          _0xffaeee.addEventListener("click", _0x51ade4 => {
            doSound(_0x56ce6a.substr(1), !0);
          });
          continue;
        }
        let _0x597f1e;
        const _0x491802 = JSON.parse(_Activity.instance.UserSettings?.marks?.replace(/”/g, "\"") ?? "{}");
        if (!_0x33c371 || _0x11b030 || _0x56ce6a[0] != "<" || _0x56ce6a[1] != "s" || isNaN(_0x56ce6a[2])) {
          if (!_0x11b030 && _Activity.instance.UserSettings?.marks?.length && hasPower(462) && _0x33c371 && _0x56ce6a.length > 2 && (_0x597f1e = _0x491802.find(_0x5d9275 => _0x56ce6a.toLowerCase().indexOf(_0x5d9275.name.toLowerCase()) != -1))) {
            _0x5547a7 = "<span class=\"highlight\" style=\"color: " + (isColorLight(_0x597f1e.color) ? "#000" : "#FFF") + "; background: " + _0x597f1e.color + ";\">" + _0x5547a7 + "</span >";
          } else if (!_0x3f0968 && _0x56ce6a[0] == "<" && _0x56ce6a[_0x56ce6a.length - 1] == ">") {
            const _0x3cb11a = {
              size: _0x386a0b,
              align: !0,
              scrollParent: _0x56f249,
              className: "messageIcon"
            };
            _Activity.instance.Smilies.MakeSmiley(_0x233058, _0x56ce6a, _0x3cb11a);
            continue;
          }
        } else {
          _0x5547a7 = "<span class=\"" + (!_0x4649ea || "swear" + _0x56ce6a[2]) + "\">" + _0x56ce6a.slice(3, -2) + "</span>";
        }
      }
      _0x233058.insertAdjacentHTML("beforeend", _0x5547a7);
    } else {
      const _0x50bfae = makeElement(_0x233058, "a", "msgLink");
      _0x50bfae.style.color = "#190046";
      let _0x11cf14 = !1;
      if (_Activity?.instance?.QuickBar?.isGiphyLink(_0x5547a7)) {
        _0x11cf14 = _Activity?.instance?.QuickBar?.getGifSettings() != "disable" && _0x40f666;
      }
      if (_0x11cf14) {
        _0x50bfae.classList.add("d-none");
        _0x50bfae.dataset.giphy = "1";
      }
      addText(_0x50bfae, _0x5547a7, _0x3f0968);
      addEventToLink(_0x322a64, _0x50bfae, _0x40f666);
      if (_0x322a64.c) {
        _0x50bfae.dataset.dark = true;
      } else {
        _0x50bfae.dataset.dark2 = true;
      }
    }
  }
  const _0x1d64b4 = [..._0x233058.querySelectorAll("[class^=\"swear\"]")];
  for (let _0x419b2b = 0; _0x419b2b < _0x1d64b4.length; _0x419b2b++) {
    const _0x5de76e = _0x1d64b4[_0x419b2b];
    _0x5de76e.onclick = () => _0x5de76e.className = "";
  }
  return _0x233058;
}
function addEventToLink(_0xf54aca, _0x2828d5, _0xe528d0) {
  if (typeof _0xf54aca == "object") {
    _0x2828d5.style.color = _0xf54aca.c;
    if (_0xf54aca.l && !_0xf54aca.callBack) {
      _0x2828d5.addEventListener("click", _0x3a4362 => {
        _0x3a4362.preventDefault();
        handleLink(_0x3a4362, _0xf54aca.l, _0xe528d0);
      });
    } else {
      _0x2828d5.addEventListener("click", _0xf54aca.callBack);
    }
  } else {
    _0x2828d5.addEventListener("mousedown", _0x1ade07 => {
      _0x1ade07.preventDefault();
      if (_0x1ade07.which == 2) {
        handleLink(_0x1ade07, _0xf54aca, _0xe528d0);
      }
    });
    _0x2828d5.addEventListener("click", _0x2a795b => {
      _0x2a795b.preventDefault();
      handleLink(_0x2a795b, _0xf54aca, _0xe528d0);
    });
  }
}
function createStatusfx(_0x45668b, _0x15cd00, _0x6dc59b, _0x55329a, _0x556069) {
  let {
    effect: _0x179fc3,
    status2: _0x3007c5 = "",
    speed: _0x2785e3 = 2,
    waveFrequency: _0x14da1d = 4
  } = _0x15cd00;
  const _0x51219 = _0x6dc59b === "new" ? document.querySelector("#statusNew") : document.querySelector("#statusText" + _0x6dc59b);
  const _0x189cd8 = _0x51219.parentNode;
  _0x51219.innerText = _0x45668b;
  if (_Activity.instance.UserSettings?.statusfxAnim == "disable") {
    return;
  }
  _0x3007c5 = _0x3007c5.trim();
  _0x3007c5 = _0x3007c5.replace(new RegExp("['\"<>&=]", "gi"), "");
  _0x2785e3 = Math.max(1, Math.min(6, _0x2785e3));
  _0x14da1d = Math.max(1, Math.min(6, _0x14da1d));
  const _0x3bdee6 = Math.SQRT1_2 + 1;
  let _0xe2d407 = _0x51219.offsetWidth;
  if (_0xe2d407 < 26) {
    _0xe2d407 = 26;
  }
  let _0xebbabe = Math.ceil(_0x51219.offsetHeight * _0x3bdee6);
  const _0x22dc99 = _0x51219.parentNode.offsetWidth;
  const _0x222cfa = _0x3bdee6 ** _0x2785e3 + 1;
  let _0x37726d;
  let _0x562acc;
  let _0x5b351b;
  const _0x67bd7b = 500;
  const _0x4a2f10 = StatusEffects.some(_0x2fb9d6 => _0x55329a >= _0x2fb9d6.set && _0x179fc3 == _0x2fb9d6.key);
  if (_0x179fc3 && _0x4a2f10) {
    switch (_0x179fc3) {
      case "scrollleft":
        const _0x398286 = {
          transform: "translateX(" + _0x22dc99 + "px)"
        };
        _0x51219.parentNode.style.overflow = "hidden";
        _0x37726d = Math.round(_0xe2d407 / _0x222cfa) * 1000;
        _0x562acc = Math.round(-_0xe2d407);
        _0x51219.animate([_0x398286, {
          transform: "translateX(" + _0x562acc + "px)"
        }], {
          duration: _0x37726d,
          iterations: "Infinity"
        });
        break;
      case "scrollright":
        const _0x3b09eb = {
          transform: "translateX(" + _0x22dc99 + "px)"
        };
        _0x51219.parentNode.style.overflow = "hidden";
        _0x37726d = Math.round(_0xe2d407 / _0x222cfa) * 1000;
        _0x562acc = Math.round(-_0xe2d407);
        _0x51219.animate([{
          transform: "translateX(" + _0x562acc + "px)"
        }, _0x3b09eb], {
          duration: _0x37726d,
          iterations: "Infinity"
        });
        break;
      case "scrollup":
        _0x51219.parentNode.style.overflow = "hidden";
        if (_0x3007c5) {
          _0xebbabe = (_0xebbabe / _0x3bdee6 + _0x222cfa) * 2;
          _0x37726d = Math.round(_0xebbabe / _0x222cfa) * 1000;
          _0x5b351b = Math.round(-_0xebbabe);
          _0x51219.animate([{
            transform: "translateY(" + -_0x5b351b + "px)"
          }, {
            transform: "translateY(" + _0x5b351b + "px)"
          }], {
            duration: _0x37726d,
            iterations: "Infinity"
          });
          const _0x3e5e6b = makeElement(_0x51219, "p");
          _0x3e5e6b.style.cssText = "position: absolute; top: " + _0xebbabe * (_0x3bdee6 - 1) + "px;";
          _0x3e5e6b.innerHTML = _0x3007c5;
        } else {
          _0x37726d = Math.round(_0xebbabe / _0x222cfa) * 1000;
          _0x5b351b = Math.round(-_0xebbabe);
          _0x51219.animate([{
            transform: "translateY(" + -_0x5b351b + "px)"
          }, {
            transform: "translateY(" + _0x5b351b + "px)"
          }], {
            duration: _0x37726d,
            iterations: "Infinity"
          });
        }
        break;
      case "scrolldown":
        _0x51219.parentNode.style.overflow = "hidden";
        if (_0x3007c5) {
          _0xebbabe = (_0xebbabe / _0x3bdee6 + _0x222cfa) * 2;
          _0x37726d = Math.round(_0xebbabe / _0x222cfa) * 1000;
          _0x5b351b = Math.round(-_0xebbabe);
          _0x51219.animate([{
            transform: "translateY(" + _0x5b351b + "px)"
          }, {
            transform: "translateY(" + -_0x5b351b + "px)"
          }], {
            duration: _0x37726d,
            iterations: "Infinity"
          });
          const _0xc1f659 = makeElement(_0x51219, "p");
          _0xc1f659.style.cssText = "position: absolute; top: -" + _0xebbabe * (_0x3bdee6 - 1) + "px;";
          _0xc1f659.innerHTML = _0x3007c5;
        } else {
          _0x37726d = Math.round(_0xebbabe / _0x222cfa) * 1000;
          _0x5b351b = Math.round(-_0xebbabe);
          _0x51219.animate([{
            transform: "translateY(" + _0x5b351b + "px)"
          }, {
            transform: "translateY(" + -_0x5b351b + "px)"
          }], {
            duration: _0x37726d,
            iterations: "Infinity"
          });
        }
        break;
      case "fadeout":
        const _0x2e5d50 = 500;
        const _0x5c5a20 = 3500;
        const _0x12a8bd = _0x5c5a20 - _0x2785e3 * _0x2e5d50;
        const _0x2fb14d = _0x5c5a20 - _0x2e5d50 * _0x2785e3;
        if (_0x3007c5) {
          _0x51219.animate([{
            opacity: 1,
            offset: 0
          }, {
            opacity: 0,
            offset: _0x12a8bd / (_0x12a8bd + _0x2fb14d)
          }, {
            opacity: 0,
            offset: 1
          }], {
            duration: _0x12a8bd + _0x2fb14d,
            iterations: "Infinity",
            direction: "alternate",
            delay: _0x2fb14d
          });
          const _0xad1a74 = makeElement(_0x51219.parentNode, "p");
          _0xad1a74.style.cssText = "position: absolute; top: 0; opacity: 0";
          _0xad1a74.innerHTML = _0x3007c5;
          _0xad1a74.animate([{
            opacity: 0,
            offset: 0
          }, {
            opacity: 0,
            offset: 1 - _0x12a8bd / (_0x12a8bd + _0x2fb14d)
          }, {
            opacity: 1,
            offset: 1
          }], {
            duration: _0x12a8bd + _0x2fb14d,
            iterations: "Infinity",
            direction: "alternate",
            delay: _0x2fb14d
          });
        } else {
          _0x51219.animate([{
            opacity: 1
          }, {
            opacity: 0
          }], {
            duration: _0x12a8bd,
            iterations: "Infinity",
            direction: "alternate"
          });
        }
        break;
      case "translucent":
        _0x37726d = Math.round(_0xe2d407 / _0x222cfa) * 350;
        const _0x4dfc29 = _0x51219.parentNode.style.color ? _0x51219.parentNode.style.color : document.body.classList.contains("dark") ? "rgb(207, 207, 207)" : "rgb(0, 0, 0)";
        const _0xb79a20 = _0x4dfc29.replace(/rgb/, "rgba").replace(")", ", 0)");
        const _0x18104b = MakeStatusGlow(_0x556069);
        const _0x486ec9 = {
          duration: _0x37726d,
          iterations: "Infinity"
        };
        _0x51219.parentNode.style.filter = "drop-shadow(" + _0x18104b + ") drop-shadow(" + _0x18104b + ")";
        _0x51219.parentNode.style.textShadow = "";
        _0x51219.style.cssText = `
                    color: transparent;
                    background: linear-gradient(90deg, ` + _0x4dfc29 + " 0%, " + _0xb79a20 + " 30%, " + _0xb79a20 + " 70%, " + _0x4dfc29 + ` 100%);
                    background-size: 200%;
                    background-clip: text;
                    -webkit-background-clip: text;
                `;
        _0x51219.animate([{
          backgroundPosition: "200%"
        }, {
          backgroundPosition: "0%"
        }], _0x486ec9);
        break;
      case "bounce":
        const _0x1408c7 = 20;
        const _0xc58f6 = _0x22dc99 - _0xe2d407 - _0x1408c7;
        if (_0xc58f6 >= _0x1408c7) {
          _0x37726d = _0xc58f6 + 3500 / _0x2785e3;
          _0x51219.animate([{
            transform: "translateX(-5px)"
          }, {
            transform: "translateX(" + _0xc58f6 + "px)"
          }], {
            duration: _0x37726d,
            iterations: "Infinity",
            direction: "alternate",
            easing: "ease-in-out"
          });
        }
        break;
      case "shake":
        const _0xceb148 = 350;
        _0x37726d = _0xceb148 * 7 - _0x2785e3 * _0xceb148 + _0xceb148;
        const _0x4293ad = _0xceb148 * 1.7;
        _0x51219.animate([{
          transform: "translate(1px, 1px)"
        }, {
          transform: "translate(-1px, -2px)"
        }, {
          transform: "translate(-3px, 0px)"
        }, {
          transform: "translate(3px, 2px)"
        }, {
          transform: "translate(1px, -1px)"
        }, {
          transform: "translate(-1px, 2px)"
        }, {
          transform: "translate(-3px, 1px)"
        }, {
          transform: "translate(3px, 1px)"
        }, {
          transform: "translate(-1px, -1px)"
        }, {
          transform: "translate(1px, 2px)"
        }, {
          transform: "translate(1px, -2px)"
        }, {
          transform: "translate(0px)",
          offset: _0x37726d / (_0x37726d + _0x4293ad)
        }], {
          duration: _0x37726d + _0x4293ad,
          iterations: "Infinity",
          direction: "alternate",
          easing: "ease-in-out"
        });
        break;
      case "wave":
        const _0x3af234 = 3;
        const _0x3b40d3 = 10;
        const _0x500509 = _0x3b40d3 * 6 - (_0x14da1d - 1) * _0x3b40d3;
        _0x37726d = (_0x3af234 * 6 - _0x2785e3 * _0x3af234 + _0x3af234) / 12;
        _0x51219.innerHTML = "";
        _0x51219.style.transform = "translateY(" + _0x3af234 / 2 + "px)";
        for (const _0x5eecb0 of _0x45668b) {
          const _0x2b4591 = document.createElement("span");
          if (_0x5eecb0 === " ") {
            _0x2b4591.innerHTML = "&nbsp;";
          } else {
            _0x2b4591.textContent = _0x5eecb0;
          }
          _0x2b4591.style.cssText = `
                        display: inline-block;
                        animation-duration: ` + _0x37726d + "s;\n                        animation-name: wave-" + _0x6dc59b + `;
                        animation-iteration-count: infinite;
                        animation-direction: alternate;
                    `;
          _0x51219.appendChild(_0x2b4591);
        }
        document.styleSheets[0].insertRule("\n                    @keyframes wave-" + _0x6dc59b + ` {
                        from { transform : translateY(0); color: white; }
                        to   { transform : translateY(-` + _0x3af234 + `px); }
                    }
                `, 0);
        for (let _0x1df765 = 0; _0x1df765 <= _0x500509; _0x1df765++) {
          document.styleSheets[0].insertRule("\n                        #statusText" + _0x6dc59b + " :nth-child( " + _0x500509 + "n + " + _0x1df765 + " ) {\n                            animation-delay : -" + (_0x500509 - _0x1df765) * 2 * _0x37726d / _0x500509 + `s;
                        }
                    `, 0);
        }
        break;
      case "typing":
        const _0xf9ffc0 = 350 - _0x2785e3 * 50;
        _0x51219.innerHTML = "";
        typeWrite(_0x51219, [..._0x45668b], [..._0x3007c5], _0xf9ffc0);
        makeElement(_0x189cd8, "div", "caret");
        _0x189cd8.style.marginTop = "-1px";
        _0x51219.style.display = "inline-block";
        break;
      case "slideright":
        _0x37726d = (3500 - _0x2785e3 * _0x67bd7b + _0x67bd7b) * 2;
        _0x51219.innerHTML = "";
        for (const [_0x1afc8b, _0x45473e] of [..._0x45668b].entries()) {
          const _0x50993e = makeElement(_0x51219, "span");
          if (_0x45473e === " ") {
            _0x50993e.innerHTML = "&nbsp;";
          } else {
            _0x50993e.textContent = _0x45473e;
          }
          _0x50993e.style.cssText = `
                        opacity: 0;
                        display: inline-block;
                        transform: translateX(-50px);
                    `;
          _0x50993e.animate([{
            opacity: 0
          }, {
            opacity: 0.2
          }, {
            opacity: 0.5,
            transform: "scaleX(1.33)"
          }, {
            opacity: 1,
            transform: "scaleX(1)"
          }, {
            opacity: 1,
            transform: "translate(0px)",
            offset: 0.45
          }, {
            opacity: 1,
            transform: "translate(0px)",
            offset: 0.75
          }, {
            opacity: 1,
            transform: "scaleX(1)"
          }, {
            opacity: 0,
            transform: "translateX(75px) scaleX(1.33)"
          }], {
            delay: (_0x45668b.length - _0x1afc8b) * 100,
            endDelay: (_0x45668b.length - _0x1afc8b) * 100,
            duration: _0x37726d,
            iterations: "Infinity",
            easing: "ease-out"
          });
        }
        break;
      case "slidedown":
        _0x51219.parentNode.style.overflow = "hidden";
        _0x37726d = (3500 - _0x2785e3 * _0x67bd7b + _0x67bd7b) * 2;
        _0x51219.innerHTML = "";
        for (const [_0x45604a, _0x5aaccc] of [..._0x45668b].entries()) {
          const _0x2f7e23 = makeElement(_0x51219, "span");
          if (_0x5aaccc === " ") {
            _0x2f7e23.innerHTML = "&nbsp;";
          } else {
            _0x2f7e23.textContent = _0x5aaccc;
          }
          _0x2f7e23.style.cssText = `
                        opacity: 0;
                        display: inline-block;
                        transform: translateY(-50px);
                    `;
          _0x2f7e23.animate([{
            opacity: 0
          }, {
            opacity: 0.2
          }, {
            opacity: 0.5,
            transform: "scaleY(1.33)"
          }, {
            opacity: 1,
            transform: "scaleY(1)"
          }, {
            opacity: 1,
            transform: "translateY(0px)",
            offset: 0.45
          }, {
            opacity: 1,
            transform: "translateY(0px)",
            offset: 0.75
          }, {
            opacity: 1,
            transform: "scaleY(1)"
          }, {
            opacity: 0,
            transform: "translateY(75px) scaleY(1.33)"
          }], {
            delay: _0x45604a * 100,
            endDelay: (_0x45668b.length - _0x45604a) * 100,
            duration: _0x37726d,
            iterations: "Infinity",
            easing: "ease-out"
          });
        }
        break;
      case "flip":
        _0x37726d = (3500 - _0x2785e3 * _0x67bd7b + _0x67bd7b) * 2;
        _0x51219.innerHTML = "";
        for (const [_0x326d42, _0x201265] of [..._0x45668b].entries()) {
          const _0x52ba91 = makeElement(_0x51219, "span");
          if (_0x201265 === " ") {
            _0x52ba91.innerHTML = "&nbsp;";
          } else {
            _0x52ba91.textContent = _0x201265;
          }
          _0x52ba91.style.cssText = `
                        display: inline-block;
                        transform-origin: bottom;
                        transform: rotateY(-90deg);
                    `;
          _0x52ba91.animate([{
            transform: "rotateY(-90deg)"
          }, {
            transform: "rotateY(0deg)",
            offset: 0.15
          }, {
            transform: "rotateY(0deg)",
            offset: 0.85
          }, {
            transform: "rotateY(-90deg)"
          }], {
            delay: _0x326d42 * 100,
            endDelay: (_0x45668b.length - _0x326d42) * 100,
            duration: _0x37726d,
            iterations: "Infinity",
            easing: "ease-out"
          });
        }
    }
  }
  return _0x51219;
}
function typeWrite(_0x51e46b, _0x5c6df0, _0x523885, _0x2eeb40, _0x47ace4, _0x4f3265) {
  if (_0x47ace4 === undefined) {
    _0x47ace4 = 0;
  }
  if (_0x4f3265 === undefined) {
    _0x4f3265 = 1;
  }
  if (!document.body.contains(_0x51e46b)) {
    return;
  }
  if (_0x4f3265 == 1) {
    if (_0x47ace4 < _0x5c6df0.length) {
      if (_0x5c6df0[_0x47ace4] === " ") {
        _0x51e46b.innerHTML += "&nbsp;";
      } else {
        _0x51e46b.textContent += _0x5c6df0[_0x47ace4];
      }
      // TOLOOK
      setTimeout(() => typeWrite(_0x51e46b, _0x5c6df0, _0x523885, _0x2eeb40, _0x47ace4 + 1, 1), _0x2eeb40);
    } else {
      // TOLOOK
      setTimeout(() => typeWrite(_0x51e46b, _0x5c6df0, _0x523885, _0x2eeb40, 0, -1), _0x2eeb40 + 500);
    }
  } else if (_0x47ace4 <= _0x5c6df0.length) {
    const _0x153a1c = _0x5c6df0.slice(0, _0x5c6df0.length - _0x47ace4).join("");
    _0x51e46b.textContent = _0x153a1c;
    // TOLOOK
    setTimeout(() => typeWrite(_0x51e46b, _0x5c6df0, _0x523885, _0x2eeb40, _0x47ace4 + 1, -1), _0x2eeb40);
  } else {
    // TOLOOK
    setTimeout(() => typeWrite(_0x51e46b, _0x523885, _0x5c6df0, _0x2eeb40, 0, 1), _0x2eeb40 + 500);
  }
}
function getTextWidth(_0x4a4e50, _0xb610b2) {
  const _0x576c5b = (getTextWidth.canvas || (getTextWidth.canvas = document.createElement("canvas"))).getContext("2d");
  _0x576c5b.font = _0xb610b2;
  return _0x576c5b.measureText(_0x4a4e50).width;
}
function doAudies(_0x2228df) {
  if (_0x2228df && _0x2228df.target.dataset.sound) {
    doSound(_0x2228df.target.dataset.sound, true);
  }
}
function zapShake(_0x15ab24, _0x3753da) {
  document.body.classList.add("bump");
  // TOLOOK
  setTimeout(() => {
    document.body.classList.remove("bump");
  }, 1300);
  doSound(_0x15ab24 ? "laserfire3" : _0x3753da || "raspberry");
}
function handleLink(_0x18ab9a, _0x548745, _0x3170b1) {
  if (_0x548745.substring(0, 14) == "xat://buy-xats") {
    openBuyPage(true);
  } else if (_0x548745.indexOf("youtu.be/") != -1 || _0x548745.indexOf("youtube.com/shorts/") != -1 || _0x548745.indexOf("youtube.com/watch?") != -1 && _0x548745.indexOf("v=") != -1 && !_0x18ab9a.ctrlKey) {
    displayVideo(_0x548745, _0x3170b1);
  } else {
    LinkValidator(_0x18ab9a, _0x548745);
  }
}
function displayVideo(_0xfdcc4a, _0x445517) {
  let _0x3a66f8 = _Activity?.instance?.UserSettings?.youtube;
  if (!_Activity?.instance?.IsClassic) {
    _0x3a66f8 = "popup";
  }
  if (_0x3a66f8 == "app") {
    openApp({
      type: "media",
      link: _0xfdcc4a.replace(/＆/g, "&")
    });
  } else {
    let _0xee828 = null;
    let _0x347711 = 0;
    let _0x323f06 = null;
    let _0x5c6ffb = 0;
    setAppIcon(10001);
    _0xee828 = _0xfdcc4a.indexOf("youtu.be/") != -1 ? _0xfdcc4a.split(".be/")[1].split("?")[0] : _0xfdcc4a.indexOf("youtube.com/shorts/") != -1 ? _0xfdcc4a.split("/shorts/")[1].split("?")[0] : _0xfdcc4a.split("v=")[1].split("＆")[0].split("&")[0];
    if (_0xfdcc4a.indexOf("t=") != -1) {
      _0x347711 = xInt(_0xfdcc4a.split("t=")[1].split("＆")[0].split("&")[0]);
    }
    if (_0xfdcc4a.indexOf("list=") != -1) {
      _0x323f06 = _0xfdcc4a.split("list=")[1].split("＆")[0].split("&")[0];
      if (_0xfdcc4a.indexOf("index=") != -1) {
        _0x5c6ffb = _0xfdcc4a.split("index=")[1].split("＆")[0].split("&")[0] - 1;
      }
    }
    resizeBtn = document.querySelector("#playerResize");
    playerToolBar = document.querySelector("#playerToolBar");
    playerContainer = document.querySelector("#playerContainer");
    let _0x1bfd89 = _Activity.instance.Sound & 8 ? _Activity.instance.Volume[3] : 0;
    if (Player) {
      let _0x14bf5d = document.querySelector("#playerTitle");
      let _0x229c57 = GetTranslation("mob2.sentby") + " " + _0x445517;
      if (!_0x229c57) {
        _0x229c57 = "Sent by " + _0x445517;
      }
      _0x14bf5d.innerHTML = _0x229c57;
      playerContainer.style.display = "block";
      if (_0x323f06) {
        Playlist = true;
        Player.loadPlaylist({
          list: _0x323f06,
          listType: "playlist",
          index: _0x5c6ffb,
          startSeconds: _0x347711
        });
      } else {
        Playlist = false;
        Player.loadVideoById(_0xee828, _0x347711);
      }
      Player.setVolume(_0x1bfd89);
    } else {
      let _0x55d277 = document.createElement("script");
      _0x55d277.src = "https://www.youtube.com/iframe_api";
      let _0xb58052 = document.getElementsByTagName("script")[0];
      _0xb58052.parentNode.insertBefore(_0x55d277, _0xb58052);
      addToolTip(playerToolBar, ["mob2.minimize", "Double-click to minimize"], {
        position: "low"
      });
      window.onYouTubeIframeAPIReady = () => {
        Player = new YT.Player("player", {
          width: "260",
          height: "146",
          playerVars: {
            playsinline: 1
          },
          events: {
            onStateChange: _0x5b7f8a => {
              if (!(_0x5b7f8a.data != YT.PlayerState.ENDED || Playlist)) {
                setAppIcon(0);
                playerContainer.style.display = "none";
                Player.stopVideo();
              }
            },
            onError: _0x4e302d => {
              if (Playlist && _0xee828) {
                Playlist = false;
                Player.loadVideoById(_0xee828, _0x347711);
              }
            },
            onReady: _0xb109ce => {
              playerContainer.style.display = "block";
              if (_0x323f06) {
                Playlist = true;
                Player.loadPlaylist({
                  list: _0x323f06,
                  listType: "playlist",
                  index: _0x5c6ffb,
                  startSeconds: _0x347711
                });
              } else {
                Playlist = false;
                Player.loadVideoById(_0xee828, _0x347711);
              }
              Player.setVolume(_0x1bfd89);
            }
          }
        });
      };
      let _0xfe35a7 = document.querySelector("#playerTitle");
      let _0x33d14e = GetTranslation("mob2.sentby") + " " + _0x445517;
      if (!_0x33d14e) {
        _0x33d14e = "Sent by " + _0x445517;
      }
      if (_0xfe35a7) {
        _0xfe35a7.innerHTML = _0x33d14e;
      }
      if (!Classic) {
        playerToolBar.style.top = "0px";
        playerToolBar.style.opacity = "1";
      }
      addToolTip(resizeBtn, ["mob2.resize", "Drag to resize"], {
        position: "low"
      });
      if (Classic) {
        playerToolBar.addEventListener("dblclick", () => {
          if (minimized) {
            minimized = false;
            playerContainer.className = "";
            resizeBtn.style.display = "block";
            playerContainer.style.top = (document.body.clientHeight - playerContainer.clientHeight) / 2 + "px";
            playerContainer.style.left = (document.body.clientWidth - playerContainer.clientWidth) / 2 + "px";
            addToolTip(playerToolBar, ["mob2.minimize", "Double-click to minimize"], {
              position: "low"
            });
            positionPlayer();
          } else {
            minimized = true;
            resizeBtn.style.display = "none";
            playerContainer.style.left = "0px";
            playerContainer.className = "min";
            playerContainer.style.top = document.body.clientHeight - 20 + "px";
            addToolTip(playerToolBar, ["mob2.maximize", "Double-click to maximize"], {
              position: "low"
            });
          }
        });
      }
      let _0x44e7a6 = document.querySelector("#playerClose");
      addToolTip(_0x44e7a6, ["mob1.close", "Close"], {
        position: "low"
      });
      let _0x2ddfdf = document.querySelector("#playerSet");
      if (_0x2ddfdf) {
        addToolTip(_0x2ddfdf, ["mob1.settings", "Settings"], {
          position: "low"
        });
        _0x2ddfdf.addEventListener("click", () => {
          classicSetDialog("actions", config.MyId);
          classicSetDialog("settings", {
            tab: "appearance",
            UserNo: config.MyId
          });
        });
      }
      let _0x26a065 = document.querySelector("#playerSwitch");
      if (_0x26a065) {
        addToolTip(_0x26a065, ["mob1.switch", "Switch to media app"], {
          position: "low"
        });
        _0x26a065.addEventListener("click", () => {
          let _0x5c4fa6 = Player.getVideoUrl().replace(/＆/g, "&");
          playerContainer.style.display = "none";
          Player.stopVideo();
          openApp({
            type: "media",
            link: _0x5c4fa6
          });
        });
      }
      _0x44e7a6.addEventListener("click", () => {
        setAppIcon(0);
        playerContainer.style.display = "none";
        Player.stopVideo();
      });
      window.addEventListener("touchstart", playerDragStart, !1);
      window.addEventListener("touchend", playerDragEnd, !1);
      window.addEventListener("touchmove", playerDrag, !1);
      window.addEventListener("mousedown", playerDragStart, !1);
      window.addEventListener("mouseup", playerDragEnd, !1);
      window.addEventListener("mousemove", playerDrag, !1);
      window.addEventListener("resize", () => {
        positionPlayer();
      });
      positionPlayer((document.body.clientWidth - 260) / 2, (document.body.clientHeight - 146) / 2);
    }
  }
}
function ColorTitle() {
  var _0x2870a5;
  config.ButColW = config.ButColW ? config.ButColW : parent.config ? parent.config.ButColW : "";
  config.ButCol = config.ButCol ? config.ButCol : parent.config ? parent.config.ButCol : "";
  var _0x130488 = ["dialogTitleBar"];
  _0x2870a5 = hasDarkMode() ? "color:#969696; background-color: #313131; background-image: linear-gradient(rgba(255, 255, 255, 5%), rgba(0, 0, 0, 5%));" : "color:#" + toHex6(config.ButColW) + "; background-color: #" + toHex6(config.ButCol);
  if (config.ButColW && config.ButCol) {
    let _0x5cfc65 = document.getElementsByClassName("dialogTitle");
    for (let _0x1f5dd1 = 0; _0x1f5dd1 < _0x5cfc65.length; _0x1f5dd1++) {
      _0x5cfc65[_0x1f5dd1].style.cssText = "color:#" + (hasDarkMode() ? "969696" : toHex6(config.ButColW));
    }
    for (var _0xefd731 in _0x130488) {
      var _0x66756f;
      var _0x1ac6f4 = document.getElementsByClassName(_0x130488[_0xefd731]);
      for (_0x66756f = 0; _0x66756f < _0x1ac6f4.length; _0x66756f++) {
        _0x1ac6f4[_0x66756f].style.cssText = _0x2870a5;
      }
    }
  }
}
function powerAd(_0x43b7e7, _0x1d9b6c) {
  let _0x346143 = TOPSH || _Activity.instance.xConsts?.topsh;
  if (!_0x346143 || _0x43b7e7.toLowerCase() == "tickle") {
    return;
  }
  if (_Activity.instance.xConsts?.Stickers[_0x1d9b6c] || STICKERS && STICKERS[_0x1d9b6c]) {
    classicSetDialog("selector", {
      Type: "Stickers",
      Pack: _0x43b7e7,
      Config: config
    });
    return;
  }
  let _0x161900 = [_0x43b7e7];
  for (let _0x23aef5 in _0x346143) {
    if (_0x346143[_0x23aef5] == _0x1d9b6c) {
      _0x161900.push(_0x23aef5);
    }
  }
  if (_0x161900.length > 14) {
    _0x161900 = _0x161900.splice(0, 14);
  }
  const _0x8a7062 = "svg/remove" + (config.ButColW && toHex6(config.ButColW)[0] == "0" ? "b" : "w") + ".svg";
  let _0x305048 = makeElement(null, "img");
  _0x305048.src = _0x8a7062;
  _0x305048.width = "16";
  _0x305048.alt = "close";
  let _0x7e24d8 = makeElement(null, "div");
  let _0xe8c39d = makeElement(_0x7e24d8, "div", "modalDialogContentClassic gpModal");
  let _0x2b7f38 = makeElement(_0xe8c39d, "div", "dialogTitleBar");
  let _0x1fb780 = makeElement(_0x2b7f38, "span", "dialogTitle link", "openLink");
  makeElement(_0x2b7f38, "span", "dialogTitleAction", "id_ModalClose").appendChild(_0x305048);
  let _0xa12bc8 = makeElement(_0xe8c39d, "div", "dialogBody");
  let _0xaae8b2 = makeElement(_0xa12bc8, "div", "dialogPadding");
  let _0x367f67 = makeElement(_0xaae8b2, "div", "", "wrapper");
  let _0x3142bf = makeElement(_0xa12bc8, "div", "dialogActions");
  let _0x2c61c9 = makeElement(_0x3142bf, "div", "butcontainer previewBut centered").appendChild(makeElement(null, "div", "butlayout", "actionButton"));
  _0x1fb780.appendChild(document.createTextNode(_0x43b7e7.charAt(0).toUpperCase() + _0x43b7e7.slice(1)));
  _0xe8c39d.dataset.w = 0.6;
  let _0x1666a4 = [];
  let _0x58b078 = [];
  let _0x10683f = SUPERPOWERS || _Activity.instance.xConsts?.SuperPowers;
  if (SUPERPOWERS && SUPERPOWERS[_0x1d9b6c] || _Activity.instance.xConsts?.SuperPowers[_0x1d9b6c]) {
    _0x2c61c9.appendChild(document.createTextNode("Required Powers"));
    let _0x3ea92d = SUPERPAWNS || _Activity.instance.xConsts?.SuperPawns;
    for (let _0xeb5bfd in _0x3ea92d) {
      if (_0x3ea92d.hasOwnProperty(_0xeb5bfd) && _0x3ea92d[_0xeb5bfd] == _0x1d9b6c) {
        _0x58b078.push(_0xeb5bfd);
      }
    }
    if (_0x58b078.length > 28) {
      _0x58b078 = _0x58b078.splice(0, 28);
    }
    for (let _0x13dd14 in _0x10683f) {
      if (_0x10683f.hasOwnProperty(_0x13dd14) && _0x13dd14 == _0x1d9b6c) {
        for (var _0x555d95 = 0; _0x555d95 < _0x10683f[_0x13dd14].length; _0x555d95++) {
          _0x1666a4.push(PSSA[_0x10683f[_0x13dd14][_0x555d95] + 1]);
        }
      }
    }
    let _0x44b1e2 = makeElement(_0x367f67, "div", "superPowers");
    addText(makeElement(_0x44b1e2, "span", "spTitle"), "Available Pawns:");
  } else {
    let _0x4ac5c1 = ISGRP && ISGRP[_0x1d9b6c] || _Activity.instance.xConsts?.isgrp[_0x1d9b6c];
    addText(_0x2c61c9, _0x1d9b6c == 700 ? ["mob2.storesubnow", "Subscribe Now"] : ["mob1.storebuynow", "Buy Now"]);
    if (_0x4ac5c1) {
      addText(makeElement(_0x3142bf, "div", "butcontainer previewBut centered").appendChild(makeElement(null, "div", "butlayout", "gpButton")), ["mob1.assignunassign", "Assign/Unassign"]);
      _0x3142bf.style.display = "flex";
    }
  }
  HiddenDivs.AlertDialog = _0x7e24d8.innerHTML;
  doModal("AlertDialog");
  ColorTitle();
  setButCols(config.ButCol, config.ButColW);
  setCstyle();
  if (_0x58b078.length > 0) {
    document.getElementById("openLink").innerHTML += " - COLLECTION";
    _0x367f67 = document.querySelector("#wrapper");
    _0x58b078.forEach((_0x20ddb0, _0x2a8fe5) => {
      _Activity.instance.Smilies.MakeSmiley(_0x367f67, "p1" + _0x20ddb0 + "##", {
        size: 40,
        className: "smileyPreview",
        align: true,
        tooltip: "(hat#h#" + _0x20ddb0 + ")"
      });
    });
    document.querySelector("#actionButton").parentNode.addEventListener("click", () => {
      document.querySelector("#actionButton").innerHTML = "";
      addText(document.querySelector("#actionButton"), ["mob1.storebuynow", "Buy Now"]);
      document.querySelector("#actionButton").parentNode.addEventListener("click", () => {
        if (Classic) {
          window.open("https://xath.hu/store", "_blank");
        } else {
          ToC({
            Command: "StartStore",
            Power: _0x1d9b6c
          });
          _Activity.instance.SetPage("store");
        }
      });
      _0x367f67.innerHTML = "";
      _0x161900.forEach((_0x39d674, _0x5b7f84) => {
        document.querySelector("#box" + _0x5b7f84);
        _Activity.instance.Smilies.MakeSmiley(_0x367f67, _0x39d674, {
          size: 40,
          className: "smileyPreview",
          align: true,
          callback: () => smiliePressed("(" + _0x39d674 + ")")
        });
      });
      let _0x211a09 = makeElement(_0x367f67, "div", "superPowers");
      addText(makeElement(_0x211a09, "span", "spTitle"), "Required Powers:");
      _0x1666a4.forEach((_0x25464e, _0x206bad) => {
        const _0x703215 = {
          size: 40,
          className: "smileyPreview",
          align: true
        };
        _Activity.instance.Smilies.MakeSmiley(_0x367f67, _0x25464e, _0x703215);
      });
    });
  } else {
    _0x367f67 = document.querySelector("#wrapper");
    _0x161900.forEach((_0x1e38d8, _0xc0b0ed) => {
      _Activity.instance.Smilies.MakeSmiley(_0x367f67, _0x1e38d8, {
        size: 40,
        className: "smileyPreview",
        align: true,
        callback: () => smiliePressed("(" + _0x1e38d8 + ")")
      });
    });
    document.querySelector("#actionButton").parentNode.addEventListener("click", () => {
      if (Classic) {
        window.open("https://xath.hu/" + (_0x1d9b6c == 700 ? "aces" : "store"), "_blank");
      } else {
        ToC({
          Command: "StartStore",
          Power: _0x1d9b6c
        });
        _Activity.instance.SetPage("store");
      }
    });
    if (document.querySelector("#gpButton")) {
      document.querySelector("#gpButton").parentNode.addEventListener("click", () => {
        _Activity.instance.QuickBar?.doGroupsPowers(false, _0x43b7e7);
      });
    }
  }
  document.querySelector("#openLink").addEventListener("click", () => {
    HitWiki(_0x43b7e7);
  });
  document.querySelector("#id_ModalClose").addEventListener("click", () => {
    modalClose();
  });
}
function doSound(_0x1f4b47, _0x50b950) {
  let _0x4a2570 = _0x50b950 && !(_Activity?.instance?.IsIOSApp || Browser == "SF") ? "https://xath.hu/content/sounds/audies/" + _0x1f4b47 + ".webm" : "https://xath.hu/web_gear/chat/snd/" + _0x1f4b47 + ".mp3";
  new _Activity.instance.Window.Howl({
    src: [_0x4a2570],
    volume: _0x1f4b47 == "laserfire3" ? 1 : _Activity.instance.Volume[1] / 100
  }).play();
}
let posX = 0;
let posY = 0;
let tolerance = 50;
let active = !1;
let active2 = !1;
let currentX = 0;
let currentY = 0;
let initialX = 0;
let initialY = 0;
let xOffset = null;
let yOffset = null;
function playerDrag(_0x349302) {
  if (active) {
    _0x349302.preventDefault();
    hideTooltip();
    let _0x167a9f = document.body.clientWidth;
    let _0x52f0e2 = document.body.clientHeight;
    let _0x4de81f = 0;
    let _0x2b5363 = 0;
    if (_0x349302.type === "touchmove") {
      _0x4de81f = _0x349302.touches[0].clientX - initialX;
      _0x2b5363 = _0x349302.touches[0].clientY - initialY;
      currentX = Math.min(_0x167a9f + tolerance, Math.max(-tolerance, _0x4de81f));
      currentY = Math.min(_0x52f0e2 + tolerance, Math.max(-tolerance, _0x2b5363));
    } else {
      _0x4de81f = _0x349302.clientX - initialX;
      _0x2b5363 = _0x349302.clientY - initialY;
      currentX = Math.min(_0x167a9f + tolerance, Math.max(-tolerance, _0x4de81f));
      currentY = Math.min(_0x52f0e2 + tolerance, Math.max(-tolerance, _0x2b5363));
      if (_0x349302.clientX < -tolerance || _0x349302.clientY < -tolerance || _0x349302.clientX > _0x167a9f + tolerance || _0x349302.clientY > _0x52f0e2 + tolerance) {
        posX = 0;
        posY = 0;
        active = !1;
        active2 = !1;
        positionPlayer();
        return !1;
      }
    }
    xOffset = currentX;
    yOffset = currentY;
    positionPlayer(currentX, currentY);
  } else if (active2) {
    hideTooltip();
    let _0x1de7ad = 0;
    let _0x33b170 = 0;
    if (_0x349302.type === "touchmove") {
      _0x1de7ad = posX - _0x349302.touches[0].clientX;
      posX = _0x349302.touches[0].clientX;
      _0x33b170 = posY - _0x349302.touches[0].clientY;
      posY = _0x349302.touches[0].clientY;
    } else {
      _0x1de7ad = posX - _0x349302.clientX;
      posX = _0x349302.clientX;
      _0x33b170 = posY - _0x349302.clientY;
      posY = _0x349302.clientY;
    }
    let _0x327c47 = 200;
    let _0x398da3 = 500;
    let _0x556b8e = parseInt(getComputedStyle(Player.getIframe(), "").width) + _0x1de7ad;
    let _0x349c7c = parseInt(getComputedStyle(Player.getIframe(), "").height) + _0x33b170;
    if (_0x556b8e > _0x398da3 || _0x556b8e < _0x327c47) {
      _0x1de7ad = 0;
      _0x556b8e = parseInt(getComputedStyle(Player.getIframe(), "").width);
    }
    if (_0x349c7c > 281 || _0x349c7c < 112) {
      _0x33b170 = 0;
      _0x349c7c = parseInt(getComputedStyle(Player.getIframe(), "").height);
    }
    if (_0x556b8e > _0x398da3 && _0x349c7c > 281 || _0x556b8e < _0x327c47 && _0x349c7c < 112) {
      _0x1de7ad = 0;
      _0x556b8e = parseInt(getComputedStyle(Player.getIframe(), "").width);
      _0x33b170 = 0;
      _0x349c7c = parseInt(getComputedStyle(Player.getIframe(), "").height);
    }
    Player.getIframe().style.width = _0x556b8e + "px";
    playerContainer.style.left = parseInt(playerContainer.style.left) - _0x1de7ad + "px";
    Player.getIframe().style.height = _0x349c7c + "px";
    playerContainer.style.top = parseInt(playerContainer.style.top) - _0x33b170 + "px";
  }
}
function playerDragEnd(_0x47ecd3) {
  posX = 0;
  posY = 0;
  active = !1;
  active2 = !1;
  positionPlayer();
  initialX = currentX;
  initialY = currentY;
  if (_0x47ecd3.target === playerToolBar) {
    addToolTip(playerToolBar, minimized ? ["mob2.minimize", "Double-click to minimize"] : ["mob2.maximize", "Double-click to maximize"], {
      position: "low"
    });
  }
  if (_0x47ecd3.target === resizeBtn) {
    addToolTip(resizeBtn, ["mob2.resize", "Drag to resize"], {
      position: "low"
    });
  }
}
function playerDragStart(_0x57e3bf) {
  xOffset = playerContainer.offsetLeft;
  yOffset = playerContainer.offsetTop;
  if (_0x57e3bf.type === "touchstart") {
    initialX = _0x57e3bf.touches[0].clientX - xOffset;
    initialY = _0x57e3bf.touches[0].clientY - yOffset;
    posX = _0x57e3bf.touches[0].clientX;
    posY = _0x57e3bf.touches[0].clientY;
  } else {
    initialX = _0x57e3bf.clientX - xOffset;
    initialY = _0x57e3bf.clientY - yOffset;
    posX = _0x57e3bf.clientX;
    posY = _0x57e3bf.clientY;
  }
  if (_0x57e3bf.target === playerToolBar) {
    active = true;
    active2 = false;
  }
  if (_0x57e3bf.target === resizeBtn) {
    active2 = true;
    active = false;
  }
}
function positionPlayer(_0x833e3f, _0x12ec54) {
  let _0x43b92d = playerContainer.clientWidth;
  let _0x5410c3 = playerContainer.clientHeight;
  let _0x28ecf2 = document.body.clientWidth;
  let _0x3a7270 = document.body.clientHeight;
  let _0x23b857 = 0;
  let _0x386bbd = 0;
  if (_0x833e3f && _0x12ec54) {
    _0x23b857 = Math.min(_0x28ecf2 - _0x43b92d, Math.max(0, _0x833e3f));
    _0x386bbd = Math.min(_0x3a7270 - _0x5410c3, Math.max(0, _0x12ec54));
  } else {
    _0x23b857 = Math.min(_0x28ecf2 - _0x43b92d, Math.max(0, parseInt(getComputedStyle(playerContainer, "").left)));
    _0x386bbd = Math.min(_0x3a7270 - _0x5410c3, Math.max(0, parseInt(getComputedStyle(playerContainer, "").top)));
  }
  if (!minimized) {
    playerContainer.style.top = _0x386bbd + "px";
  }
  playerContainer.style.left = _0x23b857 + "px";
}
function setButCols(_0x51b06a, _0x20759d) {
  if (!_0x51b06a) {
    _0x51b06a = 80;
  }
  if (!_0x20759d) {
    _0x20759d = 16777215;
  }
  var _0x560832 = "color:#" + toHex6(_0x20759d) + "; background-color: #" + toHex6(_0x51b06a);
  var _0xfee1d2 = ["butcontainer"];
  for (var _0x11a7c6 in _0xfee1d2) {
    var _0x541877;
    var _0x3112bf = document.getElementsByClassName(_0xfee1d2[_0x11a7c6]);
    for (_0x541877 = 0; _0x541877 < _0x3112bf.length; _0x541877++) {
      _0x3112bf[_0x541877].style.cssText = _0x560832;
    }
  }
}
function getTooltipInfo(_0x193005) {
  if (_0x193005.id == config.MyId || _0x193005.id == "2") {
    return ["box.18", "Change your name, avatar and home page"];
  }
  if (xInt(_0x193005.id) != 0) {
    let _0x30b4c0 = _0x193005.id;
    if (_0x30b4c0.substr(-9, 9) == "000000000") {
      _0x30b4c0 = _0x30b4c0.substr(0, _0x30b4c0.length - 9) + "B";
    } else if (_0x30b4c0.substr(-6, 6) == "000000") {
      _0x30b4c0 = _0x30b4c0.substr(0, _0x30b4c0.length - 6) + "M";
    }
    let _0x3d449b = _0x193005.registered || _0x193005.regname;
    if (!_0x3d449b) {
      _0x3d449b = _0x30b4c0;
    }
    if (_0x193005.status && _0x193005.status.length > 0 && _0x193005.pFlags & NamePowers.status) {
      if (_0x193005.status.indexOf("#") != -1) {
        _0x3d449b += "<br>" + _0x193005.status.split("#")[0];
      } else {
        _0x3d449b += "<br>" + _0x193005.status;
      }
    }
    if (xInt(_0x193005.id) < 100) {
      _0x3d449b += "<br>(xat staff)";
    } else {
      _0x3d449b += "<br>(NOT xat staff)";
    }
    return ["box.16", "Interact with $1", _0x3d449b];
  }
}
function addToolTip(_0x3e45f9, _0x29f92d, _0xec8c4b) {
  if (_0xec8c4b === undefined) {
    _0xec8c4b = {};
  }
  let {
    select: _0x9ffd4b,
    position: _0x423a4c,
    maxWidth: _0x15d241,
    Rect: _0x29dffa,
    showRapid: _0x4d0d67,
    shortTime: _0x1e07fc,
    dom: _0xccfcfc,
    timestamp: _0x4aa02a,
    instant: _0x5d469d
  } = _0xec8c4b;
  if (!_0x3e45f9 || _0x29f92d.length == 0) {
    return;
  }
  if (_0x423a4c != "pointer") {
    _0x3e45f9.style.cursor = "pointer";
  }
  _0x3e45f9.style["pointer-events"] = "auto";
  if (!_0xccfcfc) {
    _0xccfcfc = document;
  }
  let _0x2fd651 = _0x5d469d ? 1 : _0x1e07fc ? 500 : 1000;
  if (_0x4aa02a && !_0x3e45f9.dataset.timestamp) {
    _0x3e45f9.dataset.timestamp = _0x4aa02a;
  }
  _0x3e45f9.addEventListener(_Activity.instance.IsClassic ? "mouseenter" : "mousedown", _0x48c564 => {
    if (timeoutId !== null) {
      window.clearTimeout(timeoutId);
    }
    timeoutId = window.setTimeout(() => {
      if (!(_0x3e45f9.dataset.key && !document.querySelector("[data-key=\"" + _0x3e45f9.dataset.key + "\"]"))) {
        hideTooltip();
        if (_0x3e45f9.dataset.timestamp && !_0x4d0d67) {
          _0x29f92d = GetTimeToGo(_0x3e45f9.dataset.timestamp);
        }
        tooltip = (_0x48c564.ctrlKey || _0x48c564.metaKey) && _0x4d0d67 ? addHintText(_0x48c564, "Rapid: " + Macros.rapid, _0x423a4c, _0x15d241, _0x29dffa, _0xccfcfc) : addHintText(_0x48c564, _0x29f92d, _0x423a4c, _0x15d241, _0x29dffa, _0xccfcfc);
        if (_0x9ffd4b) {
          tooltip.addEventListener("mouseenter", () => {
            window.clearTimeout(timeoutId);
          });
        }
        if (_0x4d0d67) {
          _0xccfcfc.onkeydown = _0x58f9bf => {
            if (_0x58f9bf.ctrlKey || _0x58f9bf.key == "Control") {
              let _0x38f3ad = _0xccfcfc.querySelector("#tooltips");
              if (_0x38f3ad) {
                _0x38f3ad.parentNode.removeChild(_0x38f3ad);
              }
              tooltip = addHintText(_0x48c564, "Rapid: " + Macros.rapid, _0x423a4c, _0x15d241, _0x29dffa, _0xccfcfc);
            }
          };
          _0xccfcfc.onkeyup = _0x1aa645 => {
            if (!_0x1aa645.ctrlKey && _0x1aa645.key == "Control") {
              let _0x534023 = _0xccfcfc.querySelector("#tooltips");
              if (_0x534023) {
                _0x534023.parentNode.removeChild(_0x534023);
              }
              tooltip = addHintText(_0x48c564, _0x29f92d, _0x423a4c, _0x15d241, _0x29dffa, _0xccfcfc);
            }
          };
        }
        _0xccfcfc.addEventListener("click", _0x15d148 => {
          if (_0x15d148.target != tooltip) {
            hideTooltip();
          }
        });
        tooltip.addEventListener("mouseleave", () => {
          window.clearTimeout(timeoutId);
          timeoutId = window.setTimeout(() => {
            let _0x5f2abb = _0xccfcfc.querySelector("#tooltips");
            if (_0x5f2abb) {
              _0x5f2abb.parentNode.removeChild(_0x5f2abb);
            }
            tooltip = null;
          }, 100);
        });
        if (_0x9ffd4b) {
          tooltip.addEventListener("click", () => {
            if (_0xccfcfc.body.createTextRange) {
              const _0x18f13e = _0xccfcfc.body.createTextRange();
              _0x18f13e.moveToElementText(tooltip);
              _0x18f13e.select();
            } else if (window.getSelection) {
              const _0x534cbf = window.getSelection();
              const _0x502abd = _0xccfcfc.createRange();
              _0x502abd.selectNodeContents(tooltip);
              _0x534cbf.removeAllRanges();
              _0x534cbf.addRange(_0x502abd);
            }
          });
        }
      }
    }, tooltip ? 0 : _0x2fd651);
  });
  _0x3e45f9.addEventListener("mouseleave", () => {
    if (timeoutId !== null) {
      window.clearTimeout(timeoutId);
    }
    if (_0x4d0d67) {
      _0xccfcfc.onkeyup = null;
      _0xccfcfc.onkeydown = null;
    }
    timeoutId = window.setTimeout(() => {
      let _0xb3955a = _0xccfcfc.querySelector("#tooltips");
      if (_0xb3955a) {
        _0xb3955a.parentNode.removeChild(_0xb3955a);
      }
      tooltip = null;
    }, 500);
  });
}
function hideTooltip() {
  tooltip = null;
  let _0x2f0385 = document.querySelector("#tooltips");
  if (_0x2f0385) {
    _0x2f0385.parentNode.removeChild(_0x2f0385);
  }
}
function openGift(_0x3fdafe) {
  if (_0x3fdafe) {
    if (_Activity.instance.IsClassic) {
      const _0x5d6de9 = document.getElementById("appframe")?.contentWindow;
      if (!_0x5d6de9 || !_0x5d6de9?.document) {
        return;
      }
      const _0x35a336 = _0x5d6de9.document.querySelector(".dialogBody");
      if (_0x35a336) {
        _0x35a336.style.height = "90%";
      }
      _0x5d6de9?.classicSetDialog("selector", {
        Type: "Gifts",
        UserNo: _0x3fdafe
      });
      return;
    }
    classicSetDialog("selector", {
      Type: "Gifts",
      UserNo: _0x3fdafe
    });
  }
}
function GetRealBack(_0xdd2b12, _0x5e789c, _0x4b0f2f, _0x7e2faa) {
  if (!_0xdd2b12) {
    return "";
  }
  if (_0xdd2b12.charAt(0) == "h") {
    return "url(\"" + (_0x5e789c ? SafeImage(_0xdd2b12, 1136, 640) : SafeImage(_0xdd2b12, 640, _0x4b0f2f, _0x7e2faa)) + "\") no-repeat 0 0 / cover fixed";
  }
  return _0xdd2b12;
}
function LoadBackground(_0xcf1d2b) {
  let _0x3ef9d9;
  let _0x1ea92b;
  let _0x5bee08 = _0xcf1d2b.split(";=");
  _0xcf1d2b = config.xatback;
  let _0x58a89a = 1136;
  let _0x4941b4 = config.page;
  let _0x2eecb2 = !1;
  var _0x516f3a = _Activity.IsFlixActive && _Activity.IsFlixVisible;
  var _0x5c3b8a = _Activity.CurrentChat;
  if (!_0x4941b4) {
    _0x4941b4 = _Activity.instance.CurrentPage;
  }
  switch (_0x4941b4) {
    case "visitors":
    case "messages":
    case "classic":
      if (_0x5bee08[1] && _0x5bee08[2]) {
        const _0x2b38cf = _0x5bee08[2].split(",");
        _0x516f3a = !1;
        if ((_0xcf1d2b = _0x2b38cf[0]).substring(0, 4) === "http") {
          _0x2eecb2 = parseInt(_0x2b38cf[1]) === 1;
          if (window?.innerHeight > 0 && _0x2eecb2) {
            _0x58a89a = window.innerHeight;
          }
        } else if (/(^[0-9A-F]{6}$)|(^#[0-9A-F]{3}$)/i.test(_0xcf1d2b)) {
          _0xcf1d2b = "#" + _0xcf1d2b;
        }
      } else if (!_Activity.instance.IsLandscape && !Classic && _0x5bee08[9].length > 0) {
        _0xcf1d2b = _0x5bee08[9];
        _0x3ef9d9 = 1;
        _0x516f3a = false;
      } else if (_Activity.instance.IsLandscape && !Classic && _0x5bee08[10].length > 0) {
        _0xcf1d2b = _0x5bee08[10];
        _0x1ea92b = 1;
        _0x516f3a = false;
      } else {
        _0xcf1d2b = _0x5bee08[3];
        _0x5c3b8a = _Activity.FlixChatId;
      }
  }
  _Activity.FlixBackground = GetRealBack(_0x5bee08[3], _0x3ef9d9, _0x58a89a, !1);
  var _0x837953 = !1;
  if (!_0x516f3a) {
    _0x837953 = HandleFlix(_0x5c3b8a);
  }
  if (!(_0x516f3a || _0x837953)) {
    document.body.style.background = GetRealBack(_0xcf1d2b, _0x3ef9d9, _0x58a89a, _0x2eecb2);
    if (!Classic) {
      document.body.style.backgroundPosition = "left";
    }
  }
}
function calcAvSize(_0x2502d4) {
  if (_0x2502d4 <= 30) {
    return 30;
  } else if (_0x2502d4 <= 35) {
    return 35;
  } else if (_0x2502d4 <= 80) {
    return 80;
  } else if (_0x2502d4 == 100) {
    return 100;
  } else if (_0x2502d4 <= 160) {
    return 160;
  } else if (_0x2502d4 <= 320) {
    return 320;
  } else {
    return 640;
  }
}
function calcStripSize(_0x722284) {
  if (_0x722284 <= 20) {
    return 20;
  } else if (_0x722284 <= 30) {
    return 30;
  } else if (_0x722284 <= 35) {
    return 35;
  } else if (_0x722284 <= 40) {
    return 40;
  } else if (_0x722284 <= 80) {
    return 80;
  } else {
    return 160;
  }
}
function addHintText(_0x1a08a0, _0x548811, _0x496f6f, _0x18a5dc, _0x3f4dc2, _0x219331) {
  if (_0x548811 && _0x548811.length == 0) {
    return;
  }
  let _0x352267 = _0x219331.querySelector("#tooltips");
  if (_0x352267) {
    _0x352267.parentNode.removeChild(_0x352267);
  }
  _0x352267 = makeElement(null, "div", "", "tooltips");
  _0x219331.body.prepend(_0x352267);
  let _0x5d5476 = makeElement(_0x352267, "div", "tooltip");
  if (_0x18a5dc) {
    _0x5d5476.style["max-width"] = "50%";
  }
  addText(_0x5d5476, _0x548811, !0);
  var _0x48f1ee = _0x3f4dc2 ? _0x3f4dc2.getBoundingClientRect() : _0x1a08a0.target.getBoundingClientRect();
  switch (_0x496f6f) {
    case "left":
      _0x5d5476.style.top = _0x48f1ee.top + "px";
      _0x5d5476.style.left = Math.min(_0x48f1ee.left) - _0x5d5476.clientWidth - 10 + "px";
      if (_0x5d5476.getBoundingClientRect().left < 15) {
        _0x5d5476.style.left = "15px";
      } else if (_0x5d5476.getBoundingClientRect().right >= window.innerWidth) {
        _0x5d5476.style.left = window.innerWidth - _0x5d5476.getBoundingClientRect().width - 15 + "px";
      }
      break;
    case "right":
      _0x5d5476.style.top = _0x48f1ee.top + "px";
      _0x5d5476.style.left = _0x48f1ee.width - (_0x5d5476.clientWidth - 5) + "px";
      if (_0x5d5476.getBoundingClientRect().right < 15) {
        _0x5d5476.style.right = "15px";
      } else if (_0x5d5476.getBoundingClientRect().right >= window.innerWidth) {
        _0x5d5476.style.right = window.innerWidth - _0x5d5476.getBoundingClientRect().width - 15 + "px";
      }
      break;
    case "low":
      _0x5d5476.style.top = _0x48f1ee.top - 30 + "px";
      _0x5d5476.style.left = _0x48f1ee.left + Math.abs(_0x48f1ee.left - _0x48f1ee.right) / 2 - _0x5d5476.clientWidth / 2 + "px";
      if (_0x5d5476.getBoundingClientRect().left < 15) {
        _0x5d5476.style.left = "15px";
      } else if (_0x5d5476.getBoundingClientRect().right >= window.innerWidth) {
        _0x5d5476.style.left = window.innerWidth - _0x5d5476.getBoundingClientRect().width - 15 + "px";
      }
      break;
    case "bottom":
      _0x5d5476.style.top = "58px";
      _0x5d5476.style.left = _0x48f1ee.left + Math.abs(_0x48f1ee.left - _0x48f1ee.right) / 2 - _0x5d5476.clientWidth / 2 + "px";
      if (_0x5d5476.getBoundingClientRect().left < 15) {
        _0x5d5476.style.left = "15px";
      } else if (_0x5d5476.getBoundingClientRect().right >= window.innerWidth) {
        _0x5d5476.style.left = window.innerWidth - _0x5d5476.getBoundingClientRect().width - 25 + "px";
      }
      break;
    case "pointer":
      _0x5d5476.style.top = _0x48f1ee.top - 30 + "px";
      _0x5d5476.style.left = _0x1a08a0.clientX + "px";
      if (_0x5d5476.getBoundingClientRect().left < 15) {
        _0x5d5476.style.left = "15px";
      } else if (_0x5d5476.getBoundingClientRect().right >= window.innerWidth) {
        _0x5d5476.style.left = window.innerWidth - _0x5d5476.getBoundingClientRect().width - 15 + "px";
      }
      break;
    case "top-tall":
      _0x5d5476.style.top = _0x48f1ee.top - _0x5d5476.getBoundingClientRect().height - 10 + "px";
      _0x5d5476.style.left = _0x48f1ee.left + Math.abs(_0x48f1ee.left - _0x48f1ee.right) / 2 - _0x5d5476.clientWidth / 2 + "px";
      if (_0x5d5476.getBoundingClientRect().left < 15) {
        _0x5d5476.style.left = "15px";
      } else if (_0x5d5476.getBoundingClientRect().right >= window.innerWidth) {
        _0x5d5476.style.left = window.innerWidth - (_0x5d5476.getBoundingClientRect().width - 15) * 2 + "px";
      }
      if (xInt(_0x5d5476.style.left) <= 0) {
        _0x5d5476.style.left = "15px";
      }
      break;
    default:
      _0x5d5476.style.top = _0x48f1ee.top - 50 + "px";
      _0x5d5476.style.left = _0x48f1ee.left + Math.abs(_0x48f1ee.left - _0x48f1ee.right) / 2 - _0x5d5476.clientWidth / 2 + "px";
      if (_0x5d5476.getBoundingClientRect().left < 15) {
        _0x5d5476.style.left = "15px";
      } else if (_0x5d5476.getBoundingClientRect().right >= window.innerWidth) {
        _0x5d5476.style.left = window.innerWidth - _0x5d5476.getBoundingClientRect().width - 15 + "px";
      }
      if (xInt(_0x5d5476.style.left) <= 0) {
        _0x5d5476.style.left = "15px";
      }
  }
  if (_0x5d5476.getBoundingClientRect().top < 0) {
    _0x5d5476.style.top = "5px";
  }
  return _0x5d5476;
}
var LangFiles = _Activity.instance?.LangFiles ?? {};
function TranslateNodes(_0x299807, _0x45403c) {
  if (!_0x45403c) {
    return;
  }
  var _0x5db755 = !1;
  for (var _0x281f9d in LangFiles) {
    if (LangFiles[_0x281f9d]) {
      _0x5db755 = !0;
      break;
    }
  }
  let _0x5ad8e9;
  if (_0x45403c == "box" && _Activity.instance.CustomGroupLang) {
    _0x5ad8e9 = _Activity.instance.CustomGroupLang;
    _0x5db755 = true;
  }
  if (_0x5db755) {
    var _0x546e21;
    var _0x4785fd;
    var _0x2261e4;
    var _0x25f313 = _0x299807.querySelectorAll("[data-localize]");
    var _0x44da8c = _0x25f313.length;
    for (_0x281f9d = 0; _0x281f9d < _0x44da8c; ++_0x281f9d) {
      if (_0x45403c == (_0x2261e4 = (_0x4785fd = _0x25f313[_0x281f9d]).getAttribute("data-localize").split("."))[0]) {
        _0x546e21 = LangFiles[_0x2261e4[0]][_0x2261e4[1]];
        if (_0x5ad8e9 && _0x5ad8e9[_0x2261e4[1]]) {
          _0x546e21 = _0x5ad8e9[_0x2261e4[1]];
        }
        if (_0x546e21) {
          changeText(_0x4785fd, _0x546e21, true);
        }
      }
    }
  }
}
function GotLang(_0x33c5ff) {
  for (var _0xddcb57 in _0x33c5ff) {
    if (_0x33c5ff[_0xddcb57]) {
      LangFiles[_0xddcb57] = _0x33c5ff[_0xddcb57];
    }
  }
  Translate(_0x33c5ff);
  let _0x1274ec = document.getElementById("appframe")?.contentWindow;
  if (_0x1274ec && _0x1274ec.Translate) {
    _0x1274ec.Translate(_0x33c5ff);
  }
}
function LoadLangAll(_0x2b5a60) {
  if (_0x2b5a60 === undefined) {
    _0x2b5a60 = false;
  }
  LoadLang({
    box: 0,
    mob2: 0,
    mob1: 0,
    login: 0
  }, !1, _0x2b5a60);
}
function TranslateAll() {
  Translate({
    box: 0,
    mob2: 0,
    mob1: 0,
    login: 0
  });
}
function Translate(_0x22e53d) {
  for (let _0x21dc88 in _0x22e53d) {
    if (LangFiles[_0x21dc88]) {
      TranslateNodes(document, _0x21dc88);
    }
  }
}
function LoadLang(_0x10ce58, _0x28981c, _0x585906) {
  if (_0x28981c) {
    Language = _0x28981c;
    _Activity.instance.LangFiles = {};
    LangFiles = {};
  }
  for (let _0x142015 in _0x10ce58) {
    loadJSON(xatdomain + "/json/lang/getlang2.php?f=" + _0x142015 + "&l=" + Language, GotLang);
  }
  if (_0x585906) {
    TranslateAll();
  }
}
function makeElement(_0xb3bdd4, _0x2165f4, _0x4673bc, _0x96ecb1, _0x4eba99) {
  var _0x1ee66d = document.createElement(_0x2165f4);
  if (_0x4673bc) {
    _0x1ee66d.className = _0x4673bc;
  }
  if (_0x96ecb1) {
    _0x1ee66d.id = _0x96ecb1;
  }
  if (_0xb3bdd4) {
    _0xb3bdd4.appendChild(_0x1ee66d);
  }
  if (_0x4eba99) {
    _0x4eba99.prepend(_0x1ee66d);
  }
  return _0x1ee66d;
}
function addEditBox(_0x11efa0, _0x311107, _0x1688d9, _0x136c24, _0x362b81, _0x1a072b) {
  var _0x3ca9f0 = makeElement(_0x11efa0, "div");
  var _0x15b142 = makeElement(_0x3ca9f0, "span", "edittitle");
  if (_0x362b81) {
    _0x15b142.style.fontWeight = "bold";
  }
  addText(_0x15b142, _0x1688d9);
  if (_0x136c24 === undefined) {
    _0x136c24 = "";
  }
  if (_0x136c24 !== "noedit") {
    var _0x5196bc = makeElement(_0x3ca9f0, "input");
    if (_0x1a072b == "password") {
      _0x5196bc.type = "password";
    } else {
      _0x5196bc.type = "text";
      _0x5196bc.value = _0x136c24;
    }
    _0x5196bc.id = _0x311107;
  }
}
function GetTranslation(_0x5f488b, _0x531886) {
  var _0x116238 = _0x5f488b.split(".");
  let _0x5c2a9d;
  if (_0x116238[0] == "box" && _Activity.instance.CustomGroupLang && (_0x5c2a9d = _Activity.instance.CustomGroupLang[_0x116238[1]])) {
    return _0x5c2a9d;
  }
  if (LangFiles && LangFiles[_0x116238[0]] && LangFiles[_0x116238[0]][_0x116238[1]]) {
    let _0x258e08 = LangFiles[_0x116238[0]][_0x116238[1]];
    if (_0x531886) {
      _0x531886.forEach((_0x3b4000, _0x2aaef7) => {
        const _0x26b0fd = new RegExp("\\$" + (_0x2aaef7 + 1), "g");
        _0x258e08 = _0x258e08.replace(_0x26b0fd, _0x3b4000);
      });
    }
    return _0x258e08;
  }
  return !1;
}
function TransText(_0x90785d, _0x2e834b) {
  var _0x1db29c = GetTranslation(_0x90785d);
  return _0x1db29c || _0x2e834b;
}
function addText(_0x2e5c11, _0x3de3a4, _0xd3c581) {
  if (!_0x3de3a4) {
    return;
  }
  var _0x4572ae;
  if (typeof _0x3de3a4 == "string" && _0x3de3a4.charAt(0) == "[" && _0x3de3a4.search(/\[mob/) >= 0) {
    for (var _0x1407eb in _0x3de3a4 = _0x3de3a4.split(/\[mob|\]/)) {
      if ((_0x4572ae = _0x3de3a4[_0x1407eb]).charAt(0) > 0 && _0x4572ae.charAt(1) == ".") {
        _0x3de3a4[_0x1407eb] = _0x4572ae.split(",");
        _0x3de3a4[_0x1407eb][0] = "mob" + _0x3de3a4[_0x1407eb][0];
      }
    }
  }
  if (Array.isArray(_0x3de3a4)) {
    if (Array.isArray(_0x3de3a4[0]) || _0x3de3a4[1] && Array.isArray(_0x3de3a4[1])) {
      for (var _0x1407eb in _0x3de3a4) {
        addText(_0x2e5c11, _0x3de3a4[_0x1407eb]);
      }
      return "";
    }
    if (_0x3de3a4[0]) {
      _0x2e5c11.setAttribute("data-localize", _0x3de3a4[0]);
      let _0x5b4bda = null;
      if (_0x3de3a4.length > 2) {
        const _0x5ad126 = _0x3de3a4.slice(2, _0x3de3a4.length);
        _0x5b4bda = GetTranslation(_0x3de3a4[0], _0x5ad126);
        _0x3de3a4 = _0x3de3a4[1];
        _0x5ad126.forEach((_0x242934, _0x190e5c) => {
          const _0x5ec69 = new RegExp("\\$" + (_0x190e5c + 1), "g");
          _0x3de3a4 = _0x3de3a4.replace(_0x5ec69, _0x242934);
          if (_0x5b4bda) {
            _0x5b4bda = _0x5b4bda.replace(_0x5ec69, _0x242934);
          }
        });
      } else {
        _0x5b4bda = GetTranslation(_0x3de3a4[0]);
        _0x3de3a4 = _0x3de3a4[1];
      }
      if (_0x5b4bda) {
        _0x3de3a4 = _0x5b4bda;
      }
    } else {
      _0x3de3a4 = _0x3de3a4[1];
    }
  }
  if (_0x2e5c11 && typeof _0x3de3a4 == "string" && _0x3de3a4.indexOf("$1") >= 0 && _0x2e5c11?.dataset?.dataSec) {
    _0x3de3a4 = _0x3de3a4.replace("$1", _0x2e5c11.dataset.dataSec);
  }
  let _0x2da578 = null;
  if (_0xd3c581) {
    if (_0x2e5c11) {
      _0x2e5c11.innerHTML += _0x3de3a4;
    }
  } else {
    _0x2da578 = document.createTextNode(_0x3de3a4);
    if (_0x2e5c11) {
      _0x2e5c11.appendChild(_0x2da578);
    }
  }
  return _0x2da578;
}
function changeText(_0x8c614d, _0x70fc0a, _0x4d76a5) {
  for (; _0x8c614d.firstChild;) {
    _0x8c614d.removeChild(_0x8c614d.firstChild);
  }
  if (_0x8c614d.tagName.toLowerCase() == "input") {
    _0x8c614d.placeholder = _0x70fc0a;
  } else {
    addText(_0x8c614d, _0x70fc0a, _0x4d76a5);
  }
}
function setValue(_0x429497, _0x42c0d5) {
  var _0x411794 = document.getElementById(_0x429497);
  if (_0x411794) {
    if (!_0x42c0d5) {
      _0x42c0d5 = "";
    }
    _0x411794.value = _0x42c0d5;
  }
}
function setTextNode(_0x1422b4, _0x541d05, _0x50347a) {
  var _0x3b168a = document.getElementById(_0x1422b4);
  if (_0x3b168a) {
    for (; _0x3b168a.firstChild;) {
      _0x3b168a.removeChild(_0x3b168a.firstChild);
    }
    if (_0x541d05) {
      _0x3b168a.appendChild(document.createTextNode(_0x541d05));
    }
    if (_0x50347a) {
      _0x3b168a.appendChild(_0x50347a);
    }
  }
}
function addTextNode(_0xe8f265, _0x4fc9b2) {
  var _0x5cd689 = document.getElementById(_0xe8f265);
  if (_0x5cd689 && _0x4fc9b2) {
    _0x5cd689.appendChild(document.createTextNode(_0x4fc9b2));
  }
}
const capitalize = _0x3d5936 => typeof _0x3d5936 != "string" ? "" : _0x3d5936.charAt(0).toUpperCase() + _0x3d5936.slice(1);
function clearDiv(_0x52a711, _0x519d29) {
  if (!_0x519d29) {
    _0x519d29 = document.getElementById(_0x52a711);
  }
  if (_0x519d29) {
    for (; _0x519d29.firstChild;) {
      _0x519d29.removeChild(_0x519d29.firstChild);
    }
  }
  return _0x519d29;
}
function setDNone(_0xd49146, _0x5d6aa5, _0x1df2a9) {
  if (_0xd49146) {
    removeClass("d-none", _0x5d6aa5, _0x1df2a9);
  } else {
    addClass("d-none", _0x5d6aa5, _0x1df2a9);
  }
}
function addClass(_0x4fb73c, _0x107495, _0xa5e3ab) {
  if (_0x107495) {
    _0xa5e3ab = document.getElementById(_0x107495);
  }
  if (_0xa5e3ab) {
    _0xa5e3ab.classList.add(_0x4fb73c);
  }
  return _0xa5e3ab;
}
function removeClass(_0x2d22a9, _0x5cdd12, _0x1cb7f9) {
  if (_0x5cdd12) {
    _0x1cb7f9 = document.getElementById(_0x5cdd12);
  }
  if (_0x1cb7f9) {
    _0x1cb7f9.classList.remove(_0x2d22a9);
  }
  return _0x1cb7f9;
}
function removeById(_0x3805ef, _0x1f9399) {
  for (var _0x2a2ba0 = document.getElementById(_0x3805ef); _0x1f9399;) {
    if (_0x2a2ba0) {
      _0x2a2ba0 = _0x2a2ba0.parentNode;
    }
    _0x1f9399--;
  }
  if (_0x2a2ba0 != null) {
    _0x2a2ba0.parentNode.removeChild(_0x2a2ba0);
  }
}
function getById(_0x568390) {
  return document.getElementById(_0x568390);
}
function insertAfter(_0x52d27b, _0x2df497) {
  if (_0x2df497) {
    var _0x44c19a = _0x2df497.parentNode;
    if (_0x44c19a.lastchild == _0x2df497) {
      _0x44c19a.appendChild(_0x52d27b);
    } else {
      _0x44c19a.insertBefore(_0x52d27b, _0x2df497.nextSibling);
    }
  }
}
function animateTo(_0x457424, _0x311197, _0x1430b3, _0x5d60c1) {
  const _0x5a580f = {
    ..._0x1430b3
  };
  _0x5a580f.fill = "both";
  const _0x4f6ea9 = _0x457424.animate(_0x311197, _0x5a580f);
  _0x4f6ea9.addEventListener("finish", () => {
    if (_0x5d60c1) {
      _0x5d60c1();
    }
  });
  return _0x4f6ea9;
}
function animateFrom(_0x117ec2, _0x2a1865, _0x52443e, _0x1d919b) {
  const _0x23647e = {
    ..._0x2a1865
  };
  _0x23647e.offset = 0;
  const _0x30c846 = {
    ..._0x52443e
  };
  _0x30c846.fill = "backwards";
  const _0x1a7890 = _0x117ec2.animate(_0x23647e, _0x30c846);
  _0x1a7890.addEventListener("finish", () => {
    if (_0x1d919b) {
      _0x1d919b();
    }
  });
  return _0x1a7890;
}
function restrictCharacters(_0x47124c, _0x48f2e1) {
  var _0x55a377;
  if (_0x47124c.keyCode) {
    _0x55a377 = _0x47124c.keyCode;
  } else if (_0x47124c.which) {
    _0x55a377 = _0x47124c.which;
  }
  return !!String.fromCharCode(_0x55a377).match(_0x48f2e1);
}
function isColorLight(_0x6732be) {
  let _0x53a8c5;
  let _0x562257;
  let _0x1f7982;
  let _0x4c0f4b;
  return !!_0x6732be && (_0x6732be.match(/^rgb/) ? (_0x53a8c5 = (_0x6732be = _0x6732be.match(/^rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*(\d+(?:\.\d+)?))?\)$/))[1], _0x562257 = _0x6732be[2], _0x1f7982 = _0x6732be[3]) : (_0x53a8c5 = (_0x6732be = +("0x" + _0x6732be.slice(1).replace(_0x6732be.length < 5 && /./g, "$&$&"))) >> 16, _0x562257 = _0x6732be >> 8 & 255, _0x1f7982 = _0x6732be & 255), _0x4c0f4b = Math.sqrt(_0x53a8c5 * _0x53a8c5 * 0.299 + _0x562257 * _0x562257 * 0.587 + _0x1f7982 * _0x1f7982 * 0.114), _0x4c0f4b > 127.5);
}
function restrictCharacters2(_0x3f760c, _0x10db45) {
  _0x3f760c.target.value = _0x3f760c.target.value.replace(_0x10db45, "");
  return !1;
}
function setTitleBarNum(_0x199188) {
  var _0x207cca = document.getElementById("titleBar");
  if (_0x207cca && _0x207cca.count) {
    if (_0x199188 > 0) {
      _0x207cca.count.innerHTML = _0x199188;
      _0x207cca.count.style.visibility = "visible";
    } else {
      _0x207cca.count.style.visibility = "hidden";
    }
  }
}
function addTitleBar(_0x380083, _0x352951, _0x312d91, _0x4b5995, _0x517b53, _0x2793cd, _0x2be651, _0x68bd8d, _0x5b6982, _0x3e896d, _0xeb77ee) {
  var _0x57998b = clearDiv("titleBar");
  var _0x4ab06a = makeElement(_0x57998b, "div", "table htmlTitleBarButtons");
  var _0x76525a = makeElement(_0x4ab06a, "div", "row");
  var _0x563d7f = makeElement(_0x76525a, "div", _0x2be651 ? "cell htmlTitleButton d-none" : "cell htmlTitleButton");
  if (_0x68bd8d) {
    _0x563d7f.classList.remove("d-none");
  }
  _0x563d7f.addEventListener("click", _0x312d91);
  var _0x596b7a = makeElement(_0x563d7f, "span", "");
  if (_0x2793cd) {
    let _0x312774 = makeElement(_0x563d7f, "a", null, _0x2be651 ? "repIcon" : "");
    (_0x2793cd = makeElement(_0x312774, "img")).src = _0x2be651 ? "svg/reportw.svg" : "svg/plus.svg";
    _0x2793cd.width = "18";
    if (!_0x2be651) {
      _0x2793cd.style.marginTop = "-2px";
    }
    _0x563d7f.addEventListener("click", _0x4f9447 => {
      _0x4f9447.preventDefault();
      if (_0x2be651) {
        reportsDrop(_0x380083);
      } else {
        groupsDrop();
      }
    });
  } else {
    addText(_0x596b7a, _0x352951);
  }
  makeElement(_0x76525a, "div", "cell cellWide");
  var _0x46a145 = makeElement(_0x76525a, "div", "cell cellRight htmlTitleButton");
  _0x46a145.addEventListener("click", _0x517b53);
  var _0xdf77b2 = makeElement(_0x46a145, "span", "", "TitleBarRight");
  if (_0x3e896d) {
    _0x3e896d = makeElement(_0xdf77b2, "a");
    (_0x4b5995 = makeElement(_0x3e896d, "img")).src = "svg/visitors.svg";
    _0x4b5995.width = "22";
  }
  if (_0x5b6982) {
    var _0x30c780 = makeElement(_0x76525a, "div", "cell cellRight htmlTitleButton", "sideBarMob");
    makeElement(_0x30c780, "span", "", "TitleBarRight");
    let _0x14f95b = makeElement(_0x30c780, "a");
    (_0x5b6982 = makeElement(_0x14f95b, "img")).id = "sideBarMobId";
    _0x5b6982.src = "svg/arrowqb.svg";
    _0x5b6982.style.cssText = "width: 10px; margin-top: 2px; transform: scaleX(-1)";
    if (!_Activity.instance.IsClassic) {
      loadQuickBar(typeof _Activity.instance.QuickBar != "object");
    }
  }
  if (typeof _0x4b5995 == "boolean") {
    const _0xe11160 = "svg/removew.svg";
    let _0x3e7ac3 = makeElement(_0xdf77b2, "img");
    _0x3e7ac3.src = _0xe11160;
    _0x3e7ac3.width = "18";
  } else if (!_0x3e896d) {
    addText(_0xdf77b2, _0x4b5995);
  }
  var _0x41823d = makeElement(_0x57998b, "div", "table htmlTitleBar cellWide" + (_0xeb77ee ? " actionsDialog" : ""));
  var _0x542a4f = makeElement(_0x41823d, "div", "row");
  var _0x11f90e = makeElement(_0x542a4f, "div", "cell cellWide dialogCellCenter htmlTitleTitle");
  var _0x1837a0 = makeElement(_0x11f90e, "span", "", "TitleBarTitle");
  if (_0x380083.length > 0) {
    addText(_0x1837a0, _0x380083);
  }
}
function groupsDrop() {
  const _0x540e58 = document.getElementById("groupDropdown");
  _0x540e58.style.display = _0x540e58 && _0x540e58.style.display == "block" ? "none" : "block";
}
function reportsDrop(_0x7c3065) {
  if (_0x7c3065 === undefined) {
    _0x7c3065 = null;
  }
  const _0x2b3629 = Classic ? document.getElementById("reportDropdownClassic") : document.getElementById("reportDropdown");
  const _0x5d1226 = document.querySelector("#userBlock");
  const _0x7eaaea = document.querySelector("#userReport");
  if (!_0x7c3065) {
    _0x2b3629.style.display = "none";
    return;
  }
  let _0x2f53ed = _0x7c3065;
  if (!(_0x7c3065.slice(-1) != "M" && _0x7c3065.slice(-1) != "B" || isNaN(_0x7c3065.slice(0, -1)))) {
    _0x2f53ed = _0x7c3065.slice(0, -1);
  }
  let _0x5e5c9f = ["mob2.block", "Block"];
  let _0x276541 = /[a-zA-Z]/g.test(_0x2f53ed);
  const _0x9fff90 = _0x5d1226.querySelector("#blockText");
  let _0x1c5b3c = _0x276541 ? _0x7c3065.split("(")[1].slice(0, -1) : _0x7c3065;
  _0x1c5b3c = _0x1c5b3c.replace("M", "000000");
  _0x1c5b3c = _0x1c5b3c.replace("B", "000000000");
  if (getBlockedUsers()[_0x1c5b3c]) {
    _0x5e5c9f = ["mob2.unblock", "Unblock"];
  }
  _0x9fff90.innerText = "";
  addText(_0x9fff90, _0x5e5c9f);
  _0x2b3629.style.display = _0x2b3629 && _0x2b3629.style.display == "block" ? "none" : "block";
  if (_0x276541) {
    _0x7eaaea.classList.remove("d-none");
    _0x7eaaea.setAttribute("href", "https://xath.hu/report#!user&UserName=" + _0x7c3065.split(" ")[0].toLowerCase());
  } else {
    _0x7eaaea.classList.add("d-none");
  }
  _0x5d1226.onclick = () => {
    ToC({
      Command: "Block",
      UserNo: _0x1c5b3c
    });
    actions.Visible = !1;
    if (Classic) {
      setFrameVis();
    } else {
      parent.setFrameVis();
    }
    modalClose();
  };
}
function clickOut(_0x2fe4b4) {
  const _0x42c965 = document.getElementById("reportDropdown");
  let _0x493d9e = findNodeInWindowOrParent("#reportDropdownClassic");
  const _0x26db42 = findNodeInWindowOrParent("#groupDropdown");
  const _0x3dbd1b = _Activity.instance.IsClassic ? findNodeInWindowOrParent("#reportIconClassic") : findNodeInWindowOrParent(".htmlTitleButton");
  let _0x14f3c5 = _0x3dbd1b && !_0x3dbd1b.contains(_0x2fe4b4.target);
  if (_0x2fe4b4 && _0x14f3c5) {
    if (_0x26db42) {
      _0x26db42.style.display = "none";
    }
    if (_0x42c965) {
      _0x42c965.style.display = "none";
    }
    if (_0x493d9e) {
      _0x493d9e.style.display = "none";
    }
  }
  let _0x565380 = findNodeInWindowOrParent("#dropdown-content");
  if (_0x565380 && _0x2fe4b4 && !_0x2fe4b4.target.classList.contains("menuOpen")) {
    _0x565380.style.display = "none";
  }
}
function findNodeInWindowOrParent(_0x10944b, _0x3f6575) {
  if (!_0x10944b) {
    return !1;
  }
  let _0x4161fe = _0x3f6575 ? document.querySelectorAll("" + _0x10944b) : document.querySelector("" + _0x10944b);
  if (!_0x4161fe) {
    _0x4161fe = _0x3f6575 ? parent?.document?.querySelectorAll("" + _0x10944b) : parent?.document?.querySelector("" + _0x10944b);
  }
  return _0x4161fe;
}
function AddSections(_0x2bb55d, _0x45af4b, _0x487aec) {
  clearDiv("topSelector");
  var _0x583a55 = makeElement(document.getElementById("topSelector"), "div", "listTable");
  var _0x28819f = makeElement(_0x583a55, "div", "dialogRow");
  for (var _0x238b17 in _0x2bb55d) {
    var _0x1a0da4 = _0x2bb55d[_0x238b17];
    var _0xa009c2 = makeElement(_0x28819f, "div", "dialogCell");
    if (_0x45af4b) {
      _0xa009c2.Click = _0x45af4b + _0x1a0da4 + "')";
      _0xa009c2.addEventListener("click", function (_0x2d05e8) {
        let _0x4e6ee = this.Click.match(/(\w*).*?'(\w*)'/);
        switch (_0x4e6ee[1]) {
          case "configurePage":
            configurePage(0, _0x4e6ee[2]);
            break;
          case "configureStorePage":
            configureStorePage(_0x4e6ee[2]);
        }
      });
    }
    var _0x4b0903 = makeElement(_0xa009c2, "div", "listTable tabTable");
    var _0x8e84dd = makeElement(_0x4b0903, "div", "dialogRow");
    var _0x1e0aa2 = makeElement(_0x8e84dd, "div", "dialogCell dialogCellCenter tabLabelCell", "Label" + _0x1a0da4);
    var _0x4c5a3 = makeElement(_0x1e0aa2, "img", "selector");
    _0x4c5a3.height = 16;
    _0x4c5a3.width = 16;
    _0x4c5a3.src = _0x487aec ? "svg/" + _0x487aec[_0x238b17] + ".svg" : "svg/sel" + _0x1a0da4 + ".svg";
    addText(makeElement(_0x1e0aa2, "span", "selector"), ["mob1." + _0x1a0da4.toLowerCase(), _0x1a0da4]);
    var _0x1e05b6 = makeElement(_0x4b0903, "div", "dialogRow");
    makeElement(_0x1e05b6, "div", "dialogCell tabIndicatorCell", "Indicator" + _0x1a0da4);
  }
}
function SetSection(_0x3db47f) {
  var _0x1a2989;
  var _0x40e207;
  _0x1a2989 = document.getElementsByClassName("tabLabelCellSelected");
  _0x40e207 = 0;
  for (; _0x40e207 < _0x1a2989.length; _0x40e207++) {
    _0x1a2989[_0x40e207].className = "dialogCell dialogCellCenter tabLabelCell";
  }
  _0x1a2989 = document.getElementsByClassName("tabIndicatorCellSelected");
  _0x40e207 = 0;
  for (; _0x40e207 < _0x1a2989.length; _0x40e207++) {
    _0x1a2989[_0x40e207].className = "dialogCell tabIndicatorCell";
  }
  if (_0x1a2989 = document.getElementById("Label" + _0x3db47f)) {
    _0x1a2989.className += " tabLabelCellSelected";
  }
  if (_0x1a2989 = document.getElementById("Indicator" + _0x3db47f)) {
    _0x1a2989.className += " tabIndicatorCellSelected";
  }
  CurrentSec = _0x3db47f;
}
function FillInAll(_0x1fb33f, _0x354aff, _0x2907a1) {
  let _0x407150 = GetTranslation("mob2.fillall");
  if (!_0x407150) {
    _0x407150 = "Please fill in all boxes";
  }
  for (var _0x1835f5 in _0x354aff) {
    if (!_0x1fb33f[_0x354aff[_0x1835f5]]) {
      if (_0x2907a1) {
        addText(_0x2907a1, _0x407150);
      } else {
        AlertMessage(_0x407150);
      }
      return !1;
    }
  }
  return !0;
}
function DoBanDialog(_0x3d0761, _0x1a9289, _0x381478) {
  let _0x173971 = (_0x1a9289 - Date.now() / 1000) / 3600;
  _0x173971 = Math.round(_0x173971 * 100) / 100;
  if (_0x173971 < 0) {
    _0x173971 = 0;
  }
  const _0x46d8eb = new Date().toLocaleString();
  _0x381478 = _0x381478.substr(0, 500);
  const _0x30d273 = "svg/remove" + (toHex6(config.ButColW)[0] == "0" ? "b" : "w") + ".svg";
  const _0x2a6930 = "BanDialog";
  HiddenDivs[_0x2a6930] = "<div class=\"modalDialogContentClassic\" data-w=\"0.65\"><div class=\"dialogTitleBar\"><span class=\"dialogTitle\"><img src=\"svg/actBan.svg\" alt=\"completed\" class=\"transcomp\"><span data-localize=\"mob2.banned\">Banned!</span></span><span class=\"dialogTitleAction\" id=\"id_ModalClose\"><img src=\"" + _0x30d273 + "\" width=\"16\" alt=\"close\"></span></div><div class=\"dialogBody\"><div class=\"dialogPadding\"><div id=\"newAlert\"><div class=\"table\" style=\"display: flex;\"><div class=\"column transdesc\"><div data-localize=\"mob2.time\">Time</div><div data-localize=\"mob2.by\">By</div><div data-localize=\"mob2.duration\">Duration</div><div data-localize=\"mob2.reason\">Reason</div></div><div class=\"column\"><div>" + _0x46d8eb + "</div><div>" + _0x3d0761 + "</div><div>" + (_0x173971 == 0 ? "<span data-localize='mob2.forever'>Forever</span>" : _0x173971 + " <span data-localize=\"mob2.hours\">Hours</span> ") + "</div>" + (_0x381478.trim().length == 0 ? "<div style=\"overflow-y: auto; max-height: 70px;\" data-localize=\"mob2.noreason\">No reason given</div>" : "<div style=\"overflow-y: auto; max-height: 70px; word-break: break-word;\">" + _0x381478 + "</div>") + "</div></div><div class=\"banbuttons\" style=\"margin-top: 1rem;\"><a href=\"https://xath.hu/report#!group&GroupName=" + config.GroupName + "\" target=\"_blank\"><button class=\"bButton\"><img src=\"svg/inappropriate.svg\" alt=\"report\" style=\"width: 12px\" class=\"inappIc\"><span data-localize=\"mob2.unfair\">Report unfair ban</span></button></a><a id=\"modalClose\"><button class=\"bButton\"><img src=\"svg/return2.svg\" alt=\"return\" class=\"inappIc\"><span data-localize=\"mob2.return\">Return to chat</span></button></a><a href=\"https://xath.hu/groups\" target=\"_blank\"><button class=\"bButton\"><img src=\"svg/groups.svg\" alt=\"groups\" class=\"inappIc\"><span data-localize=\"mob2.findgroups\">Find other groups</span></button></a></div></div></div></div></div>";
  doModal(_0x2a6930);
  ColorTitle();
  setCstyle();
  TranslateAll();
  document.getElementById("id_ModalClose").addEventListener("click", function () {
    modalClose();
  });
  document.getElementById("modalClose").addEventListener("click", function () {
    modalClose();
  });
}
function DoTransfer(_0x1d0d8f, _0x28c275, _0x41fd57, _0x53bbf1, _0xd4dcd1) {
  _0x1d0d8f = _0x1d0d8f.substr(0, 500);
  var _0x38adb6 = "AlertDialog";
  const _0x45acfa = new Date().toLocaleString();
  const _0x21f563 = "svg/remove" + (toHex6(config.ButColW)[0] == "0" ? "b" : "w") + ".svg";
  HiddenDivs[_0x38adb6] = "<div class=\"modalDialogContentClassic\"><div class=\"dialogTitleBar\"><span class=\"dialogTitle\"><img src=\"svg/capyes.svg\" alt=\"completed\" class=\"transcomp\"><span data-localize=\"mob2.transfer\">Transfer</span></span><span class=\"dialogTitleAction\" id=\"id_ModalClose\"><img src=\"" + _0x21f563 + "\" width=\"16\" alt=\"close\"></span></div><div class=\"dialogBody\"><div class=\"dialogPadding\"><div id=\"newAlert\"><div class=\"table\" style=\"display: flex;\"><div class=\"column transdesc\"><div data-localize=\"mob2.time\">Time</div><div data-localize=\"mob2.amount\">Amount</div><div data-localize=\"mob2.from\">From</div><div data-localize=\"mob2.to\">To</div>" + (_0x1d0d8f.trim().length == 0 ? "" : "<div data-localize=\"mob2.message\">Message</div>") + "</div><div class=\"column\"><div class=\"transimp\">" + _0x45acfa + "</div><div class=\"transimp\">" + _0x53bbf1 + " xats & " + _0xd4dcd1 + " days</div><div class=\"transimp\">" + _0x28c275 + "</div><div class=\"transimp\">" + _0x41fd57 + "</div>" + (_0x1d0d8f.trim().length == 0 ? "" : "<div style=\"overflow-y: auto; max-height: 70px; color: inherit; word-break: break-word;\">" + _0x1d0d8f + "</div>") + "</div></div></div></div></div></div>";
  doModal(_0x38adb6);
  ColorTitle();
  setCstyle();
  TranslateAll();
  document.getElementById("id_ModalClose").addEventListener("click", function () {
    modalClose();
  });
}
function AlertMessage(_0x31a59a, _0x4e9bb4, _0x116362, _0x60061c) {
  var _0x7f3ccc = clearAlertMessage();
  const _0x164071 = Classic ? "svg/remove" + (toHex6(config.ButColW)[0] == "0" ? "b" : "w") + ".svg" : "svg/removew.svg";
  if (!_0x7f3ccc) {
    var _0x2cd832 = "AlertDialog";
    HiddenDivs[_0x2cd832] = "<div class=\"modalDialogContentClassic\"><div class=\"dialogTitleBar\"><span data-localize=mob1.message class=\"dialogTitle\">Message</span><span class=\"dialogTitleAction\" id=\"id_ModalClose\"><img src=\"" + _0x164071 + "\" width=\"16\" alt=\"close\"></span></div><div class=\"dialogBody\"><div class=\"dialogPadding\"><div id=\"AlertMessage\"></div></div></div></div>";
    doModal(_0x2cd832);
    document.getElementById("id_ModalClose").addEventListener("click", function () {
      modalClose();
      if (_Activity.instance.LoginBodge) {
        removeClass("d-none", 0, _Activity.instance.Window.getById("Overlays"));
        _Activity.instance.LoginBodge = !1;
      }
    });
    _0x7f3ccc = clearAlertMessage();
    ColorTitle();
    TranslateAll();
    setCstyle();
  }
  var _0x27fa5e;
  if (_0x4e9bb4) {
    _0x31a59a = _0x31a59a.replace(/<p>/g, "ZZZZ");
  }
  if (_0x116362) {
    _0x31a59a = _0x31a59a.replace(/<br>/g, "LLLLL");
  }
  _0x31a59a = (_0x31a59a = _0x31a59a.replace(/<.*?>/g, " ")).replace(/<.*/g, "");
  if (_0x4e9bb4) {
    _0x31a59a = _0x31a59a.replace(/ZZZZ/g, "<p>");
  }
  if (_0x116362) {
    _0x31a59a = _0x31a59a.replace(/LLLLL/g, "<br>");
  }
  _0x31a59a = _0x31a59a.replace(/\[link (.*?)\]/g, function (_0x7ed3c1, _0x107393) {
    _0x27fa5e = _0x107393;
    return "";
  });
  if (_0x4e9bb4) {
    _0x7f3ccc.innerHTML = _0x31a59a;
  } else {
    _0x7f3ccc.textContent = _0x31a59a;
  }
  if (_0x27fa5e) {
    var _0x2c951d = makeElement(_0x7f3ccc, "a");
    _0x2c951d.href = "https://" + _0x27fa5e;
    _0x2c951d.target = "_blank";
    addText(_0x2c951d, _0x27fa5e);
  }
  _0x7f3ccc.style.color = _0x60061c ? "#00834d" : "#F00";
  _0x7f3ccc.style.fontWeight = "bold";
  if (_0x7f3ccc = document.getElementById("openModal")) {
    _0x7f3ccc.style.visibility = "visible";
  }
}
function clearAlertMessage() {
  ConnectingClose();
  let _0x2af3db = document.getElementById("openModal");
  if (_0x2af3db) {
    _0x2af3db = _0x2af3db.getElementsByClassName("AlertMessage");
  }
  if (_0x2af3db && _0x2af3db.length > 0) {
    _0x2af3db[0].textContent = "";
    return _0x2af3db[0];
  } else {
    _0x2af3db = document.getElementById("AlertMessage");
    if (_0x2af3db) {
      _0x2af3db.textContent = "";
      return _0x2af3db;
    } else {
      return null;
    }
  }
}
function BuildDialog(_0x2eeec9, _0x352a42) {
  var _0x5682c5;
  var _0x5c1886 = _0x2eeec9 = makeElement(_0x2eeec9, "div", "modalDialogContentClassic");
  var _0x5e6e69 = _0x2eeec9;
  var _0x5bc85d = _0x2eeec9;
  for (var _0xc8dc1 in _0x352a42) {
    var _0x47d752 = _0x352a42[_0xc8dc1];
    switch (_0x47d752.type) {
      case "click":
        _0x5682c5 = addEditBox2(_0x5c1886, 0, "dialogClick", _0x47d752.name, "noedit");
        _0x47d752.icon = _0x47d752.name;
        _0x5682c5.Part = _0x47d752;
        _0x5682c5.addEventListener("click", function (_0x4711bb) {
          actions.sendApp(_0x4711bb, this.Part);
        });
        break;
      case "title":
        addEditBox2(_0x2eeec9, 0, "dialogTitleBar", _0x47d752.name, "noedit", "bold");
        _0x5bc85d = _0x5e6e69 = _0x5c1886 = makeElement(_0x2eeec9, "div", "dialogBody");
        _0x5c1886 = makeElement(_0x5c1886, "div", "dialogPadding");
        makeElement(_0x5c1886, "div", "AlertMessage");
        _0x5e6e69 = makeElement(_0x5c1886, "div", "dialogBody");
        _0x5e6e69 = makeElement(_0x5e6e69, "div", "dialogTable");
        ColorTitle();
        break;
      case "mw":
        _0x2eeec9.dataset.mw = _0x47d752.mw;
        break;
      case "password":
        addEditBox2(_0x5e6e69, _0x47d752.id, "dialogRow", _0x47d752.name, 0, 0, "password");
        break;
      case "dialog":
        addEditBox2(_0x5e6e69, _0x47d752.id, "dialogRow", _0x47d752.name);
        break;
      case "text":
        addEditBox2(_0x5c1886, 0, "", _0x47d752.name, "noedit");
        break;
      default:
        addEditBox2(_0x5bc85d, 0, "dialogActions", _0x47d752);
    }
  }
}
function addEditBox2(_0x55d244, _0x161fda, _0x47f088, _0x80744b, _0x49b9fe, _0x195cae, _0x243fcd) {
  var _0x1174a7 = makeElement(_0x55d244, "div", _0x47f088);
  const _0x303492 = "svg/remove" + (toHex6(config.ButColW)[0] == "0" ? "b" : "w") + ".svg";
  switch (_0x47f088) {
    case "dialogTitleBar":
      addText(_0x13d022 = makeElement(_0x1174a7, "span", "dialogTitle"), _0x80744b + " ");
      (_0x12b334 = makeElement(_0x1174a7, "span", "dialogTitleAction")).id = "modalCancel";
      break;
    case "dialogRow":
      addText(_0x12b334 = makeElement(_0x1174a7, "div", "dialogCell"), _0x80744b + " ");
      if (_0x49b9fe === undefined) {
        _0x49b9fe = "";
      }
      if (_0x49b9fe === "noedit") {
        break;
      }
      var _0x12b334 = makeElement(_0x1174a7, "div", "dialogCell cellWide");
      var _0x597524 = makeElement(_0x12b334, "input", "dialogInput");
      _0x597524.setAttribute("autocomplete", _0x243fcd == "password" ? "new-password" : "off");
      if (_0x243fcd == "password") {
        _0x597524.type = "password";
      } else {
        _0x597524.type = "text";
        _0x597524.value = _0x49b9fe;
      }
      _0x597524.id = _0x161fda;
      break;
    case "dialogClick":
    case "":
      addText(_0x1174a7, _0x80744b + " ");
      break;
    case "dialogActions":
      if (_0x80744b.action == "Cancel") {
        let _0x4b3ba0 = makeElement(_0x12b334 = document.getElementById("modalCancel"), "img");
        _0x4b3ba0.src = _Activity.instance.IsClassic ? _0x303492 : "svg/removew.svg";
        _0x4b3ba0.width = "16";
        _0x4b3ba0.alt = "close";
        _0x12b334.addEventListener("click", function () {
          modalClose();
        });
        _0x55d244.removeChild(_0x1174a7);
        break;
      }
      var _0x13d022;
      var _0x54169a;
      addText(_0x1174a7, " ");
      addText(_0x13d022 = makeElement(_0x1174a7, "span", "dialogActionRight"), _0x80744b.label);
      if (_0x80744b.flags & 1) {
        _0x13d022.style.opacity = "0.5";
        _0x13d022.addEventListener("click", function () {
          modalClose();
        });
      } else {
        if (typeof sendApp == "function") {
          _0x54169a = sendApp;
        }
        if (!_0x54169a && sendFunc) {
          _0x54169a = sendFunc;
        }
        _0x13d022.addEventListener("click", function (_0x501cc4) {
          clearAlertMessage();
          _0x54169a(_0x501cc4, _0x80744b.action, _0x80744b.Power);
        });
      }
  }
  return _0x1174a7;
}
function doModal(_0x13cde9, _0x5a9292, _0x34388b, _0x53c785, _0x2783a4, _0x9ebe16) {
  if (_0x9ebe16 === undefined) {
    _0x9ebe16 = () => {};
  }
  modalClose();
  var _0x59773b = makeElement(document.body, "div", _0x53c785 ? "modalDialog AnnounceFrame" : "modalDialog");
  _0x59773b.setAttribute("id", "openModal");
  var _0x443358;
  var _0x15c8eb = makeElement(_0x59773b, "div");
  var _0xffb3 = "";
  if (typeof _0x13cde9 == "string") {
    _0xffb3 = _0x13cde9.charAt(0);
  }
  if (!(_0xffb3 != "{" && _0xffb3 != "[")) {
    _0x13cde9 = JSON.parse(_0x13cde9);
  }
  if (_0x13cde9 !== null && typeof _0x13cde9 == "object") {
    BuildDialog(_0x15c8eb, _0x13cde9);
    _0x443358 = _0x15c8eb;
    _0x15c8eb.PushUp = !0;
  } else if (_0x13cde9.charAt(0) == "h") {
    var _0x562f1a = makeElement(_0x15c8eb, "iframe");
    _0x562f1a.setAttribute("src", _0x13cde9);
    _0x562f1a.setAttribute("width", 300);
    _0x562f1a.setAttribute("height", 500);
    _0x443358 = _0x562f1a;
  } else {
    _0x443358 = makeElement(_0x15c8eb, "div");
    CacheHiddenDivs();
    _0x443358.innerHTML = HiddenDivs[_0x13cde9];
    TranslateNodes(_0x443358);
    if (typeof messages != "undefined" && typeof messages.openSmiliesDialog == "function") {
      messages.openSmiliesDialog();
    }
  }
  _0x59773b.style.opacity = 1;
  _0x59773b.style.pointerEvents = "auto";
  _0x443358.addEventListener("click", function (_0x2800b0) {
    _0x2800b0.stopPropagation();
  });
  if (_0x34388b) {
    posModal(_0x443358, _0x5a9292, true);
  } else {
    posModal(_0x443358, _0x5a9292);
  }
  _0x9ebe16(document);
  setCstyle(null, _0x2783a4);
  return _0x443358;
}
function posModal(_0x3c4946, _0x1f0424, _0x1c6721) {
  if (_0x3c4946) {
    if (!_0x1f0424) {
      _0x1f0424 = {};
    }
    var _0x21de5b = _0x3c4946.firstElementChild;
    if (selector?.isCaptchaPage()) {
      _0x1f0424.mw = 100;
    }
    var _0x141537 = _0x21de5b.dataset.w;
    if (_0x1f0424.w) {
      _0x141537 = _0x1f0424.w;
    }
    if (!_0x141537) {
      _0x141537 = 0.4;
    }
    var _0x1dff32 = 0;
    if (_0x3c4946.offsetParent) {
      _0x1dff32 = _0x3c4946.offsetParent.offsetWidth;
    }
    if (!_0x1dff32) {
      _0x1dff32 = _0x3c4946.parentNode.offsetWidth;
    }
    var _0x15436d = xInt(_0x21de5b.dataset.mw);
    if (_0x1f0424.mw) {
      _0x15436d = _0x1f0424.mw;
    }
    if (_0x15436d < 10) {
      _0x15436d = 270;
    }
    var _0x2c2b02 = _0x1f0424.h;
    if (!_0x2c2b02) {
      _0x2c2b02 = _0x21de5b.dataset.h;
    }
    var _0x4faa54 = xInt(_0x21de5b.dataset.mh);
    if (_0x1f0424.mh) {
      _0x4faa54 = _0x1f0424.mh;
    }
    if (_0x4faa54 < 10) {
      _0x4faa54 = 30;
    }
    if (_0x1dff32 * _0x141537 < _0x15436d && (_0x141537 = _0x15436d / _0x1dff32) > 0.95) {
      _0x141537 = 0.95;
    }
    var _0x39e5fb = (1 - _0x141537) / 2;
    var _0x33fd2c = _0x21de5b.offsetHeight;
    var _0x5d7d36 = 0;
    if (_0x3c4946.offsetParent) {
      _0x5d7d36 = _0x3c4946.offsetParent.offsetHeight;
    }
    if (!_0x5d7d36) {
      _0x5d7d36 = _0x3c4946.parentNode.offsetHeight;
    }
    if (_0x33fd2c < _0x4faa54) {
      _0x33fd2c = _0x4faa54;
    }
    if (_0x2c2b02 && _0x33fd2c < _0x5d7d36 * _0x2c2b02) {
      _0x33fd2c = _0x5d7d36 * _0x2c2b02;
    }
    if (_0x33fd2c > _0x5d7d36 - 40) {
      _0x33fd2c = _0x5d7d36 - 40;
    }
    _0x4faa54 = xInt(_0x33fd2c);
    var _0x529d27 = _0x1c6721 ? (_0x5d7d36 - _0x33fd2c) / 3.8 : (_0x5d7d36 - _0x33fd2c) / 2;
    if (config.PhoneType == PhoneTypes.DROIDPHONE || config.PhoneType == PhoneTypes.WEB || _0x21de5b.dataset.pu) {
      _0x3c4946.PushUp = _0x3c4946.PushUp || _0x21de5b.dataset.pu || document.getElementById("PushUp");
    } else {
      _0x3c4946.PushUp = false;
    }
    if (_0x3c4946.PushUp) {
      _0x529d27 = (_0x5d7d36 - _0x33fd2c - 250) / 2;
    }
    if (_0x529d27 < 10) {
      _0x529d27 = 10;
    }
    _0x529d27 = xInt(_0x529d27);
    var _0x43e3aa = xInt(_0x1dff32 * _0x39e5fb);
    _0x1dff32 -= _0x43e3aa * 2;
    if (Classic && _0x1f0424?.customHeight) {
      _0x33fd2c = _0x1f0424?.customHeight + 30;
    }
    var _0x590b8d = "";
    if (_0x4faa54 > 30) {
      _0x590b8d = "height:" + _0x33fd2c + "px;";
    }
    _0x21de5b.style.cssText = "width:" + _0x1dff32 + "px; left:" + _0x43e3aa + "px; top: " + _0x529d27 + "px;" + _0x590b8d;
  }
}
function modalClose(_0x4eecda) {
  removeById("openModal");
  if (_0x4eecda) {
    const _0x2595a1 = findNodeInWindowOrParent("#FrameBack");
    if (_0x2595a1 && !_0x2595a1.classList.contains("d-none")) {
      _0x2595a1.classList.add("d-none");
    }
  }
}
function heightModal(_0x504a39) {
  if (!_0x504a39) {
    return;
  }
  let _0x2d6070 = window?.parent?.document;
  if (!_0x2d6070) {
    return;
  }
  let _0x155fb6 = _0x2d6070?.querySelector(".modalDialogContentClassic");
  if (_0x155fb6) {
    _0x155fb6.style.height = _0x504a39 + 30 + "px";
  }
}
function CacheHiddenDivs() {
  if (!DoneHiddenDivs) {
    DoneHiddenDivs = !0;
    var _0x2685e8;
    var _0x47cbe9;
    var _0x4d0881 = document.getElementsByClassName("dialog");
    for (_0x2685e8 = 0; _0x2685e8 < _0x4d0881.length; _0x2685e8++) {
      _0x47cbe9 = _0x4d0881[_0x2685e8];
      if (!(Classic && _0x47cbe9.id == "LoginForm")) {
        HiddenDivs[_0x47cbe9.id] = _0x47cbe9.innerHTML;
        _0x47cbe9.innerHTML = "";
      }
    }
  }
}
function AddHammer(_0x4cf82a, _0x2e86e1, _0xc46e19) {
  var _0x251d31;
  switch (_0x2e86e1) {
    case Hammer.DIRECTION_LEFT:
      _0x251d31 = "swipeleft";
      break;
    case Hammer.DIRECTION_RIGHT:
      _0x251d31 = "swiperight";
      break;
    default:
      _0x251d31 = "swipeleft swiperight";
      _0x2e86e1 = Hammer.DIRECTION_HORIZONTAL;
  }
  const _0x527295 = {
    direction: _0x2e86e1
  };
  const _0x438228 = {
    userselect: !1
  };
  var _0x120425 = new Hammer(_0x4cf82a, {
    preventDefault: !0,
    recognizers: [[Hammer.Swipe, _0x527295]],
    cssProps: _0x438228
  });
  _0x120425.on(_0x251d31, function (_0x372d35) {
    if (!_Activity.instance.IsClassic && _Activity.instance.QuickBar) {
      _Activity.instance.QuickBar.shouldCloseQuickBar(_0x372d35);
    }
    const _0x57a700 = {
      Type: _0x372d35.type
    };
    var _0x1f8332 = _0x57a700;
    if (_0x372d35.target.id) {
      _0x1f8332.id = _0x372d35.target.id;
    } else if (_0x372d35.target.parentNode.id) {
      _0x1f8332.id = _0x372d35.target.parentNode.id;
    }
    _0xc46e19(0, _0x1f8332);
  });
  return _0x120425;
}
function SetTotalUnRead(_0x56d751) {
  var _0x164428 = document.getElementById("titleBar");
  if (_0x164428 && _0x164428.count) {
    if (_0x56d751 == 0) {
      _0x164428.count.style.visibility = "hidden";
    } else {
      if (_0x56d751 > 9) {
        _0x56d751 = "9+";
      }
      _0x164428.count.innerHTML = _0x56d751;
      _0x164428.count.style.visibility = "visible";
    }
  }
}
function getXats() {
  modalClose();
  HitWeb(openBuyPage());
}
function ShowCaptcha(_0x230d4a) {
  _Activity.instance.Selector.CapJson = _0x230d4a;
  _Activity.instance.Selector.DoLoginEtc("AreYouABot");
}
function saveSetting(_0x3ef6a7, _0x2ab363, _0x756a89) {
  if (_0x756a89) {
    return ToC({
      Type: "Macro",
      Command: "Macro",
      Name: _0x3ef6a7,
      Value: _0x2ab363
    });
  }
  ToC({
    Page: "settings",
    Type: "Setting",
    Command: "Setting",
    Name: _0x3ef6a7,
    Value: _0x2ab363
  });
}
function NOP() {}
function isEmpty(_0x321f6e) {
  for (var _0x6cdb04 in _0x321f6e) {
    if (_0x321f6e.hasOwnProperty(_0x6cdb04)) {
      return !1;
    }
  }
  return !0;
}
function setPmMode(_0x25c276, _0x5c7bda, _0x42ba7b, _0x17b11a) {
  if (!_0x17b11a) {
    _0x17b11a = parent.document;
  }
  const _0x43fb9f = _0x17b11a.getElementById("textEntryEditable");
  const _0x5ae336 = _0x17b11a.getElementById("pmWrapper");
  _0x5ae336.innerHTML = "";
  _0x5ae336.style.display = "block";
  if (!_0x25c276) {
    _0x5ae336.style.pointerEvents = "none";
    _0x5ae336.style.display = "none";
    _0x43fb9f.classList.remove("sided");
    PMMODE = false;
    return;
  }
  PMMODE = !0;
  _0x43fb9f.classList.add("sided");
  _0x5ae336.dataset.userno = _0x5c7bda;
  _0x5ae336.dataset.regname = _0x42ba7b;
  addToolTip(makeElement(_0x5ae336, "div", "pmLock"), ["mob2.sendingto", "Sending to: $1", _0x42ba7b], {
    position: "low",
    dom: _0x17b11a
  });
  const _0x18bf71 = makeElement(_0x5ae336, "div", "pmDel");
  const _0x5cf335 = {
    dom: _0x17b11a
  };
  addToolTip(_0x18bf71, ["box.66", "Cancel"], _0x5cf335);
  _0x18bf71.addEventListener("click", () => {
    setPmMode(!1);
  });
  _0x18bf71.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" version="1.1" xmlns:xlink="http://www.w3.org/1999/xlink" preserveAspectRatio="none" x="0px" y="0px" width="40px" height="40px" viewBox="0 0 40 40">
        <defs>
            <g id="_App_Icons_cancel_0_Layer0_0_FILL">
                <path fill="#19191b" stroke="none" d="
                M 12.2 3.85
                Q 11.6 3.85 11.2 4.25
                L 8.9 6.6 6.55 4.25
                Q 6.35 4.05 6.15 4 5.9 3.85 5.6 3.85 5 3.85 4.55 4.3 4.1 4.75 4.1 5.3 4.1 5.9 4.55 6.3
                L 6.85 8.6 4.5 11
                Q 4.05 11.4 4.05 12 4.05 12.55 4.5 13 4.95 13.45 5.5 13.45 6.1 13.45 6.5 13
                L 8.9 10.65 10.3 12.05 10.35 12.05 10.35 12.1 11.25 13
                Q 11.7 13.45 12.25 13.45 12.85 13.45 13.3 13 13.7 12.55 13.7 12 13.7 11.4 13.3 11
                L 10.9 8.6 13.25 6.3
                Q 13.65 5.9 13.65 5.3 13.65 4.75 13.2 4.3 12.75 3.85 12.2 3.85 Z"/>
            </g>

            <path id="_App_Icons_cancel_0_Layer0_0_1_STROKES" stroke="#19191b" stroke-width="1" stroke-linejoin="round" stroke-linecap="round" fill="none" d="
            M 17.6 8.8
            Q 17.6 12.45 15 15 12.45 17.6 8.8 17.6 5.15 17.6 2.55 15 0 12.45 0 8.8 0 5.15 2.55 2.55 5.15 0 8.8 0 12.45 0 15 2.55 17.6 5.15 17.6 8.8 Z"/>
        </defs>

        <g transform="matrix( 1.76702880859375, 0, 0, 1.76702880859375, 4.5,4.4) ">
            <g transform="matrix( 1, 0, 0, 1, 0,0) ">
                <use xlink:href="#_App_Icons_cancel_0_Layer0_0_FILL"/>

                <use xlink:href="#_App_Icons_cancel_0_Layer0_0_1_STROKES"/>
            </g>
        </g>
    </svg>`;
}
function sendPm(_0x273a97, _0x36b269) {
  if (_0x36b269.length !== 0) {
    ToC({
      Command: "Action",
      Message: _0x36b269,
      Next: "messages",
      Page: "actions",
      Type: "Action",
      UserNo: _0x273a97,
      name: "PrivateMessage"
    });
  }
}
function MakeHelpMessage(_0x12ea4a, _0x45ebc4, _0x5a8995) {
  if (!_0x45ebc4) {
    _0x45ebc4 = "";
  }
  var _0x2e8537 = makeElement(0, "li", "message", _0x45ebc4);
  var _0x59a750 = makeElement(_0x2e8537, "div", "listTable");
  var _0x5aa39b = makeElement(_0x59a750, "div", "dialogRow");
  var _0x5925a2 = makeElement(_0x5aa39b, "div", "dialogCell cellWide noPointer");
  var _0x314925 = makeElement(_0x5925a2, "div", "noftxt");
  if (!Classic) {
    _0x314925.style.width = "100%";
  }
  _0x314925.innerHTML = "";
  var _0x581a33 = makeElement(_0x314925, "p");
  _0x581a33.className = "chatsMessage";
  if (!Classic) {
    _0x581a33.style.cssText = "white-space: normal; margin-left: 3px";
  }
  createTextSm(_0x581a33, _0x12ea4a);
  if (_0x5a8995) {
    _0x5a8995.p = _0x581a33;
    _0x5a8995.msg = _0x314925;
  }
  return _0x2e8537;
}
function InitPage(_0x44efa) {
  if (_0x44efa.length > 1) {
    ConnectingOpen(_0x44efa);
  } else {
    ConnectingClose();
  }
}
document.addEventListener("click", clickOut, !0);
var connType;
var connTimeout = null;
function ConnectingClose() {
  if (connTimeout) {
    clearTimeout(connTimeout);
  }
  connTimeout = null;
  removeById("Connecting");
}
function ConnectingOpen(_0xf3ac53) {
  if (_0xf3ac53 && document.getElementById("Connecting")) {
    var _0x1ebae0 = document.getElementById("loading");
    if (_0x1ebae0) {
      _0x1ebae0.innerHTML = _0xf3ac53 + "&nbsp;<span>.</span><span>.</span><span>.</span></div>";
      return;
    }
  }
  if (_0xf3ac53) {
    connType = _0xf3ac53;
    if (connTimeout) {
      clearTimeout(connTimeout);
    }
    connTimeout = // TOLOOK
    setTimeout(ConnectingOpen, 500);
    return;
  }
  ConnectingClose();
  var _0x3d4b3b = makeElement(document.body, "div", "connectingDialog");
  _0x3d4b3b.setAttribute("id", "Connecting");
  var _0x49f62a = makeElement(_0x3d4b3b, "div");
  _0x49f62a.innerHTML = "<!DOCTYPE html><html lang=\"en\"><body><div id=\"xatLoader\"><div id=\"xatLoaderInner\"><img id=\"planet\" src=\"svg/x.svg\"/><img id=\"rocket\" src=\"svg/ss.svg\" /><div id=\"loading\" class=\"txt\"><span id=\"ConMsgId\"></span>&nbsp;<span>.</span><span>.</span><span>.</span></div></div></div></body></html>";
  addText(document.getElementById("ConMsgId"), ["mod1." + connType.toLowerCase(), connType]);
  _0x49f62a.style.top = xInt((_0x3d4b3b.clientHeight - _0x49f62a.clientHeight) / 2) + "px";
  _0x3d4b3b.style.opacity = 1;
  _0x3d4b3b.style.pointerEvents = "auto";
  document.getElementById("xatLoader").addEventListener("click", function () {
    ConnectingClose();
  });
}
function onSwear(_0x51f3a0) {
  var _0x310a12 = _0x51f3a0.target;
  _0x310a12.className = "";
  _0x310a12.onclick = null;
  _0x51f3a0.preventDefault();
}
function ST2(_0x315add, _0x2c948f, _0x397104, _0x3e7d05, _0x3588d6) {
  if (_0x2c948f != null) {
    _0x315add = _0x315add.slice(0, _0x315add.indexOf("$1")) + _0x2c948f + _0x315add.slice(_0x315add.indexOf("$1") + 2);
  }
  if (_0x397104 != null) {
    _0x315add = _0x315add.slice(0, _0x315add.indexOf("$2")) + _0x397104 + _0x315add.slice(_0x315add.indexOf("$2") + 2);
  }
  if (_0x3e7d05 != null) {
    _0x315add = _0x315add.slice(0, _0x315add.indexOf("$3")) + _0x3e7d05 + _0x315add.slice(_0x315add.indexOf("$3") + 2);
  }
  if (_0x3588d6 != null) {
    _0x315add = _0x315add.slice(0, _0x315add.indexOf("$4")) + _0x3588d6 + _0x315add.slice(_0x315add.indexOf("$4") + 2);
  }
  return _0x315add;
}
function GetAsMB(_0x4294af) {
  let _0x4bb365 = _0x4294af.toString();
  if (_0x4bb365.substr(-9, 9) == "000000000") {
    _0x4bb365 = _0x4bb365.substr(0, _0x4bb365.length - 9) + "B";
  }
  if (_0x4bb365.substr(-6, 6) == "000000") {
    _0x4bb365 = _0x4bb365.substr(0, _0x4bb365.length - 6) + "M";
  }
  return _0x4bb365;
}
function xInt(_0x29327d) {
  _0x29327d = parseInt(_0x29327d);
  if (isNaN(_0x29327d)) {
    return 0;
  } else {
    return _0x29327d;
  }
}
function microtime(_0x428d4d) {
  var _0x3a2613 = new Date().getTime() / 1000;
  var _0x234003 = parseInt(_0x3a2613, 10);
  if (_0x428d4d) {
    return _0x3a2613;
  } else {
    return Math.round((_0x3a2613 - _0x234003) * 1000) / 1000 + " " + _0x234003;
  }
}
function urldecode(_0x23ae5f) {
  return decodeURIComponent((_0x23ae5f + "").replace(/\+/g, "%20"));
}
function ObjToQuery(_0x3018b2) {
  return Object.keys(_0x3018b2).map(function (_0x3c67e2) {
    return _0x3c67e2 + "=" + _0x3018b2[_0x3c67e2];
  }).join("&");
}
function objToXatJson(_0x37fa4a) {
  if (_0x37fa4a) {
    return Object.keys(_0x37fa4a).map(_0x26e4bc => _0x26e4bc + "/" + _0x37fa4a[_0x26e4bc]).join("//");
  } else {
    return "";
  }
}
function xatJsonToObj(_0x345c16) {
  if (!_0x345c16.length) {
    return {};
  }
  const _0x5e6449 = {};
  _0x345c16.split("//").forEach(_0x10d7ef => {
    _0x10d7ef = _0x10d7ef.split("/");
    _0x5e6449[_0x10d7ef[0]] = _0x10d7ef[1];
  });
  return _0x5e6449;
}
function loadJSON(_0x46b87b, _0x35fc08, _0xdf8fd2, _0x109808) {
  var _0xa443d8 = new XMLHttpRequest();
  _0xa443d8.onreadystatechange = function () {
    if (_0xa443d8.readyState === 4) {
      if (_0xa443d8.status === 200) {
        if (_0x35fc08) {
          var _0x1bc505;
          try {
            _0x1bc505 = JSON.parse(_0xa443d8.responseText);
          } catch (_0x483c2a) {
            if (_0xdf8fd2) {
              _0xdf8fd2(_0x483c2a);
            }
          }
          if (_0x1bc505) {
            _0x35fc08(_0x1bc505);
          }
        }
      } else if (_0xdf8fd2) {
        _0xdf8fd2(_0xa443d8);
      }
    }
  };
  if (_0x109808) {
    _0xa443d8.open("POST", _0x46b87b, true);
    _0xa443d8.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    _0xa443d8.send(ObjToQuery(_0x109808));
  } else {
    _0xa443d8.open("GET", _0x46b87b, true);
    _0xa443d8.send();
  }
}
function loadHTML(_0x17e6ce, _0x2e30a1, _0x5dc000, _0x4b7c43) {
  var _0x92edfa = new XMLHttpRequest();
  _0x92edfa.onreadystatechange = function () {
    if (_0x92edfa.readyState === 4) {
      if (_0x92edfa.status === 200) {
        if (_0x2e30a1) {
          _0x2e30a1(_0x92edfa.responseText);
        }
      } else if (_0x5dc000) {
        _0x5dc000(_0x92edfa);
      }
    }
  };
  if (_0x4b7c43) {
    _0x92edfa.open("POST", _0x17e6ce, true);
    _0x92edfa.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    _0x92edfa.send(ObjToQuery(_0x4b7c43));
  } else {
    _0x92edfa.open("GET", _0x17e6ce, true);
    _0x92edfa.send();
  }
}
function iosAllowCookies() {
  localStorage.setItem("mobCookies", 1);
}
function openBuyPage(_0x7a045c, _0x5da3cd) {
  let _0x5efb4f = "_blank";
  let _0x4b5026 = "https://xath.hu/buy";
  let _0x2ad677 = {};
  try {
    _0x2ad677 = JSON.parse(localStorage.getItem("todo"));
  } catch (_0x21da9e) {}
  if (!_0x2ad677) {
    _0x2ad677 = {};
  }
  if (_Activity.instance.IsAndroidApp && _0x2ad677?.w_registered || !_0x7a045c && _Activity.instance.IsIOSApp && _0x2ad677?.w_registered) {
    _0x5efb4f = "_self";
    _0x4b5026 = "xat://buy-xats?userId=" + _0x2ad677.w_userno + "&userName=" + _0x2ad677.w_registered + "&deviceId=" + _0x2ad677.DeviceId + "&passHash=" + _0x2ad677.PassHash;
  } else if (_0x7a045c && _Activity.instance.IsIOSApp && _0x2ad677?.w_registered) {
    _0x7a045c = !1;
    const _0x5e5501 = {
      userId: _0x2ad677.w_userno,
      userName: _0x2ad677.w_registered,
      deviceId: _0x2ad677.DeviceId,
      passHash: _0x2ad677.PassHash
    };
    const _0xa09e5f = _0x5e5501;
    window.webkit.messageHandlers.xatStore.postMessage(_0xa09e5f);
  }
  const _0x18fd17 = _0x5da3cd ?? window;
  if (!_0x7a045c) {
    return _0x4b5026;
  }
  _0x18fd17.open(_0x4b5026, _0x5efb4f);
}
const PawnFlags = {
  isRegistered: 1,
  isSubscriber: 2,
  isBffed: 4,
  isMarried: 8,
  isBuddyAbove: 16,
  isBuddyBelow: 32,
  isInvisible: 64,
  isAway: 128,
  isGagged: 256
};
const NamePowers = {
  statusglow: 16,
  statuscol: 32,
  glow: 4,
  col: 8,
  status: 2,
  hat: 1,
  red: 64,
  green: 128,
  blue: 256,
  light: 512,
  nospace: 1024,
  jewel: 4096,
  flag: 8192,
  wave: 16384,
  grad: 32768,
  valid: 65536,
  everypower: 131072,
  bump: 262144,
  mirror: 524288,
  invert: 1048576,
  typing: 2097152,
  away: 4194304,
  hasdays: 8388608,
  invisible: 16777216,
  sline: 33554432,
  category: 67108864,
  nolinks: 268435456,
  hasprofile: 1073741824,
  animate: 2048,
  shuffle: 134217728,
  istickle: 1,
  mark: 2,
  xavi: 4,
  isBot: 8,
  zoom: 16,
  reghide: 32,
  subhide: 64,
  isBlocked: 128,
  blockedUs: 256,
  verified: 17,
  isAway: 512,
  Transparent: 65536,
  ChatIsDebug: 128,
  NoSmilieLine: 2048
};
function DecodeColor(_0x2ba4f1, _0x56a256) {
  if (_0x2ba4f1 != null) {
    if (_0x56a256 & NamePowers.valid) {
      for (;;) {
        if (_0x2ba4f1.length == 6 && _0x2ba4f1.replace(/[^0-9a-fA-F]/g, "").length == 6) {
          break;
        }
        if (_0x2ba4f1.length == _0x2ba4f1.replace(/[^rgb\-\+]/g, "").length) {
          break;
        }
        return _0x2ba4f1;
      }
    }
    var _0x179794 = (_0x56a256 & NamePowers.red) > 0;
    var _0x114f7d = (_0x56a256 & NamePowers.green) > 0;
    var _0x4c0358 = (_0x56a256 & NamePowers.blue) > 0;
    var _0x27f22b = (_0x56a256 & NamePowers.light) > 0;
    if (_0x179794 != 0 || _0x114f7d != 0 || _0x4c0358 != 0 || _0x27f22b != 0) {
      var _0x53bcbb = (_0x2ba4f1 = _0x2ba4f1.toLowerCase()).split("r").length - 1;
      var _0x2af2a0 = _0x2ba4f1.split("g").length - 1;
      var _0x483182 = _0x2ba4f1.split("b").length - 1;
      var _0x4fb3a8 = _0x2ba4f1.split("+").length - 1;
      var _0x207d35 = _0x2ba4f1.split("-").length - 1;
      var _0x5fbc13 = 0.5;
      if (_0x53bcbb == 0 && _0x2af2a0 == 0 && _0x4fb3a8 == 0 && _0x207d35 == 0) {
        for (var _0x260eec = 0, _0x40a415 = 0; _0x40a415 < _0x2ba4f1.length; _0x40a415++) {
          var _0x430f54 = _0x2ba4f1.charAt(_0x40a415);
          if ((_0x260eec = _0x430f54 >= "0" && _0x430f54 <= "9" || _0x430f54 >= "a" && _0x430f54 <= "f" ? _0x260eec + 1 : 0) == 6) {
            var _0x1cfe47 = parseInt(_0x2ba4f1.substr(_0x40a415 - _0x260eec + 1, 6), 16);
            if (_0x179794 != 0 && _0x114f7d != 0 && _0x4c0358 != 0 && _0x27f22b != 0) {
              return _0x1cfe47;
            }
            _0x483182 = _0x1cfe47 & 255;
            _0x2af2a0 = _0x1cfe47 >> 8 & 255;
            _0x53bcbb = _0x1cfe47 >> 16 & 255;
            _0x4fb3a8 = _0x207d35 = 0;
            if (_0x27f22b != 0) {
              _0x5fbc13 = (Math.min(_0x53bcbb, Math.min(_0x2af2a0, _0x483182)) + Math.max(_0x53bcbb, Math.max(_0x2af2a0, _0x483182))) / 512;
            }
            break;
          }
        }
      }
      if (_0x53bcbb != 0 || _0x2af2a0 != 0 || _0x483182 != 0 || _0x4fb3a8 != 0 || _0x207d35 != 0) {
        if (_0x179794 == 0) {
          _0x53bcbb = 0;
        }
        if (_0x114f7d == 0) {
          _0x2af2a0 = 0;
        }
        if (_0x4c0358 == 0) {
          _0x483182 = 0;
        }
        if (_0x27f22b == 0) {
          _0x4fb3a8 = _0x207d35 = 0;
        }
        if (_0x53bcbb == 0 && _0x2af2a0 == 0 && _0x483182 == 0) {
          _0x53bcbb = _0x2af2a0 = _0x483182 = 1;
        }
        var _0x31d364;
        var _0x175034;
        var _0x135f88;
        var _0x4c54aa;
        var _0x49a5fc;
        var _0x28cb4c;
        var _0x326758 = _0x53bcbb / (_0x53bcbb + _0x2af2a0 + _0x483182);
        var _0x262ad9 = _0x2af2a0 / (_0x53bcbb + _0x2af2a0 + _0x483182);
        var _0xc3689a = _0x483182 / (_0x53bcbb + _0x2af2a0 + _0x483182);
        var _0x4c8ebf = Math.min(_0x326758, Math.min(_0x262ad9, _0xc3689a));
        var _0x4230d9 = Math.max(_0x326758, Math.max(_0x262ad9, _0xc3689a));
        var _0x54de09 = _0x4230d9 - _0x4c8ebf;
        _0x28cb4c = (_0x4230d9 + _0x4c8ebf) / 2;
        if (_0x54de09 == 0) {
          _0x4c54aa = _0x49a5fc = 0;
        } else {
          _0x49a5fc = _0x28cb4c < 0.5 ? _0x54de09 / (_0x4230d9 + _0x4c8ebf) : _0x54de09 / (2 - _0x4230d9 - _0x4c8ebf);
          var _0x235547 = ((_0x4230d9 - _0x326758) / 6 + _0x54de09 / 2) / _0x54de09;
          var _0xf32fef = ((_0x4230d9 - _0x262ad9) / 6 + _0x54de09 / 2) / _0x54de09;
          var _0xa536fc = ((_0x4230d9 - _0xc3689a) / 6 + _0x54de09 / 2) / _0x54de09;
          if (_0x326758 == _0x4230d9) {
            _0x4c54aa = _0xa536fc - _0xf32fef;
          } else if (_0x262ad9 == _0x4230d9) {
            _0x4c54aa = 1 / 3 + _0x235547 - _0xa536fc;
          } else if (_0xc3689a == _0x4230d9) {
            _0x4c54aa = 2 / 3 + _0xf32fef - _0x235547;
          }
          if (_0x4c54aa < 0) {
            _0x4c54aa += 1;
          }
          if (_0x4c54aa > 1) {
            _0x4c54aa -= 1;
          }
        }
        if ((_0x28cb4c = _0x5fbc13 + _0x4fb3a8 * 0.0625 - _0x207d35 * 0.0625) < 0) {
          _0x28cb4c = 0;
        }
        if (_0x28cb4c > 1) {
          _0x28cb4c = 1;
        }
        if (_0x49a5fc == 0) {
          _0x31d364 = _0x175034 = _0x135f88 = _0x28cb4c;
        } else {
          var _0x39fba1 = _0x28cb4c * 2 - (_0x40a415 = _0x28cb4c < 0.5 ? _0x28cb4c * (1 + _0x49a5fc) : _0x28cb4c + _0x49a5fc - _0x49a5fc * _0x28cb4c);
          _0x31d364 = _0x323cd5(_0x39fba1, _0x40a415, _0x4c54aa + 1 / 3);
          _0x175034 = _0x323cd5(_0x39fba1, _0x40a415, _0x4c54aa);
          _0x135f88 = _0x323cd5(_0x39fba1, _0x40a415, _0x4c54aa - 1 / 3);
        }
        return ((_0x31d364 = Math.round(_0x31d364 * 255)) << 16) + ((_0x175034 = Math.round(_0x175034 * 255)) << 8) + (_0x135f88 = Math.round(_0x135f88 * 255));
      }
    }
  }
  function _0x323cd5(_0x14feb0, _0xd84305, _0x56eacb) {
    if (_0x56eacb < 0) {
      _0x56eacb += 1;
    }
    if (_0x56eacb > 1) {
      _0x56eacb -= 1;
    }
    if (_0x56eacb * 6 < 1) {
      return _0x14feb0 + (_0xd84305 - _0x14feb0) * 6 * _0x56eacb;
    } else if (_0x56eacb * 2 < 1) {
      return _0xd84305;
    } else if (_0x56eacb * 3 < 2) {
      return _0x14feb0 + (_0xd84305 - _0x14feb0) * (2 / 3 - _0x56eacb) * 6;
    } else {
      return _0x14feb0;
    }
  }
}
function toHex6(_0x187aa7) {
  return ("00000" + Number(_0x187aa7).toString(16)).slice(-6).toUpperCase();
}
function MakeGlow(_0x5f4eff) {
  var _0x3e59ad = "0 0 0.2rem #" + toHex6(_0x5f4eff);
  return _0x3e59ad + "," + _0x3e59ad + "," + _0x3e59ad;
}
function MakeStatusGlow(_0xe86177) {
  return "0 0 0.134rem #" + toHex6(_0xe86177);
}
function rgbtohsv(_0x18b7a7) {
  var _0xef3e4b;
  var _0x69aaf3;
  var _0x85bb3c = (_0x18b7a7 >> 16 & 255) / 255;
  var _0x44705d = (_0x18b7a7 >> 8 & 255) / 255;
  var _0x2ab517 = (_0x18b7a7 & 255) / 255;
  var _0x434d67 = Math.min(_0x85bb3c, _0x44705d, _0x2ab517);
  var _0x8008ec = Math.max(_0x85bb3c, _0x44705d, _0x2ab517);
  _0xef3e4b = _0x434d67 == _0x8008ec ? 0 : _0x8008ec == _0x85bb3c ? ((_0x44705d - _0x2ab517) * 60 / (_0x8008ec - _0x434d67) + 360) % 360 : _0x8008ec == _0x44705d ? (_0x2ab517 - _0x85bb3c) * 60 / (_0x8008ec - _0x434d67) + 120 : (_0x85bb3c - _0x44705d) * 60 / (_0x8008ec - _0x434d67) + 240;
  _0x69aaf3 = _0x8008ec == 0 ? 0 : (_0x8008ec - _0x434d67) / _0x8008ec;
  return new Array(_0xef3e4b, _0x69aaf3, _0x8008ec);
}
function hsvtorgb(_0x1678ff, _0x5aaf26, _0x3011f7) {
  var _0x2bc2ce;
  var _0x376f01;
  var _0x248b87;
  var _0x25094c;
  var _0xd17c4c;
  var _0x4caad;
  var _0x1c4f53;
  var _0x13a494;
  _0x1678ff %= 360;
  if (_0x3011f7 == 0) {
    return 0;
  }
  _0x4caad = _0x3011f7 * (1 - _0x5aaf26);
  _0x1c4f53 = _0x3011f7 * (1 - _0x5aaf26 * (_0xd17c4c = (_0x1678ff /= 60) - (_0x25094c = Math.floor(_0x1678ff))));
  _0x13a494 = _0x3011f7 * (1 - _0x5aaf26 * (1 - _0xd17c4c));
  switch (_0x25094c) {
    case 0:
      _0x2bc2ce = _0x3011f7;
      _0x376f01 = _0x13a494;
      _0x248b87 = _0x4caad;
      break;
    case 1:
      _0x2bc2ce = _0x1c4f53;
      _0x376f01 = _0x3011f7;
      _0x248b87 = _0x4caad;
      break;
    case 2:
      _0x2bc2ce = _0x4caad;
      _0x376f01 = _0x3011f7;
      _0x248b87 = _0x13a494;
      break;
    case 3:
      _0x2bc2ce = _0x4caad;
      _0x376f01 = _0x1c4f53;
      _0x248b87 = _0x3011f7;
      break;
    case 4:
      _0x2bc2ce = _0x13a494;
      _0x376f01 = _0x4caad;
      _0x248b87 = _0x3011f7;
      break;
    case 5:
      _0x2bc2ce = _0x3011f7;
      _0x376f01 = _0x4caad;
      _0x248b87 = _0x1c4f53;
  }
  return Math.floor(_0x2bc2ce * 255) << 16 | Math.floor(_0x376f01 * 255) << 8 | Math.floor(_0x248b87 * 255);
}
function Getms() {
  return Date.Now();
}
function GetTimeToGo(_0x4ad141, _0x5c37ef, _0xde0715) {
  if (_0x4ad141 == 0) {
    return "";
  }
  let _0x3fd0c0 = Math.floor((new Date() - _0x4ad141) / 1000);
  _0x3fd0c0 = parseInt(_0x3fd0c0);
  if (_0x3fd0c0 <= 0) {
    return ["mob1.justnow", "just now"];
  } else if (_0x3fd0c0 < 60) {
    if (_0xde0715) {
      return _0x3fd0c0;
    } else {
      return ["mob1.secsago", "$1 secs ago", _0x3fd0c0];
    }
  } else if (_0x3fd0c0 < 120) {
    if (_0xde0715) {
      return 1;
    } else {
      return ["mob1.minago", "$1 min ago", 1];
    }
  } else if (_0x3fd0c0 < 3600) {
    if (_0xde0715) {
      return parseInt(_0x3fd0c0 / 60);
    } else {
      return ["mob1.minsago", "$1 mins ago", parseInt(_0x3fd0c0 / 60)];
    }
  } else if (_0x3fd0c0 < 86400) {
    if (_0xde0715) {
      return parseInt(_0x3fd0c0 / 3600);
    } else {
      return ["mob1.hoursago", "$1 hours ago", parseInt(_0x3fd0c0 / 3600)];
    }
  } else if (_0x5c37ef) {
    return new Date(_0x4ad141).toUTCString();
  } else if (_0xde0715) {
    return parseInt(_0x3fd0c0 / 86400);
  } else {
    return ["mob1.daysago", "$1 days ago", parseInt(_0x3fd0c0 / 86400)];
  }
}
function setUserBank() {
  if (w_Powers === null) {
    return;
  }
  if (POWERS === null) {
    POWERS = [];
  }
  POWERS = [];
  for (let _0x6bd34 = 1; _0x6bd34 < MAXPOWER; _0x6bd34++) {
    if (_0x6bd34 == 81 || _0x6bd34 != 95 && _0x6bd34 % 32 == 31) {
      continue;
    }
    let _0x4c26f4 = _0x6bd34 % 32;
    let _0x2d6cbb = xInt(_0x6bd34 / 32);
    if (w_Powers[_0x2d6cbb] & 1 << _0x4c26f4) {
      POWERS[_0x6bd34] = 1;
    }
  }
  let _0x572b6e = PowDecode(w_PowerO);
  if (_0x572b6e !== null) {
    for (let _0x36459f = 1; _0x36459f < MAXPOWER; _0x36459f++) {
      if (!(_0x36459f == 81 || _0x36459f != 95 && _0x36459f % 32 == 31)) {
        if (_0x572b6e[_0x36459f]) {
          POWERS[_0x36459f] = xInt(POWERS[_0x36459f]) + _0x572b6e[_0x36459f];
        }
      }
    }
  }
}
function setDisabledPowers() {
  if (w_Mask != null && (MASKED = [], PSSA || parent?.PSSA)) {
    for (let _0x5a4e85 in PSSA || parent?.PSSA) {
      let _0xdac74d = _0x5a4e85 >> 5;
      let _0x236ca6 = Math.pow(2, _0x5a4e85 % 32);
      if (w_Mask[_0xdac74d] && w_Mask[_0xdac74d] & _0x236ca6) {
        MASKED[_0x5a4e85] = 0;
      }
    }
  }
}
function PowDecode(_0x4f6bb0) {
  if (_0x4f6bb0 == null || _0x4f6bb0.length == 0) {
    return null;
  }
  let _0x4078ff = [];
  let _0x9aee4f = (_0x4f6bb0 = _0x4f6bb0.toString()).split("|");
  for (let _0x2b09f2 = 0; _0x2b09f2 < _0x9aee4f.length; _0x2b09f2++) {
    let _0x24d6a3 = _0x9aee4f[_0x2b09f2].split("=");
    let _0x371e85 = xInt(_0x24d6a3[1]);
    if (_0x371e85 <= 0) {
      _0x371e85 = 1;
    }
    if (_0x371e85 > 10000) {
      _0x371e85 = 1;
    }
    _0x4078ff[_0x24d6a3[0]] = _0x371e85;
  }
  return _0x4078ff;
}
function hasPower(_0x5b90ac, _0x22c963) {
  if (_0x22c963 === undefined) {
    _0x22c963 = false;
  }
  if (!_0x22c963) {
    logHasPowerForPowerId(_0x5b90ac);
  }
  if (!POWERS || Object.keys(POWERS).length === 0) {
    return !1;
  }
  const _0x5ebfd4 = !!POWERS.hasOwnProperty(_0x5b90ac) && POWERS[_0x5b90ac];
  return (!MASKED || !MASKED.hasOwnProperty(_0x5b90ac)) && _0x5ebfd4;
}
function logHasPowerForPowerId(_0x3ce8d7) {
  if (_0x3ce8d7 != 672) {
    return;
  }
  let _0x28e259 = `--- DEBUG // Power Info ---

`;
  _0x28e259 += "Power ID: " + _0x3ce8d7 + "\n";
  _0x28e259 += "Total Powers: " + Object.keys(POWERS ?? {}).length + "\n";
  _0x28e259 += "Total Masked: " + Object.keys(MASKED ?? {}).length + "\n";
  _0x28e259 += "hasPower(" + _0x3ce8d7 + ") return value: " + hasPower(_0x3ce8d7, !0) + "\n";
  _0x28e259 += "Is power enabled: " + !(MASKED ?? {}).hasOwnProperty(_0x3ce8d7) + "\n";
  _0x28e259 += "Is power disabled: " + (MASKED ?? {}).hasOwnProperty(_0x3ce8d7) + "\n";
  _0x28e259 += "Is w_Powers null: " + (w_Powers === null) + "\n";
  _0x28e259 += "Is PSSA (1) null : " + (PSSA === null) + "\n";
  _0x28e259 += "Is PSSA (2) null : " + (parent?.PSSA === null) + "\n";
  doDebugLogs(1, _0x28e259);
}
function doDebugLogs(_0x23e75b, _0x420cba) {
  const _0x52863d = "[XAT] " + _0x420cba;
  switch (_0x23e75b) {
    case 1:
      console.info(_0x52863d);
      break;
    case 2:
      console.warn(_0x52863d);
      break;
    case 3:
      console.error(_0x52863d);
      break;
    case 4:
      console.table(_0x420cba);
  }
}
function iMux(_0x5091c5, _0x30ea33) {
  if (!_0x30ea33) {
    _0x30ea33 = "i";
  }
  for (var _0x3e237d = _0x5091c5.substr(-10), _0x2a850d = 0, _0x97594f = 0; _0x97594f < 10; _0x97594f++) {
    _0x2a850d += _0x3e237d.charCodeAt(_0x97594f);
  }
  return "https://" + _0x30ea33 + (_0x2a850d & 1) + ".xath.hu/web_gear/chat/" + _0x5091c5;
}
var Trusted;
var syel;
var soth;
var spowhave;
var spow;
var stop;
var scount;
var Browser;
var dialogFrame;
var actions;
var settings;
var settingsWindow;
var selector;
var butsFrame;
var MyObj;
function SafeImage(_0x4fcce2, _0x591d8c, _0x3a8bd1, _0x42dcf1) {
  if (_0x4fcce2.length == 0) {
    return "";
  }
  var _0x366e7a = parse_url(_0x4fcce2);
  if (!_0x366e7a && !(_0x366e7a = parse_url(_0x4fcce2 = _0x4fcce2.charAt(0) == "/" ? "https:" + _0x4fcce2 : "https://" + _0x4fcce2))) {
    return "";
  }
  if (!_0x366e7a.host) {
    return "";
  }
  if (_0x366e7a.host.indexOf("xath.hu") >= 0 && (_0x366e7a.path.indexOf("GetImage") > 0 || _0x366e7a.path.indexOf("/chat/av/") >= 0)) {
    return _0x4fcce2;
  }
  if (!(_0x591d8c != _0x3a8bd1 || _0x42dcf1)) {
    _0x591d8c = _0x3a8bd1 = calcAvSize(_0x591d8c);
  }
  const _0x5ee405 = IsAnimationOn() ? "s" : "S";
  if (!isBackgroundAnimationOn()) {
    _0x42dcf1 = false;
  }
  let _0x5ba767 = _0x5ee405 + "&W=" + _0x591d8c + "&H=" + _0x3a8bd1 + "&U=" + _0x4fcce2;
  if (_0x42dcf1) {
    _0x5ba767 += "&g&otp";
  }
  return "https://xath.hu/web_gear/chat/GetImage7.php?" + _0x5ba767;
}
function parse_url(_0x35c5f9, _0x1d30f4) {
  for (var _0x30ec82 = ["source", "scheme", "authority", "userInfo", "user", "pass", "host", "port", "relative", "path", "directory", "file", "query", "fragment"], _0x2bf4e4 = {}, _0x1abe55 = _0x2bf4e4["phpjs.parse_url.mode"] && _0x2bf4e4["phpjs.parse_url.mode"].local_value || "php", _0x1220e4 = {
      php: /^(?:([^:\/?#]+):)?(?:\/\/()(?:(?:()(?:([^:@]*):?([^:@]*))?@)?([^:\/?#]*)(?::(\d*))?))?()(?:(()(?:(?:[^?#\/]*\/)*)()(?:[^?#]*))(?:\?([^#]*))?(?:#(.*))?)/,
      strict: /^(?:([^:\/?#]+):)?(?:\/\/((?:(([^:@]*):?([^:@]*))?@)?([^:\/?#]*)(?::(\d*))?))?((((?:[^?#\/]*\/)*)([^?#]*))(?:\?([^#]*))?(?:#(.*))?)/,
      loose: /^(?:(?![^:@]+:[^:@\/]*@)([^:\/?#.]+):)?(?:\/\/\/?)?((?:(([^:@]*):?([^:@]*))?@)?([^:\/?#]*)(?::(\d*))?)(((\/(?:[^?#](?![^?#\/]*\.[^?#\/.]+(?:[?#]|$)))*\/?)?([^?#\/]*))(?:\?([^#]*))?(?:#(.*))?)/
    }, _0x3ab1c5 = _0x1220e4[_0x1abe55].exec(_0x35c5f9), _0x1cc0c0 = {}, _0x5d9067 = 14; _0x5d9067--;) {
    if (_0x3ab1c5[_0x5d9067]) {
      _0x1cc0c0[_0x30ec82[_0x5d9067]] = _0x3ab1c5[_0x5d9067];
    }
  }
  if (_0x1d30f4) {
    return _0x1cc0c0[_0x1d30f4.replace("PHP_URL_", "").toLowerCase()];
  }
  if (_0x1abe55 !== "php") {
    var _0x284093 = _0x2bf4e4["phpjs.parse_url.queryKey"] && _0x2bf4e4["phpjs.parse_url.queryKey"].local_value || "queryKey";
    _0x1220e4 = /(?:^|&)([^&=]*)=?([^&]*)/g;
    _0x1cc0c0[_0x284093] = {};
    (_0x1cc0c0[_0x30ec82[12]] || "").replace(_0x1220e4, function (_0x334790, _0x47c4d8, _0x810d23) {
      if (_0x47c4d8) {
        _0x1cc0c0[_0x284093][_0x47c4d8] = _0x810d23;
      }
    });
  }
  delete _0x1cc0c0.source;
  return _0x1cc0c0;
}
function xEscape(_0x52752e) {
  return "%" + _0x52752e.charCodeAt(0).toString(16).toUpperCase();
}
function rfc3986EncodeURIComponent(_0x594b7c) {
  return encodeURIComponent(_0x594b7c).replace(/[!'()*~]/g, xEscape);
}
function addSmilies(_0x447a07, _0x15efdf, _0x23d53f, _0x418789, _0x2b88b4) {
  if (!syel) {
    syel = JSON.parse(_0x447a07);
    soth = JSON.parse(_0x15efdf);
    spow = JSON.parse(_0x23d53f);
    spowhave = JSON.parse(_0x418789);
    stop = JSON.parse(_0x2b88b4);
  }
}
function detectIE() {
  var _0x13f8ad = window.navigator.userAgent;
  var _0x4e7dd9 = _0x13f8ad.indexOf("MSIE ");
  if (_0x4e7dd9 > 0) {
    Browser = "MS";
    return parseInt(_0x13f8ad.substring(_0x4e7dd9 + 5, _0x13f8ad.indexOf(".", _0x4e7dd9)), 10);
  }
  if (_0x13f8ad.indexOf("Trident/") > 0) {
    Browser = "MS";
    var _0x4a00ad = _0x13f8ad.indexOf("rv:");
    return parseInt(_0x13f8ad.substring(_0x4a00ad + 3, _0x13f8ad.indexOf(".", _0x4a00ad)), 10);
  }
  var _0x29751f = _0x13f8ad.indexOf("Edge/");
  if (_0x29751f > 0) {
    Browser = "MS";
    return parseInt(_0x13f8ad.substring(_0x29751f + 5, _0x13f8ad.indexOf(".", _0x29751f)), 10);
  } else {
    if (_0x13f8ad.toLowerCase().indexOf("firefox") > -1) {
      Browser = "FF";
    } else if (_0x13f8ad.indexOf("Chrome") > -1) {
      Browser = "CR";
    } else if (_0x13f8ad.indexOf("Safari") > -1) {
      Browser = "SF";
    }
    return false;
  }
}
function setTextBoxEditable(_0x14e154, _0x26bff1) {
  var _0x3c5474 = document.getElementById(_0x14e154);
  if (_0x3c5474) {
    _0x3c5474.setAttribute("contenteditable", _0x26bff1);
    if (_0x26bff1) {
      _0x3c5474.classList.add("textBox", "textBoxEdit");
    } else {
      _0x3c5474.classList.remove("textBox", "textBoxEdit");
    }
  }
  return _0x3c5474;
}
function isString(_0x1ba002) {
  return Object.prototype.toString.call(_0x1ba002) === "[object String]";
}
function isConnected() {
  return _Activity.instance.IsConnected();
}
function resizeSearchBar(_0x202e68) {
  if (_0x202e68) {
    _0x202e68.style.width = window.innerWidth - 20 + "px";
    window.addEventListener("resize", () => {
      _0x202e68.style.width = window.innerWidth - 20 + "px";
    });
  }
}
String.prototype.hashCode = function () {
  var _0x51743c = 0;
  if (this.length == 0) {
    return _0x51743c;
  }
  for (var _0xc344de = 0; _0xc344de < this.length; _0xc344de++) {
    _0x51743c = (_0x51743c << 5) - _0x51743c + this.charCodeAt(_0xc344de);
    _0x51743c &= _0x51743c;
  }
  return _0x51743c;
};
detectIE();
var settingsPage = !1;
function setFrameVis(_0x32170c) {
  if (!settings?.toSave) {
    if (_0x32170c && _0x32170c === "settings") {
      settingsPage = true;
    }
    if (Classic) {
      reportsDrop();
    }
    for (var _0x53c27d in {
      selector: 1,
      settings: 1,
      actions: 1
    }) {
      var _0x16f4ab = document.getElementById(_0x53c27d + "Frame");
      if (_0x16f4ab) {
        if (_0x53c27d == _0x32170c) {
          _0x16f4ab.classList.remove("d-none");
        } else {
          _0x16f4ab.classList.add("d-none");
        }
      }
    }
    var _0xa81e7b = document.getElementById("FrameDialog");
    var _0xd404f3 = document.getElementById("FrameBack");
    butsFrame = _0xa81e7b;
    var _0x4ab0a6 = document.getElementById("reportIconClassic");
    if (_0x4ab0a6) {
      _0x4ab0a6.classList.add("d-none");
    }
    if (_0x32170c) {
      removeClass("d-none", "Overlays");
      removeClass("d-none", "OverlaysClassic");
    } else {
      addClass("d-none", "Overlays");
      addClass("d-none", "OverlaysClassic");
      if (_0xa81e7b) {
        _0xa81e7b.classList.add("d-none");
      }
      if (_0xd404f3) {
        _0xd404f3.classList.add("d-none");
      }
      if (actions) {
        actions?.clearall();
        actions.Visible = false;
        if (actions.ReLogin) {
          actions.ReLogin = false;
          ToC({
            Command: "CheckRestartAfterMePage"
          });
        }
      }
      if (selector) {
        if (selector.ReLogin) {
          selector.ReLogin = false;
          SetPow();
          ToC({
            Command: "CheckRestartAfterMePage"
          });
        }
        selector.clear();
      }
      if (settingsPage) {
        if (!isPstylePreviewEnabled()) {
          localStorage.removeItem("pstyleTmp");
        }
        if (localStorage.getItem("avatarSettingsTmp")) {
          localStorage.removeItem("avatarSettingsTmp");
        }
        reloadSettingsIframe();
        settingsPage = false;
      }
      if (settings?.doReload) {
        settings.doReload = false;
        if (Classic) {
          _Activity.instance.QuickBar?.reloadSideBar();
          forceUpdateAnimation = true;
        } else {
          updateAllFrame(hasDarkMode() ? "enable" : "disable");
        }
        if (settings?.currentPage !== "translator") {
          ToC({
            Command: "DoReload"
          });
        }
      }
    }
    ColorTitle();
  }
}
function isPstylePreviewEnabled() {
  const _0x7ef23c = localStorage.getItem("pstylePreviewMode");
  return _0x7ef23c && _0x7ef23c === "1";
}
function reloadSettingsIframe() {
  let _0x469d78 = findNodeInWindowOrParent("#settingsFrame");
  if (!_0x469d78 || !_0x469d78.contentWindow) {
    return;
  }
  let _0x4bd42b = _0x469d78.contentWindow;
  _0x4bd42b?.location?.reload();
  if (isPstylePreviewEnabled()) {
    const _0x3c9f79 = () => {
      loadPstyleTabInSettings(_0x469d78);
      _0x469d78.removeEventListener("load", _0x3c9f79);
    };
    _0x469d78.addEventListener("load", _0x3c9f79);
  }
}
function loadPstyleTabInSettings(_0x159fdc) {
  const _0x2e7dad = {
    UserNo: _Activity.instance.MyId,
    tab: "pstyle"
  };
  const _0x27ae81 = _0x2e7dad;
  classicSetDialog("actions", _Activity.instance.MyId);
  classicSetDialog("settings", _0x27ae81);
  localStorage.removeItem("pstylePreviewMode");
}
function resetPstylePreview() {
  localStorage.removeItem("pstylePreviewMode");
  localStorage.removeItem("pstyleTmp");
}
function doSelector(_0x413f6c) {
  selector.initLang(Language);
  posModal(butsFrame, {
    mw: 900
  });
  selector.UserNo = _0x413f6c.UserNo;
  selector.MyObj = MyObj ? config : _0x413f6c.Config;
  switch (_0x413f6c.Type) {
    case "Powers":
      selector.Powers = _0x413f6c.Powers;
      selector.MainObj = _0x413f6c.MainObj;
      selector.Go = !0;
      selector.hideWallet();
      selector.startPowers();
      break;
    case "Kiss":
      selector.doKisses();
      break;
    case "Smilies":
      selector.startSmilies();
      break;
    case "Stickers":
      selector.stickers(_0x413f6c.Pack);
      break;
    case "Gifts":
      let _0x2ee8b8 = _0x413f6c.MainObj ? _0x413f6c.MainObj.user[0] : _0x413f6c.UserNo;
      selector.gifts(_0x2ee8b8);
      break;
    case "Marry":
    case "Divorce":
      selector.id = _0x413f6c.MainObj.id;
      selector.regname = _0x413f6c.MainObj.regname;
      selector.doKisses(_0x413f6c.Type);
  }
}
let copyright = document.getElementById("copyrightyear");
function classicSetDialog(_0x5cdfa3, _0x34741b) {
  if (_0x5cdfa3 !== "profile" && _0x5cdfa3 !== "actions") {
    cleanupPstyleClasses(document);
  }
  let _0x1fd0fe = document.getElementById("Overlays");
  if (!_0x1fd0fe) {
    _0x1fd0fe = document.getElementById("OverlaysClassic");
  }
  if (!_0x1fd0fe) {
    parent.classicSetDialog(_0x5cdfa3, _0x34741b);
    return;
  }
  let _0x491570 = xInt(_0x34741b);
  var _0x52efc6;
  if (!_0x491570 && _0x34741b.MainObj && _0x34741b.MainObj.user) {
    _0x491570 = xInt(_0x34741b.MainObj.user[0].id);
  }
  if (!_0x491570 && MyObj) {
    _0x491570 = xInt(MyObj.MyId);
  }
  switch (_0x5cdfa3) {
    case "selector":
      _0x52efc6 = "selector";
      break;
    case "settings":
      _0x52efc6 = _0x5cdfa3;
      break;
    default:
      _0x52efc6 = "actions";
  }
  setFrameVis(_0x52efc6);
  _0x1fd0fe = document.getElementById("FrameDialogCloseBut");
  if (_0x1fd0fe) {
    _0x1fd0fe.onclick = function () {
      setFrameVis();
    };
  }
  _0x1fd0fe = document.getElementById("FrameBack");
  if (_0x1fd0fe) {
    _0x1fd0fe.onclick = function () {
      setFrameVis();
    };
  }
  const _0x512971 = document.getElementById(_0x52efc6 + "Frame").contentWindow;
  switch (_0x5cdfa3) {
    case "settings":
      settingsWindow = _0x512971;
      settings = _0x512971.settings;
      if (_0x34741b.tab) {
        _0x491570 = _0x34741b.UserNo;
        // TOLOOK
        setTimeout(() => {
          settings.doTab(_0x34741b.tab);
        }, 250);
      }
      break;
    case "selector":
      removeClass("d-none", "FrameDialog");
      removeClass("d-none", "FrameBack");
      selector = _0x512971.selector;
      doSelector(_0x34741b);
      _0x491570 = _0x34741b.UserNo;
      break;
    default:
      if (actions = _0x512971.actions) {
        actions?.clearall();
        actions.Visible = true;
      }
  }
  let _0x430ebd = document.getElementById("appframe");
  if (_0x430ebd) {
    _0x430ebd = _0x430ebd.contentWindow;
    _0x430ebd.actions = actions;
    _0x430ebd.selector = selector;
    _0x430ebd.settings = settings;
  }
  ToC({
    Command: "LoadClassicDialog",
    Type: _0x5cdfa3,
    UserNo: _0x491570
  });
  if (["settings", "selector"].includes(_0x5cdfa3)) {
    setCstyle();
  }
}
function getHash(_0x352ba9) {
  let _0x356582 = 0;
  let _0x43eba3 = _0x352ba9.length;
  for (var _0x3cb8f9 = 0; _0x3cb8f9 < _0x43eba3; _0x3cb8f9++) {
    _0x356582 = (_0x356582 << 5) - _0x356582 + _0x352ba9.charCodeAt(_0x3cb8f9);
    _0x356582 |= 0;
  }
  return _0x356582;
}
function hasDarkMode() {
  let _0x3888ab = JSON.parse(localStorage.getItem("Settings"))?.darkmode;
  return _0x3888ab && _0x3888ab == "enable";
}
function setdarkmode(_0x375973) {
  let _0x521b61 = _0x375973 || hasDarkMode();
  if (_0x521b61 && _0x521b61 != "disable") {
    if (_0x521b61 && _Activity.instance.IsClassic) {
      document.body.classList.add("dark");
    } else if (_0x521b61 && !_Activity.instance.IsClassic) {
      document.body.classList.add("dark");
      document.body.classList.add("darkMobile");
      if (parent && parent.document) {
        parent.document.getElementById("dropdown-content").classList.add("darkMenu");
        parent.document.body?.classList?.add("dark");
        parent.document.body?.classList?.add("darkMobile");
      }
    }
  } else {
    document.body.classList.remove("dark");
    document.body.classList.remove("darkMobile");
    if (parent && parent.document) {
      parent.document.getElementById("dropdown-content")?.classList?.remove("darkMenu");
      parent.document.body?.classList?.remove("dark");
      parent.document.body?.classList?.remove("darkMobile");
    }
  }
}
function hasHideUserlist() {
  let _0x597da4 = JSON.parse(localStorage.getItem("Settings"))?.hideuserlist;
  return _0x597da4 || "enable";
}
function hasStealthMode() {
  let _0x3468b2 = JSON.parse(localStorage.getItem("Macros"))?.Stealth;
  return _0x3468b2 && _0x3468b2 == "enable";
}
function getFavoriteGroups() {
  let _0x5c3df6 = JSON.parse(localStorage.getItem("Settings"))?.favorites;
  if (_0x5c3df6) {
    return JSON.parse(_0x5c3df6.replace(/”/g, "\""));
  } else {
    return {};
  }
}
function hasGroupInFavorite() {
  let _0x59d41d = config.GroupName;
  if (!_0x59d41d) {
    return;
  }
  let _0x5b7a13 = getFavoriteGroups();
  if (!_0x5b7a13) {
    _0x5b7a13 = {};
  }
  if (!Object.keys(_0x5b7a13).length) {
    return !1;
  }
  for (let _0x4ece4e in _0x5b7a13) {
    if (_0x5b7a13[_0x4ece4e].g && _0x5b7a13[_0x4ece4e].g.toLowerCase() == _0x59d41d.toLowerCase()) {
      return !0;
    }
  }
  return !1;
}
function addRemoveFavorites(_0x16b6fc, _0x5ab754) {
  let _0xd3841 = getFavoriteGroups();
  let _0x2494ad = _0x5ab754 || config.GroupName;
  let _0x34511c = _0x16b6fc || config.chatid;
  _0x2494ad = _0x2494ad.toLowerCase();
  if (_0xd3841[_0x2494ad]) {
    delete _0xd3841[_0x2494ad];
  } else {
    _0xd3841[_0x2494ad] = {
      id: _0x34511c,
      g: _0x2494ad
    };
  }
  return saveSetting("favorites", JSON.stringify(_0xd3841));
}
function getIgnoredUsers() {
  const _0x22749b = JSON.parse(localStorage.getItem("w_ignorelist2"));
  return _0x22749b || {};
}
function getBlockedUsers() {
  const _0x43c416 = JSON.parse(localStorage.getItem("w_friendlist3"));
  const _0x23ba9d = {};
  for (const _0x19d8dd in _0x43c416) {
    if (Object.hasOwnProperty.call(_0x43c416, _0x19d8dd) && _0x43c416[_0x19d8dd].f & 32) {
      _0x23ba9d[_0x19d8dd] = _0x43c416[_0x19d8dd].R.length ? _0x43c416[_0x19d8dd].R : _0x19d8dd;
    }
  }
  return _0x23ba9d;
}
function getSettingsValue(_0x2690d8) {
  let _0x2d9ab2 = {};
  try {
    const _0x1c6984 = localStorage.getItem("Settings");
    if (_0x1c6984) {
      _0x2d9ab2 = JSON.parse(_0x1c6984);
    }
  } catch (_0x5c6b52) {}
  return _0x2d9ab2[_0x2690d8] || "enable";
}
function unignoreUser(_0x34f387) {
  if (!_0x34f387) {
    return;
  }
  let _0xaec2d3 = {
    name: "Unignore"
  };
  _0xaec2d3.UserNo = _0x34f387;
  _0xaec2d3.Page = "actions";
  _0xaec2d3.Command = "Action";
  _0xaec2d3.Type = "Action";
  return ToC(_0xaec2d3);
}
function unblockUser(_0x11b92e) {
  if (_0x11b92e) {
    ToC({
      Command: "Block",
      UserNo: _0x11b92e
    });
  }
}
function StripSmilies(_0x150f99) {
  var _0x51cb0e;
  var _0x3b839e;
  for (_0x150f99 = Replace(_0x150f99, [":)", ":-)", ":d", ";)", ";-)", ":o", ":-o", ":p", ":@", ":s", ":$", ":(", ":-(", ":'(", "|-)", "8-)", ":|", ":-|", ":-*", ":[", ":-["]); _0x150f99.indexOf("<") != -1;) {
    _0x51cb0e = _0x150f99.indexOf("<");
    _0x3b839e = _0x150f99.indexOf(">", _0x51cb0e);
    _0x150f99 = _0x3b839e != -1 ? _0x150f99.substr(0, _0x51cb0e) + _0x150f99.substr(_0x3b839e + 1) : _0x150f99.substr(0, _0x51cb0e) + _0x150f99.substr(_0x51cb0e + 1);
  }
  for (; _0x150f99.indexOf("(") != -1;) {
    _0x51cb0e = _0x150f99.indexOf("(");
    _0x3b839e = _0x150f99.indexOf(")", _0x51cb0e);
    _0x150f99 = _0x3b839e != -1 ? _0x150f99.substr(0, _0x51cb0e) + _0x150f99.substr(_0x3b839e + 1) : _0x150f99.substr(0, _0x51cb0e) + _0x150f99.substr(_0x51cb0e + 1);
  }
  for (; _0x150f99.indexOf("[") != -1;) {
    _0x51cb0e = _0x150f99.indexOf("[");
    _0x3b839e = _0x150f99.indexOf("]", _0x51cb0e);
    _0x150f99 = _0x3b839e != -1 ? _0x150f99.substr(0, _0x51cb0e) + _0x150f99.substr(_0x3b839e + 1) : _0x150f99.substr(0, _0x51cb0e) + _0x150f99.substr(_0x51cb0e + 1);
  }
  return _0x150f99;
}
function Replace(_0x899195, _0x140833) {
  for (let _0xb13f6f = 0; _0xb13f6f < _0x140833.length; _0xb13f6f += 2) {
    for (; _0x899195.indexOf(_0x140833[_0xb13f6f]) != -1;) {
      let _0x12b32c = _0x899195.indexOf(_0x140833[_0xb13f6f]);
      _0x899195 = _0x899195.substr(0, _0x12b32c) + _0x140833[_0xb13f6f + 1] + _0x899195.substr(_0x12b32c + _0x140833[_0xb13f6f].length);
    }
  }
  return _0x899195;
}
function reloadChat() {
  ToC({
    Command: "DoReload"
  });
}
if (copyright) {
  copyright.appendChild(document.createTextNode(new Date().getFullYear()));
}
class Snackbar {
  constructor(_0x2f5ad3) {
    this.text = _0x2f5ad3;
    if (Array.isArray(this.text)) {
      this.id = Math.abs(getHash(this.text[0]));
    } else {
      this.id = Math.abs(getHash(this.text));
    }
    this.snackbars = document.querySelector("#snackbars");
    if (!this.snackbars) {
      this.snackbars = makeElement(null, "div", "snackbars", "snackbars");
      document.body.prepend(this.snackbars);
    }
    this.snackbar = document.getElementById(this.id) ?? makeElement(this.snackbars, "div", "snackbar", this.id);
  }
  show(_0x32323b, _0x18c725) {
    if (_0x18c725 && Array.isArray(this.text)) {
      this.text.push(_0x18c725);
    }
    this.snackbar.innerHTML = "";
    addText(this.snackbar, this.text);
    this.snackbar.classList.remove("hide");
    this.snackbar.classList.add("show");
    // TOLOOK
    setTimeout(() => {
      this.hide();
    }, _0x32323b || 2000);
  }
  hide() {
    this.snackbar.classList.remove("show");
    this.snackbar.classList.add("hide");
  }
}
function signInButtonPressed(_0x32d66a) {
  var _0x42f089;
  _0x42f089 = {
    Command: "signInButtonPressed"
  };
  if (_0x32d66a !== undefined) {
    _0x42f089.DoSignIn = _0x32d66a;
  }
  ToC(_0x42f089);
}
let xAreaMob = document.querySelectorAll(".xAreaMob");
if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) && xAreaMob) {
  for (var i = 0; i < xAreaMob.length; i++) {
    xAreaMob[i].classList.add("xAreaMobAct");
  }
}
function customModalWithMsg(_0x413341, _0x56acec, _0x3caaa6, _0x878bcf, _0x23ada4) {
  let _0x3ff731 = makeElement(null, "div");
  let _0xb7505e = makeElement(_0x3ff731, "div", _0x878bcf ? "AnnounceDialog" : "modalDialogContentClassic");
  let _0xca7f84 = makeElement(_0xb7505e, "div", _0x878bcf ? "AnnounceHeaFoo" : "dialogTitleBar NewTitleBar");
  let _0x296c20 = makeElement(_0xb7505e, "img", "AnnounceFooLogo");
  let _0x24f444 = makeElement(_0xca7f84, "span", "dialogTitle link NewDialogTitle", "openLink");
  let _0x158989 = makeElement(_0xb7505e, "div", _0x878bcf ? "AnnounceBody" : "dialogBody NewdialogBody");
  let _0x26e58e = makeElement(_0x158989, "div", "dialogPadding");
  let _0x3c2a5f = makeElement(_0x26e58e, "div", _0x878bcf ? "" : "wrapper", "wrapper");
  let _0x370be4 = document.querySelector("#FrameBack");
  if (_0x878bcf) {
    _0x296c20.src = "svg/xatlogo.svg";
    _0x296c20.alt = "xat";
    _0x296c20.width = "65";
  }
  if (_0x3caaa6) {
    const _0x3f8f84 = _0x23ada4 ? Classic ? "svg/remove" + (toHex6(config.ButColW)[0] == "0" ? "b" : "w") + ".svg" : "svg/removew.svg" : _0x878bcf ? "svg/removew.svg" : "svg/removeb.svg";
    let _0x3c6ca0 = makeElement(null, "img");
    _0x3c6ca0.src = _0x3f8f84;
    _0x3c6ca0.alt = "close";
    _0x3c6ca0.width = _0x878bcf ? "11" : "16";
    _0x3c6ca0.classList.add("closeAnnounceImg");
    makeElement(_0xca7f84, "span", _0x878bcf ? "AnnounceClose" : "dialogTitleAction", "id_ModalClose_custom").appendChild(_0x3c6ca0);
  }
  if (_0x23ada4) {
    _0xb7505e.classList.add("gpModal");
    _0x370be4?.classList?.remove("d-none");
  }
  addText(_0x24f444, _0x878bcf ? "" : _0x413341);
  _0xb7505e.dataset.w = _0x23ada4 ? 0.9 : 0.6;
  addText(_0x3c2a5f, _0x878bcf ? atob(_0x56acec) : _0x56acec, !!_0x878bcf);
  HiddenDivs.AlertDialog = _0x3ff731.innerHTML;
  doModal("AlertDialog", {}, !0, !0);
  document.querySelector("#id_ModalClose_custom")?.addEventListener("click", () => {
    modalClose();
    if (_0x23ada4) {
      _0x370be4?.classList?.add("d-none");
    }
    if (_0x878bcf) {
      updateAnnounceStorage(_0x56acec);
    }
  });
}
function setAnnounce(_0x431adc) {
  let _0x594615 = localStorage.getItem("announce_message");
  if (!_0x594615 || _0x594615 && _0x594615 !== _0x431adc) {
    customModalWithMsg("Announcement", _0x431adc, true, true);
  }
  return !1;
}
function updateAnnounceStorage(_0x5839e4) {
  if (_Activity.instance.IsClassic || !_Activity.instance.IsClassic && localStorage.getItem("mobCookies") == 1) {
    return localStorage.setItem("announce_message", _0x5839e4);
  }
}
function replaceBrakets(_0x243d31) {
  if (!_0x243d31) {
    return "";
  }
  if (_0x243d31.indexOf("[") >= 0 && _0x243d31.indexOf("❯") >= 0) {
    let _0x3ece2e = /❯.*\[.*?\]/g;
    let _0x35ed96 = /\s+(?![^\[]*\]|[^(]*\)|[^\{]*})/;
    let _0x3338e2 = _0x243d31.split(_0x35ed96);
    if (_0x3338e2.length > 0) {
      for (let _0x56e34a in _0x3338e2) {
        if (_0x3338e2[_0x56e34a].match(_0x3ece2e)) {
          _0x3338e2[_0x56e34a] = _0x3338e2[_0x56e34a].replace(_0x3ece2e, "");
        }
      }
    }
    return _0x3338e2.join(" ").replace(/\[/gi, "{").replace(/\]/gi, "}");
  }
  return cleanXatTagsIcons(_0x243d31.replace(/\[/gi, "{").replace(/\]/gi, "}"));
}
function assignUnassign(_0x57c68f, _0x504588) {
  if (!_0x57c68f || ["Assign", "Unassign"].indexOf(_0x504588) == -1) {
    return;
  }
  let _0x332db5 = _0x57c68f.value;
  if (_0x332db5) {
    return ToC({
      Type: "Assign",
      p: _0x332db5,
      a: _0x504588 == "Assign" ? 1 : 0
    });
  } else {
    return undefined;
  }
}
function updateAllFrame(_0x5ba282) {
  if (!_0x5ba282) {
    return;
  }
  let _0x2d65dd = ["selectorFrame", "settingsFrame", "actionsFrame"];
  for (let _0x15c92b in _0x2d65dd) {
    let _0x32ff35 = findNodeInWindowOrParent("#" + _0x2d65dd[_0x15c92b]);
    if (!_0x32ff35 || !_0x32ff35.contentWindow) {
      return;
    }
    let _0x5ef1c1 = _0x32ff35.contentWindow;
    if (_0x5ba282 == "enable") {
      if (_0x2d65dd[_0x15c92b] == "settingsFrame") {
        _0x5ef1c1.document.body?.querySelector(".wrapper")?.classList.add("darkWrapper");
        _0x5ef1c1.location.reload();
      } else {
        _0x5ef1c1.document.body.classList.add("dark");
      }
    } else if (_0x2d65dd[_0x15c92b] == "settingsFrame") {
      _0x5ef1c1.document.body?.querySelector(".wrapper")?.classList.remove("darkWrapper");
      _0x5ef1c1.location.reload();
    } else {
      _0x5ef1c1.document.body.classList.remove("dark");
    }
  }
}
function setLoader(_0x465547, _0x19e740) {
  let _0x2abe28 = document.querySelector(_0x19e740 ? "#" + _0x19e740 : "#loading");
  if (_0x2abe28) {
    if (_0x465547) {
      _0x2abe28.classList.remove("d-none");
      _0x2abe28.innerHTML = "<div id=\"xatLoader\"><div id=\"xatLoaderInner\"><img id=\"planet\" src=\"svg/x.svg\"><img id=\"rocket\" src=\"svg/ss.svg\"></div></div>";
    } else {
      _0x2abe28.classList.add("d-none");
      _0x2abe28.innerHTML = "";
    }
  }
}
function urlPost(_0xe32f23, _0x3b90fb) {
  return new Promise((_0x186c86, _0x1a6ce0) => {
    let _0x358888 = {
      method: "GET"
    };
    if (_0x3b90fb) {
      _0x358888.method = "POST";
      _0x358888.body = _0x3b90fb;
    }
    fetch(_0xe32f23, _0x358888).then(function (_0x93f233) {
      return _0x93f233.json();
    }).then(function (_0x401657) {
      _0x186c86(_0x401657);
    }).catch(_0x3b0689 => _0x1a6ce0(_0x3b0689));
  });
}
function specialEvents(_0x4f6d52, _0xfd7e18) {
  let _0x11fd63 = !1;
  const _0x1c4515 = new Date();
  _0x1c4515.getDate();
  _0x1c4515.getMonth();
  if (Array.isArray(_0x4f6d52)) {
    for (let _0xef67e0 in _0x4f6d52) {
      specialEvents(_0x4f6d52[_0xef67e0], _0xfd7e18);
    }
  }
  switch (_0x4f6d52) {
    case "easter":
    case "xmas":
    case "xatbday":
      break;
    default:
      _0x11fd63 = !1;
  }
  if (_0x11fd63 && _0xfd7e18) {
    _0xfd7e18();
  }
}
function initFools() {
  const _0xb0c2bb = config.GroupName.toLowerCase();
  let _0x3b9881 = localStorage.getItem("wasFooledList");
  if (!localStorage.getItem("foundFools")) {
    if (!_0x3b9881) {
      _0x3b9881 = [];
    }
    try {
      _0x3b9881 = JSON.parse(_0x3b9881);
    } catch (_0x5b3c94) {
      _0x3b9881 = [];
    }
    if (_0x3b9881.indexOf(_0xb0c2bb) == -1) {
      _0x3b9881.push(_0xb0c2bb);
      // TOLOOK
      setTimeout(() => {
        xrRoot.document.body.animate([{
          opacity: 0.4,
          offset: 0
        }, {
          opacity: 0.5,
          offset: 0.05
        }, {
          opacity: 0.6,
          offset: 0.1
        }, {
          opacity: 0.85,
          offset: 0.15
        }, {
          opacity: 0.5,
          offset: 0.25
        }, {
          opacity: 1,
          offset: 0.3
        }, {
          opacity: 0.1,
          offset: 0.35
        }, {
          opacity: 0.25,
          offset: 0.4
        }, {
          opacity: 0.5,
          offset: 0.45
        }, {
          opacity: 1,
          offset: 0.6
        }, {
          opacity: 0.85,
          offset: 0.7
        }, {
          opacity: 0.4,
          offset: 0.8
        }, {
          opacity: 0.5,
          offset: 0.9
        }, {
          opacity: 1,
          offset: 1
        }], {
          duration: 2000
        }).addEventListener("finish", () => {
          xrRoot.document.body.style.filter = "grayscale(1)";
          localStorage.setItem("wasFooledList", JSON.stringify(_0x3b9881));
          customModalWithMsg(null, btoa("<div style=\"font-weight: 600; text-align: center;\"><img style=\"display:block; margin: 0 auto\" src=\"../gameban/codeban/assets/smilies/72.png\" /><br /><br />Oops! Lights are off. This chatroom does not have sufficient energy to power up. Please check <a target=\"_blank\" href=\"https://xath.hu/store\">xath.hu/store</a> for energy supply powers.</div>"), true, true);
        });
      }, 10000);
    } else {
      xrRoot.document.body.style.filter = "grayscale(1)";
    }
  }
}
function stopFools() {
  if (!localStorage.getItem("foundFools")) {
    xrRoot.document.body.style.filter = "none";
    customModalWithMsg(null, btoa("<div style=\"font-weight: 600; text-align: center; color: white;\"><img style=\"display:block; margin: 0 auto\" src=\"../gameban/codeban/assets/smilies/58.png\" /><br /><br />Lights on! Your chat has been powered up with energy. April Fools!\n</div>"), true, true);
    localStorage.setItem("foundFools", "1");
  }
}
function filter(_0x2547e8) {
  if (isNaN(_0x2547e8) && _0x2547e8 !== undefined) {
    _0x2547e8 = _0x2547e8.replace(new RegExp("['\"<>&]", "gi"), "").replace(/\\/gi, "");
  }
  return _0x2547e8;
}
function isValidHex(_0x241950) {
  return /^#[0-9A-F]{6}$/i.test(_0x241950);
}
function cleanXatTagsIcons(_0x54ee39) {
  if (_0x54ee39) {
    return _0x54ee39.replace(/<priv>/gi, "").replace(/❮priv❯/gi, "").replace(/<inf8>/gi, "").replace(/❮inf8❯/gi, "").replace(/<i>/gi, "").replace(/❮i❯/gi, "").replace(/<in>/gi, "").replace(/❮in❯/gi, "");
  } else {
    return "";
  }
}
function isXatBirthday(_0x2c0b84) {
  if (_0x2c0b84 === undefined) {
    _0x2c0b84 = false;
  }
  const _0x23b37b = new Date();
  const _0x39f1e7 = _0x23b37b.getDate();
  return (_0x2c0b84 ? _0x39f1e7 == 17 : _0x39f1e7 >= 15 && _0x39f1e7 < 19) && _0x23b37b.getMonth() + 1 == 9;
}
function reduceTextLength(_0x49ea78) {
  if (!_0x49ea78) {
    return "";
  }
  let _0x8029ca = 256;
  const _0x328d7d = _0x49ea78.toLowerCase();
  if (_0x328d7d.includes("(stick#") || _0x328d7d.includes("#stick#")) {
    _0x8029ca = 512;
  }
  if (_0x49ea78.length > _0x8029ca) {
    return _0x49ea78.substring(0, _0x8029ca);
  } else {
    return "";
  }
}
function handleMaxLength(_0x52f0e3, _0x9f095a) {
  return !(_0x9f095a.textContent.length >= 256 && _0x52f0e3.code != "Backspace" && _0x52f0e3.code != "Delete" && _0x52f0e3.code != "Space" && _0x52f0e3.code != "ArrowLeft" && _0x52f0e3.code != "ArrowRight" && _0x52f0e3.code != "ArrowUp" && _0x52f0e3.code != "ArrowDown" && _0x52f0e3.code != "Home" && _0x52f0e3.code != "End" && _0x52f0e3.code != "ControlLeft" && (!_0x52f0e3.ctrlKey || _0x52f0e3.code != "KeyA" && _0x52f0e3.code != "KeyE" && _0x52f0e3.code != "KeyV" && _0x52f0e3.code != "KeyC" && _0x52f0e3.code != "KeyX")) || (_0x52f0e3.preventDefault(), !1);
}
function setPageAndSendTtth(_0x26fc00) {
  if (_0x26fc00 === undefined) {
    _0x26fc00 = null;
  }
  loadKiss("Ttth", _0x26fc00);
  // TOLOOK
  setTimeout(() => {
    _Activity?.instance?.SetPage("chats");
  }, 1000);
}
function returnOwnedPowers() {
  let _0x24e2ae = [];
  const _0x3f3829 = _Activity?.instance;
  const _0x109613 = _0x3f3829?.PSSA;
  const _0x4bfd71 = _0x3f3829?.TOPSH;
  const _0x3cbf2b = _0x3f3829?.UCOLLECTIONS;
  if (_0x109613) {
    const _0x32bf22 = _0x109613.filter((_0x4f1337, _0xa460a) => hasPower(_0xa460a - 1) || _0x3cbf2b[_0xa460a - 1]);
    _0x24e2ae.push(..._0x32bf22);
  }
  if (_0x4bfd71) {
    for (const [_0x329847, _0x42374c] of Object.entries(_0x4bfd71)) {
      if ((hasPower(_0x42374c) || _0x3cbf2b[_0x42374c]) && _0x42374c > 45) {
        _0x24e2ae.push(_0x329847);
      }
    }
  }
  return _0x24e2ae;
}
function hasMobCookiesEnabled() {
  if (_Activity.instance.IsClassic) {
    return !0;
  }
  const _0x2317d2 = localStorage.getItem("todo");
  if (_0x2317d2 == null || !_0x2317d2.length) {
    return !1;
  }
  try {
    return localStorage.getItem("mobCookies") == 1;
  } catch (_0x630016) {
    return !1;
  }
}
function focusAndPutCaretAtPosition(_0x3010ae, _0x1984ec) {
  if (!_0x3010ae) {
    return;
  }
  _0x3010ae.focus();
  const _0x39dc7d = document.createRange();
  const _0x11a107 = window.getSelection();
  let _0x3d95cf = _0x3010ae;
  let _0x3fe9d8 = _0x1984ec;
  for (; _0x3d95cf && _0x3fe9d8 > 0;) {
    if (_0x3d95cf.nodeType === 3) {
      if (_0x3d95cf.length >= _0x3fe9d8) {
        _0x39dc7d.setStart(_0x3d95cf, _0x3fe9d8);
        _0x39dc7d.collapse(!0);
        break;
      }
      _0x3fe9d8 -= _0x3d95cf.length;
    } else {
      _0x3d95cf = _0x3d95cf.firstChild;
    }
    if (!_0x3d95cf) {
      break;
    }
  }
  _0x11a107.removeAllRanges();
  _0x11a107.addRange(_0x39dc7d);
}
function insertTextAtCaret(_0x56a121, _0x4d10be, _0x4c338a) {
  if (_0x4c338a === undefined) {
    _0x4c338a = false;
  }
  if (!_0x4d10be) {
    return;
  }
  const _0x15dab6 = _0x56a121.replace(/<\/?[^>]+(>|$)/g, "");
  if (!_0x4d10be.innerText.trim().length) {
    _0x4d10be.innerHTML = "";
  }
  if (window.getSelection) {
    const _0xb9e0f1 = window.getSelection();
    let _0x11142e;
    if (_0xb9e0f1.rangeCount > 0 && _0x4d10be.contains(_0xb9e0f1.anchorNode)) {
      _0x11142e = _0xb9e0f1.getRangeAt(0);
    } else {
      _0x11142e = document.createRange();
      _0x11142e.selectNodeContents(_0x4d10be);
      _0x11142e.collapse(false);
    }
    _0x11142e.deleteContents();
    const _0x35fc2b = document.createTextNode(_0x15dab6);
    try {
      _0x11142e.insertNode(_0x35fc2b);
    } catch (_0x2d3758) {
      document.execCommand("insertText", false, _0x15dab6);
      return;
    }
    _0x11142e.setStartAfter(_0x35fc2b);
    _0x11142e.setEndAfter(_0x35fc2b);
    _0xb9e0f1.removeAllRanges();
    _0xb9e0f1.addRange(_0x11142e);
  } else if (document.selection && document.selection.createRange) {
    _0x4d10be.focus();
    document.selection.createRange().text = _0x15dab6;
  }
  _0x4d10be.focus();
  if (_0x4c338a) {
    _0x4d10be.dispatchEvent(new CustomEvent("checkScroll"));
  }
}
function getAvatarFrameUrl(_0x254289) {
  return "https://xath.hu/images/avframes/" + _0x254289 + ".webp";
}
function getAvatarEffectUrl(_0x54a16b, _0x30483d, _0x427fdc) {
  return "https://xath.hu/web_gear/chat/avatareffects.php?e=" + _0x54a16b + "&f=" + (_0x427fdc !== undefined ? _0x427fdc : 15) + "&c=" + (_0x30483d || "").replace("#", "");
}
function initAvatarEffect(_0x278c8e, _0x3e648a, _0x15df25) {
  const _0x5bc8af = _0x15df25 !== undefined && _0x15df25 != null && typeof _0x15df25 == "object" ? _0x15df25 : _0x278c8e.avatarEffect || {};
  const _0x363e04 = _0x5bc8af && _0x5bc8af.avatarframe;
  const _0x693750 = _0x5bc8af && _0x5bc8af.avatareffect;
  const _0x56412a = _0x5bc8af && (_0x5bc8af.avatarrounded === "true" || !0 === _0x5bc8af.avatarrounded);
  function _0x4fb4e7(_0x283049) {
    const _0xd086cd = _0x283049 || _0x3e648a;
    const _0x47adc7 = _0x3e648a.style.backgroundImage || typeof getComputedStyle != "undefined" && getComputedStyle(_0x3e648a).backgroundImage;
    if (!_0x47adc7 || _0x47adc7 === "none") {
      return;
    }
    let _0x48600a = _0xd086cd.querySelector(".avInner");
    if (!_0x48600a) {
      _0x48600a = document.createElement("div");
      _0x48600a.className = "avInner";
      _0xd086cd.insertBefore(_0x48600a, _0xd086cd.firstChild);
    }
    _0xd086cd.style.setProperty("--av-inner-bg", _0x47adc7);
    _0xd086cd.style.setProperty("--av-inner-bg-size", "cover");
    _0xd086cd.style.setProperty("--av-inner-bg-position", _0x3e648a.style.backgroundPosition || "center");
    _0xd086cd.style.setProperty("--av-inner-bg-repeat", "no-repeat");
    _0x3e648a.style.backgroundImage = "none";
  }
  if (_0x363e04) {
    const _0x225e65 = _0x5bc8af.avatarframe;
    const _0x1a1f44 = getAvatarFrameUrl(_0x225e65);
    _0x3e648a.classList.add("avBase", "avFrameNew");
    if (_0x3e648a.parentElement) {
      _0x3e648a.parentElement.style.overflow = "visible";
    }
    _0x3e648a.style.setProperty("--av-frame", "url('" + _0x1a1f44 + "')");
    let _0x2a111a = _0x3e648a.querySelector(".avCircle");
    if (!_0x2a111a) {
      _0x2a111a = document.createElement("div");
      _0x3e648a.insertBefore(_0x2a111a, _0x3e648a.firstChild);
    }
    _0x2a111a.className = _0x56412a ? "avCircle avCircleClip" : "avCircle";
    if (_0x693750) {
      const _0x449097 = getAvatarEffectUrl(_0x5bc8af.avatareffect, _0x5bc8af.avatarcolor, _0x5bc8af.avatarspeed);
      _0x2a111a.classList.add("avBase", "avEffect");
      if (_0x56412a) {
        _0x2a111a.classList.add("avEffectRound");
      }
      _0x2a111a.style.setProperty("--av-eff", "url('" + _0x449097 + "')");
    }
    const _0x1e08e3 = String(_0x225e65).toLowerCase();
    const _0x6a03bb = avatarFrames.find(_0x58a6d4 => _0x58a6d4.name === _0x1e08e3);
    if (_0x6a03bb) {
      _0x3e648a.style.setProperty("--av-frame-scale", _0x6a03bb.scale);
    }
    _0x4fb4e7(_0x2a111a);
    let _0x397b0d = _0x3e648a.querySelector(".avFrameLayer");
    if (!_0x397b0d) {
      _0x397b0d = document.createElement("img");
      _0x397b0d.className = "avFrameLayer";
      _0x397b0d.alt = "";
      _0x397b0d.draggable = false;
      _0x3e648a.appendChild(_0x397b0d);
    }
    _0x397b0d.src = _0x1a1f44;
    const _0x32aedb = _0x6a03bb ? _0x6a03bb.scale : 1.2;
    _0x397b0d.style.cssText = "position:absolute;top:0;left:0;width:100%;height:100%;object-fit:contain;z-index:100;pointer-events:none;border:none;outline:none;display:block;transform:scale(" + _0x32aedb + ");transform-origin:center center";
  } else if (_0x693750) {
    const _0xdca0f1 = getAvatarEffectUrl(_0x5bc8af.avatareffect, _0x5bc8af.avatarcolor, _0x5bc8af.avatarspeed);
    _0x3e648a.classList.add("avBase", "avEffect");
    _0x3e648a.style.setProperty("--av-eff", "url('" + _0xdca0f1 + "')");
  }
  if (_0x56412a && !_0x363e04) {
    _0x3e648a.classList.add("avBase", "avRound", "avEffectRound");
    _0x4fb4e7();
  }
}
function xEncodeURIComponent(_0x13a189) {
  return _0x13a189.replace(/[!'()*]/g, function (_0x2fb9d0) {
    return "%" + _0x2fb9d0.charCodeAt(0).toString(16);
  });
}
const gradientThemes = {
  csPulsar: {
    bgStart: "#2196F3",
    bgEnd: "#8419c1"
  },
  csNova: {
    bgStart: "#3F51B5",
    bgEnd: "#E91E63"
  },
  csMidnight: {
    bgStart: "#000031",
    bgEnd: "#0000bd"
  },
  csStellar: {
    bgStart: "#100d10",
    bgEnd: "#4e178f"
  },
  csAurora: {
    bgStart: "#064a37",
    bgEnd: "#2ab55a"
  },
  csFlare: {
    bgStart: "#e5b90f",
    bgEnd: "#e81b52"
  },
  csMystic: {
    bgStart: "#16b8c9",
    bgEnd: "#7e167f"
  }
};
const borderStyles = {
  rectangle: "0",
  skewedLeft: "1px 50px",
  skewedRight: "50px 10px",
  ellipse: "100px"
};
const smallFontStyles = ["FuzzyBubbles", "Aldrich", "DeliusSwashCaps", "Gabriela", "Courier"];
const setCstyle = function (_0x27e4c0, _0x38bf7d) {
  if (_0x27e4c0 === undefined) {
    _0x27e4c0 = "";
  }
  if (_0x38bf7d === undefined) {
    _0x38bf7d = false;
  }
  if (!_0x27e4c0) {
    _0x27e4c0 = _Activity.instance.cStyle;
  }
  const _0x335fc5 = document.querySelectorAll("#visitorsContainer ul li.section, .butcontainer");
  const _0xfa50e6 = document.querySelectorAll("#visitorsContainer ul li.section");
  const _0x2b917e = document.querySelectorAll(".butcontent:not(.mainButtons)");
  let _0x58d27a = {};
  try {
    _0x58d27a = JSON.parse(_0x27e4c0);
  } catch (_0x50b590) {
    console.error("Failed:", _0x50b590);
    return;
  }
  let {
    csTheme: _0x457ff0,
    csPool: _0xa4505b,
    csFont: _0x464ddd,
    csButtonBorder: _0x516397,
    csNameFx: _0x13557e,
    csChatShape: _0x2c2b4f,
    csChatBorder: _0x1f31e8,
    csShadow: _0x4ecbcf,
    csRankBan: _0x4ef8ef
  } = _0x58d27a;
  const _0x33e668 = gradientThemes[_0x457ff0];
  if (_0x33e668 && !_0x38bf7d) {
    applyThemeStyles(_0x457ff0, _0x335fc5, _0xfa50e6, _0x4ef8ef, _0x2b917e);
  } else if (_0xa4505b) {
    applyPoolStyles(_0xa4505b, _0xfa50e6, _0x4ef8ef);
  }
  if (_0x464ddd) {
    applyFontStyles(_0x464ddd, _0x335fc5, _0x2b917e);
  }
  if (borderStyles[_0x516397]) {
    applyButtonBorder(_0x516397, _0x335fc5);
  }
  if (_0x13557e) {
    applyNameFx(_0x13557e, _0xa4505b, _0x33e668);
  }
  if (_0x2c2b4f || _0x1f31e8 || _0x4ecbcf && Classic) {
    applyChatBoxStyle(_0x2c2b4f, _0x1f31e8, _0x4ecbcf);
  }
};
function applyPoolStyles(_0x2f2922, _0x12abf4, _0x5292f8) {
  if (!_0x2f2922 || !isValidHex(_0x2f2922)) {
    return;
  }
  const _0x474300 = _0x2f2922;
  const _0x4ed92f = isColorLight(_0x474300) ? "#000" : "#fff";
  _0x12abf4?.forEach(_0x387936 => {
    const _0x1fcc44 = _0x387936.classList.contains("rank") || _0x387936.classList.contains("ban");
    if (!(_0x5292f8 !== "true" && _0x1fcc44)) {
      _0x387936.style.backgroundColor = _0x474300;
      _0x387936.style.color = _0x4ed92f;
    }
  });
}
function applyThemeStyles(_0x24f6ca, _0x3f4954, _0x2caa8c, _0x43450c, _0x23c924) {
  const {
    bgStart: _0xcb2b21,
    bgEnd: _0x1698fb
  } = gradientThemes[_0x24f6ca];
  const _0x6bf849 = document.querySelector("#returnBtn");
  const _0x313a9f = parent.Classic ? findNodeInWindowOrParent(".dialogTitleBar") : document.querySelector(".actionsDialog");
  const _0x3afbeb = findNodeInWindowOrParent(".dialogTitle");
  const _0x56a4a2 = findNodeInWindowOrParent("#removeIcon");
  const _0x572a06 = document.querySelector("#id_ModalClose_custom img, #modalCancel img, #id_ModalClose img");
  const _0x3c70b0 = findNodeInWindowOrParent("#reportIcon");
  const _0x45b737 = document.querySelector(".dialogActionRight");
  _0x3f4954?.forEach(_0xabf916 => {
    applyGradientStyle(_0xabf916, _0xcb2b21, _0x1698fb);
  });
  _0x2caa8c?.forEach(_0x4322d5 => {
    if (_0x43450c === "true") {
      applyGradientStyle(_0x4322d5, _0xcb2b21, _0x1698fb);
    } else if (_0x4322d5.classList.contains("rank")) {
      applyGradientStyle(_0x4322d5, "#484848", "#a6a6a6");
    } else if (_0x4322d5.classList.contains("ban")) {
      applyGradientStyle(_0x4322d5, "#462200", "#b95d00");
    } else {
      applyGradientStyle(_0x4322d5, _0xcb2b21, _0x1698fb);
    }
  });
  if (_0x6bf849) {
    returnBtn.style.stroke = "#fff";
  }
  applyTitleBarStyles(_0x313a9f, _0x3afbeb, _0x56a4a2, _0x3c70b0, _0xcb2b21, _0x1698fb, _0x572a06);
  applyStyleForEach(_0x23c924, "color", "#fff");
  applyGradientStyle(_0x45b737, _0xcb2b21, _0x1698fb);
  ["dialogTitleBar"].forEach(_0x34b925 => {
    findNodeInWindowOrParent("." + _0x34b925, !0)?.forEach(_0x21d715 => {
      const _0x35a579 = _0x21d715.querySelector(".dialogTitle");
      applyTitleBarStyles(_0x21d715, _0x35a579, null, null, _0xcb2b21, _0x1698fb);
    });
  });
}
function applyFontStyles(_0x47b6c6, _0x26094a, _0x23b152) {
  const _0x24557f = document.querySelectorAll(".butIcons .svgBack");
  applyStyleForEach(_0x26094a, "fontFamily", _0x47b6c6);
  if (smallFontStyles.includes(_0x47b6c6)) {
    applyStyleForEach(_0x23b152, "fontSize", "10px");
    applyStyleForEach(_0x24557f, "width", "1.3rem");
    applyStyleForEach(_0x24557f, "height", "1.3rem");
  }
}
function applyButtonBorder(_0x481650, _0x13e0b5) {
  const _0x5ec457 = document.querySelectorAll(".butIcons");
  const _0x1fc5db = _0x481650 === "skewedLeft" || _0x481650 === "skewedRight";
  applyStyleForEach(_0x13e0b5, "borderRadius", borderStyles[_0x481650]);
  if (_0x1fc5db) {
    applyStyleForEach(_0x5ec457, "marginLeft", "6px");
  }
}
function applyNameFx(_0x7e3f59, _0x2ff4fe, _0x5d6f41) {
  if (!isValidHex(_0x7e3f59)) {
    return;
  }
  const _0x419d5a = document.querySelector(".grpName .section");
  const _0x15a074 = toHex6(config.ButColW);
  let _0x41d21f;
  if (_0x419d5a) {
    if (_0x5d6f41) {
      _0x41d21f = "ffffff";
    } else if (_0x2ff4fe) {
      _0x41d21f = isColorLight(_0x2ff4fe) ? "000000" : "ffffff";
    } else if (_0x15a074) {
      _0x41d21f = _0x15a074;
    }
    _0x419d5a.style.color = "#" + _0x41d21f + "63";
    _0x419d5a.classList.add("csNameFx");
    _0x419d5a.style.backgroundImage = "linear-gradient(70deg, #" + _0x41d21f + " 45%, " + _0x7e3f59 + "9c 50%, #" + _0x41d21f + " 55%)";
  }
}
function applyChatBoxStyle(_0x2010c1, _0xbe8810, _0x558593) {
  const _0x6fdbdb = parent?.parent?.document.querySelector("#embedframe:not(.hmemb)");
  var _0x9ccc43;
  if (_0x6fdbdb && (_0x9ccc43 = _0x6fdbdb)) {
    if (_0x2010c1 == "csRounded") {
      _0x9ccc43.style.borderRadius = "15px";
    }
    if (_0xbe8810 && isValidHex(_0xbe8810)) {
      _0x9ccc43.style.border = "2px solid " + _0xbe8810;
    }
    if (_0x558593 && isValidHex(_0x558593)) {
      _0x9ccc43.style.boxShadow = "0 0 20px " + _0x558593;
    }
  }
}
function applyGradientStyle(_0x194523, _0x2994c1, _0x5ab580) {
  if (_0x194523) {
    _0x194523.style.background = "linear-gradient(225deg, " + _0x2994c1 + " 0%, " + _0x5ab580 + " 100%)";
    _0x194523.style.color = "#fff";
  }
}
function applyTitleBarStyles(_0xf46ac5, _0x1b3bf2, _0x218465, _0x24acca, _0x2bb0e0, _0x21e08f, _0x59f899) {
  if (_0xf46ac5) {
    applyGradientStyle(_0xf46ac5, _0x2bb0e0, _0x21e08f);
  }
  if (_0x1b3bf2) {
    _0x1b3bf2.style.color = "#fff";
  }
  [_0x218465, _0x24acca, _0x59f899].forEach(_0x56f4a6 => {
    if (_0x56f4a6) {
      _0x56f4a6.src = _0x56f4a6 === _0x24acca ? "svg/reportw.svg" : "svg/removew.svg";
    }
  });
}
function applyStyleForEach(_0x245c4f, _0x306667, _0x275b8e) {
  _0x245c4f?.forEach(_0x31d811 => {
    _0x31d811.style[_0x306667] = _0x275b8e;
  });
}
function initFlix(_0x30ce42) {
  _Activity.initFlix(_0x30ce42);
}
function HandleFlix(_0x29a6b3) {
  return _Activity.HandleFlix(_0x29a6b3);
}
function setPawnHueValues(_0x1e228d) {
  _Activity.setPawnHueValues(_0x1e228d);
}
function setCurrentPawnPreview(_0x9e734d) {
  _Activity.instance.Settings.setCurrentPawnPreview(_0x9e734d);
}
function ProcessMessage(nickname = "", flags = 0, extra = "") {
  const result = {};

  if (!nickname) return result;

  // Caută poziția unde apare "text" (ex: (text#color#...))
  const textIndex = nickname.toLowerCase().indexOf("text");
  if (textIndex === -1) return result;

  // Extrage secțiunea de efecte (text#...)) și o sparge după #
  const effectString = nickname.slice(
    textIndex,
    nickname.indexOf(")", textIndex)
  );
  const parts = effectString.split("#");

  // Dacă are cel puțin 1 parametru după "text#"
  if (parts.length > 1) {
    // Glow-ul textului (primul argument după "text#")
    result.textGlow = DecodeColor(parts[1], flags);

    // A doua parte (poate fi textColor sau grad/flag/jewel etc.)
    if (parts[2]) {
      result.textColor = DecodeColor(parts[2], flags);

      // === GRADIENT ===
      if ((flags & NamePowers.grad) && parts[2] === "grad") {
        // Caz special cu o singură culoare
        if (parts.length - 4 === 1 && parts[4]) {
          result.color = DecodeColor(parts[4], flags);
        } else {
          result.grad = [];
          flags |= NamePowers.valid;

          for (let i = 4; i < parts.length; i++) {
            const firstChar = parts[i][0];
            const validGrad =
              firstChar !== "o" &&
              (firstChar !== "f" || parts[i].length === 6) ||
              (flags & NamePowers.wave);

            if (validGrad) {
              result.grad.push(DecodeColor(parts[i], flags));
            }
          }

          if (flags & NamePowers.wave) {
            result.grad.push("NW"); // Notă: North-West? (animație)
          }
        }

      // === JEWEL / FLAG ===
      } else if (
        ((flags & NamePowers.jewel) && parts[2] === "jewel") ||
        ((flags & NamePowers.flag) && parts[2] === "flag")
      ) {
        result.flag = [];
        for (let i = 3; i < parts.length; i++) {
          result.flag.push(parts[i]);
        }

      // === CULOARE SIMPLĂ ===
      } else if ((flags & NamePowers.col) && parts[2]) {
        result.color = DecodeColor(parts[2], flags);
      }
    }
  }

  // Dacă are doar glow fără alte efecte
  else if (parts.length === 1 && parts[1]) {
    result.textGlow = DecodeColor(parts[1], flags);
  }

  return result;
}
window.createTextColor = function (parent, text, options = {}) {
  const {
    userId,
    userName,
    nickname,
    hasBig,
    scrollParent,
    useMarkdown = true,
    useLinks = true,
    useMark = true
  } = options;

  const parsed = ProcessMessage(nickname || userName || "", 2147483647);

  const el = createTextSm(parent, text, {
    userId,
    userName,
    hasBig,
    scrollParent,
    useMarkdown,
    useLinks,
    useMark,
    align2: false,
    align3: true
  });

  // === Grad ===
  if (parsed.grad && parsed.grad.length > 0) {
    const grad = MakeGrad(parsed.grad);
    el.classList.add("clip");
    el.style.backgroundImage = grad[1];
    if (parsed.grad.join("").toLowerCase().includes("o3")) {
      el.style.backgroundSize = "220% 100%";
    }
    if (grad[0] && IsAnimationOn()) {
      el.classList.add("nameWave");
      el.style.animationDuration = grad[0] + "s";
    }
    addGlow(el, parsed, options);
    return el;
  }

  // === Flag / Jewel ===
  if (parsed.flag && parsed.flag.length > 0) {
    const flag = parsed.flag[0] || "x";
    const type = flag === "jewel" ? "png" : "svg";
    const img = new Image();
    img.src = `/images/js/flag/${flag}.${type}`;
    img.onload = () => {
      el.classList.add("clip");
      nameFlag(parsed.flag, el, img, 2147483647);
    };
    addGlow(el, parsed, options);
    return el;
  }

  // === Glow simplu sau doar textColor ===
  if (parsed.textGlow || parsed.textColor) {
    if (parsed.textGlow) {
      el.style.textShadow = "0 0 5px #" + toHex6(parsed.textGlow);
    }
    if (parsed.textColor) {
      el.style.color = "#" + toHex6(parsed.textColor);
    }
    addGlow(el, parsed, options);
  }

  return el;
};
async function copyToClipboard(_0xc0d09) {
  if (!isSecureContext || !navigator.clipboard?.writeText) {
    let _0x1a2560 = GetTranslation("mob2.clipboarderrorone");
    if (!_0x1a2560) {
      _0x1a2560 = "Clipboard API is current unavailable. Ensure you are using a secure page and that your browser is up to date.";
    }
    AlertMessage(_0x1a2560);
  }
  try {
    await navigator.clipboard.writeText(_0xc0d09);
    return;
  } catch (_0x868610) {
    if ((_0x868610?.name || "") === "NotAllowedError" && window.top !== window) {
      let _0x33eea2 = GetTranslation("mob2.clipboarderrortwo");
      if (!_0x33eea2) {
        _0x33eea2 = "Cannot copy to clipboard. Iframe must be allowed to write to clipboard, please contact the site administrator to resolve this issue.";
      }
      AlertMessage(_0x33eea2);
      return;
    }
  }
  {
    let _0xf3aeeb = GetTranslation("mob2.clipboarderrorthree");
    if (!_0xf3aeeb) {
      _0xf3aeeb = "Cannot copy to clipboard, please contact the site administrator to resolve this issue.";
    }
    AlertMessage(_0xf3aeeb);
  }
}
function cleanupPstyleClasses(_0x118742, _0x3f7d94) {
  const _0x3e70b1 = _0x3f7d94 ? document.getElementById("status") : document.getElementById("statusNew");
  const _0x22ffc1 = document.querySelectorAll(".butcontainer");
  const _0x32c837 = Classic ? parent.document.querySelector(".dialogTitleBar") : document.querySelector(".htmlTitleBar");
  const _0x3d84bd = document.getElementById("name");
  const _0x2b1339 = document.getElementById("onP");
  const _0x2d5eae = document.querySelectorAll(".profileIc img");
  const _0x17115a = _0x118742?.querySelector(".dialogTitleBar");
  const _0x439a7b = _0x118742?.querySelector(".dialogActionRight");
  [..._0x2d5eae, _0x2b1339, _0x3d84bd].filter(Boolean).forEach(_0x36c0d2 => {
    window.kPstyleKeys.forEach(_0x487493 => _0x36c0d2.classList.remove(_0x487493));
    _0x36c0d2.classList.remove("psinfo-front", "psinfo-back");
  });
  [..._0x22ffc1, _0x32c837, _0x17115a, _0x439a7b, !_0x3f7d94 && _0x3e70b1 ? _0x3e70b1 : null].filter(Boolean).forEach(_0xb81e9 => {
    window.kPstyleKeys.forEach(_0x446890 => _0xb81e9.classList.remove(_0x446890));
    _0xb81e9.classList.remove("pstyleFx");
  });
}