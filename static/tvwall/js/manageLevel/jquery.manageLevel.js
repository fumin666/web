define(function(require, exports) {
	(function($){
		var defaultOption ={level:1,nameList:[1,2,3,4,5]};
	    $.fn.manageLevel = function(config){
	    	var config = $.extend({},defaultOption,config);
	    	var nameList = config.nameList;
	    	var li='';
	    	for(var i=0;i<nameList.length;i++){
	    		li+='<li>'+nameList[i]+'</li>'
	    	}
	        var tem = '<ul class="manageLevel">'+li+'</ul>';
	        var num = config.level;
	        var $this = $(this);
	        $this.append(tem);
	        $this.find('.manageLevel>li:nth-child('+num+')').addClass('manageLevel-current');
	        return $this;
	    };
	})(jQuery);
});