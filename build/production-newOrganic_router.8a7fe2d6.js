webpackJsonp([19],{

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

/***/ 177:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

	__webpack_require__(178);

	/**
	 * 把服务器的日期格式转化为文字
	 * @param date
	 * @returns {*}
	 */
	var toDateString = function toDateString(date) {
	    if ((typeof date === 'undefined' ? 'undefined' : _typeof(date)) !== 'object' || date === null || !date.time) return '';
	    return new Date(date.time).toLocaleDateString().replace(/\//g, '-');
	};

	/**
	 * 给数组的开头加入一项
	 * @param array
	 * @param idKey
	 * @param nameKey
	 * @returns {*}
	 */
	var unshiftOption = function unshiftOption(array, option) {
	    if (!Array.isArray(array)) array = [];
	    array.unshift(option);
	    return array;
	};

	/**
	 * 把某个属性的属性值覆盖另一个属性的属性值
	 * @param array
	 * @param srcProp
	 * @param aimProp
	 * @returns {*}
	 */
	var coverTheProp = function coverTheProp(array, srcProp, aimProp) {
	    if (Array.isArray(array)) {
	        array.forEach(function (item) {
	            item[aimProp] = item[srcProp];
	        });
	    } else if ((typeof array === 'undefined' ? 'undefined' : _typeof(array)) == "object" && !!array) {
	        array[aimProp] = array[aimProp];
	    }
	    return array;
	};

	/**
	 * FieldList数据转化器
	 * @type {{m2vm: FieldListTranslater.m2vm, vm2m: FieldListTranslater.vm2m}}
	 */
	var FieldListTranslater = {

	    /**
	     * 把数据转化为视图数据
	     * @param items
	     * @returns {{}}
	     */
	    m2vm: function m2vm(items, result) {
	        if (Array.isArray(items) && items.length > 0) {
	            // 循环把所有项都添加到结果中
	            items.forEach(function (item) {
	                var code = item.fieldCode;
	                result[code] = {
	                    fieldCode: code,
	                    isRequired: item.isRequired
	                };
	            });
	        }
	        return result;
	    },

	    /**
	     * 把视图数据转化为数据
	     * @param map
	     * @returns {Array}
	     */
	    vm2m: function vm2m(map) {
	        var fieldCode, isName, fieldtype;
	        var results = [];
	        Object.keys(map).forEach(function (name) {
	            var value = Object.assign({}, map[name]);
	            fieldCode = null;
	            if (value.isRequired && value.isRequired === "1") {
	                fieldCode = name;
	            }
	            if (fieldCode || value.fieldCode) {
	                results.push({
	                    fieldCode: name,
	                    isRequired: value.isRequired || "0"
	                });
	            }
	        });
	        return results;
	    }
	};

	/**
	 * production数据转化器
	 * @type {{m2vm: ProductionTranslater.m2vm}}
	 */
	var ProductionTranslater = {
	    m2vm: function m2vm(production) {
	        production.closingDate = toDateString(production.closingDate);
	        production.effectiveDate = toDateString(production.effectiveDate);
	        return production;
	    }

	};

	/**
	 * 基础数据转化器
	 * @type {{m2vm: BaseDataTranslater.m2vm}}
	 */
	var BaseDataTranslater = {

	    m2vm: function m2vm(data) {
	        //新增写死的还款方式下拉
	        var guaranteeList = [{ repayId: '0', value: '无' }, { repayId: '1', value: '有' }];

	        return {
	            guaranteeList: unshiftOption(guaranteeList, {
	                value: "请选择"
	            }),
	            partnerTypeList: unshiftOption([{ "id": "0", "typeName": "Ⅱ类机构（资金方）" }, { "id": "1", "typeName": "Ⅲ类机构（资金资产方）" }], {
	                typeName: "请选择"
	            }),
	            groups: unshiftOption(data.groups, {
	                groupName: "请选择"
	            })
	        };
	    }
	};
	var dependArr = [__webpack_require__(180).default.name];
	exports.default = {
	    module: angular.module('newOrganicCtrl', dependArr).controller('newOrganicController', ['$scope', 'newOrganicService', '$state', '$stateParams', controller]),
	    template: __webpack_require__(181)
	};


	function controller($scope, service, $state, $stateParams) {
	    var ctrlCount = 0,
	        stateparam;
	    // 基础数据
	    $scope.base = {};
	    $scope.triggerPwd = false;
	    $scope.production = {
	        partner_code: "",
	        groupId: "",
	        repayId: ""
	    };
	    try {
	        if ($state.params && $state.params.object && typeof $state.params.object === 'string') stateparam = JSON.parse(decodeURI($state.params.object));
	    } catch (e) {}
	    // 是否显示验证信息
	    $scope.showValid = false;

	    // 获取基本数据
	    var getBaseData = function getBaseData(fn) {
	        service.getBaseData().then(function (data) {
	            $scope.productionBaseData = data;
	            if (fn && ($scope.renderAgent === 'viewDetail' || $scope.renderAgent === 'upDate')) {
	                fn(BaseDataTranslater.m2vm(data));
	            } else {
	                $scope.base = BaseDataTranslater.m2vm(data);
	            }
	        });
	    };

	    // 获取编辑页选择条件数据
	    var getEditBaseData = function getEditBaseData(fn) {
	        service.getEditBaseData().then(function (data) {
	            console.log('edit.do:', data);
	            $scope.productionBaseData = data;
	            if (fn && ($scope.renderAgent === 'viewDetail' || $scope.renderAgent === 'upDate')) {
	                fn(BaseDataTranslater.m2vm(data));
	            } else {
	                $scope.base = BaseDataTranslater.m2vm(data);
	            }
	        });
	    };

	    $scope.timeFlag = function (timFlag) {
	        $scope.timFlag = '';
	        if (timFlag == 'EFFECT') {
	            $scope.timFlag = 'EFFECT';
	        } else if (timFlag == 'CLOSE') {
	            $scope.timFlag = 'CLOSE';
	        }
	    };

	    /**
	     * 单击保存的处理方法
	     */
	    $scope.save = function (isValid, isPristine) {
	        // 先判断验证是否通过
	        if (!isValid) {
	            $scope.showValid = true;

	            // fixme 滚动到顶部，这个不是最优的，是针对这个页面的临时处理办法
	            document.body.scrollTop = 0;

	            return;
	        }

	        if (!$scope.production.partner_code) $scope.production.partnerCode = $scope.productionBaseData.partner_code;
	        if (stateparam && stateparam.upDate) {
	            if (!isPristine && confirm('您已对当前产品进行编辑，保存则生成新版本，是否继续？')) {
	                console.log('$scope.production保存', $scope.production);
	                //		            return
	                if ($scope.production.privatePfx) delete $scope.production['privatePfx'];
	                if ($scope.production.publicCer) delete $scope.production['publicCer'];

	                //---
	                for (var i = 0, groups = $scope.base.groups; i < groups.length; i++) {
	                    if (groups[i].groupId == $scope.production.partnerAdmin) {
	                        $scope.production.partnerAdminName = groups[i].groupName;
	                    }
	                }
	                service.upDatePro($scope.production).then(function (data) {
	                    location.href = '#/configuration/production';
	                });
	            }
	            return;
	        }
	        //			console.log(230,$scope.production)
	        service.update($scope.production).then(function (data) {
	            location.href = '#/configuration/production';
	        }, function (reason) {
	            alert(reason.responseMsg);
	        });
	    };
	    //请求成功处理基础数据
	    function render(data) {
	        switch ($scope.renderAgent) {
	            case 'upDate':
	                $scope.upBtnFlag = true;
	                $scope.production = addProInfo(data, getEditBaseData);
	                break;
	            case 'viewDetail':
	                $scope.isView = true;
	                //				    $scope.production = data;
	                $scope.production = addProInfo(data, getEditBaseData);
	                break;
	            default:
	            //					alert(2)
	        }
	        //          $scope.production = ProductionTranslater.m2vm(data.production);
	        //          addProInfo($scope.production, data);
	        //          FieldListTranslater.m2vm(data.production.proFieldList, $scope.proFieldMap);
	    }

	    // 添加production中选项的name值
	    function addProInfo(getData, baseSelect) {
	        baseSelect(function (data) {
	            $scope.base = data;
	            if (getData.partnerType && Array.isArray(data.partnerTypeList)) {
	                data.partnerTypeList.forEach(function (v) {
	                    if (v.id === getData.partnerType) getData.partnerTypeName = v.typeName;
	                });
	            }
	            if (getData.guarantee && Array.isArray(data.guaranteeList)) {
	                data.guaranteeList.forEach(function (v) {
	                    if (v.repayId === getData.partnerType) getData.guaranteeName = v.value;
	                });
	            }
	            if (getData.partnerAdmin && Array.isArray(data.groups)) {
	                data.groups.forEach(function (v) {
	                    if (v.groupId === getData.partnerAdmin) {
	                        //							getData.partnerAdmin = v.groupId;
	                        getData.partnerAdminName = v.groupName;
	                    }
	                });
	            }
	        });
	        return getData;
	    }

	    /**
	     * 生成证书
	     */
	    $scope.creatCertificate = function () {
	        if (!$scope.production.partnerName) return;
	        var cfg = {
	            partnerName: $scope.production.partnerName
	        };
	        if (ctrlCount) return;
	        ctrlCount += 1;
	        service.creatCertificate(cfg).then(function (data) {
	            $scope.production.certName = data.public_cer;
	            $scope.production.pfxName = data.private_pfx;
	        }, function (reason) {
	            alert(reason.responseMsg);
	        });
	    };

	    /**
	     * 单击
	     * @parame
	     */
	    $scope.back = function (e) {
	        history.back();
	    };
	    var init = function init() {
	        $scope.renderAgent = "";
	        var cfg = {};
	        cfg = {
	            id: $stateParams.id,
	            productionCode: $stateParams.productionCode,
	            version: $stateParams.version
	        };
	        for (var screen in cfg) {
	            if (cfg[screen] === 0) continue;
	            if (cfg[screen] === '' || cfg[screen] === undefined) {
	                delete cfg[screen];
	            }
	        }
	        //新建获取基本数据；
	        if (!stateparam) getBaseData();

	        //编辑版本
	        if (stateparam && stateparam.upDate) {
	            $scope.renderAgent = 'upDate';
	            var param = {
	                id: stateparam.id,
	                pageNo: 1,
	                pageSize: 10
	            };
	            service.get(param).then(function (data) {
	                if (data && data.page && data.page.result) render(data.page.result[0]);
	            }, function (reason) {
	                alert(reason.responseMsg);
	            });
	        }
	        //查看版本
	        if (stateparam && stateparam.isView) {
	            $scope.renderAgent = 'viewDetail';
	            var param = {
	                id: stateparam.id,
	                pageNo: 1,
	                pageSize: 10
	            };
	            service.get(param).then(function (data) {
	                if (data && data.page && data.page.result) render(data.page.result[0]);
	            }, function (reason) {
	                alert(reason.responseMsg);
	            });
	        }
	    };

	    init();
	};

/***/ },

/***/ 178:
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag

	// load the styles
	var content = __webpack_require__(179);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(16)(content, {});
	if(content.locals) module.exports = content.locals;
	// Hot Module Replacement
	if(true) {
		// When the styles change, update the <style> tags
		if(!content.locals) {
			module.hot.accept(179, function() {
				var newContent = __webpack_require__(179);
				if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
				update(newContent);
			});
		}
		// When the module is disposed, remove the <style> tags
		module.hot.dispose(function() { update(); });
	}

/***/ },

/***/ 179:
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(11)();
	// imports


	// module
	exports.push([module.id, ".ml54{\r\n\tmargin-left: 54px;\r\n}\r\n.editform .content {\r\n    background-color: #ffffff;\r\n    padding-top: 40px;\r\n    border: 1px solid #efefef;\r\n}\r\n.editform .title{\r\n    font-size: 14px;\r\n    font-weight: bold;\r\n    color: #323236;\r\n    margin-bottom: 12px;\r\n    padding: 24px 0 0 10px;\r\n}\r\n.editform input {\r\n    width: 214px;\r\n    height: 28px;\r\n    border: 1px solid #c6c6c6;\r\n    color: #424242;\r\n    font-size: 12px;\r\n    font-family: microsoft yahei;\r\n    padding-left: 4px;\r\n}\r\n.editform input[type=checkbox] {\r\n    width: 18px;\r\n}\r\n.editform select {\r\n    width: 219px;\r\n    height: 30px;\r\n    border: 1px solid #c6c6c6;\r\n    font-family: microsoft yahei;\r\n    font-size: 12px;\r\n    color: #424242;\r\n}\r\n.editform .short_input{\r\n\twidth: 97px;\r\n}\r\ntextarea {\r\n    border: 1px solid #c6c6c6;\r\n    font-size: 13px;\r\n    color: #424242;\r\n    font-family: microsoft yahei;\r\n    overflow-y: scroll;\r\n    resize:none;\r\n    margin-left: 5px;\r\n    padding-left: 4px;\r\n    padding-top: 3px;\r\n}\r\n.editform .content .number{\r\n    display: inline;\r\n    font-size: 12px;\r\n    color: #424242;\r\n    margin-right: 0;\r\n}\r\n.editform .formaction {\r\n    margin: 50px 0 60px;\r\n    text-align: center;\r\n}\r\n.editform .formaction button{\r\n    border: none;\r\n    border-radius: 5px;\r\n    display: inline-block;\r\n    font-family: microsoft yahei;\r\n    font-size: 14px;\r\n    color: #ffffff;\r\n    padding: 10px 37px;\r\n    cursor: pointer;\r\n}\r\n.back{\r\n    background-color: #727272;\r\n}\r\n.back:hover{\r\n    background-color: #8a8383;\r\n}\r\n.save{\r\n    background-color: #d8524a;\r\n}\r\n.save:hover{\r\n    background-color: #f57b73;\r\n}\r\n\r\n.editform .content p label{\r\n    margin-right: 10px;\r\n}\r\n.editform .content .yanzheng{\r\n    width: 70px;\r\n    font-size: 13px;\r\n    color: #a7a7a7;\r\n    border: 1px solid #ebebeb;\r\n    border-radius: 2px;\r\n    text-align: center;\r\n    margin-left: 5px;\r\n    cursor: pointer;\r\n}\r\n.editform .content .yanzheng:hover{\r\n    border: 1px solid #d6d6d6;\r\n}\r\n\r\n\r\n\r\n.editform .content .red-border{\r\n    border : 1px solid red;\r\n}\r\n\r\n.editform table {\r\n    width: 90%;\r\n    border: 1px solid #fff;\r\n    border-collapse: collapse;\r\n    margin: 0 auto;\r\n}\r\n.editform table caption{\r\n    font-size:18px;\r\n    line-height:17px;\r\n    padding:8px 0;\r\n    margin: 15px 0 0;\r\n    font-weight: bold;\r\n}\r\n.editform table th{\r\n    background:#f6f6f6;\r\n    font-size:13px;\r\n    line-height:17px;\r\n    padding:8px 0;\r\n}\r\n.editform table td{\r\n    text-align:center;\r\n    padding:5px;\r\n    font:13px/20px 'microsoft yahei';\r\n}\r\n\r\n.editform .oddEvenColor tr:nth-child(odd){\r\n    background: #fafafa;\r\n}\r\n.editform .oddEvenColor tr:nth-child(even){\r\n    background: #fff;\r\n}\r\n.editform .oddEvenColor tr:hover{\r\n    background: #dee9f9;\r\n}\r\n\r\n.editform .content .normalRadio{\r\n    width:auto;\r\n    height: auto;\r\n}\r\n\r\n.col-list {\r\n    display: flex;\r\n}\r\n\r\n.col-list .col-item {\r\n    flex: 1;\r\n    /* vertical-align: top; */\r\n}\r\n\r\n.query-item {\r\n    padding-top: 12px;\r\n}\r\n.query-item .query-name {\r\n    width: 30%;\r\n    display: inline-block;\r\n    text-align: right;\r\n    padding: 0 3px 0 0;\r\n    vertical-align: top;\r\n    line-height: 28px;\r\n}\r\n.query-item i.warning {\r\n    padding-right: 3px;\r\n    color: #ed948e;\r\n}\r\n.query-item .query-value {width: 68%;display: inline-block;}\r\n\r\n.editform .form-invalid-msg {\n    color: #ed948e;\n    line-height: 120%;\n    padding: 5px 0;\n}\r\n.content .query-value{\r\n\ttext-align: left;\r\n\twidth: auto;\r\n}\r\n/*.content span .average{\r\n\twidth:64px\r\n}*/\r\n.content .form-invalid-msg{\r\n\tmargin: 0;\r\n\tpadding: 10px 0;\r\n}\r\n", ""]);

	// exports


/***/ },

