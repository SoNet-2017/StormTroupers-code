'use strict';

angular.module('myApp.currentDateService', [])

    .factory('CurrentDateService', function usersChatService() {
        return {

            getCurrentDate: function(){
                var today = new Date();
                var day = today.getUTCDate();
                var month = today.getUTCMonth()+1; //January is 0!
                var year = today.getUTCFullYear();

                if(day<10) {
                    day='0'+day;
                }

                if(month<10) {
                    month='0'+month;
                }

                var currentDate = year.toString()+'-'+month.toString()+'-'+day.toString();

                return currentDate;
            }
        };
    });