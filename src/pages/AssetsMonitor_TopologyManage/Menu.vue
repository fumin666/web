<template>
  <div id="topologyMenu">
    <s-button icon="left" class="collapse_btn" @click="controlLeftPanel" v-if="leftShow" title="隐藏左侧面板"></s-button>
    <s-button icon="right" class="collapse_btn" @click="controlLeftPanel" v-if="!leftShow" title="显示左侧面板"></s-button>
    <s-button icon="refresh-circle" @click="refresh" title="刷新"></s-button>
<!--    <s-button icon="self-test" @click="topologyDiscover" title="拓扑发现"></s-button>-->
    <s-dropdown>
      <s-button title="拓扑发现">
        <i class="icon iconfont icon-find"></i>
      </s-button>
      <s-dropdown-menu slot="list">
        <s-dropdown-item  @click.native="addTopologyDiscover"><i class="icon iconfont icon-click"></i><span class="item-title">拓扑发现</span></s-dropdown-item>
        <!-- <s-dropdown-item  @click.native="addTopologyDiscover"><i class="icon iconfont icon-capture-screen"></i><span class="item-title">增量拓扑发现</span></s-dropdown-item> -->
      </s-dropdown-menu>
    </s-dropdown>
    <s-dropdown @on-click="changeMouseType">
      <s-button :icon="mouseIcon" title="鼠标模式">
        <i class="iconfont icon-bottom"></i>
      </s-button>
      <s-dropdown-menu slot="list">
        <s-dropdown-item :name="0"><i class="icon iconfont icon-click"></i><span class="item-title">点击</span></s-dropdown-item>
        <s-dropdown-item :name="1"><i class="icon iconfont icon-capture-screen"></i><span class="item-title">抓屏</span></s-dropdown-item>
      </s-dropdown-menu>
    </s-dropdown>
    <s-dropdown @on-click="exeLayout">
    <s-button icon="layout" title="布局">
      <i class="iconfont icon-bottom"></i>
    </s-button>
    <s-dropdown-menu slot="list">
      <s-dropdown-item name="circle"><span class="item-title">环形</span></s-dropdown-item>
      <s-dropdown-item name="organic"><span class="item-title">有机</span></s-dropdown-item>
      <s-dropdown-item name="horizontalTree"><span class="item-title">水平树</span></s-dropdown-item>
      <s-dropdown-item name="verticalTree"><span class="item-title">垂直树</span></s-dropdown-item>
      <s-dropdown-item name="radialTree"><span class="item-title">径向树</span></s-dropdown-item>
      <s-dropdown-item name="horizontalFlow"><span class="item-title">水平流</span></s-dropdown-item>
      <s-dropdown-item name="verticalFlow"><span class="item-title">垂直流</span></s-dropdown-item>
    </s-dropdown-menu>
  </s-dropdown>
    <s-dropdown v-if="modeLabel === 2" @on-click="alignCells">
      <s-button icon="window" title="对齐">
        <i class="iconfont icon-bottom"></i>
      </s-button>
      <s-dropdown-menu slot="list">
        <s-dropdown-item name="left">
          <i class="icon iconfont icon-align-left"></i>
          <span class="item-title">左对齐</span>
        </s-dropdown-item>
        <s-dropdown-item name="center">
          <i class="icon iconfont icon-align-level"></i>
          <span class="item-title">水平居中</span>
        </s-dropdown-item>
        <s-dropdown-item name="right">
          <i class="icon iconfont icon-align-right"></i>
          <span class="item-title">右对齐</span>
        </s-dropdown-item>
        <s-dropdown-item name="top">
          <i class="icon iconfont icon-align-top"></i>
          <span class="item-title">顶部对齐</span>
        </s-dropdown-item>
        <s-dropdown-item name="middle">
          <i class="icon iconfont icon-align-vertical"></i>
          <span class="item-title">垂直居中</span>
        </s-dropdown-item>
        <s-dropdown-item name="bottom">
          <i class="icon iconfont icon-align-bottom"></i>
          <span class="item-title">底部对齐</span>
        </s-dropdown-item>
      </s-dropdown-menu>
    </s-dropdown>
    <s-button icon="disk" title="保存" @click="saveTopology"></s-button>
    <s-button icon="export" title="导出" @click="exportGraph"></s-button>
    <s-dropdown v-if="modeLabel === 2" @on-click="changeDefaultEdge">
      <s-button icon="window" title="线型">
        <i class="iconfont icon-bottom"></i>
      </s-button>
      <s-dropdown-menu slot="list">
        <s-dropdown-item name="0">
          <i class="icon iconfont icon-straight"></i>
          <span class="item-title">直线</span>
        </s-dropdown-item>
        <s-dropdown-item name="1">
          <i class="icon iconfont icon-orthogonal"></i>
          <span class="item-title">正交</span>
        </s-dropdown-item>
        <s-dropdown-item name="2">
          <i class="icon iconfont icon-curve"></i>
          <span class="item-title">曲线</span>
        </s-dropdown-item>
        <s-dropdown-item name="3">
          <i class="icon iconfont icon-entity"></i>
          <span class="item-title">实体关系</span>
        </s-dropdown-item>
      </s-dropdown-menu>
    </s-dropdown>
    <s-dropdown @on-click="realTimeDropdownClick"  v-if="modeLabel === 1">
      <s-button icon="icon iconfont icon-script-set" title="实时信息设置">
        <i class="iconfont icon-bottom"></i>
      </s-button>
      <s-dropdown-menu slot="list">
        <s-dropdown-item name="0">
            <i class="icon iconfont icon-correct-bold" v-if="realtime[0] === 1"></i>
            <i class="icon iconfont icon-minus-bold" v-if="realtime[0] === 0"></i>
            <span class="item-title">线上流量</span>
        </s-dropdown-item>
        <s-dropdown-item name="1">
            <i class="icon iconfont icon-correct-bold" v-if="realtime[1] === 1"></i>
            <i class="icon iconfont icon-minus-bold" v-if="realtime[1] === 0"></i>
            <span class="item-title">资产在线状态</span>
        </s-dropdown-item>
        <s-dropdown-item name="2">
            <i class="icon iconfont icon-correct-bold" v-if="realtime[2] === 1"></i>
            <i class="icon iconfont icon-minus-bold" v-if="realtime[2] === 0"></i>
            <span class="item-title">未处理事件个数</span>
        </s-dropdown-item>
        <s-dropdown-item name="3">
            <i class="icon iconfont icon-correct-bold" v-if="realtime[3] === 1"></i>
            <i class="icon iconfont icon-minus-bold" v-if="realtime[3] === 0"></i>
            <span class="item-title">子拓扑在线状态</span>
        </s-dropdown-item>
      </s-dropdown-menu>
    </s-dropdown>
    <s-button icon="pie-chart" @click="statisticsAction" title="当前图统计"></s-button>
    <s-button icon="full-screen" title="全屏" v-if="fullPage === false" @click="fullPageAction"></s-button>
    <s-button icon="cancel-full-screen" title="退出全屏" v-if="fullPage" @click="fullPageAction"></s-button>
    <s-button-group class="fl-right">
      <s-button title="切换为查看模式" v-if="modeLabel === 2" icon="eye" @click="changeMode(1)"></s-button>
      <s-button title="切换为编辑模式" v-if="modeLabel === 1" icon="edit" @click="changeMode(2)"></s-button>
    </s-button-group>
    <div class="clr"></div>
    <scan-socket v-if="socketFlag" :name-space="nameSpace" ref="socket"
                 @message-callback="messageCallback"
    ></scan-socket>
    <s-dialog
      v-model="tuopuDialog"
      v-if="tuopuDialog"
      style="line-height:25px"
      width="700px"
      title="拓扑发现">
      <div>确认执行拓扑发现？</div></br>
      <s-checkbox v-model="tupuAgain" class="radio" true-label='1' false-label='0'>重新绘制</s-checkbox>
      <template slot="footer">
        <s-button @click="topologyDiscover(1)">确定</s-button>
        <s-button @click="tuopuDialog = false">取消</s-button>
      </template>
    </s-dialog>
  </div>
