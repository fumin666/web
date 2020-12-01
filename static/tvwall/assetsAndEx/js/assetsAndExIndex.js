define(function(require, exports, module) {
  (function($){
    $.fn.extend({
      hoverClass: function(className, speed){
        var _className = className || "hover";
        return this.each(function(){
          var $this = $(this), mouseOutTimer;
          $this.hover(function(){
            if (mouseOutTimer) clearTimeout(mouseOutTimer);
            $this.addClass(_className);
          },function(){
            mouseOutTimer = setTimeout(function(){$this.removeClass(_className);}, speed||10);
          });
        });
      }
    });
  })(jQuery);
  var assetsView = require('./view/assetsView');

  $(function() {
    assetsView.render();
  });
});
