/**
 * @fileOverview 此文件中包含RealtimeInfo对象，该对象中包含拓扑实时信息的相关操作
 * @author <a href="mailto:dingyf@suninfo.com">dingyf</a>
 * @version 2.0.0
 */

/**
 * 用于获取拓扑图上线上流量信息、资产是否在线、资产是否出现告警三种实时信息
 * 除去获取实时信息方法还包括如何将信息展现在图上的操作方法
 * @class 拓扑实时信息对象
 */
import GraphExtension from './topology.graphExtension'
import store from '@/store'
import {indexOf, map, filter} from 'lodash'
import { getViewInfo } from '../api/topology_api'
let $ = window.$;

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
 * 是否载入资产在线信息
 * @private
 */
var _onlineFlag = true;

/**
 * 是否资产事件信息
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
var _tPeriod = null;

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
 * 节点和资产周期闪动interval
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

/**
 * 获取拓扑实时信息
 * @private
 */
function _updateIconSet () {
  if (!_flowFlag && !_onlineFlag && !_incidentFlag && !_subTopoFlag && _loadInfoTimer !== null) {
    clearRealTimeout();
    _loadInfoTimer = null;
  } else {
    if (_loadInfoTimer == null) {
      _setRealTimeout();
    } else {
      clearRealTimeout();
      _setRealTimeout();
    }
  }
}

/**
 * 获取拓扑实时信息（外部调用接口）
 * @public
 */
function updateIconSet () {
  if (window.TopologyGraph && window.TopologyGraph.getGraphVm().config.period) {
    // noinspection JSAnnotator
    _tPeriod = window.TopologyGraph.getGraphVm().config.period * 1000 || 180000;
  }
  _setAllState();
  _updateIconSet();
}

/**
 * 根据状态标志位onlineFlag、flowFlag、incidentFlag、subTopoFlag请求实时数据
 * @public
 */
function _loadEvents () {
  if (!window.TopologyGraph) return;
  var ary = [];
  ary.push(_flowFlag ? '1' : '0');
  ary.push(_onlineFlag ? '1' : '0');
  ary.push(_incidentFlag ? '1' : '0');
  ary.push(_subTopoFlag ? '1' : '0');
  let param = {subTopoId: window.paramSubTopo, showapp: window.TopologyGraph.getGraphVm().config.showapp || 0, realtime: ary.join(',')};
  getViewInfo(param).then((res) => {
    store.commit('graphData', res.data);
    let data = res.data;
    _resetAllData();
    _realtimeInfoCallback(data);
    _loadInfoTimer = setTimeout(_loadEvents, _tPeriod);
  });
}

/**
 * 清理所有数据
 * @private
 */
