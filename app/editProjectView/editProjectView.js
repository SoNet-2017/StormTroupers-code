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

    .controller('editProjectViewCtrl', ['$scope', '$location', 'Auth', '$firebaseObject','Users', 'currentAuth', '$firebaseAuth', '$firebaseArray', function ($scope,$location, Auth, $firebaseObject, Users, currentAuth, $firebaseAuth, $firebaseArray) {
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

        $scope.goToEditProfile=function () {
            $location.path("/editProfileView");
        };

        $scope.goToMyProjects=function() {
            $location.path("/myProjectsView");
        };

        // CAMBIARE URL
        $scope.goToPublicProfile=function(userID) {
            $location.path("/homePageView");
        };

        var UID=localStorage.UID;
        var database=firebase.database();
        var usersBase=database.ref('users/');
        var userQuery=usersBase.limitToLast(5);
        $scope.filterUsers=$firebaseArray(userQuery);

        var obj = $firebaseObject(database.ref('users/'+UID));
        obj.$loaded().then(function () {
            $scope.profile=obj;
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

        console.log("PID arrivato da myProjView: " + localStorage.PID);

        var PID = localStorage.PID;
        var projObj = $firebaseObject(database.ref('projects/' + PID));
        projObj.$loaded().then(function () {
            $scope.prjTitle = projObj.title;
            $scope.projectName = projObj.title;
            $scope.projectType = projObj.type;
            $scope.projectGenre = projObj.genre;
            $scope.projectDescription = projObj.description;
            $scope.projectTroupers = projObj.troupers;
            console.log("vettore troupers: "+$scope.projectTroupers);
        });

        $scope.addTroupers=function (userID) {
            //popolare il vettore troupers
            if($scope.projectTroupers.indexOf(userID)<0) {
                console.log("Trouper aggiunto: " +  userID);
                $scope.projectTroupers.push(userID);
            }
            else console.log("trouper già inserito");
        };

        $scope.editProjectDB=function() {

            console.log("sto salvando le modifche al project: "+$scope.prjTitle);

            $scope.error = null;

            var projTitle = document.getElementById("projectName").value;

            if(projTitle === "") {
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
                errorText.innerHTML="Title is required.";
                return;
            }

            var projType = document.getElementById("projectType").value;
            var projGenre = document.getElementById('projectGenre').value;
            var projProgress = document.getElementById('projectProgress').value;

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
                troupers: $scope.projectTroupers
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
            $firebaseAuth().$onAuthStateChanged(function(firebaseUser) {
                if (firebaseUser) {
                    console.log("User is yet signed in as:", firebaseUser.uid);
                } else {
                    $location.path("/loginView");
                }
            });


        };

    }]);
