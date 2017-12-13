webpackJsonp([21],{

/***/ 11:
/***/ function(module, exports) {

	/*
		MIT License http://www.opensource.org/licenses/mit-license.php
		Author Tobias Koppers @sokra
	*/
	// css base code, injected by the css-loader
	module.exports = function() {
		var list = [];

		// return the list of modules as css string
		list.toString = function toString() {
			var result = [];
			for(var i = 0; i < this.length; i++) {
				var item = this[i];
				if(item[2]) {
					result.push("@media " + item[2] + "{" + item[1] + "}");
				} else {
					result.push(item[1]);
				}
			}
			return result.join("");
		};

		// import a list of modules into the list
		list.i = function(modules, mediaQuery) {
			if(typeof modules === "string")
				modules = [[null, modules, ""]];
			var alreadyImportedModules = {};
			for(var i = 0; i < this.length; i++) {
				var id = this[i][0];
				if(typeof id === "number")
					alreadyImportedModules[id] = true;
			}
			for(i = 0; i < modules.length; i++) {
				var item = modules[i];
				// skip already imported module
				// this implementation is not 100% perfect for weird media query combinations
				//  when a module is imported multiple times with different media queries.
				//  I hope this will never occur (Hey this way we have smaller bundles)
				if(typeof item[0] !== "number" || !alreadyImportedModules[item[0]]) {
					if(mediaQuery && !item[2]) {
						item[2] = mediaQuery;
					} else if(mediaQuery) {
						item[2] = "(" + item[2] + ") and (" + mediaQuery + ")";
					}
					list.push(item);
				}
			}
		};
		return list;
	};


/***/ },

/***/ 16:
/***/ function(module, exports, __webpack_require__) {

	/*
		MIT License http://www.opensource.org/licenses/mit-license.php
		Author Tobias Koppers @sokra
	*/
	var stylesInDom = {},
		memoize = function(fn) {
			var memo;
			return function () {
				if (typeof memo === "undefined") memo = fn.apply(this, arguments);
				return memo;
			};
		},
		isOldIE = memoize(function() {
			return /msie [6-9]\b/.test(window.navigator.userAgent.toLowerCase());
		}),
		getHeadElement = memoize(function () {
			return document.head || document.getElementsByTagName("head")[0];
		}),
		singletonElement = null,
		singletonCounter = 0,
		styleElementsInsertedAtTop = [];

	module.exports = function(list, options) {
		if(false) {
			if(typeof document !== "object") throw new Error("The style-loader cannot be used in a non-browser environment");
		}

		options = options || {};
		// Force single-tag solution on IE6-9, which has a hard limit on the # of <style>
		// tags it will allow on a page
		if (typeof options.singleton === "undefined") options.singleton = isOldIE();

		// By default, add <style> tags to the bottom of <head>.
		if (typeof options.insertAt === "undefined") options.insertAt = "bottom";

		var styles = listToStyles(list);
		addStylesToDom(styles, options);

		return function update(newList) {
			var mayRemove = [];
			for(var i = 0; i < styles.length; i++) {
				var item = styles[i];
				var domStyle = stylesInDom[item.id];
				domStyle.refs--;
				mayRemove.push(domStyle);
			}
			if(newList) {
				var newStyles = listToStyles(newList);
				addStylesToDom(newStyles, options);
			}
			for(var i = 0; i < mayRemove.length; i++) {
				var domStyle = mayRemove[i];
				if(domStyle.refs === 0) {
					for(var j = 0; j < domStyle.parts.length; j++)
						domStyle.parts[j]();
					delete stylesInDom[domStyle.id];
				}
			}
		};
	}

	function addStylesToDom(styles, options) {
		for(var i = 0; i < styles.length; i++) {
			var item = styles[i];
			var domStyle = stylesInDom[item.id];
			if(domStyle) {
				domStyle.refs++;
				for(var j = 0; j < domStyle.parts.length; j++) {
					domStyle.parts[j](item.parts[j]);
				}
				for(; j < item.parts.length; j++) {
					domStyle.parts.push(addStyle(item.parts[j], options));
				}
			} else {
				var parts = [];
				for(var j = 0; j < item.parts.length; j++) {
					parts.push(addStyle(item.parts[j], options));
				}
				stylesInDom[item.id] = {id: item.id, refs: 1, parts: parts};
			}
		}
	}

	function listToStyles(list) {
		var styles = [];
		var newStyles = {};
		for(var i = 0; i < list.length; i++) {
			var item = list[i];
			var id = item[0];
			var css = item[1];
			var media = item[2];
			var sourceMap = item[3];
			var part = {css: css, media: media, sourceMap: sourceMap};
			if(!newStyles[id])
				styles.push(newStyles[id] = {id: id, parts: [part]});
			else
				newStyles[id].parts.push(part);
		}
		return styles;
	}

	function insertStyleElement(options, styleElement) {
		var head = getHeadElement();
		var lastStyleElementInsertedAtTop = styleElementsInsertedAtTop[styleElementsInsertedAtTop.length - 1];
		if (options.insertAt === "top") {
			if(!lastStyleElementInsertedAtTop) {
				head.insertBefore(styleElement, head.firstChild);
			} else if(lastStyleElementInsertedAtTop.nextSibling) {
				head.insertBefore(styleElement, lastStyleElementInsertedAtTop.nextSibling);
			} else {
				head.appendChild(styleElement);
			}
			styleElementsInsertedAtTop.push(styleElement);
		} else if (options.insertAt === "bottom") {
			head.appendChild(styleElement);
		} else {
			throw new Error("Invalid value for parameter 'insertAt'. Must be 'top' or 'bottom'.");
		}
	}

	function removeStyleElement(styleElement) {
		styleElement.parentNode.removeChild(styleElement);
		var idx = styleElementsInsertedAtTop.indexOf(styleElement);
		if(idx >= 0) {
			styleElementsInsertedAtTop.splice(idx, 1);
		}
	}

	function createStyleElement(options) {
		var styleElement = document.createElement("style");
		styleElement.type = "text/css";
		insertStyleElement(options, styleElement);
		return styleElement;
	}

	function createLinkElement(options) {
		var linkElement = document.createElement("link");
		linkElement.rel = "stylesheet";
		insertStyleElement(options, linkElement);
		return linkElement;
	}

	function addStyle(obj, options) {
		var styleElement, update, remove;

		if (options.singleton) {
			var styleIndex = singletonCounter++;
			styleElement = singletonElement || (singletonElement = createStyleElement(options));
			update = applyToSingletonTag.bind(null, styleElement, styleIndex, false);
			remove = applyToSingletonTag.bind(null, styleElement, styleIndex, true);
		} else if(obj.sourceMap &&
			typeof URL === "function" &&
			typeof URL.createObjectURL === "function" &&
			typeof URL.revokeObjectURL === "function" &&
			typeof Blob === "function" &&
			typeof btoa === "function") {
			styleElement = createLinkElement(options);
			update = updateLink.bind(null, styleElement);
			remove = function() {
				removeStyleElement(styleElement);
				if(styleElement.href)
					URL.revokeObjectURL(styleElement.href);
			};
		} else {
			styleElement = createStyleElement(options);
			update = applyToTag.bind(null, styleElement);
			remove = function() {
				removeStyleElement(styleElement);
			};
		}

		update(obj);

		return function updateStyle(newObj) {
			if(newObj) {
				if(newObj.css === obj.css && newObj.media === obj.media && newObj.sourceMap === obj.sourceMap)
					return;
				update(obj = newObj);
			} else {
				remove();
			}
		};
	}

	var replaceText = (function () {
		var textStore = [];

		return function (index, replacement) {
			textStore[index] = replacement;
			return textStore.filter(Boolean).join('\n');
		};
	})();

	function applyToSingletonTag(styleElement, index, remove, obj) {
		var css = remove ? "" : obj.css;

		if (styleElement.styleSheet) {
			styleElement.styleSheet.cssText = replaceText(index, css);
		} else {
			var cssNode = document.createTextNode(css);
			var childNodes = styleElement.childNodes;
			if (childNodes[index]) styleElement.removeChild(childNodes[index]);
			if (childNodes.length) {
				styleElement.insertBefore(cssNode, childNodes[index]);
			} else {
				styleElement.appendChild(cssNode);
			}
		}
	}

	function applyToTag(styleElement, obj) {
		var css = obj.css;
		var media = obj.media;

		if(media) {
			styleElement.setAttribute("media", media)
		}

		if(styleElement.styleSheet) {
			styleElement.styleSheet.cssText = css;
		} else {
			while(styleElement.firstChild) {
				styleElement.removeChild(styleElement.firstChild);
			}
			styleElement.appendChild(document.createTextNode(css));
		}
	}

	function updateLink(linkElement, obj) {
		var css = obj.css;
		var sourceMap = obj.sourceMap;

		if(sourceMap) {
			// http://stackoverflow.com/a/26603875
			css += "\n/*# sourceMappingURL=data:application/json;base64," + btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))) + " */";
		}

		var blob = new Blob([css], { type: "text/css" });

		var oldSrc = linkElement.href;

		linkElement.href = URL.createObjectURL(blob);

		if(oldSrc)
			URL.revokeObjectURL(oldSrc);
	}


