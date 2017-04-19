(function(global) {
  var Retry = function(options) {
    options = options || {};
    this._timeout = options.timeout;
    this._max = options.max || Infinity;
    this._interval = options.interval || 0;
    this._done = options.done;
    this._fail = options.fail;
  };
  Retry.prototype = {
    start: function(fn) {
      var tried = 0;
      var _this = this;
      var timer;
      this._stop = false;
      if (this._timeout) {
        timer = setTimeout(function() {
          if (_this._fail && !_this._stop) {
            _this._fail('timeout');
          }
          _this._stop = true;
        }, this._timeout);
      }
      (function tryfn() {
        if (!_this._stop) {
          console.log('>>>>>> tried ++' + tried)
          tried++;
          if (tried > _this._max) {
            if (_this._fail && !_this._stop) {
              _this._fail('exceedmax');
            }
            clearTimeout(timer);
          } else {
            fn(function done() {
              if (_this._done && !_this._stop) {
                _this._done.apply(_this, arguments);
              }
              clearTimeout(timer);
            }, function retry() {
              if (_this._interval) {
                setTimeout(tryfn, _this._interval);
              } else {
                tryfn();
              }
            });
          }
        }
      })();
    },
    stop: function() {
      this._stop = true;
    }
  };

  if (typeof module !== 'undefined') {
    module.exports = Retry;
  }

  if (global) {
    global.Retry = Retry;
  }

})(this);
