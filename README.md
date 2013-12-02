# seajs-hashchange
    A Sea.js application for one page mode base on hashchange.

## Usage

```js
seajs.use('path/to/seajs-hashchange.js', function(HashChange) {
    // default: / is equivalent to /#id=index
    HashChange({
        id: 'id',
        defaultValue: 'index',
        loading: function(params) {
            alert(seajs.resolve(params['id']) + ' is loading...');
        }
    });
});
```
