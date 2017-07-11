/**
 * Created by matil_000 on 09/06/2017.
 */

'use strict';

angular.module('myApp.editProjectView', ['ngRoute'])

    .config(['$routeProvider', function($routeProvider) {
        $routeProvider.when('/editProjectView', {
            templateUrl: 'editProjectView/editProjectView.html',
            controller: 'editProjectViewCtrl',
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

    .controller('editProjectViewCtrl', ['$scope', '$location', 'Auth', '$firebaseObject','Users', 'CurrentDateService', 'ReminderService', 'currentAuth', '$firebaseAuth', '$firebaseArray', function ($scope,$location, Auth, $firebaseObject, Users, CurrentDateService, ReminderService, currentAuth, $firebaseAuth, $firebaseArray) {
        $scope.dati={};
        $scope.auth=Auth;

        $scope.dati.reminders = ReminderService.getReminders();
        $scope.dati.currentDate = CurrentDateService.getCurrentDate();

        $scope.showLogoItem=function () {
            var x = document.getElementById("logoBarContentHome");
            if (x.className.indexOf("w3-show") == -1)
                x.className += " w3-show";
            else
                x.className = x.className.replace(" w3-show", "");
        };

        $scope.launchSearchInSearchPage = function () {
            $location.path("/searchPageView");
            localStorage.immediateSearch=true;
            localStorage.immediateSearchKeyword=document.getElementById("searchItemHomeKeyword").value;
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

        $scope.goToMyApplications=function() {
            $location.path("/jobApplicationsView");
        };

        $scope.goToMyPublicProfile=function () {
            $location.path("/publicProfilePageView");
            localStorage.otherUserID=UID;
        };

        var UID=localStorage.UID;
        var database=firebase.database();
        console.log("PID arrivato da myProjView: " + localStorage.PID);

        var PID = localStorage.PID;
        var projObj = $firebaseObject(database.ref('projects/' + PID));
        projObj.$loaded().then(function () {
            console.log("caricato proj con pid: "+projObj.$id);
            $scope.projectID = projObj.$id;
            $scope.prjTitle = projObj.title;
            $scope.projectName = projObj.title;
            $scope.projectType = projObj.type;
            $scope.projectGenre = projObj.genre;
            $scope.projectDescription = projObj.description;
            $scope.projectTroupers = projObj.troupers;
            $scope.rolesNeeded = projObj.rolesNeeded;
            $scope.prjUrl=projObj.img_url;
            console.log("vettore troupers: "+$scope.projectTroupers);
            console.log("vettore rolesNeeded: "+$scope.rolesNeeded+" | length: "+$scope.rolesNeeded.length);
            console.log(projObj.img_url);

            //per settare i check dei ruoli richiesti
            for(var i=0; i<$scope.rolesNeeded.length; i++){
                for(var j=0; j<15; j++) {
                    if ($scope.rolesNeeded[i] === "Animation") {
                        $scope.checkAnim = true;
                        break;
                    }
                    if ($scope.rolesNeeded[i] === "Audio/Music/Sound") {
                        $scope.checkAudio = true;
                        break;
                    }
                    if ($scope.rolesNeeded[i] === "Crew art/Design/Scenic/Construction") {
                        $scope.checkArt = true;
                        break;
                    }
                    if ($scope.rolesNeeded[i] === "Director") {
                        $scope.checkDirect = true;
                        break;
                    }
                    if ($scope.rolesNeeded[i] === "Graphic designer") {
                        $scope.checkGraphicDes = true;
                        break;
                    }
                    if ($scope.rolesNeeded[i] === "Lighting/Electric") {
                        $scope.checkLight = true;
                        break;
                    }
                    if ($scope.rolesNeeded[i] === "Photographers") {
                        $scope.checkPhot = true;
                        break;
                    }
                    if ($scope.rolesNeeded[i] === "Post Production People") {
                        $scope.checkPostProd = true;
                        break;
                    }
                    if ($scope.rolesNeeded[i] === "Producers") {
                        $scope.checkProducers = true;
                        break;
                    }
                    if ($scope.rolesNeeded[i] === "Special Effects Crew") {
                        $scope.checkFX = true;
                        break;
                    }
                    if ($scope.rolesNeeded[i] === "Stylist/Vanities") {
                        $scope.checkStyle = true;
                        break;
                    }
                    if ($scope.rolesNeeded[i] === "Talent/Actors") {
                        $scope.checkActor = true;
                        break;
                    }
                    if ($scope.rolesNeeded[i] === "Talent/Casting - People") {
                        $scope.checkCast = true;
                        break;
                    }
                    if ($scope.rolesNeeded[i] === "Camera Crew/DP") {
                        $scope.checkDP = true;
                        break;
                    }
                }
            }
        });

        $scope.suggestedFriends = {};
        $scope.sharingFriends = {};

        $scope.profile = $firebaseObject(database.ref('users/' + UID));
        $scope.profile.$loaded().then(function () {
            var role = Object.values($scope.profile.roles);
            for (var i = 0; i < role.length; i++) {
                document.getElementById("userRolesHome").innerHTML += role[i];
                if (i < role.length - 1) {
                    document.getElementById("userRolesHome").innerHTML += ", ";
                }
            }

            //per popolare con gli utenti con i quali si condivide il progetto

            // per popolare suggestedFriends da aggiungere al progetto
            var length = $scope.profile.friends.length;
            var currFriendID;
            //console.log("length: "+length);
            for (var j = 0; j < length; j++) {
                currFriendID = $scope.profile.friends[j];
                var currFriendObj = $firebaseObject(database.ref('users/' + currFriendID));
                if($scope.projectTroupers.indexOf(currFriendID) < 0) {
                    //console.log("curFriendID: "+currFriendID);
                    //console.log("curr friend: "+currFriendObj);
                    $scope.suggestedFriends[j] = currFriendObj;
                } else $scope.sharingFriends[j] = currFriendObj;
            }
        }).catch(function (error) {
            $scope.error = error;
        });


        $scope.addTroupers=function (userID) {
            //popolare il vettore troupers
            if($scope.projectTroupers.indexOf(userID)<0) {
                console.log("Trouper aggiunto: " +  userID);
                $scope.projectTroupers.push(userID);
            }
            else console.log("trouper già inserito");
        };

        $scope.removeTroupers=function (userID) {
            $scope.projectTroupers.splice($scope.projectTroupers.indexOf(userID),1);
            console.log("trouper "+userID+" eliminato");
        };

        var projTitle="";
        var newImage="";

        $scope.addImage=function () {

            if(document.getElementById("projPicUpload").files[0]!==undefined){
                var file=document.getElementById("projPicUpload").files[0];
                projTitle = document.getElementById("projectName").value;

                if (projTitle === "") {
                    //////////////////////////////////////////////////////////
                    var errorMainDiv = document.getElementById("alertBoxDiv");
                    var errorDiv = document.createElement("div");
                    errorDiv.className = "w3-panel w3-round-large w3-row";
                    errorDiv.style.display = "flex";
                    errorDiv.style.justifyContent = "center";
                    errorDiv.style.backgroundColor = "indianred";
                    errorDiv.style.opacity = "0.8";
                    errorDiv.style.color = "white";
                    errorMainDiv.appendChild(errorDiv);

                    var errorIcon = document.createElement("div");
                    errorIcon.className = "w3-col s1 m1 l1 w3-left";
                    errorIcon.style.display = "flex";
                    errorIcon.style.justifyContent = "left";
                    errorIcon.style.padding = "7.5px";
                    errorIcon.style.verticalAlign = "middle";
                    errorDiv.appendChild(errorIcon);

                    var errorIconGlyph = document.createElement("i");
                    errorIconGlyph.className = "w3-xlarge glyphicon glyphicon-exclamation-sign";
                    errorIcon.appendChild(errorIconGlyph);

                    var errorText = document.createElement("h4");
                    errorText.className = "w3-col s11 m11 l11";
                    errorText.style.color = "white";
                    errorDiv.appendChild(errorText);
                    errorText.innerHTML = "Title is required.";
                    return;
                }
                var PID=$scope.projectID;
                var storage=firebase.storage().ref('projects/'+PID);
                var uploadTask=storage.put(file);
                uploadTask.then(function (snapshot) {
                    newImage=snapshot.downloadURL;
                    localStorage.downloadURL=newImage;
                    console.log($scope.imgPath);
                    $scope.editProjectDB();
                })
            }else{
                projTitle = document.getElementById("projectName").value;

                if (projTitle === "") {
                    //////////////////////////////////////////////////////////
                    var errorMainDiv = document.getElementById("alertBoxDiv");
                    var errorDiv = document.createElement("div");
                    errorDiv.className = "w3-panel w3-round-large w3-row";
                    errorDiv.style.display = "flex";
                    errorDiv.style.justifyContent = "center";
                    errorDiv.style.backgroundColor = "indianred";
                    errorDiv.style.opacity = "0.8";
                    errorDiv.style.color = "white";
                    errorMainDiv.appendChild(errorDiv);

                    var errorIcon = document.createElement("div");
                    errorIcon.className = "w3-col s1 m1 l1 w3-left";
                    errorIcon.style.display = "flex";
                    errorIcon.style.justifyContent = "left";
                    errorIcon.style.padding = "7.5px";
                    errorIcon.style.verticalAlign = "middle";
                    errorDiv.appendChild(errorIcon);

                    var errorIconGlyph = document.createElement("i");
                    errorIconGlyph.className = "w3-xlarge glyphicon glyphicon-exclamation-sign";
                    errorIcon.appendChild(errorIconGlyph);

                    var errorText = document.createElement("h4");
                    errorText.className = "w3-col s11 m11 l11";
                    errorText.style.color = "white";
                    errorDiv.appendChild(errorText);
                    errorText.innerHTML = "Title is required.";
                    return;
                }
                newImage=projObj.img_url;
                $scope.editProjectDB();
            }

        };

        $scope.editProjectDB=function() {

            console.log("sto salvando le modifche al project: "+$scope.prjTitle);

            $scope.error = null;


            var projType = document.getElementById("projectType").value;
            var projGenre = document.getElementById('projectGenre').value;
            var projProgress = document.getElementById('projectProgress').value;

            var projDesc = document.getElementById('projectDescription').value;

            console.log("Title: " + projTitle);
            console.log("Type: " + projType);
            console.log("Genre: " + projGenre);
            console.log("Descr: " + projDesc);
            console.log("Url: "+newImage);

            localStorage.projectTitle = projTitle;
            localStorage.projectType = projType;
            localStorage.projectGenre = projGenre;
            localStorage.joinLast = projDesc;
            localStorage.owner = UID;

            var database = firebase.database();

            console.log("PID: " + PID);

            //troupers.push(UID); // il vettore è popolato anche con gli altri utenti tramite funzione addTroupers(vedi sopra)

            //bisogna usare il codice univoco del userID generato da firebase per un lavoro migliore
            database.ref('projects/' + PID).update({
                pid: PID,
                owner: UID,
                title: projTitle,
                type: projType,
                genre: projGenre,
                description: projDesc,
                progress: projProgress,
                troupers: $scope.projectTroupers,
                img_url: newImage
            }).then(function () {
                console.log("salvate le modifiche al project in DB; PID: " + PID);
                var obj = $firebaseObject(database.ref('projects/' + PID));
                obj.$loaded().then(function () {
                    $scope.project = obj;
                    localStorage.attPID = PID;
                    localStorage.attOwner = UID;
                    localStorage.attTitle = obj.title;
                    localStorage.attType = obj.type;
                    localStorage.attGenre = obj.genre;
                    localStorage.attDescription = obj.description;
                    localStorage.attDateOfCreation = obj.dateOfCreation;
                    localStorage.imgURL=obj.img_url;
                    //localStorage.attTroupers=JSON.stringify(obj.troupers);
                    $scope.goToMyProjects();
                }).catch(function (error) {
                    $scope.error = error;
                })

            }).catch(function (error) {
                $scope.error = error;
            });
        };

        // per cancellare i progetti
        $scope.deleteProject = function (prjID) {
            console.log("sto per cancellare il progetto con PID: " + prjID);
            database.ref('projects/' + prjID).remove();
            $location.path("/myProjectsView");
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
