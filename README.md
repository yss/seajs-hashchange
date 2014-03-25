# seajs-hashchange
    A Sea.js application for one page mode base on hashchange.

## Flow Chart

![hashchange flow chart](hashchange-flowchart.png)

This picture is show how seajs-hashchange work.

## Events Chart

![hashchange events](hashchange-events.png)

This picture is show the time that events emit.

## Usage

```js
seajs.use('path/to/seajs-hashchange.js', function(HashChange) {
    // default: / is equivalent to /#id=index or /?id=index
    HashChange({
        // id: 'id',
        // defaultValue: 'index',
        // hashKey: '#',
        // for load more ids or not ids
        getId: function(id) {
            switch(id) {
                case 'plainPage':
                case 'noJsPage':
                    return;
                case 'moreJs':
                    return ['moreJs', 'otherJS'];
                default:
                    return [id];
            }
        }
    }).on('show', function(my) {
        // run before exec show function of show module.
        document.getElementById(my.id).style.display = 'block';
    }).on('hide', function(my) {
        // run before exec hide function of the hide module.
        document.getElementById(my.id).style.display = 'none';
    }).on('loading', function(my) {
        // only exec when load from server
        console.log(seajs.resolve(my.id) + ' is loading');
    }).on('loaded', function(my) {
        // only exec when loaded from server
        console.log(seajs.resolve(my.id) + ' is loaded');
    }).on('change', function(my) {
        // run before every hash change
        console.log('going to change...');
    }).on('changed', function(my, old) {
        // run after every hash change
        console.log(my.id +' page is show! ' + old.id + ' page is hided!');
    }).change(); // init
});
```

## implement

some method will after every hashchange.
some api should be implement from running js. There are: init, show, hide.

### init(newParams, oldParams)

### show(newParams, oldParams)

### hide(oldParams, newParams)

## Finally

Anyway, see examples in the `examples/` directory.
