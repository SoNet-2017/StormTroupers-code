'use strict';

var country_list = ["Afghanistan","Albania","Algeria","Andorra","Angola","Anguilla","Antigua Barbuda","Argentina","Armenia","Aruba","Australia","Austria","Azerbaijan","Bahamas","Bahrain","Bangladesh","Barbados","Belarus","Belgium","Belize","Benin","Bermuda","Bhutan","Bolivia","Bosnia Herzegovina","Botswana","Brazil","British Virgin Islands","Brunei","Bulgaria","Burkina Faso","Burundi","Cambodia","Cameroon","Canada","Cape Verde","Cayman Islands","Chad","Chile","China","Colombia","Congo","Cook Islands","Costa Rica","Cote D'Ivoire","Croatia","Cruise Ship","Cuba","Cyprus","Czech Republic","Denmark","Djibouti","Dominica","Dominican Republic","Ecuador","Egypt","El Salvador","Equatorial Guinea","Estonia","Ethiopia","Falkland Islands","Faroe Islands","Fiji","Finland","France","French Polynesia","French West Indies","Gabon","Gambia","Georgia","Germany","Ghana","Gibraltar","Greece","Greenland","Grenada","Guam","Guatemala","Guernsey","Guinea","Guinea Bissau","Guyana","Haiti","Honduras","Hong Kong","Hungary","Iceland","India","Indonesia","Iran","Iraq","Ireland","Isle of Man","Israel","Italy","Jamaica","Japan","Jersey","Jordan","Kazakhstan","Kenya","Kuwait","Kyrgyz Republic","Laos","Latvia","Lebanon","Lesotho","Liberia","Libya","Liechtenstein","Lithuania","Luxembourg","Macau","Macedonia","Madagascar","Malawi","Malaysia","Maldives","Mali","Malta","Mauritania","Mauritius","Mexico","Moldova","Monaco","Mongolia","Montenegro","Montserrat","Morocco","Mozambique","Namibia","Nepal","Netherlands","Netherlands Antilles","New Caledonia","New Zealand","Nicaragua","Niger","Nigeria","Norway","Oman","Pakistan","Palestine","Panama","Papua New Guinea","Paraguay","Peru","Philippines","Poland","Portugal","Puerto Rico","Qatar","Reunion","Romania","Russia","Rwanda","Saint Pierre Miquelon","Samoa","San Marino","Satellite","Saudi Arabia","Senegal","Serbia","Seychelles","Sierra Leone","Singapore","Slovakia","Slovenia","South Africa","South Korea","Spain","Sri Lanka","St Kitts Nevis","St Lucia","St Vincent","St. Lucia","Sudan","Suriname","Swaziland","Sweden","Switzerland","Syria","Taiwan","Tajikistan","Tanzania","Thailand","Timor L'Este","Togo","Tonga","Trinidad Tobago","Tunisia","Turkey","Turkmenistan","Turks Caicos","Uganda","Ukraine","United Arab Emirates","United Kingdom","United States Of America","Uruguay","Uzbekistan","Venezuela","Vietnam","Virgin Islands (US)","Yemen","Zambia","Zimbabwe"];


angular.module('myApp.advancedJoinView', ['ngRoute'])

    .config(['$routeProvider', function($routeProvider) {
        $routeProvider.when('/advancedJoinView', {
            templateUrl: 'advancedJoinView/advancedJoinView.html',
            controller: 'adJoinCtrl',
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

    .controller('adJoinCtrl', ['$scope', 'Auth', '$location','$firebaseObject', function($scope, Auth, $location, $firebaseObject) {
        $scope.dati={};

        // per creare la lista delle nazione da cui scegliere
        $scope.countries = country_list;

        $scope.openHome=function () {
            console.log("tra un attimo");
            $location.path("/homePageView");
        };

        //una volta creato l'utente recupero tutti i dati e creo il database sull'utente
        $scope.createUserDB = function () {
            var UID=localStorage.UID;
            var email=localStorage.joinEmail;
            var pwd=localStorage.joinPassword;
            var nameR=localStorage.joinName;
            var lastNameR=localStorage.joinLast;
            var birth=localStorage.joinBirth;
            var genderR=localStorage.joinGender;
            var phoneR=document.getElementById("phone").value;
            var permissionPhone;
            if(document.getElementById("checkPermPhone").checked){
                permissionPhone=1;
            }else{
                permissionPhone=0;
            }
            var countryR=document.getElementById("country").value;
            var provinceR=document.getElementById("province").value;
            var cityR=document.getElementById("city").value;
            var carR;
            if(document.getElementById("carYes").checked){
                carR=1;
            }else if(document.getElementById("carNo").checked){
                carR=0;
            }
            var payR;
            if(document.getElementById("payYes").checked){
                payR=1;
            }else if(document.getElementById("payNo").checked){
                payR=0;
            }
            var descriptionR=document.getElementById("aboutMeText").value;

            //costruisco un vettore roles per creare un elenco di stringhe dentro il JSON
            var roles=[];
            if(document.getElementById("checkAnim").checked){
                roles.push("Animation");
            }
            if(document.getElementById("checkAudio").checked){
                roles.push("Audio/Music/Sound");
            }
            if(document.getElementById("checkDP").checked){
                roles.push("Camera Crew/DP");
            }
            if(document.getElementById("checkArt").checked){
                roles.push("Crew art/Design/Scenic/Construction");
            }
            if(document.getElementById("checkDirect").checked){
                roles.push("Director");
            }
            if(document.getElementById("checkGraphicDes").checked){
                roles.push("Graphic designer");
            }
            if(document.getElementById("checkLight").checked){
                roles.push("Lighting/Electric");
            }
            if(document.getElementById("checkPhot").checked){
                roles.push("Photographers");
            }
            if(document.getElementById("checkPostProd").checked){
                roles.push("Post Production People");
            }
            if(document.getElementById("checkProducers").checked){
                roles.push("Producers");
            }
            if(document.getElementById("checkFX").checked){
                roles.push("Special Effects Crew");
            }
            if(document.getElementById("checkStyle").checked){
                roles.push("Stylist/Vanities");
            }
            if(document.getElementById("checkActor").checked){
                roles.push("Talent/Actors");
            }
            if(document.getElementById("checkCast").checked){
                roles.push("Talent/Casting - People");
            }
            var database=firebase.database();

            //bisogna usare il codice univoco del userID generato da firebase per un lavoro migliore
            database.ref('users/' + UID).set({
                name: nameR,
                lastName: lastNameR,
                email: email,
                password: pwd,
                dateOfBirth: birth,
                gender: genderR,
                phone: phoneR,
                permissionToShowPhone: permissionPhone,
                country: countryR,
                province: provinceR,
                city: cityR,
                car: carR,
                payment: payR,
                roles: roles,
                desciption: descriptionR,
                logged: true
            }).then(function () {
                console.log("sono qui" + UID);
                var obj=$firebaseObject(database.ref('users/'+UID));
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
                    $scope.openHome();
                }).catch(function (error) {
                    $scope.error=error;
                })
            }).catch(function (error) {
                $scope.error=error;
            });
        }

    }]);