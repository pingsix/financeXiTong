webpackJsonp([20],{

/***/ 182:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _jquery = __webpack_require__(109);

	var _jquery2 = _interopRequireDefault(_jquery);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var dependArr = [__webpack_require__(183).default.name];
	exports.default = {
	  module: angular.module('pairCtrl', dependArr).controller('pairController', ['$scope', 'pairService', '$state', '$timeout', controller]),
	  template: __webpack_require__(184)
	};


	function controller(_, service, $state, $timeout) {
	  'use strict';

	  var o,
	      cfg = {},
	      timer;

	  _.selectOption = {
	    "type": "select",
	    "name": "Service",
	    "value": "10条",
	    "values": ["10条", "20条", "30条", "40条", "50条"]
	  };

	  var queryParam = function queryParam() {
	    return {
	      productionStatus: '',
	      configStatus: '',
	      keyWord: '',
	      pageNo: 1,
	      pageSize: 10
	    };
	  };

	  //查询参数
	  _.production = queryParam();

	  var isArray = Array.isArray;
	  /**
	   * 选择每页显示条数
	   * @param {JSON} data
	   */
	  _.selectChange = function (data) {
	    var num = parseInt(data.replace(/(\d+)\D/, '$1'));
	    _.production.pageSize = num;
	    _.selectOption.value = num + '条';
	    _.production.pageNo = 1;
	    o.laterQueryList();
	  };

	  //查询
	  _.searchStart = function () {
	    o.laterQueryList();
	  };

	  _.clearSearch = function () {
	    _.production = queryParam();
	    _.selectOption.value = _.production.pageSize + '\u6761';
	    o.laterQueryList();
	  };

	  _.handleTitle = function (item) {
	    if (item.status === '2') {
	      return '查看';
	    } else {
	      return '配置';
	    }
	  };

	  _.viewDetail = function (item) {
	    var param = {
	      "code": item.productionCode,
	      "name": item.productionName,
	      "partner": item.partner,
	      "partnerCode": item.partnerCode,
	      'status': item.status
	    };
	    $state.go('configuration.pairOrg', { "object": encodeURI(JSON.stringify(param)) });
	  };

	  /**
	   * 田中选择列表数据
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
	    var productionStatusList = [{ id: '0', value: '待生效' }, { id: '1', value: '生效' }, { id: '2', value: '结束' }],
	        configStatusList = [{ id: '0', value: '否' }, { id: '1', value: '是' }];
	    return {
	      productionStatusList: unshiftDefault(productionStatusList, {
	        id: '',
	        value: '请选择'
	      }),
	      configStatusList: unshiftDefault(configStatusList, {
	        id: '',
	        value: '请选择'
	      })
	    };
	  }

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
	      var param = JSON.parse(JSON.stringify(_.production));
	      for (var item in param) {
	        if (item == 'isFirst') continue;
	        if (!param[item]) delete param[item];
	      }
	      service.getProductionaccpartnerList(param).then(function (data) {
	        if (data.page.result) _.pairList = data.page.result || [];
	        _.baseData = paddingData(data);
	        //页码问题
	        if (data.page.result.length == 0 && _.production.pageNo !== 1) {
	          _.production.pageNo = _.production.pageNo - 1;
	          o.getUserInfoList();
	        }
	        _.count = data.page.totalCount;
	        _.showPage = 'visible';
	        _.currentPage = data.page.pageNo;
	        //多余3000条或等于0条不能导出
	        _.allExportFlag = data.page.totalCount && data.page.totalCount;
	        _.$broadcast('EVT_PAGE_CHANGE', { 'total': data.page.totalPages, 'current': _.currentPage });
	      }, function (data) {
	        alert(data.responseMsg);
	      });
	    },
	    init: function init() {
	      this.getUserInfoList();
	      _.lodingMask = true;
	    }
	  };
	  o.init();
	  //监听page发回的事件
	  _.$on('EVT_PAGE_SELECTED', function (evt, data) {
	    _.production.pageNo = data.pageSelectedNum;
	    o.getUserInfoList();
	    _.production.pageNo = 1; //默认值
	  });
	}

/***/ },

/***/ 183:
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.default = angular.module('pairSer', []).factory('pairService', ['util', 'ajax', service]);


	function service(util, ajax) {
	  return {
	    setSelectedLi: function setSelectedLi(current) {
	      var parent = util.parent(current, 'ul');
	      angular.element(parent).find('li').removeClass('selected');
	      angular.element(current).parent().addClass('selected');
	    },
	    getDate: function getDate(val, fn) {
	      fn && fn(val);
	    },
	    upService: function upService() {
	      return ajax.post();
	    },
	    downLoadFile: function downLoadFile() {
	      return ajax.post();
	    },
	    freezeCtrl: function freezeCtrl() {
	      return ajax.post();
	    },
	    getProductionaccpartnerList: function getProductionaccpartnerList(cfg) {
	      return ajax.post("/acc/productionaccpartner/list.do", cfg);
	    }
	  };
	}

/***/ },

/***/ 184:
/***/ function(module, exports) {

	module.exports = "<div class=\"main\">\r\n\t<loding-mask></loding-mask>\r\n\t<div class=\"inner\" ng-style=\"{'min-height':isShowReportDialog ? '5000px':'auto'}\">\r\n\t    <div class=\"inner-header clearfix\">\r\n\t        <div class=\"inner-header-lf fl\">机构配对</div>\r\n\t        <!--<div class=\"inner-header-rt fr\" style=\"min-width:220px\">-->\r\n\t            <!--<a  ui-sref =\"configuration.newOrganic\" class=\"btn1 fr importA\">新建机构</a>-->\r\n\t        <!--</div>-->\r\n\t    </div>\r\n\t    <div class=\"inner-body\">\r\n\t        <div class=\"inner-select\">\r\n\t            <table style=\"width: 100%;\">\r\n\t            \t<tr>\r\n\t                    <td class=\"tl-r\">产品状态：</td>\r\n\t                    <td>\r\n\t                        <select class=\"select-global\" ng-model=\"production.productionStatus\" ng-options = \"option.id as option.value for option in baseData.productionStatusList\"></select>\r\n\t                    </td>\r\n\t                </tr>\r\n\t                <tr>\r\n\t                \t<td class=\"tl-r\">配置状态：</td>\r\n\t                    <td>\r\n\t                        <select class=\"select-global\" ng-model=\"production.configStatus\" ng-options = \"option.id as option.value for option in baseData.configStatusList\"></select>\r\n\t                    </td>\r\n\t                </tr>\r\n\t                <tr>\r\n\t                    <td class=\"tl-r\"> 关键字：</td>\r\n\t                    <td class=\"fl search\">\r\n\t                        <input type=\"text\"  placeholder=\"产品编码\" ng-model=\"production.keyWord\" id=\"search\"/>\r\n\t                    </td>\r\n\t                </tr>\r\n\t                <tr>\r\n\t\t\t\t\t\t<td class=\"tl-r\"></td>\r\n\t\t\t\t\t\t<td class=\"fl search\">\r\n\t\t\t\t\t\t\t<div class=\"search-start\" ng-click=\"searchStart()\">查 询</div>\r\n\t\t\t\t\t\t\t<div class=\"search-start\" ng-click=\"clearSearch()\">清 空</div>\r\n\t\t\t\t\t\t</td>\r\n\t\t\t\t\t</tr>\r\n\t            </table>\r\n\t            <div class=\"inner-table\">\r\n\t                    <div class=\"hdFixed\">\r\n\t                    </div>\r\n\t                    <div class=\"bd\">\r\n\t                        <table class=\"table_user oddEvenColor\" border=\"1\" borderColor=\"#fff\" ng-click=\"tableClick($event)\">\r\n\t                            <tr>\r\n\t                                <th>\r\n\t                                \t产品名称\r\n\t                                \t<!--<div class=\"sortWrap\">\r\n\t                                \t\t<div class=\"sortTimeTop\" ng-click = 'sortTime({sortKey:\"update_time\",order:\"asc\"})'></div>\r\n\t                                \t\t<div class=\"sortTimeBottom\" ng-click = 'sortTime({sortKey:\"update_time\",order:\"desc\"})'></div>\r\n\t                                \t</div>-->\r\n\t                                </th>\r\n\t                                <th>产品编码</th>\r\n\t                                <th>产品状态</th>\r\n\t                            \t<th>配置状态</th>\r\n\t                                <th>操作</th>\r\n\t                            </tr>\r\n\t                            <tr ng-repeat=\"item in pairList\">\r\n\t                                <td width=\"30%\" ng-bind=\"item.productionName\"></td>\r\n\t                                <td width=\"25%\" ng-bind=\"item.productionCode\"></td>\r\n\t                                <td width=\"20%\" ng-bind=\"item.status|productionStatus\"></td>\r\n\t                                <td width=\"20%\" ng-bind=\"item.configStatus|configStatus\"></td>\r\n\t                                <td>\r\n\t                                \t<a href=\"javascript:void(0)\" ng-click = \"viewDetail(item)\" ng-bind = \"handleTitle(item)\">配置</a>\r\n\t                                </td>\r\n\t                            </tr>\r\n\t                        </table>\r\n\t                    </div>\r\n\t                <div class=\"ft clearfix yeshu\" ng-style=\"{visibility:showPage}\">\r\n\t\t\t            <div class=\"fl ft-lf\">\r\n\t\t\t                                共 <span ng-bind=\"count\"></span>条 每页显示\r\n\t\t\t                <select ng-model=\"selectOption.value\" ng-change=\"selectChange(selectOption.value)\" ng-options=\"v for v in selectOption.values\">\r\n\t\t\t                </select>\r\n\t\t\t                </div>\r\n\t\t\t                <div class=\"fr ft-rt\">\r\n\t\t\t                    <div class=\"page clearfix\">\r\n\t\t\t                        <span page></span>\r\n\t\t\t                    </div>\r\n\t\t\t        </div>\r\n\t\t\t    </div>\r\n\t\t\t</div>\r\n\t    </div>\r\n\t    <div class=\"inner-footer\"></div>\r\n\t</div>\r\n</div>\r\n\t\r\n\t\t"

/***/ }

});