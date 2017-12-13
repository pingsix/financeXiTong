
var dependArr = [
	require('./chart.service').default.name
]
export default {
	module : angular.module('chartCtrl',dependArr).controller('chartController', ['$scope', 'chartService', '$state', controller]),
	template : require('./chart.template.html')
}

function controller(_,service,$state){
		'use strict';
		var o,cfg = {},timer;
		var isArray = Array.isArray;
		
        //params
        _.pageNo = 1;            	//页数
        _.pageSize = 10;          	//每页多少个
        _.count = '';
        
        _.order = '';            //排序，默认正序
        _.orderBy = '';  //默认按进件时间排序
        
        _.partnerName = '';         //产品名称
        _.updateTimeStart = '';     //数据更新时间
        _.updateTimeEnd = '';       //数据更新时间
        _.presentStatus = '';       //状态
        _.loanStatus = '';          //是否放款
        _.keyWord = '';             //关键字
        _.creatProList = false;     //产品列表标示
        _.submitFlag = true;
        
        _.selectOption = {
            "type" : "select",
            "name" : "Service",
            "value" : "10条",
            "values" : ["10条","20条","30条","40条","50条"]
        };
			
        _.loanMenInfo = [];
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
          * 产品名称
          * @param {Event} evt
          */
        _.getProNamelist = function(evt){
            var target = evt.target;
            service.setSelectedLi(target);
            _.partnerName = evt.target.getAttribute('data-partnerName');
            o.laterQueryList();
        }
        /**
          * 正常  50.逾期 70.已还清 100.立刻
          * @param {Event} evt
          */
        _.getlistStatus = function(evt){
            var target = evt.target;
            service.setSelectedLi(target);
            _.presentStatus = evt.target.getAttribute('data-listStatus');
            o.laterQueryList();
        }
        /**
          * 是否通过
          * @param {Event} evt
          */
        _.currentApprovalStatus = function(evt){
            var target = evt.target;
            service.setSelectedLi(target);
            _.loanStatus = evt.target.getAttribute('data-currentApprovalStatu');
            o.laterQueryList();
        }
        /**
          * 进件开始时间
          * @param {Event} evt
          */
        _.getStartDate = function(evt){
            var target = evt.target;
            service.getDate(target.value,function(data){
                _.updateTimeStart = data;
                o.laterQueryList();
            })
        }
        /**
          * 进件结束时间
          * @param {Event} evt
          */
        _.getEndDate = function(evt){
            var target = evt.target;
            service.getDate(target.value,function(data){
                _.updateTimeEnd = data;
                o.laterQueryList();
            })
        }
       	/**
          * 关键字搜索
          * @param {keyword} evt
          */
       	_.$watch('keyWord',function(oldVal,newVal){
       		if(oldVal === newVal) return;
       		o.laterQueryList();
       	})
        
        _.viewDetail = function(item){
        	var param = {
        		"id" : item.id,
        		"isView" : true
        	}
        	$state.go('configuration.newOrganic',{"object":JSON.stringify(param)})
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
			_.order = sorts.order;
			_.orderBy = sorts.sortKey;
			o.laterQueryList();
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
		
		_.production = {
			partnerType1 : '',
			partnerType2 : '',
			productionList : '',
		};
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
			return {
				organize1 : unshiftDefault([],{
					id : '',
					value : '请选择'
				}),
				organize2 : unshiftDefault([],{
					id : '',
					value : '请选择'
				}),
				productionList : unshiftDefault([],{
					id : '',
					value : '请选择'
				})
			}
		}
		
		
        /**
		 * 生成产品列表
		 */
		_.$watch("creatProList",function(){
			if(!_.proArr || !_.proArr.proList) return;
			var $productionName = $("#productionName");
			_.proArr.proList.forEach(function(v){
				var creatEle = $("<li><a href='javascript:void(0)' data-partnerName=" + v.partnerName + " >"+ v.partnerName +"</a></li>");
				$productionName.append(creatEle)
			})
		})
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
                	order : _.order,           						 //排序
      				orderBy : _.orderBy,							 //默认按进件时间排序
      				
                    partnerName : _.partnerName,        		 	 //机构名称
                	keyWord : _.keyWord ,        					 //关键字
                };
                for(var item in cfg){
                    if(cfg[item] === '00' || cfg[item]==='' || cfg[item]=== undefined){
                        delete cfg[item];
                    }
                }
                service.getLoanMenInfoList(cfg).then(function(data){
                	var serialData = [
					  { "name": "累计放款金额", "value": "30000" },
					  { "name": "贷款余额", "value": "25000" },
					  { "name": "百融收益", "value": "50000" },
					  { "name": "合作方收益", "value": "28000" },
					  { "name": "第三方收益", "value": "9800" },
					]
                	var pielData = [
					  { "name": "资金成本", "value": "50" },
					  { "name": "百融收益", "value": "30" },
					  { "name": "合作方收益", "value": "16" },
					  { "name": "第三方收益", "value": "4" },
					]
                	setTimeout(function(){
						service.rendChart().serial((serialData))
						service.rendChart().pie((pielData))
				    },100)
                	
                	_.baseData = paddingData(data);
                	_.earningList = data.earningList;
                	_.earningCurrentList = data.earningCurrentList;
                	
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
