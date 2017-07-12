'use strict';

angular.module('myApp.insertAgendaService', [])

    .factory('InsertAgendaService', function insertAgendaService($firebaseArray) {
        var ref = firebase.database().ref().child("agendas");

        return {
            createAgenda: function(title, start, end, address, info, project, troupers){
                var newAgenda = {};
                newAgenda['title'] = title;
                newAgenda['start'] = start;
                newAgenda['end'] = end;
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
