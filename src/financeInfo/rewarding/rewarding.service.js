/**
 * 
 */
export default angular
	.module('rewardingSer',[])
	.factory('rewardingService',['util','ajax','validator',service]);
	
function service(util,ajax){
		return {
            /**
	          * 获取待审列表
	          * @param {JSON} cfg
	          */
            getLoanMenInfoList : function(cfg){
                return ajax.post("/acc/productionloan/repayment.do",cfg);
            },
            /**
	          * 通用 查询
	          * @param {JSON} cfg
	          */
            exprotFile : function(cfg){
	            if(util.isEmptyObject(cfg)){
	            	var param = '';
	            	for(var params in cfg){
	            		param += params + '=' + cfg[params]  + '&'
	            	}
	            	var url = '/acc/productionloan/downloadRepayment.do?' + param;
	            	url = url.slice(0,-1);
		            location.href = url;
	            }
//				return ajax.post("/acc/productionloan/downloadRepayment.do",cfg).then(function(data){
//					console.log(32,data)
//					location.href = data;
//				});
            },
		}
}
