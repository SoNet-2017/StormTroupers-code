'use strict';

angular.module('myApp.loginView', ['ngRoute'])

    .config(['$routeProvider', function($routeProvider) {
        $routeProvider.when('/loginView', {
            templateUrl: 'loginView/loginView.html',
            controller: 'loginCtrl'
        });
    }])

    .controller('loginCtrl', ['$scope','Auth', '$location', '$firebaseObject', 'Users', function($scope, Auth, $location, $firebaseObject, Users) {
        $scope.dati={};
        $scope.user={};
        $scope.auth=Auth;


        var database = firebase.database();

        //funzione per caricare il login o il join
        $scope.passToJoin=function(){
            document.getElementById("alertBoxLoginDiv").style.display = "none"; //.setAttribute("ng-show", false);
            document.getElementById("alertBoxJoinDiv").style.display="block";
            document.getElementById("login").style.display="none";
            document.getElementById("join").style.display="flex";
        };
        $scope.passToLogin=function() {
            document.getElementById("alertBoxJoinDiv").style.display = "none"; //.setAttribute("ng-show", false);
            document.getElementById("alertBoxLoginDiv").style.display="block";
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
                localStorage.UID=firebaseUser.uid;
                console.log(localStorage.UID);


                database.ref('users/'+localStorage.UID).update({
                    logged: true
                }).then(function () {
                    var obj=$firebaseObject(database.ref('users/'+localStorage.UID));
                    obj.$loaded().then(function () {
                        $scope.profile=obj;

                        localStorage.attName=obj.name;
                        localStorage.attLast=obj.lastName;
                        localStorage.attEmail=obj.email;
                        localStorage.attCountry=obj.country;
                        localStorage.attProvince=obj.province;
                        localStorage.attCity=obj.city;
                        localStorage.attBirth=obj.dateOfBirth;
                        localStorage.attGender=obj.gender;
                        localStorage.attDesc=obj.description;
                        localStorage.attPhone=obj.phone;
                        localStorage.attShowOption=obj.permissionToShowPhone;
                        localStorage.attCar=obj.car;
                        localStorage.attPayment=obj.payment;
                        localStorage.attRoles=JSON.stringify(Object.values(obj.roles));

                        $location.path("/homePageView");
                    }).catch(function (error) {
                        $scope.error=error;
                    })
                }).catch(function (error) {
                    $scope.error=error;
                })



            }).catch(function(error) {
                console.log("errore");
                $scope.error = error;
                var mainAlertDiv = document.getElementById("alertBoxLoginDiv");
                var alertDiv = document.createElement("div");
                alertDiv.$id = "alertLoginBoxError";
                alertDiv.className = "w3-panel w3-round-large w3-row";
                alertDiv.style.display = "flex";
                alertDiv.style.justifyContent = "center";
                alertDiv.style.backgroundColor = "indianred";
                alertDiv.style.opacity = "0.8";
                alertDiv.style.color = "white";
                mainAlertDiv.appendChild(alertDiv);

                var alertIcon = document.createElement("div");
                alertIcon.className = "w3-col s1 m1 l1 w3-left";
                alertIcon.$id = "alertLoginIconError";
                alertIcon.style.display = "flex";
                alertIcon.style.justifyContent = "left";
                alertIcon.style.padding = "7.5px";
                alertIcon.style.verticalAlign = "middle";
                alertDiv.appendChild(alertIcon);

                var alertIconGlyph = document.createElement("i");
                alertIconGlyph.className = "w3-xlarge glyphicon glyphicon-exclamation-sign";
                alertIcon.appendChild(alertIconGlyph);

                var alertText = document.createElement("h4");
                alertText.$id="loginErrorText";
                alertText.className = "w3-col s11 m11 l11";
                alertText.innerHTML = "The password is wrong.";
                alertText.style.color = "white";
                alertDiv.appendChild(alertText);
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

                var errorMainDiv = document.getElementById("alertBoxJoinDiv");
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

                var confirmPW = document.getElementById('joinConfPassword').value;

                // notifica l'utente che che la pw deve essere almeno di 6 caratteri
                if(joinP.length < 6)
                    errorText.innerHTML = "The password should be at least 6 characters long.";
                else if(confirmPW != joinP){
                    errorText.innerHTML = "The confirmation pw doesn't match with the pw.";
                }
                else {
                    //...o che la mail che inserita è già nel database
                    errorText.innerHTML = "The submitted e-mail is already existing.";
                }

                $scope.error = error;
            });
        };

    }]);

