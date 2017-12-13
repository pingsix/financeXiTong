/**
 * 
 * @param {Object} util
 * @param {Object} ajax
 */

function service(util,ajax){
	return {
        save : function(cfg){
        	return ajax.post('/acc/productionaccpartner/save.do',cfg);
        },
        getPairList : function(cfg){
        	return ajax.post("/acc/productionaccpartner/accpartnerlist.do",cfg);
        },
        getAccSideList : function(cfg){
        	return ajax.post("/acc/productionaccpartner/bankrollParList.do",cfg);
        }
	}
}

export default angular
	.module('pairOrgSer',[])
	.factory('pairOrgService',['util','ajax',service])