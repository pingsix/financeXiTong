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
    .state('configuration', {
        url: '/configuration',
        views : {
            'slider':{template : sliderBar},
            'content':{
            	templateProvider : ($q) => {
            		return $q((resolve) => {
            			require.ensure([],(require) => resolve(require('./organicList/organicList.controller').default.template),'production-organicList')
            		})
            	},
				controller : 'organicListController',
	           	resolve : {
	           		loadLoanController : ($q, $ocLazyLoad) => {
	           			return $q((resolve) => {
	           				require.ensure([],(require) => {
	           					let module = require('./organicList/organicList.controller').default.module;
	           					$ocLazyLoad.load({name : module.name});
	           					resolve(module.controller)
	           				})
	           			})
	           		}
	           	}
	        }
        }
    })
    .state('configuration.production', {
        url: '/production',
        views : {
            'slider':{template : sliderBar},
            'content@':{
            	templateProvider : ($q) => {
            		return $q((resolve) => {
            			require.ensure([],(require) => resolve(require('./organicList/organicList.controller').default.template),'production-organicList')
            		})
            	},
				controller : 'organicListController',
	           	resolve : {
	           		loadLoanController : ($q, $ocLazyLoad) => {
	           			return $q((resolve) => {
	           				require.ensure([],(require) => {
	           					let module = require('./organicList/organicList.controller').default.module;
	           					$ocLazyLoad.load({name : module.name});
	           					resolve(module.controller)
	           				})
	           			})
	           		}
	           	}
	        }
        }
    })
    .state('configuration.newOrganic', {
        url: '/newOrganic/:object',
        views : {
            'slider':{template : sliderBar},
            'content@':{
            	templateProvider : ($q) => {
            		return $q((resolve) => {
            			require.ensure([],(require) => resolve(require('./newOrganic/newOrganic.controller').default.template),'production-newOrganic')
            		})
            	},
				controller : 'newOrganicController',
	           	resolve : {
	           		loadLoanController : ($q, $ocLazyLoad) => {
	           			return $q((resolve) => {
	           				require.ensure([],(require) => {
	           					let module = require('./newOrganic/newOrganic.controller').default.module;
	           					$ocLazyLoad.load({name : module.name});
	           					resolve(module.controller)
	           				})
	           			})
	           		}
	           	}
	        }
        }
    })
    .state('configuration.pair', {
        url: '/pair',
        views : {
            'slider':{template : sliderBar},
            'content@':{
            	templateProvider : ($q) => {
            		return $q((resolve) => {
            			require.ensure([],(require) => resolve(require('./pair/pair.controller').default.template),'production-pair')
            		})
            	},
				controller : 'pairController',
	           	resolve : {
	           		loadLoanController : ($q, $ocLazyLoad) => {
	           			return $q((resolve) => {
	           				require.ensure([],(require) => {
	           					let module = require('./pair/pair.controller').default.module;
	           					$ocLazyLoad.load({name : module.name});
	           					resolve(module.controller)
	           				})
	           			})
	           		}
	           	}
	        }
        }
    })
    // .state('configuration.pairOrg', {
    //     url: '/pairOrg/:object',
    //     views : {
    //         'slider':{template : sliderBar},
    //         'content@':{
    //         	templateProvider : ($q) => {
    //         		return $q((resolve) => {
    //         			require.ensure([],(require) => resolve(require('./pair/pairOrg/pairOrg.controller').default.template),'production-pairOrg')
    //         		})
    //         	},
				// controller : 'pairOrgController',
	   //         	resolve : {
	   //         		loadLoanController : ($q, $ocLazyLoad) => {
	   //         			return $q((resolve) => {
	   //         				require.ensure([],(require) => {
	   //         					let module = require('./pair/pairOrg/pairOrg.controller').default.module;
	   //         					$ocLazyLoad.load({name : module.name});
	   //         					resolve(module.controller)
	   //         				})
	   //         			})
	   //         		}
	   //         	}
	   //      }
    //     }
    // })
}

/**
 * 导出路由模块
 */
export default angular
	.module('production-router',[require("angular-ui-router")])
	.config(['$stateProvider','$urlRouterProvider', '$locationProvider',config]);
