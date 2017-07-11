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

    .controller('myProjectsViewCtrl', ['$scope', '$location', 'Auth', '$firebaseObject', 'Users', 'ReminderService', 'currentAuth', '$firebaseAuth', '$firebaseArray', function ($scope, $location, Auth, $firebaseObject, Users, ReminderService, currentAuth, $firebaseAuth, $firebaseArray) {
        $scope.dati = {};
        $scope.auth = Auth;

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

        $scope.goToSearchProjects=function () {
            $location.path("/searchProjectsView");
        };

        $scope.goToEditProfile = function () {
            $location.path("/editProfileView");
        };

        $scope.goToMyProjects = function () {
            $location.path("/myProjectsView");
        };

        $scope.goToMyTroupers=function () {
            $location.path("/friendsPageView");
            localStorage.otherUserID = UID;
        };

        $scope.goToMyApplications=function() {
            $location.path("/jobApplicationsView");
        };

        $scope.goToEditProjectX = function (prjXID) {
            $location.path("/editProjectView");
            console.log("Titolo passato: " + prjXID);
            localStorage.PID = prjXID;
        };

        $scope.goToCalendar=function(prjXID){
            $location.path("/calendarView");
            localStorage.PID = prjXID;
        };

        $scope.goToPublicProfile = function (userID) {
            if(userID !== localStorage.UID) {
                $location.path("/publicProfilePageView");
                console.log("utente che sto passando: " + userID);
                localStorage.otherUserID = userID;
            }
        };

        $scope.goToMyPublicProfile=function () {
            $location.path("/publicProfilePageView");
            localStorage.otherUserID=UID;
        };

        $scope.goToNewProject = function () {
            $location.path("/newProjectView");
        };

        var UID = localStorage.UID;
        var database = firebase.database();

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
        });

        $scope.getProjectsFromDB={};
        var PID = localStorage.PID;
        var projectsBase = database.ref('projects/');
        $scope.filterProjects={};

        $scope.getProjectsFromDB = $firebaseArray(projectsBase);

        $scope.getProjectsFromDB.$loaded().then(function () {
            //resetta il filtersearch

            var length=$scope.getProjectsFromDB.length;
            var j=0;
            for(var i=0; i<length; i++){ //si scorre tutto l'array
                if($scope.getProjectsFromDB[i].owner === UID) {
                    $scope.filterProjects[j]=$scope.getProjectsFromDB[i];
                    j++;
                }
                var length2=$scope.getProjectsFromDB[i].troupers.length;
                for(var k=0;k<length2; k++) {
                    if($scope.getProjectsFromDB[i].troupers[k] === UID && $scope.getProjectsFromDB[i].owner !== $scope.getProjectsFromDB[i].troupers[k]) {
                        $scope.filterProjects[j]=$scope.getProjectsFromDB[i];
                        console.log("trovato");
                        j++;
                        break;
                    }
                }
            }
            //console.log("getProjectsFromDB["+i+"]="+$scope.getProjectsFromDB[i].title);
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
                    console.log("getProjectsFromDB["+i+"]="+$scope.getProjectsFromDB[i].title);
                }

                console.log("sono fuori dal primo ciclo");
                for(var i=0; i< $scope.filterProjects.length; i++){
                    console.log("titolo progetto quiiiZ: " + $scope.filterProjects[i].title);
                    console.log("$scope.prj.troupers: "+$scope.filterProjects[i].troupers);

                    var length = $scope.filterProjects[i].troupers.length;
                    for(var k=0; k<length; k++){
                        console.log("$scope.prj.troupers[i]: "+$scope.filterProjects[i].troupers[k]);

                        var currTrouperUID = $scope.filterProjects[i].troupers[k];
                        var trouperObj = $firebaseObject(database.ref('users/' + currTrouperUID));
                        //console.log("indirizzo: "+database.ref('users/' + trouperUID));

                        $scope.projTroupers[k] = trouperObj;
                        console.log(($scope.projTroupers[k]));
                    }

                }
            });
        };

        $scope.saveCurrentProject=function(projID, projName){
            // Salvo i dati per il nuovo reminder
            $scope.dati.projectIDReminder = projID;

            $scope.dati.projectNameReminder = projName;

        };

        $scope.addReminder = function () {
            $scope.dati.userId = currentAuth.uid;

            //create the JSON structure that should be sent to Firebase: user, projID, projectName, reminder
            var newReminder = ReminderService.createReminder($scope.dati.userId, $scope.dati.projectIDReminder, $scope.dati.projectNameReminder, $scope.dati.reminder);
            console.log("newApplication.sender: "+newReminder.user);
            ReminderService.addReminder(newReminder);
            $scope.dati.reminder = "";

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

