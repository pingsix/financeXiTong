import $ from 'jquery';

var dependArr = [
	require('./loanCollectInfo.service').default.name
]

export default {
	module : angular.module('loanCollectInfoCtrl',dependArr).controller('loanCollectInfoController',['$scope','loanCollectInfo.service','$timeout','util',controller]),
	template : require('./loanCollectInfo.template.html')
}

function controller(_,service,$timeout,util){
		'use strict';
		var o,cfg = {},timer,isAllProList = 1;
		
        _.pageNo = 1;            //页数
        _.pageSize = 10;          //每页多少个
        _.count = '';
        _.loanMenInfo = [];
        
        _.selectOption = {
            "type" : "select",
            "name" : "Service",
            "value" : "10条",
            "values" : ["10条","20条","30条","40条","50条"]
        };
			
        _.query = {
        	order : 'desc',
        	orderBy : 'create_time',
        	presentDateStart : util.getLatelyDay(2,'noExtend'),
        	presentDateEnd : '',
			productionCode : '',
			presentStatus : '',
			loanStatus : '',
			keyWord : ''
		}
        
         /**
          * 选择每页显示条数
          * @param {JSON} data
          */
        _.selectChange = function(data){
            var num = parseInt(data.replace(/(\d+)\D/,'$1'));
            _.pageSize = num;
            _.selectOption.value = num + '条';
            _.pageNo = 1;
            o.laterQueryList();
        }
        
        /**
          * 进件开始时间
          * @param {Event} evt
          */
        _.getDate("#inpstart",function(starTime){
	 		_.query.presentDateStart = starTime;
	 		_.$apply();
		})
        
        /**
          * 进件结束时间
          * @param {Event} evt
          */
		_.getDate("#inpend",function(endTime){
			_.query.presentDateEnd = endTime;
			_.$apply();
		})
        
        var isFirst = (function(){
        	var count = 1;
        	var isFirst = true;
        	return function(){
        		if(count > 1){
	        		isFirst = false
        		}
        		count += 1;
        		return isFirst;
        	}
        }())
        
        //过滤列表添加默认选项
		function unshiftOption(arrList,shiftOption){
			if(Array.isArray(arrList)){
				arrList.unshift(shiftOption);
			}
			return arrList;
		}
		
		function paddingData(data){
			return {
				productionList : unshiftOption(data.productionList,{
					productionCode :　'',
					productionName　:　'请选择'
				})
			}
		}
		
		_.$watch('query',function(oldVal,newVal){
			if(oldVal === newVal) return;
			o.getUserInfoList();
		},true)
		
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
                var cfg = config ||{
                    pageSize : _.pageSize,              			 //条数
                    pageNo : _.pageNo,                   			 //页数
                    isFirst : isFirst(),
                    productionCode : _.query.productionCode,        		 //产品名称
			        presentDateStart : _.query.presentDateStart,       		 //数据更新时间
			        presentDateEnd : _.query.presentDateEnd,           		 //数据更新时间
                };
                for(var item in cfg){
                    if(cfg[item] === '00' || cfg[item]===''){
                        delete cfg[item];
                    }
                }
                service.getCollectList(cfg).then(function(data){
//              	if(data.productionList && data.productionList.length && isAllProList === 1){
//              		isAllProList ++ ;
	                	_.baseSelectData = paddingData(data);
//              	}
                	
                	_.collectList = data.page.result;
                		
	                if(data.page.result.length == 0 && _.pageNo !== 1){
	                    _.pageNo = _.pageNo - 1;
	                    o.getUserInfoList();
	                }
                		
	                _.count = data.page.totalCount;
	                _.showPage = 'visible';
	                _.currentPage = data.page.pageNo;
	                _.$broadcast('EVT_PAGE_CHANGE',{'total':data.page.totalPages,'current':_.currentPage});
                },function(data){
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
            _.pageNo = data.pageSelectedNum;
            o.getUserInfoList();
            _.pageNo = 1;//默认值
        })
}
