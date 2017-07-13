'use strict';

angular.module('myApp.portfolioView', ['ngRoute'])

    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/portfolioView', {
            templateUrl: 'portfolioView/portfolioView.html',
            controller: 'portfolioViewCtrl',
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

    .controller('portfolioViewCtrl', ['$scope', '$location', 'Auth', '$firebaseObject', 'UiService', 'Users', 'ProfileService', 'CurrentDateService', 'ReminderService', 'UsersChatService', 'currentAuth', '$firebaseAuth', '$firebaseArray', function ($scope, $location, Auth, $firebaseObject, UiService, Users, ProfileService, CurrentDateService, ReminderService, UsersChatService, currentAuth, $firebaseAuth, $firebaseArray) {
        $scope.dati = {};
        $scope.auth = Auth;

        $scope.dati.reminders = ReminderService.getReminders();
        $scope.dati.currentDate = CurrentDateService.getCurrentDate();

        $scope.showLogoItem=function() {
            UiService.showLogoItem();
        };

        $scope.launchSearchInSearchPage=function(){
            UiService.launchSearchInSearchPage();
        };

        /*$scope.showSearchItem = function () {
         var x = document.getElementById("typeSearchContentHome");
         if (x.className.indexOf("w3-show") == -1)
         x.className += " w3-show";
         else
         x.className = x.className.replace(" w3-show", "");
         };*/

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

        $scope.goToMyApplications=function() {
            $location.path("/jobApplicationsView");
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

        var UID = localStorage.UID;
        var database = firebase.database();

        var otherUserID = localStorage.otherUserID;

        if(otherUserID!==UID){
            document.getElementById("addANewVideoForm").style.display="none";
            document.getElementById("addANewPhotoForm").style.display="none";
        }

        $scope.profile = ProfileService.getUserInfo(UID);
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


        if (otherUserID !== UID)
            $scope.myPublicPage = false;
        else
            $scope.myPublicPage = true;

        $scope.friends = {};

        $scope.otherUser = ProfileService.getUserInfo(otherUserID);
        $scope.otherUser.$loaded().then(function () {


            $scope.getPortfolioFromDB = {};
            $scope.filterPortfolio={};
            var idPortf=otherUserID+"_portfolio";
            var portfolioBase = database.ref('portfolioVideo/'+idPortf);
            $scope.getPortfolioFromDB = $firebaseArray(portfolioBase);
            console.log($scope.getPortfolioFromDB);
            var queryPortfolio=portfolioBase.orderByChild("id_utente").equalTo(otherUserID);
            $scope.filterPortfolio=$firebaseArray(queryPortfolio);


            $scope.addImage=function () {
                var imageTitle=document.getElementById("addPhotoTitle").value;
                var file=document.getElementById("addAPhotoInput").files[0];
                var ref=firebase.storage().ref('portfolioImages/');
                var storage=ref.child(otherUserID+"/"+imageTitle);
                var uploadTask=storage.put(file);
                uploadTask.then(function (snapshot) {
                    $scope.imgPath=snapshot.downloadURL;
                    console.log($scope.imgPath);
                    $scope.addImageToDB();
                })

            };

            $scope.addImageToDB=function () {
                $scope.otherUser = ProfileService.getUserInfo(otherUserID);
                $scope.otherUser.$loaded().then(function () {

                    var newPortfolio=[];

                    if($scope.otherUser.portfolioImages !== undefined) {
                        var otherUserPortfolio = Object.values($scope.otherUser.portfolioImages);
                        for (var k = 0; k < otherUserPortfolio.length; k++) {
                            newPortfolio.push(otherUserPortfolio[k]);
                        }
                        newPortfolio.push($scope.imgPath);
                    } else {
                        newPortfolio.push($scope.imgPath);
                    }

                    database.ref('users/' + otherUserID).update({
                        portfolioImages: newPortfolio
                    }).then(function () {
                        var nObj = ProfileService.getUserInfo(otherUserID);
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

            $scope.addVideo=function () {
                var newVideoTitle=document.getElementById("addVideoTitle").value;
                var newVideoUrl=document.getElementById("addAVideoInput").value;
                var newVideoNotParsed1=newVideoUrl.split("watch");
                var newVideoNotParsed2=newVideoNotParsed1[1].split("=");
                var newVideoFinalUrl=newVideoNotParsed1[0]+"embed/"+newVideoNotParsed2[1];
                console.log(newVideoFinalUrl);
                var idPortf=otherUserID+"_portfolio";
                var idVideo=otherUserID+"_"+newVideoTitle;
                var portfolioBase=database.ref('portfolioVideo/'+idPortf);

                portfolioBase.child(idVideo).set({
                        id_utente: UID,
                        title: newVideoTitle,
                        url: newVideoFinalUrl
                }).then(function () {
                    console.log("creato project in DB; Portfolio: " + idPortf+"/"+idVideo);
                    var obj = $firebaseObject(database.ref('portfolioVideo/'+idPortf+'/'+idVideo));
                    obj.$loaded().then(function () {
                        $scope.portfolio = obj;

                        //localStorage.attTroupers=JSON.stringify(obj.troupers);
                        $scope.goToPublicProfile(otherUserID);
                    }).catch(function (error) {
                        $scope.error = error;
                    })

                }).catch(function (error) {
                    $scope.error = error;
                });
            }

        }).catch(function (error) {
            $scope.error = error;
            console.log("sono in errore2: " + error);
        });

        $scope.openImage=function (element) {
            for(var key in element) {
                if(element.hasOwnProperty(key)) {
                    var value = element[key];
                    console.log(value);
                    document.getElementById("img01").src = value;
                    document.getElementById("modal01").style.display = "block";
                }
            }
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