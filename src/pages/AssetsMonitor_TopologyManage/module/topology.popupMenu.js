/**
 * Created by dingyf on 2017/6/20.
 */

/* var ConnectPortDialog = require('./topology.connectDialog');
var SysIntegration = require('./topology.sysIntegration');
var IconModifyDialog = require('./topology.iconModifyDialog');
var BgModifyDialog = require('./topology.bgModifyDialog');
var RemotePingDialog = require('./topology.remotePingDialog');
var OperateDialog = require('./topology.operateDialog');
var CustomAttrDialog = require('./topology.customAttrDialog');
var ExecuteCmdDialog = require('./topology.executeCmdDialog'); */
import TopologyAjax from './topology.ajax'
import GraphGroup from './topology.graphGroup'
import { deleteLineList, deleteNodeList, deleteDomain, getOperationItcomp } from '../api/topology_api'

let $ = window.$;

/**
 * 图组件实例
 * @private
 */
var graph = null;

let authItcomps = [];
let roleName = '';

/**
 * 右键菜单初始化
 * @param {mxGraph} g 拓扑图实例
 * @public
 */
function init(g) {
  graph = g;
  // 添加自定义菜单
  graph.popupMenuHandler.autoExpand = true;
  graph.popupMenuHandler.factoryMethod = function(menu, cell, evt) {
    return _createPopupMenu(menu, cell, evt);
  };
  // 登陆的是运维人员时已经被授权的资产才允许右键菜单操作
  roleName = window.TopologyGraph.getGraphVm().$store.state.userData.roleName;
  if (roleName === '运维人员') {
    getOperationItcomp().then(data => {
      let userUuid = window.TopologyGraph.getGraphVm().$store.state.userData.uuid;
      authItcomps = data[userUuid] || [];
    })
  }
}

/**
 * 删除选中节点
 * @private
 */
function _delCells() {
  var delCells = graph.getSelectionCells();
  var model = graph.getModel();
  var delEdgeIdArr = [];
  var delNodeCells = [];
  var delDomainCells = [];

  var hasEdge = false;
  var hasVertex = false;
  var hasDomain = false;
  var hasNode = false;
  for (var i = 0; i < delCells.length; i++) {
    var cell = delCells[i];
    if (model.isEdge(cell)) {
      delEdgeIdArr.push(cell.id);
      hasEdge = true;
    }
    if (model.isVertex(cell)) {
      hasVertex = true;
      if (cell.isGroupCell() || cell.isTextCell()) { // 文字算特殊的区域
        hasDomain = true;
        delDomainCells.push(cell);
      } else {
        hasNode = true;
        delNodeCells.push(cell);
      }
    }
  }
  if (delDomainCells.length > 1) {
    window.TopologyGraph.getGraphVm().$message({
      message: '区域不能批量删除！',
      type: 'warning'
    });
    return;
  }
  if (hasEdge) { // 选中包含了线路
    if (!hasVertex) {
      window.TopologyGraph.getGraphVm().delEdgeIdArr = delEdgeIdArr;
      window.TopologyGraph.getGraphVm().lineDelDialogFlag = true;
    } else {
      var type = 2; // 既包含线，又包含点时删除的线默认type为2
      var paramEdge = delEdgeIdArr;
      ajaxDelLineList(paramEdge, type, function(response) {
        if (response) {
          graph.removeCells(delCells);
          _delNodes(hasNode, hasDomain, delNodeCells, delDomainCells, delCells);
        }
      });
    }
  } else { // 删除(批量)节点、删除区域
    _delNodes(hasNode, hasDomain, delNodeCells, delDomainCells, delCells);
  }
}

/**
 * 删除vertexs
 * @param  hasNode : 是否包含普通节点
 * @param  hasDomain : 是否包含区域节点
 * @param  delNodeCells : 要删除的普通节点的数组
 * @param  delDomainCells : 要删除的区域节点的数组
 * @param  delCells : 图中被选中的cell
 * */
