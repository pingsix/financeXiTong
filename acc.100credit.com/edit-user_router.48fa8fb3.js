webpackJsonp([8],{127:function(module,exports,__webpack_require__){"use strict";function _interopRequireDefault(obj){return obj&&obj.__esModule?obj:{default:obj}}function controller(_,service,$stateParams,util){var o,jq=angular.element;_.username="",_.realName="",_.email="",_.phone="",_.remark="",_.userPwd="",_.id=$stateParams.id||0,_.userList=[],_.verifyStatusArr=[],_.selectData={type:"select",name:"select",value:"",values:[]},_.number=200,_.selectDataChange=function(){},_.tellTipShow=function(){_.inputTipContext=!0},_.tellTipHidden=function(){_.inputTipContext=!1},_.dd=!0,o={getUserInfoList:function(){var cfg={};cfg.id=_.id;var url="/acc/reviewuser/edit.do";service.query(url,cfg).then(function(data){_.userList=data.result.groups;var user=data.result;_.username=user.userId,_.realName=user.userName,_.remark=user.spare1,_.email=user.email,_.phone=user.tel,_.$watch("selectData.values",function(){_.selectData.values.forEach(function(v,i){for(var i=0;i<_.userList.length;i++)_.userList[i].groupId==v.groupId&&(v.checked=!0)})})},function(reason){alert(reason.responseMsg),"006"==reason.responseCode&&(location.href="#/manager/user")})},getRoleList:function(){var cfg={};service.getRoleList(cfg).then(function(data){_.selectData.value=data.result[0].id,_.selectData.values=data.result},function(reason){console.log("获取角色"+data.responseMsg)})},init:function(){this.getRoleList(),this.getUserInfoList()}},o.init(),_.test=function(index){if(2==localStorage.getItem("userType")){var arr=_.selectData.values.slice(0);arr.forEach(function(v,i,arr){v.checked=!1}),arr[index].checked=!0}},_.showflag=!0,_.taggleAll=function(){_.showflag?((0,_jquery2.default)("#roleid").removeClass("rolesWrapper"),_.showflag=!1):((0,_jquery2.default)("#roleid").addClass("rolesWrapper"),_.showflag=!0)},_.click=function(cfg){var idsArr=[],idStr=function(){var arr=_.selectData.values.slice(0);return arr.forEach(function(v,i,arr){var isArrJson={};v.checked&&(isArrJson.groupId=v.groupId,isArrJson.groupName=v.groupName,isArrJson.id=v.id,idsArr.push(isArrJson))}),idsArr.length?idsArr:""}();return 0==idsArr.length?void alert("请选择角色！"):void(/[0]/.test(_.verifyStatusArr.join(""))||service.formSubmit({groups:idStr,id:_.id,email:_.email,userName:_.realName,userId:_.username,spare1:_.remark,tel:_.phone}))},_.back=function(){location.href="#/manager/user"},_.realNameKeyup=function(event){service.realNameKeyup(_.realName)},_.remarkKeyup=function(event){service.remarkKeyup(_.remark,function(num){_.number=num})},_.mailVerify=function(){var emailDom=util.getById("email"),regEmail=new RegExp("^\\w+((-\\w+)|(\\.\\w+))*\\@[A-Za-z0-9]+((\\.|-)[A-Za-z0-9]+)*\\.[A-Za-z0-9]+$","g");return _.email?/^\s*$/.test(_.email)?(_.mailTip="",_.verifyStatusArr[0]=1,void jq(emailDom).removeClass("red-border")):regEmail.test(_.email)?(_.mailTip="",_.verifyStatusArr[0]=1,jq(emailDom).removeClass("red-border"),void 0):(_.mailTip="邮箱格式错误",_.verifyStatusArr[0]=0,jq(emailDom).addClass("red-border"),void emailDom.focus()):(_.mailTip="邮箱不能为空",_.verifyStatusArr[0]=0,emailDom.focus(),void jq(emailDom).addClass("red-border"))},_.cellVerify=function(){var phoneDom=util.getById("phone");return/^\s*$/.test(_.phone)?(_.cellTip="",_.verifyStatusArr[1]=1,void jq(phoneDom).removeClass("red-border")):void(/^((0\d{2,3}-\d{7,8})|(1[3584]\d{9}))$/.test(_.phone)?(_.cellTip="",_.verifyStatusArr[1]=1,jq(phoneDom).removeClass("red-border")):(_.cellTip="手机格式错误",_.verifyStatusArr[1]=0,jq(phoneDom).addClass("red-border"),phoneDom.focus()))}}Object.defineProperty(exports,"__esModule",{value:!0});var _jquery=__webpack_require__(109),_jquery2=_interopRequireDefault(_jquery),dependArr=[__webpack_require__(128).default.name];exports.default={module:angular.module("editUserCtrl",dependArr).controller("editUserController",["$scope","editUserService","$stateParams","util",controller]),template:__webpack_require__(129)}},128:function(module,exports){"use strict";function editUserService(util,ajax,validator){var jq=(document,angular.element);return{getRoleList:function(cfg){return ajax.post("/acc/reviewuser/getRole.do",cfg)},query:function(url,cfg){return ajax.post(url,cfg)},formSubmit:function(cfg){return validator.isEmpty(cfg.userName)?(jq(util.getById("realName")).addClass("red-border"),void util.getById("realName").focus()):validator.isEmpty(cfg.email)?(jq(util.getById("email")).addClass("red-border"),void util.getById("email").focus()):void ajax.post("/acc/reviewuser/modify.do",cfg).then(function(data){location.href="#/manager/user"},function(reason){location.href="login.html"})},realNameKeyup:function(text){validator.isEmpty(text)||jq(util.getById("realName")).removeClass("red-border")},remarkKeyup:function(text,fn){if(!validator.isEmpty(text)){jq(util.getById("remark")).removeClass("red-border");var newNum=text.length,number=200-newNum;console.log(number),fn&&fn(number),number<0&&(event.returnValue=!1)}}}}Object.defineProperty(exports,"__esModule",{value:!0}),exports.default=angular.module("editUserSer",[]).factory("editUserService",["util","ajax","validator",editUserService])},129:function(module,exports){module.exports='<div class="main">\r\n\t<div class="inner">\r\n\t    <div class="title" style="margin-top: 24px">编辑用户</div>\r\n\t    <div class="content_wrap" id="content">\r\n\t        <div class="content content_user">\r\n\t            <div id="roleid" class="rolesWrapper" style="padding:0 20% 0 27%; position: relative;">\r\n\t\t            <span class="fl"><i class="not-null">*</i>角色：</span>\r\n\t\t            <div class="fr lablesWrapper">\r\n\t\t            \t<label ng-repeat="item in selectData.values" class="lables">\r\n\t\t                \t<input ng-model="item.checked" ng-change = \'saveRoles()\' name="roleName" type="checkbox" value="{{item.groupId}}" >&nbsp;{{item.groupName}}\r\n\t\t           \t\t</label>\r\n\t\t            </div>\r\n\t\t            <div ng-click = "taggleAll()" class="showBtn">&#9660;</div>\r\n\t\t        </div>\r\n\t\t        <div class="clearfl"></div>\r\n\t            <p>\r\n\t                <span><i class="not-null">*</i>账号：</span>\r\n\t                <input type="text" disabled ng-model="username" style="background: #ffffff;border: none">\r\n\t            </p>\r\n\t            <p>\r\n\t                <span><i class="not-null">*</i>姓名：</span>\r\n\t                <input type="text" ng-model="realName" id="realName" ng-keyup="realNameKeyup(event)">\r\n\t            </p>\r\n\t            <p>\r\n\t                <span class="fl adjust"><i class="not-null">*</i>邮箱：</span>\r\n\t                <input type="text" ng-model="email" id="email" ng-blur="mailVerify()" class="fl">\r\n\t                <a class="tooltip fl error1" ng-bind="mailTip"></a>\r\n\t            </p>\r\n\t            <p>\r\n\t                <span class="fl adjust">固定号码：</span>\r\n\t                <input type="text" ng-model="phone" id="phone" maxlength="18" ng-blur="cellVerify()" class="fl">\r\n\t                <i ng-mouseOver = "tellTipShow()" ng-mouseOut = "tellTipHidden()" class=" inputTip"></i>\r\n\t                <a ng-show = "inputTipContext" class="inputTipBlank">例：010-12345678/13812345678</a>\r\n\t            </p>\r\n\t            <p class="text" style="height: 180px;">\r\n\t                <span class="beizhu">备注：</span>\r\n\t                <textarea cols="50" rows="8" id="remark" ng-model="remark" ng-keyup="remarkKeyup(event)" maxlength="200"></textarea>\r\n\t                &nbsp;还能输入<span class="number" id="number" ng-bind="number"></span>个字符\r\n\t            </p>\r\n\t            <p class="btn">\r\n\t                <button class="save" ng-click="click()" id="save">保 存</button>\r\n\t                <button class="back ml54" id="back" ng-click="back()">返 回</button>\r\n\t            </p>\r\n\t        </div>\r\n\t        <div class="inner-footer"></div>\r\n\t    </div>\r\n\t</div>\r\n</div>'}});