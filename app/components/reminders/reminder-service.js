'use strict';

angular.module('myApp.reminderService', [])

    .factory('ReminderService', function usersChatService($firebaseArray, $firebaseObject) {
        var ref = firebase.database().ref().child("reminders");
        return {
            getReminders: function() {
                return $firebaseArray(ref);
            },

            /*getProjectInfo: function(projectID) {
                var projectRef = firebase.database().ref().child("projects").child(projectID);
                return $firebaseObject(projectRef);
            },*/

            createReminder: function(user, projID, projectName, reminder){
                var newReminder = {};
                newReminder['user'] = user;
                newReminder['projID'] = projID;
                newReminder['projectName'] = projectName;
                newReminder['reminder'] = reminder;

                var today = new Date();
                var day = today.getUTCDate();
                var month = today.getUTCMonth()+1; //January is 0!
                var year = today.getUTCFullYear();

                if(day<10) {
                    day='0'+day;
                }

                if(month<10) {
                    month='0'+month;
                }
                var currentDate = year.toString()+'-'+month.toString()+'-'+day.toString();

                newReminder['date'] = currentDate;
                return newReminder;
            },

            addReminder: function(reminder) {
                return $firebaseArray(ref).$add(reminder);
            }
        };
    });