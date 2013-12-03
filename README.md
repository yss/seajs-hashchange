# seajs-hashchange
    A Sea.js application for one page mode base on hashchange.

## Usage

```js
seajs.use('path/to/seajs-hashchange.js', function(HashChange) {
    // default: / is equivalent to /#id=index
    HashChange({
        id: 'id',
        defaultValue: 'index',
        loading: function(newParams, oldParams) {
            // only exec when load from server
            alert(seajs.resolve(newParams['id']) + ' is loading...');
        },
        callback: function(newParams, oldParams) {
            // run when every hash change
        }
    });
});
```

## implement

some api must be implement form running js. like:

### init(newParams, oldParams)

### show(newParams, oldParams)

### hide(oldParams, newParams)

## Finally

Anyway, see examples in the `examples/` directory.
