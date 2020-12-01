/**
 * @class 设备实时信息
 */
define(function(require, exports, module){
    var businessEffectViewGraph = require('./businessView.graph');
    var _errorImage = new mxImage('../../../../mxgraph/images/errorstatus.gif', '16', '16');
    var _warnImage = new mxImage('../../../../mxgraph/images/warningstatus.gif', '16', '16');
    var rootUrl = "/businessservice/"

    //载入宕机和告警数据
    function loadInfo() {
        _loadEquipmentInfo();
    }

    //发起宕机和告警数据请求
    function _loadEquipmentInfo() {
        var img =''
        suninfo.post(rootUrl+'businessEffect').done(function(data){
            businessEffectViewGraph.getGraph().clearCellOverlays();
            if (data.effectList && data.effectList.length > 0) {
                _addCellOverlay(data.effectList, img, '业务服务状态异常');
            }
        });
    }

    //添加覆盖物
    function _createOverlay(image, tooltip) {
        var overlay = new mxCellOverlay(image, tooltip);
        overlay.addListener(mxEvent.CLICK, function(sender, evt) {
            suninfo.alert(tooltip);
        });

        return overlay;
    }

    //设置机房、机柜、设备宕机或告警状态
    function _addCellOverlay(ids, img, msg) {
        var graph = businessEffectViewGraph.getGraph();
        for (var i = 0; i < ids.length; i++) {
            var model = graph.getModel();
            var cells = model.cells;
            for (var j in cells) {
                if (ids[i].status == 1  && ids[i].uuid==cells[j].businessUuid) {
                    var cell = cells[j];
                    image=_errorImage;
                    if (typeof(cell) != 'undefined') {
                        graph.addCellOverlay(cell, _createOverlay(image, msg));
                        var edges = [];
                        for (var k = 0; k < cell.edges.length; k++) {
                            edges.push(cell.edges[k])
                        }
                        ;
                        graph.setCellStyles(mxConstants.STYLE_STROKECOLOR, 'red', edges);
                    }
                }
                if (ids[i].status == 2  && ids[i].uuid==cells[j].businessUuid) {
                    var cell = cells[j];
                    image=_warnImage;
                    if (typeof(cell) != 'undefined') {
                        graph.addCellOverlay(cell, _createOverlay(image, msg));
                        var edges = [];
                        for (var k = 0; k < cell.edges.length; k++) {
                            edges.push(cell.edges[k])
                        }
                        ;
                        graph.setCellStyles(mxConstants.STYLE_STROKECOLOR, '#FFAC1B', edges);
                    }
                }

            }
            graph.refresh(cell);
        }
    }

    var cabinetEquipmentInfo = {
        loadInfo : loadInfo
    };

    module.exports = cabinetEquipmentInfo;
});
