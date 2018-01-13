import $ from 'jquery';

import mask from '@bairong/dialog_mask';

var dependArr = [
	require('./pair.service').default.name
]
export default {
	module : angular.module('pairCtrl',dependArr).controller('pairController', ['$scope', 'pairService', '$state','$timeout', controller]),
	template : require('./pair.template.html')
}

function controller(_,service,$state,$timeout){
		'use strict';
		var o,cfg = {},timer;
		
        _.selectOption = {
            "type" : "select",
            "name" : "Service",
            "value" : "10条",
            "values" : ["10条","20条","30条","40条","50条"]
        };
        // alert
		
		var queryParam = function(){
			return {
	        	productionStatus : '',
				configStatus : '',
				keyWord : '',
	        	pageNo : 1,
	        	pageSize : 10
			}
		}
		
		//查询参数
		_.production = queryParam();
		
		
		var isArray = Array.isArray;
         /**
          * 选择每页显示条数
          * @param {JSON} data
          */
        _.selectChange = function(data){
            var num = parseInt(data.replace(/(\d+)\D/,'$1'));
            _.production.pageSize = num;
            _.selectOption.value = num + '条';
            _.production.pageNo = 1;
            o.laterQueryList();
        }
        
        //查询
        _.searchStart = function(){
			o.laterQueryList();
		}
        
        _.clearSearch = function(){
			_.production = queryParam();
			_.selectOption.value = `${_.production.pageSize}条`;
			o.laterQueryList();
        }
        
        _.handleTitle = function(item){
        	if(item.status === '2'){
        		return '查看';
        	}else{
        		return '配置';
        	}
        }
        
        _.viewDetail = function(item){
        	var param = {
        		"code" : item.productionCode,
        		"name" : item.productionName,
        		"partner" : item.partner,
        		"partnerCode" : item.partnerCode,
        		'status' : item.status
        	}
        	$state.go('configuration.pairOrg',{"object":encodeURI(JSON.stringify(param))})
        }
        
		/**
		 * 田中选择列表数据
		 * @param {Array} item
		 * @param {Object} paddingContent
		 */
		function unshiftDefault(item,paddingContent){
			if(isArray(item)) {
				item.unshift(paddingContent);
			}
			return item;
		}
		
		function paddingData(data){
			var productionStatusList = [
				{id : '0' , value : '待生效'},
				{id : '1' , value : '生效'},
				{id : '2' , value : '结束'}
			],
			configStatusList = [
				{id : '0' , value : '否'},
				{id : '1' , value : '是'}
			]
			return {
				productionStatusList : unshiftDefault(productionStatusList,{
					id : '',
					value : '请选择'
				}),
				configStatusList : unshiftDefault(configStatusList,{
					id : '',
					value : '请选择'
				}),
			}
		}
		
		
        //获取列表
        o = {
            laterQueryList : function(){
                var that = this;
                if(timer){
                    clearTimeout(timer);
                }
                timer = setTimeout(function(){
                    that.getUserInfoList();
                },200);
            },
            getUserInfoList : function(config){
                var param = JSON.parse(JSON.stringify(_.production));
                for(var item in param){
                	if(item == 'isFirst') continue;
                    if(!param[item]) delete param[item];
                }
                service.getProductionaccpartnerList(param).then(function(data){
                		if(data.page.result) _.pairList = data.page.result || [];
						_.baseData = paddingData(data);
                		//页码问题
	                    if(data.page.result.length == 0 && _.production.pageNo !== 1){
	                    	_.production.pageNo = _.production.pageNo - 1;
	                    	o.getUserInfoList();
	                    }
	                    _.count = data.page.totalCount;
	                    _.showPage = 'visible';
	                    _.currentPage = data.page.pageNo;
	                    //多余3000条或等于0条不能导出
                		_.allExportFlag = data.page.totalCount && data.page.totalCount;
	                    _.$broadcast('EVT_PAGE_CHANGE',{'total':data.page.totalPages,'current':_.currentPage});
                },function(data){
                    console.log(data)
                  	alert(data.responseMsg)
                });
            },
            init : function(){
                this.getUserInfoList();
                _.lodingMask = true;
            }
        }
        o.init();
        //监听page发回的事件
        _.$on('EVT_PAGE_SELECTED',function(evt,data){
            _.production.pageNo = data.pageSelectedNum;
            o.getUserInfoList();
            _.production.pageNo = 1;//默认值
        })
}
