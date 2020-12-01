define(function(require, exports, module) {
    var assetsView = require("./view/assetsView");

    function resizePic() {
        var _height = $("#assetBig").height();
        var _width = $("#assetBig").width();
        var _size = Math.min(_height, _width) - 20;
        $("#assetBigPic").width(_size).height(_size).css("margin", "20px");
    };
    $(function() {
        // resizePic();
        assetsView.render();
    });
});
