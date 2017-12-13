//全局样式
require('./reset.css');
require('./global.css');
require('./loan.css');

require('../tools/custom_components/globalDirStyle.css');
require('../tools/plugins/jQueryNavHover/css/xq_navbar.css');

//用户管理
require('../manager/newUser.css');
require('../manager/userAdmin.css');
require('../manager/roleAdmin.css');
require('../manager/manager.css');

angular.bootstrap(document,[
	require('./module').default.name
])