/**
 * Created by S234591 on 19/05/2017.
 */
'use strict';

angular.module('myApp.agendaService', [])
    /**eventoService dovrebbe essere eventos, ricordarsene */

    .factory('Agenda', function($firebaseArray) {
        var agendaService = {
            getData: function () {
                var ref = firebase.database().ref().child("agendas");
                return $firebaseArray(ref);
            },
            getTroupers:function () {
                var trRef = firebase.database().ref().child("users");
                return $firebaseArray(trRef);
            },
            deleteAgenda : function (agendaID) {
                var ref = firebase.database().ref().child("agendas").child(agendaID);
                ref.remove();
            }
        };
        return agendaService;
    });
