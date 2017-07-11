'use strict';

angular.module('myApp.searchProjectsView', ['ngRoute'])

    .config(['$routeProvider', function($routeProvider) {
        $routeProvider.when('/searchProjectsView', {
            templateUrl: 'searchProjectsView/searchProjectsView.html',
            controller: 'searchProjectsCtrl',
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

    .controller('searchProjectsCtrl', ['$scope', '$location', 'Auth', '$firebaseObject','Users', 'currentAuth', '$firebaseAuth', '$firebaseArray', function ($scope,$location, Auth, $firebaseObject, Users, currentAuth, $firebaseAuth, $firebaseArray) {
        $scope.dati = {};
        $scope.auth = Auth;

        $scope.slider = {
            minValue: 0,
            maxValue: 100,
            value: 0,
            options: {
                floor: 0,
                ceil: 100,
                step: 10,
                showTicks: true
            }
        };

        $scope.slider2 = {
            minValue: 0,
            maxValue: 10,
            value: 0,
            options: {
                floor: 0,
                ceil: 10,
                step: 1,
                showTicks: true
            }
        };

        $scope.slider3 = {
            minValue: 18,
            maxValue: 90,
            options: {
                floor: 0,
                ceil: 100,
                step: 1,
                noSwitching: true
            }
        };

        console.log(localStorage.attName);
        console.log(localStorage.attLast);
        console.log(localStorage.attEmail);
        /*
         document.getElementById("userNameHome").innerHTML=localStorage.attName;
         document.getElementById("userNameAndLastHome").innerHTML=localStorage.attName+" "+localStorage.attLast;*/

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

        $scope.goToSearchProjects = function () {
            $location.path("/searchProjectsView");
        };

        $scope.goToEditProfile = function () {
            $location.path("/editProfileView");
        };

        $scope.goToMyProjects = function () {
            $location.path("/myProjectsView");
        };

        $scope.goToMyTroupers = function () {
            $location.path("/friendsPageView");
            localStorage.otherUserID = UID;
        };

        $scope.goToPublicProfile = function (userID) {
            $location.path("/publicProfilePageView");
            console.log("utente che sto passando: " + userID);
            localStorage.otherUserID = userID;
        };

        $scope.goToMyPublicProfile = function () {
            $location.path("/publicProfilePageView");
            localStorage.otherUserID = UID;
        };

        $scope.goToPublicProjectPage = function (projectID) {
            $location.path("/publicProjectPageView");
            console.log("Sto pssando il pid: " + projectID);
            localStorage.PID = projectID;
        };

        var UID = localStorage.UID;
        var database = firebase.database();

        var projectBase = database.ref('projects/');
        $scope.allProjects = $firebaseArray(projectBase);


        var obj = $firebaseObject(database.ref('users/' + UID));
        obj.$loaded().then(function () {
            $scope.profile = obj;
            var role = Object.values(obj.roles);
            for (var i = 0; i < role.length; i++) {
                document.getElementById("userRolesHome").innerHTML += role[i];
                if (i < role.length - 1) {
                    document.getElementById("userRolesHome").innerHTML += ", ";
                }
            }

            $scope.filterSearch = {};

        }).catch(function (error) {
            $scope.error = error;
        });

        $scope.addUserToFriends = function (otherUserID) {
            if ($scope.profile.friends.indexOf(otherUserID) < 0) {
                $scope.otherUser = $firebaseObject(database.ref('users/' + otherUserID));
                $scope.otherUser.$loaded().then(function () {
                    //aggiorno il vettore anche nell'amico
                    $scope.otherUser.friends.push(UID);
                    //console.log("vettore amicicci di other user"+otherUserID+": "+$scope.otherUser.friends);
                    $scope.otherUser.$save();

                    //aggiorno il vettore dell'utente loggato
                    $scope.profile.friends.push(otherUserID);
                    //console.log("vettore amicicci dell'utente loggato: "+$scope.profile.friends);
                    $scope.profile.$save();
                    console.log("Trouper aggiunto agli amici: " + otherUserID);
                }).catch(function (error) {
                    $scope.error = error;
                });
            }
            else console.log("trouper già inserito");
        };

        $scope.launchSearch = function () {
            //resetta il filtersearch
            $scope.filterSearch = {};

            var checkKeyword = false;
            //step1 checcka la keyword in nome e cognome
            var kw = "";
            kw = document.getElementById("searchKeyword").value;
            if (kw !== "") { //checca solo se hei scritto qualcosa nel campo
                checkKeyword = true;
                console.log("checkKeyword=true");
                console.log("keword is: " + kw);

                //ULTRA-MEGA-PARSER
                //si crea un array di parole da cercare (max 10)
                var kw_ok = false;
                var kw_mto = false;
                var kw_word = ["", "", "", "", "", "", "", "", "", ""]; //le parole trovate in questo modo sono tutti filtri OR (di default)
                var kw_oper = ["OR", "OR", "OR", "OR", "OR", "OR", "OR", "OR", "OR"];
                var kw_op_index = 0;
                var kw_pos_0 = 0;
                var kw_slice_amount = 0;
                var kw_pos_1 = -1;
                var kw_pos_temp = kw.indexOf(" OR");
                var kw_pos_temp2 = kw.indexOf(" AND");

                if (kw_pos_temp === -1) {
                    kw_pos_temp = 9999;
                }
                if (kw_pos_temp2 === -1) {
                    kw_pos_temp2 = 9999;
                }
                //serve per capire se trova prima un OR o un AND (o un " ")

                if (kw_pos_temp > 9999 && kw_pos_temp2 > 9999) {
                    kw_pos_1 = kw.indexOf(" ");
                    if (kw_pos_1 !== -1) {
                        kw_mto = true;
                        kw_oper[kw_op_index] = "OR";
                        kw_op_index++;
                        kw_slice_amount = 1;
                    }
                }
                else {
                    if (kw_pos_temp < kw_pos_temp2) {
                        kw_pos_1 = kw_pos_temp;
                        kw_mto = true;
                        kw_oper[kw_op_index] = "OR";
                        kw_op_index++;
                        kw_slice_amount = 4;
                    }
                    else {
                        kw_pos_1 = kw_pos_temp2;
                        kw_mto = true;
                        kw_oper[kw_op_index] = "AND";
                        kw_op_index++;
                        kw_slice_amount = 5;
                    }
                }


                //console.log("First space found at: "+kw_pos_1.toString());

                if (kw_mto === true) {
                    var kw_length = kw.length;
                    var o = 0;
                    do {

                        kw_word[o] = kw.slice(kw_pos_0, kw_pos_1);
                        console.log("Slicing from " + kw_pos_0.toString() + " to " + kw_pos_1.toString());
                        kw_length = kw.length;
                        kw = kw.slice(kw_pos_1 + kw_slice_amount, kw_length);
                        kw_pos_0 = 0;


                        //kw_pos_1 = -1;
                        kw_pos_temp = kw.indexOf(" OR");
                        kw_pos_temp2 = kw.indexOf(" AND");

                        if (kw_pos_temp === -1) {
                            kw_pos_temp = 9999;
                        }
                        if (kw_pos_temp2 === -1) {
                            kw_pos_temp2 = 9999;
                        }

                        if (kw_pos_temp > 9999 && kw_pos_temp2 > 9999) {
                            kw_pos_1 = kw.indexOf(" ");
                            if (kw_pos_1 !== -1) {
                                kw_oper[kw_op_index] = "OR";
                                kw_op_index++;
                                kw_slice_amount = 1;
                            }
                        }
                        else {
                            if (kw_pos_temp < kw_pos_temp2) {
                                kw_pos_1 = kw_pos_temp;
                                kw_oper[kw_op_index] = "OR";
                                kw_op_index++;
                                kw_slice_amount = 4;
                            }
                            else {
                                kw_pos_1 = kw_pos_temp2;
                                kw_oper[kw_op_index] = "AND";
                                kw_op_index++;
                                kw_slice_amount = 5;
                            }
                        }

                        console.log("Word " + (o + 1).toString() + ": |" + kw_word[o] + "|");
                        console.log("Remaining in kw: |" + kw + "|");
                        console.log("Current operand Array: " + kw_oper);


                        kw_pos_temp = kw.indexOf(" ");

                        if (o >= 9) {
                            break;
                        }
                        else {
                            if (kw_pos_temp === -1) {
                                kw_ok = true;
                                o++;
                                kw_word[o] = kw;
                                console.log("Word " + (o + 1).toString() + ": |" + kw_word[o] + "|");
                            }
                            else {
                                o++;
                            }
                        }
                    }
                    while (kw_ok === false)
                    console.log("Words found: " + (o + 1).toString());
                }
                else {
                    kw_word[0] = kw;
                    console.log("Words found: 1");
                    console.log("Word found is: " + kw_word[0]);
                }
            }
            else {
                console.log("checkKeyword=false");
            }

            //ricerca x città
            var checkCityword = false;
            var ct = "";
            ct = document.getElementById("searchCity").value;
            if (ct !== "") { //checca solo se hei scritto qualcosa nel campo
                checkCityword = true;
                console.log("checkCity=true");
                console.log("cityword is: " + ct);
            }
            else {
                console.log("checkCity=false");
            }

            //ricerca x genere
            var filterByGenre = false;

            var includeAct = false;
            if (document.getElementById("checkAct").checked) {
                filterByGenre = true;
                includeAct = true;
            }
            var includeAni = false;
            if (document.getElementById("checkAni").checked) {
                filterByGenre = true;
                includeAni = true;
            }
            var includeDra = false;
            if (document.getElementById("checkDra").checked) {
                filterByGenre = true;
                includeDra = true;
            }
            var includeCom = false;
            if (document.getElementById("checkCom").checked) {
                filterByGenre = true;
                includeCom = true;
            }
            var includeEro = false;
            if (document.getElementById("checkEro").checked) {
                filterByGenre = true;
                includeEro = true;
            }
            var includeHis = false;
            if (document.getElementById("checkHis").checked) {
                filterByGenre = true;
                includeHis = true;
            }
            var includeHor = false;
            if (document.getElementById("checkHor").checked) {
                filterByGenre = true;
                includeHor = true;
            }
            var includeMar = false;
            if (document.getElementById("checkMar").checked) {
                filterByGenre = true;
                includeMar = true;
            }
            var includeMus = false;
            if (document.getElementById("checkMus").checked) {
                filterByGenre = true;
                includeMus = true;
            }
            var includeRom = false;
            if (document.getElementById("checkRom").checked) {
                filterByGenre = true;
                includeRom = true;
            }
            var includeSci = false;
            if (document.getElementById("checkSci").checked) {
                filterByGenre = true;
                includeSci = true;
            }
            var includeWar = false;
            if (document.getElementById("checkWar").checked) {
                filterByGenre = true;
                includeWar = true;
            }
            var includeWes = false;
            if (document.getElementById("checkWes").checked) {
                filterByGenre = true;
                includeWes = true;
            }


            //step34 checca il ruolo che stanno cercando
            var filterByRole = false;

            var includeAnim = false;
            if (document.getElementById("checkAnim").checked) {
                filterByRole = true;
                includeAnim = true;
            }
            var includeAudio = false;
            if (document.getElementById("checkAudio").checked) {
                filterByRole = true;
                includeAudio = true;
            }
            var includeDP = false;
            if (document.getElementById("checkDP").checked) {
                filterByRole = true;
                includeDP = true;
            }
            var includeArt = false;
            if (document.getElementById("checkArt").checked) {
                filterByRole = true;
                includeArt = true;
            }
            var includeDirect = false;
            if (document.getElementById("checkDirect").checked) {
                filterByRole = true;
                includeDirect = true;
            }

            var includeGraphic = false;
            if (document.getElementById("checkGraphicDes").checked) {
                filterByRole = true;
                includeGraphic = true;
            }
            var includeLight = false;
            if (document.getElementById("checkLight").checked) {
                filterByRole = true;
                includeLight = true;
            }
            var includePhot = false;
            if (document.getElementById("checkPhot").checked) {
                filterByRole = true;
                includePhot = true;
            }
            var includePost = false;
            if (document.getElementById("checkPostProd").checked) {
                filterByRole = true;
                includePost = true;
            }
            var includeProd = false;
            if (document.getElementById("checkProducers").checked) {
                filterByRole = true;
                includeProd = true;
            }
            var includeFX = false;
            if (document.getElementById("checkFX").checked) {
                filterByRole = true;
                includeFX = true;
            }
            var includeStyle = false;
            if (document.getElementById("checkStyle").checked) {
                filterByRole = true;
                includeStyle = true;
            }
            var includeCast = false;
            if (document.getElementById("checkCast").checked) {
                filterByRole = true;
                includeCast = true;
            }
            var includeActor = false;
            if (document.getElementById("checkActor").checked) {
                filterByRole = true;
                includeActor = true;
            }


            //ricerca x status progress
            var filterByProgress = false;

            var includeYet = false;
            if (document.getElementById("checkYet").checked) {
                filterByProgress = true;
                includeYet = true;
            }
            var includeHold = false;
            if (document.getElementById("checkHold").checked) {
                filterByProgress = true;
                includeHold = true;
            }
            var includeComp = false;
            if (document.getElementById("checkComp").checked) {
                filterByProgress = true;
                includeComp = true;
            }
            var includeProg = false;
            if (document.getElementById("checkProg").checked) {
                filterByProgress = true;
                includeProg = true;
            }


            //parte il coso per davvero
            var length = $scope.allProjects.length;
            var j = 0;
            console.log("Fin qua siamo arrivati");
            for (var i = 0; i < length; i++) { //si scorre tutto l'array

                /*
                 if ($scope.allProjects[i].$id === $scope.profile.$id) {
                 console.log("SELF SKIPPED");
                 i++;
                 if (i>=length) {break;}
                 }
                 */


                if (checkKeyword === true) {
                    var kw_Found = false;
                    var kw_Found_Vector = [false, false, false, false, false, false, false, false, false, false];
                    //le singole parole sono tra di loro filtri OR (per ora), ma la keyword è un AND con gli altri campi!!!!
                    //a questo punto hai l'array key_word[X] riempito delle parole che devi cercare
                    for (var p = 0; p <= 9; p++) {
                        if (kw_word[p] == "") {
                            break;
                        }
                    }
                    var kw_trueLen = p - 1;

                    var xyz = "";

                    for (p = 0; p <= kw_trueLen; p++) {
                        //prima cerca nel titolo
                        xyz = $scope.allProjects[i].title.toLowerCase().search(kw_word[p].toLowerCase());
                        if (xyz !== -1) {
                            kw_Found_Vector[p] = true;
                            //break;
                        }
                        else {
                            //poi cerca nella descrizione
                            xyz = $scope.allProjects[i].description.toLowerCase().search(kw_word[p].toLowerCase());
                            if (xyz !== -1) {
                                kw_Found_Vector[p] = true;
                                //break;
                            }
                            else {
                                //già che ci siamo cerca anche nel genere (il nome deve essere preciso qua)
                                if (kw_word[p].toUpperCase() == $scope.allProjects[i].genre.toUpperCase()) {
                                    kw_Found_Vector[p] = true;
                                    //break;
                                }
                                else {
                                    //e perché no guarda anche la città
                                    xyz = $scope.allProjects[i].city.toLowerCase().search(kw_word[p].toLowerCase());
                                    if (xyz !== -1) {
                                        kw_Found_Vector[p] = true;
                                        //break;
                                    }
                                }

                            }
                        }
                    }

                    //arrivati a questo punto lui ha messo in kw_Found_Vector vero o falso se ha trovato le singole parole
                    //adesso gli butto dentro un check coi filtri OR e AND (kw_oper[n])per vedere che siano rispettate tutte le condizioni booleane
                    if (kw_trueLen === 0) {
                        if (kw_Found_Vector[0] === true) {
                            kw_Found = true;
                        }
                        //caso in cui hai una sola keyword, senza stare a farsi troppe seghe mentali sugli operatori
                    }
                    else {
                        //questa matrice è incredibilmente inefficiente, ma non mi viene in mente nessun altra soluzione

                        console.log("Sto partendo a verificare per " + $scope.allProjects[i].name + " " + $scope.allProjects[i].lastName + "..");

                        var kw_Boolean_Group = [[], [], [], [], [], [], [], [], [], []];

                        var kwb_riga = 0;
                        var kwb_groups = 0;

                        //compila la matrice
                        for (p = 0; p <= kw_trueLen; p++) {
                            kw_Boolean_Group[kwb_riga].push(p)
                            if (kw_oper[p] === "OR") {
                                kwb_riga++;
                                kwb_groups++;
                            }
                            else {
                            }
                        }

                        //facciamogliela stampare per controllare
                        console.log(kw_Boolean_Group[0]);
                        console.log(kw_Boolean_Group[1]);
                        console.log(kw_Boolean_Group[2]);
                        console.log(kw_Boolean_Group[3]);
                        console.log(kw_Boolean_Group[4]);
                        console.log(kw_Boolean_Group[5]);
                        console.log(kw_Boolean_Group[6]);
                        console.log(kw_Boolean_Group[7]);
                        console.log(kw_Boolean_Group[8]);
                        console.log(kw_Boolean_Group[9]);

                        //a questo punto controlla veramente le condizioni

                        var kwb_Verified_Flag = true;

                        for (var ppp = 0; ppp <= kwb_groups; ppp++) {
                            kwb_Verified_Flag = true;

                            if (kw_Boolean_Group[ppp].length == 0) {
                                console.log("Breaking cycle due to insufficient length...");
                                break;
                            }
                            else {

                                for (var q = 0; q <= kw_Boolean_Group[ppp].length - 1; q++) {
                                    if (kw_Found_Vector[kw_Boolean_Group[ppp][q]] === false) {
                                        kwb_Verified_Flag = false;
                                        console.log("Boolean Block #" + ppp.toString() + " is NOT all true!");
                                        break; //a questo punto, dentro una parentesi di AND ha trovato uno che non è vero, quindi tutto il blocco non è verificato!
                                    }
                                }

                                if (kwb_Verified_Flag === true) { //se è verificato uno qualsiasi degli OR, allora è tutto vero!
                                    console.log("Boolean Block #" + ppp.toString() + " is all true!");
                                    console.log("Quindi l'utente " + $scope.allProjects[i].name + " " + $scope.allProjects[i].lastName + " dovrebbe essere a posto!");
                                    kw_Found = true;
                                    break;
                                }
                                else {
                                    console.log("Going to the following block...");
                                    console.log("KWB GROUPS: " + kwb_groups.toString());
                                }
                            }
                        }
                    }
                }

                if (checkCityword === true && (kw_Found === true || checkKeyword === false)) {
                    var ct_Found = false;

                    if (ct.toUpperCase() == $scope.allProjects[i].city.toUpperCase()) {
                        ct_Found = true;
                        //break;
                    }

                }

                if (filterByGenre === true && (kw_Found === true || checkKeyword === false) && (ct_Found === true || checkCityword === false)) {
                    var gen_Found = false;
                    console.log("filterByGenre? = true!");
                    var gen_g = $scope.allProjects[i].genre;
                    if (gen_g === "Action" && includeAct === true) {
                        gen_Found = true;
                    }
                    if (gen_g === "Action" && includeAct === true) {
                        gen_Found = true;
                    }
                    if (gen_g === "Animation" && includeAni === true) {
                        gen_Found = true;
                    }
                    if (gen_g === "Comedy" && includeCom === true) {
                        gen_Found = true;
                    }
                    if (gen_g === "Drama" && includeDra === true) {
                        gen_Found = true;
                    }
                    if (gen_g === "Erotic" && includeEro === true) {
                        gen_Found = true;
                    }
                    if ((gen_g === "Historical" || gen_g === "Hystorical") && includeHis === true) {
                        gen_Found = true;
                    }
                    if (gen_g === "Horror" && includeHor === true) {
                        gen_Found = true;
                    }
                    if (gen_g === "Martial Arts" && includeMar === true) {
                        gen_Found = true;
                    }
                    if (gen_g === "Musical" && includeMus === true) {
                        gen_Found = true;
                    }
                    if (gen_g === "Romance" && includeRom === true) {
                        gen_Found = true;
                    }
                    if (gen_g === "Sci" && includeSci === true) {
                        gen_Found = true;
                    }
                    if (gen_g === "War" && includeWar === true) {
                        gen_Found = true;
                    }
                    if (gen_g === "Western" && includeWes === true) {
                        gen_Found = true;
                    }
                }
                else {
                    console.log("Filter by Genre = false!")
                }

                if (filterByRole === true && (kw_Found === true || checkKeyword === false)) { //la condizione "kw_Found===true" serve perché essendo la keyword un AND, se non corrisponde la keyword non sta a verificare il resto

                    var rl_Found=false;

                    console.log("filterByRoleNeeded? = true!");
                    console.log("searching vacant roles in: "+$scope.allProjects[i].title);

                    var roles = $scope.allProjects[i].rolesNeeded;
                    var rl = roles.length;

                    for (var n = 0; n < rl; n++) {


                        if (includeAnim === true && roles[n] === "Animation") {
                            rl_Found = true;
                            break;
                        }
                        if (includeAudio === true && roles[n] === "Audio/Music/Sound") {
                            rl_Found = true;
                            break;
                        }
                        if (includeDP === true && roles[n] === "Camera Crew/DP") {
                            rl_Found = true;
                            break;
                        }
                        if (includeArt === true && roles[n] === "Crew art/Design/Scenic/Construction") {
                            rl_Found = true;
                            break;
                        }
                        if (includeDirect === true && roles[n] === "Director") {
                            rl_Found = true;
                            break;
                        }
                        if (includeLight === true && roles[n] === "Lighting/Electric") {
                            rl_Found = true;
                            break;
                        }
                        if (includeGraphic === true && roles[n] === "Graphic designer") {
                            rl_Found = true;
                            break;
                        }
                        if (includePost === true && roles[n] === "Post Production People") {
                            rl_Found = true;
                            break;
                        }
                        if (includeProd === true && roles[n] === "Producers") {
                            rl_Found = true;
                            break;
                        }
                        if (includeFX === true && roles[n] === "Special Effects Crew") {
                            rl_Found = true;
                            break;
                        }
                        if (includeStyle === true && roles[n] === "Stylist/Vanities") {
                            rl_Found = true;
                            break;
                        }
                        if (includeCast === true && roles[n] === "Talent/Casting - People") {
                            rl_Found = true;
                            break;
                        }
                        if (includeActor === true && roles[n] === "Talent/Actors") {
                            rl_Found = true;
                            break;
                        }

                    }

                    if (rl_Found===true) {
                        console.log("Found Role in this project");
                    }

                }
                else {
                    console.log("Filter by Role = false!")
                }

                if (filterByProgress === true && (kw_Found === true || checkKeyword === false)) {
                    var prg_Found = false;
                    console.log("filterByProgress? = true!");
                    var prg_p=$scope.allProjects[i].progress;
                    if (prg_p === "Yet to start" && includeYet === true) {
                        prg_Found = true;
                    }
                    if (prg_p === "Completed" && includeComp === true) {
                        prg_Found = true;
                    }
                    if (prg_p === "On Hold" && includeHold === true) {
                        prg_Found = true;
                    }
                    if (prg_p === "In Progress" && includeProg === true) {
                        prg_Found = true;
                    }

                }
                else {
                    console.log("Filter by Progress = false!")
                }


                //check finale, se corrisponde tutto allora aggiungi a filterSearch
                //CORRENTI: Keyword, City, Genre, Needed Roles, Progress State
                //cerca solo se hai compilato almeno un campo
                if ((checkKeyword===true || checkCityword===true || filterByRole===true || filterByGenre===true || filterByProgress===true) &&
                    (kw_Found === true || checkKeyword === false) &&
                    (ct_Found === true || checkCityword === false) &&
                    (gen_Found === true || filterByGenre === false) &&
                    (rl_Found === true || filterByRole === false) &&
                    (prg_Found === true || filterByProgress === false)) {

                    $scope.filterSearch[j] = $scope.allProjects[i];
                    j++;
                    console.log($scope.allProjects[i].title + " added to results.");
                }

                //ricerca di prova in base al nome TENIAMOLA LI'
                /*
                 if($scope.allProjects[i].name==="Branda"){
                 arr[j]=$scope.allProjects[i];
                 $scope.filterSearch[j]=$scope.allProjects[i];
                 console.log($scope.filterSearch[j]);
                 j++;
                 }
                 */

            }

            document.body.scrollTop = 0;

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
