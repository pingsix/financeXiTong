/**
 * 总数
 */
module.exports = [
	{id:'j1_1',text:'收益明细',children:[
		{id:'j1_3',text:'分润情况',href:'earnings/splitting'},
	]},
	{id:'j1_4',text:'账务信息',children:[
		{id:'j1_13',text:'借款人财务信息',href:'financial/loan'},
//		{id:'j1_14',text:'财务汇总信息',href:'financial/collect'},
//		{id:'j1_15',text:'逾期用户信息',href:'financial/overdue'},
//		{id:'j1_5',text:'个人账务信息',href:'financial/personage'},
		{id:'j1_6',text:'应回款报表',href:'financial/rewarding'},
//		{id:'j1_7',text:'合作机构账务信息',href:'financial/parent'},
	]},
	{id:'j1_8',text:'配置中心',children:[
		{id:'j1_9',text:'机构配置',href:'configuration/production'},
		{id:'j1_16',text:'机构配对',href:'configuration/pair'},
	]},
	{id:'j1_10',text:'用户管理',children:[
		{id:'j1_11',text:'用户管理',href:'manager/user'},
		{id:'j1_12',text:'角色管理',href:'manager/role'},
	]}
];	


