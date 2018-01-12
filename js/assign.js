


$(function(){
  // 打印
  // $(".form_title").on("click",function(){
  //   window.print();
  // });
 
	// 隐藏input提示语
	$(".form_content").on("click",".input_pld",function(){
		$(this).hide().prev(".input_txt").focus();
	});
	$(".form_content").on("focus",".input_txt",function(e){
		$(this).next(".input_pld").hide();
	});
	// 显示input提示语
	$(".form_content").on("blur",".input_txt",function(){
		var date=$(this).hasClass("datepicker");
		if(date)return;
		if($(this).val()=="")$(this).next().show();
	});

  // 品名填完后坯布名复制
  $(".form_content").on("blur",".pname",function(){
    $(".clothName").val($(this).val());
  });
  // 限制输入框输入文字不超过50个字
  $(".form_content").on("keyup",".input_txt",limitFont);
  

  $(".form_content").on("click",".search_sel_list li",assignVal);//点击搜索下拉列表更改搜索文本框值
  $(".form_content").on("keydown",".input_txt",choseSearchList);//上下键移动，回车键选择
	
	$(".form_content").on("keyup",".factory",getFactory);// 获取印染厂
  $(".form_content").on("click",".factory",getFactory);// 获取印染厂
	$(".form_content").on("click",".salesman",getSalesman);// 获取业务员
	$(".form_content").on("click",".followman",getFollowman);// 获取跟单员

	// 选择工艺改变（花号和色号）
	$(".form_content").on("change","#technology input",changeTec)

	
	// 单位选择
	$(".form_content").on("click",".unit_sel_list li",function(){
		var val=$(this).html(),
			  list=$(".unit_sel_list");
		list.siblings("input").val(val);
		list.hide();
	});
	// end单位选择
	$(".form_content").on("click",".chose_one li",chose);// 按钮组选择（单选）
	$(".form_content").on("click",".chose_multiple li",choseMultipleBtn);// 按钮组选择（多选）

	// 下拉选择
	$(".form_content").on("click",".input_sel",function(){
    $(".sel_list").hide();
		$(this).siblings(".sel_list").show();
	});
	 $(".form_content").on("click",".val_sel_list li",assignVal);

	//点击右侧导航
	$(".form_tab").on("click",".form_tab_item",chose)
	//end点击右侧导航



});

// 限制输入字数<50
function limitFont(){
   if($(this).hasClass("remark"))return;
    var val=$(this).val(),
        l=val.length;
    if(l>49){
      val=val.slice(0,50);
      $(this).val(val);
    }
}

// 改变工艺
function changeTec(e){
	console.log(e.target);
	var o=$(e.target),
		num=o.val();
		sampleNumber=o.parent().siblings("#sampleNumber");
		if(num=="1"){
			var text="色号",
          html=text+'<span class="required">*</span>';
      $("#groundColor").hide();
      $(".img_label").html("颜色图");
		}else{
			var text="花号"
          html=text+'<span class="required">*</span>';
      $("#groundColor").show();
      $(".img_label").html("花型图");
		}
		sampleNumber.find(".input_label").html(html);
		sampleNumber.find(".input_pld").text("请输入"+text);
}
// 单选
// function choseOneBtn(){
// 	 if($(this).hasClass("active")){
//             $(this).removeClass("active");
//         }else{
//         	$(this).addClass("active").siblings().removeClass("active");
//         }
// }
// 多选
function choseMultipleBtn(){
	 if($(this).hasClass("active")){
            $(this).removeClass("active");
        }else{
        	$(this).addClass("active");
        }
}

///////////获取印染厂名////////////
function getFactory(e){
	var o=$(e.target),
         name=o.val(),//name:接口参数，用户输入的值
	     params={
          "name": name,
          "page":  1,
          "size":  1000,
           "baseToken": baseToken
        }
    getName(e,params);
}
///////////end获取印染厂名////////////

//////////获取该公司下的业务员////////
function getSalesman(e){
	console.log(487485);
	 var params={
          "name": name,
          "page":  1,
          "size":  1000,
          "companyId":companyId,//公司id
          "baseToken": baseToken,
          "typeSaler": true
        }
    getName(e,params);
}
//////////获取该公司下的业务员////////
//////////获取该公司下的跟单员////////
function getFollowman(e){
	var  params={
          "page":  1,
          "size":  1000,
          "companyId":companyId,//公司id
          "baseToken": baseToken,
          "typeFollower": true,
        }
    getName(e,params);
}
//////////获取该公司下的跟单员////////
// 数字限制
$('.form_content').on('keyup',".input_num",function(){
   var val=$(this).val(),
   	value = val.replace(/[^0-9]/ig,"");
   if(isNaN(val))$(this).val(value);

 });
