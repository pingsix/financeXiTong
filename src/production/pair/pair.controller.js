import $ from 'jquery';

import mask from '@bairong/dialog_mask';
import './pair-dialog.css';

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

        //  if($state.params && $state.params.object && typeof $state.params.object === 'string'){
        //     try{_.statusParamInfo = JSON.parse(decodeURI($state.params.object));}catch(e){};
        // }		

        _.selectOption = {
            "type" : "select",
            "name" : "Service",
            "value" : "10条",
            "values" : ["10条","20条","30条","40条","50条"]
        };

        var queryParam = function(){
            return {
                status: '',
                configStatus : '',
                keyWord : '',
                pageNo : 1,
                pageSize : 10,
                productionCode : '',
                name : '',
                accPartnerCode : '',
                // partnerName : '',
                fundSharing : '',
                assetSharing : '',
                productionName : '',
                accPartnerName : '',
                // brSharing : '',
                // estimateLoan : '',
                collNode : '',
                penalty: ''
                }
        }

            //查询参数
        _.production = queryParam();

        _.productions = queryParam();

        _.fundShare = function(name,list) {
        
          list.forEach(function(item){
          
            if (item.partnerCode == name) {
                _.production.fundSharing = item.fundSharing;
                _.production.accPartnerName = item.partnerName;
            }
          })
        }
		
        _.dian = function(item,event) {
            if (item.con == "－"){
               item.con = "＋";
            } else {
               item.con = "－";
            }
            
            if (item.imgsIcon) {
                item.imgsIcon = false;
            } else {
                 item.imgsIcon = true;
                 var cfg = {productionCode : item.productionCode};    
                 service.getPairList(cfg).then(function(data){
                    item.pairLists = data.accpartnerlist;
                   
                 },function(data){
                    
                    alert(data.responseMsg)
                 });
            }    
        }

		 // _.checkStatus = _.statusParamInfo.status == 2 ? false : true;

		var isArray = Array.isArray;
         /**
          * 选择每页显示条数
          * @param {JSON} data
          */
        _.selectChange = function(data){
            var num = parseInt(data.replace(/(\d+)\D/,'$1'));
            _.productions.pageSize = num;
            _.selectOption.value = num + '条';
            _.productions.pageNo = 1;
            o.laterQueryList();
        }
        
        //查询
        _.searchStart = function(){
			o.laterQueryList();
		}
        function resetProduction(){
            for(var i in _.production){
                _.production[i] = '';
            }
        }
        _.clearSearch = function(){
			_.productions = queryParam();
			_.selectOption.value = `${_.productions.pageSize}条`;
			o.laterQueryList();
        }
        //如果是编辑补全基本信息
        function fullProduction(obj1,obj2){
            for(var i in obj2){
                obj1[i] = obj2[i]; 
            }
            return obj1;
        }
        // _.handleTitle = function(item){
        // 	if(item.status === '2'){
        // 		return '查看';
        // 	}else{
        // 		return '配置';
        // 	}
        // }
        //浮点数计算精度
        function accAdd(arg1,arg2){  
            var r1,r2,m;  
            try{r1=arg1.toString().split(".")[1].length}catch(e){r1=0};  
            try{r2=arg2.toString().split(".")[1].length}catch(e){r2=0};  
            m=Math.pow(10,Math.max(r1,r2)) ; 
            return (arg1*m+arg2*m)/m;  
        } 
        _.viewDetail = function(item){
        	var param = {
        		"productionCode" : item.productionCode,
        		// "name" : item.productionName,
                "productionName" : item.productionName,
        		"partner" : item.partner,
        		"partnerCode" : item.partnerCode,
        		'status' : item.status
        	}
            var paramss =  encodeURI(JSON.stringify(param))
            _.statusParamInfo = JSON.parse(decodeURI(paramss))

        	// $state.go('configuration.pairOrg',{"object":encodeURI(JSON.stringify(param))})
        }
        function validateParam(data){
            //等于0可以
            var ignorePropVal = ['fundSharing','assetSharing','brSharing','collNode'];
            
            var validateVal = saveParam(data);
     
//              totalRatio = 1,
            var isIntType = /^[0-9]*$/;
            var isAllFill = Object.keys(validateVal).every(function(v){
           
                    for(var i = 0,ii=ignorePropVal.length; i< ii;i++){
                        if(ignorePropVal[i] == v && validateVal[v] == '0') return true
                    }
                    return typeof validateVal[v] == 'undefined' || validateVal[v] == 0  ? false : true;
                })
            //是否填全信息
            // if(!isAllFill){
            //     alert('信息填写不全，请检查信息！');
            //     return false;
            // }
            //分成比例
//          if(accAdd(accAdd(data.fundSharing,data.assetSharing),data.brSharing) !== totalRatio){
//              data.fundSharing = data.assetSharing = data.brSharing = '';
//              alert('分成比例信息填写有误，请重新填写！');
//              return false;
//          }
            // if(!isIntType.test(data.estimateLoan)){
            //  data.estimateLoan = '';
            //  alert('预计放款额必须为正整数！');
            //  return false;
            // }
            if(!isIntType.test(data.collNode)){
                data.collNode = '';
                alert('催收节点必须为正整数！');
                return false;
            }
            return true;
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

		function saveParam(item){
            var saveParam = {
                lasPartnerCode : _.statusParamInfo.partnerCode,
                productionCode : _.statusParamInfo.code,
                
                accPartnerCode : item.partnerName,
                fundSharing : item.fundSharing,
                assetSharing : item.assetSharing,
                // brSharing : item.brSharing,
                // estimateLoan : item.estimateLoan,
                collNode : item.collNode,
            };
            if(_.editFlag){ saveParam.id = item.id;};
            return saveParam;
        }
        
        _.productionStatusList = [
                {id : '0' , value : '待生效'},
                {id : '1' , value : '生效'},
                {id : '2' , value : '结束'}
            ];
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
      
        // 删除
        _.deletePair = function(id,item) {
           if (confirm("你确定删除吗？")){
              var param = {
                id : id
              }
           service.delete(param).then(function(data){
    
                 item.imgsIcon = true;
                 var cfg = {productionCode : item.productionCode};    
                 service.getPairList(cfg).then(function(data){
                    item.pairLists = data.accpartnerlist;
                    if (item.pairLists.length == 0) {
                        item.addShow = false;
                        item.imgsIcon = false;
                        item.configStatus = "0";
                    }
                 },function(data){  
                    alert(data.responseMsg)
                 });


           },function(reason){
             alert(reason.responseMsg);
           })
         } else {

         }
          
        }

        //编辑
        _.openPair = function(item = undefined,ite){
           
            //新建/编辑默认项
            getSelectInfo(item);
            _.dialogShow = true;
            mask.show({height:_.getClientHeight()});
            item ? render(item,_.statusParamInfo) : render(_.statusParamInfo);

        }

        _.savePair = function(){
            if(!validateParam(_.production)) return;
              
             service.save(_.production).then(function(data){
            // service.save(saveParam(_.production)).then(function(data){
                alert(data.responseMsg);
                _.dialogShow = false;
                mask.hidden();
                // o.getUserInfoList();
                
                 var cfg = {productionCode : _.production.productionCode};    
                 service.getPairList(cfg).then(function(data){

                        _.pairList.forEach(function(item){
                           if (item.productionCode == _.production.productionCode) {
                              item.imgsIcon = true;
                              item.pairLists = data.accpartnerlist;
                              item.addShow = true;
                              item.con = "－";
                              item.configStatus = "1";
                           }
                            
                        });
                   
                 },function(data){  
                    alert(data.responseMsg+'66')
                 });
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
            _.production.accPartnerCode = addInfo ? item.accPartnerCode : '';
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
                var param = JSON.parse(JSON.stringify(_.productions));
                for(var item in param){
                	if(item == 'isFirst') continue;
                    if(!param[item]) delete param[item];
                }
              
                 
                service.getProductionaccpartnerList(param).then(function(data){
                		if(data.page.result) _.pairList = data.page.result || [];
                        
                        
                        _.pairList.forEach(function(item){
                            item.imgsIcon = false;
                            item.addShow = false;
                            if (item.configStatus == "1") {
                                item.addShow = true;
                                item.con = "＋";
                            } else {
                                 item.addShow = false;
                            }


                            for(var i = 0; i < _.productionStatusList.length; i++) {
                                if (_.productionStatusList[i].id == item.status) {
                                    item.status = _.productionStatusList[i].value;
                                }
                            }
                            // _.productionStatusList.forEach(function(i){
                            //     if (item.status === i.id) {
                            //         item.status = i.value;
                            //     }
                            // })
                        });
                       
						_.baseData = paddingData(data);
                		//页码问题
	                    if(data.page.result.length == 0 && _.productions.pageNo !== 1){
	                    	_.productions.pageNo = _.productions.pageNo - 1;
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
            _.productions.pageNo = data.pageSelectedNum;
            o.getUserInfoList();
            _.productions.pageNo = 1;//默认值
        })
}
