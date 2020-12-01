/**
 * @fileOverview 此文件中包含TopologyGraph对象，该对象为拓扑图核心对象，大部分实例的初始化都在这里核心对象的init方法中完成。拓扑图实例、拓扑图模式、拓扑图缩略图等都存在于该对象中。
 * @author <a href="mailto:dingyf@suninfo.com">dingyf</a>
 * @version 2.0.1
 */
/**
 * 拓扑图的核心对象，在它的init方法中，先完成图的初始化，载入数据、载入样式、设置缩略图、放大缩小控件，
 * 再完成右键菜单、拓扑区域、拓扑提示信息、连接对话框、图扩展、载入拓扑配置信息、功能菜单的初始化工作
 * @class 拓扑图对象
 */
import PopupMenus from './topology.popupMenu'
import GraphGroup from './topology.graphGroup'
import GraphToolTip from './topology.graphToolTip'
// import ConnectPortDialog from './topology.connectDialog'
import GraphExtension from './topology.graphExtension'
import KeyHandler from './topology.keyhandler'
import RealtimeInfo from './topology.realtimeInfo'
import CellHandler from './topology.cellHandler'
import GraphConfig from './topology.graphConfig'
import GraphEvent from './topology.partEvent'
import TopoIcon from './topology.icon'
import {forEach, union} from 'lodash'
import {getTopoview} from '../api/topology_api'
let $ = window.$;
/**
 * 拓扑图版本
 * @private
 */
var version = '@VERSION@';
/**
 * 图编辑器实例
 * @private
 */
var editor = null;

/**
 * 图组件实例
 * @private
 */
var graph = null;

/**
 * 缩略图组件实例
 * @private
 */
var outline = null;

/**
 * 图的模式
 * @private 1：查看模式 2：编辑模式
 */
var mode = 1;

/**
 * 标记当前采用的标签类型
 * @type {number} :1表示显示ip，2表示显示名称，3表示都显示
 * @private
 */
var _label = 1;

/**
 * 点的大小
 * @type {number}
 * @private
 */
var _pointSize = 2;

/**
 * 是否正在加载中
 * @private
 */
var _loading = true;

/**
 * 是否显示应用(主要用于图的统计)
 * */
var showApp = 1;// 默认显示

/**
 * 区域数据
 */
var _groupCells = [];

var graphVM = null;

// var defaultGeo = {
//   x: 0,
//   y: 0,
//   width: 60,
//   height: 60
// };

/**
 * 拓扑图初始化
 * 只有在第一页面加载的时候才进行组件的初始化（即graph为null的时候）
 * @public
 */
function init(vm) {
  var initFlag = graph === null;
  if (initFlag) {
    editor = new window.mxEditor();
    graph = _createGraph();
    if (typeof vm !== 'undefined') {
      graphVM = vm;
    }
    vm.graph = graph;
    _loadStyle();
    GraphExtension.mxCellEx();
    GraphExtension.addGraphFilter(graph);
    GraphExtension.extend(graph);
    KeyHandler.bind();
    _addExtendEvent();
    CellHandler.init(graph);
    PopupMenus.init(graph);
    GraphGroup.setDefaltGroup(editor);
    GraphEvent.init(graph);
    GraphToolTip.extendsTooltip(graph);
    // ConnectPortDialog.init();
  } else {
    GraphConfig.loadTopologyConfig();
  }
  loadJsonData(function () {
    if (!initFlag) {
      graphVM.modeLabel = 1;
      graph.refresh();
    }
    graphVM.loading = false;
  });
}

/**
 * 建立图实例 完成图的基本设置
 * @private
 */
