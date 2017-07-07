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
        }

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
                var actorANDsex=false;
                var actorANDetn=false;

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
            }


            //parte il coso per davvero
            var length=$scope.filterUsers.length;
            var j=0;
            for(var i=0; i<length; i++){ //si scorre tutto l'array

                resultIsOkFlag=false;

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
                        if (includeAnim===true && roles[n]==="Animation") {
                            $scope.filterSearch[j]=$scope.filterUsers[i];
                            j++;
                            resultIsOkFlag=true;
                            break;
                        }
                        if (includeAudio===true && roles[n]==="Audio/Music/Sound") {
                            $scope.filterSearch[j]=$scope.filterUsers[i];
                            j++;
                            resultIsOkFlag=true;
                            break;
                        }
                        if (includeDP===true && roles[n]==="Camera Crew/DP") {
                            $scope.filterSearch[j]=$scope.filterUsers[i];
                            j++;
                            resultIsOkFlag=true;
                            break;
                        }
                        if (includeArt===true && roles[n]==="Crew art/Design/Scenic/Construction") {
                            $scope.filterSearch[j]=$scope.filterUsers[i];
                            j++;
                            resultIsOkFlag=true;
                            break;
                        }
                        if (includeDirect===true && roles[n]==="Director") {
                            $scope.filterSearch[j]=$scope.filterUsers[i];
                            j++;
                            resultIsOkFlag=true;
                            break;
                        }
                        if (includeLight===true && roles[n]==="Lighting/Electric") {
                            $scope.filterSearch[j]=$scope.filterUsers[i];
                            j++;
                            resultIsOkFlag=true;
                            break;
                        }
                        if (includeGraphic===true && roles[n]==="Graphic designer") {
                            $scope.filterSearch[j]=$scope.filterUsers[i];
                            j++;
                            resultIsOkFlag=true;
                            break;
                        }
                        if (includePost===true && roles[n]==="Post Production People") {
                            $scope.filterSearch[j]=$scope.filterUsers[i];
                            j++;
                            resultIsOkFlag=true;
                            break;
                        }
                        if (includeProd===true && roles[n]==="Producers") {
                            $scope.filterSearch[j]=$scope.filterUsers[i];
                            j++;
                            resultIsOkFlag=true;
                            break;
                        }
                        if (includeFX===true && roles[n]==="Special Effects Crew") {
                            $scope.filterSearch[j]=$scope.filterUsers[i];
                            j++;
                            resultIsOkFlag=true;
                            break;
                        }
                        if (includeStyle===true && roles[n]==="Stylist/Vanities") {
                            $scope.filterSearch[j]=$scope.filterUsers[i];
                            j++;
                            resultIsOkFlag=true;
                            break;
                        }
                        if (includeCast===true && roles[n]==="Talent/Casting - People") {
                            $scope.filterSearch[j]=$scope.filterUsers[i];
                            j++;
                            resultIsOkFlag=true;
                            break;
                        }
                        if (includeActor===true && roles[n]==="Talent/Actors") {
                            if (actorANDsex===true) {
                                if (includeF === true) {
                                    if ($scope.filterUsers[i].gender === "female") {
                                        if (actorANDetn===false) {
                                            $scope.filterSearch[j] = $scope.filterUsers[i];
                                            j++;
                                            resultIsOkFlag = true;
                                            break;
                                        }
                                    }
                                }

                                if (includeM === true) {
                                    if ($scope.filterUsers[i].gender === "male") {
                                        if (actorANDetn===false) {
                                            $scope.filterSearch[j] = $scope.filterUsers[i];
                                            j++;
                                            resultIsOkFlag = true;
                                            break;
                                        }
                                    }
                                }
                            }
                            if (actorANDetn===true) {
                                if (includeCau === true) {
                                    if ($scope.filterUsers[i].race === "Caucasian") {
                                            $scope.filterSearch[j] = $scope.filterUsers[i];
                                            j++;
                                            resultIsOkFlag = true;
                                            break;
                                    }
                                }
                                ///ARRIVATI FINO A QUA, CONTINUARE...
                                //CHECCARE BENE STA ROBA DEI RUOLI E DEL SESSO PERCHE' FORSE FUNZIONA MA SOLO PER PURO CASO
                            }

                        }

                    }

                }

                if (resultIsOkFlag==true) {
                    console.log($scope.filterUsers[i].name);
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
