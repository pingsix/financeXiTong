/**
 * 
 */
export default angular
	.module('overdueSer',[])
	.factory('overdueService',['util','ajax','validator',service]);
	
function service(util,ajax){
		return {
            setSelectedLi : function(current){
                var parent = util.parent(current,'ul');
                    angular.element(parent).find('li').removeClass('selected');
                    angular.element(current).parent().addClass('selected');
            },
            getDate : function(val,fn){
                fn && fn(val);
            },
            /**
	          * 获取待审列表
	          * @param {JSON} cfg
	          */
            getOverDueList : function(cfg){
                return ajax.post("/acc/productionpresentstatus/selectDetail.do",cfg);
            },
            /**
	          * 通用 查询
	          * @param {JSON} cfg
	          */
            exportsFile : function(cfg){
            	var preliminaryTime = function(obj){
			    	if(typeof obj === 'undefined' || obj === null || typeof obj !== 'string') return obj;
			    	var newStr = '',
			    		addStr = '+00:00:00',
			    		strArr = [];
			    		
			    	strArr = obj.split("&");
			    	strArr.forEach(function(v,index,arr){
			    		if(/time|date/ig.test(v) &&
			    			v.indexOf('=') !== -1 &&
			    			v.split('=')[1] !== '' &&
			    			v.split('=')[1].indexOf("+") == -1&&
			    			v.split('=')[1].indexOf('-') !== -1&&
			    			v.split('=')[1].split('-').length === 3&&
			    			v.split('=')[1].split('-')[0].length === 4&&
			    			v.split('=')[1].split('-')[1].length <= 2&&
			    			v.split('=')[1].split('-')[2].length <= 2
			    		){
			    		  arr[index] = v + addStr;
			    		}
			    	})
			    	newStr = strArr.join('&');
			    	return newStr;
			    }
            	
            	if(util.isEmptyObject(cfg)){
	            	var param = '';
	            	for(var params in cfg){
	            		param += params + '=' + cfg[params]  + '&'
	            	}
	            	param = preliminaryTime(param).slice(0,-1);
	            	var url ='/acc/productionpresentstatus/downloadExcel.do?' + param;
		            location.href = url;
	            }
            },
		};
}

	