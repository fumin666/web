define(function(require, exports, module) {

    var incidentInfoView = require('./view/incidentInfoView');

    $(function() {
        incidentInfoView.render();
    });
});
