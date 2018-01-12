$(function(){
	var formData=JSON.parse(localStorage.getItem("formData")),//获取本地存储的表单数据
		type=localStorage.getItem("orderType");//订单类型

	var data=JSON.parse(localStorage.getItem("formData")),
		showData=handleShowData(data,type);//显示的数据处理
		console.log(showData)
	var tpl=$("#detail_arg").html();
	laytpl(tpl).render(showData, function(html){
	    $("#content").append(html);
	    //隐藏没有值的属性
	    $(".arg_val").each(function(){
	    	if($(this).text()==""||$(this).text()=="undefined"){
	    		$(this).parent().hide()
	    	}
	    });
	    if(type=="3"||type=="4")$(".physicalIndex").hide();
	    //end隐藏没有值的属性
	});

	//继续编辑
	// $("#content").on("click",".edit_continue",function(){
	// 	window.history.back(-1);
	// });
	// 提交表单
	$("#content").on("click",".submit",function(){
		var arg=divParams(type,formData);
		submitForm(arg);
	});

	// 图片预览
	$("#content").on("click",".img_box img",previewImg);
	$(".img_modal").on("click",function(){
		$(this).hide()
	});

});

//显示的数据处理
function handleShowData(data,type){
	// 类型和工艺数据
	var tec=data.technology,//工艺
		cloth=data.clothType,//布种
		unit=data.unit1;//单位
		data.unit1=data.unit1=="m"?"米":"公斤";//单位处理
	// 类型处理
		switch(type){
			case "1":
				data.orderType="大货";
				break;
			case "2":
				data.orderType="匹样";
				break;
			case "3":
				data.orderType="SO样";
				break;
			case "4":
				data.orderType="色样";
				break;
			default:
				data.orderType="未知";
		}
		// 布种处理
		switch(cloth){
			case "1":
				data.clothType="针织";
				break;
			case "2":
				data.clothType="梭织";
				break;
			default:
				data.clothType="未知";
		}
		// 工艺处理
		switch(tec){
			case "1":
				data.technology="染色";
				data.numName="色号";
				data.GCvisible="hidden";
				break;
			case "2":
				data.technology="印花";
				data.numName="花号";
				data.colorNum=data.flowerNum;
				break;
			default:
				data.technology="未知";
		}
	// end类型和工艺数据
	// 其他工艺数据处理
	data.others="";
	if(data.shaomao){data.others+="烧毛，"}
	if(data.shimao){data.others+="食毛，"}
	if(data.zhongdingjiangbian){data.others+="中定浆边，"}
	if(data.zhongdingqiebian){data.others+="中定切边，"}
	if(data.chengdingjiangbian){data.others+="成定浆边，"}
	if(data.chengdingqiebian){data.others+="成定切边，"}
	if(data.penwu){data.others+="喷雾(成品)，"}
	if(data.yusuo){data.others+="预缩(成品)，"}
	if(data.dapian){data.others+="大片，"}
	if(data.penmo){data.others+="喷墨，"}
	data.others=data.others.slice(0,data.others.length-1)
	// end其他工艺数据处理
	// 图片处理
	// 图片src处理
	var imgUrl=Cookies.get("imgUrl"),//存储图片地址url
		img=data.flowerPicture;
      data.imgSrc=[];
      if(img){//img!==""&&img!=="undefind"
        var imgArr=img.split(",");
        for(var i=0;i<imgArr.length;i++){
          data.imgSrc[i]=imgUrl+imgArr[i]+"?imageView2/1/w/610/h/270";
        }
      }
    // end图片src处理

	console.log(data);
	return data;
}
//end显示的数据处理
////////////////////上传表单//////////////////////
	function submitForm(arg){
		
		pullData(arg.url,arg.params,function(res){
        	    if(res.errorCode=="000"){
        	    	window.location.href="index.html"
        	    }else{
        	        exceptionHandling(res.errorCode)
        	    }
	    	},function(err){
	    	        errorHandling();
	    	});
		
	}