function _createGraph() {
  var container = document.getElementById('topology_graph');

  if (window.mxClient.IS_QUIRKS) {
    document.body.style.overflow = 'hidden';
    /* eslint-disable no-new */
    new window.mxDivResizer(container);
  }

  var graph = editor.graph;
  editor.setGraphContainer(container);
  // 设置不允许节点改变大小
  graph.setCellsResizable(false);
  // 设置是否两点可连多线
  // graph.setMultigraph(false);
  // 设置不允许线悬空
  graph.setAllowDanglingEdges(false);
  // 设置节点上连接图片
  window.mxConnectionHandler.prototype.connectImage = new window.mxImage(window.mxBasePath + '/images/connector.gif', 16, 16);
  // 大小调整图片
  window.mxVertexHandler.prototype.handleImage = new window.mxImage(window.mxBasePath + '/images/handle-main.png', 17, 17);
  // 设置选中节点虚线宽度为2
  window.mxConstants.VERTEX_SELECTION_STROKEWIDTH = 2;
  // 设置选中节点虚线颜色为红色
  window.mxConstants.VERTEX_SELECTION_COLOR = '#ff0000';
  // 屏蔽默认右键菜单
  window.mxEvent.disableContextMenu(container);
  // 禁用节点双击，防止改变数据
  graph.dblClick = function (evt, cell) {
    var model = graph.getModel();
    var mxGraphDblClick = window.mxGraph.prototype.dblClick;
    if (model.isVertex(cell) && cell.isTextCell() && mode === 2) {
      mxGraphDblClick.call(this, evt, cell);
    } else {
      return false;
    }
  };
  graph.isCellEditable = function (cell) {
    if (cell.isTextCell()) {
      return true;
    } else {
      return false;
    }
  };
  graph.isCellCloneable = function (cell) {
    return false;
  };
  graph.isCellFoldable = function (cell) {
    return false;
  };

  return graph;
}

/**
 * 载入默认样式
 * @private
 */
function _loadStyle() {
  // 获取默认样式
  var node = window.mxUtils.load(window.mxBasePath + '/topology-style.xml').getDocumentElement();
  var dec = new window.mxCodec(node.ownerDocument);
  dec.decode(node, graph.getStylesheet());
  GraphConfig.loadTopologyConfig();
  graph.refresh();
}

// 根据数据插入节点
function addVertex(onePointData, isFirst) {
  var pointCell, iconCell, groupCell;
  var pointX, pointY, iconX, iconY, iconWidth, iconHeight;
  if (isFirst) {
    iconX = 0;
    iconY = 0;
    iconWidth = 60;
    iconHeight = 60;
  } else {
    var geo = JSON.parse(onePointData.geo);
    iconX = geo.x - 0;
    iconY = geo.y - 0;
    iconWidth = geo.width - 0;
    iconHeight = geo.height - 0;
  }
  if (onePointData.style == null || (onePointData.style !== null && (onePointData.style.indexOf('group') === -1 && onePointData.style.indexOf('stext') === -1))) {
    if (isFirst) {
      pointX = 0;
      pointY = 0;
    } else {
      var onePointGeo = _getPointGeo(onePointData);
      pointX = onePointGeo.x;
      pointY = onePointGeo.y;
    }
    pointCell = graph.insertVertex(_getParentCell(onePointData), onePointData.typeUuid, '', pointX, pointY, _pointSize, _pointSize, 'pointCell;');
    iconCell = graph.insertVertex(_getParentCell(onePointData), onePointData.typeUuid + '_icon', getIconLabel(onePointData), iconX, iconY, iconWidth, iconHeight, TopoIcon.getStyle(onePointData));
    pointCell.type = onePointData.type;
    iconCell.type = onePointData.type;
    pointCell.uuid = onePointData.uuid;
    iconCell.uuid = onePointData.uuid;
    pointCell.hostIp = onePointData.hostIp;
    pointCell.funcType = onePointData.funcType;
    iconCell.hostIp = onePointData.hostIp;
    iconCell.busnessName = onePointData.busnessName;
    iconCell.funcType = onePointData.funcType;
    if (onePointData.isApp === 1) {
      iconCell.isTopoApp = onePointData.isApp;
    }
    iconCell.underCell = pointCell;
    pointCell.upperCell = iconCell;
  } else {
    // 处理区域数据
    onePointData.style += ';verticalAlign=' + window.mxConstants.ALIGN_TOP;// 让值在顶部显示
    groupCell = graph.insertVertex(_getParentCell(onePointData), onePointData.uuid, onePointData.value || '', iconX, iconY, iconWidth, iconHeight, onePointData.style);
    groupCell.uuid = onePointData.uuid;
    groupCell.setConnectable(false);
    _groupCells.push(groupCell);
  }
}

/**
 * 载入图内数据 载入数据后完成获取实时数据和鱼骨控件初始化
 * @public
 * @param {Function} callback 回调方法
 */
