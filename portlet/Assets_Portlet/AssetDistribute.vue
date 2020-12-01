/**
* Created by dgunzi on 2018/5/16.
*/

<template>
  <div class="diy-asset-distribute assetcontentfix">
    <s-card-diy class="assetDifference" :title="cardConfig.title" :show-more="false" show-scrollbar>
      <div class="buttongroup">
          <s-button-group style="float:right;margin-right:10px;">
          <s-button class="topbutton" :class="{hoverbutton:isTop5}" @click="isTop5=true">Top5</s-button>
          <s-button class="topbutton" :class="{hoverbutton:!isTop5}" @click="isTop5=false">Top10</s-button>
        </s-button-group>
        <div class="clr" style="clear:both;"></div>
      </div>
      <div>
        <div v-if="isTop5" :style="{height:chartHeight5}">
          <bar-chart v-if="chartDatatop5.data.length" :chart="chartDatatop5" key="top5"></bar-chart>
          <div v-if="!chartDatatop5.data.length" v-nodata="!chartDatatop5.data.length"></div>
        </div>
        <div v-else :style="{height:chartHeight10}">
          <bar-chart v-if="chartDatatop10.data.length" :chart="chartDatatop10" key="top10"></bar-chart>
          <div v-if="!chartDatatop5.data.length" v-nodata="!chartDatatop10.data.length"></div>
        </div>
      </div>
    </s-card-diy>
  </div>
</template>
<script type="text/babel">
  import $axios from 'sunflower-ajax';
  import barChart from '@/components/chart/barChart.vue'
  export default {
    name: 'assetDistribute',
    components: {
      barChart
    },
    data () {
      return {
        cardConfig: {
          title: '资产分布'
        },
        chartHeight5: '230px',
        chartHeight10: '230px',
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
      $axios.get(`/resourcemanager/assetmanager/itasset/countItCompOperUuid`).then(({data}) => {
        this.chartDatatop5.data = data.slice(0, 5);
        this.chartDatatop10.data = data.slice(0, 10);
        this.chartHeight5 = data.slice(0, 5).length * 50 + 'px'
        this.chartHeight10 = data.slice(0, 10).length * 50 + 'px'
        this.isTop5 = true;
      })
    },
    methods: {

    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
.diy-asset-distribute
  .buttongroup .topbutton
    margin-top:0 !important;
</style>
