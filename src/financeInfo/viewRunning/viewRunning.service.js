/**
 * 
 */
export default angular
	.module('viewRunningSer',[])
	.factory('viewRunningService',['util','ajax',service]);

function service(util,ajax){
	return {
        swiftAccount : function(cfg){
            return ajax.post("/acc/borrowerInformation/selectSwift.do",cfg);
        },
	};
}
