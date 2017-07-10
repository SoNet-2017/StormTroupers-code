/**
 * Created by matil_000 on 09/06/2017.
 */

'use strict';

angular.module('myApp.publicProjectPageView', ['ngRoute'])

    .config(['$routeProvider', function($routeProvider) {
        $routeProvider.when('/publicProjectPageView', {
            templateUrl: 'publicProjectPageView/publicProjectPageView.html',
            controller: 'publicProjectPageViewCtrl',
            resolve: {
                // controller will not be loaded until $requireSignIn resolves
                // Auth refers to our $firebaseAuth wrapper in the factory below
                "currentAuth": ["Auth", function(Auth) {
                    // $requireSignIn returns a promise so the resolve waits for it to complete
                    // If the promise is rejected, it will throw a $routeChangeError (see above)
                    return Auth.$requireSignIn();
                }]
            }
        });
    }])

    .controller('publicProjectPageViewCtrl', ['$scope', '$location', 'Auth', '$firebaseObject','Users', 'currentAuth', '$firebaseAuth', '$firebaseArray', function ($scope,$location, Auth, $firebaseObject, Users, currentAuth, $firebaseAuth, $firebaseArray) {
        $scope.dati={};
        $scope.auth=Auth;

        $scope.showLogoItem=function () {
            var x = document.getElementById("logoBarContentHome");
            if (x.className.indexOf("w3-show") == -1)
                x.className += " w3-show";
            else
                x.className = x.className.replace(" w3-show", "");
        };

        $scope.showSearchItem=function () {
            var x = document.getElementById("typeSearchContentHome");
            if (x.className.indexOf("w3-show") == -1)
                x.className += " w3-show";
            else
                x.className = x.className.replace(" w3-show", "");
        };

        $scope.goToDashboard=function () {
            $location.path("/homePageView")
        };

        $scope.goToSearchCrew=function () {
            $location.path("/searchPageView");
        };

        $scope.goToSearchProjects=function () {
            $location.path("/searchProjectsView");
        };

        $scope.goToEditProfile=function () {
            $location.path("/editProfileView");
        };

        $scope.goToMyProjects=function() {
            $location.path("/myProjectsView");
        };

        $scope.goToMyTroupers=function () {
            $location.path("/friendsPageView");
            localStorage.otherUserID = UID;
        };

        $scope.goToPublicProfile=function(userID) {
            $location.path("/publicProfilePageView");
            console.log("utente che sto passando: "+userID);
            localStorage.otherUserID = userID;
        };

        $scope.goToMyPublicProfile=function () {
            $location.path("/publicProfilePageView");
            localStorage.otherUserID=UID;
        };

        var database=firebase.database();

        var UID=localStorage.UID;
        var usersBase=database.ref('users/');
        var userQuery=usersBase.limitToLast(5);
        $scope.filterUsers=$firebaseArray(userQuery);

        $scope.profile = $firebaseObject(database.ref('users/'+UID));
        $scope.profile.$loaded().then(function () {
            var role = Object.values(obj.roles);
            for(var i=0; i<role.length; i++){
                document.getElementById("userRolesHome").innerHTML+=role[i];
                if(i<role.length-1) {
                    document.getElementById("userRolesHome").innerHTML+=", ";
                }
            }

        }).catch(function (error) {
            $scope.error=error;
        });

        var PID = localStorage.PID;
        $scope.prj = $firebaseObject(database.ref('projects/' + PID));
        $scope.prj.$loaded().then(function () {
            console.log("titolo progetto quiiiZ: " + $scope.prj.title);
            $scope.findAdjustedRoles();
        });

        $scope.findAdjustedRoles=function() {
            //mia ajunta
            var temp_adjustedRoles= $scope.prj.rolesNeeded;
            console.log("step 1");
            var ar_adj=temp_adjustedRoles.length;
            console.log("step 2");
            $scope.adjustedRoles = {};
            console.log("step 3");
            for (var abbabua=1; abbabua<ar_adj; abbabua++) {
                $scope.adjustedRoles[abbabua-1]=temp_adjustedRoles[abbabua];
                console.log($scope.adjustedRoles);
            }
            console.log("step 4");
        };

        $scope.proposeYourself=function(){

        };

        $scope.addProjectToFavourite=function(){

            var projectsIfollow = [];
            if ($scope.profile.followingProjects === undefined) {
                projectsIfollow.push(PID);

                database.ref('users/' + UID).update({
                    name: $scope.profile.name,
                    lastName: $scope.profile.lastName,
                    phone: $scope.profile.phone,
                    permissionToShowPhone: $scope.profile.permissionToShowPhone,
                    gender: $scope.profile.gender,
                    roles: $scope.profile.roles,
                    race: $scope.profile.race,

                    country: $scope.profile.country,
                    province: $scope.profile.province,
                    city: $scope.profile.city,
                    car: $scope.profile.car,
                    payment: $scope.profile.payment,
                    description: $scope.profile.description,
                    dateOfBirth: $scope.profile.dateOfBirth,
                    friends: $scope.profile.friends,
                    followingProjects: projectsIfollow,
                    email: $scope.profile.email,
                    password: $scope.profile.password,
                    logged: $scope.profile.logged
                }).then(function () {
                    var nObj = $firebaseObject(database.ref('users/' + UID));
                    nObj.$loaded().then(function () {
                        $scope.profile = nObj;
                        $scope.prj.likes++;
                        $scope.prj.$save();
                        console.log("aggiunto progetto "+$scope.prj.title+" ai progetti che "+UID+" segue");
                    }).catch(function (error) {
                        $scope.error = error;
                    })
                }).catch(function (error) {
                    $scope.error = error;
                });
            }
            else {
                if ($scope.profile.followingProjects.indexOf(PID) < 0) {
                    console.log("sono inside a following proj");
                    $scope.prj.likes++;
                    $scope.prj.$save();
                    $scope.profile.followingProjects.splice($scope.profile.followingProjects.length, 0, PID);
                    $scope.profile.$save();
                }
            }


        };

        $scope.logout = function () {
            Users.registerLogout(currentAuth.uid);
            $firebaseAuth().$signOut();
            $firebaseAuth().$onAuthStateChanged(function(firebaseUser) {
                if (firebaseUser) {
                    console.log("User is yet signed in as:", firebaseUser.uid);
                } else {
                    $location.path("/loginView");
                }
            });


        };

    }]);
