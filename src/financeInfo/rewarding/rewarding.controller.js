
import $ from 'jquery';

var dependArr = [
	require('./rewarding.service').default.name,
]
export default {
	module : angular.module('rewardingCtrl',dependArr).controller('rewardingController',['$scope','rewardingService','$timeout','$state','util','$q',controller]),
	template : require('./rewarding.template.html')
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
        
        _.statusLists = [
           {
            code: "-1", value: '未申请放款'
           },
            {
            code: "0", value: '正常'
           },
            {
            code: "1", value: '逾期'
           },
            {
            code: "2", value: '已结清'
           },
            {
            code: "3", value: '一次结清'
           },
            {
            code: "4", value: '取消借款'
           },
            {
            code: "5", value: '待放款'
           },
           {
            code: "6", value: '提交失败'
           },
          {
            code: "7", value: '待还款'
           },
           {
            code: "8", value: '放款成功'
           },
           {
            code: "9", value: '放款失败'
           },
        ]

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
			return {
				productionList : unshiftOption(data.productionList,{
					productionCode :　'',
					productionName　:　'请选择'
				}),
			}
		}
        
        var queryParam = function(){
			return {
	        	// repaymentDate : util.getLatelyDay(0,"noExtend"),
                repaymentDate : '',
                createTimeEnd : '',
				productionCode : '',
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
		 		_.query.repaymentDate = starTime;
               
		 		_.$apply();
			},function(startObj){
	        	startObj.format = 'YYYY-MM-DD';
	        	delete startObj['maxDate'];
//	        	startObj["minDate"] = $.nowDate(0);
	        })
	        
        }


  /**
          * 进件结束时间
          * @param {Event} evt
          */
        _.getCreateEndDat= function(endTime){
            _.getDate("#inpCreateEn",function(endTime){
              // endTime =  endTime.split('-').slice(0,3);
                _.query.createTimeEnd = endTime;

            
                _.$apply();
            },function(startObj){
                startObj.format = 'YYYY-MM-DD';
                delete startObj['maxDate'];
//              startObj["minDate"] = $.nowDate(0);
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
         * 导出
         * @param {Object} preOrAll
         */
        _.exprotFile = function(){
        	if(_.count > 3000){
        		alert('全量导出不能超过3000条!');
		        return;
		    }
        	else if(_.count == 0){
		    	return alert('没有可导出的数据!');
		    }
        	delete _.downFileFilter['pageSize'];
        	delete _.downFileFilter['pageNo'];
        	delete _.downFileFilter['isFirst'];
            // return;
        	service.exprotFile( _.query);
            // service.exprotFile( _.downFileFilter);
        }
        
        
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
                      _.statusLists.forEach(function(item){
                        if (v.status == item.code) {
                            v.status = item.value;
                        }
                      })
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
