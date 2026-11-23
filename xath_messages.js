"use strict";
var messages = new function () {
  var _0x45b78b;
  var _0x4db39c;
  var _0x5aa89c = this;
  var _0x3c1f39 = 0;
  var _0x2a1bba = document.getElementById("messagesContainer");
  var _0x556085 = document.getElementById("messagesSuperContainer");
  let _0xcd4fdc = 0;
  var _0x1b96ee = 0;
  var _0x180ea1 = 0;
  var _0x5a328a = 1;
  var _0x1206a0 = null;
  var _0x5ca1ad = [];
  var _0x421be0 = null;
  var _0x2b2f32 = null;
  var _0x12ba10 = "";
  var _0x394147 = "";
  var _0x71d952 = null;
  var _0x4ea2b2 = findNodeInWindowOrParent(".autocomplete");
  var _0x547b9a;
  function _0x4673b5() {
    if (_0x180ea1 > 1) {
      _0x180ea1 = 2;
    }
  }
  function _0x23c955() {
    if (_0x180ea1 == 1) {
      messages?.sendMessage("/RTypeOn");
    }
    _0x180ea1 = 10;
  }
  this.MessagesIntersectionObserverCallback = (_0x15ed33, _0x1a57c9) => {
    const _0x2f1c6b = _0x15ed33.length;
    for (let _0x21bd43 = 0; _0x21bd43 < _0x2f1c6b; _0x21bd43++) {
      const _0x916346 = _0x15ed33[_0x21bd43];
      const _0xe47452 = _0x916346.target;
      if (_0x916346.isIntersecting) {
        _0xe47452.classList.remove("invisible");
      } else {
        _0xe47452.classList.add("invisible");
      }
    }
  };
  this.MessagesIntersectionObserver = new IntersectionObserver(this.MessagesIntersectionObserverCallback, {
    root: _0x2a1bba,
    rootMargin: "160px",
    threshold: 0
  });
  this.setChatName = function (_0x2c5ec7, _0x10afd2) {
    var _0x245a70 = document.getElementById("TitleBarTitle");
    if (_0x245a70) {
      changeText(_0x245a70, _0x2c5ec7);
    }
    if (_0x3c1f39 = _0x10afd2) {
      setTextNode("TitleBarRight", "");
    }
    if (_0x2c5ec7 && _0x2c5ec7.indexOf("[mob2.notifications,Notifications]") >= 0) {
      messages.resetFooter("none");
    }
  };
  this.GetXconst = GetXconst;
  this.sendApp = function (_0x263666, _0x519a12) {
    if (typeof _0x519a12 == "string" && _0x519a12.charAt(0) == "{") {
      _0x519a12 = JSON.parse(_0x519a12);
    } else {
      var _0x3628e4 = xInt(_0x519a12);
      if (_0x3628e4 && _0x263666 == "rapid") {
        _0x519a12 = {
          UserNo: _0x3628e4,
          Page: "visitors",
          Command: "DoRapid"
        };
        ToC(_0x519a12);
        return;
      }
    }
    if (_0x519a12 !== null && typeof _0x519a12 == "object") {
      switch (_0x519a12.Type) {
        case "swipeleft":
          _0x519a12.Next = _0x3c1f39 ? "actions" : "visitors";
          _0x519a12.UserNo = _0x3c1f39;
          messages.resetFooter();
          document.getElementById("textEntryEditable").blur();
          _Activity.instance.CurrentChatC = null;
          break;
        case "swiperight":
          _0x519a12.Next = "chats";
          document.getElementById("textEntryEditable").blur();
          break;
        case "isms":
        case "iemail":
        case "DeleteMsg":
          _0x519a12.Command = _0x519a12.Type;
          break;
        default:
          return;
      }
      _0x519a12.Page = "messages";
    } else {
      var _0x2aa834 = _0x519a12;
      if (_0x2aa834 == 0) {
        return;
      }
      if (messages.Classic && config.MyId <= 2) {
        _0x519a12 = {
          Command: "MakeId"
        };
      } else {
        _0x519a12 = {
          Type: "",
          UserNo: _0x519a12,
          Page: "messages",
          Next: "actions",
          Command: "SaveId"
        };
        if (_0x2aa834 == config.MyId) {
          _0x519a12.Next = "profile";
        }
        if (_0x2aa834 < 0) {
          delete _0x519a12.Next;
        }
        if (_0x2aa834 >= 0) {
          classicSetDialog(_0x519a12.Next, _0x2aa834);
          return;
        }
      }
    }
    ToC(_0x519a12);
  };
  this.resetFooter = _0x39f8cf => {
    if (_Activity.instance.IsClassic) {
      return;
    }
    let _0x22f6fd = document.querySelector("#footer");
    if (_0x22f6fd) {
      if (_0x39f8cf || _0x22f6fd.style.display != "none") {
        _0x22f6fd.style.display = _0x39f8cf;
        return;
      } else {
        _0x22f6fd.style.display = "";
        _0x556085.style.bottom = _0x22f6fd.clientHeight + "px";
        return;
      }
    } else {
      return undefined;
    }
  };
  this.main = function (_0x441aea) {
    xatMain(_0x441aea);
    _Activity.instance.Reactions = [];
    _0x12ba10 = JSON.parse(_0x441aea).roomid;
    if (_Activity.instance.UserSettings?.textDirection == "enable") {
      document.getElementById("textEntryEditable").style.direction = "rtl";
    } else {
      document.getElementById("textEntryEditable").style.direction = "ltr";
    }
    this.setTypingOff();
    if (userFlags & NamePowers.away && userFlags & NamePowers.hasdays) {
      _0x1b96ee = 1;
    }
    if (userFlags & NamePowers.typing) {
      _0x180ea1 = 1;
    }
    messages.resetFooter();
    if (_0x547b9a) {
      return;
    }
    _0x547b9a = !0;
    const _0x3699fd = _Activity.instance.GetParameterByName("gotPurchase", parent.parent.location.href);
    function _0x3e8b5f() {
      const _0x253f8f = document.querySelector("#reactionsSelector");
      const _0x20f100 = _0x253f8f.querySelector("[data-target=\"reactions\"]");
      (function () {
        const _0x2a9e71 = document.getElementById("searchSmilies");
        const _0x26da91 = document.querySelector("#reactionsSelector");
        const _0x198788 = _0x26da91.querySelectorAll("#smiliesAll .box");
        if (_0x2a9e71 && _0x2a9e71.value !== "") {
          _0x2a9e71.value = "";
          _0x198788.forEach(_0x2c2b6e => {
            if (!_0x2c2b6e.classList.contains("flix")) {
              _0x2c2b6e.style.display = "flex";
            }
          });
        }
      })();
      _0x253f8f.scrollTop = 0;
      _0x253f8f.classList.add("closed");
      _0x20f100.style.display = "block";
      _0x20f100.click();
    }
    function _0xb76b5b(_0x15dad0) {
      const _0x27d39c = _0x15dad0 ?? localStorage.getItem("recentReactions")?.split(",") ?? [];
      const _0xf67d62 = document.querySelector("#reactionsSelector #recent");
      _0xf67d62.innerHTML = "";
      if (_0x27d39c.length) {
        _0xf67d62.style.display = "flex";
        document.querySelector("#reactionsSelector .title").style.display = "flex";
        document.querySelectorAll("#reactionsSelector .title")[1].style.display = "flex";
        _0x27d39c.forEach(_0x8275ec => {
          _Activity.instance.Smilies.MakeSmiley(makeElement(_0xf67d62, "div", "box"), _0x8275ec, {
            size: 20,
            tooltipPosition: "low",
            callback: () => {
              ToC({
                Command: "DoReaction",
                Reaction: _0x8275ec,
                MsgId: _0x1206a0,
                reactionId: Math.random().toString(36).substr(2, 9)
              }, true);
              _0x3e8b5f();
              _0x1206a0 = null;
            }
          });
        });
      } else {
        _0xf67d62.style.display = "none";
        document.querySelector("#reactionsSelector .title").style.display = "none";
        document.querySelectorAll("#reactionsSelector .title")[1].style.display = "none";
      }
    }
    if ((_Activity.instance.IsAndroidApp || _Activity.instance.IsIOSApp) && _0x3699fd) {
      setTimeout(() => {
        ToC({
          Command: "GotPurchase"
        });
      }, 3000);
    }
    if (localStorage.getItem("xatLive.pendingCall") === "true") {
      localStorage.removeItem("xatLive.pendingCall");
      setTimeout(() => {
        parent.handleLiveApp(false, true);
      }, 750);
    }
    if (!_Activity.instance.IsClassic && !_Activity.instance.MyId) {
      _Activity.instance.Selector.DoLoginEtc("SignUp");
    }
    if (_Activity.instance.CurrentChatC && _Activity.instance.CurrentChatC == 10 && !_Activity.instance.IsClassic) {
      messages.resetFooter("none");
      setTimeout(() => {
        let _0x225674 = document.querySelector("#messages");
        if (_0x225674 && !_0x225674.hasChildNodes()) {
          let _0x3e31bd = GetTranslation("mob2.nonotifs");
          _0x3e31bd ||= "You have no notifications yet.";
          this.sendHelpMsg(0, _0x3e31bd);
        }
      }, 200);
    }
    const _0x240a8b = localStorage.getItem("recentReactions")?.split(",") ?? [];
    const _0x3ef615 = "smile,biggrin".split(",");
    const _0x56a441 = document.querySelector("#reactionsSelector");
    const _0x4508f6 = _0x56a441.querySelector("#all");
    _0x56a441.querySelectorAll("[data-target]").forEach(_0x24849e => {
      _0x24849e.addEventListener("click", _0x4355ea => {
        const _0x3eff9c = _0x56a441.querySelector("li.active");
        const _0x3715db = _0x56a441.querySelector("[data-tab=\"" + _0x24849e.dataset.target + "\"]");
        const _0x4a1ac2 = _0x56a441.querySelector("[data-tab=\"" + _0x3eff9c.dataset.target + "\"]");
        if (_0x24849e != _0x3eff9c) {
          _0x24849e.className = "active";
          _0x3eff9c.className = "";
          _0x3715db.className = "";
          _0x4a1ac2.className = "hidden";
        }
      });
    });
    _0xb76b5b();
    document.addEventListener("click", _0x2c16c4 => {
      messages.toggleMsgMenu(!1);
      if (_0x56a441.className) {
        return;
      }
      let _0x99708c = !1;
      let _0x45b5a3 = _0x2c16c4.target;
      do {
        if (_0x45b5a3 == _0x56a441) {
          _0x99708c = !0;
          break;
        }
        _0x45b5a3 = _0x45b5a3.parentNode;
      } while (_0x45b5a3);
      if (!_0x99708c) {
        _0x3e8b5f();
      }
    });
    _0x3ef615.forEach(_0x558b12 => {
      _Activity.instance.Smilies.MakeSmiley(makeElement(_0x4508f6, "div", "box"), _0x558b12, {
        size: 20,
        tooltipPosition: "low",
        callback: () => {
          ToC({
            Command: "DoReaction",
            Reaction: _0x558b12,
            MsgId: _0x1206a0,
            reactionId: Math.random().toString(36).substr(2, 9)
          }, !0);
          if (_0x240a8b.length >= 6 && !_0x240a8b.includes(_0x558b12)) {
            _0x240a8b.shift();
          }
          if (!_0x240a8b.includes(_0x558b12)) {
            _0x240a8b.push(_0x558b12);
          }
          _0xb76b5b(_0x240a8b);
          if (_Activity.instance.IsClassic || !_Activity.instance.IsClassic && localStorage.getItem("mobCookies") == 1) {
            localStorage.setItem("recentReactions", _0x240a8b.join(","));
          }
          _0x3e8b5f();
          _0x1206a0 = null;
        }
      });
    });
    const _0x45de76 = document.querySelectorAll("[data-msgItem]");
    const _0x24152 = document.getElementById("textEntryEditable");
    const _0x4edaa2 = _0x56a441.querySelector("[data-tab=\"reacted\"]");
    const _0x5c023 = _0x56a441.querySelector("[data-target=\"reacted\"]");
    const _0x251a1e = _0x56a441.querySelector("[data-target=\"reactions\"]");
    function _0x181eed(_0x137c5e) {
      if (_0x4a08c7 && _0x4a08c7 !== _0x3d39c4.innerHTML) {
        _0x4a08c7 = _0x3d39c4.innerHTML;
        if (_0x4a08c7.indexOf("<br>") > -1) {
          _0xcd4fdc = 0;
          messages?.sendMessage(_0x3d39c4.textContent.replace(/\s/g, " "));
          if (!messages.editMode) {
            _0x2b2f32 = null;
          }
          _0x3d39c4.textContent = "";
          _0x4a08c7 = "";
          if (userFlags & NamePowers.typing) {
            _0x4673b5();
          }
        } else if (userFlags & NamePowers.typing) {
          _0x23c955();
        }
      }
      if (_0x137c5e.type === "blur") {
        _0xcd4fdc = 0;
        if (userFlags & NamePowers.typing) {
          _0x4673b5();
        }
      }
    }
    let _0x4a08c7;
    _0x45de76.forEach(_0x17edc6 => {
      _0x17edc6.addEventListener("click", _0x224d37 => {
        switch (_0x224d37.target.dataset.msgitem) {
          case "edit":
            const _0x4dd768 = {
              msgId: _0x421be0.msgId,
              message: _0x421be0.text,
              node: _0x421be0.li
            };
            if (_0x45b78b) {
              this.setupEditBlock(_0x4dd768);
            } else {
              _0x394147 = _0x12ba10;
              _0x2b2f32 = _0x421be0.msgId;
              _0x24152.innerText = _0x421be0.text;
            }
            break;
          case "translate":
            const _0x196ade = _0x421be0.p;
            const _0x4062ad = _0x421be0.pt;
            const _0x944f30 = _0x421be0.li;
            const _0x32f4ac = _0x421be0.transPt;
            if (_0x32f4ac.innerHTML && _0x32f4ac.innerHTML.length > 0) {
              _0x4062ad.style.display = "";
              _0x196ade.style.display = "none";
              _0x944f30.alreadyTranslated = !0;
            } else {
              const _0x51116f = _0x421be0.id;
              const _0x1e9900 = 2 + xInt(_0x421be0.Big);
              const _0x5b13c9 = _0x421be0.registered;
              (function (_0x2d9234, _0x1e9323) {
                if (!_0x2d9234) {
                  return;
                }
                if (_0x2d9234.substr(0, 2) == "❯#") {
                  _0x2d9234 = _0x2d9234.replace(/❯.*\[.*?\]/g, "");
                }
                _0x2d9234 = _0x2d9234.replace(/&apos;/gi, "'");
                let _0x3a69d1 = localStorage.getItem("todo");
                _0x3a69d1 &&= JSON.parse(_0x3a69d1);
                if (!_0x3a69d1 || !_0x3a69d1.w_d1) {
                  return;
                }
                const _0x3a9ec4 = {
                  q: StripSmilies(_0x2d9234),
                  u: config.MyId,
                  deviceId: _0x3a69d1.DeviceId,
                  passHash: _0x3a69d1.PassHash
                };
                const _0x546aa7 = (_Activity.instance.UserSettings.language != "default" ? _Activity.instance.UserSettings.language : _Activity.instance.UserSettings.yourLang) || "en";
                fetch(xatdomain + "/web_gear/chat/translate3.php?target=" + _0x546aa7, {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/x-www-form-urlencoded"
                  },
                  body: "json=" + JSON.stringify(_0x3a9ec4)
                }).then(_0x8a958c => _0x8a958c.text()).then(_0x4c70f => {
                  let _0x23a69d = null;
                  try {
                    if ((_0x4c70f = JSON.parse(_0x4c70f)) && (_0x4c70f.text || _0x4c70f.err)) {
                      _0x23a69d = _0x4c70f.err ? _0x4c70f.err : _0x4c70f.text.replace(/&#39;/g, "'").replace(/&quot;/g, "\"").replace(/&lt;priv&gt;/g, "");
                    }
                  } catch (_0x317198) {
                    _0x23a69d = null;
                  }
                  _0x1e9323(_0x23a69d);
                });
              })(_0x421be0.text, _0x837fdb => {
                if (_0x837fdb) {
                  createTextSm(_0x32f4ac, _0x837fdb, {
                    flags: _0x1e9900,
                    userId: _0x51116f,
                    userName: _0x5b13c9,
                    className: "translateMessage"
                  });
                  _0x4062ad.style.display = "";
                  _0x196ade.style.display = "none";
                  _0x944f30.alreadyTranslated = true;
                }
              });
            }
            break;
          case "quote":
            const _0x1d595a = replaceBrakets(_0x421be0.text);
            const _0x1b52c9 = ">" + (_0x421be0.msgId ? "#" + _0x421be0.msgId : "") + "[" + _0x1d595a.trim() + "]";
            if (_0x1b52c9.length + _0x24152.innerHTML.length <= 256) {
              _0x24152.innerText += _0x1b52c9;
              _0x24152.focus();
              document.execCommand("selectAll", false, null);
              document.getSelection().collapseToEnd();
            }
            break;
          case "react":
            if (REACTIONS === null) {
              GetXconsts("messages", ["reactions"]);
            }
            _0x56a441.classList.remove("closed");
            if (_0x421be0.id != _Activity.instance.MyId && config.MyRegName) {
              _0x251a1e.click();
              _0x251a1e.style.display = "block";
            } else {
              _0x5c023.click();
              _0x251a1e.style.display = "none";
            }
            const _0x116a49 = _0x56a441.offsetWidth;
            const _0x4d5599 = _0x56a441.offsetHeight;
            let _0xd2cde8 = event.clientY - 15 < 15 ? 15 : event.clientY + _0x4d5599 + 15 >= window.innerHeight ? event.clientY - (_0x4d5599 + 15) : event.clientY;
            let _0xc95ffe = event.clientX - 15 < 15 ? 15 : event.clientX + _0x116a49 + 15 >= window.innerWidth ? event.clientX - (_0x116a49 + 15) : event.clientX;
            if (window.innerWidth < 486) {
              _0xc95ffe = Math.max(_0xc95ffe, 15);
            }
            if (!_0x45b78b) {
              _0xc95ffe = (window.innerWidth - _0x116a49) / 2;
              _0xd2cde8 = (window.innerHeight - _0x4d5599) / 2;
            }
            _0x56a441.style.top = _0xd2cde8 + "px";
            _0x56a441.style.left = _0xc95ffe + "px";
            _0x4edaa2.innerHTML = "";
            const _0x3a0846 = _Activity.instance.Reactions.filter(_0x55b8d5 => _0x55b8d5.msgId == _0x421be0?.msgId).sort((_0x19e4b2, _0x350423) => _0x350423.time - _0x19e4b2.time);
            if (_0x3a0846.length) {
              _0x3a0846.forEach(_0x16012b => {
                const _0x543680 = makeElement(_0x4edaa2, "div", "reacted");
                _0x543680.innerHTML = _0x16012b.userName + " <br> (" + _0x16012b.userId + ")";
                _Activity.instance.Smilies.MakeSmiley(makeElement(_0x543680, "div", "box"), _0x16012b.reaction, {
                  size: 20,
                  tooltipPosition: "low"
                });
                addToolTip(_0x543680, GetTimeToGo(xInt(_0x16012b.time) * 1000), {
                  position: "low",
                  shortTime: !0,
                  timestamp: xInt(_0x16012b.time) * 1000
                });
              });
            } else {
              const _0x2b5d65 = makeElement(_0x4edaa2, "span", "title");
              addText(_0x2b5d65, ["mob2.noReactions", "No reactions yet"]);
            }
            break;
          case "delete":
            _0x44cc07(_0x421be0.i);
            messages.sendApp(0, {
              Type: "DeleteMsg",
              Num: _0x421be0.canDelete
            });
            break;
          case "copy":
            const _0x32a192 = cleanXatTagsIcons(_0x421be0.text ?? "");
            copyToClipboard(_0x32a192.replace("﻿", ""));
            break;
          case "copyLink":
            copyToClipboard(_0x421be0.message);
            break;
          case "copySmiley":
            copyToClipboard("(" + _0x421be0.isSmiley + ")");
        }
        messages.toggleMsgMenu(!1);
        _0x224d37.stopPropagation();
      });
    });
    document.querySelector(".sendMsg").addEventListener("click", () => {
      (function () {
        var _0x46705f = document.getElementById("textEntryEditable");
        let _0x57a278 = document.getElementById("pmWrapper");
        if (_0x57a278 && _0x57a278.innerHTML && _0x46705f.textContent.length == 0) {
          setPmMode(false, null, null, document);
        }
        if (_0x57a278 && _0x57a278.innerHTML) {
          sendPm(_0x57a278.dataset.userno, _0x46705f.textContent.replace(/\s/g, " "));
          setPmMode(false, null, null, document);
        } else {
          messages?.sendMessage(_0x46705f.textContent.replace(/\s/g, " "), !_Activity.instance.Classic && _0x2b2f32 !== null);
          _0xcd4fdc = 0;
        }
        if (!messages.editMode) {
          _0x2b2f32 = null;
        }
        _0x46705f.textContent = "";
        if (_0x45b78b) {
          textEntryCaretPos = 0;
        }
        if (!_0x45b78b) {
          _0x46705f.focus();
        }
      })();
    });
    GetXconsts("messages");
    document.body.addEventListener("mouseenter", () => {
      messages.turnOffAwayOrFail();
      _0x1b96ee = 1;
    });
    _0x45b78b = config.Flags & 1;
    addTitleBar("\xA0", [["", "❮ "], ["mob1.chats", "Chats"]], _0x1d353b, ["mob1.visitors", "Visitors"], _0x38e8cb, null, null, null, !0, !0);
    if (!_0x45b78b) {
      AddHammer(document.body, 0, messages.sendApp);
    }
    var _0x3d39c4 = document.getElementById("textEntryEditable");
    _0x3d39c4.addEventListener("keyup", this.doAutoComplete);
    let _0x30ba56 = "";
    if (isWEB && Browser == "MS") {
      _0x3d39c4.addEventListener("focus", function (_0x39392f) {
        _0x4a08c7 = _0x3d39c4.innerHTML;
      }, false);
      _0x3d39c4.addEventListener("blur", _0x181eed, false);
      _0x3d39c4.addEventListener("keyup", _0x181eed, false);
      _0x3d39c4.addEventListener("paste", _0x181eed, false);
      _0x3d39c4.addEventListener("input", _0x181eed, false);
    } else {
      _0x3d39c4.addEventListener("paste", _0xffacdc => {
        const _0x437818 = reduceTextLength(_0x3d39c4.textContent);
        if (_0x437818.length > 0) {
          _0x3d39c4.textContent = _0x437818;
        }
        _0x30ba56 = _0x3d39c4.textContent;
      });
      _0x3d39c4.addEventListener("keydown", _0x515726 => {
        if (_0x515726.which == 13 || _0x515726.keyCode == 13) {
          _0x515726.preventDefault();
          let _0x6ef945 = document.getElementById("pmWrapper");
          if (_0x6ef945 && _0x6ef945.innerHTML && _0x3d39c4.textContent.length == 0) {
            setPmMode(false, null, null, document);
          }
          if (_0x6ef945 && _0x6ef945.innerHTML) {
            sendPm(_0x6ef945.dataset.userno, _0x3d39c4.textContent.replace(/\s/g, " "));
            setPmMode(false, null, null, document);
            _0xcd4fdc = 0;
          } else {
            let _0x44c09a = _0x3d39c4.textContent.replace(/\s/g, " ");
            if (_0x44c09a.substring(0, 5).toLowerCase() == "/away") {
              _Activity.instance.IsAway = true;
            }
            messages?.sendMessage(_0x44c09a, !_Activity.instance.IsClassic && _0x2b2f32 !== null);
            _0xcd4fdc = 0;
            if (!messages.editMode) {
              _0x2b2f32 = null;
            }
          }
          _0x3d39c4.textContent = "";
          _0x30ba56 = "";
          _0x4673b5();
        } else {
          handleMaxLength(_0x515726, _0x3d39c4);
          if (userFlags & NamePowers.typing) {
            _0x23c955();
          }
          _0x30ba56 = _0x3d39c4.textContent;
          messages.turnOffAwayOrFail();
          _0x1b96ee = 1;
        }
        let _0x3e229d = document.getElementById("textEntryEditable").getBoundingClientRect().width;
        let _0x35f0d4 = getTextWidth(document.getElementById("textEntryEditable").innerHTML, "bold 15px arial");
        if (document.getElementById("scroller")) {
          document.getElementById("scroller").style.display = _0x35f0d4 / _0x3e229d >= 3 ? "none" : "block";
        }
      }, false);
      _0x3d39c4.addEventListener("blur", function (_0x5e2c30) {
        _0xcd4fdc = 0;
        if (userFlags & NamePowers.typing) {
          _0x4673b5();
        }
      }, false);
    }
    document.body.style.display = "block";
    _0x2a1bba.onscroll = _0x22b4de => {
      _0xcd4fdc = _0x2a1bba.scrollTop + 40 >= _0x2a1bba.scrollHeight - _0x2a1bba.offsetHeight ? 0 : _Activity.instance.TickFPS * 5;
    };
    if (_0x45b78b) {
      _0x556085.style.top = "0px";
    } else {
      _0x556085.style.top = document.getElementById("titleBar").clientHeight + "px";
      _0x556085.style.bottom = document.getElementById("footer").clientHeight + "px";
      document.getElementById("openSmilies").onclick = function () {
        messages.clickSmilieOpen();
      };
    }
    _0x556085.clientWidth;
    TranslateAll();
  };
  this.setUpReactionsSelector = () => {
    function _0x4dcf5f() {
      const _0x520a81 = document.querySelector("#reactionsSelector");
      const _0x4ada94 = _0x520a81.querySelector("[data-target=\"reactions\"]");
      (function () {
        const _0x4db3c8 = document.getElementById("searchSmilies");
        const _0x39b837 = document.querySelector("#reactionsSelector");
        const _0x3f16c9 = _0x39b837.querySelectorAll("#smiliesAll .box");
        if (_0x4db3c8 && _0x4db3c8.value !== "") {
          _0x4db3c8.value = "";
          _0x3f16c9.forEach(_0x24136d => {
            if (!_0x24136d.classList.contains("flix")) {
              _0x24136d.style.display = "flex";
            }
          });
        }
      })();
      _0x520a81.scrollTop = 0;
      _0x520a81.classList.add("closed");
      _0x4ada94.style.display = "block";
      _0x4ada94.click();
    }
    function _0x253399(_0x49be4a) {
      const _0x472289 = _0x49be4a ?? localStorage.getItem("recentReactions")?.split(",") ?? [];
      const _0x46e593 = document.querySelector("#reactionsSelector #recent");
      _0x46e593.innerHTML = "";
      if (_0x472289.length) {
        _0x46e593.style.display = "flex";
        document.querySelector("#reactionsSelector .title").style.display = "flex";
        document.querySelectorAll("#reactionsSelector .title")[1].style.display = "flex";
        _0x472289.forEach(_0x419b5a => {
          _Activity.instance.Smilies.MakeSmiley(makeElement(_0x46e593, "div", "box"), _0x419b5a, {
            size: 20,
            scrollParent: _0x2f8617,
            tooltipPosition: "low",
            callback: () => {
              ToC({
                Command: "DoReaction",
                Reaction: _0x419b5a,
                MsgId: _0x1206a0,
                reactionId: Math.random().toString(36).substr(2, 9)
              }, true);
              _0x4dcf5f();
              _0x1206a0 = null;
            }
          });
        });
      } else {
        _0x46e593.style.display = "none";
        document.querySelector("#reactionsSelector .title").style.display = "none";
        document.querySelectorAll("#reactionsSelector .title")[1].style.display = "none";
      }
    }
    _0x5ca1ad = [];
    const _0x4cc10d = localStorage.getItem("recentReactions")?.split(",") ?? [];
    const _0x2f8617 = document.querySelector("#reactionsSelector");
    const _0x1f8b88 = _0x2f8617.querySelector("#smiliesAll");
    const _0x5a200a = _0x2f8617.querySelectorAll("[data-target]");
    const _0x165eb9 = document.getElementById("searchSmilies");
    if (_0x165eb9) {
      _0x165eb9.addEventListener("input", function () {
        const _0x4a5f6a = this.value.toLowerCase();
        _0x1f8b88.querySelectorAll(".box").forEach(_0x11d8ef => {
          const _0x588ce1 = _0x11d8ef.querySelector("span").getAttribute("data-sm")?.toLowerCase();
          _0x11d8ef.style.display = _0x588ce1.includes(_0x4a5f6a) ? "flex" : "none";
        });
      });
    }
    _0x5a200a.forEach(_0x945d72 => {
      _0x945d72.addEventListener("click", _0x3cc226 => {
        const _0x5bfe3b = _0x2f8617.querySelector("li.active");
        const _0x26801c = _0x2f8617.querySelector("[data-tab=\"" + _0x945d72.dataset.target + "\"]");
        const _0x31e18c = _0x2f8617.querySelector("[data-tab=\"" + _0x5bfe3b.dataset.target + "\"]");
        if (_0x945d72 != _0x5bfe3b) {
          _0x945d72.className = "active";
          _0x5bfe3b.className = "";
          _0x26801c.className = "";
          _0x31e18c.className = "hidden";
        }
      });
    });
    _0x253399();
    document.addEventListener("click", _0x36a282 => {
      if (_0x2f8617.className) {
        return;
      }
      let _0x22fc1f = !1;
      let _0x1982d6 = _0x36a282.target;
      do {
        if (_0x1982d6 == _0x2f8617) {
          _0x22fc1f = !0;
          break;
        }
        _0x1982d6 = _0x1982d6.parentNode;
      } while (_0x1982d6);
      if (!_0x22fc1f) {
        _0x4dcf5f();
      }
    });
    REACTIONS.forEach(_0x4b0ea3 => {
      _Activity.instance.Smilies.MakeSmiley(makeElement(_0x1f8b88, "div", "box"), _0x4b0ea3, {
        size: 20,
        tooltipPosition: "low",
        scrollParent: _0x2f8617,
        callback: () => {
          ToC({
            Command: "DoReaction",
            Reaction: _0x4b0ea3,
            MsgId: _0x1206a0,
            reactionId: Math.random().toString(36).substr(2, 9)
          }, true);
          if (_0x4cc10d.length >= 6 && !_0x4cc10d.includes(_0x4b0ea3)) {
            _0x4cc10d.shift();
          }
          if (!_0x4cc10d.includes(_0x4b0ea3)) {
            _0x4cc10d.push(_0x4b0ea3);
          }
          _0x253399(_0x4cc10d);
          if (_Activity.instance.IsClassic || !_Activity.instance.IsClassic && localStorage.getItem("mobCookies") == 1) {
            localStorage.setItem("recentReactions", _0x4cc10d.join(","));
          }
          _0x4dcf5f();
          _0x1206a0 = null;
        }
      });
    });
  };
  this.doAutoComplete = function (_0x1efcbd, _0x2d4afe = null) {
    clearTimeout(_0x71d952);
    const _0x443069 = _Activity?.instance;
    let {
      textContent: _0x2380c0
    } = _0x1efcbd?.target;
    if (_0x4ea2b2) {
      if (_0x2380c0?.length && _0x2380c0.indexOf("(") !== -1 && _0x443069?.UserSettings?.autocomplete !== "disable") {
        _0x71d952 = setTimeout(() => {
          _0x2380c0 = _0x2380c0.toLowerCase();
          _0x2380c0 = _0x2380c0.replace(/\)\(/g, ") (");
          const _0x38b307 = _0x2380c0.match(/\((?!\s)([^)]*)$/);
          if (!_0x38b307 || !_0x38b307[1].length) {
            _0x5aa89c.resetAutoComplete();
            return;
          }
          let _0xa51dd3 = _0x38b307[1];
          if (_0xa51dd3.includes(" ")) {
            _0xa51dd3 = _0xa51dd3.split(" ")[0];
          }
          const _0x3d4b7c = {
            o: _0x443069?.SOTH,
            isObject: false
          };
          const _0x306ba6 = {
            o: _0x443069?.SYEL,
            isObject: false
          };
          const _0x31a1be = [];
          const _0x1cb53d = {
            soth: _0x3d4b7c,
            syel: _0x306ba6,
            topshPssa: {
              o: returnOwnedPowers(),
              isObject: false
            }
          };
          for (const _0x495133 in _0x1cb53d) {
            let {
              o: _0x29f907,
              isObject: _0x5297f4
            } = _0x1cb53d[_0x495133];
            if (_0x29f907) {
              _0x29f907 = _0x5297f4 ? Object.keys(_0x29f907) : _0x29f907;
              _0x31a1be.push(..._0x5aa89c.filterArray(_0x29f907, _0xa51dd3));
            }
          }
          if (!_0x31a1be.length) {
            _0x5aa89c.resetAutoComplete();
            return;
          }
          const _0x45b061 = _0x2d4afe || document.getElementById("textEntryEditable");
          const _0x2fdb0c = document.getElementById("textEntryEditable");
          if (_0x45b061 && _0x2fdb0c) {
            let _0x571b = document.getElementById("pmWrapper")?.clientWidth || 0;
            if (_0x571b > 0) {
              _0x571b += 10;
            }
            _0x4ea2b2.style.width = _Activity.IsClassic ? _0x2fdb0c.clientWidth + _0x571b + "px" : "100%";
            if (!_0x45b78b) {
              let _0x41a893 = 0;
              let _0x1408e0 = 0;
              let _0x11e0ed = 0;
              let _0x1f7d3b = 0;
              let _0x21a5e4 = 0;
              let _0x477e2d = 0;
              let _0x78026a = null;
              _0x4ea2b2.addEventListener("touchstart", _0x262fff => {
                _0x41a893 = _0x262fff.touches[0].clientY;
                _0x1408e0 = _0x4ea2b2.scrollTop;
                _0x21a5e4 = Date.now();
                if (_0x78026a !== null) {
                  cancelAnimationFrame(_0x78026a);
                  _0x78026a = null;
                }
                _0x262fff.stopPropagation();
              });
              _0x4ea2b2.addEventListener("touchmove", _0x50e9ee => {
                _0x50e9ee.preventDefault();
                _0x50e9ee.stopPropagation();
                const _0x40fe10 = _0x50e9ee.touches[0].clientY;
                const _0xe46ca0 = _0x41a893 - _0x40fe10;
                _0x4ea2b2.scrollTop = _0x1408e0 + _0xe46ca0;
              });
              _0x4ea2b2.addEventListener("touchend", _0x164963 => {
                _0x11e0ed = _0x41a893 - (_0x4ea2b2.scrollTop - _0x1408e0);
                _0x1f7d3b = Date.now();
                const _0x58215d = _0x1f7d3b - _0x21a5e4;
                if (_0x58215d > 0) {
                  _0x477e2d = (_0x41a893 - _0x11e0ed) / _0x58215d;
                  if (Math.abs(_0x477e2d) > 0.05) {
                    const _0x174bd2 = _0x477e2d * 500;
                    const _0x196526 = Date.now();
                    const _0x5dfe95 = _0x4ea2b2.scrollTop;
                    const _0x1ca312 = () => {
                      const _0x26be20 = Date.now() - _0x196526;
                      const _0x100847 = _0x174bd2 * Math.exp(-_0x26be20 / 325);
                      if (Math.abs(_0x100847) > 0.5) {
                        _0x4ea2b2.scrollTop = _0x5dfe95 + _0x174bd2 * (1 - Math.exp(-_0x26be20 / 325));
                        _0x78026a = requestAnimationFrame(_0x1ca312);
                      } else {
                        _0x78026a = null;
                      }
                    };
                    _0x78026a = requestAnimationFrame(_0x1ca312);
                  }
                }
              });
              _0x4ea2b2.style.webkitOverflowScrolling = "touch";
              _0x4ea2b2.style.overflowY = "auto";
              _0x4ea2b2.style.maxHeight = "200px";
            }
          }
          _0x4ea2b2.classList.remove("d-none");
          _0x4ea2b2.scrollTop = 0;
          _0x4ea2b2.innerHTML = "";
          _0x5aa89c.displaySmiliesInAutoComplete(_0xa51dd3, _0x31a1be, _0x45b061);
        }, 300);
      } else {
        _0x5aa89c.resetAutoComplete();
      }
    }
  };
  this.resetAutoComplete = () => {
    if (_0x4ea2b2) {
      _0x4ea2b2.classList.add("d-none");
      _0x4ea2b2.innerHTML = "";
    }
  };
  this.displaySmiliesInAutoComplete = (_0x514f37, _0x380710, _0x568341) => {
    for (let _0x45a7d4 in _0x380710) {
      const _0x341955 = makeElement(_0x4ea2b2, "div", "", "sm");
      const _0x5595c7 = makeElement(_0x341955, "div", "cell acImage");
      const _0x22cdec = {
        size: 20,
        align: !0,
        callback: () => {}
      };
      _Activity.instance.Smilies.MakeSmiley(_0x5595c7, _0x380710[_0x45a7d4], _0x22cdec);
      makeElement(_0x341955, "div", "cell").innerText = _0x380710[_0x45a7d4];
      _0x341955.addEventListener("click", () => {
        _0x568341.innerHTML = _0x568341.innerHTML.replace(new RegExp("\\(" + _0x514f37 + "(?!.*\\))", "gi"), "(" + _0x380710[_0x45a7d4] + ")");
        const _0x4d422c = "(" + _0x380710[_0x45a7d4] + ")";
        const _0x80e46 = _0x568341.innerHTML.lastIndexOf(_0x4d422c) + _0x4d422c.length;
        _0x4ea2b2.scrollTop = 0;
        _0x4ea2b2.classList.add("d-none");
        _0x4ea2b2.innerHTML = "";
        focusAndPutCaretAtPosition(_0x568341, _0x80e46);
      });
    }
  };
  this.filterArray = (_0xb5f1e6, _0xf04334) => _0xb5f1e6.filter(_0x472f8b => _0x472f8b.includes(_0xf04334));
  this.addToTextEntry = function (_0x24db2d) {
    document.getElementById("textEntryEditable").textContent += _0x24db2d;
  };
  this.sendMessage = function (_0x27debd, _0x1896e5 = false) {
    if (_Activity.instance.clickedTickleTab) {
      return;
    }
    let _0x1df007;
    let _0x59081f = _0x27debd.includes("giphy.com/media");
    let _0x3953ec = window.devicePixelRatio || 1;
    if (_0x1896e5 && _0x2b2f32 && _0x27debd[0] != "/") {
      _0x1df007 = {
        Command: "EditMsg",
        NewMsg: _0x27debd,
        MsgId: _0x2b2f32,
        RoomId: _0x394147
      };
    } else {
      if (_0x59081f && _0x27debd.includes("(")) {
        _0x27debd = (_0x27debd = _0x27debd.split("("))[0] + " (" + _0x27debd[1];
      }
      if (_0x59081f && _0x27debd.includes(")")) {
        _0x27debd = (_0x27debd = _0x27debd.split(")"))[0] + ") " + _0x27debd[1];
      }
      if ((_0x3953ec >= 2 || !_Activity.instance.IsClassic) && (_0x27debd.startsWith("/hug") || _0x27debd.startsWith("/jinx"))) {
        let _0x18f330 = GetTranslation("mob2.nomobilehugs");
        _0x18f330 ||= "Hugs and Jinxes are currently unavailable on mobile.";
        this.sendHelpMsg(9999999, "<inf8> " + _0x18f330, "Warning", true);
        return;
      }
      _0x1df007 = {
        Type: "Send",
        Message: _0x27debd,
        Command: "Send",
        Page: "messages",
        msgId: _0x27debd[0] != "/" ? Math.random().toString(36).substr(2, 9) : ""
      };
    }
    ToC(_0x1df007, !0);
  };
  _Activity.instance.TickQueue.push(function () {
    if (_0x4db39c != _0x556085.clientHeight) {
      _0x4db39c = _0x556085.clientHeight;
      _0xcd4fdc = 0;
    }
    if (_0x1b96ee > 0 && config.pFlags & NamePowers.away && config.pFlags & NamePowers.hasdays && config.NotLoggedIn == "") {
      _0x1b96ee++;
      let _0x308c5f = xInt(Macros.away) * _Activity.instance.TickFPS;
      if (_0x308c5f < _Activity.instance.TickFPS * 60) {
        _0x308c5f = _Activity.instance.TickFPS * 300;
      } else if (_0x308c5f > _Activity.instance.TickFPS * 3600) {
        _0x308c5f = _Activity.instance.TickFPS * 3600;
      }
      if (_0x1b96ee == _0x308c5f) {
        _0x1b96ee = 1;
        if (!_Activity.instance.IsAway) {
          _Activity.instance.IsAway = true;
          messages?.sendMessage("/away");
        }
      }
    }
    if (_0x180ea1 > 1 && --_0x180ea1 == 1) {
      messages?.sendMessage("/RTypeOff");
    }
  });
  this.scrollMessages = function (_0x44445e = false) {
    if (!_0x44445e && (this.editMode || _0xcd4fdc > 0)) {
      return;
    }
    let _0x10ac75 = _0x556085.clientHeight - document.getElementById("messages").clientHeight - 12;
    if (_0x10ac75 < 0) {
      _0x10ac75 = 0;
    }
    _0x2a1bba.style.top = _0x10ac75 + "px";
    _0x2a1bba.scrollTop = _0x2a1bba.scrollHeight;
  };
  function _0x1d353b() {
    ToC({
      Command: "EditToggle",
      Next: "chats"
    });
  }
  function _0x38e8cb() {
    ToC({
      Command: "",
      Next: "visitors"
    });
  }
  function _0x18ea28() {
    const _0xa2bf29 = document.getElementById("visitorsOverlay");
    const _0x3ed26e = document.querySelectorAll(".hugFrame");
    if (_0x3ed26e.length && _0xa2bf29) {
      const _0xcc8947 = window.getComputedStyle(_0xa2bf29).display === "none" ? "4.5rem" : "3.5rem";
      _0x3ed26e.forEach(_0x17c8a7 => {
        _0x17c8a7.style.maxHeight = _0xcc8947;
      });
    }
  }
  this.doBump = (_0x5843c9, _0x25edad) => {
    setTimeout(() => {
      const _0x502f72 = document.getElementById(config.MyId + "_" + _0x5843c9);
      if (_0x502f72) {
        _0x502f72.querySelector(".svgBack").style.backgroundImage = "url('svg/bubble3.svg')";
      }
    }, 10);
    if (_0x25edad) {
      zapShake(true);
    }
  };
  this.DoZap = _0x5dfa64 => {
    zapShake(!1, _0x5dfa64);
  };
  this.deleteMsg = _0x16db44 => {
    _0x44cc07(_0x16db44);
  };
  this.unReactMsg = _0x1e883d => {
    const {
      msgId: _0x131ff8,
      reaction: _0xa23f71,
      reactionId: _0x41f69d,
      userId: _0x1aec1b
    } = JSON.parse(_0x1e883d);
    const _0x1a6efd = document.querySelector("[data-msgId=\"" + _0x131ff8 + "\"]");
    if (_0x1a6efd) {
      let _0x1e65bf = null;
      const _0x25e3c3 = _0x1a6efd.querySelector(".reactions");
      const _0x54b317 = _0x25e3c3?.querySelectorAll(".reaction");
      if (_0x54b317 && _Activity.instance.Reactions.find(_0x2535a5 => _0x2535a5.reactionId == _0x41f69d)) {
        _Activity.instance.Reactions = _Activity.instance.Reactions.filter(_0x204f98 => _0x204f98.reactionId != _0x41f69d);
        for (let _0x39e870 = 0; _0x39e870 < _0x54b317.length; _0x39e870++) {
          _0x1e65bf = _0x54b317[_0x39e870];
          if (_0x1e65bf.dataset.reaction == _0xa23f71) {
            const _0x1dd2ec = _0x1e65bf.querySelector(".num");
            const _0x1528f6 = xInt(_0x1dd2ec.innerText) - 1;
            _0x1dd2ec.innerText = _0x1528f6;
            if (_0x1528f6 < 1) {
              _0x25e3c3.removeChild(_0x1e65bf);
              if (!_0x25e3c3.querySelectorAll(".reaction").length) {
                _0x25e3c3.parentNode.removeChild(_0x25e3c3);
              }
            } else if (_0x1aec1b == config.MyId) {
              _0x1e65bf.style.borderColor = "rgba(255, 255, 255, 0)";
              addToolTip(_0x1e65bf, ["mob2.react", "React"], {
                position: "low"
              });
              _0x1e65bf.onclick = () => {
                ToC({
                  Command: "DoReaction",
                  Reaction: _0xa23f71,
                  MsgId: _0x131ff8,
                  reactionId: Math.random().toString(36).substr(2, 9)
                }, true);
              };
            }
            return;
          }
        }
      }
    }
  };
  this.reactMsg = _0x5d412d => {
    const {
      msgId: _0x4d7969,
      reaction: _0x5dc508,
      reactionId: _0x353cac,
      userId: _0x3c6633
    } = JSON.parse(_0x5d412d);
    if (_Activity.instance.Reactions.find(_0x342257 => _0x342257.reactionId == _0x353cac)) {
      return;
    }
    const _0x7ad37f = document.querySelector("[data-msgId=\"" + _0x4d7969 + "\"]");
    if (_0x7ad37f) {
      let _0xf1685a = null;
      const _0x1006b3 = _0x7ad37f.querySelector(".reactions") ?? makeElement(_0x7ad37f, "div", "reactions");
      const _0x44d594 = _0x1006b3.querySelectorAll(".reaction");
      const _0x1dc05b = _0x7ad37f.querySelectorAll("img");
      let _0x8c7fad = null;
      var _0x1017ce = 0;
      _0x1dc05b.forEach(_0x1e20fc => {
        if (_0x1e20fc.closest("span.messageSm.big") && _0x1e20fc.height > _0x1017ce) {
          _0x1017ce = _0x1e20fc.height;
          _0x8c7fad = _0x1e20fc;
        }
      });
      if (_0x1017ce > 0 && _0x8c7fad) {
        const _0xa23354 = 15;
        const _0xc5457f = 6;
        const _0x574c23 = _0x8c7fad.height - 40 + xInt(_0x8c7fad.style.top);
        const _0x5af5c8 = Math.min(_0xa23354, Math.max(_0xc5457f, _0x574c23));
        _0x1006b3.style.paddingTop = _0x5af5c8 + "px";
      }
      _Activity.instance.Reactions.push(JSON.parse(_0x5d412d));
      if (_0x44d594.length) {
        for (let _0x4561ba = 0; _0x4561ba < _0x44d594.length; _0x4561ba++) {
          _0xf1685a = _0x44d594[_0x4561ba];
          if (_0xf1685a.dataset.reaction == _0x5dc508) {
            const _0x3e43a7 = _0xf1685a.querySelector(".num");
            const _0xe009c5 = xInt(_0x3e43a7.innerText) + 1;
            _0x3e43a7.innerText = _0xe009c5;
            if (_0xe009c5 < 1) {
              _0x1006b3.removeChild(_0xf1685a);
              if (!_0x1006b3.querySelectorAll(".reaction").length) {
                _0x1006b3.parentNode.removeChild(_0x1006b3);
              }
            } else if (_0x3c6633 == config.MyId) {
              _0xf1685a.onclick = () => {
                ToC({
                  Command: "UndoReaction",
                  reactionId: _0x353cac
                }, true);
              };
              _0xf1685a.style.borderColor = "rgba(255, 255, 255, .7)";
              addToolTip(_0xf1685a, ["mob2.unreact", "Remove Reaction"], {
                position: "low"
              });
            }
            return;
          }
        }
      }
      const _0x2c2f9f = {
        size: 20,
        callback: () => {}
      };
      _0xf1685a = makeElement(_0x1006b3, "span", "reaction");
      _Activity.instance.Smilies.MakeSmiley(_0xf1685a, _0x5dc508, _0x2c2f9f);
      _0xf1685a.onclick = () => {
        if (_0x3c6633 == config.MyId) {
          _0xf1685a.style.borderColor = "rgba(255, 255, 255, 0)";
          ToC({
            Command: "UndoReaction",
            reactionId: _0x353cac
          }, true);
        } else if (config.pFlags & NamePowers.hasdays) {
          ToC({
            Command: "DoReaction",
            Reaction: _0x5dc508,
            MsgId: _0x4d7969,
            reactionId: Math.random().toString(36).substr(2, 9)
          }, true);
        }
      };
      _0xf1685a.dataset.reaction = _0x5dc508;
      makeElement(_0xf1685a, "span", "num").innerText = 1;
      if (_0x3c6633 == config.MyId) {
        _0xf1685a.style.borderColor = "rgba(255, 255, 255, .7)";
        addToolTip(_0xf1685a, ["mob2.unreact", "Remove Reaction"], {
          position: "low"
        });
      } else if (config.pFlags & NamePowers.hasdays) {
        addToolTip(_0xf1685a, ["mob2.react", "React"], {
          position: "low"
        });
      } else {
        _0xf1685a.style.cursor = "default";
      }
      if (_0xcd4fdc === 0 || !_0x7ad37f.nextSibling && _0x3c6633 == config.MyId) {
        _0xcd4fdc = 0;
        messages.scrollMessages(true);
      }
    }
  };
  this.turnOffAwayOrFail = () => {
    if (_Activity.instance.IsAway && userFlags & NamePowers.away && userFlags & NamePowers.hasdays) {
      _Activity.instance.IsAway = false;
      messages?.sendMessage("/back");
    }
  };
  this.limitMessages = _0x4c06e1 => {
    const _0x174713 = document.getElementById("messages");
    const _0x238d4a = [..._0x174713.childNodes];
    const _0x268694 = _0x238d4a.length;
    if (!(_0x268694 <= _0x4c06e1)) {
      _0x238d4a.slice(0, _0x268694 - _0x4c06e1).forEach(_0x174713.removeChild.bind(_0x174713));
    }
  };
  this.getAvatarSize = function (_0x121796, _0x2a4ff4) {
    if (_0x2a4ff4 || _0x121796[0] == "<" || _0x121796[0] == "(") {
      return 80;
    } else {
      return 30;
    }
  };
  this.addMessage = function (_0xccb4fd) {
    let _0x3daecc = !1;
    const _0xc46040 = JSON.parse(_0xccb4fd);
    let _0x2fce34;
    let _0x55f2b0 = _0xc46040.text;
    if (_0x5a328a) {
      let _0x23d000 = _0x55f2b0.match(/kk([a-z0-9]*)/i);
      if (_0x23d000 && _0x23d000[1]) {
        _0x5a328a = _0x23d000[1].charAt(0).toUpperCase() + _0x23d000[1].substr(1);
        2;
      }
    }
    if (_0xc46040.ignored) {
      _0x44cc07(_0xc46040.i);
      return;
    }
    if (xInt(_0xc46040.pFlags) & 268435456 && !_0xc46040?.registered?.length && _Activity.instance.QuickBar?.hasGiphyLinkInText(_0x55f2b0.toLowerCase())) {
      _0x44cc07(_0xc46040.i);
      if (parseInt(_0xc46040.id) == parseInt(config.MyId)) {
        let _0x27bb44 = GetTranslation("mob2.unregcannotusegifs");
        _0x27bb44 ||= "Unregistered users cannot send GIFS. If you wish to send gifs in chat, register an account now!";
        this.sendHelpMsg(_0xc46040.i, "<inf8> " + _0x27bb44, "Warning", !0);
      }
      return;
    }
    let _0x585442 = null;
    _0x2fce34 = document.getElementById("id_message_" + _0xc46040.i);
    if (_0x2fce34) {
      _0x585442 = _0x2fce34.querySelector(".reactions");
      _0x2fce34.innerHTML = "";
    } else {
      var _0xa13796 = document.getElementById("messages");
      _0x2fce34 = makeElement(_0xa13796, "li", "message");
    }
    _0x2fce34.setAttribute("data-msgId", _0xc46040.msgId ?? "");
    const _0x2f8363 = _0x2fce34.pFlags = xInt(_0xc46040.pFlags);
    const _0x3e511e = _0x2fce34.pFlags2 = xInt(_0xc46040.pFlags2);
    if (_0x3e511e & NamePowers.isBlocked) {
      _0x2fce34.style.opacity = 0.5;
    }
    iidLine++;
    _0x2fce34.setAttribute("data-line", iidLine);
    _0x2fce34.setAttribute("user-id", _0xc46040.id);
    _0x2fce34.setAttribute("data-msgTime", !_0xc46040.isEdited && _0xc46040.Time > 0 ? _0xc46040.Time : 0);
    try {
      const _0x655880 = btoa(unescape(encodeURIComponent(_0x55f2b0)));
      _0x2fce34.setAttribute("data-msg-ec", _0x655880);
    } catch (_0x6a5fae) {}
    const _0x145337 = _0xc46040.id;
    let _0x4b359b;
    _0x2fce34.id = "id_message_" + _0xc46040.i;
    const _0x1c663e = _0x55f2b0.substring(0, 5) === "<h>;=";
    if (!_Activity.instance.IsClassic && _0x1c663e) {
      if (_0x55f2b0.split(";=")[1] < 100000) {
        _0x2fce34.remove();
        return;
      }
    }
    _0xc46040.image ||= "(smile#)";
    if (_0xc46040.image && _0xc46040.image.substr(-1) == "#") {
      let _0x3f587e = _0xc46040.image?.split("#").filter(_0x2269bd => _0x2269bd.length > 0);
      _0xc46040.image = _0x3f587e.join("#");
    }
    if (_Activity.instance.UserSettings.stickers !== "disable") {
      const _0x3edf99 = _0x55f2b0.match(/^\(\uFEFF([0-9a-zA-Z]{2,}\.[^)]*?)\)(.*)$/i);
      if (_0x3edf99 && _0x3edf99.length === 3) {
        _0x55f2b0 = _0x3edf99[2];
        _0x4b359b = _0x3edf99[1].split("#");
        if (_0x4b359b.length > 2) {
          _0x4b359b[1] = _0x4b359b.slice(1).join("#");
        }
      } else {
        _0x4b359b = null;
      }
    }
    let _0xe9b501;
    if (_0xc46040.id == config.MyId && _0xc46040.registered && _0xc46040.registered.length > 0) {
      _0xc46040.xme = _0xc46040.registered;
    }
    let _0x3bbf17 = null;
    const _0x3e692e = _0x3e511e & NamePowers.zoom || config.pFlags2 & NamePowers.zoom;
    if (!_0x1c663e) {
      if (_0x4b359b) {
        _0xe9b501 = "message messageSticker";
        var _0x205e07 = makeElement(_0x2fce34, "iframe", "stickerFrame");
        _0x205e07.style.float = "left";
        var _0x2e5f9f = _0x4b359b[0].replace(/[^0-9a-zA-Z]/g, "_").toLowerCase();
        _0x205e07.src = "https://xath.hu/web_gear/chat/sticker.php?Ju77&s=" + _0x2e5f9f + (_0x4b359b[1] ? "#" + encodeURIComponent(_0x4b359b[1]) : "");
        let _0x5d5876 = _0x4b359b[0];
        if (_0x4b359b[1]) {
          _0x5d5876 += "#" + _0x4b359b[1];
        }
        addToolTip(_0x205e07, "(" + _0x5d5876 + ")", {
          select: !0,
          position: "low"
        });
      } else if (_0x3e511e & NamePowers.xavi && _0xc46040.id != 0 && _Activity.instance.UserSettings.xavi != "disable") {
        _0x2fce34.classList.add("hasXavi");
        if (_0x3e692e) {
          makeElement(_0x2fce34, "span", "avZoomArea");
        }
        _0x3bbf17 = loadXavi(_0x2fce34, _0xc46040.id, _0x55f2b0, _0x3e511e & NamePowers.isBot, _0xc46040.cb, _0xc46040.PowerO, _0xc46040.Powers);
      } else {
        const _0xb2cac9 = "messageAvatar" + (_0x2f8363 & NamePowers.hasprofile && _0xc46040.image.toLowerCase().indexOf("#noshadow") == -1 ? " avShadow" : "");
        let _0x38ad03;
        if (_0x3e692e) {
          _0x38ad03 = makeElement(_0x2fce34, "span", "avZoomArea");
        }
        const _0x3969ac = _0x3e692e ? makeElement(_0x2fce34, "div", "avZoom") : _0x2fce34;
        const _0x3446ef = this.getAvatarSize(_0xc46040.image, _0x3e692e);
        _0x3bbf17 = _Activity.instance.Avatars.MakeAvatar(_0x3969ac, _0xc46040.image, {
          size: _0x3446ef,
          userId: _0x145337,
          userName: _0xc46040.registered,
          hasAnimate: _0x2f8363 & NamePowers.animate,
          uniqueId: _0xc46040.msgId,
          hasShuffle: _0x2f8363 & NamePowers.shuffle,
          className: _0xb2cac9,
          avatarEffect: _0xc46040.avatarEffect ?? "",
          callbackTarget: _0x38ad03 ?? _0x3969ac.toLowerCase,
          tooltip: ["box.140", "view me.xath.hu"]
        });
      }
      _0xc46040.name ||= _0x145337;
      var _0x5916c1 = makeElement(_0x2fce34, "p");
      _0x5916c1.onclick = _0x493458 => {
        if (_0x493458.ctrlKey) {
          messages.sendApp("rapid", _0x145337);
        } else {
          messages.sendApp(0, _0x145337);
        }
      };
      _0x5916c1.style.cursor = "pointer";
      _0x5916c1.className = "messagesName";
      const _0x3d1b24 = createNameSm(_0x5916c1, _0xc46040.name, {
        flags: _0xc46040.pFlags | NamePowers.nospace,
        pawn: _0xc46040.pawn,
        userId: _0x145337,
        userName: _0xc46040.registered,
        className: "userNick",
        isName: !0
      });
      if (!_0xc46040.pawn) {
        _0x3d1b24.style.marginLeft = "0.25rem";
      }
      if (_0xc46040.id != 0) {
        let _0x4383a6 = !0;
        let _0x4769b9 = getTooltipInfo(_0xc46040);
        if (_0xc46040.id == config.MyId || _0xc46040.id == "2") {
          _0x4383a6 = false;
        }
        let _0x3e714d = _0x5916c1.getElementsByClassName("userNick")[0];
        const _0x1d04ab = {
          showRapid: _0x4383a6
        };
        addToolTip(_0x3e714d, _0x4769b9, _0x1d04ab);
      }
    }
    const _0x2b1f67 = makeElement(_0x2fce34, "p");
    _0x2b1f67.className = "messagesMessage";
    if (_0xc46040.msgId) {
      const _0x441c10 = makeElement(_0x2b1f67, "div");
      _0x441c10.className = "editContainer";
      const _0x257fbd = makeElement(_0x441c10, "span");
      _0x257fbd.className = "editBlock";
      _0x257fbd.id = "editBlock" + _0xc46040.msgId;
      _0x257fbd.contentEditable = !0;
      _0x257fbd.innerText = _0x55f2b0;
      this.addEditListeners(_0x257fbd, _0x2fce34);
      const _0x3bd978 = makeElement(_0x441c10, "a", "editSend");
      const _0x148059 = makeElement(_0x3bd978, "img", "editSendImg");
      _0x148059.src = "svg/check" + (toHex6(config.ButColW)[0] == "0" ? "b" : "w") + ".svg";
      _0x148059.width = "14";
      const _0x2c607d = makeElement(_0x441c10, "a", "editClose");
      const _0x1d669c = makeElement(_0x2c607d, "img", "editCloseImg");
      _0x1d669c.src = "svg/remove" + (toHex6(config.ButColW)[0] == "0" ? "b" : "w") + ".svg";
      _0x1d669c.width = "12";
    }
    var _0x17b591;
    var _0x1a768f;
    _0x17b591 = _0x55f2b0;
    _0x1a768f = "֑-߿‏‫‮יִ-﷽ﹰ-ﻼ";
    if (new RegExp("^[^" + _0x1a768f + "]*?[" + _0x1a768f + "]").test(_0x17b591) && _0x55f2b0[0] != "<") {
      _0x2b1f67.style.direction = "rtl";
    }
    if (_0xc46040.Time && _0xc46040.id == 0) {
      setTimeout(() => {
        if (_0xa13796?.contains(_0x2fce34)) {
          _0xa13796.removeChild(_0x2fce34);
        }
      }, 10000);
    }
    _0xc46040.id;
    config.MyId;
    let _0x16e972 = 2;
    if (_0x145337 == 0) {
      _0x16e972 |= 134217728;
    }
    if (_0xc46040.flip) {
      _0x2b1f67.className += " flipMe";
    }
    let _0x382096 = null;
    const _0x4ace5a = _0x145337 === config.MyId;
    if (_0x3e511e & NamePowers.istickle) {
      _0x2b1f67.className = "chatsMinsAgo";
      const _0x11de55 = GetTimeToGo(_0x55f2b0 * 1000);
      _0x2b1f67.dataset.dataSec = GetTimeToGo(_0x55f2b0 * 1000, !1, !0);
      addText(_0x2b1f67, _0x11de55);
    } else if (_0x1c663e) {
      this.handleHugs(_0x2fce34, _0x55f2b0, _0x145337, _0xc46040.i);
    } else {
      _0x55f2b0 = _0x55f2b0.replace(/\s\s+/g, " ");
      _0x382096 = createTextColor(_0x2b1f67, _0x55f2b0, {
        flags: _0xc46040.pFlags,
        userId: _0x145337,
        userName: _0xc46040.registered,
		nickname: _0xc46040.name,
        hasBig: !!_0xc46040.Big,
        useMarkdown: !0,
        useLinks: !0,
        useMark: _0xc46040.id != config.MyId,
        scrollParent: _0x2a1bba
      });
      if (_0x382096 instanceof Error && _0x382096.code === MessageErrorCodes.LinkInLinkMarkupDetected) {
        if (_0x4ace5a) {
          _0x55f2b0 = GetTranslation("mob2.linkmarkupfailure");
          _0x55f2b0 ||= "Info: Cannot add a hyperlink, the selected text is already linked to a different URL.";
          this.sendHelpMsg(_0xc46040.i, "<inf8> " + _0x55f2b0, "Warning", true);
        } else {
          _0x44cc07(_0xc46040.i);
        }
        return;
      }
      if (_0x4b359b) {
        _0x382096.style.width = "calc(100% - 105px)";
      }
      if (_0xc46040.TransIcon) {
        const _0x474e76 = makeElement(null, "img");
        _0x474e76.src = "svg/translator.svg";
        _0x474e76.className = "translateImage";
        _0x474e76.display = "default";
        _0x382096.prepend(_0x474e76);
        addToolTip(_0x474e76, _0xc46040.OriginalMsg, {
          position: "low"
        });
      }
    }
    if (_0x55f2b0.substring(0, 2) !== "<i" && _0xc46040.registered && _0xc46040.registered.length > 0 && ["enable", "noanimation", "onhover"].indexOf(_Activity.instance.QuickBar?.getGifSettings()) >= 0) {
      _Activity.instance.QuickBar?.renderGif({
        node: _0x2b1f67,
        text: _0x55f2b0,
        shouldScroll: _0xcd4fdc === 0,
        msgId: _0xc46040.i,
        isSelf: parseInt(_0xc46040.id) === parseInt(config.MyId),
        showWarning: parseInt(_0xc46040.Time) >= Math.floor(Date.now() / 1000) - 5
      });
    }
    this.MessagesIntersectionObserver.observe(_0x2fce34);
    if (config.pFlags & NamePowers.hasdays && !(_0x3e511e & NamePowers.istickle) && _0x145337 != config.MyId && !_0x241605(_0x55f2b0) && _0x55f2b0?.length >= 2 && !_0x42dac3(_0x55f2b0) && _0x422b66(_0x55f2b0) && !_0xc46040.TransIcon && !_0x1c663e) {
      let _0x15412b = makeElement(_0x2fce34, "div");
      _0x15412b.className = "messagesMessage";
      _0x15412b.style.display = "none";
      let _0x1af449 = makeElement(_0x15412b, "span");
      _0x1af449.className = "messageText";
      let _0x46f910 = makeElement(_0x1af449, "img");
      _0x46f910.src = "svg/translator.svg";
      _0x46f910.className = "translateImage";
      let _0x555506 = makeElement(_0x1af449, "div");
      addToolTip(_0x15412b, ["mob2.originalmessage", "Show original message"], {
        position: "low"
      });
      _0xc46040.pt = _0x15412b;
      _0xc46040.transPt = _0x555506;
      _0x15412b.addEventListener("click", () => {
        _0x15412b.style.display = "none";
        _0x2b1f67.style.display = "";
        _0x2fce34.alreadyTranslated = !1;
      });
    }
    if (_0x585442) {
      _0x2fce34.appendChild(_0x585442);
    }
    if (_0xc46040.isEdited) {
      const _0x8d431f = makeElement(_0x382096, "span", "editedIndicator");
      addText(_0x8d431f, ["mob2.edited", "edited"]);
      const _0x2acf2c = _0xc46040.isEdited.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
      addToolTip(_0x8d431f, "(" + new Date(_0xc46040.editTime * 1000).toTimeString().split(" (")[0] + ")<hr>" + _0x2acf2c, {
        position: "top-tall"
      });
    }
    _0x2fce34.addEventListener("contextmenu", _0x118351 => {
      if (!_0x1c663e) {
        _0x118351.p = _0x2b1f67;
        _0x118351.li = _0x2fce34;
        _0x118351.Obj = _0xc46040;
        window.getSelection()?.removeAllRanges();
        _0x204c97(_0x118351);
      }
    });
    if (/iPad|iPhone|iPod/.test(navigator.userAgent)) {
      (function (_0x34845b, _0x478083) {
        let _0x49f3f5 = null;
        const _0x23668e = 500;
        let _0x375c16 = false;
        _0x34845b.addEventListener("touchstart", _0x625df4 => {
          if (!_0x49f3f5) {
            _0x375c16 = false;
            _0x49f3f5 = setTimeout(() => {
              _0x478083(_0x625df4);
              _0x375c16 = true;
              if (_Activity.instance.IsIOSApp) {
                window.webkit.messageHandlers.hapticFeedback.postMessage("");
              }
            }, _0x23668e);
          }
        });
        _0x34845b.addEventListener("touchend", _0xcef3a8 => {
          if (_0x375c16) {
            _0xcef3a8.preventDefault();
          }
          clearTimeout(_0x49f3f5);
          _0x375c16 = false;
          _0x49f3f5 = null;
        });
        _0x34845b.addEventListener("touchmove", () => {
          clearTimeout(_0x49f3f5);
          _0x49f3f5 = null;
        });
      })(_0x2fce34, _0xd7e602 => {
        if (!_0x1c663e) {
          _0xd7e602.p = _0x2b1f67;
          _0xd7e602.li = _0x2fce34;
          _0xd7e602.Obj = _0xc46040;
          _0x204c97(_0xd7e602);
        }
      });
    }
    if (xInt(_0xc46040.pFlags) & NamePowers.nolinks && !_0xc46040.NoWarning && _0x145337 != 0 && _0x55f2b0.substr(0, 6) != "<priv>") {
      let _0x4692be = _0x55f2b0.split(" ");
      for (let _0x1a9406 = 0; _0x1a9406 < _0x4692be.length; _0x1a9406++) {
        if (keywords[_0x4692be[_0x1a9406].toLowerCase()] == null) {
          const _0x3164f0 = WordIsLink(_0x4692be[_0x1a9406], undefined, !1, !0);
          if (_0x4ace5a && _0x3164f0 && typeof _0x3164f0 != "object" && _0x3164f0.indexOf("http") != -1) {
            _0x55f2b0 = GetTranslation("mob2.nolinks");
            _0x55f2b0 ||= "Info: Cannot post links as guest.";
            this.sendHelpMsg(_0xc46040.i, "<inf8> " + _0x55f2b0, "Warning", true);
            return;
          }
          if (_0x4692be[_0x1a9406].length > 0 && _0x4692be[_0x1a9406].charAt(0) === "%") {
            if (_0x4ace5a) {
              _0x55f2b0 = GetTranslation("mob2.nochatshortcut");
              _0x55f2b0 ||= "Info: Guests cannot post chat shortcuts. Click $1 to go there.";
              _0x55f2b0 = _0x55f2b0.replace("$1", _0x4692be[_0x1a9406].toString());
              this.sendHelpMsg(_0xc46040.i, "<inf8> " + _0x55f2b0, "Warning", true);
            } else {
              _0x44cc07(_0xc46040.i);
            }
            return;
          }
        }
      }
    }
  };
  this.handleEditShortCut = () => {
    const {
      MyId: _0x1af25c,
      MyRegName: _0x2d7b52
    } = config;
    if (!_0x1af25c || !_0x2d7b52) {
      return;
    }
    const _0x20c06f = [...document.querySelectorAll("#messages [user-id=\"" + _0x1af25c + "\"]")];
    if (!_0x20c06f.length) {
      return;
    }
    _0x20c06f.reverse();
    const _0xcc59fd = Date.now() / 1000;
    let _0x456340 = {};
    for (const _0x12d2a3 of _0x20c06f) {
      const {
        msgtime: _0x900859,
        msgid: _0x2b8984,
        msgEc: _0x4190f1
      } = _0x12d2a3.dataset;
      let _0x22f470 = "";
      try {
        _0x22f470 = decodeURIComponent(escape(atob(_0x4190f1)));
      } catch (_0x373759) {
        continue;
      }
      if (!_0x900859 || !_0x2b8984 || !_0x22f470 || _0x22f470[0] === "<") {
        continue;
      }
      if (_0xcc59fd - Number(_0x900859) <= 120) {
        const _0x18c631 = {
          msgId: _0x2b8984,
          message: _0x22f470,
          node: _0x12d2a3
        };
        _0x456340 = _0x18c631;
        break;
      }
    }
    if (Object.keys(_0x456340).length) {
      this.setupEditBlock(_0x456340);
    }
  };
  this.setupEditBlock = _0x17eb97 => {
    this.editMode = !0;
    const {
      node: _0x432a51,
      msgId: _0x41b1ba,
      message: _0x2b21ab
    } = _0x17eb97;
    const _0x240b7b = _0x432a51.querySelector(".messageText");
    const _0xb98ae0 = _0x432a51.querySelector("#editBlock" + _0x41b1ba);
    const _0x242782 = _0x432a51.querySelector(".editContainer");
    const _0x2600ae = _0x432a51.querySelector(".editClose");
    const _0x5037f1 = _0x432a51.querySelector(".editSend");
    if (_0x240b7b && _0xb98ae0 && _0x242782) {
      _0x240b7b.style.display = "none";
      _0x242782.style.display = "flex";
      _0xb98ae0.innerText = "";
      this.activeEditMessageNode = _0xb98ae0;
      addToTextEntry(_0x2b21ab, true);
      if (_0x432a51.nextSibling) {
        _0x432a51.scrollIntoView({
          behavior: "smooth",
          block: "nearest"
        });
      } else {
        _0xcd4fdc = 0;
        messages.scrollMessages(true);
      }
      _0x2b2f32 = _0x41b1ba;
      _0x394147 = _0x12ba10;
      if (_0xb98ae0.editListener) {
        _0xb98ae0.removeEventListener("keydown", _0xb98ae0.editListener);
      }
      _0xb98ae0.editListener = _0x10ff1b => this.handleEditAction(_0x10ff1b, _0xb98ae0, _0x240b7b, _0x242782);
      _0xb98ae0.addEventListener("keydown", _0xb98ae0.editListener);
      _0xb98ae0.addEventListener("keydown", () => {
        textEntryCaretPos = getCaretWithin(_0xb98ae0);
      });
      _0xb98ae0.addEventListener("keyup", () => {
        textEntryCaretPos = getCaretWithin(_0xb98ae0);
      });
      _0xb98ae0.addEventListener("input", _0x50099b => {
        const _0x566b43 = _0x50099b?.inputType ?? "";
        if (_0x566b43 && ["formatBold", "formatItalic"].indexOf(_0x566b43) >= 0) {
          textEntry.innerHTML = _0x50099b.target.innerText;
        }
        textEntryCaretPos = getCaretWithin(_0xb98ae0);
      });
      _0xb98ae0.addEventListener("click", () => {
        textEntryCaretPos = getCaretWithin(_0xb98ae0);
      });
      if (_0x2600ae) {
        if (_0x2600ae.closeListener) {
          _0x2600ae.removeEventListener("click", _0x2600ae.closeListener);
        }
        _0x2600ae.closeListener = () => {
          if (this.editMode) {
            this.resetEditState(_0x240b7b, _0xb98ae0, _0x242782, true);
          }
        };
        _0x2600ae.addEventListener("click", _0x2600ae.closeListener);
      }
      if (_0x5037f1) {
        if (_0x5037f1.sendListener) {
          _0x5037f1.removeEventListener("click", _0x5037f1.sendListener);
        }
        _0x5037f1.sendListener = () => {
          if (this.editMode) {
            this.resetEditState(_0x240b7b, _0xb98ae0, _0x242782);
          }
        };
        _0x5037f1.addEventListener("click", _0x5037f1.sendListener);
      }
    }
  };
  this.handleEditAction = (_0x2c037b, _0x36bd36, _0x3eba67, _0x2431b2) => {
    if (_0x2c037b.key === "Enter") {
      _0x2c037b.preventDefault();
      this.resetEditState(_0x3eba67, _0x36bd36, _0x2431b2);
    } else if (_0x2c037b.key === "Escape") {
      _0x2c037b.preventDefault();
      this.resetEditState(_0x3eba67, _0x36bd36, _0x2431b2, true);
    }
  };
  this.resetEditState = (_0x4705c8, _0x23c423, _0x39118a, _0xbdfa9f) => {
    if (_0xbdfa9f) {
      _0x4705c8.style.display = "";
      _0x39118a.style.display = "none";
    } else {
      const _0x12badc = _0x23c423.innerText.trim();
      if (!_0x12badc.length) {
        return;
      }
      if (_0x12badc.charAt(0) === "/") {
        return this.resetEditState(_0x4705c8, _0x23c423, _0x39118a, !0);
      }
      this.sendMessage(_0x12badc, !0);
    }
    _0x2b2f32 = null;
    _0x23c423.removeEventListener("keydown", _0x23c423.editListener);
    _0x23c423.editListener = null;
    this.activeEditMessageNode = null;
    setTimeout(() => {
      this.editMode = false;
      if (textEntry) {
        textEntry.focus();
      }
    }, 5);
  };
  this.addEditListeners = (_0x372457, _0x5e11c0) => {
    _0x372457.addEventListener("keyup", _0x3c396f => this.doAutoComplete(_0x3c396f, _0x372457));
    _0x372457.addEventListener("keydown", _0x12c0de => handleMaxLength(_0x12c0de, _0x372457));
    _0x372457.addEventListener("paste", _0x42684e => {
      if (!handleMaxLength(_0x42684e, _0x372457)) {
        return;
      }
      _0x42684e.preventDefault();
      _0x42684e.stopPropagation();
      let _0x1c49f5 = (_0x42684e.clipboardData || window.clipboardData).getData("text/plain");
      const _0x3ab0b2 = reduceTextLength(_0x1c49f5);
      if (_0x3ab0b2.length > 0) {
        _0x1c49f5 = _0x3ab0b2;
      }
      _0x1c49f5 = _0x1c49f5.replace("﻿", "");
      insertTextAtCaret(_0x1c49f5, _0x372457, !0);
    });
    _0x372457.addEventListener("checkScroll", () => {
      if (!_0x5e11c0.nextSibling) {
        messages.scrollMessages(true);
      }
    });
  };
  this.handleHugs = (_0x4140d4, _0xdbef32, _0x21df12, _0x4ce98e) => {
    if (!_0x4140d4 || !_0xdbef32) {
      return;
    }
    _0x4140d4.classList.add("d-none");
    var _0x3f4da6 = window.devicePixelRatio;
    let [_0x261fc6, _0x3d2be1, _0x348f93, _0x14fa99, _0x165fc8, _0x4d6f38, _0x23d5af, _0x5b9d4a, _0x50edea, _0x22c416, _0x23b33b, _0x523212] = _0xdbef32.split(";=");
    if (!_0x348f93) {
      return;
    }
    var _0x12228b = -1;
    var _0x55b1ef = -1;
    var _0x18270d = "";
    if (_0x23b33b.length !== 0) {
      const _0x325467 = _0x23b33b.match(/(\d+)([a-zA-Z]+)(\d+)/).slice(1);
      if (_0x325467 && _0x325467.length === 3) {
        _0x12228b = xInt(_0x325467[0]);
        _0x18270d = _0x325467[1];
        _0x55b1ef = xInt(_0x325467[2]);
      }
      const _0x51096e = this.getUserId(_0x165fc8);
      const _0x388625 = this.getUserId(_0x5b9d4a);
      if ((_0x51096e === config.MyId || _0x388625 === config.MyId) && _0x55b1ef <= 0) {
        _0x4140d4.remove();
        const _0x48eb71 = _0x21df12 === config.MyId;
        let _0x3e64ed = GetTranslation(_0x48eb71 ? "mob2.unjinx" : "mob2.unjinxed");
        _0x3e64ed ||= _0x48eb71 ? "You have unjinxed this user." : "You are now unjinxed.";
        this.sendHelpMsg(_0x4ce98e, "<inf8> " + _0x3e64ed, "Notice");
        return;
      }
    }
    _0x3f4da6 = window.devicePixelRatio || 1;
    if (_0x3d2be1 > 100000 && (_0x3f4da6 >= 2 || !_Activity.instance.IsClassic)) {
      let _0x17d663 = Math.floor(Date.now() / 1000);
      let _0x100521 = Math.max(_0x12228b - _0x17d663, 0);
      let _0x3ce62d = Math.floor(_0x100521 / 60);
      let _0x5b2876 = GetTranslation("mob2.jinxwarning");
      _0x5b2876 ||= "You have been $1jinxed for $2 minutes with a probability of $3%!";
      _0x5b2876.replace("$1", _0x18270d);
      _0x5b2876.replace("$2", _0x3ce62d.toString());
      _0x5b2876.replace("$3", _0x55b1ef.toString());
      this.sendHelpMsg(_0x4ce98e, "" + _0x5b2876, "Help");
      return;
    }
    if (_0x3f4da6 >= 2) {
      return;
    }
    if (parseInt(_0x4d6f38) > 0) {
      _0x4d6f38 = "https://xath.hu/web_gear/chat/av/" + parseInt(_0x4d6f38) + ".png";
    }
    if (parseInt(_0x50edea) > 0) {
      _0x50edea = "https://xath.hu/web_gear/chat/av/" + parseInt(_0x50edea) + ".png";
    }
    let _0x49f90e = "https://xath.hu/web_gear/chat/hugs.php";
    const _0x143361 = {
      h: _0x348f93,
      n: this.cleanHugNames(_0x165fc8),
      n2: this.cleanHugNames(_0x5b9d4a),
      p1: _0x23d5af,
      av: _0x4d6f38,
      av2: _0x50edea,
      p2: _0x22c416,
      m: _0x14fa99,
      t: _0x12228b,
      p: _0x55b1ef,
      j: _0x523212
    };
    try {
      let _0x858b9a = JSON.stringify(_0x143361);
      _0x49f90e += "?p=" + btoa(encodeURIComponent(_0x858b9a)) + "&cb=cc11";
    } catch (_0x343035) {
      return;
    }
    const _0x39f2c9 = makeElement(_0x4140d4, "iframe", "hugFrame");
    _0x39f2c9.src = _0x49f90e;
    _0x39f2c9.loading = "lazy";
    _0x39f2c9.onload = () => {
      try {
        const _0x187c2e = _0x39f2c9.contentDocument || _0x39f2c9.contentWindow.document;
        if (!_0x187c2e || !_0x187c2e.body) {
          return;
        }
        _0x18ea28();
        if (_0x187c2e.body.innerText.length && !_0x187c2e.body.innerText.includes("(404)")) {
          _0x4140d4.classList.remove("d-none");
          messages.scrollMessages();
        }
      } catch (_0x1a0c8c) {}
    };
  };
  this.cleanHugNames = _0x42f15d => {
    let _0x8007f2 = _0x42f15d.split("|");
    let _0x21039f = _0x8007f2[0].replace(/\s*\([^)]*\)\s*/g, "").trim();
    if (_0x21039f === "" || _0x21039f === "_") {
      return _0x8007f2[1];
    } else {
      return _0x21039f;
    }
  };
  this.getUserId = _0x22cea8 => {
    const _0xeeedc9 = _0x22cea8.split("|");
    if (!(_0xeeedc9.length < 3)) {
      return _0xeeedc9[2];
    }
  };
  this.sendHelpMsg = function (_0x53a25b = 0, _0x45f2d6 = null, _0x59a636 = "Help", _0x12bd16 = false) {
    _0x5aa89c.addMessage(JSON.stringify({
      id: 0,
      i: _0x53a25b,
      text: _0x45f2d6,
      image: "<i>",
      name: _0x59a636,
      pFlags: 268500991,
      status: "",
      Time: !!_0x12bd16 && Math.floor(Date.now() / 1000)
    }));
  };
  const _0x227648 = document.getElementById("visitorsOverlay");
  if (_0x227648) {
    new MutationObserver(() => {
      _0x18ea28();
    }).observe(_0x227648, {
      attributes: true,
      attributeFilter: ["style"]
    });
  }
  const _0x1cfc55 = document.querySelector("#msgMenu");
  function _0x204c97(_0x436f6d) {
    _0x421be0?.li.classList.remove("selected");
    (_0x421be0 = _0x436f6d.Obj).p = _0x436f6d.p;
    _0x421be0.li = _0x436f6d.li;
    let _0x1edb75 = _0x436f6d?.target?.classList?.contains("msgLink") ? WordIsLink(_0x436f6d.target.innerText) : undefined;
    _0x421be0.isLink = !1;
    if (_0x1edb75 !== undefined) {
      let _0x25c2e2 = typeof _0x1edb75 == "object" ? _0x1edb75.l : _0x1edb75;
      if (!_0x25c2e2.includes(" ")) {
        if (_0x25c2e2.charAt(0) == "%") {
          const _0x53daaa = _0x25c2e2.substr(1);
          _0x25c2e2 = "https://xath.hu/" + _0x53daaa;
        }
        if (_0x25c2e2 != ">") {
          _0x421be0.isLink = true;
          _0x421be0.message = _0x25c2e2;
        }
      }
    }
    _0x421be0.isSmiley = !1;
    const _0x250fad = _0x436f6d.target.closest(".messageSm");
    if (_0x250fad && _0x250fad?.dataset?.sm) {
      const _0x4dea8f = _0x250fad?.dataset?.sm?.replace(/\*/gi, "#");
      _0x421be0.isSmiley = _0x4dea8f.substring(0, 2) != "p1" && _0x4dea8f;
    }
    _0x436f6d.preventDefault();
    messages.toggleMsgMenu(!0);
    const _0x3f5a4f = _0x436f6d.clientX ?? _0x436f6d.touches[0].clientX;
    const _0x27bb28 = _0x436f6d.clientY ?? _0x436f6d.touches[0].clientY;
    const _0x13d9e7 = _0x1cfc55.offsetWidth;
    const _0x117653 = _0x1cfc55.offsetHeight;
    const _0x1e1fbf = _0x27bb28 - 15 < 15 ? 15 : _0x27bb28 + _0x117653 + 15 >= window.innerHeight - 15 - _0x117653 / 2 ? Math.max(15, _0x27bb28 - (_0x117653 + 15)) : _0x27bb28;
    let _0x1e5787 = _0x3f5a4f - 15 < 15 ? 15 : _0x3f5a4f + _0x13d9e7 + 15 >= window.innerWidth ? _0x3f5a4f - (_0x13d9e7 + 15) : _0x3f5a4f;
    if (!_0x45b78b) {
      _0x1e5787 = (window.innerWidth - _0x13d9e7) / 2;
    }
    _0x1cfc55.style.top = _0x1e1fbf + "px";
    _0x1cfc55.style.left = _0x1e5787 + "px";
  }
  function _0x241605(_0x2d59d7) {
    return !!_0x2d59d7 && /^\((.*?)\)+$/.test(_0x2d59d7.replace(/ /, ""));
  }
  function _0x42dac3(_0xa68011) {
    return !!_0xa68011 && (_0xa68011 = _0xa68011.split(" ")).length == 1 && WordIsLink(_0xa68011[0]);
  }
  function _0x422b66(_0x5b58ed) {
    if (!_0x5b58ed) {
      return !1;
    }
    if (_0x5b58ed.substr(0, 2) == "❯#") {
      if (_0x5b58ed = _0x5b58ed.replace(/❯.*\[.*?\]/g, "")) {
        _0x5b58ed = _0x5b58ed.trim();
      }
      let _0x2fbfd3 = _0x5b58ed[0] == "(" && (_0x5b58ed.charAt(_0x5b58ed.length - 1) == ")" || _0x5b58ed.charAt(_0x5b58ed.length - 1) == " ");
      if (!_0x5b58ed.length || _0x42dac3(_0x5b58ed) || _0x2fbfd3) {
        return !1;
      }
    }
    return !0;
  }
  function _0x44cc07(_0x319cc5) {
    var _0x4ab992 = document.getElementById("id_message_" + _0x319cc5);
    if (_0x4ab992 != null) {
      _0x4ab992.parentNode.removeChild(_0x4ab992);
    }
  }
  this.toggleMsgMenu = _0x1233e8 => {
    if (!_0x1233e8 || !_0x421be0?.id || xInt(_0x421be0.pFlags2) & NamePowers.istickle) {
      _0x421be0?.li.classList.remove("selected");
      _0x1cfc55.classList.remove("active");
    } else {
      _0x1cfc55.classList.add("active");
      const _0x521d0a = _0x421be0.text;
      if (_0x1233e8) {
        _0x421be0.li.classList.add("selected");
      }
      const _0x59b7ed = document.querySelector(".msgMenuDivider");
      document.querySelectorAll("[data-msgItem]").forEach(_0xeb22ba => {
        let _0x4d5adb = !1;
        switch (_0xeb22ba.dataset.msgitem) {
          case "time":
            if (_0x421be0.Time && _0x421be0.id != 0) {
              _0x4d5adb = true;
              _0xeb22ba.innerHTML = "";
              _0x59b7ed.style.display = "block";
              _0xeb22ba.dataset.dataSec = GetTimeToGo(xInt(_0x421be0.Time) * 1000, false, true);
              addText(_0xeb22ba, GetTimeToGo(xInt(_0x421be0.Time) * 1000));
            } else {
              _0x59b7ed.style.display = "none";
            }
            break;
          case "edit":
            const _0x1bbe5b = Date.now() / 1000 - _0x421be0.Time;
            _0x4d5adb = !messages.editMode && !_0x421be0.isEdited && _0x421be0.id == config.MyId && config.MyRegName && _0x1bbe5b <= 120 && _0x521d0a[0] != "<";
            break;
          case "translate":
            _0x4d5adb = config.pFlags & NamePowers.hasdays && _0x421be0.id != config.MyId && !_0x241605(_0x521d0a) && _0x521d0a?.length >= 2 && !_0x42dac3(_0x521d0a) && _0x422b66(_0x521d0a) && !_0x421be0.TransIcon;
            break;
          case "quote":
            let _0x4a7b1c = replaceBrakets(_0x521d0a);
            _0x4d5adb = _0x4a7b1c.length > 2 && !_0x4a7b1c.includes("giphy.com/media");
            break;
          case "react":
            _0x1206a0 = _0x421be0.msgId;
            _0x4d5adb = _0x421be0.msgId && _Activity.instance.UserSettings.displayReactions != "disable";
            break;
          case "delete":
            _0x4d5adb = !!_0x421be0.canDelete;
            break;
          case "copy":
            _0x4d5adb = !(!_0x521d0a.indexOf(" ") >= 0) || !_0x421be0.isLink && !_0x421be0.isSmiley;
            break;
          case "copyLink":
            _0x4d5adb = _0x421be0.isLink;
            break;
          case "copySmiley":
            _0x4d5adb = _0x421be0.isSmiley;
        }
        if (_0x4d5adb) {
          _0xeb22ba.classList.remove("hidden");
        } else {
          _0xeb22ba.classList.add("hidden");
        }
      });
    }
  };
  this.clearMessages = function (_0x495b76) {
    if (!_0x495b76) {
      modalClose(true);
    }
    for (var _0x3a405b = document.getElementById("messages"); _0x3a405b.firstChild;) {
      _0x3a405b.removeChild(_0x3a405b.firstChild);
    }
    _0x5ca1ad.length = 0;
    _0xcd4fdc = 0;
  };
  this.setSettings = function (_0xc96219) {
    _Activity.instance.UserSettings = JSON.parse(_0xc96219);
  };
  this.setTypingOff = function () {
    if (_0x180ea1 > 1 && userFlags & NamePowers.typing) {
      _0x180ea1 = 1;
      return ToC({
        Type: "Send",
        Message: "/RTypeOff",
        Command: "Send",
        Page: "messages"
      }, !0);
    }
    return !1;
  };
  this.clickSmilieOpen = function () {
    classicSetDialog("selector", {
      Type: "Smilies"
    });
  };
  var _0x234339;
  var _0x2019c7;
  var _0x2f08a9;
  var _0xb73c7a;
  var _0x3c3d2b;
  var _0x23c24f;
  function _0x424989(_0x3c0608, _0x1e0eae) {
    if (_0x3c0608 > _0x1e0eae) {
      return -1;
    } else if (_0x3c0608 < _0x1e0eae) {
      return 1;
    } else {
      return 0;
    }
  }
  this.openSmiliesDialog = function () {
    if (!syel) {
      ToC({
        XC: 1,
        Command: "GetSmilies"
      });
    }
  };
  this.PaintPage = function (_0x21ddd6) {
    var _0x213ff9;
    var _0x322732;
    var _0x33808f;
    var _0x3befae;
    var _0x52db99;
    var _0x266755;
    _0x213ff9 = clearDiv("all");
    _0x322732 = makeElement(_0x213ff9, "div", "listTable");
    if ((_0x2019c7 = _0x21ddd6) < 0) {
      _0x2019c7 = _0x2f08a9 - 1;
    }
    if (_0x2019c7 >= _0x2f08a9) {
      _0x2019c7 = 0;
    }
    var _0x3909db = _0x2019c7 * _0xb73c7a;
    for (var _0x2859b9 = 0; _0x2859b9 < _0x3c3d2b; _0x2859b9++) {
      _0x33808f = makeElement(_0x322732, "div", "dialogRow");
      for (var _0x450e96 = 0; _0x450e96 < _0x23c24f; _0x450e96++) {
        var _0x2ef5e1;
        (_0x52db99 = makeElement(_0x33808f, "div", "dialogCell dialogCellCenter")).style.height = "40px";
        _0x52db99.style.width = "40px";
        if (_0x2ef5e1 = messages.Current[_0x3909db++]) {
          if (xInt(_0x2ef5e1) >= 10000) {
            _0x2ef5e1 = _0x2ef5e1.substr(5);
          }
          _Activity.instance.Smilies.MakeSmiley(_0x52db99, _0x2ef5e1, {
            size: 30,
            showAd: !1,
            align: !0,
            className: "holder2"
          });
          if (_0x234339 == "pow") {
            if (!scount) {
              scount = {};
              for (var _0x2ae9d3 in stop) {
                scount[stop[_0x2ae9d3]] = scount[stop[_0x2ae9d3]] ? scount[stop[_0x2ae9d3]] + 1 : 1;
              }
            }
            if (scount[spow[_0x2ef5e1]]) {
              _0x2ef5e1 = "$" + _0x2ef5e1;
            }
          }
          _0x52db99.setAttribute("data-code", _0x2ef5e1);
          _0x52db99.onclick = messages.clickSmilie;
        }
      }
    }
    _0x322732 = makeElement(_0x213ff9, "div", "dialogTable");
    _0x33808f = makeElement(_0x322732, "div", "dialogRow");
    _0x3befae = makeElement(_0x33808f, "div", "dialogCell dialogCellCenter dialogCellMiddle");
    (_0x266755 = makeElement(_0x3befae, "span")).innerHTML = "<span style=\"font-size:1.2rem;font-weight:700;\">&lt;</span>";
    _0x266755.onclick = function () {
      messages.PaintPage(_0x2019c7 - 1);
    };
    _0x3befae = makeElement(_0x33808f, "div", "dialogCell dialogCellCenter dialogCellMiddle");
    if (config.PhoneType == PhoneTypes.DROIDPHONE) {
      _0x3befae.style.cssText = "font-size: 0.5rem;";
    }
    _0x3909db = 0;
    for (; _0x3909db < _0x2f08a9; _0x3909db++) {
      _0x266755 = makeElement(_0x3befae, "span");
      addText(_0x266755, "●");
      if (_0x3909db == _0x2019c7) {
        _0x266755.style.color = "#000";
      } else {
        _0x266755.style.color = "#999";
        _0x266755.onclick = function () {
          messages.PaintPage(_0x3909db);
        };
      }
    }
    _0x3befae = makeElement(_0x33808f, "div", "dialogCell dialogCellCenter dialogCellMiddle");
    (_0x266755 = makeElement(_0x3befae, "span")).innerHTML = "<span style=\"font-size:1.2rem;font-weight:700;\">&gt;</span>";
    _0x266755.onclick = function () {
      messages.PaintPage(_0x2019c7 + 1);
    };
  };
  this.InitPages = function (_0x56a436, _0x58e495, _0x176c5a, _0x373534) {
    var _0x1f5338;
    _0x234339 = _0x56a436;
    messages.Current = [];
    if (!(_0x2019c7 = _0x373534)) {
      _0x2019c7 = 0;
    }
    if (_0x176c5a) {
      _0x3c3d2b = _0x176c5a;
    }
    if (_0x58e495) {
      _0x23c24f = _0x58e495;
    }
    _0xb73c7a = _0x23c24f * _0x3c3d2b;
    switch (_0x56a436) {
      case "yel":
        messages.Current = syel;
        break;
      case "oth":
        messages.Current = soth;
        break;
      case "pow":
        for (_0x1f5338 in spow) {
          if (_0x1f5338.length != 0) {
            if (!(parseInt(_0x1f5338) > 0) && !((_0x4090b9 = xInt(spow[_0x1f5338])) <= 0)) {
              if (_0x1f5338 != "glow") {
                if (spowhave[_0x4090b9 >> 5] & 1 << _0x4090b9 % 32) {
                  _0x4090b9 += 90000;
                } else {
                  _0x4090b9 += 10000;
                }
                messages.Current.push(String(_0x4090b9) + _0x1f5338);
              }
            }
          }
        }
        messages.Current.sort(_0x424989);
        break;
      default:
        messages.Current.push(_0x56a436);
        var _0x4090b9 = spow[_0x56a436];
        for (_0x1f5338 in stop) {
          if (stop[_0x1f5338] == _0x4090b9) {
            messages.Current.push(_0x1f5338);
          }
        }
    }
    _0x2f08a9 = parseInt(messages.Current.length / _0xb73c7a - 0.00001) + 1;
    messages.PaintPage(_0x2019c7);
  };
  this.clickSmilie = function () {
    var _0x43e610 = event.currentTarget.dataset.code;
    switch (_0x43e610) {
      case "i1yel":
      case "i1oth":
      case "i1pow":
        messages.InitPages(_0x43e610.substr(2));
        return;
      default:
        if (_0x43e610.charAt(0) == "$") {
          messages.InitPages(_0x43e610.substr(1));
          return;
        }
        document.getElementById("textEntryEditable").textContent += " (" + _0x43e610 + ") ";
        modalClose();
    }
  };
  this.setScroller = function (_0x38be54) {};
}();