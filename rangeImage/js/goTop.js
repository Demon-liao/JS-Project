/*
 * Created by demon.
 * User: demon
 * Date: 12-3-31
 * Time: 上午11:03
 * To 回到顶部事件
 */
function goTop(options){
	this.contW=options.contW;
	this.elem=options.elem;
	this.h="";
	this.w="";
	this.TopElem=(options.TopElem!=undefined?options.TopElem:this.elem);
	this.distance=(options.distance!=undefined?options.distance:100);
}
goTop.prototype.init=function(){
	var _this=this;
	_this.getCount();
	this.toTop();
	if ($.browser.msie && $.browser.version < 7) {
		this.ieScoll()
	}
	$(window).resize(function () {
		_this.getCount();
		if ($.browser.msie && $.browser.version < 7) {
			var _scrtop = $(window).scrollTop();
			$(_this.elem).css({
				"top":_this.h+ _scrtop
			})
			//$(window).unbind("scroll",_this.ScollFn);
			//_this.ieScoll(json.h)
		}
	});

}
goTop.prototype.getCount=function(){
	var _w = $(window).width();
	var _cW = (_w - this.contW) / 2 + this.contW;
	var _h = $(window).height();
	var _cH = _h - this.distance;
	$(this.elem).css({
		"top":_cH,
		"left":_cW,
		"display":"block"});
	this.h=_cH

}
goTop.prototype.toTop=function(){
	$(this.TopElem).click(function () {
		$(window).scrollTop(0);
	})
}
goTop.prototype.ScollFn=function(obj){
	var _this=obj;
	var _scrtop = $(window).scrollTop();
		$(_this.elem).css({
			"top":_this.h+ _scrtop
	})
}
goTop.prototype.ieScoll=function(h){
	var _this=this;
	$(window).bind("scroll",function(){
		_this.ScollFn(_this)
	})

}
