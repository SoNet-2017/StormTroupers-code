'use strict';

angular.module('myApp.homePageView', ['ngRoute'])

    .config(['$routeProvider', function($routeProvider) {
        $routeProvider.when('/homePageView', {
            templateUrl: 'homePageView/homePageView.html',
            controller: 'homePageCtrl',
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

    .controller('homePageCtrl', ['$scope', '$location', 'Auth', '$firebaseObject','Users', 'currentAuth', '$firebaseAuth', '$firebaseArray', function ($scope,$location, Auth, $firebaseObject, Users, currentAuth, $firebaseAuth, $firebaseArray) {
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

        $scope.goToMyProjects=function () {
            $location.path("/myProjectsView");
        };

        $scope.goToMyTroupers=function (userID) {
            $location.path("/friendsPageView");
            localStorage.otherUserID = userID;
        };

        // CAMBIARE URL
        $scope.goToPublicProfile=function(userID) {
            $location.path("/publicProfilePageView");
            console.log("utente che sto passando: "+userID);
            localStorage.otherUserID = userID;
        };

        $scope.goToPublicProjectPage=function (projectID) {
            $location.path("/publicProjectPageView");
            console.log("Sto pssando il pid: "+projectID);
            localStorage.PID = projectID;
        };

        var UID=localStorage.UID;
        var database=firebase.database();
        var usersBase=database.ref('users/');
        var userQuery=usersBase.orderByChild("dateOfJoin").limitToLast(10);
        $scope.filterUsers=$firebaseArray(userQuery);
        $scope.filterUsers.$loaded().then(function () {
            ////////////////////////////////////////////////////////////////////////////////////
            //per popolare gli utenti around you
            $scope.filterSearch={};
            $scope.filterProjects={};

            //seconda versione algoritmo (Algoritmo Cazzo di Marte)
            var tempCont;
            var rand1=0;
            var rand2=0;
            for (var n=0; n<10; n++) { //mescola il mazzo di carte, scambiando le carte a due a due n_max volte
                rand1 = Math.floor((Math.random() * 10) + 1);
                rand2 = Math.floor((Math.random() * 10) + 1);
                tempCont=$scope.filterUsers[rand1];
                $scope.filterUsers[rand1]=$scope.filterUsers[rand2];
                $scope.filterUsers[rand2]=tempCont;
            }

            for (var n=0; n<5; n++) { //pesca le prime 5 carte del mazzo
                //evitiamo che appaia se stesso nei new users
                if(($scope.filterUsers[n].name !== $scope.profile.name) && ($scope.filterUsers[n].lastName !== $scope.profile.lastName)) {
                    $scope.filterSearch[n] = $scope.filterUsers[n];
                }
            }

        }).catch(function (error) {
            $scope.error=error;
        });

        var projectBase=database.ref('projects/');
        $scope.allProjects=$firebaseArray(projectBase);
        $scope.allProjects.$loaded().then(function () {
            ////////////////////////////////////////////////////////////////////////////////////
            //popolazione con i progetti around you

            //console.log("length: "+ $scope.allProjects.length);
            //console.log("progetti: "+$scope.allProjects);
            var n=0;
            var length = $scope.allProjects.length;
            for (var i=0; i < length; i++) {
                var trovato=false;

                // per popolare la bacheca around you con progetti non condivisi dall'utente loggato (ovviamente)
                // cerco i progetti nella città dello user loggato e controllo che questo non faccia parte del progetto
                if(($scope.allProjects[i].city === $scope.profile.province)/*&& $scope.allProjects[i].owner !== UID*/) {
                    console.log("provincia progetto["+i+"]: "+$scope.allProjects[i].city);
                    console.log("provincia utente loggato["+i+"]: "+$scope.profile.province);
                    var length2=$scope.allProjects[i].troupers.length;
                    console.log("length:"+length2);
                    for(var k=0;k<length2; k++) {
                        if ($scope.allProjects[i].troupers[k] === $scope.profile.$id) {
                            console.log("troupers[k]: "+$scope.profile.$id);
                            console.log("utente loggato: "+$scope.allProjects[i].troupers[k]);
                            trovato = true;
                            break;
                        }
                    }
                    if(!trovato) {
                        $scope.filterProjects[n] = $scope.allProjects[i];
                        n++;
                    }
                }

            }

        }).catch(function (error) {
            $scope.error=error;
        });

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

            /*
        var UID=localStorage.UID;
        var database=firebase.database();
        var usersBase=database.ref('users/');
        var userQuery=usersBase.orderByChild("dateOfJoin").limitToLast(3);
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

            $scope.filterSearch={};

            var length=$scope.filterUsers.length;
            var arr=[];
            var j=0;
            for(var i=0; i<length; i++){
                if($scope.filterUsers[i].name==="Branda"){
                    arr[j]=$scope.filterUsers[i];
                    $scope.filterSearch[j]=$scope.filterUsers[i];
                    console.log($scope.filterSearch[j]);
                    j++;
                }
            }




        }).catch(function (error) {
            $scope.error=error;
        });
        */

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
