var doc=document,
	dropbox=doc.getElementById("dropbox"),
	load=doc.getElementById("load"),
	previewbox=doc.getElementById("preview");
dropbox.addEventListener("dragenter", function(e){  
    dropbox.style.borderColor = 'gray';  
    dropbox.style.backgroundColor = '#cccccc';
	e.stopPropagation();  
    e.preventDefault();  
}, false);  
dropbox.addEventListener("dragleave", function(e){  
    dropbox.style.backgroundColor = '#ffffff';  
}, false);  
dropbox.addEventListener("dragover", function(e){  
    e.stopPropagation();  
    e.preventDefault();  
}, false);  
dropbox.addEventListener("drop", function(e){  
    e.stopPropagation();  
    e.preventDefault();
	var index=0;
	dropbox.style.backgroundColor = '#ffffff';
	handler=handleFiles(e.dataTransfer.files);
	filesList=handler.filesList;
	if(handler.bool){
		ajax(index,filesList);
	}
     
}, false);
function handleFiles(files){
	//判断是否为图片
	var imgbox=[],
		filesList=[], //临时保存的files对象
		bool=true; //设置布尔量
	for(var i=0,length=files.length;i<length;i++){
 		if (!files[i].type.match(/image*/)) {
 			alert("请上传图片");
 			bool=false;
 			return false;
 		}		
		filesList[i]=files[i];
	}
	var reader=[];//设置临时保存数据数组
	for(var k=0,length=filesList.length;k<length;k++){		
		reader.push(new FileReader());		
	}
	for(var i=0;i<reader.length;i++){
		reader[i].readAsDataURL(filesList[i]);
		reader[i].onload = function(e){
			var imgObj=doc.createElement("img"),
				html=doc.createElement("li");
			imgObj.src=this.result;
			html.appendChild(imgObj)
			previewbox.appendChild(html);
		}
	}	
	return {"filesList":filesList,"bool":bool};
}
function ajax(index,filesList){
		var xhr = new XMLHttpRequest(),
			per="",
			_html=doc.createElement("li"),
			tal=doc.createTextNode("上传进度：100%");
			txt=doc.createTextNode("上传进度：");
		xhr.open('post', 'flies2.php', true);
		xhr.upload.addEventListener('progress',function(e){
			per="完成："+Math.round((e.loaded * 100) / e.total)+"%";
			_html.appendChild(per);
			load.appendChild(_html);
			console.log(per);
		
		},false)
		xhr.upload.addEventListener('load',function(e){
			_html.appendChild(tal);
			load.appendChild(_html);
			index++;
			if(index>=filesList.length){
				return false;
			}
			return ajax(index,filesList);	
		},false)
		xhr.onreadystatechange=function(){			
			if(xhr.readyState==4){
				if(xhr.status==200){
					var restxt=xhr.responseText;//alert(restxt==403)
					if(restxt==403){
						load.innerHTML="";
						previewbox.innerHTML="";
						alert("此页面只是提供学习参考demo，请不要修改JS试图上传其他类型文件产生攻击，谢谢！")
					}
				}
			}
		}
		var fd=new FormData();
		fd.append("file"+index,filesList[index]);
		xhr.send(fd);
	} 