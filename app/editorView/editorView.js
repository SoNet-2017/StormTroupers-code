'use strict';

angular.module('myApp.editorView', ['ngRoute'])

    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/editorView', {
            templateUrl: 'editorView/editorView.html',
            controller: 'editorViewCtrl',
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

    .controller('editorViewCtrl', ['$scope', '$location', 'Auth', '$firebaseObject', 'Users', 'CurrentDateService', 'ReminderService', 'UsersChatService', 'currentAuth', '$firebaseAuth', '$firebaseArray', function ($scope, $location, Auth, $firebaseObject, Users, CurrentDateService, ReminderService, UsersChatService, currentAuth, $firebaseAuth, $firebaseArray) {
        $scope.dati = {};
        $scope.auth = Auth;

        $scope.dati.reminders = ReminderService.getReminders();
        $scope.dati.currentDate = CurrentDateService.getCurrentDate();

        $scope.countries = countries_list;


        $scope.showLogoItem = function () {
            var x = document.getElementById("logoBarContentHome");
            if (x.className.indexOf("w3-show") == -1)
                x.className += " w3-show";
            else
                x.className = x.className.replace(" w3-show", "");
        };

        $scope.launchSearchInSearchPage = function () {
            $location.path("/searchPageView");
            localStorage.immediateSearch=true;
            localStorage.immediateSearchKeyword=document.getElementById("searchItemHomeKeyword").value;
            console.log("Variabili passate.");
            console.log("immediateSearch = "+localStorage.immediateSearch.toString());
            console.log("ImmediateSearchKeyword = "+localStorage.immediateSearchKeyword);
        };

        $scope.showSearchItem = function () {
            var x = document.getElementById("typeSearchContentHome");
            if (x.className.indexOf("w3-show") == -1)
                x.className += " w3-show";
            else
                x.className = x.className.replace(" w3-show", "");
        };

        $scope.goToDashboard = function () {
            $location.path("/homePageView")
        };

        $scope.goToSearchCrew = function () {
            $location.path("/searchPageView");
        };

        $scope.goToSearchProjects = function () {
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
        };

        $scope.goToPublicProjectPage = function (projectID) {
            $location.path("/publicProjectPageView");
            console.log("progetto che sto passando: " + projectID);
            localStorage.PID = projectID;
        };

        $scope.goToFriendsPage = function (otherUserID) {
            $location.path("/friendsPageView");
            localStorage.otherUserID = otherUserID;
        };

        $scope.goToMyPublicProfile = function (UID) {
            $location.path("/publicProfilePageView");
            $route.reload();
            localStorage.otherUserID = UID;
        };

        $scope.goToPublicProfile = function (userID) {
            $location.path("/publicProfilePageView");
            //console.log("utente che sto passando: "+userID);
            localStorage.otherUserID = userID;
        };

        var UID = localStorage.UID;
        var database = firebase.database();

        var otherUserID = localStorage.otherUserID;

        $scope.profile = $firebaseObject(database.ref('users/' + UID));
        $scope.profile.$loaded().then(function () {
            var role = Object.values($scope.profile.roles);
            for (var i = 0; i < role.length; i++) {
                document.getElementById("userRolesHome").innerHTML += role[i];
                if (i < role.length - 1) {
                    document.getElementById("userRolesHome").innerHTML += ", ";
                }
            }
            if ($scope.profile.friends.indexOf(otherUserID) < 0) {
                $scope.alreadyFriend = false;
            } else {
                $scope.alreadyFriend = true;
            }
        }).catch(function (error) {
            $scope.error = error;
            //console.log("errore: "+error);
        });

        $scope.tinymceModel = 'Initial content';



        $scope.getContent = function() {
            console.log('Editor content:', $scope.tinymceModel);
        };

        $scope.setContent = function() {
            $scope.tinymceModel = 'Time: ' + (new Date());
        };

        $scope.showScreenplay=function(){
            $scope.tinymceOptions = {
                toolbar: 'undo redo | bold italic | alignleft aligncenter alignright | code'
            };
            document.getElementById("campoDiTesto").style.display="block";
        };

        $scope.showStoryboard=function () {
            $scope.tinymceOptions = {
                plugins: 'link image code',
                toolbar: 'undo redo | bold italic | alignleft aligncenter alignright | code'
            };
            document.getElementById("campoDiTesto").style.display="block";
        }





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