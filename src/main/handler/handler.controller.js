
import './handler.css';

var dependArr = [
	require('./handler.service').default.name
]
export default {
	module : angular.module('handleHeadCtrl',dependArr).controller('handleHeadCtroller', ['$scope', 'handleHeadService', '$state',controller]),
	template : require('./handler.template.html')
}
function controller(_,service,$state,){
	_.stateParams = JSON.parse($state.params.object);
	console.log(10,_.stateParams)
    _.url=window.location.href;
	if(_.url.indexOf('comingDay') !== -1) alert("你的密码已到期，请及时修改密码！");
    
    _.userId = _.stateParams.userId;
    
    _.click = function(cfg){
    	if(!_.oldPassword || !_.newPassword){
    		alert('请完整填写信息！');
        	return;
    	}
        if(_.oldPassword === _.newPassword){
        	alert('新密码不能和旧密码相同！');
        	return;
        }
        if(_.confPassword !== _.newPassword){
        	alert('两次密码输入不一致！');
        	return;
        }
        service.formSubmit({
            id:_.stateParams.id,
            userId: _.stateParams.userId,
            password:_.newPassword,
            oldPassword:_.oldPassword,
        });
    }
    _.back = function(){
        window.history.back();
    }
    _.newPasswordKeyup = function(event){
        service.newPasswordKeyup(_.newPassword);
    }
    _.confPasswordKeyup = function(event){
        service.confPasswordKeyup(_.confPassword);
    }
}
