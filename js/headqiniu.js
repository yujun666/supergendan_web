document.write("<script language='javascript' src='js/qiniu/qiniu.js'></script>");
document.write("<script language='javascript' src='js/qiniu/qiniu-token.min.js'></script>");
document.write("<script language='javascript' src='js/plupload/plupload.full.min.js'></script>");
document.write("<script language='javascript' src='js/plugins/jquery.min.js'></script>");

// var uploadToken = null;
$(function(){
  var img="";
  var domain = "http://malltrackorder.wudaodz.com/";
  var uploader = Qiniu.uploader({
    runtimes: 'html5,flash,html4',
    browse_button: 'changeHead',
    container: 'imgContainer', 
    max_file_size: '100mb',
    flash_swf_url: 'js/plupload/Moxie.swf',
    dragdrop: true,
    // chunk_size: '4mb',
    accept:'text/plain',
    resize: {
        width:415,
        crop: false,
        quality: 75,
        preserve_headers: false
      },

    filters : {
      max_file_size : '100mb',
      prevent_duplicates: true,//不允许选取重复文件,(默认为false,允许重选)
        //Specify what files to browse for
        mime_types: [
        {title : "图片文件", extensions : "jpg,gif,png,jpeg,bmp"}]
      },
      // uptoken:uploadToken,
      get_new_uptoken: true,
      uptoken_url:"../superman/qiniuImage/tofo",
      domain: domain,
      unique_names: true,
      auto_start: true,
      init: {
                'FilesAdded': function(up, files) {
                  var imgNum=$("#previewImg").find("li").length;
                  console.log(imgNum)
                  if(imgNum>2){
                        alert("最多只能上传三张照片");
                        uploader.removeFile(files[0].id);
                        return;
                  }
                  //end限制上传张数
                  plupload.each(files, function(file) {
                    var type=file.name.split(".")[1];
                    previewImage(file, function(src) {
                      var file_li=["<li >",
                                    " <span class='del_img' data-id='"+file.id+"'></span> ",
                                    "<img class='plup_img' src='"+src+"' info='"+file.id+'.'+type+"' />",
                                  "</li>"
                                ].join("");
                        $("#previewImg").append(file_li);
                        //删除已添加的图片
                        $(".del_img").on("click", function() {
                            var id = $(this).attr("data-id");
                            uploader.removeFile(id);
                            $(this).parent().remove();
                        });
                        //end删除已添加的图片
                    });
                  });
                },
                'BeforeUpload': function(up, file) {
                  // var progress = new FileProgress(file, 'fsUploadProgress');
                  // var chunk_size = plupload.parseSize(this.getOption('chunk_size'));
                  // if (up.runtime === 'html5' && chunk_size) {
                  //   progress.setChunkProgess(chunk_size);
                  // }
                  

                },
                'UploadProgress': function(up, file) {
                 //  var progress = new FileProgress(file, 'fsUploadProgress');
                 //  var chunk_size = plupload.parseSize(this.getOption('chunk_size'));
                 //  progress.setProgress(file.percent + "%", file.speed, chunk_size);
                 // $("[data-id="+file.id+"]").removeClass("del_file").html(file.percent + "%");
                 
                 
               },
               'UploadComplete': function() {
                // $('#success').show();
                img=img.substring(0,img.length-1);
                // alert(img);
                // postStepData(img);

                 //调用数据上传函数
 
              },
              'FileUploaded': function(up, file, info) {
                // var progress = new FileProgress(file, 'fsUploadProgress');
                //    console.log(progress);

                      // 返回了{"hash":"Ftuh6-jyMWGf7eJvWerrTs2W7TBs","key":"o_1a6k8fi0r1vddm215c932s185b9.jpg"}
                      eval("info = "+info);
                      // var url = domain+"/"+info.key;
                      // $(".file-item img").attr("src",url).attr("file",info.key);
                      // $("[data-id="+file.id+"]").html("OK");
                       img += info.key+",";
                       console.log(info);

                       // 上传图片名
                       postHeadImg(info.key);
                       

                      

                    },
              'Error': function(up, err, errTip) {
                   // var progress = new FileProgress(err.file, 'fsUploadProgress');
                   // progress.setError();
                   // progress.setStatus(errTip);
                   // console.log(err);
               },
              // 'Key': function(up, file) {
              //   var type=file.type.split("/")[1];
              //   var randomStr=randomWord(false, 32);
              //   var key = randomStr+'.'+type;
              //   console.log(key);
              //   return key;
              // }
        }
  });

});


////////////////////////////////////////
function postHeadImg(key){
  var params={
        "baseToken": baseToken,
        "name": userName,
        "picture": key,
        "id": userId,
        "companyId": companyId,
      }
  pullData("saveStaff",params,function(res){
          if(res.errorCode=="000"){
            var headSrc=userImgUrl+key+"?imageView2/1/w/96/h/92";
            Cookies.set("userHead",key);
            $(".user_head>img").attr("src",headSrc);
          }else{
              exceptionHandling(res.errorCode)
          }
  },function(err){
          errorHandling();
  });
}
