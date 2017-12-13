/**
 * 
 */
export default angular
	.module('loanMenInfoSer',[])
	.factory('loanMenInfoService',['util','ajax','validator',service]);
	
function service(util,ajax){
		return {
            /**
	          * 获取待审列表
	          * @param {JSON} cfg
	          */
            getLoanMenInfoList : function(cfg){
                return ajax.post("/acc/productionloan/selectLoan.do",cfg);
            },
            /**
	          * 通用 查询
	          * @param {JSON} cfg
	          */
            exprotFile : function(cfg){
            	//导出
            	if('idList' in cfg){
            		if(!cfg.idList.length){
            			alert('请选择要导出的案件')
            			return;
            		}
            		location.href = '/acc/productionloan/downloadExcel.do?idList=' + cfg.idList;
            	}
            	//导出全部  筛选后的
            	else{
	            	if(util.isEmptyObject(cfg)){
	            		var param = '';
	            		for(var params in cfg){
	            			param += params + '=' + cfg[params]  + '&'
	            		}
	            		var url = '/acc/productionloan/downloadExcel.do?' + param;
	            		url = url.slice(0,-1);
		            	location.href = url;
	            	}
            	}
                
            },
		}
}
