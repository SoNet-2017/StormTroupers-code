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

        $scope.goToMyTroupers=function (userID) {
            $location.path("/friendsPageView");
            localStorage.otherUserID = userID;
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





        $scope.launchSearch = function () {
            //resetta il filtersearch
            $scope.filterSearch={};

            var resultIsOkFlag=false;

                //checca che cappero hai messo nei filtri
            /*
            var checkKeyword=false;
            //step1 checcka la keyword in nome e cognome
            if (document.getElementsByName("searchKeyword").value!=="") { //checca solo se hei scritto qualcosa nel campo
                checkKeyword=true;
                console.log="checkKeyword=true";
            }
            else {
                console.log="checkKeyword=false";
            }
            */


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

                //CASO IN CUI L'UTENTE FACCIA IL PIRLA E NON SEGNI NIENTE, CI PENSA IL CODICE A INCLUDERE TUTTI E DUE


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

                if ($scope.filterUsers[i].$id === $scope.profile.$id) {
                    console.log("SELF SKIPPED");
                    i++;
                    if (i>=length) {break;}
                }


                /*
                if (checkKeyword===true) {
                    var wtc = document.getElementsByName("searchKeyword").value;
                    var pos1 =  $scope.filterUsers[i].name.search(wtc);
                    var pos2 =  $scope.filterUsers[i].lastName.search(wtc);
                    if(pos1!==-1 || pos2!==-1) {
                        $scope.filterSearch[j]=$scope.filterUsers[i];
                        j++;
                    }
                }
                */

                if (filterByRole===true) {

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
