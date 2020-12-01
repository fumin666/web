/**
 * 对给定的图对象进行了扩展，使给定的图实例可以实现以下功能
 * 增加两个标签,用于显示未处理告警;
 * 重写获取拖动目标函数,使得图上的节点无法拖到边和区域；
 * 覆盖graph.panningHandler的mouseDown、mouseUp事件在mouseDown上面增加抓手型光标，释放后恢复默认手型光标
 * 为图增加了自定义滚动事件和双击事件，滚动鼠标放大缩小图，双击图上某个位置可以放大并位移
 * 在图上扩展了九个点，用于表示节点上有多个port（端口）可连接
 * @class 图功能扩展
 */

import EdgeExtends from './topology.edgeExtends'
import GraphConfig from './topology.graphConfig'

let $ = window.$;

/**
 * 第二个标签是否显示
 * @private
 */
let secondLabelVisible = false;

/**
 * 所有第二个标签要显示的数据
 * @private
 */
let secondLabelData = null;

/**
 * 鼠标滚动标志位
 * @private
 */
let mouseWheelFlag = true;

let edgeExtends = null;

/**
 * 为提供的图实例做扩展
 * @public
 * @param {mxGraph} graph 拓扑图实例
 */
function extend(graph) {
  _setSecondLabel(graph);
  _setNewPanningHandler(graph);
  _addZoomEx(graph);
  _expandModel(graph);
  _expandResizable(graph);
  _expandDropTarget(graph);
  _hoverEvent(graph);
  _expandLayout();
  _expandOutline();
  _expandPaintShape();
  _expandValidDropTarget(graph);
  edgeExtends = EdgeExtends.init();
}

function cellFilter(cells) {
  var cellAry = null;
  if (cells != null) {
    cellAry = [];
    for (var i = 0,
           length = cells.length; i < length; i++) {
      if (!cells[i].isPointCell()) {
        cellAry.push(cells[i])
      }
    }
  }
  return cellAry;
}

/**
 * 扩展拖拽目标检测方法，禁止区域拖动到另一个区域中
 * @private
 */
function _expandValidDropTarget(graph) {
  var validDropTarget = graph.isValidDropTarget;
  graph.isValidDropTarget = function(target, cells, evt) {
    if (target != null) {
      for (var i = cells.length - 1; i >= 0; i--) {
        if (cells[i].isGroupCell() && target.isGroupCell()) {
          return false;
        }
      }
    }
    return validDropTarget.apply(this, arguments);
  };
}
/**
 * 扩展拓扑model
 * @param graph
 * @private
 */
function _expandModel(graph) {
  graph.getModel().isVertex = function(cell) {
    return (cell != null) ? (cell.isVertex() && !cell.isPointCell()) : false;
  };

  graph.getModel().getChildren = function(cell) {
    return (cell != null) ? cellFilter(cell.children) : null;
  };
}

/**
 * 是否可以缩放
 * @param graph
 * @private
 */
function _expandResizable(graph) {
  var oldResizable = graph.isCellResizable;
  graph.isCellResizable = function(cell) {
    var model = graph.getModel();
    // var style = graph.getCellStyle(cell);
    if (model.isVertex(cell) && cell.isGroupCell()) {
      return true;
    } else if (model.isVertex(cell) && cell.isTextCell()) {
      return true;
    } else {
      return oldResizable.apply(this, arguments);
    }
  };
}

/**
 * 扩展可拖拽目标
 * @param graph
 * @private
 */
function _expandDropTarget(graph) {
  let oldIsValidDropTarget = graph.isValidDropTarget;
  graph.isValidDropTarget = function(cell, cells, evt) {
    if (cell !== null) {
      if (cell.isGroupCell()) {
        return true;
      } else {
        return false;
      }
    }
    return oldIsValidDropTarget.apply(this, arguments);
  };
}

/**
 * 覆写拓扑布局
 * 包括环形布局与径向树布局
 * @private
 */
