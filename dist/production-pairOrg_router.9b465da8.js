webpackJsonp([21],{108:function(module,exports,__webpack_require__){var $=__webpack_require__(109),mask={crrentHeight:0,defaultStyle:function(){return{height:"auto",zIndex:1e3,display:"block",opacity:.7,background:"#000",position:"absolute",top:0,right:0,bottom:0,left:0}},creatMask:function(pn,cg){if(!pn)throw new Error("parent element is null ! plase creat element  fill secend param(only id)");var wrapName,maskElm;wrapName=$("#"+pn),maskElm=document.createElement("div"),maskElm.id="maskDialog",wrapName.append(maskElm);var maskConfig=cg||Object.keys(cg).length||this.defaultStyle();this.maskAddStyle(maskConfig)},addStyle:function(styleList){var elm=$("#maskDialog");if(!$("#maskDialog").size())throw new Error("the id#maskDialog is no defined");elm.css(styleList)},maskAddStyle:function(maskConfig){if(!maskConfig||!Object.keys(maskConfig).length)return void this.addStyle(this.defaultStyle());var initStyle=this.defaultStyle(),styleList={};for(var k in initStyle)maskConfig[k]?styleList[k]=maskConfig[k]:styleList[k]=initStyle[k];styleList.height=this.isLessClient(styleList.height),this.addStyle(styleList)},isLessClient:function(setHeight){var clientHeight=document.documentElement.clientHeight;return setHeight<clientHeight?(this.crrentHeight=clientHeight,clientHeight):(this.crrentHeight=setHeight,setHeight)},getHeight:function(){return this.crrentHeight}};const maskCtrl={show:function(config,pushElmName){document.getElementById("maskDialog")?mask.maskAddStyle(config):mask.creatMask(pushElmName,config)},hidden:function(){var recoverHeight=document.documentElement.clientHeight;mask.maskAddStyle({display:"none",height:recoverHeight})},getHeight:function(){return mask.getHeight()}};module.exports=maskCtrl},185:function(module,exports,__webpack_require__){"use strict";function _interopRequireDefault(obj){return obj&&obj.__esModule?obj:{default:obj}}function controller(_,service,$state,$timeout){function resetProduction(){for(var i in _.production)_.production[i]=""}function fullProduction(obj1,obj2){for(var i in obj2)obj1[i]=obj2[i];return obj1}function validateParam(data){var ignorePropVal=["fundSharing","assetSharing","brSharing","collNode"],validateVal=saveParam(data),isIntType=/^[0-9]*$/,isAllFill=Object.keys(validateVal).every(function(v){for(var i=0,ii=ignorePropVal.length;i<ii;i++)if(ignorePropVal[i]==v&&"0"==validateVal[v])return!0;return"undefined"!=typeof validateVal[v]&&0!=validateVal[v]});return isAllFill?isIntType.test(data.estimateLoan)?!!isIntType.test(data.collNode)||(data.collNode="",alert("催收节点必须为正整数！"),!1):(data.estimateLoan="",alert("预计放款额必须为正整数！"),!1):(alert("信息填写不全，请检查信息！"),!1)}function saveParam(item){var saveParam={lasPartnerCode:_.statusParamInfo.partnerCode,productionCode:_.statusParamInfo.code,accPartnerCode:item.partnerName,fundSharing:item.fundSharing,assetSharing:item.assetSharing,brSharing:item.brSharing,estimateLoan:item.estimateLoan,collNode:item.collNode};return _.editFlag&&(saveParam.id=item.id),saveParam}function render(item,addInfo){_.editFlag=!!addInfo,resetProduction(),item=addInfo?fullProduction(item,addInfo):item;for(var i in item)_.production[i]||(_.production[i]=item[i]);_.production.partnerName=addInfo?item.accPartnerCode:""}function getSelectInfo(){function getSelectList(){item=item.accPartnerCode?{partnerCode:item.partnerCode,accPartnerCode:item.accPartnerCode,productionCode:item.productionCode}:item,service.getAccSideList(item).then(function(data){var bankrollParList=[];Array.isArray(data.bankrollParList)&&(bankrollParList=data.bankrollParList.slice(),bankrollParList.unshift({partnerCode:"",partnerName:"请选择"})),_.accSideList=bankrollParList},function(reason){alert(reason.responseMsg)})}var item=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{partnerCode:_.statusParamInfo.partnerCode,productionCode:_.statusParamInfo.code};$timeout(getSelectList,50)}var o,timer;if($state.params&&$state.params.object&&"string"==typeof $state.params.object)try{_.statusParamInfo=JSON.parse(decodeURI($state.params.object))}catch(e){}_.production={code:"",name:"",accPartnerCode:"",partnerName:"",fundSharing:"",assetSharing:"",brSharing:"",estimateLoan:"",collNode:""},_.checkStatus=2!=_.statusParamInfo.status,_.openPair=function(){var item=arguments.length>0&&void 0!==arguments[0]?arguments[0]:void 0;getSelectInfo(item),_.dialogShow=!0,_dialog_mask2.default.show({height:_.getClientHeight()}),item?render(item,_.statusParamInfo):render(_.statusParamInfo)},_.savePair=function(){validateParam(_.production)&&service.save(saveParam(_.production)).then(function(data){alert(data.responseMsg),_.dialogShow=!1,_dialog_mask2.default.hidden(),o.getUserInfoList()},function(reason){alert(reason.responseMsg)})},_.closePair=function(){_.dialogShow=!1,_dialog_mask2.default.hidden()},o={laterQueryList:function(){var that=this;timer&&clearTimeout(timer),timer=setTimeout(function(){that.getUserInfoList()},200)},getUserInfoList:function(config){if(_.statusParamInfo){var cfg=config||{productionCode:_.statusParamInfo.code};service.getPairList(cfg).then(function(data){_.pairList=data.accpartnerlist},function(data){alert(data.responseMsg)})}},init:function(){this.getUserInfoList(),_.lodingMask=!0}},o.init()}Object.defineProperty(exports,"__esModule",{value:!0});var _jquery=__webpack_require__(109),_dialog_mask=(_interopRequireDefault(_jquery),__webpack_require__(108)),_dialog_mask2=_interopRequireDefault(_dialog_mask);__webpack_require__(186);var dependArr=[__webpack_require__(189).default.name];exports.default={module:angular.module("pairOrgCtrl",dependArr).controller("pairOrgController",["$scope","pairOrgService","$state","$timeout",controller]),template:__webpack_require__(190)}},186:function(module,exports,__webpack_require__){var content=__webpack_require__(187);"string"==typeof content&&(content=[[module.id,content,""]]);var update=__webpack_require__(16)(content,{});content.locals&&(module.exports=content.locals),content.locals||module.hot.accept(187,function(){var newContent=__webpack_require__(187);"string"==typeof newContent&&(newContent=[[module.id,newContent,""]]),update(newContent)}),module.hot.dispose(function(){update()})},187:function(module,exports,__webpack_require__){exports=module.exports=__webpack_require__(11)(),exports.push([module.id,".pair-dialog{width:700px;height:400px;position:fixed;margin:-200px -350px 0 0;top:380px;right:50%;z-index:1200;background:#efefef}.pair-dialog-title{height:50px;line-height:50px;text-indent:23px;font-weight:700}.pair-title{width:114px;text-align:right}.pair-wrap tr{height:50px}.pair-wrap input{width:184px}.pair-button{border:none;border-radius:5px;display:inline-block;font-family:microsoft yahei;font-size:14px;color:#fff;padding:10px 37px;cursor:pointer;background:#d8524a;margin:0 20px}.handle-btn{text-align:center;margin:20px 0}.producitonInfo{background:#f2f2f2;padding:0 6px;border:1px solid #ccc}.pair-edit-readonly{background:#ccc;border:1px solid #bbb}.br-blank{text-align:center;background:#efefef;border:1px solid #efefef}.pair-edit-select{width:184px;height:24px}.arrow_right{background:url("+__webpack_require__(188)+") no-repeat right 18px;background-size:85% 16px}",""])},188:function(module,exports,__webpack_require__){module.exports=__webpack_require__.p+"/images/arrow_right.png"},189:function(module,exports){"use strict";function service(util,ajax){return{save:function(cfg){return ajax.post("/acc/productionaccpartner/save.do",cfg)},getPairList:function(cfg){return ajax.post("/acc/productionaccpartner/accpartnerlist.do",cfg)},getAccSideList:function(cfg){return ajax.post("/acc/productionaccpartner/bankrollParList.do",cfg)}}}Object.defineProperty(exports,"__esModule",{value:!0}),exports.default=angular.module("pairOrgSer",[]).factory("pairOrgService",["util","ajax",service])},190:function(module,exports){module.exports='<div class="main">\r\n\t<loding-mask></loding-mask>\r\n\t<div class="inner" ng-style="{\'min-height\':isShowReportDialog ? \'5000px\':\'auto\'}">\r\n\t    <div class="inner-header clearfix">\r\n\t        <div class="inner-header-lf fl">机构配对</div>\r\n\t        <div class="inner-header-rt fr" style="min-width:220px">\r\n\t            <a href="javascript:void(0)" ng-if = "checkStatus" ng-click = "openPair()" class="btn1 fr importA">新增配对</a>\r\n\t        </div>\r\n\t    </div>\r\n\t    <div class="inner-body">\r\n\t        <div class="inner-select">\r\n\t            <table style="width: 100%;">\r\n\t                 <tr>\r\n\t                    <td class="tl-r"> 产品名称：</td>\r\n\t                    <td ng-bind = "statusParamInfo.name"></td>\r\n\t                </tr>\r\n\t                <tr>\r\n\t                    <td class="tl-r"> 产品编码：</td>\r\n\t                    <td ng-bind = "statusParamInfo.code"></td>\r\n\t                </tr>\r\n\t                <tr>\r\n\t                    <td class="tl-r"> 合作机构：</td>\r\n\t                    <td ng-bind = "statusParamInfo.partner"></td>\r\n\t                </tr>\r\n\t                <tr>\r\n\t                    <td class="tl-r"> 合作机构编码：</td>\r\n\t                    <td ng-bind = "statusParamInfo.partnerCode"></td>\r\n\t                </tr>\r\n\t            </table>\r\n\t            <div class="inner-table">\r\n\t                    <div class="hdFixed">\r\n\t                    </div>\r\n\t                    <div class="bd">\r\n\t                       <table class="table_user oddEvenColor" border="1" borderColor="#fff" ng-click="tableClick($event)">\r\n\t                            <tr>\r\n\t                                <th>资金合作机构名称</th>\r\n\t                                <th>资金方机构编码</th>\r\n\t                                <th>资金方分成</th>\r\n\t                            \t<th>资产方分成</th>\r\n\t                            \t<th>百融分成</th>\r\n\t                            \t<th>预计放款总额（万）</th>\r\n\t                            \t<th>催收发起节点</th>\r\n\t                                <th ng-if = "checkStatus">操作</th>\r\n\t                            </tr>\r\n\t                            <tr ng-repeat="item in pairList">\r\n\t                                <td ng-bind="item.accPartnerName"></td>\r\n\t                                <td ng-bind="item.accPartnerCode"></td>\r\n\t                                <td ng-bind="item.fundSharing"></td>\r\n\t                                <td ng-bind="item.assetSharing"></td>\r\n\t                                <td ng-bind="item.brSharing"></td>\r\n\t                                <td ng-bind="item.estimateLoan"></td>\r\n\t                                <td ng-bind="item.collNode"></td>\r\n\t                                <td ng-if = "checkStatus"><a href="javascript:void(0)" ng-click = "openPair(item)">编辑</a></td>\r\n\t                            </tr>\r\n\t                        </table>\r\n\t                    </div>\r\n\t                <div class="ft clearfix" ng-style="{visibility:showPage}" style="margin-bottom: 50px;">\r\n\t\t\t        </div>\r\n\t\t\t    </div>\r\n\t\t\t</div>\r\n\t    </div>\r\n\t    <div class="inner-footer"></div>\r\n\t    <div class="pair-dialog" ng-if = "dialogShow">\r\n\t    \t<div class="pair-dialog-title">配对配置</div>\r\n\t    \t<table class = "pair-wrap">\r\n\t    \t\t<tr>\r\n\t    \t\t\t<td>\r\n\t    \t\t\t\t<div class="pair-title">产品名称：</div>\r\n\t    \t\t\t</td>\r\n\t    \t\t\t<td>\r\n\t    \t\t\t\t<input class="pair-edit-readonly" type="text"  maxlength="50" ng-model = "production.name" readonly="readonly" />\r\n\t    \t\t\t</td>\r\n\t    \t\t\t<td><div style="width: 50px;"></div></td>\r\n\t    \t\t\t<td>\r\n\t    \t\t\t\t<div class="pair-title">产品编码：</div>\r\n\t    \t\t\t</td>\r\n\t    \t\t\t<td>\r\n\t    \t\t\t\t<input class="pair-edit-readonly" type="text"  maxlength="50" ng-model = "production.code" readonly="readonly" />\r\n\t    \t\t\t</td>\r\n\t    \t\t</tr>\r\n\t    \t\t<tr>\r\n\t    \t\t\t<td>\r\n\t    \t\t\t\t<div class="pair-title">关联资金方：</div>\r\n\t    \t\t\t</td>\r\n\t    \t\t\t<td>\r\n\t    \t\t\t\t<select class="pair-edit-select" ng-model = "production.partnerName" ng-options = "option.partnerCode as option.partnerName for option in accSideList"></select>\r\n\t    \t\t\t</td>\r\n\t    \t\t\t<td class="arrow_right"></td>\r\n\t    \t\t\t\r\n\t    \t\t\t<td>\r\n\t    \t\t\t\t<div class="pair-title">分成比例：</div>\r\n\t    \t\t\t</td>\r\n\t    \t\t\t<td>\r\n\t    \t\t\t\t<input type="number" oninput="if(value.length>4)value=value.slice(0,6)" ng-model = "production.fundSharing" />\r\n\t    \t\t\t</td>\r\n\t    \t\t</tr>\r\n\t    \t\t<tr>\r\n\t    \t\t\t<td>\r\n\t    \t\t\t\t<div class="pair-title">资产方：</div>\r\n\t    \t\t\t</td>\r\n\t    \t\t\t<td>\r\n\t    \t\t\t\t<input class="pair-edit-readonly" type="text"  ng-model = "production.partner" readonly="readonly"/>\r\n\t    \t\t\t</td>\r\n\t    \t\t\t<td class="arrow_right"></td>\r\n\t    \t\t\t<td>\r\n\t    \t\t\t\t<div class="pair-title">分成比例：</div>\r\n\t    \t\t\t</td>\r\n\t    \t\t\t<td>\r\n\t    \t\t\t\t<input type="number"  oninput="if(value.length>4)value=value.slice(0,6)" ng-model = "production.assetSharing" />\r\n\t    \t\t\t</td>\r\n\t    \t\t</tr>\r\n\t    \t\t<tr>\r\n\t    \t\t\t<td>\r\n\t    \t\t\t</td>\r\n\t    \t\t\t<td>\r\n\t    \t\t\t\t<input class="br-blank" type="text" value="百融方" readonly="readonly"/>\r\n\t    \t\t\t</td>\r\n\t    \t\t\t<td class="arrow_right"></td>\r\n\t    \t\t\t<td>\r\n\t    \t\t\t\t<div class="pair-title">分成比例：</div>\r\n\t    \t\t\t</td>\r\n\t    \t\t\t<td>\r\n\t    \t\t\t\t<input type="number"  oninput="if(value.length>4)value=value.slice(0,6)" ng-model = "production.brSharing" />\r\n\t    \t\t\t</td>\r\n\t    \t\t</tr>\r\n\t    \t\t<tr>\r\n\t    \t\t\t<td>\r\n\t    \t\t\t\t<div class="pair-title">预计放款额&nbsp;&nbsp;&nbsp;&nbsp;<br>（万）：</div>\r\n\t    \t\t\t</td>\r\n\t    \t\t\t<td>\r\n\t    \t\t\t\t<input type="text" maxlength="50" ng-model = "production.estimateLoan" />\r\n\t    \t\t\t</td>\r\n\t    \t\t\t<td></td>\r\n\t    \t\t\t<td>\r\n\t    \t\t\t\t<div class="pair-title">催收节点：</div>\r\n\t    \t\t\t</td>\r\n\t    \t\t\t<td>\r\n\t    \t\t\t\t<input type="text" maxlength="50" ng-model = "production.collNode" />\r\n\t    \t\t\t</td>\r\n\t    \t\t</tr>\r\n\t    \t</table>\r\n\t    \t<div class="handle-btn">\r\n\t    \t\t<button class="pair-button" ng-click = "savePair()">确定</button>\r\n\t    \t\t<button class="pair-button" ng-click = "closePair()">返回</button>\r\n\t    \t</div>\r\n\t    </div>\r\n\t</div>\r\n</div>\r\n\t\r\n\t\t'}});