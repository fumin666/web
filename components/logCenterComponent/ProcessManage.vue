/*
* @Author: 付敏
* @Description:Q4报表中心流程管理
* @Position:
* @Date: 2019-10-22 09:28:40
* @LastEditors: 付敏
*/
<template>
  <s-col :span="20" style="margin-top: 8px;">
    <s-chart :chart="chart4"></s-chart>
    <!--<div v-nodata="chart4.data.length === 0" :style="'height: ' + boxCardItemHeight + 'px;'"></div>-->
  </s-col>
</template>

<script>
  import $axios from 'sunflower-ajax';
  import { merge } from 'lodash'
  import barChartOption from '@/components/chart/barChartOptionY.js'
    export default {
      data() {
        return {
          chart4: {
            name: 'chart4',
            type: 'rainbowBarChart',
            width: '100%',
            height: '300px',
            data: {
              group: [],
              order: []
            },
            option: {
              title: {
                text: '本周工作量统计',
                x: 'center',
                textStyle: {
                  fontSize: '16'
                }
              },
              grid: {
                bottom: '18%',
                left: '4%',
                right: '10%',
                top: '14%'
              },
              series: [
                {barWidth: 30}
              ]
            }
          },
          boxCardItemHeight: 200
        }
      },
      methods: {
        chartSerialize(data, stopnum) {
          let arr = [];
          for (let i = 0; i < data.length; i++) {
            if (this.strlen(data[i]) >= stopnum) {
              arr.push(data[i].substring(0, stopnum));
            } else {
              arr.push(data[i]);
            }
          }
          return arr;
        },
        strlen(str) {
          if (str == null) return 0;
          if (typeof str !== 'string') {
            str += '';
          }
          return str.replace(/[^\x00-\xff]/g, '01').length
        },
        getTheme(val) {
          var option = {
            series: [{
              label: {
                normal: {
                  show: true
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
            this.chart4.option = merge({}, this.chart4.option, barChartOption.dark, option)
          } else {
            option.series[0].itemStyle.normal.borderColor = '#fff';
            this.chart4.option = merge({}, this.chart4.option, barChartOption.light, option)
          }
        },
        initDivHeight () {
          var boxCardItemHeight = document.getElementById('boxCardItem').offsetHeight;
          this.boxCardItemHeight = boxCardItemHeight
          this.chart4.height = boxCardItemHeight + 'px';
        }
      },
      mounted() {
        let mainTheme = localStorage.getItem('theme');
        this.getTheme(mainTheme)
        this.initDivHeight();
        window.addEventListener('resize', this.initDivHeight);
        $axios.get('/itilWorkflowCenter/orderWorksStat/2').then((res) => { // 平台在线用户和在线运维用户数量统计
          var data = [];
          var order = this.chartSerialize(res.data.order, 2)
          for (let key in order) {
            var param = {
              value: 0,
              name: ''
            };
            param.name = order[key];
            param.value = res.data.group[0].data[key];
            data.push(param)
          }
          this.chart4.data = data
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
