'use strict';

angular.module('myApp.loginView', ['ngRoute'])

    .config(['$routeProvider', function($routeProvider) {
        $routeProvider.when('/loginView', {
            templateUrl: 'loginView/loginView.html',
            controller: 'loginCtrl'
        });
    }])

    .controller('loginCtrl', ['$scope','Auth', '$location', function($scope, Auth, $location) {
        $scope.dati={};
        $scope.user={};
        $scope.auth=Auth;

        //funzione per caricare il login o il join
        $scope.passToJoin=function(){
            document.getElementById("login").style.display="none";
            document.getElementById("join").style.display="flex";
        };
        $scope.passToLogin=function() {
            document.getElementById("join").style.display = "none";
            document.getElementById("login").style.display = "flex";
        };

        //funzione per aprire la pagina con le informazioni approfondite per l'iscrizione
        $scope.adJoin=function(){
            console.log("arrivato a advanced join");
            $location.path("/advancedJoinView");
        };

        //funzione di login
        $scope.signIn = function() {
            $scope.firebaseUser = null;
            $scope.error = null;

            $scope.auth.$signInWithEmailAndPassword($scope.user.email, $scope.user.password).then(function(firebaseUser) {
                console.log("signed");
                $location.path("/homePageView");
            }).catch(function(error) {
                console.log("errore");
                $scope.error = error;
            });
        };

        //funzione d'iscrizione
        $scope.join=function(){
            $scope.firebaseUser= null;
            $scope.error= null;

            //quando si crea l'utente si ha un login automatico che interferisce con la scrittura dei dati d'iscrizione sul database,
            //allora salvo tutti i dati della prima pagina d'iscrizione in localStorage per poi recuperarli e creare il database nell'advancedJoin
            var joinEm=document.getElementById("joinEmail").value;
            var joinP=document.getElementById("joinPassword").value;
            var firstName = document.getElementById('joinName').value;
            var lastNameR = document.getElementById('joinLastName').value;
            var jGender;
            if(document.getElementById("joinMale").checked){
                jGender=document.getElementById("joinMale").value;
            }else if (document.getElementById("joinFemale").checked){
                jGender=document.getElementById("joinFemale").value;
            }
            var birth = document.getElementById('dateOfBirth').value;
            localStorage.joinEmail=joinEm;
            localStorage.joinPassword=joinP;
            localStorage.joinName=firstName;
            localStorage.joinLast=lastNameR;
            localStorage.joinGender=jGender;
            localStorage.joinBirth=birth;


            $scope.auth.$createUserWithEmailAndPassword(joinEm, joinP).then(function (userData) {
                $scope.message = "User created with uid: " + userData.uid;
                localStorage.UID = userData.uid;
                console.log(userData.uid);
                $scope.adJoin();

            }).catch(function (error) {
                $scope.error = error;
            });
        };

    }]);
