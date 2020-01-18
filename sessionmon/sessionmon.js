var SessionMon = /** @class */ (function () {
    function SessionMon(options) {
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
            console.log("session extended at " + new Date().getTime());
        };
        this.intervalHandler = function () {
            _this.intervalCount++;
            console.log(_this.intervalCount);
            var remaining = _this._options.logoutAfterSeconds - _this.intervalCount;
            var counterElement = _this._options.modalElement.querySelector('.sessionmon-counter');
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
                document.querySelector('#logoutNotification').style.display = 'block';
            }
        };
        this._options = options;
        EventHandlers.add('click', this._options.modalElement.querySelector('.sessionmon-button'), this.extendSession);
        EventHandlers.add('mouseup', window, this.handleInteraction);
        EventHandlers.add('keyup', window, this.handleInteraction);
        this.reset();
        this._interval = window.setInterval(this.intervalHandler, 1000);
    }
    SessionMon.start = function (options) {
        var instance = new SessionMon(options);
        return instance;
    };
    SessionMon.prototype.reset = function () {
        this.intervalCount = 0;
    };
    SessionMon.prototype.padZeroes = function (value, length) {
        var n = value + '';
        return n.length >= length ? n : new Array(length - n.length + 1).join('0') + n;
    };
    SessionMon.prototype.showModal = function () {
        if (!this._options.modalElement.classList.contains('open')) {
            var backdropElement = this._options.modalElement.querySelector('.modal-backdrop');
            this.disableScroll();
            backdropElement.style.top = this.scrollTop + 'px';
            this._options.modalElement.classList.add('open');
        }
    };
    SessionMon.prototype.hideModal = function () {
        document.querySelector('#logoutNotification').style.display = 'none';
        if (this._options.modalElement.classList.contains('open')) {
            this._options.modalElement.classList.remove('open');
            this.enableScroll();
        }
    };
    SessionMon.prototype.disableScroll = function () {
        document.querySelector('body').classList.add('stop-scrolling');
        EventHandlers.add('touchmove', window, this.preventDefault);
    };
    SessionMon.prototype.enableScroll = function () {
        document.querySelector('body').classList.remove('stop-scrolling');
        EventHandlers.remove('touchmove', window, this.preventDefault);
    };
    SessionMon.prototype.preventDefault = function (e) {
        e = e || window.event;
        if (e.preventDefault) {
            e.preventDefault();
        }
        e.returnValue = false;
    };
    Object.defineProperty(SessionMon.prototype, "scrollTop", {
        get: function () {
            return window.pageYOffset !== undefined
                ? window.pageYOffset
                : (document.documentElement || document.body).scrollTop;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SessionMon.prototype, "intervalCount", {
        get: function () {
            return parseInt(Cookies.getCookie('sessionmon_intervalCount')) || 0;
        },
        set: function (value) {
            Cookies.setCookie('sessionmon_intervalCount', (value || 0).toString());
        },
        enumerable: true,
        configurable: true
    });
    return SessionMon;
}());
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
