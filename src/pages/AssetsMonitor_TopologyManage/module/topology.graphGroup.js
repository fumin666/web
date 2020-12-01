/**
 * Created by dingyf on 2017/6/19.
 */
import TopologyAjax from './topology.ajax';

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
 * 添加一个默认分组,并添加分组的函数
 * @public
 * @param {mxEditor} ed 图编辑器实例
 */
function setDefaltGroup(ed) {
  editor = ed;
  graph = ed.graph;

  var group = new window.mxCell('', new window.mxGeometry(), 'group1');
  group.setVertex(true);
  group.setConnectable(false);
  editor.defaultGroup = group;
  editor.groupBorderSize = 30;
  // 设置不可从父元素中移出cell
  graph.graphHandler.setRemoveCellsFromParent(false);
  graph.setDropEnabled(true);
  _removeCellFromGroup();
}

/**
 * 新增区域后更新区域下子cell的数据
 * @param group
 * */
function updateAddGroupChild(group) {
  var childCells = group.children;
  var vertexArr = [];
  for (var i = 0, l = childCells.length; i < l; i++) {
    var item = childCells[i];
    if (!item.isPointCell()) {
      vertexArr.push(JSON.stringify({
        uuid: item.uuid,
        parent: group.id,
        geo: JSON.stringify(item.parseGeo()),
        topoviewInfoUuid: window.paramSubTopo
      }));
    }
  }
  var param = {
    'topoviewNode': vertexArr
  };
  TopologyAjax.ajaxSaveOrUpdateTopo(param);
}

/**
 * 设置新建区域对话框、修改区域名称
 * @private
 * @param {mxCell} cell
 */
function _setNewGroup(cell, flag) {
  var group = new window.mxCell('', new window.mxGeometry(), 'group');
  var geo = group.getGeometry();
  var newGeo = new window.mxGeometry(geo.x, geo.y, 9000, 9000);
  group.setGeometry(newGeo);
  group.setVertex(true);
  group.setConnectable(false);
  editor.defaultGroup = group;
  editor.groupBorderSize = 30;
  if (_checkCellForGroup()) {
    editor.execute('group');
    var groupBack = graph.getSelectionCell();
    var param = {
      style: groupBack.style,
      geo: JSON.stringify(groupBack.parseGeo()),
      topoviewInfoUuid: window.paramSubTopo
    };
    TopologyAjax.ajaxAddNode(param, 'other', function(result) {
      if (result) {
        var oldId = groupBack.id;
        groupBack.id = result;
        groupBack.uuid = result;
        graph.getModel().cells[result] = groupBack;
        delete graph.getModel().cells[oldId];
        updateAddGroupChild(groupBack);
      } else {
        graph.removeCells();
        window.TopologyGraph.getGraphVm().$message.error('新增区域失败');
      }
    });
  } else {
    window.TopologyGraph.getGraphVm().$message({
      message: '图中不允许出现二级区域！',
      type: 'warning'
    });
    return false;
  }
}

/**
 * 检查是否可建区域
 * @private
 */
function _checkCellForGroup() {
  var cells = graph.getSelectionCells();
  for (var i = 0; i < cells.length; i++) {
    if (cells[i].parent.style === 'group' || cells[i].style === 'group') {
      return false;
    }
  }
  return true;
}

/**
 * 从组中移除节点的方法
 * @private
 */
function _removeCellFromGroup() {
  // 重写 定义是否可以拖动出来
  graph.graphHandler.isRemoveCellsFromParent = function() {
    return true;
  };
}

/**
 * 新建或删除区域
 * @public
 */
function groupOrUngroup(flag) {
  var cell = editor.graph.getSelectionCell();
  if (flag) { // 新建
    if (typeof cell === 'undefined') {
      window.TopologyGraph.getGraphVm().$message({
        message: '未选中任何节点无法进行操作，请选择节点',
        type: 'warning'
      });
    } else {
      _setNewGroup(cell, true);
    }
  } else { // 删除
    if (cell !== null && cell.style.indexOf('group') !== -1) {
      if (cell.children === null || cell.children.length === 0) {
        graph.removeCells([cell]);
      } else {
        editor.execute('ungroup', cell);
      }
    }
  }
}

export default {
  setDefaltGroup: setDefaltGroup,
  groupOrUngroup: groupOrUngroup
};
