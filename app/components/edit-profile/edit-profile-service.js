'use strict';

angular.module('myApp.editProfileService', [])

    .factory('EditProfileService', function editProfileService($firebaseArray, $firebaseObject) {
        return {
            getUserInfo: function(userId) {
                var userRef = firebase.database().ref().child("users").child(userId);
                return $firebaseObject(userRef);
            }
        };
    });