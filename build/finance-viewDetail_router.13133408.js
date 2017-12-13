webpackJsonp([15],{

/***/ 155:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});

	var _jquery = __webpack_require__(109);

	var _jquery2 = _interopRequireDefault(_jquery);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var dependArr = [__webpack_require__(156).default.name];
	exports.default = {
		module: angular.module('viewDetailCtrl', dependArr).controller('viewDetailController', ['$scope', 'viewDetailService', '$timeout', '$state', 'util', '$compile', controller]),
		template: __webpack_require__(157)
	};


	function controller(_, service, $timeout, $state, util, $compile) {
		'use strict';

		var o,
		    cfg = {},
		    timer;
		//		var stateParam = JSON.parse(decodeURI($state.params.object));
		var cliceParam = location.href.slice(location.href.lastIndexOf('/') + 1);
		var stateParam = JSON.parse(decodeURI(cliceParam));

		//		_.flager = !!localStorage.getItem('modifyAuthFlag') ? JSON.parse(localStorage.getItem('modifyAuthFlag')) : false;
		_.flager = true;
		//params
		_.pageNo = 1; //页数
		_.pageSize = 10; //每页多少个
		_.count = '';

		_.swifts = []; //流水数据
		_.loanMenInfo = [];
		_.productionNames = ''; //产品名称
		_.updateTimeStart = ''; //数据更新时间
		_.updateTimeEnd = ''; //数据更新时间
		_.creatProList = false; //产品列表标示
		_.productionDataId = '';
		_.periodsRecord = [];

		_.selectOption = {
			"type": "select",
			"name": "Service",
			"value": "10条",
			"values": ["10条", "20条", "30条", "40条", "50条"]
		};

		var _nameList = [{ name: '百融前', key: 'brBefore' }, { name: '百融后', key: 'brAfter' }, { name: '资金方前', key: 'zjBefore' }, { name: '资金方后', key: 'zjAfter' }, { name: '资产方前', key: 'zcBefore' }, { name: '资产方后', key: 'zcAfter' }];

		var periodsInfo = [{ name: '资金方', key: 'billPeriods' }, { name: '百融', key: 'billPeriodsForBr' }, { name: '资产方', key: 'billPeriodsForZc' }];

		_.belongStateList = [{ id: '', value: '请选择' }, { id: '正常', value: '正常' }, { id: '代偿', value: '代偿' }, { id: '一次性还清', value: '一次性还清' }, { id: '逾期', value: '逾期' }, { id: '取消借款', value: '取消借款' }];

		function timeDateFilter(time, toTime) {
			if (time && typeof time === 'number') {
				return toTime ? new Date(time).toLocaleString('chinese', { hour12: false }) : new Date(time).toLocaleDateString();
			}
		}

		function fixedName(key) {
			for (var i = 0; i < periodsInfo.length; i++) {
				if (key == periodsInfo[i].key) return periodsInfo[i];
			}
		}

		function setPeriodsDefaultValue(obj) {
			if (!obj.status) obj.status = '正常';
		}

		/*显示-账单明细编辑信息*/
		_.editItemForm = function (index) {
			_.itemFormParam = { remark: '' };
			var handleEditList = [],
			    billPeriodsData = JSON.parse(JSON.stringify(_.billPeriodsData));
			for (var key in billPeriodsData) {
				for (var i = 0, list = billPeriodsData[key]; i < list.length; i++) {
					//select 设置默认值
					//					setPeriodsDefaultValue(list[i]);
					if (typeof list[i]['billPeriods'] !== 'undefined' && list[i]['billPeriods'] == index) {
						for (var k in list[i]) {
							if (/time|date|line/gi.test(k)) {
								if (!!list[i][k] && typeof list[i][k].time !== 'undefined') {
									if (list[i][k].time === 0) {
										list[i][k] = 0;
									} else {
										if (k === 'fineDate' || k === 'fineRepaidDate') {
											list[i][k] = timeDateFilter(list[i][k].time, true);
										} else {
											list[i][k] = timeDateFilter(list[i][k].time);
										}
									}
								}
							}
						}
						handleEditList.push({
							nameData: fixedName(key),
							data: list[i]
						});
						continue;
					}
				}
			}
			_.editList = rmNoUserVal(handleEditList);
			_.rawItemFormValue = JSON.stringify(_.editList);
			//找到指令自动创建的方法并调用返回Promise对象，并自动弹出遮罩；
			_['cloakCallback' + index]().then(saveItemForm);
		};
		setTimeout(function () {
			console.log(118, _);
		}, 2000);
		//校验提交-账单明细（此提交在指令里执行并返回错误信息）
		_.validateSubmit = function (err) {
			if (err) {
				switch (err.errorKey) {
					case 'tiemError':
						return alert('输入时间格式有误，请检查！');
					case 'raw':
						return alert('保存值，未修改！');
					case 'remark':
						return alert('请填写备注！');
					default:
				}
			}
			//			console.log(117,_.rawItemFormValue)
			//			console.log(118,JSON.stringify(rmNoUserVal(_.editList)))
			return {
				tiemError: allTimeValidate(),
				raw: isRawHandle(_.rawItemFormValue, JSON.stringify(rmNoUserVal(_.editList))),
				remark: !_.itemFormParam.remark
			};
		};

		/*提交-各期明细账单信息*/
		function saveItemForm(bool) {
			if (!bool) return;
			var editListStr = JSON.stringify(rmNoUserVal(_.editList));
			var editList = formatTime(JSON.parse(editListStr));
			editList.forEach(function (item) {
				_.itemFormParam[item.nameData.key] = item.data;
			});
			service.editPeriodsInfo({ jsonData: JSON.stringify(_.itemFormParam) }).then(function (data) {
				if (data && bool) {
					alert(data.responseMsg);
					o.getUserInfoList();
				}
			});
		}

		function validateTime(time) {
			if (time.indexOf(' ')) time = time.split(' ')[0];
			var tmpArr = time.split('/');
			var errFlag = tmpArr.every(function (num) {
				return typeof parseInt(num) === 'number' && !Number.isNaN(parseInt(num));
			});
			return time.indexOf('/') === -1 || tmpArr.length < 3 || !tmpArr[tmpArr.length - 1] || !errFlag;
		}

		/*校验-各期明细账单信息*/
		_.validateItemTime = function (evt, originObj, key) {
			var elem = evt.target,
			    elem2Style = elem.parentNode.style;
			if (!!elem.value) {
				if (validateTime(elem.value)) {
					_.tiemError = true;
					elem2Style.borderColor = '#f00';
				} else {
					elem2Style.borderColor = '#d2d2d2';
				}
			} else {
				if (key === 'fineDate' || key === 'fineRepaidDate') {
					originObj[key] = '1/1/3';
				} else {
					originObj[key] = '1/1/3';
				}
				elem2Style.borderColor = '#d2d2d2';
			}
		};

		_.handlePeriodsInp = function (num, originObj, key) {
			if (!num) originObj[key] = 0;
		};

		function isRawHandle(val1, val2) {
			return val1 == val2;
		}

		function allTimeValidate() {
			var eList = [];

			var _loop = function _loop(i) {
				var data = _.editList[i].data;
				e = Object.keys(data).some(function (key) {
					if (/time|date|line/gi.test(key) && !!data[key] && key !== 'createTime' && key !== 'updateTime') {
						return validateTime(data[key]) ? true : false;
					} else {
						return false;
					}
				});

				if (e) eList.push(e);
			};

			for (var i = 0; i < _.editList.length; i++) {
				var e;

				_loop(i);
			}
			return eList.some(function (item) {
				return item;
			});
		}

		//移除angular加入的属性
		function rmNoUserVal(data) {
			function del(obj, key) {
				for (var i in obj) {
					if (i == key) delete obj[key];
				}
			}
			data.forEach(function (item) {
				del(item, '$$hashKey');
				del(item.nameData, '$$hashKey');
				del(item.data, '$$hashKey');
			});
			return data;
		}

		/*保存时间格式化*/
		function formatTime(data) {
			for (var i = 0; i < data.length; i++) {
				var data2 = data[i].data;
				for (var k in data2) {
					var value = data2[k];
					if (/time|date|line/gi.test(k)) {
						if (!!value) {
							if (k === 'fineDate' || k === 'fineRepaidDate') {
								if (!!value.time) value = timeDateFilter(value.time, true);
								if (value.indexOf(':') === -1) value += ' 00:00:00';
							}
							if (typeof value !== 'string') {
								if (!!value.time) value = timeDateFilter(value.time);
							}
							if (value.indexOf('/') !== -1) {
								data2[k] = value.replace(/\//g, '-');
							}
						}
					}
				}
			}
			console.log(233, data);
			return data;
		}

		//展示明细账单修改记录
		_.showModifyRecord = function (index) {
			for (var i = 0; i < _.periodsRecordArr.length; i++) {
				if (_.periodsRecordArr[i].id == index) {
					var data = _.periodsRecordArr[i].data;
					middleHandleTime(data);
					_.periodsRecordDetail = {
						data: comparePeriodsVal(data),
						remark: _.periodsRecordArr[i]['remark']
					};
				}
			}
			//弹出展示
			_.modifyRecordForm(true, true);
		};

		function middleHandleTime(data) {
			var dataPool = [];
			for (var key in data) {
				dataPool.push(data[key]);
			}
			formatTime(dataPool);
		}

		//处理-明细账单修改过的值和原始值
		function comparePeriodsVal(periodData) {
			var _data = JSON.parse(JSON.stringify(periodData));
			var tmpArr1 = [];
			for (var prop in _data) {
				var value = _data[prop];
				tmpArr1.push([]);
				switch (prop.slice(0, 2)) {
					case 'br':
						tmpArr1[0].push(_data[prop]);
						break;
					case 'zj':
						tmpArr1[1].push(_data[prop]);
						break;
					case 'zc':
						tmpArr1[2].push(_data[prop]);
						break;
					default:
				}
			}
			tmpArr1 = tmpArr1.filter(function (arr) {
				if (arr.length > 0) return arr;
			});
			tmpArr1.forEach(function (arr) {
				signChanegeVal(arr[0].data, arr[1].data);
			});
			function signChanegeVal(obj, obj2) {
				for (var _prop in obj) {
					if (obj[_prop] !== obj2[_prop]) {
						obj[_prop] = {
							sign: true,
							val: obj[_prop]
						};
						obj2[_prop] = {
							sign: true,
							val: obj2[_prop]
						};
					} else {
						obj[_prop] = {
							sign: false,
							val: obj[_prop]
						};
						obj2[_prop] = {
							sign: false,
							val: obj2[_prop]
						};
					}
				}
			}
			return _data;
		}

		/**
	  * 高度设置
	  */
		function resetDetailInfoHeight(num) {
			var childSize = (0, _jquery2.default)(".detailInfo").eq(num).children().eq(0).children().size();
			(0, _jquery2.default)("#detailInfo").height(childSize * 32 + 55);
			(0, _jquery2.default)(".innerAuto").eq(num).height(childSize * 32 + 17);
		}
		resetDetailInfoHeight(0);
		//计算容器宽度
		_.countDetaiInfoWrap = function (index) {
			var count = 0;
			switch (index) {
				case 0:
				case 2:
					count = _.billPeriodsData.billPeriods.length;
					break;
				case 1:
					count = _.billPeriodsData.billPeriodsForBr.length;
					break;
			}
			var detailWarpWidth = 340 * count;
			(0, _jquery2.default)(".innerWrapper").width(detailWarpWidth);
		};

		/**
	  * 查看当前用户是否有查看逾期用户信息权限（催收主管角色具有该权限）
	  */
		!function () {
			var jurisdictionList = [],
			    menuList = [],
			    jurisdictionList = util.ejson(localStorage.getItem('menu'));

			jurisdictionList.forEach(function (index) {
				if (index.text === '账务信息' && index.children) {
					menuList = index.children;
				}
			});
			menuList.forEach(function (index) {
				if (index.text === '逾期用户信息' && stateParam.name === 'overdue') {
					_.receivableRole = !_.receivableRole;
				}
			});
		}();

		_.handleNum = function (num) {
			if (num == '0' || num == '-0') {
				return 0;
			} else {
				return num.toFixed(2);
			}
		};

		var detailNavList = (0, _jquery2.default)('.navigation').children(),
		    detailContentList = (0, _jquery2.default)('.detail_plan');
		detailNavList.eq(0).addClass('nav-select');
		detailContentList.eq(0).addClass('content-select');
		detailNavList.off('click').on('click', function () {
			(0, _jquery2.default)(this).addClass('nav-select').siblings().removeClass('nav-select');
			detailContentList.eq((0, _jquery2.default)(this).index()).addClass('content-select').siblings().removeClass('content-select');
			resetDetailInfoHeight((0, _jquery2.default)(this).index());
			_.countDetaiInfoWrap((0, _jquery2.default)(this).index());
		});

		_.deductRecord = function (item) {
			if (!item.withholdDetail) return;
			//			if(item.withholdStatus !== 'success') return;
			_.isShowReportDialog5 = true;
			_.alerShow = !_.alerShow;
			_.inputFlag = false;
			_.isDeductRecord = false;
			_.subInfo = '代扣金额记录';
			var withholdDetail = JSON.parse(item.withholdDetail);
			//显示代扣详情
			//			return
			if (withholdDetail.detail) {
				_.billPeriods3 = JSON.parse(withholdDetail.detail);
			}
		};
		_.closeDialog = function () {
			_.isShowReportDialog5 = false;
			_.alerShow = !_.alerShow;
			clearList();
		};

		_.overReceivable = function () {
			_.isShowReportDialog5 = true;
			_.alerShow = !_.alerShow;
			_.inputFlag = true;
			_.isDeductRecord = true;
			_.subInfo = '是否结束催收，若结束请填写结束详情';
			_.overReceivableFlag = true;
		};

		_.emitInform = function () {
			//			var currentStatus = service.checkStatus();
			//			if(currentStatus.status){
			//				alert(currentStatus.msg);
			//				return;
			//			}
			//			return;
			_.isShowReportDialog5 = true;
			_.alerShow = !_.alerShow;
			_.inputFlag = false;
			_.isDeductRecord = true;
			_.overReceivableFlag = false;
			_.subInfo = '是否发出代扣通知，请确认代扣金额';
			o.getUserInfoList();
		};

		_.checkInputMoney = function (text) {
			_.checkMoneyFlag = false;
			countMoney(text);
			if (!text) {
				_.errorText = '';
				_.isError = false;
				return;
			};
			if (!/^\d+(\.\d+)?$/.test(text)) {
				_.errorText = '金额必须为数字，请重新填写！';
				_.isError = true;
				_.checkMoneyFlag = true;
				return;
			}
			if (text > _.detailData.presentDueSum || text <= 0) {
				_.errorText = '填写金额必须小于等于当前应偿未偿总金额且大于0！';
				_.isError = true;
				_.checkMoneyFlag = true;
				return;
			}
			_.errorText = '';
			_.isError = false;
			_.checkMoneyFlag = false;
		};

		/**
	  * 计算所还的金额 
	  */
		function countMoney(text) {
			if (text == undefined || !/^\d+(\.\d+)?$/.test(text)) text = 0;
			//			var inputMoney = text;
			var bill2 = JSON.parse(_.billPeriods2);
			for (var i = 0; i < bill2.length; i++) {
				var item = JSON.parse(bill2[i]);
				for (var k in item) {
					if (item.hasOwnProperty(k)) {
						if (typeof item[k] !== 'number') continue;
						if (text > 0) {
							text -= item[k];
							if (text >= 0) {
								_.billPeriods3[i][k] = item[k];
							} else {
								_.billPeriods3[i][k] = item[k] + parseInt(text);
							}
						} else {
							_.billPeriods3[i][k] = 0;
						}
					}
				}
			}
			//			console.log(_.billPeriods3)
		}

		/**
	  * 提交 结束催收/发出代扣通知
	  */
		_.submit = function () {
			if (_.overReceivableFlag) {
				if (!_.subArea) {
					alert('结束详情未填写!');
					return;
				}
				var cfg = {
					requestId: _.detailData.requestId,
					collEndDetail: _.subArea
				};
				service.emitInfo(cfg).then(function (data) {
					alert(data.responseMsg);
					location.href = '#/overdue';
				}, function (reason) {
					alert(reason.responseMsg);
				});
			} else {
				if (_.checkMoneyFlag) return;

				if (!_.subArea) {
					alert('代扣金额未填写!');
					return;
				} else {
					if (!confirm('是否发出扣款金额指令？')) return;
				}
				//				console.log(_.billPeriods3)
				var withDtail = {
					requestId: _.detailData.requestId,
					TotalAmount: _.detailData.presentDueSum,
					detail: JSON.stringify(_.billPeriods3)
				};
				var cfg = {
					requestId: _.detailData.requestId,
					withholdAmount: _.subArea,
					withholdDetail: JSON.stringify(withDtail)
				};
				//				console.log(192,cfg)
				service.overReceivableFlag(cfg).then(function (data) {
					alert(data.responseMsg);
					o.getUserInfoList();
					location.href = '#/overdue';
				}, function (reason) {
					alert(reason.responseMsg);
				});
			}

			_.alerShow = !_.alerShow;
			_.subInfo = '';
			_.subArea = '';
			_.isShowReportDialog5 = false;
		};

		_.cancel = function () {
			_.subArea = '';
			_.alerShow = !_.alerShow;
			_.isShowReportDialog5 = false;

			_.errorText = '';
			_.isError = false;
			_.checkMoneyFlag = false;
		};

		/**
	  * 查看案件详情
	  * 
	  * @param{id}
	  * earnFileSearchFlag 是否为进件查询    是的设为false   不是设为true
	  * pageName指令被不同页面调用，选填   页面名字 做判断处理
	  * {requestId:detailData.requestId,id:detailData.productionDataId,tellId:detailData.id}
	  */
		_.checkDetail = function (checkDetail) {
			_.showOperNav();
			//			_.tellId = checkDetail.id;
			//			requestId : checkDetail.requestId,
			_.operatePage({
				param: { id: checkDetail.productionDataId },
				earnFileSearchFlag: false,
				pageName: 'viewDetail'
			});
		};

		_.viewRunning = function (item) {
			var param = {
				requestId: item.requestId,
				swiftNumberId: item.swiftNumber,
				name: stateParam.name === 'loanInfo' ? 0 : 1
			};
			$state.go('financial.viewRunning', { 'object': encodeURI(JSON.stringify(param)) });
		};

		_.goBack = function () {
			location.href = "#/financial/loan";
		};

		//代扣计算清零
		function clearList() {
			for (var j = 0; j < _.billPeriods3.length; j++) {
				if (typeof _.billPeriods3[j] === 'string') {
					_.billPeriods3[j] = JSON.parse(_.billPeriods3[j]);
				}
				for (var i in _.billPeriods3[j]) {
					if (typeof _.billPeriods3[j][i] === 'string') continue;
					_.billPeriods3[j][i] = 0;
				}
			}
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
				service.getViewDetailData({ requestId: stateParam.requestId }).then(function (data) {
					_.detailData = data.essential; //基本信息
					_.billPeriodsData = {
						billPeriods: data.billPeriods,
						billPeriodsForBr: data.billPeriodsForBr,
						billPeriodsForZc: data.billPeriodsForZc
					};

					_.periodsModifyRecord = [{ id: 456 }];

					_.swifts = data.swifts; //流水详情
					_.collection = data.collection; //代扣通知操作明细
					_.collectionOver = data.collectionOver; //结束催收记录明细

					var billPeriods2 = [];
					for (var i = 0; i < data.billPeriods.length; i++) {
						var newArr = {};
						//此处按数据类型分开，不参与展示的用保存成属性值；
						newArr['presentTotDue'] = data.billPeriods[i].presentTotDue + '';
						if (data.billPeriods[i].presentTotDue - data.billPeriods[i].repaidTotMoney === 0 || data.billPeriods[i].presentLateFee === 0 && data.billPeriods[i].presentInt === 0) {
							continue;
						} else {
							newArr['billPeriods'] = data.billPeriods[i].billPeriods + '';
						}
						newArr['presentServiceFee'] = data.billPeriods[i].presentLateManFee;
						newArr['presentLateManFee'] = data.billPeriods[i].presentLateManFee;
						newArr['presentLateFee'] = data.billPeriods[i].presentLateFee;
						newArr['presentInt'] = data.billPeriods[i].presentInt;
						newArr['presentPri'] = data.billPeriods[i].presentPri;
						billPeriods2.push(JSON.stringify(newArr));
					}

					var billPeriods3;
					_.billPeriods2 = billPeriods3 = JSON.stringify(billPeriods2);
					_.billPeriods3 = JSON.parse(billPeriods3);
					clearList();

					_.countDetaiInfoWrap(0);

					_.showScroll = _.swifts.length > 5 ? true : false;
				}, function (reason) {
					alert(reason.responseMsg);
					//	                	location.href='../view/login.html';
				});

				service.editPeriodsRecord({ requestId: stateParam.requestId }).then(function (data) {}, function (reason) {
					_.periodsRecord = reason;
					var _data = JSON.parse(JSON.stringify(reason));
					_.periodsRecordArr = [];
					for (var i = 0; i < _data.length; i++) {
						var periodsData = {};
						for (var k in _data[i]) {
							for (var u = 0; u < _nameList.length; u++) {
								var item = _nameList[u];
								var reg = new RegExp(item.key, 'gi');
								if (reg.test(k)) {
									periodsData[item.key] = {
										nameData: item,
										data: _data[i][k] ? JSON.parse(_data[i][k]) : _data[i][k]
									};
								}
							}
						}
						_.periodsRecordArr.push({
							id: i + 1,
							data: periodsData,
							remark: _data[i].remark
						});
					}
				});
			},
			init: function init() {
				this.getUserInfoList();
			}
		};
		o.init();
	}

