require('angular');
require('./login.css');
require('./reset.css');
require('./style.css');


angular.bootstrap(document,[
	require('./module').default.name
])

