/**
 * A Sea.js application for one page mode base on hashchange.
 */

define(function() {
    "use strict";
    var win = window,
        HASH_CHANGE = 'hashchange';

    // cover origin object
    function cover(o, s) {
        for (var key in s) {
            o[key] = s[key];
        }
    }

    /**
     * Main function
     * @class HashChange
     * @param {Object} config
         * @config {String} config.id default: "id"
         * @config {String} config.defaultValue default: "index"
         * @config {String} config.hashKey default: "#"
         * @config {Function} config.getId default: function(id) { return id; }
     */
    function HashChange(config) {
        if (!(this instanceof HashChange)) {
            return new HashChange(config);
        }

        // default: http://xxx.xx/#id=index (Firstly)
        // or http://xxx.xx/?id=index
        this.config = {
            id: 'id',
            defaultValue: 'index',
            hashKey: '#',
            getId: function(id) {
                return [id];
            }
        };
        config && cover(this.config, config);

        // init events object
        this.events = {};

        return this;
    }

    cover(HashChange.prototype, {
        /**
         * listen hashchange
         * @param {Function}
         */
        attach: function(fn) {
            if (('on' + HASH_CHANGE) in win) {
                return win['on' + HASH_CHANGE] = fn;
            }
            // refer: https://developer.mozilla.org/zh-CN/docs/Mozilla_event_reference/hashchange
            var location = win.location,
                oldURL = location.href,
                oldHash = location.hash;

            // check the location hash on a 100ms interval
            setInterval(function() {
                var newURL = location.href,
                    newHash = location.hash;

                // if the hash has changed and a handler has been bound...
                if (newHash != oldHash) {
                    // execute the handler
                    fn({
                        type: HASH_CHANGE,
                        oldURL: oldURL,
                        newURL: newURL
                    });

                    oldURL = newURL;
                    oldHash = newHash;
                }
              }, 100);
        },

        /**
         * parse given url return parameter of hash.
         * @param {String} [url]
         * @return {Object} default: {}
         */
        getHashParams: function(url) {
            var params = {},
                splitKey = this.config.hashKey;
            if (url) {
                url += '';
                if (!~url.indexOf(splitKey)) {
                    splitKey = '?';
                }
                url = url.split(splitKey)[1];
                url && url.replace(/([^=&]+)=([^&]*)/g, function($0, $1, $2) {
                    // params[$1] = $2 && JSON.parse($2);
                    params[$1] = decodeURIComponent($2);
                });
            }
            return params;
        },

        /**
         * fix for some some browser has no newURL in hashchange event.
         * @param {Event||Object} e
         * @return {Event||Object}
         */
        getEvent: function(e) {
            // for ie
            e = e || win.event;
            if (!e || !e.newURL) {
                var url = location.href;
                e = {
                    newURL: url,
                    oldURL: this.oldURL || ''
                };
                this.oldURL = url;
            }
            return e;
        },

        /**
         * dispatch function, the core of hashchange.
         * @param {EventObject|Object} [e]
         */
        hashchange: function(e) {
            e = this.getEvent(e);
            var _this = this,
                _config = _this.config,
                _id = _config.id,
                oldParams = _this.getHashParams(e.oldURL),
                newParams = _this.getHashParams(e.newURL),
                oldId = oldParams[_id] = e.oldURL && (oldParams[_id] || _config.defaultValue),
                newId = newParams[_id] = newParams[_id] || _config.defaultValue,
                newModule;

            // the same
            if (newId === oldId) {
                return;
            }
            _this.emit('change', newParams, oldParams);

            _this.hide(oldId, newParams, oldParams);

            newId = _config.getId(newId);
            // null, undefined, '', []
            if (!newId || !newId.length) {
                return _this.emit('show', newParams, oldParams);
            }
            newModule = seajs.require(newId[0]);
            // module is loaded.
            if (newModule) {
                _this.show(newId[0], newModule, newParams, oldParams);
            } else {
                _this.emit('loading', newParams, oldParams);
                seajs.use(newId, function(mod) {
                    _this.emit('loaded', newParams, oldParams);
                        _this.show(newId[0], mod, newParams, oldParams);
                });
            }

            _this.emit('changed', newParams, oldParams);
        },

        /**
         * bind event
         * @param {String} name
         * @param {Function} callback
         */
        on: function(name, callback) {
            (this.events[name] || (this.events[name] = [])).push(callback);
            return this;
        },

        /**
         * emit event.
         * ...[name, arg1, arg2, ..]
         */
        emit: function() {
            var args = [].slice.call(arguments),
                list = this.events[args.shift()],
                fn;

            if (list) {
                list = list.slice();

                while((fn = list.shift())) {
                    fn.apply(this, args);
                }
            }
        },

        /**
         * Remove event.
         * @param {String} name
         * @param {Function} callback
         */
        off: function(name, callback) {
            // Remove *all* events
            if (!(name || callback)) {
                this.events = {};
                return this;
            }

            var list = this.events[name];
            if (list) {
                if (callback) {
                    for (var i = list.length - 1; i >= 0; i--) {
                        if (list[i] === callback) {
                            list.splice(i, 1);
                        }
                    }
                }
                else {
                    delete this.events[name];
                }
            }

            return this;
        },

        /**
         * hide module
         * @param {String} id
         * @param {Object} newParams
         * @param {Object} oldParams
         */
        hide: function(id, newParams, oldParams) {
            if (id) {
                this.emit('hide', oldParams, newParams);
                var ids = this.config.getId(id), mod;
                if (!ids || !ids.length) {
                    return;
                }
                mod = seajs.require(id);
                mod && mod.hide && mod.hide(oldParams, newParams);
            }
        },

        /**
         * show the new module
         * @param {String} id
         * @param {Object} mod
         * @param {Object} newParams
         * @param {Object} oldParams
         */
        show: function(id, mod, newParams, oldParams) {
            if (!this.load[id]) {
                mod.init && mod.init(newParams, oldParams);
                this.load[id] = true;
            }
            this.emit('show', newParams, oldParams);
            mod.show && mod.show(newParams, oldParams);
        },

        /**
         * initialize function
         */
        change: function() {
            var _this = this;
            // init load object
            _this.load = {};
            // _this.attach(this.hashchange.bind(_this));
            _this.attach(function() {
                _this.hashchange.apply(_this, arguments);
            });
            // first call
            _this.hashchange();
        }
    });

    return HashChange;
});
