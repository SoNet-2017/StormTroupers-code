'use strict';

angular.module('myApp.searchPageView', ['ngRoute'])

    .config(['$routeProvider', function($routeProvider) {
        $routeProvider.when('/searchPageView', {
            templateUrl: 'searchPageView/searchPageView.html',
            controller: 'searchPageCtrl',
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

    .controller('searchPageCtrl', ['$scope', '$location', 'Auth', '$firebaseObject','Users', 'currentAuth', '$firebaseAuth', '$firebaseArray', function ($scope,$location, Auth, $firebaseObject, Users, currentAuth, $firebaseAuth, $firebaseArray) {
        $scope.dati={};
        $scope.auth=Auth;

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

        $scope.goToMyTroupers=function () {
            $location.path("/friendsPageView");
            localStorage.otherUserID = UID;
        };

        $scope.goToPublicProfile=function(userID) {
            $location.path("/publicProfilePageView");
            console.log("utente che sto passando: "+userID);
            localStorage.otherUserID = userID;
        };

        $scope.goToMyPublicProfile=function () {
            $location.path("/publicProfilePageView");
            localStorage.otherUserID=UID;
        };

        var UID=localStorage.UID;
        var database=firebase.database();
        var usersBase=database.ref('users/');
        var userQuery=usersBase.orderByChild("dateOfJoin");
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

        }).catch(function (error) {
            $scope.error=error;
        });

        $scope.addUserToFriends=function(otherUserID){
            if($scope.profile.friends.indexOf(otherUserID)<0) {
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
                    console.log("Trouper aggiunto agli amici: " +  otherUserID);
                }).catch(function (error) {
                    $scope.error = error;
                });
            }
            else console.log("trouper già inserito");
        };

        $scope.launchSearch = function () {
            //resetta il filtersearch
            $scope.filterSearch={};

            var resultIsOkFlag=false;

            var checkKeyword=false;
            //step1 checcka la keyword in nome e cognome
            var kw="";
            kw=document.getElementById("searchKeyword").value;
            if (kw!=="") { //checca solo se hei scritto qualcosa nel campo
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
                    if (kw_pos_1!==-1) {
                        kw_mto=true;
                        kw_oper[kw_op_index]="OR";
                        kw_op_index++;
                        kw_slice_amount=1;
                    }
                }
                else {
                    if (kw_pos_temp < kw_pos_temp2) {
                        kw_pos_1 = kw_pos_temp;
                        kw_mto=true;
                        kw_oper[kw_op_index]="OR";
                        kw_op_index++;
                        kw_slice_amount=4;
                    }
                    else {
                        kw_pos_1 = kw_pos_temp2;
                        kw_mto=true;
                        kw_oper[kw_op_index]="AND";
                        kw_op_index++;
                        kw_slice_amount=5;
                    }
                }



                //console.log("First space found at: "+kw_pos_1.toString());

                if (kw_mto===true) {
                    var kw_length = kw.length;
                    var o = 0;
                    do {

                        kw_word[o] = kw.slice(kw_pos_0, kw_pos_1);
                        console.log("Slicing from "+kw_pos_0.toString()+" to "+kw_pos_1.toString());
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
                            if (kw_pos_1!==-1) {
                                kw_oper[kw_op_index]="OR";
                                kw_op_index++;
                                kw_slice_amount=1;
                            }
                        }
                        else {
                            if (kw_pos_temp < kw_pos_temp2) {
                                kw_pos_1 = kw_pos_temp;
                                kw_oper[kw_op_index]="OR";
                                kw_op_index++;
                                kw_slice_amount=4;
                            }
                            else {
                                kw_pos_1 = kw_pos_temp2;
                                kw_oper[kw_op_index]="AND";
                                kw_op_index++;
                                kw_slice_amount=5;
                            }
                        }


                        //kw_pos_1 = kw.indexOf(" ");
                        /*
                        kw_pos_1 = kw.indexOf(" OR");
                        if (kw_pos_1!==-1) {
                            kw_oper[kw_op_index]="OR";
                            kw_op_index++;
                            kw_slice_amount=4;
                        }
                        else {
                            kw_pos_1 = kw.indexOf(" AND");
                            if (kw_pos_1!==-1) {
                                kw_oper[kw_op_index]="AND";
                                kw_op_index++;
                                kw_slice_amount=5;
                            }
                            else {
                                kw_pos_1 = kw.indexOf(" ");
                                if (kw_pos_1!==-1) {
                                    kw_oper[kw_op_index]="OR";
                                    kw_op_index++;
                                    kw_slice_amount=1;
                                }
                            }
                        }
                        */

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
                                kw_word[o]=kw;
                                console.log("Word " + (o + 1).toString() + ": |" + kw_word[o] + "|");
                            }
                            else {
                                o++;
                            }
                        }
                    }
                    while (kw_ok === false)
                    console.log("Words found: "+(o+1).toString());
                }
                else {
                    kw_word[0]=kw;
                    console.log("Words found: 1");
                    console.log("Word found is: "+kw_word[0]);
                }
            }
            else {
                console.log("checkKeyword=false");
            }



            //step34 checca il ruolo
            var filterByRole=false;

            var includeAnim=false;
            if (document.getElementById("checkAnim").checked) {
                filterByRole=true;
                includeAnim=true;
            }
            var includeAudio=false;
            if (document.getElementById("checkAudio").checked) {
                filterByRole=true;
                includeAudio=true;
            }
            var includeDP=false;
            if (document.getElementById("checkDP").checked) {
                filterByRole=true;
                includeDP=true;
            }
            var includeArt=false;
            if (document.getElementById("checkArt").checked) {
                filterByRole=true;
                includeArt=true;
            }
            var includeDirect=false;
            if (document.getElementById("checkDirect").checked) {
                filterByRole=true;
                includeDirect=true;
            }

            var includeGraphic=false;
            if (document.getElementById("checkGraphicDes").checked) {
                filterByRole=true;
                includeGraphic=true;
            }
            var includeLight=false;
            if (document.getElementById("checkLight").checked) {
                filterByRole=true;
                includeLight=true;
            }
            var includePhot=false;
            if (document.getElementById("checkPhot").checked) {
                filterByRole=true;
                includePhot=true;
            }
            var includePost=false;
            if (document.getElementById("checkPostProd").checked) {
                filterByRole=true;
                includePost=true;
            }
            var includeProd=false;
            if (document.getElementById("checkProducers").checked) {
                filterByRole=true;
                includeProd=true;
            }
            var includeFX=false;
            if (document.getElementById("checkFX").checked) {
                filterByRole=true;
                includeFX=true;
            }
            var includeStyle=false;
            if (document.getElementById("checkStyle").checked) {
                filterByRole=true;
                includeStyle=true;
            }
            var includeCast=false;
            if (document.getElementById("checkCast").checked) {
                filterByRole=true;
                includeCast=true;
            }
            var includeActor=false;
            if (document.getElementById("checkActor").checked) {
                filterByRole=true;
                includeActor=true;
                var actorANDsex=true;
                var actorANDetn=true;
                var skipSex=false;
                var skipEtn=false;

                //step27 checca il sesso
                var includeF=false;
                var includeM=false;
                if (document.getElementById("checkFem").checked) {
                    includeF=true;
                    actorANDsex=true;
                }
                if (document.getElementById("checkMal").checked) {
                    includeM=true;
                    actorANDsex=true;
                    if (includeF==true) {
                        skipSex=true;
                    }
                }

                //CASO IN CUI L'UTENTE FACCIA IL PIRLA E NON SEGNI NIENTE, CI PENSA IL CODICE A INCLUDERE TUTTI E DUE
                if (document.getElementById("checkMal").checked===false && document.getElementById("checkFem").checked===false) {
                    includeM=true;
                    includeF=true;
                    actorANDsex=true;
                    skipSex=true;
                }


                //step278 checca l'etnia
                var includeCau=false;
                var includeLat=false;
                var includeSAs=false;
                var includeNat=false;
                var includeAfr=false;
                var includeMid=false;
                var includeSEA=false;
                var includeAmb=false;
                if (document.getElementById("etnCauc").checked) {
                    includeCau=true;
                    actorANDetn=true;
                }
                if (document.getElementById("etnHisp").checked) {
                    includeLat=true;
                    actorANDetn=true;
                }
                if (document.getElementById("etnSAsi").checked) {
                    includeSAs=true;
                    actorANDetn=true;
                }
                if (document.getElementById("etnNati").checked) {
                    includeNat=true;
                    actorANDetn=true;
                }
                if (document.getElementById("etnAfri").checked) {
                    includeAfr=true;
                    actorANDetn=true;
                }
                if (document.getElementById("etnMidd").checked) {
                    includeMid=true;
                    actorANDetn=true;
                }
                if (document.getElementById("etnPaci").checked) {
                    includeSEA=true;
                    actorANDetn=true;
                }
                if (document.getElementById("etnAmbi").checked) {
                    includeAmb=true;
                    actorANDetn=true;
                }
                //CASO IN CUI L'UTENTE PER SBAGLIO NON CECCHI NESSUNA RAZZA
                if (document.getElementById("etnCauc").checked===false &&
                    document.getElementById("etnHisp").checked===false &&
                    document.getElementById("etnSAsi").checked===false &&
                    document.getElementById("etnNati").checked===false &&
                    document.getElementById("etnAfri").checked===false &&
                    document.getElementById("etnMidd").checked===false &&
                    document.getElementById("etnPaci").checked===false &&
                    document.getElementById("etnAmbi").checked===false
                    ) {

                    includeCau=true;
                    includeLat=true;
                    includeSAs=true;
                    includeNat=true;
                    includeAfr=true;
                    includeMid=true;
                    includeSEA=true;
                    includeAmb=true;
                    actorANDetn=true;
                    skipEtn=true;
                }
                if (document.getElementById("etnCauc").checked &&
                    document.getElementById("etnHisp").checked &&
                    document.getElementById("etnSAsi").checked &&
                    document.getElementById("etnNati").checked &&
                    document.getElementById("etnAfri").checked &&
                    document.getElementById("etnMidd").checked &&
                    document.getElementById("etnPaci").checked &&
                    document.getElementById("etnAmbi").checked
                ) {
                    skipEtn=true;
                }
            }


            //parte il coso per davvero
            var length=$scope.filterUsers.length;
            var j=0;
            for(var i=0; i<length; i++){ //si scorre tutto l'array

                resultIsOkFlag=false;

                if ($scope.filterUsers[i].$id === $scope.profile.$id || $scope.filterUsers[i].$id.toString()==="STORMTROUPERS_ADMIN") {
                    console.log("SELF SKIPPED");
                    i++;
                    if (i>=length) {break;}
                }



                if (checkKeyword===true) {
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

                    for (p = 0; p <= kw_trueLen; p++) {
                        //prima cerca nel nome
                        if (kw_word[p].toLowerCase() == $scope.filterUsers[i].name.toLowerCase()) {
                            kw_Found_Vector[p] = true;
                            //break;
                        }
                        else {
                            //poi cerca nel cognome
                            if (kw_word[p].toLowerCase() == $scope.filterUsers[i].lastName.toLowerCase()) {
                                kw_Found_Vector[p] = true;
                                //break;
                            }
                            else {
                                //già che ci siamo cerca anche nella città
                                if (kw_word[p].toUpperCase() == $scope.filterUsers[i].city.toUpperCase()) {
                                    kw_Found_Vector[p] = true;
                                    //break;
                                }
                                else {
                                    //e perché no guarda anche la provincia
                                    if (kw_word[p].toLowerCase() == $scope.filterUsers[i].province.toLowerCase()) {
                                        kw_Found_Vector[p] = true;
                                        //break;
                                    }
                                    else {
                                        //cerca anche nei ruoli
                                        var roles = $scope.filterUsers[i].roles;
                                        var rl = roles.length;
                                        var sub_break = false;
                                        var t_int = -1;
                                        var kw_cl = "";
                                        for (var n = 0; n < rl; n++) {
                                            kw_cl = roles[n].toLowerCase();
                                            t_int = kw_cl.search(kw_word[p].toLowerCase());
                                            if (t_int !== -1) {
                                                kw_Found_Vector[p] = true;
                                                //sub_break=true;
                                                break;
                                            }
                                        }
                                        //if (sub_break==true) {break;}
                                    }
                                }

                            }
                        }
                    }

                    //arrivati a questo punto lui ha messo in kw_Found_Vector vero o falso se ha trovato le singole parole
                    //adesso gli butto dentro un check coi filtri OR e AND (kw_oper[n])per vedere che siano rispettate tutte le condizioni booleane
                    if (kw_trueLen===0) {
                        if (kw_Found_Vector[0]===true) {kw_Found = true;}
                         //caso in cui hai una sola keyword, senza stare a farsi troppe seghe mentali sugli operatori
                    }
                    else {
                        //questa matrice è incredibilmente inefficiente, ma non mi viene in mente nessun altra soluzione

                        console.log("Sto partendo a verificare per "+$scope.filterUsers[i].name+" "+$scope.filterUsers[i].lastName+"..");

                        var kw_Boolean_Group= [[],[],[],[],[],[],[],[],[],[]];

                        var kwb_riga=0;
                        var kwb_groups=0;

                        //compila la matrice
                        for (p = 0; p <= kw_trueLen; p++) {
                            kw_Boolean_Group[kwb_riga].push(p)
                            if (kw_oper[p]==="OR") {kwb_riga++; kwb_groups++;}
                            else {}
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

                        var kwb_Verified_Flag=true;

                        for (var ppp = 0; ppp<=kwb_groups; ppp++) {
                            kwb_Verified_Flag=true;

                            if (kw_Boolean_Group[ppp].length==0) {
                                console.log("Breaking cycle due to insufficient length...");
                                break;}
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
                                    console.log("Quindi l'utente "+$scope.filterUsers[i].name+" "+$scope.filterUsers[i].lastName+" dovrebbe essere a posto!");
                                    kw_Found = true;
                                    break;
                                }
                                else {
                                    console.log("Going to the following block...");
                                    console.log("KWB GROUPS: "+kwb_groups.toString());
                                }
                            }
                        }
                    }


                    if (filterByRole===false && kw_Found===true) {
                        $scope.filterSearch[j] = $scope.filterUsers[i];
                        j++;
                    }
                }



                if (filterByRole===true && (kw_Found===true || checkKeyword===false)) { //la condizione "kw_Found===true" serve perché essendo la keyword un AND, se non corrisponde la keyword non sta a verificare il resto

                    console.log("filterByRole? = true!");

                    var roles = $scope.filterUsers[i].roles;
                    var rl = roles.length;

                    for (var n = 0; n < rl; n++) {
                        if (includeAnim === true && roles[n] === "Animation") {
                            $scope.filterSearch[j] = $scope.filterUsers[i];
                            j++;
                            resultIsOkFlag = true;
                            break;
                        }
                        if (includeAudio === true && roles[n] === "Audio/Music/Sound") {
                            $scope.filterSearch[j] = $scope.filterUsers[i];
                            j++;
                            resultIsOkFlag = true;
                            break;
                        }
                        if (includeDP === true && roles[n] === "Camera Crew/DP") {
                            $scope.filterSearch[j] = $scope.filterUsers[i];
                            j++;
                            resultIsOkFlag = true;
                            break;
                        }
                        if (includeArt === true && roles[n] === "Crew art/Design/Scenic/Construction") {
                            $scope.filterSearch[j] = $scope.filterUsers[i];
                            j++;
                            resultIsOkFlag = true;
                            break;
                        }
                        if (includeDirect === true && roles[n] === "Director") {
                            $scope.filterSearch[j] = $scope.filterUsers[i];
                            j++;
                            resultIsOkFlag = true;
                            break;
                        }
                        if (includeLight === true && roles[n] === "Lighting/Electric") {
                            $scope.filterSearch[j] = $scope.filterUsers[i];
                            j++;
                            resultIsOkFlag = true;
                            break;
                        }
                        if (includeGraphic === true && roles[n] === "Graphic designer") {
                            $scope.filterSearch[j] = $scope.filterUsers[i];
                            j++;
                            resultIsOkFlag = true;
                            break;
                        }
                        if (includePost === true && roles[n] === "Post Production People") {
                            $scope.filterSearch[j] = $scope.filterUsers[i];
                            j++;
                            resultIsOkFlag = true;
                            break;
                        }
                        if (includeProd === true && roles[n] === "Producers") {
                            $scope.filterSearch[j] = $scope.filterUsers[i];
                            j++;
                            resultIsOkFlag = true;
                            break;
                        }
                        if (includeFX === true && roles[n] === "Special Effects Crew") {
                            $scope.filterSearch[j] = $scope.filterUsers[i];
                            j++;
                            resultIsOkFlag = true;
                            break;
                        }
                        if (includeStyle === true && roles[n] === "Stylist/Vanities") {
                            $scope.filterSearch[j] = $scope.filterUsers[i];
                            j++;
                            resultIsOkFlag = true;
                            break;
                        }
                        if (includeCast === true && roles[n] === "Talent/Casting - People") {
                            $scope.filterSearch[j] = $scope.filterUsers[i];
                            j++;
                            resultIsOkFlag = true;
                            break;
                        }
                        if (includeActor === true && roles[n] === "Talent/Actors") {

                            var age_is_ok = false;

                            //step 97 cecca l'età
                            var actorAgeMin = $scope.slider3.minValue;
                            var actorAgeMax = $scope.slider3.maxValue;

                            console.log("Age: " + actorAgeMin + " - " + actorAgeMax);

                            var ageString = $scope.filterUsers[i].dateOfBirth;
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

                            console.log ("Date con la function: "+dd+"/"+mm+"/"+yyyy)


                            var currentDate = dd + (mm * 30) + (yyyy * 365);


                            var trueActorAge = currentDate - actorAge;

                            if (trueActorAge >= (actorAgeMin * 365) && trueActorAge <= (actorAgeMax * 365)) {
                                age_is_ok = true;
                            }
                            if (age_is_ok===true) {
                            if (skipSex === true && skipEtn === true) {
                                $scope.filterSearch[j] = $scope.filterUsers[i];
                                j++;
                                resultIsOkFlag = true;
                                break;
                            }

                            else {
                                if (skipSex == false && skipEtn == true) {
                                    if (includeF === true) {
                                        if ($scope.filterUsers[i].gender === "female") {
                                            if (actorANDetn === false) {
                                                $scope.filterSearch[j] = $scope.filterUsers[i];
                                                j++;
                                                resultIsOkFlag = true;
                                                break;
                                            }
                                        }
                                    }

                                    if (includeM === true) {
                                        if ($scope.filterUsers[i].gender === "male") {
                                            if (actorANDetn === false) {
                                                $scope.filterSearch[j] = $scope.filterUsers[i];
                                                j++;
                                                resultIsOkFlag = true;
                                                break;
                                            }
                                        }
                                    }
                                }
                                else {
                                    if (skipSex === true && skipEtn === false) {
                                        if (includeCau === true) {
                                            if ($scope.filterUsers[i].race === "Caucasian") {
                                                $scope.filterSearch[j] = $scope.filterUsers[i];
                                                j++;
                                                resultIsOkFlag = true;
                                                break;
                                            }
                                        }
                                        if (includeLat === true) {
                                            if ($scope.filterUsers[i].race === "Hispanic") {
                                                $scope.filterSearch[j] = $scope.filterUsers[i];
                                                j++;
                                                resultIsOkFlag = true;
                                                break;
                                            }
                                        }
                                        if (includeSAs === true) {
                                            if ($scope.filterUsers[i].race === "South_Asian") {
                                                $scope.filterSearch[j] = $scope.filterUsers[i];
                                                j++;
                                                resultIsOkFlag = true;
                                                break;
                                            }
                                        }
                                        if (includeNat === true) {
                                            if ($scope.filterUsers[i].race === "Native_American") {
                                                $scope.filterSearch[j] = $scope.filterUsers[i];
                                                j++;
                                                resultIsOkFlag = true;
                                                break;
                                            }
                                        }
                                        if (includeAfr === true) {
                                            if ($scope.filterUsers[i].race === "African") {
                                                $scope.filterSearch[j] = $scope.filterUsers[i];
                                                j++;
                                                resultIsOkFlag = true;
                                                break;
                                            }
                                        }
                                        if (includeSEA === true) {
                                            if ($scope.filterUsers[i].race === "South_East_Asian") {
                                                $scope.filterSearch[j] = $scope.filterUsers[i];
                                                j++;
                                                resultIsOkFlag = true;
                                                break;
                                            }
                                        }
                                        if (includeMid === true) {
                                            if ($scope.filterUsers[i].race === "Middle_Eastern") {
                                                $scope.filterSearch[j] = $scope.filterUsers[i];
                                                j++;
                                                resultIsOkFlag = true;
                                                break;
                                            }
                                        }
                                        if (includeAmb === true) {
                                            if ($scope.filterUsers[i].race === "Mixed") {
                                                $scope.filterSearch[j] = $scope.filterUsers[i];
                                                j++;
                                                resultIsOkFlag = true;
                                                break;
                                            }
                                        }

                                    }
                                    else {
                                        var sex_is_ok = false;
                                        var race_is_ok = false;
                                        if (includeF === true) {
                                            if ($scope.filterUsers[i].gender === "female") {
                                                sex_is_ok = true;
                                            }
                                        }

                                        if (includeM === true) {
                                            if ($scope.filterUsers[i].gender === "male") {
                                                sex_is_ok = true;
                                            }
                                        }

                                        if (sex_is_ok === true) {
                                            if (includeCau === true) {
                                                if ($scope.filterUsers[i].race === "Caucasian") {
                                                    race_is_ok = true;
                                                }
                                            }
                                            if (includeLat === true) {
                                                if ($scope.filterUsers[i].race === "Hispanic") {
                                                    race_is_ok = true;
                                                }
                                            }
                                            if (includeSAs === true) {
                                                if ($scope.filterUsers[i].race === "South_Asian") {
                                                    race_is_ok = true;
                                                }
                                            }
                                            if (includeNat === true) {
                                                if ($scope.filterUsers[i].race === "Native_American") {
                                                    race_is_ok = true;
                                                }
                                            }
                                            if (includeAfr === true) {
                                                if ($scope.filterUsers[i].race === "African") {
                                                    race_is_ok = true;
                                                }
                                            }
                                            if (includeSEA === true) {
                                                if ($scope.filterUsers[i].race === "South_East_Asian") {
                                                    race_is_ok = true;
                                                }
                                            }
                                            if (includeMid === true) {
                                                if ($scope.filterUsers[i].race === "Middle_Eastern") {
                                                    race_is_ok = true;
                                                }
                                            }
                                            if (includeAmb === true) {
                                                if ($scope.filterUsers[i].race === "Mixed") {
                                                    race_is_ok = true;
                                                }
                                            }
                                        }

                                        if (sex_is_ok === true && race_is_ok === true) {
                                            $scope.filterSearch[j] = $scope.filterUsers[i];
                                            j++;
                                            resultIsOkFlag = true;
                                            break;
                                        }
                                    }
                                }
                            }


                        }
                    }

                    }

                }

                if (resultIsOkFlag==true) {
                    console.log($scope.filterUsers[i].name + " "+ $scope.filterUsers[i].lastName);
                    console.log(roles);
                }

                //ricerca di prova in base al nome TENIAMOLA LI'
                /*
                if($scope.filterUsers[i].name==="Branda"){
                    arr[j]=$scope.filterUsers[i];
                    $scope.filterSearch[j]=$scope.filterUsers[i];
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
