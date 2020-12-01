/**
 * 电视墙拓扑图实时信息
 */
define(function(require, exports, module) {
    var suninfo = require('../../../js/ajax.interface');
    var GraphExtension = require('./tvwallTopo.graphExtension');
    var _ = require('../../../js/underscore');

    /**
     * 载入实时信息Timer（定时器）
     * @private
     */
    var _loadInfoTimer = null;

    /**
     * 是否载入线上流量信息
     * @private
     */
    var _flowFlag = true;

    /**
     * 是否载入设备在线信息
     * @private
     */
    var _onlineFlag = true;

    /**
     * 是否设备事件信息
     * @private
     */
    var _incidentFlag = false;

    /**
     * 是否载入子拓扑在线状态
     * @private
     */
    var _subTopoFlag = false;

    /**
     * 获取实时信息周期
     * @constant
     */
    var _period = 180000;

    /**
     * 所有宕机的节点（红色过滤器）
     * @type {Array}
     * @private
     */
    var _errorVertexAry = [];

    /**
     * 所有有事件节点（黄色过滤器）
     * @type {Array}
     * @private
     */
    var _warningVertexAry = [];

    /**
     * 断掉的线
     * @type {Array}
     * @private
     */
    var _errorEdgeAry = [];

    /**
     * 异常的线
     * @type {Array}
     * @private
     */
    var _warningEdgeAry = [];

    /**
     * 子拓扑
     * @type {Array}
     * @private
     */
    var _subTopoAry = [];

    /**
     * 节点和设备周期闪动interval
     * @type {null}
     * @private
     */
    var _interval = null;

    /**
     * 事件个数
     * @type {{}}
     */
    var _incidentCount = {};

    /**
     * 流量信息
     * @type {Array}
     * @private
     */
    var _flowData = [];

    var _graphIds = '';


    /**
     * 获取拓扑实时信息
     * @private
     */
    function _updateIconSet() {
        if (!_flowFlag && !_onlineFlag && !_incidentFlag && !_subTopoFlag && _loadInfoTimer !== null) {
            clearRealTimeout();
            _loadInfoTimer = null;
        } else {
            if (_loadInfoTimer == null) {
                _setRealTimeout();
            }else{
                clearRealTimeout();
                _setRealTimeout();
            }
        }
    }

    /**
     * 获取拓扑实时信息（外部调用接口）
     * @public
     */
    function updateIconSet(allGraphs) {
        _graphIds = allGraphs.join(',');
        if(topology_period){
            _period = topology_period*1000;
        }
        _setAllState();
        _updateIconSet();
    }

    /**
     * 根据状态标志位onlineFlag、flowFlag、incidentFlag、subTopoFlag请求实时数据
     * @public
     */
    function _loadEvents() {
        var ary = [];
        ary.push(_flowFlag ? '1' : '0');
        ary.push(_onlineFlag ? '1' : '0');
        ary.push(_incidentFlag ? '1' : '0');
        ary.push(_subTopoFlag ? '1' : '0');
        (_graphIds.length == 0) && (_graphIds = ',');
        suninfo.post('../viewmanager/topoview/getTopoviewShowByTopoviewInfoUuid/' + _graphIds + '/' + topology_config.showapp + '/'+ary.join(','),{contentType:'application/json',global:false}).done(function(data){
            _resetAllData();
            _realtimeInfoCallback(data);
        }).always(function(){
            //再次发起请求
            _loadInfoTimer = setTimeout(_loadEvents, _period);
        });
    }

    /**
     * 清理所有数据
     * @private
     */
    function _resetAllData(){
        _errorVertexAry = [];
        _warningVertexAry = [];
        _errorEdgeAry = [];
        _warningEdgeAry = [];
        _subTopoAry = [];
        _incidentCount = {};
        _flowData = [];
    }

    /**
     * 异步请求回调处理方法
     * 1为正常，2为异常，3为宕机
     * 1.循环遍历所有信息，将需要变色的线和设备进行筛选
     * 2.将宕机的集合和异常的集合分别交给处理方法
     * 3.将告警事件个数集合传给告警处理方法
     * 4.将流量信息分给流量处理
     * @private
     */
    function _realtimeInfoCallback(data) {
        var graph = null;
        var model = null;
        var cell = null;
        var cellData = {};
        for(var i=0,l=data.length; i<l;i++){
            cellData = data[i];
            graph = graphConfig.getGraph(cellData.topoviewInfoUuid);
            if(graph != null) {
                model = graph.getModel();
                cell = model.getCell(cellData.uuid);
                if (typeof cell != 'undefined' && cell != null) {
                    //节点
                    if (cell.isVertex()) {
                        //1.需要变色的节点筛选
                        if (!cell.isSubTopoCell()) {
                            //非子拓扑
                            if (cellData.status == '0') {
                                _errorVertexAry.push(cellData.uuid);
                            }
                            if (cellData.status == '2') {
                                _warningVertexAry.push(cellData.uuid);
                            }
                        } else {
                            //子拓扑
                            if (cellData.childStatus == '0') {
                                _errorVertexAry.push(cellData.uuid);
                            }
                            if (cellData.childStatus == '2') {
                                _warningVertexAry.push(cellData.uuid);
                            }
                            _subTopoAry.push(cellData.uuid);
                        }
                        if (cellData.unrecoveryIncidentNum != '0') {
                            _incidentCount[cellData.uuid] = cellData.unrecoveryIncidentNum;
                        }
                    }
                    //连线
                    if (cell.isEdge()) {
                        //1.需要变色的连线筛选
                        if (cellData.status == '0') {
                            _errorEdgeAry.push(cellData.uuid);
                        }
                        if (cellData.status == '2') {
                            _warningEdgeAry.push(cellData.uuid);
                        }
                        _flowData.push({graphId:cellData.topoviewInfoUuid,edge: cell, inSpeed: cellData.inSpeed, outSpeed: cellData.outSpeed});
                    }
                }
            }
        }
        _subTopoAry = _.uniq(_subTopoAry);
        _errorVertexAry = _.uniq(_errorVertexAry);
        _warningVertexAry = _.uniq(_warningVertexAry);
        _errorEdgeAry = _.uniq(_errorEdgeAry);
        _warningEdgeAry = _.uniq(_warningEdgeAry);
        _blinkAction();
        _updateEdgeFlow();
        GraphExtension.setSecondLabelData(_incidentCount);
        graphConfig.allGraphRefresh();
    }

    /**
     * 更新线上流量
     * @private
     */
    function _updateEdgeFlow(){
        var edge = null;
        for(var i=0,l=_flowData.length; i<l;i++){
            data = _flowData[i];
            graph = graphConfig.getGraph(data.graphId);
            edge = data.edge;
            if (edge.getChildCount() > 0) {
                var cells = graph.getChildCells(edge);
                graph.removeCells(cells);
            }
            if (typeof data.inSpeed != 'undefined' && data.inSpeed != 'null' && data.inSpeed!=null) {
                var sourceLabel = _getFlowLable(data.inSpeed, new mxGeometry(-0.5, 0, 0, 0));
                sourceLabel.souceItcompUuid = data.souceItcompUuid;
                sourceLabel.souceMiUuid = data.souceMiUuid;
                edge.insert(sourceLabel);
            }
            if (typeof data.outSpeed != 'undefined' && data.outSpeed != 'null'&& data.outSpeed!=null) {
                var targetLabel = _getFlowLable(data.outSpeed, new mxGeometry(0.5, 0, 0, 0));
                targetLabel.targetItcompUuid = data.targetItcompUuid;
                targetLabel.targetMiUuid = data.targetMiUuid;
                edge.insert(targetLabel);
            }
        }
    }

    /**
     * 获取线上流量标签
     * @param  {String} flow 流量
     * @param  {mxGeometry} geo  位置
     * @return {mxCell}	流量标签
     */
    function _getFlowLable(flow, geo) {
        var flowLabel = new mxCell(flow + 'Mbps', geo, 'flowrate');
        flowLabel.geometry.relative = true;
        flowLabel.setConnectable(false);
        flowLabel.vertex = true;
        flowLabel.displayflow = "false";
        return flowLabel;
    }

    /**
     * 根据传入Vertex数组返回id选择器字符串
     * @param ary
     * @private
     */
    function _getIdStrForVertex(ary){
        var aryStr = _.map(ary, function(vertex){ return '#'+vertex + '_icon'; }).join(',');
        if(ary.length == 1){
            aryStr = aryStr + ',#_XXXXXXXXXXXXXXXXXXXXXX_icons';
        }
        return aryStr;
    }

    /**
     * 根据传入Edge数组返回id选择器字符串
     * @param ary
     * @private
     */
    function _getIdStrForEdge(ary){
        var aryStr = _.map(ary, function(edge){ return '#'+edge; }).join(',');
        if(ary.length == 1){
            aryStr = aryStr + ',#_XXXXXXXXXXXXXXXXXXXXXX_edges';
        }
        return aryStr;
    }

    /**
     * 连线和节点闪动
     * @private
     */
    function _blinkAction(){
        var flag = true;
        if(_interval != null){
            clearInterval(_interval);
        }
        _interval = setInterval(function() {
            if (flag) {
                if(_errorVertexAry.length > 0){
                    $(_getIdStrForVertex(_errorVertexAry)).find('image').css('filter', 'url(#error_filter)');
                }
                if(_warningVertexAry.length > 0){
                    $(_getIdStrForVertex(_warningVertexAry)).find('image').css('filter', 'url(#warning_filter)');
                }
                if(_errorEdgeAry.length > 0){
                    $(_getIdStrForEdge(_errorEdgeAry)).find('path').css('filter', 'url(#edge_error_filter)');
                }
                if(_warningEdgeAry.length > 0){
                    $(_getIdStrForEdge(_warningEdgeAry)).find('path').css('filter', 'url(#edge_warning_filter)');
                }
                flag = false;
            } else {
                $('svg image').css('filter', '');
                $('svg path').css('filter', '');
                flag = true;
            }
        }, 1000);
    }

    /**
     * 停止闪动
     */
    function _stopBlinkAction(){
        $('svg image').css('filter', '');
        $('svg path').css('filter', '');
        if(_interval != null){
            clearInterval(_interval);
        }
    }

    /**
     * 移出所有的实时信息
     */
    function removeRealTimeInfo(){
        _stopBlinkAction();
        clearRealTimeout();
        GraphExtension.setSecondVisible(false);
    }

    /**
     * 移除所有子拓扑在线状态
     * @private
     */
    function _clearAllSubTopoCell() {
        //从闪动的数据中删除子拓扑数据
        _errorVertexAry = _.filter(_errorVertexAry, function(cellId){ return _.indexOf(_subTopoAry, cellId) == -1; });
        _warningVertexAry = _.filter(_warningVertexAry, function(cellId){ return _.indexOf(_subTopoAry, cellId) == -1;});
    }

    /**
     * 移除所有在线上添加的流量节点
     * @private
     */
    function _removeAllFlowCell() {
        var graph = TopologyGraph.getGraph();
        var model = graph.getModel();
        model.beginUpdate();
        try {
            $.each(model.cells, function(key, edge) {
                if (edge.isEdge()) {
                    if (edge.getChildCount() > 0) {
                        graph.removeCells(graph.getChildCells(edge));
                    }
                }
            });
        } finally {
            model.endUpdate();
            graph = null;
            model = null;
            cells = null;
        }
    }

    /**
     * 取消实时信息请求
     * 从查看模式切换到编辑模式时调用
     * @public
     */
    function clearRealTimeout(){
        clearTimeout(_loadInfoTimer);
        _loadInfoTimer = null;
    }

    /**
     * 重置实时信息请求
     * 从查看模式切换到编辑模式时调用
     * @public
     */
    function resetRealTimeout(){
        _setRealTimeout();
        GraphExtension.setSecondVisible(_incidentFlag);
    }

    function _setRealTimeout(){
        _loadEvents();
    }

    /**
     * 设置新周期
     * 在拓扑图全局配置中调用
     * @public
     */
    function setNewPeriod(newPeriod){
        if(newPeriod){
            _period = newPeriod * 1000;
        }
        clearRealTimeout();
        _setRealTimeout();
    }

    /**
     * 设置全部状态
     * @public
     */
    function _setAllState(){
        var config = topology_realtime;
        var ary = [];
        for(var i=0;i<config.length; i++){
            ary[i] = (config[i] == 1) ? true : false;
        }
        _flowFlag = ary[0];
        _onlineFlag = ary[1];
        _incidentFlag = ary[2];
        _subTopoFlag = ary[3];
        GraphExtension.setSecondVisible(_incidentFlag);
    }

    module.exports = {
        setNewPeriod : setNewPeriod,
        updateState : updateIconSet,
        clearRealTimeout:clearRealTimeout,
        resetRealTimeout:resetRealTimeout,
        removeRealTimeInfo:removeRealTimeInfo
    };
});
