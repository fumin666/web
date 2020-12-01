/**
 * Created by dingyf on 2017/6/16.
 */
import TopologyAjax from './topology.ajax';

var graph = null;

/**
 * 拖动调整点事件
 * */
function addChangeListener() {
  graph.getModel().addListener(window.mxEvent.CHANGE, window.mxUtils.bind(this, function(model, event) {
    var changeList = event.getProperty('changes');
    if (event.getProperty('edit').undone) { return; } // 撤销事件不处理
    if (changeList.length === 1 && changeList[0] instanceof window.mxGeometryChange) {
      var cell = changeList[0].cell;
      if (cell.isEdge()) { // 拖动调整点失败
        var line = {
          uuid: cell.id,
          geo: JSON.stringify(cell.geometry.points),
          style: cell.style,
          topoviewInfoUuid: window.paramSubTopo
        };
        var param = {
          topoviewLine: [JSON.stringify(line)]
        };
        console.log(param);
        TopologyAjax.ajaxSaveOrUpdateTopo(param, null, function() { // 失败的回调
          window.TopologyGraph.getEditor().undo();
          window.TopologyGraph.getGraphVm().$message.error('拖动调整点失败');
        });
      }
    }
  }));
}

/**
 * 区域改变大小的事件
 * */
function addResizeDomainEvent() {
  graph.addListener(window.mxEvent.RESIZE_CELLS, window.mxUtils.bind(this, function(sender, event) {
    var cell = event.getProperty('cells')[0];
    if (cell.isGroupCell()) {
      var domain = {
        uuid: cell.uuid,
        style: cell.style,
        geo: JSON.stringify(cell.parseGeo()),
        topoviewInfoUuid: window.paramSubTopo
      };
      var param = {
        topoviewDomain: JSON.stringify([domain])
      };
      TopologyAjax.ajaxSaveOrUpdateTopo(param, null, function() { // 失败的回调
        window.TopologyGraph.getEditor().undo();
        window.TopologyGraph.getGraphVm().$message.error('改变大小失败');
      });
    }
  }));
}

/**
 * 拖拽节点的事件
 * */
function addDragCellEvent() {
  graph.addListener(window.mxEvent.MOVE_CELLS, window.mxUtils.bind(this, function(sender, event) {
    if (!(event.getProperty('event') instanceof MouseEvent)) { return; } // 如果不是鼠标拖动cell，而是切换布局,不触发下面的步骤
    var dx = event.getProperty('dx');
    var dy = event.getProperty('dy');
    var cells = event.getProperty('cells');
    var target = event.getProperty('target');
    if (target) {
      if (target.isGroupCell()) { // 拖进了区域
        if (hasGroupCell(cells)) {
          window.TopologyGraph.getGraphVm().$message({
            message: '不允许出现嵌套区域！',
            type: 'warning'
          });
          return;
        } else {
          var nodeArr = [];
          var domainArr = [];
          for (var i = 0, l = cells.length; i < l; i++) {
            var item = cells[i];
            if (item.isIconVertex() || item.isTextCell()) {
              var node = {
                uuid: item.uuid,
                parent: target.uuid,
                geo: JSON.stringify(item.parseGeo()),
                topoviewInfoUuid: window.paramSubTopo
              };
              nodeArr.push(node);
            }
            if (item.isTextCell()) {
              var obj = {
                uuid: item.uuid,
                parent: target.uuid,
                geo: JSON.stringify(item.parseGeo()),
                topoviewInfoUuid: window.paramSubTopo
              };
              domainArr.push(obj);
            }
          }
          var param = {};
          if (nodeArr.length > 0) {
            param.topoviewNode = JSON.stringify(nodeArr);
          }
          if (domainArr.length > 0) {
            param.topoviewDomain = JSON.stringify(domainArr);
          }
          TopologyAjax.ajaxSaveOrUpdateTopo(param, null, function() { // 失败的回调
            window.TopologyGraph.getEditor().undo();
            window.TopologyGraph.getGraphVm().$message.error('拖拽失败');
          });
        }
      } else { // 拖出了区域
        if (!fromDragTab(cells)) {
          let nodeArr = [];
          let domainArr = [];
          for (let i = 0; i < cells.length; i++) {
            let item = cells[i];
            if (item.isIconVertex()) {
              var geo = item.parseGeo();
              let node = {
                uuid: item.uuid,
                parent: -1,
                geo: JSON.stringify(geo),
                topoviewInfoUuid: window.paramSubTopo
              };
              nodeArr.push(node);
            }
            if (item.isTextCell()) {
              let obj = {
                uuid: item.uuid,
                parent: -1,
                geo: JSON.stringify(item.parseGeo()),
                topoviewInfoUuid: window.paramSubTopo
              };
              domainArr.push(obj);
            }
          }
          let param = {};
          if (nodeArr.length > 0) {
            param.topoviewNode = JSON.stringify(nodeArr);
          }
          if (domainArr.length > 0) {
            param.topoviewDomain = JSON.stringify(domainArr);
          }
          console.log(param);
          TopologyAjax.ajaxSaveOrUpdateTopo(param, null, function() { // 失败的回调
            window.TopologyGraph.getEditor().undo();
            window.TopologyGraph.getGraphVm().$message.error('拖拽失败');
          });
        }
      }
    } else { // 单纯的拖拽
      let vertexArr = [];
      let domainArr = [];
      for (let i = 0, l = cells.length; i < l; i++) {
        let item = cells[i];
        if (item.isVertex()) {
          if (item.isGroupCell() || item.isTextCell()) {
            let obj = {
              uuid: item.uuid,
              geo: JSON.stringify(item.parseGeo()),
              topoviewInfoUuid: window.paramSubTopo
            };
            domainArr.push(obj);
          } else {
            let obj = {
              uuid: item.uuid,
              geo: JSON.stringify(item.parseGeo()),
              topoviewInfoUuid: window.paramSubTopo
            }
            vertexArr.push(obj);
          }
        }
      }
      let param = {};
      if (vertexArr.length > 0) {
        param.topoviewNode = JSON.stringify(vertexArr);
      }
      if (domainArr.length > 0) {
        param.topoviewDomain = JSON.stringify(domainArr);
      }
      TopologyAjax.ajaxSaveOrUpdateTopo(param, null, function() { // 失败的回调
        graph.moveCells(cells, -dx, -dy);
        window.TopologyGraph.getGraphVm().$message.error('拖拽失败');
      });
    }
  }));
}

