/**
 * 
 */
export default angular
	.module('main.service',[])
	.factory('MainService',['ajax',function(ajax){
		return {
			userExit : function(cfg){
				ajax.post(ajax.DOMAIN + "/acc/user/logout.do",cfg).then(
					function(data){
						if(data.responseCode=="000"){
	                        localStorage.removeItem('menu');
	                        localStorage.removeItem('id');
	                        localStorage.removeItem('roleId');
	                        localStorage.removeItem('jurisdiction');
	                        localStorage.removeItem('jurisdictionU');
	                        localStorage.removeItem('userId');
	                        localStorage.removeItem('username');
						}
						location.href='login.html';
					},
					function(reason){
						console.log('reason',reason)
					}
				)
			},
		}
	}])