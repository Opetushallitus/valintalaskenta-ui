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

        if(start > -1 && input && Object.prototype.toString.call( input ) === '[object Array]' ) {
            returnValue = input.slice(start);
        }

        return returnValue;
    }
});

app.filter('julkaistuHaku', function() {
    return function(input) {
        var result = [];
        for(var i = 0; i < input.length ; i++) {
            if(input[i].tila === 'JULKAISTU') {
                result.push(input[i]);
            }
        }
        return result;
    }
});