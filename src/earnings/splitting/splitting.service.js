function service(util,ajax){
	return {
        downLoadFile : function(cfg){
	        var param = '';
	        for(var params in cfg){
	            param += params + '=' + cfg[params]  + '&'
	        }
	        var url = '/acc/productionsummarypro/downloadExcel.do?' + param;
		    url = url.slice(0,-1);
		    location.href = url;
        },
        getSplittingList : function(cfg){
        	return ajax.post('/acc/productionsummarypro/selectDetail.do',cfg);
        },
        getSelectList : function(cfg){
        	return ajax.post('/acc/productionsummarypro/selectAccPartner.do',cfg);
        }
	}
}

export default angular
	.module('splittingSer',[])
	.factory('splittingService',['util','ajax',service])

