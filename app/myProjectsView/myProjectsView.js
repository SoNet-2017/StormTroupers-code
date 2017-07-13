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

    .controller('myProjectsViewCtrl', ['$scope', '$location', 'Auth', '$firebaseObject','UiService', 'Users', 'ProfileService', 'ProjectService', 'CurrentDateService', 'ReminderService', 'currentAuth', '$firebaseAuth', '$firebaseArray', function ($scope, $location, Auth, $firebaseObject,UiService, Users, ProfileService, ProjectService, CurrentDateService, ReminderService, currentAuth, $firebaseAuth, $firebaseArray) {
        $scope.dati = {};
        $scope.auth = Auth;

        $scope.dati.reminders = ReminderService.getReminders();
        $scope.dati.currentDate = CurrentDateService.getCurrentDate();
        //console.log("current date: "+$scope.dati.currentDate);

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

        $scope.goToPublicProjectPage=function (projID) {
            $location.path("/publicProjectPageView");
            localStorage.PID = projID;
        };

        $scope.goToMyPublicProfile=function () {
            $location.path("/publicProfilePageView");
            localStorage.otherUserID=UID;
        };

        $scope.goToNewProject = function () {
            $location.path("/newProjectView");
        };

        $scope.goToEditor=function(prjXID){
            $location.path("/editorView");
            localStorage.PID=prjXID;
        };

        var UID = localStorage.UID;
        var database = firebase.database();

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

        $scope.getProjectsFromDB={};
        $scope.filterProjects={};

        $scope.getProjectsFromDB = ProjectService.getProjects();
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

        $scope.saveCurrentProject=function(projID, projName){
            // Salvo i dati per creare il reminder sul project selezionato
            $scope.dati.projectIDReminder = projID;

            $scope.dati.projectNameReminder = projName;
        };

        $scope.addReminder = function () {
            $scope.dati.userId = currentAuth.uid;

            //create the JSON structure that should be sent to Firebase: user, projID, projectName, reminder
            var newReminder = ReminderService.createReminder($scope.dati.userId, $scope.dati.projectIDReminder, $scope.dati.projectNameReminder, $scope.dati.reminder, $scope.dati.date);
            console.log("newApplication.sender: "+newReminder.user);
            ReminderService.addReminder(newReminder);
            $scope.dati.reminder = "";
            $scope.dati.date = "";
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

