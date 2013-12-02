/*
   These filters & directives can be used to do in memory pagination (where results are added to list
   when user scrolls down, or backend paging, with in memory style scrolling.


for Inmemory:

    <table pagination-paginated-element>
        <tbody>
            <tr ng-repeat="hakemus in model.hakemukset | pagination">
            ...
            </tr>
        </tbody>
    </table>


For backend:

    <div pagination-page-list></div>
    <table pagination-paginated-element model="model">
        <tbody>
            <tr ng-repeat="hakemus in model.hakemukset | pagination">
            ...
            </tr>
        </tbody>
    </table>

For backend scrolling model has to contain 2 methods getTotalResults() and refresh(index, count)

*/

app.filter('pagination', function(InMemoryPaginator) {
   return function(input) {
           InMemoryPaginator.setTotalItems(input.length);
           return input.slice(0, InMemoryPaginator.inMemoryTo() );
   }
});
app.directive('paginationPaginatedElement', function ($timeout, Paginator, InMemoryPaginator) {
       return {
        scope: true,
        link: function ( scope, element, attrs ) {

            Paginator.setModel(scope[attrs.model]);

            var oldBottom = 0;
            var oldDocument = 0;
            var checkHeight = function(){
              var docViewTop = $(window).scrollTop();
              var docViewBottom = docViewTop + $(window).height();
              var elemTop = $(element).offset().top;

              var elemBottom = elemTop + $(element).height();

              if(elemBottom < docViewBottom && oldBottom != elemBottom) {
                  scope.$apply(function() {
                       console.debug("Scroll triggered");
                        InMemoryPaginator.showMore();
                     // scope.lazyLoading();
                      oldBottom = elemBottom;
                  });

                  $timeout(checkHeight,10);
              }
              else {
                $(window).scroll(function(e) {
                    var documentHeight = $(document).height();
                    if($(window).scrollTop() + $(window).height() >= documentHeight * .9 && oldDocument != documentHeight) {
                        scope.$apply(function() {
                           // scope.lazyLoading();
                              console.debug("Scroll triggered");
                            InMemoryPaginator.showMore();
                            oldDocument = documentHeight;
                        });
                    }
                });
              }
            };
            $timeout(checkHeight,10);
        }
    };
});

app.service('InMemoryPaginator', function ($rootScope) {
    var SCROLL_SIZE = 100;
    this.totalInMemoryItems = 0;
    this.shownInMemoryItems = 0;
    this.inMemoryTo = function() {
        return Math.min(this.shownInMemoryItems,this.totalInMemoryItems);
    };
    this.showMore = function() {
        this.shownInMemoryItems +=SCROLL_SIZE;
    };
    this.reset = function() {
        this.shownInMemoryItems = SCROLL_SIZE;
    }
    this.setTotalItems = function(items) {
        this.totalInMemoryItems = items;
    }
});

app.service('Paginator', function ($rootScope, InMemoryPaginator) {

    var ITEMS_PER_PAGE = 500;

    this.model =  null;
    this.index = 0;
    this.setModel = function(model) {
        this.model = model;
    }
    this.totalResults = function() {
        return this.model.getTotalResults();
    }
    this.currentPage = function() {
        return Math.floor(this.index / ITEMS_PER_PAGE);
    }
   this.pageCount = function () {
        return Math.ceil(this.totalResults()/ITEMS_PER_PAGE);
    };
    this.changePage = function(page) {
       InMemoryPaginator.reset();
       this.index=parseInt(page)*ITEMS_PER_PAGE;
       this.model.refresh(this.index, ITEMS_PER_PAGE);
    }
    this.from = function() {
        return this.index;
    }
    this.to = function() {
       return Math.min(this.totalResults(), this.index+ITEMS_PER_PAGE);
    }
});

app.directive('paginationPageList', function(Paginator, InMemoryPaginator) {
    return {
       // restrict:'E',
        controller: function ($scope, Paginator) {
            $scope.paginator = Paginator;
            $scope.inMemoryPaginator = InMemoryPaginator;
        },
        templateUrl: '../js/pagination/paginationControl.html'
    };
});

app.filter('forLoop', function() {
    return function(input, start, end) {
        input = new Array(end - start);
        for (var i = 0; start < end; start++, i++) {
            input[i] = start;
        }

        return input;
    }
});
