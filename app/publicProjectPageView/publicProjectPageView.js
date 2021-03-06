/**
 * Created by matil_000 on 09/06/2017.
 */

'use strict';

angular.module('myApp.publicProjectPageView', ['ngRoute'])

    .config(['$routeProvider', function($routeProvider) {
        $routeProvider.when('/publicProjectPageView', {
            templateUrl: 'publicProjectPageView/publicProjectPageView.html',
            controller: 'publicProjectPageViewCtrl',
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

    .controller('publicProjectPageViewCtrl', ['$scope', '$location', 'Auth', '$firebaseObject','UiService','Users', 'UserList', 'ProfileService', 'ProjectService', 'CurrentDateService', 'ReminderService', 'ApplicationsService', 'currentAuth', '$firebaseAuth', '$firebaseArray', function ($scope,$location, Auth, $firebaseObject,UiService, Users, UserList, ProfileService, ProjectService, CurrentDateService, ReminderService, ApplicationsService, currentAuth, $firebaseAuth, $firebaseArray) {

        $scope.dati={};
        $scope.auth=Auth;

        $scope.dati.reminders = ReminderService.getReminders();
        $scope.dati.currentDate = CurrentDateService.getCurrentDate();

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

        $scope.goToDashboard=function () {
            $location.path("/homePageView")
        };

        $scope.goToSearchCrew=function () {
            $location.path("/searchPageView");
        };

        $scope.goToSearchProjects=function () {
            $location.path("/searchProjectsView");
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

        $scope.goToMyApplications=function() {
            $location.path("/jobApplicationsView");
        };

        $scope.goToPublicProfile=function(userID) {
            $location.path("/publicProfilePageView");
            console.log("utente che sto passando: "+userID);
            localStorage.otherUserID = userID;
        };

        $scope.goToMyPublicProfile=function () {
            $location.path("/publicProfilePageView");
            localStorage.otherUserID=UID;
        };

        $scope.goToEditor=function () {
            $location.path("/editorView");
        };

        var database=firebase.database();

        var UID=localStorage.UID;
        var usersBase=database.ref('users/');
        var userQuery=usersBase.limitToLast(5);
        $scope.filterUsers=$firebaseArray(userQuery);

        $scope.profile = ProfileService.getUserInfo(UID);
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
        });

        var PID = localStorage.PID;
        $scope.projTroupers={};

        $scope.prj = ProjectService.getProjectInfo(PID);
        $scope.prj.$loaded().then(function () {

            $scope.projTroupers = ProjectService.getTroupers($scope.prj);
            //console.log(($scope.projTroupers[]));

            $scope.findAdjustedRoles();

        }).catch(function (error) {
            console.log("sono in errore project load");
            $scope.error=error;
        });

        $scope.findAdjustedRoles=function() {
            //mia ajunta
            var temp_adjustedRoles= $scope.prj.rolesNeeded;
            if (temp_adjustedRoles[0]=="init") {
                var ar_adj = temp_adjustedRoles.length;
                $scope.adjustedRoles = {};
                for (var a = 1; a < ar_adj; a++) {
                    $scope.adjustedRoles[a - 1] = temp_adjustedRoles[a];
                }
            }
            else {
                $scope.adjustedRoles=$scope.prj.rolesNeeded;
            }
        };

        // INVIO DOMANDA DI LAVORO
        $scope.dati.userId = currentAuth.uid;

        $scope.dati.projectAppliedFor = PID;
        $scope.dati.projectAppliedForInfo = ApplicationsService.getProjectInfo($scope.dati.projectAppliedFor);
        //$scope.dati.userInfo = UsersChatService.getUserInfo($scope.dati.userId);

        //get messages from firebase
        //$scope.dati.applications = ApplicationsService.getApplications();
        //function that add a message on firebase
        $scope.addApplication = function () {

            // non so come prendere i campi checkati dei ruoli richiesti
            /*var roles =  document.getElementsByName("roleAppliedFor");
            console.log("roles: " + roles);

            for(var i=0; i<roles.length; i++) {
                $scope.dati.roles += roles[i];
                if(i<roles.length-1) {
                    $scope.dati.roles +=", ";
                }
            }
            console.log("$scope.dati.roles: " + $scope.dati.roles);*/
            var roles="";
            for(var i=1; i<$scope.prj.rolesNeeded.length; i++)
                roles+=$scope.prj.rolesNeeded[i].toString()+';';
            //console.log("$scope.dati.roles: " + $scope.roles);
            $scope.dati.roles = roles;
            $scope.dati.projTitle = $scope.prj.title;
            //console.log("$scope.dati.userId: " + $scope.dati.userId);
            //console.log("$scope.dati.project: " + $scope.dati.projectAppliedFor);
            //console.log("$scope.dati.motivationalMsg: " + $scope.dati.motivationalMsg);

            //create the JSON structure that should be sent to Firebase
            var newApplication = ApplicationsService.createApplication($scope.dati.userId, $scope.dati.projectAppliedFor, $scope.dati.projTitle, $scope.dati.motivationalMsg, $scope.dati.roles);
            console.log("newApplication.sender: "+newApplication.sender);
            ApplicationsService.addApplication(newApplication);
            $scope.dati.motivationalMsg = "";

            //$location.path("/jobApplicationsView");
        };

        $scope.addProjectToFavourite=function(){

            if ($scope.profile.followingProjects[0] === "init") {
                $scope.profile.followingProjects[0] = PID;
                $scope.profile.$save().then(function () {
                    var nObj = ProfileService.getUserInfo(UID);
                    nObj.$loaded().then(function () {
                        $scope.profile = nObj;
                        $scope.prj.likes++;
                        $scope.prj.$save();
                        console.log("aggiunto progetto "+$scope.prj.title+" ai progetti che "+UID+" segue");
                    }).catch(function (error) {
                        $scope.error = error;
                    })
                }).catch(function (error) {
                    $scope.error = error;
                });
            }
            else {
                if ($scope.profile.followingProjects.indexOf(PID) < 0) {
                    console.log("sono inside a following proj");
                    $scope.prj.likes++;
                    $scope.prj.$save();
                    $scope.profile.followingProjects.splice($scope.profile.followingProjects.length, 0, PID);
                    $scope.profile.$save();
                }
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
