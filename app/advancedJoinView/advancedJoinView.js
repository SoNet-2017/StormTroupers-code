'use strict';

//lista delle nazioni
var country_list1 = ["Afghanistan","Albania","Algeria","Andorra","Angola","Anguilla","Antigua Barbuda","Argentina","Armenia","Aruba","Australia","Austria","Azerbaijan","Bahamas","Bahrain","Bangladesh","Barbados","Belarus","Belgium","Belize","Benin","Bermuda","Bhutan","Bolivia","Bosnia Herzegovina","Botswana","Brazil","British Virgin Islands","Brunei","Bulgaria","Burkina Faso","Burundi","Cambodia","Cameroon","Canada","Cape Verde","Cayman Islands","Chad","Chile","China","Colombia","Congo","Cook Islands","Costa Rica","Cote D'Ivoire","Croatia","Cruise Ship","Cuba","Cyprus","Czech Republic","Denmark","Djibouti","Dominica","Dominican Republic","Ecuador","Egypt","El Salvador","Equatorial Guinea","Estonia","Ethiopia","Falkland Islands","Faroe Islands","Fiji","Finland","France","French Polynesia","French West Indies","Gabon","Gambia","Georgia","Germany","Ghana","Gibraltar","Greece","Greenland","Grenada","Guam","Guatemala","Guernsey","Guinea","Guinea Bissau","Guyana","Haiti","Honduras","Hong Kong","Hungary","Iceland","India","Indonesia","Iran","Iraq","Ireland","Isle of Man","Israel","Italy","Jamaica","Japan","Jersey","Jordan","Kazakhstan","Kenya","Kuwait","Kyrgyz Republic","Laos","Latvia","Lebanon","Lesotho","Liberia","Libya","Liechtenstein","Lithuania","Luxembourg","Macau","Macedonia","Madagascar","Malawi","Malaysia","Maldives","Mali","Malta","Mauritania","Mauritius","Mexico","Moldova","Monaco","Mongolia","Montenegro","Montserrat","Morocco","Mozambique","Namibia","Nepal","Netherlands","Netherlands Antilles","New Caledonia","New Zealand","Nicaragua","Niger","Nigeria","Norway","Oman","Pakistan","Palestine","Panama","Papua New Guinea","Paraguay","Peru","Philippines","Poland","Portugal","Puerto Rico","Qatar","Reunion","Romania","Russia","Rwanda","Saint Pierre Miquelon","Samoa","San Marino","Satellite","Saudi Arabia","Senegal","Serbia","Seychelles","Sierra Leone","Singapore","Slovakia","Slovenia","South Africa","South Korea","Spain","Sri Lanka","St Kitts Nevis","St Lucia","St Vincent","St. Lucia","Sudan","Suriname","Swaziland","Sweden","Switzerland","Syria","Taiwan","Tajikistan","Tanzania","Thailand","Timor L'Este","Togo","Tonga","Trinidad Tobago","Tunisia","Turkey","Turkmenistan","Turks Caicos","Uganda","Ukraine","United Arab Emirates","United Kingdom","United States Of America","Uruguay","Uzbekistan","Venezuela","Vietnam","Virgin Islands (US)","Yemen","Zambia","Zimbabwe"];

//lista delle province italiane
var province_list = [
    'Agrigento','Alessandria','Ancona','Aosta','Aquila ','Arezzo','Ascoli Piceno','Asti','Avellino',
    'Bari','Belluno','Benevento','Bergamo','Biella','B ologna','Bolzano','Brescia','Brindisi',
    'Cagliari','Caltanissetta','Campobasso','Caserta', 'Catania','Catanzaro','Chieti','Como','Cosenza','C remona','Crotone','Cuneo',
    'Enna',
    'Ferrara','Firenze','Foggia','Forlì e Cesena','Frosinone',
    'Genova','Gorizia','Grosseto',
    'Imperia','Isernia',
    'La Spezia','Latina','Lecce','Lecco','Livorno','Lodi', 'Lucca',
    'Macerata','Mantova','Massa-Carrara','Matera','Messina','Milano','Modena',
    'Napoli','Novara','Nuoro',
    'Oristano',
    'Padova','Palermo','Parma','Pavia','Perugia','Pesaro e Urbino','Pescara','Piacenza','Pisa','Pistoia','Por denone','Potenza','Prato',
    'Ragusa','Ravenna','Reggio Calabria','Reggio Emilia','Rieti','Rimini','Roma','Rovigo',
    'Salerno','Sassari','Savona','Siena','Siracusa','Sondrio',
    'Taranto','Teramo','Terni','Torino','Trapani','Trento','Treviso','Trieste',
    'Udine',
    'Varese','Venezia','Verbano-Cusio-Ossola','Vercelli','Verona','Vibo Valentia','Vicenza','Viterbo'];