function _expandLayout() {
  // 环形布局的半径
  window.mxCircleLayout.prototype.getRadius = function(count, max) {
    return this.radius;
  };
  // 由于mxgraph有问题，故覆盖径向布局方法
  window.mxRadialTreeLayout.prototype.execute = function(parent, root) {
    this.parent = parent;

    this.useBoundingBox = false;
    // this.edgeRouting = false;
    // this.levelDistance = 120;
    // this.nodeDistance = 10;
    // this.horizontal = false;
    window.mxCompactTreeLayout.prototype.execute.apply(this, arguments);

    var bounds = null;
    var rootBounds = this.getVertexBounds(this.root);
    this.centerX = rootBounds.x + rootBounds.width / 2;
    this.centerY = rootBounds.y + rootBounds.height / 2;

    // Calculate the bounds of the involved vertices directly from the values set in the compact tree
    for (var vertex in this.visited) {
      var vertexBounds = this.getVertexBounds(this.visited[vertex]);
      bounds = (bounds != null) ? bounds : vertexBounds.clone();
      bounds.add(vertexBounds);
    }

    this.calcRowDims([this.node], 0);

    var maxLeftGrad = 0;
    var maxRightGrad = 0;

    // Find the steepest left and right gradients
    for (let i = 0; i < this.row.length; i++) {
      var leftGrad = (this.centerX - this.rowMinX[i] - this.nodeDistance) / this.rowRadi[i];
      var rightGrad = (this.rowMaxX[i] - this.centerX - this.nodeDistance) / this.rowRadi[i];

      maxLeftGrad = Math.max(maxLeftGrad, leftGrad);
      maxRightGrad = Math.max(maxRightGrad, rightGrad);
    }

    // Extend out row so they meet the maximum gradient and convert to polar co-ords
    for (let i = 0; i < this.row.length; i++) {
      var xLeftLimit = this.centerX - this.nodeDistance - maxLeftGrad * this.rowRadi[i];
      var xRightLimit = this.centerX + this.nodeDistance + maxRightGrad * this.rowRadi[i];
      var fullWidth = xRightLimit - xLeftLimit;

      for (var j = 0; j < this.row[i].length; j++) {
        var row = this.row[i];
        var node = row[j];
        let vertexBounds = this.getVertexBounds(node.cell);
        var xProportion = (vertexBounds.x + vertexBounds.width / 2 - xLeftLimit) / (fullWidth);
        var theta = 2 * Math.PI * xProportion;
        node.theta = theta;
      }
    }

    // Post-process from outside inwards to try to align parents with children
    for (let i = this.row.length - 2; i >= 0; i--) {
      let row = this.row[i];

      for (let j = 0; j < row.length; j++) {
        let node = row[j];
        var child = node.child;
        var counter = 0;
        var totalTheta = 0;

        while (child != null) {
          totalTheta += child.theta;
          counter++;
          child = child.next;
        }

        if (counter > 0) {
          var averTheta = totalTheta / counter;

          if (averTheta > node.theta && j < row.length - 1) {
            var nextTheta = row[j + 1].theta;
            node.theta = Math.min(averTheta, nextTheta - Math.PI / 10);
          } else if (averTheta < node.theta && j > 0) {
            var lastTheta = row[j - 1].theta;
            node.theta = Math.max(averTheta, lastTheta + Math.PI / 10);
          }
        }
      }
    }

    // Set locations
    for (let i = 0; i < this.row.length; i++) {
      for (let j = 0; j < this.row[i].length; j++) {
        let row = this.row[i];
        let node = row[j];
        let vertexBounds = this.getVertexBounds(node.cell);
        this.setVertexLocation(node.cell, this.centerX - vertexBounds.width / 2 + this.rowRadi[i] * Math.cos(node.theta), this.centerY - vertexBounds.height / 2 + this.rowRadi[i] * Math.sin(node.theta));
      }
    }
  };
}

/**
 * 覆写缩略图update方法
 * 为提高精度，将100变为10000
 * @private
 */
