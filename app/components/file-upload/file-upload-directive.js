'use strict';

//This module defines a directive that will create a button to upload a file and create the onClick handler
angular.module('myApp.fileUpload.fileUploadDirective', [])
    .directive("fileUpload", FileUploadDirective);

function FileUploadDirective() {
    return {
        restrict: "E",
        transclude: true,
        scope: {
            onChange: "="
        },
        template: '<input type="file" name="file" /><label><ng-transclude></ng-transclude></label>',
        link: function (scope, element, attrs) {
            element.bind("change", function () {
                scope.onChange(element.children()[0].files);
            });
        }
    }
}