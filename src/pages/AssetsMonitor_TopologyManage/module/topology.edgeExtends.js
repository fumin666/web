/**
 * 连线的扩展
 */

var EdgeExtends = function() {
  var graph = window.TopologyGraph.getGraph();
  var styles = ['shadow', 'dashed', 'dashPattern'];
  var connectStyles = ['shape', 'edgeStyle', 'curved', 'rounded'];
  // Sets the default edge style
  var currentEdgeStyle = {
    'edgeStyle': '',
    'rounded': '0'
  };
  var currentStyle = {};
  var alwaysEdgeStyles = ['edgeStyle', 'startArrow', 'startFill', 'startSize', 'endArrow', 'endFill', 'endSize'];

  for (var i = 0; i < connectStyles.length; i++) {
    styles.push(connectStyles[i]);
  }

  // Implements a global current style for edges and vertices that is applied to new cells
  var insertHandler = function(cells) {
    graph.getModel().beginUpdate();
    try {
      for (var i = 0; i < cells.length; i++) {
        var cell = cells[i];

        // Removes styles defined in the cell style from the styles to be applied
        var cellStyle = graph.getModel().getStyle(cell);
        var tokens = (cellStyle != null) ? cellStyle.split(';') : [];
        var appliedStyles = styles.slice();

        for (let j = 0; j < tokens.length; j++) {
          let tmp = tokens[j];
          let pos = tmp.indexOf('=');
          if (pos >= 0) {
            let key = tmp.substring(0, pos);
            let index = window.mxUtils.indexOf(appliedStyles, key);
            if (index >= 0) {
              appliedStyles.splice(index, 1);
            }
          }
        }

        // Applies the current style to the cell
        var value = graph.convertValueToString(cell);
        var edge = graph.getModel().isEdge(cell);
        var current = (edge) ? currentEdgeStyle : currentStyle;

        for (let j = 0; j < appliedStyles.length; j++) {
          let key = appliedStyles[j];
          let styleValue = current[key];

          // Ignores text formatting styles if cell has an predefined value
          if (styleValue != null && (value == null || value.length === 0)) {
            // Special case: Shape and edge style only applied on edges via connect
            // which means the source terminal is not null at this point
            if (!edge || (window.mxUtils.indexOf(connectStyles, key) < 0 || graph.getModel().getTerminal(cell, true) != null)) {
              graph.setCellStyles(key, styleValue, [cell]);
            }
          }
        }
      }
    } finally {
      graph.getModel().endUpdate();
    }
  };

  graph.connectionHandler.addListener(window.mxEvent.CONNECT,
    function(sender, evt) {
      var cells = [evt.getProperty('cell')];

      if (evt.getProperty('terminalInserted')) {
        cells.push(evt.getProperty('terminal'));
      }
      insertHandler(cells, true);
    });

  this.addListener('styleChanged', window.mxUtils.bind(this,
    function(sender, evt) {
      // Checks if edges and/or vertices were modified
      var cells = evt.getProperty('cells');
      var vertex = false;
      var edge = false;

      if (cells.length > 0) {
        for (var i = 0; i < cells.length; i++) {
          vertex = graph.getModel().isVertex(cells[i]) || vertex;
          edge = graph.getModel().isEdge(cells[i]) || edge;

          if (edge && vertex) {
            break;
          }
        }
      } else {
        vertex = true;
        edge = true;
      }

      var keys = evt.getProperty('keys');
      var values = evt.getProperty('values');

      for (let i = 0; i < keys.length; i++) {
        // Special case: Edge style and shape
        if (window.mxUtils.indexOf(connectStyles, keys[i]) >= 0) {
          if (edge || window.mxUtils.indexOf(alwaysEdgeStyles, keys[i]) >= 0) {
            currentEdgeStyle[keys[i]] = values[i];
          }
        } else if (window.mxUtils.indexOf(styles, keys[i]) >= 0) {
          if (vertex) {
            currentStyle[keys[i]] = values[i];
          }

          if (edge || window.mxUtils.indexOf(alwaysEdgeStyles, keys[i]) >= 0) {
            currentEdgeStyle[keys[i]] = values[i];
          }
        }
      }

      // Uses current edge style for connect preview
      graph.connectionHandler.createEdgeState = function(me) {
        var style = 'edgeStyle=' + (currentEdgeStyle['edgeStyle'] || 'none') + ';';
        if (currentEdgeStyle['curved'] != null) {
          style += 'curved=' + currentEdgeStyle['curved'] + ';';
        }
        if (currentEdgeStyle['rounded'] != null) {
          style += 'rounded=' + currentEdgeStyle['rounded'] + ';';
        }
        var edge = graph.createEdge(null, null, null, null, null, style);
        return new window.mxCellState(graph.view, edge, graph.getCellStyle(edge));
      };
    }));
};

