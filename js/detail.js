$(function(){
	var id=Cookies.get("orderId");//订单id
	
	getDetail(id)// 获取详情

	// 取消任务
	$("#content").on("click",".cancel_btn",function(){
		$(".cansel_modal").show();
		var id=$(this).attr("data-id");
		Cookies.set("orderId",id);
		$(".comfirm").attr("data-id",$(this).attr("data-id"))
	});
	$(".cansel").on("click",function(){
		$(".cansel_modal").hide();
	});
	$(".confirm").on("click",canceltTask);
	// end 取消任务

	// 图片预览
	$("#content").on("click",".img_box img",previewImg);
	$(".img_modal").on("click",function(){
		$(this).hide()
	});

	 
});


////////////////获取详情//////////////////
function getDetail(id){
	var params={
		 "baseToken": baseToken,
 		 "orderId": id
	}
	pullData("order/getOrder",params,function(res){
        if(res.errorCode=="000"){
        	var str=JSON.stringify(res.data)
        	console.log(str)
        	showDetail(res.data.result)
        }else{
            exceptionHandling(res.errorCode)
        }
	},function(err){
	        errorHandling();
	});
}

////////////////end获取详情//////////////////
////////////////////显示详情/////////////////////////
function showDetail(data){
	console.log(data)
	var showData=handleShowData(data),//数据处理
		type=data.orderDTO.orderType;//类型
	var tpl=$("#detail_arg").html();
	laytpl(tpl).render(showData, function(html){
	    $("#content").append(html);
	    //隐藏没有值的属性
	    $(".arg_val").each(function(){
	    	if($(this).text()==""||$(this).text()=="undefined"||$(this).text()=="null"){
	    		$(this).parent().hide()
	    	}
	    });
	    console.log(type)
	    if(type=="3"||type=="4")$(".physicalIndex").hide();
	    //end隐藏没有值的属性
	});
}
////////////////////end显示详情/////////////////////////
//显示的数据处理
function handleShowData(data){
	console.log(data)

	var tec=data.orderDTO.technology,//工艺
		cloth=data.orderDTO.clothKind,//布种
		type=data.orderDTO.orderType,//类型
		status=data.orderDTO.orderStatus,//派单状态 5:原始状态 ，0：派单状态； 1：跟单状态；3:数量不足退回状态 ; 4:不合格退回状态 ; 2：完成状态 ; -1:删除 ; 6:已评论
		unit=data.orderDTO.quantityUnit;//单位
		data.orderDTO.quantityUnit=unit=="m"?"米":"公斤";
	// 取消任务按钮处理
		switch(status){
			case "5":
			case "0":
				data.cancel="visible";
				break;
			case "-1":
				data.cancel="hidden";
				data.canceled="visible";
				break;
			default:
				data.cancel="hidden";
		}
	// 类型处理
		switch(type){
			case "1":
				data.orderType="大货";
				data.subData=data.bulkSampleDTO;
				break;
			case "2":
				data.orderType="匹样";
				data.subData=data.bulkSampleDTO;
				break;
			case "3":
				data.orderType="SO样";
				data.subData=data.labdipsoDTO;
				data.subData.flowerPicture=data.subData.picture;//图片
				data.subData.lightRequired=data.subData.lightSource;//光源要求
				break;
			case "4":
				data.orderType="色样";
				data.subData=data.labdipsoDTO;
				data.subData.flowerPicture=data.subData.picture;
				data.subData.lightRequired=data.subData.lightSource;//光源要求

				break;
			default:
				data.orderType="未知";
				data.subData=data.bulkSampleDTO;
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
				data.colorNum=data.subData.colorSize;
				break;
			case "2":
				data.technology="印花";
				data.numName="花号";
				data.colorNum=data.subData.flowerSize;
				break;
			default:
				data.technology="未知";
		}
	// 物性指标处理
	if(data.bulkSampleDTO)var phy=data.bulkSampleDTO.physicalIndex;//物性指标

	if(phy){
		phy=phy.replace(/[^0-9%]*/ig,"");
		console.log(phy);
		data.Yshrink=phy.slice(8,phy.length-1).split("%")[0]+"%";
		data.Xshrink=phy.slice(8,phy.length-1).split("%")[0]+"%";
		data.colorFastness=phy.slice(0,1)+"."+phy.slice(1,2);
		data.dryGrind=phy.slice(2,3)+"."+phy.slice(3,4);
		data.wetGrind=phy.slice(4,5)+"."+phy.slice(5,6);
		data.torsion=phy.slice(6,7)+"."+phy.slice(7,8);



	}
	// end物性指标处理


	// 其他工艺数据处理
	data.others="";
	if(data.subData.shaomao){data.others+="烧毛，"}
	if(data.subData.shimao){data.others+="食毛，"}
	if(data.subData.zhongdingjiangbian){data.others+="中定浆边，"}
	if(data.subData.zhongdingqiebian){data.others+="中定切边，"}
	if(data.subData.chengdingjiangbian){data.others+="成定浆边，"}
	if(data.subData.chengdingqiebian){data.others+="成定切边，"}
	if(data.subData.penwu){data.others+="喷雾(成品)，"}
	if(data.subData.yusuo){data.others+="预缩(成品)，"}
	if(data.subData.dapian){data.others+="大片，"}
	if(data.subData.penmo){data.others+="喷墨，"}
	data.others=data.others.slice(0,data.others.length-1)
	// end其他工艺数据处理
	// 图片处理
	// 图片src处理
	var imgUrl=Cookies.get("imgUrl"),//存储图片地址url
		img=data.subData.flowerPicture;
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
//////////////////////////取消任务////////////////////////////
function canceltTask(){
	var id=Cookies.get("orderId"),
		params={
			"baseToken": baseToken,
		  	"orderId": id,
		    "status": "-1"
		},
		status=$(".status_list").find("li.active").attr("status"),//状态号
       	txt=$.trim($(".search_input").val());//搜索内容
	 pullData("order/updateOrderStatus",params,function(res){
            if(res.errorCode=="000"){
				$(".cansel_modal").hide();
				$(".cancel_btn").hide();
				$(".canceled_ico").show();
            }else{
                exceptionHandling(res.errorCode)
            }
    },function(err){
            errorHandling();
    });

}
//////////////////////////end取消任务////////////////////////////
///////////////////////////////////图片预览/////////////////////////////////////
function  previewImg(){
	$(".img_modal").show();
	var src=$(this).attr("src").split("?")[0];
	$(".img_modal img").attr("src",src)
}
///////////////////////////////////end 图片预览/////////////////////////////////////


