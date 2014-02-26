'use strict';

// Declare app level module which depends on filters, and services.
angular.module('harvardApp', [
  'ngRoute',
  'ngSanitize',
  'harvardApp.filters',
  'harvardApp.services',
  'harvardApp.directives',
  'harvardApp.controllers',
  'localytics.directives'
]).

// Routing.
config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/courses', {templateUrl: 'partials/courseListing.html', controller: 'CtrlCourseListing'});
  $routeProvider.otherwise({redirectTo: '/courses'});
}]);