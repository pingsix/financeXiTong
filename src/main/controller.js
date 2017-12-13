/**
 * @author hontianyem
 */

import $ from 'jquery';

//日期样式
require('../tools/plugins/jedate/skin/jedate.css');
require('../tools/plugins/jedate/jquery.jedate');

//导航
require('../tools/plugins/jQueryNavHover/js/xq_navbar');

$(function(){
	$("#bar1").xq_navbar({"type":"underline","liwidth":"136px","bgcolor":"#333","hcolor":"#ffba00"});
});

export default angular
	.module('main.ctrl',[
		require('./service').default.name
	])
	.controller('mainCtrl',['$scope','$rootScope','MainService','$timeout','$state',function(scope,$rootScope,service,$timeout,$state){
		var appShell = scope.appShell = {};
		
		//不显示二级导航的路由
		var hiddenSlidBar = ['/manager/editPwd'];
		
        //获取全局时间方法        ***时间插件取名规则（1.开始时间必须包含start文本；2.传入的ID名不能有重复，否则无效）
        var start = {maxDate: $.nowDate(0)};
		var end = {minDate: $.nowDate(-2),maxDate : $.nowDate(0)};
		
        scope.getDate = function(idName,callBack,transmit){
			if(/start/ig.test(idName)){
				//双击时间
				start.choosefun = function(elem,datas){
			        end.minDate = datas;
			        callBack(datas);
			    };
			    //确定
			    start.okfun = function(elem,datas){
			        end.minDate = datas;
			        callBack(datas);
			    }
			    //清除
				start.clearfun = function(elem, val) {callBack('');console.log(38)};
				//自定义 操作开始对象设置
				if(!!transmit && typeof transmit == 'function') transmit(start);
				$(idName).jeDate(start);
			}else{
				end.choosefun = function(elem,datas){
		        	start.maxDate = datas;
		        	callBack(datas);
		    	}
				end.okfun = function(elem,datas){
			        start.maxDate = datas;
			        callBack(datas);
			    }
				end.clearfun = function(elem, val) {callBack('');};
				//自定义 操作开始对象设置
				if(!!transmit && typeof transmit == 'function') transmit(start);
				
				$(idName).jeDate(end);
			}
		}
        
        //获取localstorage中的菜单
        var menu = function(){
			return JSON.parse(localStorage.getItem('menu'));
		};
		
		//类名配置
		var slideBarStyleArr = ['menu1','menu2','menu3','menu4','menu5','menu6'];
        
        //全局的获取页面高度方法
		scope.getClientHeight = function(){
			var clientHeight = document.documentElement.clientHeight;
			var bodyHeight = document.getElementsByTagName('body')[0].offsetHeight + 70;
			return bodyHeight >= clientHeight ? bodyHeight + 'px' : clientHeight + 'px' ;
        }
        
        /**
         * 配置一级导航类名
         * @param {Object} path
         */
		function renderTopMenu(path){
				var className = '';
				if(path.indexOf('earnings') !== -1){
					className = 'menu1';
				}
				else if(path.indexOf('configuration') !== -1){
					className = 'menu2';
				}
				else if(path.indexOf('manager') !== -1){
					className = 'menu3';
				}
				else if(path.indexOf('financial') !== -1){
					className = 'menu4';
				}
				return className;
		}
		
			
		/**
		 * rendorTopMenu
		 */
		$rootScope.$on('$locationChangeStart', function (event,next,current){
			var next = decodeURI(next);
			var newArr = [];
			menu().forEach(function(v){
				var newObj = {};
				newObj.text = v.text;
				newObj.path = v.children[0].href.slice(0);
				newObj.children = v.children;
				newObj.menuName = renderTopMenu(newObj.path);
				var realChunk = next.slice(next.indexOf("#/") + 2);
				var currentPath = realChunk.slice(0,next.indexOf("/"));
				if(newObj.path == realChunk || newObj.path.indexOf(currentPath) !== -1){
					newObj.selected = true;
				}
				newArr.unshift(newObj);
			})
			appShell.topMenu = newArr;
			renderSlideBar(next);
			appShell.isSliderBarShow = slideFlag(next);
			scope.homeUrl = '#/' + newArr[newArr.length-1].path;
		})
		
		var findCurrentChilds = function(){
			var slideBar = [];
			appShell.topMenu.forEach(function(v){
				if(v.selected){
					slideBar = v.children;
				}
			})
			return slideBar;
		}
			
		//不存在边导航的归属定向
		function selectRedirect(v,CompareCrrent,wholeUrl,currentRoute){
			if(v.href === CompareCrrent && wholeUrl.indexOf(currentRoute) !== -1) v.selected = true;
		}
				
			
		
		/**
		 * rendorSlideBar
		 */
		function renderSlideBar(next){
			var currentSlideBar = findCurrentChilds();
			currentSlideBar.forEach(function(v,i){
			    v.href = v.href.slice(v.href.indexOf('/') + 1);
			    if(next.indexOf(v.href) !== -1) v.selected = true;
			    v.menuName = slideBarStyleArr[i];
				selectRedirect(v,'role',next,'newRole');
			})
			var defaultFirstSelect = currentSlideBar.every(function(k){
				if(!k.selected){
					return true;
				}
			})
			if(defaultFirstSelect && currentSlideBar.length){
				currentSlideBar[0].selected = true;
			}
//			console.log('currentSlideBar',currentSlideBar)
			appShell.slideBar = currentSlideBar;
		}
		
		
		function slideFlag(url){
			var isHad = hiddenSlidBar.some(function(v){
				return url.indexOf(v) !== -1 ? true : false;
			})
			return isHad ? false : true; 
		}
		
		
		/**
		 * 用户操作
		 */
		appShell.home = function(){
			location.href = scope.homeUrl;
		}
		
		appShell.userOperate = {
			modifyPassword : '修改密码',
			userExit : '退出登录',
		}
		
		appShell.currentUser = localStorage.getItem('username');
		var operateList = document.getElementById('operateList');
		var optChaildCount = operateList.getElementsByTagName('li').length;
		appShell.userOver = function(){
			operateList.style.height = optChaildCount * 40 + 'px';
			appShell.userOper = !appShell.userOper;
		}
		
		appShell.userOut = function(){
			appShell.userOper = !appShell.userOper;
		}
		
		appShell.usermodifyPwd = function(){
			var param = {
				id : localStorage.getItem("id"),
				userId : localStorage.getItem('userId')
			}
			$state.go('manager.editPwd',{'object':JSON.stringify(param)});
		}
		appShell.userExit = function(){
			service.userExit();
		}
		
		
		/**
		 * 列表页展示数据过多时——操作栏浮动
		 */
		function toolsBarFix(){
			let toolsBar = $('.hdFixed');
			if(toolsBar && toolsBar.size() == 1 && toolsBar.children().size() !== 0 ){
				var Y= $(window).scrollTop();
				if(Y > 240){
					toolsBar.addClass('tableHDFixed');
					if(defaultNav){
						toolsBar.css("left",'23px');
					}
					else{
						toolsBar.css("left",'140px');
					}
				}else{
					toolsBar.removeClass('tableHDFixed');
				}
			}
		}
		
		
		//显示隐藏——边导航
		var defaultNav = false;
		scope.handleViewSize = function(){
			var dataView = $(".inner");
			defaultNav = defaultNav ? false : true;
			dataView.css({"marginLeft": defaultNav ? "0" : "118px"});
			toolsBarFix();
		}
		
		
		$(window).scroll(toolsBarFix);
		
	}])