/***/ 180:
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	exports.default = angular.module('newOrganicSer', []).factory('newOrganicService', ['util', 'ajax', service]);


	function service(util, ajax) {
		return {
			getBaseData: function getBaseData() {
				return ajax.post('/acc/accountpartner/new.do');
			},
			getEditBaseData: function getEditBaseData() {
				return ajax.post('/acc/accountpartner/edit.do');
			},
			update: function update(param) {
				return ajax.post('/acc/accountpartner/saveProductionPartner.do', param);
			},
			upDatePro: function upDatePro(param) {
				return ajax.post('/acc/accountpartner/updateProductionPartner.do', param);
			},
			get: function get(param) {
				return ajax.post("/acc/accountpartner/getList.do", param);
			},
			creatCertificate: function creatCertificate(cfg) {
				return ajax.post('/acc/accountpartner/buildCerPfxName.do', cfg);
			}
		};
	}

/***/ },

/***/ 181:
/***/ function(module, exports) {

	module.exports = "<div class=\"main\">\r\n\t<div class=\"inner\">\r\n\t    <div class=\"content_wrap editform\">\r\n\t        <div class=\"title\">新增机构</div>\r\n\t        <div class=\"content\">\r\n\t            <form name=\"mainform\" novalidate>\r\n\t                <ul class=\"query-list\">\r\n\t                    <li class=\"query-item col-list\">\r\n\t                        <div class=\"col-item\">\r\n\t                            <span class=\"query-name\"><i class=\"warning\">*</i>机构类型:</span>\r\n\t                            <span class=\"query-value\">\r\n\t                                <select ng-if = \"!(isView || upBtnFlag)\" name=\"partnerType\" ng-model=\"production.partnerType\" ng-class = \"{readOnly : isView}\" ng-readonly = \"isView\" ng-options=\"option.id as option.typeName for option in base.partnerTypeList\" required></select>\r\n\t                                <input ng-if = \"isView || upBtnFlag\" type=\"text\"  ng-model=\"production.partnerTypeName\" ng-class = \"{readOnly : isView || upBtnFlag}\" ng-readonly = \"isView||upBtnFlag\"/>\r\n\t                                <p ng-show=\"(showValid || mainform.partnerType.$dirty) && mainform.partnerType.$error.required\" class=\"form-invalid-msg\">请选择此项</p>\r\n\t                            </span>\r\n\t                        </div>\r\n\t                        <div class=\"col-item\">\r\n\t                            <span class=\"query-name\"><i class=\"warning\">*</i>放款总额:</span>\r\n\t                            <span class=\"query-value\">\r\n\t                                <input type=\"text\" name=\"totalLoans\" ng-class = \"{readOnly : isView}\" maxlength=\"50\" ng-model=\"production.totalLoans\" ng-readonly = \"isView\" maxlength=\"20\" required ng-pattern = \"/\\d/\"/>\r\n\t                                <p ng-show=\"(showValid || mainform.totalLoans.$dirty) && mainform.totalLoans.$error.required\" class=\"form-invalid-msg\">请填写此项</p>\r\n\t                                <p ng-show=\"(showValid || mainform.totalLoans.$dirty) && !mainform.totalLoans.$error.required && mainform.totalLoans.$error.pattern\" class=\"form-invalid-msg\">仅能填写数字</p>\r\n\t                            </span>\r\n\t                        </div>\r\n\t                    </li>\r\n\t                    <li class=\"query-item col-list\">\r\n\t                        <div class=\"col-item\">\r\n\t                            <span class=\"query-name\"><i class=\"warning\">*</i>机构名称:</span>\r\n\t                            <span class=\"query-value\">\r\n\t                                <input type=\"text\" name=\"partnerName\" ng-model=\"production.partnerName\" ng-blur = \"creatCertificate()\" ng-class = \"{readOnly : upBtnFlag||isView}\" ng-readonly = \"upBtnFlag||isView\" required maxlength=\"20\" ng-pattern = \"/^[\\u4e00-\\u9fa5\\][\\w]{0,}$/\"/>\r\n\t                                <p ng-show=\"(showValid || mainform.partnerName.$dirty) && mainform.partnerName.$error.required\" class=\"form-invalid-msg\">请填写此项</p>\r\n\t                                <p ng-show=\"(showValid || mainform.partnerName.$dirty) && !mainform.partnerName.$error.required && mainform.partnerName.$error.pattern\" class=\"form-invalid-msg\">仅能由汉字、字母、数字和下划线组成</p>\r\n\t                            </span>\r\n\t                        </div>\r\n\t                        <div class=\"col-item\">\r\n\t                            <span class=\"query-name\"><i class=\"warning\">*</i>代偿节点:</span>\r\n\t                            <span class=\"query-value\">\r\n\t                                <input name=\"compensatoryNode\" type=\"text\" ng-model=\"production.compensatoryNode\" maxlength=\"50\" ng-class = \"{readOnly : isView}\" ng-readonly = \"isView\" required ng-pattern = '/^[0-9]*$/' />\r\n\t                                <p ng-show=\"(showValid || mainform.compensatoryNode.$dirty) && mainform.compensatoryNode.$error.required\" class=\"form-invalid-msg\">请填写此项</p>\r\n\t                                <p ng-show=\"(showValid || mainform.compensatoryNode.$dirty) && !mainform.compensatoryNode.$error.required && mainform.compensatoryNode.$error.pattern\" class=\"form-invalid-msg\">仅能输入正整数</p> \r\n\t                            </span>\r\n\t                        </div>\r\n\t                    </li>\r\n\t                    <li class=\"query-item col-list\">\r\n\t                        <div class=\"col-item\">\r\n\t                            <span class=\"query-name\"><i class=\"warning\">*</i>保证金数额:</span>\r\n\t                            <span class=\"query-value\">\r\n\t                                <input name=\"fineMoney\" type=\"text\" ng-model=\"production.fineMoney\" maxlength=\"50\" ng-class = \"{readOnly : isView}\" ng-readonly = \"isView\" required ng-pattern = '/\\d/'/>\r\n\t                                <p ng-show=\"(showValid || mainform.fineMoney.$dirty) && mainform.fineMoney.$error.required\" class=\"form-invalid-msg\">请填写此项</p>\r\n\t                                <p ng-show=\"(showValid || mainform.fineMoney.$dirty) && !mainform.fineMoney.$error.required && mainform.fineMoney.$error.pattern\" class=\"form-invalid-msg\">仅能填写数字</p>\r\n\t                            </span>\r\n\t                        </div>\r\n\t                        <div class=\"col-item\">\r\n\t                            <span class=\"query-name\"><i class=\"warning\">*</i>机构管理员:</span>\r\n\t                            <span class=\"query-value\">\r\n\t                                <select ng-if = \"!isView\" name=\"partnerAdmin\" ng-model=\"production.partnerAdmin\" ng-class = \"{readOnly : isView}\" ng-readonly = \"isView\" ng-options=\"option.groupId as option.groupName for option in base.groups\" required></select>\r\n\t                                <input ng-if = \"isView\" type=\"text\"  ng-model=\"production.partnerAdminName\" ng-class = \"{readOnly : isView}\" ng-readonly = \"isView\"/>\r\n\t                                <p ng-show=\"(showValid || mainform.partnerAdmin.$dirty) && mainform.partnerAdmin.$error.required\" class=\"form-invalid-msg\">请选择此项</p>\r\n\t                            </span>\r\n\t                        </div>\r\n\t                    </li>\r\n\t                    <li class=\"query-item col-list\">\r\n\t                        <div class=\"col-item\">\r\n\t                            <span class=\"query-name\"><i class=\"warning\">*</i>apiCode:</span>\r\n\t                            <span class=\"query-value\">\r\n\t                                <input name=\"apiCode\" type=\"text\" ng-model=\"production.apiCode\" ng-class = \"{readOnly : isView || upBtnFlag}\" ng-readonly = \"isView || upBtnFlag\" required maxlength=\"20\" ng-pattern = \"/^[0-9]*$/\"/>\r\n\t                                <p ng-show=\"(showValid || mainform.apiCode.$dirty) && mainform.apiCode.$error.required\" class=\"form-invalid-msg\">请填写此项</p>\r\n\t                                <p ng-show=\"(showValid || mainform.apiCode.$dirty) && !mainform.apiCode.$error.required && mainform.apiCode.$error.pattern\" class=\"form-invalid-msg\">仅能输入正整数</p>\r\n\t                            </span>\r\n\t                        </div>\r\n\t                        <div class=\"col-item\">\r\n\t                        \t<span class=\"query-name\"><i class=\"warning\"  ng-if = \"production.nature == '内部' ? '' : '1'\">*</i>公有证书名称:</span>\r\n\t                            <span class=\"query-value\">\r\n\t                                <input ng-if = \"production.nature == '内部' ? '' : '1'\" name=\"certName\" type=\"text\" ng-model=\"production.certName\" placeholder=\"(自动生成)\" ng-class = \"{readOnly : true}\" readonly = \"readonly\"  maxlength=\"150\"/>\r\n\t                            </span>\r\n\t                        </div>\r\n\t                    </li>\r\n\t                    <li class=\"query-item col-list\">\r\n\t                    \t<div class=\"col-item\">\r\n\t                            <span class=\"query-name\"><i class=\"warning\">*</i>有无担保:</span>\r\n\t                            <span class=\"query-value\">\r\n\t                                <select ng-if = \"!isView\" name=\"guarantee\" ng-model=\"production.guarantee\" ng-class = \"{readOnly : isView}\" ng-readonly = \"isView\" ng-options=\"option.repayId as option.value for option in base.guaranteeList\" required></select>\r\n\t                                <input ng-if = \"isView\" type=\"text\"  ng-model=\"production.guaranteeName\" ng-class = \"{readOnly : isView}\" ng-readonly = \"isView\"/>\r\n\t                                <p ng-show=\"(showValid || mainform.guarantee.$dirty) && mainform.guarantee.$error.required\" class=\"form-invalid-msg\">请选择此项</p>\r\n\t                            </span>\r\n\t                        </div>\r\n\t                        <div class=\"col-item\">\r\n\t                        \t<span class=\"query-name\"><i class=\"warning\"  ng-if = \"production.nature == '内部' ? '' : '1'\">*</i>私有证书名称:</span>\r\n\t                            <span class=\"query-value\">\r\n\t                                <input ng-if = \"production.nature == '内部' ? '' : '1'\" ng-class = \"{readOnly : true}\" readonly = \"readonly\" placeholder=\"(自动生成)\" name=\"pfxName\" type=\"text\" ng-model=\"production.pfxName\" maxlength=\"50\"/>\r\n\t                            </span>\r\n\t                        </div>\r\n\t                    </li>\r\n\t                </ul>\r\n\t                <p class=\"formaction\">\r\n\t                    <button ng-if=\"!production.id || production.status == 0 || upBtnFlag\" class=\"back\" ng-class = \"{save : (upBtnFlag&&!mainform.$pristine) || (!upBtnFlag&&!isView)}\" ng-click=\"save(mainform.$valid,mainform.$pristine)\">保 存</button>\r\n\t                    <button class=\"save ml54\" ng-click=\"back()\">返 回</button>\r\n\t                </p>\r\n\t            </form>\r\n\t        </div>\r\n\t        <div class=\"inner-footer\"></div>\r\n\t    </div>\r\n\t</div>\r\n</div>"

/***/ }

});