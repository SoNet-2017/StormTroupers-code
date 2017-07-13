'use strict';

angular.module('myApp.editProfileView', ['ngRoute'])

    .config(['$routeProvider', function($routeProvider) {
        $routeProvider.when('/editProfileView', {
            templateUrl: 'editProfileView/editProfileView.html',
            controller: 'editProfileCtrl',
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

    .controller('editProfileCtrl', ['$scope', '$location', 'Auth', '$firebaseObject','UiService','Users', 'ReminderService','CurrentDateService', 'ProfileService', 'currentAuth', '$firebaseAuth', '$firebaseArray', function ($scope,$location, Auth, $firebaseObject,UiService, Users,ReminderService, CurrentDateService, ProfileService, currentAuth, $firebaseAuth, $firebaseArray) {
        $scope.dati={};
        $scope.auth=Auth;

        $scope.dati.reminders = ReminderService.getReminders();
        $scope.dati.currentDate = CurrentDateService.getCurrentDate();

        $scope.countries = countries_list;

        // caricano parti di ui
        $scope.showLogoItem=function() {
            UiService.showLogoItem();
        };

        $scope.launchSearchInSearchPage=function(){
            UiService.launchSearchInSearchPage();
        };

        /*$scope.showSearchItem=function () {
            var x = document.getElementById("typeSearchContentHome");
            if (x.className.indexOf("w3-show") == -1)
                x.className += " w3-show";
            else
                x.className = x.className.replace(" w3-show", "");
        };*/


        /*
         funzioni di cambio view, non fatte tramite service in quanto si attivano solo asincronicamente quando l'utente clicca
         in determinati punti
         */
        $scope.goToDashboard=function () {
            $location.path("/homePageView");
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

        $scope.loadProvinces = function (selectedCountry) {
            $scope.provinces = ProfileService.loadProvinces(selectedCountry);
        };

        $scope.loadCities = function (selectedProvince) {
            $scope.cities = ProfileService.loadCities(selectedProvince);
        };

        var UID=localStorage.UID;
        var database=firebase.database();

        $scope.profile = ProfileService.getUserInfo(UID);
        $scope.profile.$loaded().then(function () {

            //carica i ruoli professionali nella sidebar dell'utente loggato
            var role = Object.values($scope.profile.roles);
            for(var i=0; i<role.length; i++){
                document.getElementById("userRolesHome").innerHTML+=role[i];
                if(i<role.length-1) {
                    document.getElementById("userRolesHome").innerHTML+=", ";
                }
            }

                $scope.editPEmail=$scope.profile.email;
                $scope.editPName=$scope.profile.name;
                $scope.editPLastName=$scope.profile.lastName;

                document.getElementById("editPhone").value=$scope.profile.phone;
                if($scope.profile.permissionToShowPhone===1){
                    document.getElementById("editCheckPermPhone").checked=true;
                }

                /*
                if($scope.profile.gender==="male"){
                    console.log("male");
                    document.getElementById("editPMale").checked=true;
                }else{
                    console.log("female");
                    document.getElementById("editPFemale").checked=true;
                }*/

                if($scope.profile.gender==="male"){
                    $scope.gender=1;
                }else if($scope.profile.gender==="female"){
                    $scope.gender=0;
                }

                document.getElementById("editPDateOfBirth").value=$scope.profile.dateOfBirth;

                /*
                $scope.selectedCountry=$scope.profile.country;
                $scope.selectedProvince=$scope.profile.province;
                $scope.selectedCity=$scope.profile.city;*/

                $scope.carInfo=$scope.profile.car;

                $scope.payment=$scope.profile.payment;

                role=$scope.profile.roles;
                for(var i=0; i<role.length; i++){
                    if(role[i]==="Producers"){
                        document.getElementById("checkEditProducers").checked=true;
                    }
                    if(role[i]==="Animation"){
                        document.getElementById("checkEditAnim").checked=true;
                    }
                    if(role[i]==="Audio/Music/Sound"){
                        document.getElementById("checkEditAudio").checked=true;
                    }
                    if(role[i]==="Camera Crew/DP"){
                        document.getElementById("checkEditDP").checked=true;
                    }
                    if(role[i]==="Crew art/Design/Scenic/Construction"){
                        document.getElementById("checkEditArt").checked=true;
                    }
                    if(role[i]==="Director"){
                        document.getElementById("checkEditDirect").checked=true;
                    }
                    if(role[i]==="Graphic designer"){
                        document.getElementById("checkEditGraphicDes").checked=true;
                    }
                    if(role[i]==="Lighting/Electric"){
                        document.getElementById("checkEditLight").checked=true;
                    }
                    if(role[i]==="Photographers"){
                        document.getElementById("checkEditPhot").checked=true;
                    }
                    if(role[i]==="Post Production People"){
                        document.getElementById("checkEditPostProd").checked=true;
                    }
                    if(role[i]==="Special Effects Crew"){
                        document.getElementById("checkEditFX").checked=true;
                    }
                    if(role[i]==="Stylist/Vanities"){
                        document.getElementById("checkEditStyle").checked=true;
                    }
                    if(role[i]==="Talent/Actors"){
                        console.log("attore");
                        document.getElementById("checkEditActor").checked=true;
                        document.getElementById("editRaceBox").style.display="block";
                    }
                    if($scope.profile.race==="Caucasian"){
                        document.getElementById("etnEditCauc").checked=true;
                    }else if($scope.profile.race==="Hispanic"){
                        document.getElementById("etnEditHisp").checked=true;
                    }else if($scope.profile.race==="South_Asian"){
                        document.getElementById("etnEditSAsi").checked=true;
                    }else if($scope.profile.race==="Native_American"){
                        document.getElementById("etnEditNati").checked=true;
                    }else if($scope.profile.race==="African"){
                        document.getElementById("etnEditAfri").checked=true;
                    }else if($scope.profile.race==="Middle_Eastern"){
                        document.getElementById("etnEditMidd").checked=true;
                    }else if($scope.profile.race==="South_East_Asian"){
                        document.getElementById("etnEditSEAs").checked=true;
                    }else if($scope.profile.race==="Mixed"){
                        document.getElementById("etnEditAmbi").checked=true;
                    }
                    if(role[i]==="Talent/Casting - People"){
                        document.getElementById("checkEditCast").checked=true;
                    }

                    if($scope.profile.description!==null || $scope.profile.description!==undefined){
                        $scope.editAboutMeText=$scope.profile.description;
                    }else{
                        $scope.editAboutMeText="Description";
                    }

                    if($scope.profile.equipment!=""){
                        $scope.editEquipmentText=$scope.profile.equipment;
                    }


                }

                $scope.addImage=function () {
                    var file=document.getElementById("editPhotoProfile").files[0];
                    var storage=firebase.storage().ref('users/'+UID);
                    var uploadTask=storage.put(file);
                    uploadTask.then(function (snapshot) {
                        $scope.imgPath=snapshot.downloadURL;
                        localStorage.downloadURL=$scope.imgPath;
                        console.log($scope.imgPath);
                        $scope.addImageToDB();
                    })

                };

                $scope.addImageToDB=function () {
                    database.ref('users/'+UID).update({
                        img_url:$scope.imgPath,
                        img_alt:$scope.profile.name+" "+$scope.profile.lastName
                    }).then(function () {
                        var nObj=$firebaseObject(database.ref('users/'+UID));
                        nObj.$loaded().then(function () {
                            $scope.profile=nObj;
                            $scope.goToDashboard();
                        }).catch(function (error) {
                            $scope.error=error;
                        })
                    }).catch(function (error) {
                        $scope.error=error;
                    })
                };

                $scope.updateCredentials=function () {
                    var database=firebase.database();
                    var trueOldPassword=$scope.profile.password;
                    var oldPassword=document.getElementById("editPOldPassword").value;
                    var newPassword=document.getElementById("editPPassword").value;
                    var confNewPassword=document.getElementById("editPConfPassword").value;
                    var newMail=document.getElementById("editPEmail").value;
                    if(trueOldPassword===oldPassword && newPassword===confNewPassword){
                        $scope.auth.$updatePassword(newPassword).then(function(){
                            console.log("Password changed correctly!");
                            database.ref('users/'+UID).update({
                                email: newMail,
                                password: newPassword
                            }).catch(function (error) {
                                $scope.error=error;
                            })
                        }).catch(function (error) {
                            console.log(error);
                        });

                        $scope.auth.$updateEmail(newMail).then(function () {
                            console.log("Email changed correctly!");
                        }).catch(function (error) {
                            console.log(error);
                        })

                    }
                };


            $scope.updateProfileB=function(){
                var database=firebase.database();
                var newName=document.getElementById("editPName").value;
                var newLast=document.getElementById("editPLastName").value;
                var newGender;
                if(document.getElementById("editPMale").checked){
                    newGender="male";
                }else if(document.getElementById("editPFemale").checked){
                    newGender="female";
                }else{
                    newGender=$scope.profile.gender;
                }
                var newDateOfBirth=document.getElementById("editPDateOfBirth").value;
                var newPhone=document.getElementById("editPhone").value;
                var newPermission;
                if(document.getElementById("editCheckPermPhone").checked){
                    newPermission=1;
                }else{
                    newPermission=0;
                }
                /*
                var countryNotParsed = document.getElementById("editCountry").value.split(':');
                var newCountry = countryNotParsed[1];
                var provinceNotParsed = document.getElementById("editProvince").value.split(':');
                var newProvince = provinceNotParsed[1];
                var cityNotParsed = document.getElementById("editCity").value.split(':');
                var newCity = cityNotParsed[1];*/
                var newCar;
                if(document.getElementById("editCarYes").checked){
                    newCar=1;
                }else if(document.getElementById("editCarNo").checked){
                    newCar=0;
                }else{
                    newCar=$scope.profile.car;
                }
                var newPay;
                if(document.getElementById("editPayYes").checked){
                    newPay=1;
                }else if(document.getElementById("editPayNo").checked){
                    newPay=0;
                }else{
                    newPay=$scope.profile.payment;
                }
                var newDescr=document.getElementById("editAboutMeText").value;
                var newEquipment=document.getElementById("editEquipment").value;

                var newRace = "None";

                //costruisco un vettore roles per creare un elenco di stringhe dentro il JSON
                var newRoles = [];
                if (document.getElementById("checkEditAnim").checked) {
                    newRoles.push("Animation");
                }
                if (document.getElementById("checkEditAudio").checked) {
                    newRoles.push("Audio/Music/Sound");
                }
                if (document.getElementById("checkEditDP").checked) {
                    newRoles.push("Camera Crew/DP");
                }
                if (document.getElementById("checkEditArt").checked) {
                    newRoles.push("Crew art/Design/Scenic/Construction");
                }
                if (document.getElementById("checkEditDirect").checked) {
                    newRoles.push("Director");
                }
                if (document.getElementById("checkEditGraphicDes").checked) {
                    newRoles.push("Graphic designer");
                }
                if (document.getElementById("checkEditLight").checked) {
                    newRoles.push("Lighting/Electric");
                }
                if (document.getElementById("checkEditPhot").checked) {
                    newRoles.push("Photographers");
                }
                if (document.getElementById("checkEditPostProd").checked) {
                    newRoles.push("Post Production People");
                }
                if (document.getElementById("checkEditProducers").checked) {
                    newRoles.push("Producers");
                }
                if (document.getElementById("checkEditFX").checked) {
                    newRoles.push("Special Effects Crew");
                }
                if (document.getElementById("checkEditStyle").checked) {
                    newRoles.push("Stylist/Vanities");
                }
                if (document.getElementById("checkEditActor").checked) {
                    newRoles.push("Talent/Actors");
                    if (document.getElementById("etnEditCauc").checked) {
                        newRace = "Caucasian";
                    }
                    if (document.getElementById("etnEditHisp").checked) {
                        newRace = "Hispanic";
                    }
                    if (document.getElementById("etnEditSAsi").checked) {
                        newRace = "South_Asian";
                    }
                    if (document.getElementById("etnEditNati").checked) {
                        newRace = "Native_American";
                    }
                    if (document.getElementById("etnEditAfri").checked) {
                        newRace = "African";
                    }
                    if (document.getElementById("etnEditMidd").checked) {
                        newRace = "Middle_Eastern";
                    }
                    if (document.getElementById("etnEditSEAs").checked) {
                        newRace = "South_East_Asian";
                    }
                    if (document.getElementById("etnEditAmbi").checked) {
                        newRace = "Mixed";
                    }
                }
                if (document.getElementById("checkEditCast").checked) {
                    newRoles.push("Talent/Casting - People");
                }



                var newBase=database.ref('users/'+UID);

                database.ref('users/'+UID).update({
                    name: newName,
                    lastName: newLast,
                    phone: newPhone,
                    permissionToShowPhone: newPermission,
                    gender: newGender,
                    roles: newRoles,
                    race: newRace,
                    /*
                    country: newCountry,
                    province: newProvince,
                    city: newCity,
                    */
                    car: newCar,
                    payment: newPay,
                    description: newDescr,
                    dateOfBirth: newDateOfBirth,
                    equipment: newEquipment
                }).then(function () {
                    localStorage.otherUserID=UID;
                    $location.path("/publicProfilePageView");
                    var nObj=$firebaseObject(database.ref('users/'+UID));
                    nObj.$loaded().then(function () {
                        $scope.profile=nObj;
                    }).catch(function (error) {
                        $scope.error=error;
                    })
                }).catch(function (error) {
                    $scope.error=error;
                })

            };

        }).catch(function (error) {
            $scope.error=error;
        });

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