function _expandOutline() {
  /**
   * Updates the outline.
   */
  window.mxOutline.prototype.update = function(revalidate) {
    if (this.source != null && this.outline != null) {
      var sourceScale = this.source.view.scale;
      var scaledGraphBounds = this.getSourceGraphBounds();
      var unscaledGraphBounds = new window.mxRectangle(scaledGraphBounds.x / sourceScale + this.source.panDx, scaledGraphBounds.y / sourceScale + this.source.panDy, scaledGraphBounds.width / sourceScale, scaledGraphBounds.height / sourceScale);

      var unscaledFinderBounds = new window.mxRectangle(0, 0, this.source.container.clientWidth / sourceScale, this.source.container.clientHeight / sourceScale);

      var union = unscaledGraphBounds.clone();
      union.add(unscaledFinderBounds);

      // Zooms to the scrollable area if that is bigger than the graph
      var size = this.getSourceContainerSize();
      var completeWidth = Math.max(size.width / sourceScale, union.width);
      var completeHeight = Math.max(size.height / sourceScale, union.height);

      var availableWidth = Math.max(0, this.outline.container.clientWidth - this.border);
      var availableHeight = Math.max(0, this.outline.container.clientHeight - this.border);

      var outlineScale = Math.min(availableWidth / completeWidth, availableHeight / completeHeight);
      var scale = Math.floor(outlineScale * 10000) / 10000;
      if (scale > 0) {
        if (this.outline.getView().scale !== scale) {
          this.outline.getView().scale = scale;
          revalidate = true;
        }

        var navView = this.outline.getView();

        if (navView.currentRoot !== this.source.getView().currentRoot) {
          navView.setCurrentRoot(this.source.getView().currentRoot);
        }

        var t = this.source.view.translate;
        var tx = t.x + this.source.panDx;
        var ty = t.y + this.source.panDy;

        var off = this.getOutlineOffset(scale);

        if (off != null) {
          tx += off.x;
          ty += off.y;
        }

        if (unscaledGraphBounds.x < 0) {
          tx = tx - unscaledGraphBounds.x;
        }
        if (unscaledGraphBounds.y < 0) {
          ty = ty - unscaledGraphBounds.y;
        }

        if (navView.translate.x !== tx || navView.translate.y !== ty) {
          navView.translate.x = tx;
          navView.translate.y = ty;
          revalidate = true;
        }

        // Prepares local variables for computations
        var t2 = navView.translate;
        scale = this.source.getView().scale;
        var scale2 = scale / navView.scale;
        var scale3 = 1.0 / navView.scale;
        var container = this.source.container;

        // Updates the bounds of the viewrect in the navigation
        this.bounds = new window.mxRectangle((t2.x - t.x - this.source.panDx) / scale3, (t2.y - t.y - this.source.panDy) / scale3, (container.clientWidth / scale2), (container.clientHeight / scale2));

        // Adds the scrollbar offset to the finder
        this.bounds.x += this.source.container.scrollLeft * navView.scale / scale;
        this.bounds.y += this.source.container.scrollTop * navView.scale / scale;

        let b = this.selectionBorder.bounds;

        if (b.x !== this.bounds.x || b.y !== this.bounds.y || b.width !== this.bounds.width || b.height !== this.bounds.height) {
          this.selectionBorder.bounds = this.bounds;
          this.selectionBorder.redraw();
        }

        // Updates the bounds of the zoom handle at the bottom right
        let bds = this.sizer.bounds;
        var b2 = new window.mxRectangle(this.bounds.x + this.bounds.width - bds.width / 2, this.bounds.y + this.bounds.height - bds.height / 2, bds.width, bds.height);

        if (bds.x !== b2.x || bds.y !== b2.y || bds.width !== b2.width || bds.height !== b2.height) {
          this.sizer.bounds = b2;

          // Avoids update of visibility in redraw for VML
          if (this.sizer.node.style.visibility !== 'hidden') {
            this.sizer.redraw();
          }
        }

        if (revalidate) {
          this.outline.view.revalidate();
        }
      }
    }
  };
}

/**
 * 滚动到固定坐标位置
 * @private
 * @param {mxGraph} graph 拓扑图实例
 * @param {Number} x 坐标x
 * @param {Number} y 坐标y
 */
