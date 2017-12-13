
export default angular
	.module('login',[
		require('./controller').default.name,
		require('./service').default.name,
		require('./directive').default.name,
		require('../common/module').default.name
	])
