var test = 55;
angular.module('ionic.utils', [])
    .factory('$localstorage', ['$window', function ($window) {
        return {
            set: function (key, value) {
                $window.localStorage[key] = value;
            },
            get: function (key, defaultValue) {
                return $window.localStorage[key] || defaultValue;
            },
            setObject: function (key, value) {
                $window.localStorage[key] = JSON.stringify(value);
            },
            getObject: function (key, defaultValue) {
                return JSON.parse($window.localStorage[key] || JSON.stringify(defaultValue));
            }
        }
    }]);
angular.module('starter', ['ionic', 'ionic.contrib.ui.cards', 'ionic.utils',])

    .run(function ($ionicPlatform, $localstorage) {
        $ionicPlatform.ready(function () {
            // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
            // for form inputs)
            if (window.cordova && window.cordova.plugins.Keyboard) {
                cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
            }
            if (window.StatusBar) {
                StatusBar.styleDefault();
            }
        });
    })

    .directive('noScroll', function ($document) {

        return {
            restrict: 'A',
            link: function ($scope, $element, $attr) {

                $document.on('touchmove', function (e) {
                    e.preventDefault();
                });
            }
        }
    })

    .factory('Data',function($localstorage){
        var Data=
        {

            "Math 137": [
                {title:"Limit",text:"a limit is...."},
                {title:"Continuity",text:"continuity means ..."}
            ],

            "Math 135":[
                {title:"GCDOO",text:"Let a= ...."},
                {title:"Fermat's little Theorem",text:"if p is a prime..."}],


            'demo':[{title: 'Swipe down to clear the card',text:''},
                {title: 'Where is this?',text:''},
                {title: 'What kind of grass is this?',text:''},
                {title: 'What beach is this?',text:''},
                {title: 'What kind of clouds are these?',text:''}]

        };

        var saveData=function(){
            $localstorage.set('data',JSON.stringify(Data));
        };
        return {
            //return Data object
            all:function(){
                return Data;
            },
            //append a category at the end of user's categories
            addCategory:function(categoryTitle){
                Data[categoryTitle]=[];
                saveData();
            },
            //
            removeCategory:function(catTitle){
                delete Data[catTitle];
                saveData();
            },
            addCard:function(card,catTitle){
                Data[catTitle].pushCard();
                saveData();
            },
            removeCard:function(catTitle,cardIndex){
                Data[catTitle].splice(cardIndex,1);
                saveData();
            },
            //
            moveCard:function(oldCatTitle,oldCardIndex,newCatTitle,newCardIndex){
                if(oldCatTitle===newCatTitle || newCatTitle=="undefined"){
                    var temp = Data[oldCatTitle][oldCardIndex];
                    Data[oldCatTitle].splice(oldCardIndex,1);
                    Data[oldCatTitle].insert(newCardIndex,temp);
                }else if(newCardIndex=="undefined"){
                    var temp = Data[oldCatTitle][oldCardIndex];
                    Data[oldCatTitle].splice(oldCardIndex,1);
                    Data[newCatTitle].push(temp);
                }
            }
        };
    })
    .controller('CardsCtrl', function ($scope,Data, $ionicSwipeCardDelegate, $ionicSideMenuDelegate, $ionicModal, $ionicActionSheet, $timeout, $localstorage) {
        //=============================Actual Cards Stuff =================================
        $scope.current = [{}];
        $scope.current.category = 'default';
        $scope.current.cardindex = 0;

        $scope.edit = [{}];

        $scope.showContent = true;
        $scope.data={};
        $scope.data.default = [
            {title: 'Swipe down to clear the card', text: '123'},
            {title: 'Where is this?',  text: '123'},
            {title: 'What kind of grass is this?',  text: '123'},
            {title: 'What beach is this?',  text: '123'},
            {title: 'What kind of clouds are these?',  text: '123'}
        ];
        $scope.data.default=Data.all()['Math 135'];
        $scope.cards = Array.prototype.slice.call($scope.data[$scope.current.category], 0, 0);

        $scope.cardSwiped = function (index) {
            $scope.addCard();
        };

        $scope.cardDestroyed = function (index) {
            $scope.cards.splice(index, 1);
        };

        $scope.addCard = function () {
            $scope.current.cardindex = Math.floor(Math.random() * $scope.data[$scope.current.category].length);
            var newCard = $scope.data[$scope.current.category][$scope.current.cardindex];
            newCard.id = Math.random();
            $scope.cards.push(angular.extend({}, newCard));
        }
        //=================================ACTION SHEET=================================
        $scope.show = function () {
            // Show the action sheet
            var hideSheet = $ionicActionSheet.show({
                buttons: [
                    {text: '<b>New</b>'},
                    {text: 'Edit'},
                    {text: 'Move'},
                    {text: $scope.showContent?'Hide All':'Show All'}
                ],
                destructiveText: 'Delete',
                titleText: 'Edit',
                cancelText: 'Cancel',
                cancel: function () {
                    // add cancel code..
                },
                buttonClicked: function (index) {
                    if (index == 0) {
                        $scope.openModal('new');
                    }
                    else if (index == 1) {
                        $scope.editstart($scope.current.category, $scope.current.cardindex);
                        $scope.openModal('edit');
                    }
                    else if (index == 2) {
                        alert("0");
                    }
                    else if (index == 3) {
                        $scope.showContent = !$scope.showContent;
                    }
                    return true;
                }
            });
            $timeout(function () {
                hideSheet();
            }, 20000);
        };
        //=================================Modals================================
        $ionicModal.fromTemplateUrl('templates/new-card.html', {
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function (modal) {
            $scope.modalnew = modal;
        });
        $ionicModal.fromTemplateUrl('templates/edit-card.html', {
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function (modal) {
            $scope.modaledit = modal;
        });
        $ionicModal.fromTemplateUrl('templates/menu.html', {
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function (modal) {
            $scope.modalmenu = modal;
        });
        $scope.openModal = function (id) {
            if (id == "new"){
                $scope.modalnew.show();
            }
            else if (id == "menu") {
                $scope.modalmenu.show();
            }
            else if (id == "edit") {
                $scope.modaledit.show();
            }
        };
        $scope.closeModal = function (id) {
            if (id == "new")
                $scope.modalnew.hide();
            else if (id == "menu")
                $scope.modalmenu.hide();
            else if (id == "edit") {
                $scope.modaledit.hide();
            }
        };
        //=========================Edit Panel=================================
        $scope.editstart = function (category, index) {
            $scope.edit.title = $scope.data[category][index].title;
            $scope.edit.text = $scope.data[category][index].text;
            alert($scope.edit.title);
        };
        $scope.edit = function () {
            $scope.data[$scope.current.category][$scope.current.cardindex].title = $scope.edit.title;
            $scope.data[$scope.current.category][$scope.current.cardindex].text = $scope.edit.text;
            $scope.closeModal ('edit');
        };
    })

    .controller('CardCtrl', function ($scope, $ionicSwipeCardDelegate) {
        $scope.goAway = function () {
            var card = $ionicSwipeCardDelegate.getSwipebleCard($scope);
            card.swipe();
        };
    })

;