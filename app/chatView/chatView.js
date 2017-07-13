'use strict';

angular.module('myApp.chatView', ['ngRoute'])

    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/chat/:recipientUserId', {
            templateUrl: 'chatView/chatView.html',
            controller: 'chatViewCtrl',
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

    .controller('chatViewCtrl', ['$scope', '$location', '$routeParams', 'Auth', '$firebaseObject','UiService', 'Users', 'CurrentDateService', 'ReminderService', 'UserList', 'UsersChatService', 'currentAuth', '$firebaseAuth', '$firebaseArray', function ($scope, $location, $routeParams, Auth, $firebaseObject, UiService, Users, CurrentDateService, ReminderService, UserList, UsersChatService, currentAuth, $firebaseAuth, $firebaseArray) {
        $scope.dati = {};
        $scope.auth = Auth;

        //caricano parti della ui
        $scope.showLogoItem=function() {
            UiService.showLogoItem();

        };

        $scope.launchSearchInSearchPage=function(){
            UiService.launchSearchInSearchPage();
        };

        //carica i ruoli professionali nella sidebar dell'utente loggato
        var UID = localStorage.UID;
        $scope.profile = UsersChatService.getUserInfo(UID);
        $scope.profile.$loaded().then(function () {
            var role = Object.values(obj.roles);
            for (var i = 0; i < role.length; i++) {
                document.getElementById("userRolesHome").innerHTML += role[i];
                if (i < role.length - 1) {
                    document.getElementById("userRolesHome").innerHTML += ", ";
                }
            }

        }).catch(function (error) {
            $scope.error = error;
        });

        $scope.dati.userId = currentAuth.uid;
        $scope.dati.reminders = ReminderService.getReminders();
        $scope.dati.currentDate = CurrentDateService.getCurrentDate();

        //per caricare la lista di amici che verrà poi filtrata nell'html in base a chi è online
        $scope.dati.friends=[];
        $scope.profile = UsersChatService.getUserInfo($scope.dati.userId);
        $scope.profile.$loaded().then(function () {
            $scope.dati.friends = UsersChatService.getFriends($scope.profile);
        });

        //preparano i dati che serviranno in fase di creazione ed invio del messaggio nella chat
        $scope.dati.recipientUserId = $routeParams.recipientUserId;
        $scope.dati.recipientUserInfo = UsersChatService.getUserInfo($scope.dati.recipientUserId);

        $scope.orderProp = 'utctime';
        $scope.dati.userInfo = UsersChatService.getUserInfo($scope.dati.userId);

        //get messages from firebase
        $scope.dati.messages = UsersChatService.getMessages();
        //function that add a message on firebase
        $scope.addMessage = function(e) {
            if (e.keyCode != 13) return;

            var newMessage = UsersChatService.createMessage($scope.dati.userId, $scope.dati.userInfo.email, $routeParams.recipientUserId, $scope.dati.msg);
            UsersChatService.addMessage(newMessage);
            $scope.dati.msg = "";
        };

        /*$scope.showSearchItem = function () {
            var x = document.getElementById("typeSearchContentHome");
            if (x.className.indexOf("w3-show") == -1)
                x.className += " w3-show";
            else
                x.className = x.className.replace(" w3-show", "");
        };*/


        /*
        funzioni di cambio view, non fatte tramite service in quanto si attivano solo asincronicamente quando l'utente clicca
         in determinati punti
         */
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

        $scope.goToPublicProjectPage = function (projectID) {
            $location.path("/publicProjectPageView");
            console.log("Sto pssando il pid: " + projectID);
            localStorage.PID = projectID;
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
