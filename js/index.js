
$(function(){
	// 用户信息
	$(".user_name").text(userName);
    $(".user_phone").text(userPhone);
    $(".user_head").attr("data-id",userId);
    if(userHead==null||userHead==""||userHead=="null"){
      var headSrc="img/head.png";
    }else{
      var headSrc=userImgUrl+userHead+"?imageView2/1/w/96/h/92";
    }
    $(".user_head>img").attr("src",headSrc);
    // end 用户信息

    getListData(1,6);//首屏数据

	// 选择派单状态
	$(".status_list").on("click",".status_item",choseStatus);

	// 点击搜索
	$(".search_icon_box").on("click",searchList);

	// 隐藏input提示语
	$(".search_tips").on("click",function(){
		$(this).hide().prev(".search_input").focus();
	});
	$(".search_input").on("focus",function(e){
		$(this).next(".search_tips").hide();
	});
	// 显示input提示语
	$(".search_input").on("blur",function(){
		if($(this).val()=="")$(this).next().show();
	});

	// 滚动条到底加载跟多数据
	$(window).on("scroll",loadMore);

	// 取消任务
	$(".order_list").on("click",".cancel_btn",function(){
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

	// 进入详情页
	$(".order_list").on("click",".item_center",entryDetail)



	
	
	


});
/////////// 获取列表数据/////////////
//baseToken：//全局变量 登陆后存储的值
//page：页码
//size:数据条数
//companyId:公司id //全局变量 登陆后存储的值
//distributeId:派单员id（登录用户id）全局变量 登陆后存储的值
//fuzzy：搜索框内容
//orderStatus:派单状态  未开始：5,0 (可取消任务)。 进行中：1,3,4  。 已完成2,6   全部传空
//5:原始状态 ，0：派单状态； 1：跟单状态；3:数量不足退回状态 ; 4:不合格退回状态 ;  2：完成状态 ; -1:删除 ; 6:已评论
function getListData(page,size,fuzzy,orderStatus,flag){
	var params=	{
		  "baseToken": baseToken,
		  "companyId": companyId,
		  "distributeId": userId,
		  "page": page,
		  "size": size,
		  "fuzzy": fuzzy,
		  "orderStatus": orderStatus
		}
    $(".order_list").attr("data-page",page);
	if(!flag){$('.order_list').empty()}
	 pullData("order/getOrderList",params,function(res){
            if(res.errorCode=="000"){
            	showListData(res.data,page);
            	Cookies.set("imgUrl",res.data.trackimageurl);//存储图片地址url
            }else{
                exceptionHandling(res.errorCode)
            }
    },function(err){
            errorHandling();
    });

}
//////////// end 获取列表数据////////////

/////////////////////列表数据显示///////////////////////
function showListData(data,page){
	var result=data.result,
		l=result.length,
		imgUrl=data.trackimageurl;
		console.log(l);
		console.log(page);
	if(l<1&&page<2){
		$(".list_blank").show();
		return;
	}else{
		$(".list_blank").hide();
	}
	// 数据处理
	for(var i=0;i<l;i++ ){
		var img=result[i].followerPicture,//图片
			type=result[i].orderType,//类型 1：大货、2匹样  3：so样，4 色样
			tec=result[i].technology,//工艺 1：染色  2：印花
			status=result[i].orderStatus;//派单状态 5:原始状态 ，0：派单状态； 1：跟单状态；3:数量不足退回状态 ; 4:不合格退回状态 ; 2：完成状态 ; -1:删除 ; 6:已评论
		// 图片处理
		if(img==null||img==""){
			result[i].followerPicture="img/default.png"
		}else{
			result[i].followerPicture=imgUrl+img;
		}
		// 类型处理
		switch(type){
			case "1":
				result[i].orderType="大货";
				break;
			case "2":
				result[i].orderType="匹样";
				break;
			case "3":
				result[i].orderType="SO样";
				break;
			case "4":
				result[i].orderType="色样";
				break;
			default:
				result[i].orderType="未知";
		}
		// 工艺处理
		switch(tec){
			case "1":
				result[i].technology="染色";
				break;
			case "2":
				result[i].technology="印花";
				break;
			default:
				result[i].technology="未知";
		}
		// 取消任务按钮处理
		switch(status){
			case "5":
			case "0":
				result[i].cancel="visible";
				break;
			case "-1":
				result[i].cancel="hidden";
				result[i].canceled="visible";
				break;
			default:
				result[i].cancel="hidden";
		}
	}
	// end数据处理

    var dataTpl=$("#item_data").html();
    laytpl(dataTpl).render(data, function(html){
        $(".order_list").append(html);
        loading=false;
    });
}
/////////////////////end列表数据显示///////////////////////

////////////////////选择状态///////////////////////
function choseStatus(){
	if(!$(this).hasClass("active")){
            $(this).addClass("active").siblings().removeClass("active");
        }
        var status=$(this).attr("status"),
        	txt=$.trim($(".search_input").val());
        getListData(1,6,txt,status);
}
////////////////////end选择状态///////////////////////

//////////////////搜索列表///////////////////////
function searchList(){
	var status=$(".status_list").find("li.active").attr("status"),
        txt=$.trim($(".search_input").val());
    getListData(1,6,txt,status);
}
//////////////////end搜索列表end/////////////////////

///////////////////////加载更多/////////////////////////////
var loading=false;
function loadMore(){
	if (loading)return;
	var page=parseInt($('.order_list').attr("data-page"));
	//$(window).scrollTop()这个方法是当前滚动条滚动的距离
    //$(window).height()获取当前窗体的高度
    //$(document).height()获取当前文档的高度
    var bot = 0; //bot是底部距离的高度
    if ((bot + $(window).scrollTop()) >= ($(document).height() - $(window).height())) {
        //当底部基本距离+滚动的高度〉=文档的高度-窗体的高度时；
        //我们需要去异步加载数据了
        // $.getJSON("url", { page: "2" }, function (str) { alert(str); });
	    loading=true;
		var status=$(".status_list").find("li.active").attr("status"),
       	txt=$.trim($(".search_input").val());
    	getListData(page+1,6,txt,status,true);
    }
}
///////////////////////end加载更多/////////////////////////////

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
				getListData(1,6,txt,status);//首屏数据
            }else{
                exceptionHandling(res.errorCode)
            }
    },function(err){
            errorHandling();
    });

}
//////////////////////////end取消任务////////////////////////////
//////////////////////////////进入详情页/////////////////////////////////
function entryDetail(){
	var id=$(this).attr("data-id");
	Cookies.set("orderId",id);//存储订单id
	window.open("detail.html");  
}
//////////////////////////////进入详情页/////////////////////////////////




