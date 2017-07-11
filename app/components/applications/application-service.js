'use strict';

angular.module('myApp.applicationService', [])

    .factory('ApplicationsService', function usersChatService($firebaseArray, $firebaseObject) {
        var ref = firebase.database().ref().child("applications");
        return {
            getApplications: function() {
                return $firebaseArray(ref);
            },

            getProjectInfo: function(projectID) {
                var projectRef = firebase.database().ref().child("projects").child(projectID);
                return $firebaseObject(projectRef);
            },
            createApplication: function(sender, project, projectTitle, motivationalMsg, roles){
                var newApplication = {};
                newApplication['sender'] = sender;
                newApplication['project'] = project;
                newApplication['projectTitle'] = projectTitle;
                newApplication['motivationalMsg'] = motivationalMsg;
                newApplication['roles'] = roles;
                return newApplication;
            },
            addApplication: function(application) {
                return $firebaseArray(ref).$add(application);
            }
        };
    });