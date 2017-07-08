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

        $scope.goToMyTroupers=function () {
            $location.path("/friendsPageView");
            localStorage.otherUserID = UID;
        };

        $scope.goToPublicProjectPage=function(projectID){
            $location.path("/publicProjectPageView");
            console.log("progetto che sto passando: "+projectID);
            localStorage.PID = projectID;
        };

        $scope.goToFriendsPage=function(){
            $location.path("/friendsPageView");
        };

        $scope.goToMyPublicProfile=function () {
            $location.path("/publicProfilePageView");
            localStorage.otherUserID=UID;
        };

        $scope.goToPublicProfile=function (userID) {
            $location.path("/publicProfilePageView");
            //console.log("utente che sto passando: "+userID);
            localStorage.otherUserID = userID;
        };

        var UID=localStorage.UID;
        var database=firebase.database();

        $scope.profile = $firebaseObject(database.ref('users/'+UID));
        $scope.profile.$loaded().then(function () {
            var role = Object.values($scope.profile.roles);
            for(var i=0; i<role.length; i++){
                document.getElementById("userRolesHome").innerHTML+=role[i];
                if(i<role.length-1) {
                    document.getElementById("userRolesHome").innerHTML+=", ";
                }
            }
        }).catch(function (error) {
            $scope.error=error;
            //console.log("errore: "+error);
        });

        // UID dell'utente di cui si vuole vedere il profilo pubblico
        var otherUserID=localStorage.otherUserID;
        $scope.friends={};

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

            var friends = [];
            if ($scope.otherUser.friends === undefined) {

                //aggiungo il campo friends
                database.ref('users/' + otherUserID).update({
                    name: $scope.otherUser.name,
                    lastName: $scope.otherUser.lastName,
                    phone: $scope.otherUser.phone,
                    permissionToShowPhone: $scope.otherUser.permissionToShowPhone,
                    gender: $scope.otherUser.gender,
                    roles: $scope.otherUser.roles,
                    race: $scope.otherUser.race,

                    country: $scope.otherUser.country,
                    province: $scope.otherUser.province,
                    city: $scope.otherUser.city,
                    logged: $scope.otherUser.logged,
                    car: $scope.otherUser.car,
                    payment: $scope.otherUser.payment,
                    description: $scope.otherUser.description,
                    dateOfBirth: $scope.otherUser.dateOfBirth,
                    friends: friends,
                    email: $scope.otherUser.email,
                    password: $scope.otherUser.password
                }).catch(function (error) {
                    $scope.error = error;
                });
            }
            else {
                var length=$scope.otherUser.friends.length;
                var currFriendID;
                //console.log("length: "+length);
                for(var j=0; j<length; j++){
                    currFriendID=$scope.otherUser.friends[j];
                    //console.log("curFriendID: "+currFriendID);
                    var currFriendObj=$firebaseObject(database.ref('users/'+currFriendID));

                    //console.log("curr friend: "+currFriendObj);
                    $scope.friends[j] = currFriendObj;

                }
            }

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
            console.log("sono in errore: "+error);
        });


        $scope.addUserToFriends = function (otherUserID) {

            var friendsToUpdate = [];
            if ($scope.profile.friends === undefined) {
                friendsToUpdate.push(UID);
            }
            else {
                if ($scope.profile.friends.indexOf(otherUserID) < 0) {
                    friendsToUpdate = $scope.profile.friends;
                    friendsToUpdate.splice($scope.profile.friends.length-1, 0, otherUserID);
                    console.log("trouper aggiunto: " + otherUserID);

                    database.ref('users/' + UID).update({
                        name: $scope.profile.name,
                        lastName: $scope.profile.lastName,
                        phone: $scope.profile.phone,
                        permissionToShowPhone: $scope.profile.permissionToShowPhone,
                        gender: $scope.profile.gender,
                        roles: $scope.profile.roles,
                        race: $scope.profile.race,

                        country: $scope.profile.country,
                        province: $scope.profile.province,
                        city: $scope.profile.city,
                        car: $scope.profile.car,
                        payment: $scope.profile.payment,
                        description: $scope.profile.description,
                        dateOfBirth: $scope.profile.dateOfBirth,
                        friends: friendsToUpdate,
                        email: $scope.profile.email,
                        password: $scope.profile.password,
                        logged: $scope.profile.logged
                    }).then(function () {
                        var nObj = $firebaseObject(database.ref('users/' + UID));
                        nObj.$loaded().then(function () {
                            $scope.profile = nObj;
                        }).catch(function (error) {
                            $scope.error = error;
                        })
                    }).catch(function (error) {
                        $scope.error = error;
                    });
                } else console.log("trouper già inserito");
            }

            //aggiorno il vettore anche nell'amico
            var otherUserFriends = [];
            $scope.otherUser = $firebaseObject(database.ref('users/' + otherUserID));
            $scope.otherUser.$loaded().then(function () {
                if ($scope.otherUser.friends === undefined) {
                    otherUserFriends.push(UID);
                }
                else {
                    otherUserFriends = $scope.otherUser.friends;
                    otherUserFriends.splice($scope.otherUser.friends.length-1, 0, UID);
                }

                //console.log("vettore amicicci di other user"+otherUserID+": "+$scope.otherUser.friends);
                database.ref('users/' + otherUserID).update({
                    name: $scope.otherUser.name,
                    lastName: $scope.otherUser.lastName,
                    phone: $scope.otherUser.phone,
                    permissionToShowPhone: $scope.otherUser.permissionToShowPhone,
                    gender: $scope.otherUser.gender,
                    roles: $scope.otherUser.roles,
                    race: $scope.otherUser.race,

                    country: $scope.otherUser.country,
                    province: $scope.otherUser.province,
                    city: $scope.otherUser.city,
                    logged: $scope.otherUser.logged,
                    car: $scope.otherUser.car,
                    payment: $scope.otherUser.payment,
                    description: $scope.otherUser.description,
                    dateOfBirth: $scope.otherUser.dateOfBirth,
                    friends: otherUserFriends,
                    email: $scope.otherUser.email,
                    password: $scope.otherUser.password
                }).then(function () {
                    var nObj = $firebaseObject(database.ref('users/' + UID));
                    nObj.$loaded().then(function () {
                        $scope.profile = nObj;
                    }).catch(function (error) {
                        $scope.error = error;
                    })
                }).catch(function (error) {
                    $scope.error = error;
                });
            });
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