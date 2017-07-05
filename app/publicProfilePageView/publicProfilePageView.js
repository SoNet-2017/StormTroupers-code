'use strict';

//lista delle nazioni
var countries_list = ["Afghanistan", "Albania", "Algeria", "Andorra", "Angola", "Anguilla", "Antigua Barbuda", "Argentina", "Armenia", "Aruba", "Australia", "Austria", "Azerbaijan", "Bahamas", "Bahrain", "Bangladesh", "Barbados", "Belarus", "Belgium", "Belize", "Benin", "Bermuda", "Bhutan", "Bolivia", "Bosnia Herzegovina", "Botswana", "Brazil", "British Virgin Islands", "Brunei", "Bulgaria", "Burkina Faso", "Burundi", "Cambodia", "Cameroon", "Canada", "Cape Verde", "Cayman Islands", "Chad", "Chile", "China", "Colombia", "Congo", "Cook Islands", "Costa Rica", "Cote D'Ivoire", "Croatia", "Cruise Ship", "Cuba", "Cyprus", "Czech Republic", "Denmark", "Djibouti", "Dominica", "Dominican Republic", "Ecuador", "Egypt", "El Salvador", "Equatorial Guinea", "Estonia", "Ethiopia", "Falkland Islands", "Faroe Islands", "Fiji", "Finland", "France", "French Polynesia", "French West Indies", "Gabon", "Gambia", "Georgia", "Germany", "Ghana", "Gibraltar", "Greece", "Greenland", "Grenada", "Guam", "Guatemala", "Guernsey", "Guinea", "Guinea Bissau", "Guyana", "Haiti", "Honduras", "Hong Kong", "Hungary", "Iceland", "India", "Indonesia", "Iran", "Iraq", "Ireland", "Isle of Man", "Israel", "Italy", "Jamaica", "Japan", "Jersey", "Jordan", "Kazakhstan", "Kenya", "Kuwait", "Kyrgyz Republic", "Laos", "Latvia", "Lebanon", "Lesotho", "Liberia", "Libya", "Liechtenstein", "Lithuania", "Luxembourg", "Macau", "Macedonia", "Madagascar", "Malawi", "Malaysia", "Maldives", "Mali", "Malta", "Mauritania", "Mauritius", "Mexico", "Moldova", "Monaco", "Mongolia", "Montenegro", "Montserrat", "Morocco", "Mozambique", "Namibia", "Nepal", "Netherlands", "Netherlands Antilles", "New Caledonia", "New Zealand", "Nicaragua", "Niger", "Nigeria", "Norway", "Oman", "Pakistan", "Palestine", "Panama", "Papua New Guinea", "Paraguay", "Peru", "Philippines", "Poland", "Portugal", "Puerto Rico", "Qatar", "Reunion", "Romania", "Russia", "Rwanda", "Saint Pierre Miquelon", "Samoa", "San Marino", "Satellite", "Saudi Arabia", "Senegal", "Serbia", "Seychelles", "Sierra Leone", "Singapore", "Slovakia", "Slovenia", "South Africa", "South Korea", "Spain", "Sri Lanka", "St Kitts Nevis", "St Lucia", "St Vincent", "St. Lucia", "Sudan", "Suriname", "Swaziland", "Sweden", "Switzerland", "Syria", "Taiwan", "Tajikistan", "Tanzania", "Thailand", "Timor L'Este", "Togo", "Tonga", "Trinidad Tobago", "Tunisia", "Turkey", "Turkmenistan", "Turks Caicos", "Uganda", "Ukraine", "United Arab Emirates", "United Kingdom", "United States Of America", "Uruguay", "Uzbekistan", "Venezuela", "Vietnam", "Virgin Islands (US)", "Yemen", "Zambia", "Zimbabwe"];

//lista delle province italiane
var provinces_list = Object();
provinces_list['Italy'] = 'Agrigento|Alessandria|Ancona|Aosta|Aquila|Arezzo|Ascoli Piceno|Asti|Avellino|Bari|Belluno|Benevento|Bergamo|Biella|Bologna|Bolzano|Brescia|Brindisi|Cagliari|Caltanissetta|Campobasso|Caserta|Catania|Catanzaro|Chieti|Como|Cosenza|Cremona|Crotone|Cuneo|Enna|Ferrara|Fienze|Foggia|Forlì e Cesena|Frosinone|Genova|Gorizia|Grosseto|Imperia|Isernia|La Spezia|Latina|Lecce|Lecco|Livorno|Lodi|Lucca|Macerata|Mantova|Massa-Carrara|Matera|Messina|Milano|Modena|Napoli|Novara|Nuoro|Oristano|Padova|Palermo|Parma|Pavia|Perugia|Pesaro e Urbino|Pescara|Piacenza|Pisa|Pistoia|Pordenone|Potenza|Prato|Ragusa |Ravenna|Reggio Calabria |Reggio Emilia|Rieti|Rimini|Roma|Rovigo|Salerno|Sassari|Savona|Siena|Siracusa|Sondrio|Taranto|Teramo|Terni|Torino|Trapani|Trento|Treviso|Trieste|Udine|Varese|Venezia|Verbano-Cusio-Ossola|Vercelli|Verona|Vibo Valentia|Vicenza |Viterbo';
provinces_list['Canada'] = 'prova1|prova2';

