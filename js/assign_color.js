$(function(){

	//查看确认页
	$("#submit").on("click",function(){
		formCheck(getFormData);//检验表单是否完善
	});
	showForm("colorForm");//默认赋值上一次填的内容


///////////////////////获取表单内容//////////////////////////////
function getFormData(){
	var formData=serializeForm("colorForm");
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
	// if(formData.technology=="1"){
	// 	formData.flowerNum="";
	// }else{
	// 	formData.flowerNum=formData.colorNum;
	// 	formData.colorNum="";
	// }
	// end花号色号确定
	//单选按钮选择组的值确定
	var group=$(".chose_btn_group.chose_one");
	group.each(function(){
		var val=$(this).find("li.active").text(),
			name=$(this).attr("name");
			formData[name]=val;
	});
	//end 单选按钮选择组的值确定
	// 备注
	formData.remark=$(".remark").val();
	var data=JSON.stringify(formData);
	localStorage.setItem("colorForm",data);//表单数据本地存储
	localStorage.setItem("formData",data);//表单数据本地存储
	localStorage.setItem("orderType","4");//色样

	return formData;
}
///////////////////////end获取表单内容//////////////////////////////



});