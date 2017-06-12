/**
 * Created by matil_000 on 09/06/2017.
 */

'use strict';

angular.module('myApp.myProjectsView', ['ngRoute'])

    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/myProjectsView', {
            templateUrl: 'myProjectsView/myProjectsView.html',
            controller: 'myProjectsViewCtrl',
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

    .controller('myProjectsViewCtrl', ['$scope', '$location', 'Auth', '$firebaseObject', 'Users', 'currentAuth', '$firebaseAuth', '$firebaseArray', function ($scope, $location, Auth, $firebaseObject, Users, currentAuth, $firebaseAuth, $firebaseArray) {
        $scope.dati = {};
        $scope.auth = Auth;

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

        $scope.goToEditProfile = function () {
            $location.path("/editProfileView");
        };

        $scope.goToMyProjects = function () {
            $location.path("/myProjectsView");
        }

        // CAMBIARE URL
        $scope.goToProjectX = function () {
            $location.path("/myProjectsView");
        }

        // CAMBIARE URL
        $scope.goToPublicProfile = function (userID) {
            $location.path("/homePageView");
        }

        $scope.goToNewProject = function () {
            $location.path("/newProjectView");
        }

        var UID = localStorage.UID;
        var database = firebase.database();
        var usersBase = database.ref('users/');
        var userQuery = usersBase.limitToLast(5);
        $scope.filterUsers = $firebaseArray(userQuery);

        var userObj = $firebaseObject(database.ref('users/' + UID));
        userObj.$loaded().then(function () {
            $scope.profile = userObj;
            var role = Object.values(userObj.roles);
            for (var i = 0; i < role.length; i++) {
                document.getElementById("userRolesHome").innerHTML += role[i];
                if (i < role.length - 1) {
                    document.getElementById("userRolesHome").innerHTML += ", ";
                }
            }


        }).catch(function (error) {
            $scope.error = error;
        });


        // non va e non so perchè D:
        $scope.filterSearch={};
        var UID = localStorage.UID;
        var projectsBase = database.ref('projects/');
        var projectQuery = projectsBase.limitToLast(10);
        $scope.filterProjects = $firebaseArray(projectQuery);

        var owner = localStorage.UID;
        var length=$scope.filterProjects.length;
        console.log(length);
        for (var i = 0; i < 10; i++) {
            //if($scope.filterProjects[i].title === "ciao1")
            {
                console.log([$scope.filterProjects[i]]);
            }
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