function _delNodes(hasNode, hasDomain, delNodeCells, delDomainCells, delCells) {
  if (!hasDomain) { // 只包含节点
    ajaxDelNodeList(delNodeCells).then(function(result) {
      if (result) {
        includePointCell(delCells);
        graph.removeCells(delCells);
      }
    });
  }
  if (!hasNode) { // 只包含区域
    ajaxDelDemain(delDomainCells).then(function(result) {
      if (result) {
        if (delCells[0].children === null || delCells[0].children.length === 0) {
          graph.removeCells(delCells);
        } else {
          updateDelGroupChild(delCells[0]);
        }
      }
    });
  }
  if (hasDomain && hasNode) { // 既包含区域，又包含节点
    ajaxDelNodeList(delNodeCells).then(function(result) {
      if (result) {
        includePointCell(delCells);
        graph.removeCells(delNodeCells);
        return ajaxDelDemain(delDomainCells);
      }
    }).then(function(result) {
      if (result) {
        if (delDomainCells[0].children === null || delDomainCells[0].children.length === 0) {
          graph.removeCells(delDomainCells);
        } else {
          updateDelGroupChild(delDomainCells[0]);
        }
      }
    });
  }
}

// 删除区域后释放区域中的节点，并更新节点的位置
function updateDelGroupChild(group) {
  var cells = group.children;
  var dx = group.geometry.x;
  var dy = group.geometry.y;
  var nodeArr = [];
  for (var i = 0; i < cells.length; i++) {
    var cell = cells[i];
    if (cell.isIconVertex()) {
      var geo = cell.parseGeo();
      geo.x += dx;
      geo.y += dy;
      var obj = {
        uuid: cell.uuid,
        parent: -1,
        geo: JSON.stringify(geo),
        topoviewInfoUuid: window.paramSubTopo
      };
      nodeArr.push(obj);
    }
  }
  window.TopologyGraph.getEditor().execute('ungroup', group);
  var param = {
    topoviewNode: JSON.stringify(nodeArr)
  };
  TopologyAjax.ajaxSaveOrUpdateTopo(param);
}

// 调用批量删除线的接口
function ajaxDelLineList(param, type, callback) {
  deleteLineList(type, param).then(function(data) {
    if (data) {
      dealTab('line');
    } else {
      window.TopologyGraph.getGraphVm().$message.error('删除连线失败!');
    }
    if (callback) {
      callback(data);
    }
  });
}

// 调用删除批量节点的接口
function ajaxDelNodeList(delNodeCells) {
  var defer = $.Deferred();
  var delVertexIdArr = [];
  for (var i = 0, l = delNodeCells.length; i < l; i++) {
    delVertexIdArr.push(delNodeCells[i].uuid);
  }
  deleteNodeList(delVertexIdArr).then(function(data) {
    var vm = window.TopologyGraph.getGraphVm();
    if (data) {
      vm.$message({
        type: 'success',
        message: '删除节点成功!'
      });
      if (typeof vm.$refs.dragPanel !== 'undefined') { // 打开的为拖拽面板,更新面板内容
        vm.$refs.dragPanel.init(true); // 更新tab数据
        vm.initDeviceTabData(); // 更新资产信息列表
      }
      defer.resolve(true);
    } else {
      vm.$message.error('删除节点失败!');
      defer.resolve(false);
    }
  });
  return defer.promise();
}
// 调用删除区域的接口
function ajaxDelDemain(delDomainCells) {
  var defer = $.Deferred();
  var delDomainIdArr = [];
  for (var i = 0, l = delDomainCells.length; i < l; i++) {
    delDomainIdArr.push(delDomainCells[i].uuid);
  }
  deleteDomain(delDomainIdArr[0]).then(function(data) {
    if (data) {
      window.TopologyGraph.getGraphVm().$message({
        type: 'success',
        message: '删除成功!'
      });
      defer.resolve(true);
    } else {
      window.TopologyGraph.getGraphVm().$message.error('删除失败!');
      defer.resolve(false);
    }
  });
  return defer.promise();
}

/**
 * 如果操作拓扑图时，对应的选项卡是打开的，刷新改选项卡数据
 * @description  只有增删操作需要刷新对应选项卡数据
 * @param flag   'line':操作了线，若"线路信息"选项卡处于打开状态，刷新该选项卡数据
 * */
function dealTab(flag) {
  if (flag === 'line') {
    window.TopologyGraph.getGraphVm().initLinkTabData();
  }
}

/**
 * 查看资产面板
 * @private
 * @param {mxCell} cell 资产节点
 */
function _viewPanel(cell) {
  if (cell.id != null && undefined !== cell.id) {
    var uuid = cell.id.split('_icon')[0];
    window.open('#/AssetsMonitor/assetsMonitor_list/info/' + uuid + '?noBack=true');
  }
}

/**
 * 右键资产查看事件
 * @private
 * @param {mxCell} cell 资产节点
 */