function loadJsonData(callback) {
  let param = {'subTopoId': window.paramSubTopo, 'showapp': graphVM.config.showapp};
  getTopoview(param).then((res) => {
    let graphData = res.data;
    if (graphData) {
      if (graphVM.incrementData === 0) {
        graphData.mapview = null
      }
      var isFirst = !graphData.mapview || (graphData.vertexs ? !graphData.vertexs.every(item => {
        return item.geo;
      }) : true);
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
            addVertex(graphData.vertexs[i], isFirst);
          }
        }
        if (graphData.edges != null) {
          for (var j = 0, length2 = graphData.edges.length; j < length2; j++) {
            oneEdgeData = graphData.edges[j];
            edge = graph.insertEdge(_getParentCell(oneEdgeData), oneEdgeData.uuid, '', model.getCell(oneEdgeData.sourceNodeUuid), model.getCell(oneEdgeData.targetNodeUuid));
            if (oneEdgeData.geo && oneEdgeData.geo.indexOf('[') !== -1) {
              edge.geometry.points = JSON.parse(oneEdgeData.geo);
            }
            edge.setStyle(oneEdgeData.style);
            edgeAry.push(edge);
          }
        }
        forEach(edgeAry, function (value) {
          graph.orderCells(true, [value]);
        });
        // orderGroup();
        if (isFirst && graphData.edges != null && graphData.vertexs != null) {
          graphVM.$refs.menu.byLayout('organic', function () {
            dealNoEdgeCell();
          });
        }
      } finally {
        model.endUpdate();
        _loading = false;
      }

      if (!(typeof callback === 'boolean' && callback === false)) {
        // 启动就去流量数据
        RealtimeInfo.updateState();
      }
      if (!isFirst) {
        GraphConfig.setTopologyMv(graphData.mapview)
      }
      GraphConfig.setTopologyBgImg(graphData.background);
      if (typeof callback === 'function') {
        callback();
      }
    } else {
      GraphConfig.setTopologyBgImg('');
    }
  });
}

/**
 * 根据老的geo和上层节点的geo，计算出新的geo
 * @param oldGeo
 * @param upperGeo
 * @returns {*}
 * @private
 */
function _getNewGeo(oldGeo, upperGeo) {
  oldGeo.x = upperGeo.x + upperGeo.width / 2 - 1;
  oldGeo.y = upperGeo.y + upperGeo.width / 2 - 1;
  return oldGeo;
}

/**
 * 扩展拓扑图事件为拓扑图线放在节点下方案提供支持
 * @private
 */
function _addExtendEvent() {
  // 移动一个节点事件
  graph.addListener(window.mxEvent.CELLS_MOVED, function (sender, evt) {
    var cells = evt.getProperty('cells');
    for (var i = cells.length - 1; i >= 0; i--) {
      var geo = cells[i].getGeometry();
      if (cells[i].isIconVertex()) {
        graph.getModel().beginUpdate();
        try {
          var oldGeo = cells[i].underCell.getGeometry();
          _getNewGeo(oldGeo, geo);
        } finally {
          graph.getModel().endUpdate();
        }
      }
    }
    graph.refresh();
  });

  // 拖拽到区域扩展
  graph.addListener(window.mxEvent.CELLS_ADDED, function (sender, evt) {
    var cells = evt.getProperty('cells');
    var target = evt.getProperty('parent');
    var index = 0;
    var edges = [];
    for (var i = cells.length - 1; i >= 0; i--) {
      if (cells[i].isIconVertex()) {
        graph.getModel().beginUpdate();
        try {
          index = graph.getModel().getChildCount(target);
          graph.cellsAdded([cells[i].underCell], target, index, null, null, true);
          edges.push();
          Array.prototype.push.apply(edges, cells[i].underCell.edges);
        } finally {
          graph.getModel().endUpdate();
        }
      }
    }
    graph.cellsOrdered(cells, false);
    graph.cellsOrdered(edges, true);
    graph.selectionCellsHandler.refresh();
  });
}

function setNewPanning(flag) {
  graph.panningHandler.useLeftButtonForPanning = flag;
  graph.panningHandler.setPanningEnabled(flag);
  if (flag) {
    $('#topology_graph').css('cursor', 'url(' + window.mxBasePath + '/images/openhand.cur) 8 8, default');
  } else {
    $('#topology_graph').css('cursor', 'default');
  }
}

/**
 * 根据json数据解析parentCell
 * @param cellData
 * @private
 */
function _getParentCell(cellData) {
  var parent = graph.getDefaultParent();
  if (cellData.parent === '-1' || cellData.parent == null) {
    parent = graph.getDefaultParent();
  } else {
    parent = graph.getModel().getCell(cellData.parent);
  }
  return parent;
}

/**
 * 根据json数据解析iconCell的标签信息
 * @param pointData
 * @private
 */
