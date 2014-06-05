app.filter('duration', function() {
    return function(input) {

        return ((input) % (60 * 60 * 24) / (60 * 60) | 0) + 'h ' +
            ((input) % (60 * 60) / 60 | 0) + 'min ' +
            ((input) % 60 | 0) + 's';

    };
});


app.filter('startFrom', function() {
    return function(input, start) {
        start = +start; //parse to int
        var returnValue = 0;

        if( input && Object.prototype.toString.call( input ) === '[object Array]' ) {
            returnValue = input.slice(start);
        }

        return returnValue;
    }
});