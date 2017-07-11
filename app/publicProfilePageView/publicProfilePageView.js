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

    .filter('trusted', ['$sce', function ($sce) {
        return function(url) {
            return $sce.trustAsResourceUrl(url);
        };
    }])

    .controller('publicProfilePageViewCtrl', ['$scope', '$location', 'Auth', '$firebaseObject', 'Users', 'UsersChatService', 'currentAuth', '$firebaseAuth', '$firebaseArray', function ($scope, $location, Auth, $firebaseObject, Users, UsersChatService, currentAuth, $firebaseAuth, $firebaseArray) {
        $scope.dati = {};
        $scope.auth = Auth;

        $scope.countries = countries_list;



        if (localStorage.otherUserID === localStorage.UID) {
            document.getElementById("profileFeedbackWriter").style.display = "none";
            document.getElementById("lateralLinks").style.display = "none";
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

        $scope.goToSearchProjects = function () {
            $location.path("/searchProjectsView");
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

        $scope.goToMyPublicProfile = function (UID) {
            $location.path("/publicProfilePageView");
            $route.reload();
            localStorage.otherUserID = UID;
        };

        $scope.goToPublicProfile = function (userID) {
            $location.path("/publicProfilePageView");
            //console.log("utente che sto passando: "+userID);
            localStorage.otherUserID = userID;
        };

        $scope.goToPortfolio=function (userID) {
            $location.path("/portfolioView");
            localStorage.otherUserID=userID;
        };

        var UID = localStorage.UID;
        var database = firebase.database();

        // UID dell'utente di cui si vuole vedere il profilo pubblico
        var otherUserID = localStorage.otherUserID;

        $scope.profile = $firebaseObject(database.ref('users/' + UID));
        $scope.profile.$loaded().then(function () {
            var role = Object.values($scope.profile.roles);
            for (var i = 0; i < role.length; i++) {
                document.getElementById("userRolesHome").innerHTML += role[i];
                if (i < role.length - 1) {
                    document.getElementById("userRolesHome").innerHTML += ", ";
                }
            }
            if ($scope.profile.friends.indexOf(otherUserID) < 0) {
                $scope.alreadyFriend = false;
            } else {
                $scope.alreadyFriend = true;
            }
        }).catch(function (error) {
            $scope.error = error;
            //console.log("errore: "+error);
        });

        // PER CHAT ASINCRONA CON UTENTI COL QUALE NON SI E' AMICI
        $scope.dati.userId = currentAuth.uid;

        $scope.dati.recipientUserId = otherUserID;
        $scope.dati.recipientUserInfo = UsersChatService.getUserInfo($scope.dati.recipientUserId);

        $scope.orderProp = 'utctime';
        $scope.dati.userInfo = UsersChatService.getUserInfo($scope.dati.userId);

        //get messages from firebase
        $scope.dati.messages = UsersChatService.getMessages();
        //function that add a message on firebase
        $scope.addMessage = function () {
            $scope.textMessage = document.getElementById("txtMessage").value;
            //console.log("mes che voglio inviare: " + $scope.textMessage);

            //console.log("$scope.dati.userId: " + $scope.dati.userId);
            //console.log("$scope.dati.userInfo.email: " + $scope.dati.userInfo.email);
            //console.log("$scope.dati.userInfo.email: " + $scope.dati.recipientUserId);
            //console.log("$scope.dati.msg: " + $scope.dati.msg);

            //create the JSON structure that should be sent to Firebase
            var newMessage = UsersChatService.createMessage($scope.dati.userId, $scope.dati.userInfo.email, $scope.dati.recipientUserId, $scope.dati.msg);
            //console.log("newMessage.senderName: "+newMessage.senderName);
            UsersChatService.addMessage(newMessage);
            $scope.dati.msg = "";
        };

        if (otherUserID !== UID)
            $scope.myPublicPage = false;
        else
            $scope.myPublicPage = true;

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

            $scope.getPortfolioFromDB = {};
            $scope.filterPortfolio={};
            var idPortf=otherUserID+"_portfolio";
            var portfolioBase = database.ref('portfolioVideo/'+idPortf);
            $scope.getPortfolioFromDB = $firebaseArray(portfolioBase);
            console.log($scope.getPortfolioFromDB);
            var queryPortfolio=portfolioBase.orderByChild("id_utente").equalTo(otherUserID);
            $scope.filterPortfolio=$firebaseArray(queryPortfolio);

            var feedbackContainer = document.getElementById("feedbackPar");

            if($scope.otherUser.feedback !== undefined) {
                var otherUserFeedback = Object.values($scope.otherUser.feedback);
                for (var k = 0; k < otherUserFeedback.length; k++) {
                    var feedbackNotParsed = otherUserFeedback[k].split(':');
                    var feedbackAuthor = feedbackNotParsed[0];
                    var feedbackText = feedbackNotParsed[1];
                    var feedbackVote = feedbackNotParsed[2];
                    feedbackContainer.innerHTML += "<h5><strong>" + feedbackAuthor + "</strong></h5>" + feedbackText + "<p>" + "Vote: " + feedbackVote + "</p>";
                    if (k < otherUserFeedback.length - 1) {
                        feedbackContainer.innerHTML += "<br\>";
                    }
                }
                console.log(otherUserFeedback);
                var avg = $scope.otherUser.votes.total / $scope.otherUser.votes.votes;
                console.log(avg);
                var avgF = avg.toFixed(2);
                document.getElementById("averageVotes").innerHTML = avgF;
            } else {
                console.log("utente non ha il campo feedback");
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
                //console.log("length quii: " + length);
                var j = 0; //indice di projPublicPage
                var n = 0; //indice di followingProjects

                for (var i = 0; i < length; i++) { //si scorre tutto l'array
                    var length3 = $scope.getProjectsFromDB[i].troupers.length;
                    //console.log("lenght ddi troupers: " + length3);
                    for (var k = 0; k < length3; k++) {
                        if ($scope.getProjectsFromDB[i].troupers[k] === otherUserID) {
                            $scope.projPublicPage[j] = $scope.getProjectsFromDB[i];
                            console.log("trovato proj condiviso con l'utente loggato");
                            j++;
                            break;
                        }
                    }

                    //aggiungo il campo followingProjects
                    if ($scope.otherUser.followingProjects === undefined) {
                        console.log("non segue progetti");
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

        $scope.check = function (val) {
            localStorage.setItem("numStars", val);
            $scope.checkStars();
        };

        $scope.checkStars = function () {
            var st = localStorage.getItem("numStars");
            var num = "star-" + st;
            document.getElementById(num).checked = true;
        };

        $scope.addFeedback = function () {
            console.log($scope.otherUser.name);
            $scope.otherUser = $firebaseObject(database.ref('users/' + otherUserID));
            $scope.otherUser.$loaded().then(function () {
                var feedback = document.getElementById("feedbackText").value;
                var utenteFeedback = $scope.profile.name + " " + $scope.profile.lastName;
                var n = parseInt(localStorage.getItem("numStars"));
                var votes=$scope.otherUser.votes.votes+1;
                var total=$scope.otherUser.votes.total+n;
                var newFeedback=[];

                if($scope.otherUser.feedback !== undefined) {
                    var otherUserFeedback = Object.values($scope.otherUser.feedback);
                    for (var k = 0; k < otherUserFeedback.length; k++) {
                        newFeedback.push(otherUserFeedback[k]);
                    }
                    newFeedback.push(utenteFeedback + ":" + feedback + ":" + n);
                } else {
                    newFeedback.push(utenteFeedback + ":" + feedback + ":" + n);
                }

                database.ref('users/' + otherUserID).update({
                    feedback: newFeedback,
                    votes: {
                        votes: votes,
                        total: total
                    }
                }).then(function () {
                    var nObj = $firebaseObject(database.ref('users/' + otherUserID));
                    nObj.$loaded().then(function () {
                        $scope.goToDashboard();
                    }).catch(function (error) {
                        $scope.error = error;
                    })
                })
            }).catch(function (error) {
                $scope.error = error;
            });
        };

        $scope.removeUserFromFriends = function (friendToRemove) {
            console.log("$scope.profile.friends.indexOf(friendToRemove: " + $scope.profile.friends.indexOf(friendToRemove));
            $scope.profile.friends.splice($scope.profile.friends.indexOf(friendToRemove), 1);
            $scope.profile.$save();
            console.log("trouper eliminato: " + friendToRemove);

            //lo elimino anche dall'altro?
            $scope.otherUser = $firebaseObject(database.ref('users/' + friendToRemove));
            $scope.otherUser.$loaded().then(function () {
                $scope.otherUser.friends.splice($scope.otherUser.friends.indexOf(UID), 1);
                $scope.otherUser.$save();
                console.log("trouper eliminato dall'amico: " + UID);
            }).catch(function (error) {
                $scope.error = error;
            });
        };

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