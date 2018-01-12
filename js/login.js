$(function(){
	if(userPhone)$(".phone_input>input").val(userPhone);//历史登录的手机号
	$("input.txt_input").each(function(){
		if($(this).val()!==""){
			$(this).siblings(".tips").hide();
		}
	});
	// 背景图
	$('#section').particleground({
	    dotColor: '#D1EAFA',
	    lineColor: '#DBF0FC',
	    density:30000,//密度
	    particleRadius:12,//点大小
	    lineWidth: 1,//线宽
	  });

	// 隐藏input提示语
	$(".form_section").on("click",".tips",function(){
		$(this).hide().next("input").focus();
	});
	$(".form_section").on("focus","input",function(){
		$(this).prev(".tips").hide();
	});
	// 显示input提示语
	$(".form_section").on("blur","input",function(){
		if($(this).val()=="")$(this).prev().show();
	});
	// 蓝色按钮hover效果
	// $(".blue_btn").on("mouseenter",addActive);
	// $(".blue_btn").on("mouseleave",removeActive);
	$(".blue_btn").on("mousedown",addActive);
	$(".blue_btn").on("mouseup",removeActive);



	// 获取验证码
	$(".get_code").on("click",getCode);
	// 登录
	$(".login_btn").on("click",userLogin);
	$(document).on("keyup",function(e){
		var code=e.keyCode;
		if(code===13){
			userLogin();
		}
	});
	

	// 点击申请使用
	$(".applyUse").on("click",applyUse);

	// 输入手机号验证格式
	$(".phone_item>input").on("keyup",regPhone);

	// 申请使用表单提交
	$(".applySubmit").on("click",applySubmit);

/////////////////////获取验证码////////////////////////////
	function getCode(e){
		var phone=$(".phone_input>input").val(),
			check=checkPhone(phone),
			target=e.target; 
 
		if(check){
			pullData("getValidation",{"phone":phone},function(res){
				switch(res.errorCode){
					case "000":
						time(target);//验证码计时
						break;
					case "003":
						$(".inexistence_modal").show();
						break;
					case "011":
						popup("请输入正确的手机号a");
						break;
					default:
						exceptionHandling(res.errorCode)
				}
			},function(){
				errorHandling();
			});
		}
	}
// 验证手机号码
	function checkPhone(phone){
		if(!(/^1[34578]\d{9}$/.test(phone))){ 
			popup("请输入正确的手机号");
	        return false; 
	    } 
	    $(".tips_popup").fadeOut();
	    return true; 
	}
// 
	function regPhone(){
		var val=$(this).val(),
			len=val.length,
			submit=checkPhone(val);
		
	}
//提示弹窗
	function popup(msg){
		$(".tips_popup .alert_msg").html(msg);
		$(".tips_popup").fadeIn();
	}
// 添加active
	function addActive(){
		$(this).addClass("active");
	}
// 删除active
	function removeActive(){
		$(this).removeClass("active");
	}
//验证码发送计时
	var wait=60;  
	function time(o){ 
	        if (wait == 0) {  
	            o.removeAttribute("disabled");            
	            o.innerHTML="重新获取验证码";  
	            wait = 60;  
	        } else {  
	            o.setAttribute("disabled", "disabled");  
	            o.innerHTML=wait+" 秒后重发";  
	            wait--;  
	            setTimeout(function() {  
	                time(o)  
	            },  
	            1000)  
	        }  
	}
//登录
	function userLogin(){
        // paramss={
        //     "username":"mmhxndwi",
        //     "userId":"508789s"
        // }
        // $.ajax({
        //     url: 'http://mock.eolinker.com/8x35eIYf224c36b084019daea7b476651a190f0192eb607?uri=/login',
        //     // url: getBaseUrl()+url,
        //     type: 'POST',
        //     contentType: 'application/json; charset=utf-8', // 很重要
        //     traditional: true,
        //     data:JSON.stringify(paramss),
        //     success: function(res, status, xhr) {
        //         // window.location.href="index.html";
        //         alert("successssss");
        //         fn && fn(res);
        //     },
        //     error:function(err){
        //         // window.location.href="index.html";
        //         alert("error");
        //         error && error(err);
        //     }
        // });
        // paramss={
        //     "baseToken": "string",
        //     "userId": 1
        // }
        // $.ajax({
        //     url: 'http://192.168.250.82:8087/patena/app/user/vip/accordVip',
        //     // url: getBaseUrl()+url,
        //     type: 'POST',
        //     contentType: 'application/json; charset=utf-8', // 很重要
			//
        //     traditional: true,
        //     data:JSON.stringify(paramss),
        //     success: function(res, status, xhr) {
        //         // window.location.href="index.html";
        //         var result=res.data.result;
        //         alert(result.vipLevelName)
        //         alert(res);
        //         fn && fn(res);
        //     },
        //     error:function(err){
        //         // window.location.href="index.html";
        //         alert("error");
        //         error && error(err);
        //     }
        // });
		var phone=$(".phone_input>input").val(),//手机号18016366326
			code=$(".code_input>input").val(),//验证码1234
			check=checkPhone(phone);
			params={
            "baseToken": "string",
            "userId": phone
        }
			check=true;
		if(check){

			pullData("user/vip/accordVip",params,function(res){
				switch(res.errorCode){
					case "000":
						var result=res.data.result;
                        alert(result.vipLevelName);
						// Cookies.set("baseToken",result.baseToken);
						// Cookies.set("userId",result.id);
						// Cookies.set("userName",result.name);
						// Cookies.set("userPhone",result.phone);
						// Cookies.set("userHead",result.picture);
						// Cookies.set("userImgUrl",res.data.trackimageurl);//img的url
						// Cookies.set("companyId",result.companyId);
						// Cookies.set("companyName",result.companyName);
						// window.location.href="index.html";
						break;
					case "003":
						$(".inexistence_modal").show();
						break;
					// case "011":
					// 	console.log("手机格式不正确");
					// 	break;
					case "010":
						popup("对不起，您没有权限登录！")
						break;
					default:
						exceptionHandling(res.errorCode)
				}
			},function(){
				errorHandling();
			});
		}

	}

// 申请使用
	function applyUse(){
		var phone=$(".inexistence_modal").hide().find(".phone_input>input").val();//隐藏用户不存在弹窗
		$(".applyUse_modal").show();//显示申请使用弹窗
		$(".phone_item").find("input").val($(".phone_input input").val());
		$(".phone_item").find(".apply_tips").hide();


	}

// 申请提交
	function applySubmit(){
		var val=serializeForm("applyForm"),
			check=checkPhone(val.phone),
			params={
			  "companyName": val.company,
			  "name": val.name,
			  "phone": val.phone,
			  "position": val.position,
			  "remark": val.remark
			}
			for(var k in val){
				var v=$.trim(val[k]);
				if(k=="remark")v="remark";
				if(v==""){
					check=false;
					popup("请填完对应信息后再提交")
				}
			}

		if(check){ 
			pullData("apply/addApply",params,function(res){
				if(res.errorCode=="000"){
					$(".applyUse_modal").hide();
					$(".succ_popup_modal").show();
					setTimeout(function(){
						$(".succ_popup_modal").fadeOut();
					},1000)
				}else{
					exceptionHandling(res.errorCode)
				}
			},function(){
				errorHandling();
			});
		}
	}
});