
var dependArr = [
	require('./splitting.service').default.name
]
export default {
	module : angular.module('splittingCtrl',dependArr).controller('splittingController', ['$scope', 'splittingService', '$state', controller]),
	template : require('./splitting.template.html')
}

function controller(_,service,$state){
		'use strict';
		var o,cfg = {},timer,filterListPaddingFlag = false;
		_.selectBaseData2 = {};
		var isArray = Array.isArray;
        
        //请求参数 保持初始样板
		var queryParam = function(){
			return {
				partnerCode : '',
				accPartnerCode : '',
				productionCode : '',
	        	keyWord : '',
			}
		}
		
		//查询参数
		_.query = queryParam();
        
        _.selectOption = {
            "type" : "select",
            "name" : "Service",
            "value" : "10条",
            "values" : ["10条","20条","30条","40条","50条"]
        };
			
		//查询
        _.searchStart = function(){
			o.laterQueryList();
		}
        
        _.clearSearch = function(){
			_.query = queryParam();
			o.laterQueryList();
        }
		
		_.exportAll = function(){
			if(_.listBaseData.length < 1) {
				alert("没有可导出的数据！")
				return;
			}
			service.downLoadFile(cfg)
		}
		
		
		/**
		 * 获取Ⅱ类合作机构筛选列表
		 */
		_.getSelectFlList = function(code){
			console.log(code)
			if(!code) return;
			_.query.accPartnerCode = '';
			service.getSelectList({partnerCode:code}).then(function(data){
				data.accPartner.unshift({
					accPartnerName : '请选择',
					accPartnerCode : ''
				})
				_.selectBaseData2.organize2 = data.accPartner;
			},function(reason){
				alert(reason.responseMsg)
			})
		}
		
		
		
		/**
		 * 填充筛选列表条件
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
			return {
				organize1 : unshiftDefault(data.partnerList,{
					partnerName : '请选择',
					partnerCode : ''
				}),
//				organize2 : [{
//					accPartnerName : '请选择',
//					accPartnerCode : ''
//				}],
				productionList : unshiftDefault(data.productionList,{
					productionName : '请选择',
					productionCode : ''
				})
			}
		}
		
		
		function handleSourceData(data){
//			if(filterListPaddingFlag) return;
			var partnerList = [],accPartnerList = [];
			if(isArray(data.partner)){
				data.partner.forEach(function(item){
					var obj1 = {},obj2 = {};
					for(var i in item){
						if(/acc/.test(i)){
							obj1[i] = item[i];
						}else{
							obj2[i] = item[i];
						}
					}
					partnerList.push(obj2);
					accPartnerList.push(obj1);
				})
			}
			data['partnerList'] = partnerList;
			data['accPartnerList'] = accPartnerList;
//			filterListPaddingFlag = !filterListPaddingFlag;
			return data;
		}
		
        //获取列表
        o = {
            laterQueryList : function(){
                if(timer){
                    clearTimeout(timer);
                }
                timer = setTimeout(function(){
                    o.getUserInfoList();
                },200);
            },
            getUserInfoList : function(config){
                var cfg2 = JSON.parse(JSON.stringify(_.query));
                for(var item in cfg2){
                    if(!cfg2[item]) delete cfg2[item];
                }
                cfg = cfg2;
                service.getSplittingList(_.query).then(function(data){
                	_.selectBaseData = paddingData(handleSourceData(data));
                	_.listBaseData = data.page.result;
                	_.exportAllLock = _.listBaseData.length == 0 ? false : true;
                },function(data){
                  	alert(data.responseMsg)
                });
            },
            init : function(){
            	this.getUserInfoList();
            }
        }
        
        o.init();
//      _.$watch('query',o.laterQueryList,true);
}
