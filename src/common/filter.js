
export default angular
	.module('common.filter',[])
	.filter('test',function(){
		return function(input){
			return input
		}
	})
