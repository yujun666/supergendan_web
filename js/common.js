////////////用户参数////////////////
var baseToken= Cookies.get("baseToken"),
    userName= Cookies.get("userName"),
    userId= Cookies.get("userId"),
    userPhone= Cookies.get("userPhone"),
    userHead= Cookies.get("userHead"),
    userImgUrl= Cookies.get("userImgUrl"),
    companyId= Cookies.get("companyId"),
    companyName= Cookies.get("companyName");
////////////end用户参数////////////////




var getBaseUrl = function () {
//protocol 属性是一个可读可写的字符串，可设置或返回当前 URL 的协议,所有主要浏览器都支持 protocol 属性
    var ishttps = 'https:' == document.location.protocol ? true: false;
    var url = window.location.host;
    url='192.168.250.82:8087';
      if(ishttps){
        url = 'https://' + url+'/patena/app/';
    }else{
        url = 'http://' + url+'/patena/app/';
    }
    return url;
}
// console.log(getBaseUrl());
// 数据请求
window.pullData = function(url,params,fn,error){
    $.ajax({
        // url: 'http://183.131.94.130:8087/patena/app/user/vip/getVips',
        url: getBaseUrl()+url,
        type: 'POST',
        contentType: 'application/json; charset=utf-8', // 很重要
        traditional: true,
        data: JSON.stringify(params), // {"name":"zhangsan", "age": 28}
        success: function(res, status, xhr) {
            fn && fn(res);
        },
        error:function(err){
            error && error(err);
        }
    });
}

// 数据请求异常处理
function exceptionHandling(code){
  switch(code){
    // case "001":
    //     alert("手机号不匹配");
    //     break;
     case "002":
        alert("缺少数据");
        break;
    case "004":
        alert("验证码已过期");
        break;
    case "005":
        alert("验证码不匹配");
        break;
    case "007":
        alert("账号异地登录，请重新登录");
        window.location.href="login.html"
        break;
    case "008":
        alert("账号异常，请重新登录");
        window.location.href="login.html"
        break;
    case "009":
        alert("操作失败");
        break;
    // case "011":
    //     swal("格式错误", "点击返回", "info");
    //     break;
    case "999":
        alert("请重试");
        break;
  }
}

// 数据请求错误处理
function errorHandling(){

    alert("网络连接失败");

}

////////////////////////////////////获取表单input的value数据///////////////////////////////////////
//获取指定form中的所有的<input>对象  
function getElements(formId) {  
  var form = document.getElementById(formId);  
  var elements = new Array();  
  var tagElements = form.getElementsByTagName('input'); 
  for (var j = 0; j < tagElements.length; j++){ 
     elements.push(tagElements[j]); 
  } 
  return elements;  
}  
  
//获取单个input中的【name,value】数组 
function input(element) {  
  switch (element.type.toLowerCase()) {  
   case 'submit':  
   case 'hidden':  
   case 'password':  
   case 'text': 
    return [element.name, element.value];  
   case 'checkbox':  
   case 'radio':  
    if (element.checked)return [element.name, element.value];    
  }  
  return false;  
}  

  
//调用方法   
function serializeForm(formId) {  
  var elements = getElements(formId);  
  var queryComponents = new Object(); 
  // console.log(queryComponents);  
  for (var i = 0; i < elements.length; i++) {  
    var queryComponent = input(elements[i]);
    // console.log(queryComponent[0]); 
    // console.log(queryComponent[1]);  
    queryComponents[queryComponent[0]]=queryComponent[1];
  }  

  return queryComponents; 
}
////////////////////////////////////end获取表单input的value数据end///////////////////////////////////////
//////////////////////////占位符/////////////////////////////
String.prototype.format=function()
{
if(arguments.length==0) return this;
for(var s=this, i=0; i<arguments.length; i++)
　 s=s.replace(new RegExp("\\{"+i+"\\}","g"), arguments[i]);
return s;
};
//console.log("http://{0}/{1}/{2}".format("", "web", "abc.htm"));
//console.log("请输入{0},输完后再按存盘按钮".format("姓名"));
//////////////////////////占位符/////////////////////////////

///////////////////////////////////七牛图片预览///////////////////////////////////
function previewImage(file, callback) {//file为plupload事件监听函数参数中的file对象,callback为预览图片准备完成的回调函数
                if (!file || !/image\//.test(file.type)) return; //确保文件是图片
                if (file.type == 'image/gif') {//gif使用FileReader进行预览,因为mOxie.Image只支持jpg和png
                  var fr = new mOxie.FileReader();
                  fr.onload = function () {
                    callback(fr.result);
                    fr.destroy();
                    fr = null;
                  }
                  fr.readAsDataURL(file.getSource());
                } else {
                  var preloader = new mOxie.Image();
                  preloader.onload = function () {
                        //preloader.downsize(300, 300);//先压缩一下要预览的图片,宽300，高300
                        var imgsrc = preloader.type == 'image/jpeg' ? preloader.getAsDataURL('image/jpeg', 80) : preloader.getAsDataURL(); //得到图片src,实质为一个base64编码的数据
                        callback && callback(imgsrc); //callback传入的参数为预览图片的url
                        preloader.destroy();
                        preloader = null;
                      };
                      preloader.load(file.getSource());
                    }
}
///////////////////////////////////end七牛图片预览///////////////////////////////////
//////////选择//////////
window.chose=function(){
   if(!$(this).hasClass("active")){
            $(this).addClass("active").siblings().removeClass("active");
        }
}
//////////end选择//////////

// 对Date的扩展，将 Date 转化为指定格式的String
// 月(M)、日(d)、小时(h)、分(m)、秒(s)、季度(q) 可以用 1-2 个占位符， 
// 年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字) 
// 例子： 
// (new Date()).Format("yyyy-MM-dd hh:mm:ss.S") ==> 2006-07-02 08:09:04.423 
// (new Date()).Format("yyyy-M-d h:m:s.S")      ==> 2006-7-2 8:9:4.18 
Date.prototype.Format = function (fmt) { //author: meizz 
    var o = {
        "M+": this.getMonth() + 1, //月份 
        "d+": this.getDate(), //日 
        "h+": this.getHours(), //小时 
        "m+": this.getMinutes(), //分 
        "s+": this.getSeconds(), //秒 
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度 
        "S": this.getMilliseconds() //毫秒 
    };
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
    if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
}
//调用： var time1 = new Date().Format("yyyy-MM-dd");var time2 = new Date().Format("yyyy-MM-dd HH:mm:ss");









////关闭弹窗////
$(".modal_close").on("click",function(){
    $(this).parent().parent().parent(".modal").hide();
});
////end 关闭弹窗////


/////////////////点击头像出现管理下拉框//////////////////////
$(".user_head").on("click",function(){
  console.log(185)
  $(".user_manage").show();
});

//////////////////隐藏管理下拉框///////////////////////
$("body").on("click",function(e){
  if(e.target.className=="user_head_img")return;
  $(".user_manage").hide();
});

////////////////////////退出登录////////////////////////////
$("#logout").on("click",function(){
  Cookies.set("baseToken","");
  window.location.href="login.html"
});

////////////////////////end退出登录////////////////////////////


