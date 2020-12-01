/*
  @Author: songyf
  @Date: 2019-12-10 11:11:11
  @LastEditors: songyf
  @Description: 安全通报-安全通报任务-通报下发=公共方法 */

let graph = null;
export default {
  data() {
    return {
      processData: [], // 流程图数据
      container: null,
      vertexWidth: 150,
      vertexHeight: 50
    }
  },
  components: {},
  created() {
  },
  mounted() {
    let mainTheme = localStorage.getItem('theme');
    this.getTheme(mainTheme)
    this.container = document.getElementById('graphContainer');
  },
  watch: {
    '$store.state.theme': function(val) {
      this.getTheme(val)
    }
  },
  methods: {
    getTheme(val) {
      if (val === 'dark') {
        this.edgeStyle = 'strokeWidth=2;endArrow=block;endSize=2;endFill=1;fontColor=rgba(255,255,255,.65);strokeColor=#1991c7;rounded=1;fillColor=#1f2c3a;';
        this.refuseEdgeStyle = 'strokeWidth=2;endArrow=block;endSize=2;endFill=1;fontColor=rgba(255,255,255,.65);strokeColor=#414D5F;rounded=1;fillColor=#1f2c3a;';
        this.arrowStyle = 'strokeColor=rgba(255, 255, 255, 0.1)';
        this.refuseStyle = 'fontColor=rgba(255,255,255,.65);strokeColor=rgba(255,255,255,.1);'
      } else {
        this.edgeStyle = 'strokeWidth=2;endArrow=block;endSize=2;endFill=1;fontColor=rgba(0,0,0,.65);strokeColor=#FF9023;rounded=1;fillColor=#fff;';
        this.refuseEdgeStyle = 'strokeWidth=2;endArrow=block;endSize=2;endFill=1;fontColor=rgba(0,0,0,.65);strokeColor=#1991c7;rounded=1;fillColor=#fff;';
        this.arrowStyle = 'strokeColor=#DCDEE2';
        this.refuseStyle = 'fontColor=rgba(0,0,0,.85);strokeColor=#DCDEE2;'
      }
      if (this.container !== null) {
        this.insertCellFromData()
      }
    },
    initGraph() {
      let _self = this;
      if (!window.mxClient.isBrowserSupported()) {
        this.$message.error('浏览器不支持绘图组件！');
      } else {
        window.mxEvent.disableContextMenu(_self.container);
        graph = _self.createGraph();
        /* eslint-disable no-new */
        new window.mxRubberband(graph);
        graph.tooltipHandler.setEnabled(true);
        _self.extendsTooltip();
        _self.insertCellFromData();
        window.addEventListener('resize', this.resizeHandler);
      }
    },
    resizeHandler() {
      this.insertCellFromData(graph);
    },
    extendsTooltip() {
      let _self = this;
      graph.tooltipHandler.init = function () {
        if (document.body !== null) {
          this.div = document.createElement('div');
          this.div.className = 'info-tips';
          this.div.style.visibility = 'hidden';
          this.div.style.zIndex = this.zIndex;
          document.body.appendChild(this.div);
        }
      };
      graph.getTooltip = function (state, node, x, y) {
        var tip = null;
        if (state !== null) {
          if (state.cell !== null) {
            tip = {};
            if (state.cell.isEdge()) {
              tip.isEdge = true;
            } else {
              tip.isEdge = false;
            }
            tip.cell = state.cell;
          }
        }
        return tip;
      };
      graph.tooltipHandler.show = function (tip, x, y) {
        if (tip !== null) {
          if (typeof this.div === 'undefined') {
            this.init();
          }
          if (!tip.isEdge) {
            let origin = _self.mxgraph.mxUtils.getScrollOrigin();
            _self.getCellInfo(graph, tip.cell.text, x, y, origin);
          }
        }
      };
    },
    createGraph() {
      let graph = new window.mxGraph(this.container);
      graph.setCellsMovable(false);
      graph.setCellsResizable(false);
      graph.setPanning(false);
      // 禁用节点双击，防止改变数据
      graph.dblClick = function (evt, cell) {
        return false;
      };
      graph.graphHandler.setSelectEnabled(false);
      graph.centerZoom = false;
      graph.setHtmlLabels(true);
      return graph;
    },
    getContentHtml(data, flag) {
      return `<div class="ellipsis" title=${data} style="width: 150px">${data}</div>`;
    },
    insertCellFromData() {
      let boxWidth = this.container.offsetWidth
      let model = graph.getModel();
      model.clear();
      var parent = graph.getDefaultParent();
      model.beginUpdate();
      try {
        let graphData = this.processData  // 获取数据
        let itemWidth = this.vertexWidth + 30 // 定义item的宽度
        let itemHeight = this.vertexHeight + 60 // 定义item的高度
        let maxCount = Math.floor(boxWidth / itemWidth); // 获取一行所能放下item的最大个数
        let m = 0; // Y轴
        let n = 0; // X轴
        let directionFlag = true   // 为true-从左到右 反之 从右到左  蛇形排列
        graphData.map((val, i) => {
          let levelNum = i / maxCount
          if (directionFlag) {
            val.x = itemWidth * m
            val.y = itemHeight + itemHeight * n
            val.level = Math.ceil(levelNum) === levelNum ? levelNum + 1 : Math.ceil(levelNum); // 给每个item定义一个所在行的位置
            m++; // 坐标依次推进
            this.paddWidth = (boxWidth - (175 * m)) / 2  // 居中
          }
          if (!directionFlag) {
            val.x = itemWidth * (m - 2)
            val.y = itemHeight + itemHeight * n
            val.level = Math.ceil(levelNum) === levelNum ? levelNum + 1 : Math.ceil(levelNum);
            m--
          }
          if ((i / maxCount) % 1 === 0 && (i / maxCount) % 2 !== 0) { // 如果是偶数，反向排列
            directionFlag = false
            m = maxCount
            this.paddWidth = (boxWidth - (175 * m)) / 2
            n++
            val.x = itemWidth * (m - 1)
            val.y = itemHeight + itemHeight * n
            val.level = Math.ceil(levelNum) === levelNum ? levelNum + 1 : Math.ceil(levelNum);
          }
          if (i > maxCount && (i / maxCount) % 1 === 0 && (i / maxCount) % 2 === 0) { // 如果是奇数，正向排列
            directionFlag = true
            m = 0
            n++
            val.x = itemWidth * m
            val.y = itemHeight + itemHeight * n
            val.level = Math.ceil(levelNum) === levelNum ? levelNum + 1 : Math.ceil(levelNum);
            m++
          } else {
            this.paddWidth = (boxWidth - (175 * maxCount)) / 2
          }
          if (itemWidth * i < boxWidth) {
            this.paddWidth = (boxWidth - (175 * (i + 1))) / 2
          }
        })
        let vertex;
        let vertexAry = []
        for (let i = 0; i < graphData.length; i++) {
          vertex = graph.insertVertex(parent, null, this.getContentHtml(graphData[i].nodeName),
            graphData[i].x, graphData[i].y, this.vertexWidth,
            this.vertexHeight, graphData[i].refulseNodeName !== '--' ? this.refuseEdgeStyle : this.edgeStyle);
           vertexAry.push(vertex)
          let preVertex = vertexAry[i - 1];
          graph.insertEdge(parent, null, '', preVertex, vertex, this.arrowStyle);
        }
        for (let i = 0; i < graphData.length; i++) {
          if (graphData[i].refulseNodeName) {
            for (let a = 0; a < graphData.length; a++) {
              if (graphData[i].refulseNodeName === graphData[a].nodeName) {
                let cell = graph.insertEdge(parent, null, '拒绝', vertexAry[i], vertexAry[a], this.refuseStyle);
                cell.geometry.points = [new window.mxPoint(graphData[i].x + this.vertexWidth / 2, graphData[i].y - Math.abs(i - (graphData[i].level * maxCount)) * 10), new window.mxPoint(graphData[a].x + this.vertexWidth / 2, graphData[i].y - Math.abs(i - (graphData[i].level * maxCount)) * 10)];
                // cell.geometry.points = [new window.mxPoint(graphData[i].x + this.vertexWidth / 2, graphData[i].y - 20), new window.mxPoint(graphData[a].x + this.vertexWidth / 2, graphData[i].y - 20)];
                window.mxUtils.setCellStyles(graph.getModel(), cell, 'sourcePort', 'n');
                window.mxUtils.setCellStyles(graph.getModel(), cell, 'targetPort', 'n');
              }
            }
          }
        }
      } finally {
        model.endUpdate();
      }
    }
  }
}
