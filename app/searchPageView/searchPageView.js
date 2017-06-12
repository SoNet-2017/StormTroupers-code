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

        $scope.goToEditProfile=function () {
            $location.path("/editProfileView");
        };



        var UID=localStorage.UID;
        var database=firebase.database();
        var usersBase=database.ref('users/');
        var userQuery=usersBase.orderByChild("dateOfJoin");
        $scope.filterUsers=$firebaseArray(userQuery);


        var obj = $firebaseObject(database.ref('users/'+UID));
        obj.$loaded().then(function () {
            $scope.profile=obj;
            var role = Object.values(obj.roles);
            for(var i=0; i<role.length; i++){
                document.getElementById("userRolesHome").innerHTML+=role[i];
                if(i<role.length-1) {
                    document.getElementById("userRolesHome").innerHTML+=", ";
                }
            }

            $scope.filterSearch={};

        }).catch(function (error) {
            $scope.error=error;
        });





        $scope.launchSearch = function () {
            //resetta il filtersearch
            $scope.filterSearch={};

                //checca che cazzo hai messo nei filtri
            /*
            var checkKeyword=false;
            //step1 checcka la keyword in nome e cognome
            if (document.getElementsByName("searchKeyword").value!=="") { //checca solo se hei scritto qualcosa nel campo
                checkKeyword=true;
                console.log="checkKeyword=true";
            }
            else {
                console.log="checkKeyword=false";
            }
            */

            //step27 checca il sesso
            var includeF=false;
            var includeM=false;
            if (document.getElementById("checkFem").checked) {
                includeF=true;
            }
            if (document.getElementById("checkMal").checked) {
                includeM=true;
            }

            //parte il coso per davvero
            var length=$scope.filterUsers.length;
            var j=0;
            for(var i=0; i<length; i++){ //si scorre tutto l'array

                /*
                if (checkKeyword===true) {
                    var wtc = document.getElementsByName("searchKeyword").value;
                    var pos1 =  $scope.filterUsers[i].name.search(wtc);
                    var pos2 =  $scope.filterUsers[i].lastName.search(wtc);
                    if(pos1!==-1 || pos2!==-1) {
                        $scope.filterSearch[j]=$scope.filterUsers[i];
                        j++;
                    }
                }
                */

                if (includeF===true) {
                    if($scope.filterUsers[i].gender==="female"){
                        $scope.filterSearch[j]=$scope.filterUsers[i];
                        j++;
                    }
                }

                if (includeM===true) {
                    if($scope.filterUsers[i].gender==="male"){
                        $scope.filterSearch[j]=$scope.filterUsers[i];
                        j++;
                    }
                }

                //ricerca di prova in base al nome TENIAMOLA LI'
                /*
                if($scope.filterUsers[i].name==="Branda"){
                    arr[j]=$scope.filterUsers[i];
                    $scope.filterSearch[j]=$scope.filterUsers[i];
                    console.log($scope.filterSearch[j]);
                    j++;
                }
                */

            }


        };

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
