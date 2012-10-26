/*
 *autor:demon
 *time:2012-2-6
 *微薄@功能
 */
function demonAt(opts) {
	this.elem=opts.elem; //文本框
	this.at= {};	//临时保存文本框内容截取属性
	this.opt= {};
	this.searched=""; //用于判断用户输入字符是否和前面一样，如果一样跳过ajax
	this.url=opts.url;
	this.index=1;
	this.isAjax=true;
}

demonAt.prototype= {
	getCursor: function(elem) {
		var _this=this;
		var rangeData = {
			start: 0,
			end: 0,
			text: ""
		};
		if(typeof(this.elem.selectionStart)=="number") {//W3C
			rangeData.start=this.elem.selectionStart;//光标起始位置
			rangeData.end=this.elem.selectionEnd;//光标末尾位置
			rangeData.text=this.elem.value.substring(0,this.elem.selectionStart);//获取文本框value
		} else if (document.selection) {//IE
			var sRange=document.selection.createRange();
			var oRange=document.body.createTextRange();
			oRange.moveToElementText(this.elem);
			rangeData.text=sRange.text;
			rangeData.bookmark = sRange.getBookmark();
			for(i=0;oRange.compareEndPoints("StartToStart",sRange)< 0 && sRange.moveStart("character", -1) !== 0; i ++) {
				if (this.elem.value.charAt(i) == '\r') {
					i ++;//IE的特殊处理，遇到enter键需要加1
				}
			}
			rangeData.start=i;
			rangeData.end = rangeData.text.length + rangeData.start;
			rangeData.text=this.elem.value.substring(0,i);
		}
		//alert(rangeData.text)
		return rangeData;
	},
	setCursor: function(elem,start,end) {//设置光标
		if(this.elem.setSelectionRange) {//W3C
			this.elem.setSelectionRange(start,end);
		} else if(this.elem.createRange) {//IE
			var range=this.elem.createRange();
			if(this.elem.value.length==rangeData.start) {
				range.collapse(false);
				range.select();
			} else {
				range.moveToBookmark(rangeData.bookmark);
				range.select();
			}
		}
	},
	add: function(elem,txtData,nStart, nLen) {//插入文本   参数  操作的元素，数据，起始坐标位置，用户输入字符长度
		this.elem.focus();
		var _range;
		if(this.elem.setSelectionRange) {//W3C
			_tValue=this.elem.value;//获取文本框内容
			var _start = nStart - nLen,//设置光标起点  光标的位置-离@的文本长度
				_end = _start + txtData.length,//设置光标末尾，start+数据文字长度
				_value=_tValue.substring(0,_start)+txtData+" "+_tValue.substring(nStart, this.elem.value.length);
			this.elem.value=_value;
			this.setCursor(this.elem,_end+1,_end+1);
		} else if(this.elem.createTextRange) {
			_range=document.selection.createRange();
			_range.moveStart("character", -nLen);//移动光标
			_range.text = txtData+" ";
		}
	},
	getAt: function() {
		var _rangeData=this.getCursor();
		var k=_value=_rangeData.text.replace(/\r/g,"");//去掉换行符
		var _reg=/@[^@\s]{1,20}$/g;//正则，获取value值后末尾含有@的并且在20字符内
		var _string="";
		if(_value.indexOf("@")>=0&&_value.match(_reg)) {
			var _postion=_rangeData.start;
			var _oValue=_value.match(_reg)[0];//找到value中最后匹配的数据
			var vReg=new RegExp("^"+_oValue+".*$","m");//跟数据匹配的正则   暂时保留
			_value=_value.slice(0, _postion); //重写_value 字符串截取  从0截取到光标位置
			if(/^@[a-zA-Z0-9\u4e00-\u9fa5_]+$/.test(_oValue)&& !/\s/.test(_oValue)) {
				this.at['m'] = _oValue = _oValue.slice(1);//用户输入的字符  如 @颓废小魔，即"颓废小魔"
				this.at['l'] = _value.slice(0, -_oValue.length - 1); //@前面的文字
				this.at['r'] = k.slice(_postion - _oValue.length, k.length);//@后面的文字
				this.at['pos']=_postion;//光标位置
				this.at['len']=_oValue.length;//光标位置至@的长度，如 @颓废小魔，即"颓废小魔"的长度
				if(this.isAjax){
					this.isAjax=false;
					this.showTip(this.url)
				}
				
			} else {//alert(1)
				this.hiddenTip()
			}
		} else {
			this.hiddenTip()
		}
			
	},
	format: function(s) {//正则替换一些html代码
		var q= {
			"<": "&lt;",
			">": "&gt;",
			'"': "&quot;",
			"\\": "&#92;",
			"&": "&amp;",
			"'": "&#039;",
			"\r": "",
			"\n": "<br>",
			" ":"&nbsp;"
		};
		var o = /<|>|\'|\"|&|\\|\r\n|\n| /gi;
		return s.replace(o, function(r) {
			return q[r]
		});
	},
	init: function() {//初始化
		var _body=$("body");
		var _div=$("<div id='tWarp'></div>"),
			_tip=$("<div id='tipAt'></div>");
		_body.append(_div);
		_body.append(_tip);
		var _left=$(this.elem).offset().left+"px",
			_top=$(this.elem).offset().top+"px",
			_width=$(this.elem).outerWidth()+"px",
			_height=$(this.elem).outerHeight()+"px",
			_lineHeight=$(this.elem).css("line-height"),
			_style="position:absolute;overflow:hidden;z-index:-9999;line-height:"+_lineHeight+";width:"+_width+";height:"+_height+";left:"+_left+";top:"+_top;
		_div.attr("style",_style);
		this.inset();

	},
	showTip: function(url) {//显示tip，获取ajax数据
		var _this=this;
		//$(this.elem).unbind("keyup");
		if(this.searched==this.at['m']) {//如果用户输入字符跟前一次一样，跳过ajax
			this.buidTip()
			_this.isAjax=true;
		} else {
			$.get(url+this.at['m'], function(data) {
				if(data) {
					$("#tipAt").html("<ul><li>想用@提到谁？</li>"+data+"</ul>")
					_this.searched=_this.at['m'];
					_this.buidTip();
					_this.isAjax=true;
				}
			})
		}
	},
	buidTip: function() {//创建tip，设置tip的位置
		var _this=this;
		$("#tWarp").empty();
		var _string="<span>"+this.format(this.at['l'])+"</span>"+"<cite>@</cite>"+"<span>"+this.format(this.at['r'])+"</span>";
		$("#tWarp").html(_string);
		var _left=$("#tWarp cite").offset().left+"px",
		_top=$("#tWarp cite").offset().top+parseInt($("#tWarp").css("line-height"))+"px";
		if(parseInt(_top)>parseInt($("#tWarp").offset().top+$("#tWarp").height())) {
			_top=$("#tWarp").offset().top+$("#tWarp").height()+"px";
		}
		$("#tipAt").css({
			"left":_left,
			"top":_top,
			"display":"block"
		});
		$("#tipAt li").eq(1).addClass("on").siblings().removeClass("on");
		_this.hover();
		//取消keyup绑定，绑定keydown，键盘操作选择，避免与文本框的事件冲突
		$(_this.elem).unbind('keyup').bind('keydown', function(e) {
			//_this.isAjax=false;
			return _this.keyMove(e);
		});
	},
	inset: function() {//给li绑定事件，
		var _this=this;
		$("#tipAt").delegate("li","click", function() {//事件委托
			if($(this).index()==0) {
				_this.elem.focus();
				return false;
			} else {
				var txtData=$(this).text();
				_this.add(_this.elem,txtData,_this.at['pos'],_this.at['len'])
				_this.hiddenTip()
			}
		})
	},
	hiddenTip: function() {
		var _this=this;
		$("#tipAt").css("display","none");
		$("#tipAt li").unbind("click,mouseover");
	},
	keyMove: function(e) {//键盘操作
		var _this=this;
		var _key=e.keyCode;
		var _len=$("#tipAt li").length;
		switch(_key) {
			case 40:
				//下
				_this.index++;
				if(_this.index>_len-1) {
					_this.index=1;
				}
				_this.keyMoveTo(_this.index);
				//return false一定要加上，不然JS会继续进行调用keyHandler，从而绑定了keyup事件影响到键盘的keydown事件
				return false; 
				break;
			case 38:
				//上
				_this.index--;
				if(_this.index<1) {
					_this.index=_len-1;
				}
				_this.keyMoveTo(_this.index);
				return false;
				break;
			case 13:
				//enter键
				var txtData=$(".on").text();
				_this.add(_this.elem,txtData,_this.at['pos'],_this.at['len'])
				_this.keyHandler()
				return false;
				break;
			default:

		};
		_this.keyHandler();
	},
	keyHandler: function() {
		var _this=this;
		_this.index=1;
		//enter键盘操作后重新绑定keyup
		$(_this.elem).unbind("keydown").bind("keyup", function() {
				
				_this.getAt();
		})
	},
	keyMoveTo: function(index) {
		$("#tipAt li").removeClass("on").eq(index).addClass("on");
	},
	hover: function() {
		//hover事件
		var _this=this;
		$("#tipAt li:not(:first)").hover( function() {
			_this.index=$(this).index();
			$(this).addClass("hover").siblings().removeClass("on hover")
		}, function() {
			$(this).removeClass("hover");
		})
	}
}
$( function() {
	opts= {
		elem:document.getElementById("tx"),
		url:"data.php?k="
	}
	var demon=new demonAt(opts);
	demon.init();
	$(opts.elem).bind("keyup", function() {
		//console.log(1)
		demon.getAt();
		//demon.aa();
	})
})