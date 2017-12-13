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
    //users-manage
    .state('manager', {
        url: '/manager',
        views : {
            'slider':{template : sliderBar},
            'content':{
            	templateProvider : ($q) => {
            		return $q((resolve) => {
            			require.ensure([],(require) => resolve(require('../manager/userAdmin/user-admin.controller').default.template),'user-admin')
            		})
            	},
				controller : 'managerNewUserController',
	           	resolve : {
	           		loadLoanController : ($q, $ocLazyLoad) => {
	           			return $q((resolve) => {
	           				require.ensure([],(require) => {
	           					let module = require('../manager/userAdmin/user-admin.controller').default.module;
	           					$ocLazyLoad.load({name : module.name});
	           					resolve(module.controller)
	           				})
	           			})
	           		}
	           	}
	        }
        }
    })
    .state('manager.user', {
        url: '/user',
        views : {
            'slider':{template : sliderBar},
            'content@':{
            	templateProvider : ($q) => {
            		return $q((resolve) => {
            			require.ensure([],(require) => resolve(require('../manager/userAdmin/user-admin.controller').default.template),'user-admin')
            		})
            	},
				controller : 'managerNewUserController',
	           	resolve : {
	           		loadLoanController : ($q, $ocLazyLoad) => {
	           			return $q((resolve) => {
	           				require.ensure([],(require) => {
	           					let module = require('../manager/userAdmin/user-admin.controller').default.module;
	           					$ocLazyLoad.load({name : module.name});
	           					resolve(module.controller)
	           				})
	           			})
	           		}
	           	}
	        }
        }
    })
    .state('manager.role', {
        url: '/role',
        views : {
            'slider':{template : sliderBar},
            'content@':{
            	templateProvider : ($q) => {
            		return $q((resolve) => {
            			require.ensure([],(require) => resolve(require('../manager/roleAdmin/role-admin.controller').default.template),'role-admin')
            		})
            	},
				controller : 'roleAdminController',
	           	resolve : {
	           		loadLoanController : ($q, $ocLazyLoad) => {
	           			return $q((resolve) => {
	           				require.ensure([],(require) => {
	           					let module = require('../manager/roleAdmin/role-admin.controller').default.module;
	           					$ocLazyLoad.load({name : module.name});
	           					resolve(module.controller)
	           				})
	           			})
	           		}
	           	}
	        }
        }
    })
    .state('manager.newUser', {
        url: '/newUser',
        views : {
            'slider':{template : sliderBar},
            'content@':{
            	templateProvider : ($q) => {
            		return $q((resolve) => {
            			require.ensure([],(require) => resolve(require('../manager/newUser/new-user.controller').default.template),'new-user')
            		})
            	},
				controller : 'newUserController',
	           	resolve : {
	           		loadLoanController : ($q, $ocLazyLoad) => {
	           			return $q((resolve) => {
	           				require.ensure([],(require) => {
	           					let module = require('../manager/newUser/new-user.controller').default.module;
	           					$ocLazyLoad.load({name : module.name});
	           					resolve(module.controller);
	           				})
	           			})
	           		}
	           	}
	        }
        }
    })
    .state('manager.newRole', {
        url: '/newRole/:object',
//      params : {'no' : null, "id" : null, "groupId" : null},
        views : {
            'slider':{template : sliderBar},
            'content@':{
            	templateProvider : ($q) => {
            		return $q((resolve) => {
            			require.ensure([],(require) => resolve(require('../manager/newRole/new-role.controller').default.template),'new-role')
            		})
            	},
				controller : 'newRoleCtroller',
	           	resolve : {
	           		loadLoanController : ($q, $ocLazyLoad) => {
	           			return $q((resolve) => {
	           				require.ensure([],(require) => {
	           					let module = require('../manager/newRole/new-role.controller').default.module;
	           					$ocLazyLoad.load({name : module.name});
	           					resolve(module.controller);
	           				})
	           			})
	           		}
	           	}
	        }
        }
    })
    .state('manager.editUser', {
        url: '/editUser/:id',
        views : {
            'slider':{template : sliderBar},
            'content@':{
            	templateProvider : ($q) => {
            		return $q((resolve) => {
            			require.ensure([],(require) => resolve(require('../manager/editUser/edit-user.controller').default.template),'edit-user')
            		})
            	},
				controller : 'editUserController',
	           	resolve : {
	           		loadLoanController : ($q, $ocLazyLoad) => {
	           			return $q((resolve) => {
	           				require.ensure([],(require) => {
	           					let module = require('../manager/editUser/edit-user.controller').default.module;
	           					$ocLazyLoad.load({name : module.name});
	           					resolve(module.controller)
	           				})
	           			})
	           		}
	           	}
	        }
        }
    })
//  financial-info
    .state('manager.editPwd', {
        url: '/editPwd/:object',
        views : {
            'slider':{template : sliderBar},
            'content@':{
            	templateProvider : ($q) => {
            		return $q((resolve) => {
            			require.ensure([],(require) => resolve(require('./handler/handler.controller').default.template),'handler')
            		})
            	},
				controller : 'handleHeadCtroller',
	           	resolve : {
	           		loadLoanController : ($q, $ocLazyLoad) => {
	           			return $q((resolve) => {
	           				require.ensure([],(require) => {
	           					let module = require('./handler/handler.controller').default.module;
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
	.module('main.router',[require("angular-ui-router")])
	.config(['$stateProvider','$urlRouterProvider', '$locationProvider',config]);