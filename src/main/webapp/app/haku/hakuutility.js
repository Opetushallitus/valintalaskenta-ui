

angular.module('valintalaskenta')

    .service('HakuUtility', ['_', function (_) {
        this.isKKHaku = function (haku) {
            // if haku.kohdejoukkoUri contains string '_12' then haku is korkeakouluhaku
            return _.has('kohdejoukkoUri', haku) ? _.contains(haku.kohdejoukkoUri, "_12") : false;
        };
    }]);