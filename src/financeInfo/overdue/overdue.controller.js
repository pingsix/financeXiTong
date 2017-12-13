
import $ from 'jquery';
var dependArr = [
	require('./overdue.service').default.name
]
export default {
	module : angular.module('overdueCtrl',dependArr).controller('overdueController',['$scope','overdueService','$timeout','util','$state',controller]),
	template : require('./overdue.template.html')
}

function controller(_,service,$timeout,util,$state){
		'use strict';
		var o,cfg = {},timer,isAllProList = 1;
		
        _.pageNo = 1;            		//页数
        _.pageSize = 10;          		//每页多少个
        _.count = '';
        _.loanMenInfo = [];
        _.allExportFlag = false;
        
        _.selectOption = {
            "type" : "select",
            "name" : "Service",
            "value" : "10条",
            "values" : ["10条","20条","30条","40条","50条"]
        };
        
        _.query = {
        	order : 'desc',
        	orderBy : 'create_time',
        	presOverdueDateStart : util.getLatelyDay(2,'noExtend'),
        	presOverdueDateEnd : '',
			productionCode : '',
			partnerCode : '',
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
	 		_.query.presOverdueDateStart = starTime;
	 		_.$apply();
		})
        
        /**
          * 进件结束时间
          * @param {Event} evt
          */
		_.getDate("#inpend",function(endTime){
			_.query.presOverdueDateEnd = endTime;
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
        
        /*
         * 导出
         */
        _.fileExport = function(preOrAll){
        	if(_.count > 3000){
        		alert('全量导出不能超过3000条！');
        		return
        	}
        	else if(_.count == 0){
        		alert('全量导出不能导出0条！');
        		return
        	}
        	var exportCfg = JSON.parse(JSON.stringify(_.downFileFilter));
        	for(var i in exportCfg){
        		if(!exportCfg[i]){
        			delete exportCfg[i];
        		}
        		if(i == 'pageSize'){
        			delete exportCfg['pageSize'];
        		}
        		if(i == 'pageNo'){
        			delete exportCfg['pageNo'];
        		}
        	}
            service.exportsFile(exportCfg)
        }
        
        
		/**
          * 时间排序
          */
		_.sortTime = function(sorts){
			_.query.order = sorts.order;
			_.query.orderBy = sorts.sortKey;
		}
		
		
		/**
		 * 传送金额 
		 */
		_.viewDetail = function(item){
			var param = {
				requestId : item.requestId,
				name : 'overdue'
			}
			_.$emit('transformM',{
				money : item.presentDueSum
			})
			
			$state.go('financial.viewDetail',{'object':encodeURI(JSON.stringify(param))})
		}
		
		
		//过滤列表添加默认选项
		function unshiftOption(arrList,shiftOption){
			if(Array.isArray(arrList)){
				arrList.unshift(shiftOption);
			}
			return arrList;
		}
		
		function paddingData(data){
			return {
				productionList : unshiftOption(data.productionList.slice(),{
					productionCode :　'',
					productionName　:　'请选择'
				}),
				partnerList : unshiftOption(data.productionList.slice(),{
					partnerCode :　'',
					partner : '请选择'
				}),
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
                    pageSize : _.pageSize,              			 
                    pageNo : _.pageNo,                   			 
                    isFirst : isFirst(),
                    productionCode : _.query.productionCode,        		 
			        presOverdueDateStart : _.query.presOverdueDateStart,       		 
			        presOverdueDateEnd : _.query.presOverdueDateEnd,           		 
			        partner : _.query.partnerCode,						 	 
                	keyWord : _.query.keyWord ,        					 
                	order : _.query.order,           						 
      				orderBy : _.query.orderBy   							 
                };
                for(var item in cfg){
                    if(cfg[item] === '00' || cfg[item]===''){
                        delete cfg[item];
                    }
                }
                _.downFileFilter = cfg;//全量导出
                service.getOverDueList(cfg).then(function(data){
	                _.baseSelectData = paddingData(data);
                	_.loanMenInfo = data.page.result;
                	_.loanMenInfo.forEach(function(item,index){
                		if(item == null) _.loanMenInfo.splice(index,1);
                	})
                	
                	if(data.page.result.length == 0 && _.pageNo !== 1){
	                    _.pageNo = _.pageNo - 1;
	                    o.getUserInfoList();
	                }	
	                _.count = data.page.totalCount;
	                _.showPage = 'visible';
	                _.currentPage = data.page.pageNo;
	                
	                //多余3000条或等于0条不能导出
                	_.allExportFlag = _.count > 3000 || _.count == 0 ? false : true;

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
