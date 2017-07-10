'use strict';

angular.module('myApp.jobApplicationsView', ['ngRoute'])

    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/jobApplicationsView', {
            templateUrl: 'jobApplicationsView/jobApplicationsView.html',
            controller: 'jobApplicationsViewCtrl',
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

    .controller('jobApplicationsViewCtrl', ['$scope', '$location', 'Auth', '$firebaseObject', 'Users', 'UsersChatService', 'currentAuth', '$firebaseAuth', '$firebaseArray', function ($scope, $location, Auth, $firebaseObject, Users, UsersChatService, currentAuth, $firebaseAuth, $firebaseArray) {
        $scope.dati = {};
        $scope.auth = Auth;

        $scope.countries = countries_list;

        if (localStorage.otherUserID === localStorage.UID) {
            document.getElementById("profileFeedbackWriter").style.display = "none";
            document.getElementById("lateralLinks").style.display = "none";
        }

        $scope.showLogoItem = function () {
            var x = document.getElementById("logoBarContentHome");
            if (x.className.indexOf("w3-show") == -1)
                x.className += " w3-show";
            else
                x.className = x.className.replace(" w3-show", "");
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

        $scope.goToMyPublicProfile = function () {
            $location.path("/publicProfilePageView");
            localStorage.otherUserID = UID;
        };

        $scope.goToPublicProfile = function (userID) {
            $location.path("/publicProfilePageView");
            //console.log("utente che sto passando: "+userID);
            localStorage.otherUserID = userID;
        };

        var UID = localStorage.UID;
        var database = firebase.database();

        // UID dell'utente di cui si vuole vedere il profilo pubblico
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

        }).catch(function (error) {
            $scope.error = error;
            //console.log("errore: "+error);
        });

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