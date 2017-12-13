define(['angular'],function(ng){
	var m = ng.module('lodingMask',[]);
	var lodingMaskFn = function(){
		return {
			restrict : 'E',
			transclude: true,
	        template: '<div class="wrap">'
	        + '<div ng-show="loading" class="loading">'
	        + '<img alt="" src="../../images/loading.gif" class = "loadingStyle"/>'
	        + '<b></b>'
	        + '</div>'
	        + '</div>',
	        link: function (_, element, attr) {
//	        	var $ = require('../../vendor/jquery-1.8.2.js')
//	        	console.log()
	            _.$watch('loading', function (val) {
	                if (val){
	                    $(element).show();
	                }
	                else{
	                    $(element).hide();
	                }
	            });
	            
	        }
		}
	}
	m.directive('lodingMask',lodingMaskFn)	
})
