'use strict';

angular.module('myApp.uiService', [])

    .factory('UiService', function uiService($location) {
            return {
                showLogoItem: function () {
                    var x = document.getElementById("logoBarContentHome");
                    if (x.className.indexOf("w3-show") == -1)
                        x.className += " w3-show";
                    else
                        x.className = x.className.replace(" w3-show", "");
                },

                launchSearchInSearchPage: function () {
                    $location.path("/searchPageView");
                    localStorage.immediateSearch=true;
                    localStorage.immediateSearchKeyword=document.getElementById("searchItemHomeKeyword").value;
                    /*console.log("Variabili passate.");
                    console.log("immediateSearch = "+localStorage.immediateSearch.toString());
                    console.log("ImmediateSearchKeyword = "+localStorage.immediateSearchKeyword);*/
                }
            }
        });