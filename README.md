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
            alert(seajs.resolve(newParams['id']) + ' is loading...');
        }
    });
});
```

## API

some api must be implement. like:

### init(newParams, oldParams)

### show(newParams, oldParams)

### hide(oldParams, newParams)