</template>
<script>
import RealtimeInfo from './module/topology.realtimeInfo'
import mixin from './module/topology.menuMixin'
import { startScanTopo } from './api/topology_api';
import scanSocket from '@/components/socketClient/SocketClient'
import $axios from 'sunflower-ajax';

export default {
  mixins: [mixin],
  components: {
    scanSocket
  },
  data () {
    return {
      mouseType: 0, // 0点击、1抓屏
      fullPage: false, // 是否全屏
      lineType: 0, // 线型 0 直线 1 正交 2 曲线 3 实体关系
      fullscreenLoading: false,
      loadingInstance: null,
      leftShow: true,
      socketFlag: false,
      nameSpace: '',
      curTime: null,
      tuopuDialog: false,
      tupuAgain: 0
    }
  },
  props: {
    realtime: {
      type: Array,
      required: true
    },
    modeLabel: {
      type: Number,
      required: true
    }
  },
  watch: {
    modeLabel: function (val, oldVal) {
      this.changeGraphMode(val);
    }
  },
  methods: {
    statisticsAction () {
      this.$router.push(window.TopologyGraph.getGraphVm().baseRoute + '/statistics/' + window.paramSubTopo);
      this.$parent.topologyGraph.clearGraph();
    },
    controlLeftPanel () {
      if (this.$parent.collapseWidth === 0) {
        this.$parent.collapseWidth = 265;
        this.leftShow = true;
      } else {
        this.$parent.collapseWidth = 0;
        this.leftShow = false;
      }
    },
    changeMouseType (item) {
      this.mouseType = item;
      this.$parent.topologyGraph.setNewPanning(this.mouseType === 1);
    },
    realTimeDropdownClick (index) {
      let tempData = [this.$parent.realtime[0], this.$parent.realtime[1], this.$parent.realtime[2], this.$parent.realtime[3]];
      tempData[index] = (tempData[index] === 0) ? 1 : 0;
      this.$parent.realtime = tempData;
      if (index === '0') {
        // 线上流量
        RealtimeInfo.setFlowData(this.$parent.realtime[0], true);
      } else if (index === '1') {
        // 资产在线状态
        RealtimeInfo.setOnlineData(this.$parent.realtime[1], true);
      } else if (index === '2') {
        // 未恢复事件个数
        RealtimeInfo.setIncidentFlag(this.$parent.realtime[2], true);
      } else if (index === '3') {
        // 子拓扑在线状态
        RealtimeInfo.setSubTopoFlag(this.$parent.realtime[3], true);
      }
    },
    refresh () {
      RealtimeInfo.removeRealTimeInfo();
      this.$parent.topologyGraph.init(this.$parent);
    },
    changeMode (mode) {
      window.TopologyGraph.getGraphVm().modeLabel = mode;
    },
    fullPageAction () {
      this.fullPage = !this.fullPage;
      var $headBar = document.getElementById('headBar');
      var $footer = document.querySelector('.s-footer');
      var $scrollheight = document.querySelector('.sysScrollHeight');
      if (this.fullPage) {
        $scrollheight.style.height = $scrollheight.offsetHeight + $footer.offsetHeight + $headBar.offsetHeight + 'px';
        $headBar.style.display = 'none';
        $footer.style.display = 'none';
      } else {
        $headBar.style.display = 'block';
        $footer.style.display = 'block';
        $scrollheight.style.height = $scrollheight.offsetHeight - $footer.offsetHeight - $headBar.offsetHeight + 'px';
      }
      this.$parent.initDivHeight();
    },
    exeLayout (mark) {
      this.byLayout(mark);
    },
//    cycleAxiosPush() {
//      if (new Date().getTime() - this.curTime > 3 * 60 * 1000) { // 超过三分钟
//        this.timer && clearTimeout(this.timer);
//        this.loadingInstance.close();
//        this.refresh();
//        return;
//      }
//      scanTopo().then(({data}) => {
// //        this.timer = setTimeout(() => {
// //          this.cycleAxiosPush();
// //        }, 1000);
//        if (data.isfinish && data.totalCount === data.finishCount && data.totalCount !== 0) { // 扫描完成
//          clearTimeout(this.timer);
//          this.loadingInstance.close();
//          this.refresh();
//        }
//      });
//    },
    topologyDiscover() {
      if (this.tupuAgain === 0) {
        startScanTopo(`${window.paramSubTopo}/${1}`).then(({data}) => {
          if (data.state) {
            this.loadingInstance = this.$loading({fullscreen: true, text: '正在重新扫描拓扑...'});
//          this.cycleAxiosPush();
            this.nameSpace = 'topoScan';
            // 创建聊天室
            $axios.get(`/iamUserInfo/createPageConnection/${this.nameSpace}`).then(({data}) => {
              this.socketFlag = true;
            });
          } else {
            this.tuopuDialog = false;
            this.tupuAgain = 0
            this.$message({type: 'warning', message: data.errormsg})
          }
        });
      } else {
        this.tupuAgains()
      }

        this.curTime = new Date().getTime();
    },
    addTopologyDiscover() {
      this.tuopuDialog = true
    },
    tupuAgains() {
      this.$confirm('重新绘制网络拓扑，不会对现有形式进行保存，确认进行重新绘制操作？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        startScanTopo(`${window.paramSubTopo}/${0}`).then(({data}) => {
          if (data.state) {
            this.loadingInstance = this.$loading({fullscreen: true, text: '正在重新扫描拓扑...'});
//          this.cycleAxiosPush();
            this.nameSpace = 'topoScan';
            // 创建聊天室
            $axios.get(`/iamUserInfo/createPageConnection/${this.nameSpace}`).then(({data}) => {
              this.socketFlag = true;
            });
          } else {
            this.tuopuDialog = false;
            this.tupuAgain = 0
            this.$message({type: 'warning', message: data.errormsg})
          }
        });
        this.curTime = new Date().getTime();
      }).catch(() => { this.tuopuDialog = false; this.tupuAgain = 0 });
    },
    messageCallback(data) {
      let message = JSON.parse(data.message);
      this.$parent.incrementData = message.increment
      if (message.isfinish && message.totalCount !== 0) { // 扫描完成
        this.loadingInstance.close();
        this.tuopuDialog = false; this.tupuAgain = 0
        this.refresh();
      }
    },
    exportGraph () {
      var graph = window.TopologyGraph.getGraph();
      var bounds = graph.getGraphBounds();
      var scale = graph.view.scale;
      this.$parent.exportWidth = Math.ceil(bounds.width / scale);
      this.$parent.exportHeight = Math.ceil(bounds.height / scale);
      this.$parent.exportDialog = true;
    }
  },
  computed: {
    mouseIcon: function () {
      return this.mouseType === 0 ? 'click' : 'capture-screen';
    }
  }
}
</script>
<style>
#topologyMenu{
  height:50px;
  line-height: 45px;
  padding-left: 10px;
}
#topologyMenu .collapse_btn{
 padding:8px 2px;
}
#topologyMenu .s-button+.s-button{
  margin-left: 0px;
}
#topologyMenu .s-dropdown-item{
  padding:0 10px;
}
#topologyMenu .item-title{
  margin-left: 10px;
}
#topologyMenu .fl-right{
  float: right;
  margin-top: 10px;
  margin-right:5px;
}
#topologyMenu .clr{
  clear: both;
}
</style>
