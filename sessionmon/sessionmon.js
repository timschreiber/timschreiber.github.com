var KI;
(function (KI) {
    var JSLib;
    (function (JSLib) {
        var Session = /** @class */ (function () {
            function Session(options) {
                var _this = this;
                this.handleInteraction = function () {
                    if (!_this._options.modalElement.classList.contains('open')) {
                        if (_this._timeout) {
                            clearTimeout(_this._timeout);
                        }
                        _this._timeout = setTimeout(_this.extendSession, 1000);
                    }
                };
                this.extendSession = function () {
                    _this.reset();
                    _this.hideModal();
                    console.log("Session extended at " + new Date().getTime());
                };
                this.intervalHandler = function () {
                    _this.intervalCount++;
                    console.log(_this.intervalCount);
                    var remaining = _this._options.logoutAfterSeconds - _this.intervalCount;
                    var counterElement = _this._options.modalElement.querySelector('.session-counter');
                    var mins = _this.padZeroes(Math.max(Math.floor(remaining / 60), 0), 2);
                    var secs = _this.padZeroes(Math.max(remaining % 60, 0), 2);
                    counterElement.innerHTML = mins + ':' + secs;
                    var triggerModalAt = _this._options.logoutAfterSeconds - _this._options.modalDurationSeconds;
                    if (_this.intervalCount < triggerModalAt) {
                        _this.hideModal();
                    }
                    else if (_this.intervalCount >= triggerModalAt && _this.intervalCount < _this._options.logoutAfterSeconds) {
                        _this.showModal();
                    }
                    else if (_this.intervalCount >= _this._options.logoutAfterSeconds) {
                        window.clearInterval(_this._interval);
                        console.log("User logged out at " + new Date().getTime());
                    }
                };
                this._options = options;
                EventHandlers.add('click', this._options.modalElement.querySelector('.session-button'), this.extendSession);
                EventHandlers.add('mouseup', window, this.handleInteraction);
                EventHandlers.add('keyup', window, this.handleInteraction);
                this.reset();
                this._interval = window.setInterval(this.intervalHandler, 1000);
            }
            Session.start = function (options) {
                var instance = new Session(options);
                return instance;
            };
            Session.prototype.reset = function () {
                this.intervalCount = 0;
            };
            Session.prototype.padZeroes = function (value, length) {
                var n = value + '';
                return n.length >= length ? n : new Array(length - n.length + 1).join('0') + n;
            };
            Session.prototype.showModal = function () {
                if (!this._options.modalElement.classList.contains('open')) {
                    var backdropElement = this._options.modalElement.querySelector('.modal-backdrop');
                    this.disableScroll();
                    backdropElement.style.top = this.scrollTop + 'px';
                    this._options.modalElement.classList.add('open');
                }
            };
            Session.prototype.hideModal = function () {
                if (this._options.modalElement.classList.contains('open')) {
                    this._options.modalElement.classList.remove('open');
                    this.enableScroll();
                }
            };
            Session.prototype.disableScroll = function () {
                document.querySelector('body').classList.add('stop-scrolling');
                EventHandlers.add('touchmove', window, this.preventDefault);
            };
            Session.prototype.enableScroll = function () {
                document.querySelector('body').classList.remove('stop-scrolling');
                EventHandlers.remove('touchmove', window, this.preventDefault);
            };
            Session.prototype.preventDefault = function (e) {
                e = e || window.event;
                if (e.preventDefault) {
                    e.preventDefault();
                }
                e.returnValue = false;
            };
            Object.defineProperty(Session.prototype, "scrollTop", {
                get: function () {
                    return window.pageYOffset !== undefined
                        ? window.pageYOffset
                        : (document.documentElement || document.body).scrollTop;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Session.prototype, "intervalCount", {
                get: function () {
                    return parseInt(Cookies.getCookie('session_intervalCount')) || 0;
                },
                set: function (value) {
                    Cookies.setCookie('session_intervalCount', (value || 0).toString());
                },
                enumerable: true,
                configurable: true
            });
            return Session;
        }());
        JSLib.Session = Session;
        var EventHandlers = /** @class */ (function () {
            function EventHandlers() {
            }
            EventHandlers.add = function (eventName, element, handler) {
                if (element.addEventListener) {
                    element.addEventListener(eventName, handler, false);
                }
                else if (element.attachEvent) {
                    element.attachEvent("on" + eventName, handler);
                }
                else {
                    element["on" + eventName] = handler;
                }
            };
            EventHandlers.remove = function (eventName, element, handler) {
                if (element.removeEventListener) {
                    element.removeEventListener(eventName, handler, false);
                }
                else if (element.detachEvent) {
                    element.detachEvent("on" + eventName, handler);
                }
                else {
                    element["on" + eventName] = undefined;
                }
            };
            return EventHandlers;
        }());
        JSLib.EventHandlers = EventHandlers;
        var Cookies = /** @class */ (function () {
            function Cookies() {
            }
            Cookies.setCookie = function (name, value, expires, path, domain, secure) {
                value = escape(value);
                var cookie = name + '=' + value +
                    (expires ? '; expires=' + expires.toUTCString() : '') +
                    (path ? '; path=' + path : '') +
                    (domain ? '; domain=' + domain : '') +
                    (secure ? '; secure' : '');
                document.cookie = cookie;
            };
            Cookies.getCookie = function (name) {
                var search = name + '=';
                if (document.cookie.length > 0) {
                    var offset = document.cookie.indexOf(search);
                    if (offset != -1) {
                        offset += search.length;
                        var end = document.cookie.indexOf(';', offset);
                        if (end == -1)
                            end = document.cookie.length;
                        return unescape(document.cookie.substring(offset, end));
                    }
                }
            };
            return Cookies;
        }());
        JSLib.Cookies = Cookies;
    })(JSLib = KI.JSLib || (KI.JSLib = {}));
})(KI || (KI = {}));
