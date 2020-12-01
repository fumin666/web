/*
* @Author: 付敏
* @Description:Q4报表中心基础运维
* @Position:
* @Date: 2019-10-22 09:28:40
* @LastEditors: 付敏
*/
<template>
  <s-col :span="20" style="margin-top: 8px;">
    <s-chart v-if="chartOperation.data.length" :chart="chartOperation"></s-chart>
    <div v-nodata="chartOperation.data.length === 0" v-else :style="'height: ' + boxCardItemHeight + 'px;'"></div>
  </s-col>
</template>

<script>
  import $axios from 'sunflower-ajax';
  import { merge } from 'lodash'
  import barChartOption from '@/components/chart/barChartOption.js'
  export default {
    data() {
      return {
        chartOperation: {
          name: 'chartOperation',
          type: 'rainbowBarChart',
          height: '300px',
          data: [],
          option: {
            grid: {
              bottom: '18%',
              left: '4%',
              right: '10%',
              top: '14%'
            },
            title: {
              text: '资产运维访问量 (TOP30)',
              x: 'center',
              textStyle: {
                fontSize: '16'
              }
            },
            xAxis: [{
              axisLabel: {
                show: true,
                interval: 0,
                rotate: 60
              }
            }]
          }
        },
        boxCardItemHeight: 200
      }
    },
    methods: {
      getTheme(val) {
        var option = {
          series: [{
            label: {
              normal: {
                show: false
              }
            },
            itemStyle: {
              normal: {
                borderColor: '#1E2732'
              }
            }
          }]
        }
        if (val === 'dark') {
          option.series[0].itemStyle.normal.borderColor = '#1E2732';
          this.chartOperation.option = merge({}, this.chartOperation.option, barChartOption.dark)
        } else {
          option.series[0].itemStyle.normal.borderColor = '#fff';
          this.chartOperation.option = merge({}, this.chartOperation.option, barChartOption.light)
        }
      },
      initDivHeight () {
        let boxCardItemHeight = document.getElementById('boxCardItem').offsetHeight;
        this.boxCardItemHeight = boxCardItemHeight
        this.chartOperation.height = boxCardItemHeight + 'px';
      }
    },
    mounted() {
      let mainTheme = localStorage.getItem('theme');
      this.getTheme(mainTheme)
      this.initDivHeight();
      window.addEventListener('resize', this.initDivHeight);
      $axios.get('logCenterIndex/assetAccessNum').then((res) => { // 资产运维访问量
        let data = []
        for (let item in res.data) {
          data.push({name: res.data[item].deviceIp, value: res.data[item].sessionNum})
        }
        this.chartOperation.data = data
      });
    },
    watch: {
      '$store.state.theme': function(val) {
        this.getTheme(val)
      }
    },
    destroyed() {
      window.removeEventListener('resize', this.initDivHeight);
    }
  }
</script>

<style scoped>
</style>
