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
    .state('financial', {
        url: '/financial',
        views : {
            'slider':{template : sliderBar},
            'content':{
            	templateProvider : ($q) => {
            		return $q((resolve) => {
            			require.ensure([],(require) => resolve(require('./loanMenInfo/loanMenInfo.controller').default.template),'finance-loan')
            		})
            	},
				controller : 'loanMenInfoController',
	           	resolve : {
	           		loadLoanController : ($q, $ocLazyLoad) => {
	           			return $q((resolve) => {
	           				require.ensure([],(require) => {
	           					let module = require('./loanMenInfo/loanMenInfo.controller').default.module;
	           					$ocLazyLoad.load({name : module.name});
	           					resolve(module.controller)
	           				})
	           			})
	           		}
	           	}
	        }
        }
    })
    .state('financial.loan', {
        url: '/loan',
        views : {
            'slider':{template : sliderBar},
            'content@':{
            	templateProvider : ($q) => {
            		return $q((resolve) => {
            			require.ensure([],(require) => resolve(require('./loanMenInfo/loanMenInfo.controller').default.template),'finance-loan')
            		})
            	},
				controller : 'loanMenInfoController',
	           	resolve : {
	           		loadLoanController : ($q, $ocLazyLoad) => {
	           			return $q((resolve) => {
	           				require.ensure([],(require) => {
	           					let module = require('./loanMenInfo/loanMenInfo.controller').default.module;
	           					$ocLazyLoad.load({name : module.name});
	           					resolve(module.controller)
	           				})
	           			})
	           		}
	           	}
	        }
        }
    })
    .state('financial.collect', {
        url: '/collect',
        views : {
            'slider':{template : sliderBar},
            'content@':{
            	templateProvider : ($q) => {
            		return $q((resolve) => {
            			require.ensure([],(require) => resolve(require('./loanCollectInfo/loanCollectInfo.controller').default.template),'finance-collect')
            		})
            	},
				controller : 'loanCollectInfoController',
	           	resolve : {
	           		loadLoanController : ($q, $ocLazyLoad) => {
	           			return $q((resolve) => {
	           				require.ensure([],(require) => {
	           					let module = require('./loanCollectInfo/loanCollectInfo.controller').default.module;
	           					$ocLazyLoad.load({name : module.name});
	           					resolve(module.controller)
	           				})
	           			})
	           		}
	           	}
	        }
        }
    })
    .state('financial.overdue', {
        url: '/overdue',
        views : {
            'slider':{template : sliderBar},
            'content@':{
            	templateProvider : ($q) => {
            		return $q((resolve) => {
            			require.ensure([],(require) => resolve(require('./overdue/overdue.controller').default.template),'finance-overdue')
            		})
            	},
				controller : 'overdueController',
	           	resolve : {
	           		loadLoanController : ($q, $ocLazyLoad) => {
	           			return $q((resolve) => {
	           				require.ensure([],(require) => {
	           					let module = require('./overdue/overdue.controller').default.module;
	           					$ocLazyLoad.load({name : module.name});
	           					resolve(module.controller);
	           				})
	           			})
	           		}
	           	}
	        }
        }
    })
    .state('financial.viewDetail', {
        url: '/viewDetail/:object',
        views : {
            'slider':{template : sliderBar},
            'content@':{
            	templateProvider : ($q) => {
            		return $q((resolve) => {
            			require.ensure([],(require) => resolve(require('./viewDetail/viewDetail.controller').default.template),'finance-viewDetail')
            		})
            	},
				controller : 'viewDetailController',
	           	resolve : {
	           		loadLoanController : ($q, $ocLazyLoad) => {
	           			return $q((resolve) => {
	           				require.ensure([],(require) => {
	           					let module = require('./viewDetail/viewDetail.controller').default.module;
	           					$ocLazyLoad.load({name : module.name});
	           					resolve(module.controller);
	           				})
	           			})
	           		}
	           	}
	        }
        }
    })
    .state('financial.viewRunning', {
        url: '/viewRunning/:object', 
        views : {
            'slider':{template : sliderBar},
            'content@':{
            	templateProvider : ($q) => {
            		return $q((resolve) => {
            			require.ensure([],(require) => resolve(require('./viewRunning/viewRunning.controller').default.template),'financial-viewRunning')
            		})
            	},
				controller : 'viewRunningController',
	           	resolve : {
	           		loadLoanController : ($q, $ocLazyLoad) => {
	           			return $q((resolve) => {
	           				require.ensure([],(require) => {
	           					let module = require('./viewRunning/viewRunning.controller').default.module;
	           					$ocLazyLoad.load({name : module.name});
	           					resolve(module.controller)
	           				})
	           			})
	           		}
	           	}
	        }
        }
    })
    .state('financial.rewarding', {
        url: '/rewarding',
        views : {
            'slider':{template : sliderBar},
            'content@':{
            	templateProvider : ($q) => {
            		return $q((resolve) => {
            			require.ensure([],(require) => resolve(require('./rewarding/rewarding.controller').default.template),'financial-rewarding')
            		})
            	},
				controller : 'rewardingController',
	           	resolve : {
	           		loadLoanController : ($q, $ocLazyLoad) => {
	           			return $q((resolve) => {
	           				require.ensure([],(require) => {
	           					let module = require('./rewarding/rewarding.controller').default.module;
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
	.module('finance-router',[require("angular-ui-router")])
	.config(['$stateProvider','$urlRouterProvider', '$locationProvider',config]);