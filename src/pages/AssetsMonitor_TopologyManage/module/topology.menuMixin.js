/**
 * Created by dingyf on 2017/6/7.
 */
// var PopupMenus = require('./topology.popupMenu');
import GraphExtension from './topology.graphExtension'
import RealtimeInfo from './topology.realtimeInfo'
import TopologyAjax from './topology.ajax'
import GraphConfig from './topology.graphConfig'
let $ = window.$;

var menuMixin = {
  methods: {
    // 在布局之前对连线进行处理
    beforeLayout() {
      let graph = window.TopologyGraph.getGraph();
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
    // 在布局之后对连线进行处理
    afterLayout() {
      let graph = window.TopologyGraph.getGraph();
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
    // 根据老的geo和上层节点的geo，计算出新的geo
    getNewGeo(oldGeo, upperGeo) {
      oldGeo.x = upperGeo.x + upperGeo.width / 2 - 1;
      oldGeo.y = upperGeo.y + upperGeo.width / 2 - 1;
      return oldGeo;
    },
    // 重置所有非图标节点的geo
    reSetGeo() {
      let graph = window.TopologyGraph.getGraph();
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
    byLayout(mark, callback) {
      let graph = window.TopologyGraph.getGraph();
      var parent = graph.getDefaultParent();
      graph.getModel().beginUpdate();
      this.delEdgePoint(graph);
      try {
        var layout = new window.mxFastOrganicLayout(graph);
        if (mark === 'circle') { // 环形
          var radius = GraphConfig.getLayoutConfig('circle');
          layout = new window.mxCircleLayout(graph, parseInt(radius));
        } else if (mark === 'organic') { // 有机
          layout = new window.mxFastOrganicLayout(graph);
          var forceConstant = GraphConfig.getLayoutConfig('organic')
          layout.forceConstant = parseInt(forceConstant);
        } else if (mark === 'horizontalTree') { // 水平树
          if (!graph.isSelectionEmpty()) {
            layout = new window.mxCompactTreeLayout(graph, true);
            let configValue = GraphConfig.getLayoutConfig('horizontalTree');
            this.setLayoutConfig(layout, configValue, 1);
          }
        } else if (mark === 'verticalTree') { // 垂直树
          if (!graph.isSelectionEmpty()) {
            layout = new window.mxCompactTreeLayout(graph, false);
            let configValue = GraphConfig.getLayoutConfig('verticalTree');
            this.setLayoutConfig(layout, configValue, 1);
          }
        } else if (mark === 'verticalFlow') { // 垂直流
          layout = new window.mxHierarchicalLayout(graph, window.mxConstants.DIRECTION_NORTH);
          let configValue = GraphConfig.getLayoutConfig('verticalFlow');
          this.setLayoutConfig(layout, configValue, 2);
        } else if (mark === 'horizontalFlow') { // 水平流
          layout = new window.mxHierarchicalLayout(graph, window.mxConstants.DIRECTION_WEST);
          let configValue = GraphConfig.getLayoutConfig('horizontalFlow');
          this.setLayoutConfig(layout, configValue, 2);
        } else if (mark === 'radialTree') { // 径向树
          layout = new window.mxRadialTreeLayout(graph, false);
          let configValue = GraphConfig.getLayoutConfig('radialTree');
          this.setLayoutConfig(layout, configValue, 1);
        }
        var cells = graph.getSelectionCell();
        if (mark !== 'circle') {
          this.beforeLayout();
        }
        layout.execute(parent, cells);
      } catch (e) {
        throw e;
      } finally {
        if (mark !== 'circle') {
          this.afterLayout(graph);
        }
        if (mark !== 'organic') {
          this.reSetGeo(graph);
        }
        if (callback) { // 此回调放在调用保存接口之前
          callback();
        }
        graph.getModel().endUpdate();
        this.saveTopology();
      }
    },
    delEdgePoint (graph) {
      var edges = graph.getChildEdges();
      for (var i = 0; i < edges.length; i++) {
        if (edges[i].geometry.points && edges[i].geometry.points.length > 0) {
          edges[i].geometry.points.length = 0;
        }
      }
    },
    setLayoutConfig(layout, value, type) {
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
    saveTopology () {
      var topoviewInfo = this.getTopoInfo();
      var topoLine = this.filterEdges();
      var topoNode = this.filterVertex(1);
      var topoDomain = this.filterVertex(2);
      var param = {
        'topoviewInfo': topoviewInfo,
        'topoviewLine': topoLine,
        'topoviewNode': topoNode,
        'topoviewDomain': topoDomain
      };
      TopologyAjax.ajaxSaveOrUpdateTopo(param, () => {
        this.$message({
          message: '保存拓扑操作成功!',
          type: 'success'
        });
      });
    },
    // 获取要给接口传递的topoviewInfo对象
    getTopoInfo() {
      let graph = window.TopologyGraph.getGraph();
      var translate = graph.view.getTranslate();
      var scale = graph.view.getScale();
      var mapviewStr = translate.x + '|' + translate.y + '|' + scale;
      return JSON.stringify({
        uuid: window.paramSubTopo,
        mapview: mapviewStr,
        label: window.TopologyGraph.getLabel()
      });
    },
    // 过滤连线
    filterEdges() {
      var arrEdges = [];
      let graph = window.TopologyGraph.getGraph();
      var edges = graph.getChildEdges();
      for (var i = 0, l = edges.length; i < l; i++) {
        var edge = edges[i];
        if (edge.source && edge.target) {
          var geo = edge.geometry.points;
          // geo.points = edge.geometry.points;
          arrEdges.push(JSON.stringify({
            uuid: edge.id,
            parent: window.TopologyGraph.getParent(edge), // 不在区域为-1，在区域为区域的Uuid
            style: edge.style || '',
            geo: JSON.stringify(geo),
            sourceNodeUuid: edge.source.id,
            targetNodeUuid: edge.target.id,
            topoviewInfoUuid: window.paramSubTopo
          }));
        }
      }
      return arrEdges;
    },
    getNodeItem(vertex) {
      return {
        uuid: vertex.uuid,
        style: vertex.style,
        geo: JSON.stringify({
          width: vertex.geometry.width,
          height: vertex.geometry.height,
          x: vertex.geometry.x,
          y: vertex.geometry.y
        }),
        parent: window.TopologyGraph.getParent(vertex),
        topoviewInfoUuid: window.paramSubTopo
      };
    },
    // 过滤节点与区域
    filterVertex(numFlag) {
      var arrNode = [];
      var arrDomain = [];
      let graph = window.TopologyGraph.getGraph();
      var vertices = graph.getChildVertices();
      for (var i = 0, l = vertices.length; i < l; i++) {
        var vertex = vertices[i];
        var item = this.getNodeItem(vertex);
        if (!vertex.isGroupCell()) {
          if (vertex.isIconVertex()) {
            arrNode.push(JSON.stringify(item));
          }
        } else {
          // 区域内的资产cell保存
          for (var j = 0, length = vertex.getChildCount(); j < length; j++) {
            var innerVertex = vertex.getChildAt(j);
            if (innerVertex && innerVertex.isIconVertex()) {
              arrNode.push(JSON.stringify(this.getNodeItem(innerVertex)));
            }
          }
          arrDomain.push(JSON.stringify(item));
        }
      }
      if (numFlag === 1) { // 表示返回节点
        return arrNode;
      } else if (numFlag === 2) { // 表示返回区域
        return arrDomain;
      }
    },
    // 全屏与退出全屏
    fullScreen() {
      var fullBtn = $('#fScreenBtn');
      var title = fullBtn.attr('title').trim();
      var $header = $('#header');
      var headerHeight = $header.height();
      var $topologyGraphContent = $('#topologyGraphContent');
      var $graphContent = $('#graphContent');
      var $containerGraph = $('#containerGraph');
      var $leftPanel = $('#leftMenu');
      var $tabCon = $('.graphContent .tab_con');
      if (title === '全屏') {
        fullBtn.attr('title', '退出全屏');
        fullBtn.removeClass('fullScreen').addClass('quitScreen');
        $header.hide();
        $topologyGraphContent.css('margin-top', '0px');
        $graphContent.height($graphContent.height() + headerHeight);
        $containerGraph.height($containerGraph.height() + headerHeight);
        $leftPanel.height($leftPanel.height() + headerHeight);
        $tabCon.height($tabCon.height() + headerHeight);
      } else {
        fullBtn.attr('title', '全屏');
        fullBtn.removeClass('quitScreen').addClass('fullScreen');
        $header.show();
        $topologyGraphContent.css('margin-top', headerHeight + 'px');
        $graphContent.height($graphContent.height() - headerHeight);
        $containerGraph.height($containerGraph.height() - headerHeight);
        $leftPanel.height($leftPanel.height() - headerHeight);
        $tabCon.height($tabCon.height() - headerHeight);
      }
    },
    // 改变新建连线类型
    changeDefaultEdge(index) {
      var keyAry = [
        [window.mxConstants.STYLE_SHAPE, window.mxConstants.STYLE_EDGE, window.mxConstants.STYLE_CURVED, 'noedgestyle'],
        [window.mxConstants.STYLE_SHAPE, window.mxConstants.STYLE_EDGE, window.mxConstants.STYLE_CURVED, 'noedgestyle'],
        [window.mxConstants.STYLE_SHAPE, window.mxConstants.STYLE_EDGE, window.mxConstants.STYLE_CURVED, 'noedgestyle'],
        [window.mxConstants.STYLE_SHAPE, window.mxConstants.STYLE_EDGE, window.mxConstants.STYLE_CURVED, 'noedgestyle']
      ];
      var valueAry = [
        [null, null, null, null],
        [null, 'orthogonalEdgeStyle', null, null],
        [null, 'orthogonalEdgeStyle', '1', null],
        [null, 'entityRelationEdgeStyle', null, null]
      ];
      var indexLi = $($('#graph_lineType').find('a').get(index));
      var classStyle = indexLi.attr('class');
      $('#graph_currentLineType').removeClass().addClass(classStyle).addClass('sf-with-ul');
      GraphExtension.edgeStyleChange(keyAry[index], valueAry[index]);
      this.ajaxUpdateEdges();
    },
    ajaxUpdateEdges() {
      let graph = window.TopologyGraph.getGraph();
      var cells = graph.getSelectionCells();
      var lineArr = [];
      for (var i = 0; i < cells.length; i++) {
        var cell = cells[i];
        if (cell.isEdge()) {
          var line = {
            uuid: cell.id,
            geo: JSON.stringify(cell.geometry.points),
            style: cell.style,
            topoviewInfoUuid: window.paramSubTopo
          };
          lineArr.push(JSON.stringify(line));
        }
      }
      var param = {
        topoviewLine: lineArr
      };
      TopologyAjax.ajaxSaveOrUpdateTopo(param, null, () => { // 失败的回调
       window.TopologyGraph.getEditor().undo();
       this.$message.error('更换线形状失败');
      });
    },
    alignCells(direction) {
      var directionObj = {'left': window.mxConstants.ALIGN_LEFT, 'center': window.mxConstants.ALIGN_CENTER, 'right': window.mxConstants.ALIGN_RIGHT, 'top': window.mxConstants.ALIGN_TOP, 'middle': window.mxConstants.ALIGN_MIDDLE, 'bottom': window.mxConstants.ALIGN_BOTTOM};
      window.TopologyGraph.getGraph().alignCells(directionObj[direction]);
    },
    changeGraphMode(mode) {
      window.TopologyGraph.setMode(mode);
      if (mode === 1) {
        window.mxGraphHandler.prototype.guidesEnabled = false;
        window.TopologyGraph.getGraph().setConnectable(false);
        RealtimeInfo.resetRealTimeout();
        window.TopologyGraph.getGraphVm().activeTabName = 'second';
        window.TopologyGraph.getGraphVm().secondTabContent = 'list';
        window.TopologyGraph.getGraphVm().fourthTabContent = '';
        window.TopologyGraph.getGraphVm().fourthTabTitle = '拖拽面板';
      } else {
        // 是否有辅助线
        window.mxGraphHandler.prototype.guidesEnabled = true;
        RealtimeInfo.removeRealTimeInfo();
        window.TopologyGraph.getGraph().setConnectable(true);
        window.TopologyGraph.getGraph().refresh();
        window.TopologyGraph.getGraphVm().activeTabName = 'fourth';
        window.TopologyGraph.getGraphVm().fourthTabTitle = '拖拽面板';
        window.TopologyGraph.getGraphVm().fourthTabContent = 'dragPanel';
      }
    }
  }
};

export default menuMixin
