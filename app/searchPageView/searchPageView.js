'use strict';

angular.module('myApp.searchPageView', ['ngRoute'])

    .config(['$routeProvider', function($routeProvider) {
        $routeProvider.when('/searchPageView', {
            templateUrl: 'searchPageView/searchPageView.html',
            controller: 'searchPageCtrl',
            resolve: {
                // controller will not be loaded until $requireSignIn resolves
                // Auth refers to our $firebaseAuth wrapper in the factory below
                "currentAuth": ["Auth", function(Auth) {
                    // $requireSignIn returns a promise so the resolve waits for it to complete
                    // If the promise is rejected, it will throw a $routeChangeError (see above)
                    return Auth.$requireSignIn();
                }]
            }
        });
    }])

    .controller('searchPageCtrl', ['$scope', '$location', 'Auth', '$firebaseObject','Users', 'currentAuth', '$firebaseAuth', '$firebaseArray', function ($scope,$location, Auth, $firebaseObject, Users, currentAuth, $firebaseAuth, $firebaseArray) {
        $scope.dati={};
        $scope.auth=Auth;

        $scope.slider = {
            minValue: 0,
            maxValue: 100,
            value: 0,
            options: {
                floor: 0,
                ceil: 100,
                step: 10,
                showTicks: true
            }
        };

        $scope.slider2 = {
            minValue: 0,
            maxValue: 10,
            value: 0,
            options: {
                floor: 0,
                ceil: 10,
                step: 1,
                showTicks: true
            }
        };

        $scope.slider3 = {
            minValue: 18,
            maxValue: 90,
            options: {
                floor: 0,
                ceil: 100,
                step: 1,
                noSwitching: true
            }
        };

        console.log(localStorage.attName);
        console.log(localStorage.attLast);
        console.log(localStorage.attEmail);
/*
        document.getElementById("userNameHome").innerHTML=localStorage.attName;
        document.getElementById("userNameAndLastHome").innerHTML=localStorage.attName+" "+localStorage.attLast;*/

        $scope.showLogoItem=function () {
            var x = document.getElementById("logoBarContentHome");
            if (x.className.indexOf("w3-show") == -1)
                x.className += " w3-show";
            else
                x.className = x.className.replace(" w3-show", "");
        };

        $scope.showSearchItem=function () {
            var x = document.getElementById("typeSearchContentHome");
            if (x.className.indexOf("w3-show") == -1)
                x.className += " w3-show";
            else
                x.className = x.className.replace(" w3-show", "");
        };

        $scope.goToDashboard=function () {
            $location.path("/homePageView")
        };

        $scope.goToSearchCrew=function () {
            $location.path("/searchPageView");
        };



        //ORIGINAL WORKING VERSION
        var UID=localStorage.UID;
        var database=firebase.database();
        var usersBase=database.ref('users/');
        var userQuery=usersBase.orderByChild("dateOfJoin").limitToLast(5);
      /*
        var newShit=$firebaseArray(userQuery);
        var randomizedUserArray = new Array();
        var rand;
        //console.log ("COSO CHE MI INTERESSA -------->"+$scope.newShit.toString());

        var ok;

        for (var n=0; n<5; n++) {

            do {
                rand = Math.floor((Math.random() * 10) + 1);
                randomizedUserArray[n] = newShit[rand];

                ok=true;

                for (var m=0; m<n; m++) {
                    if (randomizedUserArray[n]==randomizedUserArray[m]) {
                        ok=false;
                        break;
                    }
                }

            }
            while (ok==false)

        }

        $scope.newnewArray=randomizedUserArray;

        $scope.filterUsers=$scope.newnewArray;*/

      var result=$firebaseArray(userQuery);
      result.$loaded(function (x) {
          $scope.oneResult=x[0];
      }).catch(function (error) {
          $scope.error=error;
      });

        var obj = $firebaseObject(database.ref('users/'+UID));
        obj.$loaded().then(function () {
            $scope.profile=obj;
            var role = Object.values(obj.roles);
            for(var i=0; i<role.length; i++){
               // console.log(role[i]);
                document.getElementById("userRolesHome").innerHTML+=role[i];
                if(i<role.length-1) {
                    document.getElementById("userRolesHome").innerHTML+=", ";
                }
            }
            document.getElementById("userNameHome").innerHTML=obj.name;
            document.getElementById("userNameAndLastHome").innerHTML=obj.name+" "+obj.lastName;
        }).catch(function (error) {
            $scope.error=error;
        });

        $scope.logout = function () {
            Users.registerLogout(currentAuth.uid);
            $firebaseAuth().$signOut();
            $firebaseAuth().$onAuthStateChanged(function(firebaseUser) {
                if (firebaseUser) {
                    console.log("User is yet signed in as:", firebaseUser.uid);
                } else {
                    $location.path("/loginView");
                }
            });


        };

    }]);
