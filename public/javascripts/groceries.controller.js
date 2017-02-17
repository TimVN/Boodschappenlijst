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
                    label: 'Volgende',
                    cancel: false,
                    primary: true
                }
            ]
        }).then(function(name){
            let tmp = Groceries.getOnName(name.toLowerCase());
            if (tmp)
            {
                Groceries.editGrocery(tmp);
            }
            else
            {
                prompt({
                    title: 'Boodschap toevoegen',
                    message: 'Hoeveel?',
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
                }).then(function (amount) {
                    let n = Math.floor(Number(amount));
                    if (String(n) === amount && n > 0) {
                        server.emit('insert:grocery', {name: name, amount: amount});
                    }
                });
            }
        });
    };

    Groceries.editGrocery = function(grocery) {
        prompt({
            title: 'Boodschap toevoegen',
            message: 'Hoeveelheid aanpassen',
            input: true,
            value: grocery.amount,
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
        }).then(function (amount) {
            let n = Math.floor(Number(amount));
            if (String(n) === amount && n > 0) {
                server.emit('update:grocery', {id: grocery.id, amount: amount});
            }
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

    Groceries.getOnName = function(name) {
        for(let i=0; i<Groceries.today.length; i++)
        {
            if (Groceries.today[i].name.toLowerCase()==name.toLowerCase())
            {
                return Groceries.today[i];
            }
        }
        return false;
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