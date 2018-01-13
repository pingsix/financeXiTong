import $ from 'jquery';

require('@bairong/br-bootstrap')($)
var dependArr = [
	require('./organicList.service').default.name,
	require('@bairong/br_angular_file_upload').name
]
export default {
	module : angular.module('organicListCtrl',dependArr).controller('organicListController', ['$scope', 'organicListService', '$state','$timeout','FileUploader','util', controller]),
	template : require('./organicList.template.html')
}
function controller(_,service,$state,$timeout,FileUploader,util){
		'use strict';
		var o,cfg = {},timer,isAllProList = 1;
		
		var queryParam = function(){
			return {
				order : 'desc',
	        	orderBy : 'modify_time',
	        	partnerType : '',
	        	partnerCode : '',
	        	apiCode : '' ,
	        	pageNo : 1,
	        	pageSize : 10
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
        
        //查询
        _.searchStart = function(){
			o.laterQueryList();
		}
        
        _.clearSearch = function(){
			_.query = queryParam();
			_.selectOption.value = `${_.query.pageSize}条`;
			o.laterQueryList();
        }
        
        //查看详情
        _.viewDetail = function(item){
        	var param = {
        		"id" : item.id,
        		"isView" : true
        	}
        	$state.go('configuration.newOrganic',{"object":encodeURI(JSON.stringify(param))})
        }
        
        //编辑
        _.edit = function(item){
        	var param = {
        		"id" : item.id,
        		"upDate" : true
        	}
        	$state.go('configuration.newOrganic',{"object":encodeURI(JSON.stringify(param))})
        }
        
        _.dialog = {show:false}
        _.closeDialog = function(){
        	_.dialog.show = false;
        }
        
        _.upload = function(item){
        	_.upLoadParam = item;
        	_.dialog.show = true;
        }
        
        /**
         * 上传
         */
        var uploader = _.uploader = service.upService(FileUploader,_.item);	
        uploader.filters.push({
            name: 'customFilter',
            fn: function(item /*{File|FileLikeObject}*/, options) {
                return this.queue.length < 10;
            }
        });
        // CALLBACKS
        uploader.onProgressAll = function(progress) {
        	progress = 100;
        };
        uploader.onSuccessItem = function(fileItem, response, status, headers) {
		     $timeout(function () {

		          alert(response.responseMsg)
		          uploader.clearQueue(_.dialog)
		          location.reload();
		     },500);
        };
        
        /**
         * 下载
         * @param {Object} item
         */
        _.downLoad = function(item){
        	service.downLoadFile(item)
        }        
        
		/**
          * 时间排序
          */
		_.sortTime = function(sorts){
			_.query.order = sorts.order;
			_.query.orderBy = sorts.sortKey;
		}
		/**
		 * 启用/停用
		 * @param {Object} item
		 */
		_.isFreeze = function(item){
			var cfg = {
				isCooperation : '',
				id : item.id,
			}
			if(item.isCooperation == '1'){
				cfg.isCooperation = '0';
			}
			else{
				cfg.isCooperation = '1';
			}
			
			service.freezeCtrl(cfg).then(function(data){
				o.getUserInfoList();
			},function(reason){
               
				alert(reason.responseMsg)
			})
		}
		
        //过滤列表添加默认选项
		function unshiftOption(arrList,shiftOption){
			if(Array.isArray(arrList)){
				arrList.unshift(shiftOption);
			}
			return arrList;
		}
		
		function paddingData(data){
			var partnerTypeList = [
				{typeCode : '0' , typeName : '资金方' },
				{typeCode : '1' , typeName : '资金资产方' }
			];
			
			return {
				partnerTypeList : unshiftOption(partnerTypeList,{
					typeCode : '',
					typeName : '请选择'
				}),
				partnerList : unshiftOption(data.partnerList,{
					partnerCode :　'',
					partnerName :　'请选择'
				})
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
                var param = JSON.parse(JSON.stringify(_.query));
                for(var item in param){
                	if(item == 'isFirst') continue;
                    if(!param[item]) delete param[item];
                }
                service.getLoanMenInfoList(param).then(function(data){
	                	_.baseSelectData = paddingData(data);
                		_.loanMenInfo = data.page.result || [];
                		//获取过滤产品
                		_.proArr = {
                			proList : data.partnerList 
                		}
                		_.creatProList = true;
                		
                		//页码问题
	                    if(data.page.result.length == 0 && _.query.pageNo !== 1){
	                    	_.query.pageNo = _.query.pageNo - 1;
	                    	o.getUserInfoList();
	                    }
	                    
	                    _.count = data.page.totalCount;
	                    _.showPage = 'visible';
	                    _.currentPage = data.page.pageNo;
	                    //多余3000条或等于0条不能导出
                		_.allExportFlag = data.page.totalCount && data.page.totalCount;
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
            _.query.pageNo = data.pageSelectedNum;
            o.getUserInfoList();
            _.query.pageNo = 1;//默认值
        })
}