$('.form_content').on('blur',".input_num",function(){
   var val=$(this).val();
   if(val<0||val==0)$(this).val("");
 });
// end 数字限制

//////////////////////////////////搜索出现下拉选择菜单///////////////////////////////////////////////////////
////////获取工厂名字////////
function getName(e,params){
    if(e.keyCode==38||e.keyCode==40||e.keyCode==13)return;
    var o=$(e.target),
        url=o.attr("data-url"),//url:数据接口
        list=o.siblings("ul.sel_list");//搜索下拉框
    o.siblings(".input_sel_pld").hide();//隐藏提示
    // if(name=="")return;
    o.attr("data-id","")//去除id
    pullData(url,params,function(res){
            if(res.errorCode=="000"){
                searchList(res.data,list);//名字列表显示
            }else{
                exceptionHandling(res.errorCode)
            }
    },function(err){
            errorHandling();
    });
}
///////名字列表显示//////
//data：请求到的数据对象
//list：下拉菜单jQuery对象
function searchList(data,list){
     list.empty().show();
     var l=data.result.length;
     if(l>0){
         for(var i=0;i<l;i++){
             var name=data.result[i].name,
                id=data.result[i].id;
            var li="<li data-id="+id+"  class='search_li'>"+name+"</li>";
            list.append(li)
        }
    }else{
        var li="<li>未找到相关内容</li>";
            list.append(li);
    }
} 
////////输入框赋值////////
//e:事件对象
 function assignVal(){
  var list=$(this).parent(),
      val=$(this).text(),
      id=$(this).attr("data-id");
      list.siblings("input").val(val).attr("data-id",id).siblings(".input_pld").hide();
      list.hide();
}

//////上下键和回车键选择//////
var i=0;//全局变量
function choseSearchList(e){
       var key=e.keyCode,
           index,
           o=$(this),
           ul=o.siblings("ul");
       if(key==38||key==40){
          index=o.siblings("ul").children().length;//获取下拉框li的个数
          if(key==38){//向上
            i--;
            if(i<0)i=index;
          }else{//向下
            i++;
            if(i>index)i=1;
          }
          var li=ul.find("li").eq(i-1);
          li.addClass("active").siblings().removeClass("active");
          changeVal(ul,o);
       }
       if(key==13){//回车键
        changeVal(ul,o);
        ul.hide();
       }
}
//改变搜索框文本值
function changeVal(ul,o){
  var li=ul.find("li.active"),
            val=li.html(),
            id=li.attr("data-id");
  o.val(val).attr("data-id",id);
}
//////end上下键和回车键选择//////
//////////////////////////////////end搜索出现下拉选择菜单///////////////////////////////////////////////////////


