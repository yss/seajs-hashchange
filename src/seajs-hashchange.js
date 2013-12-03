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
         * @config [String] config.id default: "id"
         * @config [String] config.defaultValue default: "index"
         * @config [Function] config.loading called when loading new js from server.
         * @config [Function] config.callback called when every hash change.
     */
    function HashChange(config) {
        if (!(this instanceof HashChange)) {
            return new HashChange(config);
        }

        // default: http://xxx.xx/#id=index
        this.config = {
            id: 'id',
            defaultValue: 'index'
        };
        config && cover(this.config, config);

        this.init();
        return this;
    }

    cover(HashChange.prototype, {
        /**
         * listen hashchange
         * @param {Function}
         */
        attach: function(fn) {
            if ('on' + HASH_CHANGE in win.document.body) {
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
         * @param [String] url
         * @return {Object} default: {}
         */
        getHashParams: function(url) {
            var params = {};
            if (url) {
                url = ('' + url).split('#')[1];
                url && url.replace(/([^=&]+)=([^&]*)/g, function($0, $1, $2) {
                    // params[$1] = $2 && JSON.parse($2);
                    params[$1] = $2;
                });
            }
            return params;
        },

        /**
         * dispatch function, the part of core.
         * @param [EventObject|Object] e
         */
        hashchange: function(e) {
            // for ie
            e = e || win.event;
            var _this = this,
                _getHashParams = _this.getHashParams,
                _config = _this.config,
                _id = _config.id,
                oldParams = _getHashParams(e.oldURL),
                newParams = _getHashParams(e.newURL),
                oldId = oldParams[_id] = e.type && (oldParams[_id] || _config.defaultValue),
                newId = newParams[_id] = newParams[_id] || _config.defaultValue,
                newModule;

            newModule = seajs.require(newId);
            // module is loaded.
            if (newModule) {
                _this.show(newId, newModule, newParams, oldParams);
            } else {
                _config.loading && _config.loading(newParams, oldParams);
                seajs.use(newId, function(mod) {
                    _this.show(newId, mod, newParams, oldParams);
                });
            }
            // not the first call
            if (oldId) {
                seajs.require(oldId).hide(oldParams, newParams);
            }

            _config.callback && _config.callback();
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
                mod.init(newParams, oldParams);
                this.load[id] = true;
            }
            mod.show(newParams, oldParams);
        },

        /**
         * initialize function
         */
        init: function() {
            var _this = this;
            // init load object
            _this.load = {};
            // _this.attach(this.hashchange.bind(_this));
            _this.attach(function() {
                _this.hashchange.apply(_this, arguments);
            });
            // first call
            _this.hashchange({
                newURL: win.location.href
            });
        }
    });

    return HashChange;
});
