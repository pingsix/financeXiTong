
export default angular
	.module('login.dire',[])
	.directive('test',['$timeout',function($timeout){
		return {
			restrict: 'AE',
			scope: {},
			template: '<span>Hello BR!</span>',
			controller: ['$scope',function($scope){
				
			}]
		}
	}])
