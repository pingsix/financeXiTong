
export default angular
	.module('common.module ',[
		require('./service').default.name,
		require('./filter').default.name,
		require('./url').default.name
	])