/***/ },

/***/ 108:
/***/ function(module, exports, __webpack_require__) {

	var $ = __webpack_require__(109)

	/**
	  * mask遮罩
	  */
	var mask = {
		crrentHeight : 0,
		defaultStyle : function(){
			return {
				height : "auto",
				zIndex : 1000,
				display: 'block',
				opacity: 0.7,
				background : '#000',
				position :'absolute',
				top : 0,
				right : 0,
				bottom :0,
				left : 0,
			}
		},
		creatMask : function(pn,cg){
			if(!pn) {
				throw new Error('parent element is null ! plase creat element  fill secend param(only id)');
			};
			var wrapName,maskElm; 
			wrapName = $("#" + pn);
			maskElm = document.createElement('div');
			maskElm.id = 'maskDialog';
			wrapName.append(maskElm);
			
			var maskConfig = cg || Object.keys(cg).length || this.defaultStyle();
			this.maskAddStyle(maskConfig);
		},
		addStyle : function(styleList){
			var elm = $("#maskDialog");
			if(!$("#maskDialog").size()){
				throw new Error('the id#maskDialog is no defined');
				return
			}
			elm.css(styleList);
		},
		maskAddStyle : function(maskConfig){
			if(!maskConfig || !Object.keys(maskConfig).length) {
				this.addStyle(this.defaultStyle());
				return;
			};
			var initStyle = this.defaultStyle();
			var styleList = {};
			
			for(var k in initStyle){
				if(!maskConfig[k]){
					styleList[k] = initStyle[k];
				}
				else{
					styleList[k] = maskConfig[k];
				}
			}
			styleList.height = this.isLessClient(styleList.height);
			this.addStyle(styleList);
		},
		isLessClient : function(setHeight){
			var clientHeight = document.documentElement.clientHeight;
			if(setHeight < clientHeight){
				this.crrentHeight = clientHeight;
				return clientHeight;
			}
			this.crrentHeight = setHeight;
			return setHeight;
		},
		getHeight : function(){
			return this.crrentHeight;
		}
	}

	/**
	 * 没有id为maskDialog的元素，先创建一个父元素把名字填入第二个参数,第一个为样式列表Json
	 */
	const maskCtrl = {
		show : function(config,pushElmName){
			if(!document.getElementById("maskDialog")){
				mask.creatMask(pushElmName,config);
			}
			else{
				mask.maskAddStyle(config);
			}
		},
		hidden : function(){
			var recoverHeight = document.documentElement.clientHeight;
			mask.maskAddStyle({display:"none",height:recoverHeight});
		},
		getHeight : function(){
			return mask.getHeight();
		}
	}

	module.exports = maskCtrl;
	//if(typeof exports === 'object' && typeof module === 'object'){
	//	
	//}
	//else{
	//	export default maskCtrl;
	//}



/***/ },