/*
function _scrollTo(graph, x, y) {
 var tranX = -graph.view.translate.x;
 var tranY = -graph.view.translate.y;
 var w = graph.container.clientWidth;
 var h = graph.container.clientHeight;
 var bounds = new mxRectangle(tranX + x, tranY + y, 10, 10);
 // 10 is arbitrary
 bounds.x = bounds.getCenterX() - w / 2;
 bounds.width = w;
 bounds.y = bounds.getCenterY() - h / 2;
 bounds.height = h;
 graph.scrollRectToVisible(bounds);
 }
*/

/**
 * 鼠标滚动缩放与双击放大扩展
 * @private
 * @param {mxGraph} graph 拓扑图实例
 */
function _addZoomEx(graph) {
  _addMouseWheelListener();
}

/**
 * 添加鼠标滚动事件
 * 在弹出窗口的情况下，无法滚动
 * mouseWheelFlag不为true时无法滚动
 * @private
 */
function _addMouseWheelListener() {
  window.mxEvent.addMouseWheelListener(function(evt, up) {
    var source = window.mxEvent.getSource(evt);
    if (source.nodeName === 'svg' && mouseWheelFlag) {
      if (up) {
        window.TopologyGraph.getGraph().zoomIn();
      } else {
        window.TopologyGraph.getGraph().zoomOut();
      }
      var scale = window.TopologyGraph.getGraph().view.getScale();
      window.TopologyGraph.getGraphVm().currentScale = scale;
    }
  });
}

/**
 * 设置鼠标滚动标志
 * @public
 */
function setMouseWheelFlag(flag) {
  mouseWheelFlag = flag;
}

/**
 * 覆盖拖动mouseDown、mouseUp事件
 * @private
 * @param {mxGraph} graph 拓扑图实例
 */
function _setNewPanningHandler(graph) {
  var panningHandler = graph.panningHandler;
  var oldMouseDown = panningHandler.mouseDown;
  panningHandler.mouseDown = function(sender, me) {
    if (panningHandler.useLeftButtonForPanning) {
      $('#topology_graph').css('cursor', 'url(' + window.mxBasePath + '/images/closedhand.cur) 8 8, move');
    } else {
      $('#topology_graph').css('cursor', 'default');
    }
    return oldMouseDown.apply(this, arguments);
  };
  var oldMouseUp = panningHandler.mouseUp;
  panningHandler.mouseUp = function(sender, me) {
    if (panningHandler.useLeftButtonForPanning) {
      $('#topology_graph').css('cursor', 'url(' + window.mxBasePath + '/images/openhand.cur) 8 8, default');
    } else {
      $('#topology_graph').css('cursor', 'default');
    }
    return oldMouseUp.apply(this, arguments);
  };

  graph.panningHandler = panningHandler;
}

/**
 * 设置第二个标签
 * @private
 * @param {mxGraph} graph 拓扑图实例
 */
