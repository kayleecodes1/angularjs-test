'use strict';

/* Directives */

angular.module('harvardApp.directives', []).
	directive('pagenav', function() {
		return {
			restrict: 'E',
			scope: false,
			templateUrl: '/partials/pageNav.html',
			controller: function ($scope, $http, $attrs) {
				//
			}
		};
	});