<template>
  <div id='business-define'>
    <div class="topology_body" id="topology_body" v-loading.body="loading" element-loading-text="加载中..." :style="{height: topologyBodyHeight + 'px'}">
      <div class="topology_tree" :style="{width: collapseWidth + 'px'}">
          <s-collapse v-model="activeNames" accordion v-show="collapseWidth !== 0">
            <s-collapse-item  title="拓扑结构树" name="1" class="item">
              <s-scrollbar :wrap-style="'height: ' + collapseHeight1 + 'px;'">
                <s-tree
                  :data="treeData"
                  :props="defaultProps"
                  node-key="uuid"
                  default-expand-all
                  :current-node-key="currentNode"
                  :highlight-current="true"
                  :render-content="renderContent"
                  :expand-on-click-node="false"
                  @node-click="handleNodeClick"
                ></s-tree>
              </s-scrollbar>
            </s-collapse-item>
            <s-collapse-item title="设置与管理" name="2" class="item">
              <div :style="{height: collapseHeight2 + 'px'}">
                <s-row>
                  <s-col span="12"><s-button icon="manage-process" title="拓扑图管理" @click="showManageDialog">拓扑管理</s-button></s-col>
                  <s-col span="12"><s-button icon="line" title="链路管理" @click="gotoLineMange">链路管理</s-button></s-col>
                </s-row>
                <s-row>
                  <s-col span="12"><s-button icon="business-server" title="全局设置" @click="showConfigDialog">全局设置</s-button></s-col>
                  <s-col span="12"></s-col>
                </s-row>
              </div>
            </s-collapse-item>
          </s-collapse>
      </div>
      <div class="topology_graph_wrap" id="topology_graph_wrap">
        <tmenu ref="menu" :realtime="realtime" :modeLabel="modeLabel"></tmenu>
        <div>
          <div id="topology_graph" :style="{height: topologyGraphHeight + 'px'}" v-clickoutside="closeFloatBox"></div>
        </div>
        <div id="bottom_panel" :style="{height: bottomPanelHeight + 'px'}">
          <s-tab type="card" v-model="activeTabName">
            <s-tab-pane label="事件信息" style="padding-left:5px;padding-right:5px;" name="first">
              <event-list :config="config" v-if="activeTabName === 'first'"></event-list>
            </s-tab-pane>
            <s-tab-pane label="资产信息" style="padding-left:5px;padding-right:5px;" name="second">
              <device-list v-if="secondTabContent === 'list'" :config="config" :tableData="deviceData"></device-list>
              <device-detail v-if="secondTabContent === 'detail'" :deviceDetail="deviceDetailItem"></device-detail>
            </s-tab-pane>
            <s-tab-pane label="线路信息" style="padding-left:5px;padding-right:5px;" name="third">
              <link-list v-if="thirdTabContent === 'list'" :config="config" :tableData="linkData"></link-list>
              <link-detail v-if="thirdTabContent === 'detail'" :linkDetail="linkDetailItem"></link-detail>
            </s-tab-pane>
            <s-tab-pane :label="fourthTabTitle" style="padding-left:5px;padding-right:5px;" :vif="modeLabel === 2" name="fourth">
              <drag-panel ref="dragPanel" v-if="activeTabName === 'fourth' && fourthTabContent === 'dragPanel'" :graph="graph"></drag-panel>
              <group-panel v-if="fourthTabContent === 'groupDetail'" :cell="groupCell"></group-panel>
              <text-panel v-if="fourthTabContent === 'textDetail'" :cell="textCell"></text-panel>
            </s-tab-pane>
          </s-tab>
        </div>
        <div class="bottom_toggler_btn s-button-default" @click="collapseBottomPanel" :style="{bottom: bottomPanelHeight + 'px'}">
          <i class="icon iconfont icon-bottom" v-if="bottomPanelHeight !== 0"></i>
          <i class="icon iconfont icon-top" v-if="bottomPanelHeight === 0"></i>
        </div>
        <s-fishbone style="top:65px;left:20px;" ref="fishbone" :graph="graph" :scale="currentScale"></s-fishbone>
        <outline ref="outline" :graph="graph" :bottomPanelHeight="bottomPanelHeight"></outline>
      </div>

      <s-dialog v-model="configDialog" v-if="configDialog"  title="拓扑图全局设置" width="600">
        <topoloy-config ref="configForm" :config="config" v-if="configDialog"></topoloy-config>
        <template slot="footer" class="dialog-footer">
          <s-button type="cancel" @click="closeConfigDialog">关闭</s-button>
        </template>
      </s-dialog>
      <s-dialog v-model="manageDialog" v-if="manageDialog" title="拓扑图管理" width="750" :before-close="handleManageDialog">
        <tree-manage @change-route="changeTopoFlag=true"></tree-manage>
        <template slot="footer" class="dialog-footer">
          <s-button type="cancel" @click="closeManageDialog">关闭</s-button>
        </template>
      </s-dialog>
      <s-dialog v-model="exportDialog" v-if="exportDialog" title="拓扑导出">
        <export-form ref="exportForm" :height="exportHeight" :width="exportWidth"></export-form>
        <template slot="footer" class="dialog-footer">
          <s-button @click="exportSubmit">确定</s-button>
          <s-button @click="exportCancel" type="cancel">取消</s-button>
        </template>
      </s-dialog>
      <s-dialog v-model="customNodeDialog" v-if="customNodeDialog" width="450px" title="自定义节点">
        <custom-attr-form ref="customForm" :graph="graph" :tempCells="customCells" :edit="customEdit" :vform="editData"></custom-attr-form>
        <template slot="footer" class="dialog-footer">
          <s-button @click="customNodeSubmit">确定</s-button>
          <s-button @click="customNodeCancel" type="cancel">取消</s-button>
        </template>
      </s-dialog>
      <s-dialog v-model="childTopologyDialog" v-if="childTopologyDialog" title="添加子拓扑">
        <child-topology ref="childTopologyForm" :treeData="treeData"></child-topology>
        <template slot="footer" class="dialog-footer">
          <s-button @click="childTopologySubmit">确定</s-button>
          <s-button @click="childTopologyCancel" type="cancel">取消</s-button>
        </template>
      </s-dialog>
      <s-dialog v-model="pingDialog" v-if="pingDialog" :title="pingDialogTitle">
        <ping-form :ip="pingIp"></ping-form>
        <template slot="footer" class="dialog-footer">
          <s-button @click="pingDialogCancel" type="cancel">关闭</s-button>
        </template>
      </s-dialog>
      <s-dialog v-model="traceDialog" v-if="traceDialog" :title="traceDialogTitle">
        <trace-form :ip="traceIp"></trace-form>
        <template slot="footer" class="dialog-footer">
          <s-button @click="traceDialogCancel" type="cancel">关闭</s-button>
        </template>
      </s-dialog>
      <remote-ping-dialog v-model="remotePingDialog" v-if="remotePingDialog" :itCompId="remoteItCompId"></remote-ping-dialog>
      <icon-modify-dialog v-model="modifyIconDialog" v-if="modifyIconDialog" :cell="modifyCell"></icon-modify-dialog>
      <bg-modify-dialog v-model="backgroundModifyIconDialog" v-if="backgroundModifyIconDialog" :bgsrc="background"></bg-modify-dialog>
      <line-connect-dialog v-if="lineConnectDialogFlag" v-model="lineConnectDialogFlag" :modify-cell.sync="modifyCell" :type="connectLineType">
      </line-connect-dialog>
      <line-del-dialog v-if="lineDelDialogFlag" v-model="lineDelDialogFlag" :del-edge-id-arr="delEdgeIdArr">
      </line-del-dialog>
    </div>
  </div>
