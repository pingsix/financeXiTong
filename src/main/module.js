


export default angular
	.module('main',[
		require('../tools/utils/filter').default.name,
		require('../tools/utils/util').default.name,
		require('../tools/utils/ajax').default.name,
		require('../tools/custom_components/globalDir').default.name,
		require('./main-router').default.name,
		require('../earnings/earnings.router').default.name,
		require('../financeInfo/finance-router').default.name,
		require('../production/production.router').default.name,
		"oc.lazyLoad",
		require('./service').default.name,
		require('./controller').default.name,
		require('../tools/widgets/page/page').default.name,
	])
