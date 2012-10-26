/*
 * 省市县或者三个分类的三级联动
 * 此插件只支持JQ1.6版本，因为用了porp方法
 * author:By demon
 * time:2011.05.19
 */
function select(elem,source) {
	this.first=$(elem.first);// 省级或者第一分类的select
	this.second=$(elem.second);// 市级或者第二分类的select
	this.third=$(elem.third);// 区县级别或者第三分类的select
	this.source_f=source.firstArr;// 一分类的数组
	this.source_s=source.secondArr;//二分类的数组
	this.source_t=source.thirdArr;//三分类的数组
	this.option="<option>"+"请选择..."+"</option>";//默认
}
select.prototype.init= function() {
	this.select_load();
	this.change();
}
select.prototype.select_load= function() {
	/*
	 * 获取分类一级的数组，进行遍历，将其输入到select对象中
	 */
	var source_length=this.source_f.length;
	var html="";
	for(var i=0;i<source_length;i++) {
		html+="<option"+" "+"value="+this.source_f[i]+">"+this.source_f[i]+"</option>";
	}
	this.first.html(this.option+html);
}
select.prototype.change= function() {
	
	/*
	 * change的事件绑定，分类一级和分类二级的绑定
	 */
	_this=this;
	this.first.bind("change", function() {
		_this.loop($(this),_this.second,_this.source_s);
	});
	this.second.bind("change", function() {
		_this.loop($(this),_this.third,_this.source_t);
	})
}
select.prototype.loop= function(change_obj,show_obj,_source) {
	/*
	 * loop函数，设置三个参数，
	 * change_obj为change事件的绑定对象，
	 * show_obj为下一级分类的select显示对象，
	 * _source为数组数据的来源
	 */
	show_obj.html(this.option);
	this.third.html(this.option);
	var _value=change_obj.prop("value");
	var _length=_source.length;
	var _html="";
	for (var i=0; i < _length; i++) {
		if(_value==_source[i][0]) {
			for(var j=1;j<_source[i].length;j++) {
				_html+="<option"+" "+"value="+_source[i][j]+">"+_source[i][j]+"</option>";
			}
		}
	}
	show_obj.html(this.option+_html);
}