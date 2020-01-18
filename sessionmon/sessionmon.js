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
                location.href = "https://google.com";
            }
        };
        this._options = options;
        this._options.modalElement.querySelector('.sessionmon-button').addEventListener('click', this.extendSession);
        window.addEventListener('mouseup', this.handleInteraction);
        window.addEventListener('keyup', this.handleInteraction);
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
        if (this._options.modalElement.classList.contains('open')) {
            this._options.modalElement.classList.remove('open');
            this.enableScroll();
        }
    };
    SessionMon.prototype.disableScroll = function () {
        document.querySelector('body').classList.add('stop-scrolling');
        window.addEventListener('touchmove', this.preventDefault);
    };
    SessionMon.prototype.enableScroll = function () {
        document.querySelector('body').classList.remove('stop-scrolling');
        window.removeEventListener('touchmove', this.preventDefault);
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
            var nameEq = 'sessionmon_intervalCount=';
            var ca = document.cookie.split(';');
            for (var i = 0; i < ca.length; i++) {
                var c = ca[i];
                while (c.charAt(0) === ' ') {
                    c = c.substring(1, c.length);
                }
                if (c.indexOf(nameEq) == 0) {
                    return parseInt(c.substring(nameEq.length, c.length));
                }
            }
            return 0;
        },
        set: function (value) {
            document.cookie = "sessionmon_intervalCount=" + value + ";expires=0;path=/";
        },
        enumerable: true,
        configurable: true
    });
    return SessionMon;
}());