function _viewMoreIncident(cell) {
  var uuid = cell.id.split('_icon')[0];
  window.open('#/AssetsAll/assets_list/eventInfo/' + uuid);
}

/**
 * 添加调整点
 * @private
 * @param {mxCell} cell 资产间连线
 * @param {Number} index 调整点下标
 */
function _addAdjustPoint(cell, index) {
  if (cell.geometry.points && cell.geometry.points.length > 4) {
    window.TopologyGraph.getGraphVm().$message({
      type: 'warning',
      message: '一条线最多添加5个调整点!'
    });
    return;
  }
  var handler = graph.selectionCellsHandler.getHandler(cell);
  if (handler instanceof window.mxEdgeHandler) {
    var t = graph.view.translate;
    var s = graph.view.scale;
    var dx = t.x;
    var dy = t.y;

    var parent = graph.getModel().getParent(cell);
    var pgeo = graph.getCellGeometry(parent);

    while (graph.getModel().isVertex(parent) && pgeo != null) {
      dx += pgeo.x;
      dy += pgeo.y;

      parent = graph.getModel().getParent(parent);
      pgeo = graph.getCellGeometry(parent);
    }

    var x = Math.round(graph.snap(graph.popupMenuHandler.triggerX / s - dx));
    var y = Math.round(graph.snap(graph.popupMenuHandler.triggerY / s - dy));

    handler.addPointAt(handler.state, x, y);

    var line = {
      uuid: cell.id,
      geo: JSON.stringify(cell.geometry.points),
      topoviewInfoUuid: window.paramSubTopo
    };
    var param = {
      topoviewLine: [JSON.stringify(line)]
    };
    TopologyAjax.ajaxSaveOrUpdateTopo(param, null, function() { // 失败的回调
      _delAdjustPoint(handler, index);
      window.TopologyGraph.getGraphVm().$message.error('添加调整点失败');
    });
  }
}

/**
 * 删除调整点
 * @private
 * @param {mxEdgeHandler} handler 边的处理方法引用
 * @param {Number} index 调整点
 */
function _delAdjustPoint(handler, index) {
  var cell = graph.getSelectionCell();
  var geo = cell.geometry.points.splice(index, 1);
  var points = geo.length > 0 ? geo : '';
  var line = {
    uuid: cell.id,
    geo: JSON.stringify(points),
    topoviewInfoUuid: window.paramSubTopo
  };
  var param = {
    topoviewLine: [JSON.stringify(line)]
  };
  TopologyAjax.ajaxSaveOrUpdateTopo(param, function() {
    handler.removePoint(handler.state, index);
  });
}

/**
 * 改变节点显示名称
 * @private
 * @param {Number} type 0：仅显示IP; 1：仅显示名称
 */
function _changeCellName(type) {
  var lableType = type + 1;
  var topoviewInfo = JSON.stringify({
    uuid: window.paramSubTopo,
    label: lableType
  });
  TopologyAjax.ajaxSaveOrUpdateTopo({
    'topoviewInfo': topoviewInfo
  }, function() {
    window.TopologyGraph.setLabel(lableType);
    _changeParentOfCellName(type, graph.getDefaultParent());
    graph.refresh();
  });
}

/**
 * 通过传入类型和父节点对父节点下节点显示名称进行修改
 * @private
 * @param {Number} type 0：仅显示IP 1：仅显示名称
 * @param {mxCell} parent 父节点
 */
function _changeParentOfCellName(type, parent) {
  var cells = graph.getChildVertices(parent);
  if (cells && cells.length !== 0) {
    for (var i = 0; i < cells.length; i++) {
      if (!cells[i].isGroupCell() && !cells[i].isTextCell()) {
        if (type === 0) {
          cells[i].value = cells[i].hostIp || '';
        } else if (type === 1) {
          cells[i].value = cells[i].busnessName || '';
        } else {
          cells[i].value = (cells[i].hostIp || '') + '-' + (cells[i].busnessName || '');
        }
      } else {
        if (cells[i].isGroupCell()) {
          _changeParentOfCellName(type, cells[i]);
        }
      }
    }
  }
}

/**
 * 建立右键菜单
 * @private
 * @param {Object} menu 右键菜单引用
 * @param {Object} cell 菜单点击时所涉及节点
 * @param {Object} evt 事件对象
 */
