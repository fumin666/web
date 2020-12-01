/**
 *
 */
define(function(require, exports, module) {

    var realtimeInfo = require('./tvwallTopo.realtimeInfo');
    var _ = require('../../../js/underscore');
    var _allGraphs = {};
    /**
     * 缓存所有的id
     * @type {Array}
     */
    var graphs = [];
    var _finishGraphs = [];
    /**
     * 全部图的视野信息
     */
    var _viewPoints = {};


    function addGraph(id,graph){
        _allGraphs[id] = graph;
    }

    function getGraph(id){
        return _allGraphs[id] || null;
    }

    function allGraphRefresh(){
        _.map(_allGraphs, function(graph, key){ return graph.refresh(); });
    }

    function setNewPanning(flag){
        _.map(_allGraphs, function(graph, key){
            graph.panningHandler.useLeftButtonForPanning = flag;
            graph.panningHandler.setPanningEnabled(flag);
        });
    }

    function removeGraph(id){
        delete _allGraphs[id];
    }

    function finishCallBack(graphId){
        var index =  _.findIndex(graphs,graphId);
        var deleteGraph = graphs.splice(index,1);
        _finishGraphs.push(deleteGraph);
        if(graphs.length == 0){
            realtimeInfo.updateState(_finishGraphs);
        }
    }

    function initAllGraph(graphsAry){
        graphs = graphsAry;
    }

    /**
     * 存储所有图的视野信息
     * @param listPageparams
     */
    function setAllViewPoints(listPageparams){
        if(listPageparams !== null){
            _viewPoints = JSON.parse('{' + listPageparams + '}');
        }else{
            _viewPoints = {};
        }
    }

    /**
     * 设置一张图的视野信息
     * @param gId
     * @param pointStr
     */
    function setOneViewPoint(gId,pointStr){
        _viewPoints[gId] = pointStr;
    }

    /**
     * 获取所有图的视野信息
     */
    function getAllViewPoints(){
        return JSON.stringify(_viewPoints).replace(/{/,'').replace(/}/,'');
    }

    /**
     * 获取一张图的视野信息
     * @param gId
     * @returns {*}
     */
    function getOneViewPoint(gId){
        return _viewPoints[gId];
    }

    module.exports = {
        addGraph : addGraph,
        getGraph : getGraph,
        allGraphRefresh:allGraphRefresh,
        setNewPanning:setNewPanning,
        removeGraph : removeGraph,
        finishCallBack:finishCallBack,
        setAllViewPoints:setAllViewPoints,
        getAllViewPoints:getAllViewPoints,
        setOneViewPoint:setOneViewPoint,
        getOneViewPoint:getOneViewPoint,
        initAllGraph:initAllGraph
    };
});