function _setSecondLabel(graph) {
  secondLabelVisible = false;
  // 返回第二个标签字符串
  graph.getSecondLabel = function(cell) {
    var rValue = null;
    if (secondLabelData != null && !this.model.isEdge(cell)) {
      $.each(secondLabelData,
        function(key, value) {
          if (cell.id === key + '_icon') {
            rValue = value;
          }
        });
    }
    return rValue;
  };

  var relativeChildVerticesVisible = true;

  // Overrides method to hide relative child vertices
  graph.isCellVisible = function(cell) {
    return !this.model.isVertex(cell) || cell.geometry == null || !cell.geometry.relative || cell.geometry.relative === relativeChildVerticesVisible;
  };

  // 在图形的边上添加数字标签
  var createShape = graph.cellRenderer.createShape;
  graph.cellRenderer.createShape = function(state) {
    if (secondLabelVisible && !state.cell.geometry.relative) {
      var secondLabel = graph.getSecondLabel(state.cell);
      if (secondLabel != null && state.secondLabel == null && !graph.isSwimlane(state.cell)) {
        state.secondLabel = new window.mxText('<div>' + secondLabel + '</div>', new window.mxRectangle(), window.mxConstants.ALIGN_LEFT, window.mxConstants.ALIGN_BOTTOM, '#ffffff', 'Arial', 12, null, null, null, null, null, null, null, '#ff0000', '#cc0000', null, null, null, 4);
        state.secondLabel.init(state.view.getDrawPane());
      }
    }
    return createShape.apply(this, arguments);
  };
  // 当一个节点移动或改变大小后，重绘图形边上添加的数字标签
  var redraw = graph.cellRenderer.redraw;
  graph.cellRenderer.redraw = function(state) {
    redraw.apply(this, arguments);

    if (state.shape != null && typeof state.secondLabel !== 'undefined') {
      var scale = graph.getView().getScale();
      var bounds = new window.mxRectangle(state.x + state.width - 8 * scale, state.y + 8 * scale, 0, 0);
      state.secondLabel.value = graph.getSecondLabel(state.cell);
      state.secondLabel.scale = scale;
      state.secondLabel.bounds = bounds;
      state.secondLabel.redraw();
    }
  };

  // 销毁图形边上的数字标签
  var destroy = graph.cellRenderer.destroy;
  graph.cellRenderer.destroy = function(state) {
    destroy.apply(this, arguments);

    if (typeof state.secondLabel !== 'undefined' && state.secondLabel != null) {
      state.secondLabel.destroy();
      state.secondLabel = null;
    }
  };
}

/**
 * 节点扩展函数（是否为子拓扑、是否为Hub）
 * @private
 */
function mxCellEx() {
  /**
   * 是否为应用节点
   */
  window.mxCell.prototype.isAppCell = function() {
    if (typeof this.isTopoApp !== 'undefined' && this.isTopoApp === 1) {
      return true;
    } else {
      return false;
    }
  };

  /**
   * 子拓扑扩展（是否为子拓扑）
   * @global
   */
  window.mxCell.prototype.isSubTopoCell = function() {
    if (this.type && this.type === 3) {
      return true;
    }
    return false;
  };
  /**
   * Hub扩展（是否为虚节点）
   * @global
   */
  window.mxCell.prototype.isHub = function() {
    var flag = false;
    if (this.funcType && this.funcType === 'hub') {
      flag = true;
    }
    return flag;
  };

  /**
   * 是否为pointCell
   * @global
   */
  window.mxCell.prototype.isPointCell = function() {
    var flag = false;
    if (this.style && this.style.indexOf('pointCell') !== -1) {
      flag = true;
    }
    return flag;
  };

  /**
   * 是否为iconCell
   * @global
   */
  window.mxCell.prototype.isIconVertex = function() {
    return typeof this.style !== 'undefined' && typeof this.underCell !== 'undefined' && this.style.indexOf('image;image') !== -1;
  };

  /**
   * 是否为区域
   * @global
   */
  window.mxCell.prototype.isGroupCell = function() {
    var flag = false;
    if (this.style && this.style.indexOf('group') !== -1) {
      flag = true;
    }
    return flag;
  };

  /**
   * 根节点扩展（是否为图的根节点）
   * @global
   */
  window.mxCell.prototype.isRootCell = function() {
    var flag = false;
    if (this.isRootNode && this.isRootNode === '1') {
      flag = true;
    }
    return flag;
  };

  /**
   * 是否为文字
   * @global
   */
  window.mxCell.prototype.isTextCell = function() {
    var flag = false;
    if (this.style && this.style.indexOf('stext') !== -1) {
      flag = true;
    }
    return flag;
  };

  /**
   * 是否为可连接的cell
   * @global
   */
  window.mxCell.prototype.isConnectable = function() {
    if (this.isGroupCell() || this.isTextCell()) {
      return false;
    } else {
      return this.connectable;
    }
  };

  /**
   * 简化cell.geometry为只包含width、height、x、y的对象
   * @global
   */
  window.mxCell.prototype.parseGeo = function() {
    return {
      width: this.geometry.width,
      height: this.geometry.height,
      x: this.geometry.x,
      y: this.geometry.y
    }
  };
}