function _createPopupMenu(menu, cell, evt) {
  var selectCount = graph.getSelectionCount();
  // 选中的为区域
  if (cell !== null && (cell.isGroupCell() || cell.isTextCell())) {
    if (window.TopologyGraph.getMode() === 2) {
      if (cell.isGroupCell()) {
        menu.addItem('删除区域', null, function() {
          _delCells();
          window.TopologyGraph.getGraphVm().activeTabName = 'fourth';
          window.TopologyGraph.getGraphVm().fourthTabTitle = '拖拽面板';
          window.TopologyGraph.getGraphVm().fourthTabContent = 'dragPanel';
        });
      } else {
        menu.addItem('删除文字', null, function() {
          _delCells();
          window.TopologyGraph.getGraphVm().activeTabName = 'fourth';
          window.TopologyGraph.getGraphVm().fourthTabTitle = '拖拽面板';
          window.TopologyGraph.getGraphVm().fourthTabContent = 'dragPanel';
        });
      }
    }
    return;
  } else {
    if (window.TopologyGraph.getMode() === 2 && selectCount > 0 && cell.isVertex()) {
      menu.addItem('新建区域', null, function() {
        GraphGroup.groupOrUngroup(true);
      });
    }
  }
  // 选中的为流量节点
  if (cell !== null && cell.style === 'flowrate' && selectCount === 1) {
    // menu.addItem('查看端口详情', null,
    //   function() {
    //     _viewIfDetail(cell);
    //   });
    return;
  }

  if (cell !== null) {
    // 在编辑模式下才有删除功能
    if (window.TopologyGraph.getMode() === 2) {
      var opFlag = true;
      if (selectCount > 0) {
        var delCells = graph.getSelectionCells();
        for (var i = 0; i < delCells.length; i++) {
          if (delCells[i].canOperate === 0) {
            opFlag = false;
            break;
          }
        }
        if (opFlag && !cell.isHub()) {
          menu.addItem('删除', null,
            function() {
              _delCells();
            });
        }
      }
    }

    // 选中的为资产节点
    if (!graph.getModel().isEdge(cell) && !cell.isAppCell() && !cell.isSubTopoCell() && !cell.isHub() && selectCount === 1) {
      /* if (typeof cell.serNumType !== 'undefined') {
        menu.addItem('登录', null, function() {
          // SysIntegration.login(cell, cell.serNumType);
        });
        if (cell.serNumType !== 'OMA') {
          menu.addItem('通过OMA运维', null, function() {
            // SysIntegration.operationbyOMA(cell);
          });
        }
      } else {
        menu.addItem('通过OMA运维', null, function() {
          // SysIntegration.operationbyOMA(cell);
        });
      } */
      // 已授权的资产才可以右键操作
      if (judgeOperaAuth(cell)) {
        menu.addItem('查看事件', null, function () {
          _viewMoreIncident(cell);
        });
        menu.addItem('查看面板', null, function () {
          _viewPanel(cell);
        });
        if (window.TopologyGraph.getMode() === 2) {
          menu.addItem('修改图标', null, function () {
            window.TopologyGraph.getGraphVm().modifyIconDialog = true;
            window.TopologyGraph.getGraphVm().modifyCell = cell;
          });
        }
        menu.addItem('Ping', null, function () {
          window.TopologyGraph.getGraphVm().pingIp = cell.hostIp;
          window.TopologyGraph.getGraphVm().pingDialog = true;
        });
        menu.addItem('Trace', null, function () {
          window.TopologyGraph.getGraphVm().traceIp = cell.hostIp;
          window.TopologyGraph.getGraphVm().traceDialog = true;
        });
        menu.addItem('Remote Ping', null, function () {
          window.TopologyGraph.getGraphVm().remoteItCompId = cell.id.split('_icon')[0];
          window.TopologyGraph.getGraphVm().remotePingDialog = true;
        });
      }
    }
    // 应用节点右键操作
    if (!graph.getModel().isEdge(cell) && cell.isAppCell() && cell.canOperate === 1) {
      menu.addItem('查看事件', null, function() {
          _viewMoreIncident(cell);
      });
      menu.addItem('查看面板', null, function() {
          _viewPanel(cell);
      });
      if (window.TopologyGraph.getMode() === 2) {
        menu.addItem('修改图标', null, function() {
          window.TopologyGraph.getGraphVm().modifyIconDialog = true;
          window.TopologyGraph.getGraphVm().modifyCell = cell;
        });
      }
    }
    // 选中的为虚节点
    if (cell.isHub()) {
      if (window.TopologyGraph.getMode() === 2 && selectCount === 1) {
        menu.addItem('删除', null, function() {
          _delCells();
        });
        menu.addItem('修改图标', null, function() {
          window.TopologyGraph.getGraphVm().modifyIconDialog = true;
          window.TopologyGraph.getGraphVm().modifyCell = cell;
        });
        menu.addItem('自定义节点', null, function() {
          window.TopologyGraph.getGraphVm().customNodeDialog = true;
          window.TopologyGraph.getGraphVm().customCells = [cell];
          window.TopologyGraph.getGraphVm().customEdit = true;
          window.TopologyGraph.getGraphVm().editData = { hostIp: cell.hostIp, busnessName: cell.busnessName };
        });
      }
    }
    // 选中的为子拓扑
    if (cell.isSubTopoCell()) {
      if (window.TopologyGraph.getMode() === 1 && selectCount === 1) {
        menu.addItem('查看子拓扑', null, function() {
          window.TopologyGraph.getGraphVm().$router.push('/AssetsMonitor/assetsMonitor_topo/topo_detail/' + cell.underCell.id);
        });
      }
      if (window.TopologyGraph.getMode() === 2 && selectCount === 1) {
        menu.addItem('修改图标', null, function() {
          window.TopologyGraph.getGraphVm().modifyIconDialog = true;
          window.TopologyGraph.getGraphVm().modifyCell = cell;
        });
      }
    }
    // 选中的是资产间连线
    var isWaypoint = false;
    var sCell = graph.getSelectionCell();
    if (sCell !== null && graph.getModel().isEdge(sCell) && selectCount === 1 && window.TopologyGraph.getMode() === 2) {
      var handler = graph.selectionCellsHandler.getHandler(sCell);
      if (handler instanceof window.mxEdgeHandler && handler.bends !== null && handler.bends.length > 2) {
        var index = handler.getHandleForEvent(graph.updateMouseEvent(new window.mxMouseEvent(evt)));
        isWaypoint = index > 0 && index < handler.bends.length;
      }
      if (isWaypoint) {
        menu.addItem('删除调整点', null, function() {
          _delAdjustPoint(handler, index);
        });
      } else {
        menu.addItem('添加调整点', null, function() {
          _addAdjustPoint(sCell, index);
        });
      }
      if (!sCell.isAppCell()) {
        menu.addItem('修改对应端口', null, function() {
          window.TopologyGraph.getGraphVm().lineConnectDialogFlag = true;
          window.TopologyGraph.getGraphVm().modifyCell = sCell;
          window.TopologyGraph.getGraphVm().connectLineType = '1';
        });
      }
    }
  }
  // 未选中任何cell
  if (cell === null) {
    if (window.TopologyGraph.getGraphVm().$router.currentRoute.name === 'assetsMonitor_topologyView') { // 首页的拓扑不显示"全选"
      menu.addItem('全选', null, function() {
        var parent = graph.getDefaultParent();
        graph.selectAll(parent);
      });
    }
    var submenu = menu.addItem('节点显示名称', null, null);
    menu.addItem('仅显示IP', null, function() {
      _changeCellName(0);
    }, submenu);
    menu.addItem('仅显示资产名称', null, function() {
      _changeCellName(1);
    }, submenu);
    menu.addItem('同时显示IP和资产名称', null, function() {
      _changeCellName(2);
    }, submenu);
    if (window.TopologyGraph.getMode() === 2) {
      menu.addItem('拓扑图背景', null, function() {
        // BgModifyDialog.open(graph);
        window.TopologyGraph.getGraphVm().backgroundModifyIconDialog = true;
      });
    }
  }
}

/**
 * 隐藏菜单
 * @public
 */
function hide() {
  graph.popupMenuHandler.hideMenu();
}

// 工具方法--------------------
function includePointCell(delCells) {
  $.each(delCells, function(index, item) {
    if (item.isIconVertex() && item.underCell) {
      delCells.push(item.underCell);
    }
  });
}
// 如果登陆的是运维人员，已授权的资产才可以进行右键操作。若不是运维人员，右键操作不做限制
function judgeOperaAuth(cell) {
  if (roleName !== '运维人员' || (roleName === '运维人员' && authItcomps.some(itcomp => itcomp === cell.underCell.id))) {
    return true;
  }
  return false;
}

export default {
  init: init,
  hide: hide
};
