/**
 * gloabl directive Hub
 * @author HontianYem
 */


let globalDirective = angular.module('globalDirective',[]);

/**
 * register directive with label directive name;
 */
globalDirective
//down-load-btn
.directive('downloadBtn',['$q',downloadBtnFn])

//elem click-style
.directive('behavior',['$q',behaviorFn])

.directive('subalert',subalertFn)

.directive('subconfirm',subconfirmFn)

.directive('slideBtn',slideBtnFn)

//自带遮罩和弹出框架
.directive('cloakFrame',['$q',cloakFrameFn])


function cloakFrameFn(){
	function controller(scope,$q){
		var bodyStyle = document.getElementsByTagName('body')[0].style,deffered;
		//弹框头名字
		scope.alertMsg = {
			heardMsg : scope.head ? scope.head : (scope.subjoin ? scope.subjoin : ''),
		}
		
		//自动在父作用域创建以传进来名字的函数,在父作用域调用会返回promise对象；	
		if(scope.name){
			scope.$parent.$parent.$parent[scope.name] = function(bool,btnFlag){
				deffered = $q.defer();
				if(typeof bool === 'undefined' || bool === true){
					scope.isShowAlert = true;
					bodyStyle.overflowY = 'hidden';
					scope.btnFlag = btnFlag;
				}else{
					scope.isShowAlert = false;
					bodyStyle.overflowY = 'auto';
				}
				return deffered.promise;
			}
		}else{
			scope.$parent.$parent[scope.cloakSubmit] = function(bool){
				deffered = $q.defer();
				if(typeof bool === 'undefined' || bool === true){
					scope.isShowAlert = true;
					bodyStyle.overflowY = 'hidden';
				}else{
					scope.isShowAlert = false;
					bodyStyle.overflowY = 'auto';
				}
				return deffered.promise;
			}
		}
		
		//弹框按钮处理
		scope.handleAffirm = function(type){
			if(!!scope.validate && type && !scope.name){
				var validateList = scope.validate();
				for(let key in validateList){
					if(validateList[key]) return scope.validate({errorKey:key});
				}
			}
			type ? deffered.resolve(true): deffered.resolve(false);
			scope.isShowAlert = false;
			bodyStyle.overflowY = 'auto';
		}
	}
	return {
		restrict :　"EA",
		transclude: true,
		scope : {
			//提交弹框函数名
			name : '@name', 
			cloakSubmit : '@cloakSubmit',
			
			head : '@head',             
			subjoin : '@subjoin',      
			validate : '=validate'          
		},
		template : `<div ng-show="!!isShowAlert" class="sub-alert-cloak">
						<div class="cloak-form-wrap">
							<div class="cloak-form-head">
								<span ng-bind="alertMsg.heardMsg"></span>
								<span class="cloak-form-cancel2" ng-click="handleAffirm(false)">X</span>
							</div>
							<div class="cloak-form-body" ng-transclude></div>
							<div class="cloak-form-foot">
								<button ng-if="!btnFlag" class="cloak-form-affirm" ng-click="handleAffirm(true)">确认</button >
								<button class="cloak-form-cancel" ng-click="handleAffirm(false)">{{ btnFlag ? '关闭' : '取消' }}</button>
							</div> 
						</div>
					</div>`,
		controller : ['$scope','$q',controller]
	}
}

