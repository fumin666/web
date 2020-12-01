<template>
  <div class="process_graph_main">
    <div class="process-title-line">
      <div class="process-title">
        <div class="title-info">{{`${this.$route.params.taskId}流程图`}}</div>
        <div class="bg-line"></div>
      </div>
      <div class="title-btns">
        <s-button icon="refresh-circle" @click="refresh" title="刷新"></s-button>
      </div>
    </div>
    <div class="steps_main">
      <div class="g-graph-title">
        &nbsp;&nbsp;
      </div>
      <div class="g-graph-content">
        <div class="s-steps is-horizontal" id="graphTableTitle">
          <div class="s-step otherType" v-for="(item,index) in graphData.xNodes" :key='index' :id="'step_1' + (index + 1)">
            <div class="s-step-main">
              <div class="s-step-title">{{item}}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="parent" id="main-parent">
      <div class="g-graph-title">
        <div class="info" v-for="(item,index) in graphData.yNodes" :key='index'>
          <div style="word-break: break-word;width:15px">{{item}}</div>
        </div>
      </div>
      <div class="g-graph-content">
        <div class="line" v-for="(item,index) in graphData.yNodes" :key='index'>
          <div class="g-cell" v-for="(item,i) in graphData.xNodes" :key='i' :id="'cell' + (index + 1) + (i + 1)">
            <div class="r-line"></div>
          </div>
        </div>
      </div>
    </div>
    <div id="graphContainer" style="z-index:1;position:absolute;top:0px;left:0px;overflow:hidden;cursor:default;width:100%;height:100%;">
    </div>
  </div>
</template>

