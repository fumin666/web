/**
 * Created by dgunzi on 2017/5/23.
 */
import $axios from 'sunflower-ajax'
import {Download} from 'sunflower-common-utils'
import fishbone from '@/components/graph/Fishbone'
import staffAddDialog from '@/pages/Account_Man/StaffAddDialog'
import orgAdd from '@/pages/Account_Organization/OrgAdd'
import roleCheckMixin from '@/common/mixins/roleCheckMixin'

var orgGraphMixin = {
  mixins: [roleCheckMixin],
  data() {
    return {
      isActive: true,
      userAry: [],
      orgInfo: {
        departName: '',
        chargePerson: '',
        orgCounter: 0,
        accountCounter: 0
      },
      graph: {},
      importOrgDialog: false,
      staffAddDialog: false,
      showOrgAdd: false,
      showOrgEdit: false,
      treeNodeList: [],
      uploadObj: {},
      downObj: {},
      mxgraph: {},
      tempCell: null,
      allNodes: {},
      tempLevel: 0,
      departmentinfo: {
        departName: '',
        departParentName: '',
        departLeaderName: ''
      },
      firstTreeNodeName: ''
    };
  },
  components: {
    's-fishbone': fishbone,
    'dialog-org-add': orgAdd,
    staffAddDialog
  },
  created() {
    // 监听全局事件，主题切换
    this.$eventBus.$on('rebuild', this.buildHandler);
  },
  beforeDestroy() {
    // 取消事件
    this.$eventBus.$off('rebuild');
    window.mxEvent.removeAllListeners(window);
    window.mxEvent.removeAllListeners(document);
  },
  mounted() {
    this.createGraph()
  },
  methods: {
    showModel(type) {
      if (type === 'list') {
        this.isActive = false
      } else {
        this.isActive = true
      }
      this.$emit('change', type);
    },
    buildHandler() {
      this.initStyles();
      this.graph.refresh();
    },
    orgImport() {
      this.uploadObj = {
        type: 'post',
        url: '/departmentInfo/importDepartInfo'
      };
      this.downObj = {
        text: '导入组织机构模板',
        url: '/departmentInfo/importDepartTemplate'
      };
      this.importOrgDialog = true;
    },
    createGraph() {
      var _self = this;
      var container = document.getElementById('graphContainer');
      if (container) {
        $axios.get('/departmentInfo/getAllDepartmentInfoForTree').then((res) => {
          this.treeNodeList = res.data.treeNodeList;
          if (!window.mxClient.isBrowserSupported()) {
            window.mxUtils.error('Browser is not supported!', 200, false);
          } else {
            window.mxEvent.disableContextMenu(container);
            this.initGraph(window, container);
          }
          let form = {
            departUuid: this.treeNodeList[0].uuid,
            isUser: 1
          }
          $axios.post('/departmentInfo/getDepartIncludeUsers', form).then((res) => {
            _self.userAry = res.data.userList || [];
          });
          this.getAllNode(this.treeNodeList[0], true);
          this.setOrgInfo(this.treeNodeList[0]);
          // 判断是否在一级页面
          if (this.isLevelOne) {
            this.extendsTooltip();
          }
        });
      }
    },
    setOrgInfo(tNode) {
      let currentNode = this.allNodes[tNode.uuid];
      this.orgInfo = {
        departName: currentNode.departName,
        chargePerson: currentNode.departLeaderName,
        orgCounter: currentNode.childDepart || 0,
        accountCounter: currentNode.childUser || 0
      };
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
    // 初始化样式
    initStyles() {
      let graph = this.graph;
      var style = graph.getStylesheet().getDefaultVertexStyle();
      style[window.mxConstants.STYLE_SHAPE] = 'label';
      style[window.mxConstants.STYLE_STROKECOLOR] = 'none';
      style[window.mxConstants.STYLE_FILLCOLOR] = 'none';

      style = graph.getStylesheet().getDefaultEdgeStyle();
      style[window.mxConstants.STYLE_EDGE] = window.mxEdgeStyle.TopToBottom;
      style[window.mxConstants.STYLE_ENDARROW] = false;
      style[window.mxConstants.STYLE_STROKEWIDTH] = 2;
      // 不同主题线的颜色不同
      if (localStorage.getItem('theme') !== 'dark') {
        style[window.mxConstants.STYLE_STROKECOLOR] = '#B9B9B9';
      } else {
        style[window.mxConstants.STYLE_STROKECOLOR] = '#2CD8CF';
      }
    },
    initGraph(mxgraph, container) {
      mxgraph.mxEvent.removeAllListeners(window);
      var _self = this;
      this.graph = new mxgraph.mxGraph(container);
      var graph = this.graph;
      graph.setHtmlLabels(true);

      this.initStyles();
      graph.setCellsMovable(false);
      graph.setCellsResizable(false);
      graph.setAutoSizeCells(true);
      graph.setPanning(true);
      // 禁用节点双击，防止改变数据
      graph.dblClick = function (evt, cell) {
        return false;
      };
      graph.graphHandler.setSelectEnabled(false);
      graph.tooltipHandler.setEnabled(true);
      graph.centerZoom = true;
      graph.panningHandler.useLeftButtonForPanning = true;
      if (this.currentScale) {
        graph.view.scaleAndTranslate(parseFloat(this.currentScale), parseFloat(-310), parseFloat(260));
      }
      var layout = new mxgraph.mxCompactTreeLayout(graph, false);
      layout.useBoundingBox = false;
      layout.edgeRouting = false;
      layout.levelDistance = 60;
      layout.nodeDistance = 16;
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

      graph.popupMenuHandler.autoExpand = true;
      graph.popupMenuHandler.div.style['zIndex'] = 1006
      graph.popupMenuHandler.factoryMethod = function (menu, cell, evt) {
        graph.clearSelection();
        if (cell !== null && cell.isVertex()) {
          // 只有管理员有权限查看
          if (_self.isSystemAdmin) {
            menu.addItem('添加机构', mxgraph.mxClient.basePath + '/images/add_org.svg', function () {
              _self.tempCell = cell;
              _self.showOrgAdd = true;
            });
            menu.addItem('添加人员', mxgraph.mxClient.basePath + '/images/add_user.svg', function () {
              _self.staffAddDialog = true;
              _self.tempCell = cell;
            });
            menu.addItem('编辑', mxgraph.mxClient.basePath + '/images/edit_org.svg', function () {
              _self.tempCell = cell;
              _self.showOrgEdit = true;
            });
            if (cell.level !== 1) {
              menu.addItem('删除', mxgraph.mxClient.basePath + '/images/delete_org.svg', function () {
                _self.$confirm('确定删除？', '提示', {
                  confirmButtonText: '确定',
                  cancelButtonText: '取消',
                  type: 'warning'
                }).then(() => {
                  _self.deleteSubtree(cell);
                }).catch(() => {

                });
              });
            }
          }
        }
      };
      // 不在一级页面，则有点击事件
      if (!this.isLevelOne) {
        this.addClickEvent();
      }
      // 滚动事件
      mxgraph.mxEvent.addMouseWheelListener(function (evt, up) {
        var source = mxgraph.mxEvent.getSource(evt);
        if (source.nodeName === 'svg') {
          if (up) {
            graph.zoomIn();
          } else {
            graph.zoomOut();
          }
          var scale = graph.view.getScale();
          _self.$refs.fishbone.initSlider(scale);
        }
      });

      graph.getModel().beginUpdate();
      try {
        this.insertCells(parent, this.treeNodeList[0], null);
      } finally {
        graph.getModel().endUpdate();
        graph.fit();
        graph.center();
        var scale = graph.view.getScale();
        _self.$refs.fishbone.initSlider(scale);
      }
    },
    // 添加点击事件
    addClickEvent() {
      let _self = this;
      this.graph.addListener(window.mxEvent.CLICK, function (sender, evt) {
        let mouseEvt = evt.getProperty('event');
        let leftBtn = window.mxEvent.isLeftMouseButton(mouseEvt);
        if (leftBtn) {
          var cell = evt.getProperty('cell');
          if (typeof cell !== 'undefined' && cell.edge !== true) {
            _self.clickAction(cell);
            evt.consume();
          }
        }
      });
    },
    clickAction(cell) {
      let form = {
        departUuid: cell.uuid,
        isUser: 1
      }
      $axios.post('/departmentInfo/getDepartIncludeUsers', form).then((res) => {
        this.setOrgInfo(this.allNodes[cell.uuid]);
        this.userAry = res.data.userList || [];
      })
      if (cell != null) {
        var allCellDiv = document.querySelectorAll('.org-cell');
        allCellDiv.forEach(function (item) {
          item.className = 'org-cell';
        });
        var cellDiv = document.getElementById(cell.uuid + '-cell-val');
        cellDiv.className = cellDiv.className + ' org-cell-current';
      }
    },
    insertCells(parent, node, levelCell) {
      let upLevel = levelCell;
      if (levelCell === null) {
        upLevel = this.graph.insertVertex(parent, node.uuid, this.getCellHtml(node, true, 1), this.graph.container.offsetWidth / 2 - 50, 20, 120, 104);
        upLevel.uuid = node.uuid;
        upLevel.departName = node.name;
        upLevel.level = 1;
      }
      let currentCell = null;
      if (node.childrenList !== null && node.childrenList.length > 0) {
        for (let i = 0, length = node.childrenList.length; i < length; i++) {
          let currentLevel = upLevel.level + 1;
          currentCell = this.graph.insertVertex(parent, node.childrenList[i].uuid, this.getCellHtml(node.childrenList[i], false, currentLevel), 200, 20, 120, 104);
          currentCell.uuid = node.childrenList[i].uuid;
          currentCell.departName = node.childrenList[i].name;
          currentCell.level = currentLevel;
          this.graph.insertEdge(parent, null, '', upLevel, currentCell);
          this.insertCells(parent, node.childrenList[i], currentCell);
        }
      }
    },
    getCellHtml(node, flag, level) {
      let currentClass = '';
      if (flag && !this.isLevelOne) {
        currentClass = 'org-cell-current';
      }
      let levelClass = 'org-level3-cell';
      if (level < 3) {
        levelClass = 'org-level' + level + '-cell';
      }
      return '<div id="' + node.uuid + '-cell-val" class="org-cell ' + currentClass + '"><div class="org-cell-icon ' + levelClass + '"></div><div class="org-cell-title" title="' + node.name + '">' + node.name + '</div></div>';
    },
    addChild(node) {
      // 添加成功后刷新所有节点的数据，为了删除时可以检查是否有下级节点
      $axios.get('/departmentInfo/getAllDepartmentInfoForTree').then((res) => {
        this.treeNodeList = res.data.treeNodeList;
        let form = {
          departUuid: this.treeNodeList[0].uuid,
          isUser: 1
        }
        $axios.post('/departmentInfo/getDepartIncludeUsers', form).then((res) => {
          this.userAry = res.data.userList || [];
        });
        this.getAllNode(this.treeNodeList[0], true);
        this.setOrgInfo(this.treeNodeList[0]);
        let model = this.graph.getModel();
        model.clear();
        model.beginUpdate();
        try {
          this.insertCells(this.graph.getDefaultParent(), this.treeNodeList[0], null);
        } finally {
          model.endUpdate();
          this.graph.fit();
          this.graph.center();
          var scale = this.graph.view.getScale();
          this.$refs.fishbone.initSlider(scale);
        }
      });
    },
    updateChild() {
      $axios.get('/departmentInfo/getAllDepartmentInfoForTree').then((res) => {
        this.treeNodeList = res.data.treeNodeList;
        let form = {
          departUuid: this.treeNodeList[0].uuid,
          isUser: 1
        }
        $axios.post('/departmentInfo/getDepartIncludeUsers', form).then((res) => {
          this.userAry = res.data.userList || [];
        });
        this.getAllNode(this.treeNodeList[0], true);
        this.setOrgInfo(this.treeNodeList[0]);
        this.graph.getModel().clear();
        this.graph.getModel().beginUpdate();
        try {
          this.insertCells(this.graph.getDefaultParent(), this.treeNodeList[0], null);
        } finally {
          this.graph.getModel().endUpdate();
          this.graph.fit();
          this.graph.center();
          var scale = this.graph.view.getScale();
          this.$refs.fishbone.initSlider(scale);
        }
      });
    },
    deleteSubtree(cell) {
      if (cell.level === 1) {
        this.$message({
          message: '组织机构根节点不能删除！',
          type: 'warning'
        });
        return false;
      }
      var tnode = this.allNodes[cell.uuid];
      if (tnode.childDepart !== null && tnode.childDepart !== 0) {
        this.$message({
          message: '该组织机构包含下级机构无法删除！',
          type: 'warning'
        });
        return false;
      }
      if (tnode.childUser !== null && tnode.childUser !== 0) {
        this.$message({
          message: '该组织机构内包含人员,无法删除！',
          type: 'warning'
        });
        return false;
      }
      $axios.get('/departmentInfo/deleteDepartmentInfo/' + cell.uuid, {
        data: [{ departName: cell.departName }],
        logTemplate: '删除|组织机构管理>组织机构(#departName#)'
      }).then((res) => {
        if (res.data.result === 'success') {
          $axios.get('/departmentInfo/getAllDepartmentInfoForTree').then((res) => {
            this.treeNodeList = res.data.treeNodeList;
            this.getAllNode(this.treeNodeList[0], true);
          }).then(() => {
            this.graph.removeCells([cell]);
            delete this.allNodes[cell.uuid];
            this.graph.fit();
            this.graph.center();
            var scale = this.graph.view.getScale();
            this.$refs.fishbone.initSlider(scale);
            this.clickAction({ uuid: this.treeNodeList[0].uuid });
            this.$message({
              message: '删除成功！',
              type: 'success'
            });
          });
        } else {
          if (res.data.result === 'fail') {
            this.$message({ type: 'error', message: res.data.err });
          } else {
            this.$message.error('删除操作失败');
          }
        }
      });
    },
    orgExport() {
      Download('/departmentInfo/exportDepartInfo', { logTemplate: '导出|组织机构管理>组织机构(depart.xls)' });
    },
    staffAddCallback(uuid) {
      $axios.get('/departmentInfo/getAllDepartmentInfoForTree').then((res) => {
        this.treeNodeList = res.data.treeNodeList;
        this.getAllNode(this.treeNodeList[0], true);
        this.clickAction({ uuid: uuid });
      });
    },
    closeFloatBox() {
      if (this.graph.popupMenuHandler && this.graph.popupMenuHandler.isMenuShowing()) {
        this.graph.popupMenuHandler.hideMenu();
      }
      if (document.querySelectorAll('.org_graph-cell_tips')[0]) {
        document.querySelectorAll('.org_graph-cell_tips')[0].style.visibility = 'hidden';
      }
    },
    extendsTooltip() {
      let graph = this.graph;
      let _self = this;
      graph.tooltipHandler.init = function () {
        if (document.body !== null) {
          this.div = document.createElement('div');
          this.div.className = 'org_graph-cell_tips';
          this.div.style.visibility = 'hidden';
          this.div.style.zIndex = this.zIndex;

          document.body.appendChild(this.div);

          window.mxEvent.addListener(this.div, 'mousedown', window.mxUtils.bind(this,
            function (evt) {
              this.hideTooltip();
            }));
        }
      };
      graph.getTooltip = function (state, node, x, y) {
        let tip = null;
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
          let origin = window.mxUtils.getScrollOrigin();
          if (!tip.isEdge) {
            _self.setOrgInfo(_self.allNodes[tip.cell.uuid]);
            let template = `
                <div class="user-pic"></div>
                <div class="s-row">
                  <div class="s-col s-col-12">
                    <div class="c-title">责任人：</div>
                  </div>
                  <div class="s-col s-col-12">
                    <div class="c-item">${_self.orgInfo.chargePerson}</div>
                  </div>
                </div>
                <div class="s-row">
                  <div class="s-col s-col-12">
                    <div class="c-title">管理机构数：</div>
                  </div>
                  <div class="s-col s-col-12">
                    <div class="c-item">${_self.orgInfo.orgCounter}</div>
                  </div>
                </div>
                <div class="s-row">
                  <div class="s-col s-col-12">
                    <div class="c-title">管理人员数：</div>
                  </div>
                  <div class="s-col s-col-12">
                    <div class="c-item">${_self.orgInfo.accountCounter}</div>
                  </div>
                </div>
            `;
            let tipDiv = graph.tooltipHandler.div;
            tipDiv.innerHTML = template;
            tipDiv.style.left = (x + origin.x) + 'px';
            tipDiv.style.top = (y + window.mxConstants.TOOLTIP_VERTICAL_OFFSET + origin.y) + 'px';
            tipDiv.style.visibility = '';
            window.mxUtils.fit(tipDiv);
          }
        }
      };
    }
  }
};

export default orgGraphMixin
