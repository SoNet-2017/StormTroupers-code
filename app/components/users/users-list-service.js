'use strict';

angular.module('myApp.users.usersListService', [])

    .factory('UserList', function userListService($firebaseObject,$firebaseArray) {
        var ref = firebase.database().ref().child("users");

        return {
            getListOfUsers: function () {
                //get the list of logged users
                // download the data into a local object
                return $firebaseArray(ref);
            },

            getFriends: function(user) {
                var length = user.friends.length;
                var currFriendID;
                var friends=[];

                //console.log("length: "+length);
                var i=0;
                for (var j = 0; j < length; j++) {
                    currFriendID = user.friends[j];
                    //console.log("curFriendID: "+currFriendID);
                    var currFriendObj = $firebaseObject(ref.child(currFriendID));
                    if(currFriendObj.$id !== "STORMTROUPERS_ADMIN") {
                        //console.log("curr friend: "+currFriendObj.$id);
                        friends[i] = currFriendObj;
                        i++;
                    }
                }
                return friends;
            }
        };
    });