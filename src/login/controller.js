export default angular
	.module('login.ctrl',[])
	.controller('loginCtrl',['$scope','$timeout','loginService',function(_,$timeout,service){
        _.username = localStorage.getItem('br_username') || '';
        _.password = localStorage.getItem('br_password') || '';
        _.rememberFlag = true;
        
		_.click = function(cfg){
            service.formSubmit({
                username:_.username,
                password:_.password,
                checkCode:_.yzm
            },function(cfg){
          		
            });
        }
        _.myKeyup=function(event){
            var e = event || window.event || arguments.callee.caller.arguments[0];
            if(e && e.keyCode==13){ 
                this.click();
            }
        }
        _.usernameKeyup = function(event){
            service.usernameKeyup(_.username);
            document.getElementById('loginCancle1').style.display="block";
        }
        _.passwordKeyup = function(event){
            service.passwordKeyup(_.password);
            document.getElementById('loginCancle2').style.display="block";
        }
        _.yzmKeyup = function(event){
            service.yzmKeyup(_.yzm);
        }
        _.changeCode = function(){
            service.changeCode();
        }
        _.imgCode = service.getCodeUrl();
        _.changeColor1=function(event){
             document.getElementById('uesrname').style.color="#555555" ;

        }
        _.changeColor2=function(event){
            document.getElementById('password').style.color="#555555"  
            
        }
        _.changeColor3=function(event){      
            document.getElementById('yzm').style.color="#555555"  
        }

        _.overBtn=function(){
            document.getElementById('loginBtn').style.backgroundColor="#0ba5e9";

        }
        _.outBtn=function(){
             document.getElementById('loginBtn').style.backgroundColor="#12aef3";
        }

        _.loginCancle=function(){
            document.getElementById('uesrname').value="";
            document.getElementById('loginCancle1').style.display="none";

        }
        _.loginCancle1=function(){
            if(document.getElementById('password').type=="password"){
                 document.getElementById('password').type="text";
            }else{
                 document.getElementById('password').type="password";
            }
           
            document.getElementById('loginCancle1').style.display="none";
        }
	}])
