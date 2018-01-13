webpackJsonp([10],{

/***/ 136:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});

	var dependArr = [__webpack_require__(137).default.name];
	exports.default = {
		module: angular.module('splittingCtrl', dependArr).controller('splittingController', ['$scope', 'splittingService', '$state', controller]),
		template: __webpack_require__(138)
	};


	function controller(_, service, $state) {
		'use strict';

		var o,
		    cfg = {},
		    timer,
		    filterListPaddingFlag = false;
		_.selectBaseData2 = {};
		var isArray = Array.isArray;

		//请求参数 保持初始样板
		var queryParam = function queryParam() {
			return {
				partnerZjCode: '',
				accPartnerCode: '',
				productionCode: '',
				keyWord: ''
			};
		};

		//查询参数
		_.query = queryParam();

		_.selectOption = {
			"type": "select",
			"name": "Service",
			"value": "10条",
			"values": ["10条", "20条", "30条", "40条", "50条"]
		};

		//查询
		_.searchStart = function () {
			o.laterQueryList();
		};

		_.clearSearch = function () {
			_.query = queryParam();
			o.laterQueryList();
		};

		_.exportAll = function () {
			if (_.listBaseData.length < 1) {
				alert("没有可导出的数据！");
				return;
			}
			service.downLoadFile(cfg);
		};

		/**
	  * 获取Ⅱ类合作机构筛选列表
	  */
		_.getSelectFlList = function (code) {

			if (!code) return;
			_.query.accPartnerCode = '';
			service.getSelectList({ partnerZjCode: code }).then(function (data) {
				data.accPartner.unshift({
					accPartnerName: '请选择',
					accPartnerCode: ''
				});
				_.selectBaseData2.organize2 = data.accPartner;
			}, function (reason) {
				alert(reason.responseMsg);
			});
		};
		/**
	  * 填充筛选列表条件
	  * @param {Array} item
	  * @param {Object} paddingContent
	  */
		function unshiftDefault(item, paddingContent) {
			if (isArray(item)) {
				item.unshift(paddingContent);
			}
			return item;
		}

		function paddingData(data) {
			return {
				organize1: unshiftDefault(data.productionAccList, {
					partnerZjName: '请选择',
					partnerZjCode: ''
				}),
				//				organize2 : [{
				//					accPartnerName : '请选择',
				//					accPartnerCode : ''
				//				}],
				productionList: unshiftDefault(data.productionList, {
					productionName: '请选择',
					productionCode: ''
				})
			};
		}

		function handleSourceData(data) {
			//			if(filterListPaddingFlag) return;
			var partnerList = [],
			    accPartnerList = [];
			if (isArray(data.partner)) {
				data.partner.forEach(function (item) {
					var obj1 = {},
					    obj2 = {};
					for (var i in item) {
						if (/acc/.test(i)) {
							obj1[i] = item[i];
						} else {
							obj2[i] = item[i];
						}
					}
					partnerList.push(obj2);
					accPartnerList.push(obj1);
				});
			}
			data['partnerList'] = partnerList;
			data['accPartnerList'] = accPartnerList;
			//			filterListPaddingFlag = !filterListPaddingFlag;
			return data;
		}

		//获取列表
		o = {
			laterQueryList: function laterQueryList() {
				if (timer) {
					clearTimeout(timer);
				}
				timer = setTimeout(function () {
					o.getUserInfoList();
				}, 200);
			},
			getUserInfoList: function getUserInfoList(config) {
				var cfg2 = JSON.parse(JSON.stringify(_.query));
				for (var item in cfg2) {
					if (!cfg2[item]) delete cfg2[item];
				}
				cfg = cfg2;
				service.getSplittingList(_.query).then(function (data) {
					console.log(data);
					_.selectBaseData = paddingData(handleSourceData(data));
					_.listBaseData = data.page.result;

					_.exportAllLock = _.listBaseData.length == 0 ? false : true;
				}, function (data) {
					alert(data.responseMsg);
				});
			},
			init: function init() {
				this.getUserInfoList();
			}
		};

		o.init();
		//      _.$watch('query',o.laterQueryList,true);
	}

/***/ },

/***/ 137:
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	function service(util, ajax) {
		return {
			downLoadFile: function downLoadFile(cfg) {
				var param = '';
				for (var params in cfg) {
					param += params + '=' + cfg[params] + '&';
				}
				var url = '/acc/productionsummarypro/downloadExcel.do?' + param;
				url = url.slice(0, -1);
				location.href = url;
			},
			getSplittingList: function getSplittingList(cfg) {
				return ajax.post('/acc/productionsummarypro/selectDetail.do', cfg);
			},
			getSelectList: function getSelectList(cfg) {
				return ajax.post('/acc/productionsummarypro/selectAccPartner.do', cfg);
			}
		};
	}

	exports.default = angular.module('splittingSer', []).factory('splittingService', ['util', 'ajax', service]);

/***/ },

