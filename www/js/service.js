/**
 * Created by Han Chen on 28/10/2014.
 */
angular.module('starter', ['ionic', 'ionic.contrib.ui.cards'])
.factory('categories',function(){
        var categories=
            [
                {title:"Math 137",
                cards:[
                    {title:"Limit",content:"a limit is...."},
                    {title:"Continuity",content:"continuity means ..."}
                ]},
                {title:"Math 135"
                cards:[
                    {title:"GCDOO",content:"Let a= ...."},
                    {title:"Fermat's little Theorem",content:"if p is a prime..."}
                ]
                }
            ];
        return categories;
    });