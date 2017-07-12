'use strict';

angular.module('myApp.editProject.editProjectService', [])

    .factory('EditProjectService', function($firebaseArray, $firebaseObject) {
        var NewEditProjectService = {

            // non vede le funzioni
            getProjectInfo: function(prjID) {
                var prjRef = firebase.database().ref().child("projects").child(prjID);
                return $firebaseObject(prjRef);
            },

            getUserInfo: function(userId) {
                var userRef = firebase.database().ref().child("users").child(userId);
                return $firebaseObject(userRef);
            },

            getFriendInfo: function(friendId) {
                var friendRef = firebase.database().ref().child("users").child(friendId);
                return $firebaseObject(friendRef);
            },

            getFriends: function(user) {
                var length = user.friends.length;
                var currFriendID;
                var friends=[];

                //console.log("length: "+length);
                for (var j = 0; j < length; j++) {
                    currFriendID = user.friends[j];
                    //console.log("curFriendID: "+currFriendID);
                    var currFriendObj = $firebaseObject(firebase.database().ref().child("users").child(currFriendID));
                    if(currFriendObj.$id !== "STORMTROUPERS_ADMIN") {
                        //console.log("curr friend: "+currFriendObj);
                        friends[j] = currFriendObj;
                    }
                }
                return friends;
            },

            deleteProject: function (prjID) {
                console.log("sto per cancellare il progetto con PID: " + prjID);
                var prjRef = firebase.database().ref().child('projects/').child(prjID);
                prjRef.remove();
                $location.path("/myProjectsView");
            }
        };
        return NewEditProjectService;
    });