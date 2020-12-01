/**
 * Created by dingyf on 2017/6/16.
 */
/**
 * @fileOverview 此文件中包含KeyHandler对象，该对象为拓扑图提供键盘按键扩展，扩展后可以对节点进行微调整
 * @author <a href="mailto:dingyf@suninfo.com">dingyf</a>
 * @version 1.0.0
 */

/**
 * 用于完成拓扑图的微调整。\n
 * 扩展后可以通过键盘上的上下左右键进行为调整，每次按照方向移动一个单位\n
 * 拓扑图中区域内节点可以拖出的按键操作不在此处
 * @class 拓扑图按键控制器
 */
/**
 * 按键回调函数
 * @param  {Number} keyCode 按键码
 * @private
 */
var _nudge = function(keyCode) {
  var graph = window.TopologyGraph.getGraph();
  if (!graph.isSelectionEmpty()) {
    var dx = 0;
    var dy = 0;

    if (keyCode === 37) {
      dx = -1;
    } else if (keyCode === 38) {
      dy = -1;
    } else if (keyCode === 39) {
      dx = 1;
    } else if (keyCode === 40) {
      dy = 1;
    }

    graph.moveCells(graph.getSelectionCells(), dx, dy);
  }
};

/**
 * graph图绑定回调函数
 * @public
 */
function bind() {
  var keyHandler = new window.mxKeyHandler(window.TopologyGraph.getGraph());
  keyHandler.enter = function() {};
  keyHandler.bindKey(37, function() {
    _nudge(37);
  });
  keyHandler.bindKey(38, function() {
    _nudge(38);
  });
  keyHandler.bindKey(39, function() {
    _nudge(39);
  });
  keyHandler.bindKey(40, function() {
    _nudge(40);
  });
}

export default {
  bind: bind
};
