/**
 * 
 */
var sliderBar = '<div class="slide fl noprint">'+
			'<div id="slideBar">'+
				'<ul>'+
					'<li ng-repeat = "item in appShell.slideBar" ng-class="{selected:item.selected}">'+
						'<a ui-sref=".{{item.href}}" class="{{item.menuName}}" ng-bind = "item.text"></a>'+
					'</li>'+
				'</ul>'+
			'</div>'+
		'</div>';

var config = ($stateProvider, $urlRouterProvider,$locationProvider) => {
    $stateProvider
    .state('earnings', {
        url: '/earnings',
        views : {
            'slider':{template : sliderBar},
            'content':{
            	templateProvider : ($q) => {
            		return $q((resolve) => {
            			require.ensure([],(require) => resolve(require('./chart/chart.controller').default.template),'earnings-chart')
            		})
            	},
				controller : 'chartController',
	           	resolve : {
	           		loadLoanController : ($q, $ocLazyLoad) => {
	           			return $q((resolve) => {
	           				require.ensure([],(require) => {
	           					let module = require('./chart/chart.controller').default.module;
	           					$ocLazyLoad.load({name : module.name});
	           					resolve(module.controller)
	           				})
	           			})
	           		}
	           	}
	        }
        }
    })
    .state('earnings.chart', {
        url: '/chart',
        views : {
            'slider':{template : sliderBar},
            'content@':{
            	templateProvider : ($q) => {
            		return $q((resolve) => {
            			require.ensure([],(require) => resolve(require('./chart/chart.controller').default.template),'earnings-chart')
            		})
            	},
				controller : 'chartController',
	           	resolve : {
	           		loadLoanController : ($q, $ocLazyLoad) => {
	           			return $q((resolve) => {
	           				require.ensure([],(require) => {
	           					let module = require('./chart/chart.controller').default.module;
	           					$ocLazyLoad.load({name : module.name});
	           					resolve(module.controller)
	           				})
	           			})
	           		}
	           	}
	        }
        }
    })
    .state('earnings.splitting', {
        url: '/splitting',
        views : {
            'slider':{template : sliderBar},
            'content@':{
            	templateProvider : ($q) => {
            		return $q((resolve) => {
            			require.ensure([],(require) => resolve(require('./splitting/splitting.controller').default.template),'earnings-splitting')
            		})
            	},
				controller : 'splittingController',
	           	resolve : {
	           		loadLoanController : ($q, $ocLazyLoad) => {
	           			return $q((resolve) => {
	           				require.ensure([],(require) => {
	           					let module = require('./splitting/splitting.controller').default.module;
	           					$ocLazyLoad.load({name : module.name});
	           					resolve(module.controller)
	           				})
	           			})
	           		}
	           	}
	        }
        }
    })
    
}

/**
 * 导出路由模块
 */
export default angular
	.module('earnings-router',[require("angular-ui-router")])
	.config(['$stateProvider','$urlRouterProvider', '$locationProvider',config]);