/**
 * 设置第二个标签是否可见
 * @public
 * @param {Boolean} flag 是否可见
 */
function setSecondVisible(flag) {
  secondLabelVisible = flag;
}

/**
 * 获得第二个标签是否可见
 * @public
 * @return {Boolean} 返回是否可见
 */
function getSecondVisible() {
  return secondLabelVisible;
}

/**
 * 设置第二个标签的数据
 * @public
 * @param {Object} data 来自实时数据对象中未处理告警数量的数据
 */
function setSecondLabelData(data) {
  if (secondLabelData === null) {
    secondLabelData = {};
  }
  $.extend(secondLabelData, data);
}

/**
 * 浮动过节点处理
 * 鼠标浮动修改其样式并将节点置于最高层、鼠标离开恢复
 * @param {mxGraph} graph 当前拓扑图
 *
 */
function _hoverEvent(graph) {
  graph.addMouseListener({
    currentState: null,
    previousStyle: null,
    mouseDown: function(sender, me) {
      if (this.currentState != null) {
        this.dragLeave(me.getEvent(), this.currentState);
        this.currentState = null;
      }
    },
    mouseMove: function(sender, me) {
      if (this.currentState != null && me.getState() === this.currentState) {
        return;
      }

      var tmp = graph.view.getState(me.getCell());
      if (graph.isMouseDown || (tmp != null && !graph.getModel().isVertex(tmp.cell))) {
        tmp = null;
      }

      if (tmp !== this.currentState) {
        if (this.currentState != null) {
          this.dragLeave(me.getEvent(), this.currentState);
        }

        this.currentState = tmp;

        if (this.currentState != null) {
          this.dragEnter(me.getEvent(), this.currentState);
        }
      }
    },
    mouseUp: function(sender, me) {},
    dragEnter: function(evt, state) {
      if (state != null) {
        this.previousStyle = state.style;
        state.style = window.mxUtils.clone(state.style);
        _updateStyle(state, true);
      }
    },
    dragLeave: function(evt, state) {
      if (state != null) {
        state.style = this.previousStyle;
        _updateStyle(state, false);
      }
    }
  });
}

/**
 * 根据状态修改cell的样式
 * @param {mxCellState} state
 * @param {Boolean} hover 是否为浮动
 */
function _updateStyle(state, hover) {
  if (hover && window.TopologyGraph.getMode() === 1) {
    state.style[window.mxConstants.STYLE_FONTCOLOR] = '#' + GraphConfig.getHoverColor();
    state.style[window.mxConstants.STYLE_FONTSIZE] = '13';
  }
  if (state.text != null && state.cell.style.indexOf('group') === -1 && state.cell.style.indexOf('stext') === -1) {
    state.text.apply(state);
    state.text.reconfigure();
  }
  if (state.shape != null) {
    state.shape.apply(state);
    state.shape.reconfigure();
  }
}

/**
 * 修改默认连线样式
 * @param {Object} keys 样式
 * @param {Object} values 取值
 */
function edgeStyleChange(keys, values) {
  var graph = window.TopologyGraph.getGraph();
  graph.stopEditing(false);

  graph.getModel().beginUpdate();
  try {
    var cells = graph.getSelectionCells();

    for (var i = 0; i < cells.length; i++) {
      var cell = cells[i];

      if (graph.getModel().isEdge(cell)) {
        var geo = graph.getCellGeometry(cell);

        // 重置所有线上调整节点
        if (geo != null) {
          geo = geo.clone();
          geo.points = null;
          graph.getModel().setGeometry(cell, geo);
        }

        for (var j = 0; j < keys.length; j++) {
          graph.setCellStyles(keys[j], values[j], [cell]);
        }
      }
    }
    edgeExtends.fireEvent(new window.mxEventObject('styleChanged', 'keys', keys, 'values', values, 'cells', graph.getSelectionCells()));
  } finally {
    graph.getModel().endUpdate();
  }
}

/**
 * 扩展mxgraph的mxImageShape.prototype.paintVertexShape与mxPolyline.paintEdgeShape方法用以增加节点id
 * @private
 */
