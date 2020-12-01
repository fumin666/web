<!--
 * @Author: 高建鹏
 * @Description: Q3资产监控模块统计图
 * @Position:
 * @Date: 2019-07-22 15:08:04
 * @LastEditors: 高建鹏
 -->
<template>
  <div class="monitorview">
    <s-row class="buttongroup">
      <s-button-group style="float:right;" class="btnStyle">
        <s-button icon="histogram" @click="showModel('graph')">统计图模式</s-button>
        <s-button icon="list" @click="showModel('list')" class="listStyle">列表模式</s-button>
      </s-button-group>
    </s-row>
    <s-row class="main">
      <s-col :span="21">
          <img style="width:24px;height:27px;" :src="`../../../static/images/assetview/title/${getComponentName()[1]}.svg`">
          <span class="mainname">{{getComponentName()[0]}}</span>
      </s-col>
      <s-col :span="3">
        <s-popover popper-class="poppermodal" :tabindex="10" ref="popover" width="300" placement="bottom-end" trigger="click" @hide="close">
          <monitor-view-setting v-if="openDrawer" @close="close" :setData="setData" :monitorCiypeuuid='monitorCiypeuuid' @reload="reload"></monitor-view-setting>
          <i class="iconfont icon-set mainicon" slot="reference" @click="openDrawer=!openDrawer"></i>
        </s-popover>
      </s-col>
    </s-row>
    <component :is="componentName" :ref="componentName" :chunkData="chunkData" :setData="setData" :monitorCiypeuuid='monitorCiypeuuid'></component>
  </div>
</template>
<script type="text/babel">
  import {chunk} from 'lodash';
  import * as relation from './viewpage/relation.js';
  import $axios from 'sunflower-ajax';
  import hostSystem from './viewpage/HostSystem.vue'
  import serverHardware from './viewpage/ServerHardware.vue'
  import networkDevices from './viewpage/NetworkDevices.vue'
  import memory from './viewpage/Memory.vue'
  import dataBase from './viewpage/DataBase.vue'
  import middleWare from './viewpage/MiddleWare.vue'
  import terminal from './viewpage/Terminal.vue'
  import monitorViewSetting from './dialog/MonitorViewSetting.vue'
export default {
  components: {
    hostSystem, // 主机系统
    serverHardware, // 主机硬件
    networkDevices, // 网络设备
    memory, // 存储
    dataBase, // 数据库
    middleWare, // 中间件
    terminal, // 终端
    monitorViewSetting
  },
  data() {
    return {
      openDrawer: false,
      componentName: 'hostSystem',
      setData: {}, //
      chunkData: []
    }
  },
  created () {
    this.getData()
  },
  methods: {
    getData() {
      this.monitorCiypeuuid = this.$route.query.uuid;
      this.componentName = this.getComponentName()[1];
      /* 获取排序和展示的模块 */
      $axios.get(`/monitorview/getConfig/${this.monitorCiypeuuid}`).then((res) => {
        this.setData = res.data;
        let isShowData = res.data.configs.filter(item => item.isShow === 1).sort((a, b) => a.viewIndex - b.viewIndex);
        isShowData.map(item => {
          if (relation[this.getComponentName()[1]][item.viewName].componentId === 'statusBusiness') {
            item.title = item.viewName
          } else {
            item.title = item.viewName + 'TOP' + res.data.topN
          }
        })
        this.chunkData = chunk(isShowData, 3);
      });
    },
    showModel(type) {
      if (type === 'list') {
        this.$router.replace({
          path: '/AssetsMonitor/assetsMonitor_list',
          query: {uuid: this.$route.query.uuid, name: this.$route.query.name}
        })
      }
    },
    getComponentName() {
      let mainname = this.$route.query.name;
      switch (mainname) {
        case '主机系统':
          return ['主机系统', 'hostSystem'];
        case '主机硬件':
          return ['主机硬件', 'serverHardware'];
        case '网络设备':
          return ['网络设备', 'networkDevices'];
        case '存储':
          return ['存储', 'memory'];
        case '数据库':
          return ['数据库', 'dataBase'];
        case '中间件':
          return ['中间件', 'middleWare'];
        case '终端':
          return ['终端', 'terminal'];
        default:
          return ['主机系统', 'hostSystem'];
      }
    },
    reload() {
      this.$refs.popover.doClose();
      this.openDrawer = false;
      this.getData();
    },
    close() {
      this.$refs.popover.doClose()
      this.openDrawer = false;
    }
  }
}
</script>

<style lang="stylus">
  .buttongroup
    padding:0 10px;
  .main
    padding:5px 10px 0 10px;
    margin-bottom: 0;
    .mainname
      font-size:16px;
      font-weight:bold;
      position:relative;
      top:-6px;
    .mainicon
      cursor pointer;
      font-size:24px;
      float:right;
</style>
