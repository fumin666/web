define(function(require, exports, module) {
	(function($) {
		var defaultOption = {num: 4, speed: 3, or: false};
		$.fn.extend({
		  switchover: function (config) {
			  var config = $.extend({}, defaultOption, config);
			  // 初始化组件大小
			  var liNum = config.num;
			  var wraper = $(this);

			  function init() {
			  		var parentWidth = wraper.parent('.imgParent').outerWidth(true);
			  		wraper.parent('.imgParent').css('padding', 0);
				  	var wraperWidth = (parentWidth - 11);
				  	var viewArea = (parentWidth - 41);
				  	var liWidth = (viewArea - liNum * 15) / liNum;
            wraper.css('width', wraperWidth);
            wraper.find('.img-list').css('width', viewArea);
            wraper.find('.img-list .i_item').css('width', liWidth);
			  }
		  	  init();
		  	  // resize组件大小
		  	  function switchResize() {
		  	  	$(window).resize(function() {
		  	  		init();
		  	  	});
		  	  	$('.left_toggler_btn').click(function() {
					init();
				});
		  	  }
 		  	  switchResize();
 		  	  // 切换方法
        var prev = wraper.find('.prev');
			  var next = wraper.find('.next');
			  var img = wraper.find('.img-list').find('.i_list');
			  var w = img.find('.i_item').outerWidth(true);
			  var s = config.speed;
			  var num = img.find('.i_item').length;
			  var index = 0;
			  var lastIndex = num - liNum;
        prev.addClass('first');
			  next.removeClass('last').off().click(function() {
            prev.removeClass('first');
			  		if (index < lastIndex) {
			  			img.animate({'margin-left': -w}, function()			                  {
			                   img.find('.i_item').eq(0).appendTo(img);
			                   img.css({'margin-left': 0});
			                   });
			  			index += 1;
              if (index == lastIndex) {
                next.addClass('last');
              }
			  		} else {
              // alert("已经到第一张了");
			  		}
        });
			  prev.off().click(function() {
            next.removeClass('last');
			  		if (index > 0) {
			  			img.find('.i_item:last').prependTo(img);
				        img.css({'margin-left': -w});
				        img.stop(true).animate({'margin-left': 0});
				        index -= 1;
              if (index == 0) {
                prev.addClass('first');
              }
			  		} else {
			  			// alert("已经到第一张了");
			  		}
			   });

			  if (config.or === true) {
				   ad = setInterval(function() { next.click(); }, s * 1000);
				   wraper.hover(function() { clearInterval(ad); }, function() { ad = setInterval(function() { next.click(); }, s * 1000); });
				}
		    }
		});
	})(jQuery);
});
