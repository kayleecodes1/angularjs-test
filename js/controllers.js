'use strict';

/* Controllers */

angular.module('harvardApp.controllers', []).
	controller('CtrlCourseListing', function($scope, $http) {

		// The courses.
		$scope.coursesLoaded = false;
		$scope.courses = [];

		// Variables to track pagination.
		$scope.currentPage = 0;
	    $scope.pageSize = 10;
		$scope.pageCount = Math.ceil($scope.courses.length / $scope.pageSize) + 1;

	    // Aggregate all unique course properties.
	    $scope.allSubjects = [];
	    $scope.allTerms = [];
	    $scope.allInstructors = [];
	    $scope.allBuildings = [];

	    // Store sort method.
	    $scope.allSortMethods = ['Alphabetical', 'Subject / Course Number'];
	    $scope.sortMethod = $scope.allSortMethods[0];

	    // Track filter values.
	    $scope.filter = {
	    	searchString: '',
	    	subject: [],
	    	term: [],
	    	day: [],
	    	startTime: '',
	    	endTime: '',
	    	instructor: [],
	    	building: []
	    };

	    // Possible days.
	    $scope.getPossibleDays = function() {
	    	return ['Su', 'M', 'Tu', 'W', 'Th', 'F', 'Sa'];
	    }

	    // Possible times.
	    $scope.getPossibleTimes = function() {
	    	var possibleTimes = [''];
	    	for(var i = 0; i < 23; i++) {
	    		possibleTimes.push((i<10?'0'+i:i)+':00:00');
	    		possibleTimes.push((i<10?'0'+i:i)+':30:00');
	    	}
	    	possibleTimes.push('24:00:00');
	    	return possibleTimes;
	    }

	    // Update the start and end times so that they're compatible.
	    $scope.startTimeChange = function() {
	    	if($scope.filter.endTime != '' &&
	    		$scope.filter.endTime < $scope.filter.startTime)
	    	{
	    		$scope.filter.endTime = $scope.filter.startTime;
	    	}
	    }
	    $scope.endTimeChange = function() {
	    	if($scope.filter.startTime != '' &&
	    		$scope.filter.startTime > $scope.filter.endTime)
	    	{
	    		$scope.filter.startTime = $scope.filter.endTime;
	    	}
	    }

	    // Get the courses from the JSON file.
		$http.get('/data/Courses.json')
			.then(function(response) {

				// Convert the courses JSON object to an array of objects.
				var courses_array = [];
				for(var id in response.data) {
					var course = response.data[id];
					course.id = id;
					courses_array.push(course);

					// Aggregate unique subjects.
					if($scope.allSubjects.indexOf(course.course_area) == -1) {
						$scope.allSubjects.push(course.course_area);
					}
					// Aggregate unique terms.
					for(var term in course.terms) {
						if($scope.allTerms.indexOf(term) == -1) {
							$scope.allTerms.push(term);
						}
						// Aggregate unique instructors.
						for(var instructorIndex in course.terms[term].instructors) {
							var instructor = course.terms[term].instructors[instructorIndex];
							if($scope.allInstructors.indexOf(instructor) == -1) {
								$scope.allInstructors.push(instructor);
							}
						}
						// Aggregate unique buildings.
						for(var meet_timeID in course.terms[term].meet_times) {
							var meet_time = course.terms[term].meet_times[meet_timeID];
							if($scope.allBuildings.indexOf(meet_time.building) == -1) {
								$scope.allBuildings.push(meet_time.building);
							}
						}
					}
				}
				$scope.courses = courses_array;
				$scope.coursesLoaded = true;
			});
	});