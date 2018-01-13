import $ from 'jquery';

var dependArr = [
	require('./viewRunning.service').default.name
]
export default {
	module : angular.module('viewRunningCtrl',dependArr).controller('viewRunningController',['$scope','viewRunningService','$timeout','$state','util',controller]),
	template : require('./viewRunning.template.html')
}

function controller(_,service,$timeout,$state){
		'use strict';
		var o,cfg = {};
		var stateParam = JSON.parse(decodeURI($state.params.object));
		// console.log(14,stateParam)
		_.goBack = function(){
			window.history.back();
        }
		
		/**
		 * 各期明细账单信息
		 */
		!function(){
			var childSize = $(".some-period > ul > li").size();
			console.log(15,childSize)
			$(".some-period").height(childSize * 32 +55);
			$(".innerAuto").height(childSize * 32);
		}()
		_.countDetaiInfoWrap = function(count){
			var detailWarpWidth = 340 * count;
			$(".innerWrapper").width(detailWarpWidth);
		}
		
		
        //获取列表
        o = {
            laterQueryList : function(){
                var that = this;
                if(timer){
                    clearTimeout(timer);
                }
                timer = setTimeout(function(){
                    that.getUserInfoList();
                },200);
            },
            getUserInfoList : function(config){
                var cfg = config ||{
                    requestId : stateParam.requestId,              			     //案例号
                    swiftNumber : stateParam.swiftNumberId,                   	 //流水号
                };
                service.swiftAccount(cfg).then(function(data){
                	var dealNum = data.swifts;
                	for(var i in dealNum){
                		if(dealNum[i] == 0){
                			dealNum[i] = '0';
                		}
                	}
                	_.countDetaiInfoWrap(dealNum.length);
                	_.swiftAccount = dealNum;
                	_.swiftDetails = JSON.parse(dealNum[0].content);
                },function(data){
                	alert(data.responseMsg)
                });
            },
            init : function(){
                this.getUserInfoList();
            }
        }
        o.init();
}
