$(function(){
	//查看确认页
	$("#submit").on("click",function(){
		formCheck(getFormData);//检验表单是否完善
	});
	showForm("sampleForm");//默认赋值上一次填的内容


///////////////////////获取表单内容//////////////////////////////
function getFormData(){
	var formData=serializeForm("sampleForm");
	console.log(formData);
	// 业务员和跟单员 印染厂id
	formData.salerId=$(".salesman").attr("data-id");
	formData.followerId=$(".followman").attr("data-id");
	formData.factoryId=$(".factory").attr("data-id");
	// end业务员和跟单员 印染厂id

	//图片名
	var imgArr=$("#previewImg").find("img");
	formData.flowerPicture="";
	imgArr.each(function(){
		var src=$(this).attr("info");
		formData.flowerPicture+=src+",";
	});
	formData.flowerPicture=formData.flowerPicture.slice(0,formData.flowerPicture.length-1)
	//end图片名


	// 花号色号确定
	if(formData.technology=="1"){
		formData.flowerNum="";
	}else{
		formData.flowerNum=formData.colorNum;
		formData.colorNum="";
	}
	// end花号色号确定
	//单选按钮选择组的值确定
	var group=$(".chose_btn_group.chose_one");
	group.each(function(){
		var val=$(this).find("li.active").text(),
			name=$(this).attr("name");
			formData[name]=val;
	});
	//end 单选按钮选择组的值确定
	// 物性指标确定
	formData.physicalIndex="色{0}干{1}湿{2}扭{3}经缩{4}纬缩{5}".format(formData.colorFastness,formData.dryGrind,formData.wetGrind,formData.torsion,formData.Yshrink,formData.Xshrink);
	// formData.physicalIndex=`色${formData.colorFastness}干${formData.dryGrind}湿${formData.wetGrind}扭${formData.torsion}经缩${formData.Yshrink}纬缩${formData.Xshrink}`;ES6方法
	// end物性指标确定

	// 其他工序确定
	var others=$(".chose_btn_group.chose_multiple").find("li");
	others.each(function(){
		var active=$(this).hasClass("active"),
			name=$(this).attr("name");
			formData[name]=active;
	});
	// end其他工序确定
	// 备注
	formData.remark=$(".remark").val();
	var data=JSON.stringify(formData);
	localStorage.setItem("sampleForm",data);//表单数据本地存储
	localStorage.setItem("formData",data);//表单数据本地存储
	localStorage.setItem("orderType","2");//匹样

	return formData;
}
///////////////////////end获取表单内容//////////////////////////////



});