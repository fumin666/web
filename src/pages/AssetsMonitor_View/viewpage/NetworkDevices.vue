<!--
 * @Author: 高建鹏
 * @Description: 网络设备监控视图
 * @Position: 
 * @Date: 2019-08-07 15:43:04
 * @LastEditors: 高建鹏
 -->
<template>
<div class="vnetworkdevices">
  <v-grid :data="chunkData">
    <component v-for="(obj, key, index) in frameworkData" :key="index" :slot="obj.title" :is="obj.componentId" :data="obj.data"></component>
  </v-grid>
</div>
</template>
<script>
  // import $axios from 'sunflower-ajax'
  // import {chunk} from 'lodash'
  import commonMixins from './commonMixins.js'
  import vGrid from '../components/businessComponents/vGrid.vue'
  import lineBusiness from '../components/businessComponents/lineBusiness.vue'
  import circlarBusiness from '../components/businessComponents/circlarBusiness.vue'
  import sigleProcessBusiness from '../components/businessComponents/sigleProcessBusiness.vue'
  import moreProcessBusiness from '../components/businessComponents/moreProcessBusiness.vue'
  export default {
  components: {
    vGrid,
    lineBusiness,
    circlarBusiness,
    sigleProcessBusiness,
    moreProcessBusiness
  },
  props: {
    monitorCiypeuuid: {// 资产类型
      type: String
    },
    chunkData: {// 要显示的资产类型和顺序
      type: Array,
      default: []
    }
  },
  data() {
    return {
      name: 'networkDevices', // 网络设备，watch中会用到，为了取到对应componentId
      frameworkData: []// 对应组件的data
    }
  },
  mixins: [commonMixins], // 监听chunkData变化
  methods: {
  }
}
</script>

<style lang="stylus">
  .vnetworkdevices
    .s-grid-item
      margin:10px;
    .vrowstyle
      width:99%;
      height: 150px;
      margin:0 auto;
    .vpage
      .s-tabs-nav-wrap:after
        background-color: unset;
      .s-tabs-nav-scroll
        display: flex;
        justify-content: center;
      .s-tabs-header
        margin:0
</style>