</template>
<script>
  import Clickoutside from '@/components/inputTree/clickoutside';
  import { getTopologyTree, getTopoviewConfig, getMonitorItcompList, getTopoviewLinkList } from './api/topology_api'
  import topologyGraph from './module/topology.graph'
  import topologyMenu from './Menu.vue'
  import fishbone from '@/components/graph/Fishbone'
  import outline from '@/components/graph/Outline'
  import eventList from './EventTable'
  import deviceList from './DeviceTable'
  import deviceDetail from './DeviceDetail'
  import linkList from './LinkTable'
  import linkDetail from './LinkDetail'
  import dragPanel from './DragPanel'
  import groupPanel from './GroupPanel'
  import textPanel from './TextPanel'
  import topoloyConfig from './TopologyConfig'
  import treeManage from './TreeManage'
  import exportForm from './ExportForm'
  import customAttrForm from './CustomAttrForm'
  import childTopology from './ChildTopologyForm'
  import pingForm from './PingForm'
  import traceForm from './TraceForm'
  import remotePingDialog from './RemotePingDialog'
  import iconModifyDialog from './IconModifyDialog'
  import bgModifyDialog from './BgModifyDialog'
  import lineConnectDialog from './dialog/LineConnectDialog'
  import lineDelDialog from './dialog/LineDelDialog'

  export default{
    data () {
      return {
        baseRoute: '',
        activeNames: ['1'],
        treeData: [],
        defaultProps: {
          children: 'childrenList',
          label: 'name',
          type: 'type',
          id: 'uuid',
          node: 'node'
        },
        topologyGraph: null,
        graph: {},
        config: {},
        loading: true,
        configDialog: false,
        manageDialog: false,
        exportDialog: false,
        customNodeDialog: false,
        childTopologyDialog: false,
        pingDialog: false,
        traceDialog: false,
        remotePingDialog: false,
        modifyIconDialog: false,
        backgroundModifyIconDialog: false,
        lineConnectDialogFlag: false,
        lineDelDialogFlag: false,
        customCells: [],
        groupCell: {},
        textCell: {},
        customEdit: false,
        editData: {},
        exportHeight: 0,
        exportWidth: 0,
        realtime: [0, 0, 0, 0],
        topologyBodyHeight: 600,
        topologyGraphHeight: 500,
        collapseHeight1: 500,
        collapseHeight2: 500,
        bottomPanelHeight: 0,
        collapseWidth: 265,
        activeTabName: 'second',
        secondTabContent: 'list', // 内容为list为列表 detail为详情
        deviceData: [],
        deviceDetailItem: {},
        thirdTabContent: 'list', // 内容为list为列表 detail为详情
        linkData: [],
        linkDetailItem: {},
        fourthTabTitle: '拖拽面板',
        fourthTabContent: '',
        pingIp: '',
        traceIp: '',
        remoteItCompId: '',
        modifyCell: {},
        background: '',
        currentScale: 1.2,
        modeLabel: 1,  // 模式
        connectLineType: '0',
        changeTopoFlag: false,
        delEdgeIdArr: []
      }
    },
    mounted () {
      this.baseRoute = this.$route.fullPath;
      if (this.baseRoute.split('/').length > 3) {
        let arr = this.baseRoute.split('/');
        let routeArr = [arr[0], arr[1], arr[2]];
        this.baseRoute = routeArr.join('/');
      }
      this.initDivHeight();
      window.addEventListener('resize', this.initDivHeight);
      // this.loadingInstance = this.$loading({fullscreen: true, text: '加载中...'});
      this.initGraph();
    },
    created() {
    },
    destroyed () {
      topologyGraph.clearGraph();
      window.TopologyGraph = undefined;
      window.removeEventListener('resize', this.initDivHeight);
      window.mxEvent.removeAllListeners(window);
      window.mxEvent.removeAllListeners(document);
    },
    watch: {
      '$route': 'fetchData',
      customNodeDialog: function (val, oldVal) {
        if (val === false) {
          this.$refs.customForm.removeCell();
        }
      },
      childTopologyDialog: function (val, oldVal) {
        if (val === false) {
          this.graph.removeCells(this.customCells);
          this.customCells = [];
        }
      },
      activeTabName(val) {
        if (this.bottomPanelHeight > 0) {
          this.getTabData(val);
        }
      }
    },
    computed: {
      currentNode() {
        return this.$route.params.id || 'topoviewinfodefaultuuid000000000';
      },
      pingDialogTitle() {
       return 'Ping ' + this.pingIp;
      },
      traceDialogTitle() {
        return 'Trace ' + this.traceIp;
      }
    },
    methods: {
      showManageDialog() {
        this.manageDialog = true;
      },
      gotoLineMange() {
        this.$router.push(this.baseRoute + `/link/${topologyGraph.getShowApp()}`);
        topologyGraph.clearGraph();
      },
      showConfigDialog() {
        this.configDialog = true
      },
      traceDialogCancel() {
        this.traceDialog = false;
      },
      pingDialogCancel() {
        this.pingDialog = false;
      },
      childTopologySubmit () {
        this.$refs.childTopologyForm.submit(() => {
          this.childTopologyDialog = false;
        });
      },
      childTopologyCancel () {
        this.childTopologyDialog = false;
      },
      customNodeSubmit () {
        if (this.customEdit) {
          this.$refs.customForm.updateCell(() => {
            this.customNodeDialog = false;
          });
        } else {
          this.$refs.customForm.submit(() => {
            this.customNodeDialog = false;
          });
        }
      },
      customNodeCancel () {
        this.customNodeDialog = false;
      },
      exportSubmit () {
        this.$refs.exportForm.submitForm();
        this.exportDialog = false;
      },
      exportCancel () {
        this.exportDialog = false;
      },
      configDialogClose () {
        this.$refs.configForm.resetData();
      },
      closeConfigDialog () {
        this.configDialog = false;
      },
      handleManageDialog(close) {
        close();
        getTopologyTree().then(({data}) => {
          this.treeData = data;
          if (this.changeTopoFlag) { // 删除当前拓扑节点则跳转到默认总拓扑
            this.$router.replace(this.baseRoute + '/topo_detail/topoviewinfodefaultuuid000000000')
          }
        });
      },
      closeManageDialog () {
        this.manageDialog = false;
        getTopologyTree().then(({data}) => {
          this.treeData = data;
          if (this.changeTopoFlag) { // 删除当前拓扑节点则跳转到默认总拓扑
            this.$router.replace(this.baseRoute + '/topo_detail/topoviewinfodefaultuuid000000000')
          }
        });
      },
      initDivHeight () {
        var footerHeight = document.querySelector('.s-footer').offsetHeight;
        var headerHeight = document.getElementById('headBar').offsetHeight;
        var menuHeight = document.getElementById('topologyMenu').offsetHeight;
        this.topologyBodyHeight = window.innerHeight - footerHeight - headerHeight - 38;
        this.topologyGraphHeight = this.topologyBodyHeight - menuHeight - this.bottomPanelHeight;
        this.collapseHeight1 = this.topologyBodyHeight - 75;
        this.collapseHeight2 = this.topologyBodyHeight - 90;
      },
      collapseBottomPanel () {
        if (this.bottomPanelHeight === 0) {
          this.bottomPanelHeight = 340;
          this.topologyGraphHeight = this.topologyGraphHeight - 340;
        } else {
          this.bottomPanelHeight = 0;
          this.topologyGraphHeight = this.topologyGraphHeight + 340;
        }
      },
      fetchData () {
        window.paramSubTopo = this.$route.params.id;
        topologyGraph.init(this);
        this.getTabData(this.activeTabName);
      },
      initGraph () {
        let _self = this;
        getTopologyTree().then(({data}) => {
          this.treeData = data;
          if (_self.$route.params.id) {
            window.paramSubTopo = _self.$route.params.id;
          } else {
            window.paramSubTopo = 'topoviewinfodefaultuuid000000000';
          }
          getTopoviewConfig().then((data) => {
            _self.config = JSON.parse(data);
            this.realtime = _self.config.realtime;
            this.topologyGraph = topologyGraph;
            // 释放到全局中供其他模块调用
            window.TopologyGraph = topologyGraph;
            topologyGraph.init(_self);
            this.getTabData(this.activeTabName);
          });
        });
      },
      getTabData(val) {
        switch (val) {
          case 'second':
            this.initDeviceTabData();
            break;
          case 'third':
            this.initLinkTabData();
            break;
        }
      },
      initDeviceTabData() { // 初始化资产选项卡列表数据
        getMonitorItcompList({
          subTopoId: window.paramSubTopo,
          showapp: this.config.showapp
        }, '1').then((data) => {
          this.deviceData = data;
        });
      },
      initLinkTabData() { // 初始化线路选项卡列表数据
        getTopoviewLinkList({
          subTopoId: window.paramSubTopo,
          showapp: this.config.showapp
        }).then((data) => {
          this.linkData = data;
        });
      },
      handleNodeClick (data) {
        if (data[this.defaultProps.node].type === 2) {
          this.$router.replace(this.baseRoute + '/topo_detail/' + data.uuid)
        }
      },
      renderContent(h, { node, data, store }) {
        let classNameStr = 'icon iconfont icon-picture';
        if (data.node.type === 1) {
          classNameStr = 'icon iconfont icon-folder';
        }
        var __icon = h('i', {
          domProps: {
            className: classNameStr
          }
        });
        return (
          <span>
            <span>{__icon} {node.label} </span>
          </span>
        );
      },
      closeFloatBox() {
        if (this.graph.popupMenuHandler && this.graph.popupMenuHandler.isMenuShowing()) {
          this.graph.popupMenuHandler.hideMenu();
        }
        if (document.querySelectorAll('.cellTips')[0]) {
          document.querySelectorAll('.cellTips')[0].style.visibility = 'hidden';
        }
      }
    },
    directives: { Clickoutside },
    components: {
      eventList,
      deviceList,
      deviceDetail,
      linkList,
      linkDetail,
      dragPanel,
      groupPanel,
      textPanel,
      outline,
      topoloyConfig,
      treeManage,
      exportForm,
      customAttrForm,
      childTopology,
      pingForm,
      traceForm,
      remotePingDialog,
      iconModifyDialog,
      bgModifyDialog,
      lineConnectDialog,
      lineDelDialog,
      'tmenu': topologyMenu,
      's-fishbone': fishbone
    }
  }
</script>
