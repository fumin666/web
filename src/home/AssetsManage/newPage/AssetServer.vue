<!--
 * @Author: 高建鹏
 * @Version: //Q4资产管理一级页面
 * @Description:服务器主机
 * @Position:资产管理一级页面-》服务器主机
 * @Date: 2019-10-18 09:26:21
 * @LastEditors: mybells
 -->

<template>
  <section class="assetServer">
    <s-card class="box-card card-line" style="height:100%;">
      <div slot="header" class="clearfix" style="padding:0;border:none;">
        <span class="card-title">
          {{ cardConfig.title }}
          <span style="font-size:12px;">（按操作系统分类统计）</span>
        </span>
      </div>
      <div style="background:unset;height:100%;">
        <s-chart v-if="chartData.data.length" :chart="chartData"></s-chart>
        <div v-nodata="!chartData.data.length"></div>
      </div>
      <div class="clr"></div>
    </s-card>
  </section>
</template>
<script type="text/babel">
  import { merge } from 'lodash'
  import pieChartOption from '@/components/chart/pieChartOption.js'
  import $axios from 'sunflower-ajax';
  export default {
    name: 'assetServer',
    props: {
      refresh: {
        type: Boolean,
        default: false
      }
    },
    data () {
      return {
        cardConfig: {
          title: '服务器主机'
        },
        isTop5: true,
        chartData: {
          name: 'assetServerChartData',
          type: 'pieChart',
          width: '100%',
          height: '100%',
          data: []
        }
      }
    },
    created() {
      let mainTheme = localStorage.getItem('theme');
      this.getTheme(mainTheme)
      this.initData();
    },
    methods: {
      initData() {
        $axios.get(`/resourcemanager/assetmanager/itasset/operatingSystemCountForServer`).then(({data}) => {
          let obj = data || {};
          this.chartData.data = Object.keys(obj).map((key) => {
            return {name: key, value: obj[key]};
          });
        })
      },
      getTheme(val) {
        if (val === 'dark') {
          this.chartData.option = merge({}, this.chartData.option, pieChartOption.dark)
        } else {
          this.chartData.option = merge({}, this.chartData.option, pieChartOption.light)
        }
      }
    },
    watch: {
      '$store.state.theme': function(val) {
        this.getTheme(val)
      },
      refresh(val) {
        if (val) {
          this.initData();
        }
      }
    }
  }
</script>
<style lang="stylus">
.assetServer
  .s-card-header
    border:none !important;
</style>
