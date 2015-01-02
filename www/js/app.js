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
angular.module('starter', ['ionic', 'ionic.contrib.ui.cards', 'ionic.utils'])

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
    .directive('stopEvent', function () {
        return {
            restrict: 'A',
            link: function (scope, element, attr) {
                element.bind('click', function (e) {
                    e.stopPropagation();
                });
            }
        };
    })
/*
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

            'Demo':[{title: 'Swipe down to clear the card',text:''},
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
    })*/
    .controller('CardsCtrl', function ($scope, $ionicSwipeCardDelegate, $ionicModal, $ionicActionSheet, $timeout, $localstorage, $ionicPopup, $ionicPopover) {
        //=============================Initialize $scope variables=================================
        $scope.current = $localstorage.getObject('current', {category: 'Demo', cardindex: [0], random: true});
        $scope.showContent = true;
        $scope.edit = [{}];
        $scope.alert = function (string) {
            alert(string);
        };
        $scope.current.cardFilter={colorTag:null};
        $scope.defaultCard = {
            title: "Empty Category",
            text: "Create a new card",
            colorTag: "red"
        };

        $scope.data = $localstorage.getObject ('data',{
            "Math 137": [
                {"title": "One-to-one Functions", "text": "A function f is one to one when, for x1, x2 are in the domain of f, f(x1)=f(x2)=> x1=x2", "colorTag": "yellow"},
                {"title": "Limit Laws", "text": "If lim f(x) = L as x->a and lim g(x) = M as x->a both exists, then\n1. lim [f(x) +or– g(x)] as x->a = L +or- M;\n2. lim [f(x) x g(x)] as x->a = LM;\n3. lim [f(x) / g(x)] as x->a = L/M, provided that M≠0;\n4. f(x) is a basic function and M belongs to the domain of f => lim (f(g(x))) as x->a = f(M)", "colorTag": ""},
                {"title": "Squeeze Theorem", "text": "If f(x)<=g(x)<=h(x) for all x (except possibly x=a) and lim f(x) = L as x->a = lim h(x) = L as x->a, then lim g(x) = L as x->a", "colorTag": ""},
                {"title": "ε-δ Definition of a Limit", "text": "lim f(x) = L as x->a if and only if, for all ε>0, there exists a δ>0, such that 0 < |x-a| <δ => |f(x)-L| < ε", "colorTag": "blue"},
                {"title": "Definition of Continuity", "text": "A function f is cts at a if lim f(x) as x->a = f(a)", "colorTag": "blue"},
                {"title": "Continuity Theorems", "text": "If f and g are continuous at x=a, then the following functions are also continuous at x=a: 1.f +or- g 2. fg 3. f/g, provided g(a)≠0 4. f(g(x)), provided f is cts at g(a)", "colorTag": ""},
                {"title": "Intermediate Value Theorem (IVT)", "text": "If f is cts for all x in [a, b] and f(a) < 0 and f(b) > 0, then there exists a real number c in (a, b) such that f(c) = 0", "colorTag": ""},
                {"title": "L'Hôpital's Rule", "text": "If f and g are diff and g'(x)≠0 in an open interval I that contains a (except possibly at a) and either (lim f(x) = 0 as x->a and lim g(x) = 0 as x->a) or (lim f(x) = +or-∞ as x->a and lim g(x) = =or-∞ as x->a) and lim f’(x)/g’(x) as x->a exists, then lim f(x)/g(x) as x->a = lim f’(x)/g’(x) as x->a", "colorTag": ""},
                {"title": "Fermat's/Local Extremum Theorem", "text": "If f has a local extremum at point c and f'(c) exists, then f'(c)=0", "colorTag": ""},
                {"title": "Extreme Value Theorem (EVT)", "text": "If f is cts on a closed interval [a, b], then f attains an absolute maximum value f(c) and an absolute minimum value f(d) at some points c, d in [a,b]", "colorTag": ""},
                {"title": "Mean Value Theorem (MVT)", "text": "If a function f is cts on [a, b] and f is diff on (a, b), then there exists c in (a, b) such that f’(c) = [f(b) - f(a)]/(b-a)", "colorTag": ""},
                {"title": "Rolle's Theorem", "text": "If f(a)=f(b), then f'(c)=0 for a<c<b", "colorTag": ""},
                {"title": "Constant Function Theorem", "text": "If f'(x)=0 for all x in (a, b), then f is constant on (a, b)", "colorTag": ""},
                {"title": "Increasing/Decreasing Test", "text": "Suppose f is cts on [a, b] and diff on (a, b), then 1. if f'(x)>0 for all x in (a, b), then f is increasing on (a, b); 2. if f'(x)<0 for all x in (a, b) then f is decreasing on (a, b)", "colorTag": ""}
            ],
            "Math 135": [
                {title: "GCDOO", text: "Let a= ....", colorTag: ""},
                {title: "Fermat's little Theorem", text: "if p is a prime...", colorTag: ""}
            ],
            'Demo': [
                {title: 'Swipe down to clear the card', text: 'clear this card', colorTag: "red"},
                {title: 'Where is this?', text: '', colorTag: "yellow"},
                {title: 'What kind of grass is this?', text: '', colorTag: "green"},
                {title: 'What beach is this?', text: '', colorTag: "blue"},
                {title: 'test1', text: '', colorTag: "red"},
                {title: 'test2', text: '', colorTag: "red"},
                {title: 'test3', text: '', colorTag: "red"}
            ],
            "filler": [],
            "filler2": [],
            "filler3": []
        });
        $scope.isCategoryEmpty = function () {
            var category = $scope.data[$scope.current.category];
            return !category || category.length <= 0;
        };
        //initialize navigation array
        $scope.nav = $localstorage.getObject('nav', {
            "Math 137": {cardindex: [0], random: false},
            "Math 135": {cardindex: [0], random: false},
            "Demo": {cardindex: [0], random: false}
        });
        //====================================Card swiper================================
        $scope.cards = Array.prototype.slice.call($scope.data[$scope.current.category], 0, 0);

        $scope.randomCardPool = []; //random card pool to select next card from

        //generates array of elements 0 to n-1
        $scope.resetRandomCardPool = function (n) {
            $scope.randomCardPool = [];
            for (var i = 0; i < n; i++) {
                $scope.randomCardPool.push(i);
            }
        };

        $scope.cardSwiped = function () {
            console.log(direction);
            $scope.addCard(direction);
            //whenever user clicks, taps or does anything, it is not considered "first Time"
            $scope.setFirstTimeFalse();
        };
        $scope.cardDestroyed = function (index) {
            $scope.cards.splice(index, 1);
        };
        $scope.updatecardview = function (category, index) {
            //replacement update
            //$scope.cards = [];
            //$scope.addCard();
            //Update card view is intended to update UI, addcard should be implemented elsewhere. Commented for now due to some bugs
            //TODO this needs to be refactored along with addCard()
                $scope.cards[0] = $scope.data[category][index];
                $scope.current.category = category;
                $scope.current.cardindex[0] = index;

        };
        $scope.addCard = function ($index) {
            //go to the next card
            if (direction == 1) {
                //is the color filter on? if yes, move to the next card of the same color
                if ($scope.current.cardFilter.colorTag !== null && $scope.current.random) {
                    var index = ($scope.current.cardindex[0] + 1) % $scope.data[$scope.current.category].length;
                    while (index != $scope.current.cardindex[0]) {
                        if ($scope.data[$scope.current.category][index].colorTag == $scope.current.cardFilter.colorTag) {
                            break;
                        }
                        index = (index + 1) % $scope.data[$scope.current.category].length;
                    }
                    //add the index to the recording array
                    $scope.current.cardindex.unshift(index);
                } else if ($scope.current.random) { //if the card displayed randomly
                    //if highest card index in random card pool is higher than category length, generate new random card pool
                    if ((Math.max.apply(Math, $scope.randomCardPool) > $scope.data[$scope.current.category].length - 1) || ($scope.randomCardPool.length <= 0)) {
                        $scope.resetRandomCardPool($scope.data[$scope.current.category].length);
                    }
                    var randomindex = Math.floor(Math.random() * $scope.randomCardPool.length);
                    //sets random index and removes this index from random pool
                    $scope.current.cardindex.unshift($scope.randomCardPool[randomindex]);
                    $scope.randomCardPool.splice(randomindex, 1);
                }
                else {
                    //simply go to the next card
                    $scope.current.cardindex.unshift(($scope.current.cardindex[0]++) % $scope.data[$scope.current.category].length);
                }
            }
            //go back one card
            else if (direction == -1) {
                if ($scope.current.cardindex.length > 1)//as long as card history exists
                {
                    $scope.current.cardindex.splice(0, 1);
                }
            }
                var newCard = $scope.data[$scope.current.category][$scope.current.cardindex[0]];
            //newCard.id = Math.random();
                $scope.cards.push(angular.extend({}, newCard));


        };

        //==========================is the user first time opening the app?==================================
        $scope.isFirstTimeUser = $localstorage.getObject('isFirstTimeUser', true);
        if (!$scope.isFirstTimeUser) {
            $scope.addCard();
        }
        //=================================Pop Over/Color Tag=======================================
        $ionicPopover.fromTemplateUrl('templates/popover.html', {
            scope: $scope
        }).then(function (popover) {
            $scope.popover = popover;
            console.log("popover is " + popover);
        });
        $scope.openPopover = function ($event) {
            $scope.popover.show($event);
        };
        $scope.closePopover = function () {
            $scope.popover.hide();
        };
        //Cleanup the popover when we're done with it!
        $scope.$on('$destroy', function () {
            $scope.popover.remove();
        });
        // Execute action on hide popover
        $scope.$on('popover.hidden', function () {
            // Execute action
        });
        // Execute action on remove popover
        $scope.$on('popover.removed', function () {
            // Execute action
        });
        $scope.setColorTag = function (color) {
            $scope.data[$scope.current.category][$scope.current.cardindex[0]].colorTag = color;
            $scope.cards[0].colorTag = color;
            $scope.saveAll();
        };

        //===============================Switching Category============================
        $scope.switchCategory = function (category) {
            //put nav variables in current
            $scope.current.category = category;
            $scope.current.cardindex = $scope.nav.category.cardindex;
            $scope.current.random = $scope.nav.category.random;
            //update view
            $scope.updatecardview($scope.current.category, $scope.current.cardindex[0]);
        };


        //=================================Save Changes================================
        $scope.saveAll = function () {
            //saves data to local storage
            $localstorage.setObject('current', $scope.current);
            $localstorage.setObject('data', $scope.data);
        };
        $scope.setFirstTimeFalse = function () {
            $localstorage.setObject('isFirstTimeUser', false);
        };
        //=================================ACTION SHEET=================================
        $scope.show = function () {
            //whenever user clicks, taps or does anything, it is not considered "first Time"
            $scope.setFirstTimeFalse();
            // Show the action sheet
            var hideSheet = $ionicActionSheet.show({
                buttons: [
                    {text: '<b>New</b>'},
                    {text: 'Edit'},
                    {text: $scope.showContent?'Hide All':'Show All'}
                ],
                buttonClicked: function (index) {
                    if (index == 0) {
                        $scope.newstart($scope.current.category, $scope.current.cardindex[0]);
                        $scope.openModal('new');
                    }
                    else if (index == 1) {
                        $scope.editstart($scope.current.category, $scope.current.cardindex[0]);
                        $scope.openModal('edit');
                    }
                    else if (index == 2) {
                        $scope.showContent = !$scope.showContent;
                    }
                    return true;
                },
                cancelText: 'Cancel',
                cancel: function () {
                },
                destructiveText: 'Delete',
                destructiveButtonClicked: function () {
                    //remove card
                    $scope.data[$scope.current.category].splice($scope.current.cardindex[0], 1);
                    //the following ensures that when user deletes the last color-tagged card in a subcategory,
                    //it switches to the normal category (all colors)
                    if ($scope.current.cardFilter.colorTag !== null) {
                        var cards = $scope.data[$scope.current.category];
                        var switchToNormal = true;
                        for (var i = 0; i < cards.length; i++) {
                            if (cards[i].colorTag === $scope.current.cardFilter) {
                                //it doesn't delete the last color-tagged card in the category, so we are safe
                                switchToNormal = false;
                                break;
                            }
                        }
                        if (switchToNormal) {
                            //resets the filter to null
                            //i.e. go back to normal category
                            $scope.current.cardFilter.colorTag = null;
                        }
                    }
                    //adds a new card after card is deleted
                    $scope.cards = [];
                    $scope.addCard(1);
                    $scope.saveAll();
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
            //whenever user clicks, taps or does anything, it is not considered "first Time"
            $scope.setFirstTimeFalse();
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
            if (id == "new") {
                $scope.modalnew.hide();
            }
            else if (id == "menu") {
                $scope.modalmenu.hide();
                $scope.current.subShown='';
            }
            else if (id == "edit") {
                $scope.modaledit.hide();
            }
        };


        //=========================Edit Panel=================================
        $scope.editstart = function (category, index) {
            $scope.edit = $scope.data[category][index];
        };
        $scope.editsave = function () {
            $scope.data[$scope.current.category][$scope.current.cardindex[0]] = $scope.edit;
            $scope.updatecardview($scope.current.category, $scope.current.cardindex[0]);
            $scope.closeModal ('edit');
            $scope.saveAll();
        };
        //=========================New Panel=================================
        $scope.newstart = function () {
            $scope.edit = {title:"",text:""};
        };
        $scope.newsave = function () {
            $scope.data[$scope.current.category].splice($scope.current.cardindex[0], 0, $scope.edit);
            $scope.updatecardview($scope.current.category, $scope.current.cardindex[0]);
            $scope.closeModal ('new');
            $scope.saveAll();
        };
        //=========================Menu functions=====================================
        $scope.current.subShown='';
        $scope.current.subCategories=[];
        $scope.gotoCategory=function(category,subCategory){
            //set the cardFilter to the given subCategory (color)
            $scope.current.cardFilter.colorTag = subCategory || null;
            $scope.current.category=category;
            var index = 0;
            console.log($scope.current.cardindex[0]);
            if ($scope.data[category].length > 0 && $scope.current.cardFilter.colorTag !== null) {
                //TODO this needs to be refactored, consider doing it in addCard()
                //get the first color-tagged card
                index = ($scope.current.cardindex[0] + 1) % $scope.data[$scope.current.category].length;
                while (index != $scope.current.cardindex[0]) {
                    if ($scope.data[$scope.current.category][index].colorTag == $scope.current.cardFilter.colorTag) {
                        break;
                    }
                    index = (index + 1) % $scope.data[$scope.current.category].length;
                }
            }

            $scope.current.cardindex = [index];
            $scope.updatecardview($scope.current.category, $scope.current.cardindex[0]);
            $scope.closeModal('menu');
        };
        $scope.updateSubCategories=function(category){
            var cards =$scope.data[category];
            $scope.current.subCategories=[];
            //add color types to the subcategory array
            var addSubCategory=function (color){
                var isColorIn=false;
                for(var i=0;i<$scope.current.subCategories.length;i++){
                    if($scope.current.subCategories[i]==color){
                        isColorIn=true;
                        break;
                    }
                }
                if(!isColorIn){
                    $scope.current.subCategories.push(color);
                }
            };
            for(var i=0;i<cards.length;i++){
                if(cards[i].colorTag!==''){
                    addSubCategory(cards[i].colorTag);
                }
            }
            console.log('updatesub called');
            console.log($scope.current.subCategories);
        };
        $scope.toggleSubCategory=function(category){
            if($scope.current.subShown!==category){
                $scope.current.subShown=category;
            }else{
                $scope.current.subShown='';
            }
        };

        $scope.isSubShown=function(category){
            return $scope.current.subShown==category;
        };

        $scope.showDeleteConfirm = function(categoryName) {
            var confirmPopup = $ionicPopup.confirm({
                title: '<b>Delete Confirm</b>',
                template: 'Are you sure you want to delete this?'
            });
            confirmPopup.then(function(res) {
                if(res) {
                    console.log('You are sure');
                    $scope.deleteCategory(categoryName);
                } else {
                    console.log('delete canceled');
                }
            });
        };
        $scope.showPopup=function(message){
            // An elaborate, custom popup
            var myPopup = $ionicPopup.show({
                template:"<b>"+message+"</b>",
                title: "A message...",
                scope: $scope
            });
            $timeout(function() {
               myPopup.close(); //close the popup after 3 seconds for some reason
            }, 1500);
            myPopup.then(function() {
                console.log('Tapped!');
            });
        };
        $scope.showEditPrompt=function(categoryName){
            var promptPopup=$ionicPopup.prompt({
                title: '<b>Rename a category</b>',
                template: 'Enter your new category name',
                inputType: 'text',
                inputPlaceholder: 'new name here'
            });
            promptPopup.then(function(res) {
                var response=res ||''; //make sure response is not undefined
                console.log('you wanna change name from '+ categoryName +" to "+ res);
                promptPopup.close();
                if(response===''|| response=="undefined"){
                    //do nothing if the name entered is empty
                }else if(!$scope.isCatNameUsed(res)){
                    $scope.renameCategory(categoryName, res);
                }else{
                    $scope.showPopup("Your new name is used...please try again");
                }
            });

        };
        $scope.isCatNameUsed=function(categoryName){
            return $scope.data.hasOwnProperty(categoryName);
        };

        $scope.renameCategory=function(oldCategoryName,newCategoryName){
            $scope.data[newCategoryName]=$scope.data[oldCategoryName];
            delete $scope.data[oldCategoryName];
            $scope.updatecardview($scope.current.category,0);
            $scope.saveAll();
        };
        $scope.deleteCategory=function(categoryName){
            //change category if the user is in the deleted category
            if($scope.current.category===categoryName) {
                var keys = Object.keys($scope.data);
                console.log(keys);
                for (var i = 0; i < keys.length; i++) {
                    if (keys[i] === categoryName) {
                        console.log(i);
                        $scope.current.category = keys[(i + 1) % keys.length];
                        break;
                    }
                }
            }
            delete $scope.data[categoryName];
            $scope.updatecardview($scope.current.category,0);
            $scope.saveAll();
        };
        $scope.showNewCategory=function(){
            var promptPopup=$ionicPopup.prompt({
                title: '<b>Create a category</b>',
                template: 'Enter your category name',
                inputType: 'text',
                inputPlaceholder: 'Category name here'
            });
            promptPopup.then(function(res) {
                promptPopup.close();
                if(res===''||res=="undefined"){
                    $scope.showPopup("The name cannot be empty");
                }else if(!$scope.isCatNameUsed(res)){
                    $scope.data[res] = [$scope.defaultCard];
                    $scope.saveAll();
                }else{
                    $scope.showPopup("Your new name is used...please try again");
                }

            });
        };
        //==============================Flip Functions (Obsolete)=====================================
        $scope.isFlipped=false;
        $scope.toggleFlip=function(){
            $scope.isFlipped=!$scope.isFlipped;
        };


    })

    .controller('CardCtrl', function ($scope, $ionicSwipeCardDelegate) {
        $scope.goAway = function () {
            var card = $ionicSwipeCardDelegate.getSwipebleCard($scope);
            card.swipe();
        };
    })


;