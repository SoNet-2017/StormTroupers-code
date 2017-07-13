'use strict';

angular.module('myApp.projects.projectService', [])

    .factory('ProjectService', function projectService($firebaseArray, $firebaseObject,$location) {
        var ref = firebase.database().ref().child("projects");
        return {
            getProjects: function() {
                return $firebaseArray(ref);
            },

            getProjectInfo: function(prjId) {
                var prjRef = ref.child(prjId);
                return $firebaseObject(prjRef);
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

            getTroupers: function (project) {
                var length = project.troupers.length;
                var currTrouperID;
                var troupers=[];

                //console.log("length: "+length);
                for (var j = 0; j < length; j++) {
                    currTrouperID = project.troupers[j];
                    //console.log("curFriendID: "+currFriendID);
                    var currTrouperObj = $firebaseObject(firebase.database().ref().child("users").child(currTrouperID));
                    if(currTrouperObj.$id !== "STORMTROUPERS_ADMIN") {
                        //console.log("curr trouper: "+currTrouperObj);
                        troupers[j] = currTrouperObj;
                    }
                }
                return troupers;
            },

            deleteProject: function (prjID) {
                //console.log("sto per cancellare il progetto con PID: " + prjID);
                ref.child(prjID).remove();
                $location.path("/myProjectsView");
            }
        };
    });