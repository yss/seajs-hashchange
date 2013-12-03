define('t', [], function() {
    return {
        show: function(my, old) {
            console.log('show: ' + my.id + ' hide: ' + old.id);
        },
        hide: function(my, old) {
            console.log('hide: ' + my.id + ' show: ' + old.id);
        },
        init: function(my, old) {
            console.log('init ' + my.id);
        }
    }
});
