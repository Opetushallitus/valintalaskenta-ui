app.filter('duration', function() {
    return function(input) {

        return ((input) % (60 * 60 * 24) / (60 * 60) | 0) + 'min ' +
            ((input) % (60 * 60) / 60 | 0) + 's ' +
            ((input) % 60 | 0) + 'ms';

    };
});