'use strict';

angular.module('myApp.friendsPageView', ['ngRoute'])

    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/friendsPageView', {
            templateUrl: 'friendsPageView/friendsPageView.html',
            controller: 'friendsPageViewCtrl',
            resolve: {
                // controller will not be loaded until $requireSignIn resolves
                // Auth refers to our $firebaseAuth wrapper in the factory below
                "currentAuth": ["Auth", function (Auth) {
                    // $requireSignIn returns a promise so the resolve waits for it to complete
                    // If the promise is rejected, it will throw a $routeChangeError (see above)
                    return Auth.$requireSignIn();
                }]
            }
        });
    }])

    .controller('friendsPageViewCtrl', ['$scope', '$location', '$route', 'Auth', '$firebaseObject','UiService', 'Users', 'UserList', 'ApplicationsService','ReminderService', 'CurrentDateService', 'ProfileService', 'currentAuth', '$firebaseAuth', '$firebaseArray', function ($scope, $location, $route, Auth, $firebaseObject,UiService, Users,UserList, ApplicationsService,ReminderService, CurrentDateService, ProfileService, currentAuth, $firebaseAuth, $firebaseArray) {
        document.body.scrollTop = 0;

        $scope.dati = {};
        $scope.auth = Auth;

        $scope.dati.reminders = ReminderService.getReminders();
        $scope.dati.currentDate = CurrentDateService.getCurrentDate();

        /*$scope.eventSource = {
            url: "http://www.google.com/calendar/feeds/usa__en%40holiday.calendar.google.com/public/basic",
            className: 'gcal-event',           // an option!
            currentTimezone: 'America/Chicago' // an option!
        };*/


        $scope.showLogoItem=function() {
            UiService.showLogoItem();
        };

        $scope.launchSearchInSearchPage=function(){
            UiService.launchSearchInSearchPage();
        };

        /*$scope.showSearchItem = function () {
         var x = document.getElementById("typeSearchContentHome");
         if (x.className.indexOf("w3-show") == -1)
         x.className += " w3-show";
         else
         x.className = x.className.replace(" w3-show", "");
         };*/

        $scope.goToDashboard = function () {
            $location.path("/homePageView")
        };

        $scope.goToSearchCrew = function () {
            $location.path("/searchPageView");
        };

        $scope.goToSearchProjects=function () {
            $location.path("/searchProjectsView");
        };

        $scope.goToEditProfile = function () {
            $location.path("/editProfileView");
        };

        $scope.goToMyProjects = function () {
            $location.path("/myProjectsView");
        };

        $scope.goToMyTroupers = function () {
            $location.path("/friendsPageView");
            localStorage.otherUserID = UID;
            $route.reload();
        };

        $scope.goToMyApplications=function() {
            $location.path("/jobApplicationsView");
        };

        $scope.goToPublicProfile = function (userID) {
            $location.path("/publicProfilePageView");
            console.log("utente che sto passando: " + userID);
            localStorage.otherUserID = userID;
        };

        $scope.goToMyPublicProfile = function () {
            $location.path("/publicProfilePageView");
            localStorage.otherUserID = UID;
        };

        var UID = localStorage.UID;

        $scope.profile = ProfileService.getUserInfo(UID);
        $scope.profile.$loaded().then(function () {
            var role = Object.values($scope.profile.roles);
            for (var i = 0; i < role.length; i++) {
                document.getElementById("userRolesHome").innerHTML += role[i];
                if (i < role.length - 1) {
                    document.getElementById("userRolesHome").innerHTML += ", ";
                }
            }
        }).catch(function (error) {
            $scope.error = error;
        });

        // UID dell'utente di cui si vuole vedere il profilo pubblico
        var otherUserID = localStorage.otherUserID;

        if(otherUserID === UID)
            $scope.myTroupersPage=true;
        else
            $scope.myTroupersPage=false;

        $scope.friends = {};
        $scope.otherUser = ProfileService.getUserInfo(otherUserID);
        $scope.otherUser.$loaded().then(function () {
            $scope.friends = UserList.getFriends($scope.otherUser);
        });

        $scope.removeUserFromFriends=function(friendToRemove){
            console.log("$scope.profile.friends.indexOf(friendToRemove: "+$scope.profile.friends.indexOf(friendToRemove));
            $scope.profile.friends.splice($scope.profile.friends.indexOf(friendToRemove),1);
            $scope.profile.$save();
            console.log("trouper eliminato: "+friendToRemove);

            //lo elimino anche dall'altro?
            $scope.otherUser = ProfileService.getUserInfo(friendToRemove);
            $scope.otherUser.$loaded().then(function () {
                $scope.otherUser.friends.splice($scope.otherUser.friends.indexOf(UID),1);
                $scope.otherUser.$save();
                console.log("trouper eliminato dall'amico: "+UID);
            }).catch(function (error) {
                $scope.error = error;
            });
            $route.reload();
        };

        $scope.addUserToFriends=function(otherUserID){
            if($scope.profile.friends.indexOf(otherUserID)<0) {
                $scope.otherUser = ProfileService.getUserInfo(otherUserID);
                $scope.otherUser.$loaded().then(function () {
                    //aggiorno il vettore anche nell'amico
                    $scope.otherUser.friends.push(UID);
                    //console.log("vettore amicicci di other user"+otherUserID+": "+$scope.otherUser.friends);
                    $scope.otherUser.$save();

                    //aggiorno il vettore dell'utente loggato
                    $scope.profile.friends.push(otherUserID);
                    //console.log("vettore amicicci dell'utente loggato: "+$scope.profile.friends);
                    $scope.profile.$save();
                    console.log("Trouper aggiunto agli amici: " +  otherUserID);
                }).catch(function (error) {
                    $scope.error = error;
                });
            }
            else console.log("trouper già inserito");
        };

        $scope.logout = function () {
            Users.registerLogout(currentAuth.uid);
            $firebaseAuth().$signOut();
            $firebaseAuth().$onAuthStateChanged(function (firebaseUser) {
                if (firebaseUser) {
                    console.log("User is yet signed in as:", firebaseUser.uid);
                } else {
                    $location.path("/loginView");
                }
            });


        };

    }]);