/***/ 185:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});

	var _jquery = __webpack_require__(109);

	var _jquery2 = _interopRequireDefault(_jquery);

	var _dialog_mask = __webpack_require__(108);

	var _dialog_mask2 = _interopRequireDefault(_dialog_mask);

	__webpack_require__(186);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var dependArr = [__webpack_require__(189).default.name]; /**
	                                                              * @author hontian.yem
	                                                              * 新建/编辑配对dialog
	                                                              */

	exports.default = {
		module: angular.module('pairOrgCtrl', dependArr).controller('pairOrgController', ['$scope', 'pairOrgService', '$state', '$timeout', controller]),
		template: __webpack_require__(190)
	};


	function controller(_, service, $state, $timeout) {
		'use strict';

		var o,
		    cfg = {},
		    timer;

		if ($state.params && $state.params.object && typeof $state.params.object === 'string') {
			try {
				_.statusParamInfo = JSON.parse(decodeURI($state.params.object));
			} catch (e) {};
		}
		_.production = {
			code: '',
			name: '',
			accPartnerCode: '',
			partnerName: '',
			fundSharing: '',
			assetSharing: '',
			brSharing: '',
			estimateLoan: '',
			collNode: ''
		};

		_.checkStatus = _.statusParamInfo.status == 2 ? false : true;

		function resetProduction() {
			for (var i in _.production) {
				_.production[i] = '';
			}
		}

		//如果是编辑补全基本信息
		function fullProduction(obj1, obj2) {
			for (var i in obj2) {
				obj1[i] = obj2[i];
			}
			return obj1;
		}

		//浮点数计算精度
		function accAdd(arg1, arg2) {
			var r1, r2, m;
			try {
				r1 = arg1.toString().split(".")[1].length;
			} catch (e) {
				r1 = 0;
			};
			try {
				r2 = arg2.toString().split(".")[1].length;
			} catch (e) {
				r2 = 0;
			};
			m = Math.pow(10, Math.max(r1, r2));
			return (arg1 * m + arg2 * m) / m;
		}

		function validateParam(data) {
			//等于0可以
			var ignorePropVal = ['fundSharing', 'assetSharing', 'brSharing', 'collNode'];

			var validateVal = saveParam(data),

			//				totalRatio = 1,
			isIntType = /^[0-9]*$/,
			    isAllFill = Object.keys(validateVal).every(function (v) {
				for (var i = 0, ii = ignorePropVal.length; i < ii; i++) {
					if (ignorePropVal[i] == v && validateVal[v] == '0') return true;
				}
				return typeof validateVal[v] == 'undefined' || validateVal[v] == 0 ? false : true;
			});
			//是否填全信息
			if (!isAllFill) {
				alert('信息填写不全，请检查信息！');
				return false;
			}
			//分成比例
			//			if(accAdd(accAdd(data.fundSharing,data.assetSharing),data.brSharing) !== totalRatio){
			//				data.fundSharing = data.assetSharing = data.brSharing = '';
			//				alert('分成比例信息填写有误，请重新填写！');
			//				return false;
			//			}
			if (!isIntType.test(data.estimateLoan)) {
				data.estimateLoan = '';
				alert('预计放款额必须为正整数！');
				return false;
			}
			if (!isIntType.test(data.collNode)) {
				data.collNode = '';
				alert('催收节点必须为正整数！');
				return false;
			}
			return true;
		}

		function saveParam(item) {
			var saveParam = {
				lasPartnerCode: _.statusParamInfo.partnerCode,
				productionCode: _.statusParamInfo.code,

				accPartnerCode: item.partnerName,
				fundSharing: item.fundSharing,
				assetSharing: item.assetSharing,
				brSharing: item.brSharing,
				estimateLoan: item.estimateLoan,
				collNode: item.collNode
			};
			if (_.editFlag) {
				saveParam.id = item.id;
			};
			return saveParam;
		}

		_.openPair = function () {
			var item = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : undefined;

			//新建/编辑默认项
			getSelectInfo(item);
			_.dialogShow = true;
			_dialog_mask2.default.show({ height: _.getClientHeight() });
			item ? render(item, _.statusParamInfo) : render(_.statusParamInfo);
		};

		_.savePair = function () {
			if (!validateParam(_.production)) return;
			service.save(saveParam(_.production)).then(function (data) {
				alert(data.responseMsg);
				_.dialogShow = false;
				_dialog_mask2.default.hidden();
				o.getUserInfoList();
			}, function (reason) {
				alert(reason.responseMsg);
			});
		};

		_.closePair = function () {
			_.dialogShow = false;
			_dialog_mask2.default.hidden();
		};

		/**
	  * 有第二个值为走编辑
	  */
		function render(item, addInfo) {
			_.editFlag = addInfo ? true : false;
			//重置production所有字段值
			resetProduction();
			item = addInfo ? fullProduction(item, addInfo) : item;

			for (var i in item) {
				if (!_.production[i]) _.production[i] = item[i];
			}
			_.production.partnerName = addInfo ? item.accPartnerCode : '';
		}

		/**
	  * 资金方下拉列表
	  * @param {Object} item
	  */
		function getSelectInfo() {
			var item = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : { partnerCode: _.statusParamInfo.partnerCode, productionCode: _.statusParamInfo.code };

			function getSelectList() {
				item = item.accPartnerCode ? { partnerCode: item.partnerCode, accPartnerCode: item.accPartnerCode, productionCode: item.productionCode } : item;
				service.getAccSideList(item).then(function (data) {
					var bankrollParList = [];
					if (Array.isArray(data.bankrollParList)) {
						bankrollParList = data.bankrollParList.slice();
						bankrollParList.unshift({
							partnerCode: "",
							partnerName: "请选择"
						});
					}
					_.accSideList = bankrollParList;
				}, function (reason) {
					alert(reason.responseMsg);
				});
			}
			$timeout(getSelectList, 50);
		}

		/**
	  * 默认产品列表查询
	  */
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
				if (!_.statusParamInfo) return;
				var cfg = config || { productionCode: _.statusParamInfo.code };
				service.getPairList(cfg).then(function (data) {
					_.pairList = data.accpartnerlist;
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
	}

/***/ },

/***/ 186:
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag

	// load the styles
	var content = __webpack_require__(187);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(16)(content, {});
	if(content.locals) module.exports = content.locals;
	// Hot Module Replacement
	if(true) {
		// When the styles change, update the <style> tags
		if(!content.locals) {
			module.hot.accept(187, function() {
				var newContent = __webpack_require__(187);
				if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
				update(newContent);
			});
		}
		// When the module is disposed, remove the <style> tags
		module.hot.dispose(function() { update(); });
	}

/***/ },