// 属性赋值历史值
function showForm(formId){
  var formData=JSON.parse(localStorage.getItem(formId));////获取本地存储的表单数据
  if(formData==null||formData==""||formData=="undefind"){
    var dataTpl=$("#blankFormTpl").html();
    formData={}
  }else{
    var dataTpl=$("#formTpl").html();
    handleHistory(formData);// 表单历史值处理
  }
    
    laytpl(dataTpl).render(formData, function(html){
        $("#"+formId).append(html);
        handleShow(formData);// 表单显示处理
    });
}
// end属性赋值历史值
// 表单历史值处理
function handleHistory(data){
    var clothType=data.clothType,//布种
      technology=data.technology,//工艺
      img=data.flowerPicture,//图片名
      imgUrl=Cookies.get("imgUrl");//存储图片地址url
        // 布种工艺处理
        data.clothTypeChecked1=radioVal(clothType,"1","2")[1];
        data.clothTypeChecked2=radioVal(clothType,"1","2")[2];
        data.technologyChecked1=radioVal(technology,"1","2")[1];
        data.technologyChecked2=radioVal(technology,"1","2")[2];
        if(technology=="2"){data.colorNum=data.flowerNum}
        // 布种工艺处理
      // 图片src处理
      data.imgSrc=[];
      data.info=[];
      if(img){//img!==""&&img!=="undefind"
        var imgArr=img.split(",");
        for(var i=0;i<imgArr.length;i++){
          data.imgSrc[i]=imgUrl+imgArr[i];
          
        }
        data.imgInfo=imgArr;
      }
      // end图片src处理
        console.log(data);
}
// end表单历史值处理
// 表单显示处理
function handleShow(data){
     // 日期选择框
     var orderDate=new Date();
      $(".orderDate").datepicker({//下单日期
        format:"yyyy-mm-dd",
        autoclose:true,
        todayBtn:false,
        todayHighlight:true//高亮当前日期
      }).on("changeDate",function(ev){
          orderDate=ev.date;
          $(".deliveryDate").datepicker("setStartDate",orderDate);//设置交期最小时间
      });
      $(".deliveryDate").datepicker({//交期
        format:"yyyy-mm-dd",
        autoclose:true,
        todayBtn:false,
        startDate:orderDate,
        todayHighlight:true//高亮当前日期
      }).on("changeDate",function(ev){
          orderDate=ev.date;
          $(".orderDate").datepicker("setEndDate",orderDate);//设置交期最小时间
      });
    // 下单日期默认当日
    var date=new Date().Format("yyyy-MM-dd");
    $(".orderDate").val(date);
    // end日期选择框

      // 隐藏有值的输入框的提示语
        $(".form_content").find(".input_txt").each(function(){
          var val=$(this).val();
          if(val!==""){
            $(this).siblings(".input_pld").hide();
          }
        });
        $(".form_content").find(".input_sel").each(function(){
          var val=$(this).val();
          if(val!==""){
            $(this).siblings(".input_sel_pld").hide();
          }
        });
        // end隐藏有值的输入框的提示语
        // 七牛js加载
        var js='<script type="text/javascript" src="js/jsqiniu.js" id="qiniu"></script>';
        $("body").append(js);
        if(JSON.stringify(data) == "{}")return;//若是空对象，跳出函数

        //根据工艺部分属性名更改
        var tec=data.technology;//工艺
        sampleNumber=$("#sampleNumber");
        console.log(tec)
    if(tec=="1"){
      var text="色号",
          html=text+'<span class="required">*</span>';
        $("#groundColor").hide();
        $(".img_label").html("颜色图");
    }else  if(tec=="2"){
      var text="花号",
          html=text+'<span class="required">*</span>';
        $("#groundColor").show();
        $(".img_label").html("花型图");
    }
    sampleNumber.find(".input_label").html(html);
    sampleNumber.find(".input_pld").text("请输入"+text);
    //end 根据工艺部分属性名更改

    // 删除原有的图片
    $(".del_oldImg").on("click",function(){
      $(this).parent().remove();
    });

    // 单选按钮(要求属性)
    var light=data.lightRequired,//光源要求
      packing=data.packingRequired,//包装要求
      hand=data.handRequired;//手感要求
    $(".lightRequired").find("li").each(function(){
      var o=$(this)
      if(o.text()==light)o.addClass("active");
    });
    $(".packingRequired").find("li").each(function(){
      var o=$(this)
      if(o.text()==packing)o.addClass("active");
    });
    $(".handRequired").find("li").each(function(){
      var o=$(this)
      if(o.text()==hand)o.addClass("active");
    });

    //end 单选按钮(要求属性)

    // 其他工序
    var others={
        shaomao:data.shaomao,
        shimao:data.shimao,
        zhongdingjiangbian:data.zhongdingjiangbian,
        zhongdingqiebian:data.zhongdingqiebian,
        chengdingjiangbian:data.chengdingjiangbian,
        chengdingqiebian:data.chengdingqiebian,
        penwu:data.penwu,
        yusuo:data.yusuo,
        dapian:data.dapian,
        penmo:data.penmo
      }
    for(var k in others){
      if(others[k])$("."+k).addClass("active")
    }
    // end其他工序



}
// end表单显示处理


// 单选赋值
function radioVal(name,val1,val2){
  var arr=[];
   if(name==val1){
          arr[1]="checked";
          arr[2]="noCheck";
     }else if(name==val2){
        arr[1]="noCheck";
          arr[2]="checked";
     }
    return arr;
}
// end单选赋值

// 检验表单是否完善
function formCheck(callback){
  var input=$(".form_required"),
      check=true;
      console.log(input);
    input.each(function(){
      var val=$.trim($(this).val())
      if(val==""){
        check=false;
        $(this).addClass("err");
        $(this).next("span").addClass("err");
      }else{
        $(this).removeClass("err");
        $(this).next("span").removeClass("err");
      }
    });
    if(check){
      window.location.href="confirm.html"
      callback();
    }else{
      alert("请完善信息后再提交！");
    }
}
// end检验表单是否完善

