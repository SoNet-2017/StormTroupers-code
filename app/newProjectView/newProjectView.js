/**
 * Created by matil_000 on 09/06/2017.
 */

'use strict';

angular.module('myApp.newProjectView', ['ngRoute'])

    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/newProjectView', {
            templateUrl: 'newProjectView/newProjectView.html',
            controller: 'newProjectViewCtrl',
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

    .controller('newProjectViewCtrl', ['$scope', '$location', 'Auth', '$firebaseObject', 'Users', 'currentAuth', '$firebaseAuth', '$firebaseArray', function ($scope, $location, Auth, $firebaseObject, Users, currentAuth, $firebaseAuth, $firebaseArray) {
        $scope.dati = {};
        $scope.auth = Auth;

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

        $scope.goToSearchProjects=function () {
            $location.path("/searchProjectsView");
        };

        $scope.goToEditProfile = function () {
            $location.path("/editProfileView");
        };

        $scope.goToMyProjects = function () {
            $location.path("/myProjectsView");
        };

        $scope.goToMyTroupers=function () {
            $location.path("/friendsPageView");
            localStorage.otherUserID = UID;
        };

        // CAMBIARE URL
        $scope.goToPublicProfile = function (userID) {
            $location.path("/homePageView");
        };

        $scope.goToMyPublicProfile=function () {
            $location.path("/publicProfilePageView");
            localStorage.otherUserID=UID;
        };

        var UID = localStorage.UID;
        var database = firebase.database();

        $scope.suggestedFriends = {};

        $scope.profile = $firebaseObject(database.ref('users/' + UID));
        $scope.profile.$loaded().then(function () {
            var role = Object.values($scope.profile.roles);
            for (var i = 0; i < role.length; i++) {
                document.getElementById("userRolesHome").innerHTML += role[i];
                if (i < role.length - 1) {
                    document.getElementById("userRolesHome").innerHTML += ", ";
                }
            }

            // per popolare suggestedFriends da aggiungere al progetto
            var length = $scope.profile.friends.length;
            var currFriendID;
            //console.log("length: "+length);
            for (var j = 0; j < length; j++) {
                currFriendID = $scope.profile.friends[j];
                //console.log("curFriendID: "+currFriendID);
                var currFriendObj = $firebaseObject(database.ref('users/' + currFriendID));

                //console.log("curr friend: "+currFriendObj);
                $scope.suggestedFriends[j] = currFriendObj;
            }
        }).catch(function (error) {
            $scope.error = error;
        });

        //costruisco un vettore troupers per creare un elenco di stringhe dentro il JSON per gli utenti che collaborano
        var troupers = [];
        troupers[0]=UID;

        $scope.addTroupers = function (userID) {
            //popolare il vettore troupers
            if (troupers.indexOf(userID) < 0) {
                console.log("Trouper aggiunto: " + userID);
                troupers.push(userID);
            }
            else console.log("trouper già inserito");
        };

        var projTitle="";
        var PID="";

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
                PID = UID + "_" + (new Date()).getTime() + "_" + projTitle;
                localStorage.PID = PID;
                var storage=firebase.storage().ref('projects/'+PID);
                var uploadTask=storage.put(file);
                uploadTask.then(function (snapshot) {
                    $scope.imgPath=snapshot.downloadURL;
                    localStorage.downloadURL=$scope.imgPath;
                    console.log($scope.imgPath);
                    $scope.createProjectDB();
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
                PID = UID + "_" + (new Date()).getTime() + "_" + projTitle;
                localStorage.PID = PID;
                $scope.imgPath="https://firebasestorage.googleapis.com/v0/b/stormtroupers-d1a6d.appspot.com/o/troopers.jpg?alt=media&token=972e4b96-a590-4754-9748-1017bed72d89";
                $scope.createProjectDB();
            }


        };

        $scope.createProjectDB = function () {

            console.log("entrato in create project");
            /*for(var i=0;i<troupers.length;i++){
             console.log("troupers creati in progetto: "+troupers[i]+"\n");
             }*/

            $scope.error = null;

            //costruisco un vettore roles per creare un elenco di stringhe dentro il JSON
            var rolesNeeded = [];
            rolesNeeded[0]="init";
            if (document.getElementById("checkAnim").checked) {
                rolesNeeded.push("Animation");
            }
            if (document.getElementById("checkAudio").checked) {
                rolesNeeded.push("Audio/Music/Sound");
            }
            if (document.getElementById("checkDP").checked) {
                rolesNeeded.push("Camera Crew/DP");
            }
            if (document.getElementById("checkArt").checked) {
                rolesNeeded.push("Crew art/Design/Scenic/Construction");
            }
            if (document.getElementById("checkDirect").checked) {
                rolesNeeded.push("Director");
            }
            if (document.getElementById("checkGraphicDes").checked) {
                rolesNeeded.push("Graphic designer");
            }
            if (document.getElementById("checkLight").checked) {
                rolesNeeded.push("Lighting/Electric");
            }
            if (document.getElementById("checkPhot").checked) {
                rolesNeeded.push("Photographers");
            }
            if (document.getElementById("checkPostProd").checked) {
                rolesNeeded.push("Post Production People");
            }
            if (document.getElementById("checkProducers").checked) {
                rolesNeeded.push("Producers");
            }
            if (document.getElementById("checkFX").checked) {
                rolesNeeded.push("Special Effects Crew");
            }
            if (document.getElementById("checkStyle").checked) {
                rolesNeeded.push("Stylist/Vanities");
            }
            if (document.getElementById("checkActor").checked) {
                rolesNeeded.push("Talent/Actors");
            }
            if (document.getElementById("checkCast").checked) {
                rolesNeeded.push("Talent/Casting - People");
            }

            console.log("roles needed: "+rolesNeeded);



            var projType = document.getElementById("projectType").value;
            var projGenre = document.getElementById('projectGenre').value;

            var projDesc = document.getElementById('projectDescription').value;

            console.log("Title: " + projTitle);
            console.log("Type: " + projType);
            console.log("Genre: " + projGenre);
            console.log("Descr: " + projDesc);

            localStorage.projectTitle = projTitle;
            localStorage.projectType = projType;
            localStorage.projectGenre = projGenre;
            localStorage.joinLast = projDesc;
            localStorage.owner = UID;

            var date = new Date();
            var dateOfCreation = date.getDay() + "/" + date.getMonth() + "/" + date.getYear();

            // ID di progetto formato da id utente e nome del progetto.. se uno crea due progetti con stesso nome c'è il time
            var PID = UID + "_" + (new Date()).getTime() + "_" + projTitle;
            localStorage.PID = PID;

            var project_province = $scope.profile.province;
            console.log("proj city: " + project_province);

            var database = firebase.database();

            console.log("PID: " + PID);

            //troupers.push(UID); // il vettore è popolato anche con gli altri utenti tramite funzione addTroupers(vedi sopra)

            //bisogna usare il codice univoco del userID generato da firebase per un lavoro migliore
            database.ref('projects/' + PID).set({
                pid: PID,
                owner: UID,
                title: projTitle,
                type: projType,
                genre: projGenre,
                description: projDesc,
                dateOfCreation: dateOfCreation,
                progress: 'In Progress',
                city: project_province,
                troupers: troupers,
                rolesNeeded: rolesNeeded,
                likes: 0,
                img_url: $scope.imgPath
            }).then(function () {
                console.log("creato project in DB; PID: " + PID);
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
                    localStorage.attCity = obj.city;
                    localStorage.attURL=obj.img_url;
                    //localStorage.attTroupers=JSON.stringify(obj.troupers);
                    $scope.goToMyProjects();
                }).catch(function (error) {
                    $scope.error = error;
                })

            }).catch(function (error) {
                $scope.error = error;
            });
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
