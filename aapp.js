(function () {
'use strict';
var narrowItDownApp = angular.module("NarrowItDownApp",[])
    .controller("narrowItDownController", narrowItDownController)
    .directive("foundItems",foundItems)
    .service("MenuSearchService", MenuSearchService)
    

MenuSearchService.$inject = ['$http']
function MenuSearchService($http){
    var self = this;
    self.found = [];
    self.getMatchedMenuItems  = function(userFilter){
        return $http({method:'get',url:'https://davids-restaurant.herokuapp.com/menu_items.json'})
            .then(function (response){
                var matchedItem = getOnlyWantedData(response.data,userFilter);
                return matchedItem;
            })
    };

    function getOnlyWantedData(data,userFilter){
        var found = [];
        if (!userFilter || userFilter.length == 0) {
            return found;
        }
        userFilter = userFilter.trim();
        var i=0;
        for(i=0;i<data.menu_items.length;i++){
            if (data.menu_items[i].description.indexOf(userFilter) != -1){
                found.push(data.menu_items[i]);
            };
        };
        return found;
    };
};

narrowItDownController.$inject = [ 'MenuSearchService'];
function narrowItDownController(MenuSearchService){
    var ctrl = this
    ctrl.found;
    ctrl.getData = function(){
        MenuSearchService.getMatchedMenuItems (ctrl.userFilter)
            .then(function(_data){
                ctrl.found  = _data;
            }
        );
    };

    ctrl.removeItem = function(itemIndex) {
        ctrl.found.splice(itemIndex, 1);
    }   
}

function foundItems(){
    return foundItems = {
        template : '<div><ul><li ng-repeat="item in items">{{item.name}} ,{{item.short_name}}, {{item.description}}' +
        '<button class="btn btn-danger" ng-click="remove({index: $index})">Don\'t want this one</button></li></ul>'+
        '<label class="error">Nothing found</label></div>',
        link : foundItemDirectiveLink,
        scope : {
            items : "<items",
            remove : "&onRemove"
        }
        
    }
}

function foundItemDirectiveLink (scope, element, attrs, controller) {
    scope.$watch('items', function (newValue, oldValue){
        if (newValue && newValue.length ==0 ){
            displayError()
        }
        else {
            removeError()
        }

         function displayError (){
     var warningElment = element.find("label")
     warningElment.css('display', 'block');
 }

 function removeError (){
     var warningElment = element.find("label")
     warningElment.css('display', 'none');
 }
    });
}
})();