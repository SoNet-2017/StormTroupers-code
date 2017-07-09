'use strict';

angular.module('myApp.publicProfilePageView', ['ngRoute'])

    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/publicProfilePageView', {
            templateUrl: 'publicProfilePageView/publicProfilePageView.html',
            controller: 'publicProfilePageViewCtrl',
            resolve: {
                // controller will not be loaded until $requireSignIn resolves
                // Auth refers to our $firebaseAuth wrapper in the factory below
                "currentAuth": ["Auth", function (Auth) {
                    // $requireSignIn returns a promise so the resolve waits for it to complete
                    // If the promise is rejected, it will throw a $routeChangeError (see above)
                    return Auth.$requireSignIn();
                }]
            }
        });
    }])

    .controller('publicProfilePageViewCtrl', ['$scope', '$location', 'Auth', '$firebaseObject', 'Users', 'currentAuth', '$firebaseAuth', '$firebaseArray', function ($scope, $location, Auth, $firebaseObject, Users, currentAuth, $firebaseAuth, $firebaseArray) {
        $scope.dati = {};
        $scope.auth = Auth;

        $scope.countries = countries_list;

        if(localStorage.otherUserID===localStorage.UID){
            document.getElementById("profileFeedbackWriter").style.display="none";
            document.getElementById("lateralLinks").style.display="none";
        }

        $scope.showLogoItem = function () {
            var x = document.getElementById("logoBarContentHome");
            if (x.className.indexOf("w3-show") == -1)
                x.className += " w3-show";
            else
                x.className = x.className.replace(" w3-show", "");
        };

        $scope.showSearchItem = function () {
            var x = document.getElementById("typeSearchContentHome");
            if (x.className.indexOf("w3-show") == -1)
                x.className += " w3-show";
            else
                x.className = x.className.replace(" w3-show", "");
        };

        $scope.goToDashboard = function () {
            $location.path("/homePageView")
        };

        $scope.goToSearchCrew = function () {
            $location.path("/searchPageView");
        };

        $scope.goToEditProfile = function () {
            $location.path("/editProfileView");
        };

        $scope.goToMyProjects = function () {
            $location.path("/myProjectsView");
        };

        $scope.goToMyTroupers = function () {
            $location.path("/friendsPageView");
            localStorage.otherUserID = UID;
        };

        $scope.goToPublicProjectPage = function (projectID) {
            $location.path("/publicProjectPageView");
            console.log("progetto che sto passando: " + projectID);
            localStorage.PID = projectID;
        };

        $scope.goToFriendsPage = function (otherUserID) {
            $location.path("/friendsPageView");
            localStorage.otherUserID = otherUserID;
        };

        $scope.goToMyPublicProfile = function () {
            $location.path("/publicProfilePageView");
            localStorage.otherUserID = UID;
        };

        $scope.goToPublicProfile = function (userID) {
            $location.path("/publicProfilePageView");
            //console.log("utente che sto passando: "+userID);
            localStorage.otherUserID = userID;
        };

        var UID = localStorage.UID;
        var database = firebase.database();

        $scope.profile = $firebaseObject(database.ref('users/' + UID));
        $scope.profile.$loaded().then(function () {
            var role = Object.values($scope.profile.roles);
            for (var i = 0; i < role.length; i++) {
                document.getElementById("userRolesHome").innerHTML += role[i];
                if (i < role.length - 1) {
                    document.getElementById("userRolesHome").innerHTML += ", ";
                }
            }
        }).catch(function (error) {
            $scope.error = error;
            //console.log("errore: "+error);
        });

        // UID dell'utente di cui si vuole vedere il profilo pubblico
        var otherUserID = localStorage.otherUserID;
        $scope.friends = {};

        $scope.otherUser = $firebaseObject(database.ref('users/' + otherUserID));
        $scope.otherUser.$loaded().then(function () {
            //console.log("nome other user: "+$scope.otherUser.name+" ID: "+otherUserID+" DESCR: "+$scope.otherUser.description);
            var userRoles = Object.values($scope.otherUser.roles);
            for (var i = 0; i < userRoles.length; i++) {
                document.getElementById("userRoles").innerHTML += userRoles[i];
                if (i < userRoles.length - 1) {
                    document.getElementById("userRoles").innerHTML += ", ";
                }
            }
            $scope.calculateAge();

            var length = $scope.otherUser.friends.length;
            var currFriendID;
            //console.log("length: "+length);
            for (var j = 0; j < length; j++) {
                currFriendID = $scope.otherUser.friends[j];
                //console.log("curFriendID: "+currFriendID);
                var currFriendObj = $firebaseObject(database.ref('users/' + currFriendID));

                //console.log("curr friend: "+currFriendObj);
                $scope.friends[j] = currFriendObj;

            }

            var feedbackContainer=document.getElementById("feedbackPar");
            var otherUserFeedback = Object.values($scope.otherUser.feedback);
            for (var k=0; k<otherUserFeedback.length; k++){
                var feedbackNotParsed=otherUserFeedback[k].split(':');
                var feedbackAuthor=feedbackNotParsed[0];
                var feedbackText=feedbackNotParsed[1];
                var feedbackVote=feedbackNotParsed[2];
                feedbackContainer.innerHTML+="<h5><strong>"+feedbackAuthor+"</strong></h5>"+feedbackText+"<p>"+"Vote: "+feedbackVote+"</p>";
                if(k<otherUserFeedback.length-1){
                    feedbackContainer.innerHTML+="<br\>";
                }
            }

            $scope.getProjectsFromDB = {};
            var projectsBase = database.ref('projects/');
            $scope.getProjectsFromDB = $firebaseArray(projectsBase);
            $scope.getProjectsFromDB.$loaded().then(function () {

                console.log("projects[0]: " + $scope.getProjectsFromDB[0].troupers.length);

                //resetta il filtersearch
                $scope.projPublicPage = {};
                $scope.followingProjects = {};

                var length = $scope.getProjectsFromDB.length;
                console.log("length quii: " + length);
                var j = 0; //indice di projPublicPage
                var n = 0; //indice di followingProjects

                for (var i = 0; i < length; i++) { //si scorre tutto l'array
                    var length3 = $scope.getProjectsFromDB[i].troupers.length;
                    console.log("lenght ddi troupers: " + length3);
                    for (var k = 0; k < length3; k++) {
                        if ($scope.getProjectsFromDB[i].troupers[k] === otherUserID) {
                            $scope.projPublicPage[j] = $scope.getProjectsFromDB[i];
                            console.log("trovato proj condiviso con l'utente loggato");
                            j++;
                            break;
                        }
                    }

                    var followingProj = [];
                    //aggiungo il campo followingProjects
                    if ($scope.otherUser.followingProjects === undefined) {
                        database.ref('users/' + otherUserID).update({
                            name: $scope.otherUser.name,
                            lastName: $scope.otherUser.lastName,
                            phone: $scope.otherUser.phone,
                            permissionToShowPhone: $scope.otherUser.permissionToShowPhone,
                            gender: $scope.otherUser.gender,
                            roles: $scope.otherUser.roles,
                            race: $scope.otherUser.race,

                            country: $scope.otherUser.country,
                            province: $scope.otherUser.province,
                            city: $scope.otherUser.city,
                            logged: $scope.otherUser.logged,
                            car: $scope.otherUser.car,
                            payment: $scope.otherUser.payment,
                            description: $scope.otherUser.description,
                            dateOfBirth: $scope.otherUser.dateOfBirth,
                            friends: $scope.otherUser.friends,
                            followingProjects: followingProj,
                            email: $scope.otherUser.email,
                            password: $scope.otherUser.password
                        }).catch(function (error) {
                            $scope.error = error;
                        });
                    } else {
                        var length2 = $scope.otherUser.followingProjects.length;
                        //progetti che l'utente loggato segue/ha messo like
                        for (var m = 0; m < length2; m++) {
                            if ($scope.getProjectsFromDB[i].$id === $scope.otherUser.followingProjects[m]) {
                                $scope.followingProjects[n] = $scope.getProjectsFromDB[i];
                                console.log("proj con like");
                                n++;
                                break;
                            }
                        }
                    }

                }
            }).catch(function (error) {
                $scope.error = error;
                console.log("sono in errore1: " + error);
            });
        }).catch(function (error) {
            $scope.error = error;
            console.log("sono in errore2: " + error);
        });

        $scope.check=function(val){
            localStorage.setItem("numStars", val);
            $scope.checkStars();
        };

        $scope.checkStars=function(){
            var st = localStorage.getItem("numStars");
            var num = "star-" + st;
            document.getElementById(num).checked=true;
        };

        $scope.addFeedback=function (otherUserID) {
            $scope.otherUser=$firebaseObject(database.ref('users/'+otherUserID));
            $scope.otherUser.$loaded().then(function () {
                var feedback=document.getElementById("feedbackText").value;
                var utenteFeedback=$scope.profile.name+" "+$scope.profile.lastName;
                var votes=$scope.otherUser.votes.votes;
                var total=$scope.otherUser.votes.total;
                var n=parseInt(localStorage.getItem("numStars"));
                var newVotes=parseInt(votes)+1;
                var newTotal=parseInt(total)+n;
                database.ref('users/'+otherUserID).update({
                    votes:{
                        votes: newVotes,
                        total: newTotal
                    }
                }).then(function () {
                    $scope.otherUser.feedback.push(utenteFeedback+":"+feedback+":"+n);
                    $scope.otherUser.$save().then(function () {
                        var nObj=$firebaseObject(database.ref('users/'+otherUserID));
                        nObj.$loaded().then(function () {
                            localStorage.otherUserID=otherUserID;
                            $scope.goToDashboard();
                        }).catch(function (error) {
                            $scope.error=error;
                        })
                    }).catch(function (error) {
                        $scope.error = error;
                    })
                })

            }).catch(function (error) {
                $scope.error = error;
            });
        }


        $scope.addUserToFriends = function (otherUserID) {
            if ($scope.profile.friends.indexOf(otherUserID) < 0) {
                $scope.otherUser = $firebaseObject(database.ref('users/' + otherUserID));
                $scope.otherUser.$loaded().then(function () {
                    //aggiorno il vettore anche nell'amico
                    $scope.otherUser.friends.push(UID);
                    //console.log("vettore amicicci di other user"+otherUserID+": "+$scope.otherUser.friends);
                    $scope.otherUser.$save();

                    //aggiorno il vettore dell'utente loggato
                    $scope.profile.friends.push(otherUserID);
                    //console.log("vettore amicicci dell'utente loggato: "+$scope.profile.friends);
                    $scope.profile.$save();
                    console.log("Trouper aggiunto agli amici: " + otherUserID);
                }).catch(function (error) {
                    $scope.error = error;
                });
            }
            else console.log("trouper già inserito");
        };

        $scope.calculateAge = function () {
            var ageString = $scope.otherUser.dateOfBirth;
            var ageStringYear = ageString.slice(0, 4);
            var ageIntYear = parseInt(ageStringYear);
            var ageStringMonth = ageString.slice(5, 7);
            var ageIntMonth = parseInt(ageStringMonth);
            var ageStringDay = ageString.slice(8, 10);
            var ageIntDay = parseInt(ageStringDay);

            var actorAge = ageIntDay + (ageIntMonth * 30) + (ageIntYear * 365);

            var today = new Date();
            var dd = today.getDate();
            var mm = today.getMonth() + 1; //January is 0!
            var yyyy = today.getFullYear();

            console.log("Date con la function: " + dd + "/" + mm + "/" + yyyy);

            var currentDate = dd + (mm * 30) + (yyyy * 365);

            var ageInDays = currentDate - actorAge;
            $scope.age = Math.floor(ageInDays / 365);
        };

        $scope.logout = function () {
            Users.registerLogout(currentAuth.uid);
            $firebaseAuth().$signOut();
            $firebaseAuth().$onAuthStateChanged(function (firebaseUser) {
                if (firebaseUser) {
                    console.log("User is yet signed in as:", firebaseUser.uid);
                } else {
                    $location.path("/loginView");
                }
            });


        };

    }]);