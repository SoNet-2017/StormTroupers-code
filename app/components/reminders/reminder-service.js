'use strict';

angular.module('myApp.reminderService', [])

    .factory('ReminderService', function reminderService($firebaseArray, $firebaseObject) {
        var ref = firebase.database().ref().child("reminders");
        return {
            getReminders: function() {
                return $firebaseArray(ref);
            },

            /*getProjectInfo: function(projectID) {
                var projectRef = firebase.database().ref().child("projects").child(projectID);
                return $firebaseObject(projectRef);
            },*/

            createReminder: function(user, projID, projectName, reminder, date){
                var newReminder = {};
                newReminder['user'] = user;
                newReminder['projID'] = projID;
                newReminder['projectName'] = projectName;
                newReminder['reminder'] = reminder;
                newReminder['date'] = date;
                return newReminder;
            },

            addReminder: function(reminder) {
                return $firebaseArray(ref).$add(reminder);
            }
        };
    });