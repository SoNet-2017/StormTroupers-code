'use strict';

angular.module('myApp.users.usersService', [])

    .factory('Users', function($firebaseArray) {
        return {
            registerLogin: function (userId, email) {
                //add the user to list of users and set the logged value to true
                var ref = firebase.database().ref().child("users").child(userId);
                // create a synchronized array
                ref.update({
                    email: email,
                    logged: true
                });
            },
            registerLogout: function (userId)
            {
                var ref = firebase.database().ref().child("users").child(userId);
                // create a synchronized array
                ref.update({
                    logged: false
                });
            },
            registerNewUserInfo: function (userId, name, surname, email) {
                //add the user to list of users and set the logged value to true
                var ref = firebase.database().ref().child("users").child(userId);
                // create a synchronized array
                ref.set({
                    name: name,
                    surname: surname,
                    email: email
                });
            }
        };
    });
