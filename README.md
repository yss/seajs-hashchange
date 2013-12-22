# seajs-hashchange
    A Sea.js application for one page mode base on hashchange.

## Usage

```js
seajs.use('path/to/seajs-hashchange.js', function(HashChange) {
    // default: / is equivalent to /#id=index
    HashChange({
        id: 'id',
        defaultValue: 'index'
    }).on('loading', function(newParams, oldParams) {
        // only exec when load from server
        alert(seajs.resolve(newParams['id']) + ' is loading...');
    }).on('loaded', function(newParams, oldParams) {
        // only exec when loaded from server
        alert(seajs.resolve(newParams['id']) + ' is loaded.'); 
    }).on('changed', function(newParams, oldParams) {
        // run after every hash change
    });
});
```

## implement

some api must be implement form running js. There are: init, show, hide.

### init(newParams, oldParams, instance)

### show(newParams, oldParams, instance)

### hide(oldParams, newParams, instance)

## Finally

Anyway, see examples in the `examples/` directory.
