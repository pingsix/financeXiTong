webpackJsonp([15],{

/***/ 152:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _jquery = __webpack_require__(109);

	var _jquery2 = _interopRequireDefault(_jquery);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var dependArr = [__webpack_require__(153).default.name];
	exports.default = {
	    module: angular.module('viewRunningCtrl', dependArr).controller('viewRunningController', ['$scope', 'viewRunningService', '$timeout', '$state', 'util', controller]),
	    template: __webpack_require__(154)
	};


	function controller(_, service, $timeout, $state) {
	    'use strict';

	    var o,
	        cfg = {};
	    var stateParam = JSON.parse(decodeURI($state.params.object));
	    // console.log(14,stateParam)
	    _.goBack = function () {
	        window.history.back();
	    };

	    /**
	     * 各期明细账单信息
	     */
	    !function () {
	        var childSize = (0, _jquery2.default)(".some-period > ul > li").size();
	        console.log(15, childSize);
	        (0, _jquery2.default)(".some-period").height(childSize * 32 + 55);
	        (0, _jquery2.default)(".innerAuto").height(childSize * 32);
	    }();
	    _.countDetaiInfoWrap = function (count) {
	        var detailWarpWidth = 340 * count;
	        (0, _jquery2.default)(".innerWrapper").width(detailWarpWidth);
	    };

	    //获取列表
	    o = {
	        laterQueryList: function laterQueryList() {
	            var that = this;
	            if (timer) {
	                clearTimeout(timer);
	            }
	            timer = setTimeout(function () {
	                that.getUserInfoList();
	            }, 200);
	        },
	        getUserInfoList: function getUserInfoList(config) {
	            var cfg = config || {
	                requestId: stateParam.requestId, //案例号
	                swiftNumber: stateParam.swiftNumberId };
	            service.swiftAccount(cfg).then(function (data) {
	                var dealNum = data.swifts;
	                for (var i in dealNum) {
	                    if (dealNum[i] == 0) {
	                        dealNum[i] = '0';
	                    }
	                }
	                _.countDetaiInfoWrap(dealNum.length);
	                _.swiftAccount = dealNum;
	                _.swiftDetails = JSON.parse(dealNum[0].content);
	            }, function (data) {
	                alert(data.responseMsg);
	            });
	        },
	        init: function init() {
	            this.getUserInfoList();
	        }
	    };
	    o.init();
	}

/***/ },

/***/ 153:
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	/**
	 * 
	 */
	exports.default = angular.module('viewRunningSer', []).factory('viewRunningService', ['util', 'ajax', service]);


	function service(util, ajax) {
	  return {
	    swiftAccount: function swiftAccount(cfg) {
	      return ajax.post("/acc/borrowerInformation/selectSwift.do", cfg);
	    }
	  };
	}

/***/ },

