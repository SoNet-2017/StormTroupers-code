'use strict';

angular.module('myApp.users.usersChatService', [])

    .factory('UsersChatService', function usersChatService($firebaseArray, $firebaseObject) {
        var ref = firebase.database().ref().child("messages");
        return {
            getMessages: function() {
                return $firebaseArray(ref);
            },

            getUserInfo: function(userId) {
                var userRef = firebase.database().ref().child("users").child(userId);
                return $firebaseObject(userRef);
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
            createMessage: function(sender, senderName, receiver, text){
                var newMessage = {};
                newMessage['sender'] = sender;
                newMessage['senderName'] = senderName;
                newMessage['receiver'] = receiver;
                newMessage['text'] = text;
                var today = new Date();
                var day = today.getUTCDate();
                var month = today.getUTCMonth()+1; //January is 0!
                var year = today.getUTCFullYear();
                var hours = today.getUTCHours();
                var minutes = today.getUTCMinutes();
                var seconds = today.getUTCSeconds();

                if(day<10) {
                    day='0'+day;
                }

                if(month<10) {
                    month='0'+month;
                }
                if(hours<10) {
                    hours='0'+hours;
                }
                if(minutes<10) {
                    minutes='0'+minutes;
                }
                if(seconds<10) {
                    seconds='0'+seconds;
                }
                var currentDate = year.toString()+'-'+month.toString()+'-'+day.toString()+'-'+hours.toString()+':'+minutes.toString()+':'+seconds.toString();
                newMessage['utctime'] = currentDate;
                return newMessage;
            },
            addMessage: function(message) {
                return $firebaseArray(ref).$add(message);
            }
        };
    });