/***/ },

/***/ 156:
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	/**
	 * 
	 */
	exports.default = angular.module('loanMenInfoSer', []).factory('viewDetailService', ['util', 'ajax', 'validator', service]);


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
	    /**
	    * 获取待审列表
	    * @param {JSON} cfg
	    */
	    getViewDetailData: function getViewDetailData(cfg) {
	      return ajax.post("/acc/borrowerInformation/selectBorrower.do", cfg);
	    },
	    //打电话
	    callUp: function callUp(cfg) {
	      console.log(cfg);
	      return ajax.post('/acc/garfield/call.do', cfg);
	    },
	    //代扣
	    overReceivableFlag: function overReceivableFlag(cfg) {
	      return ajax.post('/acc/productioncollection/save.do', cfg);
	    },
	    //结束催收
	    emitInfo: function emitInfo(cfg) {
	      return ajax.post('/acc/productioncollectionend/save.do', cfg);
	    },
	    //查询当前是否有催收中的状态
	    checkStatus: function checkStatus() {
	      var flag = { status: '', msg: '' };
	      ajax.post('/acc/productioncollection/getConnectionComing.do', cfg).then(function (data) {}, function (reason) {
	        if (reason.responseCode === '019') {
	          flag.status = false;
	          flag.msg = reason.responseMsg;
	        }
	      });
	      return flag;
	    },
	    editPeriodsInfo: function editPeriodsInfo(cfg) {
	      return ajax.post('/acc/borrowerInformation/modify.do', cfg);
	    },
	    editPeriodsRecord: function editPeriodsRecord(cfg) {
	      return ajax.post('/acc/productionLoanManual/getModifyRecords.do', cfg);
	    }

	  };
	}

/***/ },

