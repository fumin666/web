<!--
 * @Author: 高建鹏
 * @Version: //Q4资产管理一级页面
 * @Description:资产分布
 * @Position:资产管理一级页面-》资产分布
 * @Date: 2019-10-18 09:26:21
 * @LastEditors: mybells
 -->

<template>
  <section class="assetDifference">
    <s-card class="box-card card-line">
      <div slot="header" class="clearfix" style="padding:0;border:none;">
        <span class="card-title">
          {{ cardConfig.title }}
          <span style="font-size:12px;">（按使用者部门）</span>
        </span>
      </div>
      <div style="background:unset;">
        <div class="buttongroup">
          <s-button-group style="float:right;">
            <s-button class="topbutton" :class="{hoverbutton:isTop5}" @click="btnClick(5)">Top5</s-button>
            <s-button class="topbutton" :class="{hoverbutton:!isTop5}" @click="btnClick(10)">Top10</s-button>
          </s-button-group>
          <div class="clr"></div>
        </div>
        <div v-if="isTop5" id="assetDifference_top5" :style="{height:chartHeight5,minHeight:'200px'}">
          <bar-chart v-if="chartDatatop5.data.length" :chart="chartDatatop5" key="top5"></bar-chart>
          <div v-nodata="!chartDatatop5.data.length"></div>
        </div>
        <div v-else id="assetDifference_top10" :style="{height:chartHeight10,minHeight:'200px'}">
          <bar-chart v-if="chartDatatop10.data.length" :chart="chartDatatop10" key="top10"></bar-chart>
          <div v-nodata="!chartDatatop10.data.length"></div>
        </div>
      </div>
    </s-card>
  </section>
</template>
<script type="text/babel">
  import barChart from '@/components/chart/barChart.vue'
  import $axios from 'sunflower-ajax';
  export default {
    name: 'assetDifference',
    components: {
      barChart
    },
    props: {
      refresh: {
        type: Boolean,
        default: false
      }
    },
    data () {
      return {
        cardConfig: {
          title: '资产分布'
        },
        chartHeight5: '100px',
        chartHeight10: '100px',
        isTop5: false,
        chartDatatop5: {
          height: '100%',
          name: 'assetDifferencetop5',
          data: [],
          option: {
            series: [
              {barWidth: '12px'},
              {barWidth: '15px'}
            ]
          }
        },
        chartDatatop10: {
          height: '100%',
          name: 'assetDifferencetop10',
          data: [],
          option: {
            series: [
              {barWidth: '12px'},
              {barWidth: '15px'}
            ]
          }
        }
      }
    },
    created() {
      this.initData();
    },
    methods: {
      initData() {
        $axios.get(`/resourcemanager/assetmanager/itasset/countItCompOperUuid`).then(({data}) => {
          this.chartDatatop5.data = data.slice(0, 5);
          this.chartDatatop10.data = data.slice(0, 10);
          this.chartHeight5 = data.slice(0, 5).length * 50 + 'px'
          this.chartHeight10 = data.slice(0, 10).length * 50 + 'px'
          this.isTop5 = true;
        })
      },
      btnClick(n) {
        if (n === 5) {
          this.isTop5 = true
        } else {
          this.isTop5 = false
        }
        this.$emit('isTop5', this.isTop5);
      }
    },
    watch: {
      refresh(val) {
        if (val) {
          this.initData();
        }
      }
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
.assetDifference
  .s-card-header
    border:none !important;
</style>