var country_list ={
    'Italy': {
    'Torino': ['AGLIE\'', 'AIRASCA','ALA DI STURA','ALBIANO D\'IVREA','ALICE SUPERIORE','ALMESE','ALPETTE','ALPIGNANO',
    'ANDEZENO','ANDRATE','ANGROGNA','ARIGNANO','AVIGLIANA','AZEGLIO','BAIRO','BALANGERO','BALDISSERO CANAVESE','BALDISSERO TORINESE',
    'BALME','BANCHETTE','BARBANIA','BARDONECCHIA','BARONE CANAVESE','BEINASCO','BIBIANA','BOBBIO PELLICE','BOLLENGO',
    'BORGARO TORINESE','BORGIALLO','BORGOFRANCO D\'IVREA','BORGOMASINO','BORGONE SUSA','BOSCONERO','BRANDIZZO','BRICHERASIO',
    'BROSSO','BROZOLO','BRUINO','BRUSASCO','BRUZOLO','BURIASCO','BUROLO','BUSANO','BUSSOLENO','BUTTIGLIERA ALTA','CAFASSE',
    'CALUSO','CAMBIANO','CAMPIGLIONE-FENILE','CANDIA CANAVESE','CANDIOLO','CANISCHIO','CANTALUPA','CANTOIRA','CAPRIE',
    'CARAVINO','CAREMA','CARIGNANO','CARMAGNOLA','CASALBORGONE','CASCINETTE D\'IVREA','CASELETTE','CASELLE TORINESE','CASTAGNETO PO',
    'CASTAGNOLE PIEMONTE','CASTELLAMONTE','CASTELNUOVO NIGRA','CASTIGLIONE TORINESE','CAVAGNOLO','CAVOUR','CERCENASCO',
    'CERES','CERESOLE REALE','CESANA TORINESE','CHIALAMBERTO','CHIANOCCO','CHIAVERANO','CHIERI','CHIESANUOVA','CHIOMONTE',
    'CHIUSA DI SAN MICHELE','CHIVASSO','CICONIO','CINTANO','CINZANO','CIRIE\'','CLAVIERE','COASSOLO TORINESE','COAZZE',
    'COLLEGNO','COLLERETTO CASTELNUOVO','COLLERETTO GIACOSA','CONDOVE','CORIO','COSSANO CANAVESE','CUCEGLIO','CUMIANA',
    'CUORGNE\'','DRUENTO','EXILLES','FAVRIA','FELETTO','FENESTRELLE','FIANO','FIORANO CANAVESE','FOGLIZZO','FORNO CANAVESE',
'FRASSINETTO','FRONT','FROSSASCO','GARZIGLIANA','GASSINO TORINESE','GERMAGNANO','GIAGLIONE','GIAVENO','GIVOLETTO','GRAVERE',
'GROSCAVALLO','GROSSO','GRUGLIASCO','INGRIA','INVERSO PINASCA','ISOLABELLA','ISSIGLIO','IVREA','LA CASSA','LA LOGGIA',
'LANZO TORINESE','LAURIANO','LEINì','LEMIE','LESSOLO','LEVONE','LOCANA','LOMBARDORE','LOMBRIASCO','LORANZE\'','LUGNACCO',
'LUSERNA SAN GIOVANNI','LUSERNETTA','LUSIGLIE\'','MACELLO','MAGLIONE','MARENTINO','MASSELLO','MATHI','MATTIE','MAZZE\'',
'MEANA DI SUSA','MERCENASCO','MEUGLIANO','MEZZENILE','MOMBELLO DI TORINO','MOMPANTERO','MONASTERO DI LANZO','MONCALIERI',
'MONCENISIO','MONTALDO TORINESE','MONTALENGHE','MONTALTO DORA','MONTANARO','MONTEU DA PO','MORIONDO TORINESE',
'NICHELINO','NOASCA','NOLE','NOMAGLIO','NONE','NOVALESA','OGLIANICO','ORBASSANO','ORIO CANAVESE','OSASCO','OSASIO','OULX',
'OZEGNA','PALAZZO CANAVESE','PANCALIERI','PARELLA','PAVAROLO','PAVONE CANAVESE','PECCO','PECETTO TORINESE','PEROSA ARGENTINA',
'PEROSA CANAVESE','PERRERO','PERTUSIO','PESSINETTO','PIANEZZA','PINASCA','PINEROLO','PINO TORINESE','PIOBESI TORINESE',
'PIOSSASCO','PISCINA','PIVERONE','POIRINO','POMARETTO','PONT-CANAVESE','PORTE','PRAGELATO','PRALI','PRALORMO','PRAMOLLO',
'PRAROSTINO','PRASCORSANO','PRATIGLIONE','QUAGLIUZZO','QUASSOLO','QUINCINETTO','REANO','RIBORDONE','RIVALBA','RIVALTA DI TORINO',
'RIVA PRESSO CHIERI','RIVARA','RIVAROLO CANAVESE','RIVAROSSA','RIVOLI','ROBASSOMERO','ROCCA CANAVESE','ROLETTO','ROMANO CANAVESE',
'RONCO CANAVESE','RONDISSONE','RORA\'','ROURE','ROSTA','RUBIANA','RUEGLIO','SALASSA','SALBERTRAND','SALERANO CANAVESE',
'SALZA DI PINEROLO','SAMONE','SAN BENIGNO CANAVESE','SAN CARLO CANAVESE','SAN COLOMBANO BELMONTE','SAN DIDERO','SAN FRANCESCO AL CAMPO',
'SANGANO','SAN GERMANO CHISONE','SAN GILLIO','SAN GIORGIO CANAVESE','SAN GIORIO DI SUSA','SAN GIUSTO CANAVESE','SAN MARTINO CANAVESE',
'SAN MAURIZIO CANAVESE','SAN MAURO TORINESE','SAN PIETRO VAL LEMINA','SAN PONSO','SAN RAFFAELE CIMENA','SAN SEBASTIANO DA PO',
'SAN SECONDO DI PINEROLO','SANT\'AMBROGIO DI TORINO','SANT\'ANTONINO DI SUSA','SANTENA','SAUZE DI CESANA','SAUZE D\'OULX',
'SCALENGHE','SCARMAGNO','SCIOLZE','SESTRIERE','SETTIMO ROTTARO','SETTIMO TORINESE','SETTIMO VITTONE','SPARONE','STRAMBINELLO',
'STRAMBINO','SUSA','TAVAGNASCO','TORINO','TORRAZZA PIEMONTE','TORRE CANAVESE','TORRE PELLICE','TRANA','TRAUSELLA','TRAVERSELLA',
'TRAVES','TROFARELLO','USSEAUX','USSEGLIO','VAIE','VAL DELLA TORRE','VALGIOIE','VALLO TORINESE','VALPERGA','VALPRATO SOANA',
'VARISELLA','VAUDA CANAVESE','VENAUS','VENARIA','VEROLENGO','VERRUA SAVOIA','VESTIGNE\'','VIALFRE\'','VICO CANAVESE',
'VIDRACCO','VIGONE','VILLAFRANCA PIEMONTE','VILLANOVA CANAVESE','VILLARBASSE','VILLAR DORA','VILLAREGGIA','VILLAR FOCCHIARDO',
'VILLAR PELLICE','VILLAR PEROSA','VILLASTELLONE','VINOVO','VIRLE PIEMONTE','VISCHE','VISTRORIO','VIU\'','VOLPIANO','VOLVERA',],
        'Ravenna': ['Alfonsine','Bagnacavallo','Lugo']
},
    'canada': {
    'People dont live here': ['igloo', 'cave']
}
};

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
        /*$scope.countries = country_list;
        $scope.provinces = province_list;
        var province="";

        $scope.loadProvinces=function (selectedCountry) {
            console.log("Nazione selezionata: "+selectedCountry);

            if(selectedCountry == "Italy") {

            }
        }*/
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
            console.log("COUNTRY: "+document.getElementById("country").value);
            console.log("COUNTRY: "+document.getElementById("province").value);
            console.log("COUNTRY: "+document.getElementById("city").value);
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