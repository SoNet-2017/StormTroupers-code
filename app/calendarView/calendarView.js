'use strict';

angular.module('myApp.calendarView', ['ngRoute','myApp.calendar', 'myApp.insertAgendaService'])

    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/calendarView', {
            templateUrl: 'calendarView/calendarView.html',
            controller: 'calendarViewCtrl',
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

    .controller('calendarViewCtrl', ['$scope', '$location', 'Auth', '$firebaseObject', 'Users', 'CurrentDateService', 'ReminderService', 'InsertAgendaService', 'currentAuth', '$firebaseAuth', '$firebaseArray', function ($scope, $location, Auth, $firebaseObject, Users, CurrentDateService, ReminderService, InsertAgendaService, currentAuth, $firebaseAuth, $firebaseArray) {
        $scope.dati = {};
        $scope.auth = Auth;

        $scope.dati.reminders = ReminderService.getReminders();
        $scope.dati.currentDate = CurrentDateService.getCurrentDate();


        // controller del calendario
        var date = new Date();
        var d = date.getDate();
        var m = date.getMonth();
        var y = date.getFullYear();

        /* event source that contains custom events on the scope */
        $scope.events = [
            {title: 'All Day Event',start: new Date(y, m, 1), editable: true},
            {title: 'Long Event',start: new Date(y, m, d - 5),end: new Date(y, m, d - 2)},
            {id: 999,title: 'Repeating Event',start: new Date(y, m, d - 3, 16, 3),allDay: true},
            {id: 999,title: 'Repeating Event',start: new Date(y, m, d + 4, 16.5, 0),allDay: false},
            {title: 'Birthday Party',start: new Date(y, m, d + 1, 19, 0),end: new Date(y, m, d + 1, 22, 30),allDay: false},
            {title: 'Click for Google',start: new Date(y, m, 28),end: new Date(y, m, 29),url: 'http://google.com/'}
        ];

        /* Render Tooltip */
        $scope.eventRender = function( event, element, view ) {
            element.attr({'tooltip': event.title,
                'tooltip-append-to-body': true});
            $compile(element)($scope);
            console.log("-- Calling tooltip");
        };

        /* config object */
        $scope.uiConfig = {
            calendar:{
                height: 650,
                width: 450,
                editable: true,
                header:{
                    left: 'today prev,next',
                    center: 'title',
                    right: 'month,basicWeek,basicDay'
                },
                eventClick: $scope.alertOnEventClick,
                eventDrop: $scope.alertOnDrop,
                eventResize: $scope.alertOnResize,
                eventRender: $scope.eventRender
            }
        };

        /* Change View */
        $scope.renderCalender = function(calendar) {
            if(uiCalendarConfig.calendars[calendar]){
                uiCalendarConfig.calendars[calendar].fullCalendar('render');
            }
        };

        /* add and removes an event source of choice */
        $scope.addRemoveEventSource = function(sources,source) {
            var canAdd = 0;
            angular.forEach(sources,function(value, key){
                if(sources[key] === source){
                    sources.splice(key,1);
                    canAdd = 1;
                }
            });
            if(canAdd === 0){
                sources.push(source);
            }
        };

        /* event sources array*/
        $scope.eventSources 	= [$scope.events];
        $scope.eventSources2 	= [$scope.calEventsExt, $scope.eventsF, $scope.events];
        $scope.sources 			= "";
        $scope.source 			= "";

        /* add custom event*/
        $scope.addEvent = function() {
            console.log("-- Storing Data");
            //  1. Store new event in db
            // Simple POST request example (passing data) :
            $http.post('/api/addEvent', {
                title: $scope.newEventTitle,
                start: $scope.newEventStart,
                end: $scope.newEventEnd,
                allDay: false,
                url: ""
            }).
            success(function(data, status, headers, config) {
                // this callback will be called asynchronously
                // when the response is available
                console.log("-- Storing Data" + data + status);
                // 2. Render it in calendar
                $scope.events = res;

                callback($scope.events);
            }).
            error(function(data, status, headers, config) {
                // called asynchronously if an error occurs
                // or server returns response with an error status.
                $scope.events = [{}];

                console.log("-- Unable to Store Data" + data + status);
            });

        };

        console.log("-- Calling the Calendar controller");

        /* remove event */
        $scope.remove = function(index) {
            $scope.events.splice(index,1);
        };

        /* Change View */
        $scope.changeView = function(view,calendar) {
            uiCalendarConfig.calendars[calendar].fullCalendar('changeView',view);
        };

        /////////////////////////////////////////// fine controller calendario

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

        var PID = localStorage.PID;
        console.log("PID: "+PID);
        var prjObj = $firebaseObject(database.ref('projects/' + PID));
        prjObj.$loaded().then(function () {
            $scope.project = prjObj;

            //preparo i dati per il nuovo evento per il calendario
            $scope.dati.projectAgenda = $scope.project.$id;
            $scope.dati.projectTroupers = $scope.project.troupers;
        }).catch(function (error) {
            $scope.error = error;
        });



        $scope.addNewAgenda = function () {
            $scope.dati.userId = currentAuth.uid;

            var newAgenda = InsertAgendaService.createAgenda($scope.dati.agendaTitle, $scope.dati.agendaDate, $scope.dati.agendaTime, $scope.dati.agendaAddress, $scope.dati.agendaInfo, $scope.dati.projectAgenda, $scope.dati.projectTroupers);
            console.log("newAgenda.agendaTitle: "+newAgenda.title);
            InsertAgendaService.addAgenda(newAgenda);
            $scope.dati.agendaTitle = "";
            $scope.dati.agendaDate = "";
            $scope.dati.agendaTime = "";
            $scope.dati.agendaAddress = "";
            $scope.dati.agendaInfo = "";
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