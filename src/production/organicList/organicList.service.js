export default angular
	.module('organicListSer',[])
	.factory('organicListService',['util','ajax',service])

function service(util,ajax){
	return {
		   setSelectedLi : function(current){
            var parent = util.parent(current,'ul');
                angular.element(parent).find('li').removeClass('selected');
                angular.element(current).parent().addClass('selected');
        },
        getDate : function(val,fn){
            fn && fn(val);
        },
        getLoanMenInfoList : function(cfg){
        	return ajax.post("/acc/accountpartner/getList.do",cfg);
        },
        /**
	      * 获取待审列表
	      * @param {JSON} cfg
	      */
        freezeCtrl : function(cfg){
            return ajax.post("/acc/accountpartner/delPartner.do",cfg);
        },
        /**
	      * 通用 查询
	      * @param {JSON} cfg
	      */
            downLoadFile : function(cfg){
            	location.href = "/acc/accountpartner/downloadCertificate.do?id=" + cfg.id;
            },
            /*
		     * 合计上传文件大小
		     *param [file1Size,file2Size]
		     */
		    upLoadFileSize : function(FileSize){
		    	var sumSize = 0;
		    	for(var i = 0; i < FileSize.length ; i++){
		    		sumSize += Math.ceil(FileSize[i]/1024)
		    	}
		    	return sumSize
		    },
		    /**
		     * instanceUpLoadObj
		     */
		    upService :function(FileUploader){
		    	return new FileUploader({
					          url: '/acc/accountpartner/uploadCertificate.do',
					       })
		    },
			 /*
		     * 上传文件校验
		     * 1.是否填全     2.上传格式校验       3.文件大小校验
		     * param input[type='file']
		     * cfg.testInp2 为 zip 包
		     */
			checkUpLoadFile : function(cfg){
				var checkFormatLen = [],
					result = {
						text : '',
						isPass : true
					};
					
	    		
		    	//1是否填全
		    	if(!cfg.testInp2){
		    		result.text = '请选择要上传文件';
		    		result.isPass = false;
		    		return result;
		    	}
		    	
		    	//zip框特殊校验
		    	var zipFileName = cfg.testInp2.toLowerCase().substr(cfg.testInp2.lastIndexOf("."));
		    	if(!/\.zip/.test(zipFileName)){
		    		result.text = '文件类型出错！';
		    		result.isPass = false;
		    		return result;
		    	}
		    	
		    	//2excel文件格式校验 testFormat[]允许的格式     //暂时，需修改---------------------
//		    	var testFormat = ['.xls','.xlsx'];
//		    	var excelFileName = cfg.testInp1.toLowerCase().substr(cfg.testInp1.lastIndexOf("."));
//		    	for(var k = 0; k < testFormat.length; k++){
//		    		var reg = new RegExp(testFormat[k]);
//		    		if(!reg.test(excelFileName)){
//		    			checkFormatLen.push(testFormat[k]);
//		    		}
//		    	}
//		    	if(checkFormatLen.length == testFormat.length){
//		    		result.text = "文件类型出错！";
//		    		result.isPass = false;
//		    		return result;
//		    	}
		    	
		    	//3文件大小校验             100M
//		    	var checkSumSize = this.upLoadFileSize(cfg.upLoadFileSumSize)
//		    	if(checkSumSize > 100*1024){
//		    		result.text = '附件上传不能大于100M';
//		    		result.isPass = false;
//		    		return result;
//		    	}
		    	return result;
			}
	}
}