/***/ 138:
/***/ function(module, exports) {

	module.exports = "<div class=\"main\">\r\n\t<loding-mask></loding-mask>\r\n\t<div class=\"inner\" ng-style=\"{'min-height':isShowReportDialog ? '5000px':'auto'}\">\r\n\t    <div class=\"inner-header clearfix\">\r\n\t        <div class=\"inner-header-lf fl\">分润情况</div>\r\n\t    </div>\r\n\t    <div class=\"inner-body\">\r\n\t        <div class=\"inner-select\">\r\n\t            <table style=\"width: 100%;\">\r\n\t                <tr>\r\n\t                    <td class=\"tl-r\"> 资金方: </td>\r\n\t                    <td>\r\n\t                    \t<!-- ng-change = \"getSelectFlList(query.partnerZjCode)\"  -->\r\n\t                        <select class=\"select-global\" ng-model=\"query.partnerZjCode\" ng-options = \"option.partnerZjCode as option.partnerZjName for option in selectBaseData.organize1\"></select>\r\n\t                    </td>\r\n\t                 <!--    <td class=\"tl-r\">Ⅱ类合作机构：</td>\r\n\t                    <td>\r\n\t                        <select class=\"select-global\" ng-model=\"query.accPartnerCode\" ng-options = \"option.accPartnerCode as option.accPartnerName for option in selectBaseData2.organize2\"></select>\r\n\t                    </td> -->\r\n\t                    <td class=\"tl-r\">产品：</td>\r\n\t                    <td>\r\n\t                        <select class=\"select-global\" ng-model=\"query.productionCode\" ng-options = \"option.productionCode as option.productionName for option in selectBaseData.productionList\"></select>\r\n\t                    </td>\r\n\t                </tr>\r\n\t               <!--  <tr>\r\n\t                    <td class=\"tl-r\"> 关键字：</td>\r\n\t                    <td class=\"fl search\">\r\n\t                        <input type=\"text\"  placeholder=\"产品\" ng-model=\"query.keyWord\" id=\"search\"/>\r\n\t                    </td>\r\n\t                </tr> -->\r\n\t                <tr>\r\n\t\t\t\t\t\t<td class=\"tl-r\"></td>\r\n\t\t\t\t\t\t<td class=\"fl search\">\r\n\t\t\t\t\t\t\t<div class=\"search-start\" ng-click=\"searchStart()\">查 询</div>\r\n\t\t\t\t\t\t\t<div class=\"search-start\" ng-click=\"clearSearch()\">清 空</div>\r\n\t\t\t\t\t\t</td>\r\n\t\t\t\t\t</tr>\r\n\t            </table>\r\n\t            <div class=\"inner-table\">\r\n\t                    <div class=\"hdFixed\">\r\n\t                    </div>\r\n\t                    <div class=\"bd\">\r\n\t                    \t<div style=\"margin: 20px 0 40px;\">\r\n\t                    \t\t<div class=\"listHeadToolsBar\">\r\n\t                    \t\t\t<span class=\"title\">渠道总收益</span>\r\n\t                    \t\t\t<download-btn name = \"导出\" lock = \"true\" ng-click = \"exportAll()\" class=\"fr\"/>\r\n\t                    \t\t</div>\r\n\t                    \t\t<table class=\"table_user oddEvenColor\" border=\"1\" borderColor=\"#fff\">\r\n\t                    \t\t\t<tr>\r\n\t                    \t\t\t\t<td>资金方</td>\r\n\t                    \t\t\t\t<td>产品名称</td>\r\n\t                    \t\t\t\t<td>放款总金额</td>\r\n\t                    \t\t\t\t<td>放款总人数</td>\r\n\t                    \t\t\t\t<td>服务费收益</td>\r\n\t                    \t\t\t\t<td>资金方收益</td>\r\n\t                    \t\t\t\t<td>资金成本</td>\r\n\t                    \t\t\t\t<td>实际服务费收益</td>\r\n\t                    \t\t\t</tr>\r\n\t                    \t\t\t<tr ng-repeat = \"item in listBaseData\">\r\n\t                    \t\t\t\t<td ng-bind=\"item.partnerZjName\"></td>\r\n\t                    \t\t\t\t<td ng-bind=\"item.productionName\"></td>\r\n\t                    \t\t\t\t<td ng-bind=\"item.loanAmountTot\"></td>\r\n\t                    \t\t\t\t<td ng-bind=\"item.loanNumTot\"></td>\r\n\t                    \t\t\t\t<td ng-bind=\"item.serviceFeeZcTot\"></td>\r\n\t                    \t\t\t\t<td ng-bind=\"item.serviceFeeZjTot\"></td>\r\n\t                    \t\t\t\t<td ng-bind=\"item.fundSharing\"></td>\r\n\t                    \t\t\t\t<td ng-bind=\"item.repaidServiceFee\"></td>\r\n\t                    \t\t\t</tr>\r\n\t                    \t\t</table>\r\n\t                    \t</div>\r\n\t                    \t\r\n\t                    </div>\r\n\t                <div class=\"ft clearfix\" ng-style=\"{visibility:showPage}\">\r\n\t\t\t        </div>\r\n\t\t\t    </div>\r\n\t\t\t</div>\r\n\t    </div>\r\n\t\t<div class=\"inner-footer\"></div>\r\n\t</div>\r\n</div>\r\n\t\r\n"

/***/ }

});