/**
	 * @name   滑动按钮
	 *
	 * @param name     / 选填 / 按钮状态名
	 * @param callback / 必填 / 调用父controller的回调函数
	 * @param ng-model / 必填 / 监听改变按钮状态（显示打开或关闭和状态名）
	 */
	var btnWrap="width:28px;height:16px;display:inline-block;border-radius:16px;background:#00c0ef;border:1px solid #ccc;position:relative;top:4px;";
	var btnBlock="width:16px;height:16px;border-radius:16px;display:inline-block;position:absolute;cursor:pointer;background:#fff;";
	function slideBtnFn(){
		function link(scope,elem,attr,ctrl){
			if(!scope.model) throw new Error('如需正确渲染，请在组件ngModel属性中传正确的对象! 提示：包含status属性的对象，且status的值必须区分为真假值。');
			var status = !!scope.model.status;
			let btn = elem.context.childNodes[0].childNodes[0].childNodes[0];
			function checked(btn){
				btn.style = `${btnBlock}right:0`;
				btn.parentNode.style = `${btnWrap}background:#00c0ef`;
			}
			function unchecked(btn){
				btn.style = `${btnBlock}left:0`;
				btn.parentNode.style = `${btnWrap}background:#ccc`;
			}
			function init(state){
				status ? checked(btn) : unchecked(btn);
			}
			scope.changeStyle = function(){
				status = !status;
				status ? checked(btn) : unchecked(btn);
			}
			init(status);
		}
		function controller(scope){
			scope.changeStatus = function(){
				if(!scope.click) throw new Error('如需执行操作请在组件callback属性中传回调函数.如果已传,请确认函数已传函数是否真实有效!');
				scope.click(scope.model,function(){
					scope.changeStyle();
				});
			}
		}
		return{
			strict : 'AE',
			template : `<div ng-show="!!isShowAlert" class="sub-alert-cloak">
							<div class="sub-alert-wrap">
								<div class="sub-alert-head">
									<span ng-bind="alertMsg.heardMsg"></span>
									<span class="sub-alert-cancel2" ng-click="handleAffirm(false)">X</span>
								</div>'  +
								<div ng-bind="alertMsg.bodyMsg" class="sub-alert-body"></div>'  +
								<div class="sub-alert-foot">'  +
									<button class="sub-alert-affirm" ng-click="handleAffirm(true)">确认</button >
									<button class="sub-alert-cancel" ng-click="handleAffirm(false)">取消</button>
								</div> 
							</div>
						</div>`,
			scope : {
				model : '=ngModel',
				name  : '=name',
				click : '=callback'
			},
			controller : ['$scope',controller],
			link:link
		}
	}
	
	
	
	
	
	
	/**
	 * @name   subconfirm (模拟浏览器提示框)
	 *
	 * @param name / 必填 / 会在父scope中创建以name命名的回调函数（返回promise对象,值为boolean值）
	 * @param head    / 选填 / 提示框的头部
	 */
	function subconfirmFn(){
		function controller(scope,$q){
			var bodyStyle = document.getElementsByTagName('body')[0].style,deffered;
			scope.$parent[scope.name] = function(content){
				deffered = $q.defer();
				scope.isShowAlert = true;
				bodyStyle.overflowY = 'hidden';
				scope.alertMsg = {
					heardMsg : scope.head,
					bodyMsg : content
				}
				return deffered.promise;
			}
			scope.handleAffirm = function(type){
				type ? deffered.resolve(true) : deffered.resolve(false);
				scope.isShowAlert = false;
				bodyStyle.overflowY = 'auto';
			}
		}
		return {
			strict : 'AE',
			template :  '<div ng-show="!!isShowAlert" class="sub-alert-cloak">' +
							'<div class="sub-alert-wrap">'  +
								'<div class="sub-alert-head">'  +
									'<span ng-bind="alertMsg.heardMsg"></span>'  +
									'<span class="sub-alert-cancel2" ng-click="handleAffirm(false)">X</span>'  +
								'</div>'  +
								'<div ng-bind="alertMsg.bodyMsg" class="sub-alert-body"></div>'  +
								'<div class="sub-alert-foot">'  +
									'<button class="sub-alert-affirm" ng-click="handleAffirm(true)">确认</button >'  +
									'<button class="sub-alert-cancel" ng-click="handleAffirm(false)">取消</button>'  +
								'</div>'  +
							'</div>'  +
						'</div>',
			scope : {
				name : '@name',
				head : '@head'
			},
			controller : ['$scope','$q',controller]
		}
	}
	
	
	
	
	
	
	/**
	 * @name   subalert (模拟浏览器提示框)
	 *
	 * @param name / 必填 / 会在父scope中创建以name命名的回调函数（返回promise对象,值为boolean值）
	 */
	function subalertFn(){
		function controller(scope,$q){
			var bodyStyle = document.getElementsByTagName('body')[0].style,deffered;
			scope.$parent[scope.name] = function(content){
				deffered = $q.defer();
				scope.show = true;
				bodyStyle.overflowY = 'hidden';
				scope.alertMsg = {
					heardMsg : '应用提示',
					bodyMsg  : content
				}
				return deffered.promise;
			}
			scope.handleAffirm = function(){
				scope.show = false;
				bodyStyle.overflowY = 'auto';
				deffered.resolve();
			}
		}
		return {
			strict : 'AE',
			template :  '<div ng-show="show" class="sub-alert-cloak">' +
							'<div class="sub-alert-wrap">'  +
								'<div class="sub-alert-head">'  +
									'<span ng-bind="alertMsg.heardMsg"></span>'  +
								'</div>'  +
								'<div ng-bind="alertMsg.bodyMsg" class="sub-alert-body"></div>'  +
								'<div class="sub-alert-foot">'  +
									'<button class="sub-alert-affirm" ng-click="handleAffirm()">确认</button >'  +
								'</div>'  +
							'</div>'  +
						'</div>',
			scope : {
				name : '@name'
			},
			controller : ['$scope','$q',controller]
		}
	}




/**
 * @name down-load-btn
 * @param {name,lock,ngClick,alertMsg}
 * @param name : 自定义按钮名称;
 * @param lock : 当值为真时锁定交互样式并且禁用ng-click回调函数;
 */
function downloadBtnFn($q){
	let link = (scope,element,attr) => {
		scope.$watch('isLock',function(){
			element.text(attr.name);
			element.addClass('dir-down-btn');
			if(scope.isLock){
				element.addClass('mouseover');
			}
			else {
				element.removeClass('mouseover');
			}
			element.on('mousedown',function(){
				console.log('down')
			})
			element.on('mouseup',function(){
				console.log('up')
			})
		})
	}
	return {
		restrict :　"EA",
		scope : { 
			isLock : "=lock",
		},
		link : link
	}
}


/**
 * @name behavior
 */
function behaviorFn(){
	let link = (scope,element,attr) => {
		element.on('mousedown',function(){
			element.addClass('behavior-mouse-down')
		})
		element.on('mouseup',function(){
			element.removeClass('behavior-mouse-down')
		})
	}
	return {
		restrict :　"A",
		link : link
	}
}


export default globalDirective;