function _expandPaintShape() {
  window.mxShape.prototype.createSvgCanvas = function() {
    var canvas = new window.mxSvgCanvas2D(this.node, false);
    canvas.strokeTolerance = (this.pointerEvents) ? this.svgStrokeTolerance : 0;
    canvas.pointerEventsValue = this.svgPointerEvents;
    canvas.blockImagePointerEvents = window.mxClient.IS_FF;
    var off = this.getSvgScreenOffset();

    if (off !== 0) {
      this.node.setAttribute('transform', 'translate(' + off + ',' + off + ')');
    } else {
      this.node.removeAttribute('transform');
    }
    if (this.state != null && this.state.cell.isVertex()) {
      canvas.state.cellId = this.state.cell.id;
    }
    if (this.state != null && this.state.cell.isEdge()) {
      canvas.state.cellId = this.state.cell.id;
    }
    return canvas;
  };
  window.mxImageShape.prototype.paintVertexShape = function(c, x, y, w, h) {
    if (this.image != null) {
      var fill = window.mxUtils.getValue(this.style, window.mxConstants.STYLE_IMAGE_BACKGROUND, null);
      var stroke = window.mxUtils.getValue(this.style, window.mxConstants.STYLE_IMAGE_BORDER, null);

      if (fill != null || stroke != null) {
        c.setFillColor(fill);
        c.setStrokeColor(stroke);
        c.rect(x, y, w, h);
        c.fillAndStroke();
      }

      // FlipH/V are implicit via mxShape.updateTransform
      c.image(x, y, w, h, this.image, this.preserveImageAspect, false, false);
      c.root.setAttribute('id', c.state.cellId);
    } else {
      window.mxRectangleShape.prototype.paintBackground.apply(this, arguments);
    }
  };
  window.mxPolyline.prototype.paintEdgeShape = function(c, pts) {
    if (this.style == null || this.style[window.mxConstants.STYLE_CURVED] !== 1) {
      this.paintLine(c, pts, this.isRounded);
    } else {
      this.paintCurvedLine(c, pts);
    }
    this.node.setAttribute('id', c.state.cellId);
  };
}

/**
 * 添加过滤器（red_shadow_bottom表示告警、yellow_shadow_bottom表示异常）
 * @param graph
 */
function addGraphFilter(graph) {
  var view = graph.getView();
  view.defs = document.createElementNS(window.mxConstants.NS_SVG, 'defs');
  view.defs.innerHTML = '<filter id="error_filter" x="-100%" y="-100%" width="300%" height="300%"><feColorMatrix result="cm" in="SourceGraphic" type="matrix" values="3 0 .3 .4 0 .1 0 0 0 0 0 0 0 0 0 0 0 0 1 0"></feColorMatrix></filter><filter id="warning_filter" x="-100%" y="-100%" width="300%" height="300%"><feColorMatrix result="cm" in="SourceGraphic" type="matrix" values=".7 .4 0 .8 0 .8 0 .6 0 .1 .6 0 0 0 0 0 0 0 1 0"></feColorMatrix></filter><filter id="edge_error_filter" filterUnits="userSpaceOnUse"><feColorMatrix result="cm" in="SourceGraphic" type="matrix" values="2 1.1 0 0 0 0 0 1.6 0 0 0 0 2.4 0 0 0 0 0 1 0"></feColorMatrix></filter><filter id="edge_warning_filter" filterUnits="userSpaceOnUse"><feColorMatrix result="cm" in="SourceGraphic" type="matrix" values="6 1.2 0 0 0 3 .6 0 0 0 0 0 0 0 0 0 0 0 1 0"></feColorMatrix></filter>';
  view.canvas.appendChild(view.defs);
}

export
default {
  extend:
  extend,
  getSecondVisible: getSecondVisible,
  setSecondVisible: setSecondVisible,
  setSecondLabelData: setSecondLabelData,
  setMouseWheelFlag: setMouseWheelFlag,
  edgeStyleChange: edgeStyleChange,
  addGraphFilter: addGraphFilter,
  mxCellEx: mxCellEx,
  cellFilter: cellFilter
};