var cities_list = Object();
cities_list['Torino'] = 'AGLIE|AIRASCA|ALA DI STURA|ALBIANO DI IVREA|ALICE SUPERIORE|ALMESE|ALPETTE|ALPIGNANO|ANDEZENO|ANDRATE|ANGROGNA|ARIGNANO|AVIGLIANA|AZEGLIO|BAIRO|BALANGERO|BALDISSERO CANAVESE|BALDISSERO TORINESE|BALME|BANCHETTE|BARBANIA|BARDONECCHIA|BARONE CANAVESE|BEINASCO|BIBIANA|BOBBIO PELLICE|BOLLENGO|BORGARO TORINESE|BORGIALLO|BORGOFRANCO DIVREA|BORGOMASINO|BORGONE SUSA|BOSCONERO|BRANDIZZO|BRICHERASIO|BROSSO|BROZOLO|BRUINO|BRUSASCO|BRUZOLO|BURIASCO|BUROLO|BUSANO|BUSSOLENO|BUTTIGLIERA ALTA|CAFASSE|CALUSO|CAMBIANO|CAMPIGLIONE-FENILE|CANDIA CANAVESE|CANDIOLO|CANISCHIO|CANTALUPA|CANTOIRA|CAPRIECARAVINO|CAREMA|CARIGNANO|CARMAGNOLA|CASALBORGONE|CASCINETTE DIVREA|CASELETTE|CASELLE TORINESE|CASTAGNETO PO|CASTAGNOLE PIEMONTE|CASTELLAMONTE|CASTELNUOVO NIGRA|CASTIGLIONE TORINESE|CAVAGNOLO|CAVOUR|CERCENASCO|CERES|CERESOLE REALE|CESANA TORINESE|CHIALAMBERTO|CHIANOCCO|CHIAVERANO|CHIERI|CHIESANUOVA|CHIOMONTE|CHIUSA DI SAN MICHELE|CHIVASSO|CICONIO|CINTANO|CINZANO|CIRIE|CLAVIERE|COASSOLO TORINESE|COAZZE|COLLEGNO|COLLERETTO CASTELNUOVO|COLLERETTO GIACOSA|CONDOVE|CORIO|COSSANO CANAVESE|CUCEGLIO|CUMIANA|CUORGNE|DRUENTO|EXILLES|FAVRIA|FELETTO|FENESTRELLE|FIANO|FIORANO CANAVESE|FOGLIZZO|FORNO CANAVESE|FRASSINETTO|FRONT|FROSSASCO|GARZIGLIANA|GASSINO TORINESE|GERMAGNANO|GIAGLIONE|GIAVENO|GIVOLETTO|GRAVERE|GROSCAVALLO|GROSSO|GRUGLIASCO|INGRIA|INVERSO PINASCA|ISOLABELLA|ISSIGLIO|IVREA|LA CASSA|LA LOGGIA|LANZO TORINESE|LAURIANO|LEINI|LEMIE|LESSOLO|LEVONE|LOCANA|LOMBARDORE|LOMBRIASCO|LORANZE|LUGNACCO|LUSERNA SAN GIOVANNI|LUSERNETTA|LUSIGLIE|MACELLO|MAGLIONE|MARENTINO|MASSELLO|MATHI|MATTIE|MAZZE|MEANA DI SUSA|MERCENASCO|MEUGLIANO|MEZZENILE|MOMBELLO DI TORINO|MOMPANTERO|MONASTERO DI LANZO|MONCALIERI|MONCENISIO|MONTALDO TORINESE|MONTALENGHE|MONTALTO DORA|MONTANARO|MONTEU DA PO|MORIONDO TORINESE|NICHELINO|NOASCA|NOLE|NOMAGLIO|NONE|NOVALESA|OGLIANICO|ORBASSANO|ORIO CANAVESE|OSASCO|OSASIO|OULX|OZEGNA||PALAZZO CANAVESE|PANCALIERI|PARELLA|PAVAROLO|PAVONE CANAVESE|PECCO|PECETTO TORINESE|PEROSA ARGENTINA|PEROSA CANAVESE|PERRERO|PERTUSIO|PESSINETTO|PIANEZZA|PINASCA|PINEROLO|PINO TORINESE|PIOBESI TORINESE|PIOSSASCO|PISCINA|PIVERONE|POIRINO|POMARETTO|PONT-CANAVESE|PORTE|PRAGELATO|PRALI|PRALORMO|PRAMOLLO|PRAROSTINO|PRASCORSANO|PRATIGLIONE|QUAGLIUZZO|QUASSOLO|QUINCINETTO|REANO|RIBORDONE|RIVALBA|RIVALTA DI TORINO|RIVA PRESSO CHIERI|RIVARA|RIVAROLO CANAVESE|RIVAROSSA|RIVOLI|ROBASSOMERO|ROCCA CANAVESE|ROLETTO|ROMANO CANAVESE|RONCO CANAVESE|RONDISSONE|RORA|ROURE|ROSTA|RUBIANA|RUEGLIO|SALASSA|SALBERTRAND|SALERANO CANAVESE|SALZA DI PINEROLO|SAMONE|SAN BENIGNO CANAVESE|SAN CARLO CANAVESE|SAN COLOMBANO BELMONTE|SAN DIDERO|SAN FRANCESCO AL CAMPO|SANGANO|SAN GERMANO CHISONE|SAN GILLIO|SAN GIORGIO CANAVESE|SAN GIORIO DI SUSA|SAN GIUSTO CANAVESE|SAN MARTINO CANAVESE|SAN MAURIZIO CANAVESE|SAN MAURO TORINESE|SAN PIETRO VAL LEMINA|SAN PONSO|SAN RAFFAELE CIMENA|SAN SEBASTIANO DA PO|SAN SECONDO DI PINEROLO|SANTAMBROGIO DI TORINO|SANTANTONINO DI SUSA|SANTENA|SAUZE DI CESANA|SAUZE DOULX|SCALENGHE|SCARMAGNO|SCIOLZE|SESTRIERE|SETTIMO ROTTARO|SETTIMO TORINESE|SETTIMO VITTONE|SPARONE|STRAMBINELLO|STRAMBINO|SUSA|TAVAGNASCO|TORINO|TORRAZZA PIEMONTE|TORRE CANAVESE|TORRE PELLICE|TRANA|TRAUSELLA|TRAVERSELLA|TRAVES|TROFARELLO|USSEAUX|USSEGLIO|VAIE|VAL DELLA TORRE|VALGIOIE|VALLO TORINESE|VALPERGA|VALPRATO SOANA|VARISELLA|VAUDA CANAVESE|VENAUS|VENARIA|VEROLENGO|VERRUA SAVOIA|VESTIGNE|VIALFRE|VICO CANAVESE|VIDRACCO|VIGONE|VILLAFRANCA PIEMONTE|VILLANOVA CANAVESE|VILLARBASSE|VILLAR DORA|VILLAREGGIA|VILLAR FOCCHIARDO|VILLAR PELLICE|VILLAR PEROSA|VILLASTELLONE|VINOVO|VIRLE PIEMONTE|VISCHE|VISTRORIO|VIU|VOLPIANO|VOLVERA';
cities_list['Ravenna'] = 'LUGO|BAGNACAVALLO|RUSSI|RAVENNA';

