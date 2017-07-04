'use strict';

var config = {
    apiKey: "AIzaSyC1h93va3LqIsg0-frLfVsL_pqxx9oXT_A",
    authDomain: "stormtroupers-d1a6d.firebaseapp.com",
    databaseURL: "https://stormtroupers-d1a6d.firebaseio.com",
    projectId: "stormtroupers-d1a6d",
    storageBucket: "stormtroupers-d1a6d.appspot.com",
    messagingSenderId: "412236078435"
};
firebase.initializeApp(config);

angular.module('myApp', [
    'ngRoute',
    "firebase",
    'myApp.loginView',
    'myApp.advancedJoinView',
    'myApp.authentication',
    'myApp.homePageView',
    'myApp.editProfileView',
    'myApp.users',
    'myApp.fileUpload',
    'myApp.searchPageView',
    'myApp.myProjectsView',
    'myApp.newProjectView',
    'myApp.editProjectView',
    'myApp.publicProjectPageView',
    'rzModule'
])

    .config(['$locationProvider', '$routeProvider', function($locationProvider, $routeProvider) {
        $locationProvider.hashPrefix('!');
        $routeProvider.otherwise({redirectTo: '/loginView'});
    }])

    .run(["$rootScope", "$location", function($rootScope, $location) {
        $rootScope.$on("$routeChangeError", function(event, next, previous, error) {
            // We can catch the error thrown when the $requireSignIn promise is rejected
            // and redirect the user back to the home page
            if (error === "AUTH_REQUIRED") {
                $location.path("/loginView");
            }
        });
    }]);