
import './editform.css';

    /**
     * 把服务器的日期格式转化为文字
     * @param date
     * @returns {*}
     */
    var toDateString = function(date) {
        if (typeof date !== 'object' || date === null || !date.time) return '';
        return (new Date(date.time)).toLocaleDateString().replace(/\//g, '-');
    };

    /**
     * 给数组的开头加入一项
     * @param array
     * @param idKey
     * @param nameKey
     * @returns {*}
     */
    var unshiftOption = function(array, option) {
        if (!Array.isArray(array)) array = [];
        array.unshift(option);
        return array;
    };

    /**
     * 把某个属性的属性值覆盖另一个属性的属性值
     * @param array
     * @param srcProp
     * @param aimProp
     * @returns {*}
     */
    var coverTheProp = function(array, srcProp, aimProp) {
        if (Array.isArray(array)) {
            array.forEach(function(item) {
                item[aimProp] = item[srcProp];
            });
        } else if (typeof array == "object" && !!array) {
            array[aimProp] = array[aimProp];
        }
        return array;
    };
   
    /**
     * FieldList数据转化器
     * @type {{m2vm: FieldListTranslater.m2vm, vm2m: FieldListTranslater.vm2m}}
     */
    var FieldListTranslater = {

        /**
         * 把数据转化为视图数据
         * @param items
         * @returns {{}}
         */
        m2vm: function(items, result) {
            if (Array.isArray(items) && items.length > 0) {
                // 循环把所有项都添加到结果中
                items.forEach(function(item) {
                    var code = item.fieldCode;
                    result[code] = {
                        fieldCode: code,
                        isRequired: item.isRequired
                    };
                });
            }
            return result;
        },

        /**
         * 把视图数据转化为数据
         * @param map
         * @returns {Array}
         */
        vm2m: function(map) {
        	var fieldCode,
                isName,
                fieldtype;
            var results = [];
            Object.keys(map).forEach(function(name) {
                var value = Object.assign({}, map[name]);
            	fieldCode = null;
                if (value.isRequired && value.isRequired === "1") {
                    fieldCode = name;
                }
                if (fieldCode || value.fieldCode) {
                    results.push({
                        fieldCode: name,
                        isRequired:  value.isRequired || "0",
                    });
                }
            });
            return results;
        }
    };

    /**
     * production数据转化器
     * @type {{m2vm: ProductionTranslater.m2vm}}
     */
    var ProductionTranslater = {
        m2vm: function(production) {
            production.closingDate = toDateString(production.closingDate);
            production.effectiveDate = toDateString(production.effectiveDate);
            return production;
        }

    };

    /**
     * 基础数据转化器
     * @type {{m2vm: BaseDataTranslater.m2vm}}
     */
    var BaseDataTranslater = {
		
        m2vm: function(data) {
            //新增写死的还款方式下拉
            var guaranteeList = [
			        {repayId : '0', value : '无'},
			        {repayId : '1', value : '有'}
		        ];
            var paymentTypeLists = [
                    {repayId : '0', value : '等额本息'},
                    {repayId : '1', value : '等本等息'}
            ];
            return {
            	 guaranteeList: unshiftOption(guaranteeList, {
                	value : "请选择"
                }),
                paymentTypeLists: unshiftOption(paymentTypeLists, {
                    value : "请选择"
                }),
                partnerTypeList: unshiftOption([{"id":"0","typeName":"Ⅱ类机构（资金方）"},{"id":"1","typeName":"Ⅲ类机构（资金资产方）"}], {
                    typeName: "请选择"
                }),
                groups: unshiftOption(data.groups, {
                    groupName: "请选择"
                })
            };
        }
    };
var dependArr = [
	require('./newOrganic.service').default.name
]
export default {
	module : angular.module('newOrganicCtrl',dependArr).controller('newOrganicController', ['$scope', 'newOrganicService', '$state', '$stateParams', controller]),
	template : require('./newOrganic.template.html')
}
	
function controller($scope,service,$state,$stateParams){
		var ctrlCount = 0,stateparam;
        // 基础数据
        $scope.base = {};
        $scope.triggerPwd = false;
        $scope.production = {
        	partner_code : "",
            groupId : "",
            repayId : "", 
        };
        try{
        	if($state.params && $state.params.object && typeof $state.params.object === 'string') stateparam = JSON.parse(decodeURI($state.params.object));
        }catch(e){}
        // 是否显示验证信息
        $scope.showValid = false;

        // 获取基本数据
        var getBaseData = function(fn) {
            service.getBaseData().then(function(data) {
            	$scope.productionBaseData = data;
            	if(fn &&($scope.renderAgent === 'viewDetail' || $scope.renderAgent === 'upDate')){
            		fn(BaseDataTranslater.m2vm(data));
            	}else{
            		$scope.base = BaseDataTranslater.m2vm(data);
            	}
            });
        };
        
        // 获取编辑页选择条件数据
        var getEditBaseData = function(fn){
        	service.getEditBaseData().then(function(data) {
        		// console.log('edit.do:',data)
            	$scope.productionBaseData = data;
            	if(fn &&($scope.renderAgent === 'viewDetail' || $scope.renderAgent === 'upDate')){
            		fn(BaseDataTranslater.m2vm(data));
            	}else{
            		$scope.base = BaseDataTranslater.m2vm(data);
            	}
            });
        }
        
        $scope.timeFlag = function(timFlag){
        	$scope.timFlag = '';
        	if(timFlag == 'EFFECT'){
        		$scope.timFlag = 'EFFECT';
        	}
        	else if(timFlag == 'CLOSE'){
        		$scope.timFlag = 'CLOSE';
        	}
        }
        
        $scope.changes = function (ha) {
            console.log(ha);
        }
        /**
         * 单击保存的处理方法
         */
        $scope.save = function(isValid,isPristine) {
            // console.log('000');
            // console.log(isValid);
            // console.log(isPristine);
            // 先判断验证是否通过
            if (!isValid) {
                $scope.showValid = true;
				
                // fixme 滚动到顶部，这个不是最优的，是针对这个页面的临时处理办法
                document.body.scrollTop = 0;
                
                return;
            }

            if(!$scope.production.partner_code) $scope.production.partnerCode = $scope.productionBaseData.partner_code;
			if(stateparam && stateparam.upDate){
				if(!isPristine && confirm('您已对当前产品进行编辑，保存则生成新版本，是否继续？')){
		            console.log('$scope.production保存',$scope.production)
//		            return
		            if($scope.production.privatePfx) delete $scope.production['privatePfx'];
		            if($scope.production.publicCer) delete $scope.production['publicCer'];
		              
		            //---
		            for(var i = 0,groups = $scope.base.groups; i < groups.length ; i++){
		            	if(groups[i].groupId == $scope.production.partnerAdmin){
		            		$scope.production.partnerAdminName = groups[i].groupName;
		            	}
		            }
					service.upDatePro($scope.production).then(function(data) {
               			location.href = '#/configuration/production';
            		});
				}
				return;
			} 
            // console.log($scope.base.groups)
			console.log(230,$scope.production)
            service.update($scope.production).then(function(data) {
                location.href = '#/configuration/production';
            },function(reason){
            	alert(reason.responseMsg);
            });
        };
        //请求成功处理基础数据
		function render(data){
			switch ($scope.renderAgent){
				case 'upDate' :
					$scope.upBtnFlag = true;
					$scope.production = addProInfo(data,getEditBaseData);
					break;
				case 'viewDetail' :
				    $scope.isView = true;
//				    $scope.production = data;
				    $scope.production = addProInfo(data,getEditBaseData);
					break;
				default :
//					alert(2)
			}
//          $scope.production = ProductionTranslater.m2vm(data.production);
//          addProInfo($scope.production, data);
//          FieldListTranslater.m2vm(data.production.proFieldList, $scope.proFieldMap);
        }
		


		// 添加production中选项的name值
		function addProInfo(getData, baseSelect) {
			baseSelect(function(data){
				$scope.base = data;
                // console.log($scope.base)
				if(getData.partnerType && Array.isArray(data.partnerTypeList)){
					data.partnerTypeList.forEach(function(v){
						if(v.id === getData.partnerType) getData.partnerTypeName = v.typeName;
					})
				}
				if(getData.guarantee && Array.isArray(data.guaranteeList)){
					data.guaranteeList.forEach(function(v){
						if(v.repayId === getData.guarantee) getData.guaranteeName = v.value;
					})
				}

                if(getData.paymentType && Array.isArray(data.paymentTypeLists)){
                    
                    data.paymentTypeLists.forEach(function(v){
                        if(v.repayId === getData.paymentType) {
                            getData.paymentTypeName = v.value;
                            
                        }
                    
                    })
                }
				if(getData.partnerAdmin && Array.isArray(data.groups)){
					data.groups.forEach(function(v){
						if(v.groupId === getData.partnerAdmin){
//							getData.partnerAdmin = v.groupId;
							getData.partnerAdminName = v.groupName;
						}
					})
				}
			})
			return getData;
		}
		
		/**
		 * 生成证书
		 */
		$scope.creatCertificate = function(){
			if(!$scope.production.partnerName) return;
			var cfg = {
				partnerName : $scope.production.partnerName
			}
			if(ctrlCount) return;
			ctrlCount += 1; 
			service.creatCertificate(cfg).then(function(data){
				$scope.production.certName = data.public_cer;
				$scope.production.pfxName = data.private_pfx;
			},
			function(reason){
				alert(reason.responseMsg);
			})
		}
		
		
        /**
         * 单击
         * @parame
         */
        $scope.back = function(e) {
            history.back();
        };
        var init = function() {
        	$scope.renderAgent = "";
			var cfg = {};
			cfg = {
				id : $stateParams.id,
				productionCode: $stateParams.productionCode,
				version: $stateParams.version
			}
			for(var screen in cfg){
				if(cfg[screen] === 0) continue;
				if(cfg[screen] === '' || cfg[screen] === undefined ){
					delete cfg[screen];
				}
			}
			//新建获取基本数据；
            if(!stateparam) getBaseData();
            
			//编辑版本
			if(stateparam && stateparam.upDate){
                $scope.renderAgent = 'upDate';
				var param = {
					id : stateparam.id,
					pageNo: 1,
					pageSize:10
				}
               
				service.get(param).then(function(data) {
                   
					if(data && data.page && data.page.result)
                    render(data.page.result[0]);
                }, function(reason) {
                    alert(reason.responseMsg);
                });
			}
			//查看版本
			if(stateparam && stateparam.isView){
				$scope.renderAgent = 'viewDetail';
				var param = {
					id : stateparam.id,
					pageNo: 1,
					pageSize:10
				}
               
				service.get(param).then(function(data) {
                    
					if(data && data.page && data.page.result)
                    render(data.page.result[0]);
                }, function(reason) {
                    alert(reason.responseMsg);
                });
			}
        };

        init();
};

