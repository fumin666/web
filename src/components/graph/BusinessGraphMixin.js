
var orgGraphMixin = {
  data() {
    return {
      userAry: [],
      graph: {},
      treeNodeList: [],
      fileList: [],
      mxgraph: {},
      tempCell: null,
      allNodes: {},
      tempLevel: 0,
      firstTreeNodeName: ''
    };
  },
  mounted() {
    this.$nextTick(function () {
      this.startGraph()
    })
  },
  beforeDestroy() {
    window.mxEvent.removeAllListeners(window);
    window.mxEvent.removeAllListeners(document);
  },
  methods: {
    startGraph() {
      var container = document.getElementById('graphContainer');
      if (!window.mxClient.isBrowserSupported()) {
        window.mxUtils.error('Browser is not supported!', 200, false);
      } else {
        window.mxEvent.disableContextMenu(container);
        this.initGraph(window, container);
      }
    },
    getAllNode(treeNode, flag) {
      if (flag) {
        this.allNodes[treeNode.uuid] = treeNode.node;
        this.firstTreeNodeName = treeNode.node.departName;
      }
      for (let i = 0, length = treeNode.childrenList.length; i < length; i++) {
        this.allNodes[treeNode.childrenList[i].uuid] = treeNode.childrenList[i].node;
        this.getAllNode(treeNode.childrenList[i]);
      }
    },
    initGraph(mxgraph, container) {
      this.graph = new mxgraph.mxGraph(container);
      var graph = this.graph;
      graph.setHtmlLabels(true);

      var style = graph.getStylesheet().getDefaultVertexStyle();
      style[mxgraph.mxConstants.STYLE_SHAPE] = 'label';
      style[mxgraph.mxConstants.STYLE_STROKECOLOR] = 'none';
      style[mxgraph.mxConstants.STYLE_FILLCOLOR] = 'none';

      style = graph.getStylesheet().getDefaultEdgeStyle();
      style[mxgraph.mxConstants.STYLE_EDGE] = mxgraph.mxEdgeStyle.TopToBottom;
      style[mxgraph.mxConstants.STYLE_ENDARROW] = false;
      style[mxgraph.mxConstants.STYLE_STROKEWIDTH] = 2;
      style[mxgraph.mxConstants.STYLE_STROKECOLOR] = '#6a6d73';
      graph.setCellsMovable(false);
      graph.setCellsResizable(false);
      graph.setAutoSizeCells(true);
      graph.setPanning(true);
      // 禁用节点双击，防止改变数据
      graph.dblClick = function (evt, cell) {
        return false;
      };
      // 禁止右键
      graph.popupMenuHandler.isEnabled = function () {
        return false;
      };
      graph.graphHandler.setSelectEnabled(false);
      graph.centerZoom = false;
      graph.panningHandler.useLeftButtonForPanning = true;
      if (this.currentScale) {
        graph.view.scaleAndTranslate(parseFloat(this.currentScale), parseFloat(500), parseFloat(260));
      }
      var layout = new mxgraph.mxCompactTreeLayout(graph, false);
      layout.useBoundingBox = false;
      layout.edgeRouting = false;
      layout.levelDistance = 80;
      layout.nodeDistance = 10;
      layout.isVertexMovable = function (cell) {
        return true;
      };
      var layoutMgr = new mxgraph.mxLayoutManager(graph);

      layoutMgr.getLayout = function (cell) {
        if (cell.getChildCount() > 0) {
          return layout;
        }
      };
      /* eslint-disable no-new */
      new mxgraph.mxRubberband(graph);
      var parent = graph.getDefaultParent();
      // 滚动事件
      mxgraph.mxEvent.addMouseWheelListener(function (evt, up) {
        var source = mxgraph.mxEvent.getSource(evt);
        if (source.nodeName === 'svg') {
          if (up) {
            graph.zoomIn();
          } else {
            graph.zoomOut();
          }
        }
      });
      // 开始绘图
      graph.getModel().beginUpdate();
      try {
        this.insertCells(parent, this.treeNodeList[0], null);
      } finally {
        graph.getModel().endUpdate();
      }
    },
    insertCells(parent, node, levelCell) {
      if (node === undefined) {
        return false
      }
      let upLevel = levelCell;
      if (levelCell === null) {
        upLevel = this.graph.insertVertex(parent, node.uuid, this.getCellHtml(node, true, 1), this.graph.container.offsetWidth / 2 - 50, 20, 120, 104);
        upLevel.level = 1;
      }
      let currentCell = null;
      if (node.childrenList !== null && node.childrenList !== undefined && node.childrenList.length > 0) {
        for (let i = 0, length = node.childrenList.length; i < length; i++) {
          let currentLevel = upLevel.level + 1;
          currentCell = this.graph.insertVertex(parent, node.childrenList[i].uuid, this.getCellHtml(node.childrenList[i], false, currentLevel), 200, 20, 120, 104);
          currentCell.level = currentLevel;
          this.graph.insertEdge(parent, null, '', upLevel, currentCell);
          this.insertCells(parent, node.childrenList[i], currentCell);
        }
      }
    },
    getCellHtml(node, flag, level) {
      let currentClass = '';
      if (flag) {
        currentClass = 'org-cell-current';
      }
      return '<div id="' + node.uuid + '-cell-val" class="org-cell ' + currentClass + '"><div class="org-cell-icon"><img width="65px" height="65px" src="' + node.icon + '" alt=""></div><div class="org-cell-title" title="' + node.name + '">' + node.name + '</div></div>';
    }
  },
  watch: {
    treeNodeList: function (val) {
      if (val !== undefined && val.length > 0) {
        this.startGraph()
      }
    }
  }
};

export default orgGraphMixin