/***/ 187:
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(11)();
	// imports


	// module
	exports.push([module.id, ".pair-dialog{\r\n    width: 700px;\r\n    height: 400px;\r\n    position: fixed;\r\n    margin: -200px -350px 0 0;\r\n    top: 380px;\r\n    right: 50%;\r\n    z-index: 1200;\r\n    background: #efefef;\r\n}\r\n.pair-dialog-title{\r\n\theight: 50px;\r\n    line-height: 50px;\r\n    text-indent: 23px;\r\n    font-weight: 700;\r\n}\r\n.pair-title{\r\n\twidth: 114px; \r\n\ttext-align: right;\r\n}\r\n.pair-wrap tr{\r\n\theight: 50px;\r\n}\r\n.pair-wrap input{\r\n\twidth: 184px;\r\n}\r\n.pair-button{\r\n\tborder: none;\r\n    border-radius: 5px;\r\n    display: inline-block;\r\n    font-family: microsoft yahei;\r\n    font-size: 14px;\r\n    color: #ffffff;\r\n    padding: 10px 37px;\r\n    cursor: pointer;\r\n    background: #d8524a;\r\n    margin: 0 20px;\r\n}\r\n.handle-btn{\r\n\ttext-align: center;\r\n    margin: 20px 0;\r\n}\r\n.producitonInfo{\r\n\tbackground: #f2f2f2;\r\n\tpadding: 0 6px;\r\n\tborder: 1px solid #ccc;\r\n}\r\n.pair-edit-readonly{\r\n\tbackground: #ccc;\r\n\tborder: 1px solid #bbb;\r\n}\r\n.br-blank{\r\n\ttext-align: center;\r\n\tbackground: #efefef;\r\n\tborder: 1px solid #efefef;\r\n}\r\n.pair-edit-select{\r\n\twidth: 184px;\r\n\theight: 24px;\r\n}\r\n.arrow_right{\r\n\tbackground:url(" + __webpack_require__(188) + ") no-repeat right 18px;\r\n\tbackground-size: 85% 16px;\r\n}\r\n", ""]);

	// exports


