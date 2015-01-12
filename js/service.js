/**
 * Created by Han Chen on 28/10/2014.
 */
Array.prototype.insert = function (index, item) {
    this.splice(index, 0, item);
};
angular.module('starter', ['ionic', 'ionic.contrib.ui.cards', 'ionic.utils'])

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
	});