/**
*	@desc textFilter
*   @last modify : 2016-3-29
*   @author hongtian.yan@100credit.com
*/


    /**
     * 过滤器，转换成中文 1  '单笔'  2 '批量
     */
    var filterFn = function (){
        return function(type){
            return type === 1 ? '单笔' : '批量';
        }
    }


    /**
     * 最新预警信息  1复议2严重
     */
    var approvalStatusFn = function (){
    	return function(type){
    		var text;
            if(type == 2){
            	text = '处理';
                //text = '无';  //0 无
            }else if(type == 1){
                text = '接单';
            }else{
                text = '';
            }
            return text
    	}
    }



    /**
     * 状态  0、1监控中2人工停止3监控到期 
     */
    var priorityFn = function (){
        return function(type){

            var text;
            if(type == "50"){
                text = '普通';
            }else if(type == "70"){
                text = '紧急';
            }else if(type == "100"){
                text = '立即';
            }
            return text;
        }
    }
    
    
    
    /**
     * 进件类型
     */
     var approvalTypeFn = function(){
    	return function(type){
    		var text;
    		if(type == '0'){
    			text = '正常';
    		}
    		if(type == '1'){
    			text = '复议';
    		}
    		return text;
    	}
    }
     
     
     
    var stab_auth_2Fn = function(){
    	return function(type){
    		var text = '',
    			linkInfo = [
    			'身份证和手机号有关联',
    			'身份证和邮箱地址有关联',
    			'手机号和邮箱地址有关联'
    			],
    			linkInfo2 = [
    			'身份证和手机号无关联',
    			'身份证和邮箱地址无关联',
    			'手机号和邮箱地址无关联'
    			],
    			i = 0;
    		if(typeof type == 'string' && type && type.length){
    			for(;i < type.length ; i++){
	    			if(parseInt(type[i])){
	    				text += linkInfo[i] + ';\n'; 
	    			}
	    			else{
	    				text += linkInfo2[i] + ';\n'; 
	    			}
	    		}
    		}
    		return text;
    	}
    }
    
    
    
    var checkResultFn = function(){
    	return function(type){
    		var text = '';
    		if(type == '3'){
    			text = '审批通过'
    		}
    		else if(type == '4'){
    			text = '审批拒绝'
    		}
    		return text;
    	}
    }
    

    
 	/**
 	 * 进件查询 1.未接单，2.处理中，3.审批通过，4.审批拒绝
 	 */
 	var approvalStatusSearchFn = function (){
        return function(type){
            var text;
            switch(type){
                case 1:
                case '1':
                    text = '未接单';
                    break;
                case 2:
                case '2':
                    text = '审批中';
                    break;
                case 3:
                case '3':
                    text = '审批通过';
                    break;
                case 4:
                case '4':
                    text = '审批拒绝';
                    break;
            }
            return text;
        }
    }
 	
 	
 	var transformNameFn = function(){
 		return function (key){
 			var text;
 			switch (key){
 				case 'c_edu_graduate_985' :
	 				text = '985高校毕业';
	 				break;
	 			case 'c_society_talent' :
	 				text = '社交达人';
	 				break;
	 			case 'c_air_q0q4_economy_num' :
	 				text = '近一年飞行次数大于4次';
	 				break;
	 			case 'c_air_q0q4_first_num' :
	 				text = '近一年出行乘坐过头等舱或公务舱';
	 				break;
	 			case 'i_taobaosaler_good' :
	 				text = '四钻及以上的淘宝店主';
	 				break;
	 			case 'c_acm_m1m6_credit_out_stab' :
	 				text = '信用卡半年内有消费';
	 				break;
	 			default : 
	 				text = ''
	 				break;
 			}
 			return text;
 		}
 	}
 	
 	
    /**
     * loan视图  全局将将时间戳，转换成时间
     */
    var timeFilterFn = function (){
        return function(type){
        	if(type && typeof type === 'number'){
        		var time = (new Date(type)).toLocaleString();
        		if(/1\/1\/1/.test(time)) return '';
        		return	time;
        	}
        }
    }
    
    /**
     * loan视图  全局将将时间戳，转换成日期
     */
    var timeDateFilterFn = function (){
        return function(type){
        	if(type && typeof type === 'number'){
        		var time = (new Date(type)).toLocaleDateString();
        		if(/1\/1\/1/.test(time)) return '';
        		return	time;
        	}
        }
    }
    
    
    var toNum0Fn = function (){
        return function(type){
        	return type ? type : 0;
        }
    }
    
    /**
     * 
     */
    var collectionStatusFn = function (){
        return function(type){
        	var text = '';
        	switch(type){
        		case '0' :
        			text = '-';
        			break;
        		case '1' :
        			text = '催收中';
        			break;
        		case '2' :
        			text = '催收结束';
        			break;
        	}
        	return text;
        }
    }
        
     
    var isSuccessFn = function(){
    	return function(type){
    		var text = '';
    		switch(type){
    			case 'success':
    				text = '成功';
    				break;
    			default :
    				text = '失败';
    		}
    		return text;
    	}
    }
     
     var isappStatusFn = function(){
     	return function(type){
     		var text ='';
     		switch(type){
     			case '3':
     				text = '通过';
     			break;
     			case '4':
     				text = '拒绝';
     			break;
     			case '0':
     				text = '待处理';
     			break;
     		}
     		return text;
     	}
     }
     
     
    var deblockFn = function(){
     	return function(type){
     		var text ='';
     		switch(type){
     			case '1':
     				text = '解除锁定';
     			break;
     			case '0':
     				text = '';
     		}
     		return text;
     	}
     }
    var partnerTypeFn = function(){
    	return function(type){
     		var text ='';
     		switch(type){
     			case '0':
     				text = '资金方';
     			break;
     			case '1':
     				text = '资金资产方';
     		}
     		return text;
     	}
    }
    var productionStatusFn = function(){
     	return function(type){
     		var text ='';
     		switch(type){
     			case '0':
     				text = '待生效';
     			break;
     			case '1':
     				text = '已生效';
     			break;
     			case '2':
     				text = '已结束';
     		}
     		return text;
     	}
     }
    
    var configStatusFn = function(){
     	return function(type){
     		var text ='';
     		switch(type){
     			case '0':
     				text = '否';
     			break;
     			case '1':
     				text = '是';
     		}
     		return text;
     	}
     }
    
    var operationFn = function(){
    	return function(type){
    		var text ='';
     		switch(type){
     			case '0':
     				text = '等待提交';
     				break;
     			case '1':
     				text = '已提交';
     				break;
     			case '1':
     				text = '提交失败';
     		}
     		return text;
    	}
    }
    
