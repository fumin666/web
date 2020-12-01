<template>
  <div class="process_graph_main">
    <div class="process-title-line">
      <div class="process-title">
        <div class="title-info">{{`问题单${this.$route.params.serialCode}流程图`}}</div>
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
          <div class="s-step otherType" id="step_11">
            <div class="s-step-main">
              <div class="s-step-title">标识与记录</div>
            </div>
          </div>
          <div class="s-step otherType" id="step_12">
            <div class="s-step-main">
              <div class="s-step-title">审查与分派</div>
            </div>
          </div>
          <div class="s-step otherType" id="step_13">
            <div class="s-step-main">
              <div class="s-step-title">调查与诊断</div>
            </div>
          </div>
          <div class="s-step otherType" id="step_14">
            <div class="s-step-main">
              <div class="s-step-title">解决与回顾</div>
            </div>
          </div>
          <div class="s-step otherType" id="step_15">
            <div class="s-step-main">
              <div class="s-step-title">已关闭</div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="parent" id="main-parent">
      <div class="g-graph-title">
        <div class="info">
          <div>问题请求人</div>
        </div>
        <div class="info">
          <div>问题经理</div>
        </div>
        <div class="info">
          <div>问题处理专家</div>
        </div>
      </div>
      <div class="g-graph-content">
        <div class="line">
          <div class="g-cell" id="cell11">
            <div class="r-line"></div>
          </div>
          <div class="g-cell" id="cell12">
            <div class="r-line"></div>
          </div>
          <div class="g-cell" id="cell13">
            <div class="r-line"></div>
          </div>
          <div class="g-cell" id="cell14">
            <div class="r-line"></div>
          </div>
          <div class="g-cell" id="cell15"></div>
        </div>
        <div class="line">
          <div class="g-cell" id="cell21">
            <div class="r-line"></div>
          </div>
          <div class="g-cell" id="cell22">
            <div class="r-line"></div>
          </div>
          <div class="g-cell" id="cell23">
            <div class="r-line"></div>
          </div>
          <div class="g-cell" id="cell24">
            <div class="r-line"></div>
          </div>
          <div class="g-cell" id="cell25"></div>
        </div>
        <div class="line">
          <div class="g-cell" id="cell31">
            <div class="r-line"></div>
          </div>
          <div class="g-cell" id="cell32">
            <div class="r-line"></div>
          </div>
          <div class="g-cell" id="cell33">
            <div class="r-line"></div>
          </div>
          <div class="g-cell" id="cell34">
            <div class="r-line"></div>
          </div>
          <div class="g-cell" id="cell35"></div>
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
    this.getFlowData(this.$route.params.orderUuid);
  },
  destroyed() {
    window.removeEventListener('resize', this.resizeHandler);
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
        var dataLength = this.graphData.length;
        var vertexAry = [];
        let preVertex, edge;
        if (dataLength > 0) {
          let pos = this.graphData[0].position.split(',');
          let geo = _self.getCellGeo(this.graphData[0].text, pos[0], pos[1]);
          let vertex;
          if (dataLength === 1) {
            vertex = graph.insertVertex(parent, null, this.getContentHtml(this.graphData[0].text, true), geo.x, geo.y, _self.vertexWidth, _self.vertexHeight);
          } else {
            vertex = graph.insertVertex(parent, null, this.getContentHtml(this.graphData[0].text, false), geo.x, geo.y, _self.vertexWidth, _self.vertexHeight);
          }
          vertex.text = this.graphData[0].text;
          vertexAry.push(vertex);
          for (let i = 1; i < dataLength; i++) {
            pos = this.graphData[i].position.split(',');
            geo = _self.getCellGeo(this.graphData[i].text, pos[0], pos[1]);
            if (i === dataLength - 1) {
              vertex = graph.insertVertex(parent, null, this.getContentHtml(this.graphData[i].text, true), geo.x, geo.y, _self.vertexWidth, _self.vertexHeight);
            } else {
              vertex = graph.insertVertex(parent, null, this.getContentHtml(this.graphData[i].text, false), geo.x, geo.y, _self.vertexWidth, _self.vertexHeight);
            }
            vertex.text = this.graphData[i].text;
            preVertex = vertexAry[vertexAry.length - 1];
            edge = graph.insertEdge(parent, null, '', preVertex, vertex, edgeStyle);
            _self.getEdgePoint(edge, pos[0], pos[1], this.graphData);
            vertexAry.push(vertex);
          }
        }
      } finally {
        model.endUpdate();
      }
    },
    getContentHtml(text, flag) {
      let currentStyle = '';
      if (flag) {
        currentStyle = 'currentCell';
      }
      return '<div class="stepCell ' + currentStyle + '">' + text + '</div>';
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
    getEdgePoint(edge, x, y, graphData) {
      // 通过第二个点和上一个点算出折点的位置
      // 先通过y坐标判断两个点的位置
      // 第二个在第一个上
      let eGeo = edge.target.getGeometry();
      let bGeo = edge.source.getGeometry();
      let _self = this;
      let isTopLine = false;
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
          }
        });
      }
      if (isTopLine) {
        edge.geometry.points = [new window.mxPoint(eGeo.x + _self.vertexWidth / 2, bGeo.y + _self.vertexHeight / 2)];
        return;
      }
      if (edge.target.text === '正在执行' && edge.source.text === '计划') {
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
      if (text === '计划') {
        percent = 1 / 4;
      }
      if (text === '技术审批') {
        percent = 3 / 4;
      }
      // 宽度上需要减去10个像素的右侧线宽 高度上30表示上边距
      return { 'x': gCellWidth * percent - this.vertexWidth / 2 + xx - 10, 'y': scrollHeight + gCellHeight / 2 - this.vertexHeight / 2 - headerBarHeight - titleLineHeight + tableTileHeight - 30 + yy }
    },
    getFlowData(uuid) {
      $axios.get(`/itilProblemOrder/getProblemFlowChart/${uuid}`).then(({ status, data }) => {
        if (status === 200 || status === 304) {
          this.graphData = data
          this.initGraph();
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