////////////////////end上传表单//////////////////////
/////////////////////////////////////////////////////
function divParams(type,data){
	var arg={}
	switch(type){
		case "1":
		case "2":
			arg.url="order/saveOrderByBul";
			arg.params={
			  "allQuantity": data.clothType,//投坯数量
			  "baseToken": baseToken,
			  "clothKind": data.clothType,//布种
			  "companyId": companyId,//公司id
			  "createDate": data.orderDate,//下单日期
			  // "createType": "",
			  "distributeId": userId,//派单员id
			  "distributeName": userName,//派单员名
			  "expectTarget": data.finishedNum,//成品数量
			  "factoryId": data.factoryId,//染厂id..........
			  "factoryName": data.factory,//染厂名
			  "followerId": data.followerId,//跟单员id.........
			  "followerName": data.followman,//跟单员名
			  // "infoId": "",
			  // "orderId": "",//订单号
			  "orderName": data.clothName,//坯布名
			  // "orderStatus": "",
			  "orderType": type,//订单类型  1：大货、2匹样  3：so样，4 色样........
			  "productName": data.pname,//品名
			  "quantityUnit": data.unit1,//数量单位
			  // "remainQuantity": "",//剩余数量
			  "remark": data.remark,//备注
			  "salerId": data.salerId,//业务员id.......
			  "salerName": data.salesman,//业务员名
			  "submitDate": data.deliveryDate,//交期
			  "technology": data.technology,//工艺
			  "volume": data.intoNum,//投坯匹数
			  "bulkSampleDTO": {
			     "backgroundColor": data.groundColor,//底色(选择印花时才有的数据)
			    // "bulkSampleId": "",
			    "chengdingjiangbian": data.chengdingjiangbian,//成定浆边
			    "chengdingqiebian": data.chengdingqiebian,//成定切边
			    "colorSize": data.colorNum,//色号
			    "dapian": data.dapian,//大片
			    "flowerPicture": data.flowerPicture,//花型图片名“ueif.jpg,heufhy.jpg”
			    "flowerSize": data.flowerNum,//花号
			    "grams": data.weight,//克重
			    "handRequired": data.handRequired,//手感要求
			    "lightRequired": data.lightRequired,//光源要求
			    "packingRequired": data.packingRequired,
			    "penmo": data.penmo,//喷墨
			    "penwu": data.penwu,//喷雾
			    "physicalIndex": data.physicalIndex,//物性指标
			    "pinNumer": data.pinNumer,//针数寸数
			    "remark": data.remark,//备注
			    "shaomao":  data.shaomao,//烧毛
			    "shimao":  data.shimao,//食毛
			    "shippingNumber":data.shippingNumber,//船样米数
			    "technology": data.technology,//工艺
			    "width": data.width,//门幅
			    "yusuo": data.yusuo,//预缩
			    "zhongdingjiangbian": data.zhongdingjiangbian,//中定浆边
			    "zhongdingqiebian": data.zhongdingqiebian//中定切边
			  }
			}
		break;
		case "3":
			arg.url="order/saveOrderByLab";
			arg.params={
			  "baseToken": baseToken,
			  "clothKind": data.clothType,//布种
			  "colorSize": data.colorNum,//色号
			  "companyId": companyId,//公司id
			  "createDate": data.orderDate,//下单日期
			  "distributeId": userId,//派单员id
			  "distributeName": userName,//派单员名
			  "factoryId": data.factoryId,//染厂id
			  "factoryName": data.factory,//染厂名
			  //"flowerSize": "string",//花号
			  "followerId": data.followerId,//跟单员id
			  "followerName": data.followman,//跟单员名
			  "orderName": data.clothName,//坯布名
			  "orderType": "3",//订单类型  1：大货、2匹样  3：so样，4 色样
			  "productName": data.pname,//品名
			  "remark": data.remark,//备注
			   "salerId": data.salerId,//业务员id.......
			  "salerName": data.salesman,//业务员名
			  "submitDate": data.deliveryDate,//交期
			  "technology": data.technology,//工艺
			  "labdipsoDTO": {
			    "backgroundColor": data.groundColor ,//底色
			    "colorChroma": data.colorCount,//色量
			    "colorSize": data.colorNum,//色号
			    "grams": data.weight,//克重
			    "lightSource": data.lightRequired,//光源
			    "number": data.count,//数量
			    "picture": data.flowerPicture,//图片
			    "recoil": data.recoil,//回位
			    "remark": data.remark,//备注
			    "size": data.size//尺寸
			  }
			}
		break;
		case "4":
			arg.url="order/saveOrderByLab";
			arg.params={
			  "baseToken": baseToken,
			  "clothKind": data.clothType,//布种
			  "colorSize": data.colorNum,//色号
			  "companyId": companyId,//公司id
			  "createDate": data.orderDate,//下单日期
			  "distributeId": userId,//派单员id
			  "distributeName": userName,//派单员名
			  "factoryId": data.factoryId,//染厂id
			  "factoryName": data.factory,//染厂名
			  //"flowerSize": "string",//花号
			  "followerId": data.followerId,//跟单员id
			  "followerName": data.followman,//跟单员名
			  "orderName": data.clothName,//坯布名
			  "orderType": "4",//订单类型  1：大货、2匹样  3：so样，4 色样
			  "productName": data.pname,//品名
			  "remark": data.remark,//备注
			   "salerId": data.salerId,//业务员id.......
			  "salerName": data.salesman,//业务员名
			  "submitDate": data.deliveryDate,//交期
			  "technology": data.technology,//工艺
			  "labdipsoDTO": {
			    //"backgroundColor": "string",//底色
			    "colorChroma": data.colorCount,//色量
			    "colorSize": data.colorNum,//色号
			    "grams": data.weight,//克重
			    "lightSource": data.lightRequired,//光源
			    "number": data.count,//数量
			    "picture": data.flowerPicture,//图片
			   // "recoil": data,//回位
			    "remark": data.remark,//备注
			    "size": data.size//尺寸
			  }
			}
		break;

	 }//switch
		
	return arg;

}
//////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////图片预览/////////////////////////////////////
function  previewImg(){
	$(".img_modal").show();
	var src=$(this).attr("src").split("?")[0];
	$(".img_modal img").attr("src",src)
}
///////////////////////////////////end 图片预览/////////////////////////////////////
	
	