/***/ 154:
/***/ function(module, exports) {

	module.exports = "<div class=\"main\">\r\n\t<div class=\"inner\" ng-style=\"{'min-height':isShowReportDialog ? '5000px':'auto'}\">\r\n\t    <div class=\"inner-header clearfix\">\r\n\t        <div class=\"inner-header-lf fl\">明细账单流水详情信息</div>\r\n\t    </div>\r\n\t    <div class=\"inner-body viewRunningInner\">\r\n\t    \t<div id=\"detailInfo2\">\r\n\t    \t\t<div id=\"detailInfo\" class=\"sectionMargin\">\r\n\t    \t\t<div class=\"sectionTit\">基本信息</div>\r\n\t    \t\t<ul class=\"sideTitle\">\r\n\t\t    \t\t<li>当前状态数据时间</li>\r\n\t\t\t    \t<li>实际回款日期</li>\r\n\t\t\t    \t<li>本次已偿本金</li>\r\n\t\t\t    \t<li>本次已偿利息</li>\r\n\t\t\t    \t<li>本次已偿滞纳金</li>\r\n\t\t\t    \t<li>本次已偿逾期管理费</li>\r\n\t\t\t    \t<li>本次已偿服务费</li>\r\n\t\t\t    \t<li>本次已偿总金额</li>\r\n\t\t\t    \t<li>流水统计方式</li>\r\n\t\t\t    \t<li>当期状态</li>\r\n\t\t    \t</ul>\r\n\t    \t\t<ul ng-repeat = \"item in swiftAccount\">\r\n\t    \t\t\t<li ng-bind = \"item.presentTime.time|timeFilter\"></li>\r\n\t\t\t\t    <li ng-bind = \"item.repaidDate.time|timeFilter\"></li><!--实际回款日期-->\r\n\t\t\t\t    <li ng-bind = \"item.repaidPri|toNum0\"></li>\r\n\t\t\t\t    <li ng-bind = \"item.repaidInt|toNum0\"></li>\r\n\t\t\t\t    <li ng-bind = \"item.repaidLateFee|toNum0\"></li>\r\n\t\t\t\t    <li ng-bind = \"item.repaidLateManFee|toNum0\"></li>\r\n\t\t\t\t    <li ng-bind = \"item.repaidServiceFee|toNum0\"></li>\r\n\t\t\t\t    <li ng-bind = \"item.repaidTotMoney|toNum0\"></li>\r\n\t\t\t\t    <li ng-bind = \"item.executeStatus\"></li>\r\n\t\t\t\t    <li ng-bind = \"item.status\"></li>\r\n\t    \t\t</ul>\t\r\n\t    \t</div>\r\n\t    \t\r\n\t    \t<div id=\"detailInfo\" class=\"sectionMargin some-period\">\r\n\t    \t\t<div class=\"sectionTit\">详细信息</div>\r\n\t\t    \t\t<ul class=\"sideTitle\">\r\n\t\t    \t\t\t<li>当前期数</li>\r\n\t\t\t    \t\t<li>对应时期已偿本金</li>\r\n\t\t\t    \t\t<li>对应时期已偿服务费</li>\r\n\t\t\t    \t\t<li>对应时期已偿利息</li>\r\n\t\t\t    \t\t<li>对应时期已偿滞纳金</li>\r\n\t\t\t    \t\t<li>对应时期已偿逾期管理费</li>\r\n\t\t\t    \t\t<li>对应时期已偿总金额</li>\r\n\t\t\t    \t</ul>\r\n\t\t    \t\t<div class=\"innerAuto\">\r\n\t\t\t\t\t\t<div class=\"innerWrapper\">\r\n\t\t\t\t\t\t\t<ul ng-repeat = \"item in swiftDetails\">\r\n\t\t\t\t\t\t\t\t<li>第{{item.billPeriods}}期</li>\r\n\t\t\t\t    \t\t\t<li ng-bind = \"item.repaidPri|toNum0\"></li>\r\n\t\t\t\t    \t\t\t<li ng-bind = \"item.repaidServiceFee|toNum0\"></li>\r\n\t\t\t\t    \t\t\t<li ng-bind = \"item.repaidInt|toNum0\"></li>\r\n\t\t\t\t    \t\t\t<li ng-bind = \"item.repaidLateFee|toNum0\"></li>\r\n\t\t\t\t    \t\t\t<li ng-bind = \"item.repaidLateManFee|toNum0\"></li>\r\n\t\t\t\t    \t\t\t<li ng-bind = \"item.repaidTotMoney|toNum0\"></li>\r\n\t\t\t\t    \t\t</ul>\r\n\t\t\t\t\t\t</div>\r\n\t\t    \t\t</div>\r\n\t\t    \t</div>\r\n\t    \t</div>\r\n\t    \t<div class=\"goBack\">\r\n\t\t\t\t<a class=\"btn6\" ng-click=\"goBack()\" href=\"javascript:void(0)\">返 回</a>\r\n\t    \t</div>\r\n\t    </div>\r\n\t    \r\n\t    <div class=\"inner-footer\">\r\n\t    </div>\r\n\t</div>\r\n</div>"

/***/ }

});