<script>
  import $axios from 'sunflower-ajax';
  let edgeStyle = 'strokeWidth=2;endArrow=block;endSize=2;endFill=1;strokeColor=#738ea6;rounded=1;';
  let edgeStyle1 = 'strokeWidth=2;endArrow=block;endSize=2;endFill=1;strokeColor=red;rounded=1;';
  let graph = null;
  export default {
    data() {
      return {
        graphData: [],
        vertexWidth: 84,
        vertexHeight: 32,
        mxgraph: {},
        container: null
      }
    },
    mounted() {
      this.container = document.getElementById('graphContainer');
    },
    created() {
      this.getFlowData();
    },
    destroyed() {
      window.removeEventListener('resize', this.resizeHandler);
      window.mxEvent.removeAllListeners(window);
      window.mxEvent.removeAllListeners(document);
    },
    methods: {
      initDivHeight() {
        let titleLineHeight = document.querySelector('.process-title-line').offsetHeight;
        let tableTitleHeight = document.getElementById('graphTableTitle').offsetHeight;
        this.container.style.height = document.getElementById('main-parent').offsetHeight + tableTitleHeight + 'px';
        this.container.style.top = titleLineHeight + 'px';
      },
      initGraph() {
        let _self = this;
        _self.container = document.getElementById('graphContainer');
        if (!window.mxClient.isBrowserSupported()) {
          this.$message.error('浏览器不支持绘图组件！');
        } else {
          window.mxEvent.disableContextMenu(_self.container);
          this.initDivHeight();
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
        this.initDivHeight();
        this.insertCellFromData(graph);
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
      insertCellFromData() {
        let model = graph.getModel();
        model.clear();
        var parent = graph.getDefaultParent();
        model.beginUpdate();
        let _self = this;
        try {
          var dataLength = this.graphData.flowChartList.length;
          var vertexAry = [];
          let preVertex, edge;
          if (dataLength > 0) {
            let pos = this.graphData.flowChartList[0].position.split(',');
            let geo = _self.getCellGeo(this.graphData.flowChartList[0].text, pos[0], pos[1]);
            let vertex;
            if (dataLength === 1) {
              vertex = graph.insertVertex(parent, null, this.getContentHtml(this.graphData.flowChartList[0], true), geo.x, geo.y, _self.vertexWidth, _self.vertexHeight);
            } else {
              vertex = graph.insertVertex(parent, null, this.getContentHtml(this.graphData.flowChartList[0], false), geo.x, geo.y, _self.vertexWidth, _self.vertexHeight);
            }
            vertex.text = this.graphData.flowChartList[0].text;
            vertexAry.push(vertex);
            let chartList = []
            for (let i = 0; i < dataLength; i++) {
              pos = this.graphData.flowChartList[i].position.split(',');
              geo = _self.getCellGeo(this.graphData.flowChartList[i].text, pos[0], pos[1]);
              if (i === dataLength - 1) {
                vertex = graph.insertVertex(parent, null, this.getContentHtml(this.graphData.flowChartList[i], true), geo.x, geo.y, _self.vertexWidth, _self.vertexHeight);
              } else {
                vertex = graph.insertVertex(parent, null, this.getContentHtml(this.graphData.flowChartList[i], false), geo.x, geo.y, _self.vertexWidth, _self.vertexHeight);
              }
              chartList.push(vertex);
              console.log(chartList)
              vertex.text = this.graphData.flowChartList[i].text;
              preVertex = vertexAry[vertexAry.length - 1];
              if (this.graphData.flowChartList[i].refulsePosList) {
                for (let a = 0; a < dataLength; a++) {
                  if (this.graphData.flowChartList[i].refulsePosList[0] === this.graphData.flowChartList[a].position) {
                    // let pos1 = this.graphData.flowChartList[a].position.split(',');
                    // let geo1 = _self.getCellGeo(this.graphData.flowChartList[a].text, pos1[0], pos1[1]);
                    let cell = graph.insertEdge(parent, null, '拒绝', chartList[i], chartList[a], edgeStyle1);
                    _self.newGetEdgePoint(cell, chartList[i], chartList[a], this.graphData.flowChartList);
                    // cell.geometry.points = [new window.mxPoint(geo.x + this.vertexWidth / 2, geo.y - 20), new window.mxPoint(geo1.x + this.vertexWidth / 2, geo1.y - 20)];
                    window.mxUtils.setCellStyles(graph.getModel(), cell, 'sourcePort', 'n');
                    window.mxUtils.setCellStyles(graph.getModel(), cell, 'targetPort', 'n');
                  }
                }
              }
              edge = graph.insertEdge(parent, null, '', preVertex, vertex, edgeStyle);
              _self.getEdgePoint(edge, pos[0], pos[1], this.graphData.flowChartList);
              vertexAry.push(vertex);
            }
          }
        } finally {
          model.endUpdate();
        }
      },
      getContentHtml(data, flag) {
        let currentStyle = '';
        if (data.isCurNode === 1) {
          currentStyle = 'currentCell';
        }
        return '<div class="stepCell ' + currentStyle + '">' + data.text + '</div>';
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
      getCellInfo(graph, cellText, x, y, origin) {
        let active = {}
        this.graphData.map((item, index) => {
          if (item.text === cellText) {
            active = item
          }
        })
        let tipDiv = graph.tooltipHandler.div;
        if (active.iamUserInfo === null || active.iamUserInfo.length === 0) {
          tipDiv.innerHTML = `<div class="info-title"><i class="iconfont icon-tag"></i>处理人信息</div><div class="line">姓名：无</div><div class="line">邮箱：无</div><div class="line">电话：无</div>`;
        } else if (active.iamUserInfo.length === 1) {
          tipDiv.innerHTML = `<div class="info-title"><i class="iconfont icon-tag"></i>处理人信息</div><div class="line">姓名：${active.iamUserInfo[0].userRealName || '无'}</div><div class="line">邮箱：${active.iamUserInfo[0].userMail || '无'}</div><div class="line">电话：${active.iamUserInfo[0].userCellphone || '无'}</div>`;
        } else {
          let body = '';
          active.iamUserInfo.map((item, index) => {
            body += `<tr>
                <td>${item.userRealName || '无'}</td>
                <td>${item.userMail || '无'}</td>
                <td>${item.userCellphone || '无'}</td>
              </tr>`;
          })
          let html = `<table class="flowchart-float-window"><caption><div class="float-title"><i class="iconfont icon-tag"></i>处理人信息</div></caption><thead><tr><th>姓名</th><th>邮箱</th><th>电话</th></tr></thead>
              <tbody>${body}</tbody></table>`;
          tipDiv.innerHTML = html;
        }
        tipDiv.style.left = (x + origin.x) + 'px';
        tipDiv.style.top = (y + window.mxConstants.TOOLTIP_VERTICAL_OFFSET + origin.y) + 'px';
        tipDiv.style.visibility = '';
        this.fit(tipDiv);
      },
      fit(node) {
        let left = parseInt(node.offsetLeft);
        let width = parseInt(node.offsetWidth);
        let offset = window.mxUtils.getDocumentScrollOrigin(node.ownerDocument);
        let sl = offset.x;
        let st = offset.y;
        let b = document.body;
        let d = document.documentElement;
        let right = (sl) + (b.clientWidth || d.clientWidth);
        if (left + width > right) {
          node.style.left = Math.max(sl, right - width - 10) + 'px';
        }
        let top = parseInt(node.offsetTop);
        let height = parseInt(node.offsetHeight);
        let bottom = st + Math.max(b.clientHeight || 0, d.clientHeight);
        if (top + height > bottom) {
          node.style.top = Math.max(st, bottom - height * 2) + 'px';
        }
      },
      newGetEdgePoint(edge, x, y, graphData) {
        let x1 = x.geometry.x
        let x2 = y.geometry.x
        let y1 = x.geometry.y
        edge.geometry.points = [new window.mxPoint(x1 + this.vertexWidth / 2, y1 - 30), new window.mxPoint(x2 + this.vertexWidth / 2, y1 - 30)];
      },
      getEdgePoint(edge, x, y, graphData) {
        // 通过第二个点和上一个点算出折点的位置
        // 先通过y坐标判断两个点的位置
        // 第二个在第一个上

        let eGeo = edge.target.getGeometry();
        let bGeo = edge.source.getGeometry();
        let _self = this;
        let isTopLine = false;
        let twoPointFlag = false;
        let parallelLine = false;
        if (graphData && graphData.length !== 0) {
          graphData.map((item, i) => {
            // 获取当前的定位
            let position1 = item.position.split(',');
            if (x === position1[0] && y === position1[1] && i > 2) {
              // 获取上个项的定位
              let position2 = graphData[i - 1].position.split(',');
              // 获取上上个项的定位
              let position3 = graphData[i - 2].position.split(',');
              if (parseInt(position1[0]) > parseInt(position2[0]) && parseInt(position2[0]) < parseInt(position3[0]) && parseInt(position3[1]) === parseInt(position2[1])) {
                isTopLine = true;
              }
              if (parseInt(position1[0]) === parseInt(position2[0]) && parseInt(position1[1]) < parseInt(position2[1])) {
                parallelLine = true;
              }
              // 上上个与当前不在同一行
              if ((parseInt(position1[0]) === parseInt(position3[0]) || parseInt(position1[0]) < parseInt(position3[0])) && parseInt(position1[1]) > parseInt(position3[1]) && parseInt(position1[1]) !== parseInt(position2[1])) {
                twoPointFlag = true;
              }
            }
          });
        }
        if (isTopLine) {
          edge.geometry.points = [new window.mxPoint(eGeo.x + _self.vertexWidth / 2, bGeo.y + _self.vertexHeight / 2)];
          return;
        }
        if (parallelLine) {
          edge.geometry.points = [new window.mxPoint(eGeo.x + _self.vertexWidth / 2, bGeo.y + _self.vertexHeight / 2)];
          return;
        }
        if (twoPointFlag) {
          let x = bGeo.x + (eGeo.x - bGeo.x) / 2;
          edge.geometry.points = [new window.mxPoint(x + _self.vertexWidth / 2, bGeo.y + _self.vertexHeight / 2), new window.mxPoint(x + _self.vertexWidth / 2, eGeo.y + _self.vertexHeight / 2)];
          return;
        }
        if (eGeo.y < bGeo.y) {
          if (eGeo.x === bGeo.x) {
            return;
          } else {
            edge.geometry.points = [new window.mxPoint(eGeo.x + _self.vertexWidth / 2, bGeo.y + _self.vertexHeight / 2)];
          }
        }
        // 第二个和第一个在同一层
        if (eGeo.y === bGeo.y) {
          return;
        }
        // 第二个在第一个下
        if (eGeo.y > bGeo.y) {
          if (eGeo.x === bGeo.x) {
            return;
          } else {
            // 采用第二个的y坐标+cell高度的一半，第一个的x坐标+cell宽度的一半
            edge.geometry.points = [new window.mxPoint(bGeo.x + _self.vertexWidth / 2, eGeo.y + _self.vertexHeight / 2)];
          }
        }
      },
      getCellGeo(text, x, y) {
        // 系统标题栏
        let headerBarHeight = document.getElementById('headBar').offsetHeight;
        let tableTileHeight = document.getElementById('graphTableTitle').offsetHeight;
        var element = document.getElementById('cell' + x + y);
        var gCellWidth = element.offsetWidth;
        var gCellHeight = element.offsetHeight;
        var scrollHeight = document.documentElement.scrollTop;
        let xx = element.getBoundingClientRect().left;
        let yy = element.getBoundingClientRect().top;
        let titleLineHeight = document.querySelector('.process-title-line').offsetHeight;
        var percent = 1 / 2;
        // if (text === '计划') {
        //   percent = 1 / 4;
        // }
        // if (text === '技术审批') {
        //   percent = 3 / 4;
        // }
        // 宽度上需要减去10个像素的右侧线宽 高度上30表示上边距
        return { 'x': gCellWidth * percent - this.vertexWidth / 2 + xx - 10, 'y': scrollHeight + gCellHeight / 2 - this.vertexHeight / 2 - headerBarHeight - titleLineHeight + tableTileHeight - 30 + yy }
      },
      getFlowData() {
        $axios.get(`/safetyPlatform/safeOrder/getOrderFlowChart/${this.$route.params.orderUuid}`).then(({ status, data }) => {
          if (status === 200 || status === 304) {
            this.graphData = data
            this.$nextTick(() => {
              this.initGraph();
            })
          } else {
            this.$message({
              type: 'error',
              message: '获取流程图数据失败，请刷新页面'
            })
          }
        })
      },
      refresh() {
        window.location.reload();
      }
    }
  }
</script>
