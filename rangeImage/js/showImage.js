/**
 * Created with JetBrains PhpStorm.
 * User: Administrator
 * Date: 12-10-17
 * Time: 下午5:28
 * To 展现查看大图
 */
var  showImages=function(opts){
	if (!(this instanceof showImages)) {
		return new showImages(opts);
	}
	this.smallNode=$(opts.smallNode)
	this.bigNode=$("[node-type='big_img']");
	this.n=0;  //初始化旋转角度
	this.countW=580;
	this.init()
}
showImages.prototype={

	init:function(){
		var _this=this;
		_this.smallNode.bind("click",function(){
			_this.setBigImg.call(_this,$(this));
		})
		_this.bigNode.live("click",function(){
			_this.SetSmallImg($(this));
		})
	},
	/**
	 * 获取大图的地址
	 * @param elem  事件点击的对象
	 * */
	setBigImg:function(elem){
		var _this=this;
		var _elem=elem;
		var _src=_elem.attr("data-img");
		var _img=new Image();
		var _w=_elem.width();
		var _h=_elem.height();
		var _nW=(_w-16)/2;
		var _nH=(_h-16)/2;
		var _bigImgSrc=_elem.attr("data-Bigimg");
		//console.log(_src)
		_img.src=_src;
		if (_img.complete) {
			_this.BigImgHtml(_src,_elem,_bigImgSrc);

			_elem.parent().css({
				"display":"none"
			})
			/*载入大图事件*/
			return;
		}
		/**
		 * 心情不好，下面的代码注释暂时想写了，有空再写，反正都是获取DOM然后控制隐藏显示的
		 * */
		_elem.next().css({
			"dispaly":"block",
			"width":_nW,
			"height":_nH,
			"display":"block"
		})
		_img.onload=function(){
			/*载入大图事件*/
			_this.BigImgHtml(_src,_elem,_bigImgSrc);
			_elem.parent().next().css("display","block");
			_elem.next().css({
				"display":"none"
			})
			_elem.parent().css({
				"display":"none"
			})
		}
	},
	/**
	 * 点击事件把大图的HTML加入进去
	 * @param src  大图的地址
	 * @param elem 点击对象
	 * */
	BigImgHtml:function(src,elem,bigSrc){
		var _this=this;
		var _html="";
		var _n=0
		_html+='<div class="big-img" action-type="bigimgDisp" >';
		_html+='<p class="bigImgtab"  >';
		_html+='<a href="javascript:;" class="retract">收起</a> | <a target="_blank" href="'+bigSrc+'" class="tobig">查看原图</a> | <a href="javascript:;" class="l">左转</a> | <a href="javascript:;" class="r">右转</a>';
		_html+='</p>';
		_html+='<div action-type="bigimgDiv" class="bigimgDiv">'
		_html+='<img  node-type="big_img"  src="'+src+'">';
		_html+='</div>';
		_html+='</div>';
		elem.parent().after(_html);
		var _dom=elem.parent().next();
		_dom.find(".retract").bind("click",function(){
			_this.SetSmallImg($(this));
		});
		_dom.find(".r").bind("click",function(){
			_n++;
			if(_n>3){
				_n=0;
			}
			_this.rotate.call(_this,_dom.find('[node-type="big_img"]'),_n);
		})
		_dom.find(".l").bind("click",function(){
			_n--;
			if(_n<0){
				_n=3;
			}
			_this.rotate.call(_this,_dom.find('[node-type="big_img"]'),_n);
		})

	},
	/**
	 * 大图变小
	 * @param elem 点击对象
	 * */
	SetSmallImg:function(elem){
		//console.log(elem.prev())
		elem.closest("[action-type='bigimgDisp']").prev().css({
			"display":"block"
		}).end().remove();
	},
	/**
	 * 旋转
	 * @param imgElem 图片对象
	 * @param n 旋转的度数 0 , 1 , 2, 3  分别代表0，90, 180,270
	 * */
	rotate:function(imgElem,n){
		var _imgElem = imgElem;
		var _this=this;
		/**
		 * IE  特别注意，赋值的时候属性不要带空格
		 * */
		if($.browser.msie) {
			var _parent=_imgElem.parent();
			_parent.css({
				"position":"relative"
			})
			_imgElem.css({
				"position":"absolute",
				"width":"auto",
				"height":"auto"
			})
			/**
			 * 判断图片的高度，如果大于580，说明旋转以后的宽度会超过边界
			 * */
			if(!n%2==0){
				if(_imgElem.height() > _this.countW){
					_imgElem.css({
						"height":_this.countW
					});
				}
			}
			var _f="progid:DXImageTransform.Microsoft.BasicImage(rotation="+ n +")";
			_imgElem.css({
				'filter':_f,
				"top":"0"
			});
			/**
			 * left的值要等到旋转后才能计算
			 * 因为旋转以后图片的大小才会变动
			 * 图片大小变动后，给父级赋值高宽
			 * */
			_imgElem.css({
				"left":(_this.countW-_imgElem.width())/2
			})
			_parent.css({
				"height":_imgElem.height()+"px",
				"width":_imgElem.width()+"px"
			})
		}else{
			/*W3C*/
			var _imgW=imgElem.width();
			var _imgH=imgElem.height();
			if(imgElem.next().is("canvas")){
				var _canvas=imgElem.next();
			}else{
				var _canvas=$("<canvas></canvas>");
				imgElem.after(_canvas).css("display","none");
			}
			if(!_canvas.data("events")){
				_canvas.bind("click",function(){
					_this.SetSmallImg($(this));
				});
			}
			var _context=_canvas[0].getContext('2d');
			var x,y;
			/**
			 * 为了图片是等比显示的，一定要注意canvas的宽度赋值是attr属性，不要使用CSS，否则悲剧
			 * */
			switch(n){
				case 0:
					_canvas.attr({
						"width":_imgW,
						"height":_imgH
					})
					x=0;
					y=0;
					break;
				case 1:
					_canvas.attr({
						"width":_imgH,
						"height":_imgW
					});
					x=0;
					y=-_imgH;
					break;
				case 2:
					_canvas.attr({
						"width":_imgW,
						"height":_imgH
					})
					x=-_imgW;
					y=-_imgH;
					break;
				case 3:
					_canvas.attr({
						"width":_imgH,
						"height":_imgW
					})
					x=-_imgW;
					y=0;
					break;
			}
			/**
			 * 判断属性宽度是否大于580，大于的话，设置canvas的css宽度
			 * */
			if(_canvas.attr("width")>_this.countW){
				_canvas.css({
					"width":_this.countW
					}
				);
			}else{
				_canvas.css("width","");
			}
			_context.clearRect(0, 0,_imgW, _imgH);
			_context.save();
			_context.rotate(n*90* Math.PI / 180);
			_context.drawImage(imgElem[0],x,y);
			_context.restore();
		}
	}
  }
$(function(){
	showImages({
		"smallNode":"[node-type='small_img']"
	})
})