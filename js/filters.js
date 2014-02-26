'use strict';


/*$scope.filter = {
	searchString: '',
	subject: [],
	term: [],
	day: [],
	startTime: '',
	endTime: '',
	instructor: []
};*/


/* Filters */

angular.module('harvardApp.filters', []).

	// Filters the courses based on various filter settings.
	filter('courseFilter', function () {
		return function (courses, $scope) {
			var newCourses = [];

			for (var i = 0; i < courses.length; i++) {

				// Check if the course matches the keyword filter.
				var keywordPass = true;
				if($scope.filter.searchString != '') {
					keywordPass = false;
					// Check if the course name, title, or description match the keyword filter.
					keywordPass = keywordPass || courses[i].course_name.match(new RegExp('(' + $scope.filter.searchString + ')', 'ig')) !== null;
					keywordPass = keywordPass || courses[i].course_title.match(new RegExp('(' + $scope.filter.searchString + ')', 'ig')) !== null;
					keywordPass = keywordPass || courses[i].course_desc.match(new RegExp('(' + $scope.filter.searchString + ')', 'ig')) !== null;
				}

				// Check if the course matches the subject filter.
				var subjectPass = false;
				if($scope.filter.subject.length == 0 || $scope.filter.subject.indexOf(courses[i].course_area) != -1) {
					subjectPass = true;
				}

				// Check if the course matches the term filter.
				var termPass = false;
				if($scope.filter.term.length == 0) {
					termPass = true;
				} else {
					for(var term in courses[i].terms) {
						if($scope.filter.term.indexOf(term) != -1) {
							termPass = true;
						}
					}
				}

				// Check if the course matches the day filter.
				var dayPass = false;
				if($scope.filter.day.length == 0) {
					dayPass = true;
				} else {
					for(var termIndex in courses[i].terms) {
						var term = courses[i].terms[termIndex];
						for(var meet_timeIndex in term.meet_times) {
							var meet_time = term.meet_times[meet_timeIndex];
							if($scope.filter.day.indexOf(meet_time.weekDay) != -1) {
								dayPass = true;
							}
						}
					}
				}

				// Check if the course matches the time filters.
				var timePass = true;
				var hasStartTimes = false;
				var hasEndTimes = false;
				if($scope.filter.startTime != '' || $scope.filter.endTime != '') {
					for(var termIndex in courses[i].terms) {
						var term = courses[i].terms[termIndex];
						for(var meet_timeIndex in term.meet_times) {
							var meet_time = term.meet_times[meet_timeIndex];
							// Note if the meet time has times associated.
							if(meet_time.startTime) {
								hasStartTimes = true;
								// Make sure the start time is in range.
								if($scope.filter.startTime != '' && $scope.filter.startTime > meet_time.startTime) {
									timePass = false;
								}
							}
							if(meet_time.endTime) {
								hasEndTimes = true;
								// Make sure the end time is in range.
								if($scope.filter.endTime != '' && $scope.filter.endTime < meet_time.endTime) {
									timePass = false;
								}
							}
						}
					}
				}
				// Don't need to check for start or end times if the user isn't
				// filtering for them.
				if($scope.filter.startTime == '') {
					hasStartTimes = true;
				}
				if($scope.filter.endTime == '') {
					hasEndTimes = true;
				}
				// Don't let it pass if it doesn't have times.
				if(!hasStartTimes && !hasEndTimes) {
					timePass = false;
				}

				// Check if the course matches the instructor filter.
				var instructorPass = false;
				if($scope.filter.instructor.length == 0) {
					instructorPass = true;
				} else {
					for(var termIndex in courses[i].terms) {
						var term = courses[i].terms[termIndex];
						for(var instructorIndex in term.instructors) {
							var instructor = term.instructors[instructorIndex];
							if($scope.filter.instructor.indexOf(instructor) != -1) {
								instructorPass = true;
							}
						}
					}
				}

				// Check if the course matches the building filter.
				var buildingPass = false;
				if($scope.filter.building.length == 0) {
					buildingPass = true;
				} else {
					for(var termIndex in courses[i].terms) {
						var term = courses[i].terms[termIndex];
						for(var meet_timeIndex in term.meet_times) {
							var meet_time = term.meet_times[meet_timeIndex];
							if($scope.filter.building.indexOf(meet_time.building) != -1) {
								buildingPass = true;
							}
						}
					}
				}

				// If the course met all of the criteria, keep it.
				if(subjectPass && termPass && dayPass && timePass && instructorPass && buildingPass && keywordPass) {
					newCourses.push(courses[i]);
				}
			};

			// Update pagination variables.
			$scope.pageCount = Math.floor(newCourses.length / $scope.pageSize) + 1;
			if($scope.currentPage * $scope.pageSize >= newCourses.length) {
				$scope.currentPage = Math.floor(newCourses.length / $scope.pageSize);
			}

			return newCourses;//return newCourses;
		}
  	}).

  	// A filter to complement the built in limitTo filter and to enable
  	// pagination.
  	filter('startFrom', function () {
  		return function(input, start) {
	        start = +start; //parse to int
	        return input.slice(start);
	    }
	}).

  	// Custom course sorting filter.
	filter('courseSort', function() {
		return function(courses, $scope) {
			if($scope.sortMethod == 'Subject / Course Number') {
				return courses.sort(function(a,b) {
					return (a.course_name < b.course_name ? -1 : 1);
				});
			} else {
				return courses.sort(function(a,b) {
					return (a.course_title < b.course_title ? -1 : 1);
				});
			}
		}
	}).

	// Custom string sorting filter.
	filter('stringSort', function() {
		return function(strings) {
			return strings.sort(function(a,b) {
				return (a < b ? -1 : 1);
			});
		}
	}).

	// Custom term sorting filter.
	filter('termSort', function() {
		return function(terms) {
			// Sort and return the strings.
			return terms.sort(function(a,b) {
				var seasons = ['spring','summer','fall','winter'];
				a = a.split('_');
				b = b.split('_');
				if(a[0] < b[0]) {
					return -1;
				} else if(a[0] == b[0] && seasons.indexOf(a[1]) < seasons.indexOf(b[1])) {
					return -1;
				} else {
					return 1;
				}
			});
		}
	}).

	// Term formatting filter.
	filter('termFormat', function() {
		return function(term) {
			term = term.split('_');
			return term[1].charAt(0).toUpperCase()+term[1].slice(1)+' '+term[0];
		}
	}).

  	// Custom course sorting filter.
	filter('highlightKeyword', function() {
		return function(string, $scope) {
			if($scope.filter.searchString != '') {
				return string.replace(new RegExp('(' + $scope.filter.searchString + ')', 'ig'), '<span class="keywordHighlight">$1</span>');
			} else {
				return string;
			}
		}
	});