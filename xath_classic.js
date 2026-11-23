'use strict';

let menuState = 0;
let textRange = null;
let textSelection = null;
const mkTools = document.querySelector("#mkTools");
const textEntry = document.getElementById("textEntryEditable");
var _Activity;
function addMarkDown(_0x2a29b9, _0x86b7f8, _0x37c9c5) {
  let _0x1335dd = textEntry.innerText;
  switch (_0x2a29b9) {
    case "b":
      _0x1335dd = _0x86b7f8.slice(0, 2) == "*" && _0x86b7f8.slice(-2) == "*" ? _0x1335dd.replace(_0x1335dd.slice(_0x37c9c5.startOffset, _0x37c9c5.endOffset), _0x86b7f8.slice(2, _0x86b7f8.length - 2)) : _0x1335dd.replace(_0x1335dd.slice(_0x37c9c5.startOffset, _0x37c9c5.endOffset), "*" + _0x86b7f8 + "*");
      textEntry.innerText = _0x1335dd.replace(/nbsp;/gi, " ");
      break;
    case "i":
      _0x1335dd = _0x86b7f8.slice(0, 1) == "_" && _0x86b7f8.slice(-1) == "_" ? _0x1335dd.replace(_0x1335dd.slice(_0x37c9c5.startOffset, _0x37c9c5.endOffset), _0x86b7f8.slice(1, _0x86b7f8.length - 1)) : _0x1335dd.replace(_0x1335dd.slice(_0x37c9c5.startOffset, _0x37c9c5.endOffset), "_" + _0x86b7f8 + "_");
      textEntry.innerText = _0x1335dd.replace(/nbsp;/gi, " ");
      break;
    case "u":
      _0x1335dd = _0x86b7f8.slice(0, 1) == "~" && _0x86b7f8.slice(-1) == "~" ? _0x1335dd.replace(_0x1335dd.slice(_0x37c9c5.startOffset, _0x37c9c5.endOffset), _0x86b7f8.slice(1, _0x86b7f8.length - 1)) : _0x1335dd.replace(_0x1335dd.slice(_0x37c9c5.startOffset, _0x37c9c5.endOffset), "~" + _0x86b7f8 + "~");
      textEntry.innerText = _0x1335dd.replace(/nbsp;/gi, " ");
      break;
    case "q":
      _0x1335dd = _0x86b7f8.slice(0, 2) == ">[" && _0x86b7f8.slice(-1) == "]" ? _0x1335dd.replace(_0x1335dd.slice(_0x37c9c5.startOffset, _0x37c9c5.endOffset + 4), _0x86b7f8.slice(2, _0x86b7f8.length - 1)) : _0x1335dd.replace(_0x1335dd.slice(_0x37c9c5.startOffset, _0x37c9c5.endOffset), ">[" + _0x86b7f8 + "]");
      textEntry.innerText = cleanXatTagsIcons(_0x1335dd.replace(/nbsp;/gi, " "));
      break;
    case "link":
      _0x1335dd = _0x1335dd.replace(_0x1335dd.slice(_0x37c9c5.startOffset, _0x37c9c5.endOffset), "[" + _0x86b7f8 + "]()");
      textEntry.innerHTML = _0x1335dd.replace(/nbsp;/gi, " ");
  }
}
function toggleMenu(_0x5778d9) {
  if (menuState !== 1 && _0x5778d9) {
    menuState = 1;
    mkTools.classList.add("active");
  } else if (menuState !== 0 && !_0x5778d9) {
    menuState = 0;
    mkTools.classList.remove("active");
  }
}
function positionMenu(_0x5229d7) {
  const _0xb17e0d = getPosition(_0x5229d7);
  const _0x21eae2 = mkTools.offsetWidth;
  const _0x4e9fe9 = mkTools.offsetHeight;
  const _0x42cc69 = Math.max(_0xb17e0d.x - _0x21eae2 / 2, 10);
  const _0xa2442c = textEntry.offsetTop - _0x4e9fe9 - 5;
  const _0x4a539d = window.innerWidth;
  const _0x423a9f = window.innerHeight;
  mkTools.style.left = _0x4a539d - _0x42cc69 < _0x21eae2 ? _0x4a539d - _0x21eae2 + "px" : _0x42cc69 + "px";
  mkTools.style.top = _0x423a9f - _0xa2442c < _0x4e9fe9 ? _0x423a9f - _0x4e9fe9 + "px" : _0xa2442c + "px";
}
function getPosition(_0x3e468f) {
  let _0x15f05e = 0;
  let _0x279fcd = 0;
  _0x3e468f ||= window.event;
  if (_0x3e468f.pageX || _0x3e468f.pageY) {
    _0x15f05e = _0x3e468f.pageX;
    _0x279fcd = _0x3e468f.pageY;
  } else if (_0x3e468f.clientX || _0x3e468f.clientY) {
    _0x15f05e = _0x3e468f.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
    _0x279fcd = _0x3e468f.clientY + document.body.scrollTop + document.documentElement.scrollTop;
  }
  return {
    x: _0x15f05e,
    y: _0x279fcd
  };
}
setStuffAndListener();
if (_Activity === undefined) {
  _Activity = parent._Activity !== undefined ? parent._Activity : parent.parent._Activity !== undefined ? parent.parent._Activity : parent.parent.parent._Activity !== undefined ? parent.parent.parent._Activity : {};
}
const mkButtons = document.querySelectorAll("[data-mk]");
mkButtons.forEach(_0x4666c4 => {
  switch (_0x4666c4.dataset.mk) {
    case "b":
      addToolTip(_0x4666c4, ["mob2.bold", "Bold"], {
        position: "low"
      });
      break;
    case "i":
      addToolTip(_0x4666c4, ["mob2.italic", "Italic"], {
        position: "low"
      });
      break;
    case "u":
      addToolTip(_0x4666c4, ["mob2.strike", "Strikethrough"], {
        position: "low"
      });
      break;
    case "q":
      addToolTip(_0x4666c4, ["mob2.quote", "Quote"], {
        position: "low"
      });
      break;
    case "link":
      addToolTip(_0x4666c4, ["mob2.link", "Link"], {
        position: "low"
      });
  }
  _0x4666c4.addEventListener("click", () => {
    if (textRange && textSelection) {
      addMarkDown(_0x4666c4.dataset.mk, textSelection, textRange);
    }
  });
});
let pressed = !1;
function addToTextEntry(_0x53f880, _0x511069 = false) {
  if (typeof messages != "undefined" && messages.activeEditMessageNode) {
    const _0x382210 = messages.activeEditMessageNode;
    if (_0x511069) {
      placeCaretAtEnd(_0x382210);
    } else {
      _0x382210.focus();
      placeCaretAt(textEntryCaretPos, _0x382210.childNodes[0]);
    }
    pasteHtmlAtCaret(_0x53f880);
    textEntryCaretPos = getCaretWithin(_0x382210.childNodes[0]);
    return;
  }
  pasteHtmlAtCaret(_0x53f880);
  textEntryCaretPos = getCaretWithin(textEntry);
}
var totTabWidth;
var TabHeight;
var MainOwner;
var lastGroup;
var lastCurrentChat;
var BuddyOff;
var gotClearChats;
function classicSetHeight(_0x2838ee) {
  if (butsFrame) {
    var _0x40d5a4 = {
      mh: _0x2838ee + 300
    };
    if (actions.getMe()) {
      _0x40d5a4.mw = 900;
    }
    _0x40d5a4.customHeight = actions.checkIfButtons();
    posModal(butsFrame, _0x40d5a4);
    butsFrame.style.visibility = "visible";
  }
}
function resizeTabs(_0x5e5e99) {
  _0x5e5e99 ||= document.getElementById("chattabs");
  removeById("PadCell");
  var _0x5e40bf;
  var _0x46df90;
  for (var _0x3545c5 = _0x5e5e99.childNodes, _0x7678ea = [], _0x5e874d = 0, _0x5eadae = 0, _0x2fb232 = 0, _0x1e6052 = 0; _0x3545c5[_0x5e874d];) {
    if (_0x3545c5[_0x5e874d].but && _0x3545c5[_0x5e874d].but.active && _0x5eadae < 1) {
      _0x5eadae++;
      _0x7678ea[_0x5e874d] = 1;
    }
    if (_0x3545c5[_0x5e874d].but.id == 10) {
      _0x7678ea[_0x5e874d] = 2;
    }
    _0x5e874d++;
  }
  var _0x5074f8 = totTabWidth;
  if (_0x5074f8 > 130) {
    _0x5074f8 = 130;
  }
  var _0x57a284 = xInt((totTabWidth - _0x5074f8) / (_0x5e874d > 1 ? _0x5e874d - 1 : 1));
  if (_0x57a284 > _0x5074f8) {
    _0x57a284 = _0x5074f8;
  }
  _0x2fb232 = 0;
  for (; _0x2fb232 < _0x5e874d; _0x2fb232++) {
    _0x5e40bf = _0x57a284;
    if (_0x7678ea[_0x2fb232] == 1) {
      _0x5e40bf = _0x5074f8;
    }
    if (_0x7678ea[_0x2fb232] == 2) {
      _0x5e40bf = 27;
    }
    _0x5e40bf = xInt(_0x5e40bf);
    _0x46df90 = "height:" + Math.max(TabHeight, 24) + "px; width:" + _0x5e40bf + "px";
    if (typeof _0x3545c5[_0x2fb232] == "object") {
      try {
        _0x3545c5[_0x2fb232].style.cssText = _0x46df90;
      } catch (_0x39acfd) {}
      _0x3545c5[_0x2fb232].but.style.cssText = _0x46df90;
      _0x1e6052 += _0x5e40bf;
    }
  }
  if (_0x1e6052 < totTabWidth && totTabWidth - _0x1e6052 > 1) {
    (_0x2fb232 = makeElement(_0x5e5e99, "div", "cell", "PadCell")).style.cssText = "width:" + (totTabWidth - _0x1e6052) + "px";
  }
}
function addChatTab(_0x2269d5, _0x468ffe, _0x58acd8, _0xa5857, _0x461081, _0x1d4e48, _0x99459d, _0x238c9b, _0x523ce4) {
  var _0x46d22d;
  var _0x7365f1 = document.getElementById("chattabs");
  var _0x4fcf2c = _0x238c9b;
  let _0x1022b4 = _0x58acd8 == "10";
  let _0xd6234b = _0xa5857;
  if (!_0x523ce4 && !_0x1022b4) {
    _0xd6234b = _0xd6234b.substr(0, 10);
  }
  if (!_0x4fcf2c) {
    removeById("PadCell");
    if (_0x7365f1.childElementCount >= 11) {
      if (!_0x461081) {
        resizeTabs(_0x7365f1);
        return;
      }
      _0x7365f1.removeChild(_0x7365f1.lastChild);
    }
    (_0x4c566f = makeElement(_0x7365f1, "div", "cell")).style.cssText = "width:0px";
    _0x46d22d = makeElement(_0x4c566f, "div", "chatdel");
    _0x4fcf2c = makeElement(_0x4c566f, "button");
    _0x4c566f.DelDiv = _0x46d22d;
    _0x4c566f.but = _0x4fcf2c;
    _0x4fcf2c.style.cssText = "width:0px";
    _0x4fcf2c.active = _0x461081;
    _0x4fcf2c.id = _0x58acd8;
  }
  while (_0x4fcf2c.firstChild) {
    _0x4fcf2c.removeChild(_0x4fcf2c.firstChild);
  }
  _0x4fcf2c.id = _0x58acd8;
  _0x4fcf2c.lit = _0x1d4e48;
  _0x4fcf2c.active = _0x461081;
  _0x4fcf2c.del = _0x99459d;
  if (_0xd6234b || _0x4fcf2c.chatName == null) {
    _0x4fcf2c.chatName = _0xd6234b;
  }
  if (_0x468ffe) {
    _0x4fcf2c.chatid = _0x468ffe;
  }
  _0x4fcf2c.className = "chatlinks";
  if (_0x461081) {
    _0x4fcf2c.className += " active";
  }
  _0x4fcf2c.onclick = function (_0x363531) {
    messages.toggleMsgMenu(false);
    sendApp(_0x363531, _0x58acd8, _0x4fcf2c.chatid, 0, _0x4fcf2c.chatName);
    lightChat(_0x58acd8, true, false);
    if (_0x4fcf2c.chatid == 10) {
      _Activity.instance.clickedTickleTab = true;
      clearDiv("idvisitors");
    } else {
      _Activity.instance.clickedTickleTab = false;
    }
  };
  resizeTabs(_0x7365f1);
  var _0x3e4585 = makeElement(_0x4fcf2c, "div");
  var _0x3d261f = makeElement(_0x3e4585, "div");
  var _0x2941ec = makeElement(_0x3d261f, "div");
  var _0xe34b80 = makeElement(_0x2941ec, "div", "svgBack");
  _0x3d261f.style.cssText = "display: flex; align-items: center; justify-content: flex-start;";
  let _0x288133 = "bubble";
  if (_0x1022b4) {
    _0x288133 = "notif";
  }
  if (!_0x1d4e48) {
    _0x288133 += 2;
  }
  let _0x4ebbfc = Browser && Browser == "MS" ? "width:1.3rem;height:1.2rem" : "width:1.4rem;height:1.4rem";
  _0xe34b80.style.cssText = "text-align:center; " + _0x4ebbfc + "; background-image: url(svg/" + _0x288133 + ".svg)";
  _0x4fcf2c.count = makeElement(_0xe34b80, "span");
  let _0x35bddc = _0x1022b4 ? 1.1 : 1.3;
  if (hasDarkMode()) {
    _0x4fcf2c.count.style.cssText = "font-size:0.7rem; color:#000; line-height: " + _0x35bddc + "rem;";
  } else {
    _0x4fcf2c.count.style.cssText = "font-size:0.7rem; line-height: " + _0x35bddc + "rem;";
  }
  if (_0x1d4e48) {
    changeText(_0x4fcf2c.count, 1);
  }
  var _0x42f008 = makeElement(_0x3d261f, "div");
  _0x42f008.style.cssText = "padding-left: 0.2rem;";
  if (_0x99459d && _0x46d22d) {
    _0xa5857 = _0xa5857.replace(/_/g, " ");
    _0xd6234b = _0xd6234b.replace(/_/g, " ");
  }
  addToolTip(_0x4fcf2c, _0xa5857, {
    position: "low"
  });
  addText(_0x42f008, " " + _0xd6234b + " ");
  if (_0x99459d && _0x46d22d && !_0x1022b4) {
    let _0x139f10 = hasDarkMode() ? " darkDel" : "";
    makeElement(_0x46d22d, "div", "svgBack" + _0x139f10);
    var _0x4c566f;
    _0x46d22d.onclick = function (_0x422f76) {
      sendApp(_0x422f76, _0x58acd8, _0x4fcf2c.chatid, 1);
    };
    (_0x4c566f = _0x4fcf2c.parentNode).onmouseenter = function (_0x1ad188) {
      this.DelDiv.style.cssText = "display:table";
      _0x4c566f.querySelector(".chatlinks > div").style.cssText = "width: 100%; -webkit-mask-image: linear-gradient(90deg, rgba(2, 0, 36, 1) 0%, rgba(2, 0, 36, 1) 40%, rgba(0, 0, 0, 0) 75%)";
    };
    _0x4c566f.onmouseleave = function (_0x4960b0) {
      this.DelDiv.style.cssText = "";
      _0x4c566f.querySelector(".chatlinks > div").style.cssText = "";
    };
  }
  if (_0x461081) {
    var _0x1fd478 = _0x58acd8.split("_");
    _0x1fd478 = xInt(_0x1fd478[1]);
    LoadBackground2(document.getElementById("background"), PcBacks[_0x1fd478]);
  }
  return _0x4fcf2c;
}
function navigate(_0x75b61b) {
  const _0x37885f = document.querySelector(".chatlinks")?.id;
  const _0x47475e = (_0x18654c => document.querySelector(".chatlinks.active[id*=\"_\"], .chatlinks.active[id=\"" + _0x18654c + "\"], .chatlinks.active[id=\"10\"]"))(_0x37885f);
  const _0x5d760d = (_0x52b531 => [...document.querySelectorAll(".chatlinks[id*=\"_\"], .chatlinks[id=\"" + _0x52b531 + "\"], .chatlinks[id=\"10\"]")])(_0x37885f);
  if (!_0x5d760d.length) {
    return;
  }
  const _0x46f45e = _0x5d760d.filter(_0x370be4 => _0x370be4.id != "10");
  if (!_0x46f45e.length) {
    return;
  }
  document.querySelector(".chatlinks.active")?.classList.remove("active");
  const _0x25c028 = (_0x46f45e.indexOf(_0x47475e) + _0x75b61b + _0x46f45e.length) % _0x46f45e.length;
  _0x46f45e[_0x25c028]?.classList.add("active");
  _0x46f45e[_0x25c028]?.click();
}
function sendApp(_0xa7b8d3, _0x1553a9, _0x45e136, _0x5cf3f2, _0x9ce6dd) {
  var _0x6bc9eb;
  var _0x162b65 = {
    ChatId: _0x45e136,
    Command: "Click"
  };
  _0xa7b8d3.stopPropagation();
  _0x6bc9eb = _0x162b65;
  if (_0x45e136.indexOf("_") < 0) {
    _0x6bc9eb.Group = _0x9ce6dd;
  }
  if (_0x5cf3f2) {
    _0x6bc9eb.DeleteId = _0x45e136;
    _0x6bc9eb.Next = "1";
    removeById(_0x1553a9, 1);
    resizeTabs();
  }
  ToC(_0x6bc9eb);
  if (_0x5cf3f2) {
    navigate(0);
  }
}
Classic = !0;
bodyResize(null);
visitors.Classic = !0;
friends.Classic = !0;
messages.Classic = !0;
friends.ScrollContainer = document.getElementById("visitorsContainer");
isWEB = !0;
var translateLoaded = !1;
var chats = new function () {
  this.main = function (_0x3c388a) {
    let _0x5d48a6 = JSON.parse(_0x3c388a);
    if (_0x5d48a6.MyId) {
      MyObj = _0x5d48a6;
    }
  };
  this.SetEdit = function (_0x49461c) {};
  this.clearChats = function () {};
  this.clearChats2 = function () {
    gotClearChats = !0;
  };
  this.addHelp = function (_0x1869fd) {};
  this.addChat = function (_0x3b77c3, _0x417ea7) {
    if (!translateLoaded) {
      translateLoaded = true;
      TranslateAll();
    }
    var _0x501c90;
    var _0xa74cd2 = JSON.parse(_0x3b77c3);
    if (!_0xa74cd2.CurrentChat) {
      return;
    }
    let _0x6ae8e2;
    var _0x4a0c63 = document.getElementById("alltabs");
    totTabWidth ||= _0x4a0c63.offsetWidth;
    TabHeight ||= _0x4a0c63.offsetHeight - 4;
    let _0x2e3fa8 = (_0x41afc7 = _0xa74cd2.id) == "10";
    if (_0x41afc7.search("_") < 0 && !_0x2e3fa8) {
      _0x501c90 = _0x41afc7;
    } else {
      BuddyOff = true;
    }
    const _0x188cab = _0xa74cd2.name || _0xa74cd2.CurrentChat.split("_")[1];
    let _0x5a1fd8 = ProcessName(_0x188cab, "", ~NamePowers.nospace & 65535).name;
    if (_0x5a1fd8.indexOf("xath.hu/") == -1) {
      _0x5a1fd8 = _0x5a1fd8.replace(/_/gi, " ");
    }
    _0x5a1fd8 = _0x5a1fd8.replace("xath.hu/", "");
    _0x5a1fd8 = _0x5a1fd8.replace(/\s*\(.*?\)\s*/g, " ");
    _0x5a1fd8 = _0x5a1fd8.trim();
    if (!_0x5a1fd8 || _0x5a1fd8 == "﻿") {
      if (_0xa74cd2.RegName) {
        _0x5a1fd8 = _0xa74cd2.RegName;
      } else {
        if (_0xa74cd2.RegName != "" || !_0xa74cd2.id) {
          return;
        }
        _0x5a1fd8 = _0xa74cd2.id.indexOf("_") > 0 ? _0xa74cd2.id.split("_")[1] : _0xa74cd2.id;
        _0x6ae8e2 = 1;
      }
    }
    var _0x341cef = document.getElementById(_0x41afc7);
    if ((!_0x341cef || gotClearChats && _0x341cef) && _0x501c90) {
      clearDiv("chattabs");
      lastGroup = 0;
      _0x341cef = null;
      BuddyOff = false;
    }
    if (!_0x341cef || _0x501c90 && _0x501c90 !== lastGroup) {
      if (!(_0x341cef = addChatTab(0, _0xa74cd2.id, _0x41afc7, _0x5a1fd8, _0xa74cd2.CurrentChat == _0x41afc7, !1, !_0x501c90, _0x341cef, _0x501c90))) {
        return;
      }
      if (_0x6ae8e2) {
        _0x341cef.NoName = 1;
      }
      if (_0x501c90 && lastGroup == 0 && _0xa74cd2.tickle) {
        addChatTab(1, "10", "10", "", 1, 0, 0, 0, 0);
      }
    }
    if (_0x341cef.NoName && _0x5a1fd8) {
      _0x341cef.NoName = 0;
      changeText(_0x341cef.firstChild.firstChild.children[1], " " + _0x5a1fd8.substr(0, 10) + " ");
    }
    if (_0x501c90 && _0x501c90 !== lastGroup) {
      lastGroup = _0x501c90;
    }
    var _0x41afc7;
    var _0x55d295 = xInt(_0xa74cd2.GreenCnt);
    if (_0xa74cd2.CurrentChat == _0x41afc7) {
      _0x55d295 = 0;
    }
    if (_0x55d295 > 0) {
      let _0x47bed5 = _0x341cef.getElementsByClassName("cell");
      if (_0x47bed5 && _0x47bed5[0]) {
        let _0x12a7fa = _0x2e3fa8 ? ["mob2.clickedyou", "$1 users clicked you!", _0x55d295] : ["mob2.unreadmessages", "$1 unread messages!", _0x55d295];
        addToolTip(_0x47bed5[0], _0x12a7fa, {
          position: "low",
          maxWidth: !0
        });
      }
      changeText(_0x341cef.count, _0x55d295 > 9 ? _0x2e3fa8 ? "+" : "9+" : _0x55d295);
      lightChat(_0x41afc7, !1, !0);
    } else {
      _0x341cef.count.innerHTML = "";
    }
    if (_0xa74cd2.CurrentChat != lastCurrentChat) {
      lightChat(_0x41afc7 = _0xa74cd2.CurrentChat, true, false);
      lastCurrentChat = _0x41afc7;
    }
    if (!BuddyOff && _0xa74cd2.buddyid) {
      if (!document.getElementById(_0xa74cd2.buddyid)) {
        addChatTab(0, _0xa74cd2.buddyid, _0xa74cd2.buddyid, _0xa74cd2.buddyname, false, false, false, null, _0x501c90);
      }
      BuddyOff = true;
    }
    gotClearChats = !1;
  };
}();
function lightChat(_0x1f5062, _0x4745bc, _0x2b23e9) {
  var _0x13bbd4;
  var _0x25695c;
  var _0x3d8913;
  _0x25695c = document.getElementsByClassName("chatlinks");
  _0x13bbd4 = 0;
  for (; _0x13bbd4 < _0x25695c.length; _0x13bbd4++) {
    if ((_0x3d8913 = _0x25695c[_0x13bbd4]).id == _0x1f5062) {
      if ((_0x3d8913.lit === _0x2b23e9 || _0x2b23e9 === 0) && (_0x3d8913.active == _0x4745bc || _0x4745bc == 0)) {
        continue;
      }
      addChatTab(0, 0, _0x1f5062, _0x3d8913.chatName, _0x4745bc, _0x2b23e9, _0x3d8913.del, _0x3d8913);
    } else {
      if (!1 === _0x3d8913.active || !0 !== _0x4745bc) {
        continue;
      }
      addChatTab(0, 0, _0x3d8913.id, _0x3d8913.chatName, !1, _0x3d8913.lit, _0x3d8913.del, _0x3d8913);
    }
  }
}
function setButCols(_0x4fada4, _0xe1f779) {
  var _0x3629b4;
  var _0x5d186e = ["butcontainer"];
  _0x3629b4 = "color:#" + toHex6(_0xe1f779) + "; background-color: #" + toHex6(_0x4fada4);
  let _0x4b88da = document.querySelector("#returnBtn");
  if (_0x4b88da) {
    _0x4b88da.style.stroke = "#" + toHex6(_0xe1f779);
  }
  const _0x338ec9 = "svg/remove" + (toHex6(_0xe1f779)[0] == "0" ? "b" : "w") + ".svg";
  document.getElementById("removeIcon").src = _0x338ec9;
  for (var _0x332e5a in _0x5d186e) {
    var _0xcccf87;
    var _0x20ab2f = document.getElementsByClassName(_0x5d186e[_0x332e5a]);
    for (_0xcccf87 = 0; _0xcccf87 < _0x20ab2f.length; _0xcccf87++) {
      _0x20ab2f[_0xcccf87].style.cssText = _0x3629b4;
    }
  }
}
function setSignInButton(_0x316c18) {
  setTextNode("signIn", _0x316c18);
}
function setString(_0x23a733, _0x1e5a36) {
  setTextNode(_0x23a733, isNaN(_0x1e5a36) ? _0x1e5a36 : GetTranslation("box." + _0x1e5a36));
}
let textEntryCaretPos = 0;
function getAChatBoxPressed() {
  var _0x14e98c = config.roomid;
  var _0xe9e964 = MainOwner ? "#!editgroup&roomid=" + _0x14e98c + "&GroupName=" + MainOwner : "#!creategroup";
  window.open("//xath.hu/chats" + _0xe9e964, "_blank");
}
function smiliePressed(_0x52b881) {
  if (typeof messages != "undefined" && messages.activeEditMessageNode) {
    if (messages.activeEditMessageNode.innerText.length >= 256) {
      return;
    }
    insertTextAtCaret(_0x52b881, messages.activeEditMessageNode, !0);
  } else {
    placeCaretAt(textEntryCaretPos);
    pasteHtmlAtCaret(_0x52b881);
    textEntryCaretPos = getCaretWithin(textEntry);
  }
}
function getCaretWithin(_0x566f99) {
  var _0x5412c7;
  var _0x1a36c4 = 0;
  var _0x433bf1 = _0x566f99.ownerDocument || _0x566f99.document;
  var _0x477989 = _0x433bf1.defaultView || _0x433bf1.parentWindow;
  if (_0x477989.getSelection !== undefined) {
    if ((_0x5412c7 = _0x477989.getSelection()).rangeCount > 0) {
      var _0x308e71 = _0x477989.getSelection().getRangeAt(0);
      var _0x44f7f1 = _0x308e71.cloneRange();
      _0x44f7f1.selectNodeContents(_0x566f99);
      _0x44f7f1.setEnd(_0x308e71.endContainer, _0x308e71.endOffset);
      _0x1a36c4 = _0x44f7f1.toString().length;
    }
  } else if ((_0x5412c7 = _0x433bf1.selection) && _0x5412c7.type != "Control") {
    var _0x38e6b5 = _0x5412c7.createRange();
    var _0x2f6eac = _0x433bf1.body.createTextRange();
    _0x2f6eac.moveToElementText(_0x566f99);
    _0x2f6eac.setEndPoint("EndToEnd", _0x38e6b5);
    _0x1a36c4 = _0x2f6eac.text.length;
  }
  return _0x1a36c4;
}
function buyPressed() {
  window.open("//xath.hu/buy", "_blank");
}
function getStuffPressed() {
  const _0x220762 = document.querySelector(".dialogBody");
  if (_0x220762) {
    _0x220762.style.height = "90%";
  }
  classicSetDialog("selector", {
    Type: "Smilies"
  });
}
function appPressed() {
  if (parent) {
    parent.postMessage(JSON.stringify({
      action: "sideload",
      n: "apps"
    }), "https://xath.hu");
  }
}
function spkPressed() {
  var _0x4bbca7 = document.getElementById("volumePopup");
  let _0x48cac9 = document.getElementById("volumePopupContent");
  var _0x2d6fa5 = document.getElementById("spkBut").getBoundingClientRect();
  var _0x30a27f = document.getElementById("volumePopupContent").getBoundingClientRect();
  var _0x1fb8ce = (_0x2d6fa5.left + _0x2d6fa5.right) / 2 - _0x30a27f.width / 2;
  if (window.innerWidth <= 500) {
    _0x48cac9.classList.add("radioPopup");
    _0x1fb8ce -= 40;
  } else {
    _0x48cac9.classList.remove("radioPopup");
  }
  _0x4bbca7.style.left = _0x1fb8ce + "px";
  _0x4bbca7.style.top = _0x2d6fa5.top + "px";
  var _0x1e16bb = document.getElementById("chatVolume0");
  var _0x4073f8 = document.getElementById("radioVolume1");
  var _0x33a560 = document.getElementById("kissVolume2");
  var _0x320983 = document.getElementById("radioVolume3");
  var _0x3e452 = document.getElementById("chatVolOnOff0");
  var _0x5ef2ee = document.getElementById("kissVolOnOff2");
  var _0x2bcd6e = document.getElementById("radioVolOnOff1");
  var _0xa55367 = document.getElementById("radioVolOnOff3");
  function _0x45f78f() {
    _0x3e452.src = "svg/" + (_Activity.instance.Sound & 1 ? "chatsnd" : "chatoff") + ".svg";
    _0x2bcd6e.src = "svg/" + (_Activity.instance.Sound & 2 ? "radio" : "radiooff") + ".svg";
    _0x5ef2ee.src = "svg/" + (_Activity.instance.Sound & 4 ? "kisseson" : "kissesoff") + ".svg";
    _0xa55367.src = "svg/" + (_Activity.instance.Sound & 8 ? "playon" : "playoff") + ".svg";
    if (Player) {
      let _0x47eca0 = _Activity.instance.Sound & 8 ? _Activity.instance.Volume[3] : 0;
      Player.setVolume(_0x47eca0);
    }
    SetSpkIcon(_Activity.instance.Sound);
    addToolTip(_0x3e452, ["mob2.xsound", "Chat"], {
      position: "low"
    });
    addToolTip(_0x5ef2ee, ["mob2.xkiss", "Kisses"], {
      position: "low"
    });
    addToolTip(_0x2bcd6e, ["mob2.xradio", "Radio"], {
      position: "low"
    });
    addToolTip(_0xa55367, ["mob2.xyoutube", "YouTube"], {
      position: "low"
    });
  }
  function _0x41d2f1(_0x439831) {
    _0x439831.stopPropagation();
    var _0x13d9ff = xInt(_0x439831.target.id.charAt(_0x439831.target.id.length - 1));
    let _0x25d461 = 1 << _0x13d9ff;
    var _0x498e54 = {
      Command: "Vol",
      id: _0x13d9ff
    };
    var _0x8704e = _0x498e54;
    if (_0x439831.target.id.charAt(_0x439831.target.id.length - 2) == "f") {
      switch (_0x13d9ff) {
        case 0:
        case 1:
        case 2:
        case 3:
          _Activity.instance.Sound = _Activity.instance.Sound ^ _0x25d461;
          _0x8704e.w_sound = _Activity.instance.Sound;
          _0x45f78f();
      }
    } else {
      _Activity.instance.Volume[_0x13d9ff] = _0x8704e.value = _0x439831.target.value;
      if (_Activity.instance.Radio && _0x13d9ff == 1 && _Activity.instance.Sound & 2) {
        _Activity.instance.Radio.volume(_0x439831.target.value / 100);
      }
      if (Player && _0x13d9ff == 3 && _Activity.instance.Sound & 8) {
        Player.setVolume(xInt(_0x439831.target.value));
      }
    }
    if (["change", "click"].indexOf(_0x439831.type) >= 0) {
      ToC(_0x8704e);
    }
  }
  _0x45f78f();
  _0x1e16bb.value = _Activity.instance.Volume[0];
  _0x4073f8.value = _Activity.instance.Volume[1];
  _0x33a560.value = _Activity.instance.Volume[2];
  _0x320983.value = _Activity.instance.Volume[3];
  _0x1e16bb.oninput = _0x41d2f1;
  _0x1e16bb.onchange = _0x41d2f1;
  _0x4073f8.oninput = _0x41d2f1;
  _0x4073f8.onchange = _0x41d2f1;
  _0x33a560.oninput = _0x41d2f1;
  _0x33a560.onchange = _0x41d2f1;
  _0x320983.oninput = _0x41d2f1;
  _0x320983.onchange = _0x41d2f1;
  _0x3e452.onclick = _0x41d2f1;
  _0x2bcd6e.onclick = _0x41d2f1;
  _0x5ef2ee.onclick = _0x41d2f1;
  _0xa55367.onclick = _0x41d2f1;
  document.getElementById("volumePopupContent").classList.toggle("show");
}
var SaveHasRadio;
function SetSpkIcon(_0x250b7e, _0x3b2873 = SaveHasRadio) {
  var _0x50bbc9 = document.getElementById("spkBut");
  var _0x5e2fcd = "radio";
  if ((_0x250b7e & 15) == 0) {
    _0x5e2fcd += "off";
  }
  if (_0x50bbc9) {
    _0x50bbc9.style.backgroundImage = "url('svg/" + _0x5e2fcd + ".svg')";
  }
}
function openList(_0x3800b8, _0x4dcb09, _0x5bbac6) {
  var _0x45fb30;
  var _0x30d417;
  _0x30d417 = document.getElementsByClassName("listlinks");
  _0x45fb30 = 0;
  for (; _0x45fb30 < _0x30d417.length; _0x45fb30++) {
    _0x30d417[_0x45fb30].className = _0x30d417[_0x45fb30].className.replace(" active", "");
  }
  if (_0x3800b8) {
    _0x3800b8.currentTarget.className += " active";
  }
  if (_0x5bbac6 !== undefined) {
    _0x30d417[_0x5bbac6].className += " active";
  }
  var _0x4c4945 = clearDiv("visitorsContainer");
  makeElement(_0x4c4945, "ul", 0, "id" + _0x4dcb09);
  var _0x2df36a = {
    Command: "QueNotify"
  };
  switch (_0x4dcb09) {
    case "visitors":
      _0x2df36a.Notify = "VisitorsUpdateAll";
      break;
    case "friends":
      _0x2df36a.Notify = "FriendsUpdateAll";
  }
  ToC(_0x2df36a);
}
function bodyResize(_0x2d7d85) {
  var _0x6ee3a = document.getElementById("messagesOverlay");
  var _0x34ad99 = document.getElementById("messagesTabContainer");
  _0x6ee3a.style.cssText = _0x6ee3a.style.cssText + "; left: " + _0x34ad99.offsetLeft + "px; top: " + _0x34ad99.offsetTop + "px; width: " + _0x34ad99.offsetWidth + "px; height: " + _0x34ad99.offsetHeight + "px;";
  document.getElementById("messagesSuperContainer").style.height = _0x34ad99.offsetHeight + "px";
  var _0x3b671f = document.getElementById("visitorsOverlay");
  var _0x33c03a = document.getElementById("visitorsTabContainer");
  if (Browser && ["MS", "FF"].indexOf(Browser) >= 0) {
    _0x33c03a.style.cssText = "height:91.1%!important";
  }
  var _0x411803 = _0x33c03a.offsetLeft;
  if (_0x411803 < 20) {
    _0x411803 = 0;
    for (var _0x2decb3 = _0x33c03a; _0x2decb3.offsetParent; _0x2decb3 = _0x2decb3.offsetParent) {
      _0x411803 += _0x2decb3.offsetLeft;
    }
  }
  var _0x3b4fb4 = document.getElementById("scroller");
  var _0x160e70 = document.getElementById("textEntryEditable");
  _0x3b4fb4.style.cssText = "; left: " + _0x160e70.offsetLeft + "px; top: " + _0x160e70.offsetTop + "px; width: " + _0x160e70.offsetWidth + "px; height: " + _0x160e70.offsetHeight + "px;";
  _0x3b4fb4.width = _0x160e70.offsetWidth + "px";
  _0x3b671f.style.cssText = _0x3b671f.style.cssText + "; left: " + _0x411803 + "px; top: " + _0x33c03a.offsetTop + "px; width: " + _0x33c03a.offsetWidth + "px; height: " + _0x33c03a.offsetHeight + "px;";
}
var LastBack;
var lastScroller;
var PcBacks = {};
function LoadBackground2(_0x372285, _0x2542ab) {
  _0x2542ab ||= PcBacks[0];
  if (_0x2542ab != LastBack) {
    LastBack = _0x2542ab;
    if (_0x2542ab && _0x2542ab != "transparent") {
      _0x372285.xImg = new Image();
      _0x372285.xCnt = 1000;
      new Date();
      _0x372285.xImg.onload = function (_0x2d2baa) {
        _0x372285.style.backgroundImage = "url(" + _0x372285.xImg.src + ")";
        new Date();
      };
      _0x372285.xImg.onerror = function (_0x437428) {
        new Date();
        if (!(_0x372285.xCnt >= 8000)) {
          setTimeout(function () {
            _0x372285.xImg.src = _0x2542ab;
          }, _0x372285.xCnt);
          _0x372285.xCnt *= 2;
        }
      };
      _0x372285.xImg.src = _0x2542ab;
    } else {
      _0x372285.style.background = "";
    }
  }
}
function placeCaretAt(_0x45f940, _0x38b78c = textEntry.childNodes[0]) {
  const _0x1028e1 = document.createRange();
  const _0x32116a = window.getSelection();
  if (!_0x38b78c) {
    (_0x38b78c = textEntry).focus();
  }
  _0x1028e1.setStart(_0x38b78c, _0x45f940);
  _0x1028e1.collapse(!0);
  _0x32116a.removeAllRanges();
  _0x32116a.addRange(_0x1028e1);
}
function placeCaretAtEnd(_0x98fdd5) {
  if (_0x98fdd5) {
    _0x98fdd5.focus();
    setTimeout(() => {
      if (window.getSelection !== undefined && document.createRange !== undefined) {
        var _0x1dd764 = document.createRange();
        var _0x4d2c89 = window.getSelection();
        _0x1dd764.selectNodeContents(_0x98fdd5);
        _0x1dd764.collapse(false);
        _0x4d2c89.removeAllRanges();
        _0x4d2c89.addRange(_0x1dd764);
      } else if (document.body.createTextRange !== undefined) {
        var _0x1dd764 = document.body.createTextRange();
        _0x1dd764.moveToElementText(_0x98fdd5);
        _0x1dd764.collapse(false);
        _0x1dd764.select();
      }
    }, 5);
  }
}
function pasteHtmlAtCaret(_0x2ac66f) {
  if (!document.execCommand("insertText", !1, _0x2ac66f) && typeof textEntry.setRangeText == "function") {
    const _0x175b7e = textEntry.selectionStart;
    textEntry.setRangeText(_0x2ac66f);
    textEntry.selectionStart = textEntry.selectionEnd = _0x175b7e + _0x2ac66f.length;
    const _0x419378 = document.createEvent("UIEvent");
    _0x419378.initEvent("input", !0, !1);
    textEntry.dispatchEvent(_0x419378);
  }
}
function newstuff(_0xc2f3cd) {
  var _0x258f22 = new Date(2021, 2, 17, 0, 0, 0, 0);
  var _0x4ea6e0 = new Date(2021, 3, 4, 0, 0, 0, 0);
  let _0x5457ef = document.getElementById("swPromo");
  let _0x2566a2 = document.getElementById("sideBar");
  let _0xbccdd2 = localStorage.getItem("swpromo");
  if (_0x258f22 <= _0xc2f3cd && _0xc2f3cd <= _0x4ea6e0) {
    _0x5457ef.style.cssText = "display: inline-flex !important";
    _0x2566a2.addEventListener("click", () => {
      _0x5457ef.style.cssText = "display: none !important";
      localStorage.setItem("swpromo", "1");
    });
    if (_0xbccdd2 && _0xbccdd2 == "1") {
      _0x5457ef.style.cssText = "display: none !important";
    }
  }
}
function setStuffAndListener() {
  let _0x192fe9 = document.getElementById("returnBut");
  addToolTip(_0x192fe9, ["box.4", "Send message"], {
    position: "low"
  });
  document.getElementById("defaultList").addEventListener("click", function (_0x7f064b) {
    openList(_0x7f064b, "visitors");
  });
  document.getElementById("friendsList").addEventListener("click", function (_0x18c7c4) {
    openList(_0x18c7c4, "friends");
  });
  let _0x52c077 = document.getElementById("groupBut");
  _0x52c077.addEventListener("click", function () {
    window.open("//xath.hu/#featured", "_blank");
  });
  addToolTip(_0x52c077, ["box.6", "Chat Groups"], {
    position: "low"
  });
  let _0x35aa6a = document.getElementById("helpBut");
  _0x35aa6a.addEventListener("click", function () {
    window.open("//xath.hu/help_", "_blank");
  });
  addToolTip(_0x35aa6a, ["box.7", "View help"], {
    position: "low"
  });
  setXatLogo();
  document.getElementById("GetaChat").addEventListener("click", function () {
    getAChatBoxPressed();
  });
  document.getElementById("signIn").addEventListener("click", function () {
    signInButtonPressed();
  });
  textEntry.addEventListener("keydown", _0x21156a => {
    const _0x5277cf = _0x21156a.key;
    let _0x59e060 = window.getSelection().getRangeAt(0);
    let _0x1740f0 = window.getSelection().toString();
    if (_0x21156a.ctrlKey && _0x1740f0.length > 2) {
      addMarkDown(_0x5277cf, _0x1740f0, _0x59e060);
    }
  });
  textEntry.addEventListener("contextmenu", _0x18aa55 => {
    textRange = window.getSelection().getRangeAt(0);
    textSelection = window.getSelection().toString();
    if (textSelection.length > 2) {
      _0x18aa55.preventDefault();
      toggleMenu(true);
      positionMenu(_0x18aa55);
    } else {
      textRange = null;
      textSelection = null;
      toggleMenu(false);
    }
  });
  document.addEventListener("click", () => {
    toggleMenu(!1);
  });
  window.onkeyup = () => {
    toggleMenu(!1);
  };
  window.addEventListener("keydown", _0x5f52a0 => {
    if (_0x5f52a0.key == "q" && _0x5f52a0.ctrlKey && !pressed) {
      let _0x13650a = window.getSelection().toString();
      let _0x3f6972 = window.getSelection().anchorNode.parentNode.className;
      let _0x47b1fe = window.getSelection().anchorNode.parentNode.parentElement?.parentElement;
      let _0x34dfde = _0x47b1fe && _0x47b1fe.dataset && _0x47b1fe.dataset.unique ? "#" + _0x47b1fe.dataset.unique : "";
      if (_0x13650a.length > 2 && (_0x3f6972 == "message" || _0x3f6972 == "msgLink")) {
        textEntry.innerHTML += ">" + _0x34dfde + "[" + replaceBrakets(_0x13650a.trim()) + "]";
      }
      pressed = !0;
    }
  });
  window.addEventListener("keyup", () => {
    pressed = !1;
  });
  document.getElementById("textEntryEditable").addEventListener("paste", function (_0x2d281d) {
    var _0x43959c;
    _0x2d281d.stopPropagation();
    _0x2d281d.preventDefault();
    _0x43959c = (_0x2d281d.clipboardData || window.clipboardData).getData("Text");
    const _0x5e4598 = reduceTextLength(_0x43959c);
    if (_0x5e4598.length > 0) {
      _0x43959c = _0x5e4598;
    }
    pasteHtmlAtCaret(_0x43959c = _0x43959c.replace("﻿", ""));
    textEntryCaretPos = getCaretWithin(textEntry);
  });
  textEntry.addEventListener("keydown", () => {
    textEntryCaretPos = getCaretWithin(textEntry);
  });
  textEntry.addEventListener("keyup", () => {
    textEntryCaretPos = getCaretWithin(textEntry);
  });
  textEntry.addEventListener("input", _0x58549b => {
    const _0x1fc019 = _0x58549b?.inputType ?? "";
    if (_0x1fc019 && ["formatBold", "formatItalic"].indexOf(_0x1fc019) >= 0) {
      textEntry.innerHTML = _0x58549b.target.innerText;
    }
    textEntryCaretPos = getCaretWithin(textEntry);
  });
  textEntry.addEventListener("click", () => {
    textEntryCaretPos = getCaretWithin(textEntry);
  });
}
function setXatLogo() {
  let _0x53da5f = document.getElementById("xatBut");
  _0x53da5f.addEventListener("click", () => {
    window.open("//xath.hu", "_blank");
  });
  if (isXatBirthday()) {
    const _0x4925d9 = ["anni1", "anni2", "anni3", "anni4", "anni5", "anni6", "anni7", "anni8", "anni9", "anni10", "anni11", "anni12"];
    const _0x4866d4 = "https://xath.hu/images/logo/" + _0x4925d9[Math.floor(Math.random() * _0x4925d9.length)] + ".png";
    if (_0x53da5f) {
      _0x53da5f.style.backgroundImage = "url('" + _0x4866d4 + "')";
    }
  } else {
    addToolTip(_0x53da5f, ["mob1.homepage", "Homepage"], {
      position: "low"
    });
  }
}
async function requestStorageAccessForEmbed() {
  const _0x33ba2f = _Activity.instance;
  _0x33ba2f.returnPermissionForStorageAccess().then(_0x33d33e => {
    if (_0x33ba2f.TRIGGERED_PERMISSIONS.includes(_0x33d33e)) {
      setTimeout(() => {
        customModalWithMsg("", "", true, false, true);
        var _0x2b6156 = document.querySelector(".NewdialogBody");
        var _0x5914e9 = document.querySelector("#wrapper");
        if (!_0x2b6156 || !_0x5914e9) {
          return;
        }
        _0x5914e9.classList.remove("wrapper");
        var _0x2a3983 = GetTranslation("mob2.requestaccess");
        _0x2a3983 ||= "Request access";
        var _0xc11510 = GetTranslation("mob2.requestaccessmessage");
        _0xc11510 ||= "You are on an embedded chat. For xat to work properly, please allow access to the storage on the browser. <span style=\"font-weight:bold\">After accepting, you must refresh the page.</span>";
        _0x5914e9.innerHTML += "\n                        <div style=\"margin-top: .5rem; padding:9px; text-align: center;\">\n                            <p>" + _0xc11510 + "</p>\n                            <div class=\"butcontainer previewBut centered\" style=\"margin-top: 1rem\">\n                                <div class=\"butlayout\" id=\"acceptButton\">" + _0x2a3983 + "</div>\n                            </div>\n                        </div>\n                    ";
        var _0x3e4063 = document.querySelector("#acceptButton");
        _0x3e4063?.addEventListener("click", async () => {
          await _0x33ba2f.requestStorageAccessApi();
          document.querySelector("#id_ModalClose_custom")?.click();
        });
      }, 1000);
    }
  }).catch(_0x314cbf => console.error(_0x314cbf));
}
this.setScroller = function (_0x11f09d) {
  if (lastScroller == _0x11f09d) {
    return;
  }
  var _0x172f99 = clearDiv("scrollText");
  lastScroller = _0x11f09d;
  if (!_0x11f09d) {
    return;
  }
  let _0x22069b = "";
  let _0x172634 = _0x11f09d;
  let _0x2b38ad = _0x11f09d.match(/#([0-9a-fA-F]{6}|[0-9a-fA-F]{3})(?![0-9a-fA-F])/);
  if (_0x2b38ad) {
    let _0x4b44b9 = _0x2b38ad.index;
    _0x172634 = _0x11f09d.slice(0, _0x4b44b9).trim();
    _0x22069b = _0x2b38ad[0];
    _0x172f99.setAttribute("data-has-color", "1");
  } else {
    _0x172f99.removeAttribute("data-has-color");
  }
  let _0x5b698c = _0x172634.split(" ");
  let _0xb66017 = [];
  let _0xc5f674 = hasDarkMode() && !_0x22069b ? "darkScroll" : "";
  let _0x141d0a = _0x22069b ? "color:" + _0x22069b + "; " : "";
  for (let _0x26f282 = 0; _0x26f282 < _0x5b698c.length; _0x26f282++) {
    let _0x13c231 = WordIsLink(_0x5b698c[_0x26f282], undefined, !0);
    if (_0x13c231) {
      if (typeof _0x13c231 == "object") {
        _0x13c231 = _0x13c231.l;
      }
      _0xb66017.push("<a href=\"" + LinkValidator(null, _0x13c231, true) + "\" target=\"blank\" class=\"scrollurl " + _0xc5f674 + "\" style=\"" + _0x141d0a + "text-decoration: underline;\">" + _0x5b698c[_0x26f282] + "</a>");
    } else {
      _0xb66017.push(_0x5b698c[_0x26f282]);
    }
  }
  _0x172f99.innerHTML = _0xb66017.join(" ");
  if (hasDarkMode() && !_0x22069b) {
    _0x172f99.classList.add("darkScroll");
  } else {
    _0x172f99.classList.remove("darkScroll");
  }
  var _0x53c594;
  var _0x5594cd;
  var _0x14ec95;
  var _0x150f0c;
  var _0x4dd7b1 = document.getElementById("scrollText").offsetWidth;
  var _0x313420 = document.getElementById("scroller").offsetWidth;
  if (_0x4dd7b1 >= _0x313420) {
    _0x53c594 = Math.round(Math.min(_0x4dd7b1, 728) / 7);
    _0x5594cd = _0x14ec95 = Math.round(-_0x4dd7b1);
    _0x150f0c = "infinite";
  } else {
    var _0x1ef10d = (_0x313420 - Math.max(_0x4dd7b1, 200)) / 2;
    _0x53c594 = Math.round(_0x1ef10d / 7);
    _0x5594cd = _0x14ec95 = (_0x313420 - _0x4dd7b1) / 2;
    _0x150f0c = 1;
  }
  let _0x5a4f77 = "scrollKeyframes_" + Math.random().toString(36).substr(2, 3);
  _0x172f99.style.cssText = _0x141d0a + "transform: translateX(" + _0x5594cd + "px); animation: " + _0x5a4f77 + " " + _0x53c594 + "s linear " + _0x150f0c + "; transform: translateX(" + _0x5594cd + "px);";
  let _0x4fe936 = "@keyframes " + _0x5a4f77 + " { 0% { transform: translateX(" + _0x313420 + "px); } 100% { transform: translateX(" + _0x14ec95 + "px); } }";
  document.styleSheets[0].insertRule(_0x4fe936, 0);
  _0x172f99.style.animation = "none";
  window.requestAnimationFrame(() => {
    _0x172f99.style.animation = _0x5a4f77 + " " + _0x53c594 + "s linear " + _0x150f0c;
  });
};
document.body.onresize = bodyResize;
newstuff(new Date());
(() => {
  const _0x224961 = () => document.querySelector(".textentry")?.textContent.trim() === "";
  let _0x5144bf = null;
  document.addEventListener("keydown", _0x578966 => {
    if (_Activity.instance.QuickBar.sidebarOpened) {
      return;
    }
    if (_0x578966.shiftKey || !_0x224961() || document.activeElement.tagName === "INPUT" || document.activeElement.tagName === "TEXTAREA") {
      return;
    }
    if (window.isRinging !== undefined && window.isRinging) {
      return;
    }
    const {
      key: _0x5b4ab9
    } = _0x578966;
    if (_0x5b4ab9 === "ArrowRight" || _0x5b4ab9 === "ArrowLeft") {
      if (messages.editMode) {
        return;
      }
      _0x578966.preventDefault();
      _0x5144bf = _0x5b4ab9;
    } else if (_0x5b4ab9 === "Escape" && _Activity.CurrentChat.includes("_")) {
      if (messages.editMode) {
        return;
      }
      _Activity.SendC("xatCommand", "", JSON.stringify({
        ChatId: _Activity.CurrentChat,
        Command: "Click",
        DeleteId: _Activity.CurrentChat,
        Next: "1",
        Type: "Click"
      }));
      document.querySelector("#FrameDialogCloseBut").click();
      navigate(-1);
    } else if (_0x5b4ab9 === "ArrowUp" && typeof messages != "undefined") {
      messages.handleEditShortCut();
    }
  });
  document.addEventListener("keyup", _0x56793d => {
    if (messages.editMode) {
      return;
    }
    if (_0x56793d.shiftKey || !_0x224961() || document.activeElement.tagName === "INPUT" || document.activeElement.tagName === "TEXTAREA") {
      return;
    }
    if (window.isRinging !== undefined && window.isRinging) {
      return;
    }
    const {
      key: _0x349360
    } = _0x56793d;
    if (_0x349360 === _0x5144bf) {
      if (_0x349360 === "ArrowRight") {
        navigate(1);
      } else if (_0x349360 === "ArrowLeft") {
        navigate(-1);
      }
      _0x5144bf = null;
    }
  });
})();