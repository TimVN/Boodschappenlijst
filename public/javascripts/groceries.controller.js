/**
 * Created by Tim on 16-2-2017.
 */
angular.module('Master').controller('GroceriesController', ['$scope', 'socket', 'prompt', function($scope, server, prompt) {
    var Groceries = this;

    Groceries.today = [];

    server.on('return:grocery_list', function(groceries) {
       Groceries.today = groceries;
    });

    server.on('return:groceries_changed', function() {
        Groceries.refresh();
    });

    Groceries.refresh = function() {
        server.emit('query:grocery_list_today');
    };

    Groceries.addGrocery = function() {
        prompt({
            title: 'Boodschap toevoegen',
            message: 'Wat moet je?',
            input: true,
            buttons: [
                {
                    label: 'Annuleren',
                    cancel: true,
                    primary: false,
                },
                {
                    label: 'Opslaan',
                    cancel: false,
                    primary: true
                }
            ]
        }).then(function(item){
            server.emit('insert:grocery', item);
        });
    };

    Groceries.deleteGrocery = function(id) {
        prompt({
            title: 'Boodschap verwijderen',
            message: 'Weet je het zeker?',
        }).then(function(item){
            server.emit('delete:grocery', id);
        });
    };

    Groceries.refresh();
}])
.config( [
    '$compileProvider',
    function( $compileProvider )
    {
        $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|steam|mailto|chrome-extension):/);
    }
]);