'use strict';

angular.module('myApp.editorView', ['ngRoute'])

    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/editorView', {
            templateUrl: 'editorView/editorView.html',
            controller: 'editorViewCtrl',
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

    .controller('editorViewCtrl', ['$scope', '$location', 'Auth', '$firebaseObject', 'UiService', 'Users', 'CurrentDateService', 'ReminderService', 'UsersChatService', 'currentAuth', '$firebaseAuth', '$firebaseArray', function ($scope, $location, Auth, $firebaseObject, UiService, Users, CurrentDateService, ReminderService, UsersChatService, currentAuth, $firebaseAuth, $firebaseArray) {
        $scope.dati = {};
        $scope.auth = Auth;

        $scope.dati.reminders = ReminderService.getReminders();
        $scope.dati.currentDate = CurrentDateService.getCurrentDate();

        $scope.countries = countries_list;


        $scope.showLogoItem=function() {
            UiService.showLogoItem();
        };

        $scope.launchSearchInSearchPage=function(){
            UiService.launchSearchInSearchPage();
        };

        /*$scope.showSearchItem = function () {
            var x = document.getElementById("typeSearchContentHome");
            if (x.className.indexOf("w3-show") == -1)
                x.className += " w3-show";
            else
                x.className = x.className.replace(" w3-show", "");
        };*/

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

        $scope.goToPublicProjectPage = function (projectID) {
            $location.path("/publicProjectPageView");
            console.log("progetto che sto passando: " + projectID);
            localStorage.PID = projectID;
        };

        $scope.goToFriendsPage = function (otherUserID) {
            $location.path("/friendsPageView");
            localStorage.otherUserID = otherUserID;
        };

        $scope.goToMyPublicProfile = function (UID) {
            $location.path("/publicProfilePageView");
            $route.reload();
            localStorage.otherUserID = UID;
        };

        $scope.goToPublicProfile = function (userID) {
            $location.path("/publicProfilePageView");
            //console.log("utente che sto passando: "+userID);
            localStorage.otherUserID = userID;
        };

        var UID = localStorage.UID;
        var database = firebase.database();

        var otherUserID = localStorage.otherUserID;

        $scope.profile = $firebaseObject(database.ref('users/' + UID));
        $scope.profile.$loaded().then(function () {
            var role = Object.values($scope.profile.roles);
            for (var i = 0; i < role.length; i++) {
                document.getElementById("userRolesHome").innerHTML += role[i];
                if (i < role.length - 1) {
                    document.getElementById("userRolesHome").innerHTML += ", ";
                }
            }
            if ($scope.profile.friends.indexOf(otherUserID) < 0) {
                $scope.alreadyFriend = false;
            } else {
                $scope.alreadyFriend = true;
            }
        }).catch(function (error) {
            $scope.error = error;
            //console.log("errore: "+error);
        });

        var PID = localStorage.PID;
        $scope.projTroupers={};

        $scope.prj = $firebaseObject(database.ref('projects/' + PID));
        $scope.prj.$loaded().then(function () {
            console.log("titolo progetto quiiiZ: " + $scope.prj.title);
            console.log("$scope.prj.troupers: "+$scope.prj.troupers);


        }).catch(function (error) {
            console.log("sono in errore project load");
            $scope.error=error;
        });


        var templateObj=$firebaseObject(database.ref('template'));
        templateObj.$loaded().then(function () {
            $scope.template=templateObj;
            localStorage.screenplay=$scope.template.screenplay;
            localStorage.storyboard=$scope.template.storyboard;
            localStorage.script=$scope.template.script;
            localStorage.shotList=$scope.template.shotList;
            localStorage.callSheet=$scope.template.callSheet;
            localStorage.objectList=$scope.template.objectsList;
        });

        var templateStyle;

        $scope.setTemplate=function (number) {
            templateStyle=number;
            switch(templateStyle){
                case 0:
                    if($scope.prj.screenplay!==undefined){
                        $scope.tinymceModel=$scope.prj.screenplay;
                    }else{
                        $scope.tinymceModel=localStorage.screenplay;
                    }
                    break;
                case 1:
                    if($scope.prj.storyboard!==undefined){
                        $scope.tinymceModel=$scope.prj.storyboard;
                    }else{
                        $scope.tinymceModel=localStorage.storyboard;
                    }
                    break;
                case 2:
                    if($scope.prj.script!==undefined){
                        $scope.tinymceModel=$scope.prj.script;
                    }else{
                        $scope.tinymceModel=localStorage.script;
                    }
                    break;
                case 3:
                    if($scope.prj.callSheet!==undefined){
                        $scope.tinymceModel=$scope.prj.callSheet;
                    }else{
                        $scope.tinymceModel=localStorage.callSheet;
                    }
                    break;
                case 4:
                    if($scope.prj.shotList!==undefined){
                        $scope.tinymceModel=$scope.prj.shotList;
                    }else{
                        $scope.tinymceModel=localStorage.shotList;
                    }
                    break;
                case 5:
                    if($scope.prj.objectList!==undefined){
                        $scope.tinymceModel=$scope.prj.objectList;
                    }else{
                        $scope.tinymceModel=localStorage.objectList;
                    }
                    break;
            }
            document.getElementById("templateSelection").style.display="none";
            document.getElementById("campoDiTesto").style.display="block";
        };

        $scope.saveDocument=function () {
            localStorage.content=$scope.tinymceModel;
            console.log(localStorage.content);
            switch(templateStyle){
                case 0:
                    database.ref('projects/'+PID).update({
                        screenplay: localStorage.content
                    }).then(function () {
                        var obj = $firebaseObject(database.ref('projects/'+PID));
                        obj.$loaded().then(function () {
                            $scope.prj=obj;
                            console.log("Screenplay su database:"+$scope.prj.screenplay);
                            //localStorage.attTroupers=JSON.stringify(obj.troupers);
                            $scope.goToMyProjects();
                        }).catch(function (error) {
                            $scope.error = error;
                        })

                    }).catch(function (error) {
                        $scope.error = error;
                    });
                    break;
                case 1:
                    database.ref('projects/'+PID).update({
                        storyboard: $scope.tinymceModel
                    }).then(function () {
                        var obj = $firebaseObject(database.ref('projects/'+PID));
                        obj.$loaded().then(function () {
                            $scope.prj=obj;
                            console.log("Storyboard: "+$scope.prj.storyboard);
                            //localStorage.attTroupers=JSON.stringify(obj.troupers);
                            $scope.goToMyProjects();
                        }).catch(function (error) {
                            $scope.error = error;
                        })

                    }).catch(function (error) {
                        $scope.error = error;
                    });
                    break;
                case 2:
                    database.ref('projects/'+PID).update({
                        script: $scope.tinymceModel
                    }).then(function () {
                        var obj = $firebaseObject(database.ref('projects/'+PID));
                        obj.$loaded().then(function () {
                            $scope.prj=obj;
                            console.log("Script: "+$scope.prj.script);
                            //localStorage.attTroupers=JSON.stringify(obj.troupers);
                            $scope.goToMyProjects();
                        }).catch(function (error) {
                            $scope.error = error;
                        })

                    }).catch(function (error) {
                        $scope.error = error;
                    });
                    break;
                case 3:
                    database.ref('projects/'+PID).update({
                        callSheet: $scope.tinymceModel
                    }).then(function () {
                        var obj = $firebaseObject(database.ref('projects/'+PID));
                        obj.$loaded().then(function () {
                            $scope.prj=obj;
                            console.log("Call sheet: "+$scope.prj.callSheet);
                            //localStorage.attTroupers=JSON.stringify(obj.troupers);
                            $scope.goToMyProjects();
                        }).catch(function (error) {
                            $scope.error = error;
                        })

                    }).catch(function (error) {
                        $scope.error = error;
                    });
                    break;
                case 4:
                    database.ref('projects/'+PID).update({
                        shotList: $scope.tinymceModel
                    }).then(function () {
                        var obj = $firebaseObject(database.ref('projects/'+PID));
                        obj.$loaded().then(function () {
                            $scope.prj=obj;
                            console.log("Shot list: "+$scope.prj.shotList);
                            //localStorage.attTroupers=JSON.stringify(obj.troupers);
                            $scope.goToMyProjects();
                        }).catch(function (error) {
                            $scope.error = error;
                        })

                    }).catch(function (error) {
                        $scope.error = error;
                    });
                    break;
                case 5:
                    database.ref('projects/'+PID).update({
                        objectList: $scope.tinymceModel
                    }).then(function () {
                        var obj = $firebaseObject(database.ref('projects/'+PID));
                        obj.$loaded().then(function () {
                            $scope.prj=obj;
                            console.log("Object List: "+$scope.prj.objectList);
                            //localStorage.attTroupers=JSON.stringify(obj.troupers);
                            $scope.goToMyProjects();
                        }).catch(function (error) {
                            $scope.error = error;
                        })

                    }).catch(function (error) {
                        $scope.error = error;
                    });
                    break;
            }
        };

        $scope.cancelOperation=function () {
            $scope.goToMyProjects();
        };

        /*$scope.getContent = function() {
            console.log('Editor content:', $scope.tinymceModel);
            localStorage.content=$scope.tinymceModel;
            database.ref('projects/' + PID).update({
                screenplay: $scope.tinymceModel
            }).then(function () {
                console.log("salvate le modifiche al project in DB; PID: " + PID);
                var obj = $firebaseObject(database.ref('projects/' + PID));
                obj.$loaded().then(function () {
                    $scope.project = obj;
                    localStorage.attPID = PID;
                    localStorage.attOwner = UID;
                    localStorage.attTitle = obj.title;
                    localStorage.attType = obj.type;
                    localStorage.attGenre = obj.genre;
                    localStorage.attDescription = obj.description;
                    localStorage.attDateOfCreation = obj.dateOfCreation;
                    localStorage.imgURL=obj.img_url;
                    localStorage.content=obj.screenplay;

                    //localStorage.attTroupers=JSON.stringify(obj.troupers);
                    $scope.goToMyProjects();
                }).catch(function (error) {
                    $scope.error = error;
                })

            }).catch(function (error) {
                $scope.error = error;
            });
        };*/

        /*$scope.getContent=function () {
            localStorage.content=$scope.tinymceModel;
            database.ref('project/'+PID).update({
                callSheet: $scope.tinymceModel
            }).then(function () {
                var obj = $firebaseObject(database.ref('project/'+PID));
                obj.$loaded().then(function () {

                    //localStorage.attTroupers=JSON.stringify(obj.troupers);
                    $scope.goToMyProjects();
                }).catch(function (error) {
                    $scope.error = error;
                })

            }).catch(function (error) {
                $scope.error = error;
            });
        };

        $scope.setContent = function() {
            //$scope.tinymceModel = 'Time: ' + (new Date());
            $scope.tinymceModel = localStorage.content;
        };*/





            $scope.tinymceOptions = {
                plugins: [
                    "advlist autolink autosave link image lists charmap print preview hr anchor pagebreak",
                    "searchreplace wordcount visualblocks visualchars code fullscreen insertdatetime media nonbreaking",
                    "table contextmenu directionality emoticons template textcolor paste fullpage textcolor colorpicker textpattern"
                ],

                toolbar1: "newdocument fullpage | bold italic underline strikethrough | alignleft aligncenter alignright alignjustify | styleselect formatselect fontselect fontsizeselect",
                toolbar2: "cut copy paste | searchreplace | bullist numlist | outdent indent blockquote | undo redo | link unlink anchor image media code | insertdatetime preview | forecolor backcolor",
                toolbar3: "table | hr removeformat | subscript superscript | charmap emoticons | print fullscreen | ltr rtl | visualchars visualblocks nonbreaking template pagebreak restoredraft",
                content_css: [
                    '//fonts.googleapis.com/css?family=Lato:300,300i,400,400i',
                    '//www.tinymce.com/css/codepen.min.css'],

                menubar: false,
                toolbar_items_size: 'small',

                style_formats: [
                    {
                    title: 'Bold text',
                    inline: 'b'
                }, {
                    title: 'Red text',
                    inline: 'span',
                    styles: {
                        color: '#ff0000'
                    }
                }, {
                    title: 'Red header',
                    block: 'h1',
                    styles: {
                        color: '#ff0000'
                    }
                }, {
                    title: 'Example 1',
                    inline: 'span',
                    classes: 'example1'
                }, {
                    title: 'Example 2',
                    inline: 'span',
                    classes: 'example2'
                }, {
                    title: 'Table styles'
                }, {
                    title: 'Table row 1',
                    selector: 'tr',
                    classes: 'tablerow1'
                }],

                templates: [{
                    title: 'Test template 1',
                    content: 'Test 1'
                }, {
                    title: 'Test template 2',
                    content: 'Test 2'
                }]
            };







        $scope.logout = function () {
            Users.registerLogout(currentAuth.uid);
            $firebaseAuth().$signOut();
            $firebaseAuth().$onAuthStateChanged(function (firebaseUser) {
                if (firebaseUser) {
                    console.log("User is yet signed in as:", firebaseUser.uid);
                } else {
                    $location.path("/loginView");
                }
            });


        };

    }]);