angular.module('myApp.publicProfilePageView', ['ngRoute'])

    .config(['$routeProvider', function($routeProvider) {
        $routeProvider.when('/publicProfilePageView', {
            templateUrl: 'publicProfilePageView/publicProfilePageView.html',
            controller: 'publicProfilePageViewCtrl',
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

    .controller('publicProfilePageViewCtrl', ['$scope', '$location', 'Auth', '$firebaseObject','Users', 'currentAuth', '$firebaseAuth', '$firebaseArray', function ($scope,$location, Auth, $firebaseObject, Users, currentAuth, $firebaseAuth, $firebaseArray) {
        $scope.dati={};
        $scope.auth=Auth;

        $scope.countries = countries_list;

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

        var UID=localStorage.UID;
        var database=firebase.database();

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

        // UID dell'utente di cui si vuole vedere il profilo pubblico
        var otherUserID=localStorage.otherUserID;
        $scope.otherUser = $firebaseObject(database.ref('users/'+otherUserID));
        $scope.otherUser.$loaded().then(function () {
            console.log("nome other user: "+$scope.otherUser.name+" ID: "+otherUserID+" DESCR: "+$scope.otherUser.description);
            var userRoles = Object.values($scope.otherUser.roles);
            for(var i=0; i<userRoles.length; i++){
                document.getElementById("userRoles").innerHTML+=userRoles[i];
                if(i<userRoles.length-1) {
                    document.getElementById("userRoles").innerHTML+=", ";
                }
            }
            $scope.calculateAge();
        }).catch(function (error) {
            $scope.error=error;
        });

        $scope.calculateAge=function () {
            var ageString = $scope.otherUser.dateOfBirth;
            var ageStringYear = ageString.slice(0, 4);
            var ageIntYear = parseInt(ageStringYear);
            var ageStringMonth = ageString.slice(5, 7);
            var ageIntMonth = parseInt(ageStringMonth);
            var ageStringDay = ageString.slice(8, 10);
            var ageIntDay = parseInt(ageStringDay);

            var actorAge = ageIntDay + (ageIntMonth * 30) + (ageIntYear * 365);

            var today = new Date();
            var dd = today.getDate();
            var mm = today.getMonth()+1; //January is 0!
            var yyyy = today.getFullYear();

            console.log ("Date con la function: "+dd+"/"+mm+"/"+yyyy);

            var currentDate = dd + (mm * 30) + (yyyy * 365);

            var ageInDays = currentDate - actorAge;
            $scope.age = Math.floor(ageInDays / 365);
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