export default angular
    .module('filter', [])
    /**
     *main视图下  customInfo模块 
     */
        .filter('inputType',filterFn)
	/**
	 *全局           将时间戳，转换成时间 
	 */
		.filter('timeFilter',timeFilterFn)
	
	/**
	 *全局           将时间戳，转换成日期 
	 */
		.filter('timeDateFilter',timeDateFilterFn)
		
    /**
     * loan视图 customManager 贷中监控客户管理
     */
        .filter('approvalStatus',approvalStatusFn)
        .filter('priority',priorityFn)
        .filter('approvalType',approvalTypeFn)
        .filter('stab_auth_2',stab_auth_2Fn)
        .filter('transformName',transformNameFn)
        
    /**
     * 命中规则
     */
        .filter('checkResult',checkResultFn)
    /**
     * 用户管理
     */
        .filter('deblockFilter',deblockFn)
        
    /**
     * 配置中心
     */
    	.filter('partnerType',partnerTypeFn)
    	
        .filter('productionStatus',productionStatusFn)
        
        .filter('configStatus',configStatusFn)
        
        
    /**
     * 进件查询
     */
        .filter('approvalStatusSearch',approvalStatusSearchFn)
        
    /**
     * 催收状态
     */
        .filter('collectionStatus',collectionStatusFn)
        .filter('isSuccess',isSuccessFn)
        .filter('appStatus',isappStatusFn)
    /**
     *财务信息
     */
		.filter('toNum0',toNum0Fn)
		.filter('operationFl',operationFn)
		
		//备用路由之间传数据
//		.constant('transform',{
//			noney: ''
//		})
//});