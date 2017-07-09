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

/*var country_list ={
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
 };*/

angular.module('myApp.advancedJoinView', ['ngRoute'])

    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/advancedJoinView', {
            templateUrl: 'advancedJoinView/advancedJoinView.html',
            controller: 'adJoinCtrl',
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

    .controller('adJoinCtrl', ['$scope', 'Auth', '$location', '$firebaseObject', function ($scope, Auth, $location, $firebaseObject) {
        $scope.dati = {};
        $scope.countries = countries_list;

        $scope.loadProvinces = function (selectedCountry) {

            //console.log("ng-change: selezionata nazione: " + selectedCountry);

            var provinces_array;
            provinces_array = provinces_list[selectedCountry].split('|');
            for (var i = 0; i < provinces_array.length; i++) {
                provinces_array[i].trim();
                //console.log("province: " + provinces_array[i]);
            }
            $scope.provinces = provinces_array;

        };

        $scope.loadCities = function (selectedProvince) {
            //console.log("ng-change: selezionata provincia: " + selectedProvince.toString());

            var province_str = selectedProvince.toString();
            //console.log("provincia_str: " + province_str);
            var cities_array;
            cities_array = cities_list[province_str].split('|');
            for (var i = 0; i < cities_array.length; i++) {
                cities_array[i].trim();
                //console.log("city: " + cities_array[i]);
            }
            $scope.cities = cities_array;
        };

        $scope.openHome = function () {
            console.log("tra un attimo");
            $location.path("/homePageView");
        };

        //una volta creato l'utente recupero tutti i dati e creo il database sull'utente
        $scope.createUserDB = function () {
            var UID = localStorage.UID;
            var email = localStorage.joinEmail;
            var pwd = localStorage.joinPassword;
            var nameR = localStorage.joinName;
            var lastNameR = localStorage.joinLast;
            var birth = localStorage.joinBirth;
            var genderR = localStorage.joinGender;
            var phoneR = document.getElementById("phone").value;
            var permissionPhone;
            var d=new Date();
            var dateOfJ=d.getTime();
            if (document.getElementById("checkPermPhone").checked) {
                permissionPhone = 1;
            } else {
                permissionPhone = 0;
            }

            // per eliminare "string: Couuntry" ecc...
            var countryNotParsed = document.getElementById("country").value.split(':');
            var countryR = countryNotParsed[1];
            var provinceNotParsed = document.getElementById("province").value.split(':');
            var provinceR = provinceNotParsed[1];
            var cityNotParsed = document.getElementById("city").value.split(':');
            var cityR = cityNotParsed[1];
            /*console.log("PARSED COUNTRY: " + countryR);
            console.log("PARSED PROVINCE: " + provinceR);
            console.log("PARSED CITY: " + cityR);*/

            var carR;
            if (document.getElementById("carYes").checked) {
                carR = 1;
            } else if (document.getElementById("carNo").checked) { //ELSEIF è strettamente necessario raga?
                carR = 0;
            }
            var payR;
            if (document.getElementById("payYes").checked) {
                payR = 1;
            } else if (document.getElementById("payNo").checked) {
                payR = 0;
            }
            var descriptionR = document.getElementById("aboutMeText").value;
            var race = "None";

            //costruisco un vettore roles per creare un elenco di stringhe dentro il JSON
            var roles = [];
            if (document.getElementById("checkAnim").checked) {
                roles.push("Animation");
            }
            if (document.getElementById("checkAudio").checked) {
                roles.push("Audio/Music/Sound");
            }
            if (document.getElementById("checkDP").checked) {
                roles.push("Camera Crew/DP");
            }
            if (document.getElementById("checkArt").checked) {
                roles.push("Crew art/Design/Scenic/Construction");
            }
            if (document.getElementById("checkDirect").checked) {
                roles.push("Director");
            }
            if (document.getElementById("checkGraphicDes").checked) {
                roles.push("Graphic designer");
            }
            if (document.getElementById("checkLight").checked) {
                roles.push("Lighting/Electric");
            }
            if (document.getElementById("checkPhot").checked) {
                roles.push("Photographers");
            }
            if (document.getElementById("checkPostProd").checked) {
                roles.push("Post Production People");
            }
            if (document.getElementById("checkProducers").checked) {
                roles.push("Producers");
            }
            if (document.getElementById("checkFX").checked) {
                roles.push("Special Effects Crew");
            }
            if (document.getElementById("checkStyle").checked) {
                roles.push("Stylist/Vanities");
            }
            if (document.getElementById("checkActor").checked) {
                roles.push("Talent/Actors");
                if (document.getElementById("etnCauc").checked) {
                    race = "Caucasian";
                }
                if (document.getElementById("etnHisp").checked) {
                    race = "Hispanic";
                }
                if (document.getElementById("etnSAsi").checked) {
                    race = "South_Asian";
                }
                if (document.getElementById("etnNati").checked) {
                    race = "Native_American";
                }
                if (document.getElementById("etnAfri").checked) {
                    race = "African";
                }
                if (document.getElementById("etnMidd").checked) {
                    race = "Middle_Eastern";
                }
                if (document.getElementById("etnSEAs").checked) {
                    race = "South_East_Asian";
                }
                if (document.getElementById("etnAmbi").checked) {
                    race = "Mixed";
                }
            }
            if (document.getElementById("checkCast").checked) {
                roles.push("Talent/Casting - People");
            }

            var friends = [];
            friends[0]="STORMTROUPERS_ADMIN";
            var database = firebase.database();

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
                race: race,
                description: descriptionR, //c'era scritto "desciption" e l'ho corretto, ma non so se ho fatto bene?
                friends:friends,
                dateOfJoin: dateOfJ,
                logged: true,
                equipment: "",
                img_url:"",
                votes:{
                    votes: 0,
                    total: 0
                },
                feedback:{

                }
            }).then(function () {
                console.log("sono qui" + UID);
                var obj = $firebaseObject(database.ref('users/' + UID));
                obj.$loaded().then(function () {
                    $scope.profile = obj;
                    localStorage.attName = obj.name;
                    localStorage.attLast = obj.lastName;
                    localStorage.attEmail = obj.email;
                    localStorage.attCountry = obj.country.split(":");
                    localStorage.attProvince = obj.province;
                    localStorage.attCity = obj.city;
                    localStorage.attBirth = obj.dateOfBirth;
                    localStorage.attGender = obj.gender;
                    localStorage.attDesc = obj.description;
                    localStorage.attPhone = obj.phone;
                    localStorage.attShowOption = obj.permissionToShowPhone;
                    localStorage.attCar = obj.car;
                    localStorage.attPayment = obj.payment;
                    localStorage.attRoles=JSON.stringify(obj.roles);
                    $scope.openHome();
                }).catch(function (error) {
                    $scope.error = error;
                })
            }).catch(function (error) {
                $scope.error = error;
            });
        }

    }]);