export default angular
	.module('newUserSer',[])
    .factory('newUserService',['util','ajax','validator',newUserService]);
function newUserService(util,ajax,validator){
        var doc = document,
            jq = angular.element;
        return {
            //获取列表
            getUserInfoList : function(cfg){
                return ajax.post('/acc/reviewuser/new.do',cfg);
            },
            formSubmit : function(cfg){
                var that = this;
                if(cfg.userId == ''){
                	jq(util.getById('username1')).addClass('red-border');
                    util.getById('username1').focus();
					alert('账号不能为空！');
                    return;
                }
                if(/(?=[\x21-\x7e]+)[^A-Za-z0-9]/.test(cfg.userId)){
                	jq(util.getById('username1')).addClass('red-border');
                    util.getById('username1').focus();
					alert('账户名不能包含特殊符号！');
                    return;
				}
                if(!/^(?!\d+$)[\da-zA-Z]*$/.test(cfg.userId)){
                	jq(util.getById('username1')).addClass('red-border');
                    util.getById('username1').focus();
					alert('账户名不能为中文或纯数字！');
                    return;
				}
                if(validator.isEmpty(cfg.userName)){
                    jq(util.getById('realName')).addClass('red-border');
                    util.getById('realName').focus();
                    alert('用户名不能为空')
                    return;
                }
                var reg=/^[\u4E00-\u9FA5]{2,}$/g;
                if(!reg.test(cfg.userName)){
                    jq(util.getById('realName')).addClass('red-border');
                    util.getById('realName').focus();
                    alert("姓名长度不能少于2位，仅可以输入汉字");
                    return;
                }
                if(!cfg.email){
		            jq(util.getById('userMail')).addClass('red-border');
		            util.getById('userMail').focus();
		            alert('邮箱不能为空');
		            return;
                }
               	var regEmail = new RegExp("^\\w+((-\\w+)|(\\.\\w+))*\\@[A-Za-z0-9]+((\\.|-)[A-Za-z0-9]+)*\\.[A-Za-z0-9]+$","g");
                if(!validator.isEmpty(cfg.email)){
                	 if(!regEmail.test(cfg.email)){
		                jq(util.getById('userMail')).addClass('red-border');
		                util.getById('userMail').focus();
		                alert('邮箱格式错误');
		                return;
		            }
                }
                if(!validator.isEmpty(cfg.tel)){
                	if(!/^((0\d{2,3}-\d{7,8})|(1[3584]\d{9}))$/.test(cfg.tel)){
	                    jq(util.getById('userTel')).addClass('red-border');
	                    util.getById('userTel').focus();
	                    alert('手机格式错误')
	                    return;
                	}
                }
                
                ajax.post('/acc/reviewuser/addUser.do',cfg).then(function(data){
		            alert('随机密码已发送')
		            location.href="#/manager/user";
		        });
               
            },
            formSubmit01 : function(cfg,fn){
                var usernameDom = util.getById('username1'),
                    savaDom = util.getById('save');
                if(validator.isEmpty(cfg.username)){
                    jq(usernameDom).addClass('red-border');
                    savaDom.focus();
                    //alert("请输入账号")
                    return;
                }
            },
            usernameKeyup : function(text){
            	if(!validator.isEmpty(text)){
                    jq(util.getById('username1')).removeClass('red-border');
                }
            },
            realNameKeyup : function(text){
                if(!validator.isEmpty(text)){
                    jq(util.getById('realName')).removeClass('red-border');
                }
            },
             userMailKeyup : function(text){
                if(!validator.isEmpty(text)){
                    jq(util.getById('userMail')).removeClass('red-border');
                }
            },
             userTelKeyup : function(text){
                if(!validator.isEmpty(text)){
                    jq(util.getById('userTel')).removeClass('red-border');
                }
            },
            remarkKeyup : function(text,fn){
                if(!validator.isEmpty(text)){
                    //jq(util.getById('remark')).removeClass('red-border');
                    var newNum=text.length;
                    var number=200-newNum;
                    fn&&fn(number);
                    if(number<0){
                        event.returnValue = false;
                    }
                }
            }
        };
    }