/***/ 157:
/***/ function(module, exports) {

	module.exports = "<div class=\"main\">\r\n\t<loding-mask></loding-mask>\r\n\t<div class=\"inner\" ng-style=\"{'min-height':isShowReportDialog ? innerResetHeight : 'auto'}\">\r\n\t    <div class=\"inner-header clearfix\">\r\n\t        <div class=\"inner-header-lf fl\">详细信息</div>\r\n\t    </div>\r\n\t    <div class=\"inner-body paddingInner\">\r\n\t    \t<table id=\"baseInfo\" class=\"sectionMargin\" width=\"100%\" border=\"1px\" bordercolor=\"#d2d2d2\">\r\n\t    \t\t<caption class=\"sectionTit\">基本信息</caption>\n\t\t\t\t<tr>\r\n\t\t\t\t\t<td>客户ID</td>\r\n\t\t\t\t\t<td ng-bind = \"detailData.customId\"></td>\r\n\t\t\t\t\t<td>案件号</td>\r\n\t\t\t\t\t<td ng-bind = \"detailData.requestId\"></td>\r\n\t\t\t\t\t<td>还款方式</td>\r\n\t\t\t\t\t<td ng-bind = \"detailData.eventType\"></td>\r\n\t\t\t\t</tr>\r\n\t\t\t\t<tr>\r\n\t\t\t\t\t<td>产品名称</td>\r\n\t\t\t\t\t<td ng-bind = \"detailData.productionName\"></td>\r\n\t\t\t\t\t<td>当前状态</td>\r\n\t\t\t\t\t<td ng-bind = \"detailData.presentStatus\"></td>\r\n\t\t\t\t\t<td>当前剩余本金余额</td>\r\n\t\t\t\t\t<td ng-bind = \"detailData.productionPresentStatus.presentResPri\"></td>\r\n\t\t\t\t</tr>\r\n\t\t\t\t<tr>\r\n\t\t\t\t\t<td>姓名</td>\r\n\t\t\t\t\t<td ng-bind = \"detailData.applicantName\"></td>\r\n\t\t\t\t\t<td>当前状态数据时间</td>\r\n\t\t\t\t\t<td ng-bind = \"detailData.productionPresentStatus.presentTime.time|timeFilter\"></td>\r\n\t\t\t\t\t<td>当前剩余利息</td>\r\n\t\t\t\t\t<td ng-bind = \"detailData.productionPresentStatus.presentResInt\"></td>\r\n\t\t\t\t</tr>\r\n\t\t\t\t<tr>\r\n\t\t\t\t\t<td>身份证</td>\r\n\t\t\t\t\t<td ng-bind = \"detailData.cardId\"></td>\r\n\t\t\t\t\t<td>放款状态</td>\r\n\t\t\t\t\t<td ng-bind = \"detailData.loanStatus\"></td>\r\n\t\t\t\t\t<td>当前剩余滞纳金</td>\r\n\t\t\t\t\t<td ng-bind = \"detailData.productionPresentStatus.presentResLateFee\"></td>\r\n\t\t\t\t</tr>\r\n\t\t\t\t<tr>\r\n\t\t\t\t\t<td>手机号码</td>\r\n\t\t\t\t\t<td ng-bind = \"detailData.callNumber\"></td>\r\n\t\t\t\t\t<td>未放款原因</td>\r\n\t\t\t\t\t<td  title=\"{{detailData.loanRemark}}\"><p ng-class = \"{overflow : detailData.loanRemark.length > 27}\" ng-bind = \"detailData.loanRemark\" ></p></td>\r\n\t\t\t\t\t<td>当前剩余服务费</td>\r\n\t\t\t\t\t<td ng-bind = \"detailData.productionPresentStatus.presentServiceFee\"></td>\r\n\t\t\t\t</tr>\r\n\t\t\t\t<tr>\r\n\t\t\t\t\t<td>申请日期</td>\r\n\t\t\t\t\t<td ng-bind = \"detailData.createTime == '0' ? '' : detailData.createTime.time|timeFilter\"></td>\r\n\t\t\t\t\t<td>放款日期</td>\r\n\t\t\t\t\t<td ng-bind = \"detailData.loanTime.time|timeDateFilter\"></td>\r\n\t\t\t\t\t<td>当前剩余期数</td>\r\n\t\t\t\t\t<td ng-bind = \"detailData.productionPresentStatus.presentResPeriods == '0' ? '0' : detailData.productionPresentStatus.presentResPeriods\"></td>\r\n\t\t\t\t</tr>\r\n\t\t\t\t<tr>\r\n\t\t\t\t\t<td>申请金额</td>\r\n\t\t\t\t\t<td ng-bind = \"detailData.applyMoney == '0' ? '0' : detailData.applyMoney\"></td>\r\n\t\t\t\t\t<td>放款金额</td>\r\n\t\t\t\t\t<td ng-bind = \"detailData.loanAmount == '0' ? '0' : detailData.loanAmount\"></td>\r\n\t\t\t\t\t<td>百融服务费总计</td>\r\n\t\t\t\t\t<td ng-bind = \"detailData.productionPresentStatus.serviceFeeBrTot == '0' ? '0' : detailData.productionPresentStatus.serviceFeeBrTot\"></td>\r\n\t\t\t\t</tr>\r\n\t\t\t\t<tr>\r\n\t\t\t\t\t<td>申请期数</td>\r\n\t\t\t\t\t<td ng-bind = \"detailData.refundPeriods == '0' ? '0' : detailData.refundPeriods\"></td>\r\n\t\t\t\t\t<td>放款期数</td>\r\n\t\t\t\t\t<td ng-bind = \"detailData.loanPeriods == '0' ? '0' : detailData.loanPeriods\"></td>\r\n\t\t\t\t\t<td>百融已收服务费</td>\r\n\t\t\t\t\t<td ng-bind = \"detailData.productionPresentStatus.repaidServiceFeeBr == '0' ? '0' : detailData.productionPresentStatus.repaidServiceFeeBr\"></td>\r\n\t\t\t\t</tr>\r\n\t    \t</table>\r\n\t    \t\r\n\t    \t<div>\r\n\t    \t\t<div class=\"sectionTit\">各期明细账单信息</div>\r\n\t    \t\t<ul class=\"navigation\">\r\n\t    \t\t\t<li>资金方还款计划</li>\r\n\t    \t\t\t<li>百融还款计划</li>\r\n\t    \t\t\t<li>资产方还款计划</li>\r\n\t    \t\t</ul>\r\n\t    \t\t<div class=\"detail_plan\">\r\n\t\t\t    \t<div id=\"detailInfo\" class=\"sectionMargin detailInfo\">\r\n\t\t\t    \t\t<ul class=\"sideTitle\">\r\n\t\t\t\t    \t\t<li>当前期数</li>\r\n\t\t\t\t    \t\t<li class=\"overStyle\" title = \"当期应偿未偿金额 = 当期应偿总金额 - 当期已偿总金额\">当期应偿未偿金额</li>\r\n\t\t\t\t    \t\t<li>当期应偿本金</li>\r\n\t\t\t\t    \t\t<li>当期应偿利息</li>\r\n\t\t\t\t    \t\t<li>当期应偿滞纳金</li>\r\n\t\t\t\t    \t\t<li>当期应偿逾期管理费</li>\r\n\t\t\t\t    \t\t<li>当期应偿服务费</li>\r\n\t\t\t\t    \t\t<li>当期应偿总金额</li>\r\n\t\t\t\t    \t\t<li>当期已偿本金</li>\r\n\t\t\t\t    \t\t<li>当期已偿利息</li>\r\n\t\t\t\t    \t\t<li>当期已偿滞纳金</li>\r\n\t\t\t\t    \t\t<li>当期已偿逾期管理费</li>\r\n\t\t\t\t    \t\t<li>当期已偿服务费</li>\r\n\t\t\t\t    \t\t<li>当期已偿总金额</li>\r\n\t\t\t\t    \t\t<li>实际回款日期</li>\r\n\t\t\t\t    \t\t<li>当次逾期发生日期</li>\r\n\t\t\t\t    \t\t<li>应回款日期</li>\r\n\t\t\t\t    \t\t<li>保证金划扣金额</li>\r\n\t\t\t\t    \t\t<li>保证金划扣时间</li>\r\n\t\t\t\t    \t\t<li>合作机构回款金额</li>\r\n\t\t\t\t    \t\t<li>合作机构回款时间</li>\r\n\t\t\t\t    \t\t<li class=\"overStyle\" title=\"还款合计 = 当期已偿总金额 + 当期已偿服务费\">还款合计</li>\r\n\t\t\t\t    \t\t<li>当期状态</li>\r\n\t\t\t\t    \t</ul>\r\n\t\t\t    \t\t<div class=\"innerAuto\">\r\n\t\t\t\t\t\t\t<div class=\"innerWrapper\">\r\n\t\t\t\t\t\t\t\t<ul ng-repeat = \"item in billPeriodsData.billPeriods\">\r\n\t\t\t\t\t    \t\t\t<li class=\"financial-periods-head\">\r\n\t\t\t\t\t    \t\t\t\t<span>第{{item.billPeriods}}期</span>\r\n\t\t\t\t\t    \t\t\t\t<!-- ng-if=\"flager\"-->\r\n\t\t\t\t\t    \t\t\t\t<span ng-if=\"flager\" class=\"financial-periods-edit\" ng-click=\"editItemForm(item.billPeriods)\">编辑</span>\r\n\t\t\t\t\t    \t\t\t\t<cloak_frame ng-show=\"flager\" head = \"第({{item.billPeriods}})期  账单明细编辑\" cloak-submit=\"cloakCallback{{item.billPeriods}}\" validate=\"validateSubmit\">\r\n\t\t\t\t\t    \t\t\t\t\t<div class=\"innerlist-wrap\">\r\n\t\t\t\t\t    \t\t\t\t\t\t<ul class=\"sideTitle\">\r\n\t\t\t\t\t    \t\t\t\t\t\t\t<li>计划所属机构</li>\r\n\t\t\t\t\t\t\t\t\t\t    \t\t<li class=\"overStyle\" title = \"当期应偿未偿金额 = 当期应偿总金额 - 当期已偿总金额\">当期应偿未偿金额</li>\r\n\t\t\t\t\t\t\t\t\t\t    \t\t<li>当期应偿本金</li>\r\n\t\t\t\t\t\t\t\t\t\t    \t\t<li>当期应偿利息</li>\r\n\t\t\t\t\t\t\t\t\t\t    \t\t<li>当期应偿总服务费</li>\r\n\t\t\t\t    \t\t\t\t\t\t\t\t<li>当期应偿百融服务费</li>\r\n\t\t\t\t    \t\t\t\t\t\t\t\t<li>当期应偿合作方服务费</li>\r\n\t\t\t\t\t\t\t\t\t\t    \t\t<li>当期应偿滞纳金</li>\r\n\t\t\t\t\t\t\t\t\t\t    \t\t<li>当期应偿逾期管理费</li>\r\n\t\t\t\t\t\t\t\t\t\t    \t\t<li>当期应偿服务费</li>\r\n\t\t\t\t\t\t\t\t\t\t    \t\t<li>当期应偿总金额</li>\r\n\t\t\t\t\t\t\t\t\t\t    \t\t<li>当期已偿本金</li>\r\n\t\t\t\t\t\t\t\t\t\t    \t\t<li>当期已偿利息</li>\r\n\t\t\t\t\t\t\t\t\t\t    \t\t<li>当期已偿总服务费</li>\r\n\t\t\t\t\t\t\t\t\t\t    \t\t<li>当期已偿百融服务费</li>\r\n\t\t\t\t\t\t\t\t\t\t    \t\t<li>当期已偿合作方服务费</li>\r\n\t\t\t\t\t\t\t\t\t\t    \t\t<li>当期已偿滞纳金</li>\r\n\t\t\t\t\t\t\t\t\t\t    \t\t<li>当期已偿逾期管理费</li>\r\n\t\t\t\t\t\t\t\t\t\t    \t\t<li>当期已偿服务费</li>\r\n\t\t\t\t\t\t\t\t\t\t    \t\t<li>当期已偿总金额</li>\r\n\t\t\t\t\t\t\t\t\t\t    \t\t<li>实际回款日期</li>\r\n\t\t\t\t\t\t\t\t\t\t    \t\t<li>当次逾期发生日期</li>\r\n\t\t\t\t\t\t\t\t\t\t    \t\t<li>应回款日期</li>\r\n\t\t\t\t\t\t\t\t\t\t    \t\t<li>保证金划扣金额</li>\r\n\t\t\t\t\t\t\t\t\t\t    \t\t<li>保证金划扣时间</li>\r\n\t\t\t\t\t\t\t\t\t\t    \t\t<li>合作机构回款金额</li>\r\n\t\t\t\t\t\t\t\t\t\t    \t\t<li>合作机构回款时间</li>\r\n\t\t\t\t\t\t\t\t\t\t    \t\t<li class=\"overStyle\" title=\"还款合计 = 当期已偿总金额 + 当期已偿服务费\">还款合计</li>\r\n\t\t\t\t\t\t\t\t\t\t    \t\t<li>当期状态</li>\r\n\t\t\t\t\t    \t\t\t\t\t\t</ul>\r\n\t\t\t\t\t    \t\t\t\t\t\t<ul  ng-repeat = \"editItem in editList\">\r\n\t\t\t\t\t    \t\t\t\t\t\t\t<li ng-bind = \"editItem.nameData.name|toNum0\"></li>\r\n\t\t\t\t\t    \t\t\t\t\t\t\t\r\n\t\t\t\t\t    \t\t\t\t\t\t\t<li ng-if=\"editItem.nameData.key === 'billPeriodsForBr'? false : true\" \r\n\t\t\t\t\t    \t\t\t\t\t\t\t\tng-bind = \"{{handleNum(editItem.data.presentTotDue - editItem.data.repaidTotMoney - editItem.data.repaidServiceFee)}}|toNum0\"></li>\r\n\t\t\t\t\t    \t\t\t\t\t\t\t<li ng-if=\"editItem.nameData.key === 'billPeriodsForBr'? true : false\">-</li>\r\n\t\t\t\t\t    \t\t\t\t\t\t\t\r\n\t\t\t\t\t\t\t\t\t    \t\t\t<li ng-bind = \"editItem.data.presentPri|toNum0\"></li>\r\n\t\t\t\t\t\t\t\t\t    \t\t\t<li ng-bind = \"editItem.data.presentInt|toNum0\"></li>\r\n\t\t\t\t\t\t\t\t\t    \t\t\t\r\n\t\t\t\t\t\t\t\t\t    \t\t\t\r\n\t\t\t\t\t    \t\t\t\r\n\t\t\t\t\t    \t\t\t\r\n\t\t\t\t\t\t\t\t\t    \t\t\t<li ng-if=\"editItem.nameData.key === 'billPeriodsForBr' ? false :true\">-</li> \r\n\t\t\t\t\t\t\t\t\t    \t\t\t<li ng-if=\"editItem.nameData.key === 'billPeriodsForBr' ? true :false\" \r\n\t\t\t\t\t\t\t\t\t    \t\t\t\tng-bind = \"editItem.data.presentServiceFee|toNum0\"></li>\r\n\t\t\t\t\t\t\t\t\t    \t\t\t\r\n\t\t\t\t\t\t\t\t\t    \t\t\t<li ng-if=\"editItem.nameData.key === 'billPeriodsForBr' ? false :true\">-</li> \r\n\t\t\t\t\t\t\t\t\t    \t\t\t<li ng-if=\"editItem.nameData.key === 'billPeriodsForBr' ? true :false\" \r\n\t\t\t\t\t\t\t\t\t    \t\t\t\tng-bind = \"editItem.data.presentServiceFeeBr|toNum0\"></li>\r\n\t\t\t\t\t\t\t\t\t    \t\t\t\r\n\t\t\t\t\t\t\t\t\t    \t\t\t<li ng-if=\"editItem.nameData.key === 'billPeriodsForBr' ? false :true\">-</li> \r\n\t\t\t\t\t\t\t\t\t    \t\t\t<li ng-if=\"editItem.nameData.key === 'billPeriodsForBr' ? true :false\" \r\n\t\t\t\t\t\t\t\t\t    \t\t\t\tng-bind = \"editItem.data.presentServiceFeeZc|toNum0\"></li>\r\n\t\t\t\t\t\t\t\t\t    \t\t\t\r\n\t\t\t\t\t\t\t\t\t    \t\t\t\r\n\t\t\t\t\t\t\t\t\t    \t\t\t\r\n\t\t\t\t\t\t\t\t\t    \t\t\t<li ng-if=\"editItem.nameData.key === 'billPeriods' ? false :true\">-</li>\r\n\t\t\t\t\t\t\t\t\t    \t\t\t<li ng-if=\"editItem.nameData.key === 'billPeriods' ? true :false\" \r\n\t\t\t\t\t\t\t\t\t    \t\t\t\tng-bind = \"editItem.data.presentLateFee|toNum0\"></li>\r\n\t\t\t\t\t\t\t\t\t    \t\t\t\t\r\n\t\t\t\t\t\t\t\t\t    \t\t\t<li ng-if=\"editItem.nameData.key === 'billPeriods' ? false :true\">-</li>\r\n\t\t\t\t\t\t\t\t\t    \t\t\t<li ng-if=\"editItem.nameData.key === 'billPeriods' ? true :false\" \r\n\t\t\t\t\t\t\t\t\t    \t\t\t\tng-bind = \"editItem.data.presentLateManFee|toNum0\"></li>\r\n\t\t\t\t\t\t\t\t\t    \t\t\t\r\n\t\t\t\t\t\t\t\t\t    \t\t\t<li ng-if=\"editItem.nameData.key === 'billPeriodsForBr' ? true :false\">-</li>\r\n\t\t\t\t\t\t\t\t\t    \t\t\t<li ng-if=\"editItem.nameData.key === 'billPeriodsForBr' ? false :true\" ng-bind = \"editItem.data.presentServiceFee|toNum0\"></li>\r\n\t\t\t\t\t\t\t\t\t    \t\t\t<!--<li ng-bind = \"editItem.data.presentTotDue|toNum0\"></li>-->\r\n\t\t\t\t\t\t\t\t\t    \t\t\t<li ng-bind = \"(editItem.data.presentServiceFee + editItem.data.presentInt + editItem.data.presentPri)|number:2\"></li>\r\n\t\t\t\t\t\t\t\t\t    \t\t\t<li><input ng-change=\"handlePeriodsInp(editItem.data.repaidPri,editItem.data,'repaidPri')\" ng-model=\"editItem.data.repaidPri\" type=\"number\" /></li>\r\n\t\t\t\t\t\t\t\t\t    \t\t\t\t\r\n\t\t\t\t\t\t\t\t\t    \t\t\t\r\n\t\t\t\t\t\t\t\t\t    \t\t\t<li><input ng-change=\"handlePeriodsInp(editItem.data.repaidInt,editItem.data,'repaidInt')\" ng-model=\"editItem.data.repaidInt\" type=\"number\" /></li>\r\n\t\t\t\t\t\t\t\t\t    \t\t\t\r\n\t\t\t\t\t\t\t\t\t    \t\t\t<li ng-if=\"editItem.nameData.key === 'billPeriodsForBr' ? false :true\">-</li> \r\n\t\t\t\t\t\t\t\t\t    \t\t\t<li ng-if=\"editItem.nameData.key === 'billPeriodsForBr' ? true :false\">\r\n\t\t\t\t\t\t\t\t\t    \t\t\t\t<input ng-change=\"handlePeriodsInp(editItem.data.repaidServiceFee,editItem.data,'repaidServiceFee')\" ng-model=\"editItem.data.repaidServiceFee\" type=\"number\" />\r\n\t\t\t\t\t\t\t\t\t    \t\t\t</li>\r\n\t\t\t\t\t\t\t\t\t    \t\t\t\r\n\t\t\t\t\t\t\t\t\t    \t\t\t<li ng-if=\"editItem.nameData.key === 'billPeriodsForBr' ? false :true\">-</li> \r\n\t\t\t\t\t\t\t\t\t    \t\t\t<li ng-if=\"editItem.nameData.key === 'billPeriodsForBr' ? true :false\">\r\n\t\t\t\t\t\t\t\t\t    \t\t\t\t<input ng-change=\"handlePeriodsInp(editItem.data.repaidServiceFeeBr,editItem.data,'repaidServiceFeeBr')\" ng-model=\"editItem.data.repaidServiceFeeBr\" type=\"number\" />\r\n\t\t\t\t\t\t\t\t\t    \t\t\t</li>\r\n\t\t\t\t\t\t\t\t\t    \t\t\t\r\n\t\t\t\t\t\t\t\t\t    \t\t\t<li ng-if=\"editItem.nameData.key === 'billPeriodsForBr' ? false :true\">-</li> \r\n\t\t\t\t\t\t\t\t\t    \t\t\t<li ng-if=\"editItem.nameData.key === 'billPeriodsForBr' ? true :false\">\r\n\t\t\t\t\t\t\t\t\t    \t\t\t\t<input ng-change=\"handlePeriodsInp(editItem.data.repaidServiceFeeZc,editItem.data,'repaidServiceFeeZc')\" ng-model=\"editItem.data.repaidServiceFeeZc\" type=\"number\" />\r\n\t\t\t\t\t\t\t\t\t    \t\t\t</li>\r\n\t\t\t\t\t\t\t\t\t    \t\t\t\r\n\t\t\t\t\t\t\t\t\t    \t\t\t\t\r\n\t\t\t\t\t\t\t\t\t    \t\t\t\r\n\t\t\t\t\t\t\t\t\t    \t\t\t<li ng-if=\"editItem.nameData.key === 'billPeriods' ? false :true\">-</li>\r\n\t\t\t\t\t\t\t\t\t    \t\t\t<li ng-if=\"editItem.nameData.key === 'billPeriods' ? true :false\">\r\n\t\t\t\t\t\t\t\t\t    \t\t\t\t<input ng-change=\"handlePeriodsInp(editItem.data.repaidLateFee,editItem.data,'repaidLateFee')\" ng-model=\"editItem.data.repaidLateFee\" type=\"number\" />\r\n\t\t\t\t\t\t\t\t\t    \t\t\t</li>\r\n\t\t\t\t\t\t\t\t\t    \t\t\t\r\n\t\t\t\t\t\t\t\t\t    \t\t\t<li ng-if=\"editItem.nameData.key === 'billPeriods' ? false :true\">-</li>\r\n\t\t\t\t\t\t\t\t\t    \t\t\t<li ng-if=\"editItem.nameData.key === 'billPeriods' ? true :false\">\r\n\t\t\t\t\t\t\t\t\t    \t\t\t\t<input ng-change=\"handlePeriodsInp(editItem.data.repaidLateManFee,editItem.data,'repaidLateManFee')\" ng-model=\"editItem.data.repaidLateManFee\" type=\"number\" />\r\n\t\t\t\t\t\t\t\t\t    \t\t\t</li>\r\n\t\t\t\t\t\t\t\t\t    \t\t\t\r\n\t\t\t\t\t\t\t\t\t    \t\t\t<li ng-if=\"editItem.nameData.key === 'billPeriods' || \r\n\t\t\t\t\t\t\t\t\t    \t\t\t\teditItem.nameData.key === 'billPeriodsForZc' ? false :true\">-</li>\r\n\t\t\t\t\t\t\t\t\t    \t\t\t<li ng-if=\"editItem.nameData.key === 'billPeriods' || \r\n\t\t\t\t\t\t\t\t\t    \t\t\t\teditItem.nameData.key === 'billPeriodsForZc' ? true :false\">\r\n\t\t\t\t\t\t\t\t\t    \t\t\t\t<input ng-change=\"handlePeriodsInp(editItem.data.repaidServiceFee,editItem.data,'repaidServiceFee')\" ng-model=\"editItem.data.repaidServiceFee\" type=\"number\" />\r\n\t\t\t\t\t\t\t\t\t    \t\t\t</li>\r\n\t\t\t\t\t\t\t\t\t    \t\t\t\r\n\t\t\t\t\t\t\t\t\t    \t\t\t<li ng-if=\"editItem.nameData.key === 'billPeriods' || \r\n\t\t\t\t\t\t\t\t\t    \t\t\t\teditItem.nameData.key === 'billPeriodsForZc' ? false :true\">-</li>\r\n\t\t\t\t\t\t\t\t\t    \t\t\t<li ng-if=\"editItem.nameData.key === 'billPeriods' || \r\n\t\t\t\t\t\t\t\t\t    \t\t\t\teditItem.nameData.key === 'billPeriodsForZc' ? true :false\">\r\n\t\t\t\t\t\t\t\t\t    \t\t\t\t<input ng-change=\"handlePeriodsInp(editItem.data.repaidTotMoney,editItem.data,'repaidTotMoney')\" ng-model=\"editItem.data.repaidTotMoney\" type=\"number\" />\r\n\t\t\t\t\t\t\t\t\t    \t\t\t</li>\r\n\t\t\t\t\t\t\t\t\t    \t\t\t\r\n\t\t\t\t\t\t\t\t\t    \t\t\t<li><input ng-blur=\"validateItemTime($event,editItem.data,'repaidDate')\" placeholder=\"格式：yyyy/MM/dd\" \r\n\t\t\t\t\t\t\t\t\t    \t\t\t\tng-model=\"editItem.data.repaidDate\" type=\"text\" /></li>\r\n\t\t\t\t\t\t\t\t\t    \t\t\t\t\r\n\t\t\t\t\t\t\t\t\t    \t\t\t\r\n\t\t\t\t\t\t\t\t\t    \t\t\t\r\n\t\t\t\t\t\t\t\t\t    \t\t\t<li ng-if=\"editItem.nameData.key === 'billPeriods' ? false :true\">-</li>\r\n\t\t\t\t\t\t\t\t\t    \t\t\t<li ng-if=\"editItem.nameData.key === 'billPeriods' ? true :false\">\r\n\t\t\t\t\t\t\t\t\t    \t\t\t\t<input ng-blur=\"validateItemTime($event,editItem.data,'presOverdueDate')\" placeholder=\"格式：yyyy/MM/dd\" \r\n\t\t\t\t\t\t\t\t\t    \t\t\t\t\tng-model=\"editItem.data.presOverdueDate\" type=\"text\" /> \r\n\t\t\t\t\t\t\t\t\t    \t\t\t</li>\r\n\t\t\t\t\t\t\t\t\t    \t\t\t\r\n\t\t\t\t\t\t\t\t\t    \t\t\t<li><input ng-blur=\"validateItemTime($event,editItem.data,'repaidDeadline')\" placeholder=\"格式：yyyy/MM/dd\" \r\n\t\t\t\t\t\t\t\t\t    \t\t\t\tng-model=\"editItem.data.repaidDeadline\" type=\"text\" /></li>\r\n\t\t\t\t\t\t\t\t\t    \t\t\t\r\n\t\t\t\t\t\t\t\t\t    \t\t\t\r\n\t\t\t\t\t\t\t\t\t    \t\t\t<li><input ng-change=\"handlePeriodsInp(editItem.data.fineMoney,editItem.data,'fineMoney')\" ng-model=\"editItem.data.fineMoney\" type=\"number\" /></li>   \r\n\t\t\t\t\t\t\t\t\t    \t\t\t\t\r\n\t\t\t\t\t\t\t\t\t    \t\t\t\r\n\t\t\t\t\t\t\t\t\t    \t\t\t<li><input ng-blur=\"validateItemTime($event,editItem.data,'fineDate')\" placeholder=\"格式：yyyy/MM/dd HH:mm:ss\" \r\n\t\t\t\t\t\t\t\t\t    \t\t\t\tng-model=\"editItem.data.fineDate\" type=\"text\" /></li>\r\n\t\t\t\t\t\t\t\t\t    \t\t\t\r\n\t\t\t\t\t\t\t\t\t    \t\t\t<li ng-if=\"editItem.nameData.key === 'billPeriods' ? false :true\">-</li>\r\n\t\t\t\t\t\t\t\t\t    \t\t\t<li ng-if=\"editItem.nameData.key === 'billPeriods' ? true :false\">\r\n\t\t\t\t\t\t\t\t\t    \t\t\t\t<input ng-change=\"handlePeriodsInp(editItem.data.fineRepaidMoney,editItem.data,'fineRepaidMoney')\" ng-model=\"editItem.data.fineRepaidMoney\" type=\"number\"/>\r\n\t\t\t\t\t\t\t\t\t    \t\t\t</li>\r\n\t\t\t\t\t\t\t\t\t    \t\t\t\r\n\t\t\t\t\t\t\t\t\t    \t\t\t<li ng-if=\"editItem.nameData.key === 'billPeriods' ? false :true\">-</li>\r\n\t\t\t\t\t\t\t\t\t    \t\t\t<li ng-if=\"editItem.nameData.key === 'billPeriods' ? true :false\">\r\n\t\t\t\t\t\t\t\t\t    \t\t\t\t<input ng-blur=\"validateItemTime($event,editItem.data,'fineRepaidDate')\" placeholder=\"格式：yyyy/MM/dd HH:mm:ss\" \r\n\t\t\t\t\t\t\t\t\t    \t\t\t\t\tng-model=\"editItem.data.fineRepaidDate\" type=\"text\"/>\r\n\t\t\t\t\t\t\t\t\t    \t\t\t</li>\r\n\t\t\t\t\t\t\t\t\t    \t\t\t\r\n\t\t\t\t\t\t\t\t\t    \t\t\t<li ng-bind = \"(editItem.data.repaidServiceFee + editItem.data.repaidPri + editItem.data.repaidInt)|number:2\"></li>\r\n\t\t\t\t\t\t\t\t\t    \t\t\t\r\n\t\t\t\t\t\t\t\t\t    \t\t\t<li>\r\n\t\t\t\t\t\t\t\t\t    \t\t\t\t<select ng-model=\"editItem.data.status\" ng-options=\"option.id as option.value for option in belongStateList\"></select>\r\n\t\t\t\t\t\t\t\t\t    \t\t\t</li> \r\n\t\t\t\t\t    \t\t\t\t\t\t</ul>\r\n\t\t\t\t\t    \t\t\t\t\t\t<div class=\"edit-item-remark\">\r\n\t\t\t\t\t    \t\t\t\t\t\t\t<p>备注：</p>\r\n\t\t\t\t\t    \t\t\t\t\t\t\t<textarea maxlength=\"500\" ng-model=\"itemFormParam.remark\"></textarea>\r\n\t\t\t\t\t    \t\t\t\t\t\t</div>\r\n\t\t\t\t\t    \t\t\t\t\t</div>\r\n\t\t\t\t\t    \t\t\t\t</cloak_frame>\r\n\t\t\t\t\t    \t\t\t</li>\r\n\t\t\t\t\t    \t\t\t<li ng-bind = \"{{handleNum(item.presentTotDue - item.repaidTotMoney - item.repaidServiceFee)}}|toNum0\"></li>\r\n\t\t\t\t\t    \t\t\t<li ng-bind = \"item.presentPri|toNum0\"></li>\r\n\t\t\t\t\t    \t\t\t<li ng-bind = \"item.presentInt|toNum0\"></li>\r\n\t\t\t\t\t    \t\t\t<li ng-bind = \"item.presentLateFee|toNum0\"></li>\r\n\t\t\t\t\t    \t\t\t<li ng-bind = \"item.presentLateManFee|toNum0\"></li>\r\n\t\t\t\t\t    \t\t\t<li ng-bind = \"item.presentServiceFee|toNum0\"></li>\r\n\t\t\t\t\t    \t\t\t<!--<li ng-bind = \"item.presentTotDue|toNum0\"></li>-->\r\n\t\t\t\t\t    \t\t\t<li ng-bind = \"(item.presentServiceFee + item.presentInt + item.presentPri)|number:2\"></li>\r\n\t\t\t\t\t    \t\t\t<li ng-bind = \"item.repaidPri|toNum0\"></li>\r\n\t\t\t\t\t    \t\t\t<li ng-bind = \"item.repaidInt|toNum0\"></li>\r\n\t\t\t\t\t    \t\t\t<li ng-bind = \"item.repaidLateFee|toNum0\"></li>\r\n\t\t\t\t\t    \t\t\t<li ng-bind = \"item.repaidLateManFee|toNum0\"></li>\r\n\t\t\t\t\t    \t\t\t<li ng-bind = \"item.repaidServiceFee|toNum0\"></li>\r\n\t\t\t\t\t    \t\t\t<li ng-bind = \"item.repaidTotMoney|toNum0\"></li>\r\n\t\t\t\t\t    \t\t\t<li ng-bind = \"item.repaidDate.time|timeDateFilter\"></li><!--实际回款日期-->\r\n\t\t\t\t\t    \t\t\t<li ng-bind = \"item.presOverdueDate.time|timeDateFilter\"></li>\r\n\t\t\t\t\t    \t\t\t<li ng-bind = \"item.repaidDeadline.time|timeDateFilter\"></li>\r\n\t\t\t\t\t    \t\t\t<li ng-bind = \"item.fineMoney|toNum0\"></li>\r\n\t\t\t\t\t    \t\t\t<li ng-bind = \"item.fineDate.time|timeFilter\"></li>\r\n\t\t\t\t\t    \t\t\t<li ng-bind = \"item.fineRepaidMoney|toNum0\"></li>\r\n\t\t\t\t\t    \t\t\t<li ng-bind = \"item.fineRepaidDate.time|timeFilter\"></li>\r\n\t\t\t\t\t    \t\t\t<li ng-bind = \"(item.repaidServiceFee + item.repaidTotMoney)|number:2\"></li>\r\n\t\t\t\t\t    \t\t\t<li ng-bind = \"item.status\"></li>  \r\n\t\t\t\t\t    \t\t</ul>\r\n\t\t\t\t\t\t\t</div>\r\n\t\t\t    \t\t</div>\r\n\t\t\t    \t</div>\r\n\t\t    \t</div>\r\n\t\t    \t<div class=\"detail_plan\">\r\n\t\t    \t\t<div id=\"detailInfo\" class=\"sectionMargin detailInfo\">\r\n\t\t\t    \t\t<ul class=\"sideTitle\">\r\n\t\t\t\t    \t\t<li>当前期数</li>\r\n\t\t\t\t    \t\t<li>当期应偿本金</li>\r\n\t\t\t\t    \t\t<li>当期应偿利息</li>\r\n\t\t\t\t    \t\t<li>当期应偿总服务费</li>\r\n\t\t\t\t    \t\t<li>当期应偿百融服务费</li>\r\n\t\t\t\t    \t\t<li>当期应偿合作方服务费</li>\r\n\t\t\t\t    \t\t<li class=\"overStyle\" title=\"当期应偿总金额 = 当期应偿总服务费 + 当期应偿本金 + 当期应偿利息\">当期应偿总金额</li>\r\n\t\t\t\t    \t\t<li>当期已偿本金</li>\r\n\t\t\t\t    \t\t<li>当期已偿利息</li>\r\n\t\t\t\t    \t\t<li>当期已偿总服务费</li>\r\n\t\t\t\t    \t\t<li>当期已偿百融服务费</li>\r\n\t\t\t\t    \t\t<li>当期已偿合作方服务费</li>\r\n\t\t\t\t    \t\t<li>应回款日期</li>\r\n\t\t\t\t    \t\t<li>实际回款日期</li>\r\n\t\t\t\t    \t\t<li>保证金划扣金额 </li>\r\n\t\t\t\t    \t\t<li>保证金划扣时间</li>\r\n\t\t\t\t    \t\t<li class=\"overStyle\" title=\"还款合计 = 当期已偿总服务费 + 当期已偿本金 + 当期已偿利息\">还款合计</li>\r\n\t\t\t\t    \t\t<li>当期状态</li>\r\n\t\t\t\t    \t</ul>\r\n\t\t\t    \t\t<div class=\"innerAuto\">\r\n\t\t\t\t\t\t\t<div class=\"innerWrapper\">\r\n\t\t\t\t\t\t\t\t<ul ng-repeat = \"item in billPeriodsData.billPeriodsForBr\">\r\n\t\t\t\t\t    \t\t\t<li>第{{item.billPeriods}}期</li>\r\n\t\t\t\t\t    \t\t\t<li ng-bind = \"item.presentPri|toNum0\"></li>\r\n\t\t\t\t\t    \t\t\t<li ng-bind = \"item.presentInt|toNum0\"></li>\r\n\t\t\t\t\t    \t\t\t<li ng-bind = \"item.presentServiceFee|toNum0\"></li>\r\n\t\t\t\t\t    \t\t\t<li ng-bind = \"item.presentServiceFeeBr|toNum0\"></li>\r\n\t\t\t\t\t    \t\t\t<li ng-bind = \"item.presentServiceFeeZc|toNum0\"></li>\r\n\t\t\t\t\t    \t\t\t<li ng-bind = \"(item.presentServiceFee + item.presentInt + item.presentPri)|number:2\"></li>\r\n\t\t\t\t\t    \t\t\t<li ng-bind = \"item.repaidPri|toNum0\"></li>\r\n\t\t\t\t\t    \t\t\t<li ng-bind = \"item.repaidInt|toNum0\"></li>\r\n\t\t\t\t\t    \t\t\t<li ng-bind = \"item.repaidServiceFee|toNum0\"></li>\r\n\t\t\t\t\t    \t\t\t<li ng-bind = \"item.repaidServiceFeeBr|toNum0\"></li>\r\n\t\t\t\t\t    \t\t\t<li ng-bind = \"item.repaidServiceFeeZc|toNum0\"></li>\r\n\t\t\t\t\t    \t\t\t<li ng-bind = \"item.repaidDeadline.time|timeDateFilter\"></li>\r\n\t\t\t\t\t    \t\t\t<li ng-bind = \"item.repaidDate.time|timeDateFilter\"></li>\r\n\t\t\t\t\t    \t\t\t<li ng-bind = \"item.fineMoney|toNum0\"></li>\r\n\t\t\t\t\t    \t\t\t<li ng-bind = \"item.fineDate.time|timeDateFilter\"></li>\r\n\t\t\t\t\t    \t\t\t<li ng-bind = \"(item.repaidPri + item.repaidInt + item.repaidServiceFee)|number:2\"></li>\r\n\t\t\t\t\t    \t\t\t<li ng-bind = \"item.status\"></li>\r\n\t\t\t\t\t    \t\t</ul>\r\n\t\t\t\t\t\t\t</div>\r\n\t\t\t    \t\t</div>\r\n\t\t\t    \t</div>\r\n\t\t    \t</div>\r\n\t\t    \t<div class=\"detail_plan\">\r\n\t\t\t    \t<div id=\"detailInfo\" class=\"sectionMargin detailInfo\">\r\n\t\t\t    \t\t<ul class=\"sideTitle\">\r\n\t\t\t\t    \t\t<li>当前期数</li>\r\n\t\t\t\t    \t\t<li class=\"overStyle\" title=\"当期应偿未偿金额 = 当期应偿总金额 - 当期已偿总金额 - 当期已偿服务费\">当期应偿未偿金额</li>\r\n\t\t\t\t    \t\t<li>当期应偿本金</li>\r\n\t\t\t\t    \t\t<li>当期应偿利息</li>\r\n\t\t\t\t    \t\t<li>当期应偿服务费</li>\r\n\t\t\t\t    \t\t<li>当期应偿总金额</li>\r\n\t\t\t\t    \t\t<li>当期已偿本金</li>\r\n\t\t\t\t    \t\t<li>当期已偿利息</li>\r\n\t\t\t\t    \t\t<li>当期已偿服务费</li>\r\n\t\t\t\t    \t\t<li>当期已偿总金额</li>\r\n\t\t\t\t    \t\t<li>应回款日期</li>\r\n\t\t\t\t    \t\t<li>实际回款日期</li>\r\n\t\t\t\t    \t\t<li>保证金划扣金额</li>\r\n\t\t\t\t    \t\t<li>保证金划扣时间</li>\r\n\t\t\t\t    \t\t<li class=\"overStyle\" title=\"还款合计 = 当期已偿服务费 + 当期已偿总金额\">还款合计</li>\r\n\t\t\t\t    \t\t<li>当期状态</li>\r\n\t\t\t\t    \t</ul>\r\n\t\t\t    \t\t<div class=\"innerAuto\">\r\n\t\t\t\t\t\t\t<div class=\"innerWrapper\">\r\n\t\t\t\t\t\t\t\t<ul ng-repeat = \"item in billPeriodsData.billPeriodsForZc\">\r\n\t\t\t\t\t    \t\t\t<li>第{{item.billPeriods}}期</li>\r\n\t\t\t\t\t    \t\t\t<li ng-bind = \"(item.presentTotDue - item.repaidTotMoney - item.repaidServiceFee).toFixed(2)|toNum0\"></li>\r\n\t\t\t\t\t    \t\t\t<li ng-bind = \"item.presentPri|toNum0\"></li>\r\n\t\t\t\t\t    \t\t\t<li ng-bind = \"item.presentInt|toNum0\"></li>\r\n\t\t\t\t\t    \t\t\t<li ng-bind = \"item.presentServiceFee|toNum0\"></li>\r\n\t\t\t\t\t    \t\t\t<li ng-bind = \"item.presentTotDue|toNum0\"></li>\r\n\t\t\t\t\t    \t\t\t<li ng-bind = \"item.repaidPri|toNum0\"></li>\r\n\t\t\t\t\t    \t\t\t<li ng-bind = \"item.repaidInt|toNum0\"></li>\r\n\t\t\t\t\t    \t\t\t<li ng-bind = \"item.repaidServiceFee|toNum0\"></li>\r\n\t\t\t\t\t    \t\t\t<li ng-bind = \"item.repaidTotMoney|toNum0\"></li>\r\n\t\t\t\t\t    \t\t\t<li ng-bind = \"item.repaidDeadline.time|timeDateFilter\"></li>\r\n\t\t\t\t\t    \t\t\t<li ng-bind = \"item.repaidDate.time|timeDateFilter\"></li><!--实际回款日期-->\r\n\t\t\t\t\t    \t\t\t<li ng-bind = \"item.fineMoney|toNum0\"></li>\r\n\t\t\t\t\t    \t\t\t<li ng-bind = \"item.fineDate.time|timeFilter\"></li>\r\n\t\t\t\t\t    \t\t\t<li ng-bind = \"(item.repaidServiceFee + item.repaidTotMoney)|number:2\"></li>\r\n\t\t\t\t\t    \t\t\t<li ng-bind = \"item.status\"></li>  \r\n\t\t\t\t\t    \t\t</ul>\r\n\t\t\t\t\t\t\t</div>\r\n\t\t\t    \t\t</div>\r\n\t\t\t    \t</div>\r\n\t\t    \t</div>\r\n\t    \t</div>\r\n\t    \t\r\n\t    \t<div>\r\n\t    \t\t<table class=\"detailRunning\" width=\"100%\" border=\"1px\" bordercolor=\"#d2d2d2\">\r\n\t\t    \t\t<caption class=\"sectionTit\">明细账单流水</caption>\r\n\t\t    \t\t<thead>\r\n\t\t    \t\t\t<th width=\"40%\">流水号</th>\r\n\t\t    \t\t\t<th width=\"40%\">数据更新时间</th>\r\n\t\t    \t\t\t<th width=\"10%\">回款总金额</th>\r\n\t\t    \t\t\t<th width=\"10%\">操作</th>\r\n\t\t    \t\t\t<th ng-show = \"showScroll\" style=\"font-size: 16px; background: #fff;\">&nbsp;&nbsp;&nbsp;</th>\r\n\t\t    \t\t</thead>\r\n\t\t    \t</table>\r\n\t    \t</div>\r\n\t    \t<div class=\"limitHeight1\" ng-show = \"swifts.length\">\r\n\t    \t\t<table class=\"sectionMargin detailRunning\" width=\"100%\" border=\"1px\" bordercolor=\"#d2d2d2\">\r\n\t\t    \t\t<tr ng-repeat = \"item in swifts\">\r\n\t\t\t    \t\t<td width=\"40%\" ng-bind = \"item.swiftNumber\"></td>\r\n\t\t\t    \t\t<td width=\"40%\" ng-bind = \"item.presentTime.time|timeFilter\"></td>\r\n\t\t\t    \t\t<td width=\"10%\" ng-bind=\"item.totalMoney\"></td>\r\n\t\t\t    \t\t<td width=\"10%\"><a ng-click = \"viewRunning(item)\" href=\"javascript:void(0)\">查看</a></td>\r\n\t\t\t    \t</tr>\r\n\t\t    \t</table>\r\n\t    \t</div>\r\n\t    \t<table ng-if = \"true\" class = \"sectionMargin detailRunning\" width=\"100%\" border=\"1px\" bordercolor=\"#d2d2d2\"> \r\n\t    \t\t<caption class=\"sectionTit\">代扣通知操作明细</caption>\r\n\t    \t\t<tr>\r\n\t    \t\t\t<th>流水号</th>\r\n\t    \t\t\t<th>代扣通知发出时间</th>\r\n\t    \t\t\t<th>当前应偿未偿总金额</th>\r\n\t    \t\t\t<th>代扣结果</th>\r\n\t    \t\t\t<th>合作机构代扣金额</th>\r\n\t    \t\t\t<th>操作人</th>\r\n\t    \t\t\t<th>操作</th>\r\n\t    \t\t</tr>\r\n\t    \t\t<tr ng-repeat = \"item in collection\">\r\n\t    \t\t\t<td ng-bind = \"item.swiftNumber\"></td>\r\n\t    \t\t\t<td ng-bind = \"item.createTime.time|timeFilter\"></td>\r\n\t    \t\t\t<td ng-bind = \"item.presentDueSum\"></td>\r\n\t    \t\t\t<td ng-bind = \"item.withholdStatus|isSuccess\"></td>\r\n\t    \t\t\t<td ng-bind = \"item.withholdAmount\"></td>\r\n\t    \t\t\t<td ng-bind = \"item.adminUser\"></td>\r\n\t    \t\t\t<td><a ng-click = \"deductRecord(item)\" href=\"javascript:void(0)\">查看</a></td>\r\n\t    \t\t</tr>\r\n\t    \t</table>\r\n\t    \t<table ng-if = \"true\" width=\"100%\" class = \"detailRunning\" border=\"1px\" bordercolor=\"#d2d2d2\"> \r\n\t    \t\t<caption class=\"sectionTit\">结束催收记录明细</caption>\r\n\t    \t\t<tr>\r\n\t    \t\t\t<th>催收结束时间</th>\r\n\t    \t\t\t<th>结束详情</th>\r\n\t    \t\t\t<th>操作人</th>\r\n\t    \t\t</tr>\r\n\t    \t\t<tr ng-repeat = \"item in collectionOver\">\r\n\t    \t\t\t<td ng-bind = \"item.createTime.time|timeFilter\"></td>\r\n\t    \t\t\t<td ng-bind = \"item.collEndDetail\"></td>\r\n\t    \t\t\t<td ng-bind = \"item.adminUser\"></td>\r\n\t    \t\t</tr>\r\n\t    \t</table>\r\n\t    \t<table ng-if = \"true\" width=\"100%\" class = \"detailRunning\" border=\"1px\" bordercolor=\"#d2d2d2\"> \r\n\t    \t\t<caption class=\"sectionTit\">修改历史记录</caption>\r\n\t    \t\t<tr>\r\n\t    \t\t\t<th width=\"20%\">修改时间</th>\r\n\t    \t\t\t<th width=\"20%\">修改IP</th>\r\n\t    \t\t\t<th width=\"10%\">修改人</th>\r\n\t    \t\t\t<th>备注</th>\r\n\t    \t\t\t<th width=\"5%\">操作</th>\r\n\t    \t\t</tr>\r\n\t    \t\t<tr ng-repeat = \"item in periodsRecord\">\r\n\t    \t\t\t<td ng-bind = \"item.createTime.time|timeFilter\"></td>\r\n\t    \t\t\t<td ng-bind = \"item.requestIp\"></td>\r\n\t    \t\t\t<td ng-bind = \"item.editName\"></td>\r\n\t    \t\t\t<td ng-bind = \"item.remark\"></td>\r\n\t    \t\t\t<td class=\"show-periods-td\">\r\n\t    \t\t\t\t<a ng-click =\"showModifyRecord($index+1)\" href=\"javascript:void(0)\">查看</a>\r\n\t    \t\t\t\t<cloak_frame name=\"modifyRecordForm\" head=\"第({{item.billPeriods}})期 修改记录查看\">\r\n\t    \t\t\t\t\t<div id=\"detailInfo\">\r\n\t    \t\t\t\t\t\t<div class=\"show-periods-list\">\r\n\t\t    \t\t\t\t\t\t<ul class=\"sideTitle\">\r\n\t\t\t\t\t\t    \t\t\t<li>计划所属机构</li>\r\n\t\t\t\t\t\t\t\t\t\t<li class=\"overStyle\" title = \"当期应偿未偿金额 = 当期应偿总金额 - 当期已偿总金额\">当期应偿未偿金额</li>\r\n\t\t\t\t\t\t\t\t\t\t<li>当期应偿本金</li>\r\n\t\t\t\t\t\t\t\t\t\t<li>当期应偿利息</li>\r\n\t\t\t\t\t\t\t\t\t\t<li>当期应偿总服务费</li>\r\n\t\t\t\t\t    \t\t\t\t<li>当期应偿百融服务费</li>\r\n\t\t\t\t\t    \t\t\t\t<li>当期应偿合作方服务费</li>\r\n\t\t\t\t\t\t\t\t\t\t<li>当期应偿滞纳金</li>\r\n\t\t\t\t\t\t\t\t\t\t<li>当期应偿逾期管理费</li>\r\n\t\t\t\t\t\t\t\t\t\t<li>当期应偿服务费</li>\r\n\t\t\t\t\t\t\t\t\t\t<li>当期应偿总金额</li>\r\n\t\t\t\t\t\t\t\t\t\t<li>当期已偿本金</li>\r\n\t\t\t\t\t\t\t\t\t\t<li>当期已偿利息</li>\r\n\t\t\t\t\t\t\t\t\t\t<li>当期已偿总服务费</li>\r\n\t\t\t\t\t\t\t\t\t\t<li>当期已偿百融服务费</li>\r\n\t\t\t\t\t\t\t\t\t\t<li>当期已偿合作方服务费</li>\r\n\t\t\t\t\t\t\t\t\t\t<li>当期已偿滞纳金</li>\r\n\t\t\t\t\t\t\t\t\t\t<li>当期已偿逾期管理费</li>\r\n\t\t\t\t\t\t\t\t\t\t<li>当期已偿服务费</li>\r\n\t\t\t\t\t\t\t\t\t\t<li>当期已偿总金额</li>\r\n\t\t\t\t\t\t\t\t\t\t<li>实际回款日期</li>\r\n\t\t\t\t\t\t\t\t\t\t<li>当次逾期发生日期</li>\r\n\t\t\t\t\t\t\t\t\t\t<li>应回款日期</li>\r\n\t\t\t\t\t\t\t\t\t\t<li>保证金划扣金额</li>\r\n\t\t\t\t\t\t\t\t\t\t<li>保证金划扣时间</li>\r\n\t\t\t\t\t\t\t\t\t\t<li>合作机构回款金额</li>\r\n\t\t\t\t\t\t\t\t\t\t<li>合作机构回款时间</li>\r\n\t\t\t\t\t\t\t\t\t\t<li class=\"overStyle\" title=\"还款合计 = 当期已偿总金额 + 当期已偿服务费\">还款合计</li>\r\n\t\t\t\t\t\t\t\t\t\t<li>当期状态</li>\r\n\t\t\t\t\t\t    \t\t</ul>\r\n\t\t    \t\t\t\t\t\t<ul ng-repeat=\"_item in periodsRecordDetail.data\">\r\n\t\t    \t\t\t\t\t\t\t<li ng-bind = \"_item.nameData.name|toNum0\"></li>\r\n\t\t\t\t\t\t    \t\t\t\t\t\t\t\r\n\t\t\t\t\t\t    \t\t\t<li ng-if=\"_item.nameData.key === 'brBefore' || _item.nameData.key === 'brAfter'? false : true\" \r\n\t\t\t\t\t\t    \t\t\t\tng-bind = \"{{handleNum(_item.data.presentTotDue.val - _item.data.repaidTotMoney.val - _item.data.repaidServiceFee.val)}}|toNum0\"></li>\r\n\t\t\t\t\t\t    \t\t\t<li ng-if=\"_item.nameData.key === 'brBefore' || _item.nameData.key === 'brAfter'? true : false\">-</li>\r\n\t\t\t\t\t\t    \t\t\t\t\t\t\t\r\n\t\t\t\t\t\t\t\t\t\t<li ng-bind = \"_item.data.presentPri.val|toNum0\"></li>\r\n\t\t\t\t\t\t\t\t\t\t<li ng-bind = \"_item.data.presentInt.val|toNum0\"></li>\r\n\t\t\t\t\t\t\t\t\t\t    \t\t\t\r\n\t\t\t\t\t\t\t\t\t\t    \t\t\t\r\n\t\t\t\t\t\t    \t\t\t\r\n\t\t\t\t\t\t    \t\t\t\r\n\t\t\t\t\t\t\t\t\t\t<li ng-if=\"_item.nameData.key === 'brBefore' || _item.nameData.key === 'brAfter' ? false :true\">-</li> \r\n\t\t\t\t\t\t\t\t\t\t<li ng-if=\"_item.nameData.key === 'brBefore' || _item.nameData.key === 'brAfter' ? true :false\" \r\n\t\t\t\t\t\t\t\t\t\t    ng-bind = \"_item.data.presentServiceFee.val|toNum0\"></li>\r\n\t\t\t\t\t\t\t\t\t\t    \t\t\t\r\n\t\t\t\t\t\t\t\t\t\t<li ng-if=\"_item.nameData.key === 'brBefore' || _item.nameData.key === 'brAfter' ? false :true\">-</li> \r\n\t\t\t\t\t\t\t\t\t\t<li ng-if=\"_item.nameData.key === 'brBefore' || _item.nameData.key === 'brAfter' ? true :false\" \r\n\t\t\t\t\t\t\t\t\t\t    ng-bind = \"_item.data.presentServiceFeeBr.val|toNum0\"></li>\r\n\t\t\t\t\t\t\t\t\t\t    \t\t\t\r\n\t\t\t\t\t\t\t\t\t\t<li ng-if=\"_item.nameData.key === 'brBefore' || _item.nameData.key === 'brAfter' ? false :true\">-</li> \r\n\t\t\t\t\t\t\t\t\t\t<li ng-if=\"_item.nameData.key === 'brBefore' || _item.nameData.key === 'brAfter' ? true :false\" \r\n\t\t\t\t\t\t\t\t\t\t    ng-bind = \"_item.data.presentServiceFeeZc.val|toNum0\"></li>\r\n\t\t\t\t\t\t\t\t\t\t    \t\t\t\r\n\t\t\t\t\t\t\t\t\t\t    \t\t\t\r\n\t\t\t\t\t\t\t\t\t\t    \t\t\t\r\n\t\t\t\t\t\t\t\t\t\t<li ng-if=\"_item.nameData.key === 'zjBefore' || _item.nameData.key === 'zjAfter' ? false :true\">-</li>\r\n\t\t\t\t\t\t\t\t\t\t<li ng-if=\"_item.nameData.key === 'zjBefore' || _item.nameData.key === 'zjAfter' ? true :false\" \r\n\t\t\t\t\t\t\t\t\t\t    ng-bind = \"_item.data.presentLateFee.val|toNum0\"></li>\r\n\t\t\t\t\t\t\t\t\t\t    \t\t\t\t\r\n\t\t\t\t\t\t\t\t\t\t<li ng-if=\"_item.nameData.key === 'zjBefore' || _item.nameData.key === 'zjAfter' ? false :true\">-</li>\r\n\t\t\t\t\t\t\t\t\t\t<li ng-if=\"_item.nameData.key === 'zjBefore' || _item.nameData.key === 'zjAfter' ? true :false\" \r\n\t\t\t\t\t\t\t\t\t\t    ng-bind = \"_item.data.presentLateManFee.val|toNum0\"></li>\r\n\t\t\t\t\t\t\t\t\t\t    \t\t\t\r\n\t\t\t\t\t\t\t\t\t\t<li ng-bind = \"_item.data.presentServiceFee.val|toNum0\"></li>\r\n\t\t\t\t\t\t\t\t\t\t<!--<li ng-bind = \"_item.data.presentTotDue.val|toNum0\"></li>-->\r\n\t\t\t\t\t\t\t\t\t\t<li ng-bind = \"(_item.data.presentServiceFee.val + _item.data.presentInt.val + _item.data.presentPri.val)|number:2\"></li>\r\n\t\t\t\t\t\t\t\t\t\t    \t\t\t\r\n\t\t\t\t\t\t\t\t\t\t<li  ng-class=\"{'changed':_item.data.repaidPri.sign}\" ng-bind=\"_item.data.repaidPri.val\"></li>\r\n\t\t\t\t\t\t\t\t\t\t    \t\t\t\t\r\n\t\t\t\t\t\t\t\t\t\t    \t\t\t\r\n\t\t\t\t\t\t\t\t\t\t<li  ng-class=\"{'changed':_item.data.repaidInt.sign}\" ng-bind=\"_item.data.repaidInt.val\"></li>\r\n\t\t\t\t\t\t\t\t\t\t    \t\t\t\r\n\t\t\t\t\t\t\t\t\t\t<li ng-if=\"_item.nameData.key === 'brBefore' || \r\n\t\t\t\t\t\t\t\t\t\t\t_item.nameData.key === 'brAfter' ? false :true\">-</li> \r\n\t\t\t\t\t\t\t\t\t\t<li  ng-class=\"{'changed':_item.data.repaidServiceFee.sign}\" ng-if=\"_item.nameData.key === 'brBefore' || \r\n\t\t\t\t\t\t\t\t\t\t\t_item.nameData.key === 'brAfter' ? true :false\"  ng-bind=\"_item.data.repaidServiceFee.val\"></li>\r\n\t\t\t\t\t\t\t\t\t\t    \t\t\t\r\n\t\t\t\t\t\t\t\t\t\t<li ng-if=\"_item.nameData.key === 'brBefore' || \r\n\t\t\t\t\t\t\t\t\t\t\t_item.nameData.key === 'brAfter' ? false :true\">-</li> \r\n\t\t\t\t\t\t\t\t\t\t<li  ng-class=\"{'changed':_item.data.repaidServiceFeeBr.sign}\" ng-if=\"_item.nameData.key === 'brBefore' || \r\n\t\t\t\t\t\t\t\t\t\t\t_item.nameData.key === 'brAfter' ? true :false\"  ng-bind=\"_item.data.repaidServiceFeeBr.val\"></li>\r\n\t\t\t\t\t\t\t\t\t\t    \t\t\t\r\n\t\t\t\t\t\t\t\t\t\t<li ng-if=\"_item.nameData.key === 'brBefore' || \r\n\t\t\t\t\t\t\t\t\t\t\t_item.nameData.key === 'brAfter' ? false :true\">-</li> \r\n\t\t\t\t\t\t\t\t\t\t<li ng-class=\"{'changed':_item.data.repaidServiceFeeZc.sign}\" ng-if=\"_item.nameData.key === 'brBefore' || \r\n\t\t\t\t\t\t\t\t\t\t\t_item.nameData.key === 'brAfter' ? true :false\"  ng-bind=\"_item.data.repaidServiceFeeZc.val\"></li>\r\n\t\t\t\t\t\t\t\t\t\t    \t\t\t\r\n\t\t\t\t\t\t\t\t\t\t    \t\t\t\t\r\n\t\t\t\t\t\t\t\t\t\t    \t\t\t\r\n\t\t\t\t\t\t\t\t\t\t<li ng-if=\"_item.nameData.key === 'zjBefore' || \r\n\t\t\t\t\t\t\t\t\t\t\t_item.nameData.key === 'zjAfter' ? false :true\">-</li>\r\n\t\t\t\t\t\t\t\t\t\t<li  ng-class=\"{'changed':_item.data.repaidLateFee.sign}\" ng-if=\"_item.nameData.key === 'zjBefore' || \r\n\t\t\t\t\t\t\t\t\t\t\t_item.nameData.key === 'zjAfter' ? true :false\"  ng-bind=\"_item.data.repaidLateFee.val\"></li>\r\n\t\t\t\t\t\t\t\t\t\t    \t\t\t\r\n\t\t\t\t\t\t\t\t\t\t<li ng-if=\"_item.nameData.key === 'zjBefore' || \r\n\t\t\t\t\t\t\t\t\t\t\t_item.nameData.key === 'zjAfter' ? false :true\">-</li>\r\n\t\t\t\t\t\t\t\t\t\t<li ng-class=\"{'changed':_item.data.repaidLateManFee.sign}\" ng-if=\"_item.nameData.key === 'zjBefore' || \r\n\t\t\t\t\t\t\t\t\t\t\t_item.nameData.key === 'zjAfter' ? true :false\"  ng-bind=\"_item.data.repaidLateManFee.val\"></li>\r\n\t\t\t\t\t\t\t\t\t\t    \t\t\t\r\n\t\t\t\t\t\t\t\t\t\t<li ng-if=\"_item.nameData.key === 'zjBefore' || \r\n\t\t\t\t\t\t\t\t\t\t    _item.nameData.key === 'zjAfter' || \r\n\t\t\t\t\t\t\t\t\t\t    _item.nameData.key === 'zcBefore' ||  \r\n\t\t\t\t\t\t\t\t\t\t    _item.nameData.key === 'zcAfter'  ? false :true\">-</li>\r\n\t\t\t\t\t\t\t\t\t\t<li  ng-class=\"{'changed':_item.data.repaidServiceFee.sign}\" ng-if=\"_item.nameData.key === 'zjBefore' || \r\n\t\t\t\t\t\t\t\t\t\t    _item.nameData.key === 'zjAfter' || \r\n\t\t\t\t\t\t\t\t\t\t    _item.nameData.key === 'zcBefore' ||  \r\n\t\t\t\t\t\t\t\t\t\t    _item.nameData.key === 'zcAfter' ? true :false\"  ng-bind=\"_item.data.repaidServiceFee.val\"></li>\r\n\t\t\t\t\t\t\t\t\t\t    \t\t\t\r\n\t\t\t\t\t\t\t\t\t\t<li ng-if=\"_item.nameData.key === 'zjBefore' || \r\n\t\t\t\t\t\t\t\t\t\t    _item.nameData.key === 'zjAfter' || \r\n\t\t\t\t\t\t\t\t\t\t    _item.nameData.key === 'zcBefore' ||  \r\n\t\t\t\t\t\t\t\t\t\t    _item.nameData.key === 'zcAfter' ? false :true\">-</li>\r\n\t\t\t\t\t\t\t\t\t\t<li  ng-class=\"{'changed':_item.data.repaidTotMoney.sign}\" ng-if=\"_item.nameData.key === 'zjBefore' || \r\n\t\t\t\t\t\t\t\t\t\t    _item.nameData.key === 'zjAfter' || \r\n\t\t\t\t\t\t\t\t\t\t    _item.nameData.key === 'zcBefore' ||  \r\n\t\t\t\t\t\t\t\t\t\t    _item.nameData.key === 'zcAfter' ? true :false\"  ng-bind=\"_item.data.repaidTotMoney.val\"></li>\r\n\t\t\t\t\t\t\t\t\t\t    \t\t\t\r\n\t\t\t\t\t\t\t\t\t\t<li ng-class=\"{'changed':_item.data.repaidDate.sign}\" ng-bind=\"_item.data.repaidDate.val\"></li>\r\n\t\t\t\t\t\t\t\t\t\t    \t\t\t\t\r\n\t\t\t\t\t\t\t\t\t\t    \t\t\t\r\n\t\t\t\t\t\t\t\t\t\t    \t\t\t\r\n\t\t\t\t\t\t\t\t\t\t<li ng-if=\"_item.nameData.key === 'zjBefore' || \r\n\t\t\t\t\t\t\t\t\t\t\t_item.nameData.key === 'zjAfter' ? false :true\">-</li>\r\n\t\t\t\t\t\t\t\t\t\t<li  ng-class=\"{'changed':_item.data.presOverdueDate.sign}\" ng-if=\"_item.nameData.key === 'zjBefore' || \r\n\t\t\t\t\t\t\t\t\t\t\t_item.nameData.key === 'zjAfter' ? true :false\"  ng-bind=\"_item.data.presOverdueDate.val\"></li>\r\n\t\t\t\t\t\t\t\t\t\t    \t\t\t\r\n\t\t\t\t\t\t\t\t\t\t<li ng-class=\"{'changed':_item.data.repaidDeadline.sign}\" ng-bind=\"_item.data.repaidDeadline.val\"></li>\r\n\t\t\t\t\t\t\t\t\t\t    \t\t\t\r\n\t\t\t\t\t\t\t\t\t\t    \t\t\t\r\n\t\t\t\t\t\t\t\t\t\t<li  ng-class=\"{'changed':_item.data.fineMoney.sign}\" ng-bind=\"_item.data.fineMoney.val\"></li>   \r\n\t\t\t\t\t\t\t\t\t\t    \t\t\t\t\r\n\t\t\t\t\t\t\t\t\t\t    \t\t\t\r\n\t\t\t\t\t\t\t\t\t\t<li ng-class=\"{'changed':_item.data.fineDate.sign}\" ng-bind=\"_item.data.fineDate.val\"></li>\r\n\t\t\t\t\t\t\t\t\t\t    \t\t\t\r\n\t\t\t\t\t\t\t\t\t\t<li ng-if=\"_item.nameData.key === 'zjBefore' || \r\n\t\t\t\t\t\t\t\t\t\t\t_item.nameData.key === 'zjAfter' ? false :true\">-</li>\r\n\t\t\t\t\t\t\t\t\t\t<li  ng-class=\"{'changed':_item.data.fineRepaidMoney.sign}\" ng-if=\"_item.nameData.key === 'zjBefore' || \r\n\t\t\t\t\t\t\t\t\t\t\t_item.nameData.key === 'zjAfter' ? true :false\" ng-bind=\"_item.data.fineRepaidMoney.val\"></li>\r\n\t\t\t\t\t\t\t\t\t\t    \t\t\t\r\n\t\t\t\t\t\t\t\t\t\t<li ng-if=\"_item.nameData.key === 'zjBefore' || \r\n\t\t\t\t\t\t\t\t\t\t\t_item.nameData.key === 'zjAfter' ? false :true\">-</li>\r\n\t\t\t\t\t\t\t\t\t\t<li  ng-class=\"{'changed':_item.data.fineRepaidDate.sign}\" ng-if=\"_item.nameData.key === 'zjBefore' || \r\n\t\t\t\t\t\t\t\t\t\t\t_item.nameData.key === 'zjAfter' ? true :false\" ng-bind=\"_item.data.fineRepaidDate.val\"></li>\r\n\t\t\t\t\t\t\t\t\t\t    \t\t\t\r\n\t\t\t\t\t\t\t\t\t\t<li ng-bind = \"(_item.data.repaidServiceFee.val + _item.data.repaidPri.val + _item.data.repaidInt.val)|number:2\"></li> \r\n\t\t\t\t\t\t\t\t\t\t<li ng-class=\"{'changed':_item.data.status.sign,'changedBefore':_item.data.status.before}\" ng-bind=\"_item.data.status.val\"></li> \r\n\t\t    \t\t\t\t\t\t</ul>\r\n\t\t\t    \t\t\t\t\t<div class=\"edit-item-remark\">\r\n\t\t\t\t\t\t    \t\t\t<p>备注：</p>\r\n\t\t\t\t\t\t    \t\t\t<div class=\"check-remark\" ng-bind=\"periodsRecordDetail.remark\"></div>\r\n\t\t\t\t\t\t    \t\t</div>\r\n\t\t    \t\t\t\t\t</div>\r\n\t    \t\t\t\t\t</div>\r\n\t    \t\t\t\t</cloak_frame>\r\n\t    \t\t\t</td>\r\n\t    \t\t</tr>\r\n\t    \t</table>\r\n\t    \t<div class=\"goBack\">\r\n\t    \t\t<a class=\"btn6 mr50\" ng-click=\"overReceivable()\" ng-show = \"receivableRole\" href=\"javascript:void(0)\">结束催收</a>\r\n\t    \t\t<a class=\"btn6 mr50\" ng-click=\"emitInform()\" ng-show = \"receivableRole\" href=\"javascript:void(0)\">发出代扣通知</a>\r\n\t\t\t\t<a class=\"btn6 mr50\" ng-click=\"goBack()\" href=\"javascript:void(0)\">返 回</a>\r\n\t    \t</div>\r\n\t    </div>\r\n\t    <div class=\"inner-footer\"></div>\r\n\t    \r\n\t    <div ng-class=\"{overReceivableST : !inputFlag , emitInformST : inputFlag }\" ng-show = \"alerShow\">\r\n\t\t\t<p class=\"marginBt40\"  style=\"text-align: center; font-size: 16px;\">{{subInfo}}</p>\r\n\t\t\t<div style=\"text-align: center; height: 250px;\" ng-style = \"{marginBottom: inputFlag ? 0 : 50}\">                          \r\n\t\t\t\t<p style=\"color: #ed948e; margin-bottom: 5px;\" ng-show = \"isError\" ng-bind = \"errorText\"></p>\r\n\t\t\t\t<span ng-show = \"!inputFlag && isDeductRecord\">代扣金额：</span><input ng-show = \"!inputFlag && isDeductRecord\" maxlength=\"22\" ng-model = 'subArea' ng-keyup = \"checkInputMoney(subArea)\"/>\r\n\t\t\t\t<textarea ng-show = \"inputFlag\" maxlength=\"500\" style=\"width: 680px; height: 180px;\" ng-model = 'subArea'></textarea>\r\n\t\t\t\t<div ng-show = \"!inputFlag\" id=\"detailInfo3\" class=\"sectionMargin\">\r\n\t                <div class=\"sectionTit\">还款显示</div>\r\n\t                <ul class=\"sideTitle\">\r\n\t                    <li>当前期数</li>\r\n\t                    <li>本金</li>\r\n\t                    <li>利息</li>\r\n\t                    <li>滞纳金</li>\r\n\t                    <li>逾期管理费</li>\r\n\t                    <li>服务费</li>\r\n\t                </ul>\r\n\t                <div style=\"height: 192px; overflow-y: auto; overflow-x: hidden ; float: left;\">\r\n\t                    <div style=\"height: 192px; width: 340px;\">\r\n\t                        <ul ng-repeat = \"item in billPeriods3\">\r\n\t                            <li>第{{item.billPeriods}}期</li>\r\n\t                            <li ng-bind = \"item.presentPri|toNum0\"></li>\r\n\t                            <li ng-bind = \"item.presentInt|toNum0\"></li>\r\n\t                            <li ng-bind = \"item.presentLateFee|toNum0\"></li>\r\n\t                            <li ng-bind = \"item.presentLateManFee|toNum0\"></li>\r\n\t                            <li ng-bind = \"item.presentServiceFee|toNum0\"></li>\r\n\t                        </ul>\r\n\t                    </div>\r\n\t                </div>\r\n\t            </div>\r\n\t\t\t</div>\r\n\t\t\t<div style=\"text-align: center;\" ng-style = \"{'margin-top':overReceivableFlag?'-20px':'35px'}\">\r\n\t\t\t\t<a class=\"btn6\" ng-show = \"!isDeductRecord\" ng-click=\"closeDialog()\" href=\"javascript:void(0)\">关闭</a>\r\n\t\t\t\t<a class=\"btn6  mlr30\" ng-show = \"isDeductRecord\" ng-click=\"submit()\" href=\"javascript:void(0)\">是</a>\r\n\t\t\t\t<a class=\"btn6 mlr30\" ng-show = \"isDeductRecord\" ng-click=\"cancel()\" href=\"javascript:void(0)\">否</a>\r\n\t\t\t</div>\r\n\t\t</div>\r\n\t    <operate-dir></operate-dir>\r\n\t\t<history-dir></history-dir>\r\n\t\t<prove-data></prove-data>\r\n\t\t<primary-operate></primary-operate>\r\n\t\t<call-up></call-up>\r\n\t    <div id=\"report-template-mask\" style=\"z-index: 1030;\" ng-style=\"{display:primaryOperate ? 'block' : 'none'}\"></div>\r\n\t\t<div id=\"report-template-mask\" ng-style=\"{display:isShowReportDialog ? 'block' : 'none'}\"></div>\r\n\t\t<div id=\"report-template-mask\" ng-style=\"{display:isShowReportDialog5 ? 'block' : 'none'}\"></div>\r\n\t    <div id=\"report-template-mask\" style=\"z-index: 1030;\" ng-style=\"{display:isShowReportDialog4 ? 'block' : 'none'}\"></div>\r\n\t    <div id=\"report-template-mask\" style=\"z-index: 1010;\"  ng-style=\"{display:isShowReportDialog3 ? 'block' : 'none'}\"></div>\r\n\t    <div class=\"diagram-view\" style=\"{{ (diagram.visible ? '' : 'display:none;') }}\" ng-click=\"diagram.click($event)\">\r\n\t        <div class=\"diagram-box\">\r\n\t            <img src=\"{{diagram.img.url}}\" ng-style=\"{width: diagram.img.width, height: diagram.img.height}\" />\r\n\t            <div class=\"diagram-stepnow\" ng-style=\"{left: diagram.stepNow.left, top: diagram.stepNow.top, width: diagram.stepNow.width, height: diagram.stepNow.height}\"></div>\r\n\t        </div>\r\n\t    </div>\r\n\t</div>\r\n</div>"

/***/ }

});