/**
 * 更改文字节点值的事件
 * */
function addValueChangeEvent() {
  graph.addListener(window.mxEvent.LABEL_CHANGED, window.mxUtils.bind(this, function(sender, event) {
    var cell = event.getProperty('cell');
    if (cell.isTextCell()) {
      if (event.getProperty('old') !== event.getProperty('value')) {
        var text = {
          uuid: cell.uuid,
          value: cell.value,
          topoviewInfoUuid: window.paramSubTopo
        };
        var param = {
          topoviewDomain: JSON.stringify([text])
        }
        TopologyAjax.ajaxSaveOrUpdateTopo(param, null, function() { // 失败的回调
          window.TopologyGraph.getEditor().undo();
          window.TopologyGraph.getGraphVm().$message.error('修改文字失败');
        });
      }
    }
  }));
}

/**
 * 节点对齐事件
 * */
function addAlignEvent() {
  graph.addListener(window.mxEvent.ALIGN_CELLS, window.mxUtils.bind(this, function(sender, event) {
    var cells = event.getProperty('cells');
    var vertexArr = [];
    for (var i = 0; i < cells.length; i++) {
      var cell = cells[i];
      if (cell.isIconVertex()) {
        cell.underCell.geometry.x = cell.geometry.x + cell.geometry.width / 2;
        cell.underCell.geometry.y = cell.geometry.y + cell.geometry.height / 2;
        vertexArr.push({
          uuid: cell.uuid,
          geo: JSON.stringify(cell.parseGeo()),
          topoviewInfoUuid: window.paramSubTopo
        });
      }
    }
    graph.refresh();
    var param = {
      topoviewNode: JSON.stringify(vertexArr)
    };
    TopologyAjax.ajaxSaveOrUpdateTopo(param, null, function() { // 失败的回调
      window.TopologyGraph.getGraphVm().$message.error('保存失败');
    });
  }));
}

/**
 * 连线事件
 * */
function connectLineEvent() {
  graph.addListener(window.mxEvent.CELL_CONNECTED, function (sender, evt) {
    if (!window.TopologyGraph.getLoading()) {
      let edge = evt.getProperty('edge');
      if (!edge.source || !edge.target) {
        return;
      }
      if (edge.source.isIconVertex()) {
        edge.source = edge.source.underCell;
      }
      if (edge.target.isIconVertex()) {
        edge.target = edge.target.underCell;
      }
      graph.orderCells(true, [edge]);
      window.TopologyGraph.orderGroup();
      window.TopologyGraph.getGraphVm().lineConnectDialogFlag = true;
      window.TopologyGraph.getGraphVm().modifyCell = edge;
      window.TopologyGraph.getGraphVm().connectLineType = '0';
    }
  });
}

// 工具方法--------------------------------------------
// 判断拖动的节点中是否包含区域
function hasGroupCell(cells) {
  var result = false;
  for (var i = 0; i < cells.length; i++) {
    if (cells[i].isGroupCell()) {
      result = true;
    }
  }
  return result;
}

// 判断是否从拖拽面板拖拽而来
function fromDragTab(cells) {
  var result = false;
  for (var i = 0; i < cells.length; i++) {
    if (!cells[i].uuid) { // 因为此时没调接口生成uuid，所以可通过这个判断
      result = true;
    }
  }
  return result;
}

function init(g) {
  graph = g;
  addResizeDomainEvent();
  addDragCellEvent();
  addChangeListener();
  addValueChangeEvent();
  addAlignEvent();
  connectLineEvent();
}

export default {
  init: init
};