/***/ },

/***/ 188:
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__.p + "/images/arrow_right.png";

/***/ },

/***/ 189:
/***/ function(module, exports) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	/**
	 * 
	 * @param {Object} util
	 * @param {Object} ajax
	 */

	function service(util, ajax) {
	  return {
	    save: function save(cfg) {
	      return ajax.post('/acc/productionaccpartner/save.do', cfg);
	    },
	    getPairList: function getPairList(cfg) {
	      return ajax.post("/acc/productionaccpartner/accpartnerlist.do", cfg);
	    },
	    getAccSideList: function getAccSideList(cfg) {
	      return ajax.post("/acc/productionaccpartner/bankrollParList.do", cfg);
	    }
	  };
	}

	exports.default = angular.module('pairOrgSer', []).factory('pairOrgService', ['util', 'ajax', service]);

/***/ },

/***/ 190:
/***/ function(module, exports) {

	module.exports = "<div class=\"main\">\r\n\t<loding-mask></loding-mask>\r\n\t<div class=\"inner\" ng-style=\"{'min-height':isShowReportDialog ? '5000px':'auto'}\">\r\n\t    <div class=\"inner-header clearfix\">\r\n\t        <div class=\"inner-header-lf fl\">机构配对</div>\r\n\t        <div class=\"inner-header-rt fr\" style=\"min-width:220px\">\r\n\t            <a href=\"javascript:void(0)\" ng-if = \"checkStatus\" ng-click = \"openPair()\" class=\"btn1 fr importA\">新增配对</a>\r\n\t        </div>\r\n\t    </div>\r\n\t    <div class=\"inner-body\">\r\n\t        <div class=\"inner-select\">\r\n\t            <table style=\"width: 100%;\">\r\n\t                 <tr>\r\n\t                    <td class=\"tl-r\"> 产品名称：</td>\r\n\t                    <td ng-bind = \"statusParamInfo.name\"></td>\r\n\t                </tr>\r\n\t                <tr>\r\n\t                    <td class=\"tl-r\"> 产品编码：</td>\r\n\t                    <td ng-bind = \"statusParamInfo.code\"></td>\r\n\t                </tr>\r\n\t                <tr>\r\n\t                    <td class=\"tl-r\"> 合作机构：</td>\r\n\t                    <td ng-bind = \"statusParamInfo.partner\"></td>\r\n\t                </tr>\r\n\t                <tr>\r\n\t                    <td class=\"tl-r\"> 合作机构编码：</td>\r\n\t                    <td ng-bind = \"statusParamInfo.partnerCode\"></td>\r\n\t                </tr>\r\n\t            </table>\r\n\t            <div class=\"inner-table\">\r\n\t                    <div class=\"hdFixed\">\r\n\t                    </div>\r\n\t                    <div class=\"bd\">\r\n\t                       <table class=\"table_user oddEvenColor\" border=\"1\" borderColor=\"#fff\" ng-click=\"tableClick($event)\">\r\n\t                            <tr>\r\n\t                                <th>资金合作机构名称</th>\r\n\t                                <th>资金方机构编码</th>\r\n\t                                <th>资金方分成</th>\r\n\t                            \t<th>资产方分成</th>\r\n\t                            \t<th>百融分成</th>\r\n\t                            \t<th>预计放款总额（万）</th>\r\n\t                            \t<th>催收发起节点</th>\r\n\t                                <th ng-if = \"checkStatus\">操作</th>\r\n\t                            </tr>\r\n\t                            <tr ng-repeat=\"item in pairList\">\r\n\t                                <td ng-bind=\"item.accPartnerName\"></td>\r\n\t                                <td ng-bind=\"item.accPartnerCode\"></td>\r\n\t                                <td ng-bind=\"item.fundSharing\"></td>\r\n\t                                <td ng-bind=\"item.assetSharing\"></td>\r\n\t                                <td ng-bind=\"item.brSharing\"></td>\r\n\t                                <td ng-bind=\"item.estimateLoan\"></td>\r\n\t                                <td ng-bind=\"item.collNode\"></td>\r\n\t                                <td ng-if = \"checkStatus\"><a href=\"javascript:void(0)\" ng-click = \"openPair(item)\">编辑</a></td>\r\n\t                            </tr>\r\n\t                        </table>\r\n\t                    </div>\r\n\t                <div class=\"ft clearfix\" ng-style=\"{visibility:showPage}\" style=\"margin-bottom: 50px;\">\r\n\t\t\t        </div>\r\n\t\t\t    </div>\r\n\t\t\t</div>\r\n\t    </div>\r\n\t    <div class=\"inner-footer\"></div>\r\n\t    <div class=\"pair-dialog\" ng-if = \"dialogShow\">\r\n\t    \t<div class=\"pair-dialog-title\">配对配置</div>\r\n\t    \t<table class = \"pair-wrap\">\r\n\t    \t\t<tr>\r\n\t    \t\t\t<td>\r\n\t    \t\t\t\t<div class=\"pair-title\">产品名称：</div>\r\n\t    \t\t\t</td>\r\n\t    \t\t\t<td>\r\n\t    \t\t\t\t<input class=\"pair-edit-readonly\" type=\"text\"  maxlength=\"50\" ng-model = \"production.name\" readonly=\"readonly\" />\r\n\t    \t\t\t</td>\r\n\t    \t\t\t<td><div style=\"width: 50px;\"></div></td>\r\n\t    \t\t\t<td>\r\n\t    \t\t\t\t<div class=\"pair-title\">产品编码：</div>\r\n\t    \t\t\t</td>\r\n\t    \t\t\t<td>\r\n\t    \t\t\t\t<input class=\"pair-edit-readonly\" type=\"text\"  maxlength=\"50\" ng-model = \"production.code\" readonly=\"readonly\" />\r\n\t    \t\t\t</td>\r\n\t    \t\t</tr>\r\n\t    \t\t<tr>\r\n\t    \t\t\t<td>\r\n\t    \t\t\t\t<div class=\"pair-title\">关联资金方：</div>\r\n\t    \t\t\t</td>\r\n\t    \t\t\t<td>\r\n\t    \t\t\t\t<select class=\"pair-edit-select\" ng-model = \"production.partnerName\" ng-options = \"option.partnerCode as option.partnerName for option in accSideList\"></select>\r\n\t    \t\t\t</td>\r\n\t    \t\t\t<td class=\"arrow_right\"></td>\r\n\t    \t\t\t\r\n\t    \t\t\t<td>\r\n\t    \t\t\t\t<div class=\"pair-title\">分成比例：</div>\r\n\t    \t\t\t</td>\r\n\t    \t\t\t<td>\r\n\t    \t\t\t\t<input type=\"number\" oninput=\"if(value.length>4)value=value.slice(0,6)\" ng-model = \"production.fundSharing\" />\r\n\t    \t\t\t</td>\r\n\t    \t\t</tr>\r\n\t    \t\t<tr>\r\n\t    \t\t\t<td>\r\n\t    \t\t\t\t<div class=\"pair-title\">资产方：</div>\r\n\t    \t\t\t</td>\r\n\t    \t\t\t<td>\r\n\t    \t\t\t\t<input class=\"pair-edit-readonly\" type=\"text\"  ng-model = \"production.partner\" readonly=\"readonly\"/>\r\n\t    \t\t\t</td>\r\n\t    \t\t\t<td class=\"arrow_right\"></td>\r\n\t    \t\t\t<td>\r\n\t    \t\t\t\t<div class=\"pair-title\">分成比例：</div>\r\n\t    \t\t\t</td>\r\n\t    \t\t\t<td>\r\n\t    \t\t\t\t<input type=\"number\"  oninput=\"if(value.length>4)value=value.slice(0,6)\" ng-model = \"production.assetSharing\" />\r\n\t    \t\t\t</td>\r\n\t    \t\t</tr>\r\n\t    \t\t<tr>\r\n\t    \t\t\t<td>\r\n\t    \t\t\t</td>\r\n\t    \t\t\t<td>\r\n\t    \t\t\t\t<input class=\"br-blank\" type=\"text\" value=\"百融方\" readonly=\"readonly\"/>\r\n\t    \t\t\t</td>\r\n\t    \t\t\t<td class=\"arrow_right\"></td>\r\n\t    \t\t\t<td>\r\n\t    \t\t\t\t<div class=\"pair-title\">分成比例：</div>\r\n\t    \t\t\t</td>\r\n\t    \t\t\t<td>\r\n\t    \t\t\t\t<input type=\"number\"  oninput=\"if(value.length>4)value=value.slice(0,6)\" ng-model = \"production.brSharing\" />\r\n\t    \t\t\t</td>\r\n\t    \t\t</tr>\r\n\t    \t\t<tr>\r\n\t    \t\t\t<td>\r\n\t    \t\t\t\t<div class=\"pair-title\">预计放款额&nbsp;&nbsp;&nbsp;&nbsp;<br>（万）：</div>\r\n\t    \t\t\t</td>\r\n\t    \t\t\t<td>\r\n\t    \t\t\t\t<input type=\"text\" maxlength=\"50\" ng-model = \"production.estimateLoan\" />\r\n\t    \t\t\t</td>\r\n\t    \t\t\t<td></td>\r\n\t    \t\t\t<td>\r\n\t    \t\t\t\t<div class=\"pair-title\">催收节点：</div>\r\n\t    \t\t\t</td>\r\n\t    \t\t\t<td>\r\n\t    \t\t\t\t<input type=\"text\" maxlength=\"50\" ng-model = \"production.collNode\" />\r\n\t    \t\t\t</td>\r\n\t    \t\t</tr>\r\n\t    \t</table>\r\n\t    \t<div class=\"handle-btn\">\r\n\t    \t\t<button class=\"pair-button\" ng-click = \"savePair()\">确定</button>\r\n\t    \t\t<button class=\"pair-button\" ng-click = \"closePair()\">返回</button>\r\n\t    \t</div>\r\n\t    </div>\r\n\t</div>\r\n</div>\r\n\t\r\n\t\t"

/***/ }

});