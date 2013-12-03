/**
 * A Sea.js application for one page mode base on hashchange.
 */

define(function(require) {
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
         * @param [String] config.id default: "id"
         * @param [String] config.defaultValue default: "index"
         * @param [Function] config.loading called when loading new js.
     */
    function HashChange(config) {
        if (!(this instanceof HashChange)) {
            return new HashChange(config);
        }

        // default: http://xxx.xx/#tmp=hp
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
         * @param [EventObject] e
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
                oldModule,
                newModule;

            if (!newParams[_id]) {
                newParams[_id] = _config.defaultValue;
            }

            newModule = seajs.require(newParams[_id]);
            // module is loaded.
            if (newModule) {
                newModule.show(newParams, oldParams);
            } else {
                _config.loading && _config.loading(newParams, oldParams);
                seajs.use(newParams[_id], function(mod) {
                    mod.init(newParams, oldParams);
                    mod.show(newParams, oldParams);
                });
            }
            // not the first call
            if (e.type) {
                seajs.require(oldParams[_id] || _config.defaultValue).hide(oldParams, newParams);
            }
        },

        /**
         * initialize function
         */
        init: function() {
            // this.attach(this.hashchange.bind(this));
            var _this = this;
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
