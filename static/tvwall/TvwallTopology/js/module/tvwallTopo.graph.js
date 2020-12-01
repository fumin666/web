/**
 * Created by dgunzi on 2017/1/12.
 */
define(function(require, exports, module) {

  var suninfo = require('../../../js/ajax.interface');
    var GraphExtension = require('./tvwallTopo.graphExtension');
    // var graphConfig = require('./tvwallTopo.graphConfig');

    /**
     * 图编辑器实例
     * @private
     */
    var editor = null;

    /**
     * 拓扑图的uuid
     * @type {null}
     */
    var graphId = null;

    /**
     * 图组件实例
     * @private
     */
    var graph = null;
    /**
     * 是否正在加载中
     * @private
     */
    var _loading = true;

    /**
     * 区域数据
     */
    var _groupCells = [];

    /**
     * 点的大小
     * @type {number}
     * @private
     */
    var _pointSize = 2;

    /**
     * 载入图内数据 载入数据后完成获取实时数据和鱼骨控件初始化
     * @public
     * @param {Function} callback 回调方法
     */
    function loadJsonData(tvwallid, graphId, locationStr,callback){
        // ../viewmanager/topoview/getTopoview/
        suninfo.post('systemManager/staticTvWall/newTopologyPortlet/'+tvwallid+'/'+graphId + '/' +locationStr,null,{global:false}).done(function (graphData) {
            var graph = graphConfig.getGraph(graphId);
            if(graphData) {
                if(graphData.uuid == null){
                    _refreshParentPage();
                }else {
                    $('#title_' + graphId).html(graphData.name);
                    var isFirst = !graphData.mapview ? true : false;
                    _label = graphData.label;
                    var oneEdgeData = {};
                    var edgeAry = [];
                    var edge = null;
                    var model = graph.getModel();
                    _groupCells = [];
                    _loading = true;
                    model.clear();
                    model.beginUpdate();
                    try {
                        if (graphData.vertexs != null) {
                            for (var i = 0, length = graphData.vertexs.length; i < length; i++) {
                                var ppxia = graphData.vertexs[i].style;
                                if (ppxia && ppxia.indexOf('../static/images') > 0) {
                                  var _idx = ppxia.indexOf('static');
                                  var _str = ppxia.substr(_idx + 6);
                                  graphData.vertexs[i].style = 'image;image=..' + _str;
                                }
                                addVertex(graphId, graphData.vertexs[i], isFirst);
                            }
                        }
                        if (graphData.edges != null) {
                            for (var j = 0, length2 = graphData.edges.length; j < length2; j++) {
                                oneEdgeData = graphData.edges[j];
                                edge = graph.insertEdge(_getParentCell(graphId, oneEdgeData), oneEdgeData.uuid, '', model.getCell(oneEdgeData.sourceNodeUuid), model.getCell(oneEdgeData.targetNodeUuid));
                                if (oneEdgeData.geo && oneEdgeData.geo.indexOf('[') != -1) {
                                    edge.geometry.points = JSON.parse(oneEdgeData.geo);
                                }
                                edgeAry.push(edge);
                            }
                        }
                        for(var i = 0, l = edgeAry.length; i < l; i ++){
                          graph.orderCells(true, [edgeAry[i]]);
                        }
                        // orderGroup(graph);
                        var viewPointStr = graphConfig.getOneViewPoint(graphId);
                        // 如果已经对视野信息进行了设置，则采用设置，否则采用拓扑图的设置
                        if (typeof viewPointStr !== 'undefined') {
                            var mArray = viewPointStr.split('|');
                            graph.view.scaleAndTranslate(parseFloat(mArray[0]), parseFloat(mArray[1]), parseFloat(mArray[2]));
                        } else {
                            if (graphData.mapview.length > 0) {
                                var mvArray = graphData.mapview.split('|');
                                graph.view.scaleAndTranslate(parseFloat(mvArray[2]), parseFloat(mvArray[0]), parseFloat(mvArray[1]));
                            }
                        }
                    } finally {
                        model.endUpdate();
                        _loading = false;
                        if (callback) {
                            callback(graphId);
                        }
                    }
                }
            }
        });
    }

    /**
     * 发现有删除拓扑的情况，刷新父页面
     * @private
     */
    function _refreshParentPage(){
        parent.location.reload();
    }

    /**
     * 将区域显示后置
     */
    function orderGroup(graph){
        graph.orderCells(true,_groupCells);
    }

    // 根据数据插入节点
    function addVertex(graphId,onePointData,isFirst){
        var graph = graphConfig.getGraph(graphId);
        var pointCell,iconCell,groupCell;
        var pointX,pointY,iconX,iconY,iconWidth,iconHeight;
        if(isFirst){
            iconX=0;
            iconY=0;
            iconWidth=60;
            iconHeight=60;
        }else {
            if (onePointData.geo) {
              var geo = JSON.parse(onePointData.geo);
              iconX = geo.x;
              iconY = geo.y;
              iconWidth = geo.width;
              iconHeight = geo.height;
            }
        }
        if (onePointData.style == null || (onePointData.style !== null && (onePointData.style.indexOf('group') == -1 && onePointData.style.indexOf('stext') == -1))) {
            if(isFirst){
                pointX=0;
                pointY=0;
            }else {
                var onePointGeo = _getPointGeo(onePointData);
                pointX = onePointGeo.x;
                pointY = onePointGeo.y;
            }
            pointCell = graph.insertVertex(_getParentCell(graphId,onePointData), onePointData.typeUuid, '', pointX, pointY, _pointSize, _pointSize, 'pointCell;');
            iconCell = graph.insertVertex(_getParentCell(graphId,onePointData), onePointData.typeUuid + '_icon', getIconLabel(onePointData), iconX, iconY, iconWidth, iconHeight, onePointData.style || 'image;image=../images/topologyicon/default/networkserver.svg');
            pointCell.type = onePointData.type;
            iconCell.type  = onePointData.type;
            pointCell.uuid = onePointData.uuid;
            iconCell.uuid = onePointData.uuid;
            iconCell.typeUuid = onePointData.typeUuid;
            pointCell.hostIp = onePointData.hostIp;
            pointCell.funcType = onePointData.funcType;
            iconCell.hostIp = onePointData.hostIp;
            iconCell.busnessName = onePointData.busnessName;
            iconCell.funcType = onePointData.funcType;
            iconCell.underCell = pointCell;
            pointCell.upperCell = iconCell;
        } else {
            //处理区域数据
            groupCell = graph.insertVertex(_getParentCell(graphId,onePointData), onePointData.uuid, onePointData.value || '', iconX, iconY, iconWidth, iconHeight, onePointData.style);
            groupCell.uuid=onePointData.uuid;
            groupCell.setConnectable(false);
            _groupCells.push(groupCell);
        }
    }

    /**
     * 载入默认样式
     * @private
     */
    function _loadStyle(graphId) {
        var graph = graphConfig.getGraph(graphId);
        //获取默认样式
        var node = mxUtils.load(mxBasePath + '/topology-style.xml').getDocumentElement();
        var dec = new mxCodec(node.ownerDocument);
        dec.decode(node, graph.getStylesheet());
        graph.refresh();
    }

    /**
     * 建立图实例 完成图的基本设置
     * @private
     */
    function _createGraph(graphId) {
        var container = document.getElementById("graph_" + graphId);

        if (mxClient.IS_QUIRKS) {
            document.body.style.overflow = 'hidden';
            new mxDivResizer(container);
        }
        editor = new mxEditor();
        var graph = editor.graph;
        editor.setGraphContainer(container);
        //设置不允许节点改变大小
        graph.setCellsResizable(false);
        graph.setEnabled(false);
        //设置是否两点可连多线
        //graph.setMultigraph(false);
        //设置不允许线悬空
        graph.setAllowDanglingEdges(false);
        //设置选中节点虚线颜色为红色
        mxConstants.VERTEX_SELECTION_COLOR = '#ff0000';
        //屏蔽默认右键菜单
        mxEvent.disableContextMenu(container);
        /*禁用节点双击，防止改变数据 */
        graph.dblClick = function(evt, cell) {
            return false;
        };
        graph.isCellEditable = function(cell){
            return false;
        };
        graph.isCellCloneable = function(cell) {
            return false;
        };
        graph.isCellFoldable = function(cell)
        {
            return false;
        };
        graph.panningHandler.setPanningEnabled(false);
        graphConfig.addGraph(graphId,graph);
    }

    /**
     * 根据json数据解析parentCell
     * @param cellData
     * @private
     */
    function _getParentCell(graphId,cellData){
        var graph = graphConfig.getGraph(graphId);
        var parent = graph.getDefaultParent();
        if(cellData.parent == "-1" || cellData.parent==null){
            parent = graph.getDefaultParent();
        }else{
            parent = graph.getModel().getCell(cellData.parent);
        }
        return parent;
    }

    /**
     * 根据json数据解析iconCell的标签信息
     * @param pointData
     * @private
     */
    function getIconLabel(pointData){
        var returnStr = pointData['hostIp'];
        if(_label == 1){
            returnStr = pointData['hostIp'] || '';
        }else if(_label == 2){
            returnStr = pointData['busnessName'] || '';
        }else if(_label == 3){
            returnStr = (pointData['hostIp'] || '') + '-' + (pointData['busnessName'] || '');
        }
        return returnStr;
    }

    /**
     * 根据json数据解析pointCell的位置信息
     * @param pointData
     * @returns {{x: *, y: *}}
     * @private
     */
    function _getPointGeo(pointData) {
        var geo = JSON.parse(pointData.geo);
        return {"x": geo.x + (geo.width-_pointSize) / 2,"y": geo.y + (geo.height-_pointSize) / 2};
    }
    /**
     * 拓扑图初始化
     * 只有在第一页面加载的时候才进行组件的初始化（即graph为null的时候）
     * @public
     */
    function init(tvwallid, graphIdStr, locationStr) {
        if (!mxClient.isBrowserSupported()) {
            mxUtils.error('浏览器不支持拓扑图所用控件!', 200, false);
        } else {
            graphId = graphIdStr;
            //var initFlag = (graph == null) ? true : false;
            _createGraph(graphId);
            _loadStyle(graphId);
            GraphExtension.mxCellEx();
            GraphExtension.addGraphFilter(graphId);
            GraphExtension.extend(graphId);
            loadJsonData(tvwallid, graphId, locationStr,function(gId) {
                _showOutline(gId);
                graphConfig.finishCallBack(gId);
                addClickEvent(gId);
            });
        }
    }

    /**nextGraphId
     * 设置缩略图
     * @private
     */
    function _showOutline(graphId) {
        var div = document.getElementById("outline_" + graphId);
        var graph = graphConfig.getGraph(graphId);
        var outline = new mxOutline(graph, div);
        outline.setZoomEnabled(false);
        if (mxClient.IS_QUIRKS) {
            new mxDivResizer(outline);
        }
    }

    function addClickEvent(graphId){
      var graph = graphConfig.getGraph(graphId);
      graph.addListener(mxEvent.CLICK, function(sender, evt) {
        var e = evt.getProperty('event'); // mouse event
        var cell = evt.getProperty('cell'); // cell may be null

        if (cell != null) {
          // Do something useful with cell and consume the event
          evt.consume();
          if (cell.isVertex() && cell.style !== 'flowrate') {
            parent.showEventList(cell.typeUuid);
          }
        }
      });
    }


    module.exports = {
        init:init
    };
});
