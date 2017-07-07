'use strict';

angular.module('myApp.publicProfilePageView', ['ngRoute'])

    .config(['$routeProvider', function($routeProvider) {
        $routeProvider.when('/publicProfilePageView', {
            templateUrl: 'publicProfilePageView/publicProfilePageView.html',
            controller: 'publicProfilePageViewCtrl',
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

    .controller('publicProfilePageViewCtrl', ['$scope', '$location', 'Auth', '$firebaseObject','Users', 'currentAuth', '$firebaseAuth', '$firebaseArray', function ($scope,$location, Auth, $firebaseObject, Users, currentAuth, $firebaseAuth, $firebaseArray) {
        $scope.dati={};
        $scope.auth=Auth;

        $scope.countries = countries_list;

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

        $scope.goToMyProjects=function() {
            $location.path("/myProjectsView");
        };

        $scope.goToPublicProjectPage=function(projectID){
            $location.path("/publicProjectPageView");
            console.log("progetto che sto passando: "+projectID);
            localStorage.PID = projectID;
        };

        $scope.goToFriendsPage=function(){
            $location.path("/friendsPageView");
        };

        var UID=localStorage.UID;
        var database=firebase.database();

        $scope.profile = $firebaseObject(database.ref('users/'+UID));
        $scope.profile.$loaded().then(function () {
            var role = Object.values(obj.roles);
            for(var i=0; i<role.length; i++){
                document.getElementById("userRolesHome").innerHTML+=role[i];
                if(i<role.length-1) {
                    document.getElementById("userRolesHome").innerHTML+=", ";
                }
            }
        }).catch(function (error) {
            $scope.error=error;
        });

        // UID dell'utente di cui si vuole vedere il profilo pubblico
        var otherUserID=localStorage.otherUserID;
        $scope.otherUser = $firebaseObject(database.ref('users/'+otherUserID));
        $scope.otherUser.$loaded().then(function () {
            //console.log("nome other user: "+$scope.otherUser.name+" ID: "+otherUserID+" DESCR: "+$scope.otherUser.description);
            var userRoles = Object.values($scope.otherUser.roles);
            for(var i=0; i<userRoles.length; i++){
                document.getElementById("userRoles").innerHTML+=userRoles[i];
                if(i<userRoles.length-1) {
                    document.getElementById("userRoles").innerHTML+=", ";
                }
            }
            $scope.calculateAge();

            $scope.getProjectsFromDB={};
            var projectsBase = database.ref('projects/');
            $scope.getProjectsFromDB = $firebaseArray(projectsBase);
            $scope.getProjectsFromDB.$loaded().then(function () {
            //resetta il filtersearch
            $scope.projPublicPage={};

            var length=$scope.getProjectsFromDB.length;
            console.log("length: "+length);
            var j=0;
            for(var i=0; i<length; i++){ //si scorre tutto l'array
                console.log("owner i"+$scope.getProjectsFromDB[i].owner);
                if($scope.getProjectsFromDB[i].owner === otherUserID) {
                    $scope.projPublicPage[j]=$scope.getProjectsFromDB[i];
                    j++;
                }
                var length2=$scope.getProjectsFromDB[i].troupers.length;
                for(var k=0;k<length2; k++) {
                    if($scope.getProjectsFromDB[i].troupers[k] === otherUserID) {
                        $scope.projPublicPage[j]=$scope.getProjectsFromDB[i];
                        console.log("trovato");
                        j++;
                        break;
                    }
                }
            }
            }).catch(function (error) {
                $scope.error=error;
            });
        }).catch(function (error) {
            $scope.error=error;
        });


        $scope.addUserToFriends=function(otherUserID){
            console.log("vettore amicicci: "+$scope.profile.friends);
            if($scope.profile.friends.indexOf(otherUserID)<0) {
                console.log("Trouper aggiunto agli amici: " +  otherUserID);
                $scope.profile.friends.push(otherUserID);
                console.log("vettore amicicci: "+$scope.profile.friends);
                $scope.profile.$save();
            }
            else console.log("trouper già inserito");
        };

        $scope.calculateAge=function () {
            var ageString = $scope.otherUser.dateOfBirth;
            var ageStringYear = ageString.slice(0, 4);
            var ageIntYear = parseInt(ageStringYear);
            var ageStringMonth = ageString.slice(5, 7);
            var ageIntMonth = parseInt(ageStringMonth);
            var ageStringDay = ageString.slice(8, 10);
            var ageIntDay = parseInt(ageStringDay);

            var actorAge = ageIntDay + (ageIntMonth * 30) + (ageIntYear * 365);

            var today = new Date();
            var dd = today.getDate();
            var mm = today.getMonth()+1; //January is 0!
            var yyyy = today.getFullYear();

            console.log ("Date con la function: "+dd+"/"+mm+"/"+yyyy);

            var currentDate = dd + (mm * 30) + (yyyy * 365);

            var ageInDays = currentDate - actorAge;
            $scope.age = Math.floor(ageInDays / 365);
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