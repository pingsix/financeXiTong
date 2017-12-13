
import $ from 'jquery';

var dependArr = [
	require('./loanMenInfo.service').default.name,
]
export default {
	module : angular.module('loanMenInfoCtrl',dependArr).controller('loanMenInfoController',['$scope','loanMenInfoService','$timeout','$state','util','$q',controller]),
	template : require('./loanMenInfo.template.html')
}

function controller(_,service,$timeout,$state,util,$q){
		'use strict';
		var o,timer;
        _.count = '';
        _.downloadBtn = false;         
        _.checkBoxManage = false;
        _.loanMenInfo = [];
        _.selectOption = {
            "type" : "select",
            "name" : "Service",
            "value" : "10条",
            "values" : ["10条","20条","30条","40条","50条"]
        };
        
        /**
		 * 过滤列表添加默认选项
		 * @param {Object} arrList
		 * @param {Object} shiftOption
		 */
		function unshiftOption(arrList,shiftOption){
			if(Array.isArray(arrList)){
				arrList.unshift(shiftOption);
			}
			return arrList;
		}
		
		function paddingData(data){
			var presentStatusList = [
				{id : '正常' , value : '正常'},
				{id : '逾期' , value : '逾期'},
				{id : '已结清' , value : '已结清'},
				{id : '一次还清' , value : '一次还清'},
				{id : '取消借款' , value : '取消借款'},
				{id : '代偿' , value : '代偿'},
				{id : '代偿结清' , value : '代偿结清'},
			],
			loanStatusList = [
				{id :　'成功'　, value :　'成功'},
				{id :　'失败'　, value :　'失败'},
				{id :　'待放款'　, value :　'待放款'}
			];
			return {
				productionList : unshiftOption(data.productionList,{
					productionCode :　'',
					productionName　:　'请选择'
				}),
				presentStatusList : unshiftOption(presentStatusList,{
					id :　'',
					value : '请选择'
				}),
				loanStatusList : unshiftOption(loanStatusList,{
					id :　'',
					value : '请选择'
				})
			}
		}
        
        var queryParam = function(){
			return {
				order : 'desc',
	        	orderBy : 'create_time',
	        	createTimeStart : util.getLatelyDay(2),
	        	createTimeEnd : '',
	        	updateTimeStart : '',
	        	updateTimeEnd : '',
				productionCode : '',
				presentStatus : '',
				loanStatus : '',
				keyWord : '',
				pageSize : 10,              			 
	            pageNo : 1
			}
		}
		
		//查询参数
		_.query = queryParam();
		
		
         /**
          * 选择每页显示条数
          * @param {JSON} data
          */
        _.selectChange = function(data){
            var num = parseInt(data.replace(/(\d+)\D/,'$1'));
            _.query.pageSize = num;
            _.selectOption.value = num + '条';
            _.query.pageNo = 1;
            o.laterQueryList();
        }
        
        /**
          * 进件开始时间
          * @param {Event} evt
          */
        _.getCreateStartDate = function(startTime){
	        _.getDate("#inpCreateStart",function(starTime){
		 		_.query.createTimeStart = starTime;
		 		_.$apply();
			})
        }
        /**
          * 进件结束时间
          * @param {Event} evt
          */
        _.getCreateEndDate = function(){
        	_.getDate("#inpCreateEnd",function(endTime){
				_.query.createTimeEnd = endTime;
				_.$apply();
			})
        }
		
        
        /**
          * 更新开始时间
          * @param {Event} evt
          */
        _.getStartDate = function(){
	        _.getDate("#inpstart",function(starTime){
		 		_.query.updateTimeStart = starTime;
		 		_.$apply();
			})
        }
        
        /**
          * 更新结束时间
          * @param {Event} evt
          */
        _.getEndDate = function(){
			_.getDate("#inpend",function(endTime){
				_.query.updateTimeEnd = endTime;
				_.$apply();
			})
		}


        //查询
        _.searchStart = function(){
			o.laterQueryList();
		}
        
        _.clearSearch = function(){
			_.query = queryParam();
			o.laterQueryList();
        }
        
        
		/**
		 * 传后端第一次操作flag
		 */
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
       	
        /**
          * 全选
          * @param {Event} evt
          */
        _.allChecked = function(){
        	_.checkBoxManage = !_.checkBoxManage;
        	if(_.loanMenInfo.length < 1) return;
            _.loanMenInfo.forEach(function(v){
	            v['CheckboxFlag'] = _.checkBoxManage;
            })
            _.downloadBtn = triggerDownloadBtn();
        }
        
        _.watchListChecked = function(){
        	_.downloadBtn = triggerDownloadBtn();
        	triggerCheckAllBtn();
        }
        
        function triggerDownloadBtn(){
        	var isExistCheckData = _.loanMenInfo.some(function(item){
        		return item.CheckboxFlag ? true : false;
        	})
        	return isExistCheckData;
        }
        
        function triggerCheckAllBtn(){
        	var isExistCheckData = _.loanMenInfo.every(function(item){
        		return item.CheckboxFlag ? true : false;
        	})
        	_.checkBoxManage = isExistCheckData;
        }
        
        
        /**
         * 操作 查看详情
         * @param {Object} item
         */
        _.viewDetail = function(item){
        	var params = {
        		'requestId':item.requestId,
        		'name':'loanInfo'
        	}
        	window.open(`#/financial/viewDetail/${encodeURI(JSON.stringify(params))}`)
//      	$state.go('financial.viewDetail',{"object" :　encodeURI(JSON.stringify(params))})
        }
        
        
        /**
         * 导出
         * @param {Object} preOrAll
         */
        _.exprotFile = function(){
        	var idsArr = [],exportCfg = {},
		        isIds = (function(){
			        var arr = _.loanMenInfo.slice(0);
			        arr.forEach(function(v){
			            if(v.CheckboxFlag){
			                idsArr.push(v.id);
			            }
			        })
			        return idsArr;
			    })()
			exportCfg.idList = isIds;
			service.exprotFile(exportCfg);
        }
        
        _.exprotFileAll = function(){
        	if(_.count > 3000){
        		alert('全量导出不能超过3000条!');
		        return;
		    }
        	else if(_.count == 0){
		    	alert('全量导出不能导出0条!');
		        return;
		    }
        	delete _.downFileFilter['pageSize'];
        	delete _.downFileFilter['pageNo'];
        	service.exprotFile( _.downFileFilter);
        }
        
        
        /**
         * 时间排序
         * @param {Object} sorts
         */
		_.sortTime = function(sorts){
			_.query.order = sorts.order;
			_.query.orderBy = sorts.sortKey;
		}
		
		
		/**
		 * 监听筛选条件变化 自动查询
		 */
//		_.$watch('query',function(oldVal,newVal){
//			if(oldVal === newVal) return;
//			o.getUserInfoList();
//		},true)
		
		function deleteEmptyData(data){
			if(!data) return;
			for(var item in data){
               if(data[item] === '00' || data[item]===''){
                    delete data[item];
                }
            }
			return data;
		}
		
        /**
         * 渲染列表
         */
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
            	var cfg = JSON.parse(JSON.stringify(_.query));
            	//全量导出
            	cfg.isFirst = isFirst(),
                _.downFileFilter = deleteEmptyData(cfg);
                service.getLoanMenInfoList(_.query).then(function(data){
	                _.baseSelectData = paddingData(data);
                	_.downloadBtn = _.checkBoxManage = false;
                	
                	_.loanMenInfo = data.page.result ? data.page.result : [];
                	
                	_.loanMenInfo.forEach(function(v){
	                    v['CheckboxFlag'] = false;
	                })
                	
                	//页码问题
	                if(data.page.result.length == 0 && _.query.pageNo !== 1){
	                    _.query.pageNo = _.query.pageNo - 1;
	                    o.getUserInfoList();
	                }
	                    
	                _.count = data.page.totalCount;
	                _.showPage = 'visible';
	                _.currentPage = data.page.pageNo;
	                
	                //多余3000条或等于0条不能导出
	                _.isDisabled = _.count < 3000 && _.count > 0 ? true : false;
                	
	                _.$broadcast('EVT_PAGE_CHANGE',{'total':data.page.totalPages,'current':_.currentPage});
                },function(data){
                	alert(data.responseMsg);
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
            _.query.pageNo = data.pageSelectedNum;
            o.getUserInfoList();
            _.query.pageNo = 1;
        })
}