function _resetAllData () {
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
 * 1.循环遍历所有信息，将需要变色的线和资产进行筛选
 * 2.将宕机的集合和异常的集合分别交给处理方法
 * 3.将告警事件个数集合传给告警处理方法
 * 4.将流量信息分给流量处理
 * @private
 */
function _realtimeInfoCallback (data) {
  if (!window.TopologyGraph) return;
  var graph = window.TopologyGraph.getGraph();
  var model = graph.getModel();
  var cell = null;
  var cellData = {};
  for (var i = 0, l = data.length; i < l; i++) {
    cellData = data[i];
    cell = model.getCell(cellData.uuid);
    if (typeof cell !== 'undefined' && cell != null) {
            // 节点
      if (cell.isVertex()) {
        // 1.需要变色的节点筛选
        if (!cell.isSubTopoCell()) {
          // 非子拓扑
          if (cellData.status === '0') {
            _errorVertexAry.push(cellData.uuid);
          }
          if (cellData.status === '2') {
            _warningVertexAry.push(cellData.uuid);
          }
        } else {
          // 子拓扑
          if (cellData.childStatus === '0') {
            _errorVertexAry.push(cellData.uuid);
          }
          if (cellData.childStatus === '2') {
            _warningVertexAry.push(cellData.uuid);
          }
          _subTopoAry.push(cellData.uuid);
        }
        if (cellData.unrecoveryIncidentNum !== '0') {
          _incidentCount[cellData.uuid] = cellData.unrecoveryIncidentNum;
        }
      }
      // 连线
      if (cell.isEdge()) {
        // 1.需要变色的连线筛选
        if (cellData.status === '0') {
          _errorEdgeAry.push(cellData.uuid);
        }
        if (cellData.status === '2') {
          _warningEdgeAry.push(cellData.uuid);
        }
        _flowData.push({
          edge: cell,
          inSpeed: cellData.inSpeed,
          outSpeed: cellData.outSpeed
        });
      }
    }
  }
  _blinkAction();
  _updateEdgeFlow();
  GraphExtension.setSecondLabelData(_incidentCount);
  graph.refresh();
}

/**
 * 更新线上流量
 * @private
 */
function _updateEdgeFlow () {
  var graph = window.TopologyGraph.getGraph();
  var edge = null;
  var data = null;
  for (var i = 0, l = _flowData.length; i < l; i++) {
    data = _flowData[i];
    edge = data.edge;
    if (edge.getChildCount() > 0) {
      var cells = graph.getChildCells(edge);
      graph.removeCells(cells);
    }
    if (data.inSpeed && data.inSpeed !== 'null') {
      var sourceLabel = _getFlowLable(data.inSpeed, new window.mxGeometry(-0.5, 0, 0, 0));
      sourceLabel.souceItcompUuid = data.souceItcompUuid;
      sourceLabel.souceMiUuid = data.souceMiUuid;
      edge.insert(sourceLabel);
    }
    if (data.outSpeed && data.outSpeed !== 'null') {
      var targetLabel = _getFlowLable(data.outSpeed, new window.mxGeometry(0.5, 0, 0, 0));
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
 * @return {mxCell} 流量标签
 */
function _getFlowLable (flow, geo) {
  var flowLabel = new window.mxCell((flow || 0) + 'Mbps', geo, 'flowrate');
  flowLabel.geometry.relative = true;
  flowLabel.setConnectable(false);
  flowLabel.vertex = true;
  flowLabel.displayflow = 'false';
  return flowLabel;
}

/**
 * 根据传入Vertex数组返回id选择器字符串
 * @param ary
 * @private
 */
function _getIdStrForVertex (ary) {
  var aryStr = map(ary, function (vertex) {
    return '#' + vertex + '_icon';
  }).join(',');
  if (ary.length === 1) {
    aryStr = aryStr + ',#_XXXXXXXXXXXXXXXXXXXXXX_icons';
  }
  return aryStr;
}

/**
 * 根据传入Edge数组返回id选择器字符串
 * @param ary
 * @private
 */
function _getIdStrForEdge (ary) {
  var aryStr = map(ary, function (edge) {
    return '#' + edge;
  }).join(',');
  if (ary.length === 1) {
    aryStr = aryStr + ',#_XXXXXXXXXXXXXXXXXXXXXX_edges';
  }
  return aryStr;
}

/**
 * 连线和节点闪动
 * @private
 */
function _blinkAction () {
  var flag = true;
  if (_interval != null) {
    clearInterval(_interval);
  }
  _interval = setInterval(function () {
    if (flag) {
      if (_errorVertexAry.length > 0) {
        $(_getIdStrForVertex(_errorVertexAry)).find('image').css('filter', 'url(#error_filter)');
      }
      if (_warningVertexAry.length > 0) {
        $(_getIdStrForVertex(_warningVertexAry)).find('image').css('filter', 'url(#warning_filter)');
      }
      if (_errorEdgeAry.length > 0) {
        $(_getIdStrForEdge(_errorEdgeAry)).find('path').css('filter', 'url(#edge_error_filter)');
      }
      if (_warningEdgeAry.length > 0) {
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
function _stopBlinkAction () {
  $('svg image').css('filter', '');
  $('svg path').css('filter', '');
  if (_interval != null) {
    clearInterval(_interval);
  }
}

/**
 * 移出所有的实时信息
 */
function removeRealTimeInfo () {
  _stopBlinkAction();
  clearRealTimeout();
  GraphExtension.setSecondVisible(false);
  _removeAllFlowCell();
}

/**
 * 设置获取告警事件
 * @public
 */
function setIncidentFlag (flag, update) {
  if (flag === 1) {
    _incidentFlag = true;
  } else {
    _incidentFlag = false;
    _incidentCount = {};
    GraphExtension.setSecondLabelData(_incidentCount);
  }
  GraphExtension.setSecondVisible(!GraphExtension.getSecondVisible());
  window.TopologyGraph.getGraph().refresh();
  if (update) {
    _updateIconSet();
  }
}

/**
 * 设置获取流量信息
 * @public
 */
function setFlowData (flag, update) {
  if (flag === 1) {
    _flowFlag = true;
  } else {
    _flowFlag = false;
    _removeAllFlowCell();
  }
  if (update) {
    _updateIconSet();
  }
}

/**
 * 设置子拓扑在线状态
 * @public
 */
function setSubTopoFlag (flag, update) {
  if (flag === 1) {
    _subTopoFlag = true;
  } else {
    _subTopoFlag = false;
    _clearAllSubTopoCell();
  }
  if (update) {
    _updateIconSet();
  }
}

/**
 * 移除所有子拓扑在线状态
 * @private
 */
function _clearAllSubTopoCell () {
    // 从闪动的数据中删除子拓扑数据
  _errorVertexAry = filter(_errorVertexAry, function (cellId) {
    return indexOf(_subTopoAry, cellId) === -1;
  });
  _warningVertexAry = filter(_warningVertexAry, function (cellId) {
    return indexOf(_subTopoAry, cellId) === -1;
  });
}

/**
 * 移除所有在线上添加的流量节点
 * @private
 */
function _removeAllFlowCell () {
  var graph = window.TopologyGraph.getGraph();
  var model = graph.getModel();
  model.beginUpdate();
  try {
    $.each(model.cells, function (key, edge) {
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
  }
}

/**
 * 设置获取在线状态
 * @public
 */
function setOnlineData (flag, update) {
  if (flag === 1) {
    _onlineFlag = true;
  } else {
    _onlineFlag = false;
  }
  if (update) {
    _updateIconSet();
  }
}

/**
 * 取消实时信息请求
 * 从查看模式切换到编辑模式时调用
 * @public
 */
function clearRealTimeout () {
  clearTimeout(_loadInfoTimer);
  _loadInfoTimer = null;
}

/**
 * 重置实时信息请求
 * 从查看模式切换到编辑模式时调用
 * @public
 */
function resetRealTimeout () {
  _setRealTimeout();
  GraphExtension.setSecondVisible(_incidentFlag);
}

function _setRealTimeout () {
  _loadEvents();
}

/**
 * 设置新周期
 * 在拓扑图全局配置中调用
 * @public
 */
function setNewPeriod (newPeriod) {
  if (newPeriod) {
    // noinspection JSAnnotator
    _tPeriod = newPeriod * 1000;
  }
  clearRealTimeout();
  _setRealTimeout();
}

/**
 * 设置全部状态
 * @public
 */
function _setAllState () {
  if (!window.TopologyGraph) return;
  var config = window.TopologyGraph.getGraphVm().realtime;
  var ary = [];
  for (var i = 0; i < config.length; i++) {
    ary[i] = (config[i] === 1);
  }
  _flowFlag = ary[0];
  _onlineFlag = ary[1];
  _incidentFlag = ary[2];
  _subTopoFlag = ary[3];
  GraphExtension.setSecondVisible(_incidentFlag);
}

export default {
  setFlowData: setFlowData,
  setOnlineData: setOnlineData,
  setIncidentFlag: setIncidentFlag,
  setSubTopoFlag: setSubTopoFlag,
  setNewPeriod: setNewPeriod,
  updateState: updateIconSet,
  clearRealTimeout: clearRealTimeout,
  resetRealTimeout: resetRealTimeout,
  removeRealTimeInfo: removeRealTimeInfo
};