function getIconLabel(pointData) {
  var returnStr = pointData['hostIp'];
  if (_label === 1) {
    returnStr = pointData['hostIp'] || '';
  } else if (_label === 2) {
    returnStr = pointData['busnessName'] || '';
  } else if (_label === 3) {
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
  return {'x': geo.x - 0 + (geo.width - _pointSize) / 2, 'y': geo.y - 0 + (geo.height - _pointSize) / 2};
}

/**
 * 获得图实例
 * @private
 */
function getGraph() {
  return graph;
}

function clearGraph() {
  graph = null;
  window.mxEvent.removeAllListeners(window);
  window.mxEvent.removeAllListeners(document);
}

/**
 * 获得图实例
 * @private
 */
function getEditor() {
  return editor;
}

/**
 * 获取区域的id，如果不在区域返回-1
 * @private
 */
function getParent(cell) {
  if (cell.parent.id === graph.getDefaultParent().id) {
    return -1;
  } else {
    return cell.parent.id;
  }
}

/**
 * 获得缩略图实例
 * @public
 * @return {TypeName}
 */
function getOutlineGraph() {
  return outline;
}

/**
 * 设置图模式
 * @public
 * @param {Number} m 1：查看 2：编辑
 */
function setMode(m) {
  mode = m;
}

/**
 * 获取模式
 * @public
 * @return {Number} 1：查看 2：编辑
 */
function getMode() {
  return mode;
}

/**
 * 设置显示标签
 * @public
 * @param {Number} n 0：只显示ip; 1：只显示名称；2：都显示
 */
function setLabel(n) {
  _label = n;
}

/**
 * 获取显示标签
 * @public
 * @return {Number} 0：只显示ip; 1：只显示名称；2：都显示
 */
function getLabel() {
  return _label;
}

/**
 * showApp值的set、get方法，1表示显示，0表示不显示
 * */
function getShowApp() {
  return showApp;
}

function setShowApp(num) {
  showApp = num;
}

/**
 * 获取拓扑图版本
 * @return {String} 拓扑图版本串
 */
function getVersion() {
  return version;
}

/**
 * 是否正在载入中
 * @returns {boolean}
 */
function getLoading() {
  return _loading;
}

/**
 * 将区域显示后置
 */
function orderGroup() {
  graph.orderCells(true, _groupCells);
  var allEdges = [];
  for (var i = 0, l = _groupCells.length; i < l; i++) {
    if (_groupCells[i].children != null) {
      for (var j = 0, ll = _groupCells[i].children.length; j < ll; j++) {
        if (_groupCells[i].children[j].edges != null) {
          allEdges = allEdges.concat(_groupCells[i].children[j].edges);
        }
      }
    }
  }
  allEdges = union(allEdges);
  forEach(allEdges, function (value) {
    graph.orderCells(true, [value]);
  });
}

function setLoading(flag) {
  _loading = flag;
}

/**
 * 处理没有连线的vertex
 * */
function dealNoEdgeCell() {
  var vertices = graph.getChildVertices();
  var noEdgeVertices = [];
  for (let i = 0; i < vertices.length; i++) {
    let cell = vertices[i];
    if (cell.isIconVertex() && !cell.underCell.edges) {
      noEdgeVertices.push(cell);
    }
  }
  for (let i = 0; i < noEdgeVertices.length; i++) {
    let cell = noEdgeVertices[i];
    var dx = -600 + (i % 5) * 120;
    var dy = parseInt(i / 5) * 120;
    cell.geometry.x += dx;
    cell.geometry.y += dy;
    cell.underCell.geometry.x += dx;
    cell.underCell.geometry.y += dy;
  }
  graph.refresh();
}

function getGraphVm() {
  return graphVM;
}

var TopologyGraph = {
  getVersion: getVersion,
  getGraph: getGraph,
  clearGraph: clearGraph,
  getEditor: getEditor,
  getOutlineGraph: getOutlineGraph,
  getMode: getMode,
  setMode: setMode,
  getLabel: getLabel,
  setLabel: setLabel,
  loadJsonData: loadJsonData,
  getParent: getParent,
  addVertex: addVertex,
  setNewPanning: setNewPanning,
  getLoading: getLoading,
  setLoading: setLoading,
  getShowApp: getShowApp,
  setShowApp: setShowApp,
  getIconLabel: getIconLabel,
  orderGroup: orderGroup,
  getGraphVm: getGraphVm,
  init: init
};

export default TopologyGraph;
