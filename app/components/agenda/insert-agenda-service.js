'use strict';

angular.module('myApp.insertAgendaService', [])

    .factory('InsertAgendaService', function insertAgendaService($firebaseArray) {
        var ref = firebase.database().ref().child("agendas");

        return {
            createAgenda: function(title, date, time, address, info, project, troupers){
                var newAgenda = {};
                newAgenda['title'] = title;
                newAgenda['date'] = date;
                newAgenda['time'] = time;
                newAgenda['address'] = address;
                newAgenda['info'] = info;
                newAgenda['project'] = project;
                newAgenda['troupers'] = troupers;
                return newAgenda;
            },

            addAgenda: function(agenda) {
                return $firebaseArray(ref).$add(agenda);
            }
        };
    });
