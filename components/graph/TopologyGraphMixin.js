/**
 * Created by dingyf on 2017/7/19.
 */
import { getTopoviewConfig, getTopoview } from '@/pages/AssetsMonitor_TopologyManage/api/topology_api'
import GraphExtension from '@/pages/AssetsMonitor_TopologyManage/module/topology.graphExtension'
import KeyHandler from '@/pages/AssetsMonitor_TopologyManage/module/topology.keyhandler'
import GraphConfig from '@/pages/AssetsMonitor_TopologyManage/module/topology.graphConfig'
import RealtimeInfo from '@/pages/AssetsMonitor_TopologyManage/module/topology.realtimeInfo'
import TopoIcon from '@/pages/AssetsMonitor_TopologyManage/module/topology.icon'
import GraphToolTip from '@/pages/AssetsMonitor_TopologyManage/module/topology.graphToolTip'
import PopupMenus from '@/pages/AssetsMonitor_TopologyManage/module/topology.popupMenu'
import fishbone from '@/components/graph/Fishbone'
import pingForm from '@/pages/AssetsMonitor_TopologyManage/PingForm'
import traceForm from '@/pages/AssetsMonitor_TopologyManage/TraceForm'
import remotePingDialog from '@/pages/AssetsMonitor_TopologyManage/RemotePingDialog';
let $ = window.$;
let _groupCells = [];
var _pointSize = 2;
window.paramSubTopo = 'topoviewinfodefaultuuid000000000'
var topologyGraphMixin = {
  data () {
    return {
      config: {},
      editor: {},
      graph: {},
      realtime: [0, 0, 0, 0],
      paramSubTopo: window.paramSubTopo,
      pingDialog: false,
      traceDialog: false,
      remotePingDialog: false,
      pingIp: '',
      traceIp: '',
      remoteItCompId: '',
      basePath: '../../../static/mxgraph/',
      currentScale: 0.5,
      label: 1
    }
  },
  components: {
    pingForm,
    traceForm,
    's-fishbone': fishbone,
    remotePingDialog
  },
  computed: {
    pingDialogTitle() {
      return 'Ping ' + this.pingIp;
    },
    traceDialogTitle() {
      return 'Trace ' + this.traceIp;
    }
  },
  created() {
    window.paramSubTopo = 'topoviewinfodefaultuuid000000000';
    this.paramSubTopo = 'topoviewinfodefaultuuid000000000';
  },
  mounted () {
    window.TopologyGraph = {};
    window.TopologyGraph.getGraphVm = () => {
      return this;
    };
    window.TopologyGraph.getGraph = () => {
      return this.graph;
    };
    window.TopologyGraph.getMode = () => {
      return 1;
    };
    window.TopologyGraph.setLabel = (n) => {
      this.label = n;
    };
    window.TopologyGraph.getShowApp = (n) => {
      return this.config.showapp;
    };
    this.initGraph();
  },
  destroyed () {
    window.TopologyGraph = undefined
    this.graph = {}
    window.mxEvent.removeAllListeners(window);
    window.mxEvent.removeAllListeners(document);
  },
  props: {
    graphHeight: {
      type: Number,
      required: true
    }
  },
  methods: {
    traceDialogCancel() {
      this.traceDialog = false;
    },
    pingDialogCancel() {
      this.pingDialog = false;
    },
    initGraph () {
      getTopoviewConfig().then((data) => {
        this.config = JSON.parse(data);
        this.realtime = this.config.realtime;
        this.init();
      });
    },
    init () {
      this.editor = new window.mxEditor();
      this.graph = this.createGraph();
      this.setNewPanning();
      this.loadStyle();
      GraphExtension.mxCellEx();
      GraphExtension.addGraphFilter(this.graph);
      GraphExtension.extend(this.graph);
      KeyHandler.bind();
      this.addExtendEvent();
      PopupMenus.init(this.graph);
      GraphToolTip.extendsTooltip(this.graph);
      GraphConfig.loadTopologyConfig();
      this.loadJsonData(() => {
        this.graph.fit();
        this.graph.center();
        // window.TopologyGraph.getGraph().zoomTo(2)
        this.currentScale = this.graph.view.getScale();
        this.graph.refresh();
      });
    },
    addExtendEvent () {
      var graph = this.graph;
      // 移动一个节点事件
      graph.addListener(window.mxEvent.CELLS_MOVED, (sender, evt) => {
        var cells = evt.getProperty('cells');
        for (var i = cells.length - 1; i >= 0; i--) {
          var geo = cells[i].getGeometry();
          if (cells[i].isIconVertex()) {
            graph.getModel().beginUpdate();
            try {
              var oldGeo = cells[i].underCell.getGeometry();
              this.getNewGeo(oldGeo, geo);
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
    },
    getNewGeo (oldGeo, upperGeo) {
      oldGeo.x = upperGeo.x + upperGeo.width / 2 - 1;
      oldGeo.y = upperGeo.y + upperGeo.width / 2 - 1;
      return oldGeo;
    },
    createGraph () {
      var container = document.getElementById('topology_graph');

      if (window.mxClient.IS_QUIRKS) {
        document.body.style.overflow = 'hidden';
        /* eslint-disable no-new */
        new window.mxDivResizer(container);
      }

      var graph = this.editor.graph;
      this.editor.setGraphContainer(container);
      // 设置不允许节点改变大小
      graph.setCellsResizable(false);
      // 设置是否两点可连多线
      // graph.setMultigraph(false);
      // 设置不允许线悬空
      graph.setAllowDanglingEdges(false);
      // 设置节点上连接图片
      window.mxConnectionHandler.prototype.connectImage = new window.mxImage(this.basePath + '/images/connector.gif', 16, 16);
      // 大小调整图片
      window.mxVertexHandler.prototype.handleImage = new window.mxImage(this.basePath + '/images/handle-main.png', 17, 17);
      // 设置选中节点虚线宽度为2
      window.mxConstants.VERTEX_SELECTION_STROKEWIDTH = 2;
      // 设置选中节点虚线颜色为红色
      window.mxConstants.VERTEX_SELECTION_COLOR = '#ff0000';
      // 屏蔽默认右键菜单
      window.mxEvent.disableContextMenu(container);
      // 禁用节点双击，防止改变数据
      graph.dblClick = function (evt, cell) {
        return false;
      };
      graph.isCellEditable = function (cell) {
        return false;
      };
      graph.isCellCloneable = function (cell) {
        return false;
      };
      graph.isCellMovable = function (cell) {
        return false;
      };
      return graph;
    },
    setNewPanning () {
      this.graph.panningHandler.useLeftButtonForPanning = true;
      this.graph.panningHandler.setPanningEnabled(true);
      $('#topology_graph').css('cursor', 'url(' + this.basePath + '/images/openhand.cur) 8 8, default');
    },
    loadJsonData (callback) {
      let param = {'subTopoId': this.paramSubTopo, 'showapp': this.config.showapp};
      getTopoview(param).then((res) => {
        let graphData = res.data;
        if (graphData) {
          var isFirst = graphData.vertexs ? !graphData.vertexs.every(item => {
            return item.geo;
          }) : true;
          this.label = graphData.label;
          var oneEdgeData = {};
          var edgeAry = [];
          var edge = null;
          if (!(this.graph instanceof window.mxGraph)) return;
          var model = this.graph.getModel();
          _groupCells = [];
          model.clear();
          model.beginUpdate();
          try {
            if (graphData.vertexs != null) {
              for (var i = 0, length = graphData.vertexs.length; i < length; i++) {
                this.addVertex(graphData.vertexs[i], isFirst);
              }
            }
            if (graphData.edges != null) {
              for (var j = 0, length2 = graphData.edges.length; j < length2; j++) {
                oneEdgeData = graphData.edges[j];
                edge = this.graph.insertEdge(this.getParentCell(oneEdgeData), oneEdgeData.uuid, '', model.getCell(oneEdgeData.sourceNodeUuid), model.getCell(oneEdgeData.targetNodeUuid));
                if (oneEdgeData.geo && oneEdgeData.geo.indexOf('[') !== -1) {
                  edge.geometry.points = JSON.parse(oneEdgeData.geo);
                }
                edge.setStyle(oneEdgeData.style);
                edgeAry.push(edge);
              }
            }
            this.graph.orderCells(true, edgeAry);
            if (isFirst) {
              this.byLayout(() => {
                this.dealNoEdgeCell();
                var translate = this.graph.view.getTranslate();
                this.graph.view.setTranslate(translate.x, translate.y + 160);
              });
            }
          } finally {
            model.endUpdate();
          }
          // 启动就去流量数据
          RealtimeInfo.updateState();
          // GraphConfig.setTopologyBgImg(graphData.background);
          if (this.currentScale) {
            this.graph.view.scaleAndTranslate(parseFloat(this.currentScale), parseFloat(0), parseFloat(260));
          }
          if (typeof callback === 'function') {
            callback();
            if (graphData.vertexs != null && graphData.vertexs.length <= 5) {
              // 当获取的点数据个数小于等于5时，设置图层缩放大小到1级
              this.graph.zoomTo(1)
            }
          }
        } else {
          GraphConfig.setTopologyBgImg('');
        }
      });
    },
    dealNoEdgeCell () {
      var vertices = this.graph.getChildVertices();
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
        cell.geometry.x = dx;
        cell.geometry.y = dy;
        cell.underCell.geometry.x = dx;
        cell.underCell.geometry.y = dy;
      }
      this.graph.refresh();
    },
    byLayout(callback) {
      let graph = this.graph;
      var parent = graph.getDefaultParent();
      graph.getModel().beginUpdate();
      this.delEdgePoint();
      try {
        let layout = new window.mxHierarchicalLayout(graph, window.mxConstants.DIRECTION_NORTH);
        let configValue = GraphConfig.getLayoutConfig('verticalFlow');
        this.setLayoutConfig(layout, configValue, 2);
        var cells = graph.getSelectionCell();
        this.beforeLayout();
        layout.execute(parent, cells);
      } catch (e) {
        throw e;
      } finally {
        this.afterLayout(graph);
        this.reSetGeo(graph);
        if (callback) { // 此回调放在调用保存接口之前
          callback();
        }
        graph.getModel().endUpdate();
      }
    },
    reSetGeo() {
      let graph = this.graph;
      var parent = graph.getDefaultParent();
      var cells = graph.getChildVertices(parent);
      for (var i = cells.length - 1; i >= 0; i--) {
        var geo = cells[i].getGeometry();
        if (cells[i].isIconVertex()) {
          try {
            var oldGeo = cells[i].underCell.getGeometry();
            var newGeo = this.getNewGeo(oldGeo, geo);
            cells[i].underCell.setGeometry(newGeo);
          } finally {}
        }
      }
      graph.refresh();
    },
    setLayoutConfig(layout, value, type) {
      if (typeof value === 'object') {
        value = value[Object.keys(value)[0]];
      }
      var config = value.split('|');
      if (type === 1) {
        layout.edgeRouting = false;
        layout.levelDistance = parseInt(config[0]);
        layout.nodeDistance = parseInt(config[1]);
      } else {
        layout.interRankCellSpacing = parseInt(config[0]);
        layout.intraCellSpacing = parseInt(config[1]);
      }
    },
    beforeLayout() {
      let graph = this.graph;
      var parent = graph.getDefaultParent();
      var edges = graph.getChildEdges(parent);
      for (var i = edges.length - 1; i >= 0; i--) {
        if (edges[i].source && edges[i].target) {
          var edgesAry = edges[i].source.edges;
          edges[i].source = edges[i].source.upperCell;
          if (edgesAry != null) {
            edges[i].source.edges = edgesAry;
          }
          var edgesAry2 = edges[i].target.edges;
          edges[i].target = edges[i].target.upperCell;
          if (edgesAry2 != null) {
            edges[i].target.edges = edgesAry2;
          }
        }
      }
      graph.refresh();
    },
    delEdgePoint () {
      var edges = this.graph.getChildEdges();
      for (var i = 0; i < edges.length; i++) {
        if (edges[i].geometry.points && edges[i].geometry.points.length > 0) {
          edges[i].geometry.points.length = 0;
        }
      }
    },
    afterLayout() {
      let graph = this.graph;
      var parent = graph.getDefaultParent();
      var edges = graph.getChildEdges(parent);
      for (var i = edges.length - 1; i >= 0; i--) {
        if (edges[i].source && edges[i].target) {
          edges[i].source = edges[i].source.underCell;
          edges[i].target = edges[i].target.underCell;
        }
      }
      graph.refresh();
    },
    addVertex (onePointData, isFirst) {
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
          var onePointGeo = this.getPointGeo(onePointData);
          pointX = onePointGeo.x;
          pointY = onePointGeo.y;
        }
        pointCell = this.graph.insertVertex(this.getParentCell(onePointData), onePointData.typeUuid, '', pointX, pointY, _pointSize, _pointSize, 'pointCell;');
        iconCell = this.graph.insertVertex(this.getParentCell(onePointData), onePointData.typeUuid + '_icon', this.getIconLabel(onePointData), iconX, iconY, iconWidth, iconHeight, TopoIcon.getStyle(onePointData));
        pointCell.type = onePointData.type;
        iconCell.type = onePointData.type;
        pointCell.uuid = onePointData.uuid;
        iconCell.uuid = onePointData.uuid;
        pointCell.hostIp = onePointData.hostIp;
        pointCell.funcType = onePointData.funcType;
        iconCell.hostIp = onePointData.hostIp;
        iconCell.busnessName = onePointData.busnessName;
        iconCell.funcType = onePointData.funcType;
        iconCell.underCell = pointCell;
        pointCell.upperCell = iconCell;
      } else {
        // 处理区域数据
        onePointData.style += ';verticalAlign=' + window.mxConstants.ALIGN_TOP;// 让值在顶部显示
        groupCell = this.graph.insertVertex(this.getParentCell(onePointData), onePointData.uuid, onePointData.value || '', iconX, iconY, iconWidth, iconHeight, onePointData.style);
        groupCell.uuid = onePointData.uuid;
        groupCell.setConnectable(false);
        _groupCells.push(groupCell);
      }
    },
    getParentCell (cellData) {
      var parent = this.graph.getDefaultParent();
      if (cellData.parent === '-1' || cellData.parent == null) {
        parent = this.graph.getDefaultParent();
      } else {
        parent = this.graph.getModel().getCell(cellData.parent);
      }
      return parent;
    },
    loadStyle () {
      // 获取默认样式
      var node = window.mxUtils.load(this.basePath + '/topology-style.xml').getDocumentElement();
      var dec = new window.mxCodec(node.ownerDocument);
      dec.decode(node, this.graph.getStylesheet());
      GraphConfig.loadTopologyConfig();
      this.graph.refresh();
    },
    getPointGeo (pointData) {
      var geo = JSON.parse(pointData.geo);
      return {'x': geo.x - 0 + (geo.width - _pointSize) / 2, 'y': geo.y - 0 + (geo.height - _pointSize) / 2};
    },
    getIconLabel (pointData) {
      var returnStr = pointData['hostIp'];
      if (this.label === 1) {
        returnStr = pointData['hostIp'] || '';
      } else if (this.label === 2) {
        returnStr = pointData['busnessName'] || '';
      } else if (this.label === 3) {
        returnStr = (pointData['hostIp'] || '') + '-' + (pointData['busnessName'] || '');
      }
      return returnStr;
    },
    closeFloatBox() {
      if (this.graph.popupMenuHandler && this.graph.popupMenuHandler.isMenuShowing()) {
        this.graph.popupMenuHandler.hideMenu();
      }
      if (document.querySelectorAll('.cellTips')[0]) {
        document.querySelectorAll('.cellTips')[0].style.visibility = 'hidden';
      }
    }
  }
};
export default topologyGraphMixin;
