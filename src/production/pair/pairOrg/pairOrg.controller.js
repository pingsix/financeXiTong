/**
 * @author hontian.yem
 * 新建/编辑配对dialog
 */

import $ from 'jquery';
import mask from '@bairong/dialog_mask';
import '../pair-dialog.css';

var dependArr = [
	require('./pairOrg.service').default.name
]
export default {
	module : angular.module('pairOrgCtrl',dependArr).controller('pairOrgController', ['$scope', 'pairOrgService', '$state','$timeout', controller]),
	template : require('./pairOrg.template.html')
}

function controller(_,service,$state,$timeout){
		'use strict';
		var o,cfg = {},timer;
        
        if($state.params && $state.params.object && typeof $state.params.object === 'string'){
        	try{_.statusParamInfo = JSON.parse(decodeURI($state.params.object));}catch(e){};
        }
		_.production = {
		 	code : '',
		 	name : '',
        	accPartnerCode : '',
        	partnerName : '',
        	fundSharing : '',
        	assetSharing : '',
        	brSharing : '',
        	estimateLoan : '',
        	collNode : '',
        };
        
        _.checkStatus = _.statusParamInfo.status == 2 ? false : true;
        
        function resetProduction(){
        	for(var i in _.production){
        		_.production[i] = '';
        	}
        }
        
		//如果是编辑补全基本信息
		function fullProduction(obj1,obj2){
			for(var i in obj2){
				obj1[i] = obj2[i]; 
			}
			return obj1;
		}
		
		//浮点数计算精度
		function accAdd(arg1,arg2){  
			var r1,r2,m;  
			try{r1=arg1.toString().split(".")[1].length}catch(e){r1=0};  
			try{r2=arg2.toString().split(".")[1].length}catch(e){r2=0};  
			m=Math.pow(10,Math.max(r1,r2)) ; 
			return (arg1*m+arg2*m)/m;  
		} 
		
		function validateParam(data){
			//等于0可以
			var ignorePropVal = ['fundSharing','assetSharing','brSharing','collNode'];
			
			var validateVal = saveParam(data),
//				totalRatio = 1,
				isIntType = /^[0-9]*$/,
				isAllFill = Object.keys(validateVal).every(function(v){
					for(var i = 0,ii=ignorePropVal.length; i< ii;i++){
						if(ignorePropVal[i] == v && validateVal[v] == '0') return true
					}
					return typeof validateVal[v] == 'undefined' || validateVal[v] == 0  ? false : true;
				})
			//是否填全信息
			if(!isAllFill){
				alert('信息填写不全，请检查信息！');
				return false;
			}
			//分成比例
//			if(accAdd(accAdd(data.fundSharing,data.assetSharing),data.brSharing) !== totalRatio){
//				data.fundSharing = data.assetSharing = data.brSharing = '';
//				alert('分成比例信息填写有误，请重新填写！');
//				return false;
//			}
			if(!isIntType.test(data.estimateLoan)){
				data.estimateLoan = '';
				alert('预计放款额必须为正整数！');
				return false;
			}
			if(!isIntType.test(data.collNode)){
				data.collNode = '';
				alert('催收节点必须为正整数！');
				return false;
			}
			return true;
		}
		
		function saveParam(item){
			var saveParam = {
				lasPartnerCode : _.statusParamInfo.partnerCode,
				productionCode : _.statusParamInfo.code,
				
				accPartnerCode : item.partnerName,
				fundSharing : item.fundSharing,
	        	assetSharing : item.assetSharing,
	        	brSharing : item.brSharing,
	        	estimateLoan : item.estimateLoan,
	        	collNode : item.collNode,
			};
			if(_.editFlag){ saveParam.id = item.id;};
			return saveParam;
		}
		
		_.openPair = function(item = undefined){
			//新建/编辑默认项
			getSelectInfo(item);
			_.dialogShow = true;
			mask.show({height:_.getClientHeight()});
			item ? render(item,_.statusParamInfo) : render(_.statusParamInfo);
		}
		
		_.savePair = function(){
			if(!validateParam(_.production)) return;
			service.save(saveParam(_.production)).then(function(data){
				alert(data.responseMsg);
				_.dialogShow = false;
				mask.hidden();
				o.getUserInfoList();
			},function(reason){alert(reason.responseMsg);})
		}
		
		_.closePair = function(){
			_.dialogShow = false;
			mask.hidden();
		}
		
		/**
		 * 有第二个值为走编辑
		 */
		function render(item,addInfo){
			_.editFlag = addInfo ? true : false;
			//重置production所有字段值
			resetProduction();
			item = addInfo ? fullProduction(item,addInfo) : item ;
			
			for(var i in item){
				if(!_.production[i]) _.production[i] = item[i];
			}
			_.production.partnerName = addInfo ? item.accPartnerCode : '';
		}
		
		/**
		 * 资金方下拉列表
		 * @param {Object} item
		 */
		function getSelectInfo(item = {partnerCode :_.statusParamInfo.partnerCode,productionCode :_.statusParamInfo.code}){
			function getSelectList(){
				item = item.accPartnerCode ? {partnerCode : item.partnerCode, accPartnerCode : item.accPartnerCode,productionCode : item.productionCode} : item;
				service.getAccSideList(item).then(function(data){
					var bankrollParList = [];
					if(Array.isArray(data.bankrollParList)){
						bankrollParList = data.bankrollParList.slice();
						bankrollParList.unshift({
							partnerCode : "",
							partnerName :　"请选择"
						})
					}
					_.accSideList = bankrollParList;
				},function(reason){alert(reason.responseMsg)})
			}
			$timeout(getSelectList,50);
		}
		
        /**
         * 默认产品列表查询
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
            	if(!_.statusParamInfo) return;
                var cfg = config ||{productionCode : _.statusParamInfo.code};     
                service.getPairList(cfg).then(function(data){
                	_.pairList = data.accpartnerlist;
                },function(data){alert(data.responseMsg)});
            },
            init : function(){
                this.getUserInfoList();
                _.lodingMask = true;
            }
        }
        o.init();
}