function init() {
  EdgeExtends.prototype = new window.mxEventSource();
  EdgeExtends.prototype.constructor = EdgeExtends;
  // 替换了原生的mxClient的方法，为了让已经有起点和终点的连线不允许拖动改变起点和终点
  window.mxEdgeHandler.prototype.mouseUp = function(sender, me) {
    // Workaround for wrong event source in Webkit
    if (this.index != null && this.marker != null) {
      var edge = this.state.cell;

      // Ignores event if mouse has not been moved
      if (me.getX() !== this.startX || me.getY() !== this.startY) {
        var clone = this.graph.isCloneEvent(me.getEvent()) && this.cloneEnabled &&
          this.graph.isCellsCloneable();

        // Displays the reason for not carriying out the change
        // if there is an error message with non-zero length
        if (this.error != null) {
          if (this.error.length > 0) {
            this.graph.validationAlert(this.error);
          }
        } else if (this.isLabel) {
          this.moveLabel(this.state, this.label.x, this.label.y);
        } else if (this.isSource || this.isTarget) {
          var terminal = null;

          if (this.constraintHandler.currentConstraint != null &&
            this.constraintHandler.currentFocus != null) {
            terminal = this.constraintHandler.currentFocus.cell;
          }

          if (terminal == null && this.marker.hasValidState()) {
            terminal = this.marker.validState.cell;
          }

          if (terminal != null) {
            if (!edge.source || !edge.target) {
              edge = this.connect(edge, terminal, this.isSource, clone, me);
            }
          } else if (this.graph.isAllowDanglingEdges()) {
            var pt = this.abspoints[(this.isSource) ? 0 : this.abspoints.length - 1];
            pt.x = this.roundLength(pt.x / this.graph.view.scale - this.graph.view.translate.x);
            pt.y = this.roundLength(pt.y / this.graph.view.scale - this.graph.view.translate.y);

            var pstate = this.graph.getView().getState(
              this.graph.getModel().getParent(edge));

            if (pstate != null) {
              pt.x -= pstate.origin.x;
              pt.y -= pstate.origin.y;
            }

            pt.x -= this.graph.panDx / this.graph.view.scale;
            pt.y -= this.graph.panDy / this.graph.view.scale;

            // Destroys and recreates this handler
            edge = this.changeTerminalPoint(edge, pt, this.isSource, clone);
          }
        } else if (this.active) {
          edge = this.changePoints(edge, this.points, clone);
        } else {
          this.graph.getView().invalidate(this.state.cell);
          this.graph.getView().validate(this.state.cell);
        }
      }

      // Resets the preview color the state of the handler if this
      // handler has not been recreated
      if (this.marker != null) {
        this.reset();

        // Updates the selection if the edge has been cloned
        if (edge !== this.state.cell) {
          this.graph.setSelectionCell(edge);
        }
      }

      me.consume();
    }
  };
  return new EdgeExtends();
}

export default {
  init: init
};

