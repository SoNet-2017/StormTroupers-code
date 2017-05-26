'use strict';

//declare the module that will act as parent of all the services/directives used to upload a new file on Firebase
angular.module('myApp.fileUpload', [
    'myApp.fileUpload.fileUploadDirective',
])

.value('version', '0.1');
