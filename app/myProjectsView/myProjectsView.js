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
        };

        $scope.goToMyTroupers=function (userID) {
            $location.path("/friendsPageView");
            localStorage.otherUserID = userID;
        };

        $scope.goToEditProjectX = function (prjXID) {
            $location.path("/editProjectView");
            console.log("Titolo passato: " + prjXID);
            localStorage.PID = prjXID;
        };

        $scope.goToPublicProfile = function (userID) {
            if(userID !== localStorage.UID) {
                $location.path("/publicProfilePageView");
                console.log("utente che sto passando: " + userID);
                localStorage.otherUserID = userID;
            }
        };

        $scope.goToNewProject = function () {
            $location.path("/newProjectView");
        };

        var UID = localStorage.UID;
        var database = firebase.database();

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

        var usersBase = database.ref('users/');
        $scope.filterUsers = $firebaseArray(usersBase);

        $scope.getProjectsFromDB={};
        var PID = localStorage.PID;
        var projectsBase = database.ref('projects/');
        $scope.getProjectsFromDB = $firebaseArray(projectsBase);

        var projObj = $firebaseObject(database.ref('projects/' + PID));
        projObj.$loaded().then(function () {
            //resetta il filtersearch
            $scope.filterProjects={};

            var length=$scope.getProjectsFromDB.length;
            var j=0;
            for(var i=0; i<length; i++){ //si scorre tutto l'array
                if($scope.getProjectsFromDB[i].owner === UID) {
                    $scope.filterProjects[j]=$scope.getProjectsFromDB[i];
                    j++;
                }
                var length2=$scope.getProjectsFromDB[i].troupers.length;
                for(var k=0;k<length2; k++) {
                    if($scope.getProjectsFromDB[i].troupers[k] === UID) {
                        $scope.filterProjects[j]=$scope.getProjectsFromDB[i];
                        console.log("trovato");
                        j++;
                        break;
                    }
                }
                //console.log("getProjectsFromDB["+i+"]="+$scope.getProjectsFromDB[i].title);
            }
        });

        $scope.popolaMyProjects=function () {
            $scope.getProjectsFromDB={};
            var PID = localStorage.PID;
            var projectsBase = database.ref('projects/');
            $scope.getProjectsFromDB = $firebaseArray(projectsBase);

            var projObj = $firebaseObject(database.ref('projects/' + PID));
            projObj.$loaded().then(function () {
                //resetta il filtersearch
                $scope.filterProjects={};

                var length=$scope.getProjectsFromDB.length;
                var j=0;
                for(var i=0; i<length; i++){ //si scorre tutto l'array
                    if($scope.getProjectsFromDB[i].owner === UID) {
                        $scope.filterProjects[j]=$scope.getProjectsFromDB[i];
                        j++;
                    }
                    var length2=$scope.getProjectsFromDB[i].troupers.length;
                    for(var k=0;k<length2; k++) {
                        if($scope.getProjectsFromDB[i].troupers[k] === UID) {
                            $scope.filterProjects[j]=$scope.getProjectsFromDB[i];
                            console.log("trovato");
                            j++;
                            break;
                        }
                    }
                    //console.log("getProjectsFromDB["+i+"]="+$scope.getProjectsFromDB[i].title);
                }
            });
        };

        // per cancellare i progetti
        $scope.deleteProject = function (prjID) {
            console.log("sto per cancellare il progetto con PID: " + prjID);
            database.ref('projects/' + prjID).remove();
            $scope.popolaMyProjects();
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

