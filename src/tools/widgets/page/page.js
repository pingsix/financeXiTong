/**
 * 分页
 */
export default angular
    .module('page',[])
	.factory('pageService',[pageServiceFn])
	.directive('page',['pageService',pageDirectiveService]);
    function pageServiceFn(){
            return {
                getData : function(data){
                    //翻页核心逻辑
                    var numbers,
                        total = parseInt(data.total),
                        currentPage = parseInt(data.current);

                    if(total >=3){

                        if(currentPage == total){
                            //右边界
                            numbers = [
                                {class:'d',number:currentPage-2},
                                {class:'d',number:currentPage-1},
                                {class:'c',number:currentPage}
                            ];
                        }else if(currentPage == 1){
                            //左边界
                            numbers = [
                                {class:'c',number:1},
                                {class:'d',number:2},
                                {class:'d',number:3}
                            ]
                        }else{
                            numbers = [
                                {class:'d',number:currentPage-1},
                                {class:'c',number:currentPage},
                                {class:'d',number:currentPage+1}
                            ]
                        }
                    }else{
                        if(total > 1){
                            if(currentPage === 1){
                                numbers = [
                                    {class:'c',number:1},
                                    {class:'d',number:2}
                                ]
                            }else{
                                numbers = [
                                    {class:'d',number:1},
                                    {class:'c',number:2}
                                ]
                            }
                        }else{//一页
                            numbers = [
                                {class:'c',number:1}
                            ]
                        }
                    }
                    return numbers;
                }
            };
    }
    


    function pageDirectiveService(pageService){
            var templates = '<div class="">'+
                '<span class="prevPage">'+
                '<a href="javascript:void(0)" ng-click="prevPageClick()"><上一页</a>'+
                '</span>'+
                '<span class="p-bd">'+
                '<a href="javascript:void(0)" class="{{item.class}}" ng-repeat="item in numbers" ng-bind="item.number"></a>'+
                '</span>'+
                '<span class="nextPage">'+
                '<a href="javascript:void(0)" ng-click="nextPageClick()">下一页></a>'+
                '</span>'+
                '<span class="total">共<i ng-bind="total"></i>页</span>'+
                '<span class="text">到第</span>'+
                '<span class="int"><input ng-keyup="inputLater()" ng-model="inputContent" type="text" value=""/></span>'+
                '<span class="text">页</span>'+
                '</div>';
            //console.log('pageService',pageService);
            return {
                restrict : 'EA',
                /*scope: {              // 设置指令对于的scope
                 name: "@",          // name 值传递 （字符串，单向绑定）
                 amount: "=",        // amount 引用传递（双向绑定）
                 save: "&"           // 保存操作
                 },*/
                scope : false,
                template : templates,
                replace: true,        // 使用模板替换原始标记
                transclude: false,    // 不复制原始HTML内容
                controller: [ "$scope", function (_) {
                    var timer = null;
                    _.inputContent = '';
                    _.current = 1;
                    _.total = 0;
                    _.numbers = pageService.getData({
                        total: _.total,
                        current: _.current
                    });
                    _.$on('EVT_PAGE_CHANGE',function(evt,data){
                        var total = parseInt(data.total);
                        var current = parseInt(data.current);

                        // 如果完全相同，那就没必要再更新了
                        if (total === _.total && current === _.current) return;

                        // 有更新
                        _.total = total;
                        _.current = current;
                        _.numbers = pageService.getData(data);

                    });
                    //下一页
                    _.nextPageClick = function(){
                        if(_.current >= _.total){
                            return;
                        }
                        _.$emit('EVT_PAGE_SELECTED',{'pageSelectedNum':_.current + 1});
                    }
                    //上一页
                    _.prevPageClick = function(){
                        if(_.current <= 1){
                            return;
                        }
                        _.$emit('EVT_PAGE_SELECTED',{'pageSelectedNum':_.current - 1});
                    }
                    //输入框
                    _.inputLater = function(){
                        var pageNo,
                            val = ''+_.inputContent || "";
                            _.inputContent = val.replace(/^\s+|\s+$/ig,'');
//                       c = _.current,  //当前
                        var t = _.total+'',  //全部
                            t = t.match(/\d+/)[0];
                        if(timer){
                            clearTimeout(timer);
                            timer = null;
                        }
                        if(!/^\d+$/ig.test(val)){
                            _.inputContent = '';
                            return;
                        }else{
                            if(parseInt(val) > t){
                                val = t;
                                _.inputContent = t;
                            }else if(parseInt(val) < 1){
                                val = 1;
                                _.inputContent = 1;
                            }else{
                                val = parseInt(val);
                                _.inputContent = val;
                            }
                        }
                        pageNo = val;
                        timer = setTimeout(function(){
                            _.inputContent = '';
                            _.$emit('EVT_PAGE_SELECTED',{'pageSelectedNum':pageNo});
                        },1000)
                    }
                }],
                link: function (scope, element, attrs, controller) {
                    var element = angular.element(element);
                    element.bind('click',function(evt){
                        evt.preventDefault();
                        var target = evt.target,
                            n;
                        if(target.className == 'd'){
                            n = target.innerHTML;
                            scope.$emit('EVT_PAGE_SELECTED',{'pageSelectedNum':n});
                        }
                    });
                }
            }
    }

   

